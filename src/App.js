import './App.css';
import StepPattern from './components/StepPattern';

const notes = ['F4', 'Eb4', 'C4', 'Bb3', 'Ab3', 'F3'];

function App() {
  return (
    <div className="App">
      <StepPattern notes={notes}></StepPattern>
    </div>
  );
}

export default App;
