import StepPattern from './StepPattern';
import IconButton from '../../components/buttons/IconButton';
import { selectBpm, selectVolume, setBpm } from './sequencerSlice';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { start, getDestination, Transport } from 'tone';
import { MdPlayArrow, MdStop } from 'react-icons/md';

export default function Sequencer() {
  const bpm = useSelector(selectBpm);
  const volume = useSelector(selectVolume);

  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [loopLength, setLoopLength] = useState(1);

  const dispatch = useDispatch();

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
      Transport.loopEnd = '1:0:0';
      Transport.start();
      setPlaying(true);
    } else {
      Transport.stop();
      Transport.cancel();
      Transport.loop = false;
      Transport.loopEnd = 0;
      setPlaying(false);
    }
  }

  function handleChangeBpm(event) {
    dispatch(setBpm(Number(event.target.value)));
  }

  return (
    <div>
      <label htmlFor="bars">Bars</label>
      <input
        name="bars"
        type="number"
        min="1"
        max="4"
        defaultValue="1"
        onChange={(e) => setLoopLength(e.target.value)}
      />

      <input
        type="range"
        min="40"
        max="200"
        defaultValue="120"
        onChange={handleChangeBpm}
      />

      <IconButton onClick={play}>
        {!playing ? <MdPlayArrow /> : <MdStop />}
      </IconButton>

      <StepPattern playing={playing}></StepPattern>
    </div>
  );
}
