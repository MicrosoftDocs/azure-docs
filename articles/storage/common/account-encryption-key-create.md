---
title: Create an account that supports customer-managed keys for tables and queues
titleSuffix: Azure Storage
description: Learn how to create a storage account that supports configuring customer-managed keys for tables and queues. Use the Azure CLI or an Azure Resource Manager template to create a storage account that relies on the account encryption key for Azure Storage encryption. You can then configure customer-managed keys for the account.
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 03/31/2021
ms.author: tamram
ms.reviewer: ozgun
ms.subservice: common 
ms.custom: devx-track-azurecli, devx-track-azurepowershell
---

# Create an account that supports customer-managed keys for tables and queues

Azure Storage encrypts all data in a storage account at rest. By default, Queue storage and Table storage use a key that is scoped to the service and managed by Microsoft. You can also opt to use customer-managed keys to encrypt queue or table data. To use customer-managed keys with queues and tables, you must first create a storage account that uses an encryption key that is scoped to the account, rather than to the service. After you have created an account that uses the account encryption key for queue and table data, you can configure customer-managed keys for that storage account.

This article describes how to create a storage account that relies on a key that is scoped to the account. When the account is first created, Microsoft uses the account key to encrypt the data in the account, and Microsoft manages the key. You can subsequently configure customer-managed keys for the account to take advantage of those benefits, including the ability to provide your own keys, update the key version, rotate the keys, and revoke access controls.

## Create an account that uses the account encryption key

You must configure a new storage account to use the account encryption key for queues and tables at the time that you create the storage account. The scope of the encryption key cannot be changed after the account is created.

The storage account must be of type general-purpose v2. You can create the storage account and configure it to rely on the account encryption key by using either Azure CLI or an Azure Resource Manager template.

> [!NOTE]
> Only Queue and Table storage can be optionally configured to encrypt data with the account encryption key when the storage account is created. Blob storage and Azure Files always use the account encryption key to encrypt data.

# [PowerShell](#tab/powershell)

To use PowerShell to create a storage account that relies on the account encryption key, make sure you have installed the Azure PowerShell module, version 3.4.0 or later. For more information, see [Install the Azure PowerShell module](/powershell/azure/install-az-ps).

Next, create a general-purpose v2 storage account by calling the [New-AzStorageAccount](/powershell/module/az.storage/new-azstorageaccount) command, with the appropriate parameters:

- Include the `-EncryptionKeyTypeForQueue` option and set its value to `Account` to use the account encryption key to encrypt data in Queue storage.
- Include the `-EncryptionKeyTypeForTable` option and set its value to `Account` to use the account encryption key to encrypt data in Table storage.

The following example shows how to create a general-purpose v2 storage account that is configured for read-access geo-redundant storage (RA-GRS) and that uses the account encryption key to encrypt data for both Queue and Table storage. Remember to replace the placeholder values in brackets with your own values:

```powershell
New-AzStorageAccount -ResourceGroupName <resource_group> `
    -AccountName <storage-account> `
    -Location <location> `
    -SkuName "Standard_RAGRS" `
    -Kind StorageV2 `
    -EncryptionKeyTypeForTable Account `
    -EncryptionKeyTypeForQueue Account
```

# [Azure CLI](#tab/azure-cli)

To use Azure CLI to create a storage account that relies on the account encryption key, make sure you have installed Azure CLI version 2.0.80 or later. For more information, see [Install the Azure CLI](/cli/azure/install-azure-cli).

