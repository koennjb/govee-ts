import Govee, { GoveeColor } from './govee';

export class GoveeDevice {
  name: string;
  model: string;
  device: string;
  supportCmds: string[];
  controllable: boolean;
  retrievable: boolean;

  public constructor(
    name: string,
    model: string,
    device: string,
    supportCmds: string[],
    controllable: boolean,
    retrievable: boolean,
  ) {
    this.name = name;
    this.model = model;
    this.device = device;
    this.supportCmds = supportCmds;
    this.controllable = controllable;
    this.retrievable = retrievable;
  }

  public async turnOn(): Promise<boolean> {
    const result = await Govee.getInstance().setPower(this.device, this.model, true);
    if (result.code == 200) {
      return true;
    } else {
      return false;
    }
  }

  public async turnOff(): Promise<boolean> {
    const result = await Govee.getInstance().setPower(this.device, this.model, false);
    if (result.code == 200) {
      return true;
    } else {
      return false;
    }
  }

  public async setBrightness(brightness: number): Promise<boolean> {
    const result = await Govee.getInstance().setBrightness(this.device, this.model, brightness);
    if (result.code == 200) {
      return true;
    } else {
      return false;
    }
  }

  public async setRGBColor(color: GoveeColor): Promise<boolean> {
    const result = await Govee.getInstance().setColor(this.device, this.model, color);
    if (result.code == 200) {
      return true;
    } else {
      return false;
    }
  }

  public async setHexColor(hex: string): Promise<boolean> {
    const result = await Govee.getInstance().setColor(this.device, this.model, this.hexToRgb(hex));
    if (result.code == 200) {
      return true;
    } else {
      return false;
    }
  }

  private hexToRgb(color: string): GoveeColor {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 255, g: 255, b: 255 };
  }
}
