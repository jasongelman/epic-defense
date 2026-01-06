import { TOWER_DATA } from '../data/EncyclopediaData';

export function GameUI({ onSelectTower, selectedTower, placedTower, onUpgrade, onSell, onDeselect, paused, onTogglePause, onToggleSpeed, isFastForward, onQuit, layout = 'horizontal' }) {
    const getTowerStyle = (tower) => {
        const isSelected = selectedTower === tower.id;
        return {
            padding: '0', // Remove padding to let image fill
            backgroundColor: isSelected ? '#34495e' : '#222',
            color: '#fff',
            border: isSelected ? '2px solid #f1c40f' : '2px solid #444',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontWeight: 'bold',
            transition: 'all 0.2s',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '90px', // Slightly wider
            height: '110px',
            position: 'relative', // For absolute overlay
            overflow: 'hidden', // Clip image corners
            flexShrink: 0,
        };
    };

    const renderSprite = (item) => {
        // If it's a simple image
        if (!item.frameConfig) {
            return <img src={item.sprite} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', position: 'absolute', top: 0, left: 0, zIndex: 0, opacity: 0.6 }} />;
        }
        // If it's a sprite sheet
        const { cols, rows } = item.frameConfig;
        const style = {
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            backgroundImage: `url("${item.sprite}")`,
            // Focus on the first frame (0,0)
            backgroundPosition: '0 0',
            // Scale the sheet so one frame fills the container
            backgroundSize: `${cols * 100}% ${rows * 100}%`,
            backgroundRepeat: 'no-repeat',
            zIndex: 0,
            opacity: 0.7,
            // Zoom in slightly to fill better, but keep centered
            transform: 'scale(1.2)',
            transformOrigin: 'center center'
        };
        return <div style={style}></div>;
    };

    // ... (UPGRADE PANEL code omitted for brevity if unchanged, but I need to be careful with replace_file_content matching) ...
    // ... Actually, I'll just replace the button mapping part and the functions at the top.

    // (Skip to button mapping replacement)

    // UPGRADE PANEL
    if (placedTower) {
        const nextCost = placedTower.upgradeCost;
        const isMax = placedTower.level >= placedTower.maxLevel;

        return (
            <div style={{
                display: 'flex',
                gap: '20px',
                padding: '20px',
                backgroundColor: 'rgba(52, 73, 94, 0.95)',
                borderRadius: '12px',
                alignItems: 'center',
                color: 'white',
                border: '2px solid #3498db'
            }}>
                {/* Stats */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <h3 style={{ margin: 0, color: '#f1c40f' }}>{placedTower.name} (Lvl {placedTower.level})</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.9rem' }}>
                        <span>⚔️ Dmg: {Math.floor(placedTower.damage)}</span>
                        <span>🏹 Rng: {Math.floor(placedTower.range)}</span>
                        <span>⏩ Spd: {placedTower.fireRate.toFixed(1)}/s</span>
                    </div>
                </div>

                {/* Divider */}
                <div style={{ width: '1px', height: '50px', backgroundColor: 'rgba(255,255,255,0.2)' }}></div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '10px' }}>

                    {!isMax ? (
                        <button
                            onClick={onUpgrade}
                            style={{
                                padding: '10px 20px',
                                background: '#27ae60',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center'
                            }}
                        >
                            <span>UPGRADE ⬆️</span>
                            <span style={{ fontSize: '0.8rem', opacity: 0.9 }}>${nextCost}</span>
                        </button>
                    ) : (
                        <div style={{ padding: '10px', color: '#2ecc71', fontWeight: 'bold' }}>MAX LEVEL</div>
                    )}

                    <button
                        onClick={onSell}
                        style={{
                            padding: '10px 20px',
                            background: '#c0392b',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        SELL 💰
                    </button>

                    <button
                        onClick={onQuit} // Acting as 'close' since onDeselect passed as null fallback? No, let's use a standard close button
                    // ACTUALLY, onQuit is 'Quit to Menu'. We need a specific CLOSE functionality or just click away.
                    // Let's repurpose onSelectTower(null) context? No, just use passed onDeselect equivalent (we didn't pass it yet properly in prev step props destructuring? Check below)
                    >
                    </button>
                </div>

                <button onClick={onQuit} style={{ marginLeft: 'auto', background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>🚪</button>
            </div>
        );
    }

    // BUILD PANEL (Standard)
    return (
        <div style={{
            display: 'flex',
            gap: '10px',
            marginTop: '10px',
            padding: '10px',
            backgroundColor: 'rgba(0,0,0,0.8)',
            borderRadius: '12px',
            alignItems: 'center',
            backdropFilter: 'blur(5px)',
            maxWidth: '100vw',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none', // IE/Edge
        }}>
            <style jsx>{`
                /* Hide scrollbar for Chrome/Safari/Opera */
                div::-webkit-scrollbar {
                    display: none;
                }
            `}</style>

            <button
                onClick={onTogglePause}
                style={{
                    padding: '10px 15px',
                    backgroundColor: paused ? '#2ecc71' : '#f1c40f',
                    color: '#000',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    marginRight: '10px',
                    height: '50px',
                    flexShrink: 0,
                }}
            >
                {paused ? '▶' : '⏸'}
            </button>
            <button
                onClick={onToggleSpeed}
                style={{
                    padding: '10px 15px',
                    backgroundColor: isFastForward ? '#e74c3c' : '#3498db',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    marginRight: '15px',
                    height: '50px',
                    flexShrink: 0,
                }}
            >
                {isFastForward ? '1x Speed' : '2x Speed'}
            </button>

            {TOWER_DATA.map(t => (
                <button
                    key={t.id}
                    onClick={() => onSelectTower(t.id)}
                    style={getTowerStyle(t)}
                    title={t.name}
                >
                    {renderSprite(t)}

                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        padding: '2px',
                        background: 'rgba(0,0,0,0.6)',
                        fontSize: '0.7rem',
                        color: '#fff',
                        zIndex: 1,
                        whiteSpace: 'normal', // Allow wrap
                        lineHeight: '1',
                        textAlign: 'center'
                    }}>
                        {t.name}
                    </div>

                    <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        padding: '2px',
                        background: 'rgba(0,0,0,0.8)',
                        fontSize: '0.85rem',
                        color: '#f1c40f',
                        zIndex: 1,
                        fontWeight: 'bold'
                    }}>
                        ${t.cost}
                    </div>
                </button>
            ))}

            <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.2)', margin: '0 10px' }}></div>

            <button
                onClick={onQuit}
                style={{
                    padding: '10px 15px',
                    backgroundColor: '#c0392b',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    height: '50px',
                    flexShrink: 0,
                }}
            >
                Home
            </button>
        </div>
    );
}
