const token = getCookie("token");
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const uuid = urlParams.get("uuid");
console.log(uuid);
var treeUser;
if (urlParams.get("username")) {
  treeUser = urlParams.get("username");
} else {
  treeUser = "empty";
}
const requestEnd = treeUser == "empty" ? "" : `&username=${treeUser}`;

handleDarkMode();

const popupOverlay = document.getElementById("popupOverlay");
const popup = document.getElementById("popup");
const closePopup = document.getElementById("closePopup");
type = "";

popupOverlay.addEventListener("click", function (event) {
  if (event.target === popupOverlay) {
    closePopupFunc();
  }
});

document.addEventListener("keydown", async function (e) {
  if (e.key == "Escape") {
    closePopupFunc();
  }
});

document.getElementById("focusInput").addEventListener("input", function (e) {
  search(tree);
});

function getCookie(name) {
  return localStorage.getItem(name);
  /* const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift(); */
}

//opens parent adding popup
function openPopupFunc() {
  document.getElementById("popup1").innerHTML = addPersonPopup;
  document.getElementById("submitButton").style.display = "block";
  type = "parents";
  popupOverlay.style.display = "flex";
  document.getElementById("popupHeader").textContent = "Add parent";
  document.getElementById("popup1").style.display = "block";

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
}
//opens child adding popup
async function openChildPopup() {
  document.getElementById("submitButton").style.display = "block";
  type = "child";
  popupOverlay.style.display = "flex";
  document.getElementById("popup1").innerHTML =
    `
    <p>Select other parent</p>
    <select name="otherParent" id="otherParentSelect"></select>` +
    addPersonPopup;
  for (var i = 0; i < person.spouses.length; i++) {
    document.getElementById("otherParentSelect").innerHTML += `<option value="${
      person.spouses[i]
    }">${await idToName(person.spouses[i])}</option>`;
  }
  document.getElementById("popup1Header").textContent = "Add child";
  document.getElementById("popup1").style.display = "block";
}
//opens spouse adding popup
function openSpousePopup() {
  document.getElementById("submitButton").style.display = "block";
  type = "spouse";
  popupOverlay.style.display = "flex";
  document.getElementById("popup1").innerHTML = addPersonPopup;
  document.getElementById("popupHeader").textContent = "Add spouse";
  document.getElementById("popup1").style.display = "block";
}
//opens the popup for name/birht/etc.
function openDetailsPopup(typeEdit) {
  type = "details";
  popupOverlay.style.display = "flex";
  document.getElementById("popup3").style.display = "flex";
  if (typeEdit == "birth") {
    document.getElementById("popup1").innerHTML = "";
    document.getElementById("popup3Content").innerHTML = `
        <h3>Change birth details</h3>
        <div class="dateInput popup-input">
    <p class="tohide1">Date of birth</p>
    <select id="birth-date-modifier-select">
      <option value="exact">Exact</option>
      <option value="circa">Circa</option>
      <option value="before">Before</option>
      <option value="after">After</option>
      <option value="between">Between</option>
    </select>
    <br /><br />
    <input
      type="number"
      id="birthDayInput1"
      min="1"
      max="31"
      placeholder="DD"
    />
    <input
      type="number"
      id="birthMonthInput1"
      min="1"
      max="12"
      placeholder="MM"
    />
    <input type="number" id="birthYearInput1" min="0" placeholder="YYYY" />
    <div class="birth2-inputs">
      <p style="align-self: flex-start;">to</p>
      <input
        type="number"
        id="birthDayInput2"
        min="1"
        max="31"
        placeholder="DD"
      />
      <input
        type="number"
        id="birthMonthInput2"
        min="1"
        max="12"
        placeholder="MM"
      />
      <input type="number" id="birthYearInput2" min="0" placeholder="YYYY" />
    </div>
  </div>
        <p>Birth place</p>
        <input class="popup-input" type="text" placeholder="" id="BirthPlaceInput" value="${
          person.birthPlace
        }">
        <p>Gender</p>
        <input class="popup-input" type="text" placeholder="" id="GenderInput" value="${
          person.gender
        }">
        <br></br>
        <div>
            <input type="radio" value="alive" name="changeStatus" ${
              person.status == "alive" ? "checked" : ""
            }>Living</input>
            <input type="radio" value="dead" name="changeStatus" ${
              person.status == "dead" ? "checked" : ""
            }>Dead</input>
            <input type="radio" value="unknown" name="changeStatus" ${
              person.status == "unknown" ? "checked" : ""
            }>Unknown</input>
        </div>
        `;

    requestAnimationFrame(() => {
      document
        .getElementById("birth-date-modifier-select")
        ?.addEventListener("change", function () {
          document.querySelector(".birth2-inputs").style.display =
            this.value === "between" ? "block" : "none";
        });
    });

    document.getElementById("birth-date-modifier-select").value = person.birthDate.modifier

    document.getElementById("birthDayInput1").value = person.birthDate.day1;
    document.getElementById("birthMonthInput1").value = person.birthDate.month1;
    document.getElementById("birthYearInput1").value = person.birthDate.year1;

    if (person.birthDate.modifier != "between") return 0;

    document.getElementById("birthDayInput2").value = person.birthDate.day2;
    document.getElementById("birthMonthInput2").value = person.birthDate.month2;
    document.getElementById("birthYearInput2").value = person.birthDate.year2;
  }
  if (typeEdit == "death") {
    document.getElementById("popup1").innerHTML = "";
    document.getElementById("popup3Content").innerHTML = `
        <h3>Change death details</h3>
        <div class="dateInput popup-input">
    <p class="tohide1">Date of death</p>
    <select id="death-date-modifier-select">
      <option value="exact">Exact</option>
      <option value="circa">Circa</option>
      <option value="before">Before</option>
      <option value="after">After</option>
      <option value="between">Between</option>
    </select>
    <br /><br />
    <input
      type="number"
      id="deathDayInput1"
      min="1"
      max="31"
      placeholder="DD"
    />
    <input
      type="number"
      id="deathMonthInput1"
      min="1"
      max="12"
      placeholder="MM"
    />
    <input type="number" id="deathYearInput1" min="0" placeholder="YYYY" />

    <div class="death2-inputs">
      <input
        type="number"
        id="deathDayInput2"
        min="1"
        max="31"
        placeholder="DD"
      />
      <input
        type="number"
        id="deathMonthInput2"
        min="1"
        max="12"
        placeholder="MM"
      />
      <input type="number" id="deathYearInput2" min="0" placeholder="YYYY" />
    </div>
  </div>
        <p>Death place</p>
        <input class="popup-input" type="text" id="DeathPlaceInput" value="${person.deathPlace}">
        <p>Cause of death</p>
        <input class="popup-input" type="text" id="DeathCauseInput" value="${person.causeOfDeath}">
        `;

    requestAnimationFrame(() => {
      document
        .getElementById("death-date-modifier-select")
        ?.addEventListener("change", function () {
          document.querySelector(".death2-inputs").style.display =
            this.value === "between" ? "block" : "none";
        });
    });

    document.getElementById("death-date-modifier-select").value = person.deathDate.modifier

    document.getElementById("deathDayInput1").value = person.deathDate.day1;
    document.getElementById("deathMonthInput1").value = person.deathDate.month1;
    document.getElementById("deathYearInput1").value = person.deathDate.year1;

    if (person.deathDate.modifier != "between") return 0;

    document.getElementById("deathDayInput2").value = person.deathDate.day2;
    document.getElementById("deathMonthInput2").value = person.deathDate.month2;
    document.getElementById("deathYearInput2").value = person.deathDate.year2;
  }
  if (typeEdit == "burial") {
    document.getElementById("popup3Content").innerHTML = `
        <h3>Change burial details</h3>
        <p>Burial place</p>
        <input class="popup-input" type="text" id="BurialPlaceInput" value="${person.burialPlace}">
        `;
  }
  if (typeEdit == "name") {
    document.getElementById("popup3Content").innerHTML = `
        <h3>Change name details</h3>
        <p>First name(s)</p>
        <input class="popup-input" type="text" id="FirstNameInput" value="${
          person.firstName
        }">
        <p>Patronym</p>
        <input class="popup-input" type="text" id="PatronymInput" value="${
          person.patronym
        }">
        <p>Last name(s)</p>
        <input class="popup-input" type="text" id="LastNameInput" value="${
          person.lastName
        }">
        <p>Birth last name(s)</p>
        <input class="popup-input" type="text" id="OgNameInput" value="${
          person.ogName
        }">
        <p>Lore</p>
        <input class="popup-input" type="text" id="LoreInput" value="${
          person.lore ? person.lore : ""
        }">
        <p>Link to profile picture</p>
        <input class="popup-input" type="text" id="img-input" value="${
          person.pic ? person.pic : ""
        }">
        <br></br>
        <img id="image-preview" style="width: 300px; max-height: 300px;">
        `;

    if (person.pic)
      document.getElementById("image-preview").src =
        document.getElementById("img-input").value;
    document
      .getElementById("img-input")
      .addEventListener("change", function () {
        document.getElementById("image-preview").src =
          document.getElementById("img-input").value;
        document.getElementById("image-preview").style.display = "inline-block";
      });
  }
}
function textPopup(typeEdit) {
  type = "text";
  popupOverlay.style.display = "flex";
  document.getElementById("popup3").style.display = "flex";
  if (typeEdit == "writing") {
    document.getElementById("popup3Content").innerHTML = `
        <h3>Edit writing</h3>
        <textarea class="text-input" type="text" placeholder="" id="WritingInput" rows="20">
        `;
    console.log(person.writing);
    document.getElementById("WritingInput").value = person.writing
      .replaceAll("%79", "+")
      .replaceAll("%89", "&");
  }
  if (typeEdit == "sources") {
    document.getElementById("popup3Content").innerHTML = `
        <h3>Edit sources</h3>
        <textarea class="text-input" type="text" placeholder="" id="SourcesInput" rows="20">
        `;
    document.getElementById("SourcesInput").value = person.sources
      .replaceAll("%79", "+")
      .replaceAll("%89", "&");
  }
}
function closePopupFunc() {
  document.getElementById("popupOverlay").style.display = "none";
  document.getElementById("popup1").style.display = "none";
  document.getElementById("popup2").style.display = "none";
  document.getElementById("popup3").style.display = "none";
}
async function submitForm() {
  if (type == "parents") {
    console.log("adding parent")
    if (!document.querySelector('input[name="maleFemale"]:checked')) {
      document.getElementById("error").textContent = "Please select gender";
      document.getElementById("popup1").scrollIntoView();
      return 1;
    }
    const status = document.querySelector(
      'input[name="deadAlive"]:checked'
    ).value;
    const gender = document.querySelector(
      'input[name="maleFemale"]:checked'
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
    const newUuid = randomUUID();

    let parent = {
      status: status,
      gender: gender,
      firstName: firstNames,
      lastName: lastNames,
      ogName: ogName,
      id: newUuid,
      patronym: patronym,
      birthDate: dateBirth,
      birthPlace: placeBirth,
      deathDate: dateDeath,
      deathPlace: placeDeath,
      burialPlace: placeBurial,
      children: [uuid],
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
    };

    if (person.parent1Id == null || person.parent1Id == "") {
      person.parent1Id = newUuid;
    } else {
      person.parent2Id = newUuid;
      const oldParent = await (
        await fetch(
          `https://familytree.loophole.site/getProfile?token=${token}&profileUuid=${person.parent1Id}${requestEnd}`
        )
      ).json();
      oldParent[0].spouses.push(newUuid);
      parent.spouses.push(person.parent1Id);
      fetch(
        `https://familytree.loophole.site/setProfile?token=${token}&profileUuid=${
          person.parent1Id
        }&content=${encodeURI(JSON.stringify(oldParent[0]))}${requestEnd}`
      );
    }

    parent = JSON.stringify(parent);
    //parent
    fetch(
      `https://familytree.loophole.site/setProfile?token=${token}&profileUuid=${newUuid}&content=${encodeURI(
        parent
      )}${requestEnd}`
    );
    //child
    fetch(
      `https://familytree.loophole.site/setProfile?token=${token}&profileUuid=${uuid}&content=${encodeURI(
        JSON.stringify(person)
      )}${requestEnd}`
    );
    //extra thing that maybe helps hasnt been tested in a month doesnt hurt anyone too much
    fetch(
      `https://familytree.loophole.site/setProfile?token=${token}&profileUuid=test&content=${requestEnd}`
    );
  }
  if (type == "details") {
    document.getElementById("popup1").innerHTML = ""
    //logic here is if the form exists, use it's vlaue, otherwise use the saved one
    if(document.getElementById("birthDayInput1")) {
      person.birthDate = new FtDate(
        (day1 = document.getElementById("birthDayInput1").value),
        (month1 = document.getElementById("birthMonthInput1").value),
        (year1 = document.getElementById("birthYearInput1").value),
        (modifier = document.getElementById("birth-date-modifier-select").value),
        (day2 = document.getElementById("birthDayInput2").value),
        (month2 = document.getElementById("birthMonthInput2").value),
        (year2 = document.getElementById("birthYearInput2").value)
      );
    }
    
    if(document.getElementById("deathDayInput1")) {
      person.deathDate = new FtDate(
        (day1 = document.getElementById("deathDayInput1").value),
        (month1 = document.getElementById("deathMonthInput1").value),
        (year1 = document.getElementById("deathYearInput1").value),
        (modifier = document.getElementById("death-date-modifier-select").value),
        (day2 = document.getElementById("deathDayInput2").value),
        (month2 = document.getElementById("deathMonthInput2").value),
        (year2 = document.getElementById("deathYearInput2").value)
      );
    }
    
      person.birthPlace = document.getElementById("BirthPlaceInput")
      ? document.getElementById("BirthPlaceInput").value
      : person.birthPlace;
    person.deathPlace = document.getElementById("DeathPlaceInput")
      ? document.getElementById("DeathPlaceInput").value
      : person.deathPlace;
    person.causeOfDeath = document.getElementById("DeathCauseInput")
      ? document.getElementById("DeathCauseInput").value
      : person.causeOfDeath;
    person.burialPlace = document.getElementById("BurialPlaceInput")
      ? document.getElementById("BurialPlaceInput").value
      : person.burialPlace;
    person.firstName = document.getElementById("FirstNameInput")
      ? document.getElementById("FirstNameInput").value
      : person.firstName;
    person.lastName = document.getElementById("LastNameInput")
      ? document.getElementById("LastNameInput").value
      : person.lastName;
    person.ogName = document.getElementById("OgNameInput")
      ? document.getElementById("OgNameInput").value
      : person.ogName;
    person.patronym = document.getElementById("PatronymInput")
      ? document.getElementById("PatronymInput").value
      : person.patronym;
    person.lore = document.getElementById("LoreInput")
      ? document.getElementById("LoreInput").value
      : person.lore;
    person.name = btrim(
      `${person.firstName} ${person.patronym} ${person.lastName}${
        person.ogName != "" ? ` (${person.ogName})` : ""
      }`
    );
    person.gender = document.getElementById("GenderInput")
      ? document.getElementById("GenderInput").value
      : person.gender;
    person.pic = document.getElementById("img-input")
      ? document.getElementById("img-input").value
      : person.pic;
    person.status = document.querySelector('input[name="changeStatus"]')
      ? document.querySelector('input[name="changeStatus"]:checked').value
      : person.status;
    console.log(person);
    fetch(
      `https://familytree.loophole.site/setProfile?token=${token}&profileUuid=${uuid}&content=${encodeURI(
        JSON.stringify(person)
      )}${requestEnd}`
    );
  }
  if (type == "text") {
    console.log("YES");
    person.writing = (
      document.getElementById("WritingInput")
        ? document.getElementById("WritingInput").value
        : person.writing
    )
      .replaceAll("+", "%79")
      .replaceAll("&", "%89");
    person.sources = (
      document.getElementById("SourcesInput")
        ? document.getElementById("SourcesInput").value
        : person.sources
    )
      .replaceAll("+", "%79")
      .replaceAll("&", "%89");
    fetch(
      `https://familytree.loophole.site/setProfile?token=${token}&profileUuid=${uuid}&content=${encodeURI(
        JSON.stringify(person)
      )}${requestEnd}`
    );
  }
  if (type == "spouse") {
    if (!document.querySelector('input[name="maleFemale"]:checked')) {
      document.getElementById("error").textContent = "Please select gender";
      document.getElementById("popup1").scrollIntoView();
      return 1;
    }
    const gender = document.querySelector(
      'input[name="maleFemale"]:checked'
    ).value;
    const status = document.querySelector(
      'input[name="deadAlive"]:checked'
    ).value;
    const firstNames = document.getElementById("firstNameInput").value;
    const lastNames = document.getElementById("lastNameInput").value;
    const patronym = document.getElementById("patronymInput").value;
    const dateBirth = document.getElementById("bornDateInput").value;
    const placeBirth = document.getElementById("bornPlaceInput").value;
    const dateDeath = document.getElementById("diedDateInput").value;
    const placeDeath = document.getElementById("diedPlaceInput").value;
    const placeBurial = document.getElementById("buriedPlaceInput").value;
    const ogName = document.getElementById("ogNameInput").value;
    const lore = document.getElementById("loreInput").value;
    const newUuid = randomUUID();

    spouse = JSON.stringify({
      status: status,
      gender: gender,
      firstName: firstNames,
      lastName: lastNames,
      ogName: ogName,
      id: newUuid,
      patronym: patronym,
      birthDate: dateBirth,
      birthPlace: placeBirth,
      deathDate: dateDeath,
      deathPlace: placeDeath,
      burialPlace: placeBurial,
      children: [],
      spouses: [uuid],
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
    });

    if (person.spouses == null) person.spouses = [];
    person.spouses.push(newUuid);

    var ele = document.getElementsByClassName("popup-input");
    for (var i = 0; i < ele.length; i++) {
      ele[i].value = "";
    }
    fetch(
      `https://familytree.loophole.site/setProfile?token=${token}&profileUuid=${uuid}&content=${encodeURI(
        JSON.stringify(person)
      )}${requestEnd}`
    );
    fetch(
      `https://familytree.loophole.site/setProfile?token=${token}&profileUuid=${newUuid}&content=${encodeURI(
        spouse
      )}${requestEnd}`
    );
  }
  if (type == "child") {
    if (!document.querySelector('input[name="maleFemale"]:checked')) {
      document.getElementById("error").textContent = "Please select gender";
      document.getElementById("popup1").scroll({ top: 0, behavior: "smooth" });
      return 1;
    }
    const gender = document.querySelector(
      'input[name="maleFemale"]:checked'
    ).value;
    var status = document.querySelector(
      'input[name="deadAlive"]:checked'
    ).value;
    const firstNames = document.getElementById("FirstNameInput1").value;
    const lastNames = document.getElementById("LastNameInput1").value;
    const patronym = document.getElementById("patronymInput1").value;
    const dateBirth = document.getElementById("BornDateInput1").value;
    const placeBirth = document.getElementById("BornPlaceInput1").value;
    const dateDeath = document.getElementById("DiedDateInput1").value;
    const placeDeath = document.getElementById("DiedPlaceInput1").value;
    const placeBurial = document.getElementById("BuriedPlaceInput1").value;
    const ogName = document.getElementById("OgNameInput1").value;
    const newUuid = randomUUID();
    const parent2 = document.getElementById("otherParentSelect").value;

    child = {
      status: status,
      gender: gender,
      firstName: firstNames,
      lastName: lastNames,
      ogName: ogName,
      id: newUuid,
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
      parent1Id: person.id,
      parent2Id: parent2,
    };

    var ele = document.getElementsByClassName("popup-input");
    for (var i = 0; i < ele.length; i++) {
      ele[i].value = "";
    }

    //parent who is currently being viewd
    person.children.push(newUuid);
    fetch(
      `https://familytree.loophole.site/setProfile?token=${token}&profileUuid=${
        person.id
      }&content=${encodeURI(JSON.stringify(person))}${requestEnd}`
    );
    //the other parent
    if (parent2) {
      const parent2Data = idToData(parent2);
      parent2Data = parent[0];
      parent2Data.children.push(newUuid);
      fetch(
        `https://familytree.loophole.site/setProfile?token=${token}&profileUuid=${parent2}&content=${encodeURI(
          JSON.stringify(parent2Data)
        )}${requestEnd}`
      );
    }
    //chiöd
    fetch(
      `https://familytree.loophole.site/setProfile?token=${token}&profileUuid=${newUuid}&content=${encodeURI(
        JSON.stringify(child)
      )}${requestEnd}`
    );
  }
  closePopupFunc();
}
function selectExisting() {
  document.getElementById("popup1").style.display = "none";
  document.getElementById("popup2").style.display = "block";
  document.getElementById("submitButton").style.display = "none";
}
function existingSubmit() {
  //dude is the one being addedd, person is the one whos page is currently being viewed. amazing system :thumb:
  let dude = idToData(document.getElementById("selectFocus").value);
  if (type == "parents") {
    if (person.parent1Id == null || person.parent1Id == "") {
      person.parent1Id = dude.id;
    } else {
      person.parent2Id = dude.id;
    }
    dude.children.push(person.id);
    //parent
    fetch(
      `https://familytree.loophole.site/setProfile?token=${token}&profileUuid=${
        dude.id
      }&content=${encodeURI(JSON.stringify(dude))}${requestEnd}`
    );
    //child
    fetch(
      `https://familytree.loophole.site/setProfile?token=${token}&profileUuid=${
        person.id
      }&content=${encodeURI(JSON.stringify(person))}${requestEnd}`
    );
  } else if (type == "child") {
    person.children.push(dude.id);
    if (dude.parent1Id == null || dude.parent1Id == "") {
      dude.parent1Id = person.id;
    } else {
      dude.parent2Id = person.id;
    }
    //child
    fetch(
      `https://familytree.loophole.site/setProfile?token=${token}&profileUuid=${
        dude.id
      }&content=${encodeURI(JSON.stringify(dude))}${requestEnd}`
    );
    //parent
    fetch(
      `https://familytree.loophole.site/setProfile?token=${token}&profileUuid=${
        person.id
      }&content=${encodeURI(JSON.stringify(person))}${requestEnd}`
    );
  } else if (type == "spouse") {
    dude.spouses.push(person.id);
    person.spouses.push(dude.id);
    fetch(
      `https://familytree.loophole.site/setProfile?token=${token}&profileUuid=${
        dude.id
      }&content=${encodeURI(JSON.stringify(dude))}${requestEnd}`
    );
    fetch(
      `https://familytree.loophole.site/setProfile?token=${token}&profileUuid=${
        person.id
      }&content=${encodeURI(JSON.stringify(person))}${requestEnd}`
    );
  }
  document.getElementById("submitButton").style.display = "block";
  closePopupFunc();
}
function hideForm(status, popupNumber) {
  show = "none";
  if (status == "dead") {
    show = "block";
  }
  var ele = document.getElementsByClassName("tohide" + popupNumber);
  for (var i = 0; i < ele.length; i++) {
    ele[i].style.display = show;
  }
}

function randomUUID() {
  return "10000000-1000-4000-8000-100000000000".replaceAll(/[018]/g, (c) =>
    (
      +c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))
    ).toString(16)
  );
}

