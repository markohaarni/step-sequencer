import { useEffect, useReducer, useState } from 'react';
import { Synth, PolySynth } from 'tone';

/**
 * Create Tone.js synth
 * @returns Tone.js Polysynth
 */
export function useSynth() {
  const [synth, setSynth] = useState();

  useEffect(() => {
    const synthToCreate = new PolySynth().toDestination();

    setSynth(synthToCreate);

    return function cleanup() {
      synthToCreate.dispose();
    };
  }, []);

  return synth;
}

/**
 * Create Tone.js synths
 * @param {number} count number of synths to create
 * @returns array of Tone.js synths
 */
export function useSynths(count) {
  const [synths, setSynths] = useState();

  useEffect(() => {
    const synthsToCreate = [];

    for (let i = 0; i < count; i++) {
      const synth = new Synth().toDestination();

      synthsToCreate.push(synth);
    }

    setSynths(synthsToCreate);

    return function cleanup() {
      synthsToCreate.forEach((s) => s.dispose());
    };
  }, [count]);

  return synths;
}

export function useGrid(notes, subDivisions = 8) {
  function makeRow(note) {
    const row = [];
    for (let i = 0; i < subDivisions; i++) {
      row.push({ note, isActive: false });
    }
    return row;
  }

  function setNoteActive(state, { rowIndexToFind, noteIndexToFind }) {
    const newState = state.map((row, rowIndex) => {
      return row.map((note, noteIndex) => {
        if (rowIndex === rowIndexToFind && noteIndex === noteIndexToFind) {
          return {
            ...note,
            isActive: !note.isActive,
          };
        }
        return note;
      });
    });

    return newState;
  }

  function initState(initialNotes) {
    const rows = [];

    for (let note of initialNotes) {
      const row = makeRow(note);
      rows.push(row);
    }

    return rows;
  }

  function reducer(state, action) {
    switch (action.type) {
      case 'note-active':
        return setNoteActive(state, action.payload);
      case 'add-row':
        return [...state, makeRow(action.payload)];
      case 'remove-row':
        return state.slice(0, state.length - 1);
      case 'reset':
        return initState(notes);
      default:
        throw new Error('Wrong action type!');
    }
  }

  const [grid, dispatch] = useReducer(reducer, notes, initState);

  return [grid, dispatch];
}
