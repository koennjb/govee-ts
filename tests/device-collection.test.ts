import Govee from '../src/govee';
import { CMD_BRIGHTNESS, CMD_COLOR } from '../src/constants';
import { GoveeDevice } from '../src/device';
import { GoveeDeviceCollection } from '../src/device-collection';

jest.mock('../src/govee');

describe('GoveeDeviceCollection', () => {
  const KEY = 'testKey';
  const govee: Govee = new Govee(KEY);
  const mockedGovee = govee as jest.Mocked<typeof govee>;
  beforeEach(() => {
    mockedGovee.getAllCollection.mockImplementation(async () => {
      const devices = [
        new GoveeDevice(
          'test1',
          'testModel1',
          'testMac',
          [CMD_BRIGHTNESS, CMD_COLOR],
          true,
          true,
          mockedGovee,
        ),
        new GoveeDevice(
          'test2',
          'testModel2',
          'testMac2',
          [CMD_BRIGHTNESS, CMD_COLOR],
          true,
          true,
          mockedGovee,
        ),
      ];

      return new GoveeDeviceCollection(devices);
    });
    mockedGovee.setPower.mockClear();
  });

  it('they turn on', async () => {
    const collection = await mockedGovee.getAllCollection();
    console.log(collection);
  });
});
