import f3 from "../src/index.js";

const token = localStorage.getItem("token");
let data = null;
let f3Chart;
let f3Card;
let f3EditTree;

let mainPerson = localStorage.getItem("main");

async function main() {
  const res = await fetch(
    `https://familytree.loophole.site/getTree?token=${token}`
  );
  data = await res.json();
  if(!data.find(dude => dude.id == mainPerson)) {
    mainPerson = data[0].id
    localStorage.setItem("main", data[0].id)
  }
  console.log(data);

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
    .setShowSiblingsOfMain(true);

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
    .setCardDim({w:230,h:90,text_x:75,text_y:15,img_w:80,img_h:80,img_x:5,img_y:0})
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
      { type: "text", label: "Cause of death", id: "deathCause" },
      { type: "text", label: "Place of death", id: "deathPlace" },
      { type: "text", label: "Place of burial", id: "burialPlace" },
      { type: "text", label: "Lore", id: "lore" },
      { type: "textarea", label: "Writing", id: "writing" },
      { type: "textarea", label: "Sources", id: "sources", link: true },
      { type: "text", label: "Picture (url)", id: "avatar" },
    ])
    .setEditFirst(false)
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
