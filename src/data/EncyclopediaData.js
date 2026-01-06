export const TOWER_DATA = [
    {
        id: 'ninja',
        name: 'Hidden Leaf Ninja',
        description: 'Fast-attacking shinobi that throws shurikens.',
        stats: { Damage: '2', Range: '140', Speed: '3.0/s' },
        cost: 150,
        sprite: 'assets/Ninja Tower sprite sheet.png',
        frameConfig: { cols: 4, rows: 2 }
    },
    {
        id: 'hero',
        name: 'Hyrule Hero',
        description: 'Legendary hero with a sword. Deals AOE damage.',
        stats: { Damage: '5', Range: '80', Speed: '1.5/s' },
        cost: 200,
        sprite: 'assets/hero.png'
    },
    {
        id: 'trooper',
        name: 'Galactic Trooper',
        description: 'Elite marksman with a blaster.',
        stats: { Damage: '1', Range: '150', Speed: '2.0/s' },
        cost: 120,
        sprite: 'assets/Trooper Tower sprite sheet.png',
        frameConfig: { cols: 5, rows: 2 }
    },
    {
        id: 'stinker',
        name: 'The Stinker',
        description: 'Unleashes a noxious cloud that slows enemies.',
        stats: { Damage: '0.5', Range: '80', Speed: '1.0/s' },
        cost: 100,
        sprite: 'assets/Stinker Tower sprite sheet.png',
        frameConfig: { cols: 5, rows: 2 }
    },
    {
        id: 'naruto',
        name: 'NARUTO (OP)',
        description: 'The Hero of the Leaf. Shadow Clone jutsu!',
        stats: { Damage: '25', Range: '250', Speed: '8.0/s' },
        cost: 1000,
        sprite: 'assets/Naruto Tower sprite sheet.png',
        frameConfig: { cols: 5, rows: 2 }
    }
];

export const ENEMY_DATA = [
    {
        id: 'enemy_basic',
        name: 'Basic Poop',
        description: 'Your standard everyday nuisance.',
        stats: { HP: '12', Speed: 'Average' },
        sprite: 'assets/Basic Poop sprite sheet.png',
        frameConfig: { cols: 4, rows: 2 }
    },
    {
        id: 'enemy_fast',
        name: 'Fast Poop',
        description: 'Had too much coffee. Zoom zoom!',
        stats: { HP: '6', Speed: 'Very Fast' },
        sprite: 'assets/Fast Poop sprite sheet.png',
        frameConfig: { cols: 5, rows: 2 }
    },
    {
        id: 'enemy_tank',
        name: 'Tank Poop',
        description: 'A heavy meal that sits in your stomach.',
        stats: { HP: '25', Speed: 'Slow' },
        sprite: 'assets/Tank Poop sprite sheet.png',
        frameConfig: { cols: 4, rows: 2 }
    },
    {
        id: 'enemy_armored',
        name: 'Armored Poop',
        description: 'Protected by a corn shell.',
        stats: { HP: '35', Speed: 'Average', Armor: 'Yes' },
        sprite: 'assets/Armored Poop sprite sheet.png',
        frameConfig: { cols: 4, rows: 2 }
    },
    {
        id: 'enemy_fancy',
        name: 'Fancy Poop',
        description: 'Wears a monocle. Very distinguished.',
        stats: { HP: '100', Speed: 'Fast' },
        sprite: 'assets/Fancy Poop sprite sheet.png',
        frameConfig: { cols: 4, rows: 2 }
    },
    {
        id: 'enemy_sponge',
        name: 'Sponge Poop',
        description: 'Absorbs damage like a sponge.',
        stats: { HP: '50', Speed: 'Slow' },
        sprite: 'assets/Sponge Poop sprite sheet.png',
        frameConfig: { cols: 4, rows: 2 }
    },
    {
        id: 'enemy_god',
        name: 'GOD POOP',
        description: 'The Holy One. Repent!',
        stats: { HP: '500', Speed: 'Slow' },
        sprite: 'assets/God Poop sprite sheet.png',
        frameConfig: { cols: 4, rows: 2 }
    }
];
