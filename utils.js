function personToLifespan(person) {
  if (Object.keys(person).length == 1) return "";

  birthDate = person.birthDate || "";
  deathDate = person.deathDate || "";
  birthModifier = birthDate.modifier + " ";
  if (birthModifier == "exact " || birthModifier == "between ")
    birthModifier = "";
  if (birthModifier == "circa ") birthModifier = "c. ";
  deathModifier = deathDate.modifier + " ";
  if (deathModifier == "exact " || deathModifier == "between ")
    deathModifier = "";
  if (deathModifier == "circa ") deathModifier = "c. ";
  if (person.status == "alive") {
    if(birthDate.year1) {
      return `Born ${birthModifier}${birthDate.year1}`
    }
    return "Living"
  }
  
  const personStatus = (person.status == "dead") ? "Deceased" : "Unknown"

  if(birthDate.year1 && deathDate.year1) {
    return `${birthModifier}${birthDate.year1} - ${deathModifier}${deathDate.year1}`
  }
  if(birthDate.year1) {
    return `${birthModifier} ${birthDate.year1} - ${personStatus}`
  }
  if(deathDate.year1) {
    return `- ${deathModifier}${deathDate.year1}`
  }

  return personStatus

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

  return replacedText
    .replaceAll("%79", "+")
    .replaceAll("%89", "&")
    .replaceAll(/&lt;/g, "<")
    .replaceAll(/&gt;/g, ">");
}