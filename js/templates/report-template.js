class Report {
  constructor(template) {
    this.template = template;
    this.clone = null
  }

  setData(data) {
    this.clone = this.template.content.cloneNode(true);
    this.clone.querySelector("h5").textContent = data.title.value;  
    this.clone.querySelector("p").textContent = data.description.value;  
    this.clone.querySelector(".badge").textContent = data.type.value;  
  }

  addTo(container) {
    container.appendChild(this.clone);
  }
}

export default Report;