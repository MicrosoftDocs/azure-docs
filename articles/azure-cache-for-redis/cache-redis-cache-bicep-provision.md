---
title: Deploy Azure Cache for Redis using Bicep
description: Learn how to use Bicep to deploy an Azure Cache for Redis resource.

 

ms.topic: conceptual
ms.custom: subject-armqs, devx-track-bicep, ignite-2024
ms.date: 04/10/2024
---

# Quickstart: Create an Azure Cache for Redis using Bicep

Learn how to use Bicep to deploy a cache using Azure Cache for Redis. After you deploy the cache, use it with an existing storage account to keep diagnostic data. Learn how to define which resources are deployed and how to define parameters that are specified when the deployment is executed. You can use this Bicep file for your own deployments, or customize it to meet your requirements.

[!INCLUDE [About Bicep](~/reusable-content/ce-skilling/azure/includes/resource-manager-quickstart-bicep-introduction.md)]

## Prerequisites

* **Azure subscription**: If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
* **A storage account**: To create one, see [Create an Azure Storage account](../storage/common/storage-account-create.md?tabs=azure-portal). The storage account is used for diagnostic data. Create the storage account in a new resource group named **exampleRG**.



## Azure Cache for Redis

### Review the Bicep file
The Bicep file used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates//).

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.cache/redis-cache-microsoft-entra-authentication/main.bicep":::

The following resources are defined in the Bicep file:

* [Microsoft.Cache/Redis](/azure/templates/microsoft.cache/redis)
* [Microsoft.Insights/diagnosticsettings](/azure/templates/microsoft.insights/diagnosticsettings)

### Deploy the Azure Cache for Redis Bicep file

1. Save the Bicep file as **main.bicep** to your local computer.
1. Deploy the Bicep file using either Azure CLI or Azure PowerShell.

    # [CLI](#tab/CLI)

    ```azurecli
    az deployment group create --resource-group exampleRG --template-file main.bicep --parameters existingDiagnosticsStorageAccountName=<storage-name> existingDiagnosticsStorageAccountResourceGroup=<resource-group>
    ```

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell
    New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile ./main.bicep -existingDiagnosticsStorageAccountName "<storage-name>" -existingDiagnosticsStorageAccountResourceGroup "<resource-group>"
    ```

    ---

   > [!NOTE]
   > Replace **\<storage-name\>** with the name of the storage account you created at the beginning of this quickstart. Replace **\<resource-group\>** with the name of the resource group name in which your storage account is located.

    When the deployment finishes, you see a message indicating the deployment succeeded.

## Azure Managed Redis (preview)

### Review the Bicep file

```bicep
@description('Specify the name of the Azure Redis Cache to create.')
param redisCacheName string = 'redisCache-${uniqueString(resourceGroup().id)}'

@description('Location of all resources')
param location string = resourceGroup().location

resource redisEnterprise 'Microsoft.Cache/redisEnterprise@2024-05-01-preview' = {
  name: redisCacheName
  location: location
  sku: {
    name: 'Balanced_B5'
  }
  identity: {
    type: 'None'
  }
  properties: {
    minimumTlsVersion: '1.2'    
  }
}

resource redisEnterpriseDatabase 'Microsoft.Cache/redisEnterprise/databases@2024-05-01-preview' = {
  name: 'default'
  parent: redisEnterprise
  properties:{
    clientProtocol: 'Encrypted'
    port: 10000
    clusteringPolicy: 'OSSCluster'
    evictionPolicy: 'NoEviction'
    persistence:{
      aofEnabled: false 
      rdbEnabled: false
    }
  }
}
```

The following resources are defined in the Bicep file:

* [Microsoft.Cache/redisEnterprise](/azure/templates/microsoft.cache/redisEnterprise)

### Deploy the Bicep file

1. Save the Bicep file as **main.bicep** to your local computer.
1. Deploy the Bicep file using either Azure CLI or Azure PowerShell.

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

Use the Azure portal, Azure CLI, or Azure PowerShell to list the deployed resources in the resource group.

# [CLI](#tab/CLI)

```azurecli-interactive
az resource list --resource-group exampleRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Get-AzResource -ResourceGroupName exampleRG
```

---

## Clean up resources

When no longer needed, delete the resource group, which deletes the resources in the resource group.

# [CLI](#tab/CLI)

```azurecli-interactive
az group delete --name exampleRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Remove-AzResourceGroup -Name exampleRG
```

---

## Next steps

In this tutorial, you learned how to use Bicep to deploy a cache using Azure Cache for Redis. To learn more about Azure Cache for Redis and Bicep, see the articles below:

* Learn more about [Azure Cache for Redis](../azure-cache-for-redis/cache-overview.md).
* Learn more about [Bicep](../../articles/azure-resource-manager/bicep/overview.md).
