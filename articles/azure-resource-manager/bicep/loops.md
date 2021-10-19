---
title: Iterative loops in Bicep
description: Use loops to iterate over collections in Bicep
ms.topic: conceptual
ms.date: 10/19/2021
---

# Iterative loops in Bicep

This article shows you how to use the `for` syntax to iterate over items in a collection. You can use loops to define multiple copies of a resource, property, variable, module, or output. Use loops to avoid repeating syntax in your Bicep file and to dynamically set the number of copies to create during deployment.

### Microsoft Learn

To learn more about loops, and for hands-on guidance, see [Build flexible Bicep templates by using conditions and loops](/learn/modules/build-flexible-bicep-templates-conditions-loops/) on **Microsoft Learn**.

## Loop syntax

Loops can be declared by:

- Using an **integer index**. This option works for the scenario - "I want to create x number of instances." The [range function](bicep-functions-array.md#range) creates an array of integers from the start index and containing the number of specified elements. Within the loop, you can use the integer index to modify values. For more information, see [Loop index](#loop-index).

  ```bicep
  [for <index> in range(<startIndex>, <numberOfElements>): {
    ...
  }]
  ```

- Using **items in an array**. This option works for the scenario - "I want to create an instance for each element in an array." Within the loop, you can use the value of the current array element to modify values. For more information, see [Loop array](#loop-array).

  ```bicep
  [for <item> in <collection>: {
    ...
  }]
  ```

- Using **items in a dictionary object**. This option works for the scenario - "I want to create an instance for each item in an object." The [items function](bicep-functions-array.md#items) converts the object to an array. Within the loop, you can use properties from the object to create values. For more information, see [Loop object](#loop-object).

```bicep
[for <item> in items(<object>): {
  ...
}]
```

- Using **integer index and items in an array**. This option works for the scenario - "I want to create an instance for each element in an array, but I also need the current index to create another value." For more information, see [Loop array and index](#loop-array-and-index).

  ```bicep
  [for (<item>, <index>) in <collection>: {
    ...
  }]
  ```

- Adding a **conditional deployment**. This option works for the scenario - "I want to create multiple instances, but only when a condition is true." For more information, see [Loop with condition](#loop-with-condition).

  ```bicep
  [for <item> in <collection>: if(<condition>) {
    ...
  }]
  ```

## Available uses

You can use a loop when defining a variable, property on resource, resource, module, or output.

### Properties

For a **property on a resource**, use:

```bicep
resource <symbolic-name> '<resource-type>' = {
  properties: {
    <array-property>: [for <item> in <collection>: <value-to-repeat>]
  }
}
```

The following example sets the **subnets** property to an array that is constructed from the loop expression:

```bicep
var subnets = [
  {
    name: 'api'
    subnetPrefix: '10.144.0.0/24'
  }
  {
    name: 'worker'
    subnetPrefix: '10.144.1.0/24'
  }
]

resource vnet 'Microsoft.Network/virtualNetworks@2020-07-01' = {
  name: 'vnet'
  location: 'westus'
  properties: {
    addressSpace: {
      addressPrefixes: [
        '10.144.0.0/20'
      ]
    }
    subnets: [for subnet in subnets: {
      name: subnet.name
      properties: {
        addressPrefix: subnet.subnetPrefix
      }
    }]
  }
}
```

### Resources

For a **resource**, use:

```bicep
resource <symbolic-name> '<resource-type>' = [for <item> in <collection>: {
  <properties-to-repeat>
}]
```

The following example creates the number of storage accounts specified in the `storageCount` parameter.

```bicep
param storageCount int = 2

resource storageAcct 'Microsoft.Storage/storageAccounts@2021-02-01' = [for i in range(0, storageCount): {
  name: '${i}storage${uniqueString(resourceGroup().id)}'
  location: 'westus'
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'Storage'
}]
```

Notice the index `i` is used in creating the storage account resource name.

### Modules

For a **module**, use:

```bicep
module <symbolic-name> '<path>' = [for <item> in <collection>: {
  <module-values-to-repeat>
}]
```

The following example deploys a module for each name provided in the `storageNames` parameter. The module creates a storage account

```bicep
param storageNames array = [
  'contoso'
  'fabrikam'
  'coho'
]

module stgModule './storageAccount.bicep' = [for name in storageNames: {
  name: '${name}${uniqueString(resourceGroup().id)}'
  params: {
    storageName: name
    location: 'westus'
  }
}]
```

## Loop limits

Bicep loop has these limitations:

- Can't loop a resource with nested child resources. Change the child resources to top-level resources.  See [Iteration for a child resource](#iteration-for-a-child-resource).
- Can't loop on multiple levels of properties. See [Property iteration in Bicep](./loop-properties.md).
- Loop iterations can't be a negative number or exceed 800 iterations.

## Loop index

For a simple example or using an index, you can create a **variable** for an array of strings.

```bicep
param itemCount int = 5

var stringArray = [for i in range(0, itemCount): 'item${(i + 1)}']

output arrayResult array = stringArray
```

The output returns an array with the following values:

```json
[
  "item1",
  "item2",
  "item3",
  "item4",
  "item5"
]
```

The next example creates the number of storage accounts specified in the `storageCount` parameter. It returns three properties for each storage account.

```bicep
param rgLocation string = resourceGroup().location
param storageCount int = 2

resource storageAcct 'Microsoft.Storage/storageAccounts@2021-02-01' = [for i in range(0, storageCount): {
  name: '${i}storage${uniqueString(resourceGroup().id)}'
  location: rgLocation
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'Storage'
}]

output storageInfo array = [for i in range(0, storageCount): {
  id: storageAcct[i].id
  blobEndpoint: storageAcct[i].properties.primaryEndpoints.blob
  status: storageAcct[i].properties.statusOfPrimary
}]
```

Notice the index `i` is used in creating the storage account resource name.

The next example deploys a module multiple times.

```bicep
param location string
param storageCount int = 2

var baseName = 'store${uniqueString(resourceGroup().id)}'

module stgModule './storageAccount.bicep' = [for i in range(0, storageCount): {
  name: '${i}deploy${baseName}'
  params: {
    storageName: '${i}${baseName}'
    location: location
  }
}]
```

## Loop array

The following example creates one storage account for each name provided in the `storageNames` parameter.

```bicep
param rgLocation string = resourceGroup().location
param storageNames array = [
  'contoso'
  'fabrikam'
  'coho'
]

resource storageAcct 'Microsoft.Storage/storageAccounts@2021-02-01' = [for name in storageNames: {
  name: '${name}${uniqueString(resourceGroup().id)}'
  location: rgLocation
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'Storage'
}]
```

If you want to return values from the deployed resources, you can use a loop in the [output section](loop-outputs.md).

## Loop array and index

The following example uses both the array element and index value when defining the storage account.

```bicep
param storageAccountNamePrefix string

var storageConfigurations = [
  {
    suffix: 'local'
    sku: 'Standard_LRS'
  }
  {
    suffix: 'geo'
    sku: 'Standard_GRS'
  }
]

resource storageAccountResources 'Microsoft.Storage/storageAccounts@2021-02-01' = [for (config, i) in storageConfigurations: {
  name: '${storageAccountNamePrefix}${config.suffix}${i}'
  location: resourceGroup().location
  properties: {
    supportsHttpsTrafficOnly: true
    accessTier: 'Hot'
    encryption: {
      keySource: 'Microsoft.Storage'
      services: {
        blob: {
          enabled: true
        }
        file: {
          enabled: true
        }
      }
    }
  }
  kind: 'StorageV2'
  sku: {
    name: config.sku
  }
}]
```

The next example uses both the elements of an array and an index to output information about the new resources.

```bicep
param nsgLocation string = resourceGroup().location
param orgNames array = [
  'Contoso'
  'Fabrikam'
  'Coho'
]

resource nsg 'Microsoft.Network/networkSecurityGroups@2020-06-01' = [for name in orgNames: {
  name: 'nsg-${name}'
  location: nsgLocation
}]

output deployedNSGs array = [for (name, i) in orgNames: {
  orgName: name
  nsgName: nsg[i].name
  resourceId: nsg[i].id
}]
```

## Loop with condition

For **resources and modules**, you can add an `if` expression with the loop syntax to conditionally deploy the collection.

The following example shows a nested loop combined with a filtered resource loop. Filters must be expressions that evaluate to a boolean value.

```bicep
param location string
param storageCount int = 2
param createNewStorage bool = true

var baseName = 'store${uniqueString(resourceGroup().id)}'

module stgModule './storageAccount.bicep' = [for i in range(0, storageCount): if(createNewStorage) {
  name: '${i}deploy${baseName}'
  params: {
    storageName: '${i}${baseName}'
    location: location
  }
}]
```

## Deploy in batches

By default, Azure resources are deployed in parallel. When you use a loop to create multiple instances of a resource type, those instances are all deployed at the same time. The order in which they're created isn't guaranteed. There's no limit to the number of resources deployed in parallel, other than the total limit of 800 resources in the Bicep file.

You might not want to update all instances of a resource type at the same time. For example, when updating a production environment, you may want to stagger the updates so only a certain number are updated at any one time. You can specify that a subset of the instances be batched together and deployed at the same time. The other instances wait for that batch to complete.

To serially deploy instances of a resource, add the [batchSize decorator](./file.md#resource-and-module-decorators). Set its value to the number of instances to deploy concurrently. A dependency is created on earlier instances in the loop, so it doesn't start one batch until the previous batch completes.

```bicep
param rgLocation string = resourceGroup().location

@batchSize(2)
resource storageAcct 'Microsoft.Storage/storageAccounts@2021-02-01' = [for i in range(0, 4): {
  name: '${i}storage${uniqueString(resourceGroup().id)}'
  location: rgLocation
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'Storage'
}]
```

For completely sequential deployment, set the batch size to 1.

The `batchSize` decorator is in the [sys namespace](bicep-functions.md#namespaces-for-functions). If you need to differentiate this decorator from another item with the same name, preface the decorator with **sys**: `@sys.batchSize(2)`

## Iteration for a child resource

You can't use a loop for a nested child resource. To create more than one instance of a child resource, change the child resource to a top-level resource.

For example, suppose you typically define a file service and file share as nested resources for a storage account.

```bicep
resource stg 'Microsoft.Storage/storageAccounts@2021-02-01' = {
  name: 'examplestorage'
  location: resourceGroup().location
  kind: 'StorageV2'
  sku: {
    name: 'Standard_LRS'
  }
  resource service 'fileServices' = {
    name: 'default'
    resource share 'shares' = {
      name: 'exampleshare'
    }
  }
}
```

To create more than one file share, move it outside of the storage account. You define the relationship with the parent resource through the `parent` property.

The following example shows how to create a storage account, file service, and more than one file share:

```bicep
resource stg 'Microsoft.Storage/storageAccounts@2021-02-01' = {
  name: 'examplestorage'
  location: resourceGroup().location
  kind: 'StorageV2'
  sku: {
    name: 'Standard_LRS'
  }
}

resource service 'Microsoft.Storage/storageAccounts/fileServices@2021-02-01' = {
  name: 'default'
  parent: stg
}

resource share 'Microsoft.Storage/storageAccounts/fileServices/shares@2021-02-01' = [for i in range(0, 3): {
  name: 'exampleshare${i}'
  parent: service
}]
```

## Next steps

- To set dependencies on resources that are created in a loop, see [Set resource dependencies](./resource-declaration.md#set-resource-dependencies).
