import { GoveeDevice } from './device';
import Govee, { GoveeColor } from './govee';

export class GoveeDeviceCollection {
  readonly devices: GoveeDevice[];
  govee: Govee;

  public constructor(devices: GoveeDevice[], govee: Govee) {
    this.devices = devices;
    this.govee = govee;
  }

  public async turnOn(): Promise<boolean> {
    const requests: Promise<boolean>[] = this.devices.map((device: GoveeDevice) => device.turnOn());
    const results: boolean[] = await Promise.all(requests);
    // Return true if all the responses were good.
    return results.every((res) => res === true);
  }

  public async turnOff(): Promise<boolean> {
    const requests: Promise<boolean>[] = this.devices.map((device: GoveeDevice) =>
      device.turnOff(),
    );
    const results: boolean[] = await Promise.all(requests);
    // Return true if all the responses were good.
    return results.every((res) => res === true);
  }

  public async setBrightness(brightness: number): Promise<boolean> {
    const requests: Promise<boolean>[] = this.devices.map((device: GoveeDevice) =>
      device.setBrightness(brightness),
    );
    const results: boolean[] = await Promise.all(requests);
    // Return true if all the responses were good.
    return results.every((res) => res === true);
  }

  public async setRGBColor(color: GoveeColor): Promise<boolean> {
    const requests: Promise<boolean>[] = this.devices.map((device: GoveeDevice) =>
      device.setRGBColor(color),
    );
    const results: boolean[] = await Promise.all(requests);
    // Return true if all the responses were good.
    return results.every((res) => res === true);
  }

  public async setHexColor(hex: string): Promise<boolean> {
    const requests: Promise<boolean>[] = this.devices.map((device: GoveeDevice) =>
      device.setHexColor(hex),
    );
    const results: boolean[] = await Promise.all(requests);
    // Return true if all the responses were good.
    return results.every((res) => res === true);
  }

  public async setColorTemperature(temp: number): Promise<boolean> {
    const requests: Promise<boolean>[] = this.devices.map((device: GoveeDevice) =>
      device.setColorTemperature(temp),
    );
    const results: boolean[] = await Promise.all(requests);
    // Return true if all the responses were good.
    return results.every((res) => res === true);
  }
}
