---
title: Bicep modules
description: Describes how to define and consume a module, and how to use module scopes.
ms.topic: conceptual
ms.date: 03/15/2021
---

# Use Bicep modules

For small to medium solutions, a single Bicep file is easier to understand and maintain. You can see all the resources and values in a single file. For advanced scenarios, Bicep modules enable you to break down the solution into targeted components. You can easily reuse these modules for other scenarios. A module is a set of one or more resources to be deployed together.

For a tutorial, see [Tutorial: Add modules](./bicep-tutorial-add-modules.md).

## Define module

There is no specific syntax for defining a module. Every Bicep file can be consumed as a module. A module only exposes parameters and outputs as contract to other Bicep files. Both parameters and outputs are optional.

The following Bicep is a module example to create a storage account.  The next section shows you how to consume the module:

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

## Consume module

Use the _module_ keyword to consume a module. Here is an example consumption of a module. This Bicep file deploys the resource(s) defined in the module file being referenced:

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
- **symbolic name**: This is an identifier for the module.
- **module file**: The path to the module in this example is specified using a relative path (./storageAccount.bicep). All paths in Bicep must be specified using the forward slash (/) directory separator to ensure consistent compilation cross-platform. The Windows backslash () character is unsupported.
- The **_name_** property (storageDeploy) is required when consuming a module. When Bicep generates the template IL, this field is used as the name of the nested deployment resource which is generated for the module. Once you compile the Bicep file, you get the following JSON:

    ```json
    ...
    "resources": [
      {
        "type": "Microsoft.Resources/deployments",
        "apiVersion": "2019-10-01",
        "name": "storageDeploy",
        "properties": {
        }
      }
    ]
    ```

To get an output value from a module, retrieve the property value with syntax like: `stgModule.outputs.storageEndpoint`.

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

This property can be omitted when the module's target scope and the parent's target scope are the same. When the scope property is not provided, the module is deployed at the target scope for the Bicep file.

The following Bicep file shows how to create a resource group and deploy a module to the resource group:

```bicep
// set the target scope for this file
targetScope = 'subscription'

@minLength(3)
@maxLength(11)
param namePrefix string

param location string = 'centralus'

var resourceGroupName = '${namePrefix}rg'
resource myRg 'Microsoft.Resources/resourceGroups@2020-01-01' = {
  name: resourceGroupName
  location: location
  scope: subscription()
}

module stgModule './storageAccount.bicep' = {
  name: 'storageDeploy'
  scope: myRg
  params: {
    storagePrefix: namePrefix
    location: location
  }
}

output storageEndpoint object = stgModule.outputs.storageEndpoint
```

## Next steps

- To go through a tutorial, see [Tutorial: Add modules](./bicep-tutorial-add-modules.md).