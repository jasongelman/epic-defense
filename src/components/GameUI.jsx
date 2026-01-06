import { TOWER_DATA } from '../data/EncyclopediaData';

export function GameUI({ onSelectTower, selectedTower, placedTower, onUpgrade, onSell, onDeselect, paused, onTogglePause, onToggleSpeed, isFastForward, onQuit, layout = 'horizontal' }) {
    const isVertical = layout === 'vertical';

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

    // UPGRADE PANEL
    if (placedTower) {
        const nextCost = placedTower.upgradeCost;
        const isMax = placedTower.level >= placedTower.maxLevel;

        return (
            <div style={{
                display: 'flex',
                flexDirection: isVertical ? 'column' : 'row',
                gap: '15px',
                padding: '20px',
                backgroundColor: 'rgba(52, 73, 94, 0.95)',
                borderRadius: '12px',
                alignItems: 'center',
                color: 'white',
                border: '2px solid #3498db',
                maxWidth: isVertical ? '140px' : '100vw',
                width: isVertical ? '140px' : 'auto',
                overflowY: isVertical ? 'auto' : 'visible',
            }}>
                {/* Stats */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', textAlign: 'center', width: '100%' }}>
                    <h3 style={{ margin: 0, color: '#f1c40f', fontSize: '1rem' }}>{placedTower.name}</h3>
                    <div style={{ fontSize: '0.8rem', color: '#bdc3c7' }}>Lvl {placedTower.level}</div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: isVertical ? '1fr' : '1fr 1fr',
                        gap: '5px',
                        fontSize: '0.8rem',
                        marginTop: '5px'
                    }}>
                        <span>⚔️ {Math.floor(placedTower.damage)}</span>
                        <span>🏹 {Math.floor(placedTower.range)}</span>
                        <span>⏩ {placedTower.fireRate.toFixed(1)}/s</span>
                    </div>
                </div>

                {/* Divider */}
                <div style={{
                    width: isVertical ? '80%' : '1px',
                    height: isVertical ? '1px' : '50px',
                    backgroundColor: 'rgba(255,255,255,0.2)'
                }}></div>

                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: isVertical ? 'column' : 'row', gap: '10px', width: '100%' }}>

                    {!isMax ? (
                        <button
                            onClick={onUpgrade}
                            style={{
                                padding: '10px',
                                background: '#27ae60',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                width: '100%'
                            }}
                        >
                            <span>UPGRADE</span>
                            <span style={{ fontSize: '0.8rem', opacity: 0.9 }}>${nextCost}</span>
                        </button>
                    ) : (
                        <div style={{ padding: '10px', color: '#2ecc71', fontWeight: 'bold', textAlign: 'center' }}>MAXED</div>
                    )}

                    <button
                        onClick={onSell}
                        style={{
                            padding: '10px',
                            background: '#c0392b',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            width: '100%'
                        }}
                    >
                        SELL 💰
                    </button>
                </div>

                <button
                    onClick={onQuit}
                    style={{
                        marginLeft: isVertical ? '0' : 'auto',
                        marginTop: isVertical ? '10px' : '0',
                        background: 'transparent',
                        border: 'none',
                        fontSize: '1.5rem',
                        cursor: 'pointer'
                    }}
                >
                    🚪
                </button>
            </div>
        );
    }

    // BUILD PANEL (Standard)
    return (
        <div style={{
            display: 'flex',
            flexDirection: isVertical ? 'column' : 'row',
            gap: '10px',
            marginTop: isVertical ? '0' : '10px',
            marginLeft: isVertical ? '10px' : '0',
            padding: '10px',
            backgroundColor: 'rgba(0,0,0,0.8)',
            borderRadius: '12px',
            alignItems: 'center',
            backdropFilter: 'blur(5px)',
            maxWidth: isVertical ? '140px' : '100vw',
            maxHeight: isVertical ? '100vh' : 'auto',
            width: isVertical ? '140px' : '100%',
            overflowX: isVertical ? 'hidden' : 'auto',
            overflowY: isVertical ? 'auto' : 'hidden',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
        }}>
            <style jsx>{`
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
                    width: isVertical ? '90px' : 'auto',
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
                    width: isVertical ? '90px' : 'auto',
                    height: '50px',
                    flexShrink: 0,
                }}
            >
                {isFastForward ? '1x' : '2x'}
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
                        whiteSpace: 'normal',
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

            <div style={{
                width: isVertical ? '80%' : '1px',
                height: isVertical ? '1px' : '40px',
                background: 'rgba(255,255,255,0.2)',
                margin: '0 10px',
                flexShrink: 0
            }}></div>

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
                    width: isVertical ? '90px' : 'auto',
                    flexShrink: 0,
                }}
            >
                Home
            </button>
        </div>
    );
}
