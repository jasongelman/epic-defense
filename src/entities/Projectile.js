import { SpriteManager } from '../SpriteManager';

export class Projectile {
    constructor(x, y, target, damage = 1, spriteName = null) {
        this.x = x;
        this.y = y;
        this.target = target;
        this.damage = damage;
        this.speed = 400; // Constant speed for now
        this.spriteName = spriteName;

        this.radius = 4;
        this.color = '#fff';

        this.active = true;
    }

    update(dt) {
        if (!this.active) return;

        if (this.target.dead || this.target.completed) {
            this.active = false;
            return;
        }

        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const dist = Math.hypot(dx, dy);

        if (dist < this.target.radius + this.radius) { // Hit
            this.target.health -= this.damage;
            if (this.target.health <= 0) {
                this.target.dead = true;
            }
            this.active = false;
        } else {
            // Move
            const moveX = (dx / dist) * this.speed * dt;
            const moveY = (dy / dist) * this.speed * dt;
            this.x += moveX;
            this.y += moveY;
        }
    }

    draw(ctx) {
        if (!this.active) return;

        if (this.spriteName === 'rasengan') {
            // Procedural Rasengan Effect
            ctx.save();
            ctx.translate(this.x, this.y);
            // Spin
            ctx.rotate(Date.now() / 100);

            // Core
            ctx.beginPath();
            ctx.arc(0, 0, 10, 0, Math.PI * 2);
            ctx.fillStyle = '#fff';
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#3498db';
            ctx.fill();

            // Swirls
            ctx.strokeStyle = '#3498db';
            ctx.lineWidth = 2;
            for (let i = 0; i < 3; i++) {
                ctx.rotate(Math.PI * 2 / 3);
                ctx.beginPath();
                ctx.arc(0, 5, 8, 0, Math.PI);
                ctx.stroke();
            }
            ctx.restore();
            return;
        }

        if (this.spriteName) {
            const sprite = SpriteManager.get(this.spriteName);
            if (sprite && SpriteManager.loaded) {
                ctx.save();
                ctx.translate(this.x, this.y);
                // Rotate projectile to face target?
                const angle = Math.atan2(this.target.y - this.y, this.target.x - this.x);
                ctx.rotate(angle);
                ctx.drawImage(sprite, -12, -12, 24, 24); // Sized 24x24
                ctx.restore();
                return;
            }
        }

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}
