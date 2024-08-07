let modInfo = {
	name: "The Question Tree",
	id: "TQT",
	author: "ArkSayCode",
	pointsName: "thoughts",
	modFiles: ["Layers/q.js", "Layers/a.js", "Layers/e.js", "Layers/i.js", "Layers/t.js", "Layers/m.js", "Layers/o.js", "Layers/ac.js", "tree.js"],

	discordName: "ArkTopia (does not talk about my games)",
	discordLink: "https://discord.gg/tqDzpZebdb",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 0.05,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.0.4",
	name: "The Beginning of Consciousness",
}

let changelog =`	
<h1>Changelog:</h1>
<br>
<br>
	<h2>The Beginning of Consciousness:</h2>
<br>
<br>
	<h3>v0.0.5:</h3>
<br>
<br>
	- Added Philosophy
<br>
<br>
	<h3>v0.0.4:</h3>
<br>
<br>
	- Added Theories.<br>
	- Added Intellegence.<br>
	- Added Mysteries.
<br>
<br>
	<h3>v0.0.3:</h3>
<br>
<br>
	- Added Enigmas.
<br>
<br>
	<h3>v0.0.2:</h3>
<br>
<br>
	- Added Answers!<br>
	- Added Achievements.
<br>
<br>
	<h3>v0.0.1:</h3>
<br>
<br>
	- Added Questions?
<br>
<br>
	<h3>v0.0.0:</h3>
<br>
<br>
	- ???`


let winText = `Congratulations! You have reached the end and beaten this game, or have you?`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
	if (hasUpgrade('q', 11)) gain = gain.times(2)
	if (hasUpgrade('q', 12)) gain = gain.times(upgradeEffect('q', 12))
	if (hasUpgrade('q', 21)) gain = gain.times(upgradeEffect('q', 21))
	if (hasUpgrade('q', 22)) gain = gain.times(upgradeEffect('q', 22))
	gain = gain.mul(tmp.a.effect.thoughtBoost)
	if (!inChallenge("a", 22)) gain = gain.mul(tmp.e.effect.thoughtBoost)
	//gain = gain.times(10000) // for testing purposes only
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { 
	return {
		endgame: new Decimal(1100),
		treeState: "dev",
	}
}

function convertToB16(n){
    let codes = {
            0: "0",
            1: "1",
            2: "2",
            3: "3",
            4: "4",
            5: "5",
            6: "6",
            7: "7",
            8: "8",
            9: "9",
            10: "A",
            11: "B",
            12: "C",
            13: "D",
            14: "E",
            15: "F",
    }
    let x = n % 16
    return codes[(n-x)/16] + codes[x]
}

function getUndulatingColor(period = Math.sqrt(760), off = 0){
	let t = new Date().getTime()
	let a = Math.sin(t / 1e3 / period * 2 * Math.PI + 4 + off)
	let b = Math.sin(t / 1e3 / period * 2 * Math.PI + 2 + off)
	let c = Math.sin(t / 1e3 / period * 2 * Math.PI + 0 + off)
	a = convertToB16(Math.floor(a*128) + 128)
	b = convertToB16(Math.floor(b*128) + 128)
	c = convertToB16(Math.floor(c*128) + 128)
	return "#"+String(a) + String(b) + String(c)
}

function getMonochromaticColor(period = Math.sqrt(760), value = 50, off = 0){
	let t = new Date().getTime()
	let x = sin(t/period+off)*value/2+value/2
	a = convertToB16(x)
	return "#"+String(x) + String(x) + String(x)
}

// Display extra things at the top of the page
var displayThings = [
    function(){
        let x = getUndulatingColor()
        
		return "<br>" + "Current endgame: "+colorText("h2", x,format(addedPlayerData().endgame))+" thoughts (v0.0.3)"
	},
	function(){
		let c = 0
		for (i = 0; i<10; i++){
			c += lastTenTicks[i] / 10000
		}
		return "Average TPS = " + format(c, 3) + "s/tick."
	},
	function(){
		var rem = 0
		for (lys in LAYERS) {
			if (player[LAYERS[lys]] !== undefined && (!player[LAYERS[lys]].unlocked || (!tmp[LAYERS[lys]].layerShown))) rem++
		}
		return `<h5 style='margin-top:5px;opacity:0.5'><i>(${rem + " layers remaining"})</i></h5>` + (options.autosave ? "" : "<br>" + colorText("h2", "red","Warning: Autosave is off"))
	},
	function(){
		return "<br>" +format(addedPlayerData().treeState)
	}
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(addedPlayerData().endgame)
}



// Less important things beyond this point!

// Style for the background, can be a function
function backgroundStyle() {
	return getMonochromaticColor()
}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){

}
