---
title: Iterative loops in Bicep
description: Use loops to iterate over collections in Bicep
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 10/17/2023
---

# Iterative loops in Bicep

This article shows you how to use the `for` syntax to iterate over items in a collection. This functionality is supported starting in v0.3.1 onward. You can use loops to define multiple copies of a resource, module, variable, property, or output. Use loops to avoid repeating syntax in your Bicep file and to dynamically set the number of copies to create during deployment. To go through a quickstart, see [Quickstart: Create multiple instances](./quickstart-loops.md).

To use loops to create multiple resources or modules, each instance must have a unique value for the name property. You can use the index value or unique values in arrays or collections to create the names.

### Training resources

If you would rather learn about loops through step-by-step guidance, see [Build flexible Bicep templates by using conditions and loops](/training/modules/build-flexible-bicep-templates-conditions-loops/).

## Loop syntax

Loops can be declared by:

- Using an **integer index**. This option works when your scenario is: "I want to create this many instances." The [range function](bicep-functions-array.md#range) creates an array of integers that begins at the start index and contains the number of specified elements. Within the loop, you can use the integer index to modify values. For more information, see [Integer index](#integer-index).

  ```bicep
  [for <index> in range(<startIndex>, <numberOfElements>): {
    ...
  }]
  ```

- Using **items in an array**. This option works when your scenario is: "I want to create an instance for each element in an array." Within the loop, you can use the value of the current array element to modify values. For more information, see [Array elements](#array-elements).

  ```bicep
  [for <item> in <collection>: {
    ...
  }]
  ```

- Using **items in a dictionary object**. This option works when your scenario is: "I want to create an instance for each item in an object." The [items function](bicep-functions-object.md#items) converts the object to an array. Within the loop, you can use properties from the object to create values. For more information, see [Dictionary object](#dictionary-object).

  ```bicep
  [for <item> in items(<object>): {
    ...
  }]
  ```

- Using **integer index and items in an array**. This option works when your scenario is: "I want to create an instance for each element in an array, but I also need the current index to create another value." For more information, see [Loop array and index](#array-and-index).

  ```bicep
  [for (<item>, <index>) in <collection>: {
    ...
  }]
  ```

- Adding a **conditional deployment**. This option works when your scenario is: "I want to create multiple instances, but for each instance I want to deploy only when a condition is true." For more information, see [Loop with condition](#loop-with-condition).

  ```bicep
  [for <item> in <collection>: if(<condition>) {
    ...
  }]
  ```

## Loop limits

Using loops in Bicep has these limitations:

- Bicep loops only work with values that can be determined at the start of deployment.
- Loop iterations can't be a negative number or exceed 800 iterations.
- Can't loop a resource with nested child resources. Change the child resources to top-level resources.  See [Iteration for a child resource](#iteration-for-a-child-resource).
- To loop on multiple levels of properties, use the [lambda map function](./bicep-functions-lambda.md#map).

## Integer index

For a simple example of using an index, create a **variable** that contains an array of strings.

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
param location string = resourceGroup().location
param storageCount int = 2

resource storageAcct 'Microsoft.Storage/storageAccounts@2022-09-01' = [for i in range(0, storageCount): {
  name: '${i}storage${uniqueString(resourceGroup().id)}'
  location: location
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
param location string = resourceGroup().location
param storageCount int = 2

var baseName = 'store${uniqueString(resourceGroup().id)}'

module stgModule './storageAccount.bicep' = [for i in range(0, storageCount): {
  name: '${i}deploy${baseName}'
  params: {
    storageName: '${i}${baseName}'
    location: location
  }
}]

output storageAccountEndpoints array = [for i in range(0, storageCount): {
  endpoint: stgModule[i].outputs.storageEndpoint
}]
```

## Array elements

The following example creates one storage account for each name provided in the `storageNames` parameter. Note the name property for each resource instance must be unique.

```bicep
param location string = resourceGroup().location
param storageNames array = [
  'contoso'
  'fabrikam'
  'coho'
]

resource storageAcct 'Microsoft.Storage/storageAccounts@2022-09-01' = [for name in storageNames: {
  name: '${name}${uniqueString(resourceGroup().id)}'
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'Storage'
}]
```

The next example iterates over an array to define a property. It creates two subnets within a virtual network. Note the subnet names must be unique.

::: code language="bicep" source="~/azure-docs-bicep-samples/samples/loops/loopproperty.bicep" highlight="23-28" :::

## Array and index

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

resource storageAccountResources 'Microsoft.Storage/storageAccounts@2022-09-01' = [for (config, i) in storageConfigurations: {
  name: '${storageAccountNamePrefix}${config.suffix}${i}'
  location: resourceGroup().location
  sku: {
    name: config.sku
  }
  kind: 'StorageV2'
}]
```

The next example uses both the elements of an array and an index to output information about the new resources.

```bicep
param location string = resourceGroup().location
param orgNames array = [
  'Contoso'
  'Fabrikam'
  'Coho'
]

resource nsg 'Microsoft.Network/networkSecurityGroups@2020-06-01' = [for name in orgNames: {
  name: 'nsg-${name}'
  location: location
}]

output deployedNSGs array = [for (name, i) in orgNames: {
  orgName: name
  nsgName: nsg[i].name
  resourceId: nsg[i].id
}]
```

## Dictionary object

To iterate over elements in a dictionary object, use the [items function](bicep-functions-object.md#items), which converts the object to an array. Use the `value` property to get properties on the objects. Note the nsg resource names must be unique.

```bicep
param nsgValues object = {
  nsg1: {
    name: 'nsg-westus1'
    location: 'westus'
  }
  nsg2: {
    name: 'nsg-east1'
    location: 'eastus'
  }
}

resource nsg 'Microsoft.Network/networkSecurityGroups@2020-06-01' = [for nsg in items(nsgValues): {
  name: nsg.value.name
  location: nsg.value.location
}]
```

## Loop with condition

For **resources and modules**, you can add an `if` expression with the loop syntax to conditionally deploy the collection.

The following example shows a loop combined with a condition statement. In this example, a single condition is applied to all instances of the module.

```bicep
param location string = resourceGroup().location
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

The next example shows how to apply a condition that is specific to the current element in the array.

```bicep
resource parentResources 'Microsoft.Example/examples@2020-06-06' = [for parent in parents: if(parent.enabled) {
  name: parent.name
  properties: {
    children: [for child in parent.children: {
      name: child.name
      setting: child.settingValue
    }]
  }
}]
```

## Deploy in batches

By default, Azure resources are deployed in parallel. When you use a loop to create multiple instances of a resource type, those instances are all deployed at the same time. The order in which they're created isn't guaranteed. There's no limit to the number of resources deployed in parallel, other than the total limit of 800 resources in the Bicep file.

You might not want to update all instances of a resource type at the same time. For example, when updating a production environment, you may want to stagger the updates so only a certain number are updated at any one time. You can specify that a subset of the instances be batched together and deployed at the same time. The other instances wait for that batch to complete.

To serially deploy instances of a resource, add the [batchSize decorator](./file.md#resource-and-module-decorators). Set its value to the number of instances to deploy concurrently. A dependency is created on earlier instances in the loop, so it doesn't start one batch until the previous batch completes.

```bicep
param location string = resourceGroup().location

@batchSize(2)
resource storageAcct 'Microsoft.Storage/storageAccounts@2022-09-01' = [for i in range(0, 4): {
  name: '${i}storage${uniqueString(resourceGroup().id)}'
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'Storage'
}]
```

For sequential deployment, set the batch size to 1.

The `batchSize` decorator is in the [sys namespace](bicep-functions.md#namespaces-for-functions). If you need to differentiate this decorator from another item with the same name, preface the decorator with **sys**: `@sys.batchSize(2)`

## Iteration for a child resource

You can't use a loop for a nested child resource. To create more than one instance of a child resource, change the child resource to a top-level resource.

For example, suppose you typically define a file service and file share as nested resources for a storage account.

```bicep
resource stg 'Microsoft.Storage/storageAccounts@2022-09-01' = {
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
resource stg 'Microsoft.Storage/storageAccounts@2022-09-01' = {
  name: 'examplestorage'
  location: resourceGroup().location
  kind: 'StorageV2'
  sku: {
    name: 'Standard_LRS'
  }
}

resource service 'Microsoft.Storage/storageAccounts/fileServices@2021-06-01' = {
  name: 'default'
  parent: stg
}

resource share 'Microsoft.Storage/storageAccounts/fileServices/shares@2021-06-01' = [for i in range(0, 3): {
  name: 'exampleshare${i}'
  parent: service
}]
```

## Reference resource/module collections

The ARM template [`references`](../templates/template-functions-resource.md#references) function returns an array of objects representing a resource collection's runtime states. In Bicep, there is no explicit references function. Instead, symbolic collection usage is employed directly, and during code generation, Bicep translates it to an ARM template that utilizes the ARM template references function. For the translation feature that transforms symbolic collections into ARM templates using the references function, it is necessary to have Bicep CLI version 0.20.4 or a more recent version. Additionally, in the [`bicepconfig.json`](./bicep-config.md#enable-experimental-features) file, the `symbolicNameCodegen` setting should be presented and set to `true`.

The outputs of the two samples in [Integer index](#integer-index) can be written as:

```bicep
param location string = resourceGroup().location
param storageCount int = 2

resource storageAcct 'Microsoft.Storage/storageAccounts@2022-09-01' = [for i in range(0, storageCount): {
  name: '${i}storage${uniqueString(resourceGroup().id)}'
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'Storage'
}]

output storageInfo array = map(storageAcct, store => {
  blobEndpoint: store.properties.primaryEndpoints
  status: store.properties.statusOfPrimary
})

output storageAccountEndpoints array = map(storageAcct, store => store.properties.primaryEndpoints)
```

This Bicep file is transpiled into the following ARM JSON template that utilizes the `references` function:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "languageVersion": "1.10-experimental",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]"
    },
    "storageCount": {
      "type": "int",
      "defaultValue": 2
    }
  },
  "resources": {
    "storageAcct": {
      "copy": {
        "name": "storageAcct",
        "count": "[length(range(0, parameters('storageCount')))]"
      },
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2022-09-01",
      "name": "[format('{0}storage{1}', range(0, parameters('storageCount'))[copyIndex()], uniqueString(resourceGroup().id))]",
      "location": "[parameters('location')]",
      "sku": {
        "name": "Standard_LRS"
      },
      "kind": "Storage"
    }
  },
  "outputs": {
    "storageInfo": {
      "type": "array",
      "value": "[map(references('storageAcct', 'full'), lambda('store', createObject('blobEndpoint', lambdaVariables('store').properties.primaryEndpoints, 'status', lambdaVariables('store').properties.statusOfPrimary)))]"
    },
    "storageAccountEndpoints": {
      "type": "array",
      "value": "[map(references('storageAcct', 'full'), lambda('store', lambdaVariables('store').properties.primaryEndpoints))]"
    }
  }
}
```

Note in the preceding ARM JSON template, `languageVersion` must be set to `1.10-experimental`, and the resource element is an object instead of an array.

## Next steps

- To learn about creating Bicep files, see [file](./file.md).
