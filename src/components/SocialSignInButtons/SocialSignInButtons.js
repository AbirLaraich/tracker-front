import React from "react";
import CustomButton from "../customButton/CustomButton";

const SocialSignInButtons = () => {
    const onSignInWithGoogle = () => {
        console.warn("onSignInWithGoogle");
      };
    
      const onSignInWithApple = () => {
        console.warn("onSignInWithApple");
      };
    
  return (
    <>
      <CustomButton
        text="Sign In with Google"
        onPress={onSignInWithGoogle}
        bgColor="#FAE9EA"
        fgColor="#DD4D44"
      />
      <CustomButton
        text="Sign In with Apple"
        onPress={onSignInWithApple}
        bgColor="#e3e3e3"
        fgColor="#363636"
      />
    </>
  );
};

export default SocialSignInButtons;