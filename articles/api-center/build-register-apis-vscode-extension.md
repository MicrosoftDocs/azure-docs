---
title: Build and register APIs - VS Code extension
description: API developers can use the Azure API Center extension for Visual Studio Code to build and register APIs in their organization's API center.
author: dlepow
ms.service: azure-api-center
ms.topic: how-to
ms.date: 11/08/2024
ms.author: danlep 
ms.collection: ce-skilling-ai-copilot
ms.custom: 
# Customer intent: As an API developer, I want to use my Visual Studio Code environment to register APIs in my organization's API center as part of my development workflow.
---

# Build and register APIs with the Azure API Center extension for Visual Studio Code

API producer developers in your organization can build and register APIs in your [API center](overview.md) inventory by using the Azure API Center extension for Visual Studio Code. API developers can:

* Add an existing API to an API center as a one-time operation, or integrate a development pipeline to register APIs as part of a CI/CD workflow.
* Use GitHub Copilot to generate new OpenAPI specs from API code.
* Use natural language prompts with the API Center plugin for GitHub Copilot for Azure to create new OpenAPI specs.

API consumer developers can also take advantage of features in the extension to [discover and consume APIs](discover-apis-vscode-extension.md) in the API center and ensure [API governance](govern-apis-vscode-extension.md).

[!INCLUDE [vscode-extension-basic-prerequisites](includes/vscode-extension-basic-prerequisites.md)]  

The following Visual Studio Code extensions are needed for the specified scenarios:

* [GitHub Actions](https://marketplace.visualstudio.com/items?itemName=GitHub.vscode-github-actions) - to register APIs using a CI/CD pipeline with GitHub Actions
* [Azure Pipelines](https://marketplace.visualstudio.com/items?itemName=ms-azure-devops.azure-pipelines) - to register APIs using a CI/CD pipeline with Azure Pipelines
* [GitHub Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot) - to generate OpenAPI specification files from API code
* [GitHub Copilot for Azure](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azure-github-copilot) - to generate OpenAPI specification files using the Azure API Center Plugin for [GitHub Copilot for Azure](/azure/developer/github-copilot-azure/introduction) (preview)
   
[!INCLUDE [vscode-extension-setup](includes/vscode-extension-setup.md)]  

## Register an API - step by step

The following steps register an API in your API center as a one-time operation.

1. Use the **Ctrl+Shift+P** keyboard shortcut to open the Command Palette. Type **Azure API Center: Register API** and hit **Enter**.
1. Select **Manual**.
1. Select the API center to register APIs with.
1. Answer prompts with information including API title, type, version title, version lifecycle, definition title, specification name, and definition file to complete API registration. 

The API is added to your API center inventory.

## Register APIs - CI/CD pipeline

The following steps register an API in your API center with a CI/CD pipeline. With this option, add a preconfigured GitHub or Azure DevOps pipeline to your active Visual Studio Code workspace that is run as part of a CI/CD workflow on each commit to source control. It's recommended to inventory APIs with your API center using CI/CD to ensure API metadata including specification and version stay current in your API center as the API continues to evolve over time.

1. Use the **Ctrl+Shift+P** keyboard shortcut to open the Command Palette. Type **Azure API Center: Register API** and hit **Enter**.
1. Select **CI/CD**.
1. Select either **GitHub** or **Azure DevOps**, depending on your preferred source control mechanism. A Visual Studio Code workspace must be open for the Azure API Center extension to add a pipeline to your workspace. After the file is added, complete steps documented in the CI/CD pipeline file itself to configure required environment variables and identity. On push to source control, the API is registered in your API center.

Learn more about setting up a [GitHub Actions workflow](register-apis-github-actions.md) to register APIs with your API center.

## Generate OpenAPI spec from API code 
 
Use the power of [GitHub Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot) with the Azure API Center extension for Visual Studio Code to create an OpenAPI specification file from your API code. Right-click on the API code, select **Copilot** from the options, and select **Generate API documentation**. GitHub Copilot creates an OpenAPI specification file.

> [!NOTE]
> This feature is available in the pre-release version of the API Center extension.

:::image type="content" source="media/build-register-apis-vscode-extension/generate-api-documentation.gif" alt-text="Animation showing how to use GitHub Copilot to generate an OpenAPI spec from code." lightbox="media/build-register-apis-vscode-extension/generate-api-documentation.gif":::

After generating the OpenAPI specification file and checking for accuracy, you can register the API with your API center using the **Azure API Center: Register API** command.

## Generate OpenAPI spec using natural language prompts

The API Center plugin for [GitHub Copilot for Azure](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azure-github-copilot) (preview) helps you design new APIs starting from natural language prompts. With AI assistance, quickly generate an OpenAPI spec for API development that complies with your organization's standards.

> [!NOTE]
> This feature is available in the pre-release version of the API Center extension.

1. If desired, set an active API style guide. Use the **Ctrl+Shift+P** keyboard shortcut to open the Command Palette. Type **Azure API Center: Set API Style Guide**, make a selection, and hit **Enter**. 

    If no style guide is set, the default `spectral:oas` ruleset is used.
1. In the chat panel, make a request in natural language to the `@azure` agent to describe what the API does. Example:

    ```vscode
    @azure Generate OpenAPI spec: An API that allows customers to pay for an order using various payment methods such as cash, checks, credit cards, and debit cards.
    ```  

    The agent responds with an OpenAPI specification document.

    :::image type="content" source="media/build-register-apis-vscode-extension/generate-api-specification.png" alt-text="Screenshot showing how to use @azure extension to generate an OpenAPI spec from a prompt.":::


1. Review the generated output for accuracy and compliance with your API style guide. Refine the prompt if needed to regenerate.

    > [!TIP]
    > Effective prompts focus on an API's business requirements rather than implementation details. Shorter prompts sometimes work better than longer ones.
1. When it meets your requirements, save the generated OpenAPI specification to a file. 
1. Register the API with your API center. Select **Register your API in API Center** button in the chat panel, or select **Azure API Center: Register API** from the Command Palette, and follow the prompts.

## Related content

* [Azure API Center - key concepts](key-concepts.md)
* [Discover and consume APIs with the Azure API Center extension for Visual Studio Code](discover-apis-vscode-extension.md)
* [Govern APIs with the Azure API Center extension for Visual Studio Code](govern-apis-vscode-extension.md)
* [Enable and view platform API catalog in Visual Studio Code](enable-platform-api-catalog-vscode-extension.md)
* [Overview of GitHub Copilot for Azure](/azure/developer/github-copilot-azure/introduction)

