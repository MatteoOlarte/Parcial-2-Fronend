async function onSearch(event) {
  event.preventDefault();
  let form = event.target;
  let searchValue = form.querySelector("input").value;
  let params = new URLSearchParams()

  if (searchValue.length > 0) {
    params.set("q", searchValue)
    window.location.href = `./flights.html?${params}`
  }
}