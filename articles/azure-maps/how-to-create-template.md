---
title: Create your Azure Maps account using an ARM template | Microsoft Azure Maps 
description: Learn how to create an Azure Maps account using an Azure Resource Manager (ARM) template.
author: philmea
ms.author: philmea
ms.date: 10/20/2020
ms.topic: how-to
ms.service: azure-maps
---
# Create your Azure Maps account using an ARM template

You can create your Azure Maps account using an Azure Resource Manager (ARM) template. After you have an account, you can implement the APIs in your website or mobile application.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

[![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-maps-create%2Fazuredeploy.json)

## Prerequisites

To complete this article:

* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Review the template

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/101-maps-create/).

:::code language="json" source="~/quickstart-templates/101-maps-create/azuredeploy.json":::

The Azure Maps account resource is defined in this template:

* [**Microsoft.Maps/accounts**](/azure/templates/microsoft.maps/accounts): create an Azure key vault.

## Deploy the template

1. Select the following image to sign in to Azure and open a template. The template creates a key vault and a secret.

    [![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-maps-create%2Fazuredeploy.json)

2. Select or enter the following values.

    ![ARM template, Key Vault integration, deploy portal](./media/how-to-create-template/create-account-using-template-portal.png)

    Unless it's specified, use the default value to create the key vault and a secret.

    * **Subscription**: select an Azure subscription.
    * **Resource group**: select **Create new**, enter a unique name for the resource group, and then click **OK**.
    * **Location**: select a location. For example, **West US 2**.
    * **Account Name**: enter a name for your Azure Maps account, which must be globally unique.
    * **Pricing Tier**: select the appropriate pricing tier, the default value for the template is S0.

3. Select **Review + create**. 
4. Confirm your settings on the review page and click **Create**. After the key vault has been deployed successfully, you get a notification:

    ![ARM template, Key Vault integration, deploy portal notification](./media/how-to-create-template/resource-manager-template-portal-deployment-notification.png)

The Azure portal is used to deploy your template. You can also use the Azure PowerShell, Azure CLI, and REST API. To learn other deployment methods, see [Deploy templates](../azure-resource-manager/templates/deploy-powershell.md).

## Review deployed resources

You can use either the Azure portal to check your Azure Maps account and view your keys. You can also use the following Azure CLI script to list your account keys.

```azurecli-interactive
az maps account keys list --name MyMapsAccount --resource-group MyResourceGroup
```

## Clean up resources

When no longer needed, delete the resource group, which deletes the Azure Maps account. To delete the resource group by using Azure CLI:

```azurecli-interactive
az group delete --name MyResourceGroup
```

## Next steps

To learn more about Azure Maps and Azure Resource Manager, continue on to the articles below.

- Read an [Overview of Azure Maps](about-azure-maps.md)
- Learn more about [Azure Resource Manager](../azure-resource-manager/management/overview.md)