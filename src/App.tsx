import React from "react";
import {
  Switch as RouterSwitch,
  Route,
  Redirect,
  BrowserRouter as Router,
} from "react-router-dom";
import { auth } from "./utils/firebase";
import LoginScreen from "./components/LoginScreen";

import logo from "./logo.svg";
import "./App.css";

const App = () => {
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    auth().onAuthStateChanged((user) => {
      if (user) {
        setLoggedIn(true);
        setLoading(false);
      } else {
        setLoggedIn(false);
        setLoading(false);
      }
    });
  }, []);

  return (
    <div className="App">
      <Router>
        <RouterSwitch>
          <LoginRoute
            path={`/login`}
            loggedIn={loggedIn}
            component={LoginScreen}
          />
          <Route path={`/`}>
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <p>
                Edit <code>src/App.tsx</code> and save to reload.
              </p>
              <a
                className="App-link"
                href="https://reactjs.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn React
              </a>
            </header>
          </Route>
          <PrivateRoute
            path={`/update`}
            loggedIn={loggedIn}
            component={LoginScreen}
          />
        </RouterSwitch>
      </Router>
    </div>
  );
};

export default App;

type LoginRouteProps = {
  component: React.ComponentType<any>;
  path: string;
  loggedIn: boolean;
};
// type ExtendedRouteProps = {
//   location?: H.Location;
//   component?: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
//   render?: (props: RouteComponentProps<any, StaticContext, unknown>) => React.ReactNode;
//   path?: string | string[];
// }
const LoginRoute = ({
  component: Component,
  loggedIn,
  path,
}: LoginRouteProps) => {
  return (
    <Route //<ExtendedRouteProps>
      path={path}
      render={(props: any) => {
        // @ts-ignore // Not sure how to extract the type here
        const redirectUrl = props?.location?.state?.from?.pathname ?? "/";
        return loggedIn === false ? (
          <Component {...props} />
        ) : (
          <Redirect to={`${redirectUrl}`} />
        );
      }}
    />
  );
};

type PrivateRouteProps = {
  component: React.ComponentType<any>;
  path: string;
  loggedIn: boolean;
};
const PrivateRoute = ({
  component: Component,
  loggedIn,
  path,
}: PrivateRouteProps) => {
  return (
    <Route
      path={path}
      render={(props: any) =>
        loggedIn === true ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};
