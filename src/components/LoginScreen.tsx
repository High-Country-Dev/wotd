import React from 'react'

// import useWindowDimensions from "../utils/WindowDimensions"
// import { useTheme } from "@material-ui/core/styles"
// import { Button, Theme } from "@material-ui/core/index"
import { auth, loadLoginUi } from '../utils/firebase'

type RerenderProtectorParams = {
  location: { state: { from: string }; search: string }
}
const LoginScreenRerenderProtector = (props: RerenderProtectorParams) => {
  // const { uid } = auth().currentUser ?? {}
  // console.log("login screen props", props)
  // const { height } = useWindowDimensions()
  // const theme = useTheme()

  return <LoginScreen />
}

const LoginScreen = () => {
  //console.log(`etymologyScreen ${word}`)
  // const { from } = props.location.state;
  React.useEffect(() => {
    loadLoginUi()
    // setTimeout(() => {
    //   const button = document.querySelector('[data-provider-id="password"]')
    //   const [icon, text] = button?.children ?? []
    //   if (text) {
    //     text.innerHTML = `Sign in/up with Email`
    //   }
    // })
  }, [])

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
      }}>
      {/* <Button variant="contained" onClick={() => signin('etymology.explorer.developer@gmail.com', 'Nopasses45')}>
          Login
        </Button> */}
      <div id='firebaseui-auth-container'></div>
      {/* Must have loader to call from uiConfig */}
      <div id='loader'>Loading...</div>
    </div>
  )
}

export default LoginScreenRerenderProtector

const signup = (email: string, password: string) => {
  return auth().createUserWithEmailAndPassword(email, password)
}

const signin = (email: string, password: string) => {
  return auth().signInWithEmailAndPassword(email, password)
}