async function main() {
  console.log(treeUser);
  person = await fetch(
    `https://familytree.loophole.site/getProfile?token=${token}&profileUuid=${uuid}${requestEnd}`
  ).then((personponse) => personponse.json());
  person = person[0];
  document.title = person.name;

  addPersonPopup = await (
    await fetch("../data/popup/addPersonPopup.html")
  ).text();
  document.getElementById("popup1").innerHTML = addPersonPopup;
  document.getElementById("profile-pic").src = person.pic
    ? person.pic
    : document.getElementById("profile-pic").src;
  tree = await getTree();
  tree = tree.filter((n) => n);
  //relativeCheck();
  showRelatives();

  datesCheck();

  document.getElementById(
    "children-relation-header"
  ).textContent += ` (${person.children.length})`;
  document.getElementById("name-text").textContent = person.name;
  birthDate = person.birthDate;
  if (typeof person.birthDate == "object") {
    birthModifier = person.birthDate.modifier + " ";
    if (birthModifier == "exact ") birthModifier = "";
    if (birthModifier == "between ") {
      birthModifier = "";
      document.getElementById(
        "birthDate"
      ).textContent = cleanDateString(`${birthModifier}${birthDate.day1}-${birthDate.month1}-${birthDate.year1} and ${birthDate.day2}-${birthDate.month2}-${birthDate.year2}`);
    } else {
      if (birthModifier == "circa ") birthModifier = "c. ";
      document.getElementById(
        "birthDate"
      ).textContent = cleanDateString(`${birthModifier}${birthDate.day1}-${birthDate.month1}-${birthDate.year1}`);
    }
  } else {
    document.getElementById("birthDate").textContent = birthDate;
  }
  deathDate = person.deathDate;
  if (typeof person.deathDate == "object") {
    deathModifier = person.deathDate.modifier + " ";
    if (deathModifier == "exact ") deathModifier = "";
    if (deathModifier == "between ") {
      deathModifier = "";
      document.getElementById(
        "deathDate"
      ).textContent = cleanDateString(`${deathModifier}${deathDate.day1}-${deathDate.month1}-${deathDate.year1} and ${deathDate.day2}-${deathDate.month2}-${deathDate.year2}`);
    } else {
      if (deathModifier == "circa ") deathModifier = "c. ";
      document.getElementById(
        "deathDate"
      ).textContent = cleanDateString(`${deathModifier}${deathDate.day1}-${deathDate.month1}-${deathDate.year1}`);
    }
  } else {
    document.getElementById("deathDate").textContent = deathDate;
  }
  document.getElementById("birthPlace").textContent = person.birthPlace;
  document.getElementById("deathPlace").textContent = person.deathPlace;
  document.getElementById("deathCause").textContent = person.causeOfDeath;
  document.getElementById("burialPlace").textContent = person.burialPlace;
  document.getElementById("writingText").textContent = person.writing
    .replaceAll("%79", "+")
    .replaceAll("%89", "&");
  document.getElementById("sourcesText").innerHTML = linkify(
    person.sources.replaceAll("%79", "+").replaceAll("%89", "&")
  )
  document.getElementById("gender").textContent =
    person.gender.charAt(0).toUpperCase() + person.gender.slice(1);
}

