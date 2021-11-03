import PropTypes from 'prop-types';
import { Listbox, ListboxOption } from '@reach/listbox';
import '@reach/listbox/styles.css';
import styles from './NoteSelect.module.css';

const possibleNotes = [
  'F4',
  'Eb4',
  'C4',
  'Bb3',
  'Ab3',
  'F3',
  'Eb3',
  'C3',
  'Bb2',
  'Ab2',
  'F2',
];

export default function NoteSelect({
  selectedNote,
  onNoteSelect,
  rowIndex,
  ...rest
}) {
  return (
    <Listbox
      value={selectedNote}
      onChange={(value) => onNoteSelect(value, rowIndex)}
      className={styles.noteSelect}
      {...rest}
    >
      {possibleNotes.map((note) => (
        <ListboxOption key={note} value={note} className="w-full">
          {note}
        </ListboxOption>
      ))}
    </Listbox>
  );
}

NoteSelect.propTypes = {
  selectedNote: PropTypes.string,
  onNoteSelect: PropTypes.func,
  rowIndex: PropTypes.number,
};
