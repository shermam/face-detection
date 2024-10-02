const stream = await navigator.mediaDevices.getUserMedia({ video: true });
const height = stream.getVideoTracks()[0].getSettings().height;
const width = stream.getVideoTracks()[0].getSettings().width;
const videoElement = document.createElement("video");
videoElement.width = height;
videoElement.height = width;
const canvas = document.querySelector("canvas");
canvas.width = width;
canvas.height = height;
const ctx = canvas.getContext("2d");
videoElement.srcObject = stream;
videoElement.onloadedmetadata = () => videoElement.play();
const faceDetector = new FaceDetector({ fastMode: true, maxDetectedFaces: 1 });
requestAnimationFrame(async function render() {
  const faces = await faceDetector.detect(videoElement).catch(() => []);
  ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
  for (const { boundingBox: b } of faces) {
    ctx.strokeRect(b.x, b.y, b.width, b.height);
  }
  requestAnimationFrame(render);
});
