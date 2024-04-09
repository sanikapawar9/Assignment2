import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import TodoTable from './components/TodoTable';

function App() {
  return (
    <div className="App">
      <h1 className='text-center'>Todos List</h1>
      <TodoTable />
    </div>
  );
}

export default App;
