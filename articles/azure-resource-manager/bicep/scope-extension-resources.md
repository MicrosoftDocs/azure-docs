---
title: Scope on extension resource types (Bicep)
description: Describes how to use the scope property when deploying extension resource types with Bicep.
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 03/20/2024
---

# Set scope for extension resources in Bicep

An extension resource is a resource that modifies another resource. For example, you can assign a role to a resource. The role assignment is an extension resource type.

For a full list of extension resource types, see [Resource types that extend capabilities of other resources](../management/extension-resource-types.md).

This article shows how to set the scope for an extension resource type when deployed with a Bicep file. It describes the scope property that is available for extension resources when applying to a resource.

> [!NOTE]
> The scope property is only available to extension resource types. To specify a different scope for a resource type that isn't an extension type, use a [module](modules.md).

### Training resources

If you would rather learn about extension resources through step-by-step guidance, see [Deploy child and extension resources by using Bicep](/training/modules/child-extension-bicep-templates).

## Apply at deployment scope

To apply an extension resource type at the target deployment scope, add the resource to your template as you would with any other resource type. The available scopes are [resource group](deploy-to-resource-group.md), [subscription](deploy-to-subscription.md), [management group](deploy-to-management-group.md), and [tenant](deploy-to-tenant.md). The deployment scope must support the resource type.

When deployed to a resource group, the following template adds a lock to that resource group.

```bicep
resource createRgLock 'Microsoft.Authorization/locks@2016-09-01' = {
  name: 'rgLock'
  properties: {
    level: 'CanNotDelete'
    notes: 'Resource group should not be deleted.'
  }
}
```

The next example assigns a role to the subscription it's deployed to.

```bicep
targetScope = 'subscription'

@description('The principal to assign the role to')
param principalId string

@allowed([
  'Owner'
  'Contributor'
  'Reader'
])
@description('Built-in role to assign')
param builtInRoleType string

var role = {
  Owner: '/subscriptions/${subscription().subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/8e3af657-a8ff-443c-a75c-2fe8c4bcb635'
  Contributor: '/subscriptions/${subscription().subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/b24988ac-6180-42a0-ab88-20f7382dd24c'
  Reader: '/subscriptions/${subscription().subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/acdd72a7-3385-48ef-bd42-f606fba81ae7'
}

resource roleAssignSub 'Microsoft.Authorization/roleAssignments@2020-04-01-preview' = {
  name: guid(subscription().id, principalId, role[builtInRoleType])
  properties: {
    roleDefinitionId: role[builtInRoleType]
    principalId: principalId
  }
}
```

## Apply to resource

To apply an extension resource to a resource, use the `scope` property. In the scope property, reference the resource you're adding the extension to. You reference the resource by providing the symbolic name for the resource. The scope property is a root property for the extension resource type.

The following example creates a storage account and applies a role to it.

```bicep
@description('The principal to assign the role to')
param principalId string

@allowed([
  'Owner'
  'Contributor'
  'Reader'
])
@description('Built-in role to assign')
param builtInRoleType string

param location string = resourceGroup().location

var role = {
  Owner: '/subscriptions/${subscription().subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/8e3af657-a8ff-443c-a75c-2fe8c4bcb635'
  Contributor: '/subscriptions/${subscription().subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/b24988ac-6180-42a0-ab88-20f7382dd24c'
  Reader: '/subscriptions/${subscription().subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/acdd72a7-3385-48ef-bd42-f606fba81ae7'
}
var uniqueStorageName = 'storage${uniqueString(resourceGroup().id)}'

resource demoStorageAcct 'Microsoft.Storage/storageAccounts@2019-04-01' = {
  name: uniqueStorageName
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'Storage'
  properties: {}
}

resource roleAssignStorage 'Microsoft.Authorization/roleAssignments@2020-04-01-preview' = {
  name: guid(demoStorageAcct.id, principalId, role[builtInRoleType])
  properties: {
    roleDefinitionId: role[builtInRoleType]
    principalId: principalId
  }
  scope: demoStorageAcct
}
```

You can apply an extension resource to an existing resource. The following example adds a lock to an existing storage account.

```bicep
resource demoStorageAcct 'Microsoft.Storage/storageAccounts@2021-04-01' existing = {
  name: 'examplestore'
}

resource createStorageLock 'Microsoft.Authorization/locks@2016-09-01' = {
  name: 'storeLock'
  scope: demoStorageAcct
  properties: {
    level: 'CanNotDelete'
    notes: 'Storage account should not be deleted.'
  }
}
```

The same requirements apply to extension resources as other resource when targeting a scope that is different than the target scope of the deployment. To learn about deploying to more than one scope, see:

* [Resource group deployments](deploy-to-resource-group.md)
* [Subscription deployments](deploy-to-subscription.md)
* [Management group deployments](deploy-to-management-group.md)
* [Tenant deployments](deploy-to-tenant.md)

The resourceGroup and subscription properties are only allowed on modules. These properties are not allowed on individual resources. Use modules if you want to deploy an extension resource with the scope set to a resource in a different resource group.

The following example shows how to apply a lock on a storage account that resides in a different resource group.

* **main.bicep:**

    ```bicep
    param resourceGroup2Name string
    param storageAccountName string

    module applyStoreLock './storageLock.bicep' = {
      name: 'addStorageLock'
      scope: resourceGroup(resourceGroup2Name)
      params: {
        storageAccountName: storageAccountName
      }
    }
    ```

* **storageLock.bicep:**

    ```bicep
    param storageAccountName string

    resource storage 'Microsoft.Storage/storageAccounts@2021-09-01' existing = {
      name: storageAccountName
    }

    resource storeLock 'Microsoft.Authorization/locks@2017-04-01' = {
      scope: storage
      name: 'storeLock'
      properties: {
        level: 'CanNotDelete'
        notes: 'Storage account should not be deleted.'
      }
    }
    ```

## Next steps

For a full list of extension resource types, see [Resource types that extend capabilities of other resources](../management/extension-resource-types.md).
