import PropTypes from 'prop-types';

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
    <select
      value={selectedNote}
      onChange={(e) => onNoteSelect(e.target.value, rowIndex)}
      className="text-black"
      {...rest}
    >
      {possibleNotes.map((note) => (
        <option key={note}>{note}</option>
      ))}
    </select>
  );
}

NoteSelect.propTypes = {
  selectedNote: PropTypes.string,
  onNoteSelect: PropTypes.func,
  rowIndex: PropTypes.number,
};
