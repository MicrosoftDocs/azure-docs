---
title: Deploy Azure Cache for Redis by using Azure Resource Manager template
description: Learn how to use an Azure Resource Manager template to deploy an Azure Cache for Redis resource. Templates are provided for common scenarios.
author: yegu-ms
ms.author: yegu
ms.service: cache
ms.topic: conceptual
ms.custom: subject-armqs
ms.date: 08/17/2020
---

# Create an Azure Cache for Redis using a Resource Manager template

Learn how to create an Azure Resource Manager template that deploys an Azure Cache for Redis. The cache can be used with an existing storage account to keep diagnostic data. You also learn how to define which resources are deployed and how to define parameters that are specified when the deployment is executed. You can use this template for your own deployments, or customize it to meet your requirements. Currently, diagnostic settings are shared for all caches in the same region for a subscription. Updating one cache in the region affects all other caches in the region.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

[![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-redis-cache%2Fazuredeploy.json)

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

## Review the template

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/101-redis-cache/).

:::code language="json" source="~/quickstart-templates/101-redis-cache/azuredeploy.json":::

The following resources are defined in the template:

* [Microsoft.Cache/Redis]
* [Microsoft.Insights/diagnosticsettings]

> [!NOTE]
> Resource Manager templates for the new [Premium tier](cache-overview.md#service-tiers) are also available.
>
> * [Create a Premium Azure Cache for Redis with clustering](https://azure.microsoft.com/resources/templates/201-redis-premium-cluster-diagnostics/)
> * [Create Premium Azure Cache for Redis with data persistence](https://azure.microsoft.com/resources/templates/201-redis-premium-persistence/)
> * [Create Premium Redis Cache deployed into a Virtual Network](https://azure.microsoft.com/resources/templates/201-redis-premium-vnet/)
>
> To check for the latest templates, see [Azure Quickstart Templates](https://azure.microsoft.com/documentation/templates/) and search for `Azure Cache for Redis`.

## Deploy the template

1. Select the following image to sign in to Azure and open the template.

    [![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-redis-cache%2Fazuredeploy.json)
1. Select or enter the following values:

    * **Subscription**: select an Azure subscription used to create the data share and the other resources.
    * **Resource group**: select **Create new** to create a new resource group or select an existing resource group.
    * **Location**: select a location for the resource group.
    * **Project Name**: enter a project name.  The project name is used for generating resource names.  See the variable definitions in the previous template.
    * **location**: select a location for the resources.  You can use the same location for the resource group.
    * **Invitation Email**: enter the data share recipient's Azure login email address.  Email alias doesn't work.

    Use the default value for the rest of the settings.
1. select **I agree to the terms and conditions stated above**, and the select **Purchase**.

## Review deployed resources

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Open the data share account that you created.
1. From the left menu, select **Send Shares**.  You shall see the storage account listed.
1. Select the storage account.  Under **Details**, you shall see the synchronization setting as you configured in the template.

    ![Azure Data Share Storage Account Synchronization settings](./media/share-your-data-arm/azure-data-share-storage-account-synchronization-settings.png)
1. Select **Invitations** from the top. You shall see the email address that you specified when you deploy the template. The **Status** shall be **Pending**.

## Clean up resources

When no longer needed, delete the resource group, which deletes the resources in the resource group.

```azurepowershell-interactive
$resourceGroupName = Read-Host -Prompt "Enter the resource group name"
Remove-AzResourceGroup -Name $resourceGroupName
Write-Host "Press [ENTER] to continue..."
```

## Next steps

In this tutorial, you learnt how to create an Azure data share and invite recipients. To learn more about how a data consumer can accept and receive a data share, continue to the [accept and receive data](subscribe-to-data-share.md) tutorial.