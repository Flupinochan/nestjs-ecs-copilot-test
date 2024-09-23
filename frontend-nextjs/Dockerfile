# ベースイメージとして Node.js を使用
FROM node:20 AS build

# 作業ディレクトリを作成
WORKDIR /app

# package.json と package-lock.json をコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# .envファイルをコピー
COPY .env .env

# アプリケーションのソースコードをコピー
COPY . .

# アプリケーションをビルド
RUN npm run build

# 実行ステージ
FROM node:20

WORKDIR /app
# next.config.mjsで、CSRのみにしているためoutだが、SSRの場合は.nextになる
COPY --from=build /app/out ./out
COPY package*.json ./
RUN npm install --only=production

# .envファイルをコピー
COPY --from=build /app/.env .env

# ポートを公開
EXPOSE 3000

# アプリケーションを起動
CMD ["npx", "serve@latest", "out", "-l", "3000"]

# docker build -t front-nextjs .
# docker run -d --name front-nextjs -p 3000:3000 front-nextjs