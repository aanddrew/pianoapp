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

    chord_name = chord_name.substring(chord_info.root.length);
    chord_indexes = []
    if (chord_name.startsWith("maj7")) {
        chord_indexes = major_seven;
    }
    else if (chord_name.startsWith("min7")) {
        chord_indexes = minor_seven;
    }
    else if (chord_name.startsWith("dim7")) {
        chord_indexes = diminish_seven;
    } 
    else if (chord_name.startsWith("7")) {
        chord_indexes = dominant_seven;
    }

    for (var i = 0; i < chord_indexes.length; i++) {
        chord_indexes[i] += chord_info.root_index;
    }

    chord_info.indexes = chord_indexes;

    return chord_info;
}

function highlightChord(chord_name) {
    let chord_info = get_chord_info(chord_name);
    console.log(chord_info);

    for (var i = 0; i < chord_info.indexes; i++) {
        key_containers[chord_info.indexes[i]].style.backgroundColor = "red"; 
    }
}

function resetKeyboardColors() {

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
};