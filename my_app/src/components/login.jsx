// src/components/Login.jsx
import React, { useState } from "react";
import * as Components from './styles';

function Login({ $signin }) {
  return (
    <Components.SignInContainer $signin={$signin}>
      <Components.Form>
        <Components.Title>Sign In</Components.Title>
        <Components.Input type="email" placeholder="Email" />
        <Components.Input type="password" placeholder="Password" />
        <Components.Anchor href="#">Forgot your password?</Components.Anchor>
        <Components.Button>Sign In</Components.Button>
      </Components.Form>
    </Components.SignInContainer>
  );
}

export default Login;


