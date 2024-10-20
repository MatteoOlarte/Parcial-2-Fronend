"use strict";
import api from "../services/api.js";

const progressBar = {
	outher: document.querySelector("#progress-bar"),
	inner: document.querySelector("#progress-bar > .progress-inner"),
	text: document.querySelector("#progress-bar .progress-text"),
};
const AIRPORT_ID = 1;

function main() {
	fetchAirport();
	document.getElementById("booking-form").addEventListener("submit", bookParking);
}

async function bookParking(event) {
	event.preventDefault();
	const form = event.target;
	const formData = {
		fname: form.fname.value,
		lname: form.lname.value,
		start_date: form.start_date.value,
		end_date: form.end_date.value,
	};
	const params = new URLSearchParams();

	params.set("airport_id", AIRPORT_ID);
	try {
		let response = await fetch(`${api.baseURL}/airports/parkings/booking?${params}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(formData),
		});
		let data = await response.json();
		let xError;

		if (response.ok) {
			const modal = bootstrap.Modal.getInstance(document.getElementById("form-modal"));
			modal.hide();
			showSuccessModal(data);
		}
		xError = response.headers.get("x-error");

		if (xError == "ParkingFull") {
			showErrorModal("No hay mas parquederos disponibles en este momento. Por favor, inténtelo más tarde.");
		}
	} catch (error) {
		console.error(error);
	}
}

async function fetchAirport() {
	setLoadingState(true);
	try {
		let response = await fetch(`${api.baseURL}/airports/${AIRPORT_ID}`);
		let data = await response.json();

		if (response.ok) {
			let total = data.parqueaderos.length;
			let inuse = data.parqueaderos.filter((e) => e.estado === false).length;
			let percentage = (inuse / total) * 100;

			setProgresBarPercentage(percentage);
			document.getElementById("txt-total-capacity").textContent = total;
			setLoadingState(false);
		}
	} catch (error) {
		console.error(error);
	}
}

function setProgresBarPercentage(value) {
	let formated = value.toFixed(0);
	if (value >= 0 && value <= 100) {
		progressBar.inner.style.width = `${value}%`;
		progressBar.text.textContent = `${formated}%`;
	}
}

function setLoadingState(value) {
	const contaiter = document.querySelector("#flights-container");
	const spinner = document.querySelector("#loading-spinner");
	contaiter.classList.toggle("d-none", value);
	spinner.classList.toggle("d-none", !value);
}

function showSuccessModal(data) {
	const element = document.querySelector("#success-modal");
	const modal = new bootstrap.Modal(element);
	const airportText = `${data.airport.iata} (${data.airport.nombre})`;
	const precio = data.price.toLocaleString("en-US", {
		style: "currency",
		currency: "COP",
	});

	element.querySelector("#fname-value").textContent = data.fname;
	element.querySelector("#lname-value").textContent = data.lname;
	element.querySelector("#airport-value").textContent = airportText;
	element.querySelector("#country-value").textContent = data.airport.pais;
	element.querySelector("#city-value").textContent = data.airport.ciudad;
	element.querySelector("#total-value").textContent = `\$${precio}`;
	modal.show();
}

function showErrorModal(message) {
	// Actualiza el contenido del modal con el mensaje personalizado
	const modalBody = document.querySelector("#error-modal .modal-body");
	modalBody.textContent =
		message || "No hay lugares de estacionamiento disponibles en este momento. Por favor, inténtelo más tarde.";

	// Inicializa y muestra el modal de error
	const errorModal = new bootstrap.Modal(document.getElementById("error-modal"));
	errorModal.show();
}

main();
