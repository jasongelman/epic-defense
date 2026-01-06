import React, { useEffect, useState } from 'react';

export function StatsPage({ onBack }) {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const data = localStorage.getItem('epicDefenseSave');
        if (data) {
            setStats(JSON.parse(data));
        }
    }, []);

    if (!stats) {
        return (
            <div className="stats-page">
                <h1>NO DATA FOUND</h1>
                <p>Play a game to generate statistics!</p>
                <button className="back-btn" onClick={onBack}>BACK TO MENU</button>
                <style jsx>{`
                    .stats-page {
                        width: 100vw;
                        height: 100vh;
                        background: #2c3e50;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        color: white;
                    }
                    .back-btn {
                        margin-top: 2rem;
                        background: transparent;
                        border: 2px solid #95a5a6;
                        color: #95a5a6;
                        padding: 10px 30px;
                        border-radius: 30px;
                        cursor: pointer;
                        font-size: 1.2rem;
                    }
                `}</style>
            </div>
        );
    }

    const { level, xp, lifetimeStats = {} } = stats;
    const { totalKills = 0, totalMoneyEarned = 0, killsByType = {} } = lifetimeStats;

    return (
        <div className="stats-page">
            <h1 className="title">LIFETIME STATISTICS</h1>

            <div className="stats-grid">
                <div className="stat-card highlight">
                    <div className="val">{level}</div>
                    <div className="label">PLAYER LEVEL</div>
                </div>
                <div className="stat-card highlight">
                    <div className="val">{totalKills}</div>
                    <div className="label">TOTAL KILLS</div>
                </div>
                <div className="stat-card highlight">
                    <div className="val">${totalMoneyEarned.toLocaleString()}</div>
                    <div className="label">TOTAL EARNINGS</div>
                </div>
            </div>

            <div className="kill-breakdown">
                <h2>Casualties by Type</h2>
                <div className="breakdown-list">
                    <StatRow label="Basic Poop" value={killsByType.basic || 0} />
                    <StatRow label="Fast Poop" value={killsByType.fast || 0} />
                    <StatRow label="Tank Poop" value={killsByType.tank || 0} />
                    <StatRow label="Armored Poop" value={killsByType.armored || 0} />
                    <StatRow label="Fancy Poop" value={killsByType.fancy || 0} />
                    <StatRow label="Sponge Poop" value={killsByType.sponge || 0} />
                    <StatRow label="GOD POOP" value={killsByType.god || 0} highlight />
                </div>
            </div>

            <button className="back-btn" onClick={onBack}>BACK TO MENU</button>

            <style jsx>{`
                .stats-page {
                    width: 100vw;
                    min-height: 100vh;
                    background: #2c3e50;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 2rem;
                    color: white;
                }
                .title {
                    font-size: 3rem;
                    margin-bottom: 2rem;
                    color: #ecf0f1;
                }
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 2rem;
                    margin-bottom: 3rem;
                    width: 100%;
                    max-width: 800px;
                }
                .stat-card {
                    background: #34495e;
                    padding: 2rem;
                    border-radius: 15px;
                    text-align: center;
                    border: 2px solid #7f8c8d;
                }
                .stat-card.highlight {
                    border-color: #f1c40f;
                    box-shadow: 0 0 15px rgba(241, 196, 15, 0.2);
                }
                .val {
                    font-size: 2.5rem;
                    font-weight: bold;
                    color: #ecf0f1;
                    margin-bottom: 0.5rem;
                }
                .label {
                    color: #95a5a6;
                    letter-spacing: 2px;
                    font-size: 0.9rem;
                }

                .kill-breakdown {
                    background: rgba(0, 0, 0, 0.2);
                    padding: 2rem;
                    border-radius: 15px;
                    width: 100%;
                    max-width: 600px;
                }
                .kill-breakdown h2 {
                    text-align: center;
                    margin-bottom: 1.5rem;
                    color: #bdc3c7;
                }
                .breakdown-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .breakdown-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 0.5rem;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                }
                .breakdown-label { font-size: 1.1rem; }
                .breakdown-val { font-weight: bold; font-size: 1.2rem; }
                .highlight-text { color: #e74c3c; }

                .back-btn {
                    margin-top: 3rem;
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

function StatRow({ label, value, highlight }) {
    return (
        <div className="breakdown-row">
            <span className={`breakdown-label ${highlight ? 'highlight-text' : ''}`}>{label}</span>
            <span className={`breakdown-val ${highlight ? 'highlight-text' : ''}`}>{value}</span>
        </div>
    );
}
