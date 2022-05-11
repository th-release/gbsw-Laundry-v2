const preventDefault = (f) => (e) => {
  e.preventDefault()
  f(e)
}

const makeTimeText = (ms) => {
  const time = new Date(Date.now() - ms)
  const h = Math.floor(time.getTime() / 3600000) < 10 ? `0${Math.floor(time.getTime() / 3600000)}` : Math.floor(time.getTime() / 3600000)
  const m = Math.floor((time.getTime() % 3600000) / 60000) < 10 ? `0${Math.floor((time.getTime() % 3600000) / 60000)}` : Math.floor((time.getTime() % 3600000) / 60000)
  return `${h}시 ${m}분`
}

const todayTimeText = () => {
  const time = new Date()
  time.setHours(time.getHours() - 9)
  const year = time.getFullYear()
  const month = time.getMonth() + 1 < 10 ? `0${time.getMonth() + 1}` : time.getMonth() + 1
  const date = time.getDate() < 10 ? `0${time.getDate()}` : time.getDate()
  return `${year}년 ${month}월 ${date}일`
}

function App() {
  const [data, setData] = React.useState(null)

  React.useEffect(() => {
    fetch('/panel/GetData?type=Laundry', {
      method: 'post'
    }).then(res => res.json())
      .then(data => setData(data))
  }, [])

  async function useLaundry (machineNum, type, event) {
    event.preventDefault()
    const res = await fetch('/panel/laundry', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        machineNum,
        type,
      }),
    }).then((res) => res.json())
    if (res.statusCode === 200) {
      toast("success", { message: res.message, duration: 1000 });
      window.location.reload()
    } else {
      toast("error", { message: res.message, duration: 1000 });
    }

  }

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
          <div>{data.token.room[0]+"층 세탁실"}</div>
          {Object.values(data.washer).map((washer) => (
            <div key={1} className="box1">
              <span className="block_mb-2">{washer.num}번 세탁기</span>
              <span className="block_mb-2">{washer.active === 1 ? washer.Student_ID === data.token.Student_ID ? makeTimeText(washer.time) + " 동안 사용 중" : makeTimeText(washer.time) + " 동안 사용 중" : "사용 가능"}</span>
              <span className="block_mb-2">{washer.active === 1 ? washer.room + "호 " + washer.name + " 사용중" : todayTimeText()}</span>
              <br/>
              <span className={"block_mb-5 " + (washer.active === 1 ? washer.Student_ID === data.token.Student_ID ? "textcolor-Gray" : "textcolor-Red" : "textcolor-Success")}>{(washer.active === 1 ? washer.Student_ID === data.token.Student_ID ? "취소" : "사용 불가능" : "사용 가능")}</span>
              <div className={(washer.active === 1 ? washer.Student_ID === data.token.Student_ID ? "GrayBtn" : "RedBtn" : "BlueBtn")} onClick={(e) => useLaundry(washer.num, 1, e)}>{(washer.active === 1 ? washer.Student_ID === data.token.Student_ID ? "사용 취소" : "사용 불가" : "사용 가능")}</div>
            </div>
          ))}
          <hr/>
          {Object.values(data.dryer).map((dryer) => (
            <div key={4} className="box1">
              <span className="block_mb-2">{dryer.num}번 건조기</span>
              <span className="block_mb-2">{dryer.active === 1 ? dryer.Student_ID === data.token.Student_ID ? makeTimeText(dryer.time) + " 동안 사용 중" : makeTimeText(dryer.time) + " 동안 사용 중" : "사용 가능"}</span>
              <span className="block_mb-2">{dryer.active === 1 ? dryer.room + "호 " + dryer.name + " 사용중" : todayTimeText()}</span>
              <br/>
              <span className={"block_mb-5 " + (dryer.active === 1 ? dryer.Student_ID === data.token.Student_ID ? "textcolor-Gray" : "textcolor-Red" : "textcolor-Success")}>{(dryer.active === 1 ? dryer.Student_ID === data.token.Student_ID ? "취소" : "사용 불가능" : "사용 가능")}</span>
              <div className={(dryer.active === 1 ? dryer.Student_ID === data.token.Student_ID ? "GrayBtn" : "RedBtn" : "BlueBtn")} onClick={(e) => useLaundry(dryer.num, 2, e)}>{(dryer.active === 1 ? dryer.Student_ID === data.token.Student_ID ? "사용 취소" : "사용 불가" : "사용 가능")}</div>
            </div>
          ))}
          <div style={{ marginBottom: '60px'}}></div>
          <a href="/panel"><div className="home">
            돌아가기
          </div></a>
          <div className="footer">
            © {new Date().getFullYear()}. GBSWHS. 
            <span><a href="https://github.com/gbswhs" target="blank" className="Credits">GITHUB</a></span>
          </div>
        </div>
      );    
    } else {
      setTimeout(() => {
        if (data.message.length > 0) {
          toast("error", { message: data.message, duration: 700 })
        }
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
