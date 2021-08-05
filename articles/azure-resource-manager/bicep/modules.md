---
title: Bicep modules
description: Describes how to define and consume a module, and how to use module scopes.
author: mumian
ms.author: jgao
ms.topic: conceptual
ms.date: 07/15/2021
---

# Use Bicep modules

Bicep enables you to break down a complex solution into modules. A Bicep module is a set of one or more resources to be deployed together. Modules abstract away complex details of the raw resource declaration, which can increase readability. You can reuse these modules, and share them with other people. Bicep modules are transpiled into a single ARM template with [nested templates](../templates/linked-templates.md#nested-template) for deployment.

For a tutorial, see [Deploy Azure resources by using Bicep templates](/learn/modules/deploy-azure-resources-by-using-bicep-templates/).

## Define modules

Every Bicep file can be consumed as a module. A module only exposes parameters and outputs as contract to other Bicep files. Both parameters and outputs are optional.

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

module stgModule './storageAccount.bicep' = {
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

Like resources, modules are deployed in parallel unless they depend on other modules or resource deployments.

To get an output value from a module, retrieve the property value with syntax like: `stgModule.outputs.storageEndpoint` where `stgModule` is the identifier of the module.

You can conditionally deploy a module. Use the same **if** syntax as you would use when [conditionally deploying a resource](conditional-resource-deployment.md).

```bicep
param deployZone bool

module dnsZone 'dnszones.bicep' = if (deployZone) {
  name: 'myZoneModule'
}
```

## Configure module scopes

When declaring a module, you can supply a _scope_ property to set the scope at which to deploy the module:

```bicep
module stgModule './storageAccount.bicep' = {
  name: 'storageDeploy'
  scope: resourceGroup('someOtherRg') // pass in a scope to a different resourceGroup
  params: {
    storagePrefix: namePrefix
    location: location
  }
}
```

The _scope_ property can be omitted when the module's target scope and the parent's target scope are the same. When the scope property isn't provided, the module is deployed at the parent's target scope.

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

The scope property must be set to a valid scope object. If your Bicep file deploys a resource group, subscription, or management group, you can set the scope for a module to the symbolic name for that resource. This approach is shown in the previous example where a resource group is created and used for a module's scope.

Or, you can use the scope functions to get a valid scope. Those functions are:

- [resourceGroup](bicep-functions-scope.md#resourcegroup)
- [subscription](bicep-functions-scope.md#subscription)
- [managementGroup](bicep-functions-scope.md#managementgroup)
- [tenant](bicep-functions-scope.md#tenant)

## Next steps

- To go through a tutorial, see [Deploy Azure resources by using Bicep templates](/learn/modules/deploy-azure-resources-by-using-bicep-templates/).
