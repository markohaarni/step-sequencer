import PropTypes from 'prop-types';
import ProjectDisplay from './ProjectDisplay';
import IconButton from '../../components/buttons/IconButton';
import { MdPlayArrow, MdStop } from 'react-icons/md';

export default function ControlBar({
  onPlay,
  playing,
  transportPosition,
  bpm,
}) {
  return (
    <div className="flex justify-center items-center">
      <IconButton onClick={onPlay}>
        {!playing ? <MdPlayArrow /> : <MdStop />}
      </IconButton>
      <ProjectDisplay transportPosition={transportPosition} bpm={bpm} />
    </div>
  );
}

ControlBar.propTypes = {
  onPlay: PropTypes.func,
  playing: PropTypes.bool,
  transportPosition: PropTypes.string,
  bpm: PropTypes.number,
};
