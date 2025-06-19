---
title: Tag resources, resource groups, and subscriptions with Bicep
description: Shows how to use Bicep to apply tags to Azure resources.
ms.topic: conceptual
ms.custom:
  - devx-track-bicep
  - build-2025
ms.date: 05/14/2025
---

# Apply tags with Bicep

This article describes how to use Bicep to tag resources, resource groups, and subscriptions during deployment. For tag recommendations and limitations, see [Use tags to organize your Azure resources and management hierarchy](tag-resources.md).

> [!NOTE]
> The tags you apply through a Bicep file will replace any existing tags on the resource. If you want to retain existing tags, you need to explicitly include them in the template.

## Apply values

The following example deploys a storage account with three tags. Two of the tags (`Dept` and `Environment`) are set to literal values. One tag (`LastDeployed`) is set to a parameter that defaults to the current date.

```Bicep
param location string = resourceGroup().location
param utcShort string = utcNow('d')

resource stgAccount 'Microsoft.Storage/storageAccounts@2021-04-01' = {
  name: 'storage${uniqueString(resourceGroup().id)}'
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'Storage'
  tags: {
    Dept: 'Finance'
    Environment: 'Production'
    LastDeployed: utcShort
  }
}
```

## Apply an object

You can define an object parameter that stores several tags and apply that object to the tag element. This approach provides more flexibility than the previous example because the object can have different properties. Each property in the object becomes a separate tag for the resource. The following example has a parameter named `tagValues` that you apply to the tag element.

```Bicep
param location string = resourceGroup().location
param tagValues object = {
  Dept: 'Finance'
  Environment: 'Production'
}

resource stgAccount 'Microsoft.Storage/storageAccounts@2021-04-01' = {
  name: 'storage${uniqueString(resourceGroup().id)}'
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'Storage'
  tags: tagValues
}
```

## Apply a JSON string

To store many values in a single tag, apply a JSON string that represents the values. The entire JSON string is stored as one tag that can't exceed 256 characters. The following example has a single tag named `CostCenter` that contains several values from a JSON string:

```Bicep
param location string = resourceGroup().location

resource stgAccount 'Microsoft.Storage/storageAccounts@2021-04-01' = {
  name: 'storage${uniqueString(resourceGroup().id)}'
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'Storage'
  tags: {
    CostCenter: '{"Dept":"Finance","Environment":"Production"}'
  }
}
```

## Apply tags from resource group

To apply tags from a resource group to a resource, use the [resourceGroup()](../templates/template-functions-resource.md#resourcegroup) function. When you get the tag value, use the `tags[tag-name]` syntax instead of the `tags.tag-name` syntax, because some characters aren't parsed correctly in the dot notation.

```Bicep
param location string = resourceGroup().location

resource stgAccount 'Microsoft.Storage/storageAccounts@2021-04-01' = {
  name: 'storage${uniqueString(resourceGroup().id)}'
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'Storage'
  tags: {
    Dept: resourceGroup().tags['Dept']
    Environment: resourceGroup().tags['Environment']
  }
}
```

## Apply tags to resource groups or subscriptions

You can add tags to a resource group or subscription by deploying the `Microsoft.Resources/tags` resource type. You can apply the tags to the target resource group or subscription you want to deploy. Each time you deploy the template, you replace any previous tags.

```Bicep
param tagName string = 'TeamName'
param tagValue string = 'AppTeam1'

resource applyTags 'Microsoft.Resources/tags@2021-04-01' = {
  name: 'default'
  properties: {
    tags: {
      '${tagName}': tagValue
    }
  }
}
```

The following Bicep adds the tags from an object to the subscription that you deploy to. For more information about subscription deployments, see [Create resource groups and resources at the subscription level](../bicep/deploy-to-subscription.md).

```Bicep
targetScope = 'subscription'

param tagObject object = {
  TeamName: 'AppTeam1'
  Dept: 'Finance'
  Environment: 'Production'
}

resource applyTags 'Microsoft.Resources/tags@2021-04-01' = {
  name: 'default'
  properties: {
    tags: tagObject
  }
}
```

## Read Tags

You can read existing tags with the following approaches.

> [!WARNING]
> The `tags` property on the `Microsoft.Resources/tags` resource is not set if there are no tags set.
> To avoid errors, ensure you use the safe-dereference operator (`.?`) on `properties`.

```Bicep
resource readTags 'Microsoft.Resources/tags@2021-04-01' existing = {
  name: 'default'
}
var tagValue = readTags.properties?.tags?.myTag

// Equivalent to above:
var tagValue2 = reference(subscriptionResourceId('Microsoft.Resources/tags', 'default'), '2021-04-01', 'Full').properties.?tags.?myTag2
```

## Next steps

* For a list of resource types that support tags, see [Tag support for Azure resources](tag-support.md).
* For recommendations on how to implement a tagging strategy, see [Resource naming and tagging decision guide](/azure/cloud-adoption-framework/decision-guides/resource-tagging/?toc=/azure/azure-resource-manager/management/toc.json).
* For tag recommendations and limitations, see [Use tags to organize your Azure resources and management hierarchy](tag-resources.md).
