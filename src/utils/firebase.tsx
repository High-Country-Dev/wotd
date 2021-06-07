import firebase from "firebase";
import * as FirebaseUI from "firebaseui";
import "firebaseui/dist/firebaseui.css";

// Outdated comment
// https://firebase.google.com/docs/admin/setup#node.js_1

// https://stackoverflow.com/questions/43331011/firebase-app-named-default-already-exists-app-duplicate-app

// console.log("testing the variable REACT_APP_");
// console.log(process.env.REACT_APP_FIREBASE_CONFIG_BASE64);

if (!firebase.apps.length) {
  const base64_config: string | undefined =
    process.env.REACT_APP_FIREBASE_CONFIG_BASE64;
  if (!base64_config) {
    throw new Error(
      "No firebase config provided! Have you created a .env.local file?"
    );
  }
  const firebaseConfig = JSON.parse(
    Buffer.from(base64_config ?? "", "base64").toString("ascii")
  );
  console.log(firebaseConfig);
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}

export const auth = firebase.auth;
export const db = firebase.database();
export const analytics = firebase.analytics();

export const ui = new FirebaseUI.auth.AuthUI(firebase.auth());

export const uiConfig = {
  callbacks: {
    // @ts-ignore
    signInSuccessWithAuthResult: (authResult, redirectUrl) => {
      // User successfully signed in.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.
      return true;
    },
    uiShown: function () {
      // The widget is rendered.
      // Hide the loader.
      // @ts-ignore
      const loader = document.getElementById("loader");
      if (loader !== null) {
        loader.style.display = "none";
      }
    },

    // TODO PUBLISH: also need to upgrade anonymous users
    // https://firebase.google.com/docs/auth/web/firebaseui#upgrading_anonymous_users
  },
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    // TODO PUBLISH need apple login
    //   firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    //   firebase.auth.GithubAuthProvider.PROVIDER_ID
  ],
  // Terms of service url.
  tosUrl: "https://www.etymologyexplorer.com/terms_and_conditions",
  // Privacy policy url.
  privacyPolicyUrl: "https://www.etymologyexplorer.com/privacy_policy",
  // Other config options...
};

export const loadLoginUi = () => {
  ui.start("#firebaseui-auth-container", uiConfig);
};
