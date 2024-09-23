# NestJS
```bash
npm i -g @nestjs/cli
npm i -g yarn

yarn start:dev
```

## nestjs

1. main.ts
2. app.module.ts
3. app.controller.ts
   ルーティング処理(/auth/loginなどのパス)
4. app.service.ts
   ビジネスロジック(処理内容)
5. その他auth moduleなどをapp.moduleにimportして利用する
   moduleでimportしてツリー構造で管理する

## Injection方法には、ProvidersとImportがある

## Prisma

```bash
yarn add -D prisma
yarn add @prisma/client
npx prisma init
npx prisma migrate dev # prismaの定義に合わせてデータベースとカラムを作成
npx prisma studio # prismaのデータベースをWebで確認
npx prisma generate # prisma client(typescriptの型)を生成
```

## nestjs cliでファイル生成

```bash
nest g module auth
nest g controller auth --no-spec
nest g service auth --no-spec
```

## ビルド
1.ビルドする
```bash
yarn build
```
2.「./dist」ディレクトリにビルドしたファイルが生成されるので、Dockerfileでこのディレクトリをコンテナにコピーする

3.Dockerfileで以下を起動プロセスにする
```dockerfile
CMD ["node", "dist/main.js"]
```

