import { Tower } from '../Tower';
import { SpriteManager } from '../../SpriteManager';

export class HeroTower extends Tower {
    constructor(x, y) {
        super(x, y);
        this.name = "Hyrule Hero";
        this.range = 100; // Melee/Short Range
        this.damage = 20; // High Damage
        this.fireRate = 1.5;
        this.color = '#2ecc71'; // Green
        this.cost = 300;

        // Animation State
        this.frame = 0;
        this.totalFrames = 28; // 7x4
        this.frameTimer = 0;
        this.frameInterval = 0.05;
    }

    update(dt, enemies) {
        const event = super.update(dt, enemies);

        // Animate only if active
        if (this.target) {
            this.frameTimer += dt;
            if (this.frameTimer >= this.frameInterval) {
                this.frameTimer = 0;
                this.frame = (this.frame + 1) % this.totalFrames;
            }
        } else {
            this.frame = 0; // Reset to idle
        }

        if (event && event.type === 'shoot') {
            return { ...event, sprite: 'slash' };
        }
        return null;
    }

    draw(ctx) {
        const sprite = SpriteManager.get('hero');
        if (sprite && SpriteManager.loaded) {
            // Draw Base
            ctx.beginPath();
            ctx.arc(this.x, this.y, 30, 0, Math.PI * 2);
            ctx.fillStyle = this.getLevelColor();
            ctx.fill();
            ctx.strokeStyle = '#f1c40f'; // Gold Trigger
            ctx.lineWidth = 2;
            ctx.stroke();

            // Config: 7 cols, 4 rows
            const cols = 7;
            const rows = 4;

            const width = sprite.naturalWidth || sprite.width;
            const height = sprite.naturalHeight || sprite.height;

            if (width === 0 || height === 0) return;

            const frameW = width / cols;
            const frameH = height / rows;

            const col = this.frame % cols;
            const row = Math.floor(this.frame / cols);

            const sx = col * frameW;
            const sy = row * frameH;

            // Draw Frame (Size 100x100, centered - slightly larger)
            ctx.drawImage(sprite, sx, sy, frameW, frameH, this.x - 50, this.y - 50, 100, 100);
        } else {
            // Fallback
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x - 15, this.y - 15, 30, 30);

            // Hat
            ctx.fillStyle = '#2ecc71';
            ctx.beginPath();
            ctx.moveTo(this.x - 15, this.y - 15);
            ctx.lineTo(this.x + 15, this.y - 15);
            ctx.lineTo(this.x, this.y - 40);
            ctx.fill();
        }
    }
}
