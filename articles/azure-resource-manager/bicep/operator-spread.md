---
title: Bicep spread operator
description: Describes Bicep spread operator.
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 08/07/2024
---

# Bicep spread operator

The spread operator is used to expand an iterable array or object into individual elements. The spread operator allows you to easily manipulate arrays or objects by spreading their elements or properties into new arrays or objects.

## Spread

`...`

The spread operator is used to copy properties from one object to another or to merge arrays and objects in a concise and readable way.

### Examples

The following example shows the spread operator used in an object: 

```bicep
var objA = { color: 'white' }
output objB object = { shape: 'circle', ...objA } 
```

Output from the example:

| Name | Type | Value |
|------|------|-------|
| `objB` | object | { shape: 'circle', color: 'white' } |

The following example shows the spread operator used in an array: 

```bicep
var arrA = [ 2, 3 ]
output arrB array = [ 1, ...arrA, 4 ] 
```

Output from the example:

| Name | Type | Value |
|------|------|-------|
| `arrB` | array | [ 1, 2, 3, 4 ] |

The following example shows spread used multiple times in a single operation:

```bicep
var arrA = [ 2, 3 ]
output arrC array = [ 1, ...arrA, 4, ...arrA ] 
```

Output from the example:

| Name | Type | Value |
|------|------|-------|
| `arrC` | array | [ 1, 2, 3, 4, 2, 3 ] |

The following example shows spread used in a multi-line operation:

```bicep
var objA = { color: 'white' }
var objB = { shape: 'circle'}
output objCombined object = { 
  ...objA 
  ...objB
} 
```

In this usage, comma isn't used between the two lines.  Output from the example:

| Name | Type | Value |
|------|------|-------|
| `objCombined` | object | { color: 'white', shape: 'circle' } |

The spread operation can be used to avoid setting an optional property. In the following example, _accessTier_ is set only if the parameter _tier_ isn't an empty string.

```bicep
param location string = resourceGroup().location
param tier string = 'Hot'

var storageAccountName = uniqueString(resourceGroup().id)
var accessTier = tier != '' ? {accessTier: tier} : {}

resource mystorage 'Microsoft.Storage/storageAccounts@2023-05-01' = {
  name: storageAccountName
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    ...accessTier
  } 
}
```

The preceding example can also be written as:

```bicep
param location string = resourceGroup().location
param tier string = 'Hot'

var storageAccountName = uniqueString(resourceGroup().id)

resource mystorage 'Microsoft.Storage/storageAccounts@2023-05-01' = {
  name: storageAccountName
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    ...(tier != '' ? {accesssTier: tier} : {})
  } 
}
```

The spread operator can be used to override existing properties. 

```bicep
param location string = resourceGroup().location
param storageProperties {
  accessTier: string?
}

resource mystorage 'Microsoft.Storage/storageAccounts@2023-05-01' = {
  name: uniqueString(resourceGroup().id)
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    accessTier: 'Cold'
    ...storageProperties
  }
}
```

## Next steps

- To run the examples, use Azure CLI or Azure PowerShell to [deploy a Bicep file](./quickstart-create-bicep-use-visual-studio-code.md#deploy-the-bicep-file).
- To create a Bicep file, see [Quickstart: Create Bicep files with Visual Studio Code](./quickstart-create-bicep-use-visual-studio-code.md).
- For information about how to resolve Bicep type errors, see [Any function for Bicep](./bicep-functions-any.md).
