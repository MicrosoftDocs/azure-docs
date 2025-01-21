---
title: Generate OpenAI spec with GitHub Copilot for Azure - API Center plugin
description: API developers can use the Azure API Center plugin for GitHub Copilot for Azure to generate an OpenAPI spec with AI assistance starting from natural language prompts.
author: dlepow
ms.service: azure-api-center
ms.topic: how-to
ms.date: 01/21/2025
ms.author: danlep 
ms.collection: ce-skilling-ai-copilot
ms.custom: 
# Customer intent: As an API developer, I want to use my Visual Studio Code environment and GitHub Copilot for Azure to generate Open API specs from natural language prompts.
---

# Generate OpenAPI spec using natural language prompts

The API Center plugin for [GitHub Copilot for Azure](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azure-github-copilot) (preview) accelerates design of new APIs starting from natural language prompts. With AI assistance, quickly generate an OpenAPI spec for API development that complies with your organization's standards. After you generate a compliant spec, you can register the API with your [API center](overview.md).

> [!NOTE]
> This feature is available in the pre-release version of the API Center extension.

[!INCLUDE [vscode-extension-basic-prerequisites](includes/vscode-extension-basic-prerequisites.md)]  
* [GitHub Copilot for Azure](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azure-github-copilot) - to generate OpenAPI specification files using the Azure API Center Plugin for [GitHub Copilot for Azure](/azure/developer/github-copilot-azure/introduction) (preview)
   
[!INCLUDE [vscode-extension-setup](includes/vscode-extension-setup.md)] 

## Make request to the @azure agent

Follow these steps to generate an OpenAPI specification using natural language prompts with GitHub Copilot for Azure:

1. If desired, set an active API style guide. Use the **Ctrl+Shift+P** keyboard shortcut to open the Command Palette. Type **Azure API Center: Set API Style Guide**, make a selection, and hit **Enter**. 

    If no style guide is set, the default `spectral:oas` ruleset is used.
1. In the chat panel, make a request in natural language to the `@azure` agent to describe what the API does. Example:

    ```vscode
    @azure Generate OpenAPI spec: An API that allows customers to pay for an order using various payment methods such as cash, checks, credit cards, and debit cards.
    ```  

    The agent responds with an OpenAPI specification document.

    :::image type="content" source="media/design-api-github-copilot/generate-api-specification.png" alt-text="Screenshot showing how to use @azure extension to generate an OpenAPI spec from a prompt.":::


1. Review the generated output for accuracy, completeness, and compliance with your API style guide. Refine the prompt if needed to regenerate, or repeat the process using a new style guide.

    > [!TIP]
    > Effective prompts focus on an API's business requirements rather than implementation details. Shorter prompts sometimes work better than longer ones.
1. When it meets your requirements, save the generated OpenAPI specification to a file. 
1. Register the API with your API center. Select **Register your API in API Center** button in the chat panel, or select **Azure API Center: Register API** from the Command Palette, and follow the prompts.

## Related content

* [Azure API Center - key concepts](key-concepts.md)
* [Build and register APIs with the Azure API Center extension for Visual Studio Code](build-register-apis-vscode-extension.md)
* [Discover and consume APIs with the Azure API Center extension for Visual Studio Code](discover-apis-vscode-extension.md)
* [Govern APIs with the Azure API Center extension for Visual Studio Code](govern-apis-vscode-extension.md)
* [Enable and view platform API catalog in Visual Studio Code](enable-platform-api-catalog-vscode-extension.md)
* [Overview of GitHub Copilot for Azure](/azure/developer/github-copilot-azure/introduction)

