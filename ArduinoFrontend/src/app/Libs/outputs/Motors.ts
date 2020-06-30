import { CircuitElement } from '../CircuitElement';
import { ArduinoUno } from './Arduino';
import { Point } from '../Point';

/**
 * Declare Raphael so that build don't throws error
 */
declare var Raphael;
/**
 * Motor class
 */
export class Motor extends CircuitElement {
  dirn = 1;
  cx = 0;
  cy = 0;
  rpm: any;
  /**
   * Motor constructor
   * @param canvas Raphael Canvas (Paper)
   * @param x  position x
   * @param y  position y
   */
  constructor(public canvas: any, x: number, y: number) {
    super('Motor', x, y, 'Motor.json', canvas);
  }
  /** init is called when the component is complety drawn to the canvas */
  // 6v -> 9000rpm ->
  init() {
    // Add value change Listener to circuit node
    this.nodes[0].addValueListener((v, cby, par) => {
      if (cby === this.nodes[1]) {
        return;
      }
      // sets the value for node
      this.nodes[1].setValue(v, this.nodes[0]);
      this.dirn = -1;
      if (v < 0) {
        this.elements[1].stop();
      } else {
        if (this.rpm) {
          this.rpm.remove();
          this.rpm = null;
        }
        this.elements[1].stop();
        if (v === 0) {
          return;
        }
        // animation caller
        const anim = Raphael.animation({ transform: `r-360` }, 400 / v);
        this.elements[1].animate(anim.repeat(Infinity));
        this.rpm = this.canvas.text(this.x + this.tx, this.y + this.ty - 30, `${1500 * v}RPM\nAntiClockwise`);
        this.rpm.attr({
          'font-size': 15,
        });
      }
    });
    // Add value change Listener to circuit node
    this.nodes[1].addValueListener((v, cby, par) => {
      if (cby === this.nodes[0]) {
        return;
      }
      // sets the value for node
      this.nodes[0].setValue(v, this.nodes[1]);
      if (v < 0) {
        this.elements[1].stop();
      } else {
        if (this.rpm) {
          this.rpm.remove();
          this.rpm = null;
        }
        this.elements[1].stop();
        if (v === 0) {
          return;
        }
        const anim = Raphael.animation({ transform: `r360` }, 400 / v);
        this.elements[1].animate(anim.repeat(Infinity));
        // setTimeout(() => this.elements[1].stop(), 3000);
        this.rpm = this.canvas.text(this.x + this.tx, this.y + this.ty - 30, `${1500 * v}RPM\nClockwise`);
        this.rpm.attr({
          'font-size': 15,
        });
      }
    });
  }
  /**
   * Function provides component details
   * @param keyName Unique Class name
   * @param id Component id
   * @param body body of property box
   * @param title Component title
   */
  properties(): { keyName: string; id: number; body: HTMLElement; title: string; } {
    const body = document.createElement('div');
    return {
      keyName: this.keyName,
      id: this.id,
      body,
      title: 'Motor'
    };
  }
  /**
   * Initialize Variable,callback and animation caller when start simulation is pressed
   */
  initSimulation(): void {
    if (
      this.nodes[1].connectedTo &&
      (this.nodes[1].connectedTo.start &&
        this.nodes[1].connectedTo.start.parent.keyName === 'ArduinoUno')
      ||
      (this.nodes[1].connectedTo.end &&
        this.nodes[1].connectedTo.end.parent.keyName === 'ArduinoUno')
    ) {
      window['showToast']('The Motor Draws more current then Arduino could supply');
    }
    this.elements.undrag();
    const ok = this.elements[1].attr();
    this.cx = (ok.width / 2) + ok.x;
    this.cy = (ok.height / 2) + ok.y;
    this.elements[1].attr({
      transform: '',
      x: ok.x + this.tx,
      y: ok.y + this.ty
    });
  }
  /** Function removes all  animations and callbacks  */
  closeSimulation(): void {
    this.elements[1].stop();
    const ok = this.elements[1].attr();
    this.elements[1].attr({
      transform: `t${this.tx},${this.ty}`,
      x: ok.x - this.tx,
      y: ok.y - this.ty
    });
    if (this.rpm) {
      this.rpm.remove();
      this.rpm = null;
    }
    this.setDragListeners();
  }
}

/**
 * MotorDriver L298N class
 */
