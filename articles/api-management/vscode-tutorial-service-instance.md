---
title: Tutorial - Create and manage APIs in API Management using Visual Studio Code | Microsoft Docs
description: In this tutorial, learn how to use the Azure API Management Extension for Visual Studio Code to import and manage APIs.
ms.service: api-management
ms.workload: integration
author: vladvino
ms.author: apimpm
ms.topic: tutorial
ms.date: 12/07/2020
---

# Tutorial: [...]


In this tutorial, you learn how to use the API Management Extension Preview for Visual Studio Code to perform common management operations on your API Management instance.

You learn how to:

> [!div class="checklist"]
> * Import an API into API Management
> * Manage the API...

## Prerequisites
- Understand [Azure API Management terminology](api-management-terminology.md).
- Ensure you have installed [Visual Studio Code](https://code.visualstudio.com/) and the [Azure API Management Extension for Visual Studio Code (Preview)](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-apimanagement&ssr=false#overview)


[IS THE CONSUMPTION SKU OK FOR THIS TUTORIAL??]

## (Optioal) Create an API Management service

If you previously used the API Management extension to [create an Azure API Management instance](gvscode-create-service-instance.md) using default settings, you can skip this step. The default settings create the instance in the Consumption SKU in the West US region.

This section shows you how to create an API Management service instance with customized settings.

1. Launch Visual Studio Code and open the Azure extension. (If you don't see the Azure icon on the Activity Bar, make sure the Azure API Management extension is enabled.)

1. If you're not already signed into Azure, select **Sign in to Azure...** to launch a browser window and sign in to your Microsoft account.

create Once you're signed in to your Microsoft account, the *Azure: API Management* explorer pane will list your Azure subscription(s).

Right-click on the subscription you'd like to use, and select **Create API Management in Azure**.

![Create API Management wizard in VS Code](./media/vscode-create-service-instance/vscode-apim-create.png)

In the pane that opens, supply a name for the new API Management instance. It must be globally unique within Azure and consist of 1-50 alphanumeric characters and/or hyphens, and start with a letter and end with an alphanumeric.

A new API Management instance (and parent resource group) will be created with the specified name. By default, the instance is created in the *West US* region with *Consumption* SKU.

> [!TIP]
> If you enable **Advanced Creation** in the *Azure API Management Extension Settings*, you can also specify an [API Management SKU](https://azure.microsoft.com/pricing/details/api-management/), [Azure region](https://status.azure.com/en-us/status), and a [resource group](../azure-resource-manager/management/overview.md) to deploy your API Management instance.
>
> While the *Consumption* SKU takes less than a minute to provision, other SKUs typically take 30-40 minutes to create.

At this point, you're ready to import and publish your first API. You can do that and also perform common API Management operations within the extension for Visual Studio Code. See the [API Management Extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-apimanagement&ssr=false#overview) documentation for more.

![Newly created API Management instance in VS Code API Management extension pane](./media/vscode-create-service-instance/vscode-apim-instance.png)

## Clean up resources

When no longer needed, remove the API Management instance by right-clicking and selecting **Open in Portal** to [delete the API Management service](get-started-create-service-instance.md#clean-up-resources) and its resource group.

Alternately, you can select **Delete API Management** to only delete the API Management instance (this operation doesn't delete its resource group).

![Delete API Management instance from VS Code](./media/vscode-create-service-instance/vscode-apim-delete.png)

## Next steps

> [!div class="nextstepaction"]
> [Import and publish your first API](import-and-publish.md)
