import menu from "./menu.js";

const menuBox = document.getElementById("menuBox");
let menuBoxs = document.querySelectorAll("#menuBox");
function creatBox() {
  const menuBoxdiv = menu.map((chart) => {
    const chartList = document.createElement("div");
    chartList.setAttribute("draggable", true);
    chartList.className = "food";
    const header = document.createElement("div");
    header.textContent = chart.id;
    chartList.appendChild(header);
    const list = chart.food.map((li) => {
      const l = document.createElement("h3");
      l.setAttribute("draggable", true);
      l.textContent = li;
      return l;
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
      if (event.target.tagName === "DIV") {
        dragSrcEl = this;
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/html", this.innerHTML);
      } else {
        event.stopPropagation();
      }
    });
    box.addEventListener("dragover", function (event) {
      event.preventDefault();
      this.style.backgroundColor = "rgb(32, 19, 2, 0.5)";
      this.style.transform = "scale(1.1)";
      this.style.transition = "transform 0.2s ease-out";
      return false;
    });
    box.addEventListener("dragenter", function (event) {
      this.style.transform = "";
      this.style.transition = "none";
    });
    box.addEventListener("dragleave", function (event) {
      this.style.background = "rgb(163, 115, 81, 0.8)";
      this.style.transform = "";
      this.style.transition = "none";
    });
    box.addEventListener("dragend", function (event) {
      this.style.transform = "scale(1)";
      this.style.background = "rgb(163, 115, 81, 0.8)";
    });
    box.addEventListener("drop", function (event) {
      event.stopPropagation();
      if (dragSrcEl !== this && this.tagName === "DIV") {
        dragSrcEl.innerHTML = this.innerHTML;
        this.innerHTML = event.dataTransfer.getData("text/html");
      }
      this.style.transform = "scale(1)";
      this.style.background = "rgb(163, 115, 81, 0.8)";

      createJson();
      return false;
    });
  });
}
function dragInSubList() {
  //   let parentNode = null;
  let dragSrcEl = null;
  const boxHeaders = document.querySelectorAll("#menuBox div h3");
  boxHeaders.forEach((header) => {
    header.draggable = true;

    header.addEventListener("dragstart", function (event) {
      if (event.target.tagName === "H3") {
        parent = this.parentNode;
        dragSrcEl = this;
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/html", this.innerHTML);
      } else {
        event.stopPropagation();
        event.preventDefault();
      }
    });

    header.addEventListener("dragover", function (event) {
      event.preventDefault();
      return false;
    });
    header.addEventListener("dragenter", function (event) {
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
      if (parent === this.parentNode && this.tagName === "H3") {
        if (dragSrcEl !== this) {
          const temp = dragSrcEl.innerHTML;
          dragSrcEl.innerHTML = this.innerHTML;
          this.innerHTML = temp;
          createJson();
        }
      }
      return false;
    });
  });
}

function update_menujs() {
  let updated_catg = [];
  const fooddiv = document.querySelectorAll(".food");
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

  //
  console.log(jsonData);
}

creatBox();
drag_drop();
dragInSubList();
createJson();
