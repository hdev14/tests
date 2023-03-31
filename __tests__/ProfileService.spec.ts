import User from "../src/entities/User";
import IUserRepository, { UserData } from "../src/repositories/IUserRepository";
import ProfileService from "../src/services/ProfileService";
import { mock } from 'jest-mock-extended';
import IGitRemoteHub from "../src/external/IGitRemoteHub";
import ProfileNotFoundError from "../src/services/ProfileNotFoundError";

const testDate = new Date();

class UserRepositoryStub implements IUserRepository {
  create(data: UserData): Promise<User> {
    return Promise.resolve(new User(
      'test_id',
      'test_external_id',
      'test_name',
      'test_username',
      testDate,
    ));
  }
  
  findByUsername(username: string): Promise<User | null> {
    throw new Error("Method not implemented.");
  }
  
  findMany(): Promise<User[]> {
    throw new Error("Method not implemented.");
  }
}

describe('ProfileService.addUserProfile', () => {
  it('returns a new user profile', async () => {
    const userRepositoryStub = new UserRepositoryStub();
    const gitRemoteHubMock = mock<IGitRemoteHub>();

    gitRemoteHubMock.getProfile.mockResolvedValueOnce({
      id: 'test_id',
      name: 'test_name',
      username: 'test_username',
    });

    const profileService = new ProfileService(
      userRepositoryStub,
      gitRemoteHubMock
    );

    const profile = await profileService.addUserProfile('test_username');

    expect(profile).toEqual({
      id: 'test_id',
      externalId: 'test_external_id',
      username: 'test_username',
      name: 'test_name',
      addedAt: testDate,
    });
  })

  it('throws a ProfileNotFoundError if profile is null', async () => {
    const userRepositoryStub = new UserRepositoryStub();
    const gitRemoteHubMock = mock<IGitRemoteHub>();

    gitRemoteHubMock.getProfile.mockResolvedValueOnce(null);

    const profileService = new ProfileService(
      userRepositoryStub,
      gitRemoteHubMock
    );

    try {
      await profileService.addUserProfile('test_username');  
    } catch (e: any) {
      expect(e).toBeInstanceOf(ProfileNotFoundError);
    }
  })
});