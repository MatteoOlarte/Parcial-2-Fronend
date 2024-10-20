import Report from "./templates/report-template.js";


function main() {
  innitForm();
}

function innitForm() {
  const form = document.querySelector("#form-create-incident");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let report = new Report(document.querySelector("#report-template"));
    report.setData(form)
    report.addTo(document.querySelector("#reports-container"));
  })
}

main();