class FlightsTable {
	constructor(template, container) {
		this.template = template;
		this.container = container;
	}

	setData(data, getDate = (element) => element.hora_llegada) {
		for (let element of data) {
			let clone = this.template.content.cloneNode(true);
			let origin = `${element.origen.ciudad}, ${element.origen.pais}`;
			let destination = `${element.destino.ciudad}, ${element.destino.pais}`;

			clone.querySelector("#flight-airline").textContent = element.airline.nombre;
			clone.querySelector("#flight-origin").textContent = origin;
			clone.querySelector("#flight-destination").textContent = destination;
			this.#setFlightNumber(clone, element);
			this.#setFlightDate(clone, element, getDate);
			this.#setFlightState(clone, element);
			this.container.appendChild(clone);
		}
	}

	clear() {
		while (this.container.firstChild) {
			this.container.removeChild(this.container.firstChild);
		}
	}

	#setFlightNumber(clone, element) {
		let flightNumber = `${element.airline.iata} ${String(element.vuelo_id).padStart(3, "0")}`;
		clone.querySelector("#flight-number").textContent = flightNumber;
	}

	#setFlightDate(clone, element, getDate) {
		let flightDate = new Date(getDate(element));
		let flightTime = flightDate.toLocaleString();
		clone.querySelector("#flight-time").textContent = flightTime;
	}

	#setFlightState(clone, element) {
		let key = element.estado.estado_id;
		let selector = clone.querySelector("#flight-status > span");

		selector.classList.remove("text-bg-success", "text-bg-danger", "text-bg-warning", "text-bg-info", "text-bg-primary", "text-bg-muted");
		switch (key) {
			case 1: // Programado
				selector.classList.add("text-bg-success");
				break;
			case 2: // En puerta
				selector.classList.add("text-bg-primary");
				break;
			case 3: // Abordando
				selector.classList.add("text-bg-info");
				break;
			case 4: // Retrasado
				selector.classList.add("text-bg-warning");
				break;
			case 5: // En vuelo
				selector.classList.add("text-bg-primary");
				break;
			case 6: // Aterrizado
				selector.classList.add("text-bg-success");
				break;
			case 7: // Despegó
				selector.classList.add("text-bg-info");
				break;
			case 8: // Cancelado
				selector.classList.add("text-bg-danger");
				break;
			case 9: // Desviado
				selector.classList.add("text-bg-danger");
				break;
			case 10: // En espera
				selector.classList.add("text-bg-muted");
				break;
			default:
				selector.classList.add("text-bg-muted");
				break;
		}
		selector.textContent = element.estado.nombre;
	}
}

export default FlightsTable;
