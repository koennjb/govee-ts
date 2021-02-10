import axios from 'axios';
import { BASE_PATH, CMD_BRIGHTNESS, CMD_COLOR, CMD_COLOR_TEMP, CMD_TURN } from './constants';
import { GoveeDevice } from './device';
import { GoveeControlGroup } from './control-group';

interface GoveeResponse<T> {
  code: number;
  message: string;
  data: T;
}
export interface DeviceI {
  deviceName: string;
  model: string;
  device: string;
  controllable: boolean;
  retrievable: boolean;
  supportCmds: string[];
}

export interface DeviceState {
  model: string;
  device: string;
  name: string;
  properties: {
    online: boolean;
    powerState: 'off' | 'on';
    brightness: number;
    color?: GoveeColor;
    colorTem?: number;
  }[];
}

export interface GoveeColor {
  r: number;
  g: number;
  b: number;
}

export default class Govee {
  private apiKey: string;
  private devices: Map<string, GoveeDevice> = new Map();

  public constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Retrieve all devices from the Govee API
   */
  private async retrieveDevices(): Promise<GoveeResponse<GoveeDevice[]>> {
    const result = await axios.get(BASE_PATH + '/devices', {
      headers: {
        'Govee-API-Key': this.apiKey,
      },
    });

    return {
      data: result.data.data.devices.map(
        (device: DeviceI) =>
          new GoveeDevice(
            device.deviceName,
            device.model,
            device.device,
            device.supportCmds,
            device.controllable,
            device.retrievable,
            this,
          ),
      ),
      message: result.data.message,
      code: result.data.code,
    };
  }

  /**
   * If devices have already been retrieved, return the cached list. Otherwise,
   * fetch the complete list of devices from the Govee API and return them.
   */
  public async getDevices(): Promise<GoveeDevice[]> {
    if (this.devices.size <= 0) {
      const deviceList = await this.retrieveDevices();
      deviceList.data.forEach((device) => {
        this.devices.set(device.name, device);
      });
    }
    return Array.from(this.devices.values());
  }

  /**
   * Get a DeviceControlGroup for all devices
   */
  public async getAllControlGroup(): Promise<GoveeControlGroup> {
    const devices: GoveeDevice[] = await this.getDevices();
    const controlGroup: GoveeControlGroup = new GoveeControlGroup(devices);
    return controlGroup;
  }

  /**
   * Given a list of device names as a string, return a GoveeControlGroup containing
   * devices that match the names given. The names are case sensitive.
   */
  public async getControlGroup(deviceNames: string[]): Promise<GoveeControlGroup> {
    const devices: GoveeDevice[] = (await this.getDevices()).filter((device: GoveeDevice) => {
      return deviceNames.some((desiredName: string) => device.name === desiredName);
    });
    const controlGroup: GoveeControlGroup = new GoveeControlGroup(devices);
    return controlGroup;
  }

  /**
   * Return an array of all device names
   */
  public async getDeviceNames(): Promise<string[]> {
    return (await this.getDevices()).map((device: GoveeDevice) => {
      return device.name;
    });
  }

  /**
   * Get a device from the map of cached devices. Name is case sensitive.
   * @param name The device name to get
   */
  public getDevice(name: string): GoveeDevice | undefined {
    return this.devices.get(name);
  }

  /**
   * Gets the state for a specific device from the Govee API
   * @param device The device name to get state for
   * @param model The device model name
   */
  public async getState(device: string, model: string): Promise<GoveeResponse<DeviceState>> {
    const result = await axios.get(BASE_PATH + '/devices/state', {
      params: {
        device: device,
        model: model,
      },
      headers: {
        'Content-Type': 'application/json',
        'Govee-API-Key': this.apiKey,
      },
    });

    return {
      data: result.data.data,
      message: result.data.message,
      code: result.data.code,
    };
  }

  /**
   * Uses the Govee API to turn on or off a specific device
   * @param device The device name to set power for
   * @param model The model to set power for
   * @param power True for on, false for off
   */
  public async setPower(
    device: string,
    model: string,
    power: boolean,
  ): Promise<GoveeResponse<Record<string, never>>> {
    const result = await axios.put(
      BASE_PATH + '/devices/control',
      {
        device: device,
        model: model,
        cmd: {
          name: CMD_TURN,
          value: power ? 'on' : 'off',
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Govee-API-Key': this.apiKey,
        },
      },
    );

    return {
      data: result.data.data,
      message: result.data.message,
      code: result.data.code,
    };
  }

  /**
   * Uses the Govee API to set the brightness for a specific device
   * @param device The device name
   * @param model The device model
   * @param brightness The brightness (0-100)
   */
  public async setBrightness(
    device: string,
    model: string,
    brightness: number,
  ): Promise<GoveeResponse<Record<string, never>>> {
    const result = await axios.put(
      BASE_PATH + '/devices/control',
      {
        device: device,
        model: model,
        cmd: {
          name: CMD_BRIGHTNESS,
          value: brightness,
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Govee-API-Key': this.apiKey,
        },
      },
    );

    return {
      data: result.data.data,
      message: result.data.message,
      code: result.data.code,
    };
  }

  /**
   * Uses the Govee API to set the color of a device
   * @param device The device name
   * @param model The device model
   * @param color The RGB color to set
   */
  public async setColor(
    device: string,
    model: string,
    color: GoveeColor,
  ): Promise<GoveeResponse<Record<string, never>>> {
    const result = await axios.put(
      BASE_PATH + '/devices/control',
      {
        device: device,
        model: model,
        cmd: {
          name: CMD_COLOR,
          value: color,
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Govee-API-Key': this.apiKey,
        },
      },
    );

    return {
      data: result.data.data,
      message: result.data.message,
      code: result.data.code,
    };
  }

  /**
   * Sets the color temperature for a specific device
   * @param device The device name
   * @param model The device model
   * @param colorTem The kelvin color temperature to set
   */
  public async setTemperature(
    device: string,
    model: string,
    colorTem: number,
  ): Promise<GoveeResponse<Record<string, never>>> {
    const result = await axios.put(
      BASE_PATH + '/devices/control',
      {
        device: device,
        model: model,
        cmd: {
          name: CMD_COLOR_TEMP,
          value: colorTem,
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Govee-API-Key': this.apiKey,
        },
      },
    );

    return {
      data: result.data.data,
      message: result.data.message,
      code: result.data.code,
    };
  }
}
