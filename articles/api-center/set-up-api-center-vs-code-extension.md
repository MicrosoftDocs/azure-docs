---
title: Quickstart - Create an Azure API Center Using the VS Code Extension
description: Learn how to quickly create an Azure API Center resource using the Azure API Center extension for Visual Studio Code. Use the extension to build, register, govern, and discover your APIs.
author: dlepow
ms.author: danlep
ms.date: 06/25/2025
ms.topic: quickstart
---

# Quickstart: Create your API center using the Visual Studio Code extension

[!INCLUDE [quickstart-intro](includes/quickstart-intro.md)]

In this quickstart, you create an Azure API center using the [Azure API Center extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=apidev.azure-api-center). The extension provides a streamlined way to set up your API center and to build, register, govern, and discover your APIs.

[!INCLUDE [quickstart-prerequisites](includes/quickstart-prerequisites.md)]

* [Visual Studio Code](https://code.visualstudio.com/) 

* [Azure API Center extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=apidev.azure-api-center) 

[!INCLUDE [vscode-extension-setup](includes/vscode-extension-setup.md)]  

## Create an API center 

1. In the Azure API Center view, right-click your subscription and select **Create API Center Service in Azure**. 
    
    Alternatively, use the **Ctrl+Shift+P** keyboard shortcut to open the Command Palette. Type **Azure API Center: Create API Center Service in Azure** and hit **Enter**.
1. Enter a name for your API center.
1. Select a location for the resource.

 The extension will show progress and notify you when the resource is ready. The API center is created in a resource group of the same name.

## Verify your API center

Once deployment completes, refresh the Azure API Center view. Your new API center appears in the list and is ready to use.

:::image type="content" source="media/set-up-api-center-vs-code-extension/new-api-center.png" alt-text="Screenshot of an API center created in Visual Studio Code.":::

* Expand the resource to start registering APIs and explore features. Find Azure API Center commands in the Command Palette by typing **Azure API Center**.

* If you want to interact with the API center in the Azure portal, right-click the API center name and select **Open in Azure Portal**.

## Next steps

> [!div class="nextstepaction"]
* [Build and register APIs with the Azure API Center extension for Visual Studio Code](build-register-apis-vscode-extension.md)
* [Govern APIs with the Azure API Center extension for Visual Studio Code](govern-apis-vscode-extension.md)
* [Discover and consume APIs with the Azure API Center extension for Visual Studio Code](discover-apis-vscode-extension.md)


