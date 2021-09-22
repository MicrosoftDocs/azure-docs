---
title: Bicep modules
description: Describes how to define and consume a module, and how to use module scopes.
author: mumian
ms.author: jgao
ms.topic: conceptual
ms.date: 09/14/2021
---

# Use Bicep modules

Bicep enables you to break down a complex solution into modules. A Bicep module is just a Bicep file that is deployed from another Bicep file. You can encapsulate complex details of the resource declaration in a module, which improves readability of files that use the module. You can reuse these modules, and share them with other people. Bicep modules are converted into a single Azure Resource Manager template with [nested templates](../templates/linked-templates.md#nested-template) for deployment.

This article describes how to define and consume modules.

For a tutorial, see [Deploy Azure resources by using Bicep templates](/learn/modules/deploy-azure-resources-by-using-bicep-templates/).

## Define modules

Every Bicep file can be used as a module. A module only exposes parameters and outputs as a contract to other Bicep files. Parameters and outputs are optional.

The following Bicep file can be deployed directly to create a storage account or be used as a module.  The next section shows you how to consume modules:

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

Output is used to pass values to the parent Bicep files.

## Consume modules

Use the _module_ keyword to consume a module. The following Bicep file deploys the resource defined in the module file being referenced:

```bicep
@minLength(3)
@maxLength(11)
param namePrefix string
param location string = resourceGroup().location

module stgModule 'storageAccount.bicep' = {
  name: 'storageDeploy'
  params: {
    storagePrefix: namePrefix
    location: location
  }
}

output storageEndpoint object = stgModule.outputs.storageEndpoint
```

- **module**: Keyword.
- **symbolic name** (stgModule): Identifier for the module.
- **module file**: Module files must be referenced by using relative paths. All paths in Bicep must be specified using the forward slash (/) directory separator to ensure consistent compilation cross-platform. The Windows backslash (\\) character is unsupported. Paths can contain spaces.
- The **_name_** property (storageDeploy) is required when consuming a module. When Bicep generates the template IL, this field is used as the name of the nested deployment resource, which is generated for the module:

    ```json
    ...
    ...
    "resources": [
      {
        "type": "Microsoft.Resources/deployments",
        "apiVersion": "2020-10-01",
        "name": "storageDeploy",
        "properties": {
          ...
        }
      }
    ]
    ...
    ```
- The **_params_** property contains any parameters to pass to the module file. These parameters match the parameters defined in the Bicep file.

Like resources, modules are deployed in parallel unless they depend on other modules or resource deployments. To learn more about dependencies, see [Set resource dependencies](resource-declaration.md#set-resource-dependencies).

To get an output value from a module, retrieve the property value with syntax like: `stgModule.outputs.storageEndpoint` where `stgModule` is the identifier of the module.

You can conditionally deploy a module. Use the same **if** syntax as you would use when [conditionally deploying a resource](conditional-resource-deployment.md).

```bicep
param deployZone bool

module dnsZone 'dnszones.bicep' = if (deployZone) {
  name: 'myZoneModule'
}
```

You can deploy a module multiple times by using loops. For more information, see [Module iteration in Bicep](loop-modules.md).

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
resource myResourceGroup 'Microsoft.Resources/resourceGroups@2020-01-01' = {
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

- To pass a sensitive value to a module, use the [getSecret](bicep-functions-resource.md#getsecret) function.
- You can deploy a module multiple times by using loops. For more information, see [Module iteration in Bicep](loop-modules.md).
