# ECS Copilot CLI まとめ
Dockerfileだけで、オートスケーリング/ロードバランサーを使用したコンテナ環境を1つのコマンドでデプロイ可能!!<br>
https://aws.github.io/copilot-cli/ja/

## インストール手順
https://aws.github.io/copilot-cli/ja/docs/getting-started/install/<br>
Windowsの場合は、「C:\Program Files」にインストールされるので、環境変数PATHをとおしておくこと<br>

## ECSデプロイ/削除
対話形式でDockerfileを指定してECSをデプロイする<br>
CloudFormationでリソースが作成されるため、作成されたリソースはCloudFormationで確認可能<br>
`※注意`: Dockerfileなどのパスを指定する際は、「manifest.yaml」空の相対パスではなく、「infra-ecs-copilot-cli」などのトップディレクトリからの相対パスで指定すること!!
```bash
# ★★★Dockerは起動しておくこと★★★
# ★★★Service名は、CloudMap(Service Connect)に登録されて、サービス名でコンテナ間通信が可能★★★
# .envとbackendのcorsのoriginを変更すること
# ★★★ECS Copilotでは、1つのALBに複数のECS Serviceがデプロイされるため、パスを意識する必要がある
# パスの書き換えはできないため、backendのECS Serviceのルートパスは、ECS Service名と一致させるなどにして、frontendの/と分けておくこと
# ALBは80や443でアクセスするとをターゲットのECSに3000や3005でルーティングしてくれる

copilot version

# 最初にApplicationを作成しつつ、1つserviceを作成
copilot init

# 2つ目以降のserviceを作成
copilot svc init
copilot svc deploy

copilot app delete
```

## 概念
・Application<br>
　全体で1つ命名する<br>
<br>
・Environment<br>
　Application内に複数のProd/Dev環境を作成可能<br>
<br>
・Service<br>
　- インターネットからアクセス可能(Public Subnet)<br>
　　　- Load Balanced Web Service<br>
　　　　　ALB + ECS(Fargate)をデプロイ<br>
　　　- Request Driven Web Service<br>
　　　　　App Runnerをデプロイ<br>
　　　- Static Site<br>
　　　　　CloudFront + S3をデプロイ<br><br>
　- インターネットからアクセス不可能(Private Subnet)<br>
　　　- Backend Service<br>
　　　　　他のECS(Fargate)からアクセス可能<br>
　　　　　Service Discoveryを使用して通信<br>
　　　- Worker Service<br>
　　　　　SQSをデプロイし、他のECSと非同期通信(Pub/Sub)を行う<br>
　　　　　https://aws.amazon.com/jp/blogs/news/implementing-a-pub-sub-architecture-with-aws-copilot/<br>
　　　　　https://aws.github.io/copilot-cli/ja/docs/developing/publish-subscribe/<br>

・Job<br>
　Scheduleして定期的(一時的)にECS(Fargate)をデプロイする<br>
　EventBridge(Cron)が使用されている

・Pipeline<br>
　GitHubへのPushをトリガーにして、ECS(Fargate)をデプロイする<br>
　CodePipeline(CodeConnections)が使用されている<br>

## Manifestファイル
CloudFormationテンプレートに変換されるECSデプロイ用設定ファイル<br>
ECSの設定にフォーカスされ、VPCやIAMRoleの設定をしなくて良いことがメリット<br>
https://aws.github.io/copilot-cli/ja/docs/manifest/lb-web-service/

## 他のAWSサービスの追加
ECSが追加したAWSリソースにアクセスするためのIAMPolicy(権限)は、自動的にECSのIAMRoleに付与されるため設定不要<br>
<br>
・EFS、S3、DynamoDB、Aurora Serverless<br>
　「copilot storage init」で追加可能<br>
　https://aws.github.io/copilot-cli/ja/docs/developing/storage/<br>
<br>
・その他のAWSサービス1<br>
　Service/JobレベルでのAddon<br>
　Prod/DevなどのEnvironmentごとにそれぞれ作成される<br>
　基本的にこっちを使用<br>
　1.「copilot/workload/addons/」ディレクトリ以下にCloudFormationテンプレートを作成<br>
　2.「copilot [svc/job] deploy」で追加可能<br>
　https://aws.github.io/copilot-cli/ja/docs/developing/addons/workload/

・その他のAWSサービス2<br>
　EnvironmentレベルでのAddon<br>
　1.「copilot/environments/addons」ディレクトリ以下にCloudFormationテンプレートを作成<br>
　2.「copilot env deploy」で追加可能

・CDKの利用<br>
https://aws.github.io/copilot-cli/ja/docs/developing/overrides/cdk/<br>

## その他機能おすすめ
・X-Ray<br>
　https://aws.github.io/copilot-cli/ja/docs/developing/observability/<br>
<br>
・Secrets Manager<br>
　https://aws.github.io/copilot-cli/ja/docs/developing/secrets/<br>
<br>
・Service Connect<br>
　現在はデフォルト?<br>
　https://aws.github.io/copilot-cli/ja/docs/developing/svc-to-svc-communication/<br>
<br>
・Sidecar Container<br>
　https://aws.github.io/copilot-cli/ja/docs/developing/sidecars/

## コマンド
https://aws.github.io/copilot-cli/ja/docs/commands/version/