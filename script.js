let pianoContainer = document.getElementsByClassName("piano-container");
let blackKeyContainer = document.getElementsByClassName("black-keys-container")
const base = "./audio/";

let scale_pattern = [0, 2, 4, 5, 7, 9, 11]

let keys = [
    {names: ["C"],        accidental: false},
    {names: ["C#", "Db"], accidental: true},
    {names: ["D"],        accidental: false},
    {names: ["D#", "Eb"], accidental: true},
    {names: ["E"],        accidental: false},
    {names: ["F"],        accidental: false},
    {names: ["F#", "Gb"], accidental: true},
    {names: ["G"],        accidental: false},
    {names: ["G#", "Ab"], accidental: true},
    {names: ["A"],        accidental: false},
    {names: ["A#", "Bb"], accidental: true},
    {names: ["B"],        accidental: false},
];

function key_information(index) {
    let octave = Math.floor(index / 12);
    let relative_index = index - (octave * 12);

    ret = {
        octave: octave,
        relative_index: relative_index,
        names: keys[relative_index].names,
        accidental: keys[relative_index].accidental
    };

    return ret;
}

function get_key_index(key_name) {
    for (var i = 0; i < keys.length; i++) {
        if (keys[i].names.includes(key_name)) {
            return i;
        }
    }
    return -1;
}

let major_seven    = [0, 4, 7, 11];
let minor_seven    = [0, 3, 7, 10];
let dominant_seven = [0, 4, 7, 10];
let diminish_seven = [0, 3, 6, 9];

let chord_information = [
    {suffix: "maj7", name: "Major Seven",      steps: major_seven},
    {suffix: "min7", name: "Minor Seven",      steps: minor_seven},
    {suffix: "7",    name: "Dominant Seven",   steps: dominant_seven},
    {suffix: "dim7", name: "Diminished Seven", steps: diminish_seven},
]

let key_containers = [];

function get_chord_info(chord_name) {
    chord_info = {};

    all_key_names = keys.map(info => info.names).flat().sort((a,b) => a.length < b.length)

    for (var i = 0; i < all_key_names.length; i++) {
        key_name = all_key_names[i];
        if (chord_name.startsWith(key_name)) {
            //console.log(chord_name, key_name, chord_name.startsWith(key_name));
            chord_info.root = key_name;
            chord_info.root_index = get_key_index(key_name);
            break;
        }
    }

    if (chord_info.root !== undefined) {
        chord_name = chord_name.substring(chord_info.root.length); // chop off the root note
    }
    chord_indexes = []
    for (var i = 0; i < chord_information.length; i++) {
        if (chord_name.startsWith(chord_information[i].suffix)) {
            chord_indexes = Array.from(chord_information[i].steps); // gotta clone it
            for (var i = 0; i < chord_indexes.length; i++) {
                chord_indexes[i] += chord_info.root_index;
            }
        }
    }

    chord_info.indexes = chord_indexes;

    return chord_info;
}

function resetKeyboardColors() {
    for (var i = 0; i < key_containers.length; i++) {
        let key_is_black = key_information(i).accidental;

        if (key_is_black) {
            key_containers[i].style.backgroundColor = "#24272e"; 
        }
        else {
            key_containers[i].style.backgroundColor = "#ffffff"; 
        }
    }
}

function highlightChord(chord_name) {
    resetKeyboardColors();

    let chord_info = get_chord_info(chord_name);

    for (var i = 0; i < chord_info.indexes.length; i++) {
        key_containers[chord_info.indexes[i]].style.backgroundColor = "#2887e3"; 
    }
}

function makeRandomChord() {
    let key_index = Math.floor(Math.random() * keys.length);
    let chord_index = Math.floor(Math.random() * chord_information.length);

    return keys[key_index].names[0] + chord_information[chord_index].suffix;
}

function makeRandomChordAndHighlight() {
    let chordName = makeRandomChord();

    let chord_textbox = document.getElementById("chord-textbox");
    chord_textbox.value = chordName;

    highlightChord(chordName);
}

window.onload = () => {
  //24keys
  for (let index = 0; index <= 23; index++) {
    let div = document.createElement("div");
    // let which_type = index <= 9 ? "black-key" : "white-key";
    let which_type = key_information(index).accidental ? "black-key" : "white-key";

    key_containers.push(div);

    div.classList.add("key", which_type);

    if (which_type == "black-key") {
        blackKeyContainer[0].appendChild(div);
    }
    else {
        pianoContainer[0].appendChild(div);
    }
  }

  let chord_textbox = document.getElementById("chord-textbox");
  chord_textbox.addEventListener('input', function(event) {
    // console.log(chord_textbox.value);
    highlightChord(chord_textbox.value);
  });
};