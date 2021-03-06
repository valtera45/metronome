/**
 *	this function starts the metronome once the 
 *	start | stop button is clicked
 **/
window.onload = function() {
    var button = document.getElementById('startStopButton');
    button.onclick = startStopMetronome;
}

var time = 0,
    timeoutId,
    strongBeat = 1,
    weakBeat = 2,
    meter = 4,
    onOff = 0,
    bpm,
    subdivision = 1;

// creates a new audioContext object which comprises different audio modules
// contains the execution of audio processing
var AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();

/**
 * Creates a Click object constructor which sets up the context.
 *
 **/
function Click(context) {

    this.context = context;

    /**
     *	Setup function which initializes the oscillator
     **/
    this.setup = function() {
        this.osc = this.context.createOscillator(); // Creates an OscillatorNode
        this.gain = this.context.createGain(); // Used to control the overall gain of the audio graph.
        this.osc.connect(this.gain);
        this.gain.connect(this.context.destination);
    };

    /**
     *	This function sets up the audio properties of the click tone
     *	such as the attack, decay, sustain, and release
     *	@param {time} when to activate the click
     *  @param {frequency} the frequency of the sine wave generated
     **/
    this.trigger = function(time, frequency) {

        this.setup();
        this.osc.frequency.setValueAtTime(frequency, time);
        this.gain.gain.setValueAtTime(.4, time);
        this.osc.frequency.exponentialRampToValueAtTime(0.001, time + 0.5);
        this.gain.gain.exponentialRampToValueAtTime(0.001, time + 0.5);
        this.osc.start(time);
        this.osc.stop(time + 0.5);

    };
}; // end Click object constructor

/**
 *	this starts the metronome as soon as the start | stop button is clicked
 **/
function startStopMetronome() {
    if (onOff === 0) {
        onOff = 1;
        beat();
    } else {
        onOff = 0;
    }
}

/**
 *	calculates the tempo(timeoutId) and calls the click audio depending on the subdivision
 **/
function beat() {
    if (onOff)
        timeoutId = setTimeout("beat()", (60000 / bpm) / subdivision);

    if (strongBeat == 1) {
        strongClick();
        strongBeat = 0;
    } else if (weakBeat <= meter) {
        weakClick();
        weakBeat++;
        if (weakBeat == (meter + 1)) {
            strongBeat = 1;
            weakBeat = 2;
        }
        // method to subdivide eighth notes and accent quarter notes
        else if ((meter % weakBeat) != 0 && subdivision == 2) {
            // it should be a quarter note and a strong beat
            strongBeat = 1;
            weakBeat++;
        }
    }
}

/**
 *	strongClick and weakClick generate slightly different sine tones to 
 *	differentiate between the strong and weak hits
 **/
function strongClick() {
    var click = new Click(context);
    var now = context.currentTime;
    click.trigger(now, 400);
}

function weakClick() {
    var click = new Click(context);
    var now = context.currentTime;
    click.trigger(now, 300);
}