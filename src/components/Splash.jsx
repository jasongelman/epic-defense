import React, { useState } from 'react';

export function Splash({ onStart, onDebug }) {
    const [videoPlaying, setVideoPlaying] = useState(true);

    return (
        <div className={`splash-screen ${!videoPlaying ? 'show-bg' : ''}`}>
            {videoPlaying && (
                <video
                    className="splash-video"
                    autoPlay
                    muted
                    playsInline
                    onEnded={() => setVideoPlaying(false)}
                    src="/assets/Intro Video.mp4"
                />
            )}
            <div className="splash-content">
                <button className="start-btn" onClick={onStart}>
                    PLAY
                </button>
            </div>

            <button
                onClick={onDebug}
                style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '10px',
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: 'rgba(255,255,255,0.4)',
                    padding: '5px 10px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    zIndex: 20
                }}
            >
                DEBUG MODE
            </button>

            <style jsx>{`
                .splash-screen {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                    overflow: hidden;
                    background: #000;
                    transition: background 0.5s;
                }
                .splash-screen.show-bg {
                    background: url('/assets/Splash Screen.png') no-repeat center center/cover;
                }
                .splash-video {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    min-width: 100%;
                    min-height: 100%;
                    width: auto;
                    height: auto;
                    transform: translate(-50%, -50%);
                    z-index: -1;
                    object-fit: cover;
                }
                .splash-content {
                    text-align: center;
                    position: relative;
                    z-index: 1;
                }
                .start-btn {
                    font-size: 2rem;
                    color: white;
                    background: #e74c3c;
                    border: 2px solid white;
                    padding: 15px 40px;
                    border-radius: 50px;
                    cursor: pointer;
                    font-weight: bold;
                    transition: all 0.2s;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                    text-shadow: 0 1px 3px rgba(0,0,0,0.3);
                }
                .start-btn:hover {
                    transform: scale(1.05);
                    background: #ff6b6b;
                    box-shadow: 0 8px 25px rgba(0,0,0,0.5);
                }
                .start-btn:active {
                    transform: scale(0.95);
                }
                .disclaimer {
                    margin-top: 2rem;
                    color: #fff;
                    font-size: 1.2rem;
                    font-weight: bold;
                    text-shadow: 0 2px 8px rgba(0,0,0,1);
                }
            `}</style>
        </div>
    );
}