async function getTree() {
  let data = await fetch(
    `https://familytree.loophole.site/getTree?token=${token}${requestEnd}`
  );
  return await data.json();
}

function idToName(id) {
  return tree.find((element) => element.id == id).name;
}

function idToData(id) {
  return tree.find((element) => element.id == id);
}

async function relativeCheck() {
  //check if parents of person exist and if not delete the references to them
  if (person.parent1Id) {
    parentTest = await (
      await fetch(
        `https://familytree.loophole.site/getProfile?token=${token}&profileUuid=${person.parent1Id}${requestEnd}`
      )
    ).json();
    if (parentTest.error == 400) {
      console.log("parent 1 doesnt");
      person.parent1Id = null;
      fetch(
        `https://familytree.loophole.site/setProfile?token=${token}&profileUuid=${uuid}&content=${encodeURI(
          JSON.stringify(person)
        )}${requestEnd}`
      );
    }
  }
  if (person.parent2Id) {
    parentTest = await (
      await fetch(
        `https://familytree.loophole.site/getProfile?token=${token}&profileUuid=${person.parent2Id}${requestEnd}`
      )
    ).json();
    if (parentTest.error == 400) {
      console.log("parent 2 doesnt");
      person.parent2Id = null;
      fetch(
        `https://familytree.loophole.site/setProfile?token=${token}&profileUuid=${uuid}&content=${encodeURI(
          JSON.stringify(person)
        )}${requestEnd}`
      );
    }
  }

  //check if children are real
  todelete = [];
  for (var i = 0; i < person.children.length; i++) {
    childTest = await (
      await fetch(
        `https://familytree.loophole.site/getProfile?token=${token}&profileUuid=${person.children[i]}${requestEnd}`
      )
    ).json();

    if (childTest.error == 400) {
      todelete.push(person.children[i]);
    }
  }
  if (todelete.length > 0) {
    console.log("children not real");
    for (var i = todelete.length; i > 0; i--) {
      if (person.children.length != 1) {
        person.children = person.children.splice(
          person.children.indexOf(todelete[i]),
          1
        );
      } else {
        person.children = [];
      }
    }
    console.log(person);
    fetch(
      `https://familytree.loophole.site/setProfile?token=${token}&profileUuid=${uuid}&content=${encodeURI(
        JSON.stringify(person)
      )}${requestEnd}`
    );
  }

  //check if spouses are real
  todelete = [];
  for (var i = 0; i < person.spouses.length; i++) {
    spouseTest = await (
      await fetch(
        `https://familytree.loophole.site/getProfile?token=${token}&profileUuid=${person.spouses[i]}${requestEnd}`
      )
    ).json();

    if (spouseTest.error == 400) {
      todelete.push(person.spouses[i]);
    }
  }
  if (todelete.length > 0) {
    console.log("spouse not real");
    for (var i = todelete.length; i > 0; i--) {
      if (person.spouses.length != 1) {
        person.spouses = person.spouses.splice(
          person.spouses.indexOf(todelete[i]),
          1
        );
      } else {
        person.spouses = [];
      }
    }
    console.log(person);
    fetch(
      `https://familytree.loophole.site/setProfile?token=${token}&profileUuid=${uuid}&content=${encodeURI(
        JSON.stringify(person)
      )}${requestEnd}`
    );
  }
}
async function datesCheck() {
  if (typeof person.birthDate != "object") {
    birthDateList = person.birthDate.split("-");
    person.birthDate = new FtDate(
      (day1 = birthDateList[2]),
      (month1 = birthDateList[1]),
      (year1 = birthDateList[0]),
      (modifier = "exact")
    );

    fetch(
      `https://familytree.loophole.site/setProfile?token=${token}&profileUuid=${uuid}&content=${encodeURI(
        JSON.stringify(person)
      )}${requestEnd}`
    );
  }

  if (typeof person.deathDate != "object") {
    deathDateList = person.deathDate.split("-");
    person.deathDate = new FtDate(
      (day1 = deathDateList[2]),
      (month1 = deathDateList[1]),
      (year1 = deathDateList[0]),
      (modifier = "exact")
    );

    fetch(
      `https://familytree.loophole.site/setProfile?token=${token}&profileUuid=${uuid}&content=${encodeURI(
        JSON.stringify(person)
      )}${requestEnd}`
    );
  }
}
//puts relatives in the relative boxes
async function showRelatives() {
  //parents
  if (person.parent1Id && person.parent2Id) {
    document.getElementById("parents-container").innerHTML +=
      personToRelativeLabel(idToData(person.parent1Id));
    document.getElementById("parents-container").innerHTML +=
      personToRelativeLabel(idToData(person.parent2Id));
  } else if (person.parent1Id) {
    document.getElementById("parents-container").innerHTML +=
      personToRelativeLabel(idToData(person.parent1Id));
    document.getElementById(
      "parents-container"
    ).innerHTML += `<div class="row add-button" style="font-weight: 1000">
        <p style="font-size: 150%; align-content:center; margin: 0; margin-left: 5%;">+</p>
        <p style="align-content:center; margin:0;" onclick="openPopupFunc()">ADD PARENT</p>
        </div>`;
  } else if (person.parent2Id) {
    document.getElementById("parents-container").innerHTML +=
      personToRelativeLabel(idToData(person.parent2Id));
    document.getElementById(
      "parents-container"
    ).innerHTML += `<div class="row add-button" style="font-weight: 1000">
        <p style="font-size: 150%; align-content:center; margin: 0; margin-left: 5%;">+</p>
        <p style="align-content:center; margin:0;" onclick="openPopupFunc()">ADD PARENT</p>
        </div>`;
  } else {
    document.getElementById(
      "parents-container"
    ).innerHTML += `<div class="row add-button" style="font-weight: 1000">
        <p style="font-size: 150%; align-content:center; margin: 0; margin-left: 5%;">+</p>
        <p style="align-content:center; margin:0;" onclick="openPopupFunc()">ADD PARENT</p>
        </div>`;
  }

  //spouses
  for (var i = 0; i < person.spouses.length; i++) {
    document.getElementById("spouses-container").innerHTML +=
      personToRelativeLabel(idToData(person.spouses[i]));
  }
  document.getElementById(
    "spouses-container"
  ).innerHTML += `<div class="row add-button" style="font-weight: 1000">
        <p style="font-size: 150%; align-content:center; margin: 0; margin-left: 5%;">+</p>
        <p style="align-content:center; margin:0;" onclick="openSpousePopup()">ADD SPOUSE</p>
        </div>`;

  //children
  let childArray = [];
  for (var i = 0; i < person.children.length; i++) {
    childArray.push(idToData(person.children[i]));
  }
  console.log(childArray);
  childArray.sort((a, b) => a.birthDate.slice(0, 4) - b.birthDate.slice(0, 4));
  console.log(childArray);
  for (var i = 0; i < childArray.length; i++) {
    document.getElementById("children-container").innerHTML +=
      personToRelativeLabel(childArray[i]);
  }

  document.getElementById(
    "children-container"
  ).innerHTML += `<div class="row add-button" style="font-weight: 1000">
        <p style="font-size: 150%; align-content:center; margin: 0; margin-left: 5%;">+</p>
        <p style="align-content:center; margin:0;" onclick="openChildPopup()">ADD CHILD</p>
        </div>`;
}

