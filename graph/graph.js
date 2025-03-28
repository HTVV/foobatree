//NOT GRAPH
//Fooba2 was here
const token = getCookie("token");
const username = getCookie("username");
var treeUser = getCookie("treeUser");
if (treeUser == username || !treeUser) treeUser = "empty";
//thing to add to end of requests cuz sharing
const requestEnd = treeUser == "empty" ? "" : `&username=${treeUser}`;
var treeStyle = localStorage.getItem("treeStyle")
  ? localStorage.getItem("treeStyle")
  : "normal";

localStorage.getItem("connector")
  ? ""
  : localStorage.setItem("connector", "curveStepBefore");

localStorage.getItem("show-pics")
  ? ""
  : localStorage.setItem("show-pics", "true");

localStorage.getItem("connector-color")
  ? document.documentElement.style.setProperty(
      "--connector-color",
      localStorage.getItem("connector-color")
    )
  : localStorage.setItem("connector-color", "#6ac975");

localStorage.getItem("bg-color")
  ? document.documentElement.style.setProperty(
      "--bg-color",
      localStorage.getItem("bg-color")
    )
  : localStorage.setItem("bg-color", "#fff8c4");

document.getElementById("switch_toggle").checked =
  localStorage.getItem("dark-mode") == "true" ? true : false;
handleDarkMode();

//for info tree style
var rainbow = new Rainbow();
rainbow.setNumberRange(
  0,
  localStorage.getItem("colorSens") ? localStorage.getItem("colorSens") : 2000
);
rainbow.setSpectrum(
  localStorage.getItem("fromColor")
    ? localStorage.getItem("fromColor")
    : "yellow",
  localStorage.getItem("toColor") ? localStorage.getItem("toColor") : "darkred"
);
//kinda whack settings the size like this ngl
document.getElementById("graph").setAttribute("width", screen.availWidth);
document
  .getElementById("graph")
  .setAttribute("height", screen.availHeight * 0.8);

const popupOverlay = document.getElementById("popupOverlay");
const popup = document.getElementById("popup");

//downoloads the popup variables
setPopups();

document.addEventListener("keydown", function (e) {
  if (e.key == "Escape") {
    closePopupFunc();
  }
  if (e.key == "z") {
    renderFixed();
  }
});
document.getElementById("switch_toggle").addEventListener("click", function () {
  localStorage.setItem(
    "dark-mode",
    localStorage.getItem("dark-mode") == "false" ? "true" : "false"
  );
  handleDarkMode();
});
popupOverlay.addEventListener("click", function (event) {
  if (event.target === popupOverlay) {
    closePopupFunc();
  }
});

