import React from "react";

import { getRecentWotds } from "../utils/firebase";

type WotdScreenProps = {};
const WotdScreen: React.FC<WotdScreenProps> = () => {
  //console.log(`etymologyScreen ${word}`)
  // const { from } = props.location.state;
  React.useEffect(() => {
    getRecentWotds();

    //   const button = document.querySelector('[data-provider-id="password"]')
    //   const [icon, text] = button?.children ?? []
    //   if (text) {
    //     text.innerHTML = `Sign in/up with Email`
    //   }
    // })
  }, []);

  return null;
};

export default WotdScreen;
