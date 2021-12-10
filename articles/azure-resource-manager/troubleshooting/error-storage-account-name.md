---
title: Storage account name errors
description: Describes errors that can occur when specifying a storage account name in an Azure Resource Manager template (ARM template) or Bicep file.
ms.topic: troubleshooting
ms.date: 11/12/2021
---

# Resolve errors for storage account names

This article describes naming errors that can occur when deploying a storage account with an Azure Resource Manager template (ARM template) or Bicep file.

## Symptom

If your storage account name includes prohibited characters, like an uppercase letter or exclamation point, you receive an error:

```Output
Code=AccountNameInvalid
Message=S!torageckrexph7isnoc is not a valid storage account name. Storage account name must be
between 3 and 24 characters in length and use numbers and lower-case letters only.
```

For storage accounts, you must provide a resource name that's unique across Azure. If you don't provide a unique name, you receive an error:

```Output
Code=StorageAccountAlreadyTaken
Message=The storage account named mystorage is already taken.
```

If you deploy a storage account with the same name as an existing storage account in your subscription, but in a different location, you receive an error. The error indicates the storage account already exists in a different location. Either delete the existing storage account or use the same location as the existing storage account.

## Cause

Storage account names must be between 3 and 24 characters in length and only use numbers and lowercase letters. No uppercase letters or special characters. The name must be unique.

## Solution

You can create a unique name by concatenating your naming convention with the result of the `uniqueString` function.

# [Bicep](#tab/bicep)

Bicep uses [string interpolation](../bicep/bicep-functions-string.md#concat) with [uniqueString](../bicep/bicep-functions-string.md#uniquestring).

```bicep
resource storageAccount 'Microsoft.Storage/storageAccounts@2021-04-01' = {
  name: 'storage${uniqueString(resourceGroup().id)}'
```

# [JSON](#tab/json)

ARM templates use [concat](../templates/template-functions-string.md#concat) with [uniqueString](../templates/template-functions-string.md#uniquestring).

```json
"name": "[concat('storage', uniqueString(resourceGroup().id))]",
"type": "Microsoft.Storage/storageAccounts",
```

---

Make sure your storage account name doesn't exceed 24 characters. The `uniqueString` function returns 13 characters. If you want to concatenate a prefix or suffix, provide a value that's 11 characters or less.

The following examples use a parameter that creates a prefix with a maximum of 11 characters.

# [Bicep](#tab/bicep)

```bicep
@description('The prefix value for the storage account name.')
@maxLength(11)
param storageNamePrefix string = 'storage'
```

# [JSON](#tab/json)

```json
"parameters": {
  "storageNamePrefix": {
    "type": "string",
    "maxLength": 11,
    "defaultValue": "storage",
    "metadata": {
    "description": "The prefix value for the storage account name."
    }
  }
}
```

---

You then concatenate the parameter value with the `uniqueString` value to create a storage account name.

# [Bicep](#tab/bicep)

```bicep
name: '${storageNamePrefix}${uniqueString(resourceGroup().id)}'
```

# [JSON](#tab/json)

```json
"name": "[concat(parameters('storageNamePrefix'), uniquestring(resourceGroup().id))]"
```

---
