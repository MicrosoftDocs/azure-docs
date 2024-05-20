---
title: Quickstart - Create Azure API Management instance - VS Code
description: Use this quickstart to create an Azure API Management instance with the API Management extension for Visual Studio Code.
ms.service: api-management
author: dlepow
ms.author: danlep
ms.topic: quickstart
ms.date: 12/12/2023
ms.custom: mode-api, devdivchpfy22
---

# Quickstart: Create a new Azure API Management instance using Visual Studio Code

[!INCLUDE [api-management-availability-premium-dev-standard-basic-consumption](../../includes/api-management-availability-premium-dev-standard-basic-consumption.md)]

This quickstart describes the steps to create a new API Management instance using the *Azure API Management Extension* for Visual Studio Code. After creating an instance, you can use the extension for common management tasks such as importing APIs in your API Management instance.

[!INCLUDE [api-management-quickstart-intro](../../includes/api-management-quickstart-intro.md)]

## Prerequisites

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

Also, ensure you've installed the following:

- [Visual Studio Code](https://code.visualstudio.com/)

- [Azure API Management Extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-apimanagement&ssr=false#overview)

## Sign in to Azure

Launch Visual Studio Code and open the Azure extension. (If you don't see the Azure icon on the Activity Bar, make sure the *Azure API Management* extension is enabled.)

Select **Sign in to Azure...** to launch a browser window and sign in to your Microsoft account.

![Sign in to Azure from the API Management extension for VS Code](./media/vscode-create-service-instance/vscode-apim-login.png)

## Create an API Management instance

Once you're signed in to your Microsoft account, the *Azure: API Management* Explorer pane will list your Azure subscription(s). You can enable and disable this Explorer pane in the  *Azure API Management Extension Settings*.

Right-click on the subscription you'd like to use, and select **Create API Management in Azure**.

![Create API Management wizard in VS Code](./media/vscode-create-service-instance/vscode-apim-create.png)

In the pane that opens, supply a name for the new API Management instance. It must be globally unique within Azure and consist of 1-50 alphanumeric characters and/or hyphens. It should also start with a letter and end with an alphanumeric character.

A new API Management instance (and parent resource group) will be created with the specified name. By default, the instance is created in the *West US* region with *Consumption* tier.

> [!TIP]
> If you enable **Advanced Creation** in the *Azure API Management Extension Settings*, you can also specify an [API Management tier](https://azure.microsoft.com/pricing/details/api-management/), Azure region, and [resource group](../azure-resource-manager/management/overview.md) to deploy your API Management instance.
>
> While the *Consumption* tier usually takes less than a minute to set up, other tiers can take up to 30-40 minutes to create.

At this point, you're ready to import and publish your first API. You can do that and also do common API Management actions within the extension for Visual Studio Code. See [the tutorial](visual-studio-code-tutorial.md) for more.

![Newly created API Management instance in VS Code API Management extension pane](./media/vscode-create-service-instance/visual-studio-code-api-management-instance-updated.png)

## Clean up resources

When no longer needed, remove the API Management instance by right-clicking and selecting **Open in Portal** to [delete the API Management service](get-started-create-service-instance.md#clean-up-resources) and its resource group.

Alternately, you can select **Delete API Management** to only delete the API Management instance. This action doesn't delete its resource group.

![Delete API Management instance from VS Code](./media/vscode-create-service-instance/visual-studio-code-api-management-delete-updated.png)

## Related content

* [Import and manage APIs using the API Management Extension](visual-studio-code-tutorial.md)
