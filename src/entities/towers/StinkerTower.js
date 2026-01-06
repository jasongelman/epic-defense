import { Tower } from '../Tower';
import { SpriteManager } from '../../SpriteManager';

export class StinkerTower extends Tower {
    constructor(x, y) {
        super(x, y);
        this.name = "The Stinker";
        this.range = 80;
        this.damage = 0.5;
        this.fireRate = 1.0;
        this.color = '#8e44ad';
        this.cost = 175;

        // Animation State
        this.frame = 0;
        this.totalFrames = 9; // 5 top, 4 bottom
        this.frameTimer = 0;
        this.frameInterval = 0.1; // 100ms per frame
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
            return { ...event, sprite: 'poop' };
        }
        return null;
    }

    draw(ctx) {
        const sprite = SpriteManager.get('stinker');
        if (sprite && SpriteManager.loaded) {
            // Calculate Frame
            let sx, sy;
            const frameWidth = sprite.width / 5; // 5 columns
            const frameHeight = sprite.height / 2; // 2 rows

            if (this.frame < 5) {
                // Top Row (0-4)
                sx = this.frame * frameWidth;
                sy = 0;
            } else {
                // Bottom Row (5-8)
                sx = (this.frame - 5) * frameWidth;
                sy = frameHeight;
            }

            // Draw Base
            ctx.beginPath();
            ctx.arc(this.x, this.y, 30, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fill();
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Draw Sprite
            ctx.drawImage(
                sprite,
                sx, sy, frameWidth, frameHeight, // Source
                this.x - 45, this.y - 45, 90, 90 // Destination
            );
        } else {
            // Fallback
            ctx.fillStyle = '#6d4c41'; // Brown
            ctx.beginPath();
            ctx.arc(this.x, this.y, 10, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}
