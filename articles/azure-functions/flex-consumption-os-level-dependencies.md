---
title: Use OS-level dependencies via containers with Azure Functions Flex Consumption
description: Learn how to package application code, language dependencies, and OS-level dependencies in a customer-provided container image for Azure Functions Flex Consumption.
ms.service: azure-functions
ms.topic: how-to
ms.date: 11/08/2026
author: mabhar
ms.author: mabhar
ms.custom: byoc
zone_pivot_groups: programming-languages-flex-worker-images
---

# Use OS-level dependencies via containers with Azure Functions Flex Consumption

> [!IMPORTANT]
> This feature is in preview. Preview capabilities can change.

By using OS-level dependency support through containers, you can run Flex Consumption function apps that need more than just application code and language packages in their execution environment. You provide a Linux container image that includes the application and its required language and OS dependencies. Azure continues to provide the Functions host, trigger integration, routing, and scaling.

## Overview

You build a Linux container image that includes your function code, one supported Functions language worker, language and application dependencies, and the system packages, native libraries, executables, fonts, certificates, or other files your app needs at runtime.

Azure runs and patches the Functions host and manages routing, trigger integration, and scaling outside the image. This separation lets you customize the worker environment while reducing the image surface area and removing the need to package, secure, and update the Functions host yourself.

Flex Consumption uses a worker-only container model. Your image isn't an arbitrary web container. It also isn't a complete Function App image, which packages the Functions host, language worker, application, and dependencies together for another hosting option.

::: zone pivot="programming-language-csharp"

