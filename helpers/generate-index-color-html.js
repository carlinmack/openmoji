#!/usr/bin/env node

'use strict';

const path = require('path');
const fs = require('fs');
const _ = require('lodash');

const emojisList = require('../data/openmoji.json');

let html = `
<!DOCTYPE html>
<html lang='en'>
<head>
<title>OpenMoji Catalog</title>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:ital@0;1&display=swap" rel="stylesheet">
<style>
:root {
    --blue: #92d3f5;
    --blue-shadow: #61b2e4;
    --red: #ea5a47;
    --red-shadow: #d22f27;
    --green: #b1cc33;
    --green-shadow: #5c9e31;
    --yellow: #fcea2b;
    --yellow-shadow: #f1b31c;
    --white: #ffffff;
    --light-grey: #d0cfce;
    --grey: #9b9b9a;
    --dark-grey: #3F3F3F;
    --black: #000000;
    --orange: #f4aa41;
    --orange-shadow: #e27022;
    --pink: #ffa7c0;
    --pink-shadow: #e67a94;
    --purple: #b399c8;
    --purple-shadow: #8967aa;
    --brown: #a57939;
    --brown-shadow: #6a462f;
    --light-skin-tone: #fadcbc;
    --medium-light-skin-tone: #debb90;
    --medium-skin-tone: #c19a65;
    --dark-skin-shadow: #352318;
    --navy-blue: #1e50a0;
    --maroon: #781e32;
    --dark-green: #186648;
}
body[color-scheme='dark'] {
    --background-color-body: #17181c;
    --background-hover: #333;
}

body[color-scheme='light'] {
    --background-color-body: white;
    --background-hover: url("guidelines/openmoji-template.svg") #fff;
}
body {
    margin: 0;
    padding: 0;
    background-color: var(--background-color-body);
    transition: background-color 0.5s ease;
    line-height: 0;
    font-family: "Source Sans Pro", sans-serif;
}
header {
	border-bottom: rgba(129, 128, 128, 0.5) 1px solid;
    background-color: #FFF;
    box-sizing: border-box;
    padding: 0 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 80px;
	max-width: 100vw;
    position: sticky;
    top: 0;
}
header nav {
	display: flex;
	align-items: center;
}
header nav ul {
    display: flex;
    padding: 0;
    margin: 0;
}
header nav ul li {
    box-sizing: border-box;
    height: 30px;
    cursor: default;
    list-style: none;
}
header nav ul li a {
	vertical-align: middle;
	display: inline-block;
	line-height: 1.55rem;
	font-size: 17px;
}
a {
    text-decoration: none;
    color: #525252;
    transition: all 0.2s;
}
a:hover {
    color: #101010;
}
#emojis {
    max-width: 864px;
    margin: 0 auto;
}
img, button {
    width: 72px;
    height: 72px;
}
button {
    display: inline-block;
    border: none;
    padding: 0;
    margin: 0;
    text-decoration: none;
    background: transparent;
    border-radius: 5px;
    font-family: sans-serif;
    font-size: 1rem;
    cursor: pointer;
    text-align: center;
    transition: background 250ms ease-in-out,
                transform 150ms ease;
    -webkit-appearance: none;
    -moz-appearance: none;
}
button:hover, button:focus {
    background: var(--background-hover);
    transform: scale(1.5);
}
button:focus {
    outline: 1px solid var(--background-color-toggle);
    outline-offset: -4px;
}
button:active {
    transform: scale(1.4);
}
button p {
	line-height: 72px;
	font-size: 44px;
	margin: 0;
}
li img {
    width: 30px;
    height: 30px;
	margin-top: -5px;
}
li p {
	margin-top: 10px;
}
li button {
	color: inherit;
    height: auto;
    width: auto;
	font-family: inherit;
	background: none;
	padding: 0 5px;
	margin: 0 5px;
	font-size: 17px;
}
li button:hover {
    background: none;
    transform: none;
    color: #555;
}
li button:active {
    background: none;
}
li button:focus {
	outline: 1px solid #0003;
	outline-offset: -2px;
	background: none;
	transform: none;
}
li.selected {    
    border-bottom: 4px solid #3D98BB;
}
#pngsvgToggle {
    bottom: 100px;
    left: 10px;
}
#openmojisystemToggle {
    bottom: 55px;
    left: 10px;
}
#colorblackToggle {
    bottom: 10px;
    left: 10px;
}
#backgroundToggle {
    position: fixed;
    bottom: 10px;
    right: 10px;
}
.omBlack p {
    font-family: OpenMojiBlack;
}
.omColor p {
    font-family: OpenMojiColor;
}
@media only screen and (max-width:576px) {
    button, img {
        height: 14vw;
        width: 14vw;
    }
    .toggle {
        width: calc(calc(100% - 50px) / 3);
        height: auto;
        line-height: normal;
        position: static;
        margin: 2.5px;
    }
    #toggles {
        display: flex;
        flex-direction: row;
        width: 100%;
    }
    #backgroundToggle {
        position: static;
    }
    #color, #black, #system {
        margin: 0 1vw;
    }
}
@font-face {
    font-family: 'OpenMojiBlack';
    src: url('font/OpenMoji-Black.ttf') format('truetype');
  }
@font-face {
    font-family: 'OpenMojiColor';
    src: url('font/OpenMoji-Color.ttf') format('truetype');
  }
</style>
</head>
<body color-scheme='light'>
    <header class="page-header">
        <nav>
            <ul id='nav-ul'>
                <li>
                    <p>OpenMoji</p>
                </li>
            </ul>
        </nav>
    </header>
    <p style='text-align: center; padding: 15px; font-style: italic; color: #999;'> click to copy codepoint </p>
    <script src="jscolor.js"></script>

    <div id='emojis'>
`;

