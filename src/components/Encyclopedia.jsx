import React, { useState } from 'react';
import { TOWER_DATA, ENEMY_DATA } from '../data/EncyclopediaData';

export function Encyclopedia({ initialTab = 'towers', onBack }) {
    const [tab, setTab] = useState(initialTab);
    const data = tab === 'towers' ? TOWER_DATA : ENEMY_DATA;

    return (
        <div className="encyclopedia">
            <h1 className="title">ENCYCLOPEDIA</h1>

            <div className="tabs">
                <button className={`tab-btn ${tab === 'towers' ? 'active' : ''}`} onClick={() => setTab('towers')}>TOWERS</button>
                <button className={`tab-btn ${tab === 'enemies' ? 'active' : ''}`} onClick={() => setTab('enemies')}>ENEMIES</button>
            </div>

            <div className="entries-grid">
                {data.map(item => (
                    <div key={item.id} className="entry-card">
                        <div className="sprite-preview">
                            <SpriteImage item={item} />
                        </div>
                        <div className="entry-info">
                            <h3>{item.name}</h3>
                            <p className="desc">{item.description}</p>
                            <div className="stats-list">
                                {Object.entries(item.stats).map(([key, val]) => (
                                    <div key={key} className="stat-row">
                                        <span className="stat-label">{key}:</span>
                                        <span className="stat-val">{val}</span>
                                    </div>
                                ))}
                            </div>
                            {item.cost && <div className="cost">Cost: ${item.cost}</div>}
                        </div>
                    </div>
                ))}
            </div>

            <button className="back-btn" onClick={onBack}>BACK TO MENU</button>

            <style jsx>{`
                .encyclopedia {
                    width: 100vw;
                    min-height: 100vh;
                    background: #2c3e50;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 2rem;
                    color: white;
                    overflow-y: auto;
                }
                .title {
                    font-size: 3rem;
                    margin-bottom: 2rem;
                    color: #ecf0f1;
                }
                .tabs {
                    margin-bottom: 2rem;
                }
                .tab-btn {
                    background: transparent;
                    border: 2px solid #7f8c8d;
                    color: #7f8c8d;
                    padding: 10px 30px;
                    margin: 0 10px;
                    border-radius: 30px;
                    cursor: pointer;
                    font-size: 1.2rem;
                    transition: all 0.2s;
                }
                .tab-btn.active, .tab-btn:hover {
                    background: #2980b9;
                    border-color: #2980b9;
                    color: white;
                }

                .entries-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 2rem;
                    width: 100%;
                    max-width: 1200px;
                }

                .entry-card {
                    background: #34495e;
                    border-radius: 15px;
                    padding: 1.5rem;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    border: 1px solid #46637f;
                    transition: transform 0.2s;
                }
                .entry-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                }

                .sprite-preview {
                    width: 120px;
                    height: 120px;
                    background: #2c3e50;
                    border-radius: 50%;
                    margin-bottom: 1rem;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    overflow: hidden;
                    border: 3px solid #f1c40f;
                }

                .entry-info {
                    text-align: center;
                    width: 100%;
                }
                .entry-info h3 {
                    color: #f1c40f;
                    margin-bottom: 0.5rem;
                }
                .desc {
                    font-size: 0.9rem;
                    color: #bdc3c7;
                    margin-bottom: 1rem;
                    font-style: italic;
                }
                .stats-list {
                    background: rgba(0,0,0,0.2);
                    padding: 10px;
                    border-radius: 8px;
                    margin-bottom: 0.5rem;
                }
                .stat-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 4px;
                    font-size: 0.9rem;
                }
                .stat-label { color: #95a5a6; }
                .stat-val { color: white; font-weight: bold; }
                .cost {
                    color: #2ecc71;
                    font-weight: bold;
                    margin-top: 5px;
                }

                .back-btn {
                    margin-top: 3rem;
                    margin-bottom: 2rem;
                    background: transparent;
                    border: 2px solid #95a5a6;
                    color: #95a5a6;
                    padding: 10px 30px;
                    border-radius: 30px;
                    cursor: pointer;
                    font-size: 1.2rem;
                    transition: all 0.2s;
                }
                .back-btn:hover {
                    color: white;
                    border-color: white;
                }
            `}</style>
        </div>
    );
}

function SpriteImage({ item }) {
    if (!item.frameConfig) {
        // Simple image
        return <img src={item.sprite} alt={item.name} style={{ width: '80%', height: '80%', objectFit: 'contain' }} />;
    }

    // Sprite Sheet Logic
    // Crop to the first frame
    const { cols, rows } = item.frameConfig;

    // We don't verify dimensions here (assuming data is correct or utilizing CSS scaling)
    // CSS trick to show just one cell of the grid.

    // Assuming the sprite sheet is meant to be split evenly.
    // If we use background-size: 100% * cols, 100% * rows?
    // Let's try background-size: (cols * 100)% (rows * 100)%

    const style = {
        width: '100%',
        height: '100%',
        backgroundImage: `url("${item.sprite}")`,
        backgroundPosition: '0 0',
        backgroundSize: `${cols * 100}% ${rows * 100}%`,
        backgroundRepeat: 'no-repeat'
    };

    return <div style={{ width: '80px', height: '80px', ...style }}></div>;
}
