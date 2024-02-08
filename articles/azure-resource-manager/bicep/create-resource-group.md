---
title: Use Bicep to create a new resource group
description: Describes how to use Bicep to create a new resource group in your Azure subscription.
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 09/26/2023
---

# Create resource groups by using Bicep

You can use Bicep to create a new resource group. This article shows you how to create resource groups when deploying to either the subscription or another resource group.

## Define resource group

To create a resource group with Bicep, define a [Microsoft.Resources/resourceGroups](/azure/templates/microsoft.resources/allversions) resource with a name and location for the resource group.

The following example shows a Bicep file that creates an empty resource group. Notice that its target scope is `subscription`.

```bicep
targetScope='subscription'

param resourceGroupName string
param resourceGroupLocation string

resource newRG 'Microsoft.Resources/resourceGroups@2022-09-01' = {
  name: resourceGroupName
  location: resourceGroupLocation
}
```

To deploy the Bicep file to a subscription, use the subscription-level deployment commands.

For Azure CLI, use [az deployment sub create](/cli/azure/deployment/sub#az-deployment-sub-create).

```azurecli-interactive
az deployment sub create \
  --name demoSubDeployment \
  --location centralus \
  --template-file resourceGroup.bicep \
  --parameters resourceGroupName=demoResourceGroup resourceGroupLocation=centralus
```

For the PowerShell deployment command, use [New-AzDeployment](/powershell/module/az.resources/new-azdeployment) or its alias `New-AzSubscriptionDeployment`.

```azurepowershell-interactive
New-AzSubscriptionDeployment `
  -Name demoSubDeployment `
  -Location centralus `
  -TemplateFile resourceGroup.bicep `
  -resourceGroupName demoResourceGroup `
  -resourceGroupLocation centralus
```

## Create resource group and resources

To create the resource group and deploy resources to it, add a module that defines the resources to deploy to the resource group. Set the scope for the module to the symbolic name for the resource group you create. You can deploy to up to 800 resource groups.

The following example shows a Bicep file that creates a resource group, and deploys a storage account to the resource group. Notice that the `scope` property for the module is set to `newRG`, which is the symbolic name for the resource group that is being created.

```bicep
targetScope='subscription'

param resourceGroupName string
param resourceGroupLocation string
param storageName string
param storageLocation string

resource newRG 'Microsoft.Resources/resourceGroups@2022-09-01' = {
  name: resourceGroupName
  location: resourceGroupLocation
}

module storageAcct 'storage.bicep' = {
  name: 'storageModule'
  scope: newRG
  params: {
    storageLocation: storageLocation
    storageName: storageName
  }
}
```

The module uses a Bicep file named **storage.bicep** with the following contents:

```bicep
param storageLocation string
param storageName string

resource storageAcct 'Microsoft.Storage/storageAccounts@2022-09-01' = {
  name: storageName
  location: storageLocation
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'Storage'
  properties: {}
}
```

## Create resource group during resource group deployment

You can also create a resource group during a resource group level deployment. For that scenario, you deploy to an existing resource group and switch to the level of a subscription to create a resource group. The following Bicep file creates a new resource group in the specified subscription. The module that creates the resource group is the same as the example that creates the resource group.

```bicep
param secondResourceGroup string
param secondSubscriptionID string = ''
param secondLocation string

// module deployed at subscription level
module newRG 'resourceGroup.bicep' = {
  name: 'newResourceGroup'
  scope: subscription(secondSubscriptionID)
  params: {
    resourceGroupName: secondResourceGroup
    resourceGroupLocation: secondLocation
  }
}
```

To deploy to a resource group, use the resource group deployment commands.

For Azure CLI, use [az deployment group create](/cli/azure/deployment/group#az-deployment-group-create).

```azurecli-interactive
az deployment group create \
  --name demoRGDeployment \
  --resource-group ExampleGroup \
  --template-file main.bicep \
  --parameters secondResourceGroup=newRG secondSubscriptionID={sub-id} secondLocation=westus
```

For the PowerShell deployment command, use [New-AzResourceGroupDeployment](/powershell/module/az.resources/new-azresourcegroupdeployment).

```azurepowershell-interactive
New-AzResourceGroupDeployment `
  -Name demoRGDeployment `
  -ResourceGroupName ExampleGroup `
  -TemplateFile main.bicep `
  -secondResourceGroup newRG `
  -secondSubscriptionID {sub-id} `
  -secondLocation westus
```

## Next steps

To learn about other scopes, see:

* [Resource group deployments](deploy-to-resource-group.md)
* [Subscription deployments](deploy-to-subscription.md)
* [Management group deployments](deploy-to-management-group.md)
* [Tenant deployments](deploy-to-tenant.md)
