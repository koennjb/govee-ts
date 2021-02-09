import { CMD_BRIGHTNESS, CMD_COLOR, CMD_COLOR_TEMP, CMD_TURN } from '../src/constants';
import { GoveeDevice } from '../src/device';
import { GoveeControlGroup } from '../src/control-group';
import Govee from '../src/govee';

jest.mock('../src/device');

describe('GoveeControlGroup', () => {
  const govee = new Govee('API_KEY');
  const device1: jest.Mocked<GoveeDevice> = new GoveeDevice(
    'device1',
    'model1',
    'mac1',
    [CMD_BRIGHTNESS, CMD_COLOR, CMD_COLOR_TEMP, CMD_TURN],
    true,
    true,
    govee,
  ) as any;
  const device2: jest.Mocked<GoveeDevice> = new GoveeDevice(
    'device2',
    'model2',
    'mac2',
    [CMD_BRIGHTNESS, CMD_COLOR, CMD_COLOR_TEMP, CMD_TURN],
    true,
    true,
    govee,
  ) as any;
  const devices: jest.Mocked<GoveeDevice>[] = [device1, device2];
  beforeEach(() => {
    devices.forEach((device) => {
      device.turnOn.mockClear();
      device.turnOn.mockReturnValue(Promise.resolve(true));

      device.turnOff.mockClear();
      device.turnOff.mockReturnValue(Promise.resolve(true));

      device.setRGBColor.mockClear();
      device.setRGBColor.mockReturnValue(Promise.resolve(true));

      device.setHexColor.mockClear();
      device.setHexColor.mockReturnValue(Promise.resolve(true));

      device.setColorTemperature.mockClear();
      device.setColorTemperature.mockReturnValue(Promise.resolve(true));

      device.setBrightness.mockClear();
      device.setBrightness.mockReturnValue(Promise.resolve(true));
    });
  });

  it('they turn on', async () => {
    const group = new GoveeControlGroup(devices);
    const result = await group.turnOn();
    expect(result).toBeTruthy();
    expect(device1.turnOn).toHaveBeenCalledTimes(1);
    expect(device2.turnOn).toHaveBeenCalledTimes(1);
  });

  it('they turn off', async () => {
    const group = new GoveeControlGroup(devices);
    const result = await group.turnOff();
    expect(result).toBeTruthy();
    expect(device1.turnOff).toHaveBeenCalledTimes(1);
    expect(device2.turnOff).toHaveBeenCalledTimes(1);
  });

  it('they set brightness', async () => {
    const group = new GoveeControlGroup(devices);
    const result = await group.setBrightness(50);
    expect(result).toBeTruthy();
    expect(device1.setBrightness).toHaveBeenCalledTimes(1);
    expect(device2.setBrightness).toHaveBeenCalledTimes(1);

    expect(device1.setBrightness).toHaveBeenCalledWith(50);
    expect(device2.setBrightness).toHaveBeenCalledWith(50);
  });

  it('they set color temp', async () => {
    const group = new GoveeControlGroup(devices);
    const result = await group.setColorTemperature(2000);
    expect(result).toBeTruthy();
    expect(device1.setColorTemperature).toHaveBeenCalledTimes(1);
    expect(device2.setColorTemperature).toHaveBeenCalledTimes(1);

    expect(device1.setColorTemperature).toHaveBeenCalledWith(2000);
    expect(device2.setColorTemperature).toHaveBeenCalledWith(2000);
  });

  it('they set RGB color', async () => {
    const group = new GoveeControlGroup(devices);
    const result = await group.setRGBColor({ r: 100, g: 50, b: 200 });
    expect(result).toBeTruthy();
    expect(device1.setRGBColor).toHaveBeenCalledTimes(1);
    expect(device2.setRGBColor).toHaveBeenCalledTimes(1);

    expect(device1.setRGBColor).toHaveBeenCalledWith({ r: 100, g: 50, b: 200 });
    expect(device2.setRGBColor).toHaveBeenCalledWith({ r: 100, g: 50, b: 200 });
  });

  it('they set HEX color', async () => {
    const group = new GoveeControlGroup(devices);
    const result = await group.setHexColor('#fffaaa');
    expect(result).toBeTruthy();
    expect(device1.setHexColor).toHaveBeenCalledTimes(1);
    expect(device2.setHexColor).toHaveBeenCalledTimes(1);

    expect(device1.setHexColor).toHaveBeenCalledWith('#fffaaa');
    expect(device2.setHexColor).toHaveBeenCalledWith('#fffaaa');
  });
});
