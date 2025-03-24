//returns the 1971 - 2009 thing for a person
function personToLifespan(person) {
  birthDate = person.birthDate || "";
  deathDate = person.deathDate || "";
  if (typeof birthDate == "object") {
    birthModifier = birthDate.modifier + " ";
    if (birthModifier == "exact " || birthModifier == "between ")
      birthModifier = "";
    if (birthModifier == "circa ") birthModifier = "c. ";
    deathModifier = deathDate.modifier + " ";
    if (deathModifier == "exact " || deathModifier == "between ")
      deathModifier = "";
    if (deathModifier == "circa ") deathModifier = "c. ";
    if (person.status == "alive") {
      return `Living`;
    }
    if (person.deathDate != "" && person.birthDate != "") {
      return `${birthModifier} ${birthDate.year1} - ${deathModifier}${deathDate.year1}`;
    }
    if (person.birthDate != "") {
      return `${birthDate.year1} - Deceased`;
    }
    if (person.deathDate != "") {
      return ` - ${deathDate.year1}`;
    }
    return "Deceased";
  } else {
    if (person.status == "alive") {
      return `Living`;
    }
    if (person.deathDate != "" && person.birthDate != "") {
      return `${person.birthDate.slice(0, 4)} - ${person.deathDate.slice(
        0,
        4
      )}`;
    }
    if (person.birthDate != "") {
      return `${person.birthDate.slice(0, 4)} - Deceased`;
    }
    if (person.deathDate != "") {
      return ` - ${person.deathDate.slice(0, 4)}`;
    }
    return "Deceased";
  }
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
    document.documentElement.style.setProperty("--hover-color", "#3b3b3b");
    document.documentElement.style.setProperty("--button-base-color", "#282828");
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
    document.documentElement.style.setProperty("--hover-color", "#ddd");
    document.documentElement.style.setProperty("--button-base-color", "#6d6d6d");
  }
}

function linkify(inputText) {
  var replacedText, replacePattern1, replacePattern2, replacePattern3;

  //URLs starting with http://, https://, or ftp://
  replacePattern1 =
    /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;\(]*[-A-Z0-9+&@#\/%=~_|\)])/gim;
  replacedText = inputText.replace(
    replacePattern1,
    '<a href="$1" target="_blank">$1</a>'
  );

  //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
  replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
  replacedText = replacedText.replace(
    replacePattern2,
    '$1<a href="http://$2" target="_blank">$2</a>'
  );

  //Change email addresses to mailto:: links.
  replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
  replacedText = replacedText.replace(
    replacePattern3,
    '<a href="mailto:$1">$1</a>'
  );

  return replacedText;
}
//fixes dates e.g. when only year is given from "--1600" to "1600"
function cleanDateString(string) {
  console.log(string);
  split = string.split(" ");
  if (split.length > 1) {
    parta = split[0]
    partb = split[1];
    partb = partb.replace(/^-+|-+$/g, "").replace(/(-)(?=-*\1)/g, "");
    return parta + " " + partb
  }
  return string.replace(/^-+|-+$/g, "").replace(/(-)(?=-*\1)/g, "");
}

function padDateString(dateString){
  if(dateString.length == 1) dateString = "0" + dateString;
  return dateString;
}

function showError(text) {
  document.getElementById("error-bar").style.top = 0;
  document.getElementById("error-text").textContent = text;

}

function closeError() {
  document.getElementById("error-text").textContent = "";
  document.getElementById("error-bar").style.top = "-20vh";
}