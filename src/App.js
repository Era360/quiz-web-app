import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/login';
import Quiz from './components/Quiz/quiz';
import SignUp from './components/signup';
import Welcome from './components/welcome';
import { auth } from './firebase';

function App() {
  const [currentUser, setCurrentUser] = useState();
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (initializing) setInitializing(false);
    });
    return subscriber;
  }, [initializing])

  if (initializing) return null;

  return (
    <>
      <Router>
        <Routes>
          <Route element={<Welcome getUser={currentUser} />} path="/" />
          <Route element={<Quiz getUser={currentUser} />} path="/quiz" />
          <Route element={<Login />} path="/login" />
          <Route element={<SignUp />} path="/signup" />
        </Routes>
      </Router>
    </>
  );
}

export default App;
