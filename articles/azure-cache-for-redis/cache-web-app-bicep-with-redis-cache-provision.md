---
title: Provision Web App that uses Azure Cache for Redis using Bicep
description: Use Bicep to deploy web app with Azure Cache for Redis.
ms.custom: devx-track-bicep, ignite-2024
ms.topic: conceptual
ms.date: 05/24/2022
---

# Create a Web App plus Azure Cache for Redis using Bicep

In this article, you use Bicep to deploy an Azure Web App that uses Azure Cache for Redis, as well as an App Service plan.

[!INCLUDE [About Bicep](~/reusable-content/ce-skilling/azure/includes/resource-manager-quickstart-bicep-introduction.md)]

You can use this Bicep file for your own deployments. The Bicep file provides unique names for the Azure Web App, the App Service plan, and the Azure Cache for Redis. If you'd like, you can customize the Bicep file after you save it to your local device to meet your requirements.

For more information about creating Bicep files, see [Quickstart: Create Bicep files with Visual Studio Code](../azure-resource-manager/bicep/quickstart-create-bicep-use-visual-studio-code.md). To learn about Bicep syntax, see [Understand the structure and syntax of Bicep files](../azure-resource-manager/bicep/file.md).

## Review the Bicep file
<!-- this bicep file needs to be updated to point to AMR  -->

The Bicep file used in this quickstart is from [Azure Quickstart Templates](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.web/web-app-with-redis-cache/).

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.web/web-app-with-redis-cache/main.bicep":::

With this Bicep file, you deploy:

* [**Microsoft.Cache/Redis**](/azure/templates/microsoft.cache/redis)
* [**Microsoft.Web/sites**](/azure/templates/microsoft.web/sites)
* [**Microsoft.Web/serverfarms**](/azure/templates/microsoft.web/serverfarms)

### Azure Managed Redis (Preview)

```bicep
@description('Describes plan\'s pricing tier and instance size. Check details at https://azure.microsoft.com/en-us/pricing/details/app-service/')
@allowed([
  'F1'
  'D1'
  'B1'
  'B2'
  'B3'
  'S1'
  'S2'
  'S3'
  'P1'
  'P2'
  'P3'
  'P4'
])
param skuName string = 'F1'

@description('Describes plan\'s instance count')
@minValue(1)
@maxValue(7)
param skuCapacity int = 1

@description('Location for all resources.')
param location string = resourceGroup().location

var hostingPlanName = 'hostingplan${uniqueString(resourceGroup().id)}'
var webSiteName = 'webSite${uniqueString(resourceGroup().id)}'
var redisCacheName = 'cache${uniqueString(resourceGroup().id)}'
var redisAccessPolicyAssignment = 'redisWebAppAssignment'

resource hostingPlan 'Microsoft.Web/serverfarms@2021-03-01' = {
  name: hostingPlanName
  location: location
  tags: {
    displayName: 'HostingPlan'
  }
  sku: {
    name: skuName
    capacity: skuCapacity
  }
  properties: {
  }
}

resource webSite 'Microsoft.Web/sites@2021-03-01' = {
  name: webSiteName
  location: location
  tags: {
    'hidden-related:${hostingPlan.id}': 'empty'
    displayName: 'Website'
  }
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: hostingPlan.id
    httpsOnly: true
  }
  dependsOn: [
    redisEnterprise
  ]
}

resource appsettings 'Microsoft.Web/sites/config@2021-03-01' = {
  parent: webSite
  name: 'appsettings'
  properties: {
    RedisHost: redisEnterprise.properties.hostName
    minTlsVersion: '1.2'
    ftpsState: 'FtpsOnly'
  }
}

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

resource redisAccessPolicyAssignmentName 'Microsoft.Cache/redisEnterprise/accessPolicyAssignments@2024-03-01' = {
  name: redisAccessPolicyAssignment
  parent: redisEnterprise
  properties: {
    accessPolicyName: 'Data Owner'
    objectId: webSite.identity.principalId
    objectIdAlias: 'webapp'
  }
}
```
With this Bicep file, you deploy:

* [**Microsoft.Cache/redisEnterprise**](/azure/templates/microsoft.cache/redisEnterprise)
* [**Microsoft.Cache/redisEnterprise/databases**](/azure/templates/microsoft.cache/redisEnterprise/databases)
* [**Microsoft.Web/sites**](/azure/templates/microsoft.web/sites)
* [**Microsoft.Web/serverfarms**](/azure/templates/microsoft.web/serverfarms)

## Deploy the Bicep file

1. Save the Bicep file as **main.bicep** to your local computer.
1. Deploy the Bicep file using either Azure CLI or Azure PowerShell.

    # [CLI](#tab/CLI)

    ```azurecli
    az group create --name exampleRG --location eastus
    az deployment group create --resource-group exampleRG --template-file main.bicep
    ```

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell
    New-AzResourceGroup -Name exampleRG -Location eastus
    New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile ./main.bicep
    ```

    ---

    When the deployment finishes, you should see a message indicating the deployment succeeded.

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

When no longer needed, use the Azure portal, Azure CLI, or Azure PowerShell to delete the resource group and its resources.

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

To learn more about Bicep, continue to the following article:

* [Bicep overview](../azure-resource-manager/bicep/overview.md)
