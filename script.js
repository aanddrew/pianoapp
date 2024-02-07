let pianoContainer = document.getElementsByClassName("piano-container");
let blackKeyContainer = document.getElementsByClassName("black-keys-container")

var always_show = true;
var show = true;
var inversions_on = true;
var currentChord = "";

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

let major_pattern    = [0, 4, 7, 11, 14, 18];
let minor_pattern    = [0, 3, 7, 10, 14, 18];
let dominant_pattern = [0, 4, 7, 10, 14, 18];
let diminished_pattern = [0, 3, 6, 9];

chord_suffixes = [ "maj", "min", "dim", "" ]
let chord_patterns = {
    "maj": major_pattern,
    "min": minor_pattern,
    "dim": diminished_pattern,
    "": dominant_pattern,
};

let key_containers = [];

function get_chord_info(chord_name) {
    chord_info = {};

    all_key_names = keys.map(info => info.names).flat().sort((a,b) => a.length < b.length)

    for (var i = 0; i < all_key_names.length; i++) {
        key_name = all_key_names[i];
        if (chord_name.startsWith(key_name)) {
            chord_info.root = key_name;
            chord_info.root_index = get_key_index(key_name);
            break;
        }
    }
    if (chord_info.root !== undefined) {
        chord_name = chord_name.substring(chord_info.root.length); // chop off the root note
    }

    chord_indexes = []
    chord_pattern = dominant_pattern; 
    for (var i = 0; i < chord_suffixes.length; i++) {
        chord_suffix = chord_suffixes[i];
        if (chord_name.startsWith(chord_suffix)) {
            chord_pattern = chord_patterns[chord_suffix];
            chord_name = chord_name.substring(chord_suffix.length); 
            break;
        }
    }

    chord_size = 3; // triad by default
    if (chord_name.length > 0) {
        new_size = parseInt(chord_name);
        if (!isNaN(new_size)) {
            new_size = (new_size + 1) / 2; // a 7th chord has 4 notes, 9th has 5...
        }
        chord_size = new_size;
    }

    chord_indexes = [];
    for (var i = 0; i < chord_size && i < chord_pattern.length; i++) {
        chord_indexes.push(chord_info.root_index + chord_pattern[i]);
    }

    chord_info.indexes = chord_indexes;

    return chord_info;
}

function resetKeyboardColors() {
    for (var i = 0; i < key_containers.length; i++) {
        let key_is_black = key_information(i).accidental;

        if (key_is_black) {
            key_containers[i].style.backgroundColor = "#070a0f"; 
        }
        else {
            key_containers[i].style.backgroundColor = "#ffffff"; 
        }
    }
}

function highlightChord(chord_name) {
    resetKeyboardColors();

    if (!show) {
        return;
    }

    let chord_info = get_chord_info(chord_name);

    let light_blue = "#2887e3"; 
    let light_orange = "#fda172";

    for (var i = 0; i < chord_info.indexes.length; i++) {
        chord_index = chord_info.indexes[i];
        if (chord_index < key_containers.length) {
            key_containers[chord_index].style.backgroundColor = light_blue;
        }

        if (inversions_on) {
            inversion = chord_index - 12;
            if (inversion < 0) {
                inversion += 24;
            }
            if (inversion < key_containers.length) {
                key_containers[inversion].style.backgroundColor = light_orange;
            }
        }
    }
}

function makeRandomChord() {
    let key_index = Math.floor(Math.random() * keys.length);
    let chord_suffix_index = Math.floor(Math.random() * chord_suffixes.length);

    let root_note = keys[key_index].names[0];
    let chord_suffix = chord_suffixes[chord_suffix_index];

    let available_sizes = ["", "7", "9", "11"];
    if (chord_suffix == "dim") {
        available_sizes = ["", "7"];
    }

    let chord_size_index = Math.floor(Math.random() * available_sizes.length);
    let chord_size = available_sizes[chord_size_index];

    return root_note + chord_suffix + chord_size;
}

function makeRandomChordAndHighlight() {
    let chordName = makeRandomChord();
    currentChord = chordName;

    let chord_textbox = document.getElementById("chord-textbox");
    chord_textbox.value = chordName;

    highlightChord(chordName);
}

function checkOrientation() {
    var overlay = document.getElementById('orientation-overlay');
    if (window.innerWidth < window.innerHeight) {
        // Landscape mode
        overlay.style.display = 'flex';
    } else {
        // Portrait mode
        overlay.style.display = 'none';
    }
}
window.onresize = checkOrientation;

window.onload = () => {
    checkOrientation();

    for (let index = 0; index <= 23; index++) {
        let div = document.createElement("div");
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
        currentChord = chord_textbox.value;
        highlightChord(chord_textbox.value);
    });
    currentChord = chord_textbox.value;

    let show_checkbox = document.getElementById("show-checkbox");
    let always_show_checkbox = document.getElementById("always-show-checkbox");
    let inversions_checkbox = document.getElementById("inversions-checkbox");
    show = show_checkbox.checked;
    always_show = always_show_checkbox.checked;
    inversions_on = inversions_checkbox.checked;

    let new_chord_button = document.getElementById("new-chord-button");
    new_chord_button.addEventListener('click', function(event) {
        show = always_show;
        show_checkbox.checked = show;

        makeRandomChordAndHighlight();
    });

    always_show_checkbox.addEventListener('click', function(event) {
        always_show = always_show_checkbox.checked;
    });

    inversions_checkbox.addEventListener('click', function(event) {
        inversions_on = inversions_checkbox.checked;
        highlightChord(currentChord);
    });
    inversions_on = inversions_checkbox.checked;

    show_checkbox.addEventListener('click', function(event) {
        show = show_checkbox.checked;

        if (show) {
            highlightChord(currentChord);
        }
        else {
            resetKeyboardColors();
        }
    })

    highlightChord(chord_textbox.value);
};