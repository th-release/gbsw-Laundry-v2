const preventDefault = (f) => (e) => {
  e.preventDefault()
  f(e)
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      password: '',
    };
  }

  login = preventDefault(async () => {
    var spe = this.state.id.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);
    var korean = this.state.id.search(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/gi); 
    if ((this.state.id.length < 4) || (this.state.id.length > 25)) {
      return toast("error", { message: "아이디를 4자리 ~ 24자리 이내로 입력해주세요.", duration: 1000 });
    }
    if (this.state.id.search(/₩s/) != -1) {
      return toast("error", { message: "아이디는 공백없이 입력해주세요.", duration: 1000 });
    }
    if (spe > 0 || korean > 0) {
      return toast("error", { message: "아이디는 영문, 숫자만 입력해주세요.", duration: 1000 })
    }

    const res = await fetch('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: this.state.id,
        password: this.state.password,
      }),
    }).then((res) => res.json())
    if (res.statusCode === 200) {
      document.cookie = `auth_token=${res.token}; path=/`
      toast("success", { message: res.message, duration: 1000 })
      setTimeout(() => {
        window.location.href = '/panel'
      }, 750)
    } else {
      toast("error", { message: res.message, duration: 1000 })
    }
  })

  render() {
    return (
      <div>
        <div className="WidthScreen HeightScreen">
          <div className="FlexContainer">
            <div className="login">
              <div className="logo">
                <div className="flex">
                  <img className="icon_logo" src="/img/logo.png" />
                  <div className="logo_text">
                    <h3>경북소프트웨어고등학교</h3>
                    <p>로그인 서비스</p>
                  </div>
                </div>
              </div>
              <div className="ShadowBox">
                <div className="Box">
                  <h3 className="BoxTitle">Login</h3>
                  <form onSubmit={this.login}>
                    <input type="text" id="id" placeholder="아이디를 입력하세요" onChange={(e) => this.setState({ id: e.target.value })} autoComplete="off" required />
                    <input type="password" id="pw" placeholder="비밀번호를 입력하세요" onChange={(e) => this.setState({ password: e.target.value })} autoComplete="off" required />
                    <input type="submit" className="LoginBtn" value="로그인" />
                    <a href="/auth/signup"><input type="button" className="RegistBtn" value="회원가입"/></a>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('react-root'));
