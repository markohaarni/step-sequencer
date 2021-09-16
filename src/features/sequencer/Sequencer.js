import StepPattern from './StepPattern';
import IconButton from '../../components/buttons/IconButton';
import { selectBpm, selectVolume } from './sequencerSlice';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { start, getDestination, Transport } from 'tone';
import { MdPlayArrow, MdStop } from 'react-icons/md';

export default function Sequencer() {
  const bpm = useSelector(selectBpm);
  const volume = useSelector(selectVolume);

  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (Transport.bpm) {
      Transport.bpm.rampTo(bpm, 0.1);
    }
  }, [bpm]);

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
  return (
    <div>
      <IconButton onClick={play}>
        {!playing ? <MdPlayArrow /> : <MdStop />}
      </IconButton>

      <StepPattern playing={playing}></StepPattern>
    </div>
  );
}
