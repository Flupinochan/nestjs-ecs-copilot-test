# ビルド用のイメージを作成
FROM node:20 AS builder

# 作業ディレクトリを設定
WORKDIR /usr/src/app

# 依存関係をインストール
COPY package*.json ./
RUN npm install

# .envファイルをコピー
COPY .env ./

# アプリケーションのソースコードをコピー
COPY . .

# Prisma Clientを生成
RUN npx prisma generate

# アプリケーションをビルド
RUN npm run build

# 本番用のイメージを作成
FROM node:20 AS production

# 作業ディレクトリを設定
WORKDIR /usr/src/app

# ビルドしたファイルをコピー
COPY --from=builder /usr/src/app/dist ./dist
COPY package*.json ./
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/.env ./

# Prisma Clientを生成
RUN npx prisma generate  # Prisma Clientを生成

# 本番依存関係をインストール
RUN npm install --only=production

# ポートを公開
EXPOSE 3005

# アプリケーションを実行
CMD ["sh", "-c", "node dist/main.js --port=${PORT:-3005}"]

# docker build -t backend-nestjs .
# docker run -d --name backend-nestjs -p 3005:3005 backend-nestjs