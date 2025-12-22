---
title: Develop APIs with GitHub Copilot for Azure - API Center plugin
description: With AI assistance, API developers can use the Azure API Center plugin for GitHub Copilot for Azure to design and develop compliant APIs.
author: dlepow
ms.service: azure-api-center
ms.topic: how-to
ms.date: 09/26/2025
ms.update-cycle: 180-days
ms.author: danlep 
ms.collection: ce-skilling-ai-copilot
ms.custom: 
# Customer intent: As an API developer, I want to use my Visual Studio Code environment and GitHub Copilot for Azure to generate Open API specs from natural language prompts.
---

# Design and develop APIs using API Center plugin for GitHub Copilot for Azure

The API Center plugin for [GitHub Copilot for Azure](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azure-github-copilot) accelerates design and development of new APIs starting from natural language prompts. With AI assistance available through the API Center plugin combined with the API Center VS Code extension, simply describe your API and quickly generate an OpenAPI spec for API development that complies with your organization's standards. After you generate a compliant spec, you can register the API with your [API center](overview.md).

[!INCLUDE [vscode-extension-basic-prerequisites](includes/vscode-extension-basic-prerequisites.md)]  
* [GitHub Copilot for Azure](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azure-github-copilot) - to generate OpenAPI specification files using the Azure API Center Plugin for [GitHub Copilot for Azure](/azure/developer/github-copilot-azure/introduction)    
   
[!INCLUDE [vscode-extension-setup](includes/vscode-extension-setup.md)] 

## Make request to the @azure agent

Follow these steps to generate an OpenAPI specification using natural language prompts with GitHub Copilot for Azure:

1. If desired, set an active API style guide in the Azure API Center extension. Use the **Ctrl+Shift+P** keyboard shortcut to open the Command Palette. Type **Azure API Center: Set API Style Guide**, make a selection, and hit **Enter**. 

    If no style guide is set, the default `spectral:oas` ruleset is used. Learn more about [API specification linting](govern-apis-vscode-extension.md#api-design-conformance) using the API Center extension.
1. In the chat panel, make a request in natural language to the `@azure` agent to describe what the API does. Example:

    ```copilot-prompt
    @azure Generate an OpenAPI spec: An API that allows customers to pay for an order using various payment methods such as cash, checks, credit cards, and debit cards. Check that there are no duplicate keys.
    ```  

    Copilot is powered by AI, so surprises and mistakes are possible. For more information, see Copilot FAQs.

    The agent responds with an OpenAPI specification document.

    :::image type="content" source="media/design-api-github-copilot-azure/generate-api-specification.png" alt-text="Screenshot showing how to use @azure extension to generate an OpenAPI spec from a prompt.":::

1. Review the generated output for accuracy, completeness, and compliance with your API style guide. 

    Refine the prompt if needed to regenerate the spec, or repeat the process using a different style guide that you set in the Azure API Center extension.

    > [!TIP]
    > Effective prompts focus on an API's business requirements rather than implementation details. Shorter prompts sometimes work better than longer ones.

1. When it meets your requirements, save the generated OpenAPI specification to a file.

## Register the API in your API center

Use the Azure API Center extension for VS Code to register the API in your API center from the generated specification file. After registering the API, you can use the extension to view the API documentation, generate an HTTP client, perform further linting and analysis, and more.


1. In VS Code, select **Register your API in API Center** button in the chat panel, or select **Azure API Center: Register API** from the Command Palette.

1. Select **Manual**.

1. Select the API center to register APIs with.

1. Answer prompts with information including API title, type, version title, version lifecycle, definition title, specification name, and definition (specification) file to complete API registration.

After the API is registered, you can perform various tasks using the extension. For example, [view API documentation](discover-apis-vscode-extension.md#view-api-documentation) in the Swagger UI:

1. Expand the API Center tree view to select the definition for the API version that you registered.

1. Right-click on the definition, and select **Open API Documentation**. A new tab appears with the Swagger UI for the API definition.

:::image type="content" source="media/design-api-github-copilot-azure/view-definition-swagger-ui.png" alt-text="Screenshot of the Swagger UI in the VS Code extension.":::    

## Related content

* [Azure API Center - key concepts](key-concepts.md)
* [Build and register APIs with the Azure API Center extension for Visual Studio Code](build-register-apis-vscode-extension.md)
* [Discover and consume APIs with the Azure API Center extension for Visual Studio Code](discover-apis-vscode-extension.md)
* [Govern APIs with the Azure API Center extension for Visual Studio Code](govern-apis-vscode-extension.md)
* [Enable and view API Center portal in Visual Studio Code](enable-api-center-portal-vs-code-extension.md)
* [Overview of GitHub Copilot for Azure](/azure/developer/github-copilot-azure/introduction)

