import axios from 'axios';
import Govee from '../govee';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Govee', () => {
  const KEY = 'testKey';
  const govee = new Govee(KEY);

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
});
