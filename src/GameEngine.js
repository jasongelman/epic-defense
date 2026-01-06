import { Enemy } from './entities/Enemy';
import { Projectile } from './entities/Projectile';
import { NinjaTower } from './entities/towers/NinjaTower';
import { HeroTower } from './entities/towers/HeroTower';
import { TrooperTower } from './entities/towers/TrooperTower';
import { StinkerTower } from './entities/towers/StinkerTower';
import { NarutoTower } from './entities/towers/NarutoTower';
import { PATH_COORDINATES, GAME_WIDTH, GAME_HEIGHT } from './constants';

import { SpriteManager } from './SpriteManager';
import { SoundManager } from './SoundManager';

export class GameEngine {
    constructor(canvas, mapConfig) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = GAME_WIDTH;
        this.height = GAME_HEIGHT;
        this.mapConfig = mapConfig; // Store map config

        // Load Sprites
        SpriteManager.loadAll();

        this.loopId = null;
        this.lastTime = 0;

        // Game Session State
        this.money = 650;
        this.lives = 100;
        this.round = 1;
        this.paused = true;

        // Stats
        this.killStats = { basic: 0, fast: 0, tank: 0, armored: 0, fancy: 0, sponge: 0 };

        // Persistent State
        this.msg = "Click PLAY";
        this.loadProgress();

        // Build State
        this.selectedTower = 'ninja';

        // Wave Logic
        this.spawnTimer = 0;
        this.spawnInterval = 1.0;
        this.enemiesToSpawn = 10; // Initial wave size
        this.waveInProgress = true;
        this.waveDelayTimer = 0;
        this.waveDelay = 5.0; // Seconds between waves

        // Entities
        this.enemies = [];
        this.towers = [];
        this.projectiles = [];
        this.effects = []; // Visual effects like splats

        // Decorations
        this.decorations = [];
        this.generateDecorations();

        // Speed Control
        this.speedMultiplier = 1;

        // Interaction State
        this.hoveredTower = null;

        this.loop = this.loop.bind(this);

