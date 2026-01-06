import { Tower } from '../Tower';
import { SpriteManager } from '../../SpriteManager';

export class NarutoTower extends Tower {
    constructor(x, y) {
        super(x, y);
        this.name = "NARUTO (OP)";
        this.range = 250; // Huge Range
        this.damage = 25; // Massive Damage (Nerfed)
        this.fireRate = 8.0; // Machine gun speed
        this.color = '#e67e22'; // Orange
        this.cost = 10; // Cheat Cost

        // Animation State
        this.frame = 0;
        this.totalFrames = 10; // 5x2
        this.frameTimer = 0;
        this.frameInterval = 0.1;
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
            return { ...event, sprite: 'rasengan' }; // Special Projectile
        }
        return null;
    }

    draw(ctx) {
        // Draw Blue Chakra Aura (Pulse)
        const pulse = Math.sin(Date.now() / 200) * 5;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 45 + pulse, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(52, 152, 219, 0.4)'; // Blue Chakra
        ctx.fill();

        // Draw Base
        ctx.beginPath();
        ctx.arc(this.x, this.y, 30, 0, Math.PI * 2);
        ctx.fillStyle = this.getLevelColor();
        ctx.fill();
        ctx.strokeStyle = '#3498db'; // Blue Outline
        ctx.lineWidth = 3;
        ctx.stroke();

        // Sprite Sheet Animation
        const sprite = SpriteManager.get('naruto');
        if (sprite && SpriteManager.loaded) {
            // Config: 5 cols, 2 rows (10 frames total)
            const cols = 5;
            const rows = 2;
            const width = 2200;
            const height = 1200;

            const frameW = width / cols;
            const frameH = height / rows;

            const col = this.frame % cols;
            const row = Math.floor(this.frame / cols);

            const sx = col * frameW;
            const sy = row * frameH;

            // Draw Frame (Size 90x90, centered)
            // Adjust offset to center
            ctx.drawImage(sprite, sx, sy, frameW, frameH, this.x - 45, this.y - 45, 90, 90);
        } else {
            // Fallback Procedural
            // Body (Orange Jumpsuit)
            ctx.fillStyle = '#e67e22';
            ctx.fillRect(-20, -20, 40, 40);

            // Head (Skin)
            ctx.fillStyle = '#ffcc99';
            ctx.beginPath();
            ctx.arc(0, -25, 15, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}
