import { useEffect, useState } from 'react';
import { PolySynth } from 'tone';

/**
 * Create Tone.js synth
 * @returns Tone.js Polysynth
 */
export function useSynth() {
  const [synth, setSynth] = useState();

  useEffect(() => {
    if (window.AudioBuffer === undefined) {
      return;
    }

    const synthToCreate = new PolySynth().toDestination();

    setSynth(synthToCreate);

    return function cleanup() {
      synthToCreate.dispose();
    };
  }, []);

  return synth;
}
