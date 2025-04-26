// src/components/styles.jsx
import styled from 'styled-components';

export const Container = styled.div`
  background:rgb(100, 72, 128);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  margin: 0;
  position: relative;
`;

export const SignupContainer = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
  left: 0;
  width: 50%;
  opacity: 0;
  z-index: 1;
  ${props => props.$signin !== true ?`
    transform: translateX(100%);
    opacity: 1;
    z-index: 5;
    `
: null}
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const SignInContainer = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
  left: 0;
  width: 50%;
  z-index: 2;
  ${props => (props.$signin !== true ? `transform: translateX(100%);` : null)}
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Form = styled.form`
  background-color:rgb(249, 248, 249);
  display: flex;
  align-items: left;
  justify-content: center;
  flex-direction: column;
  padding: 0 50px;
  height: 100%;
  text-align: left;
  width: 100%;
`;


export const Title = styled.h1`
  font-weight: bold;
  margin-bottom: 20px;
  font-size: 24px;
`;

export const Input = styled.input`
  background-color: #eee;
  border: none;
  padding: 12px 15px;
  margin: 8px 0;
  width: 100%;
  max-width: 300px;
`;

export const Button = styled.button`
  border-radius: 20px;
  border: 1px solid rgb(121, 54, 246);
  background-color:rgb(187, 155, 209);
  color:rgb(42, 6, 70);
  font-size: 14px;
  font-weight: bold;
  padding: 12px 45px;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: transform 80ms ease-in;
  margin: 20px 0;
  width: 50%;
  &:active {
    transform: scale(0.95);
  }
  &:focus {
    outline: none;
  }
`;

export const GhostButton = styled(Button)`
  background-color: transparent;
  border-color: #ffffff;
  color: #ffffff;
`;

export const Anchor = styled.a`
  color: #333;
  font-size: 14px;
  text-decoration: none;
  margin: 15px 0;
`;

export const OverLayContainer = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: transform 0.6s ease-in-out;
  z-index: 100;
  ${(props) =>
    props.$signin !== true &&
    `
    transform: translateX(-100%);
  `}
`;

export const OverLay = styled.div`
  background: linear-gradient(to right,rgb(113, 8, 183),rgb(121, 36, 177));
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 0 0;
  color: #ffffff;
  position: relative;
  left: -100%;
  height: 100%;
  width: 200%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
  ${(props) =>
    props.$signin !== true &&
    `
    transform: translateX(50%);
  `}
`;

export const OverlayPanel = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 40px;
  text-align: center;
  top: 0;
  height: 100%;
  width: 50%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
`;

export const LeftOverLayPanel = styled(OverlayPanel)`
  transform: translateX(-20%);
  ${(props) =>
    props.$signin !== true &&
    `
    transform: translateX(0);
  `}
`;

export const RightOverlayPane = styled(OverlayPanel)`
  right: 0;
  transform: translateX(0);
  ${(props) =>
    props.$signin !== true &&
    `
    transform: translateX(20%);
  `}
`;

export const Paragrph = styled.p`
  font-size: 14px;
  font-weight: 100;
  line-height: 20px;
  letter-spacing: 0.5px;
  margin: 20px 0 30px;
`;


