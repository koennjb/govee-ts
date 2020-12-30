import axios from 'axios';
import { CMD_BRIGHTNESS, CMD_COLOR, CMD_COLOR_TEMP, CMD_TURN } from '../constants';
import Govee from '../govee';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Govee', () => {
  const KEY = 'testKey';
  let govee: any;

  beforeEach(() => {
    mockedAxios.put.mockReset();
  });

  it('throws error when instance has not been created', () => {
    expect(Govee.getInstance).toThrow(
      'Error: no Govee instance has been instantiated. Please create a new one first.',
    );
    govee = new Govee(KEY);
  });

  it('returns the existing intance', () => {
    expect(Govee.getInstance()).toBeDefined();
  });

  it('throws an error when an instance has already been created', () => {
    expect(() => {
      new Govee(KEY);
    }).toThrow(
      'Error instantiating class Govee, an instance has already been created. Use Govee.getInstance() instead.',
    );
  });

  it('gets all devices', async () => {
    mockedAxios.get.mockReturnValueOnce(
      Promise.resolve({
        data: {
          data: {
            devices: ['test'],
          },
          message: 'testMessage',
          code: 200,
        },
      }),
    );
    const result = await govee.getDevices();
    expect(mockedAxios.get).toHaveBeenCalledWith('https://developer-api.govee.com/v1/devices', {
      headers: {
        'Govee-API-Key': KEY,
      },
    });
  });

  it('sets the power', async () => {
    mockedAxios.put.mockReturnValueOnce(
      Promise.resolve({
        data: {
          data: {},
          message: 'testMessage',
          code: 200,
        },
      }),
    );
    let result = await govee.setPower('testDevice', 'testModel', false);
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
    expect(result.code).toBe(200);
    expect(result.message).toBe('testMessage');

    mockedAxios.put.mockReturnValueOnce(
      Promise.resolve({
        data: {
          data: {},
          message: 'testMessage',
          code: 200,
        },
      }),
    );
    result = await govee.setPower('testDevice', 'testModel', true);
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
    expect(result.code).toBe(200);
    expect(result.message).toBe('testMessage');
  });

  it('sets the brightness', async () => {
    mockedAxios.put.mockReturnValueOnce(
      Promise.resolve({
        data: {
          data: {},
          message: 'testMessage',
          code: 200,
        },
      }),
    );
    const result = await govee.setBrightness('testDevice', 'testModel', 50);
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
    expect(result.code).toBe(200);
    expect(result.message).toBe('testMessage');
  });

  it('sets the color', async () => {
    mockedAxios.put.mockReturnValueOnce(
      Promise.resolve({
        data: {
          data: {},
          message: 'testMessage',
          code: 200,
        },
      }),
    );
    const result = await govee.setColor('testDevice', 'testModel', '#ff5e5e');
    expect(mockedAxios.put).toHaveBeenCalledWith(
      'https://developer-api.govee.com/v1/devices/control',
      {
        device: 'testDevice',
        model: 'testModel',
        cmd: {
          name: CMD_COLOR,
          value: {
            r: 255,
            g: 94,
            b: 94,
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
    expect(result.code).toBe(200);
    expect(result.message).toBe('testMessage');
  });

  it('sets the default color to white with malformed hex code', async () => {
    mockedAxios.put.mockReturnValueOnce(
      Promise.resolve({
        data: {
          data: {},
          message: 'testMessage',
          code: 200,
        },
      }),
    );
    // ! Color code is too long.
    const result = await govee.setColor('testDevice', 'testModel', 'ff5e5ea');
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
    expect(result.code).toBe(200);
    expect(result.message).toBe('testMessage');
  });

  it('sets the color temperature', async () => {
    mockedAxios.put.mockReturnValueOnce(
      Promise.resolve({
        data: {
          data: {},
          message: 'testMessage',
          code: 200,
        },
      }),
    );

    const result = await govee.setTemperature('testDevice', 'testModel', 7000);
    expect(mockedAxios.put).toHaveBeenCalledWith(
      'https://developer-api.govee.com/v1/devices/control',
      {
        device: 'testDevice',
        model: 'testModel',
        cmd: {
          name: CMD_COLOR_TEMP,
          value: 7000,
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Govee-API-Key': KEY,
        },
      },
    );
    expect(result.code).toBe(200);
    expect(result.message).toBe('testMessage');
  });
});
