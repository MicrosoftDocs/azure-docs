---
title: Retry resource deployments in Bicep (retryOn)
description: Use the @retryOn decorator to automatically retry a resource deployment when specified error codes are encountered in Bicep.
ms.topic: concept-article
ms.custom: devx-track-bicep
ms.date: 07/13/2026
---

# Retry resource deployments in Bicep

Some Azure resources encounter transient errors during deployment, such as replication delays that resolve after one or more retries. The `@retryOn` decorator retries a resource deployment when specific error codes are returned, without requiring workarounds like deployment scripts or split templates.

## Syntax

```bicep
@retryOn(<errorCodes> [, <retryCount>])
resource <symbolicName> '<resourceType>@<apiVersion>' = {
  ...
}
```

|  Parameter   |      Type      |                                         Description                                         |
| ------------ | -------------- | ------------------------------------------------------------------------------------------- |
| `errorCodes` | array          | A list of error code strings that trigger a retry.                                          |
| `retryCount` | int (optional) | Maximum number of retries. Defaults to 30 retries. If specified, capped at a maximum of 30. |

## Example

The following example retries the storage account deployment up to 10 times when `ResourceNotFound` is returned:

```bicep
@retryOn(['ResourceNotFound'], 10)
resource storageAccount 'Microsoft.Storage/storageAccounts@2023-05-01' = {
  name: 'srp1'
  location: location
  sku: {
    name: 'Premium_LRS'
  }
  kind: 'BlobStorage'
}
```

## Use with loops

`@retryOn` works with `for` loops and the [`@batchSize`](./resource-declaration.md#batchsize) decorator. When you use `@batchSize`, the retry behavior applies to each batch of resources.

```bicep
@retryOn(['ResourceNotFound'], 10)
@batchSize(2)
resource vwanHub 'Microsoft.Network/virtualHubs@2024-01-01' = [for i in range(0, 4): {
  name: 'vwan-hub-${regionNamePrefix}-${i}'
  location: region
  tags: defaultTags
  properties: {
    addressPrefix: vwanHubCIDR
  }
}]
```

## Next steps

- [Resource declaration in Bicep](./resource-declaration.md)
- [Use decorators in Bicep](./file.md#decorators)
- [Deploy resources with Bicep and Azure CLI](./deploy-cli.md)
