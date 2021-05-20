---
title: Conditional deployment with Bicep
description: Describes how to conditionally deploy a resource in Bicep.

author: mumian
ms.author: jgao
ms.topic: conceptual
ms.date: 05/14/2021
---

# Conditional deployment in Bicep

Sometimes you need to optionally deploy a resource in Bicep. Use the `if` keyword to specify whether the resource is deployed. The value for the condition resolves to true or false. When the value is true, the resource is created. When the value is false, the resource isn't created. The value can only be applied to the whole resource.

> [!NOTE]
> Conditional deployment doesn't cascade to [child resources](child-resource-name-type.md). If you want to conditionally deploy a resource and its child resources, you must apply the same condition to each resource type.

## Deploy condition

You can pass in a parameter value that indicates whether a resource is deployed. The following example conditionally deploys a DNS zone.

```bicep
param deployZone bool

resource dnsZone 'Microsoft.Network/dnszones@2018-05-01' = if (deployZone) {
  name: 'myZone'
  location: 'global'
}
```

For a more complex example, see [Azure SQL logical server](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.sql/sql-logical-server).

## New or existing resource

You can use conditional deployment to create a new resource or use an existing one. The following example shows how to either deploy a new storage account or use an existing storage account.

```bicep
param storageAccountName string
param location string = resourceGroup().location

@allowed([
  'new'
  'existing'
])
param newOrExisting string = 'new'

resource sa 'Microsoft.Storage/storageAccounts@2019-06-01' = if (newOrExisting == 'new') {
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

When the parameter `newOrExisting` is set to **new**, the condition evaluates to true. The storage account is deployed. However, when `newOrExisting` is set to **existing**, the condition evaluates to false and the storage account isn't deployed.

For a complete example template that uses the `condition` element, see [VM with a new or existing Virtual Network, Storage, and Public IP](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.compute/vm-new-or-existing-conditions).

## Runtime functions

If you use a [reference](./bicep-functions-resource.md#reference) or [list](./bicep-functions-resource.md#list) function with a resource that is conditionally deployed, the function is evaluated even if the resource isn't deployed. You get an error if the function refers to a resource that doesn't exist.

Use the [if](./bicep-functions-logical.md#if) function to make sure the function is only evaluated for conditions when the resource is deployed. See the [if function](./bicep-functions-logical.md#if) for a sample template that uses `if` and `reference` with a conditionally deployed resource.

You set a [resource as dependent](./resource-dependency.md) on a conditional resource exactly as you would any other resource. When a conditional resource isn't deployed, Azure Resource Manager automatically removes it from the required dependencies.

## Next steps

* For a Microsoft Learn module that covers conditional deployment, see [Manage complex cloud deployments by using advanced ARM template features](/learn/modules/manage-deployments-advanced-arm-template-features/).
* For recommendations about creating templates, see [ARM template best practices](../templates/template-best-practices.md).
* To create multiple instances of a resource, see [Resource iteration in Bicep](./copy-resources.md).
