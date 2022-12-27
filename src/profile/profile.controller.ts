import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ApiBearerAuth, ApiHeader, ApiParam, ApiTags } from '@nestjs/swagger';
import { ProfileResponseInterface } from './types/profileResponse.interface';
import { User } from '@app/user/decorators/user.decorator';
import { AuthGuard } from '@app/user/guards/auth.guard';

@ApiTags('profile')
@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @ApiBearerAuth('token')
  @ApiHeader({
    name: 'Authorization',
  })
  @ApiParam({ name: 'username' })
  @Get(':username')
  async getProfile(
    @User('id') userId: number,
    @Param('username') username: string,
  ): Promise<ProfileResponseInterface> {
    const profile = await this.profileService.getProfile(userId, username);

    return this.profileService.buildProfileResponse(profile);
  }

  @ApiBearerAuth('token')
  @ApiHeader({
    name: 'Authorization',
  })
  @Post(':username/follow')
  @UseGuards(AuthGuard)
  async followProfile(
    @User('id') userId: number,
    @Param('username') username: string,
  ): Promise<ProfileResponseInterface> {
    const profile = await this.profileService.followProfile(userId, username);

    return this.profileService.buildProfileResponse(profile);
  }

  @ApiBearerAuth('token')
  @ApiHeader({
    name: 'Authorization',
  })
  @Delete(':username/follow')
  @UseGuards(AuthGuard)
  async unfollowProfile(
    @User('id') userId: number,
    @Param('username') username: string,
  ): Promise<ProfileResponseInterface> {
    const profile = await this.profileService.unfollowProfile(userId, username);

    return this.profileService.buildProfileResponse(profile);
  }
}
