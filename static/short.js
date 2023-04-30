const form = document.querySelector("form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  let url = document.querySelector("#longurl");
  let obj = { url: url.value };
  fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(obj),
  })
    .then((res) => res.json())
    .then((data) => {
      url.value = document.URL + data.short;
      recent();
    })
    .catch((err) => alert(err));
});

function recent() {
  fetch("/recent")
    .then((res) => res.json())
    .then((data) => {
      let parse = JSON.parse(data);
      let reducer = parse.data.reduce((acc, cur) => {
        let id = Object.entries(cur)[0][0];
        let shortUrl = document.URL + id;
        return (
          acc +
          ` <li class="mb-1"><i
            class="fas fa-long-arrow-alt-right me-2 text-info"
          ></i><a href="${shortUrl}"target="_blank">${shortUrl}</a></li>`
        );
      }, "");
      document.querySelector("#recents").innerHTML = reducer;
    });
}
recent();
