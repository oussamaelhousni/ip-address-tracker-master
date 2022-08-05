var map = L.map("map", { zoomControl: false }).setView([51.505, -0.09], 25);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap",
}).addTo(map);

const addressIp = document.querySelector(".ip-address p");
const locationDom = document.querySelector(".location p");
const timezone = document.querySelector(".timezone p");
const isp = document.querySelector(".isp p");
const form = document.querySelector("#form");
const IpRegex = /^(?:(?:^|\.)(?:2(?:5[0-5]|[0-4]\d)|1?\d?\d)){4}$/;
let marker;

const blackIcon = L.icon({
    iconUrl: "./images/icon-location.svg",
});

const getMyIp = async () => {
    const URL = "https://api.ipify.org/?format=json";
    const response = await fetch(URL);
    const data = await response.json();
    return data.ip;
};

const getIpInformations = async (ip) => {
    const URL_API =
        "https://geo.ipify.org/api/v2/country,city?apiKey=at_fhAreASlhZSgSdWA0Den3PVXvYFk3&ipAddress=";
    const response = await fetch(URL_API + ip);
    const data = await response.json();
    addressIp.textContent = ip;
    locationDom.textContent = `${data.location.country}, ${data.location.city}, ${data.location.region}`;
    timezone.textContent = data.location.timezone;
    isp.textContent = data.isp;
    marker?.remove();
    marker = L.marker([data.location.lat, data.location.lng], {
        icon: blackIcon,
    }).addTo(map);
    map.setView([data.location.lat, data.location.lng], 17);
};

getMyIp().then((ip) => {
    form.elements["search"].value = ip;
    getIpInformations(ip);
});

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const ip = form.elements["search"].value;
    if (!ip) return;

    if (IpRegex.test(ip)) {
        getIpInformations(ip);
    } else {
        const res = await fetch("http://ip-api.com/json/" + ip);
        const data = await res.json();
        if (data.status === "fail") return;
        getIpInformations(data.query);
    }
});
