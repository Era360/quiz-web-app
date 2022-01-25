import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/login';
import Quiz from './components/quiz';
import SignUp from './components/signup';
import Welcome from './components/welcome';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route element={<Welcome />} path="/" />
          <Route element={<Quiz />} path="/quiz" />
          <Route element={<Login />} path="/login" />
          <Route element={<SignUp />} path="/signup" />
        </Routes>
      </Router>
    </>
  );
}

export default App;
