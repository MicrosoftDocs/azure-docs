---
title: Bicep functions - scopes
description: Describes the functions to use in a Bicep file to retrieve values about deployment scopes.
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 11/17/2022
---

# Scope functions for Bicep

This article describes the Bicep functions for getting scope values.

## managementGroup

`managementGroup()`

Returns an object with properties from the management group in the current deployment.

`managementGroup(identifier)`

Returns an object used for setting the scope to a management group.

Namespace: [az](bicep-functions.md#namespaces-for-functions).

### Remarks

`managementGroup()` can only be used on a [management group deployments](deploy-to-management-group.md). It returns the current management group for the deployment operation. Use when either getting a scope object or getting properties for the current management group.

`managementGroup(identifier)` can be used for any deployment scope, but only when getting the scope object. To retrieve the properties for a management group, you can't pass in the management group identifier.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| identifier |No |string |The unique identifier for the management group to deploy to. Don't use the display name for the management group. If you don't provide a value, the current management group is returned. |

### Return value

An object used for setting the `scope` property on a [module](modules.md#set-module-scope) or [extension resource type](scope-extension-resources.md). Or, an object with the properties for the current management group.

### Management group example

The following example sets the scope for a module to a management group.

```bicep
param managementGroupIdentifier string

module  'mgModule.bicep' = {
  name: 'deployToMG'
  scope: managementGroup(managementGroupIdentifier)
}
```

The next example returns properties for the current management group.

```bicep
targetScope = 'managementGroup'

var mgInfo = managementGroup()

output mgResult object = mgInfo
```

It returns:

```json
"mgResult": {
  "type": "Object",
  "value": {
    "id": "/providers/Microsoft.Management/managementGroups/examplemg1",
    "name": "examplemg1",
    "properties": {
      "details": {
        "parent": {
          "displayName": "Tenant Root Group",
          "id": "/providers/Microsoft.Management/managementGroups/00000000-0000-0000-0000-000000000000",
          "name": "00000000-0000-0000-0000-000000000000"
        },
        "updatedBy": "00000000-0000-0000-0000-000000000000",
        "updatedTime": "2020-07-23T21:05:52.661306Z",
        "version": "1"
      },
      "displayName": "Example MG 1",
      "tenantId": "00000000-0000-0000-0000-000000000000"
    },
    "type": "/providers/Microsoft.Management/managementGroups"
  }
}
```

The next example creates a new management group and uses this function to set the parent management group.

```bicep
targetScope = 'managementGroup'

param mgName string = 'mg-${uniqueString(newGuid())}'

resource newMG 'Microsoft.Management/managementGroups@2020-05-01' = {
  scope: tenant()
  name: mgName
  properties: {
    details: {
      parent: {
        id: managementGroup().id
      }
    }
  }
}

output newManagementGroup string = mgName
```

## resourceGroup

`resourceGroup()`

Returns an object that represents the current resource group.

`resourceGroup(resourceGroupName)`

And

`resourceGroup(subscriptionId, resourceGroupName)`

Return an object used for setting the scope to a resource group.

Namespace: [az](bicep-functions.md#namespaces-for-functions).

### Remarks

The resourceGroup function has two distinct uses. One usage is for setting the scope on a [module](modules.md#set-module-scope) or [extension resource type](scope-extension-resources.md). The other usage is for getting details about the current resource group. The placement of the function determines its usage. When used to set the `scope` property, it returns a scope object.

`resourceGroup()` can be used for either setting scope or getting details about the resource group.

`resourceGroup(resourceGroupName)` and `resourceGroup(subscriptionId, resourceGroupName)` can only be used for setting scope.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| resourceGroupName |No |string | The name of the resource group to deploy to. If you don't provide a value, the current resource group is returned. |
| subscriptionId |No |string |The unique identifier for the subscription to deploy to. If you don't provide a value, the current subscription is returned. |

### Return value

When used for setting scope, the function returns an object that is valid for the `scope` property on a module or extension resource type.

When used for getting details about the resource group, the function returns the following format:

```json
{
  "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}",
  "name": "{resourceGroupName}",
  "type":"Microsoft.Resources/resourceGroups",
  "location": "{resourceGroupLocation}",
  "managedBy": "{identifier-of-managing-resource}",
  "tags": {
  },
  "properties": {
    "provisioningState": "{status}"
  }
}
```

The **managedBy** property is returned only for resource groups that contain resources that are managed by another service. For Managed Applications, Databricks, and AKS, the value of the property is the resource ID of the managing resource.

### Resource group example

The following example scopes a module to a resource group.

```bicep
param resourceGroupName string

module exampleModule 'rgModule.bicep' = {
  name: 'exampleModule'
  scope: resourceGroup(resourceGroupName)
}
```

The next example returns the properties of the resource group.

```bicep
output resourceGroupOutput object = resourceGroup()
```

It returns an object in the following format:

```json
{
  "id": "/subscriptions/{subscription-id}/resourceGroups/examplegroup",
  "name": "examplegroup",
  "type":"Microsoft.Resources/resourceGroups",
  "location": "southcentralus",
  "properties": {
    "provisioningState": "Succeeded"
  }
}
```

A common use of the resourceGroup function is to create resources in the same location as the resource group. The following example uses the resource group location for a default parameter value.

```bicep
param location string = resourceGroup().location
```

You can also use the resourceGroup function to apply tags from the resource group to a resource. For more information, see [Apply tags from resource group](../management/tag-resources-bicep.md#apply-tags-from-resource-group).

## subscription

`subscription()`

Returns details about the subscription for the current deployment.

`subscription(subscriptionId)`

Returns an object used for setting the scope to a subscription.

Namespace: [az](bicep-functions.md#namespaces-for-functions).

### Remarks

The subscription function has two distinct uses. One usage is for setting the scope on a [module](modules.md#set-module-scope) or [extension resource type](scope-extension-resources.md). The other usage is for getting details about the current subscription. The placement of the function determines its usage. When used to set the `scope` property, it returns a scope object.

`subscription(subscriptionId)` can only be used for setting scope.

`subscription()` can be used for setting scope or getting details about the subscription.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| subscriptionId |No |string |The unique identifier for the subscription to deploy to. If you don't provide a value, the current subscription is returned. |

### Return value

When used for setting scope, the function returns an object that is valid for the `scope` property on a module or extension resource type.

When used for getting details about the subscription, the function returns the following format:

```json
{
  "id": "/subscriptions/{subscription-id}",
  "subscriptionId": "{subscription-id}",
  "tenantId": "{tenant-id}",
  "displayName": "{name-of-subscription}"
}
```

### Subscription example

The following example scopes a module to the subscription.

```bicep
module exampleModule 'subModule.bicep' = {
  name: 'deployToSub'
  scope: subscription()
}
```

The next example returns the details for a subscription.

```bicep
output subscriptionOutput object = subscription()
```

## tenant

`tenant()`

Returns an object used for setting the scope to the tenant.

Or

Returns the tenant of the user.

Namespace: [az](bicep-functions.md#namespaces-for-functions).

### Remarks

`tenant()` can be used with any deployment scope. It always returns the current tenant. You can use this function to set the scope for a resource, or to get properties for the current tenant.

### Return value

An object used for setting the `scope` property on a [module](modules.md#set-module-scope) or [extension resource type](scope-extension-resources.md). Or, an object with properties about the current tenant.

### Tenant example

The following example shows a module deployed to the tenant.

```bicep
module exampleModule 'tenantModule.bicep' = {
  name: 'deployToTenant'
  scope: tenant()
}
```

The next example returns the properties for a tenant.

```bicep
var tenantInfo = tenant()

output tenantResult object = tenantInfo
```

It returns:

```json
"tenantResult": {
  "type": "Object",
  "value": {
    "countryCode": "US",
    "displayName": "Contoso",
    "id": "/tenants/00000000-0000-0000-0000-000000000000",
    "tenantId": "00000000-0000-0000-0000-000000000000"
  }
}
```

Some resources require setting the tenant ID for a property. Rather than passing the tenant ID as a parameter, you can retrieve it with the tenant function.

```bicep
resource kv 'Microsoft.KeyVault/vaults@2021-06-01-preview' = {
  name: 'examplekeyvault'
  location: 'westus'
  properties: {
    tenantId: tenant().tenantId
    ...
  }
}
```

## Next steps

To learn more about deployment scopes, see:

* [Resource group deployments](deploy-to-resource-group.md)
* [Subscription deployments](deploy-to-subscription.md)
* [Management group deployments](deploy-to-management-group.md)
* [Tenant deployments](deploy-to-tenant.md)
