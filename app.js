import { getId, addClick, addToId, innerText, toText } from "./helper.js";


let data = {};
let number = ``;

const worker = new Worker("worker.js");

worker.addEventListener("message", (event) => {
  const { data, msg } = event.data;
 
  if(data){
    setData(data)
  }
});

worker.postMessage({msg:"read", data: ""})

function setData(readData) {
  data = readData;
  extractData();
}

function buttonBox() {
  const buttonBox = getId("buttonBox");
  const input = getId("input");
  number = ``;
  if (buttonBox.dataset.open === "closed") {
    buttonBox.style.transform = "translate(0, -50%)";
    buttonBox.dataset.open = "open";
    input.style.background = "white";
    input.style.color = "black";
    addToId("input", "");
    return;
  }
  buttonBox.style.transform = "translate(0,50%)";
  buttonBox.dataset.open = "closed";
  input.style.background = "black";
  input.style.color = "white";

  addToId("input", "Add Count");
}

function addDigits(e) {
  if ((number.length === 0 && e.target.id === "0") || number.length > 2) return;
  number += e.target.id;
  addToId("input", number);
}

function clear() {
  if (getId("buttonBox").dataset.open == "closed") return;
  number = ``;
  addToId("input", "");
}

function getDate() {
  const date = {};
  const d = new Date();
  date.day = d.getDate();
  date.month = d.getMonth();
  date.year = d.getFullYear();
  return date;
}

function drawChart(dataObject) {
  const ctx = getId("barChart").getContext("2d");
  const labels = Object.keys(dataObject);
  const data = Object.values(dataObject);
  const chartContainer = getId("canvasBox");
  const minBarWidth = 40;
  const numBars = labels.length;
  const calculatedWidth = minBarWidth * numBars + 40;
  chartContainer.style.width = `${calculatedWidth}px`;
  ctx.canvas.style.width = `${calculatedWidth}px`;

  const barChart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: "white",
          borderColor: "white",
          borderWidth: 2,
          barPercentage: 2,
          categoryPercentage: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            color: "white",
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: "white",
          },
        },
      },
    },
  });
}

function addEmptyHours(alarmTotals) {
  const fullHours = {};
  for (let i = 1; i < 25; i++) {
    fullHours[i] = alarmTotals.hasOwnProperty(i) ? alarmTotals[i] : 0;
  }
  return fullHours;
}

function addMissedDays(dataObject){
  const fullHours = {};
  const { day } = getDate()
  for (let i = 0; i <= day ; i++) {
    fullHours[i] = dataObject.hasOwnProperty(i) ? dataObject[i] : 0;
  }
  drawChart(fullHours)
}

function extractData() {
  const { year, month } = getDate();
  addToId("canvasBox", `<canvas id="barChart"></canvas>`);
  if(data[year]) {
    const dataObject = Object.fromEntries(Object.entries(data[year][month]));
    addMissedDays(dataObject)
   // drawChart(dataObject);
  }
  
}

function saveData(count) {
  const { year, month, day } = getDate();
  if (!data[year]) {
    data[year] = {};
    data[year][month] = {};
    data[year][month][day] = 0;
  }
  if(!data[year][month]){
    data[year][month] = {}
    data[year][month][day] = 0
  }
  if (data[year][month][day]) {
    data[year][month][day] += count;
  } else {
    data[year][month][day] = count;
  }
  worker.postMessage({msg:"write", data:toText(data)})
}

function save() {
  const input = innerText("input");
  if (getId("buttonBox").dataset.open == "closed" || input.length == 0) return;
  saveData(+input);
  buttonBox();
}

function resetData(){
  worker.postMessage({msg:"write", data:""})
}

window.onload = () => {
  addClick("input", buttonBox);
  addClick("buttonBox", addDigits);
  addClick("clear", clear);
  addClick("plus", save);
  addClick("reset", resetData)
};
