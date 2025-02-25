var r = document.querySelector(':root');
let darkModeLogo=true;


localStorage.getItem("bg-color")
  ? document.documentElement.style.setProperty(
      "--bg-color",
      localStorage.getItem("bg-color")
    )
  : localStorage.setItem("bg-color", "#FFE4C4");


localStorage.getItem("text-color")
  ? document.documentElement.style.setProperty(
      "--text-color",
      localStorage.getItem("text-color")
    )
  : localStorage.setItem("text-color", "#000000");


  localStorage.getItem("primary-color")
  ? document.documentElement.style.setProperty(
      "--primary-color",
      localStorage.getItem("primary-color")
    )
  : localStorage.setItem("primary-color", "#ffffff");


  localStorage.getItem("secondary-color")
  ? document.documentElement.style.setProperty(
      "--secondary-color",
      localStorage.getItem("secondary-color")
    )
  : localStorage.setItem("secondary-color", "#000000");


  localStorage.getItem("hover-color")
  ? document.documentElement.style.setProperty(
      "--hover-color",
      localStorage.getItem("hover-color")
    )
  : localStorage.setItem("hover-color", "#ddd");



console.log("d:"+localStorage.getItem("dark-mode"));
localStorage.getItem("dark-mode")
? 
    document.getElementById("darkModeCheckbox").checked =
    localStorage.getItem("dark-mode")
: localStorage.setItem("dark-mode", false);



localStorage.getItem("button-base-color")
? document.documentElement.style.setProperty(
    "--button-base-color",
    localStorage.getItem("button-base-color")
  )
: localStorage.setItem("button-base-color", "#6d6d6d");

localStorage.getItem("button-off-color")
? document.documentElement.style.setProperty(
    "--button-off-color",
    localStorage.getItem("button-off-color")
  )
: localStorage.setItem("button-off-color", "#d1d1d1");

localStorage.getItem("button-on-color")
? document.documentElement.style.setProperty(
    "--button-on-color",
    localStorage.getItem("button-on-color")
  )
: localStorage.setItem("button-on-color", "#6d6d6d");







document.getElementById("darkModeCheckbox").checked = localStorage.getItem("dark-mode") == "true" ? true : false;

console.log("d:"+localStorage.getItem("dark-mode"));
darkModeLogo= localStorage.getItem("dark-mode");
if (darkModeLogo) {
    document.getElementById("logo").src = "img/foobatree_dark_mode.png";
}else{
    document.getElementById("logo").src = "img/foobatree.png";
}

function reset() {
    r.style.setProperty('--bg-color', '#232323');
    r.style.setProperty('--text-color', '#ffffff');
    r.style.setProperty('--primary-color', '#000000');
    r.style.setProperty('--secondary-color', '#ffffff');
    r.style.setProperty('--hover-color', '#3b3b3b');
    r.style.setProperty('--button-base-color', '#282828');
    r.style.setProperty('--button-off-color', '#d1d1d1');
    r.style.setProperty('--button-on-color', '#6d6d6d');
}

function toggleDark(){
    if (document.getElementById("darkModeCheckbox").checked == true){
        darkModeLogo=true
        document.getElementById("logo").src = "img/foobatree_dark_mode.png";
      } else {
        darkModeLogo=false
        document.getElementById("logo").src = "img/foobatree.png";
      }
}

