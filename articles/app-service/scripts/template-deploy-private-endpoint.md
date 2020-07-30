---
title: 'With this Azure Resource Manager Template, you will be able to deploy Private Endpoint for Web App.'
description: Learn how to use ARM Template to deploy Private Endpoint for your Web App
author: ericgre
ms.assetid: 49e460d0-7759-4ceb-b5a4-f1357e4fde56
ms.topic: sample
ms.date: 07/08/2020
ms.author: ericg
ms.service: app-service
ms.workload: web
---

# Create an App Service app and deploy Private Endpoint using Azure Resource Manager template

In this quickstart, you use an Azure Resource Manager template to create a Web App and expose it with a private endpoint.

[!INCLUDE [About Azure Resource Manager](../../../includes/resource-manager-quickstart-introduction.md)]

## Prerequisite

You need an Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Create a private endpoint

This template creates a Private Endpoint for an Azure Web App.

### Review the template

:::code language="json" source="~/quickstart-templates/101-private-endpoint-webapp/azuredeploy.json" :::

### Deploy the template

Here's how to deploy the Azure Resource Manager template to Azure:

1. To sign in to Azure and open the template, select **Deploy to Azure**. The template creates the VNet, the Web App, the Private Endpoint, and the private DNS zone.

   [Deploy to Azure](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-private-endpoint-webapp%2Fazuredeploy.json)

2. Select or create your resource group.
3. Type the name of your Web App, App Service Plan, Private Endpoint.
5. Read the terms and conditions statement. If you agree, select I agree to the terms and conditions stated above > Purchase. The deployment can take severals minutes complete.

## Clean up resources

When you no longer need the resources that you created with the private endpoint, delete the resource group. This removes the private endpoint and all the related resources.

To delete the resource group, call the `Remove-AzResourceGroup` cmdlet:

```azurepowershell-interactive
Remove-AzResourceGroup -Name <your resource group name>
```

## Next steps

- Additional Azure Resource Manager templates for Azure App Service Web Apps can be found in the [ARM template samples](../samples-resource-manager-templates.md).
