import { useEffect, useState } from 'react';
import { useSynth } from '../../hooks';
import { Part, Transport } from 'tone';
import styles from './StepPattern.module.css';
import classNames from 'classnames';
import NoteSelect from './NoteSelect';
import { useDispatch, useSelector } from 'react-redux';
import { changeNote, toggleNoteActive, selectGrid } from './sequencerSlice';

export default function StepPattern({ playing }) {
  const [currentColumn, setCurrentColumn] = useState(null);

  const grid = useSelector(selectGrid);

  const synth = useSynth();

  const dispatch = useDispatch();

  useEffect(() => {
    if (!playing) {
      setCurrentColumn(null);
      return;
    }

    // Remove all ToneEvents before scheduling new ones
    Transport.cancel();

    const events = [];

    for (let i = 0; i < grid.length; i++) {
      const row = grid[i];
      const note = row.note;

      for (let j = 0; j < row.cells.length; j++) {
        const quarters = j / 2;
        const isActive = row.cells[j].isActive;

        events.push({
          // Schedule the event using time format BARS:QUARTERS:SIXTEENTHS
          time: `0:${quarters}`,
          note,
          isActive,
          velocity: 1,
          index: j,
        });
      }
    }

    // Create new Part, which is a collection of ToneEvents,
    // which can be started/stopped and looped as a single unit
    new Part((time, { note, isActive, velocity, index }) => {
      // Set the value of current subdivision used to visualize
      // which column is currently playing
      setCurrentColumn(index);

      if (isActive) {
        synth.triggerAttackRelease(note, '8n', time, velocity);
      }
    }, events).start(0);
  }, [grid, synth, playing]);

  function handleNoteClick(rowIndex, cellIndex) {
    dispatch(toggleNoteActive({ rowIndex, cellIndex }));
  }

  function handleNoteSelect(newNote, rowIndex) {
    dispatch(changeNote({ newNote, rowIndex }));
  }

  if (!grid) {
    return null;
  }

  const noteGrid = grid.map((row, rowIndex) => {
    const note = row.note;
    return (
      <div className={styles.row} key={rowIndex + 'row'}>
        <NoteSelect
          className="mr5"
          selectedNote={note}
          rowIndex={rowIndex}
          onNoteSelect={handleNoteSelect}
        ></NoteSelect>
        <div>
          {row.cells.map(({ isActive }, cellIndex) => (
            <NoteButton
              note={note}
              isActive={isActive}
              columnActive={cellIndex === currentColumn}
              onClick={() => handleNoteClick(rowIndex, cellIndex)}
              key={note + cellIndex}
            />
          ))}
        </div>
      </div>
    );
  });

  return (
    <div className={styles.container}>
      {noteGrid}
    </div>
  );
}

function NoteButton({ note, isActive, columnActive, ...rest }) {
  return (
    <button
      className={classNames(styles.cell, {
        [styles.cellActive]: isActive,
        [styles.columnActive]: columnActive,
      })}
      {...rest}
    ></button>
  );
}
