import axios from 'axios';
import { BASE_PATH } from './constants';

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
          name: 'turn',
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
}
