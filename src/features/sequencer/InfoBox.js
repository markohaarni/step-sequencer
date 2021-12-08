import classNames from 'classnames';
import PropTypes from 'prop-types';
import { forwardRef } from 'react';

const InfoBox = forwardRef(({ value, label, className }, ref) => {
  return (
    <section className={classNames('select-none', className)} ref={ref}>
      <div data-testid={`value-${label}`}>{value}</div>
      <p className="text-xs text-gray-500 uppercase">{label}</p>
    </section>
  );
});

export default InfoBox;

InfoBox.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  label: PropTypes.string,
  className: PropTypes.string,
};
