---
title: Deploy your Python apps to Azure Functions
description: Understand how to build and deploy your Python code projects to Azure Functions.
ms.topic: how-to
ms.date: 11/10/2025
ms.devlang: python
ms.custom: 
  - py-devguide-refactor
---

# Build your Python Azure Functions apps

Azure Functions supports three build options for publishing your Python apps to Azure. Choose your build method based on your local environment, app dependencies, and runtime requirements. 

## Quick comparison for build actions

| Deployment type                                      | Where dependencies are installed             | Typical use case                                |
|------------------------------------------------------|----------------------------------------------|-------------------------------------------------|
| [Remote build](#remote-build) (recommended)          | Azure (App Service)                          | Default, recommended for most users             |
| [Local build](#local-build)                          | Your machine                                 | Linux/macOS devs, limited Windows scenarios     |
| [Custom dependencies](#custom-dependencies)          | Handled via extra index URL or local install | Non-PyPI dependencies                           |


## Deployment package considerations

When deploying your Python function app to Azure, keep these packaging requirements in mind:

- **Package contents, not the folder**: Deploy the contents of your project folder, not the folder itself.
- **Root-level `host.json`**: Ensure a single `host.json` file is at the root of the deployment package, not nested in a subfolder.
- **Exclude development files**: You can exclude folders like `tests/`, `.github/`, and `.venv*/` from the deployed package by including them in `.funcignore`.
- **The build environment must match the production environment**: Your dependencies must be built on an ubuntu machine using the same python version as the production app. [Remote build](#remote-build) handles this scenario automatically.
- **Dependencies must be installed into `./.python_packages/lib/site-packages`**: Remote build installs all dependencies listed in `requirements.txt` into the correct directory.
- **Keep deployment package size in mind**: large dependency sets increase build time, cold start latency, and module import and initialization time. Applications with large scientific or ML libraries (including `pytorch`) are especially impacted.
- **Remote build has a 60-second timeout**: If dependency installation exceeds the limit, the build fails. In that case, consider using a [local build](#local-build) and deploying with prebuilt dependencies.
- **Module import has a 2-minute time limit**: Python module loading and function indexing during startup has a 2-minute limit for Python 3.13 and above, or for older python versions with `PYTHON_ENABLE_INIT_INDEXING` enabled. If your app exceeds this, reduce top-level imports or use lazy imports (import modules inside the function body instead of at the global scope).

## Remote build
> Remote build is the recommended approach for a code-only deployment of your Python app to Functions.

With [remote build](./functions-deployment-technologies.md#remote-build), the Functions platform handles package installation and ensures compatibility with the remote 
runtime environment. Using remote build also results in a smaller deployment package.

You can use remote build when you publish your Python app using these tools: 

- [**Azure Functions Core Tools**](./functions-run-local.md): the [`func azure functionapp publish`](./functions-core-tools-reference.md#func-azure-functionapp-publish) command requests a remote build by default when publishing Python apps.
- [**AZ CLI**](/cli/azure/functionapp): [`az functionapp deployment source config-zip`](/cli/azure/functionapp/deployment/source#az-functionapp-deployment-source-config-zip) uses remote build by default when deploying Python apps.
- [**Visual Studio Code**](./functions-develop-vs-code.md): the **Azure Functions: Deploy to Azure...** command always uses a remote build.
- [**Continuous delivery by using GitHub Actions**](./functions-how-to-github-actions.md): the **Azure/functions-action@v1** action uses remote build when the `remote-build` parameter is set to `true` for the Flex Consumption plan or when 
`scm-do-build-during-deployment` and `enable-oryx-build` are set to `true` for Dedicated plans.

To enable remote build for other scenarios, like [**Continuous delivery with Azure Pipelines**](./functions-how-to-azure-devops.md), see [Enabling Remote Build](./functions-deployment-technologies.md#remote-build).

Remote build also supports custom package indexes when by using the [`PIP_EXTRA_INDEX_URL`](./functions-app-settings.md#pip_extra_index_url) app setting. For more information, see [Remote build](functions-deployment-technologies.md#remote-build).

>[!IMPORTANT]  
> Remote build installs all dependencies listed in `requirements.txt`. To ensure all required packages are installed, be sure to include those dependencies in your `requirements.txt` file.


## Local build
If you don't request a remote build, then dependencies are instead installed on your machine. The entire local project and dependencies are then packaged locally and deployed to your function app. Using local build results in a larger package upload.

You also need to install dependencies into the correct directory. Use `pip install --target="./.python_packages/lib/site-packages"` to install required dependencies into your local `.python_packages/lib/site-packages` folder.
For example, if you have your dependencies listed in a `requirements.txt` file, you can run this command:

```bash
pip install --target="./.python_packages/lib/site-packages" -r requirements.txt
```
Use local build when:

- You're developing locally on Linux or macOS.
- Remote build isn't available or is restricted.
- You want to define dependencies in a file other than `requirements.txt`, such as `pyproject.toml`.

The following tools can be configured to use local build:
- [**Azure Functions Core Tools**](./functions-run-local.md): use [`func azure functionapp publish`](./functions-core-tools-reference.md#func-azure-functionapp-publish) with the `--no-build` flag.
- [**AZ CLI**](/cli/azure/functionapp): [`az functionapp deployment source config-zip`](/cli/azure/functionapp/deployment/source#az-functionapp-deployment-source-config-zip) with the `--build-remote=false` flag.
- [**Continuous delivery by using GitHub Actions**](./functions-how-to-github-actions.md): set the `remote-build` parameter to `false` for the Flex Consumption plan or set 
`scm-do-build-during-deployment` and `enable-oryx-build` to `false` for Dedicated plans.

>[!IMPORTANT]  
>When developing your Python apps on a Windows computer, don't use local build. Packages built on a Windows computer often have issues being deployed to and running on Linux in Azure Functions. 
Only use local build if you're confident the package runs on Linux based systems.

## Custom dependencies
Azure Functions supports custom and other non-PyPI dependencies by using the [`PIP_EXTRA_INDEX_URL`] app setting or by creating a local build on a Linux or macOS computer.

### Remote build with an extra index URL
When your private packages are available online, you can request a remote build after setting the private package location by using the [`PIP_EXTRA_INDEX_URL`] app setting.
When you set [`PIP_EXTRA_INDEX_URL`], remote builds use this package feed during deployment. [`PIP_INDEX_URL`](./functions-app-settings.md#pip_index_url) replaces the package index,
so consider using [`PIP_EXTRA_INDEX_URL`] instead to prevent unexpected behavior.

### Local packages or wheels
Local packages and wheels are supported when building python Azure Function apps.

To install these packages or wheels using [remote build](#remote-build), you can include the dependencies in your `requirements.txt` file and deploy with [remote build enabled](./functions-deployment-technologies.md#remote-build).

For example, your `requirements.txt` file might look like the following snippet:
```text
 # Installing a custom wheel
 <my_package_wheel>.whl
 
 # Installing a local package
 path/to/my/package
 ```

To install these dependencies using [local build](#local-build), install the dependencies into your local `.python_packages/lib/site-packages` folder and deploy with [remote build disabled](#local-build).
For example, if you have the packages defined in your `requirements.txt` file, you can install and publish using the following commands and Core Tools:
 ```bash
 pip install --target="./.python_packages/lib/site-packages" -r requirements.txt
 func azure functionapp publish <APP_NAME> --no-build
 ```


## Related articles

- [Azure Functions Developer Reference Guide (Python)](functions-reference-python.md)
- [Deployment technologies in Azure Functions](functions-deployment-technologies.md)

[`PIP_EXTRA_INDEX_URL`]: ./functions-app-settings.md#pip_extra_index_url