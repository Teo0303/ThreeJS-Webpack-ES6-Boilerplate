import { Vector2, Raycaster } from "three";
import Config from "../../data/config";

// Controls based on orbit controls
export default class Controls {
  constructor(camera, container) {
    // Orbit controls first needs to pass in THREE to constructor
    this.camera = camera;
    this.canvas = container;
    this.rotateStart = new Vector2();
    this.rotateEnd = new Vector2();
    this.rotateDelta = new Vector2();
    this.rotateSpeed = 0.25;
    this.PI_2 = Math.PI / 2;
    this.mouseDown = false;
    this.raycaster = new Raycaster();
    this.mouse = new Vector2();

    // this.init();
    this.bindEventListeners();
  }

  bindEventListeners() {
    this.canvas.addEventListener("mousedown", this.onMouseDown.bind(this));
    this.canvas.addEventListener("mouseup", this.onMouseUp.bind(this));
    this.canvas.addEventListener("mousemove", this.onMouseMove.bind(this));
    this.canvas.addEventListener("touchmove", this.onTouchMove.bind(this));
    this.canvas.addEventListener("touchstart", this.onTouchStart.bind(this));
    this.canvas.addEventListener("touchend", this.onTouchEnd.bind(this));
  }

  onMouseDown(evt) {
    const self = this;

    self.mouseDown = true;
    const { x, y } = this.getCoordinates(evt);
    evt.preventDefault();
    self.setCursor("grab");

    self.rotateStart.set(x, y);

    self.mouse.set(
      (x / window.innerWidth) * 2 - 1,
      -(y / window.innerHeight) * 2 + 1
    );

    self.raycaster.setFromCamera(self.mouse, self.camera);
  }

  onMouseUp(evt) {
    const self = this;
    self.mouseDown = false;
    const { x, y } = self.getCoordinates(evt);
    evt.preventDefault();
    self.setCursor();
  }

  onMouseMove(evt) {
    const self = this;

    evt.preventDefault();

    if (self.mouseDown) {
      self.rotateEnd.set(evt.clientX, evt.clientY);

      self.rotateDelta
        .subVectors(self.rotateEnd, self.rotateStart)
        .multiplyScalar(self.rotateSpeed);

      self.camera.rotation.y -=
        -(2 * Math.PI * self.rotateDelta.x) / self.canvas.clientHeight;
      self.camera.rotation.x -=
        -(2 * Math.PI * self.rotateDelta.y) / self.canvas.clientHeight;

      self.rotateStart.copy(self.rotateEnd);

      self.camera.rotation.x = Math.max(
        -this.PI_2,
        Math.min(this.PI_2, self.camera.rotation.x)
      );
    }
  }

  onTouchStart(evt) {}

  onTouchEnd(evt) {}

  onTouchMove(evt) {}

  getCoordinates(evt) {
    let x = evt.clientX
      ? evt.clientX
      : evt.targetTouches[0]
      ? evt.targetTouches[0].pageX
      : evt.changedTouches[evt.changedTouches.length - 1].pageX;
    let y = evt.clientY
      ? evt.clientY
      : evt.targetTouches[0]
      ? evt.targetTouches[0].pageY
      : evt.changedTouches[evt.changedTouches.length - 1].pageY;

    return { x, y };
  }

  setCursor(cursorType) {
    const type = cursorType || "default";
    document.getElementsByTagName("body")[0].style.cursor = type;
  }
}
