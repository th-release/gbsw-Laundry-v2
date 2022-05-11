function isNumber(value) {
  return !isNaN(Number(value));
}

const preventDefault = (f) => (e) => {
  e.preventDefault()
  f(e)
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      grade: '',
      id: '',
      password: '',
      class: '',
      number: '',
      name: '',
      phone: '',
      room: '',
    };
  }

  signup = preventDefault(async () => {
    let spe = this.state.id.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);
    let korean = this.state.id.search(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/gi); 
    if ((this.state.id.length < 4) || (this.state.id.length > 25))
      return toast("error", { message: "아이디를 4자리 ~ 24자리 이내로 입력해주세요.", duration: 1000 });
    if (this.state.id.search(/₩s/) != -1)
      return toast("error", { message: "아이디는 공백없이 입력해주세요.", duration: 1000 });
    if (spe > 0 || korean > 0)
      return toast("error", { message: "아이디는 영문, 숫자만 입력해주세요.", duration: 1000 })
    if (!isNumber(this.state.grade) || !isNumber(this.state.class) || !isNumber(this.state.number) || !isNumber(this.state.room)) 
      return toast("error", { message: '학년, 반, 번호, 방 번호는 숫자만 입력해주세요.', duration: 1000 });
    if (this.state.phone.length > 11 || this.state.phone.length < 11) 
      return toast("error", { message: "전화번호를 확인해주세요. <br/>(\"-\"는 포함하지 않습니다.)", duration: 1000});
    const res = await fetch('/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Id: this.state.id,
        Password: this.state.password,
        Grade: this.state.grade,
        Class: this.state.class,
        Number: this.state.number,
        Name: this.state.name,
        Phone: this.state.phone,
        Room: this.state.room
      }),
    }).then((res) => res.json())
    if (res.statusCode === 200) {
      toast("success", { message: res.message, duration: 1000 });
      setTimeout(() => {
        window.location.href = '/auth/login';
      }, 750);
      return
    } else {
      toast("error", { message: res.message, duration: 1000 });
    }
  })


  render() {
    return (
      <div>
        <div style={{position: "fixed", zIndex: 9999, top: '16px', left: '16px', right: '16px', bottom: '16px', pointerEvents: 'none'}}></div>
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
                  <h3 className="BoxTitle">Sign Up</h3>
                  <form onSubmit={this.signup}>
                    <div className="StudentID">
                      <input type="text" id="grade" placeholder="학년" autoComplete="off" required maxLength="1" value={this.state.grade} onChange={(e) => this.setState({ grade: e.target.value })} />
                      <input type="text" id="class" placeholder="반" autoComplete="off" required maxLength="1" value={this.state.class} onChange={(e) => this.setState({ class: e.target.value })} />
                      <input type="text" id="number" placeholder="번호" autoComplete="off" required maxLength="2" value={this.state.number} onChange={(e) => this.setState({ number: e.target.value })} />
                      <input type="text" id="RoomNumber" placeholder="방 번호" autoComplete="off" required maxLength="3" value={this.state.room} onChange={(e) => this.setState({ room: e.target.value })} />
                    </div>
                    <input type="text" id="id" placeholder="아이디" autoComplete="off" required maxLength="24" value={this.state.id} onChange={(e) => this.setState({ id: e.target.value })} /> 
                    <input type="password" id="signup_pw" placeholder="비밀번호" autoComplete="off" required maxLength="24" value={this.state.password} onChange={(e) => this.setState({ password: e.target.value })} /> 
                    <input type="text" id="name" placeholder="이름" autoComplete="off" required maxLength="5" value={this.state.name} onChange={(e) => this.setState({ name: e.target.value })} />
                    <input type="text" id="phone" placeholder="전화번호" autoComplete="off" required maxLength="13" value={this.state.phone} onChange={(e) => this.setState({ phone: e.target.value })} />
                    <div className="SignUp">
                      <input type="submit" className="SignUpBtn" value="가입 요청" />
                      <a href="/auth/login"><input type="button" className="haveAccount" value="계정이 있어요" /></a>
                    </div>
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
