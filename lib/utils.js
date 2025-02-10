//returns the 1971 - 2009 thing for a person
function personToLifespan(person) {
  if (person.status == "alive") {
    return `Living`;
  }
  if (person.deathDate != "" && person.birthDate != "") {
    return `${person.birthDate.slice(0, 4)} - ${person.deathDate.slice(0, 4)}`;
  }
  if (person.birthDate != "") {
    return `${person.birthDate.slice(0, 4)} - Deceased`;
  }
  if (person.deathDate != "") {
    return ` - ${person.deathDate.slice(0, 4)}`;
  }
  return "Deceased";
}

//opens the person page on click
function openPerson(id, requestEnd) {
  window.open(`../person/?uuid=${id}${requestEnd}`, "_blank");
}

function btrim(str) {
  if (!str) return str;
  return str.replaceAll(/^\s+|\s+$/g, "");
}

function search(data) {
  document.getElementById("selectFocus").innerHTML = "";
  const text = document.getElementById("focusInput").value;
  let miniSearch = new MiniSearch({
    fields: ["name"], // fields to index for full-text search
    storeFields: ["name", "id"], // fields to return with search results
    searchOptions: {
      fuzzy: 0.4,
    },
  });
  miniSearch.addAll(data);
  let results = miniSearch.search(text);
  console.log(results);
  for (var i = 0; i < results.length; i++) {
    document.getElementById(
      "selectFocus"
    ).innerHTML += `<option value="${results[i].id}">${results[i].name}</option>`;
  }
}

function handleDarkMode() {
  darkMode = localStorage.getItem("dark-mode");
  if (!darkMode) {
    darkMode = "false";
    localStorage.setItem("dark-mode", "false");
  }
  if (darkMode == "true") {
    //top 10 solutions
    if (window.location.toString().includes("graph")) {
      document.getElementById("logo").src = "/img/foobatree_dark_mode.png";
      document.getElementById("user").src = "/img/user_dark_mode.png";
    }

    document.documentElement.style.setProperty("--primary-color", "black");
    document.documentElement.style.setProperty("--secondary-color", "white");
    document.documentElement.style.setProperty("--button-on-color", "#d1d1d1");
    document.documentElement.style.setProperty("--button-off-color", "#6d6d6d");
  }
  if (darkMode == "false") {
    if (window.location.toString().includes("graph")) {
      document.getElementById("logo").src = "/img/foobatree.png";
      document.getElementById("user").src = "/img/user.png";
    }
    document.documentElement.style.setProperty("--primary-color", "white");
    document.documentElement.style.setProperty("--secondary-color", "black");
    document.documentElement.style.setProperty("--button-off-color", "#d1d1d1");
    document.documentElement.style.setProperty("--button-on-color", "#6d6d6d");
  }
}