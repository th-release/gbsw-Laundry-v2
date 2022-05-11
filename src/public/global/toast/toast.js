function isNumber(value) {
  return !isNaN(Number(value));
}

function toast(type, { message, duration }) {
  if (!isNumber(duration)) return console.log("Error: duration must be a number.");

  const toast = document.getElementById("toast");
  let removeToast;
  if (type === "success") {
    document.getElementById('toast-icon').innerHTML = '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="#07bc0c"><path d="M12 0a12 12 0 1012 12A12.014 12.014 0 0012 0zm6.927 8.2l-6.845 9.289a1.011 1.011 0 01-1.43.188l-4.888-3.908a1 1 0 111.25-1.562l4.076 3.261 6.227-8.451a1 1 0 111.61 1.183z"></path></svg>'
    toast.classList.contains("reveal") ?
    (clearTimeout(removeToast), removeToast = setTimeout(function () {
      document.getElementById("toast").classList.remove("reveal")
      document.getElementById("toast-icon").classList.remove("success")
    }, duration)) :
    removeToast = setTimeout(function () {
      document.getElementById("toast").classList.remove("reveal")
      document.getElementById("toast-icon").classList.remove("success")
    }, duration)
    toast.classList.add("reveal"),
    document.getElementById("toast-icon").classList.add("success"),
    document.getElementById('toast-text').innerHTML = message
    return "Toast Success"
  } else if (type === "error") {
    document.getElementById('toast-icon').innerHTML = '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="#e74c3c"><path d="M11.983 0a12.206 12.206 0 00-8.51 3.653A11.8 11.8 0 000 12.207 11.779 11.779 0 0011.8 24h.214A12.111 12.111 0 0024 11.791 11.766 11.766 0 0011.983 0zM10.5 16.542a1.476 1.476 0 011.449-1.53h.027a1.527 1.527 0 011.523 1.47 1.475 1.475 0 01-1.449 1.53h-.027a1.529 1.529 0 01-1.523-1.47zM11 12.5v-6a1 1 0 012 0v6a1 1 0 11-2 0z"></path></svg>'
    toast.classList.contains("reveal") ?
    (clearTimeout(removeToast), removeToast = setTimeout(function () {
      document.getElementById("toast").classList.remove("reveal")
      document.getElementById("toast-icon").classList.remove("error")
    }, duration)) :
    removeToast = setTimeout(function () {
      document.getElementById("toast").classList.remove("reveal")
      document.getElementById("toast-icon").classList.remove("error")
    }, duration)
    toast.classList.add("reveal"),
    document.getElementById('toast-icon').classList.add("error"),
    document.getElementById("toast-text").innerHTML = message
    return "Toast Error"
  } else if (type === "info") {
    document.getElementById('toast-icon').innerHTML = '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="#54c7ec"><path d="M12 0a12 12 0 1012 12A12.013 12.013 0 0012 0zm.25 5a1.5 1.5 0 11-1.5 1.5 1.5 1.5 0 011.5-1.5zm2.25 13.5h-4a1 1 0 010-2h.75a.25.25 0 00.25-.25v-4.5a.25.25 0 00-.25-.25h-.75a1 1 0 010-2h1a2 2 0 012 2v4.75a.25.25 0 00.25.25h.75a1 1 0 110 2z"></path></svg>'
    toast.classList.contains("reveal") ?
    (clearTimeout(removeToast), removeToast = setTimeout(function () {
      document.getElementById("toast").classList.remove("reveal")
      document.getElementById("toast-icon").classList.remove("info")
    }, duration)) :
    removeToast = setTimeout(function () {
      document.getElementById("toast").classList.remove("reveal")
      document.getElementById("toast-icon").classList.remove("info")
    }, duration)
    toast.classList.add("reveal"),
    document.getElementById('toast-icon').classList.add("info"),
    document.getElementById("toast-text").innerHTML = message
  }else {
    return console.log("Error: type must be 'success' or 'error'.");
  }
}