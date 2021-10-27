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
