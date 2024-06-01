import { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';

const formWaveSurferOptions = (ref: string) => ({
    container: ref,
    waveColor: '#ccc',
    progressColor: '#ff0063',
    cursorColor: 'transparent',
    responsive: true,
    height: 80,
    normalize: true,
    barWidth: 2,
    barGap: 3
})

const formatTime = (seconds: number) => {
    const date = new Date(0);
    date.setSeconds(seconds);

    return date.toISOString().substr(11,8);
}

const AudioPlayer = ({ audioFile }: { audioFile: string }) => {
    const waveformRef = useRef(null);
    const wavesurfer = useRef<WaveSurfer | null>(null);
    const [playing, setPlaying] = useState<boolean>(false);
    const [volume, setVolume] = useState<number>(0.5);
    const [muted, setMuted] = useState<boolean>(false);
    const [duration, setDuration] = useState<number | undefined>(0);
    const [currentTime, setCurrentTime] = useState<number | undefined>(0);
    const [audioFileName, setAudioFileName] = useState<string | undefined>('');
 
    // initialize wavesufer 
    useEffect(() => {

        if(waveformRef.current) {

            const options = formWaveSurferOptions(waveformRef.current)
            wavesurfer.current = WaveSurfer.create(options);

            // load audio file 
            wavesurfer.current.load(audioFile);

            // when wavesurfer is ready 
            wavesurfer.current.on('ready', () => {
                setVolume(wavesurfer.current?.getVolume() ?? 0.5);
                setDuration(wavesurfer.current?.getDuration());
                setAudioFileName(audioFile.split('/').pop())
            })

            // update current time 
            wavesurfer.current.on('audioprocess', () => {
                setCurrentTime(wavesurfer.current?.getCurrentTime())
            })
        }

        // clean 
        return () => {
            wavesurfer.current?.un('audioprocess', () => {})
            wavesurfer.current?.un('ready', () => {})
            wavesurfer.current?.destroy();

        }

    }, [audioFile]);

    // toggle playback 
    const handlePlayPause = () => {
        setPlaying(!playing);
        wavesurfer.current?.playPause();
    } 

    // handle volume change 
    const handleVolumeChange = (newVolume: number) => {
        setVolume(newVolume);
        wavesurfer.current?.setVolume(newVolume);
        setMuted(newVolume == 0);

    }

    // handle volume mute
    const handleMute = () => {
        setMuted(!muted);
        wavesurfer.current?.setVolume(muted ? volume: 0)
    }

    // handle volume up 
    const handleVolumeUp = () => {
        handleVolumeChange(Math.min(volume + 0.1, 1))
    }

    // handle volume down 
    const handleVolumeDown = () => {
        handleVolumeChange(Math.min(volume - 0.1, 0))
    }

    return (
        <div id='waveform' ref={waveformRef} style={{ width: '100%'}}>
            <div className=' flex items-center space-x-3'>
                {/* play pause button  */}
                <button onClick={handlePlayPause}>
                    { playing ? 'pause': 'play'}
                </button>

                {/* mute unmute button  */}
                <button onClick={handleMute}>
                    { muted ? 'volume off' : 'volume mute'}
                </button>

                {/* volume slider  */}
                <input type="range"
                    id='volume'
                    name='volume'
                    min='0'
                    max='1'
                    step='0.05'
                    value={muted ? 0: volume}
                    onChange={e => handleVolumeChange(parseFloat(e.target.value))} />

                {/* volume down button  */}
                <button onClick={handleVolumeDown}>
                    volume down
                </button>

                {/* volume up button  */}
                <button onClick={handleVolumeUp}>
                    volume up
                </button>
            </div>
            <div>
                {/* audio info  */}
                <span>
                    Playing: { audioFileName } <br />

                </span>
                <span>
                    Duration: { formatTime(duration ?? 0)} | Current Time: {' '}
                    {formatTime(currentTime ?? 0)} <br />
                </span>
                <span>
                    Volume: { Math.round(volume * 100)} %
                </span>
            </div>
        </div>
    )
}

export default AudioPlayer;