import axios from 'axios';
import { BASE_PATH, CMD_BRIGHTNESS, CMD_COLOR, CMD_COLOR_TEMP, CMD_TURN } from './constants';

interface GoveeResponse<T> {
  code: number;
  message: string;
  data: T;
}

interface Device {
  model: string;
  device: string;
  controllable: boolean;
  retrievable: boolean;
  supportCmds: string[];
}

interface GoveeColor {
  r: number;
  g: number;
  b: number;
}

export default class Govee {
  private apiKey: string;
  private static instance: Govee;

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

  public async getDevices(): Promise<GoveeResponse<Device[]>> {
    const result = await axios.get(BASE_PATH + '/devices', {
      headers: {
        'Govee-API-Key': this.apiKey,
      },
    });
    return {
      data: result.data.data.devices,
      message: result.data.message,
      code: result.data.code,
    };
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
    color: string,
  ): Promise<GoveeResponse<Record<string, never>>> {
    const result = await axios.put(
      BASE_PATH + '/devices/control',
      {
        device: device,
        model: model,
        cmd: {
          name: CMD_COLOR,
          value: this.hexToRgb(color),
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
