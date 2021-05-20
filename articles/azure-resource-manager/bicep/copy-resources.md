---
title: Deploy multiple instances of resources in Bicep
description: Use loops and arrays in a Bicep file to deploy multiple instances of resources.

author: mumian
ms.author: jgao
ms.topic: conceptual
ms.date: 05/20/2021
---

# Resource iteration in Bicep

This article shows you how to create more than one instance of a resource in your Bicep file. You can add a loop to the `resource` section of your file and dynamically set the number of resources to deploy. You also avoid repeating syntax in your Bicep file.

You can also use a loop with [properties](copy-properties.md), [variables](copy-variables.md), and [outputs](copy-outputs.md).

If you need to specify whether a resource is deployed at all, see [condition element](conditional-resource-deployment.md).

## Syntax

Loops can be used declare multiple resources by:

- Iterating over an array.

  ```bicep
  @batchSize(<number>)
  resource <resource-symbolic-name> '<resource-type>@<api-version>' = [for <item> in <collection>: {
    <resource-properties>
  }]
  ```

- Iterating over the elements of an array.

  ```bicep
  @batchSize(<number>)
  resource <resource-symbolic-name> '<resource-type>@<api-version>' = [for (<item>, <index>) in <collection>: {
    <resource-properties>
  }]
  ```

- Using a loop index.

  ```bicep
  @batchSize(<number>)
  resource <resource-symbolic-name> '<resource-type>@<api-version>' = [for <index> in range(<start>, <stop>): {
    <resource-properties>
  }]
  ```

## Copy limits

The Bicep file builds a JSON template that uses the `copy` element and there are limitations that affect the `copy` element. For more information, see [Resource iteration in ARM templates](../templates/copy-resources.md).

## Resource iteration

The following example creates the number of storage accounts specified in the `storageCount` parameter.

```bicep
param storageCount int = 2

resource storage_id 'Microsoft.Storage/storageAccounts@2019-04-01' = [for i in range(0, storageCount): {
  name: '${i}storage${uniqueString(resourceGroup().id)}'
  location: resourceGroup().location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'Storage'
  properties: {}
}]
```

Notice the index `i` is used in creating the storage account resource name.

The following example creates one storage account for each name provided in the `storageNames` parameter.

```bicep
param storageNames array = [
  'contoso'
  'fabrikam'
  'coho'
]

resource storageNames_id 'Microsoft.Storage/storageAccounts@2019-04-01' = [for name in storageNames: {
  name: concat(name, uniqueString(resourceGroup().id))
  location: resourceGroup().location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'Storage'
  properties: {}
}]
```

If you want to return values from the deployed resources, you can use a loop in the [output section](copy-outputs.md).

## Serial or Parallel

By default, Resource Manager creates the resources in parallel. It applies no limit to the number of resources deployed in parallel, other than the total limit of 800 resources in the template. The order in which they're created isn't guaranteed.

You may want to specify that the resources are deployed in sequence. For example, when updating a production environment, you may want to stagger the updates so only a certain number are updated at any one time.

To serially deploy more than one instance of a resource, set the `batchSize` [decorator](./file.md#resource-and-module-decorators) to the number of instances to deploy at a time. With serial mode, Resource Manager creates a dependency on earlier instances in the loop, so it doesn't start one batch until the previous batch completes.

```bicep
@batchSize(2)
resource storage_id 'Microsoft.Storage/storageAccounts@2019-04-01' = [for i in range(0, 4): {
  name: '${i}storage${uniqueString(resourceGroup().id)}'
  location: resourceGroup().location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'Storage'
  properties: {}
}]
```

## Iteration for a child resource

You can't use a loop for a child resource. To create more than one instance of a resource that you typically define as nested within another resource, you must instead create that resource as a top-level resource. You define the relationship with the parent resource through the type and name properties.

For example, suppose you typically define a dataset as a child resource within a data factory.

```bicep
resource dataFactoryName_resource 'Microsoft.DataFactory/factories@2018-06-01' = {
  name: exampleDataFactory
...
resource dataFactoryName_ArmtemplateTestDatasetIn 'Microsoft.DataFactory/factories/datasets@2018-06-01' = {
  parent: dataFactoryName_resource
  name: 'ArmtemplateTestDatasetIn'
  dependsOn: [
    dataFactoryName_resource
  ]
```

To create more than one data set, move it outside of the data factory. The dataset must be at the same level as the data factory, but it's still a child resource of the data factory. You preserve the relationship between data set and data factory through the type and name properties. Since type can no longer be inferred from its position in the template, you must provide the fully qualified type in the format: `{resource-provider-namespace}/{parent-resource-type}/{child-resource-type}`.

To establish a parent/child relationship with an instance of the data factory, provide a name for the data set that includes the parent resource name. Use the format: `{parent-resource-name}/{child-resource-name}`.

The following example shows the implementation:

```bicep
resource dataFactoryName_resource 'Microsoft.DataFactory/factories@2018-06-01' = {
  name: "exampleDataFactory"
  ...
}

resource dataFactoryName_ArmtemplateTestDatasetIn 'Microsoft.DataFactory/factories/datasets@2018-06-01' = [for i in range(0, 3): {
  name: 'exampleDataFactory/exampleDataset${i}'
  ...
}
```

## Example templates

The following examples show common scenarios for creating more than one instance of a resource or property.

|Template  |Description  |
|---------|---------|
|[Copy storage](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/multipleinstance/copystorage.json) |Deploys more than one storage account with an index number in the name. |
|[Serial copy storage](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/multipleinstance/serialcopystorage.json) |Deploys several storage accounts one at time. The name includes the index number. |
|[Copy storage with array](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/multipleinstance/copystoragewitharray.json) |Deploys several storage accounts. The name includes a value from an array. |

## Next steps

- For other uses of the loop, see:
  - [Property iteration in Bicep files](copy-properties.md)
  - [Variable iteration in Bicep files](copy-variables.md)
  - [Output iteration in Bicep files](copy-outputs.md)
- If you want to learn about the sections of a Bicep file, see [Understand the structure and syntax of Bicep files](file.md).
- For information about how to deploy multiple resources, see [Use Bicep modules](modules.md).
- To set dependencies on resources that are created in a loop, see [Define the order for deploying resources](resource-dependency.md).
- To learn how to deploy with PowerShell, see [Deploy resources with Bicep and Azure PowerShell](deploy-powershell.md).
- To learn how to deploy with Azure CLI, see [Deploy resources with Bicep and Azure CLI](deploy-cli.md).
