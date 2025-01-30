import { useState } from "react";
import "./login.css";

const Login = ({ setUser, setUsername }) => {
  const [avatar, setAvatar] = useState({
    file: null,
    url: ""
  });

  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });

  // ユーザー名とパスワードの認証情報
  const validCredentials = {
    Wada: "1234",
    Hoshino: "5678"
  };

  // アバター画像の処理
  const handleAvatar = (e) => {
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0])
      });
    }
  };

  // フォームの入力を更新
  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  // サインイン処理
  const handleSignIn = (e) => {
    e.preventDefault();
    const { username, password } = credentials;

    if (validCredentials[username] === password) {
      setUser(true);
       // ユーザーが認証された場合、user 状態を true に設定
      setUsername(username); // ユーザー名をセット
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="login">
      <div className="item">
        <h2>Welcome back,</h2>
        <form onSubmit={handleSignIn}>
          <input
            type="text"
            placeholder="Username"
            name="username"
            value={credentials.username}
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
          />
          <button type="submit">Sign In</button>
        </form>
      </div>
      {/* <div className="separator"></div>
      <div className="item">
        <h2>Create an Account</h2>
        <form>
          <label htmlFor="file">
            <img src={avatar.url || "avatar.png"} alt="" />
            Upload an image
          </label>
          <input type="file" id="file" style={{ display: "none" }} onChange={handleAvatar} />
          <input type="text" placeholder="Username" name="username" />
          <input type="text" placeholder="Email" name="email" />
          <input type="password" placeholder="Password" name="password" />
          <button>Sign Up</button>
        </form>
      </div> */}
    </div>
  );
};

export default Login;
