import { useEffect, useState } from 'react';
import { useSynth } from '../../hooks';
import { Part, Transport } from 'tone';
import styles from './StepPattern.module.css';
import classNames from 'classnames';
import NoteSelect from './NoteSelect';
import { useDispatch, useSelector } from 'react-redux';
import {
  changeNote,
  toggleNoteActive,
  selectGrid,
  changeStepAmount,
  selectStepLength,
  changeStepLength,
} from './sequencerSlice';

export default function StepPattern({ playing }) {
  const [currentColumn, setCurrentColumn] = useState(null);

  const grid = useSelector(selectGrid);
  const steplength = useSelector(selectStepLength);

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
        const sixteenths = (16 / steplength) * j;
        const isActive = row.cells[j].isActive;

        events.push({
          // Schedule the event using time format BARS:QUARTERS:SIXTEENTHS
          time: `0:0:${sixteenths}`,
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
        synth.triggerAttackRelease(note, `${steplength}n`, time, velocity);
      }
    }, events).start(0);
  }, [grid, synth, playing, steplength]);

  function handleNoteClick(rowIndex, cellIndex) {
    dispatch(toggleNoteActive({ rowIndex, cellIndex }));
  }

  function handleNoteSelect(newNote, rowIndex) {
    dispatch(changeNote({ newNote, rowIndex }));
  }

  function handleStepAmountChange(event) {
    dispatch(changeStepAmount(Number(event.target.value)));
  }

  function handleStepLengthChange(event) {
    dispatch(changeStepLength(Number(event.target.value)));
  }

  if (!grid) {
    return null;
  }

  const noteGrid = grid.map((row, rowIndex) => {
    const note = row.note;
    return (
      <div className={classNames(styles.row, 'p5')} key={rowIndex + 'row'}>
        <div className="mr5">
          <NoteSelect
            selectedNote={note}
            rowIndex={rowIndex}
            onNoteSelect={handleNoteSelect}
          ></NoteSelect>
        </div>
        <div className={styles.rowCells}>
          {row.cells.map(({ isActive }, cellIndex) => (
            <NoteButton
              note={note}
              isActive={isActive}
              columnActive={cellIndex === currentColumn}
              steplength={steplength}
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
      <div className={classNames(styles.header, 'p5')}>
        <p>Synth 1</p>

        <div className="df">
          <select
            defaultValue="16"
            onChange={handleStepLengthChange}
            className="mr5"
          >
            <option value="8">/8</option>
            <option value="16">/16</option>
          </select>

          <select defaultValue="16" onChange={handleStepAmountChange}>
            <option value="8">8 Steps</option>
            <option value="12">12 Steps</option>
            <option value="16">16 Steps</option>
          </select>
        </div>
      </div>

      {noteGrid}
    </div>
  );
}

function NoteButton({ note, isActive, columnActive, steplength, ...rest }) {
  return (
    <button
      className={classNames(styles.cell, {
        [styles.cellActive]: isActive,
        [styles.columnActive]: columnActive,
        [styles.cell8]: steplength === 8,
        [styles.cell16]: steplength === 16,
      })}
      {...rest}
    ></button>
  );
}
