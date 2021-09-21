import { createSlice } from '@reduxjs/toolkit';

const initialNotes = ['F4', 'Eb4', 'C4', 'Bb3', 'Ab3', 'F3'];
const initialStepLength = 16;
const initialSteps = 16;

function buildRow(note, subDivisions) {
  const row = { note, cells: [] };
  for (let i = 0; i < subDivisions; i++) {
    row.cells.push({ isActive: false });
  }
  return row;
}

function buildGrid(notes, subDivisions = 16) {
  const rows = [];
  for (let note of notes) {
    const row = buildRow(note, subDivisions);
    rows.push(row);
  }
  return rows;
}

export const slice = createSlice({
  name: 'sequencer',
  initialState: {
    bpm: 120,
    volume: -10,
    grid: buildGrid(initialNotes, initialSteps),
    steps: initialSteps, // Number if steps in the grid: ;
    stepLength: initialStepLength, // Length of each step (8th note, 16th note)
  },
  reducers: {
    incrementBpm: (state) => {
      state.bpm += 1;
    },
    decrementBpm: (state) => {
      state.bpm -= 1;
    },
    setBpm: (state, action) => {
      let bpm = action.payload;
      // Make sure that tempo is within acceptable bounds
      if (bpm < 40) {
        bpm = 40;
      }
      if (bpm > 300) {
        bpm = 300;
      }
      state.bpm = bpm;
    },
    changeNote: (state, action) => {
      const { newNote, rowIndex } = action.payload;
      state.grid[rowIndex].note = newNote;
    },
    toggleNoteActive: (state, action) => {
      const { rowIndex, cellIndex } = action.payload;
      const row = state.grid[rowIndex];
      row.cells[cellIndex].isActive = !row.cells[cellIndex].isActive;
    },
    changeStepAmount: (state, action) => {
      const stepAmount = action.payload;

      state.steps = stepAmount;

      state.grid.forEach((row) => {
        let newCells = [];
        for (let i = 0; i < stepAmount; i++) {
          if (row.cells[i]) {
            newCells.push(row.cells[i]);
          } else {
            newCells.push({ isActive: false });
          }
        }
        row.cells = newCells;
      });
    },
    changeStepLength: (state, action) => {
      state.stepLength = action.payload;
    },
  },
});

export const {
  incrementBpm,
  decrementBpm,
  setBpm,
  changeNote,
  toggleNoteActive,
  changeStepAmount,
  changeStepLength,
} = slice.actions;

export const selectBpm = (state) => state.sequencer.bpm;
export const selectVolume = (state) => state.sequencer.volume;
export const selectGrid = (state) => state.sequencer.grid;
export const selectSteps = (state) => state.sequencer.steps;
export const selectStepLength = (state) => state.sequencer.stepLength;

export default slice.reducer;
