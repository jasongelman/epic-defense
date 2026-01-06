export const MAPS = {
    village: {
        id: 'village',
        name: 'The Green Village',
        description: 'A peaceful village with a winding river.',
        difficulty: '⭐⭐⭐',
        theme: {
            background: '#2ecc71',
            bgTexture: 'grass',
            path: '#3498db',
            pathTexture: 'path_dirt',
            accent: '#27ae60',
            textColor: '#f1c40f'
        },
        path: [
            { x: 0, y: 100 },    // Start
            { x: 100, y: 100 },  // Right
            { x: 100, y: 500 },  // Down (Long)
            { x: 250, y: 500 },  // Right
            { x: 250, y: 200 },  // Up
            { x: 400, y: 200 },  // Right
            { x: 400, y: 500 },  // Down
            { x: 550, y: 500 },  // Right
            { x: 550, y: 100 },  // Up (Long)
            { x: 700, y: 100 },  // Right
            { x: 700, y: 300 },  // Down
            { x: 800, y: 300 }   // End
        ],
        decorations: ['tree', 'bush', 'flower', 'rock']
    },
    mountain: {
        id: 'mountain',
        name: 'Snowy Peaks',
        description: 'A treacherous ski slope. Watch out for yetis!',
        difficulty: '⭐⭐⭐⭐⭐',
        theme: {
            background: '#ecf0f1',
            bgImage: 'snowy_mountain_map', // Use full map image
            path: '#bdc3c7',
            // pathTexture: 'path_ice', // Disabled to let image show
            accent: '#95a5a6',
            textColor: '#3498db'
        },
        path: [
            { x: 50, y: 0 },     // Start Top Left
            { x: 50, y: 150 },   // Down
            { x: 700, y: 250 },  // Diagonal Right-Down (Slope)
            { x: 700, y: 350 },  // Down
            { x: 100, y: 450 },  // Diagonal Left-Down (Slope)
            { x: 100, y: 550 },  // Down
            { x: 800, y: 550 }   // Right to End
        ],
        decorations: [] // Map image has details baked in
    }
};
