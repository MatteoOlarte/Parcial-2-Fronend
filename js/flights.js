"use strict";
import api from "../services/api.js";
import SelectTemplate from "./templates/select-templates.js";
import FlightsTable from "./templates/flight-templates.js";

const params = new URLSearchParams(window.location.search);
const flightTable = new FlightsTable(
	document.querySelector("#flight-item"),
	document.querySelector("#flights-container")
);
const filters = {
	q: "",
	airline: null,
	origen: 1,
	destino: null,
	estado: null,
	salida: null,
	llegada: null,
};

function main() {
	if (params.has("q")) {
		filters.q = params.get("q");
	}
	fetchAllFilters().then(initFilters);
	setTimeout(fetchFlights, 500);
}

async function fetchAllFilters() {
	await fetchAirlines();
	await fetchFlightStates();
	await fetchDestinations();
}

async function fetchFlights() {
	const filteredFilters = Object.fromEntries(
		Object.entries(filters).filter(([_, value]) => value !== null && value !== undefined)
	);
	setLoadingState(true);

	try {
		let params = new URLSearchParams(filteredFilters);
		let response = await fetch(`${api.baseURL}/flights/search?${params}`);
		let data = await response.json();

		if (response.ok) {
			flightTable.clear();
			flightTable.setData(data, (element) => (filters.destino == 1 ? element.hora_llegada : element.hora_salida));
			setLoadingState(false);
			return;
		} else {
			setLoadingState(false);
			return;
		}
	} catch (error) {
		console.error(error);
	}
}

async function fetchAirlines() {
	try {
		let response = await fetch(`${api.baseURL}/airlines`);
		let data = await response.json();

		if (response.ok) {
			let options = new SelectTemplate(
				document.getElementById("select-option"),
				document.getElementById("airline-select")
			);
			options.setData(
				data,
				(element) => element.nombre,
				(element) => element.pk
			);
			return;
		}
	} catch (error) {
		console.error(error);
	}
}

async function fetchFlightStates() {
	try {
		let response = await fetch(`${api.baseURL}/flights/states`);
		let data = await response.json();

		if (response.ok) {
			let options = new SelectTemplate(
				document.getElementById("select-option"),
				document.getElementById("fstate-select")
			);
			options.setData(
				data,
				(element) => element.nombre,
				(element) => element.estado_id
			);
			return;
		}
	} catch (error) {
		console.error(error);
	}
}

async function fetchDestinations() {
	try {
		let response = await fetch(`${api.baseURL}/airports`);
		let data = await response.json();

		if (response.ok) {
			let options = new SelectTemplate(
				document.getElementById("select-option"),
				document.getElementById("location-select")
			);
			options.setData(
				data,
				(element) => element.nombre,
				(element) => element.aeropuerto_id
			);
			return;
		}
	} catch (error) {
		console.error(error);
	}
}

function setButtonActive(button, force) {
	button.classList.toggle("btn-outline-primary", !force);
	button.classList.toggle("btn-primary", force);
}

function setLoadingState(value) {
	const contaiter = document.querySelector("#flights-container");
	const spinner = document.querySelector("#loading-spinner");
	contaiter.classList.toggle("d-none", value);
	spinner.classList.toggle("d-none", !value);
}

function initFilters() {
	const selectAirline = document.querySelector("#airline-select");
	const selectFlightState = document.querySelector("#fstate-select");
	const selectDestination = document.querySelector("#location-select");
	const inputFlightSearch = document.querySelector("#input-search");
	const departureButton = document.getElementById("departure-button");
	const arrivalButton = document.getElementById("arrival-button");

	selectAirline.addEventListener("change", (e) => {
		const value = e.target.value;
		filters.airline = value == 0 ? null : value;
		fetchFlights();
	});
	selectFlightState.addEventListener("change", (e) => {
		const value = e.target.value;
		filters.estado = value == 0 ? null : value;
		fetchFlights();
	});
	selectDestination.addEventListener("change", (e) => {
		const value = e.target.value;
		
		if (filters.origin == 1) {
			filters.destino = value;
			fetchFlights();
			return;
		}
		if (filters.destino == 1) {
			filters.origen = value;
			fetchFlights();
			return;
		}
	});
	inputFlightSearch.addEventListener("change", (e) => {
		const searchValue = e.target.value;
		filters.q = searchValue;
		fetchFlights();
	});
	departureButton.addEventListener("click", () => {
		filters.origen = 1;
		filters.destino = null;
		document.getElementById("table-header").textContent = "SALIDAS";
		setButtonActive(departureButton, true);
		setButtonActive(arrivalButton, false);
		fetchFlights();
	});
	arrivalButton.addEventListener("click", () => {
		filters.origen = null;
		filters.destino = 1;
		document.getElementById("table-header").textContent = "LLEGADAS";
		setButtonActive(arrivalButton, true);
		setButtonActive(departureButton, false);
		fetchFlights();
	});
}

main();
