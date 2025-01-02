//NOT GRAPH
//Fooba2 was here
const token = getCookie("token")
const username = getCookie("username")
var treeUser = getCookie("treeUser")
if (treeUser == username || !treeUser) treeUser = "empty"
//thing to add to end of requests cuz sharing
const requestEnd = treeUser == "empty" ? "" : `&username=${treeUser}`
var treeStyle = localStorage.getItem("treeStyle") ? localStorage.getItem("treeStyle") : "normal"
//for info tree style
var rainbow = new Rainbow()
rainbow.setNumberRange(0, localStorage.getItem("colorSens") ? localStorage.getItem("colorSens") : 2000);
rainbow.setSpectrum(localStorage.getItem("fromColor") ? localStorage.getItem("fromColor") : "yellow", localStorage.getItem("toColor") ? localStorage.getItem("toColor") : "darkred");
//kinda whack settings the size like this ngl
document.getElementById("graph").setAttribute("width", screen.availWidth * 0.95)
document.getElementById("graph").setAttribute("height", screen.availHeight * 0.8)
console.log(token)
document.getElementById('focusInput').addEventListener('input', function (e) {
    search(data)
});

document.addEventListener('keydown', function (e) {
    if (e.key == "Escape") {
        closePopupFunc()
    }
    if (e.key == "z") {
        svg.call(zoom.transform, d3.zoomIdentity);
        render(inner, g)
    }
})
//gets a random uuid cuz cant crypto doesnt like http
function randomUUID() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
        (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
}
//opens the add disconnected person form
function openPopupFunc() {
    popupOverlay.style.display = 'block';
    hideForm(document.getElementById("status").value)
}
//closes all popups
function closePopupFunc() {
    popupOverlay.style.display = 'none';
    document.getElementById("popupOverlay2").style.display = 'none';
    document.getElementById("popupOverlay3").style.display = 'none';
    document.getElementById("popupOverlay4").style.display = 'none';


    document.getElementById("shareInput").value = ""
    document.getElementById("error").textContent = ""
}
//the submit button for all the things
function submitForm() {
    closePopupFunc();

    const gender = document.getElementById("gender").value
    const status = document.getElementById("status").value
    const firstNames = document.getElementById("firstNameInput").value;
    const lastNames = document.getElementById("lastNameInput").value;
    const patronym = document.getElementById("patronymInput").value;
    const dateBirth = document.getElementById("bornDateInput").value;
    const placeBirth = document.getElementById("bornPlaceInput").value;
    const dateDeath = document.getElementById("diedDateInput").value;
    const placeDeath = document.getElementById("diedPlaceInput").value;
    const placeBurial = document.getElementById("buriedPlaceInput").value;
    const ogName = document.getElementById("OgNameInput1").value;
    const uuid = randomUUID()

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
        name: btrim(`${firstNames} ${patronym} ${lastNames}${ogName != "" ? ` (${ogName})` : ""}`),
        parent1Id: null,
        parent2Id: null,
    })

    //document.cookie = `target=${uuid};max-age=1431989812894908`
    localStorage.setItem("target", uuid)

    const ele = document.getElementsByClassName('popup-input');
    for (var i = 0; i < ele.length; i++) {
        ele[i].value = "";
    }
    document.getElementById("aliveSelection").selected = "false"
    document.getElementById("deadSelection").selected = "true"
    hideForm("dead")
    //fetch(`https://familytree.loophole.site/setProfile?token=${token}&profileUuid=07dbf856-acda-4393-ae72-2073f6594b87&content=${encodeURI(JSON.stringify())}`)
    fetch(`https://familytree.loophole.site/setProfile?token=${token}&profileUuid=${uuid}&content=${encodeURI(newPerson)}`)
    fetch(`https://familytree.loophole.site/setProfile?token=${token}&profileUuid=test&content=`)

    //location.reload()
}
//hides the form if you select living
function hideForm(status) {
    show = "none"
    if (status == "dead") { show = "block" }
    var ele = document.getElementsByClassName('tohide');
    for (var i = 0; i < ele.length; i++) {
        ele[i].style.display = show;
    }
}
//self explanatory
function focusPopup() {
    document.getElementById("popup2").style.display = 'block';
    document.getElementById("popupOverlay2").style.display = 'block';
}

