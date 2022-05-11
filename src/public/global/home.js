function App() {
  const [data, setData] = React.useState(null)

  React.useEffect(() => {
    fetch('/', {
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
      setTimeout(() => {
        window.location.href = "/panel/"
      }, 400)
      return (
        <div></div>
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
