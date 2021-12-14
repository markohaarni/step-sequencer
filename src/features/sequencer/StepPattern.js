import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Part, Transport } from 'tone';
import { Listbox, ListboxOption } from '@reach/listbox';
import '@reach/listbox/styles.css';
import styles from './StepPattern.module.css';
import classNames from 'classnames';
import NoteSelect from './NoteSelect';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectGrid,
  selectInstrument,
  changeNote,
  toggleNoteActive,
  changeStepAmount,
  changeStepLength,
  setTransportPosition,
  changeInstrument,
  availableInstruments,
} from './sequencerSlice';
import { useInstrument } from '../../hooks';

export default function StepPattern({ playing, loopLength, stepLength }) {
  const grid = useSelector(selectGrid);
  const selectedInstrument = useSelector(selectInstrument);

  const [currentColumn, setCurrentColumn] = useState(null);

  const toneInstrument = useInstrument(selectedInstrument.type);

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
        const sixteenths = (16 / stepLength) * j;
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

      // Set Transport.position to store. Position is in
      // format BARS:QUARTERS:SIXTEENTHS as string
      dispatch(setTransportPosition(Transport.position));

      if (isActive) {
        toneInstrument.triggerAttackRelease(
          note,
          `${stepLength}n`,
          time,
          velocity
        );
      }
    }, events).start(0);
  }, [grid, toneInstrument, playing, stepLength, loopLength, dispatch]);

  function handleNoteClick(rowIndex, cellIndex) {
    dispatch(toggleNoteActive({ rowIndex, cellIndex }));
  }

  function handleNoteSelect(newNote, rowIndex) {
    dispatch(changeNote({ newNote, rowIndex }));
  }

  function handleStepAmountChange(value) {
    dispatch(changeStepAmount(Number(value)));
  }

  function handleStepLengthChange(value) {
    dispatch(changeStepLength(Number(value)));
  }

  function handleChangeInstrument(instrumentType) {
    dispatch(
      changeInstrument(
        availableInstruments.find((inst) => inst.type === instrumentType)
      )
    );
  }

  if (!grid) {
    return null;
  }

  const noteGrid = grid.map((row, rowIndex) => {
    const note = row.note;
    return (
      <div
        data-testid="note-grid-row"
        className={classNames(styles.row, 'p5')}
        key={rowIndex + 'row'}
      >
        <div className="mr5">
          <NoteSelect
            selectedNote={note}
            rowIndex={rowIndex}
            onNoteSelect={handleNoteSelect}
          ></NoteSelect>
        </div>
        <div className={classNames(styles.rowCells, 'w-full')}>
          {row.cells.map(({ isActive }, cellIndex) => (
            <NoteButton
              note={note}
              isActive={isActive}
              columnActive={cellIndex === currentColumn}
              stepLength={stepLength}
              onClick={() => handleNoteClick(rowIndex, cellIndex)}
              key={note + cellIndex}
              data-testid="note-grid-cell"
            />
          ))}
        </div>
      </div>
    );
  });

  return (
    <div className={classNames(styles.container, 'w-full max-w-7xl')}>
      <div className={classNames(styles.header, 'p5')}>
        <Listbox
          value={selectedInstrument.type}
          onChange={handleChangeInstrument}
        >
          {availableInstruments.map((instrument) => {
            return (
              <ListboxOption key={instrument.type} value={instrument.type}>
                {instrument.name}
              </ListboxOption>
            );
          })}
        </Listbox>

        <div className="df">
          <Listbox
            defaultValue="16"
            onChange={handleStepLengthChange}
            className="mr5"
          >
            <ListboxOption value="8">/8</ListboxOption>
            <ListboxOption value="16">/16</ListboxOption>
          </Listbox>

          <Listbox defaultValue="16" onChange={handleStepAmountChange}>
            <ListboxOption value="8">8 Steps</ListboxOption>
            <ListboxOption value="16">16 Steps</ListboxOption>
          </Listbox>
        </div>
      </div>

      {noteGrid}
    </div>
  );
}

function NoteButton({
  note,
  isActive,
  columnActive,
  stepLength,
  onClick,
  ...rest
}) {
  return (
    <button
      className={classNames(styles.cell, {
        [styles.cellActive]: isActive,
        [styles.columnActive]: columnActive,
        [styles.cell8]: stepLength === 8,
        [styles.cell16]: stepLength === 16,
      })}
      onClick={onClick}
      {...rest}
    />
  );
}

StepPattern.propTypes = {
  playing: PropTypes.bool,
  loopLength: PropTypes.number,
  stepLength: PropTypes.number,
};

NoteButton.propTypes = {
  note: PropTypes.string,
  isActive: PropTypes.bool,
  columnActive: PropTypes.bool,
  stepLength: PropTypes.number,
};
