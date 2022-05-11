const preventDefault = (f) => (e) => {
  e.preventDefault()
  f(e)
}

function App() {
  const [data, setData] = React.useState(null)

  React.useEffect(() => {
    fetch('/panel/GetData?type=Main', {
      method: 'post'
    }).then(res => res.json())
      .then(data => setData(data))
  }, [])

  if (!data) {
    toast("info", { message: "데이터를 불러오는 중입니다.", duration: 300 })
    return (
      <div>
        <div id="loading"></div>
      </div>
    )
  } else {
    if (data.statusCode === 200) {
      setTimeout(() => {
        if (data.message.length > 0) {
          toast("success", { message: data.message, duration: 700 })
        }
      }, 300);
      return (
        <div>
          {Object.values(data.projects).map((project) => (
            <div key={1} className="box2" onClick={() => window.location.href = project.redirect}>
              <div className="image" style={{ backgroundImage: "url(" + project.image + ")" }}>
                <div className="titleShadow">
                  <div className="textShadow">
                    <h1>{project.name}</h1>
                    <p1>{project.description}</p1>
                  </div>
                </div>
              </div>
              <br/>
            </div>
          ))}
          <div style={{ marginBottom: '60px'}}></div>
          <a href="/auth/logout"><div className="logout">
            로그아웃 하기
          </div></a>
          <div className="footer">
            © {new Date().getFullYear()}. GBSWHS. 
            <span><a href="https://github.com/gbswhs" target="blank" className="Credits">GITHUB</a></span>
          </div>
        </div>
      );    
    } else {
      setTimeout(() => {
        toast("error", { message: data.message, duration: 700 })
      }, 300);
      setTimeout(() => {
        window.location.href = "/auth/login"
      }, 400)
      return (
        <div></div>
      )
    }
  }


}

ReactDOM.render(<App />, document.getElementById('react-root'));
