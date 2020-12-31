import axios from 'axios';
import Govee from '..';
import { CMD_BRIGHTNESS, CMD_COLOR, CMD_TURN } from '../constants';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('GoveeDevice', () => {
  const KEY = 'testKey';
  const govee: Govee = new Govee(KEY);

  beforeAll(async () => {
    mockedAxios.get.mockReturnValueOnce(
      Promise.resolve({
        data: {
          data: {
            devices: [
              {
                deviceName: 'test1',
                model: 'testModel',
                device: 'testDevice',
                controllable: true,
                retrievable: true,
                supportCmds: ['TURN'],
              },
            ],
          },
          message: 'testMessage',
          code: 200,
        },
      }),
    );

    govee.getDevices();
  });

  beforeEach(() => {
    mockedAxios.put.mockReset();
  });

  it('gets state', async () => {
    mockedAxios.get.mockReturnValueOnce(
      Promise.resolve({
        data: {
          data: {
            device: 'testDevice',
            model: 'testModel',
            name: 'test1',
            properties: [
              {
                online: true,
                powerState: 'off',
                brightness: 82,
                color: {
                  r: 50,
                  g: 50,
                  b: 50,
                },
              },
            ],
          },
          message: 'testMessage',
          code: 200,
        },
      }),
    );

    const device = govee.getDevice('test1');
    const result = await device?.getState();
    expect(result).toBeDefined();
    expect(result?.device).toBe('testDevice');
    expect(result?.model).toBe('testModel');
    expect(result?.name).toBe('test1');
    expect(result?.properties[0].brightness).toBe(82);
    expect(result?.properties[0].online).toBe(true);
    expect(result?.properties[0].powerState).toBe('off');
    expect(result?.properties[0].color).toEqual({ r: 50, b: 50, g: 50 });

    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://developer-api.govee.com/v1/devices/state',
      {
        params: {
          device: 'testDevice',
          model: 'testModel',
        },
        headers: {
          'Content-Type': 'application/json',
          'Govee-API-Key': KEY,
        },
      },
    );
  });

  it('gets state with failure', async () => {
    mockedAxios.get.mockReturnValueOnce(
      Promise.resolve({
        data: {
          data: {
            device: 'testDevice',
            model: 'testModel',
            name: 'test1',
            properties: [
              {
                online: true,
                powerState: 'off',
                brightness: 82,
                color: {
                  r: 50,
                  g: 50,
                  b: 50,
                },
              },
            ],
          },
          message: 'testMessage',
          code: 401, // Error code
        },
      }),
    );

    const device = govee.getDevice('test1');
    const result = await device?.getState();
    expect(result).toBeFalsy();

    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://developer-api.govee.com/v1/devices/state',
      {
        params: {
          device: 'testDevice',
          model: 'testModel',
        },
        headers: {
          'Content-Type': 'application/json',
          'Govee-API-Key': KEY,
        },
      },
    );
  });

  it('turns on', async () => {
    mockedAxios.put.mockReturnValueOnce(
      Promise.resolve({
        data: {
          data: {},
          message: 'testMessage',
          code: 200,
        },
      }),
    );

    const device = govee.getDevice('test1');
    const result = await device?.turnOn();
    expect(result).toBeTruthy();
    expect(mockedAxios.put).toHaveBeenCalledWith(
      'https://developer-api.govee.com/v1/devices/control',
      {
        device: 'testDevice',
        model: 'testModel',
        cmd: {
          name: CMD_TURN,
          value: 'on',
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Govee-API-Key': KEY,
        },
      },
    );
  });

  it('turn on returns false', async () => {
    mockedAxios.put.mockReturnValueOnce(
      Promise.resolve({
        data: {
          data: {},
          message: 'testMessage',
          code: 401, // Error code
        },
      }),
    );

    const device = govee.getDevice('test1');
    const result = await device?.turnOn();
    expect(result).toBeFalsy();
    expect(mockedAxios.put).toHaveBeenCalledWith(
      'https://developer-api.govee.com/v1/devices/control',
      {
        device: 'testDevice',
        model: 'testModel',
        cmd: {
          name: CMD_TURN,
          value: 'on',
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Govee-API-Key': KEY,
        },
      },
    );
  });

  it('turns off', async () => {
    mockedAxios.put.mockReturnValueOnce(
      Promise.resolve({
        data: {
          data: {},
          message: 'testMessage',
          code: 200,
        },
      }),
    );

    const device = govee.getDevice('test1');
    const result = await device?.turnOff();
    expect(result).toBeTruthy();
    expect(mockedAxios.put).toHaveBeenCalledWith(
      'https://developer-api.govee.com/v1/devices/control',
      {
        device: 'testDevice',
        model: 'testModel',
        cmd: {
          name: CMD_TURN,
          value: 'off',
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Govee-API-Key': KEY,
        },
      },
    );
  });

  it('turn off returns false', async () => {
    mockedAxios.put.mockReturnValueOnce(
      Promise.resolve({
        data: {
          data: {},
          message: 'testMessage',
          code: 401, // Error code
        },
      }),
    );

    const device = govee.getDevice('test1');
    const result = await device?.turnOff();
    expect(result).toBeFalsy();
    expect(mockedAxios.put).toHaveBeenCalledWith(
      'https://developer-api.govee.com/v1/devices/control',
      {
        device: 'testDevice',
        model: 'testModel',
        cmd: {
          name: CMD_TURN,
          value: 'off',
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Govee-API-Key': KEY,
        },
      },
    );
  });

  it('sets brightness', async () => {
    mockedAxios.put.mockReturnValueOnce(
      Promise.resolve({
        data: {
          data: {},
          message: 'testMessage',
          code: 200,
        },
      }),
    );

    const device = govee.getDevice('test1');
    const result = await device?.setBrightness(50);
    expect(result).toBeTruthy();
    expect(mockedAxios.put).toHaveBeenCalledWith(
      'https://developer-api.govee.com/v1/devices/control',
      {
        device: 'testDevice',
        model: 'testModel',
        cmd: {
          name: CMD_BRIGHTNESS,
          value: 50,
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Govee-API-Key': KEY,
        },
      },
    );
  });

  it('sets brightness and returns false', async () => {
    mockedAxios.put.mockReturnValueOnce(
      Promise.resolve({
        data: {
          data: {},
          message: 'testMessage',
          code: 401, // Error code
        },
      }),
    );

    const device = govee.getDevice('test1');
    const result = await device?.setBrightness(50);
    expect(result).toBeFalsy();
    expect(mockedAxios.put).toHaveBeenCalledWith(
      'https://developer-api.govee.com/v1/devices/control',
      {
        device: 'testDevice',
        model: 'testModel',
        cmd: {
          name: CMD_BRIGHTNESS,
          value: 50,
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Govee-API-Key': KEY,
        },
      },
    );
  });

  it('sets hex color', async () => {
    mockedAxios.put.mockReturnValueOnce(
      Promise.resolve({
        data: {
          data: {},
          message: 'testMessage',
          code: 200,
        },
      }),
    );

    const device = govee.getDevice('test1');
    const result = await device?.setHexColor('#f48686');
    expect(result).toBeTruthy();
    expect(mockedAxios.put).toHaveBeenCalledWith(
      'https://developer-api.govee.com/v1/devices/control',
      {
        device: 'testDevice',
        model: 'testModel',
        cmd: {
          name: CMD_COLOR,
          value: {
            r: 244,
            g: 134,
            b: 134,
          },
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Govee-API-Key': KEY,
        },
      },
    );
  });

  it('sets hex color and returns false', async () => {
    mockedAxios.put.mockReturnValueOnce(
      Promise.resolve({
        data: {
          data: {},
          message: 'testMessage',
          code: 401, // Error code
        },
      }),
    );

    const device = govee.getDevice('test1');
    const result = await device?.setHexColor('#f48686');
    expect(result).toBeFalsy();
    expect(mockedAxios.put).toHaveBeenCalledWith(
      'https://developer-api.govee.com/v1/devices/control',
      {
        device: 'testDevice',
        model: 'testModel',
        cmd: {
          name: CMD_COLOR,
          value: {
            r: 244,
            g: 134,
            b: 134,
          },
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Govee-API-Key': KEY,
        },
      },
    );
  });

  it('uses white as default color with invalid hex code', async () => {
    mockedAxios.put.mockReturnValueOnce(
      Promise.resolve({
        data: {
          data: {},
          message: 'testMessage',
          code: 200,
        },
      }),
    );

    const device = govee.getDevice('test1');
    const result = await device?.setHexColor('#ffff'); // Too short
    expect(result).toBeTruthy();
    expect(mockedAxios.put).toHaveBeenCalledWith(
      'https://developer-api.govee.com/v1/devices/control',
      {
        device: 'testDevice',
        model: 'testModel',
        cmd: {
          name: CMD_COLOR,
          value: {
            r: 255,
            g: 255,
            b: 255,
          },
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Govee-API-Key': KEY,
        },
      },
    );
  });

  it('sets RGB color', async () => {
    mockedAxios.put.mockReturnValueOnce(
      Promise.resolve({
        data: {
          data: {},
          message: 'testMessage',
          code: 200,
        },
      }),
    );

    const device = govee.getDevice('test1');
    const result = await device?.setRGBColor({ r: 50, b: 50, g: 50 });
    expect(result).toBeTruthy();
    expect(mockedAxios.put).toHaveBeenCalledWith(
      'https://developer-api.govee.com/v1/devices/control',
      {
        device: 'testDevice',
        model: 'testModel',
        cmd: {
          name: CMD_COLOR,
          value: { r: 50, b: 50, g: 50 },
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Govee-API-Key': KEY,
        },
      },
    );
  });

  it('sets RGB color and returns false', async () => {
    mockedAxios.put.mockReturnValueOnce(
      Promise.resolve({
        data: {
          data: {},
          message: 'testMessage',
          code: 401, // Error code
        },
      }),
    );

    const device = govee.getDevice('test1');
    const result = await device?.setRGBColor({ r: 50, b: 50, g: 50 });
    expect(result).toBeFalsy();
    expect(mockedAxios.put).toHaveBeenCalledWith(
      'https://developer-api.govee.com/v1/devices/control',
      {
        device: 'testDevice',
        model: 'testModel',
        cmd: {
          name: CMD_COLOR,
          value: { r: 50, b: 50, g: 50 },
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Govee-API-Key': KEY,
        },
      },
    );
  });
});
