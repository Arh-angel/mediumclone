import { UserEntity } from '@app/user/entities/user.entity';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileType } from './types/profile.type';
import { ProfileResponseInterface } from './types/profileResponse.interface';
import { Repository } from 'typeorm';
import { FollowEntity } from './entities/follow.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FollowEntity)
    private readonly followRepository: Repository<FollowEntity>,
  ) {}

  async getProfile(userId: number, username: string): Promise<ProfileType> {
    const currentUser = await this.userRepository.findOneBy({ username });

    if (!currentUser) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }

    const follow = await this.followRepository.findOneBy({
      followerId: userId,
      followingId: currentUser.id,
    });

    return { ...currentUser, following: Boolean(follow) };
  }

  async followProfile(userId: number, username: string): Promise<ProfileType> {
    const currentUser = await this.userRepository.findOneBy({ username });

    if (!currentUser) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }

    if (currentUser.id === userId) {
      throw new HttpException(
        'follower and following is equal',
        HttpStatus.BAD_REQUEST,
      );
    }

    const follow = await this.followRepository.findOneBy({
      followerId: userId,
      followingId: currentUser.id,
    });

    if (!follow) {
      const followToCreate = new FollowEntity();
      followToCreate.followerId = userId;
      followToCreate.followingId = currentUser.id;

      await this.followRepository.save(followToCreate);
    }

    return { ...currentUser, following: true };
  }

  async unfollowProfile(
    userId: number,
    username: string,
  ): Promise<ProfileType> {
    const currentUser = await this.userRepository.findOneBy({ username });

    if (!currentUser) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }

    if (currentUser.id === userId) {
      throw new HttpException(
        'follower and following is equal',
        HttpStatus.BAD_REQUEST,
      );
    }

    this.followRepository.delete({
      followerId: userId,
      followingId: currentUser.id,
    });

    return { ...currentUser, following: false };
  }

  buildProfileResponse(profile: ProfileType): ProfileResponseInterface {
    delete profile.email;
    return { profile };
  }
}