function personToRelativeLabel(person) {
  return `<div class="relative" style="background-color: ${
    person.gender == "male" ? "#00c4f3" : "#ff72af"
  };">
        <div class="row">
            <p style="font-size: 80%; margin-bottom: 0; margin-left: 5%; margin-top:" class="relative-text" onclick="openPerson('${
              person.id
            }', '${requestEnd}')">${person.name}</p>
            <img src="/img/trash.png" style="max-width: 20%; margin-left:auto; height:fit-content;" onclick="deleteConnectionPopup('${
              person.id
            }')"></img>
        </div>
        <p style="font-size: 70%; margin-top: 0; margin-left: 5%;">${personToLifespan(
          person
        )}</p>
    </div>`;
}

function deleteConnectionPopup(id) {
  type = "deleteConnection";
  popupOverlay.style.display = "flex";
  document.getElementById("popup3").style.display = "flex";
  document.getElementById("submitButton").style.display = "none";
  document.getElementById("popup3Content").innerHTML = `
    <h3>Are you sure you want to delete this connection?</h3>
    <button class="submit" id="deleteConnectionButton" style="background-color: red;"onclick="deleteConnection('${id}')">DELETE CONNECTION</button>
    `;
}

function deletePersonPopup() {
  popupOverlay.style.display = "flex";
  document.getElementById("popup3").style.display = "flex";
  document.getElementById("submitButton").style.display = "none";
  document.getElementById("popup3Content").innerHTML = `
    <h3>Are you sure you want to DELETE this person forever?</h3>
    <button class="submit" id="deletePersonButton" style="background-color: red;"onclick="deletePerson()">DELETE PERSON</button>
    `;
}