html += `<div id='svgColor'>`

const colors = [
    "#92d3f5", "#61b2e4", "#ea5a47", "#d22f27", "#b1cc33", "#5c9e31", "#fcea2b", "#f1b31c",
    "#ffffff", "#d0cfce", "#9b9b9a", "#3F3F3F", "#000000", "#f4aa41", "#e27022", "#ffa7c0",
    "#e67a94", "#b399c8", "#8967aa", "#a57939", "#6a462f", "#fadcbc", "#debb90", "#c19a65",
    "#352318", "#1e50a0", "#781e32", "#186648", "#fff", "#000"
]

const mappings = ["--blue", "--blue-shadow", "--red", "--red-shadow", "--green",
    "--green-shadow", "--yellow", "--yellow-shadow", "--white", "--light-grey", "--grey",
    "--dark-grey", "--black", "--orange", "--orange-shadow", "--pink", "--pink-shadow",
    "--purple", "--purple-shadow", "--brown", "--brown-shadow", "--light-skin-tone",
    "--medium-light-skin-tone", "--medium-skin-tone",  "--dark-skin-shadow", "--navy-blue",
    "--maroon", "--dark-green", "--white", "--black"
]

html += _.map(emojisList, (e) => {
    if (e.skintone === '') {
        let filePath = path.join(__dirname, '../color/svg/' + e.hexcode + '.svg');
        let svg = fs.readFileSync(filePath, {
            encoding: 'utf8'
        });

        svg = svg.replace('id="emoji"', 'height="72" width="72"');
        for (let i in colors) {
            svg = svg.replace(new RegExp(colors[i],"ig"), 'var('+mappings[i]+')');
        } 
        return svg
    }
}).join('');

