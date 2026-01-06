import { Tower } from '../Tower';
import { SpriteManager } from '../../SpriteManager';

export class NinjaTower extends Tower {
    constructor(x, y) {
        super(x, y);
        this.name = "Hidden Leaf Ninja";
        this.range = 140; // Buffed Range
        this.damage = 2; // Buffed Damage
        this.fireRate = 3.0; // Fast fire rate
        this.color = '#e67e22'; // Orange (Naruto)
        this.cost = 150;

        // Animation State
        this.frame = 0;
        this.totalFrames = 8; // 4x2
        this.frameTimer = 0;
        this.frameInterval = 0.15;
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
            return { ...event, sprite: 'shuriken' };
        }
        return null;
    }

    draw(ctx) {
        const sprite = SpriteManager.get('ninja');
        if (sprite && SpriteManager.loaded) {
            // Draw Base
            ctx.beginPath();
            ctx.arc(this.x, this.y, 30, 0, Math.PI * 2);
            ctx.fillStyle = this.getLevelColor();
            ctx.fill();
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Sprite Sheet Animation Logic
            // Config: 4 cols, 2 rows (8 frames total) - Ninja Tower is 4x2
            const cols = 4;
            const rows = 2;

            const width = sprite.naturalWidth || 1792;
            const height = sprite.naturalHeight || 896;

            const frameW = width / cols;
            const frameH = height / rows;

            const col = this.frame % cols;
            const row = Math.floor(this.frame / cols);

            const sx = col * frameW;
            const sy = row * frameH;

            // Draw Frame (Size 90x90, centered)
            ctx.drawImage(sprite, sx, sy, frameW, frameH, this.x - 45, this.y - 45, 90, 90);

        } else {
            // Fallback
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);

            // Headband indicator
            ctx.fillStyle = '#95a5a6';
            ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, 5);
        }
    }
}
