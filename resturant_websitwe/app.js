const menu = [
  {
    category: 1,
    id: "indian_dish",
    food: [
      "aloo paratha",
      "chicken tikka masala",
      "saag paneer",
      "biryani",
      "dosa",
    ],
    rank: [1, 2, 3, 4, 5],
  },
  {
    category: 2,
    id: "chinese_dish",
    food: [
      "kung pao chicken",
      "mapo tofu",
      "hot and sour soup",
      "dim sum",
      "fried rice",
    ],
    rank: [1, 2, 3, 4, 5],
  },
  {
    category: 3,
    id: "european_dish",
    food: [
      "spaghetti carbonara",
      "fish and chips",
      "paella",
      "shepherd's pie",
      "schnitzel",
    ],
    rank: [1, 2, 3, 4, 5],
  },
  {
    category: 4,
    id: "american_dish",
    food: [
      "hamburger",
      "hot dog",
      "mac and cheese",
      "buffalo wings",
      "grilled cheese ",
    ],
    rank: [1, 2, 3, 4, 5],
  },
  {
    category: 5,
    id: "south_american_dish",
    food: ["tacos", "empanadas", "feijoada", "ceviche", "picanha"],
    rank: [0, 1, 2, 3, 4],
  },
];

const menuBox = document.getElementById("menuBox");
let menuBoxs = document.querySelectorAll("#menuBox");
function creatBox() {
  const menuBoxdiv = menu.map((chart) => {
    const chartList = document.createElement("div");
    chartList.setAttribute("draggable", true);
    chartList.className = "chartList chartls_drag chartls_drop";
    const header = document.createElement("div");
    header.setAttribute("draggable", false);
    header.textContent = chart.id;
    chartList.appendChild(header);
    const list = chart.food.map((fo) => {
      const fd = document.createElement("h3");
      fd.setAttribute("draggable", true);
      fd.className = "food_drop";
      fd.textContent = fo;
      return fd;
    });
    list.forEach((lis) => {
      chartList.appendChild(lis);
    });
    return chartList;
  });
  menuBoxdiv.forEach((chartlist) => {
    menuBox.appendChild(chartlist);
  });
}

function drag_drop() {
  let dragSrcEl = null;
  menuBoxs[0].querySelectorAll("div").forEach((box) => {
    box.addEventListener("dragstart", function (event) {
      dragSrcEl = this;
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/html", this.innerHTML);
    });
    box.addEventListener("dragover", function (event) {
      event.preventDefault();
      return false;
    });
    box.addEventListener("dragenter", function (event) {
      this.classList.add("enter");
      event.preventDefault();
    });
    box.addEventListener("dragleave", function (event) {
      this.classList.remove("enter");
    });
    box.addEventListener("dragend", function (event) {
      menuBoxs[0].querySelectorAll("div").forEach(function (item) {
        item.classList.remove("over");
      });
    });
    box.addEventListener("drop", function (event) {
      event.stopPropagation();
      if (dragSrcEl !== this && this.classList.contains("chartls_drop")) {
        dragSrcEl.innerHTML = this.innerHTML;
        this.innerHTML = event.dataTransfer.getData("text/html");
        this.style.transform = "scale(1)";
        this.style.background = "rgb(163, 115, 81, 0.8)";
      }
      dragInSubList();
      createJson();
    });
  });
}

function dragInSubList() {
  let parentNode = null;
  let dragSrcEl = null;
  const boxHeaders = document.querySelectorAll("#menuBox div h3");
  boxHeaders.forEach((header) => {
    header.draggable = true;

    header.addEventListener("dragstart", function (event) {
      event.stopPropagation();
      parentNode = this.parentNode;
      dragSrcEl = this;
      console.log(this.innerHTML);
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/html", this.innerHTML);
    });

    header.addEventListener("dragover", function (event) {
      event.preventDefault();
      return false;
    });
    header.addEventListener("dragenter", function (event) {
      event.preventDefault();
      this.classList.add("over");
    });
    header.addEventListener("dragleave", function (event) {
      this.classList.remove("over");
    });

    header.addEventListener("dragend", function (event) {
      boxHeaders.forEach(function (item) {
        item.classList.remove("over");
      });
    });
    header.addEventListener("drop", function (event) {
      event.stopPropagation();
      event.preventDefault();
      console.log("checking the condition==", parentNode === this.parentNode);
      if (parentNode === this.parentNode) {
        if (
          dragSrcEl !== this &&
          this.classList.contains("food_drop") === true
        ) {
          console.log("changing did happen");
          dragSrcEl.innerHTML = this.innerHTML;
          this.innerHTML = event.dataTransfer.getData("text/html");
          createJson();
        }
      } else {
        return false;
      }
    });
  });
}

function update_menujs() {
  let updated_catg = [];
  const fooddiv = document.querySelectorAll(".chartList");
  fooddiv.forEach((food) => {
    let temp = menu.filter((obj) => {
      return obj.id === food.children[0].textContent;
    });
    updated_catg.push(temp[0].category);
  });
  return updated_catg;
}

function update_sublist() {
  const foodlist = document.querySelectorAll("#menuBox > div ");
  const catg = update_menujs();
  let update_list = [];
  const tempMenu = [];
  catg.forEach((ct) => {
    tempMenu.push(menu[ct - 1]);
  });
  for (let i = 0; i < foodlist.length; i++) {
    const tempfood = foodlist[i].querySelectorAll("h3");
    let tempArray = [];
    tempfood.forEach((tf) => {
      tempArray.push(tempMenu[i].food.indexOf(tf.innerHTML));
    });
    update_list.push(tempArray);
  }
  return update_list;
}

function createJson() {
  let data = [];
  const category = update_menujs();
  const subList = update_sublist();
  category.forEach((ctg, index) => {
    data.push({ category: ctg, rank: subList[index] });
  });
  const jsonData = JSON.stringify(data, null, 2);
  if (document.getElementById("myCheck").checked) {
    localStorage.setItem("myData", jsonData);
  }
  displayDataFromLocalStorage();
  return jsonData;
}

function saveJsonToLocalStorage() {
  const data = createJson();
  localStorage.setItem("myData", data);
}

function displayDataFromLocalStorage() {
  const data = localStorage.getItem("myData");
  if (data) {
    const jsonData = JSON.parse(data);
    const list = document.getElementById("live_data");
    list.innerHTML = "";
    jsonData.forEach((item) => {
      const li1 = document.createElement("li");
      const li2 = document.createElement("li");
      const box = document.createElement("div");
      li1.textContent = `category:${item.category}`;
      li2.textContent = `rank:${item.rank}`;
      box.appendChild(li1);
      box.appendChild(li2);

      list.appendChild(box);
    });
  }
}
document
  .getElementById("myCheck")
  .addEventListener("click", saveJsonToLocalStorage);

// window.addEventListener("storage", function (event) {
//   console.log("storage is happing");
//   if (event.key === "myData") {
//     displayDataFromLocalStorage();
//   }
// });

creatBox();
drag_drop();
dragInSubList();
createJson();
displayDataFromLocalStorage();
