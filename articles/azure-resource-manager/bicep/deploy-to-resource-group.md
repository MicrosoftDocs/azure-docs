---
title: Use Bicep to deploy resources to resource groups
description: Describes how to deploy resources in a Bicep file. It shows how to target more than one resource group.
ms.topic: conceptual
ms.date: 06/01/2021
---

# Resource group deployments with Bicep files

This article describes how to scope your deployment to a resource group. You use a Bicep file for the deployment. The article also shows how to expand the scope beyond the resource group in the deployment operation.

## Supported resources

Most resources can be deployed to a resource group. For a list of available resources, see [ARM template reference](/azure/templates).

## Set scope

By default, a Bicep file is scoped to the resource group. If you want to explicitly set the scope, use:

```bicep
targetScope = 'resourceGroup'
```

But, setting the target scope to resource group is unnecessary because that scope is used by default.

## Deployment commands

To deploy to a resource group, use the resource group deployment commands.

# [Azure CLI](#tab/azure-cli)

For Azure CLI, use [az deployment group create](/cli/azure/deployment/group#az_deployment_group_create). The following example deploys a template to create a resource group:

```azurecli-interactive
az deployment group create \
  --name demoRGDeployment \
  --resource-group ExampleGroup \
  --template-file main.bicep \
  --parameters storageAccountType=Standard_GRS
```

# [PowerShell](#tab/azure-powershell)

For the PowerShell deployment command, use [New-AzResourceGroupDeployment](/powershell/module/az.resources/new-azresourcegroupdeployment). The following example deploys a template to create a resource group:

```azurepowershell-interactive
New-AzResourceGroupDeployment `
  -Name demoRGDeployment `
  -ResourceGroupName ExampleGroup `
  -TemplateFile main.bicep `
  -storageAccountType Standard_GRS `
```

---

For more detailed information about deployment commands and options for deploying ARM templates, see:

* [Deploy resources with ARM templates and Azure CLI](deploy-cli.md)
* [Deploy resources with ARM templates and Azure PowerShell](deploy-powershell.md)
* [Deploy ARM templates from Cloud Shell](deploy-cloud-shell.md)

## Deployment scopes

When deploying to a resource group, you can deploy resources to:

* the target resource group for the deployment operation
* other resource groups in the same subscription or other subscriptions
* any subscription in the tenant
* the tenant for the resource group

An [extension resource](scope-extension-resources.md) can be scoped to a target that is different than the deployment target.

The user deploying the template must have access to the specified scope.

This section shows how to specify different scopes. You can combine these different scopes in a single template.

### Scope to target resource group

To deploy resources to the target resource group, add those resources to the Bicep file.

```bicep
// create resource in target resource group
resource exampleResource 'Microsoft.Storage/storageAccounts@2019-06-01' = {
  ...
} 
```

For an example template, see [Deploy to target resource group](#deploy-to-target-resource-group).

### Scope to different resource group

To deploy resources to a resource group that isn't the target resource group, add a [module](modules.md). Use the resourceGroup function to set the `scope` property for that module. 

If the resource group is in a different subscription, provide the subscription ID and the name of the resource group. If the resource group is in the same subscription as the current deployment, provide only the name of the resource group. If you don't specify a subscription in the resourceGroup function, the current subscription is used. 

The following example shows a module that targets a resource group in a different subscription.

```bicep
param otherResourceGroup string
param otherSubscriptionID string

// create resources in a different subscription and resource group
module  'module.bicep' = {
  name: 'otherSubAndRG'
  scope: resourceGroup(otherSubscriptionID, otherResourceGroup)
}
```

The next example shows a module that targets a resource group in the same subscription.

```bicep
param otherResourceGroup string

// create resources in a resource group in the same subscription
module  'module.bicep' = {
  name: 'otherRG'
  scope: resourceGroup(otherResourceGroup)
}
```

For an example template, see [Deploy to multiple resource groups](#deploy-to-multiple-resource-groups).

### Scope to subscription

To deploy resources to a subscription, add a module and set its `scope` property. 

To deploy to the current subscription, use the subscription function without a parameter. 

```bicep

// create resources at subscription level
module  'module.bicep' = {
  name: 'deployToSub'
  scope: subscription()
}
```

To deploy to a different subscription, specify that subscription ID as a parameter in the subscription function.

```bicep
param otherSubscriptionID string

// create resources at subscription level but in a different subscription
module  'module.bicep' = {
  name: 'deployToSub'
  scope: subscription(otherSubscriptionID)
}
```

For an example template, see [Create resource group](#create-resource-group).

### Scope to tenant

To create resources at the tenant, add a module. Set its `scope` property to `tenant()`.

The user deploying the template must have the [required access to deploy at the tenant](deploy-to-tenant.md#required-access).

The following example includes a module that is deployed to the tenant.

```bicep
param otherSubscriptionID string

module  './module.bicep' = {
  name: 'deployToTenant'
  scope: tenant()
}
```

Instead of using a module, you can set the scope to `tenant()` for some resource types. The following example deploys a management group at the tenant.

```bicep
param mgName string = 'mg-${uniqueString(newGuid())}'

resource managementGroup 'Microsoft.Management/managementGroups@2020-05-01' = {
  scope: tenant()
  name: mgName
  properties: {}
}

output output string = mgName
```

For more information, see [Management group](deploy-to-management-group.md#management-group).

## Deploy to target resource group

To deploy resources in the target resource group, define those resources in the `resources` section of the template. The following template creates a storage account in the resource group that is specified in the deployment operation.

:::code language="json" source="~/resourcemanager-templates/get-started-with-templates/add-outputs/azuredeploy.bicep":::

## Deploy to multiple resource groups

You can deploy to more than one resource group in a single Bicep file.

> [!NOTE]
> You can deploy to **800 resource groups** in a single deployment. Typically, this limitation means you can deploy to one resource group specified for the parent template, and up to 799 resource groups in nested or linked deployments. However, if your parent template contains only nested or linked templates and does not itself deploy any resources, then you can include up to 800 resource groups in nested or linked deployments.

The following example deploys two storage accounts. The first storage account is deployed to the resource group specified in the deployment operation. The second storage account is deployed to the resource group specified in the `secondResourceGroup` and `secondSubscriptionID` parameters:

```bicep
@maxLength(11)
param storagePrefix string

param firstStorageLocation string = resourceGroup().location

param secondResourceGroup string
param secondSubscriptionID string = ''
param secondStorageLocation string

var firstStorageName = concat(storagePrefix, uniqueString(resourceGroup().id))
var secondStorageName = concat(storagePrefix, uniqueString(secondSubscriptionID, secondResourceGroup))

module firstStorageAcct 'storage.bicep' = {
  name: 'storageModule1'
  params: {
    storageLocation: firstStorageLocation
    storageName: firstStorageName
  }
}

module secondStorageAcct 'storage.bicep' = {
  name: 'storageModule2'
  scope: resourceGroup(secondSubscriptionID, secondResourceGroup)
  params: {
    storageLocation: secondStorageLocation
    storageName: secondStorageName
  }
}
```

Both modules use the same Bicep file.

```bicep
param storageLocation string
param storageName string

resource StorageAcct 'Microsoft.Storage/storageAccounts@2019-06-01' = {
  name: storageName
  location: storageLocation
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'Storage'
  properties: {}
}
```

## Create resource group

From a resource group deployment, you can switch to the level of a subscription and create a resource group. The following template deploys a storage account to the target resource group, and creates a new resource group in the specified subscription.

```bicep
@maxLength(11)
param storagePrefix string

param firstStorageLocation string = resourceGroup().location

param secondResourceGroup string
param secondSubscriptionID string = ''
param secondLocation string

var firstStorageName = concat(storagePrefix, uniqueString(resourceGroup().id))

module firstStorageAcct 'storage2.bicep' = {
  name: 'storageModule1'
  params: {
    storageLocation: firstStorageLocation
    storageName: firstStorageName
  }
}

module newRG 'resourceGroup.bicep' = {
  name: 'newResourceGroup'
  scope: subscription(secondSubscriptionID)
  params: {
    resourceGroupName: secondResourceGroup
    resourceGroupLocation: secondLocation
  }
}
```

The preceding example uses the following Bicep file for the module that creates the new resource group.

```bicep
targetScope='subscription'

param resourceGroupName string
param resourceGroupLocation string

resource newRG 'Microsoft.Resources/resourceGroups@2021-01-01' = {
  name: resourceGroupName
  location: resourceGroupLocation
}
```

## Next steps

To learn about other scopes, see:

* [subscription deployments](deploy-to-subscription.md)
* [management group deployments](deploy-to-management-group.md)
* [tenant deployments](deploy-to-tenant.md)
