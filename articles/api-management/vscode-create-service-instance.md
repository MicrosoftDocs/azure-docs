---
title: Create an Azure API Management instance using Visual Studio Code | Microsoft Docs
description: Visual Studio Code to create an Azure API Management instance.
ms.service: api-management
ms.workload: integration
author: erikadoyle
ms.author: edoyle
ms.topic: quickstart
ms.date: 09/14/2020
---

# Create a new Azure API Management service instance using Visual Studio Code

Azure API Management (APIM) helps organizations publish APIs to external, partner, and internal developers to unlock the potential of their data and services. API Management provides the core competencies to ensure a successful API program through developer engagement, business insights, analytics, security, and protection. APIM  enables you to create and manage modern API gateways for existing backend services hosted anywhere. For more information, see the [Overview](api-management-key-concepts.md) topic.

This quickstart describes the steps for creating a new API Management instance using the *Azure API Management Extension* for Visual Studio Code. You can also use the extension to perform common management operations on your API Management instance.

## Prerequisites

To complete this quickstart, ensure you have the following:

- [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

- [Visual Studio Code](https://code.visualstudio.com/)

- [Azure API Management](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-apimanagement&ssr=false#overview) Extension for Visual Studio Code (Preview)

## Log in to Azure


## Create an API Management service

This is a long running operation and could take up to 15 minutes.

```azurepowershell-interactive
New-AzApiManagement -ResourceGroupName "myResourceGroup" -Location "West US" -Name "apim-name" -Organization "myOrganization" -AdminEmail "myEmail" -Sku "Developer"
```

## Clean up resources

When no longer needed, you can use the [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) command to remove the resource group and all related resources.

```azurepowershell-interactive
Remove-AzResourceGroup -Name myResourceGroup
```

## Next steps

> [!div class="nextstepaction"]
> [Import and publish your first API](import-and-publish.md)
