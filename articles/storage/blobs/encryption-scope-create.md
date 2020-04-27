---
title: Create and manage encryption scopes (preview)
description: 
services: storage
author: tamram

ms.service: storage
ms.date: 04/23/2020
ms.topic: conceptual
ms.author: tamram
ms.reviewer: cbrooks
ms.subservice: common
---

# Create and manage encryption scopes (preview)

This article shows how to create an encryption scope. It also shows how to specify an encryption scope when you create a blob or container.

## Create an encryption scope

An encryption scope is automatically enabled when you create it. After you create the encryption scope, you can specify that encryption scope on a request to create a container or a blob.

# [Portal](#tab/portal)

To create an encryption scope in the Azure portal, follow these steps:

1. Navigate to your storage account in the Azure portal.
1. Select the **Encryption** setting.
1. Select the **Encryption Scopes** tab.
1. Click the **Add** button to add a new encryption scope.
1. In the Create **Encryption Scope** pane, enter a name for the new scope.
1. Select the type of encryption, either **Microsoft-managed keys** or **Customer-managed keys**.
    1. If you selected **Microsoft-managed keys**, click **Create** to create the encryption scope.
    1. If you selected **Customer-managed keys**, specify a key vault, key, and key version to use for this encryption scope, as shown in the following image.

    :::image type="content" source="media/encryption-scope-create/create-encryption-scope-customer-managed-key-portal.png" alt-text="Screenshot showing how to create encryption scope in Azure portal":::

# [PowerShell](#tab/powershell)

To create an encryption scope with PowerShell, first install the Az.Storage module version [1.13.4-preview](https://www.powershellgallery.com/packages/Az.Storage/1.13.4-preview). Remove any other versions of the Az.Storage module. Use the following command to install the preview module:

```powershell
Install-Module Az.Storage –Repository PSGallery -RequiredVersion 1.13.4-preview –AllowPrerelease –AllowClobber –Force
```

To create a new encryption scope that uses Microsoft-managed keys, call the New-AzStorageEncryptionScope command with the `-StorageEncryption` parameter. Remember to replace the placeholder values with your own values:

```powershell
New-AzStorageEncryptionScope -ResourceGroupName <resource_group> `
    -AccountName <storage-account> `
    -EncryptionScopeName <encryption-scope> `
    -StorageEncryption
```

To create a new encryption scope that uses customer-managed keys with Azure Key Vault, first assign a managed identity to the storage account. This managed identity is used to grant permissions to the storage account to retrieve the key from the key vault. Next, call the New-AzStorageEncryptionScope command with the `-KeyvaultEncryption` parameter, and specify the key URI. Remember to replace the placeholder values with your own values:

```powershell
$storageAccount = Set-AzStorageAccount -ResourceGroupName <resource_group> `
    -Name <storage-account> `
    -AssignIdentity

New-AzStorageEncryptionScope -ResourceGroupName <resource_group> `
    -AccountName <storage-account>
    -EncryptionScopeName <encryption-scope> `
    -KeyUri <key-uri>
    -KeyvaultEncryption
```

# [Azure CLI](#tab/cli)

???Need CLI update

---

> [!NOTE]
> To configure customer-managed keys for use with an encryption scope, you must enable the **Soft Delete** and **Purge Protection** properties on the key vault. The key vault must be in the same region as the storage account. For more information, see [Use customer-managed keys with Azure Key Vault to manage Azure Storage encryption](../common/encryption-customer-managed-keys.md).

## List encryption scopes

# [Portal](#tab/portal)

To view the encryption scopes for a storage account in the Azure portal, navigate to the **Encryption Scopes** setting for the storage account. The list of encryption scopes appears as shown in the following image:

:::image type="content" source="media/encryption-scope-create/list-encryption-scopes-portal.png" alt-text="Screenshot showing list of encryption scopes in Azure portal":::

# [PowerShell](#tab/powershell)

???Need PS module

# [Azure CLI](#tab/cli)

???Need CLI update

---

## Disable an encryption scope

# [Portal](#tab/portal)

To disable an encryption scope in the Azure portal, navigate to the **Encryption Scopes** setting for the storage account, select the desired encryption scope, and select **Disable**.

# [PowerShell](#tab/powershell)

???Need PS module

# [Azure CLI](#tab/cli)

???Need CLI update

---

If your encryption scope uses customer-managed keys for Azure Key Vault, then you can also delete the key in the key vault to disable the encryption scope. Keep in mind that customer-managed keys in Azure Key Vault are protected by soft delete and purge protection, and a deleted key is subject to the behavior defined for by those properties. For more information, see one of the following topics in the Azure Key Vault documentation:

- [How to use soft-delete with PowerShell](../../key-vault/general/soft-delete-powershell.md)
- [How to use soft-delete with CLI](../../key-vault/general/soft-delete-cli.md)

> [!NOTE]
> It is not possible to delete an encryption scope.

## Next steps

- [Azure Storage encryption for data at rest](../common/storage-service-encryption.md)
