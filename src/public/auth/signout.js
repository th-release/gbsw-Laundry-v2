class App extends React.Component {
  // const [value, setValue] = React.useState({ id, password });
  constructor(props) {
    super(props);
  }

  render() {
    document.cookie = "auth_token="
    toast("success", { message: "로그아웃 되었습니다.", duration: 1000 })
    setTimeout(() => {
      window.location.href = "/auth/login"
    }, 1000)
    return (
      <div>
        로그아웃 중 입니다.<br/><br/>
        잠시만 기다려주세요...
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('react-root'));
