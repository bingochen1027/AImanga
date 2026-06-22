# GitLab Pages 部署说明

本项目包含两个静态站点：

- 官网 Website：`frontend/`
- 后台 Portal：`portal/`

当前部署方式使用一个 GitLab 项目，通过 GitLab Pages 同时发布两个入口。

## 发布后的访问地址

假设 GitLab Pages 地址为：

```text
https://你的命名空间.gitlab.io/项目名/
```

则访问入口为：

```text
官网：https://你的命名空间.gitlab.io/项目名/
官网备用：https://你的命名空间.gitlab.io/项目名/website/
后台 Portal：https://你的命名空间.gitlab.io/项目名/portal/
```

## 部署步骤

1. 在 GitLab 新建一个项目。
2. 把当前项目代码推送到 GitLab。
3. 确认根目录存在 `.gitlab-ci.yml`。
4. 推送到默认分支后，GitLab 会自动执行 Pages 部署。
5. 在 GitLab 项目中打开：

```text
Deploy > Pages
```

即可查看 Pages 访问地址。

## 当前 Pages 构建逻辑

`.gitlab-ci.yml` 会在部署时生成 `public/` 目录：

```text
public/
├── index.html              官网默认入口，来自 frontend/
├── assets/                 官网资源
├── website/                官网备用路径
└── portal/                 后台 Portal
```

## Portal 访问安全提醒

当前 Portal 是静态演示后台，适合内部演示和需求沟通。

如果 GitLab 项目是公开项目，Pages 也可能被公开访问。建议：

- 演示阶段：使用私有 GitLab 项目。
- 如果 GitLab 支持 Pages 访问控制，请开启 Pages Access Control。
- 不要在 Portal 中放真实用户手机号、邮箱、订单、支付或内部密钥。

## 后续如果要拆成两个独立站点

如果后续希望官网和后台 Portal 使用两个独立域名，建议拆成两个 GitLab 项目：

- `aimanga-website`：只部署 `frontend/`
- `aimanga-portal`：只部署 `portal/`

届时可以分别绑定域名：

```text
官网：www.example.com
后台：portal.example.com
```

## 本地验证方式

在项目根目录运行：

```bash
rm -rf public
mkdir -p public
cp -R frontend/. public/
mkdir -p public/website
cp -R frontend/. public/website/
mkdir -p public/portal
cp -R portal/. public/portal/
python3 -m http.server 4173 -d public
```

然后打开：

```text
http://localhost:4173/
http://localhost:4173/website/
http://localhost:4173/portal/
```
