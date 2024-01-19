
import { useMemo, useState } from "react";
import "./styles/App.css";
import {
  BrowserRouter as Router,
  Route,
  Navigate,
  Routes,
} from "react-router-dom";
import { UserContext } from "./context/UserContext";
import { WaitingRoom } from "./pages/WaitingRoom";
import { MeetingRoom } from "./pages/MeetingRoom";

function App() {
  const [user, setUser] = useState({
    username: localStorage.getItem("username") || `U${ Date.now() }`,
    defaultSettings: {
      publishAudio: localStorage.getItem("defaultPublishAudio")? localStorage.getItem("defaultPublishAudio") === "true" : true,
      publishVideo: localStorage.getItem("defaultPublishVideo")? localStorage.getItem("defaultPublishVideo") === "true" : true,
    },
  });

  const value = useMemo(() => ({ user, setUser }), [ user, setUser ]);

  return (
    <div className="App">
    <Router>
      <UserContext.Provider value={value}>
        <Routes>
          <Route path="/meeting-room" exact element={ <MeetingRoom /> } />
          <Route path="/waiting-room" exact element={ <WaitingRoom /> } />
          <Route path="/" element={<Navigate replace to="/waiting-room" />} />
        </Routes>
      </UserContext.Provider>
    </Router>
    </div>
  );
}

export default App;
