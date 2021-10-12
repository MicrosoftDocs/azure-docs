---
title: Bicep modules
description: Describes how to define and consume a module, and how to use module scopes.
author: mumian
ms.author: jgao
ms.topic: conceptual
ms.date: 10/11/2021
---

# Use Bicep modules

Bicep enables you to break down a complex solution into modules. A Bicep module is just a Bicep file that is deployed from another Bicep file. You can encapsulate complex details of the resource declaration in a module, which improves readability of files that use the module. You can reuse these modules, and share them with other people. Bicep modules are converted into a single Azure Resource Manager template with [nested templates](../templates/linked-templates.md#nested-template) for deployment.

This article describes how to add modules to your Bicep file.

## Definition syntax

The basic syntax for defining a module is:

```bicep
module <module-symbolic-name> '<path-to-file>' = {
  name: '<linked-deployment-name>'
  params: {
    <parameter-names-and-values>
  }
}
```

The [path](#path-to-module) can be either a local file or an external file in a Bicep module registry.

The symbolic name is just like the symbolic name for a resource. Use the symbolic name to reference the module in another part of the Bicep file.

The **name** property is required when defining a module. It becomes the name of the nested deployment resource in the generated template.

If you need to specify a scope that is different than the scope for the main file, add the scope property.

::: code language="bicep" source="~/azure-docs-bicep-samples/syntax-samples/modules/scope-definition.bicep" highlight="4" :::

To conditionally deploy a module, add the `if` expression. The use is similar to [conditionally deploying a resource](conditional-resource-deployment.md).

::: code language="bicep" source="~/azure-docs-bicep-samples/syntax-samples/modules/conditional-definition.bicep" highlight="2" :::

To deploy more than one instance of a module, add the `for` expression:

::: code language="bicep" source="~/azure-docs-bicep-samples/syntax-samples/modules/iterative-definition.bicep" highlight="2" :::

For more information, see [Module iteration in Bicep](loop-modules.md).

## Path to module

### Local file

If the module is a **local file**, provide a relative path to that file. All paths in Bicep must be specified using the forward slash (/) directory separator to ensure consistent compilation cross-platform. The Windows backslash (\\) character is unsupported. Paths can contain spaces.

For example to deploy a file that is up one level in the directory from your main file, use:

::: code language="bicep" source="~/azure-docs-bicep-samples/syntax-samples/modules/local-file-definition.bicep" highlight="1" :::

### File in registry

If the module is in a Bicep module registry, provide the name for the Azure container registry and a path to the module. Specify the module path with the following syntax:

```bicep
module <module-symbolic-name> 'br/<registry-name>.azurecr.io/<module-path>:<tag>'
```

- **br** is the schema name for a Bicep registry.
- **module path** is called `repository` in Azure Container Registry. The **module path** can contain segments separated by the `/` character.
- **tag** is used for specifying module version.

For example:

::: code language="bicep" source="~/azure-docs-bicep-samples/syntax-samples/modules/registry-definition.bicep" highlight="1" :::

## Parameters

The parameters you provide in your module definition match the parameters in the Bicep file.

The following Bicep example has three parameters - storagePrefix, storageSKU, and location. The storageSKU parameter has a default value so you don't have to provide a value during deployment.

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
param location string

var uniqueStorageName = '${storagePrefix}${uniqueString(resourceGroup().id)}'

resource stg 'Microsoft.Storage/storageAccounts@2019-04-01' = {
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

To use the preceding example as a module, provide values for those parameters.

```bicep
@minLength(3)
@maxLength(11)
param namePrefix string
param location string

module stgModule 'storageAccount.bicep' = {
  name: 'storageDeploy'
  params: {
    storagePrefix: namePrefix
    location: location
  }
}

output storageEndpoint object = stgModule.outputs.storageEndpoint
```

## Output

Output is used to pass values to the parent Bicep files.

## Consume modules


Like resources, modules are deployed in parallel unless they depend on other modules or resource deployments. To learn more about dependencies, see [Set resource dependencies](resource-declaration.md#set-resource-dependencies).

To get an output value from a module, retrieve the property value with syntax like: `stgModule.outputs.storageEndpoint` where `stgModule` is the identifier of the module.

You can conditionally deploy a module. Use the same **if** syntax as you would use when 
```bicep
param deployZone bool

module dnsZone 'dnszones.bicep' = if (deployZone) {
  name: 'myZoneModule'
}
```

## Configure module scopes

When declaring a module, you can set a scope for the module that is different than the scope for the containing Bicep file. Use the `scope` property to set the scope for the module. When the scope property isn't provided, the module is deployed at the parent's target scope.

The following Bicep file shows how to create a resource group and deploy a module to the resource group:

```bicep
// set the target scope for this file
targetScope = 'subscription'

@minLength(3)
@maxLength(11)
param namePrefix string

param location string = deployment().location

var resourceGroupName = '${namePrefix}rg'
resource myResourceGroup 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: resourceGroupName
  location: location
  scope: subscription()
}

module stgModule './storageAccount.bicep' = {
  name: 'storageDeploy'
  scope: myResourceGroup
  params: {
    storagePrefix: namePrefix
    location: location
  }
}

output storageEndpoint object = stgModule.outputs.storageEndpoint
```

The next example deploys to existing resource groups.

```bicep
targetScope = 'subscription'

resource firstRG 'Microsoft.Resources/resourceGroups@2021-04-01' existing = {
  name: 'demogroup1'
}

resource secondRG 'Microsoft.Resources/resourceGroups@2021-04-01' existing = {
  name: 'demogroup2'
}

module storage1 'storageAccount.bicep' = {
  name: 'westusdeploy'
  scope: firstRG
  params: {
    storagePrefix: 'stg1'
    location: 'westus'
  }
}

module storage2 'storageAccount.bicep' = {
  name: 'eastusdeploy'
  scope: secondRG
  params: {
    storagePrefix: 'stg2'
    location: 'eastus'
  }
}
```

The scope property must be set to a valid scope object. If your Bicep file deploys a resource group, subscription, or management group, you can set the scope for a module to the symbolic name for that resource. Or, you can use the scope functions to get a valid scope.

Those functions are:

- [resourceGroup](bicep-functions-scope.md#resourcegroup)
- [subscription](bicep-functions-scope.md#subscription)
- [managementGroup](bicep-functions-scope.md#managementgroup)
- [tenant](bicep-functions-scope.md#tenant)

The following example uses the `managementGroup` function to set the scope.

```bicep
param managementGroupName string

module  'module.bicep' = {
  name: 'deployToMG'
  scope: managementGroup(managementGroupName)
}
```

## Next steps

- For a tutorial, see [Deploy Azure resources by using Bicep templates](/learn/modules/deploy-azure-resources-by-using-bicep-templates/).
- To pass a sensitive value to a module, use the [getSecret](bicep-functions-resource.md#getsecret) function.
