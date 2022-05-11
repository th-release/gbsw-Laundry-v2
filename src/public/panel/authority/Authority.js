const preventDefault = (f) => (e) => {
  e.preventDefault()
  f(e)
}

const makeTimeText = (input) => {
  const ms = new Date(input)
  const time = new Date((Date.now() - ms.getTime()) + 32400000)
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

const makePhoneNumber = (value) => {
  const phone = value.split('')
  const phoneNumber = []
  for (let i = 0; i < phone.length; i++) {
    if (i === 3 || i === 7) {
      phoneNumber.push('-')
    }
    phoneNumber.push(phone[i])
  }
  return phoneNumber.join('')
}

function App() {
  const [data, setData] = React.useState(null)

  React.useEffect(() => {
    fetch('/authority', {
      method: 'post'
    }).then(res => res.json())
      .then(data => setData(data))
  }, [])

  async function allowUser (ID) {
    event.preventDefault()
    const res = await fetch('/authority/Allow', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: ID
      }),
    }).then((res) => res.json())
    if (res.statusCode === 200) {
      toast("success", { message: res.message, duration: 1000 });
      window.location.reload()
    } else {
      toast("error", { message: res.message, duration: 1000 });
    }
  }

  async function deleteUser (ID) {
    event.preventDefault()
    const res = await fetch('/authority/Delete', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: ID
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
          <div>{todayTimeText()}</div>
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">아이디</th>
                <th scope="col">학번</th>
                <th scope="col">이름</th>
                <th scope="col">방번호</th>
                <th scope="col">전화번호</th>
                <th scope="col">만든 시간</th>
                <th scope="col">승인</th>
                <th scope="col">삭제</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(data.Users).map((User) => (
                <tr key={1}>
                  <td>{User.id}</td>
                  <td>{User.Student_ID}</td>
                  <td>{User.Name}</td>
                  <td>{User.room}</td>
                  <td>{makePhoneNumber(User.phone)}</td>
                  <td>{makeTimeText(User.Created_At)}</td>
                  <td>
                    <button onClick={() => allowUser(User.id)}>승인</button>
                  </td>
                  <td>
                    <button onClick={() => deleteUser(User.id)}>삭제</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
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
