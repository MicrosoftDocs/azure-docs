---
title: Linter rule - use resource ID functions
description: Linter rule - use resource ID functions
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 03/20/2024
---

# Linter rule - use resource ID functions

Ensures that the ID of a symbolic resource name or a suitable function is used rather than a manually created ID, such as a concatenating string, for all properties representing a resource ID. Use resource symbolic names whenever it's possible.

The allowed functions include:

- [`extensionResourceId`](./bicep-functions-resource.md#extensionresourceid)
- [`resourceId`](./bicep-functions-resource.md#resourceid)
- [`subscriptionResourceId`](./bicep-functions-resource.md#subscriptionresourceid)
- [`tenantResourceId`](./bicep-functions-resource.md#tenantresourceid)
- [`reference`](./bicep-functions-resource.md#reference)
- [`subscription`](./bicep-functions-scope.md#subscription)
- [`guid`](./bicep-functions-string.md#guid)

## Linter rule code

Use the following value in the [Bicep configuration file](bicep-config-linter.md) to customize rule settings:

`use-resource-id-functions`

## Solution

The following example fails this test because the resource's `api/id` property uses a manually created string:

```bicep
@description('description')
param connections_azuremonitorlogs_name string

@description('description')
param location string

@description('description')
param resourceTags object
param tenantId string

resource connections_azuremonitorlogs_name_resource 'Microsoft.Web/connections@2016-06-01' = {
  name: connections_azuremonitorlogs_name
  location: location
  tags: resourceTags
  properties: {
    displayName: 'azuremonitorlogs'
    statuses: [
      {
        status: 'Connected'
      }
    ]
    nonSecretParameterValues: {
      'token:TenantId': tenantId
      'token:grantType': 'code'
    }
    api: {
      name: connections_azuremonitorlogs_name
      displayName: 'Azure Monitor Logs'
      description: 'Use this connector to query your Azure Monitor Logs across Log Analytics workspace and Application Insights component, to list or visualize results.'
      iconUri: 'https://connectoricons-prod.azureedge.net/releases/v1.0.1501/1.0.1501.2507/${connections_azuremonitorlogs_name}/icon.png'
      brandColor: '#0072C6'
      id: '/subscriptions/<subscription_id_here>/providers/Microsoft.Web/locations/<region_here>/managedApis/${connections_azuremonitorlogs_name}'
      type: 'Microsoft.Web/locations/managedApis'
    }
  }
}
```

You can fix it by using the `subscriptionResourceId()` function:

```bicep
@description('description')
param connections_azuremonitorlogs_name string

@description('description')
param location string

@description('description')
param resourceTags object
param tenantId string

resource connections_azuremonitorlogs_name_resource 'Microsoft.Web/connections@2016-06-01' = {
  name: connections_azuremonitorlogs_name
  location: location
  tags: resourceTags
  properties: {
    displayName: 'azuremonitorlogs'
    statuses: [
      {
        status: 'Connected'
      }
    ]
    nonSecretParameterValues: {
      'token:TenantId': tenantId
      'token:grantType': 'code'
    }
    api: {
      name: connections_azuremonitorlogs_name
      displayName: 'Azure Monitor Logs'
      description: 'Use this connector to query your Azure Monitor Logs across Log Analytics workspace and Application Insights component, to list or visualize results.'
      iconUri: 'https://connectoricons-prod.azureedge.net/releases/v1.0.1501/1.0.1501.2507/${connections_azuremonitorlogs_name}/icon.png'
      brandColor: '#0072C6'
      id: subscriptionResourceId('Microsoft.Web/locations/managedApis', location, connections_azuremonitorlogs_name)
      type: 'Microsoft.Web/locations/managedApis'
    }
  }
}
```

## Next steps

For more information about the linter, see [Use Bicep linter](./linter.md).
