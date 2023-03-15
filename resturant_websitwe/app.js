const list = document.getElementById("myList1");
let log = document.getElementById("log1");
let firstIndex = null;
let lis = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
list.addEventListener("click", function (event) {
  const clickedIndex = [...list.children].indexOf(event.target);
  if (firstIndex === null) {
    firstIndex = clickedIndex;
  } else {
    swapListItems(list.children, firstIndex, clickedIndex);
    firstIndex = null;
    logUpdate();
  }
});

function swapListItems(list, index1, index2) {
  [list[index1].innerHTML, list[index2].innerHTML] = [
    list[index2].innerHTML,
    list[index1].innerHTML,
  ];
  [lis[index1], lis[index2]] = [lis[index2], lis[index1]];
}

function logUpdate() {
  log.innerHTML = "";
  lis.map((ind) => {
    let el = document.createElement("h4");
    el.innerHTML = ind;
    log.appendChild(el);
  });
}

logUpdate();
