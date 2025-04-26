// src/components/App.jsx
import React from "react";
import Login from './Login';
import Register from './Register';
import * as Components from './styles';

function App() {
  const [signin, toggle] = React.useState(true);

  return (
    <Components.Container>
      {signin ? <Login $signin={signin} /> : <Register $signin={signin} />}
      
      <Components.OverLayContainer $signin={signin}>
        <Components.OverLay $signin={signin}>
          <Components.LeftOverLayPanel $signin={signin}>
            <Components.Title>Welcome Back!</Components.Title>
            <Components.Paragrph>
              To keep connected with us please login with your personal info
            </Components.Paragrph>
            <Components.GhostButton onClick={() => toggle(true)}>
              Sign In
            </Components.GhostButton>
          </Components.LeftOverLayPanel>

          <Components.RightOverlayPane $signin={signin}>
            <Components.Title>Hello, Friend!</Components.Title>
            <Components.Paragrph>
              Enter your personal details and start your journey with us
            </Components.Paragrph>
            <Components.GhostButton onClick={() => toggle(false)}>
              Sign Up
            </Components.GhostButton>
          </Components.RightOverlayPane>
        </Components.OverLay>
      </Components.OverLayContainer>
    </Components.Container>
  );
}

export default App;
