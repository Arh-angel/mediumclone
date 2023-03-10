import { BackendValidationPipe } from '@app/shared/pipes/backendValidation.pipe';
import { User } from '@app/user/decorators/user.decorator';
import { UserEntity } from '@app/user/entities/user.entity';
import { AuthGuard } from '@app/user/guards/auth.guard';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
  UsePipes,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleResponseInterface } from './types/articleResponse.interface';
import { ArticlesResponseInterface } from './types/articlesResponse.interface';

@ApiTags('Article')
@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @ApiQuery({})
  @Get()
  async findAll(
    @User('id') userId: number,
    @Query() query: any,
  ): Promise<ArticlesResponseInterface> {
    return await this.articleService.findAll(userId, query);
  }

  @ApiBearerAuth('token')
  @ApiHeader({
    name: 'Authorization',
  })
  @ApiQuery({})
  @Get('/feed')
  @UseGuards(AuthGuard)
  async getFeed(
    @User('id') userId: number,
    @Query() query: any,
  ): Promise<ArticlesResponseInterface> {
    return await this.articleService.getFeed(userId, query);
  }

  @ApiBearerAuth('token')
  @ApiHeader({
    name: 'Authorization',
  })
  @ApiBody({ description: 'createArticleDto' })
  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async create(
    @User() currentUser: UserEntity,
    @Body('article') createArticleDto: CreateArticleDto,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.createArticle(
      currentUser,
      createArticleDto,
    );

    return await this.articleService.buildArticleResponse(article);
  }

  @ApiBearerAuth('token')
  @ApiHeader({
    name: 'Authorization',
  })
  @ApiParam({ name: 'slug' })
  @Get(':slug')
  @UseGuards(AuthGuard)
  async getArticle(
    @Param('slug') slug: string,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.getArticle(slug);

    return await this.articleService.buildArticleResponse(article);
  }

  @ApiBearerAuth('token')
  @ApiHeader({
    name: 'Authorization',
  })
  @ApiParam({ name: 'slug' })
  @Delete(':slug')
  @UseGuards(AuthGuard)
  async deleteArticle(@User('id') userId: number, @Param('slug') slug: string) {
    return await this.articleService.deleteArticle(userId, slug);
  }

  @ApiBearerAuth('token')
  @ApiHeader({
    name: 'Authorization',
  })
  @ApiBody({ description: 'updateArticleDto' })
  @ApiParam({ name: 'slug' })
  @Put(':slug')
  @UsePipes(new BackendValidationPipe())
  @UseGuards(AuthGuard)
  async updateArticle(
    @User('id') userId: number,
    @Param('slug') slug: string,
    @Body('article') updateArticleDto: UpdateArticleDto,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.updateArticle(
      userId,
      slug,
      updateArticleDto,
    );

    return await this.articleService.buildArticleResponse(article);
  }

  @ApiBearerAuth('token')
  @ApiHeader({
    name: 'Authorization',
  })
  @ApiBody({ description: 'favoritesArticleDto' })
  @Post(':slug/favorite')
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async addArticleFavorites(
    @User('id') userId: number,
    @Param('slug') slug: string,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.addArticleFavorites(userId, slug);

    return await this.articleService.buildArticleResponse(article);
  }

  @ApiBearerAuth('token')
  @ApiHeader({
    name: 'Authorization',
  })
  @ApiBody({ description: 'favoritesArticleDto' })
  @Delete(':slug/favorite')
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async deleteArticleFavorites(
    @User('id') userId: number,
    @Param('slug') slug: string,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.addArticleFavorites(userId, slug);

    return await this.articleService.buildArticleResponse(article);
  }
}