//sets the trees focus to a person
function setTarget() {
    const value = document.getElementById("selectFocus").value
    localStorage.setItem("target", value)
    //document.cookie = `target=${value};max-age=1431989812894908`
    location.reload()
}
//gets a cookie by its key
function getCookie(name) {
    return localStorage.getItem(name)
    /* const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift(); */
}
//opens the popup where you can share your tree to others
function shareTreePopup() {
    document.getElementById("popupOverlay3").style.display = "block"
    document.getElementById("popup3").innerHTML = `<div class="popup-content">
    <p>Input username of person to share tree to</p>
    <h3 id="error"></h3>
    <input class="popup-input" type="text" id="shareInput">
    <p></p>i
    <button type="button" id="sharetree" onclick=shareTree()>Share</button>
</div>`
}
//opens the popup where you can open a tree that has been shared to you
async function openSharedPopup() {
    document.getElementById("popupOverlay3").style.display = "block"
    document.getElementById("popup3").innerHTML = `<div class="popup-content">
    <select id="sharedList"></select>
    <p></p>
    <button type="button" id="sharetree" onclick=openSharedTree()>Open</button>
</div>`
    const res = await (await fetch(`https://familytree.loophole.site/sharedToMe?token=${token}`)).json()
    console.log(res)
    for (var i = 0; i < res.length; i++) {
        document.getElementById("sharedList").innerHTML += `<option value="${res[i]}">${res[i]}</option>`
    }
}
//shares your tree
async function shareTree() {
    const usernameShare = document.getElementById("shareInput").value
    const res = await (await fetch(`https://familytree.loophole.site/shareTree?token=${token}&targetName=${usernameShare}`)).json()
    console.log(res)
    if (res.error == 200) {
        document.getElementById("error").style.color = "green"
        document.getElementById("error").textContent = "SUCCESS"
    } else {
        document.getElementById("error").style.color = "red"
        document.getElementById("error").textContent = "USER NOT FOUND"
    }
}

//opens the tree of another user
function openSharedTree() {
    const treeUser = document.getElementById("sharedList").value
    console.log(treeUser)
    //document.cookie = `treeUser=${treeUser};path=/`
    localStorage.setItem("treeUser", treeUser)
    location.reload()
}
//opens your own tree
function ownTree() {
    localStorage.setItem("treeUser", "empty")
    location.reload()
}

function changeStylePopup() {
    document.getElementById("popupOverlay4").style.display = "flex";
    document.getElementById("popup4").innerHTML = `<div class="popup-content" style="min-width: 35vw;">
    <button onclick=normalStyle()>Normal</button>
    <hr></hr>
    <button onclick="infoStyle()">Amount of info</button>
    <br></br>
    <input id="from-color-input" type="color" value=${localStorage.getItem("fromColor") ? localStorage.getItem("fromColor") : "#ffff00"}></input>
    <p style="display: inline;"> To </p>
    <input id="to-color-input" type="color" value=${localStorage.getItem("toColor") ? localStorage.getItem("toColor") : "#8b0000"}></input>
    <p style="display: inline;"> Sensitivity </p>
    <input id="color-sens-input" type=number placeholder=2000 value=${localStorage.getItem("colorSens") ? localStorage.getItem("colorSens") : 2000}></input>
    </div>
    `
}

function normalStyle() {
    closePopupFunc()
    if (treeStyle == "normal") return 0
    localStorage.setItem("treeStyle", "normal")
    location.reload()
}

