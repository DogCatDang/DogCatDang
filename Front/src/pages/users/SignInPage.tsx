import { NavLink } from "react-router-dom";
import { useState } from "react";
import { signIn } from "../../util/UserAPI";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Title from "../../components/users/Title";
import Line from "../../components/users/Line";
import { Button } from "../../components/common/Button";

const FormBox = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;

  .img-box {
    width: 40%;

    img {
      width: 80%;
    }
  }
`

const SignInForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  width: 40%;

  input {
    font-size: 22px;
    border: none;
    box-shadow: 0 3.5px 3.5px lightgrey;
    border-radius: 5px;
    padding: .2rem .4rem;
  }

  input, .menus, .button-box {
    width: 18rem;
  }

  .menu, .menus {
    font-size: .8rem;
  }

  label {
    font-weight: bold;
  }

  .err-msg {
    color: red;
    font-size: .8rem;
  }
`

function SignInPage() {
  const navigate = useNavigate();

  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');

  const handleUserName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(() => e.target.value);
  };

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(() => e.target.value);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      username: userName,
      password: password,
    };

    const response = await signIn(data);
    
    if (response.status === 401) {
      setErrMsg('아이디와 비밀번호를 다시 확인해주세요');
      return ;
    }

    navigate("/");
  };

  return (
    <div className="flex flex-col justify-center h-screen gap-5">
      <Title title="로그인" />
      <FormBox>
        <div className="img-box flex justify-center">
          <img src="/src/assets/auth-image.png" alt="" />
        </div>
        <Line />
        <SignInForm onSubmit={onSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="username">ID</label>
            <input
              type="text"
              name="username"
              id="username"
              onChange={handleUserName}
              />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password">PW</label>
            <input
              type="password"
              name="password"
              id="password"
              onChange={handlePassword}
              />
          </div>
          { errMsg &&  <p className="err-msg">{errMsg}</p> }
          <div className="menus flex gap-2 items-center justify-center">
            <NavLink to="/signup" className="menu">회원가입</NavLink>
            |
            <span className="menu">ID 찾기</span>
            |
            <span className="menu">Password 찾기</span>
          </div>
          <div className="button-box flex justify-center">
            <Button>로그인</Button>
          </div>
          <div className="flex gap-2 mt-1">
            <img src="/src/assets/naverLoginBtn.png" alt="" />
            <img src="/src/assets/googleLoginBtn.png" alt="" />
          </div>
        </SignInForm>
      </FormBox>
    </div>
  );
}

export default SignInPage;

export const isOrg = () =>
  JSON.parse(localStorage.getItem("userInfo") || "{}").role === "ROLE_SHELTER";
export const isUser = () =>
  JSON.parse(localStorage.getItem("userInfo") || "{}")?.id ? true : false;
