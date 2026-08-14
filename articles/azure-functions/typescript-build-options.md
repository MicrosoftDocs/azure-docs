---
title: Build and deploy TypeScript apps in Azure Functions
description: Understand how to build and deploy your TypeScript code projects to Azure Functions, including local build, remote build, and custom dependencies.
ms.topic: how-to
ms.date: 07/16/2026
ms.devlang: javascript
ms.custom: 
  - functions-reference-node
  - devx-track-js
---

# Build and deploy TypeScript Azure Functions apps

Azure Functions supports multiple build options for publishing your TypeScript apps to Azure. Choose your build method based on your local environment, app dependencies, TypeScript compilation requirements, and runtime needs.

## Choosing a build method

| Factor | [Local build](#local-build) (recommended) | [Remote build](#remote-build) |
| --- | --- | --- |
| Best for | Complex builds, monorepos, custom tooling | Simple projects, quick deploys |
| Package size | Larger (includes `node_modules`) | Smaller (dependencies installed in Azure) |
| TypeScript compilation | You compile locally | Azure compiles automatically |
| Native binary compatibility | You must match the target architecture | Handled automatically (Linux x64) |
| Build timeout risk | None (runs on your machine) | Possible for large dependency sets |
| Control | Full (any build tool, bundler, optimizer) | Limited to platform defaults |

For private npm packages or custom registries, see [Custom dependencies](#custom-dependencies).

## Package your app for deployment

When deploying your TypeScript function app to Azure, your deployment package must meet these requirements:

- **JavaScript output required**: Azure Functions runs JavaScript, so TypeScript must be compiled before or during deployment.
- **Root-level `host.json`**: Ensure a single `host.json` file is at the root of the deployment package, not nested in a subfolder.
- **`package.json` `main` field**: The Functions runtime reads this field at startup to locate and index your functions. It must point to your compiled JavaScript entry point (for example, `dist/src/index.js`).
- **Exclude development files**: Use a `.funcignore` file to exclude unnecessary files from deployment, as in this example:

  ```text
  .git/
  .vscode/
  local.settings.json
  test/
  .env
  tsconfig.json
  src/
  node_modules/
  ```

Also keep these trade-offs in mind when planning your deployment:

- **Build environment must match production**: Dependencies with native binaries must be built for Linux x64 architecture. [Remote build](#remote-build) handles this automatically; for [local build](#local-build), consider using Docker or a containerized build environment.
- **Deployment package size affects cold start**: Large dependency sets increase cold start latency because the runtime must load each file individually. Bundling your app into fewer files with tools like esbuild or webpack can significantly reduces startup time.
- **Remote build has timeout limits**: If dependency installation or TypeScript compilation exceeds platform limits, the build fails. Use a [local build](#local-build) with prebuilt dependencies for large projects.
- **Module initialization has time limits**: Node.js module loading and function indexing during startup are time-bound. Reduce top-level imports or use dynamic imports when possible.

## Local build

If you don't explicitly request a remote build, your machine installs dependencies and compiles TypeScript. You then package and deploy the entire compiled project and dependencies locally to your function app. 

Local build results in a larger package upload but gives you complete control over the build process and ensures compatibility with your development environment.

For TypeScript projects that use local build:

1. **Precompile TypeScript**: Compile your TypeScript code locally before deployment.
1. **Install dependencies**: Run `npm install` or `yarn install` to install dependencies locally.
1. **Build verification**: Ensure your build outputs work correctly in your local environment.
1. **Deploy compiled output**: Deploy the compiled JavaScript along with dependencies.

Example build commands for local build:

```bash
# Install dependencies
npm install

# Compile TypeScript
npm run build
# or
tsc

# Deploy with local build (no remote compilation)
func azure functionapp publish <APP_NAME> --no-build
```

You can configure the following tools to use local build:
- [**Azure Functions Core Tools**](./functions-run-local.md): use [`func azure functionapp publish`](./functions-core-tools-reference.md#func-azure-functionapp-publish) with the `--no-build` flag.
- [**AZ CLI**](/cli/azure/functionapp): [`az functionapp deployment source config-zip`](/cli/azure/functionapp/deployment/source#az-functionapp-deployment-source-config-zip) 
- [**Continuous delivery by using GitHub Actions**](./functions-how-to-github-actions.md): set the `remote-build` parameter to `false` for the Flex Consumption plan or set `scm-do-build-during-deployment` and `enable-oryx-build` to `false` for Dedicated plans.

## Remote build

When you use [remote build](./functions-deployment-technologies.md#remote-build), the Functions platform handles package installation, TypeScript compilation, and ensures compatibility with the remote runtime environment. 

By using remote build, you get a smaller deployment package because you don't need to include `node_modules` or compiled JavaScript files.

When you deploy TypeScript projects by using remote build:

1. **Automatic detection**: The platform detects TypeScript projects by the presence of `tsconfig.json`.
1. **Compilation**: The platform compiles TypeScript files by using your project's TypeScript configuration.
1. **Dependency installation**: The platform installs both `dependencies` and `devDependencies` from `package.json`, since build-time packages like `typescript` are needed for compilation.
1. **Optimization**: The platform includes only necessary files in the final deployment package.

You can use remote build when you publish your TypeScript app by using these tools:

- [**Azure Functions Core Tools**](./functions-run-local.md): the [`func azure functionapp publish`](./functions-core-tools-reference.md#func-azure-functionapp-publish) command requires the `--build-remote=true` flag to enable remote build for Node.js apps.
- [**AZ CLI**](/cli/azure/functionapp): [`az functionapp deployment source config-zip`](/cli/azure/functionapp/deployment/source#az-functionapp-deployment-source-config-zip) requires the `--build-remote=true` flag to enable remote build for Node.js apps.
- [**Visual Studio Code**](./functions-develop-vs-code.md): the **Azure Functions: Deploy to Azure...** command always uses a remote build.
- [**Continuous delivery by using GitHub Actions**](./functions-how-to-github-actions.md): the **Azure/functions-action@v1** action uses remote build when the `remote-build` parameter is set to `true` for the Flex Consumption plan or when `scm-do-build-during-deployment` and `enable-oryx-build` are set to `true` for Dedicated plans.

To enable remote build for other scenarios, like [**Continuous delivery with Azure Pipelines**](./functions-how-to-azure-devops.md), see [Enabling Remote Build](./functions-deployment-technologies.md#remote-build).


## Custom dependencies

Azure Functions supports custom and private npm dependencies by using custom npm registries, private packages, or local packages.

### Remote build with custom npm registry

When your private packages are available in a custom npm registry, you can request a remote build after configuring the registry location. 

To use a custom registry, create an `.npmrc` file in your project root:

```ini
registry=https://your-private-registry.com/
//your-private-registry.com/:_authToken=${NPM_TOKEN}
```

### Local packages and private modules

Local packages and private modules are supported when building TypeScript Azure Function apps.

To include local packages using [remote build](#remote-build), reference them in your `package.json` file:

```json
{
  "dependencies": {
    "@azure/functions": "^4.0.0",
    "my-private-package": "file:../my-private-package",
    "another-local-package": "file:./packages/local-lib"
  }
}
```

To include local dependencies using [local build](#local-build), install the dependencies locally and deploy with remote build disabled:

```bash
# Install all dependencies including local ones
npm install

# Build your TypeScript project
npm run build

# Publish with local build
func azure functionapp publish <APP_NAME> --no-build
```

### Use workspace packages

For monorepo or npm workspace setups, reference shared packages by using npm workspaces in your `package.json` file:

```json
{
  "name": "functions-app",
  "dependencies": {
    "@azure/functions": "^4.0.0",
    "@mycompany/shared-lib": "workspace:*"
  },
  "workspaces": [
    "packages/*"
  ]
}
```

### Bundle before deployment

Use bundling tools like webpack, esbuild, or rollup to create a single bundle before deployment:

```bash
# Bundle your application
npm run bundle

# Deploy the bundled output
func azure functionapp publish <APP_NAME> --no-build
```

## Related articles

- [Azure Functions developer reference guide for Node.js apps](functions-reference-node.md)
- [Deployment technologies in Azure Functions](functions-deployment-technologies.md)
- [Work with Azure Functions Core Tools](functions-run-local.md)

[`NPM_REGISTRY_URL`]: ./functions-app-settings.md#npm_registry_url