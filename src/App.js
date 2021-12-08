import './App.css';
import Sequencer from './features/sequencer/Sequencer';

function App() {
  return (
    <div className="App py-8 px-2 sm:px-8">
      <h1 className="text-2xl mb-2">Step sequencer</h1>
      <Sequencer />
    </div>
  );
}

export default App;
