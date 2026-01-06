import React from 'react';

export function MainMenu({ onNavigate }) {
    return (
        <div className="main-menu">
            <h1 className="menu-title">MAIN MENU</h1>

            <div className="menu-grid">
                <button className="menu-btn play-btn" onClick={() => onNavigate('map-select')}>
                    <span className="icon">⚔️</span>
                    <span className="label">BATTLE</span>
                </button>

                {/* ... other buttons ... */}
                <button className="menu-btn" onClick={() => onNavigate('towers')}>
                    <span className="icon">🏰</span>
                    <span className="label">TOWERS</span>
                </button>

                <button className="menu-btn" onClick={() => onNavigate('enemies')}>
                    <span className="icon">👹</span>
                    <span className="label">ENEMIES</span>
                </button>

                <button className="menu-btn" onClick={() => onNavigate('stats')}>
                    <span className="icon">📊</span>
                    <span className="label">STATS</span>
                </button>
            </div>

            <style jsx>{`
                .main-menu {
                    width: 100vw;
                    height: 100vh;
                    background: url('assets/Splash Screen.png') no-repeat center center/cover;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    position: relative;
                }
                .main-menu::before {
                    content: '';
                    position: absolute;
                    top: 0; 
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(44, 62, 80, 0.85); /* Dark blue tint */
                    backdrop-filter: blur(5px);
                    z-index: 0;
                }
                .menu-title, .menu-grid {
                    position: relative;
                    z-index: 1;
                }
                .menu-title {
                    font-size: 3rem;
                    margin-bottom: 3rem;
                    color: #ecf0f1;
                    letter-spacing: 5px;
                    text-shadow: 0 4px 10px rgba(0,0,0,0.5);
                }
                .menu-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 2rem;
                    max-width: 800px;
                    width: 90%;
                }
                @media (max-width: 768px) {
                    .menu-grid {
                        grid-template-columns: 1fr;
                        gap: 1rem;
                    }
                    .menu-title {
                        font-size: 2rem;
                        margin-bottom: 2rem;
                    }
                    .menu-btn {
                        min-height: 120px;
                        padding: 1.5rem;
                        flex-direction: row;
                        align-items: center;
                        justify-content: flex-start;
                        gap: 20px;
                    }
                    .icon {
                        margin-bottom: 0;
                        font-size: 3rem;
                    }
                }
                .menu-btn {
                    background: rgba(255, 255, 255, 0.1);
                    border: 2px solid rgba(255, 255, 255, 0.2);
                    border-radius: 15px;
                    padding: 2rem;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    min-width: 200px;
                    min-height: 200px;
                }
                .menu-btn:hover {
                    background: rgba(255, 255, 255, 0.2);
                    transform: translateY(-5px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.3);
                }
                .play-btn {
                    background: rgba(46, 204, 113, 0.2);
                    border-color: #2ecc71;
                }
                .play-btn:hover {
                    background: rgba(46, 204, 113, 0.4);
                }
                .icon {
                    font-size: 4rem;
                    margin-bottom: 1rem;
                }
                .label {
                    font-size: 1.5rem;
                    font-weight: bold;
                    letter-spacing: 2px;
                }
            `}</style>
        </div>
    );
}
