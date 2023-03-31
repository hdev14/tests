import axios from "axios";
import Github from "../src/external/Github";
import getProfileResponse from './fixtures/getProfileResponse.json';

jest.mock('axios');
const axiosMocked = jest.mocked(axios);

it('calls axios.create with corret params', () => {
  new Github();

  expect(axiosMocked.create).toHaveBeenCalledWith({
    baseURL: 'https://api.github.com',
  });
});

describe('getProfile', () => {
  it('returns a profile', async () => {
    const getMock = jest.fn();

    axiosMocked.create.mockImplementationOnce(() => {
      return {
        get: getMock,
      } as any;
    });

    getMock.mockResolvedValueOnce({
      status: 200,
      data: getProfileResponse,
    });

    const github = new Github();

    const profile = await github.getProfile('fake_criteria');

    expect(profile).toEqual({
      id: getProfileResponse.id,
      name: getProfileResponse.name,
      username: getProfileResponse.login,
    });
  });

  it('returns NULL if throw a http status code 404', async () => {
    const getMock = jest.fn();

    axiosMocked.create.mockImplementationOnce(() => {
      return {
        get: getMock,
      } as any;
    });

    getMock.mockRejectedValueOnce({
      response: {
        status: 404,
      }
    });

    const github = new Github();

    const profile = await github.getProfile('fake_criteria');

    expect(profile).toBeNull();
  });
})