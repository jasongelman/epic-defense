import { TOWER_DATA } from '../data/EncyclopediaData';

export function GameUI({ onSelectTower, selectedTower, placedTower, onUpgrade, onSell, onDeselect, paused, onTogglePause, onToggleSpeed, isFastForward, onQuit }) {
    const getTowerStyle = (tower) => {
        const isSelected = selectedTower === tower.id;
        return {
            padding: '5px',
            backgroundColor: isSelected ? '#34495e' : '#222', // Darker background for contrast
            color: '#fff',
            border: isSelected ? '2px solid #f1c40f' : '2px solid #444',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transform: isSelected ? 'scale(1.1)' : 'scale(1)',
            transition: 'all 0.2s',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '80px',
            height: '100px',
            justifyContent: 'space-between'
        };
    };

    const renderSprite = (item) => {
        if (!item.frameConfig) {
            return <img src={item.sprite} alt={item.name} style={{ width: '40px', height: '40px', objectFit: 'contain' }} />;
        }
        const { cols, rows } = item.frameConfig;
        const style = {
            width: '40px',
            height: '40px',
            backgroundImage: `url("${item.sprite}")`,
            backgroundPosition: '0 0',
            backgroundSize: `${cols * 100}% ${rows * 100}%`,
            backgroundRepeat: 'no-repeat',
            margin: '5px 0'
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
                onClick={onQuit}
                style={{
                    padding: '10px 15px',
                    backgroundColor: '#c0392b',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    marginRight: '15px',
                    height: '50px'
                }}
                title="Quit to Menu"
            >
                🚪
            </button>
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
                    height: '50px'
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
                    height: '50px'
                }}
            >
                {isFastForward ? '⏩' : '▶'}
            </button>

            {TOWER_DATA.map(t => (
                <button
                    key={t.id}
                    onClick={() => onSelectTower(t.id)}
                    style={getTowerStyle(t)}
                    title={t.name}
                >
                    <span style={{ fontSize: '0.7rem', color: '#bdc3c7' }}>{t.name.split(' ')[0]}</span>
                    {renderSprite(t)}
                    <span style={{ fontSize: '0.8rem', color: '#f1c40f' }}>${t.cost}</span>
                </button>
            ))}
        </div>
    );
}
