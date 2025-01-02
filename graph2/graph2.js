const token = getCookie("token")
const username = getCookie("username")
var treeUser = getCookie("treeUser")
if (treeUser == username || !treeUser) treeUser = "empty"
const requestEnd = treeUser == "empty" ? "" : `&username=${treeUser}`

function getCookie(name) {
    return localStorage.getItem(name)
}

// append the svg object to the body of the page
const svg = d3.select("body")
    .append("svg")
    .attr("width", screen.availWidth)
    .attr("height", screen.availHeight)
    .call(d3.zoom().on("zoom", function () {
        svg.attr("transform", d3.event.transform)
    }))
    .append("g")


async function main() {
    tree = await (await fetch(`https://familytree.loophole.site/getTree?token=${token}${requestEnd}`)).json()

    const node = svg.append("rect")
    .attr("width", 150)
    .attr("height", 200);
    
    node.append("div").html("<p>UNTO</p>")
}

main();