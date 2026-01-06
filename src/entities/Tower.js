export class Tower {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.range = 100;
        this.damage = 1;
        this.fireRate = 1.0; // shots per second
        this.cooldown = 0;

        this.color = '#3498db'; // Blue
        this.size = 20;

        this.target = null;

        // Upgrade State
        this.level = 1;
        this.maxLevel = 5;
        this.baseCost = 100; // Overridden by subclass or factory
    }

    get upgradeCost() {
        return Math.floor(this.baseCost * this.level * 0.75);
    }

    getLevelColor() {
        switch (this.level) {
            case 1: return 'rgba(0, 0, 0, 0.5)'; // Default Dark
            case 2: return 'rgba(46, 204, 113, 0.6)'; // Green (Uncommon)
            case 3: return 'rgba(52, 152, 219, 0.6)'; // Blue (Rare)
            case 4: return 'rgba(155, 89, 182, 0.6)'; // Purple (Epic)
            case 5: return 'rgba(241, 196, 15, 0.6)'; // Gold (Legendary)
            default: return 'rgba(231, 76, 60, 0.6)'; // Red (Error/Overload)
        }
    }

    upgrade() {
        if (this.level >= this.maxLevel) return false;

        this.level++;
        this.damage *= 1.5; // +50% Damage
        this.range *= 1.1;  // +10% Range
        this.fireRate *= 1.1; // +10% Speed

        // Full heal cooldown on upgrade
        this.cooldown = 0;
        return true;
    }

    update(dt, enemies) {
        if (this.cooldown > 0) {
            this.cooldown -= dt;
        }

        // Find Target (Closest)
        let closestDist = Infinity;
        this.target = null;

        for (const enemy of enemies) {
            if (enemy.dead || enemy.completed) continue;

            const dx = enemy.x - this.x;
            const dy = enemy.y - this.y;
            const dist = Math.hypot(dx, dy);

            if (dist <= this.range && dist < closestDist) {
                closestDist = dist;
                this.target = enemy;
            }
        }

        // Fire
        if (this.target && this.cooldown <= 0) {
            this.fire();
            this.cooldown = 1.0 / this.fireRate;
            return { type: 'shoot', source: this, target: this.target };
        }

        return null;
    }

    fire() {
        // Override in subclasses or handle in GameEngine for projectile creation
        // For now, we'll return a shoot event
    }

    draw(ctx) {
        // Draw Base
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);

        // Draw Range (if selected, or debug)
        // ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        // ctx.beginPath();
        // ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
        // ctx.stroke();

        // Draw Turret/Barrel pointing at target
        ctx.save();
        ctx.translate(this.x, this.y);
        if (this.target) {
            const angle = Math.atan2(this.target.y - this.y, this.target.x - this.x);
            ctx.rotate(angle);
        }
        ctx.fillStyle = '#000';
        ctx.fillRect(0, -5, this.size, 10);
        ctx.restore();
    }
}
