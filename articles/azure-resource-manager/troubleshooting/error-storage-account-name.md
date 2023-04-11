---
title: Resolve errors for storage account names
description: Describes how to resolve errors for Azure storage account names that can occur during deployment with a Bicep file or Azure Resource Manager template (ARM template).
ms.topic: troubleshooting
ms.custom: devx-track-arm-template, devx-track-bicep
ms.date: 04/05/2023
---

# Resolve errors for storage account names

This article describes how to resolve errors for Azure storage account names that can occur during deployment with a Bicep file or Azure Resource Manager template (ARM template). Common causes for an error are a storage account name with invalid characters or a storage account that uses the same name as an existing storage account. Storage account names must be globally unique across Azure.

## Symptom

An invalid storage account name causes an error code during deployment. The following are some examples of errors for storage account names.

### Account name invalid

If your storage account name includes prohibited characters, like an uppercase letter or special character like an exclamation point.

```Output
Code=AccountNameInvalid
Message=S!torageckrexph7isnoc is not a valid storage account name. Storage account name must be
between 3 and 24 characters in length and use numbers and lower-case letters only.
```

### Invalid resource location

If you try to deploy a new storage account with the same name and in the same resource group, but use a different location as an existing storage account in your Azure subscription. The error indicates the storage account already exists and can't be created in the new location. Select a different name to create the new storage account.

```Output
Code=InvalidResourceLocation
Message=The resource 'storageckrexph7isnoc' already exists in location 'westus'
in resource group 'demostorage'. A resource with the same name cannot be created in location 'eastus'.
Please select a new resource name.
```

### Storage account in another resource group

If you try to deploy a new storage account with the same name and location as an existing storage account but in a different resource group in your subscription.

```Output
Code=StorageAccountInAnotherResourceGroup
Message=The account storageckrexph7isnoc is already in another resource group in this subscription.
```

### Storage account already taken

If you try to deploy a new storage account with the same name as a storage account that already exists in Azure. The existing storage account name might be in your subscription or tenant, or anywhere across Azure. Storage account names must be globally unique across Azure.

```Output
Code=StorageAccountAlreadyTaken
Message=The storage account named storageckrexph7isnoc is already taken.
```

## Cause

Common reasons for an error are because the storage account name uses invalid characters or is a duplicate name. Storage account names must meet the following criteria:

- Length between 3 and 24 characters with only lowercase letters and numbers.
- Must be globally unique across Azure. Storage account names can't be duplicated in Azure.

## Solution

You can create a unique name by concatenating a prefix or suffix with a value from the `uniqueString` function.

The following examples specify a prefix with the string `storage` that's concatenated with the value from `uniqueString`.

# [Bicep](#tab/bicep)

Bicep uses [string interpolation](../bicep/bicep-functions-string.md#concat) with [uniqueString](../bicep/bicep-functions-string.md#uniquestring).

```bicep
resource storageAccount 'Microsoft.Storage/storageAccounts@2021-09-01' = {
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

The following examples use a parameter named `storageNamePrefix` that creates a prefix with a maximum of 11 characters.

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

You then concatenate the `storageNamePrefix` parameter's value with the `uniqueString` value to create a storage account name.

# [Bicep](#tab/bicep)

```bicep
name: '${storageNamePrefix}${uniqueString(resourceGroup().id)}'
```

# [JSON](#tab/json)

```json
"name": "[concat(parameters('storageNamePrefix'), uniquestring(resourceGroup().id))]"
```

---
