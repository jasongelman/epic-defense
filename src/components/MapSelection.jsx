import React from 'react';
import { MAPS } from '../data/Maps';

export function MapSelection({ onSelect, onBack }) {
    return (
        <div className="map-select">
            <h1 className="title">CHOOSE BATTLEFIELD</h1>

            <div className="maps-grid">
                {Object.values(MAPS).map(map => (
                    <div key={map.id} className="map-card" onClick={() => onSelect(map.id)}>
                        <div className="map-preview" style={{ background: map.theme.background }}>
                            {/* Simple visual representation of theme */}
                            <div className="path-preview" style={{ borderColor: map.theme.path }}></div>
                            <div className="icon">{map.id === 'mountain' ? '🏔️' : '🏡'}</div>
                        </div>
                        <div className="map-info">
                            <h2>{map.name}</h2>
                            <p className="desc">{map.description}</p>
                            <p className="diff">Difficulty: {map.difficulty}</p>
                        </div>
                        <div className="play-overlay">PLAY</div>
                    </div>
                ))}
            </div>

            <button className="back-btn" onClick={onBack}>BACK TO MENU</button>

            <style jsx>{`
                .map-select {
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
                .maps-grid {
                    display: flex;
                    gap: 2rem;
                    flex-wrap: wrap;
                    justify-content: center;
                }
                .map-card {
                    background: #34495e;
                    border: 4px solid #7f8c8d;
                    border-radius: 20px;
                    width: 300px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                }
                .map-card:hover {
                    transform: translateY(-10px);
                    border-color: #f1c40f;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                }
                .map-preview {
                    height: 180px;
                    position: relative;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    overflow: hidden;
                }
                .path-preview {
                    width: 150%;
                    height: 50px;
                    border-top: 20px solid;
                    transform: rotate(-30deg);
                    opacity: 0.7;
                }
                .icon {
                    font-size: 4rem;
                    position: absolute;
                    text-shadow: 0 4px 10px rgba(0,0,0,0.2);
                }
                .map-info {
                    padding: 1.5rem;
                    text-align: center;
                    flex-grow: 1;
                    background: #2c3e50;
                }
                .map-info h2 {
                    color: #f1c40f;
                    margin-bottom: 0.5rem;
                    font-size: 1.5rem;
                }
                .desc {
                    color: #bdc3c7;
                    margin-bottom: 1rem;
                    font-size: 0.9rem;
                    min-height: 2.7em;
                }
                .diff {
                    color: #e74c3c;
                    font-weight: bold;
                }
                .play-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.6);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2rem;
                    font-weight: bold;
                    color: #f1c40f;
                    opacity: 0;
                    transition: opacity 0.3s;
                }
                .map-card:hover .play-overlay {
                    opacity: 1;
                }
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