export class L298N extends CircuitElement {
  pinNamedMap: any = {};
  speedA = 5;
  speedB = 5;
  prevValues: any = {
    IN1: -1,
    IN2: -1,
    IN3: -1,
    IN4: -1
  };
  /**
   * MotorDriver L298N constructor
   * @param canvas Raphael Canvas (Paper)
   * @param x  position x
   * @param y  position y
   */
  constructor(public canvas: any, x: number, y: number) {
    super('L298N', x, y, 'L298N.json', canvas);
  }
  init() {
    for (const node of this.nodes) {
      this.pinNamedMap[node.label] = node;
    }
    this.pinNamedMap['V IN'].addValueListener(v => {
      this.pinNamedMap['GND'].setValue(v, this.pinNamedMap['GND']);
      if (v >= 5) {
        this.pinNamedMap['5V IN'].setValue(5, this.pinNamedMap['5V IN']);
      }
      this.update();
    });

    this.pinNamedMap['IN1'].addValueListener(v => {
      if (v !== this.prevValues.IN1) {
        this.prevValues.IN1 = v;
        this.update();
      }
    });
    this.pinNamedMap['IN2'].addValueListener(v => {
      if (v !== this.prevValues.IN2) {
        this.prevValues.IN2 = v;
        this.update();
      }
    });
    this.pinNamedMap['IN3'].addValueListener(v => {
      if (v !== this.prevValues.IN3) {
        this.prevValues.IN3 = v;
        this.update();
      }
    });
    this.pinNamedMap['IN4'].addValueListener(v => {
      if (v !== this.prevValues.IN4) {
        this.prevValues.IN4 = v;
        this.update();
      }
    });
  }
  update() {
    setTimeout(() => {
      if (this.pinNamedMap['IN1'].value > 0 && this.pinNamedMap['IN2'].value > 0) {
        window['showToast']('Both IN1 and IN2 Pins are High!');
        return;
      }

      if (this.pinNamedMap['IN3'].value > 0 && this.pinNamedMap['IN4'].value > 0) {
        window['showToast']('Both IN3 and IN4 Pins are High!');
        return;
      }
    }, 100);

    if (this.pinNamedMap['IN1'].value > 0) {
      this.pinNamedMap['Terminal 2'].setValue(
        this.pinNamedMap['V IN'].value * (this.speedA / 5),
        this.pinNamedMap['Terminal 2']
      );
    } else if (this.pinNamedMap['IN2'].value > 0) {
      this.pinNamedMap['Terminal 1'].setValue(
        this.pinNamedMap['V IN'].value * (this.speedA / 5),
        this.pinNamedMap['Terminal 1']
      );
    } else {
      this.pinNamedMap['Terminal 1'].setValue(
        0,
        this.pinNamedMap['Terminal 1']
      );
    }

    if (this.pinNamedMap['IN3'].value > 0) {
      this.pinNamedMap['Terminal 4'].setValue(
        this.pinNamedMap['V IN'].value * (this.speedB / 5),
        this.pinNamedMap['Terminal 4']
      );
    } else if (this.pinNamedMap['IN4'].value > 0) {
      this.pinNamedMap['Terminal 3'].setValue(
        this.pinNamedMap['V IN'].value * (this.speedB / 5),
        this.pinNamedMap['Terminal 3']
      );
    } else {
      this.pinNamedMap['Terminal 3'].setValue(
        0,
        this.pinNamedMap['Terminal 3']
      );
    }
  }
  /**
   * Function provides component details
   * @param keyName Unique Class name
   * @param id Component id
   * @param body body of property box
   * @param title Component title
   */
  properties(): { keyName: string; id: number; body: HTMLElement; title: string; } {
    const body = document.createElement('div');
    body.innerText = 'If you Don\'t Connect The ENA and ENB Pins it automatically connects to the 5V suppy';
    return {
      keyName: this.keyName,
      id: this.id,
      body,
      title: 'Motor Driver (L298N)'
    };
  }
  private getArduino(node: Point) {
    if (
      node.connectedTo &&
      node.connectedTo.start &&
      node.connectedTo.start.parent.keyName === 'ArduinoUno'
    ) {
      return node.connectedTo.start;
    }
    if (
      node.connectedTo &&
      node.connectedTo.end &&
      node.connectedTo.end.parent.keyName === 'ArduinoUno'
    ) {
      return node.connectedTo.end;
    }
    return null;
  }
  initSimulation(): void {
    const arduinoEnd: any = this.getArduino(this.pinNamedMap['ENB']);
    if (arduinoEnd) {
      const arduino = arduinoEnd.parent;
      (arduino as ArduinoUno).addPWM(arduinoEnd, (v, p) => {
        this.speedA = v / 100;
        this.update();
      });
    }

    const arduinoEnd1: any = this.getArduino(this.pinNamedMap['ENA']);
    if (arduinoEnd1) {
      const arduino = arduinoEnd1.parent;
      (arduino as ArduinoUno).addPWM(arduinoEnd1, (v, p) => {
        this.speedB = v / 100;
        this.update();
      });
    }

  }
  closeSimulation(): void {
    this.pinNamedMap['IN1'].value = -1;
    this.pinNamedMap['IN2'].value = -1;
    this.pinNamedMap['IN3'].value = -1;
    this.pinNamedMap['IN4'].value = -1;
    this.speedA = 5;
    this.speedB = 5;
    this.prevValues = {
      IN1: -1,
      IN2: -1,
      IN3: -1,
      IN4: -1
    };
  }
}
/**
 * Servo Motor class
 */
