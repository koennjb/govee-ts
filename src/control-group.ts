import { GoveeDevice } from './device';
import { GoveeColor } from './govee';
/**
 * GoveeControlGroup lets you control multiple lights at once. It is similar to GoveeDevice, you use GoveeControlGroup.<action>
 * to apply an action to all devices in the group.
 */
export class GoveeControlGroup {
  readonly devices: GoveeDevice[];

  /**
   * Creates a new GoveeControlGroup
   * @param devices the list of devices to control
   */
  public constructor(devices: GoveeDevice[]) {
    this.devices = devices;
  }

  /**
   * Turns on all lights in the group
   */
  public async turnOn(): Promise<boolean> {
    const requests: Promise<boolean>[] = this.devices.map((device: GoveeDevice) => device.turnOn());
    const results: boolean[] = await Promise.all(requests);
    // Return true if all the responses were good.
    return results.every((res) => res === true);
  }

  /**
   * Turns off all lights in the group
   */
  public async turnOff(): Promise<boolean> {
    const requests: Promise<boolean>[] = this.devices.map((device: GoveeDevice) =>
      device.turnOff(),
    );
    const results: boolean[] = await Promise.all(requests);
    // Return true if all the responses were good.
    return results.every((res) => res === true);
  }

  /**
   * Sets the brightness for all lights in the group
   * @param brightness The brightness to set to (0-100)
   */
  public async setBrightness(brightness: number): Promise<boolean> {
    const requests: Promise<boolean>[] = this.devices.map((device: GoveeDevice) =>
      device.setBrightness(brightness),
    );
    const results: boolean[] = await Promise.all(requests);
    // Return true if all the responses were good.
    return results.every((res) => res === true);
  }

  /**
   * Sets the color of all lights in the group to a RGB color
   * @param color The RGB color object to set
   */
  public async setRGBColor(color: GoveeColor): Promise<boolean> {
    const requests: Promise<boolean>[] = this.devices.map((device: GoveeDevice) =>
      device.setRGBColor(color),
    );
    const results: boolean[] = await Promise.all(requests);
    // Return true if all the responses were good.
    return results.every((res) => res === true);
  }

  /**
   * Sets the color of all lights in the group to a hex code
   * @param hex The hex code to set
   */
  public async setHexColor(hex: string): Promise<boolean> {
    const requests: Promise<boolean>[] = this.devices.map((device: GoveeDevice) =>
      device.setHexColor(hex),
    );
    const results: boolean[] = await Promise.all(requests);
    // Return true if all the responses were good.
    return results.every((res) => res === true);
  }

  /**
   * Sets the color temperature for all lights in the group
   * @param temp the temperature in kelvin to set to
   */
  public async setColorTemperature(temp: number): Promise<boolean> {
    const requests: Promise<boolean>[] = this.devices.map((device: GoveeDevice) =>
      device.setColorTemperature(temp),
    );
    const results: boolean[] = await Promise.all(requests);
    // Return true if all the responses were good.
    return results.every((res) => res === true);
  }
}
