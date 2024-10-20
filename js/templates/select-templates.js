export default class SelectTemplate {
	constructor(template, container) {
    this.template = template;
    this.container = container;
  }

	setData(data, getText, getValue) {
		for (let element of data) {
			let clone = this.template.content.cloneNode(true);
			let text = getText(element);
      let value = getValue(element);

			clone.querySelector("option").value = value;
			clone.querySelector("option").textContent = text;
			this.container.appendChild(clone);
		}
	}
}
