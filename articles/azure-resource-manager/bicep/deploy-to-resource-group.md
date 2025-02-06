---
title: Use Bicep to deploy resources to resource groups
description: Describes how to deploy resources in a Bicep file. It shows how to target more than one resource group.
ms.topic: how-to
ms.custom: devx-track-bicep
ms.date: 09/26/2024
---

# Resource group deployments with Bicep files

This article describes how to set scope with Bicep when deploying to a resource group.

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

For Azure CLI, use [az deployment group create](/cli/azure/deployment/group#az-deployment-group-create). The following example deploys a template to create a resource group. The resource group you specify in the `--resource-group` parameter is the **target resource group**.

```azurecli-interactive
az deployment group create \
  --name demoRGDeployment \
  --resource-group ExampleGroup \
  --template-file main.bicep \
  --parameters storageAccountType=Standard_GRS
```

# [PowerShell](#tab/azure-powershell)

For the PowerShell deployment command, use [New-AzResourceGroupDeployment](/powershell/module/az.resources/new-azresourcegroupdeployment). The following example deploys a template to create a resource group. The resource group you specify in the `-ResourceGroupName` parameter is the **target resource group**.

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

// TODO add links to relevant docs on concepts like modules, resource declarations, existing resources

Within a single Bicep file, all resources declared with the `resource` keyword must be deployed at the same scope as the deployment. For a resource group deployment, this means all `resource` declarations in the Bicep file must either be deployed to the same resource group, or as a child or extension resource of a resource in the same resource group as the deployment.

For `existing` resources, the same restriction does not apply - you may reference a resource at a different scope to that of the deployment.

It is however still possible to have a single deployment target resources at scopes through the use of modules. Deploying a module will trigger a "nested deployment", which you can use to target other scopes. Because the use of a module will trigger a deployment at that scope, the user deploying the parent Bicep file must have permission to initiate a deployment at that scope.

You can deploy a Bicep module from within a resource-group scope Bicep file at the following scopes:
* The same resource group // TODO anchor link to example below
* Other resource groups in the same subscription // TODO anchor link to example below
* Other resource groups in other subscriptions // TODO anchor link to example below
* The subscription // TODO link to doc on sub-level deployments
* The tenant // TODO link to doc on tenant-level deployments

// TODO add a note about exceptions to the "same resoure group rule" in the management-group equivalent of this doc - we permit tenant-level resource PUTs from mg-level deployments
// TODO copy+modify this doc for other scopes

This section shows how to specify different scopes. You can combine these different scopes in a single template.

### Scope to target resource group

To deploy resources to the target resource group, add those resources to the Bicep file.

```bicep
// resource deployed to target resource group
resource exampleResource 'Microsoft.Storage/storageAccounts@2023-04-01' = {
  ...
}
```

For an example template, see [Deploy to target resource group](#deploy-to-target-resource-group).

### Scope to different resource group

To deploy resources to a resource group that isn't the target resource group, add a [module](modules.md). Use the [resourceGroup function](bicep-functions-scope.md#resourcegroup) to set the `scope` property for that module.

If the resource group is in a different subscription, provide the subscription ID and the name of the resource group. If the resource group is in the same subscription as the current deployment, provide only the name of the resource group. If you don't specify a subscription in the [resourceGroup function](bicep-functions-scope.md#resourcegroup), the current subscription is used.

The following example shows a module that targets a resource group in a different subscription.

```bicep
param otherResourceGroup string
param otherSubscriptionID string

// module deployed to different subscription and resource group
module exampleModule 'module.bicep' = {
  name: 'otherSubAndRG'
  scope: resourceGroup(otherSubscriptionID, otherResourceGroup)
}
```

The next example shows a module that targets a resource group in the same subscription.

```bicep
param otherResourceGroup string

// module deployed to resource group in the same subscription
module exampleModule 'module.bicep' = {
  name: 'otherRG'
  scope: resourceGroup(otherResourceGroup)
}
```

For an example template, see [Deploy to multiple resource groups](#deploy-to-multiple-resource-groups).

### Scope to subscription

To deploy resources to a subscription, add a module. Use the [subscription function](bicep-functions-scope.md#subscription) to set its `scope` property.

To deploy to the current subscription, use the subscription function without a parameter.

```bicep

// module deployed at subscription level
module exampleModule 'module.bicep' = {
  name: 'deployToSub'
  scope: subscription()
}
```

To deploy to a different subscription, specify that subscription ID as a parameter in the subscription function.

```bicep
param otherSubscriptionID string

// module deployed at subscription level but in a different subscription
module exampleModule 'module.bicep' = {
  name: 'deployToSub'
  scope: subscription(otherSubscriptionID)
}
```

For an example template, see [Create resource group with Bicep](create-resource-group.md).

### Scope to tenant

To create resources at the tenant, add a module. Use the [tenant function](bicep-functions-scope.md#tenant) to set its `scope` property.

The user deploying the template must have the [required access to deploy at the tenant](deploy-to-tenant.md#required-access).

The following example includes a module that is deployed to the tenant.

```bicep
// module deployed at tenant level
module exampleModule 'module.bicep' = {
  name: 'deployToTenant'
  scope: tenant()
}
```

Instead of using a module, you can set the scope to `tenant()` for some resource types. The following example deploys a management group at the tenant.

```bicep
param mgName string = 'mg-${uniqueString(newGuid())}'

// ManagementGroup deployed at tenant
resource managementGroup 'Microsoft.Management/managementGroups@2023-04-01' = {
  scope: tenant()
  name: mgName
  properties: {}
}

output output string = mgName
```

For more information, see [Management group](deploy-to-management-group.md#management-group).

## Deploy to target resource group

To deploy resources in the target resource group, define those resources in the `resources` section of the template. The following template creates a storage account in the resource group that is specified in the deployment operation.

```bicep
@minLength(3)
@maxLength(11)
param storagePrefix string

@allowed([
  'Standard_LRS'
  'Standard_GRS'
  'Standard_RAGRS'
  'Standard_ZRS'
  'Premium_LRS'
  'Premium_ZRS'
  'Standard_GZRS'
  'Standard_RAGZRS'
])
param storageSKU string = 'Standard_LRS'

param location string = resourceGroup().location

var uniqueStorageName = '${storagePrefix}${uniqueString(resourceGroup().id)}'

resource stg 'Microsoft.Storage/storageAccounts@2023-04-01' = {
  name: uniqueStorageName
  location: location
  sku: {
    name: storageSKU
  }
  kind: 'StorageV2'
  properties: {
    supportsHttpsTrafficOnly: true
  }
}

output storageEndpoint object = stg.properties.primaryEndpoints
```

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

var firstStorageName = '${storagePrefix}${uniqueString(resourceGroup().id)}'
var secondStorageName = '${storagePrefix}${uniqueString(secondSubscriptionID, secondResourceGroup)}'

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

Both modules use the same Bicep file named **storage.bicep**.

```bicep
param storageLocation string
param storageName string

resource storageAcct 'Microsoft.Storage/storageAccounts@2023-04-01' = {
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

For information about creating resource groups, see [Create resource group with Bicep](create-resource-group.md).

## Next steps

To learn about other scopes, see:

* [Subscription deployments](deploy-to-subscription.md)
* [Management group deployments](deploy-to-management-group.md)
* [Tenant deployments](deploy-to-tenant.md)
