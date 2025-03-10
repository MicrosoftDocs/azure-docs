---
title: Deploy Azure Cache for Redis by using Azure Resource Manager template
description: Learn how to use an Azure Resource Manager template (ARM template) to deploy an Azure Cache for Redis resource. Templates are provided for common scenarios.



ms.topic: conceptual
ms.custom: subject-armqs, devx-track-arm-template, ignite-2024
ms.date: 04/10/2024
---

# Quickstart: Create an Azure Cache for Redis using an ARM template

Learn how to create an Azure Resource Manager template (ARM template) that deploys an Azure Cache for Redis. The cache can be used with an existing storage account to keep diagnostic data. You also learn how to define which resources are deployed and how to define parameters that are specified when the deployment is executed. You can use this template for your own deployments, or customize it to meet your requirements. Currently, diagnostic settings are shared for all caches in the same region for a subscription. Updating one cache in the region affects all other caches in the region.

[!INCLUDE [About Azure Resource Manager](~/reusable-content/ce-skilling/azure/includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

:::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the Resource Manager template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.cache%2Fredis-cache%2Fazuredeploy.json":::

## Prerequisites

* **Azure subscription**: If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
* **A storage account**: To create one, see [Create an Azure Storage account](../storage/common/storage-account-create.md?tabs=azure-portal). The storage account is used for diagnostic data.

## Azure Cache for Redis

### Review the template

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/redis-cache/).

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.cache/redis-cache-microsoft-entra-authentication/azuredeploy.json":::

The following resources are defined in the template:

* [Microsoft.Cache/Redis](/azure/templates/microsoft.cache/redis)
* [Microsoft.Insights/diagnosticsettings](/azure/templates/microsoft.insights/diagnosticsettings)

Resource Manager templates for the new [Premium tier](cache-overview.md#service-tiers) are also available.

* [Create a Premium Azure Cache for Redis with clustering](https://azure.microsoft.com/resources/templates/redis-premium-cluster-diagnostics/)
* [Create Premium Azure Cache for Redis with data persistence](https://azure.microsoft.com/resources/templates/redis-premium-persistence/)
* [Create Premium Redis Cache deployed into a Virtual Network](https://azure.microsoft.com/resources/templates/redis-premium-vnet/)

To check for the latest templates, see [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/) and search for _Azure Cache for Redis_.

### Deploy the template

1. Select the following image to sign in to Azure and open the template.

    :::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the Resource Manager template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.cache%2Fredis-cache%2Fazuredeploy.json":::

1. Select or enter the following values:

    * **Subscription**: select an Azure subscription used to create the data share and the other resources.
    * **Resource group**: select **Create new** to create a new resource group or select an existing resource group.
    * **Location**: select a location for the resource group. The storage account and the Redis cache must be in the same region. By default the Redis cache uses the same location as the resource group. So, specify the same location as the storage account.
    * **Redis Cache Name**: enter a name for the Redis cache.
    * **Existing Diagnostics Storage Account**: enter the resource ID of a storage account. The syntax is `/subscriptions/&lt;SUBSCRIPTION ID>/resourceGroups/&lt;RESOURCE GROUP NAME>/providers/Microsoft.Storage/storageAccounts/&lt;STORAGE ACCOUNT NAME>`.

    Use the default value for the rest of the settings.

1. Select **I agree to the terms and conditions stated above**, and the select **Purchase**.

## Azure Managed Redis (preview)

### Review the template
Modify the `cachename` and `region` parameters. Copy it to a file `azuredeploy.json`.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "cachename": {
            "defaultValue": "myAMRcache",
            "type": "String"
        },
        "region": {
            "defaultValue": "centraluseuap",
            "type": "String"
        }
    },
    "variables": {},
    "resources": [
        {
            "type": "Microsoft.Cache/redisEnterprise",
            "apiVersion": "2024-05-01-preview",
            "name": "[parameters('cachename')]",
            "location": "[parameters('region')]",
            "sku": {
                "name": "Balanced_B5"
            },
            "identity": {
                "type": "None"
            },
            "properties": {
                "minimumTlsVersion": "1.2"
            }
        },
        {
            "type": "Microsoft.Cache/redisEnterprise/databases",
            "apiVersion": "2024-05-01-preview",
            "name": "[concat(parameters('cachename'), '/default')]",
            "dependsOn": [
                "[resourceId('Microsoft.Cache/redisEnterprise', parameters('cachename'))]"
            ],
            "properties": {
                "clientProtocol": "Encrypted",
                "port": 10000,
                "clusteringPolicy": "OSSCluster",
                "evictionPolicy": "NoEviction",
                "persistence": {
                    "aofEnabled": false,
                    "rdbEnabled": false
                }
            }
        }
    ]
}
```

### Deploy the template

1. Save the Azure Resource Manager template as **azuredeploy.json** to your local computer.

1. Deploy the template using either Azure CLI or Azure PowerShell.


    # [CLI](#tab/CLI)

    ```azurecli
    az deployment group create --resource-group exampleRG --template-file main.bicep
    ```

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell
    New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile ./main.bicep
    ```

    When the deployment finishes, you see a message indicating the deployment succeeded.

## Review deployed resources

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Open the Redis cache that you created.

## Clean up resources

When no longer needed, delete the resource group, which deletes the resources in the resource group.

```azurepowershell-interactive
$resourceGroupName = Read-Host -Prompt "Enter the resource group name"
Remove-AzResourceGroup -Name $resourceGroupName
Write-Host "Press [ENTER] to continue..."
```

## Next steps

In this tutorial, you learnt how to create an Azure Resource Manager template that deploys an Azure Cache for Redis. To learn how to create an Azure Resource Manager template that deploys an Azure Web App with Azure Cache for Redis, see [Create a Web App plus Azure Cache for Redis using a template](./cache-web-app-arm-with-redis-cache-provision.md).
