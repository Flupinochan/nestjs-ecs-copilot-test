# NextJS
```bash
# 既存のデータベースからデータ型をschema.prismaに反映する
npx prisma db pull
npx prisma generate
```

## Mantine UI

https://mantine.dev/guides/next/

## Icon

[tabler](https://tabler.io/icons)<br>
[heroicons](https://heroicons.com/)<br>

# Build
クライアントサイドレンダリングのみにして、CloudFront + S3にデプロイする場合<br>
1.next.config.mjsに以下を追記
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // 追記
};

export default nextConfig;
```

2.ビルド
```bash
npm run build
```

3.ビルドしたファイル(outディレクトリ)をS3にデプロイ
