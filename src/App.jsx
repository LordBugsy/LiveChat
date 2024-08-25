import Login from "./Login Component/Login";
import DataProvider, {DataContext} from "./DataProvider";
import { useContext } from "react";
import LiveChat from "./LiveChat Component/LiveChat";

function App() {
  return (
    <DataProvider>
      <MainApp />
    </DataProvider>
  );
}

function MainApp() {
  const { signUpStatus } = useContext(DataContext);

  return (
    <>
      <LiveChat />
      {signUpStatus && <Login />}
    </>
  );
}

export default App;