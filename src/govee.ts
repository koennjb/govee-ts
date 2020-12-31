import axios from 'axios';
import { BASE_PATH, CMD_BRIGHTNESS, CMD_COLOR, CMD_COLOR_TEMP, CMD_TURN } from './constants';
import { GoveeDevice } from './device';

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
export interface GoveeColor {
  r: number;
  g: number;
  b: number;
}

export default class Govee {
  private apiKey: string;
  private static instance: Govee;
  private devices: Map<string, GoveeDevice> = new Map();

  /**
   * Creates a new Govee client given the API key. If one has already been instantiated, this will fail.
   */
  public constructor(apiKey: string) {
    if (Govee.instance) {
      throw new Error(
        'Error instantiating class Govee, an instance has already been created. Use Govee.getInstance() instead.',
      );
    }
    this.apiKey = apiKey;
    Govee.instance = this;
  }

  /**
   * Gets the singleton instance of the Govee client. If no client has been instantiated yet, this will fail.
   */
  public static getInstance(): Govee {
    if (!Govee.instance) {
      throw new Error(
        'Error: no Govee instance has been instantiated. Please create a new one first.',
      );
    }
    return Govee.instance;
  }

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
          ),
      ),
      message: result.data.message,
      code: result.data.code,
    };
  }

  public async getDevices(): Promise<GoveeDevice[]> {
    if (this.devices.size <= 0) {
      const deviceList = await this.retrieveDevices();
      deviceList.data.forEach((device) => {
        this.devices.set(device.name, device);
      });
    }
    return Array.from(this.devices.values());
  }

  public getDevice(name: string): GoveeDevice | undefined {
    return this.devices.get(name);
  }

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