function save(){    
    r.style.setProperty('--bg-color',document.getElementById('bg-color-input').value);
    r.style.setProperty('--text-color',document.getElementById('text-color-input').value);
    r.style.setProperty('--primary-color',document.getElementById('primary-color-input').value);
    r.style.setProperty('--secondary-color',document.getElementById('secondary-color-input').value);
    r.style.setProperty('--hover-color',document.getElementById('hover-color-input').value);

    localStorage.setItem("bg-color", document.getElementById('bg-color-input').value);
    localStorage.setItem("text-color", document.getElementById('text-color-input').value);
    localStorage.setItem("primary-color", document.getElementById('primary-color-input').value);
    localStorage.setItem("secondary-color", document.getElementById('secondary-color-input').value);
    localStorage.setItem("dark-mode", darkModeLogo);
    localStorage.setItem("hover-color", document.getElementById('hover-color-input').value);


    toggleDark()
    
}
function setToClassic(){
    r.style.setProperty('--bg-color', '#FFE4C4');
    r.style.setProperty('--text-color', '#000000');
    r.style.setProperty('--primary-color', '#ffffff');
    r.style.setProperty('--secondary-color', '#000000');
    r.style.setProperty('--hover-color', '#ddd');
    r.style.setProperty('--button-base-color', '#6d6d6d');
    r.style.setProperty('--button-off-color', '#d1d1d1');
    r.style.setProperty('--button-on-color', '#6d6d6d');
    darkModeLogo=false;
    document.getElementById("darkModeCheckbox").checked=false;
    if (darkModeLogo==true) {
        document.getElementById("logo").src = "img/foobatree_dark_mode.png";
    }else{
        document.getElementById("logo").src = "img/foobatree.png";
    }


    propertyToValue();
}
function setToNight(){
    r.style.setProperty('--bg-color', '#232323');
    r.style.setProperty('--text-color', '#ffffff');
    r.style.setProperty('--primary-color', '#000000');
    r.style.setProperty('--secondary-color', '#ffffff');
    r.style.setProperty('--hover-color', '#3b3b3b');
    r.style.setProperty('--button-base-color', '#282828');
    r.style.setProperty('--button-off-color', '#d1d1d1');
    r.style.setProperty('--button-on-color', '#6d6d6d');
    darkModeLogo=true;
    document.getElementById("darkModeCheckbox").checked=true;
    if (darkModeLogo==true) {
        document.getElementById("logo").src = "img/foobatree_dark_mode.png";
    }else{
        document.getElementById("logo").src = "img/foobatree.png";
    }


    propertyToValue();
}
function setToHyvisian(){
    r.style.setProperty('--bg-color', '#004080');
    r.style.setProperty('--text-color', '#ffff80');
    r.style.setProperty('--primary-color', '#8080ff');
    r.style.setProperty('--secondary-color', '#ffffff');
    r.style.setProperty('--hover-color', '#ff80ff');
    r.style.setProperty('--button-base-color', '#282828');
    r.style.setProperty('--button-off-color', '#d1d1d1');
    r.style.setProperty('--button-on-color', '#6d6d6d');

    darkModeLogo=true;
    document.getElementById("darkModeCheckbox").checked=true;
    if (darkModeLogo==true) {
        document.getElementById("logo").src = "img/foobatree_dark_mode.png";
    }else{
        document.getElementById("logo").src = "img/foobatree.png";
    }

    propertyToValue();
}
function propertyToValue(){
    document.getElementById('bg-color-input').value= r.style.getPropertyValue('--bg-color');
    document.getElementById('text-color-input').value= r.style.getPropertyValue('--text-color');
    document.getElementById('primary-color-input').value= r.style.getPropertyValue('--primary-color');
    document.getElementById('secondary-color-input').value= r.style.getPropertyValue('--secondary-color');
    document.getElementById('hover-color-input').value= r.style.getPropertyValue('--hover-color');
    document.getElementById('button-base-color-input').value= r.style.getPropertyValue('--button-base-color');
    document.getElementById('button-off-color-input').value= r.style.getPropertyValue('--button-off-color');
    document.getElementById('button-on-color-input').value= r.style.getPropertyValue('--button-on-color');
}
function test(){
    document
      .getElementById("bg-color-input")
      .addEventListener("change", function () {
        console.log(this.value)
        document.body.style.backgroundColor = this.value; 
        });
}
function setPanel(new_panel) {
     general.classList.add("noShow");
     customization.classList.add("noShow");
     privacy.classList.add("noShow");
     account.classList.add("noShow");

     switch(new_panel) {
        case "general":
            general.classList.remove("noShow");
            break;
        case "customization":
            customization.classList.remove("noShow");
            break;
        case "privacy":
            privacy.classList.remove("noShow");
            break;
        case "account":
            account.classList.remove("noShow");
            break;
        default:
      } 
}


