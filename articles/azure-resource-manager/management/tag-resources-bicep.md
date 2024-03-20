---
title: Tag resources, resource groups, and subscriptions with Bicep
description: Shows how to use Bicep to apply tags to Azure resources.
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 03/19/2024
---

# Apply tags with Bicep

This article describes how to use Bicep to tag resources, resource groups, and subscriptions during deployment. For tag recommendations and limitations, see [Use tags to organize your Azure resources and management hierarchy](tag-resources.md).

> [!NOTE]
> The tags you apply through a Bicep file overwrite any existing tags.

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

You can define an object parameter that stores several tags and apply that object to the tag element. This approach provides more flexibility than the previous example because the object can have different properties. Each property in the object becomes a separate tag for the resource. The following example has a parameter named `tagValues` that's applied to the tag element.

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

You can add tags to a resource group or subscription by deploying the `Microsoft.Resources/tags` resource type. You can apply the tags  to the target resource group or subscription you want to deploy. Each time you deploy the template you replace any previous tags.

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

The following Bicep adds the tags from an object to the subscription it's deployed to. For more information about subscription deployments, see [Create resource groups and resources at the subscription level](../bicep/deploy-to-subscription.md).

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

## Next steps

* Not all resource types support tags. To determine if you can apply a tag to a resource type, see [Tag support for Azure resources](tag-support.md).
* For recommendations on how to implement a tagging strategy, see [Resource naming and tagging decision guide](/azure/cloud-adoption-framework/decision-guides/resource-tagging/?toc=/azure/azure-resource-manager/management/toc.json).
* For tag recommendations and limitations, see [Use tags to organize your Azure resources and management hierarchy](tag-resources.md).
