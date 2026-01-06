import { SpriteManager } from '../SpriteManager';

export class Enemy {
    constructor(path, type = 'basic') {
        this.path = path;
        this.waypointIndex = 0;
        this.x = path[0].x;
        this.y = path[0].y;
        this.type = type;

        // Stats based on type
        switch (type) {
            case 'fast':
                this.speed = 180;
                this.maxHealth = 6;
                this.spriteName = 'enemy_fast';
                this.color = '#2ecc71';
                break;
            case 'tank':
                this.speed = 45; // Slightly slower
                this.maxHealth = 25; // Balanced
                this.spriteName = 'enemy_tank';
                this.color = '#34495e';
                break;
            case 'armored':
                this.speed = 60; // Slightly slower
                this.maxHealth = 35; // Balanced
                this.spriteName = 'enemy_armored';
                this.color = '#bdc3c7';
                break;
            case 'fancy':
                this.speed = 40; // Slow strut
                this.maxHealth = 100; // BOSS Level
                this.spriteName = 'enemy_fancy';
                this.color = '#000';
                break;
            case 'sponge':
                this.speed = 90; // Quite Fast
                this.maxHealth = 50; // Surprisingly tough (absorbent)
                this.spriteName = 'enemy_sponge';
                this.color = '#e67e22';
                break;
            case 'god':
                this.speed = 30; // Very Slow and threatening
                this.maxHealth = 500; // GOD TIER (Nerfed for balance)
                this.spriteName = 'enemy_god'; // New Sprite Sheet
                this.color = '#f1c40f'; // Gold
                break;
            case 'basic':
            default:
                this.speed = 100;
                this.maxHealth = 12;
                this.spriteName = 'enemy_basic';
                this.color = '#e74c3c';
                break;
        }

        this.health = this.maxHealth;
        this.radius = 20; // Slightly bigger hitbox for user comfort
        this.completed = false; // Reached end
        this.dead = false; // Killed
        this.rewarded = false;

        // Animation
        this.animationTimer = 0;
    }

    update(dt) {
        if (this.completed || this.dead) return;

        this.animationTimer += dt;

        // Move towards next waypoint
        const target = this.path[this.waypointIndex + 1];
        if (!target) {
            this.completed = true;
            return;
        }

        const dx = target.x - this.x;
        const dy = target.y - this.y;
        const distance = Math.hypot(dx, dy);

        if (distance < 5) {
            // Reached waypoint
            this.waypointIndex++;
            this.x = target.x;
            this.y = target.y;
        } else {
            // Move
            const moveX = (dx / distance) * this.speed * dt;
            const moveY = (dy / distance) * this.speed * dt;
            this.x += moveX;
            this.y += moveY;
        }
    }

    // Layout Config per sprite type
    static SPRITE_CONFIG = {
        'enemy_basic': { cols: 4, rows: 2, width: 2944, height: 1440 }, // New: 2944x1440 (4x2)
        'enemy_fast': { cols: 5, rows: 2, width: 2691, height: 1058 }, // New: 5 cols
        'enemy_tank': { cols: 4, rows: 2, width: 2944, height: 1440 }, // New: 4x2
        'enemy_armored': { cols: 4, rows: 2, width: 2240, height: 1440 }, // New: 4x2
        'enemy_fancy': { cols: 4, rows: 2, width: 2806, height: 1302 }, // New: 4x2
        'enemy_sponge': { cols: 4, rows: 2, width: 2200, height: 1316 }, // New: 4x2
        'enemy_god': { cols: 4, rows: 2, width: 2816, height: 1536 }, // New: 4x2
    };

    draw(ctx) {
        if (this.dead || this.completed) return;

        const sprite = SpriteManager.get(this.spriteName);

        if (sprite && SpriteManager.loaded) {
            ctx.save();
            // Raise placement by 20px ("buffer from bottom")
            ctx.translate(this.x, this.y - 20);

            // GOD POOP VISUALS
            if (this.type === 'god') {
                const glow = Math.sin(this.animationTimer * 5) * 10;
                ctx.beginPath();
                ctx.arc(0, 0, 40 + glow, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(241, 196, 15, 0.3)';
                ctx.fill();
                ctx.beginPath();
                ctx.ellipse(0, -50, 25, 8, 0, 0, Math.PI * 2);
                ctx.strokeStyle = '#f1c40f'; // Gold
                ctx.lineWidth = 4;
                ctx.stroke();
            }

            // Sprite Sheet Logic
            const config = Enemy.SPRITE_CONFIG[this.spriteName];
            if (config) {
                const frameW = config.width / config.cols;
                const frameH = config.height / config.rows;

                // Animation Cycle
                // Default to all frames defined in config
                let totalFrames = config.cols * config.rows;

                // Special case for Basic Poop: Only use first 8 frames (2 rows) out of 4 rows
                // Tank, Fancy, Armored, Fast use their full configured grid (which is 2 rows)

                if (this.spriteName === 'enemy_basic') {
                    totalFrames = 8;
                }

                // Use animationTimer (seconds) for frame calculation. 
                // 10 FPS = * 10. Previous was Date.now()/100 (100ms = 0.1s => 10 FPS)
                const frameIndex = Math.floor((this.animationTimer * 10) % totalFrames);

                const col = frameIndex % config.cols;
                const row = Math.floor(frameIndex / config.cols);

                const sx = col * frameW;
                const sy = row * frameH;

                // Draw Frame
                // 10% Smaller: 60px -> 54px
                // Center offset: -27
                ctx.drawImage(sprite, sx, sy, frameW, frameH, -27, -27, 54, 54);

            } else {
                // Fallback for single sprites
                const animSpeed = 10;
                const bounce = Math.sin(this.animationTimer * animSpeed);
                const bob = Math.abs(bounce) * 3;
                ctx.drawImage(sprite, -27, -27 - bob, 54, 54);
            }

            ctx.restore();
        } else {
            // Fallback Circle
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.strokeStyle = '#fff';
            ctx.stroke();
        }

        // Health bar
        if (this.health < this.maxHealth) {
            const width = 30;
            const height = 5;
            // Shift up to account for raised sprite (y - 40 -> y - 65)
            const yOffset = -65;

            ctx.fillStyle = 'red';
            ctx.fillRect(this.x - width / 2, this.y + yOffset, width, height);
            ctx.fillStyle = '#2ecc71';
            ctx.fillRect(this.x - width / 2, this.y + yOffset, width * (this.health / this.maxHealth), height);
        }
    }
}
