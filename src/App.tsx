import React from "react";
import {
  unstable_createMuiStrictModeTheme as createMuiTheme,
  ThemeProvider,
} from "@material-ui/core/styles";
import { grey } from "@material-ui/core/colors";
import Button from "@material-ui/core/Button";
import {
  Switch as RouterSwitch,
  Route,
  Redirect,
  BrowserRouter as Router,
} from "react-router-dom";
import { QueryClientProvider, QueryClient } from "react-query";
import { auth } from "./utils/firebase";

import LoginScreen from "./components/LoginScreen";
import WotdScreen from "./components/WotdScreen";

import "./App.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: process.env.NODE_ENV === "production",
      refetchOnWindowFocus: process.env.NODE_ENV === "production",
      refetchOnMount: false,
      cacheTime: 1000 * 60 * 60 * 1,
      staleTime: 1000 * 60 * 60 * 1,
    },
  },
});

const App = () => {
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  const darkMode = true;
  const theme = createMuiTheme({
    palette: {
      type: darkMode ? "dark" : "light",
      text: {
        primary: darkMode ? "#FFF" : "#000",
        secondary: darkMode ? grey[400] : "#333",
      },
      primary: {
        main: darkMode ? "#FFF" : grey[200],
      },
      secondary: {
        main: darkMode ? grey[200] : grey[800],
      },
      background: {
        default: darkMode ? "#FFF" : "#FFF",
      },
      // background: {
      //   ...darkMode
      //   ? { default: '#f0f0f0' }
      //   : {}
      // }
    },
  });

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
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        {loggedIn && (
          <div style={{ position: "absolute", right: 30, top: 30 }}>
            <Button variant="contained" onClick={() => auth().signOut()}>
              Logout
            </Button>
          </div>
        )}
        <Router>
          <RouterSwitch>
            <LoginRoute
              path={`/login`}
              loggedIn={loggedIn}
              component={LoginScreen}
            />
            <PrivateRoute
              path={`/`}
              loggedIn={loggedIn}
              component={WotdScreen}
            />
          </RouterSwitch>
        </Router>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;

type LoginRouteProps = {
  component: React.ComponentType<any>;
  path: string;
  loggedIn: boolean;
};

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
