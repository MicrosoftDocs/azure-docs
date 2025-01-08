---
title: Discover APIs - VS Code extension
description: API developers can use the Azure API Center extension for Visual Studio Code to discover APIs in their organization's API center.
author: dlepow
ms.service: azure-api-center
ms.topic: how-to
ms.date: 10/16/2024
ms.author: danlep 
ms.custom: 
# Customer intent: As an API developer, I want to use my Visual Studio Code environment to discover and consume APIs in my organizations API center.
---

# Discover and consume APIs with the Azure API Center extension for Visual Studio Code

API developers in your organization can discover and consume APIs in your [API center](overview.md) by using the Azure API Center extension for Visual Studio Code. The extension provides the following features:

* **Discover APIs** - Browse the APIs in your API center, and view their details and documentation.

* **Consume APIs** - Generate API SDK clients in their favorite language including JavaScript, TypeScript, .NET, Python, and Java, using the Microsoft Kiota engine that generates SDKs for Microsoft Graph, GitHub, and more. 

API developers can also take advantage of features in the extension to [register APIs](build-register-apis-vscode-extension.md) in the API center and ensure [API governance](govern-apis-vscode-extension.md).

> [!TIP]
> If you want enterprise app developers to discover APIs in a centralized location, optionally enable a [platform API catalog](enable-platform-api-catalog-vscode-extension.md) for your API center in Visual Studio Code. The platform API catalog is a read-only view of the API inventory.

[!INCLUDE [vscode-extension-basic-prerequisites](includes/vscode-extension-basic-prerequisites.md)]  
    
* [REST client extension](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) - to send HTTP requests and view the responses in Visual Studio Code directly
* [Microsoft Kiota extension](https://marketplace.visualstudio.com/items?itemName=ms-graph.kiota) - to generate API clients

[!INCLUDE [vscode-extension-setup](includes/vscode-extension-setup.md)]   

## Discover APIs

API center resources appear in the tree view on the left-hand side. Expand an API center resource to see APIs, versions, definitions, environments, and deployments.

:::image type="content" source="media/discover-apis-vscode-extension/explore-api-centers.png" alt-text="Screenshot of API Center tree view in Visual Studio Code." lightbox="media/discover-apis-vscode-extension/explore-api-centers.png":::

Search for APIs within an API Center by using the search icon shown in the **Apis** tree view item.

## View API documentation

You can view the documentation for an API definition in your API center and try API operations. This feature is only available for OpenAPI-based APIs in your API center.

1. Expand the API Center tree view to show an API definition. 
1. Right-click on the definition, and select **Open API Documentation**. A new tab appears with the Swagger UI for the API definition.

    :::image type="content" source="media/discover-apis-vscode-extension/view-api-documentation.png" alt-text="Screenshot of API documentation in Visual Studio Code." lightbox="media/discover-apis-vscode-extension/view-api-documentation.png":::

1. To try the API, select an endpoint, select **Try it out**, enter required parameters, and select **Execute**.

    > [!NOTE]
    > Depending on the API, you might need to provide authorization credentials or an API key to try the API.

    > [!TIP]
    > Using the pre-release version of the extension, you can generate API documentation in Markdown, a format that's easy to maintain and share with end users. Right-click on the definition, and select **Generate Markdown**.

## Generate HTTP file

You can view a `.http` file based on the API definition in your API center. If the REST Client extension is installed, you can make requests directory from the Visual Studio Code editor. This feature is only available for OpenAPI-based APIs in your API center.

1. Expand the API Center tree view to show an API definition. 
1. Right-click on the definition, and select **Generate HTTP File**. A new tab appears that renders a .http document populated by the API specification.

    :::image type="content" source="media/discover-apis-vscode-extension/generate-http-file.png" alt-text="Screenshot of generating a .http file in Visual Studio Code." lightbox="media/discover-apis-vscode-extension/generate-http-file.png":::

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
    
        :::image type="content" source="media/discover-apis-vscode-extension/generate-api-client.png" alt-text="Screenshot of Kiota OpenAPI Explorer in Visual Studio Code." lightbox="media/discover-apis-vscode-extension/generate-api-client.png":::
    
The client is generated.

For details on using the Kiota extension, see [Microsoft Kiota extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-graph.kiota).

## Export API specification

You can export an API specification from a definition and then download it as a file.

To export a specification in the extension's tree view:

1. Expand the API Center tree view to show an API definition.    
1. Right-click on the definition, and select **Export API Specification Document**. A new tab appears that renders an API specification document.

    :::image type="content" source="media/discover-apis-vscode-extension/export-specification.png" alt-text="Screenshot of exporting API specification in Visual Studio Code." lightbox="media/discover-apis-vscode-extension/export-specification.png":::

You can also export a specification using the Command Palette:

1. Type the **Ctrl+Shift+P** keyboard shortcut to open the Command Palette. 
1. Select **Azure API Center: Export API Specification Document**.
1. Make selections to navigate to an API definition. A new tab appears that renders an API specification document.

## Related content

* [Azure API Center - key concepts](key-concepts.md)
* [Build and register APIs with the Azure API Center extension for Visual Studio Code](build-register-apis-vscode-extension.md)
* [Govern APIs with the Azure API Center extension for Visual Studio Code](govern-apis-vscode-extension.md)
* [Enable and view platform API catalog in Visual Studio Code](enable-platform-api-catalog-vscode-extension.md)

