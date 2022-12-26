import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedDB1672074343036 implements MigrationInterface {
  name = 'SeedDB1672074343036';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO tags (name) VALUES ('dragons')`);

    //pas_aadhgjhfadfsa
    await queryRunner.query(
      `INSERT INTO users (username, email, password) VALUES ('Petya', 'adasdsd@mail.ru', '$2b$10$yXXuZtmDtwn1jblxIhDiNuMXDm0ExWFu.egUfKIFjSl25VBA7ysB2')`,
    );

    await queryRunner.query(
      `INSERT INTO articles (slug, title, description, body, "tagList", "authorId") VALUES ('first-article', 'First article', 'First article description', 'First article body', 'coffee,dragons', 1), ('second-article', 'Second article', 'Second article description', 'Second article body', 'coffee,dragons', 1)`,
    );
  }

  public async down(): Promise<void> {}
}
