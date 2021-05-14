---
title: Declare resources in Bicep
description: Describes how to declare resources to deploy in Bicep.
author: mumian
ms.author: jgao
ms.topic: conceptual
ms.date: 05/05/2021
---

# Resource declaration in Bicep

To deploy a resource through a Bicep file, you add a resource declaration by using the `resource` keyword.

[!INCLUDE [Bicep preview](../../../includes/resource-manager-bicep-preview.md)]

## Set resource type and version

When adding a resource to your Bicep file, start by setting the resource type and API version. These values determine the other properties that are available for the resource.

The following example shows how to set the resource type and API version for a storage account. The example doesn't show the full resource declaration.

```bicep
resource myStorageAccount 'Microsoft.Storage/storageAccounts@2019-06-01' = {
  ...
}
```

You set a symbolic name for the resource. In the preceding example, the symbolic name is `myStorageAccount`. You can use any value for the symbolic name but it can't be the same as another resource, parameter, or variable in the Bicep file. The symbolic name isn't the same as the resource name. You use the symbolic name to easily reference the resource in other parts of your Bicep file.

## Set resource name

Each resource has a name. When setting the resource name, pay attention to the [rules and restrictions for resource names](../management/resource-name-rules.md).

```bicep
@minLength(3)
@maxLength(24)
param storageAccountName string

resource sa 'Microsoft.Storage/storageAccounts@2019-06-01' = {
  name: storageAccountName
  ...
}
```

## Set location

Many resources require a location. You can determine if the resource needs a location either through intellisense or [template reference](/azure/templates/). The following example adds a location parameter that is used for the storage account.

```bicep
@minLength(3)
@maxLength(24)
param storageAccountName string
param location string = resourceGroup().location

resource sa 'Microsoft.Storage/storageAccounts@2019-06-01' = {
  name: storageAccountName
  location: location
  ...
}
```

For more information, see [Set resource location in Bicep](./resource-location.md).

## Set tags

You can apply tags to a resource during deployment. Tags help you logically organize your deployed resources. For examples of the different ways you can specify the tags, see [ARM template tags](../management/tag-resources.md#arm-templates).

## Set resource-specific properties

The preceding properties are generic to most resource types. After setting those values, you need to set the properties that are specific to the resource type you're deploying.

Use intellisense or [template reference](/azure/templates/) to determine which properties are available and which ones are required. The following example sets the remaining properties for a storage account.

```bicep
@minLength(3)
@maxLength(24)
param storageAccountName string
param location string = resourceGroup().location

resource sa 'Microsoft.Storage/storageAccounts@2019-06-01' = {
  name: storageAccountName
  location: location
  sku: {
    name: 'Standard_LRS'
    tier: 'Standard'
  }
  kind: 'StorageV2'
  properties: {
    accessTier: 'Hot'
  }
}
```

## Next steps

* To conditionally deploy a resource, see [Conditional deployment in Bicep](./conditional-resource-deployment.md).
* To set resource dependencies, see [Define the order for deploying resources in Bicep](./resource-dependency.md).
