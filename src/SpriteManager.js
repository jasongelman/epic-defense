export class SpriteManager {
    static images = {};
    static loaded = false;

    static ASSETS = {
        'ninja': 'assets/Ninja Tower sprite sheet.png',
        'naruto': 'assets/Naruto Tower sprite sheet.png',
        'hero': 'assets/hero.png',
        'trooper': 'assets/Trooper Tower sprite sheet.png',
        'stinker': 'assets/Stinker Tower sprite sheet.png',
        'enemy_basic': 'assets/Basic Poop sprite sheet.png',
        'enemy_fast': 'assets/Fast Poop sprite sheet.png',
        'enemy_tank': 'assets/Tank Poop sprite sheet.png',
        'enemy_armored': 'assets/Armored Poop sprite sheet.png',
        'enemy_fancy': 'assets/Fancy Poop sprite sheet.png',
        'enemy_sponge': 'assets/Sponge Poop sprite sheet.png',
        'enemy_god': 'assets/God Poop sprite sheet.png', // New God Poop!
        'splat': 'assets/splat.png',
        'shuriken': 'assets/shuriken.png',
        'slash': 'assets/slash.png',
        'blaster': 'assets/blaster.png',
        'poop': 'assets/poop.png',

        // Environment
        // Environment
        'grass': 'assets/grass_texture.png',
        'grass_hd': 'assets/grass_hd.png', // Keeping for legacy/river fallback if needed
        'path_dirt': 'assets/path_dirt_texture.png',
        'snow': 'assets/snow_texture.png',
        'path_ice': 'assets/path_ice_texture.png',

        'water': 'assets/water.png',
        'house': 'assets/house.png',
        'tree': 'assets/tree.png',
        'flower': 'assets/flower.png',
        'bush': 'assets/bush.png',
        'rock': 'assets/rock.png',
        'pine_tree': 'assets/pine_tree.png',
        'ice_crystal': 'assets/ice_crystal.png',
        'snow_rock': 'assets/snow_rock.png',

        // Full Maps
        'snowy_mountain_map': 'assets/snowy_mountain_map.png',
    };

    static loadAll() {
        if (SpriteManager.loaded) return; // Already loaded

        const assets = SpriteManager.ASSETS;

        let loadedCount = 0;
        const total = Object.keys(assets).length;

        // Reset loaded state just in case we are forcing a reload (though we guard above)
        SpriteManager.loaded = false;

        Object.entries(assets).forEach(([key, src]) => {
            const img = new Image();
            img.src = import.meta.env.BASE_URL + src;
            img.onload = () => {
                loadedCount++;
                if (loadedCount >= total) SpriteManager.loaded = true;
            };
            img.onerror = () => {
                console.error(`Failed to load sprite: ${src}`);
                // Count errors as loaded so we don't hang the game
                loadedCount++;
                if (loadedCount >= total) SpriteManager.loaded = true;
            };
            SpriteManager.images[key] = img;
        });
    }

    static get(key) {
        return SpriteManager.images[key];
    }
}
