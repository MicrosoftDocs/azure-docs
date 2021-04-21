---
title: 'Use an Azure Resource Manager template to deploy a private endpoint for a web app'
description: Learn how to use ARM template to deploy a private endpoint for your web app.
author: ericgre
ms.assetid: 49e460d0-7759-4ceb-b5a4-f1357e4fde56
ms.topic: sample
ms.date: 07/08/2020
ms.author: ericg
ms.service: app-service
ms.workload: web 
ms.custom: devx-track-azurepowershell
---

# Create an App Service app and deploy a private endpoint by using an Azure Resource Manager template

In this quickstart, you use an Azure Resource Manager (ARM) template to create a web app and expose it with a private endpoint.

[!INCLUDE [About Azure Resource Manager](../../../includes/resource-manager-quickstart-introduction.md)]

## Prerequisite

You need an Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Create a private endpoint

This template creates a private endpoint for an Azure web app.

### Review the template

:::code language="json" source="~/quickstart-templates/101-private-endpoint-webapp/azuredeploy.json" :::

### Deploy the template

Here's how to deploy the Azure Resource Manager template to Azure:

1. To sign in to Azure and open the template, select this link:  [Deploy to Azure](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-private-endpoint-webapp%2Fazuredeploy.json). The template creates the virtual network, the web app, the private endpoint, and the private DNS zone.
2. Select or create your resource group.
3. Enter the name of your web app, Azure App Service plan, and private endpoint.
5. Read the statement about terms and conditions. If you agree, select **I agree to the terms and conditions stated above** > **Purchase**. The deployment can take several minutes to finish.

## Clean up resources

When you no longer need the resources that you created with the private endpoint, delete the resource group. This removes the private endpoint and all the related resources.

To delete the resource group, call the `Remove-AzResourceGroup` cmdlet:

```azurepowershell-interactive
Remove-AzResourceGroup -Name <your resource group name>
```

## Next steps

- You can find more Azure Resource Manager templates for Azure App Service web apps in the [ARM template samples](../samples-resource-manager-templates.md).
