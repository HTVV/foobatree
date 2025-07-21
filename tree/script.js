import f3 from "../src/index.js";

const token = localStorage.getItem("token");
const user = localStorage.getItem("username") ?? "";
let data = null;
let f3Chart;
let f3Card;
let f3EditTree;
let popup;

let mainPerson = localStorage.getItem("main");

async function main() {
  setup();

  const res = await fetch(
    `https://familytree.loophole.site/getTree?token=${token}`
  );
  data = await res.json();
  if (!data.find((dude) => dude.id == mainPerson)) {
    mainPerson = data[0].id;
    localStorage.setItem("main", data[0].id);
  }
  console.log(data);

  //change date format
  if (data.some((obj) => typeof obj.data.birthDate == "string")) {
    for (let i = 0; i < data.length; i++) {
      if (typeof data[i].data.birthDate == "string") {
        data[i].data.birthDate = new FtDate(
          data[i].data.birthDate.split("-")[0] == "undefined"
            ? ""
            : data[i].data.birthDate.split("-")[2],
          data[i].data.birthDate.split("-")[1] == "undefined"
            ? ""
            : data[i].data.birthDate.split("-")[1],
          data[i].data.birthDate.split("-")[2] == "undefined"
            ? ""
            : data[i].data.birthDate.split("-")[0],
          "exact",
          "",
          "",
          ""
        );
      }
      if (typeof data[i].data.deathDate == "string") {
        data[i].data.deathDate = new FtDate(
          data[i].data.deathDate.split("-")[0] == "undefined"
            ? ""
            : data[i].data.deathDate.split("-")[2],
          data[i].data.deathDate.split("-")[1] == "undefined"
            ? ""
            : data[i].data.deathDate.split("-")[1],
          data[i].data.deathDate.split("-")[2] == "undefined"
            ? ""
            : data[i].data.deathDate.split("-")[0],
          "exact",
          "",
          "",
          ""
        );
      }
    }
    updateData(data);
  }

  if (data.length == 0) {
    data.push({
      id: randomUUID(),
      rels: {
        spouses: [],
        children: [],
      },
      data: {
        firstName: "",
        patronym: "",
        lastName: "",
        ogName: "",
        birthDate: "",
        birthPlace: "",
        deathDate: "",
        deathCause: "",
        deathPlace: "",
        burialPlace: "",
        lore: "",
        writing: "",
        sources: "",
        avatar: "",
      },
    });
  }
  create(data);
}

main();