function infoStyle() {
    closePopupFunc()
    if (treeStyle == "info") return 0
    localStorage.setItem("colorSens", document.getElementById("color-sens-input").value)
    localStorage.setItem("fromColor", document.getElementById("from-color-input").value)
    localStorage.setItem("toColor", document.getElementById("to-color-input").value)
    localStorage.setItem("treeStyle", "info")
    location.reload()
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GRAPH
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////v
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//initialize graph probably idk what this stuff does
var g = new dagreD3.graphlib.Graph()
    .setGraph({})
    .setDefaultEdgeLabel(function () { return {}; });

var render = new dagreD3.render();

var svg = d3.select("svg"),
    inner = svg.append("g");

var zoom = d3.zoom()
    .on("zoom", function () {
        loc = d3.event.transform
        inner.attr("transform", d3.event.transform);
    });
svg.call(zoom);

main(treeUser)

//graphs the first guy their parents and gets some data for some reason
async function main(user) {
    data = await getData(user)
    if (data.length == 0) return 1
    console.log(data)
    data = data.filter(n => n)
    //logic for selecting the person in focus
    let target = getCookie("target")
    if (!target) target = data[0].id
    for (var i = 0; i < data.length; i++) {
        if (data[i].id == target) {
            break
        }
    }
    if (i == data.length) {
        var rootUser = 0;
    } else {
        var rootUser = i;
    }

    const root = idToData(data[rootUser].id)
    const parent1 = idToData(root.parent1Id)
    const parent2 = idToData(root.parent2Id)
    //
    idSetNode(root.id)
    //this thing cuz the first guys parents are rendered automatically
    removeButton(/<input type='button' id="parentButton"(.*?)>/, root.id)
    console.log(parent2)
    if (parent1) idSetNode(parent1.id)
    if (parent2) idSetNode(parent2.id)
    //if parents both exist
    if (parent1 && parent2) {
        g.setNode(`${(parent1.id + parent2.id).split('').sort().join('')}ParentMarriage`, { label: "", class: "marriage" })

        g.setEdge(parent1.id, `${(parent1.id + parent2.id).split('').sort().join('')}ParentMarriage`, {
            arrowhead: "undirected",
            curve: d3.curveStepBefore
        })
        g.setEdge(parent2.id, `${(parent1.id + parent2.id).split('').sort().join('')}ParentMarriage`, {
            arrowhead: "undirected",
            curve: d3.curveStepBefore
        })
        g.setEdge(`${(parent1.id + parent2.id).split('').sort().join('')}ParentMarriage`, root.id, {
            arrowhead: "undirected",
            curve: d3.curveStepBefore
        })
    } else if (parent1) {
        g.setNode(`${parent1.id}childNode`, { class: "marriage", label: "" })
        g.setEdge(parent1.id, `${parent1.id}childNode`, {
            arrowhead: "undirected",
            curve: d3.curveStepBefore
        })
        g.setEdge(`${parent1.id}childNode`, root.id, {
            arrowhead: "undirected",
            curve: d3.curveStepBefore
        })
    } else if (parent2) {
        g.setNode(`${parent2.id}childNode`, { class: "marriage", label: "" })
        g.setEdge(parent2.id, `${parent2.id}childNode`, {
            arrowhead: "undirected",
            curve: d3.curveStepBefore
        })
        g.setEdge(`${parent2.id}childNode`, root.id, {
            arrowhead: "undirected",
            curve: d3.curveStepBefore
        })
    }
    render(inner, g);
}
//returns the person object from the tree based on id
function idToData(id) {
    return data.find((element) => element.id == id);
}
//graohs a persons parents on click
function graphParents(id) {

    const root = idToData(id)
    const parent1 = idToData(root.parent1Id)
    const parent2 = idToData(root.parent2Id)

    //that monstrosity removes the parentButton element
    removeButton(/<input type='button' id="parentButton"(.*?)>/, root.id)

    if (parent1) idSetNode(parent1.id)
    if (parent2) idSetNode(parent2.id)
    //if both parents exist
    if (parent1 && parent2) {
        console.log(1)
        //if the parents have children together
        console.log(parent1)
        console.log(parent2)
        if (parent1.spouses.includes(parent2.id)) {
            console.log(2)
            //set a node for the parents' marriage
            g.setNode(`${(parent1.id + parent2.id).split('').sort().join('')}ParentMarriage`, { label: "", class: "marriage" })
            if (parent1.gender == "male") {
                g.setEdge(root.parent1Id, `${(parent1.id + parent2.id).split('').sort().join('')}ParentMarriage`, {
                    arrowhead: "undirected",
                    curve: d3.curveStepBefore
                })
                g.setEdge(root.parent2Id, `${(parent1.id + parent2.id).split('').sort().join('')}ParentMarriage`, {
                    arrowhead: "undirected",
                    curve: d3.curveStepBefore
                })
            } else {
                g.setEdge(root.parent2Id, `${(parent1.id + parent2.id).split('').sort().join('')}ParentMarriage`, {
                    arrowhead: "undirected",
                    curve: d3.curveStepBefore
                })
                g.setEdge(root.parent1Id, `${(parent1.id + parent2.id).split('').sort().join('')}ParentMarriage`, {
                    arrowhead: "undirected",
                    curve: d3.curveStepBefore
                })
            }


            g.setEdge(`${(parent1.id + parent2.id).split('').sort().join('')}ParentMarriage`, root.id, {
                arrowhead: "undirected",
                curve: d3.curveStepBefore
            })
            //if the parents dont have children together (wait what why is this a thing is this even possible)
        } else {
            if (parent1) {
                g.setEdge(parent1.id, root.id, {
                    arrowhead: "undirected",
                    curve: d3.curveStepBefore
                })
            }
            if (parent2) {
                g.setEdge(parent2.id, root.id, {
                    arrowhead: "undirected",
                    curve: d3.curveStepBefore
                })
            }
        }
        //if only parent1 exists
    } else if (parent1) {
        g.setNode(`${parent1.id}childNode`, { class: "marriage", label: "" })
        g.setEdge(parent1.id, `${parent1.id}childNode`, {
            arrowhead: "undirected",
            curve: d3.curveStepBefore
        })
        g.setEdge(`${parent1.id}childNode`, root.id, {
            arrowhead: "undirected",
            curve: d3.curveStepBefore
        })
    } else if (parent2) {
        g.setNode(`${parent2.id}childNode`, { class: "marriage", label: "" })
        g.setEdge(parent2.id, `${parent2.id}childNode`, {
            arrowhead: "undirected",
            curve: d3.curveStepBefore
        })
        g.setEdge(`${parent2.id}childNode`, root.id, {
            arrowhead: "undirected",
            curve: d3.curveStepBefore
        })
    }

    render(inner, g);
}
//returns the tree
async function getData() {
    res = await fetch(`https://familytree.loophole.site/getTree?token=${token}${requestEnd}`)
    return await res.json()
}
async function graphChildren(id) {
    console.log(id)
    const root = idToData(id)
    //that monstrosity removes the childButton element from the root node
    removeButton(/<input type='button' id="childButton"(.*?)>/, root.id)
    for (var i = 0; i < root.children.length; i++) {
        keepgoing = true
        child = idToData(root.children[i])
        //only shows children not currently shown
        if (nodeOnScreen(child)) {
            continue
        }
        idSetNode(child.id)
        removeButton(/<input type='button' id="parentButton"(.*?)>/, child.id)
        //if child has both parents
        if (child.parent1Id && child.parent2Id) {
            //if parents are both on screen
            if (nodeOnScreen(child.parent1Id) && nodeOnScreen(child.parent2Id)) {
                //if the parents' marriage is on screen
                if (nodeOnScreen(`${(child.parent1Id + child.parent2Id).split('').sort().join('')}ParentMarriage`)) {
                    g.setEdge(`${(child.parent1Id + child.parent2Id).split('').sort().join('')}ParentMarriage`, child.id, {
                        arrowhead: "undirected",
                        curve: d3.curveStepBefore
                    })
                }
                //if both the parents arent on screen
            } else {
                //if parent 1 isnt a node add it
                if (!nodeOnScreen(child.parent1Id)) {
                    parent1 = idToData(child.parent1Id)
                    idSetNode(child.parent1Id)
                }
                //if parent 2 isnt a node add it
                else if (!nodeOnScreen(child.parent2Id)) {
                    parent2 = idToData(child.parent2Id)
                    idSetNode(child.parent2Id)
                }
                g.setNode(`${(child.parent1Id + child.parent2Id).split('').sort().join('')}ParentMarriage`, { label: "", class: "marriage" })
                g.setEdge(child.parent1Id, `${(child.parent1Id + child.parent2Id).split('').sort().join('')}ParentMarriage`, {
                    arrowhead: "undirected",
                    curve: d3.curveStepBefore
                })
                g.setEdge(child.parent2Id, `${(child.parent1Id + child.parent2Id).split('').sort().join('')}ParentMarriage`, {
                    arrowhead: "undirected",
                    curve: d3.curveStepBefore
                })
                g.setEdge(`${(child.parent1Id + child.parent2Id).split('').sort().join('')}ParentMarriage`, child.id, {
                    arrowhead: "undirected",
                    curve: d3.curveStepBefore
                })
            }
        }
        //if parent 1 happens to exist
        else if (child.parent1Id) {
            g.setNode(`${child.parent1Id}childNode`, { class: "marriage", label: "" })
            g.setEdge(child.parent1Id, `${child.parent1Id}childNode`, {
                arrowhead: "undirected",
                curve: d3.curveStepBefore
            })
            g.setEdge(`${child.parent1Id}childNode`, child.id, {
                arrowhead: "undirected",
                curve: d3.curveStepBefore
            })
        }
        //if parent 2 happens to exist
        else if (child.parent2Id) {
            g.setNode(`${child.parent2Id}childNode`, { class: "marriage", label: "" })
            g.setEdge(child.parent2Id, `${child.parent2Id}childNode`, {
                arrowhead: "undirected",
                curve: d3.curveStepBefore
            })
            g.setEdge(`${child.parent2Id}childNode`, child.id, {
                arrowhead: "undirected",
                curve: d3.curveStepBefore
            })
        }
        //probably a lot of cases missing here
    }
    render(inner, g);
}
//
function graphSpouse(id) {

    const person = idToData(id)
    const spouse = idToData(person.spouses[0])
    //removes the spouse button from the person who is being expanded
    removeButton(/<input type='button' id="spouseButton"(.*?)>/, id)
    //set spouse node
    idSetNode(spouse.id)
    //set a marriage node so the spouses are on the same rank
    g.setNode(`${(id + spouse.id).split('').sort().join('')}ParentMarriage`, { label: "", class: "marriage" })
    g.setEdge(id, `${(id + spouse.id).split('').sort().join('')}ParentMarriage`, {
        arrowhead: "undirected",
        curve: d3.curveStepBefore
    })
    g.setEdge(spouse.id, `${(id + spouse.id).split('').sort().join('')}ParentMarriage`, {
        arrowhead: "undirected",
        curve: d3.curveStepBefore
    })
    render(inner, g)
}
//checks if a node is on screen by id
function nodeOnScreen(id) {
    return Object.keys(g._nodes).includes(id)
}

//returns the html label in the tree for a person based on their uuid
function idSetNode(uuid) {
    if(typeof uuid == "object") {throw new Error('Thats not an id brother');}
    const person = idToData(uuid)
    console.log(personToInfoScore(person))
    g.setNode(uuid, {
        labelType: "html",
        label:
            `<div style="min-height: 200px; width: 160px;">
    <img style="width: 80%;  align-self: center; display: block; margin-left: auto;margin-right: auto;" src="${person.pic ? person.pic : "https://media.istockphoto.com/id/1451587807/vector/user-profile-icon-vector-avatar-or-person-icon-profile-picture-portrait-symbol-vector.jpg?s=612x612&w=0&k=20&c=yDJ4ITX1cHMh25Lt1vI1zBn2cAKKAlByHBvPJ8gEiIg="}"></img>
    <p onclick="openPerson('${person.id}', '${requestEnd}')">${person.name}</p> ${personToLifespan(person)} 
    ${person.lore ? `<p style="font-style: italic;">${person.lore}</p>` : ""}
    ${toShowParentsButton(person) ? `<input type='button' id="parentButton" onclick="graphParents('${person.id}')" value="P">` : ""} 
    ${(person.children.length > 1 ? true : !nodeOnScreen(person.children[0]) && person.children.length != 0) ? `<input type='button' id="childButton" onclick="graphChildren('${person.id}')" value="C">` : ""}
    ${person.children.length == 0 && person.spouses.length == 1 && !nodeOnScreen(person.spouses[0]) ? `<input type='button' id="spouseButton" onclick="graphSpouse('${person.id}')" value="S">` : ""}
    </div>`,
        style: `fill: ${treeStyle == "normal" ? (person.gender == "male" ? "#00c4f3;" : "#ff72af") : (treeStyle = "info" ? ("#" + rainbow.colorAt(personToInfoScore(person))) : "pink")};`
    }
    )
}

function removeButton(regex, id) {
    const person = idToData(id)
    g.setNode(id, { labelType: "html", label: Object.values(g._nodes)[Object.keys(g._nodes).indexOf(id)].label.replace(regex, ""), style: `fill: ${treeStyle == "normal" ? (person.gender == "male" ? "#00c4f3;" : "#ff72af") : (treeStyle = "info" ? ("#" + rainbow.colorAt(personToInfoScore(person))) : "pink")};` })
}

//to show or not to show it
//i mean it could be a switch case but that is really not important whoever sees this is 100% free to change it if they so desire
function toShowParentsButton(person) {
    if (!person.parent1Id && !person.parent2Id) {
        return false
    }
    if (person.parent1Id && person.parent2Id) {
        if (nodeOnScreen(person.parent1Id) && nodeOnScreen(person.parent2Id)) {
            return false
        } else {
            return true
        }
    }
    if (person.parent1Id) {
        return !nodeOnScreen(person.parent1Id)
    }
    if (person.parent2Id) {
        return !nodeOnScreen(person.parent2Id)
    }
}

async function checkGraphUpdates() {
    oldTree = data;
    data = await getData(treeUser)
    data = data.filter(n => n)

    const oldIds = oldTree.map(a => a.id);

    data.forEach(element => {
        if (!oldIds.includes(element.id)) {
            console.log(element)
            if (element.children.length != 0) {
                element.children.forEach(child => {
                    childLabel = Object.values(g._nodes)[Object.keys(g._nodes).indexOf(child)].label
                    childLabel = childLabel.slice(0, childLabel.length - 6) + `<input type='button' id="parentButton" onclick="graphParents('${child}')" value="P">` + "</div>"
                    g.setNode(child, { labelType: "html", label: childLabel })
                })
            } else if (element.spouses.length == 1) {
                spouseLabel = Object.values(g._nodes)[Object.keys(g._nodes).indexOf(element.spouses[0])].label
                spouseLabel = spouseLabel.slice(0, spouseLabel.length - 6) + `<input type='button' id="spouseButton" onclick="graphSpouse('${element.spouses[0]}')" value="S">` + "</div>"
                g.setNode(element.spouses[0], { labelType: "html", label: spouseLabel })
            }
            if (element.parent1Id) {
                parentLabel = Object.values(g._nodes)[Object.keys(g._nodes).indexOf(element.parent1Id)].label
                parentLabel = parentLabel.slice(0, parentLabel.length - 6) + `<input type='button' id="parentButton" onclick="graphChildren('${element.parent1Id}')" value="C">` + "</div>"
                g.setNode(element.parent1Id, { labelType: "html", label: parentLabel })
            }
            if (element.parent2Id) {
                parentLabel = Object.values(g._nodes)[Object.keys(g._nodes).indexOf(element.parent2Id)].label
                parentLabel = parentLabel.slice(0, parentLabel.length - 6) + `<input type='button' id="parentButton" onclick="graphChildren('${element.parent2Id}')" value="C">` + "</div>"
                g.setNode(element.parent2Id, { labelType: "html", label: parentLabel })
            }

        }
    });
    Object.keys(g._nodes).forEach(element => {
        if(!(element.match(/childNode/) || element.match(/ParentMarriage/))){
            idSetNode(element)
        }
    })

    render(inner, g)
}

function personToInfoScore(dude) {
    console.log(dude)
    return dude.writing.length
        + (dude.sources.length * 0.25)
        + (dude.children.length * 10)
        + (dude.birthDate ? 35 : 0)
        + (dude.birthPlace ? 35 : 0)
        + (dude.deathDate ? 35 : 0)
        + (dude.deathPlace ? 35 : 0)
        + (dude.deathCause ? 25 : 0)
        + (dude.burialPlace ? 25 : 0)
        + (dude.pic ? 100 : 0)
}