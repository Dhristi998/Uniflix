// Live facial-expression detection with face-api.js.
// Runs entirely in the browser: no frames ever leave the user's device.

const video = document.getElementById('video');
const camera = document.getElementById('camera');
const captureBtn = document.getElementById('captureBtn');
const statusEl = document.getElementById('status');

const MODEL_URL = '/models';
const HISTORY_SIZE = 10; // average over the last ~1 second of frames
const history = [];

function setStatus(html) {
    statusEl.innerHTML = html;
}

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
]).then(() => {
    setStatus('Model loaded. Starting your camera…');
    startVideo();
}).catch(err => {
    console.error('Model loading failed:', err);
    setStatus('Could not load the emotion model. Please refresh the page.');
});

function startVideo() {
    if (!navigator.mediaDevices?.getUserMedia) {
        setStatus('Your browser does not support camera access. Try Chrome, Edge or Safari.');
        return;
    }
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
        .then(stream => {
            video.srcObject = stream;
        })
        .catch(err => {
            console.error('Error accessing webcam:', err);
            setStatus('Camera access was blocked. Allow camera access in your browser and refresh to try again.');
        });
}

video.addEventListener('loadedmetadata', () => {
    const canvas = faceapi.createCanvasFromMedia(video);
    camera.append(canvas);

    const displaySize = { width: video.videoWidth, height: video.videoHeight };
    faceapi.matchDimensions(canvas, displaySize);

    setStatus('Looking for your face…');

    setInterval(async () => {
        const detection = await faceapi
            .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceExpressions();

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (detection) {
            const resized = faceapi.resizeResults(detection, displaySize);
            faceapi.draw.drawFaceLandmarks(canvas, resized);

            history.push(detection.expressions);
            if (history.length > HISTORY_SIZE) history.shift();

            const { emotion, score } = getDominantEmotion();
            setStatus(`You look <strong>${emotion}</strong> (${Math.round(score * 100)}% confident)`);
            captureBtn.disabled = false;
        } else {
            setStatus('No face detected. Move closer and face the camera.');
        }
    }, 150);
});

captureBtn.addEventListener('click', () => {
    if (!history.length) return;
    const { emotion } = getDominantEmotion();
    window.location.href = `emotion.html?emotion=${encodeURIComponent(emotion)}`;
});

// Averages each expression's probability over recent frames
// and returns the strongest one. Smoother than a single frame.
function getDominantEmotion() {
    const totals = {};
    for (const expressions of history) {
        for (const [name, value] of Object.entries(expressions)) {
            totals[name] = (totals[name] || 0) + value / history.length;
        }
    }
    const emotion = Object.keys(totals).reduce((a, b) => (totals[a] > totals[b] ? a : b));
    return { emotion, score: totals[emotion] };
}
