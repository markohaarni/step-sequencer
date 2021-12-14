import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { setBpm } from './sequencerSlice';
import { usePointerPressed } from '../../hooks';
import InfoBox from './InfoBox';

export default function TempoControl({ bpm }) {
  const dispatch = useDispatch();

  const ref = useRef(null);
  const pointerPressed = usePointerPressed(ref);

  useEffect(() => {
    function handlePointerMove(e) {
      document.body.style.cursor = 'auto';

      if (pointerPressed && e.pointerType === "mouse") {
        document.body.style.cursor = 'ns-resize';
        dispatch(setBpm(bpm + -e.movementY));
      }
    }

    document.addEventListener('pointermove', handlePointerMove);

    return function () {
      document.removeEventListener('pointermove', handlePointerMove);
    };
  }, [pointerPressed, dispatch, bpm]);

  return (
    <InfoBox value={bpm} label="Tempo" className="cursor-ns-resize" ref={ref} />
  );
}

TempoControl.propTypes = {
  bpm: PropTypes.number,
};