function create(data) {
  f3Chart = f3
    .createChart("#FamilyChart", data)
    .setTransitionTime(500)
    .setCardXSpacing(250)
    .setCardYSpacing(150)
    .setSingleParentEmptyCard(false)
    .setShowSiblingsOfMain(false)
    .setOrientationVertical()
    .updateMainId(mainPerson ?? data[0].id)
    .setShowSiblingsOfMain(true)
    .setSortChildrenFunction((a, b) =>{
      console.log(b)
      if(a.data.birthDate?.year1 > b.data.birthDate?.year1) return 1
      if(a.data.birthDate?.year1 < b.data.birthDate?.year1) return -1

      if(a.data.birthDate?.month1 > b.data.birthDate?.month1) return 1
      if(a.data.birthDate?.month1 < b.data.birthDate?.month1) return -1

      if(a.data.birthDate?.day1 > b.data.birthDate?.day1) return 1
      if(a.data.birthDate?.day1 < b.data.birthDate?.day1) return -1

      return 0
    }
    );

  f3Card = f3Chart
    .setCard(f3.CardHtml)
    .setOnCardUpdate(function (d) {
      const person = d.data.data;
      const card_label = this.querySelector(".card-label");
      card_label.innerHTML = `
        <div>${person.firstName} ${person.patronym} ${person.lastName}${
        person.ogName ? ` (${person.ogName})` : ""
      }</div>
        <div>${personToLifespan(person)}</div>
        <div>${person.lore ? person.lore : ""}</div>
      `;
    })
    .setCardDim({
      w: 235,
      h: 90,
      text_x: 75,
      text_y: 15,
      img_w: 80,
      img_h: 80,
      img_x: 5,
      img_y: 0,
    })
    .setMiniTree(false)
    .setStyle("imageRect")
    .setOnHoverPathToMain();

  f3EditTree = f3Chart
    .editTree()
    .fixed(true)
    .setFields([
      {
        type: "select",
        label: "Status",
        id: "status",
        options: [
          { label: "Deceased", value: "dead" },
          { label: "Living", value: "alive" },
          { label: "Unknown", value: "unknown" },
        ],
      },
      { type: "text", label: "First name(s)", id: "firstName" },
      { type: "text", label: "Patronym", id: "patronym" },
      { type: "text", label: "Latest last name(s)", id: "lastName" },
      { type: "text", label: "Birth last name(s)", id: "ogName" },
      { type: "date", label: "Date of birth", id: "birthDate" },
      { type: "text", label: "Place of birth", id: "birthPlace" },
      { type: "date", label: "Date of death", id: "deathDate" },
      { type: "text", label: "Place of death", id: "deathPlace" },
      { type: "text", label: "Cause of death", id: "deathCause" },
      { type: "text", label: "Place of burial", id: "burialPlace" },
      { type: "text", label: "Lore", id: "lore" },
      { type: "textarea", label: "Writing", id: "writing" },
      { type: "textarea", label: "Sources", id: "sources", link: true },
      { type: "text", label: "Picture (url)", id: "avatar" },
    ])
    .setEditFirst(false)
    .setLinkExistingRelConfig({label: "Link existing relative", linkRelLabel: function(d) {
    return `${d.data.firstName} ${d.data.patronym} ${d.data.lastName}${
        d.data.ogName ? ` (${d.data.ogName})` : ""
      }`
  }})
    .setCardClickOpen(f3Card)
    .setOnChange(() => {
      const update = f3EditTree.getStoreDataCopy();
      updateData(update);
      data = update;
    })
    .setKinshipInfo({
      self_id: mainPerson ?? data[0].id,
      title: "Relationship to main",
      show_in_law: true,
    });

  f3EditTree.setEdit();
  f3Chart.updateTree({ initial: true });
  f3EditTree.open(f3Chart.getMainDatum());

  f3Chart.updateTree({ initial: true });
}

function updateData(newData) {
  fetch("https://familytree.loophole.site/setTree", {
    method: "POST",
    headers: {},
    "Content-Type": "application/json",
    body: JSON.stringify({
      token: token,
      content: newData,
    }),
  });
}

function randomUUID() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
    (
      +c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))
    ).toString(16)
  );
}

function setup() {
  document
    .getElementById("dgedcom")
    .addEventListener("click", async function (e) {
      document.getElementById("ddrop").removeAttribute("open");
      downloadTextFile(
        await toGedcom(data),
        user ? `${user}'s_tree.ged` : "my_tree.ged"
      );
    });
  document.getElementById("djson").addEventListener("click", function (e) {
    document.getElementById("ddrop").removeAttribute("open");
    downloadTextFile(
      JSON.stringify(data),
      user ? `${user}'s_tree.json` : "my_tree.json"
    );
  });
}

function downloadTextFile(text, name) {
  const a = document.createElement("a");
  const type = name.split(".").pop();
  a.href = URL.createObjectURL(
    new Blob([text], { type: `text/${type === "txt" ? "plain" : type}` })
  );
  a.download = name;
  a.click();
}

/* async function downloadPng() {
  const canvas = await drawOnCanvas();
  const blob = await canvasToBlob(canvas, 'image/png');
  saveAs(blob, user ? `${user}'s_tree.png` : "my_tree.png");
}

async function downloadPdf() {
  const canvas = await drawOnCanvas();
  const doc = new jspdf({
    orientation: canvas.width > canvas.height ? 'l' : 'p',
    unit: 'pt',
    format: [canvas.width, canvas.height],
  });
  doc.addImage(canvas, 'PNG', 0, 0, canvas.width, canvas.height, 'NONE');
  doc.save(user ? `${user}'s_tree.pdf` : "my_tree.pdf");
} */

class FtDate {
  constructor(day1, month1, year1, modifier, day2, month2, year2) {
    this.day1 = day1 || "";
    this.month1 = month1 || "";
    this.year1 = year1 || "";
    this.modifier = modifier;
    this.day2 = day2 || "";
    this.month2 = month2 || "";
    this.year2 = year2 || "";
  }
}
