---
title: Build and register APIs - Azure API Center - VS Code extension
description: API developers can use the Azure API Center extension for Visual Studio Code to build and register APIs in their organization's API center.
author: dlepow
ms.service: azure-api-center
ms.topic: how-to
ms.date: 10/02/2024
ms.author: danlep 
ms.custom: 
# Customer intent: As an API developer, I want to use my Visual Studio Code environment to register APIs in my organization's API center as part of my development workflow.
---

# Build and register APIs with the Azure API Center extension for Visual Studio Code

API developers in your organization can build and register APIs in your [API center](overview.md) inventory by using the Azure API Center extension for Visual Studio Code. API developers can:

* Add an existing API to an API center as a one-time operation, or integrate a development pipeline to register APIs as part of a CI/CD workflow.
* Generate OpenAPI specification files from API code using GitHub Copilot, and register the API to an API center.

[!INCLUDE [vscode-extension-basic-prerequisites](includes/vscode-extension-basic-prerequisites.md)]  

The following Visual Studio Code extensions is optional and needed only for the specified scenario:

* [GitHub Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot) - to generate OpenAPI specification files from API code
   
[!INCLUDE [vscode-extension-setup](includes/vscode-extension-setup.md)]  

## Register an API - step by step

The following steps register an API in your API center as a one-time operation.

1. Use the **Ctrl+Shift+P** keyboard shortcut to open the Command Palette. Type **Azure API Center: Register API** and hit **Enter**.
1. Select **Manual**.
1. Select the API center to register APIs with.
1. Answer prompts with information including API title, type, version title, version lifecycle, definition title, specification name, and definition file to complete API registration. 

The API is added to your API center inventory.

## Register APIs - CI/CD pipeline

The following steps register an API in your API center with a CI/CD pipeline. It's recommended to inventory APIs with your API center using CI/CD to ensure API metadata including specification and version stay current in your API center as the API continues to evolve over time.

1. Use the **Ctrl+Shift+P** keyboard shortcut to open the Command Palette. Type **Azure API Center: Register API** and hit **Enter**.
1. Select **CI/CD**.
1.  adds a preconfigured GitHub or Azure DevOps pipeline to your active Visual Studio Code workspace that is run as part of a CI/CD workflow on each commit to source control. It's recommended to inventory APIs with your API center using CI/CD to ensure API metadata including specification and version stay current in your API center as the API continues to evolve over time.
1. Select either **GitHub** or **Azure DevOps**, depending on your preferred source control mechanism. A Visual Studio Code workspace must be open for the Azure API Center extension to add a pipeline to your workspace. After the file is added, complete steps documented in the CI/CD pipeline file itself to configure Azure Pipeline/GitHub Action environment variables and identity. On push to source control, the API will be registered in your API center.

    Learn more about setting up a [GitHub Actions workflow](register-apis-github-actions.md) to register APIs with your API center.

## Generate OpenAPI specification file from API code 
 
Use the power of GitHub Copilot with the Azure API Center extension for Visual Studio Code to create an OpenAPI specification file from your API code. Right-click on the API code, select **Copilot** from the options, and select **Generate API documentation**. This will create an OpenAPI specification file.

> [!NOTE]
> This feature is available in the pre-release version of the API Center extension.

:::image type="content" source="media/build-register-apis-vscode-extension/generate-api-documentation.gif" alt-text="Animation showing how to use GitHub Copilot to generate an OpenAPI spec from code." lightbox="media/build-register-apis-vscode-extension/generate-api-documentation.gif":::

After generating the OpenAPI specification file and checking for accuracy, you can register the API with your API center using the **Azure API Center: Register API** command.


## Related content

* [Azure API Center - key concepts](key-concepts.md)
* [Discover and consume APIs with the Azure API Center extension for Visual Studio Code](discover-apis-vscode-extension.md)
* [Govern APIs with the Azure API Center extension for Visual Studio Code](govern-apis-vscode-extension.md)
* [Enable and view platform API catalog in Visual Studio Code](enable-platform-api-catalog-vscode-extension.md)