html += `</div></div></body>
<script>
function toggle(t) {
    if (t == 'blackT' || t == 'colorT') {
        document.getElementById('colorT').classList.remove('selected');
        document.getElementById('blackT').classList.remove('selected');
    } else {
        document.getElementById('pngT').classList.remove('selected');
        document.getElementById('svgT').classList.remove('selected');
        document.getElementById('openmojiT').classList.remove('selected');
        document.getElementById('systemT').classList.remove('selected');
    }
    document.getElementById(t).classList.add('selected');

    const state = [...
        document.querySelectorAll('.selected')
    ].map(i => i.children[0].innerHTML);

    switch (state[0]) {
        case 'PNG':
            document.getElementById('system').style = "display:none";
            document.getElementById('svgBlack').style = "display:none";
            document.getElementById('svgColor').style = "display:none";
            if (state[1] == 'Black') {
                // black PNG
                document.getElementById('pngBlack').style = "";
                document.getElementById('pngColor').style = "display:none";
            } else {
                // color PNG
                document.getElementById('pngBlack').style = "display:none";
                document.getElementById('pngColor').style = "";
            }
            break;
        case 'SVG':
            document.getElementById('system').style = "display:none";
            document.getElementById('pngBlack').style = "display:none";
            document.getElementById('pngColor').style = "display:none";
            if (state[1] == 'Black') {
                // black SVG
                document.getElementById('svgBlack').style = "";
                document.getElementById('svgColor').style = "display:none";
            } else {
                // color SVG
                document.getElementById('svgBlack').style = "display:none";
                document.getElementById('svgColor').style = "";
            }
            break;
        case 'Font':
            document.getElementById('pngBlack').style = "display:none";
            document.getElementById('pngColor').style = "display:none";
            document.getElementById('svgBlack').style = "display:none";
            document.getElementById('svgColor').style = "display:none";

            document.getElementById('system').style = "";
            if (state[1] == 'Black') {
                // black Font
                document.getElementById('system').classList.add("omBlack");
                document.getElementById('system').classList.remove("omColor");
            } else {
                // color Font
                document.getElementById('system').classList.remove("omBlack");
                document.getElementById('system').classList.add("omColor");
            }
            break;
        case 'System':
            document.getElementById('pngBlack').style = "display:none";
            document.getElementById('pngColor').style = "display:none";
            document.getElementById('svgBlack').style = "display:none";
            document.getElementById('svgColor').style = "display:none";

            document.getElementById('system').style = "";
            document.getElementById('system').classList.remove("omBlack");
            document.getElementById('system').classList.remove("omColor");
            if (state[1] == 'Black') {
                console.log('black System')
            } else {
                console.log('color System')
            }
            break;
        default:
            console.log('error:', state)
    }
}

function toggleNightmode() {
    if (document.body.getAttribute('color-scheme') == 'light') {
        document.body.setAttribute('color-scheme', 'dark');
        
        document.getElementById('backgroundT').children[0].innerHTML = '<img alt="bright button" title="bright button - 1F506" src="color/svg/1F506.svg">'
    } else {
        document.body.setAttribute('color-scheme', 'light');

        document.getElementById('backgroundT').children[0].innerHTML = '<img alt="crescent moon" title="crescent moon - 1F319" src="color/svg/1F319.svg">'
    }
}

function copyToClipboard(value) {
    var temp = document.createElement('input')
    document.body.append(temp);
    temp.value = value
    temp.select();
    document.execCommand("copy");
    temp.parentNode.removeChild(temp);
}
colors = [
    "#92d3f5", "#61b2e4", "#ea5a47", "#d22f27", "#b1cc33", "#5c9e31", "#fcea2b", "#f1b31c",
    "#ffffff", "#d0cfce", "#9b9b9a", "#3F3F3F", "#000000", "#f4aa41", "#e27022", "#ffa7c0",
    "#e67a94", "#b399c8", "#8967aa", "#a57939", "#6a462f", "#fadcbc", "#debb90", "#c19a65",
    "#352318", "#1e50a0", "#781e32", "#186648"
]

const mappings = ["--blue", "--blue-shadow", "--red", "--red-shadow", "--green",
    "--green-shadow", "--yellow", "--yellow-shadow", "--white", "--light-grey", "--grey",
    "--dark-grey", "--black", "--orange", "--orange-shadow", "--pink", "--pink-shadow",
    "--purple", "--purple-shadow", "--brown", "--brown-shadow", "--light-skin-tone",
    "--medium-light-skin-tone", "--medium-skin-tone",  "--dark-skin-shadow", "--navy-blue",
    "--maroon", "--dark-green"
]

function update(picker, colorID) {
    let root = document.documentElement;
    root.style.setProperty(mappings[colorID], picker.toHEXString());
}

jscolor.trigger('input');


parent = document.getElementById('nav-ul')

for (var i = 0; i < colors.length; i++) {
    var li = document.createElement('li')
    var button = document.createElement('button')
    var opts = {
        value: colors[i],
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#777',
        onInput:'update(this, '+i+')',
    }

    var picker = new JSColor(button, opts) // 'JSColor' is an alias to 'jscolor'
    li.appendChild(button)
    parent.appendChild(li)
}

</script>
</html>
`;

// write HTML
fs.writeFileSync('index-color.html', html);


