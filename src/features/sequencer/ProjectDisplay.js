import PropTypes from 'prop-types';
import InfoBox from './InfoBox';
import TempoControl from './TempoControl';

export default function ProjectDisplay({ transportPosition, bpm }) {
  let bar = 0,
    beat = 0;
  if (transportPosition) {
    [bar, beat] = transportPosition.split(':');
  }

  return (
    <article className="flex justify-center border border-black rounded px-3 shadow-md w-min bg-white cursor-default">
      <InfoBox value={Number(bar) + 1} label="Bar" className="mr-4" />
      <InfoBox
        value={Number(beat) + 1}
        label="Beat"
        className="pr-2 mr-2 border-r"
      />
      <TempoControl bpm={bpm} />
    </article>
  );
}

ProjectDisplay.propTypes = {
  transportPosition: PropTypes.string,
  bpm: PropTypes.number,
};