async function deleteConnection(id) {
  console.log(id);
  if (person.spouses.includes(id)) {
    let spouse = idToData(id);
    spouse.spouses.splice(spouse.spouses.indexOf(person.id), 1);
    person.spouses.splice(person.spouses.indexOf(spouse.id), 1);

    fetch(
      `https://familytree.loophole.site/setProfile?token=${token}&profileUuid=${
        person.id
      }&content=${encodeURI(JSON.stringify(person))}${requestEnd}`
    );
    fetch(
      `https://familytree.loophole.site/setProfile?token=${token}&profileUuid=${
        spouse.id
      }&content=${encodeURI(JSON.stringify(spouse))}${requestEnd}`
    );
  } else if (person.children.includes(id)) {
    if (person.id == id) {
      person.children.splice(person.children.indexOf(id), 1);
      fetch(
        `https://familytree.loophole.site/setProfile?token=${token}&profileUuid=${
          person.id
        }&content=${encodeURI(JSON.stringify(person))}${requestEnd}`
      );
      closePopupFunc();
      return 0;
    }
    let child = idToData(id);
    if (child.parent1Id == person.id) child.parent1Id = null;
    if (child.parent2Id == person.id) child.parent2Id = null;

    person.children.splice(person.children.indexOf(child.id), 1);

    fetch(
      `https://familytree.loophole.site/setProfile?token=${token}&profileUuid=${
        person.id
      }&content=${encodeURI(JSON.stringify(person))}${requestEnd}`
    );
    fetch(
      `https://familytree.loophole.site/setProfile?token=${token}&profileUuid=${
        child.id
      }&content=${encodeURI(JSON.stringify(child))}${requestEnd}`
    );
  } else if (person.parent1Id == id) {
    let parent = idToData(id);
    parent.children.splice(parent.children.indexOf(person.id), 1);

    person.parent1Id = null;
    fetch(
      `https://familytree.loophole.site/setProfile?token=${token}&profileUuid=${
        person.id
      }&content=${encodeURI(JSON.stringify(person))}${requestEnd}`
    );
    fetch(
      `https://familytree.loophole.site/setProfile?token=${token}&profileUuid=${
        parent.id
      }&content=${encodeURI(JSON.stringify(parent))}${requestEnd}`
    );
  } else if (person.parent2Id == id) {
    let parent = idToData(id);
    parent.children.splice(parent.children.indexOf(person.id), 1);

    person.parent2Id = null;
    fetch(
      `https://familytree.loophole.site/setProfile?token=${token}&profileUuid=${
        person.id
      }&content=${encodeURI(JSON.stringify(person))}${requestEnd}`
    );
    fetch(
      `https://familytree.loophole.site/setProfile?token=${token}&profileUuid=${
        parent.id
      }&content=${encodeURI(JSON.stringify(parent))}${requestEnd}`
    );
  }
  closePopupFunc();
}

