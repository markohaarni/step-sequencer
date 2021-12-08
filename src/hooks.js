import { useEffect, useState } from 'react';
import {
  PolySynth,
  MembraneSynth,
  DuoSynth,
  MetalSynth,
  PluckSynth,
} from 'tone';

const ToneInstruments = {
  polySynth: PolySynth,
  membraneSynth: MembraneSynth,
  duoSynth: DuoSynth,
  metalSynth: MetalSynth,
  pluckSynth: PluckSynth,
};

/**
 * Create Tone.js Instrument
 * @returns Tone.js Instrument
 */
export function useInstrument(type) {
  const [instrument, setInstrument] = useState();

  useEffect(() => {
    if (window.AudioBuffer === undefined) {
      return;
    }

    const instumentToCreate = new ToneInstruments[type]().toDestination();

    setInstrument(instumentToCreate);
  }, [type]);

  return instrument;
}

/**
 * Check if pointer is currently pressed
 * @param {import("react").Ref} ref React ref
 * @returns {boolean} is pointer pressed
 */
export function usePointerPressed(ref) {
  const [pointerPressed, setPointerPressed] = useState(false);

  useEffect(() => {
    if (!ref || !ref.current) {
      return;
    }

    const refCurrent = ref.current;

    const handlePointerDown = () => setPointerPressed(true);
    const handlePointerUp = () => setPointerPressed(false);

    refCurrent.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('pointerup', handlePointerUp);

    return function () {
      refCurrent.removeEventListener('pointerup', handlePointerUp);
      document.removeEventListener('pointerup', handlePointerUp);
    };
  }, [ref]);

  return pointerPressed;
}