export class ServoMotor extends CircuitElement {
  connected = true;
  arduino: CircuitElement = null;
  /**
   * MotorDriver L298N constructor
   * @param canvas Raphael Canvas (Paper)
   * @param x  position x
   * @param y  position y
   */
  constructor(public canvas: any, x: number, y: number) {
    super('ServoMotor', x, y, 'ServoMotor.json', canvas);
  }
  init() {
    this.nodes[1].addValueListener((v) => {
      if (v < 4 || v > 6) {
        window['showToast']('Low Voltage Applied');
      }
      this.nodes[0].setValue(v, this.nodes[1]);
    });
  }
  /** Animation caller during start simulation button pressed */
  animate(angle: number, duration: number = 10) {
    const anim = Raphael.animation({ transform: `r${angle}` }, duration);
    this.elements[1].animate(anim);
  }
  /**
   * Function provides component details
   * @param keyName Unique Class name
   * @param id Component id
   * @param body body of property box
   * @param title Component title
   */
  properties(): { keyName: string; id: number; body: HTMLElement; title: string; } {
    const body = document.createElement('div');
    return {
      keyName: this.keyName,
      id: this.id,
      body,
      title: 'Servo Motor'
    };
  }
  initSimulation(): void {
    if (!(
      this.nodes[0].connectedTo &&
      this.nodes[1].connectedTo &&
      this.nodes[2].connectedTo
    )
    ) {
      window['showToast']('Please Connect Servo Properly!');
      this.connected = false;
      return;
    }
    let connectedPin = null;
    if (this.nodes[2].connectedTo.start
      && this.nodes[2].connectedTo.start.parent.keyName === 'ArduinoUno') {
      this.arduino = this.nodes[2].connectedTo.start.parent;
      connectedPin = this.nodes[2].connectedTo.start;
    }

    if (this.arduino === null &&
      this.nodes[2].connectedTo.end &&
      this.nodes[2].connectedTo.end.parent.keyName === 'ArduinoUno'
    ) {
      connectedPin = this.nodes[2].connectedTo.end;
      this.arduino = this.nodes[2].connectedTo.end.parent;
    } else {
      window['showToast']('Arduino Not Found!');
      this.connected = false;
      return;
    }

    this.connected = true;
    this.elements.undrag();
    const ok = this.elements[1].attr();
    this.elements[1].attr({
      transform: '',
      x: ok.x + this.tx,
      y: ok.y + this.ty
    });

    (this.arduino as ArduinoUno).addServo(connectedPin, (angle, prev) => {
      if (angle > 182) {
        return;
      }
      const duration = Math.abs(angle - (prev > 0 ? prev : 0)) * 5;
      this.animate(angle, duration);
    });
  }
  closeSimulation(): void {
    if (!this.connected) {
      return;
    }
    this.arduino = null;
    this.elements[1].stop();
    const ok = this.elements[1].attr();
    this.elements[1].attr({
      transform: `t${this.tx},${this.ty}`,
      x: ok.x - this.tx,
      y: ok.y - this.ty
    });
    this.setDragListeners();
  }
}