async function deletePerson() {
  if (person.parent1Id) {
    const parent1 = idToData(person.parent1Id);
    const index = parent1.children.indexOf(person.id);
    parent1.children.splice(index, 1);
    await fetch(
      `https://familytree.loophole.site/setProfile?token=${token}&profileUuid=${
        parent1.id
      }&content=${encodeURI(JSON.stringify(parent1))}${requestEnd}`
    );
  }
  if (person.parent2Id) {
    const parent2 = idToData(person.parent2Id);
    const index = parent2.children.indexOf(person.id);
    parent2.children.splice(index, 1);
    await fetch(
      `https://familytree.loophole.site/setProfile?token=${token}&profileUuid=${
        parent2.id
      }&content=${encodeURI(JSON.stringify(parent2))}${requestEnd}`
    );
  }
  if (person.children.length != 0) {
    person.children.forEach(async (element) => {
      if (idToData(element) == null) return 1;
      const child = idToData(element);
      if (child.parent1Id == person.id) {
        child.parent1Id = null;
      } else if (child.parent2Id == person.id) {
        child.parent2Id = null;
      }
      await fetch(
        `https://familytree.loophole.site/setProfile?token=${token}&profileUuid=${
          child.id
        }&content=${encodeURI(JSON.stringify(child))}${requestEnd}`
      );
    });
  }
  if (person.spouses.length != 0) {
    person.spouses.forEach(async (element) => {
      const spouse = idToData(element);
      spouse.spouses = spouse.spouses.splice(
        spouse.spouses.indexOf(person.id),
        1
      );
      await fetch(
        `https://familytree.loophole.site/setProfile?token=${token}&profileUuid=${
          spouse.id
        }&content=${encodeURI(JSON.stringify(spouse))}${requestEnd}`
      );
    });
  }
  await fetch(
    `https://familytree.loophole.site/setProfile?token=${token}&profileUuid=${
      person.id
    }&content=${encodeURI(JSON.stringify())}${requestEnd}`
  );
  window.close();
}

function backToTree() {
  window.location.href = "../graph/";
}

main();
