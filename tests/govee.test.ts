import axios from 'axios';
import { CMD_BRIGHTNESS, CMD_COLOR, CMD_COLOR_TEMP, CMD_TURN } from '../src/constants';
import Govee from '../src/govee';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Govee', () => {
  const KEY = 'testKey';
  const govee: Govee = new Govee(KEY);

  beforeEach(() => {
    mockedAxios.put.mockReset();
  });

  it('gets all devices', async () => {
    mockedAxios.get.mockReturnValueOnce(
      Promise.resolve({
        data: {
          data: {
            devices: [
              {
                deviceName: 'test1',
                model: 'testModel',
                device: 'testMac',
                controllable: true,
                retrievable: true,
                supportCmds: ['TURN'],
              },
              {
                deviceName: 'test2',
                model: 'testModel2',
                device: 'testMac2',
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

    const result = await govee.getDevices();
    expect(mockedAxios.get).toHaveBeenCalledWith('https://developer-api.govee.com/v1/devices', {
      headers: {
        'Govee-API-Key': KEY,
      },
    });
    expect(result.length).toBe(2);
    expect(result[0].name).toBe('test1');
  });

  it('gets all device names', async () => {
    const names = await govee.getDeviceNames();
    expect(names.length).toBe(2);
    expect(names[0]).toBe('test1');
    expect(names[1]).toBe('test2');
  });

  it('gets a control group of all devices', async () => {
    const result = await govee.getAllControlGroup();
    expect(result.devices.length).toBe(2);
    expect(result.devices[0].name).toBe('test1');
    expect(result.devices[1].name).toBe('test2');
  });

  it('gets a control group of all devices', async () => {
    const result = await govee.getAllControlGroup();
    expect(result.devices.length).toBe(2);
    expect(result.devices[0].name).toBe('test1');
    expect(result.devices[1].name).toBe('test2');
  });

  it('gets a control group of specified devices', async () => {
    const result = await govee.getControlGroup(['test1', 'test2']);
    expect(result.devices.length).toBe(2);
    expect(result.devices[0].name).toBe('test1');
    expect(result.devices[1].name).toBe('test2');

    const notValid = await govee.getControlGroup(['does not exist']);
    expect(notValid.devices.length).toBe(0);
  });

  it('gets a specific device', () => {
    const device = govee.getDevice('test1');
    expect(device).toBeDefined();
    expect(govee.getDevice('noDevice')).toBeUndefined();
  });

  it('gets device state', async () => {
    mockedAxios.get.mockReturnValueOnce(
      Promise.resolve({
        data: {
          data: {
            device: 'testMac',
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

    const result = await govee.getState('testMac', 'testModel');
    expect(result.code).toBe(200);
    expect(result.message).toBe('testMessage');
    expect(result.data.device).toBe('testMac');
    expect(result.data.model).toBe('testModel');
    expect(result.data.name).toBe('test1');
    expect(result.data.properties[0].brightness).toBe(82);
    expect(result.data.properties[0].online).toBe(true);
    expect(result.data.properties[0].powerState).toBe('off');
    expect(result.data.properties[0].color).toEqual({ r: 50, b: 50, g: 50 });

    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://developer-api.govee.com/v1/devices/state',
      {
        params: {
          device: 'testMac',
          model: 'testModel',
        },
        headers: {
          'Content-Type': 'application/json',
          'Govee-API-Key': KEY,
        },
      },
    );
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
    const result = await govee.setColor('testDevice', 'testModel', {
      r: 255,
      g: 94,
      b: 94,
    });
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