Next, create a general-purpose v2 storage account by calling the [az storage account create](/cli/azure/storage/account#az_storage_account_create) command, with the appropriate parameters:

- Include the `--encryption-key-type-for-queue` option and set its value to `Account` to use the account encryption key to encrypt data in Queue storage.
- Include the `--encryption-key-type-for-table` option and set its value to `Account` to use the account encryption key to encrypt data in Table storage.

The following example shows how to create a general-purpose v2 storage account that is configured for read-access geo-redundant storage (RA-GRS) and that uses the account encryption key to encrypt data for both Queue and Table storage. Remember to replace the placeholder values in brackets with your own values:

```azurecli
az storage account create \
    --name <storage-account> \
    --resource-group <resource-group> \
    --location <location> \
    --sku Standard_RAGRS \
    --kind StorageV2 \
    --encryption-key-type-for-table Account \
    --encryption-key-type-for-queue Account
```

# [Template](#tab/template)

The following JSON example creates a general-purpose v2 storage account that is configured for read-access geo-redundant storage (RA-GRS) and that uses the account encryption key to encrypt data for both Queue and Table storage. Remember to replace the placeholder values in angle brackets with your own values:

```json
"resources": [
    {
        "type": "Microsoft.Storage/storageAccounts",
        "apiVersion": "2019-06-01",
        "name": "[parameters('<storage-account>')]",
        "location": "[parameters('<location>')]",
        "dependsOn": [],
        "tags": {},
        "sku": {
            "name": "[parameters('Standard_RAGRS')]"
        },
        "kind": "[parameters('StorageV2')]",
        "properties": {
            "accessTier": "[parameters('<accessTier>')]",
            "supportsHttpsTrafficOnly": "[parameters('supportsHttpsTrafficOnly')]",
            "largeFileSharesState": "[parameters('<largeFileSharesState>')]",
            "encryption": {
                "services": {
                    "queue": {
                        "keyType": "Account"
                    },
                    "table": {
                        "keyType": "Account"
                    }
                },
                "keySource": "Microsoft.Storage"
            }
        }
    }
],
```

---

After you have created an account that relies on the account encryption key, you can configure customer-managed keys that are stored in Azure Key Vault or in Key Vault Managed Hardware Security Model (HSM) (preview). To learn how to store customer-managed keys in a key vault, see [Configure encryption with customer-managed keys stored in Azure Key Vault](customer-managed-keys-configure-key-vault.md). To learn how to store customer-managed keys in a managed HSM, see [Configure encryption with customer-managed keys stored in Azure Key Vault Managed HSM (preview)](customer-managed-keys-configure-key-vault-hsm.md).

## Verify the account encryption key

To verify that a service in a storage account is using the account encryption key, call the Azure CLI [az storage account](/cli/azure/storage/account#az_storage_account_show) command. This command returns a set of storage account properties and their values. Look for the `keyType` field for each service within the encryption property and verify that it is set to `Account`.

# [PowerShell](#tab/powershell)

To verify that a service in a storage account is using the account encryption key, call the [Get-AzStorageAccount](/powershell/module/az.storage/get-azstorageaccount) command. This command returns a set of storage account properties and their values. Look for the `KeyType` field for each service within the `Encryption` property and verify that it is set to `Account`.

```powershell
$account = Get-AzStorageAccount -ResourceGroupName <resource-group> `
    -StorageAccountName <storage-account>
$account.Encryption.Services.Queue
$account.Encryption.Services.Table
```

# [Azure CLI](#tab/azure-cli)

To verify that a service in a storage account is using the account encryption key, call the [az storage account show](/cli/azure/storage/account#az_storage_account_show) command. This command returns a set of storage account properties and their values. Look for the `keyType` field for each service within the encryption property and verify that it is set to `Account`.

```azurecli
az storage account show /
    --name <storage-account> /
    --resource-group <resource-group>
```

# [Template](#tab/template)

N/A

---

## Pricing and billing

A storage account that is created to use an encryption key scoped to the account is billed for Table storage capacity and transactions at a different rate than an account that uses the default service-scoped key. For details, see [Azure Table Storage pricing](https://azure.microsoft.com/pricing/details/storage/tables/).

## Next steps

- [Azure Storage encryption for data at rest](storage-service-encryption.md)
- [Customer-managed keys for Azure Storage encryption](customer-managed-keys-overview.md)
- [What is Azure Key Vault](../../key-vault/general/overview.md)?