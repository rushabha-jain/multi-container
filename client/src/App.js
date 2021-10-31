import "./App.css";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import OtherPage from "./OtherPage";
import Fib from "./Fib";

function App() {
  return (
    <Router>
      <div className="App">
        <header>
          Learn React
          <Link to="/">Home</Link>
          <Link to="/otherpage">Other Page</Link>
        </header>
        <div>
          <Switch>
            <Route exact path="/">
              <Fib />
            </Route>
            <Router path="/otherpage">
              <OtherPage />
            </Router>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
