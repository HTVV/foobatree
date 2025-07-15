async function toGedcom(data) {
  function numToMonth(num) {
    num = parseInt(num);
    switch (num) {
      case 1:
        return "JAN";
      case 2:
        return "FEB";
      case 3:
        return "MAR";
      case 4:
        return "APR";
      case 5:
        return "MAY";
      case 6:
        return "JUN";
      case 7:
        return "JUL";
      case 8:
        return "AUG";
      case 9:
        return "SEP";
      case 10:
        return "OCT";
      case 11:
        return "NOV";
      case 12:
        return "DEC";
      default:
        return "";
    }
  }

  let famlist = [];
let result = "";
let mediaId = 0;

  result += `0 HEAD
1 SOUR Foobatree
1 DATE ${new Date().toISOString().split("T")[0]}
1 GEDC
2 VERS 7.0
`;

  for (let i = 0; i < data.length; i++) {
    const person = data[i];
    const personData = person.data;
    const personRels = person.rels;
    result += `0 @${person.id.replaceAll("-", "")}@ INDI
`;

    if (personData.ogName) {
      result +=
        `1 NAME ${personData.firstName} ${personData.patronym} /${personData.ogName}/
2 GIVN ${personData.firstName} ${personData.patronym}
2 SURN ${personData.ogName}
2 TYPE BIRTH
`.replace(/^\ +|\ +$|\ {2,}/g, " ");
    }
    if (personData.lastName) {
      result += `1 NAME ${personData.firstName} ${personData.patronym} /${
        personData.lastName
      }/
2 GIVN ${personData.firstName} ${personData.patronym}
2 SURN ${personData.lastName}
2 TYPE ${personData.ogName ? "MARRIED" : "BIRTH"}
`.replace(/^\ +|\ +$|\ {2,}/g, " ");
    }
    if (!personData.ogName && !personData.lastName) {
      result += `1 NAME ${personData.firstName} /${personData.patronym}/
`.replace(/^\ +|\ +$|\ {2,}/g, " ");
    }

    result += `1 SEX ${personData.gender == "male" ? "M" : "F"}
1 BIRT
`;

    if (
      personData.birthDate &&
      personData.birthDate != "undefined-undefined-undefined" &&
      personData.birthDate != "--"
    ) {
      const birthDate = personData.birthDate;
      if (typeof birthDate == "object") {
        let modifier = birthDate.modifier;
        modifier == "exact" ? (modifier = "") : "";
        modifier == "circa" ? (modifier = "ABT") : "";
        modifier == "before" ? (modifier = "BEF") : "";
        modifier == "after" ? (modifier = "AFT") : "";
        modifier == "between" ? (modifier = "BET") : "";

        result += `2 DATE ${modifier} ${birthDate.day1 ?? ""} ${numToMonth(
          birthDate.month1
        )} ${birthDate.year1 ?? ""} ${
          modifier == "BET"
            ? `AND ${birthDate.day2 ?? ""} ${numToMonth(birthDate.month2)} ${
                birthDate.year2 ?? ""
              }`
            : ""
        }
`.replace(/^\ +|\ +$|\ {2,}/g, " ");
      } else if (
        birthDate != "undefined-undefined-undefined" &&
        personData.birthDate != "--"
      ) {
        result += `2 DATE ${
          birthDate.split("-")[0] != "undefined" && birthDate.split("-")[0]
            ? parseInt(birthDate.split("-")[0])
            : ""
        } ${
          birthDate.split("-")[1] != "undefined"
            ? numToMonth(birthDate.split("-")[1])
            : ""
        } ${
          birthDate.split("-")[2] != "undefined" ? birthDate.split("-")[2] : ""
        }
`.replace(/^\ +|\ +$|\ {2,}/g, " ");
      }
    }

    if (result.slice(result.length - 5, result.length - 1) == "BIRT") {
      result = result.substring(0, result.length - 1);
      result += ` Y
`;
    }

    if (
      personData.status == "dead" ||
      (personData.deathDate &&
        personData.deathDate != "undefined-undefined-undefined" &&
        personData.deathDate != "--") ||
      personData.deathCause ||
      personData.burialPlace
    ) {
      result += `1 DEAT
`;
    }
    if (
      personData.deathDate &&
      personData.deathDate != "undefined-undefined-undefined" &&
      personData.deathDate != "--"
    ) {
      const deathDate = personData.deathDate;
      if (typeof deathDate == "object") {
        console.log("yep");
        let modifier = deathDate.modifier;
        modifier == "exact" ? (modifier = "") : "";
        modifier == "circa" ? (modifier = "ABT") : "";
        modifier == "before" ? (modifier = "BEF") : "";
        modifier == "after" ? (modifier = "AFT") : "";
        modifier == "between" ? (modifier = "BET") : "";

        result += `2 DATE ${modifier} ${deathDate.day1 ?? ""} ${numToMonth(
          deathDate.month1
        )} ${deathDate.year1 ?? ""} ${
          modifier == "BET"
            ? `AND ${deathDate.day2 ?? ""} ${numToMonth(deathDate.month2)} ${
                deathDate.year2 ?? ""
              }`
            : ""
        }
`.replace(/^\ +|\ +$|\ {2,}/g, " ");
      } else if (
        deathDate != "undefined-undefined-undefined" &&
        deathDate != "--"
      ) {
        result += `2 DATE ${
          deathDate.split("-")[0] != "undefined" && deathDate.split("-")[0]
            ? parseInt(deathDate.split("-")[0])
            : ""
        } ${
          deathDate.split("-")[1] != "undefined"
            ? numToMonth(deathDate.split("-")[1])
            : ""
        } ${
          deathDate.split("-")[2] != "undefined" ? deathDate.split("-")[2] : ""
        }
`.replace(/^\ +|\ +$|\ {2,}/g, " ");
      }
    }

    if (personData.deathPlace && personData.deathPlace != "undefined") {
      result += `2 PLAC ${personData.deathPlace}
`.replace(/^\ +|\ +$|\ {2,}/g, " ");
    }

    if (personData.deathCause) {
      result += `2 CAUS ${personData.deathCause}
`.replace(/^\ +|\ +$|\ {2,}/g, " ");
    }

    if (result.slice(result.length - 5, result.length - 1) == "DEAT") {
      result = result.substring(0, result.length - 1);
      result += ` Y
`;
    }

    if (personData.burialPlace) {
      result += `1 BURI
2 PLAC ${personData.burialPlace}
`.replace(/^\ +|\ +$|\ {2,}/g, " ");
    }

    if (personData.writing && personData.writing != "undefined") {
      result += `1 NOTE ${personData.writing}
    `
        .replace(/^\ +|\ +$|\ {2,}/g, " ")
        .replaceAll(/\n/g, "$&2 CONT ");
      result += "\n";
    }

    if (personData.sources && personData.sources != "undefined") {
      result += `${
        personData.writing && personData.writing != "undefined"
          ? `2 CONT SOURCES
`
          : "1 NOTE"
      } ${personData.sources}
    `
        .replace(/^\ +|\ +$|\ {2,}/g, " ")
        .replaceAll(/\n/g, "\n2 CONT ");
      result += "\n";
    }
    console.log(personRels)
    console.log(person)
    if (personRels.spouses?.length > 0) {
      for (let j = 0; j < personRels.spouses.length; j++) {
        result += `1 FAMS @F${`${person.id}${personRels.spouses[j] ?? ""}`
          .split("")
          .sort()
          .join("")
          .replaceAll("-", "")}@
`;
        famlist.push({
          id: `${person.id}${personRels.spouses[j] ?? ""}`
            .split("")
            .sort()
            .join("")
            .replaceAll("-", ""),
          father:
            personData.gender == "male" ? person.id : personRels.spouses[j],
          mother:
            personData.gender == "female" ? person.id : personRels.spouses[j],
        });
      }
    } else if (personRels.children?.length > 0) {
      result += `1 FAMS @F${`${person.id}`
        .split("")
        .sort()
        .join("")
        .replaceAll("-", "")}@
`;

      famlist.push({
        id: `${person.id}`.split("").sort().join("").replaceAll("-", ""),
        father: personData.gender == "male" ? person.id : "",
        mother: personData.gender == "female" ? person.id : "",
      });
    }

    if (personRels.father || personRels.mother) {
      result += `1 FAMC @F${`${personRels.father}${personRels.mother}`
        .split("")
        .sort()
        .join("")
        .replaceAll("-", "")}@
`;

      famlist.push({
        id: `${personRels.father}${personRels.mother}`
          .split("")
          .sort()
          .join("")
          .replaceAll("-", ""),
        father: personRels.father ?? "",
        mother: personRels.mother ?? "",
      });
    }

    if (personData.avatar && personData.avatar != "undefined") {
      let type = "";
      const res = await fetch(personData.avatar, {
        method: "HEAD",
      });
      type = res.headers.get("Content-Type").split("/")[1];

      result += `1 OBJE @M${mediaId}@
`;

      result += `0 @M${mediaId}@ OBJE
1 FILE ${personData.avatar}
2 FORM ${type}
`.replace(/^\ +|\ +$|\ {2,}/g, " ");
    }
  }

  famlist = famlist.filter(
    (value, index, self) => index === self.findIndex((t) => t.id === value.id)
  );

  for (let i = 0; i < famlist.length; i++) {
    const fam = famlist[i];
    const father = fam.father ? data.find((dude) => dude.id == fam.father) : "";
    const mother = fam.mother ? data.find((dude) => dude.id == fam.mother) : "";
    let famchildren = null;
    if (father && mother) {
      famchildren = father.rels.children.filter((value) =>
        mother.rels.children.includes(value)
      );
    } else if (father) {
      famchildren = father.rels.children;
    } else if (mother) {
      famchildren = mother.rels.children;
    } else {
      famchildren = [];
    }

    result += `0 @F${fam.id}@ FAM${
      father
        ? `
1 HUSB @${father.id.replaceAll("-", "")}@`
        : ""
    }${
      mother
        ? `
1 WIFE @${mother.id.replaceAll("-", "")}@`
        : ""
    }
`.replace(/^\ +|\ +$|\ {2,}/g, " ");

    for (let j = 0; j < famchildren.length; j++) {
      result += `1 CHIL @${famchildren[j].replaceAll("-", "")}@
`;
    }
  }

  result += `0 TRLR`;

  return result
}