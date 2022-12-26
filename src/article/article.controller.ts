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

  @ApiBearerAuth('token')
  @ApiHeader({
    name: 'Authorization',
  })
  @ApiQuery({})
  @Get()
  @UseGuards(AuthGuard)
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
  @ApiBody({ description: 'createArticleDto' })
  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
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
  @UsePipes(new ValidationPipe())
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
}