        // Callback for React UI
        this.onSelectionChange = null;
        this.selectedPlacedTower = null;
    }

    start() {
        if (!this.loopId) {
            this.lastTime = 0;
            this.loopId = requestAnimationFrame(this.loop);
        }
    }

    stop() {
        if (this.loopId) {
            cancelAnimationFrame(this.loopId);
            this.loopId = null;
        }
    }

    // Moved loop() definition to replace file content above

    // ... Methods ...

    loop(timestamp) {
        if (!this.lastTime) this.lastTime = timestamp;
        const dt = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;

        try {
            if (!this.paused) {
                // Fixed updates for consistency
                // Max dt to prevent spiraling
                const safeDt = Math.min(dt, 0.1) * this.speedMultiplier;
                this.update(safeDt);
            }

            this.draw();
            this.loopId = requestAnimationFrame(this.loop);
        } catch (err) {
            console.error('Game Loop Crash:', err);
            this.drawCrashScreen(err);
        }
    }

    drawCrashScreen(err) {
        // Stop loop
        this.stop();

        // Draw Error
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.ctx.fillStyle = '#e74c3c';
        this.ctx.font = 'bold 24px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('GAME CRASHED', this.width / 2, this.height / 2 - 20);

        this.ctx.font = '16px monospace';
        this.ctx.fillStyle = '#fff';
        this.ctx.fillText(err.message, this.width / 2, this.height / 2 + 20);

        // Reset alignment
        this.ctx.textAlign = 'start';
    }

    generateDecorations() {
        this.decorations = [];
        const decorationTypes = this.mapConfig.decorations || [];

        if (decorationTypes.length === 0) return; // No decorations for this map

        for (let i = 0; i < 40; i++) { // Random scattered props
            const x = Math.random() * this.width;
            const y = Math.random() * this.height;
            const size = 30 + Math.random() * 40;

            // Check collision with path
            let safe = true;
            const path = this.mapConfig.path;

            for (let j = 0; j < path.length - 1; j++) {
                const p1 = path[j];
                const p2 = path[j + 1];
                const dist = this.distToSegment(x, y, p1.x, p1.y, p2.x, p2.y);
                if (dist < 60) {
                    safe = false;
                    break;
                }
            }

            if (safe) {
                const type = decorationTypes[Math.floor(Math.random() * decorationTypes.length)];
                this.decorations.push({ type, x, y, w: size, h: size });
            }
        }
    }

    spawnEnemy() {
        let type = 'basic';
        if (this.round % 10 === 0) {
            type = 'god';
        } else if (this.round % 5 === 0) {
            const rand = Math.random();
            if (rand < 0.4) type = 'tank';
            else if (rand < 0.8) type = 'armored';
            else type = 'fancy';
        } else if (this.round > 3) {
            const rand = Math.random();
            if (this.round > 6 && rand < 0.1) type = 'armored';
            else if (this.round > 8 && rand < 0.2) type = 'sponge';
            else if (rand < 0.3) type = 'tank';
            else if (rand < 0.6) type = 'fast';
        } else if (this.round > 1) {
            if (Math.random() < 0.4) type = 'fast';
        }

        // Use Map Path
        this.enemies.push(new Enemy(this.mapConfig.path, type));
    }

    addMoney(amount) {
        this.money += amount;
        this.lifetimeStats.totalMoneyEarned += amount;
        this.saveProgress();
    }

    toggleSpeed() {
        this.speedMultiplier = this.speedMultiplier === 1 ? 3 : 1;
        return this.speedMultiplier;
    }

    togglePause() {
        this.paused = !this.paused;
        if (this.paused) {
            this.msg = "PAUSED";
        } else {
            this.msg = "";
        }
        return this.paused;
    }

    loadProgress() {
        const data = localStorage.getItem('epicDefenseSave');
        const defaultStats = {
            totalKills: 0,
            totalMoneyEarned: 0,
            killsByType: { basic: 0, fast: 0, tank: 0, armored: 0, fancy: 0, sponge: 0, god: 0 }
        };

        if (data) {
            const parsed = JSON.parse(data);
            this.playerLevel = parsed.level || 1;
            this.playerXP = parsed.xp || 0;
            this.lifetimeStats = { ...defaultStats, ...(parsed.lifetimeStats || {}) };

            // Deep merge for killsByType to ensure new enemy types are covered
            if (parsed.lifetimeStats && parsed.lifetimeStats.killsByType) {
                this.lifetimeStats.killsByType = { ...defaultStats.killsByType, ...parsed.lifetimeStats.killsByType };
            }

        } else {
            this.playerLevel = 1;
            this.playerXP = 0;
            this.lifetimeStats = defaultStats;
        }
    }

    saveProgress() {
        const data = {
            level: this.playerLevel,
            xp: this.playerXP,
            lifetimeStats: this.lifetimeStats
        };
        localStorage.setItem('epicDefenseSave', JSON.stringify(data));
    }


    gainXP(amount) {
        this.playerXP += amount;
        const xpNeeded = this.playerLevel * 100;
        if (this.playerXP >= xpNeeded) {
            this.playerXP -= xpNeeded;
            this.playerLevel++;
            this.msg = "LEVEL UP!";
            SoundManager.play('levelup');
            setTimeout(() => this.msg = "", 2000);
            this.saveProgress();
        } else {
            this.saveProgress();
        }
    }

    start() {
        this.lastTime = performance.now();
        this.loopId = requestAnimationFrame(this.loop);
    }

    stop() {
        if (this.loopId) {
            cancelAnimationFrame(this.loopId);
            this.loopId = null;
        }
    }

    setTowerType(type) {
        this.selectedTower = type;
    }

    getTowerUnlockLevel(type) {
        switch (type) {
            case 'ninja': return 1;
            case 'hero': return 2;
            case 'trooper': return 3;
            case 'stinker': return 5;
            case 'naruto': return 1; // Always unlocked for cheat
            default: return 1;
        }
    }

    handleMouseMove(x, y) {
        // Check if hovering over a tower
        this.hoveredTower = null;
        for (const tower of this.towers) {
            const dist = Math.hypot(tower.x - x, tower.y - y);
            if (dist < 45) { // 90px size / 2
                this.hoveredTower = tower;
                break;
            }
        }
    }

    handleInput(x, y) {
        console.log(`Input at ${x.toFixed(1)}, ${y.toFixed(1)}`); // DEBUG

        // 1. Check if clicking an EXISTING tower
        let clickedTower = null;
        for (const t of this.towers) {
            const dist = Math.hypot(t.x - x, t.y - y);
            console.log(`Checking tower at ${t.x}, ${t.y} | Dist: ${dist.toFixed(1)}`); // DEBUG
            if (dist < 50) { // Increased from 40 for easier clicking
                clickedTower = t;
                break;
            }
        }

        if (clickedTower) {
            console.log("Selected Tower:", clickedTower.name); // DEBUG
            this.selectedPlacedTower = clickedTower;
            if (this.onSelectionChange) {
                console.log("Triggering onSelectionChange"); // DEBUG
                this.onSelectionChange(this.selectedPlacedTower);
            } else {
                console.log("onSelectionChange is NULL"); // DEBUG
            }
            return; // Select and done
        }

        // If clicking empty space and a tower was selected, Deselect
        if (this.selectedPlacedTower) {
            this.selectedPlacedTower = null;
            if (this.onSelectionChange) this.onSelectionChange(null);
            // Allow immediate build after deselect
        }

        // 2. Check unlock
        if (this.playerLevel < this.getTowerUnlockLevel(this.selectedTower)) {
            this.msg = "LOCKED!";
            setTimeout(() => this.msg = "", 1000);
            return;
        }

        let TowerClass;
        let cost = 0;

        switch (this.selectedTower) {
            case 'ninja': TowerClass = NinjaTower; cost = 150; break;
            case 'hero': TowerClass = HeroTower; cost = 300; break;
            case 'trooper': TowerClass = TrooperTower; cost = 120; break;
            case 'stinker': TowerClass = StinkerTower; cost = 100; break;
            case 'naruto': TowerClass = NarutoTower; cost = 1000; break;
            default: return;
        }

        if (this.money >= cost) {
            if (this.isValidPlacement(x, y)) {
                const newTower = new TowerClass(x, y);
                newTower.baseCost = cost;
                this.towers.push(newTower);
                this.money -= cost;
                SoundManager.play('build');
            }
        }
    }

    upgradeSelectedTower() {
        if (!this.selectedPlacedTower) return false;

        const tower = this.selectedPlacedTower;
        const cost = tower.upgradeCost;

        if (this.money >= cost && tower.level < tower.maxLevel) {
            this.money -= cost;
            tower.upgrade();
            SoundManager.play('build');
            return true;
        }
        return false;
    }

    sellSelectedTower() {
        if (!this.selectedPlacedTower) return;
        const index = this.towers.indexOf(this.selectedPlacedTower);
        if (index > -1) {
            this.money += Math.floor(this.selectedPlacedTower.baseCost * 0.5);
            this.towers.splice(index, 1);
            this.selectedPlacedTower = null;
            if (this.onSelectionChange) this.onSelectionChange(null);
            SoundManager.play('build');
        }
    }

    isValidPlacement(x, y) {
        if (x < 0 || x > this.width || y < 0 || y > this.height) return false;

        // Check collision with path
        const path = this.mapConfig.path;
        for (let i = 0; i < path.length - 1; i++) {
            const p1 = path[i];
            const p2 = path[i + 1];
            const dist = this.distToSegment(x, y, p1.x, p1.y, p2.x, p2.y);
            if (dist < 45) return false; // Adjusted for 90px towers
        }

        // Check collision with other towers
        for (const t of this.towers) {
            const d = Math.hypot(t.x - x, t.y - y);
            if (d < 40) return false;
        }

        return true;
    }

    distToSegment(pX, pY, x1, y1, x2, y2) {
        const A = pX - x1;
        const B = pY - y1;
        const C = x2 - x1;
        const D = y2 - y1;

        const dot = A * C + B * D;
        const len_sq = C * C + D * D;
        let param = -1;
        if (len_sq !== 0) param = dot / len_sq;

        let xx, yy;

        if (param < 0) {
            xx = x1;
            yy = y1;
        }
        else if (param > 1) {
            xx = x2;
            yy = y2;
        }
        else {
            xx = x1 + param * C;
            yy = y1 + param * D;
        }

        const dx = pX - xx;
        const dy = pY - yy;
        return Math.hypot(dx, dy);
    }



    loop(timestamp) {
        let deltaTime = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;

        // Apply Speed Multiplier (Cap at 0.1 to prevent crazy jumps on resume)
        if (deltaTime > 0.1) deltaTime = 0.1;
        deltaTime *= this.speedMultiplier;

        this.update(deltaTime);
        this.draw();

        this.loopId = requestAnimationFrame(this.loop);
    }

    update(dt) {
        if (this.paused) return;

        // Wave Management
        if (this.waveInProgress) {
            // Spawning Logic
            if (this.enemiesToSpawn > 0) {
                this.spawnTimer += dt;
                if (this.spawnTimer >= this.spawnInterval) {
                    this.spawnTimer = 0;
                    this.spawnEnemy();
                    this.enemiesToSpawn--;
                }
            } else if (this.enemies.length === 0) {
                // Wave Complete
                this.waveInProgress = false;
                this.waveDelayTimer = this.waveDelay;
                this.msg = "WAVE COMPLETE!";
                this.gainXP(50); // Wave Clear Bonus
            }
        } else {
            // Inter-Wave Delay
            this.waveDelayTimer -= dt;
            if (this.waveDelayTimer <= 0) {
                this.startNextWave();
            } else {
                this.msg = `Next Wave: ${Math.ceil(this.waveDelayTimer)}`;
            }
        }

        // Update Enemies
        this.enemies.forEach(enemy => enemy.update(dt));

        // Update Towers
        this.towers.forEach(tower => {
            const event = tower.update(dt, this.enemies);
            if (event && event.type === 'shoot') {
                this.projectiles.push(new Projectile(tower.x, tower.y, event.target, tower.damage, event.sprite));
                SoundManager.play('shoot');
            }
        });

        // Update Projectiles
        this.projectiles.forEach(p => {
            p.update(dt);
            if (!p.active && p.target && p.target.dead && !p.target.rewarded) {
                p.target.rewarded = true;
                this.addMoney(5);
                this.gainXP(1);

                // Track Kills for stats
                this.lifetimeStats.totalKills++;
                this.lifetimeStats.killsByType[p.target.type] = (this.lifetimeStats.killsByType[p.target.type] || 0) + 1;
                this.saveProgress();

                SoundManager.play('kill');
            }
        });
        this.projectiles = this.projectiles.filter(p => p.active);

        // Cleanup Enemies
        this.enemies = this.enemies.filter(e => {
            if (e.completed) {
                this.lives -= 1;
                SoundManager.play('hit');
                return false;
            }
            if (e.dead) {
                if (!e.rewarded) {
                    this.addMoney(5);
                    this.gainXP(1);

                    // Track Kills for stats
                    this.lifetimeStats.totalKills++;
                    this.lifetimeStats.killsByType[e.type] = (this.lifetimeStats.killsByType[e.type] || 0) + 1;
                    this.saveProgress();

                    e.rewarded = true;
                    SoundManager.play('splat'); // Changed from 'kill' to 'splat'

                    // Update Kill Stats
                    if (this.killStats[e.type] !== undefined) {
                        this.killStats[e.type]++;
                    } else {
                        console.warn("Unknown enemy type killed:", e.type);
                    }

                    // Add Visual Splat
                    this.effects.push({
                        type: 'splat',
                        x: e.x,
                        y: e.y,
                        timer: 0.5, // 0.5 seconds duration
                        maxTime: 0.5
                    });
                }
                return false;
            }
            return true;
        });

        // Update Effects
        this.effects.forEach(eff => eff.timer -= dt);
        this.effects = this.effects.filter(eff => eff.timer > 0);
    }

    draw() {
        const { theme, path } = this.mapConfig;

        // Draw Background
        let drawnBg = false;
        if (theme.bgImage && SpriteManager.loaded) {
            const bgSprite = SpriteManager.get(theme.bgImage);
            if (bgSprite) {
                this.ctx.drawImage(bgSprite, 0, 0, this.width, this.height);
                drawnBg = true;
            }
        }

        if (!drawnBg) {
            if (theme.bgTexture && SpriteManager.loaded) {
                const bgSprite = SpriteManager.get(theme.bgTexture);
                if (bgSprite) {
                    const pattern = this.ctx.createPattern(bgSprite, 'repeat');
                    this.ctx.fillStyle = pattern;
                } else {
                    this.ctx.fillStyle = theme.background;
                }
            } else {
                this.ctx.fillStyle = theme.background;
            }
            this.ctx.fillRect(0, 0, this.width, this.height);
        }

        // Draw Environment Decoration (Under Path - mostly floor details)
        if (!drawnBg) {
            this.ctx.save();
            if (SpriteManager.loaded) {
                this.decorations.forEach(d => {
                    const sprite = SpriteManager.get(d.type);
                    if (sprite) {
                        // Simple depth sorting by Y
                        this.ctx.drawImage(sprite, d.x, d.y, d.w, d.h);
                    }
                });
            }
            this.ctx.restore();
        }

        // Draw Path (Only if no full map image)
        if (!drawnBg) {
            this.ctx.lineCap = 'round';
            this.ctx.lineJoin = 'round';
            this.ctx.beginPath();
            if (path.length > 0) {
                this.ctx.moveTo(path[0].x, path[0].y);
                for (let i = 1; i < path.length; i++) {
                    this.ctx.lineTo(path[i].x, path[i].y);
                }
            }

            // Path Border / Accent
            this.ctx.lineWidth = 55;
            this.ctx.strokeStyle = theme.accent;
            this.ctx.stroke();

            // Path Inner Texture
            this.ctx.lineWidth = 50;
            if (theme.pathTexture && SpriteManager.loaded) {
                const pathSprite = SpriteManager.get(theme.pathTexture);
                if (pathSprite) {
                    const pattern = this.ctx.createPattern(pathSprite, 'repeat');
                    this.ctx.strokeStyle = pattern;
                } else {
                    this.ctx.strokeStyle = theme.path;
                }
            } else {
                this.ctx.strokeStyle = theme.path;
            }
            this.ctx.stroke();

            // Reset stroke style
            this.ctx.strokeStyle = '#fff';
        }

        // Towers
        this.towers.forEach(tower => tower.draw(this.ctx));

        // Enemies
        this.enemies.forEach(enemy => enemy.draw(this.ctx));

        // Projectiles
        this.projectiles.forEach(p => p.draw(this.ctx));

        // Effects
        this.effects.forEach(eff => {
            if (eff.type === 'splat') {
                const sprite = SpriteManager.get('splat');
                if (sprite && SpriteManager.loaded) {
                    this.ctx.globalAlpha = eff.timer / eff.maxTime;
                    this.ctx.drawImage(sprite, eff.x - 20, eff.y - 20, 40, 40);
                    this.ctx.globalAlpha = 1.0;
                }
            }
        });

        // UI Info - Top Bar
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, this.width, 50);

        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 20px Arial';
        this.ctx.fillText(`Lives: ${this.lives}`, 20, 32);
        this.ctx.fillText(`Money: ${this.money}`, 150, 32); // Removed $ sign if redundant or add it back
        this.ctx.fillText(`Wave: ${this.round}`, 300, 32);

        // Player Stats - Bottom Left
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(10, 550, 200, 40);
        this.ctx.fillStyle = theme.textColor || '#f1c40f';
        this.ctx.font = 'bold 16px Arial';
        const xpNeeded = this.playerLevel * 100;
        this.ctx.fillText(`Lvl: ${this.playerLevel}  XP: ${this.playerXP}/${xpNeeded}`, 20, 575);

        // Kill Stats HUD
        if (!this.waveInProgress) {
            const startX = 640;
            let startY = 40;
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            this.ctx.fillRect(startX - 10, startY - 25, 160, 200);

            this.ctx.fillStyle = '#fff';
            this.ctx.font = '16px monospace';
            this.ctx.fillText(`KILLS:`, startX, startY);
            startY += 25;
            this.ctx.fillText(`💩 Basic:   ${this.killStats.basic}`, startX, startY);
            startY += 25;
            this.ctx.fillText(`🤢 Fast:    ${this.killStats.fast}`, startX, startY);
            startY += 25;
            this.ctx.fillText(`🪨 Tank:    ${this.killStats.tank}`, startX, startY);
            startY += 25;
            this.ctx.fillText(`🛡️ Armored: ${this.killStats.armored}`, startX, startY);
            startY += 25;
            this.ctx.fillText(`🧽 Sponge:  ${this.killStats.sponge}`, startX, startY);
            startY += 25;
            this.ctx.fillText(`🎩 Fancy:   ${this.killStats.fancy}`, startX, startY);
        }

        // Message
        if (this.msg) {
            this.ctx.fillStyle = '#e74c3c';
            this.ctx.font = 'bold 40px Arial';
            this.ctx.fillText(this.msg, 320, 300);
        }

        // Draw Hovered Tower Range
        if (this.hoveredTower) {
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(this.hoveredTower.x, this.hoveredTower.y, this.hoveredTower.range, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            this.ctx.fill();
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            this.ctx.setLineDash([5, 5]);
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            this.ctx.restore();
        }
    }



    startNextWave() {
        this.round++;
        this.waveInProgress = true;
        this.msg = "WAVE " + this.round;
        setTimeout(() => this.msg = "", 2000);

        // Scale Difficulty
        this.enemiesToSpawn = 10 + (this.round * 2); // More enemies each round
        this.spawnInterval = Math.max(0.3, 1.0 - (this.round * 0.05)); // Spawn faster
    }
}
