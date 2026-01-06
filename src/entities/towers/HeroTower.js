import { Tower } from '../Tower';
import { SpriteManager } from '../../SpriteManager';

export class HeroTower extends Tower {
    constructor(x, y) {
        super(x, y);
        this.name = "Hyrule Hero";
        this.range = 80; // Buffed Range
        this.damage = 5; // Buffed Damage
        this.fireRate = 1.5;
        this.color = '#27ae60'; // Green
        this.cost = 200;
    }

    update(dt, enemies) {
        const event = super.update(dt, enemies);
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
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fill();
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.drawImage(sprite, this.x - 45, this.y - 45, 90, 90);
        } else {
            // Fallback
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);

            // Hat indicator
            ctx.beginPath();
            ctx.moveTo(this.x - this.size / 2, this.y - this.size / 2);
            ctx.lineTo(this.x + this.size / 2, this.y - this.size / 2);
            ctx.lineTo(this.x, this.y - this.size);
            ctx.fill();
        }
    }
}
