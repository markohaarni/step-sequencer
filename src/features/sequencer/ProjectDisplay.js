import classNames from 'classnames';
import PropTypes from 'prop-types';

export default function ProjectDisplay({ transportPosition, bpm }) {
  let bar = 0,
    beat = 0;
  if (transportPosition) {
    [bar, beat] = transportPosition.split(':');
  }

  return (
    <article className="flex justify-center border border-black rounded px-3 shadow-md w-min">
      <InfoBox value={Number(bar) + 1} label="Bar" className="mr-4" />
      <InfoBox
        value={Number(beat) + 1}
        label="Beat"
        className="pr-2 mr-2 border-r"
      />
      <InfoBox value={bpm} label="Tempo" />
    </article>
  );
}

function InfoBox({ value, label, className }) {
  return (
    <section className={classNames(className)}>
      <p data-testid={`value-${label}`}>{value}</p>
      <p className="text-xs text-gray-500 uppercase">{label}</p>
    </section>
  );
}

ProjectDisplay.propTypes = {
  transportPosition: PropTypes.string,
  bpm: PropTypes.number,
};

InfoBox.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  label: PropTypes.string,
  className: PropTypes.string,
};