For a complete example that packages an OS-level dependency in a worker-only container image, see the [Azure Functions Flex Consumption .NET isolated container sample](https://aka.ms/flex-container-sample-dotnet).

::: zone-end

::: zone pivot="programming-language-python"

For a complete example that packages an OS-level dependency in a worker-only container image, see the [Azure Functions Flex Consumption Python container sample](https://aka.ms/flex-container-sample-python).

::: zone-end

::: zone pivot="programming-language-go"

For a complete example that packages an OS-level dependency in a worker-only container image, see the [Azure Functions Flex Consumption Go container sample](https://aka.ms/flex-container-sample-go).

::: zone-end

::: zone pivot="programming-language-javascript"

For a complete example that packages an OS-level dependency in a worker-only container image, see the [Azure Functions Flex Consumption Node.js container sample](https://aka.ms/flex-container-sample-node).

::: zone-end

## Benefits

- Package the application, language worker, language dependencies, and OS-level dependencies in one versioned image.
- Choose when to adopt worker, language runtime, and dependency updates by rebuilding, testing, and redeploying the image.
- Keep the Functions host, trigger integration, routing, and scaling managed and patched by Azure outside the image.
- Reduce the components that you must include, secure, and maintain in your image compared with a complete Function App image.

## When to use this feature

Use containers for OS-level dependencies on Flex Consumption when:

- Your Flex Consumption app requires dependencies that you can't get through the language package manager alone.
- You can build, scan, patch, test, and publish a Linux image.
- You can maintain the selected base image and the language worker version in the image.

## Compare container hosting options

Choose the hosting model that matches the part of the runtime you need to control.

| Capability | Flex Consumption container image | Elastic Premium or Dedicated (App Service) custom image | Functions on Azure Container Apps |
| --- | --- | --- | --- |
| Image contract | Worker only | Complete Function App image | Complete Function App image |
| Functions host/runtime | Supplied, operated, and patched by Azure outside your image | Included in your image, normally from a Functions base image | Included in your image |
| Your image contains | App, one language worker, language/application dependencies, and OS packages | Functions host, worker, app, and dependencies | Functions host, worker, app, and dependencies |
| Scaling | Functions-managed Flex Consumption scaling | Functions-managed Premium scaling or App Service plan scaling | Container Apps scaling |
| Billing | Standard Flex Consumption billing | Elastic Premium or App Service plan billing | Container Apps billing |
| Best fit | Add OS-level dependencies while retaining the Flex serverless platform contract | Control a complete Functions container on App Service infrastructure | Run complete Functions containers with Container Apps capabilities |

For more information about complete Function App images, see [Linux container support in Azure Functions](container-concepts.md).

## Architecture and responsibility boundary

An event or HTTP request first reaches the Azure-managed Functions platform. Azure runs the Functions host and runtime, evaluates triggers, routes invocations, and determines when to add or remove instances. When an invocation is ready, the platform sends it to the Functions language worker in your image. The language worker loads your function app, and your app can use the language, application, and OS-level dependencies packaged in the image.

Your image doesn't include or replace the Functions host, implement trigger routing, or control platform scaling. You maintain the application, language worker, base image, and dependencies inside the image. Microsoft maintains and updates the Functions platform components outside the image.

The active Functions language worker must be one of the workers listed in the preview support table. The preview doesn't support replacing it with an arbitrary customer-developed language worker or custom handler. The image can include other runtimes or executables, such as a Rust component invoked by a supported function, as application dependencies. The one-worker restriction applies to active Functions language workers, not to auxiliary runtimes or tools packaged with the app.

## Preview language support

The preview supports the following Functions language workers. Select your language at the top of the article for supported runtime versions, worker compatibility information, and a sample Dockerfile.

| Functions language | How the worker is included |
|---|---|
| .NET isolated | Included through the application's NuGet dependencies and publish output |
| Python | Added as a Python-version-specific Microsoft worker artifact |
| Node.js | Added as a Microsoft-published Node.js worker artifact |
| Go | Included through the Go worker SDK and compiled into the application binary |

Other Functions language workers aren't supported during the preview.

## Prerequisites

Before you begin, you need:

- An application that uses a supported preview language.
- A Docker-compatible image build environment.
- A Linux or language base image that you can maintain.
- The application source and its language dependencies.
- The required OS packages, native libraries, fonts, drivers, or tools.
- Access to a [container registry](#registry-support).
- Permission to build, scan, push, and deploy images.

The preview supports Linux `amd64` images.

## Understand the Flex Consumption container model

Your image is responsible for:

- The application payload.
- One supported Functions language worker.
- Language and application dependencies.
- OS-level dependencies.
- The Linux or language base image that you select.
- Image security, vulnerability remediation, and explicit component versions.

Azure is responsible for:

- The Functions host.
- Routing and trigger integration.
- Functions-managed scaling.
- Platform components outside your image.

Flex Consumption lets you choose the Linux or language base image that best fits your application and organizational requirements. Build on that image by adding a supported Functions language worker, your application, and its dependencies according to this worker-only container model. Microsoft provides versioned worker artifacts and [sample Dockerfiles](#obtain-the-language-worker) to help you create a compatible image, while Azure manages the Functions host outside your image.

Worker startup is language-specific. Use the [sample Dockerfile for your language](#obtain-the-language-worker) instead of copying an entry point from another language. The platform supplies the worker RPC connection arguments and application directory. Your image starts the language worker or application binary directly; it doesn't install or start the Functions host or contain platform endpoint configuration.

### Environment variables and script root

You don't configure Functions host or worker-connection environment variables. The platform injects the worker identity, connection, protocol, and bootstrap values that the language worker needs to communicate with the Azure-managed Functions host.

When your Flex Consumption app uses a container image, configure the app setting `AzureWebJobsScriptRoot=/home/site/wwwroot`. Your image must place the function application at that path. Azure injects the setting into the container at runtime, so you don't need to declare it as an `ENV` instruction in the Dockerfile. You can continue to use other app settings required by your application.

Don't add `FUNCTIONS_WORKER_RUNTIME` or `FUNCTIONS_EXTENSION_VERSION` to a Flex Consumption app that uses a container image. The platform manages these runtime details outside your image.

## Obtain the language worker

Include a specific worker release in the image so that rebuilding the same image source doesn't silently select a different worker. For a downloaded worker artifact, specify its release version and verify its SHA-256 checksum. For a worker supplied through an application dependency, specify the dependency version in the application project. Updating the worker requires you to change that version, rebuild, test, push, and redeploy the image.

::: zone pivot="programming-language-csharp"

### .NET isolated

The preview supports the .NET isolated worker model on .NET 10 and .NET 11. A .NET isolated application includes the Functions worker through its normal NuGet dependencies and build output. The worker isn't published as a separate artifact for each supported .NET runtime version. Specify the Microsoft.Azure.Functions.Worker and related package versions in the project, and publish the application into `/home/site/wwwroot`.

Use the latest version of `Azure.Functions.Sdk` as the project SDK. For existing projects, follow [Migrate to Azure.Functions.Sdk](dotnet-isolated-process-guide.md#migrate-to-azurefunctionssdk).

Use the following minimum package versions:

- `Microsoft.Azure.Functions.Worker` version `2.53.0-preview.1` or later.
- `Microsoft.Azure.Functions.Worker.Extensions.Http.AspNetCore` version `2.1.2-preview.1` or later, if your app uses ASP.NET Core integration.

> [!IMPORTANT]
> Use a supported .NET version. You're responsible for selecting and maintaining a supported .NET runtime image and compatible Functions worker and application dependencies.

For the complete application and deployment files, see the [Azure Functions Flex Consumption .NET isolated container sample](https://aka.ms/flex-container-sample-dotnet).

#### .NET isolated sample Dockerfile

The following sample Dockerfile publishes the .NET isolated application and copies the publish output into a .NET 10 runtime image:

```dockerfile
FROM mcr.microsoft.com/dotnet/sdk:10.0-noble AS build

WORKDIR /src
COPY NuGet.config FlexDotnetWorker.csproj ./
RUN dotnet restore FlexDotnetWorker.csproj --runtime linux-x64 -p:PublishReadyToRun=true

COPY *.cs host.json ./

RUN dotnet publish FlexDotnetWorker.csproj --configuration Release --runtime linux-x64 --self-contained false \
    --no-restore -p:PublishReadyToRun=true --output /publish \
    && rm -f /publish/worker.config.json /publish/functions.metadata

FROM mcr.microsoft.com/dotnet/aspnet:10.0-noble

WORKDIR /home/site/wwwroot
COPY --from=build /publish/ ./

USER $APP_UID
ENTRYPOINT ["dotnet", "FlexDotnetWorker.dll"]
```

This example targets .NET 10. When you select another supported .NET version, update both .NET base-image tags together and validate the application and Functions worker package versions.

::: zone-end

::: zone pivot="programming-language-python"

### Python

The preview supports Python 3.13 through Python 3.15. A Python image contains the application, Python dependencies, OS-level dependencies, and a supported Python Functions worker artifact. The worker artifact must match the Python runtime version in the image.

> [!IMPORTANT]
> Use a supported Python version and its corresponding worker artifact. Don't combine a worker artifact for one Python version with a different Python runtime version.

Start with the sample Dockerfile in the [Azure Functions Flex Consumption Python container sample](https://aka.ms/flex-container-sample-python).

The sample application uses `azure-functions==2.3.0`. The [Python Dockerfile](#python-dockerfile) specifies a Python worker release, verifies the downloaded artifact by its SHA-256 checksum, and extracts it into the image. Its entry point starts the Python worker directly. Change the Python base image, worker artifact suffix, and checksum together when you select a Python version.

#### Python Dockerfile

The following values identify the supported worker artifact for each Python version:

| Python version | Base image | `WORKER_PYTHON` | `WORKER_SHA256` |
|---|---|---|---|
| 3.13 | `python:3.13-slim-bookworm` | `313` | `39c67d052ef10575519006e5b73b5da977a9a5dff2bab0a222084b4b03070a5e` |
| 3.14 | `python:3.14-slim-bookworm` | `314` | `29295af2b1e0332ca801e228678b147c47d67fefe6d247df0becf6ff92a79883` |
| 3.15 | `python:3.15-slim-bookworm` | `315` | `ae40f55204cdf7b278aa80df4be03ab7fd5432de6726b250ad9b243e4725a5de` |

This example targets Python 3.15. Update the first three `ARG` values by using the preceding table when you build for Python 3.13 or 3.14.

```dockerfile
ARG PYTHON_BASE=python:3.15-slim-bookworm
FROM ${PYTHON_BASE} AS build

ARG WORKER_PYTHON=315
ARG WORKER_SHA256=ae40f55204cdf7b278aa80df4be03ab7fd5432de6726b250ad9b243e4725a5de
ADD --checksum=sha256:${WORKER_SHA256} \
    https://github.com/Azure/azure-functions-python-worker/releases/download/azure_functions_worker-4.46.7/azure-functions-python-worker-4.46.7-py${WORKER_PYTHON}-linux-x64.tar.gz \
    /tmp/worker.tar.gz

RUN mkdir -p /opt/functions-worker \
    && tar -xzf /tmp/worker.tar.gz -C /opt/functions-worker \
    && rm /tmp/worker.tar.gz

COPY requirements.txt /tmp/requirements.txt
RUN --mount=type=secret,id=pip_config,target=/etc/pip.conf \
    python -m pip install --no-cache-dir --only-binary=:all: \
    --target /home/site/wwwroot/.python_packages/lib/site-packages \
    -r /tmp/requirements.txt

FROM ${PYTHON_BASE}

RUN groupadd --gid 10001 app \
    && useradd --uid 10001 --gid 10001 --create-home --shell /usr/sbin/nologin app

WORKDIR /home/site/wwwroot
COPY --from=build /opt/functions-worker/ /opt/functions-worker/
COPY --from=build /home/site/wwwroot/.python_packages/ ./.python_packages/
COPY function_app.py host.json ./

USER 10001:10001
ENTRYPOINT ["python", "/opt/functions-worker/worker.py"]
```

From the directory that contains the Dockerfile and application files, build and push the image. This example uses Azure Container Registry and system-assigned identity:

```azurecli
az acr login --name <ACR_NAME>

docker build --platform linux/amd64 --progress plain \
  -f python313.Dockerfile \
  -t <ACR_NAME>.azurecr.io/<REPOSITORY>:python313 .

docker push <ACR_NAME>.azurecr.io/<REPOSITORY>:python313

az functionapp create -g <RESOURCE_GROUP> -n <APP_NAME> -s <STORAGE_ACCOUNT> \
  --flexconsumption-location <REGION> \
  --deployment-image <ACR_NAME>.azurecr.io/<REPOSITORY>:python313 \
  --deployment-image-auth-type SystemAssignedIdentity \
  --assign-identity [system] --role AcrPull --scope <ACR_RESOURCE_ID>

az functionapp deployment config show -g <RESOURCE_GROUP> -n <APP_NAME>
```

::: zone-end

::: zone pivot="programming-language-go"

### Go

The preview supports Go 1.27. A Go image contains the application, OS-level dependencies, and the supported Go Functions worker and SDK compiled into the application binary. The worker isn't published as a separate artifact for each supported Go version.

> [!IMPORTANT]
> Use a supported Go version. You're responsible for compiling the application with a supported Go toolchain and compatible Go Functions worker SDK version.

Start with the sample Dockerfile in the [Azure Functions Flex Consumption Go container sample](https://aka.ms/flex-container-sample-go).

The sample `go.mod` file specifies `github.com/azure/azure-functions-golang-worker` version `v1.0.2`. The [Go Dockerfile](#go-dockerfile) uses a multistage build and starts the compiled application binary directly.

#### Go Dockerfile

```dockerfile
FROM golang:1.27-bookworm AS build
WORKDIR /src

COPY go.mod go.sum ./
RUN go mod download

COPY *.go ./
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
    go build -mod=readonly -trimpath -ldflags="-s -w" -o /out/app .

FROM ubuntu:24.04

WORKDIR /home/site/wwwroot
COPY --from=build /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/ca-certificates.crt
COPY --from=build --chmod=0555 /out/app ./app
COPY host.json ./

USER 10001:10001
ENTRYPOINT ["/home/site/wwwroot/app"]
```

From the directory that contains the Dockerfile and application files, build and push the image. This example uses Azure Container Registry and system-assigned identity:

```azurecli
az acr login --name <ACR_NAME>

docker build --platform linux/amd64 --progress plain \
  -f go.Dockerfile \
  -t <ACR_NAME>.azurecr.io/<REPOSITORY>:go127 .

docker push <ACR_NAME>.azurecr.io/<REPOSITORY>:go127

az functionapp create -g <RESOURCE_GROUP> -n <APP_NAME> -s <STORAGE_ACCOUNT> \
  --flexconsumption-location <REGION> \
  --deployment-image <ACR_NAME>.azurecr.io/<REPOSITORY>:go127 \
  --deployment-image-auth-type SystemAssignedIdentity \
  --assign-identity [system] --role AcrPull --scope <ACR_RESOURCE_ID>

az functionapp deployment config show -g <RESOURCE_GROUP> -n <APP_NAME>
```

::: zone-end

<!-- markdownlint-disable-next-line MD044 -->
::: zone pivot="programming-language-javascript"

### Node.js

The preview supports Node.js 24. A Node.js image contains the application, Node.js dependencies, OS-level dependencies, and a supported Node.js Functions worker artifact. The worker isn't published as a separate artifact for each supported Node.js runtime version.

> [!IMPORTANT]
> Use a supported Node.js version. You're responsible for selecting and maintaining a supported Node.js base image and compatible Functions worker and application dependencies.

Start with the sample JavaScript or TypeScript Dockerfile in the [Azure Functions Flex Consumption Node.js container sample](https://aka.ms/flex-container-sample-node).

The sample application uses `@azure/functions` version `4.17.0`. The [Node.js Dockerfile](#nodejs-dockerfile) specifies a Node.js worker release, verifies the downloaded artifact by its SHA-256 checksum, and extracts it into the image. Its entry point starts the Node.js worker directly. Change the worker release and checksum together when you update the worker.

#### Node.js Dockerfile

The following Dockerfiles use the layout of the sample JavaScript and TypeScript projects. Update the `COPY` commands and build steps to match your application's directory structure and build output. For TypeScript, the example compiles the application and copies the generated JavaScript from `dist`. The `dist` directory is a sample convention, not a requirement of the Flex Consumption container model. Ensure that the `main` field in `package.json` identifies the generated JavaScript files.

##### [JavaScript](#tab/javascript)

```dockerfile
FROM node:24-bookworm-slim AS worker
ADD --checksum=sha256:93fbe6f007a5eab62f28e30b3fbb93c61c53ba3b9890cc135d982a8af1e4f3ca \
    https://github.com/Azure/azure-functions-nodejs-worker/releases/download/v3.17.3/azure-functions-nodejs-worker-3.17.3.tar.gz \
    /tmp/worker.tar.gz

RUN mkdir -p /opt/functions-worker \
    && tar -xzf /tmp/worker.tar.gz -C /opt/functions-worker \
    && rm /tmp/worker.tar.gz

FROM node:24-bookworm-slim AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts --no-audit --no-fund

FROM node:24-bookworm-slim
WORKDIR /home/site/wwwroot
COPY --from=worker /opt/functions-worker/ /opt/functions-worker/
COPY --from=dependencies /app/node_modules/ ./node_modules/
COPY package.json host.json ./
COPY src/ ./src/

USER node
ENTRYPOINT ["node", "/opt/functions-worker/dist/src/nodejsWorker.js"]
```

##### [TypeScript](#tab/typescript)

```dockerfile
FROM node:24-bookworm-slim AS worker
ADD --checksum=sha256:93fbe6f007a5eab62f28e30b3fbb93c61c53ba3b9890cc135d982a8af1e4f3ca \
    https://github.com/Azure/azure-functions-nodejs-worker/releases/download/v3.17.3/azure-functions-nodejs-worker-3.17.3.tar.gz \
    /tmp/worker.tar.gz

RUN mkdir -p /opt/functions-worker \
    && tar -xzf /tmp/worker.tar.gz -C /opt/functions-worker \
    && rm /tmp/worker.tar.gz

FROM node:24-bookworm-slim AS application
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY tsconfig.json ./
COPY src/ ./src/
RUN npm run build \
    && npm prune --omit=dev --no-audit --no-fund

FROM node:24-bookworm-slim
WORKDIR /home/site/wwwroot
COPY --from=worker /opt/functions-worker/ /opt/functions-worker/
COPY --from=application /app/node_modules/ ./node_modules/
COPY --from=application /app/dist/ ./dist/
COPY package.json host.json ./

USER node
ENTRYPOINT ["node", "/opt/functions-worker/dist/src/nodejsWorker.js"]
```

---

From the directory that contains the Dockerfile and application files, build and push the image. This example uses Azure Container Registry and system-assigned identity:

```azurecli
az acr login --name <ACR_NAME>

docker build --platform linux/amd64 --progress plain \
  -f node24.Dockerfile \
  -t <ACR_NAME>.azurecr.io/<REPOSITORY>:node24 .

docker push <ACR_NAME>.azurecr.io/<REPOSITORY>:node24

az functionapp create -g <RESOURCE_GROUP> -n <APP_NAME> -s <STORAGE_ACCOUNT> \
  --flexconsumption-location <REGION> \
  --deployment-image <ACR_NAME>.azurecr.io/<REPOSITORY>:node24 \
  --deployment-image-auth-type SystemAssignedIdentity \
  --assign-identity [system] --role AcrPull --scope <ACR_RESOURCE_ID>

az functionapp deployment config show -g <RESOURCE_GROUP> -n <APP_NAME>
```

::: zone-end

## Build the image

Use the sample Dockerfile for your supported language as the starting point:

::: zone pivot="programming-language-csharp"
Start from the [.NET isolated sample Dockerfile](#net-isolated-sample-dockerfile).
::: zone-end

::: zone pivot="programming-language-python"
Start from the [Python sample Dockerfile](#python-dockerfile).
::: zone-end

::: zone pivot="programming-language-go"
Start from the [Go sample Dockerfile](#go-dockerfile).
::: zone-end

<!-- markdownlint-disable-next-line MD044 -->
::: zone pivot="programming-language-javascript"
Start from the [Node.js sample Dockerfile](#nodejs-dockerfile).
::: zone-end

The sample Dockerfile assembles a container image; it isn't a Microsoft-provided base image.

1. Select a supported Linux or language base image from a source your organization trusts.
2. Select an explicit base-image version tag or immutable digest according to your supply-chain policy. Avoid floating tags such as `latest`.
3. Install required OS packages and remove temporary package-manager data.
4. Restore or install language and application dependencies.
5. Add the application payload and supported Functions language worker.
6. Configure the language-specific entry point according to the [sample Dockerfile for your language](#obtain-the-language-worker). Don't bake platform endpoint configuration into the image.
7. Build and scan the image.
8. Confirm that the image targets Linux `amd64` and that required files and executable permissions are present.
9. Assign a version tag or digest. Both reference forms are supported, but a digest is preferred for deterministic deployment and rollback.

The preview currently doesn't provide a supported developer experience for running or testing the container image locally.

## Local development and testing

Develop your function code normally. Use your language's test tools and run `func start` to validate the source application locally.

After source-level validation, build the container image by using the published image contract and the [sample Dockerfile for your language](#obtain-the-language-worker). You can confirm that the build succeeds and inspect the image architecture, files, and permissions. The preview currently doesn't provide a supported developer experience for running or testing the container image locally.

Push the image, configure the Flex Consumption function app by using Azure CLI, and validate the containerized workload in Azure.

## Push the image to a registry

After you complete source-level tests and image build and security checks:

1. Tag the image for your chosen registry and repository.
2. Authenticate to the registry.
3. Push an immutable image version.
4. Record the resulting tag and digest.
5. Confirm that the identity or credential used by the Flex Consumption app can pull the image.

### Registry support

Publish the image to your chosen container registry.

Container image configuration supports anonymous access, Basic authentication, system-assigned identity, and user-assigned identity. Use anonymous access for a public image. Basic authentication references app-setting names that contain the registry credentials; don't put credential values directly in the container image configuration. System-assigned and user-assigned managed identity authentication apply to Azure Container Registry.

Using containers on Flex Consumption doesn't introduce additional networking restrictions. Existing Flex Consumption networking requirements apply. The configured registry must be reachable and DNS-resolvable from the app's network path.

## Use managed identity and Key Vault references

A Flex Consumption app that uses a container image supports the same app-level managed identity behavior as a code-package Flex app. You can assign a system-assigned or user-assigned identity to the function app, and the Azure-managed Functions host and supported extensions can use that identity normally. Your application code can also use the assigned identity through the appropriate Azure identity library.

App settings can use Key Vault references in the same way as other Flex Consumption apps. You configure the identity used to resolve a Key Vault reference independently from the authentication method used to pull the container image. For example, you can use one user-assigned identity for the registry pull and another identity for application access to Azure resources.

## Configure a Flex Consumption function app to use a container image

You can create a new Flex Consumption function app with Registry deployment or change an eligible existing app from `BlobContainer` deployment to `Registry` deployment.

The `Microsoft.Web/sites` resource uses the deployment storage type to identify the deployment model:

- A code-package app uses `properties.functionAppConfig.deployment.storage.type` set to `BlobContainer`.
- A container image deployment uses `properties.functionAppConfig.deployment.storage.type` set to `Registry`.

For Registry deployment:

- Set `deployment.storage.value` to the qualified image reference. Preserve the value exactly.
- Set `deployment.storage.authentication` to a supported authentication shape.
- Omit `functionAppConfig.runtime`.

### Choose an image reference

The `properties.functionAppConfig.deployment.storage.value` property must contain a fully qualified registry hostname and an explicit tag, digest, or both:

- **Digest (recommended):** `myregistry.example.com/app/worker@sha256:<digest>`
- **Tag:** `myregistry.example.com/app/worker:v1`
- **Tag and digest:** `myregistry.example.com/app/worker:v1@sha256:<digest>`

When an image reference contains both a tag and a digest, the platform pulls the image identified by the digest. The tag is descriptive.

An image reference without an explicit tag or digest isn't supported. To use the `latest` tag, specify it explicitly as `myregistry.example.com/app/worker:latest`. The API also rejects registry shorthand that omits the fully qualified registry hostname.

For a tag-only reference, the platform resolves the tag whenever it creates a worker instance. If the tag content changes without a corresponding change to `deployment.storage.value`, different image versions can run at the same time. For more information, see [Avoid updating an existing mutable tag](#avoid-updating-an-existing-mutable-tag).

### Configure the resource

The following Bicep fragment shows the `properties` shape:

```bicep
properties: {
  functionAppConfig: {
    deployment: {
      storage: {
        type: 'Registry'
        value: '<qualified-image-reference>'
        authentication: {
          type: 'SystemAssignedIdentity'
        }
      }
    }
  }
}
```

On update, preserve existing `scaleAndConcurrency` and `siteUpdateStrategy` values unless you intend to change them.

Use one of these authentication shapes:

| Authentication type | Additional fields | Usage |
|---|---|---|
| `Anonymous` | None | Pull from a registry that permits anonymous access. |
| `SystemAssignedIdentity` | None | Use the app's system-assigned identity. |
| `UserAssignedIdentity` | `userAssignedIdentityResourceId` | Use the specified user-assigned identity. |
| `Basic` | `usernameSettingName`, `passwordSettingName` | Reference app settings that contain the registry credentials. Never put credential values inline. |

When you read or update the resource:

1. Compare `deployment.storage.type` case-insensitively before reading `runtime.name` or `runtime.version`. Apps that use Registry deployment omit `runtime`.
2. Preserve `scaleAndConcurrency`, `siteUpdateStrategy`, authentication setting names, and unrecognized `functionAppConfig` fields unless you intend to change them.
3. Preserve the image reference exactly as supplied.

### Azure CLI

The preview release includes Azure CLI support. Use Azure CLI to create a Flex Consumption function app with a container image or update an eligible existing app.

The image options apply to these commands:

- `az functionapp create`
- `az functionapp deployment config set`
- `az functionapp deployment config show`
- `az functionapp show`

| Argument | Alias | Purpose |
|---|---|---|
| `--deployment-image` | None | Qualified image reference. The value is sent unchanged. |
| `--deployment-image-auth-type` | `--diat` | `Anonymous`, `SystemAssignedIdentity`, `UserAssignedIdentity`, or `Basic`. |
| `--deployment-image-identity` | `--dii` | User-assigned identity resource ID. |
| `--deployment-image-username-setting` | `--dius` | App-setting name that contains the registry username. |
| `--deployment-image-password-setting` | `--dips` | App-setting name that contains the registry password. |

#### Create a function app with a container image

Create a Flex Consumption function app that uses its system-assigned identity to pull the image from Azure Container Registry:

```azurecli
az functionapp create -g <RESOURCE_GROUP> -n <APP_NAME> -s <STORAGE_ACCOUNT> \
  --flexconsumption-location <REGION> \
  --deployment-image <REGISTRY>/<REPOSITORY>@sha256:<DIGEST> \
  --deployment-image-auth-type SystemAssignedIdentity \
  --assign-identity [system] --role AcrPull --scope <ACR_RESOURCE_ID>
```

#### Update an existing function app to use a container image

Switch an eligible Flex Consumption function app from `BlobContainer` to `Registry` with a user-assigned identity:

```azurecli
az functionapp deployment config set -g <RESOURCE_GROUP> -n <APP_NAME> \
  --deployment-image <REGISTRY>/<REPOSITORY>:<TAG> \
  --deployment-image-auth-type UserAssignedIdentity \
  --deployment-image-identity <IDENTITY_RESOURCE_ID>
```

Change an existing app that uses Registry deployment to Basic authentication by referencing credential app settings:

```azurecli
az functionapp deployment config set -g <RESOURCE_GROUP> -n <APP_NAME> \
  --deployment-image-auth-type Basic \
  --deployment-image-username-setting REGISTRY_USERNAME \
  --deployment-image-password-setting REGISTRY_PASSWORD
```

The CLI sends the image reference unchanged for service validation. Basic authentication accepts setting names, not credential values. Configure registry identity and role assignments separately by using options such as `--assign-identity`, `--role`, and `--scope`.

Runtime options don't apply to apps that use Registry deployment. The show commands return the registry configuration and authentication setting names, but never registry credentials.

## Verify deployment and first invocation

After deployment, validate the container image and platform integration in Azure:

1. Confirm that the app references the intended image tag or digest.
2. Confirm that the platform can authenticate to the registry and pull the image.
3. Confirm that the worker process starts and becomes ready.
4. Confirm that the expected functions and triggers are discovered.
5. Invoke a representative function.
6. Verify that the required OS-level dependency is exercised.
7. Review application telemetry for startup and invocation failures.

## HTTP and non-HTTP triggers

During preview, a Flex Consumption function app that uses a container image supports the same HTTP and non-HTTP triggers as a code-package Flex Consumption app, except Durable Functions and the Azure Service Bus extension.

## Update and roll back an image

Use an immutable digest for predictable deployments and rollback. If you use tags, assign a new tag to each image version instead of overwriting a tag that's already in use.

To update application code, the Functions worker, language runtime, base OS, OS packages, or application dependencies:

1. Update the explicit component versions in the image source.
2. Rebuild the image.
3. Run source-level tests and image build and security checks.
4. Push the new image and record its digest or assign it a new tag.
5. Update the Flex Consumption function app to reference the new image.
6. Verify startup, trigger discovery, and representative invocations.

Microsoft doesn't silently patch an image that you already built. Monitor the upstream sources for your base image and dependencies, and rebuild when updates are required.

### Platform rollout, drain, and rollback behavior

When you update the function app to reference a different image digest or tag, the update starts to propagate and triggers the following actions:

- New worker instances use the updated image.
- The platform identifies the triggers in the updated image and updates the app's registered triggers.
- Existing instances stop accepting new invocations and begin draining without waiting for the updated image to start or complete trigger discovery.
- The platform allows HTTP requests and non-HTTP function executions that are already running to finish, up to the platform termination grace period.

These actions occur in parallel. Trigger discovery doesn't have to finish before the existing instances begin draining.

> [!IMPORTANT]
> An image update doesn't have a predeployment health gate or automatic rollback. If the updated image can't be pulled, fails to start, or can't complete trigger discovery, the previous instances still drain. HTTP and non-HTTP triggers can fail until you configure a valid image.

If the function app is stopped when you update its image reference, the platform removes any existing instances and records the new reference. When you start the app, the platform uses the updated image and identifies its triggers.

### Avoid updating an existing mutable tag

Pushing a new image under the same mutable tag doesn't initiate a rollout because the image reference configured on the function app hasn't changed. Existing instances continue to use the previous image. Instances created during a later scale-out can resolve the tag to the new image, which can cause different image versions to run at the same time.

Restarting the function app drains the existing instances so that newly created instances resolve the updated tag. However, a restart doesn't rerun trigger discovery. If the updated image adds or changes functions or triggers, update the function app to reference a new digest or tag.

For predictable rollout behavior, update the function app to a new immutable digest for every release.

### Roll back an image

The platform doesn't automatically roll back an unsuccessful image update. Retain the digest of each previously validated image.

To roll back, update the function app to reference the previous working digest or tag. This update initiates trigger discovery and provisions new worker instances from the restored image.

## Logging and telemetry

Application Insights behavior and logging recommendations for Flex Consumption apps that use a container image are the same as for standard Flex Consumption and other Azure Functions hosting options.

::: zone pivot="programming-language-csharp, programming-language-python, programming-language-javascript"

For application logs and traces, instrument your function app with OpenTelemetry and send telemetry directly to Application Insights. Direct instrumentation is recommended instead of depending on the Functions host to forward application telemetry, especially as the app scales. For configuration guidance, see [Use OpenTelemetry with Azure Functions](opentelemetry-howto.md).

::: zone-end

::: zone pivot="programming-language-go"

For application logs and traces, instrument your Go function app with OpenTelemetry. The Go worker middleware exports telemetry by using OpenTelemetry Protocol (OTLP) settings. Send the telemetry to an OpenTelemetry Collector or another telemetry pipeline that forwards it to Azure Monitor. An Application Insights connection string alone isn't sufficient for Go worker telemetry. For configuration guidance, see [Use OpenTelemetry with Azure Functions](opentelemetry-howto.md).

::: zone-end

The Azure-managed platform continues to forward worker startup and function indexing errors to Application Insights. Use these errors to investigate failures that occur before a function invocation reaches your application code.

The Azure Monitor metrics experience in the Azure portal isn't supported in preview. Use Application Insights logs and traces to monitor and troubleshoot the app.

## Monitor and troubleshoot

Troubleshoot the deployment in lifecycle order:

1. **Configuration:** Confirm that the app references the intended image and authentication settings.
2. **Registry access:** Confirm that the configured identity or credentials can access the image.
3. **Networking and DNS:** Confirm that the platform can resolve and reach the registry.
4. **Image resolution and pull:** Confirm that the tag or digest exists and uses a supported format.
5. **Startup:** Confirm that the worker process starts and establishes the language-specific platform connection.
6. **Worker readiness:** Confirm that the application becomes ready.
7. **Trigger discovery and scaling:** Confirm that expected functions and triggers are discovered.
8. **Invocation:** Confirm that the worker receives invocations and can use the packaged dependency.
9. **Update or rollback:** Confirm that the app references the intended image version.

Collect the image reference, deployment time, worker version, base image, region, trigger type, and relevant correlation identifiers before contacting support. Don't include registry credentials.

## Security, patching, and maintenance responsibilities

| Area | Customer responsibility | Microsoft responsibility |
|---|---|---|
| Base Linux or language image | Select an explicit version, scan, patch, rebuild, and validate | Publish platform compatibility requirements |
| Functions language worker in the image | Specify a supported version, include it correctly, rebuild, test, and redeploy updates | Publish supported worker artifacts, release information, and samples |
| OS and application dependencies | Select, configure, license, scan, patch, and validate | Publish platform constraints |
| Application code | Build, test, scan, patch, and deploy | Operate the Azure-managed platform components that invoke the worker |
| Image provenance and registry | Apply supply-chain controls and restrict access | Support the documented registry authentication and image retrieval path |
| Functions host, routing, triggers, and scaling | Configure the app through supported interfaces | Operate and patch the Azure-managed platform |

Use least-privilege registry access, immutable image versions, vulnerability scanning, software bill of materials practices, and trusted artifact sources according to your organization's policies.

## Preview limitations

- Durable Functions isn't supported.
- The Azure Service Bus extension isn't supported.
- Availability zone support isn't available.
- Images must target Linux `amd64`.
- Preview language support is limited to .NET isolated, Python, Node.js, and Go.
- The preview currently doesn't provide a supported developer experience for running or testing the container image locally.
- The Azure Monitor metrics experience in the Azure portal isn't supported. Use logs and Application Insights for monitoring.

## Next steps

- [Learn about the Flex Consumption plan](flex-consumption-plan.md).
- [Review Linux container support in Azure Functions](container-concepts.md).
- [Monitor Azure Functions](functions-monitoring.md).
- [Review Azure Functions security concepts](security-concepts.md).