async function setPopups() {
  addPersonPopup = await (
    await fetch("../data/popup/addPersonPopup.html")
  ).text();
  focusPersonPopup = await (
    await fetch("../data/popup/focusPersonPopup.html")
  ).text();
  shareTreePopup = await (
    await fetch("../data/popup/shareTreePopup.html")
  ).text();
  stylePopup = await (await fetch("../data/popup/stylePopup.html")).text();
  openSharedPopup = await (
    await fetch("../data/popup/openSharedPopup.html")
  ).text();
  attributionPopup = await (
    await fetch("../data/popup/attributionPopup.html")
  ).text();
  birthDaysPopup = await (
    await fetch("../data/popup/birthDaysPopup.html")
  ).text();
}
//gets a random uuid cuz cant crypto doesnt like http
function randomUUID() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
    (
      +c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))
    ).toString(16)
  );
}
//opens the add disconnected person form
async function openPopup(popupNum) {
  switch (popupNum) {
    //add person
    case 1:
      popupOverlay.style.display = "flex";
      popup.innerHTML = addPersonPopup;
      document.getElementById("popupHeader").textContent =
        "Add disconnected person";
      document.getElementById("submitButton").style.display = "block";
      document.getElementById("select-existing").style.display = "none";

      document
        .getElementById("birth-date-modifier-select")
        .addEventListener("change", function () {
          if (this.value == "between") {
            document.getElementsByClassName("birth2-inputs")[0].style.display =
              "block";
          } else {
            document.getElementsByClassName("birth2-inputs")[0].style.display =
              "none";
          }
        });

      document
        .getElementById("death-date-modifier-select")
        .addEventListener("change", function () {
          if (this.value == "between") {
            document.getElementsByClassName("death2-inputs")[0].style.display =
              "block";
          } else {
            document.getElementsByClassName("death2-inputs")[0].style.display =
              "none";
          }
        });
      break;
    //focus person
    case 2:
      popupOverlay.style.display = "flex";
      popup.innerHTML = focusPersonPopup;
      document.getElementById("popupHeader").textContent = "Focus person";
      document
        .getElementById("focusInput")
        .addEventListener("input", function (e) {
          search(data);
        });
      document.getElementById("submitButton").style.display = "none";
      break;
    //share tree
    case 3:
      popupOverlay.style.display = "flex";
      popup.innerHTML = shareTreePopup;
      document.getElementById("submitButton").style.display = "none";
      break;
    //change style
    case 4:
      popupOverlay.style.display = "flex";
      popup.innerHTML = stylePopup;
      document.getElementById("submitButton").style.display = "none";
      var treeStyle = localStorage.getItem("treeStyle")
        ? localStorage.getItem("treeStyle")
        : "normal";
      if (treeStyle == "normal") {
        document.getElementById("info-style-button").style.backgroundColor =
          "var(--button-off-color)";
      } else if (treeStyle == "info") {
        document.getElementById("normal-style-button").style.backgroundColor =
          "var(--button-off-color)";
      }

      document.getElementById("from-color-input").value = localStorage.getItem(
        "fromColor"
      )
        ? localStorage.getItem("fromColor")
        : "#8b0000";
      document.getElementById("to-color-input").value = localStorage.getItem(
        "toColor"
      )
        ? localStorage.getItem("toColor")
        : "#8b0000";
      document.getElementById("color-sens-input").value = localStorage.getItem(
        "colorSens"
      )
        ? localStorage.getItem("colorSens")
        : 2000;

      document.getElementById("connector-select").value =
        localStorage.getItem("connector");
      document.getElementById("connector-color-picker").value =
        localStorage.getItem("connector-color");
      document.getElementById("bg-color-input").value =
        localStorage.getItem("bg-color");
      document.getElementById("show-pics-input").checked =
        localStorage.getItem("show-pics") === "true";

      document
        .getElementById("connector-select")
        .addEventListener("change", function () {
          localStorage.setItem("connector", this.value);
        });
      document
        .getElementById("connector-color-picker")
        .addEventListener("change", function () {
          localStorage.setItem("connector-color", this.value);
          document.documentElement.style.setProperty(
            "--connector-color",
            this.value
          );
        });
      //change connector curve
      document
        .getElementById("connector-select")
        .addEventListener("change", function () {
          Object.keys(g._edgeLabels).forEach((element) => {
            g._edgeLabels[element].curve =
              d3[localStorage.getItem("connector")];
          });
          renderFixed();
        });
      //bg color
      document
        .getElementById("bg-color-input")
        .addEventListener("change", function () {
          localStorage.setItem("bg-color", this.value);
          document.documentElement.style.setProperty("--bg-color", this.value);
        });
      //set connector style values to default
      document
        .getElementById("connector-default-button")
        .addEventListener("click", function () {
          localStorage.setItem("connector-color", "#6ac975");
          localStorage.setItem("connector", "curveStepBefore");
          document.getElementById("connector-select").value = "curveStepBefore";
          document.getElementById("connector-color-picker").value = "#6ac975";
          document.documentElement.style.setProperty(
            "--connector-color",
            "#6ac975"
          );
          Object.keys(g._edgeLabels).forEach((element) => {
            g._edgeLabels[element].curve =
              d3[localStorage.getItem("connector")];
          });
          renderFixed();
        });
      //set bg style values to default
      document
        .getElementById("bg-default-button")
        .addEventListener("click", function () {
          localStorage.setItem("bg-color", "#fff8c4");
          document.documentElement.style.setProperty("--bg-color", "#fff8c4");
          document.getElementById("bg-color-input").value = "#fff8c4";
        });
      //show pics
      document
        .getElementById("show-pics-input")
        .addEventListener("change", function () {
          localStorage.setItem("show-pics", this.checked);
        });
      break;
    //open shared
    case 5:
      popupOverlay.style.display = "flex";
      popup.innerHTML = openSharedPopup;
      document.getElementById("submitButton").style.display = "none";
      const res = await (
        await fetch(
          `https://familytree.loophole.site/sharedToMe?token=${token}`
        )
      ).json();
      for (var i = 0; i < res.length; i++) {
        document.getElementById(
          "sharedList"
        ).innerHTML += `<option value="${res[i]}">${res[i]}</option>`;
      }

      break;
    //attribution
    case 6:
      popupOverlay.style.display = "flex";
      popup.innerHTML = attributionPopup;
      document.getElementById("submitButton").style.display = "none";

      break;
    //birthdays
    case 7:
      popupOverlay.style.display = "flex";
      popup.innerHTML = birthDaysPopup;
      document.getElementById("submitButton").style.display = "none";
      break;
    //loading
    case 8:
      popupOverlay.style.display = "flex";
      popup.style.display = "none";
      document.getElementById("submitButton").style.display = "none";

      popupOverlay.innerHTML += "<div class='loader' id='loader'></div>";
      break;
  }
}
//closes all popups
function closePopupFunc() {
  popupOverlay.style.display = "none";
  popup.style.display = "block";
  document.getElementById("loader").outerHTML = "";
  if (document.getElementById("shareInput"))
    document.getElementById("shareInput").value = "";
}
//the submit button for all the things
function submitForm() {
  closePopupFunc();

  const gender = document.querySelector(
    'input[name="maleFemale"]:checked'
  ).value;
  const status = document.querySelector(
    'input[name="deadAlive"]:checked'
  ).value;
  const firstNames = document.getElementById("firstNameInput").value;
  const lastNames = document.getElementById("lastNameInput").value;
  const patronym = document.getElementById("patronymInput").value;
  const dateBirth = new FtDate(
    (day1 = document.getElementById("birthDayInput1").value),
    (month1 = document.getElementById("birthMonthInput1").value),
    (year1 = document.getElementById("birthYearInput1").value),
    (modifier = document.getElementById("birth-date-modifier-select").value),
    (day2 = document.getElementById("birthDayInput2").value),
    (month2 = document.getElementById("birthMonthInput2").value),
    (year2 = document.getElementById("birthYearInput2").value)
  );
  const dateDeath = new FtDate(
    (day1 = document.getElementById("deathDayInput1").value),
    (month1 = document.getElementById("deathMonthInput1").value),
    (year1 = document.getElementById("deathYearInput1").value),
    (modifier = document.getElementById("death-date-modifier-select").value),
    (day2 = document.getElementById("deathDayInput2").value),
    (month2 = document.getElementById("deathMonthInput2").value),
    (year2 = document.getElementById("deathYearInput2").value)
  );
  const placeBirth = document.getElementById("bornPlaceInput").value;
  const placeDeath = document.getElementById("diedPlaceInput").value;
  const placeBurial = document.getElementById("buriedPlaceInput").value;
  const ogName = document.getElementById("ogNameInput").value;
  const lore = document.getElementById("loreInput").value;
  const uuid = randomUUID();

  const newPerson = JSON.stringify({
    status: status,
    gender: gender,
    firstName: firstNames,
    lastName: lastNames,
    id: uuid,
    patronym: patronym,
    birthDate: dateBirth,
    birthPlace: placeBirth,
    deathDate: dateDeath,
    deathPlace: placeDeath,
    burialPlace: placeBurial,
    children: [],
    spouses: [],
    causeOfDeath: "",
    writing: "",
    sources: "",
    name: btrim(
      `${firstNames} ${patronym} ${lastNames}${
        ogName != "" ? ` (${ogName})` : ""
      }`
    ),
    parent1Id: null,
    parent2Id: null,
    lore: lore,
  });

  //document.cookie = `target=${uuid};max-age=1431989812894908`
  localStorage.setItem("target", uuid);

  const ele = document.getElementsByClassName("popup-input");
  for (var i = 0; i < ele.length; i++) {
    ele[i].value = "";
  }
  /*document.getElementById("aliveSelection").selected = "false";
  document.getElementById("deadSelection").selected = "true";*/
  hideForm("dead");
  //fetch(`https://familytree.loophole.site/setProfile?token=${token}&profileUuid=07dbf856-acda-4393-ae72-2073f6594b87&content=${encodeURI(JSON.stringify())}`)
  console.log(newPerson);
  fetch(
    `https://familytree.loophole.site/setProfile?token=${token}&profileUuid=${uuid}&content=${encodeURI(
      newPerson
    )}`
  );
  fetch(
    `https://familytree.loophole.site/setProfile?token=${token}&profileUuid=test&content=`
  );

  //location.reload()
}
//hides the form if you select living
function hideForm(status) {
  show = "none";
  if (status == "dead") {
    show = "block";
  }
  var ele = document.getElementsByClassName("tohide");
  for (var i = 0; i < ele.length; i++) {
    ele[i].style.display = show;
  }
}
//sets the trees focus to a person
function setTarget() {
  const value = document.getElementById("selectFocus").value;
  localStorage.setItem("target", value);
  //document.cookie = `target=${value};max-age=1431989812894908`
  location.reload();
}
//gets a cookie by its key
function getCookie(name) {
  return localStorage.getItem(name);
  /* const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift(); */
}
//shares your tree
async function shareTree() {
  const usernameShare = document.getElementById("shareInput").value;
  const res = await (
    await fetch(
      `https://familytree.loophole.site/shareTree?token=${token}&targetName=${usernameShare}`
    )
  ).json();
  if (res.error == 200) {
    document.getElementById("error").style.color = "green";
    document.getElementById("error").textContent = "SUCCESS";
  } else {
    document.getElementById("error").style.color = "red";
    document.getElementById("error").textContent = "USER NOT FOUND";
  }
}
//opens the tree of another user
function openSharedTree() {
  const treeUser = document.getElementById("sharedList").value;
  //document.cookie = `treeUser=${treeUser};path=/`
  localStorage.setItem("treeUser", treeUser);
  location.reload();
}
//opens your own tree
function ownTree() {
  localStorage.setItem("treeUser", "empty");
  location.reload();
}
function normalStyle() {
  closePopupFunc();
  treeStyle = "normal";
  localStorage.setItem("treeStyle", "normal");

  nodeNames = Object.keys(g._nodes);
  nodeNames.forEach((node) => {
    if (node.includes("ParentMarriage") || node.includes("childNode")) {
      return 0;
    }
    idSetNode(node);
  });

  renderFixed();
}
function infoStyle() {
  closePopupFunc();
  localStorage.setItem(
    "colorSens",
    document.getElementById("color-sens-input").value
  );
  localStorage.setItem(
    "fromColor",
    document.getElementById("from-color-input").value
  );
  localStorage.setItem(
    "toColor",
    document.getElementById("to-color-input").value
  );
  treeStyle = "info";
  localStorage.setItem("treeStyle", "info");

  // set the gradient
  rainbow.setNumberRange(
    0,
    localStorage.getItem("colorSens") ? localStorage.getItem("colorSens") : 2000
  );
  rainbow.setSpectrum(
    localStorage.getItem("fromColor")
      ? localStorage.getItem("fromColor")
      : "yellow",
    localStorage.getItem("toColor")
      ? localStorage.getItem("toColor")
      : "darkred"
  );

  // update the nodes
  nodeNames = Object.keys(g._nodes);
  nodeNames.forEach((node) => {
    if (node.includes("ParentMarriage") || node.includes("childNode")) {
      return 0;
    }
    idSetNode(node);
  });

  renderFixed();
}
function getBirthDays() {
  const birthDaysPopup = document.getElementById("birthDaysPopup");
  birthDaysPopup.innerHTML = "";

  const today = new Date();

  let filtered = data.filter((dude) => dude.birthDate.modifier == "exact");
  const birthDayBoys = filtered.filter(
    (dude) =>
      dude.birthDate.day1 == padDateString(today.getDate()) &&
      dude.birthDate.month1 == today.getMonth()
  );
  console.log(birthDayBoys);

  years = [
    100, 150, 200, 250, 300, 350, 400, 450, 500, 600, 700, 800, 900, 1000, 1100,
    1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000,
  ];
  const anniversaries = filtered.filter((dude) =>
    years.includes(today.getFullYear() - parseInt(dude.birthDate.year1))
  );
  console.log(anniversaries);

  if (birthDayBoys.length != 0) {
    window.confetti({
      particleCount: 80,
      angle: 270,
      spread: 180,
      origin: { y: 0 },
    });
    birthDaysPopup.innerHTML += `<p>Today, the following people from your tree are celebrating their birthdays:</p>`;
    birthDayBoys.forEach((boy) => {
      birthDaysPopup.innerHTML += `<h4>${boy.name}</h4><p>${personToLifespan(
        boy
      )}</p>`;
    });
  } else if (anniversaries.length != 0) {
    window.confetti({
      particleCount: 15,
      angle: 270,
      spread: 180,
      origin: { y: 0 },
    });
    birthDaysPopup.innerHTML += `<p>Today, no one from your tree is celebrating their birthday.</p>
    <p>However, the following people are celebrating their anniversaries this year:`;
    anniversaries.forEach((dude) => {
      birthDaysPopup.innerHTML += `<h4>${dude.name}</h4><p>${personToLifespan(
        dude
      )}</p>`;
    });
  } else {
    birthDaysPopup.innerHTML += `<p>No one from your tree is having an important date right now.</p>`;
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GRAPH
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////v
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//initialize graph probably idk what this stuff does
var g = new dagreD3.graphlib.Graph()
  .setGraph({})
  .setDefaultEdgeLabel(function () {
    return {};
  });

let loc = d3.zoomIdentity;

var render = new dagreD3.render();

// https://github.com/dagrejs/dagre-d3/issues/251#issuecomment-867115193
function renderFixed() {
  inner.attr("transform", d3.zoomIdentity);
  render(inner, g);
  inner.attr("transform", loc);
}

var svg = d3.select("#graph"),
  inner = svg.append("g");

var zoom = d3.zoom().on("zoom", function () {
  loc = d3.event.transform;
  inner.attr("transform", d3.event.transform);
});
svg.call(zoom);

main(treeUser);

//graphs the first guy their parents and gets some data for some reason
async function main(user) {
  data = await getData(user);
  if (data.length == 0) return 1;
  data = data.filter((n) => n);
  //logic for selecting the person in focus
  let target = getCookie("target");
  if (!target) target = data[0].id;
  for (var i = 0; i < data.length; i++) {
    if (data[i].id == target) {
      break;
    }
  }
  if (i == data.length) {
    var rootUser = 0;
  } else {
    var rootUser = i;
  }
  const root = idToData(data[rootUser].id);
  const parent1temp = idToData(root.parent1Id);
  const parent2temp = idToData(root.parent2Id);
  if (parent1temp && parent2temp) {
    parent1 = parent1temp.gender === "male" ? parent1temp : parent2temp;
    parent2 = parent1temp.gender === "male" ? parent2temp : parent1temp;
  } else {
    parent1 = parent1temp || "";
    parent2 = parent2temp || "";
  }

  idSetNode(root.id);
  //this thing cuz the first guys parents are rendered automatically
  removeButton(/<input type='button' id="parentButton"(.*?)>/, root.id);
  if (parent1temp) idSetNode(parent1.id);
  if (parent2temp) idSetNode(parent2.id);
  //if parents both exist
  if (parent1 && parent2) {
    g.setNode(
      `${(parent1.id + parent2.id).split("").sort().join("")}ParentMarriage`,
      { label: "", class: "marriage" }
    );

    g.setEdge(
      parent1.id,
      `${(parent1.id + parent2.id).split("").sort().join("")}ParentMarriage`,
      {
        arrowhead: "undirected",
        curve: d3[localStorage.getItem("connector")],
      }
    );
    g.setEdge(
      parent2.id,
      `${(parent1.id + parent2.id).split("").sort().join("")}ParentMarriage`,
      {
        arrowhead: "undirected",
        curve: d3[localStorage.getItem("connector")],
      }
    );
    g.setEdge(
      `${(parent1.id + parent2.id).split("").sort().join("")}ParentMarriage`,
      root.id,
      {
        arrowhead: "undirected",
        curve: d3[localStorage.getItem("connector")],
      }
    );
  } else if (parent1) {
    g.setNode(`${parent1.id}childNode`, { class: "marriage", label: "" });
    g.setEdge(parent1.id, `${parent1.id}childNode`, {
      arrowhead: "undirected",
      curve: d3[localStorage.getItem("connector")],
    });
    g.setEdge(`${parent1.id}childNode`, root.id, {
      arrowhead: "undirected",
      curve: d3[localStorage.getItem("connector")],
    });
  } else if (parent2) {
    g.setNode(`${parent2.id}childNode`, { class: "marriage", label: "" });
    g.setEdge(parent2.id, `${parent2.id}childNode`, {
      arrowhead: "undirected",
      curve: d3[localStorage.getItem("connector")],
    });
    g.setEdge(`${parent2.id}childNode`, root.id, {
      arrowhead: "undirected",
      curve: d3[localStorage.getItem("connector")],
    });
  }
  renderFixed();
  setTimeout(() => {
    renderFixed();
  }, 1);
}

//returns the person object from the tree based on id
function idToData(id) {
  return data.find((element) => element.id == id);
}
//graohs a persons parents on click
function graphParents(id) {
  const root = idToData(id);
  parent1temp = idToData(root.parent1Id);
  parent2temp = idToData(root.parent2Id);
  if (parent1temp && parent2temp) {
    parent1 = parent1temp.gender === "male" ? parent1temp : parent2temp;
    parent2 = parent1temp.gender === "male" ? parent2temp : parent1temp;
  } else {
    parent1 = parent1temp || "";
    parent2 = parent2temp || "";
  }

  //that monstrosity removes the parentButton element
  removeButton(/<input type='button' id="parentButton"(.*?)>/, root.id);

  if (parent1) idSetNode(parent1.id);
  if (parent2) idSetNode(parent2.id);
  //if both parents exist
  if (parent1 && parent2) {
    //if the parents have children together
    if (parent1.spouses.includes(parent2.id)) {
      const marriageId = `${(parent1.id + parent2.id)
        .split("")
        .sort()
        .join("")}ParentMarriage`;
      //set a node for the parents' marriage
      g.setNode(marriageId, { label: "", class: "marriage" });
      g.setEdge(parent1.id, marriageId, {
        arrowhead: "undirected",
        curve: d3[localStorage.getItem("connector")],
      });
      g.setEdge(parent2.id, marriageId, {
        arrowhead: "undirected",
        curve: d3[localStorage.getItem("connector")],
      });
      g.setEdge(marriageId, root.id, {
        arrowhead: "undirected",
        curve: d3[localStorage.getItem("connector")],
      });
      //if the parents dont have children together (wait what why is this a thing is this even possible)
    } else {
      if (parent1) {
        g.setEdge(parent1.id, root.id, {
          arrowhead: "undirected",
          curve: d3[localStorage.getItem("connector")],
        });
      }
      if (parent2) {
        g.setEdge(parent2.id, root.id, {
          arrowhead: "undirected",
          curve: d3[localStorage.getItem("connector")],
        });
      }
    }
    //if only parent1 exists
  } else if (parent1) {
    g.setNode(`${parent1.id}childNode`, { class: "marriage", label: "" });
    g.setEdge(parent1.id, `${parent1.id}childNode`, {
      arrowhead: "undirected",
      curve: d3[localStorage.getItem("connector")],
    });
    g.setEdge(`${parent1.id}childNode`, root.id, {
      arrowhead: "undirected",
      curve: d3[localStorage.getItem("connector")],
    });
  } else if (parent2) {
    g.setNode(`${parent2.id}childNode`, { class: "marriage", label: "" });
    g.setEdge(parent2.id, `${parent2.id}childNode`, {
      arrowhead: "undirected",
      curve: d3[localStorage.getItem("connector")],
    });
    g.setEdge(`${parent2.id}childNode`, root.id, {
      arrowhead: "undirected",
      curve: d3[localStorage.getItem("connector")],
    });
  }
  renderFixed();
}
//returns the tree
async function getData() {
  res = await fetch(
    `https://familytree.loophole.site/getTree?token=${token}${requestEnd}`
  );
  return await res.json();
}
async function graphChildren(id) {
  const root = idToData(id);
  //that monstrosity removes the childButton element from the root node
  removeButton(/<input type='button' id="childButton"(.*?)>/, root.id);
  for (var i = 0; i < root.children.length; i++) {
    keepgoing = true;
    child = idToData(root.children[i]);
    //only shows children not currently shown
    if (nodeOnScreen(child)) {
      continue;
    }
    idSetNode(child.id);
    removeButton(/<input type='button' id="parentButton"(.*?)>/, child.id);
    //if child has both parents
    if (child.parent1Id && child.parent2Id) {
      //if parents are both on screen
      if (nodeOnScreen(child.parent1Id) && nodeOnScreen(child.parent2Id)) {
        //if the parents' marriage is on screen
        if (
          nodeOnScreen(
            `${(child.parent1Id + child.parent2Id)
              .split("")
              .sort()
              .join("")}ParentMarriage`
          )
        ) {
          g.setEdge(
            `${(child.parent1Id + child.parent2Id)
              .split("")
              .sort()
              .join("")}ParentMarriage`,
            child.id,
            {
              arrowhead: "undirected",
              curve: d3[localStorage.getItem("connector")],
            }
          );
        }
        //if both the parents arent on screen
      } else {
        //if parent 1 isnt a node add it
        if (!nodeOnScreen(child.parent1Id)) {
          parent1 = idToData(child.parent1Id);
          idSetNode(child.parent1Id);
        }
        //if parent 2 isnt a node add it
        else if (!nodeOnScreen(child.parent2Id)) {
          parent2 = idToData(child.parent2Id);
          idSetNode(child.parent2Id);
        }
        g.setNode(
          `${(child.parent1Id + child.parent2Id)
            .split("")
            .sort()
            .join("")}ParentMarriage`,
          { label: "", class: "marriage" }
        );
        g.setEdge(
          child.parent1Id,
          `${(child.parent1Id + child.parent2Id)
            .split("")
            .sort()
            .join("")}ParentMarriage`,
          {
            arrowhead: "undirected",
            curve: d3[localStorage.getItem("connector")],
          }
        );
        g.setEdge(
          child.parent2Id,
          `${(child.parent1Id + child.parent2Id)
            .split("")
            .sort()
            .join("")}ParentMarriage`,
          {
            arrowhead: "undirected",
            curve: d3[localStorage.getItem("connector")],
          }
        );
        g.setEdge(
          `${(child.parent1Id + child.parent2Id)
            .split("")
            .sort()
            .join("")}ParentMarriage`,
          child.id,
          {
            arrowhead: "undirected",
            curve: d3[localStorage.getItem("connector")],
          }
        );
      }
    }
    //if parent 1 happens to exist
    else if (child.parent1Id) {
      g.setNode(`${child.parent1Id}childNode`, {
        class: "marriage",
        label: "",
      });
      g.setEdge(child.parent1Id, `${child.parent1Id}childNode`, {
        arrowhead: "undirected",
        curve: d3[localStorage.getItem("connector")],
      });
      g.setEdge(`${child.parent1Id}childNode`, child.id, {
        arrowhead: "undirected",
        curve: d3[localStorage.getItem("connector")],
      });
    }
    //if parent 2 happens to exist
    else if (child.parent2Id) {
      g.setNode(`${child.parent2Id}childNode`, {
        class: "marriage",
        label: "",
      });
      g.setEdge(child.parent2Id, `${child.parent2Id}childNode`, {
        arrowhead: "undirected",
        curve: d3[localStorage.getItem("connector")],
      });
      g.setEdge(`${child.parent2Id}childNode`, child.id, {
        arrowhead: "undirected",
        curve: d3[localStorage.getItem("connector")],
      });
    }
    //probably a lot of cases missing here
  }
  renderFixed();
}
//
function graphSpouse(id) {
  const person = idToData(id);
  const spouse = idToData(person.spouses[0]);
  //removes the spouse button from the person who is being expanded
  removeButton(/<input type='button' id="spouseButton"(.*?)>/, id);
  //set spouse node
  idSetNode(spouse.id);
  //set a marriage node so the spouses are on the same rank
  g.setNode(`${(id + spouse.id).split("").sort().join("")}ParentMarriage`, {
    label: "",
    class: "marriage",
  });
  g.setEdge(id, `${(id + spouse.id).split("").sort().join("")}ParentMarriage`, {
    arrowhead: "undirected",
    curve: d3[localStorage.getItem("connector")],
  });
  g.setEdge(
    spouse.id,
    `${(id + spouse.id).split("").sort().join("")}ParentMarriage`,
    {
      arrowhead: "undirected",
      curve: d3[localStorage.getItem("connector")],
    }
  );
  renderFixed();
}
//checks if a node is on screen by id
function nodeOnScreen(id) {
  return Object.keys(g._nodes).includes(id);
}
//returns the html label in the tree for a person based on their uuid
function idSetNode(uuid) {
  if (typeof uuid == "object") {
    throw new Error("Thats not an id brother");
  }
  const person = idToData(uuid);
  g.setNode(uuid, {
    labelType: "html",
    label: `<div style="min-height: 90px; width: 160px;" onclick="handleKeyboardShortcuts(event, '${
      person.id
    }')">
    ${
      localStorage.getItem("show-pics") === "true"
        ? `<img style="width: 80%;  align-self: center; display: block; margin-left: auto;margin-right: auto;" src="${
            person.pic
              ? person.pic
              : "https://media.istockphoto.com/id/1451587807/vector/user-profile-icon-vector-avatar-or-person-icon-profile-picture-portrait-symbol-vector.jpg?s=612x612&w=0&k=20&c=yDJ4ITX1cHMh25Lt1vI1zBn2cAKKAlByHBvPJ8gEiIg="
          }">`
        : ""
    }
    <p onclick="openPerson('${person.id}', '${requestEnd}')">${
      person.name
    }</p> ${personToLifespan(person)} 
    ${person.lore ? `<p style="font-style: italic;">${person.lore}</p>` : ""}
    ${
      toShowParentsButton(person)
        ? `<input type='button' id="parentButton" onclick="graphParents('${person.id}')" value="P">`
        : ""
    } 
    ${
      (
        person.children.length > 1
          ? true
          : !nodeOnScreen(person.children[0]) && person.children.length != 0
      )
        ? `<input type='button' id="childButton" onclick="graphChildren('${person.id}')" value="C">`
        : ""
    }
    ${
      person.children.length == 0 &&
      person.spouses.length == 1 &&
      !nodeOnScreen(person.spouses[0])
        ? `<input type='button' id="spouseButton" onclick="graphSpouse('${person.id}')" value="S">`
        : ""
    }
    </div>`,
    style: `fill: ${
      treeStyle == "normal"
        ? person.gender == "male"
          ? "#00c4f3;"
          : "#ff72af"
        : (treeStyle = "info"
            ? "#" + rainbow.colorAt(personToInfoScore(person))
            : "pink")
    };`,
    class: `${uuid}-node`,
  });
}
function removeButton(regex, id) {
  const person = idToData(id);
  g.setNode(id, {
    labelType: "html",
    label: Object.values(g._nodes)[
      Object.keys(g._nodes).indexOf(id)
    ].label.replace(regex, ""),
    style: `fill: ${
      treeStyle == "normal"
        ? person.gender == "male"
          ? "#00c4f3;"
          : "#ff72af"
        : (treeStyle = "info"
            ? "#" + rainbow.colorAt(personToInfoScore(person))
            : "pink")
    };`,
  });
}

//to show or not to show it
//i mean it could be a switch case but that is really not important whoever sees this is 100% free to change it if they so desire
function toShowParentsButton(person) {
  if (!person.parent1Id && !person.parent2Id) {
    return false;
  }
  if (person.parent1Id && person.parent2Id) {
    if (nodeOnScreen(person.parent1Id) && nodeOnScreen(person.parent2Id)) {
      return false;
    } else {
      return true;
    }
  }
  if (person.parent1Id) {
    return !nodeOnScreen(person.parent1Id);
  }
  if (person.parent2Id) {
    return !nodeOnScreen(person.parent2Id);
  }
}

async function checkGraphUpdates() {
  oldTree = data;
  data = await getData(treeUser);
  data = data.filter((n) => n);

  const oldIds = oldTree.map((a) => a.id);

  data.forEach((element) => {
    if (!oldIds.includes(element.id)) {
      if (element.children.length != 0) {
        element.children.forEach((child) => {
          childLabel = Object.values(g._nodes)[
            Object.keys(g._nodes).indexOf(child)
          ].label;
          childLabel =
            childLabel.slice(0, childLabel.length - 6) +
            `<input type='button' id="parentButton" onclick="graphParents('${child}')" value="P">` +
            "</div>";
          g.setNode(child, { labelType: "html", label: childLabel });
        });
      } else if (element.spouses.length == 1) {
        spouseLabel = Object.values(g._nodes)[
          Object.keys(g._nodes).indexOf(element.spouses[0])
        ].label;
        spouseLabel =
          spouseLabel.slice(0, spouseLabel.length - 6) +
          `<input type='button' id="spouseButton" onclick="graphSpouse('${element.spouses[0]}')" value="S">` +
          "</div>";
        g.setNode(element.spouses[0], {
          labelType: "html",
          label: spouseLabel,
        });
      }
      if (element.parent1Id) {
        parentLabel = Object.values(g._nodes)[
          Object.keys(g._nodes).indexOf(element.parent1Id)
        ].label;
        parentLabel =
          parentLabel.slice(0, parentLabel.length - 6) +
          `<input type='button' id="parentButton" onclick="graphChildren('${element.parent1Id}')" value="C">` +
          "</div>";
        g.setNode(element.parent1Id, { labelType: "html", label: parentLabel });
      }
      if (element.parent2Id) {
        parentLabel = Object.values(g._nodes)[
          Object.keys(g._nodes).indexOf(element.parent2Id)
        ].label;
        parentLabel =
          parentLabel.slice(0, parentLabel.length - 6) +
          `<input type='button' id="parentButton" onclick="graphChildren('${element.parent2Id}')" value="C">` +
          "</div>";
        g.setNode(element.parent2Id, { labelType: "html", label: parentLabel });
      }
    }
  });
  Object.keys(g._nodes).forEach((element) => {
    if (!(element.match(/childNode/) || element.match(/ParentMarriage/))) {
      idSetNode(element);
    }
  });

  renderFixed();
}

function personToInfoScore(dude) {
  return (
    dude.writing.length +
    dude.sources.length * 0.25 +
    dude.children.length * 10 +
    (dude.birthDate ? 35 : 0) +
    (dude.birthPlace ? 35 : 0) +
    (dude.deathDate ? 35 : 0) +
    (dude.deathPlace ? 35 : 0) +
    (dude.deathCause ? 25 : 0) +
    (dude.burialPlace ? 25 : 0) +
    (dude.pic ? 100 : 0)
  );
}

function logOut() {
  localStorage.removeItem("token");
  localStorage.removeItem("treeUser");
  localStorage.removeItem("username");
  window.location = "/";
}

async function openAll(personId) {
  const person = idToData(personId);
  console.log(person);
  if (person.parent1Id || person.parent2Id) {
    graphParents(personId);
    if (person.parent1Id) await openAll(person.parent1Id);
    if (person.parent2Id) await openAll(person.parent2Id);
  }
  return 0;
}

async function handleKeyboardShortcuts(e, personId) {
  if (e.altKey) {
    openPopup(8);

    setTimeout(() => {
      openAll(personId);
      closePopupFunc();
    }, 1);
  }
}
