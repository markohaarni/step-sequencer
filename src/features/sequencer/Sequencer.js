import StepPattern from './StepPattern';
import {
  selectBpm,
  selectVolume,
  selectSteps,
  selectStepLength,
  selectTransportPosition,
  setTransportPosition,
} from './sequencerSlice';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { start, getDestination, Transport } from 'tone';
import ControlBar from './ControlBar';

export default function Sequencer() {
  const bpm = useSelector(selectBpm);
  const volume = useSelector(selectVolume);
  const transportPosition = useSelector(selectTransportPosition);
  const steps = useSelector(selectSteps);
  const stepLength = useSelector(selectStepLength);

  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);

  const dispatch = useDispatch();

  // Loop length in bars
  const loopLength = steps / stepLength;

  useEffect(() => {
    if (Transport.bpm) {
      Transport.bpm.rampTo(bpm, 0.1);
    }
  }, [bpm]);

  useEffect(() => {
    Transport.loopEnd = `${loopLength}:0:0`;
  }, [loopLength]);

  async function play() {
    if (!started) {
      await start();
      getDestination().volume.rampTo(volume, 0.001);
      setStarted(true);
    }

    if (!playing) {
      Transport.loop = true;
      Transport.loopStart = 0;
      Transport.loopEnd = `${loopLength}:0:0`;
      Transport.start();
      setPlaying(true);
    } else {
      Transport.stop();
      Transport.cancel();
      Transport.loop = false;
      Transport.loopEnd = 0;
      setPlaying(false);
      dispatch(setTransportPosition(null));
    }
  }

  return (
    <div>
      <ControlBar
        onPlay={play}
        playing={playing}
        loopLength={loopLength}
        transportPosition={transportPosition}
        bpm={bpm}
      />

      <StepPattern
        playing={playing}
        loopLength={loopLength}
        stepLength={stepLength}
      ></StepPattern>
    </div>
  );
}
