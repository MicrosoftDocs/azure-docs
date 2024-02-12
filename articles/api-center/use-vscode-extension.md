---
title: Use Visual Studio Code extension - Azure API Center
description: Discover, try, and consume APIs from your Azure API center using the API Center extension for Visual Studio Code (preview)
author: dlepow
ms.service: api-center
ms.topic: how-to
ms.date: 01/24/2024
ms.author: danlep 
ms.custom: 
# Customer intent: As a developer, I want to use my Visual Studio Code environment to discover, try, and consume APIs in my organization's API center.
---

# Get started with the Azure API Center extension for Visual Studio Code (preview)

To discover, try, and consume APIs in your [API center](overview.md), you can use the Azure API Center extension in your Visual Studio Code development environment:

* **Discover APIs** - Browse the APIs in your API center, and view their details and documentation.

* **Try APIs** - Use Swagger UI or REST client to explore API requests and responses. 

* **Consume APIs** - Generate API SDK clients for your favorite language including JavaScript, TypeScript, .NET, Python, and Java, using the Microsoft Kiota engine that generates SDKs for Microsoft Graph, GitHub, and more. 

> [!NOTE]
> The API Center extension for Visual Studio Code is in preview. Learn more about the [extension preview](https://marketplace.visualstudio.com/items?itemName=apidev.azure-api-center).

## Prerequisites

* One or more API centers in your Azure subscription. If you haven't created one already, see [Quickstart: Create your API center](set-up-api-center.md).

    Currently, you need to be assigned the Contributor role or higher permissions to access API centers with the extension.

* [Visual Studio Code](https://code.visualstudio.com/)
    
* [Azure API Center extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=apidev.azure-api-center)
    
The following Visual Studio Code extensions are optional and needed only for certain scenarios as indicated:

* [REST client extension](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) - to send HTTP requests and view the responses in Visual Studio Code directly
* [Microsoft Kiota extension](https://marketplace.visualstudio.com/items?itemName=ms-graph.kiota) - to generate API clients

    
## Setup

1. Install the Azure API Center extension for Visual Studio Code from the [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=apidev.azure-api-center). Install optional extensions as needed.
1. In Visual Studio Code, in the Activity Bar on the left, select API Center.
1. If you're not signed in to your Azure account, select **Sign in to Azure...**, and follow the prompts to sign in. 
    Select an Azure account with the API center (or API centers) you wish to view APIs from. You can also filter on specific subscriptions if you have many to view from.

## Discover APIs

Your API center resources appear in the tree view on the left-hand side. Expand an API center resource to see APIs, versions, definitions, environments, and deployments.

:::image type="content" source="media/use-vscode-extension/explore-api-centers.png" alt-text="Screenshot of API Center tree view in Visual Studio Code." lightbox="media/use-vscode-extension/explore-api-centers.png":::

> [!NOTE]
> Currently, all APIs and other entities shown in the tree view are read-only. You can't create, update, or delete entities in an API center from the extension.


## View API documentation

You can view the documentation for an API definition in your API center and try API operations. This feature is only available for OpenAPI-based APIs in your API center.

1. Expand the API Center tree view to show an API definition. 
1. Right-click on the definition, and select **Open API Documentation**. A new tab appears with the Swagger UI for the API definition.

    :::image type="content" source="media/use-vscode-extension/view-api-documentation.png" alt-text="Screenshot of API documentation in Visual Studio Code." lightbox="media/use-vscode-extension/view-api-documentation.png":::

1. To try the API, select an endpoint, select **Try it out**, enter required parameters, and select **Execute**.

    > [!NOTE]
    > Depending on the API, you might need to provide authorization credentials or an API key to try the API.

## Generate HTTP file

You can view a `.http` file based on the API definition in your API center. If the REST Client extension is installed, you can make requests directory from the Visual Studio Code editor. This feature is only available for OpenAPI-based APIs in your API center.

1. Expand the API Center tree view to show an API definition. 
1. Right-click on the definition, and select **Generate HTTP File**. A new tab appears that renders a .http document populated by the API specification.

    :::image type="content" source="media/use-vscode-extension/generate-http-file.png" alt-text="Screenshot of generating a .http file in Visual Studio Code." lightbox="media/use-vscode-extension/generate-http-file.png":::

1. To make a request, select an endpoint, and select **Send Request**.

    > [!NOTE]
    > Depending on the API, you might need to provide authorization credentials or an API key to make the request.

## Generate API client

Use the Microsoft Kiota extension to generate an API client for your favorite language. This feature is only available for OpenAPI-based APIs in your API center.

1. Expand the API Center tree view to show an API definition.    
1. Right-click on the definition, and select **Generate API Client**. The **Kiota OpenAPI Generator** pane appears.
1. Select the API endpoints and HTTP operations you wish to include in your SDKs.
1. Select **Generate API client**.
    1. Enter configuration details about the SDK name, namespace, and output directory.
    1. Select the language for the generated SDK.
    
        :::image type="content" source="media/use-vscode-extension/generate-api-client.png" alt-text="Screenshot of Kiota OpenAPI Explorer in Visual Studio Code." lightbox="media/use-vscode-extension/generate-api-client.png":::
    
The client is generated.

For details on using the Kiota extension, see [Microsoft Kiota extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-graph.kiota).


  ## Related content

* [Azure API Center - key concepts](key-concepts.md)
* [Discover APIs with GitHub Copilot Chat and Azure API Center extension for Visual Studio Code](use-vscode-extension-copilot.md)