---
title: Linter rule - simplify JSON null
description: Linter rule - simplify JSON null
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 03/20/2024
---

# Linter rule - simplify JSON null

This rule finds `json('null')`.

## Linter rule code

Use the following value in the [Bicep configuration file](bicep-config-linter.md) to customize rule settings:

`simplify-json-null`

## Solution

The following example fails this test because `json('null')` is used:

```bicep
@description('The name of the API Management service instance')
param apiManagementServiceName string = 'apiservice${uniqueString(resourceGroup().id)}'

@description('The email address of the owner of the service')
@minLength(1)
param publisherEmail string

@description('The name of the owner of the service')
@minLength(1)
param publisherName string

@description('The pricing tier of this API Management service')
@allowed([
  'Premium'
])
param sku string = 'Premium'

@description('The instance size of this API Management service.')
param skuCount int = 3

@description('Location for all resources.')
param location string = resourceGroup().location

@description('Zone numbers e.g. 1,2,3.')
param availabilityZones array = [
  '1'
  '2'
  '3'
]

resource apiManagementService 'Microsoft.ApiManagement/service@2022-08-01' = {
  name: apiManagementServiceName
  location: location
  zones: ((length(availabilityZones) == 0) ? json('null') : availabilityZones)
  sku: {
    name: sku
    capacity: skuCount
  }
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    publisherEmail: publisherEmail
    publisherName: publisherName
  }
}
```

You can simplify the syntax by replacing `json('null')` by `null`:

```bicep
@description('The name of the API Management service instance')
param apiManagementServiceName string = 'apiservice${uniqueString(resourceGroup().id)}'

@description('The email address of the owner of the service')
@minLength(1)
param publisherEmail string

@description('The name of the owner of the service')
@minLength(1)
param publisherName string

@description('The pricing tier of this API Management service')
@allowed([
  'Premium'
])
param sku string = 'Premium'

@description('The instance size of this API Management service.')
param skuCount int = 3

@description('Location for all resources.')
param location string = resourceGroup().location

@description('Zone numbers e.g. 1,2,3.')
param availabilityZones array = [
  '1'
  '2'
  '3'
]

resource apiManagementService 'Microsoft.ApiManagement/service@2022-08-01' = {
  name: apiManagementServiceName
  location: location
  zones: ((length(availabilityZones) == 0) ? null : availabilityZones)
  sku: {
    name: sku
    capacity: skuCount
  }
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    publisherEmail: publisherEmail
    publisherName: publisherName
  }
}
```

You can simplify the syntax by selecting **Quick Fix** as shown on the following screenshot:

:::image type="content" source="./media/linter-rule-simplify-json-null/bicep-linter-rule-simplify-json-null-quick-fix.png" alt-text="Screenshot of simplify JSON null quick fix.":::

## Next steps

For more information about the linter, see [Use Bicep linter](./linter.md).
