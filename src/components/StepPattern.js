import { useEffect, useState } from 'react';
import { useGrid, useSynth } from '../hooks';
import * as Tone from 'tone';
import styles from './StepPattern.module.css';
import classNames from 'classnames';

export default function StepPattern({ notes }) {
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(null);

  const [grid, dispatch] = useGrid(notes, 8);

  const synth = useSynth();

  useEffect(() => {
    if (!playing) {
      return;
    }

    // Remove all ToneEvents before scheduling new ones
    Tone.Transport.cancel();

    const notes = [];

    for (let i = 0; i < grid.length; i++) {
      const row = grid[i];

      for (let j = 0; j < row.length; j++) {
        const time = j / 2;
        const note = row[j];

        notes.push({
          time: `0:${time}`,
          note,
          velocity: 1,
          index: j,
        });
      }
    }

    // Create new Part, which is a collection of ToneEvents,
    // which can be started/stopped and looped as a single unit
    new Tone.Part((time, { note, velocity, index }) => {
      // Set the value of current beat, which is used to visualize,
      // which column is currently playing
      setCurrentBeat(index);
      if (note.isActive) {
        synth.triggerAttackRelease(note.note, '8n', time, velocity);
      }
    }, notes).start(0);
  }, [grid, synth, playing]);

  async function play() {
    if (!started) {
      await Tone.start();
      Tone.getDestination().volume.rampTo(-10, 0.001);
      Tone.Transport.bpm.value = 120;
      setStarted(true);
    }

    if (!playing) {
      Tone.Transport.loop = true;
      Tone.Transport.loopStart = 0;
      Tone.Transport.loopEnd = (8 * 30) / 120;
      Tone.Transport.start();
      setPlaying(true);
    } else {
      Tone.Transport.stop();
      Tone.Transport.cancel();
      Tone.Transport.loop = false;
      Tone.Transport.loopEnd = 0;
      setCurrentBeat(null);
      setPlaying(false);
    }
  }

  function handleNoteClick(rowIndex, noteIndex) {
    dispatch({
      type: 'note-active',
      payload: { rowIndexToFind: rowIndex, noteIndexToFind: noteIndex },
    });
  }

  function handleRowAdd() {
    dispatch({ type: 'add-row', payload: 'F3' });
  }

  function handleRowRemove() {
    dispatch({ type: 'remove-row' });
  }

  if (!grid) {
    return null;
  }

  const noteGrid = grid.map((row, rowIndex) => (
    <div className={styles.row} key={rowIndex + 'row'}>
      <span className="mr5">{grid[rowIndex][0].note}</span>
      <div>
        {row.map(({ note, isActive }, noteIndex) => (
          <NoteButton
            note={note}
            isActive={isActive}
            columnActive={noteIndex === currentBeat}
            onClick={() => handleNoteClick(rowIndex, noteIndex)}
            key={note + noteIndex}
          />
        ))}
      </div>
    </div>
  ));

  return (
    <div className={styles.container}>
      {noteGrid}

      <button className="mt10" onClick={play}>
        {!playing ? 'Play' : 'Stop'}
      </button>

      <button onClick={handleRowAdd}>+</button>
      <button onClick={handleRowRemove}>-</button>
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
