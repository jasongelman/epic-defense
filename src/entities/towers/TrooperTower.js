import { Tower } from '../Tower';
import { SpriteManager } from '../../SpriteManager';

export class TrooperTower extends Tower {
    constructor(x, y) {
        super(x, y);
        this.name = "Galactic Trooper";
        this.range = 150;
        this.damage = 1;
        this.fireRate = 2.0;
        this.color = '#fff';
        this.cost = 120;

        // Animation
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
            return { ...event, sprite: 'blaster' };
        }
        return null;
    }

    draw(ctx) {
        const sprite = SpriteManager.get('trooper');
        if (sprite && SpriteManager.loaded) {
            // Frame Calculation
            const cols = 5;
            const rows = 2;
            const frameWidth = sprite.width / cols;
            const frameHeight = sprite.height / rows;

            const col = this.frame % cols;
            const row = Math.floor(this.frame / cols);

            // Draw Base
            ctx.beginPath();
            ctx.arc(this.x, this.y, 30, 0, Math.PI * 2);
            ctx.fillStyle = this.getLevelColor();
            ctx.fill();
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Draw Sprite
            ctx.drawImage(
                sprite,
                col * frameWidth, row * frameHeight, frameWidth, frameHeight,
                this.x - 45, this.y - 45, 90, 90
            );
        } else {
            // Fallback
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
            ctx.fill();

            // Visor
            ctx.fillStyle = '#000';
            ctx.fillRect(this.x - 5, this.y - 2, 10, 2);
        }
    }
}
