export const TILE_SIZE = 50;

// Simple winding path
export const PATH_COORDINATES = [
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
];

export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;
