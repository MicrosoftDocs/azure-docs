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

### Create an encryption scope protected by Microsoft-managed keys

To create a new encryption scope that is protected by Microsoft-managed keys, call the New-AzStorageEncryptionScope command with the `-StorageEncryption` parameter. Remember to replace the placeholder values with your own values:

```powershell
New-AzStorageEncryptionScope -ResourceGroupName <resource_group> `
    -AccountName <storage-account> `
    -EncryptionScopeName <encryption-scope> `
    -StorageEncryption
```

### Create an encryption scope protected by customer-managed keys

To create a new encryption scope that is protected by customer-managed keys with Azure Key Vault, first configure customer-managed keys for the storage account. For more information, see [Configure customer-managed keys with Azure Key Vault by using PowerShell](../common/storage-encryption-keys-powershell.md).

Next, call the New-AzStorageEncryptionScope command with the `-KeyvaultEncryption` parameter, and specify the key URI. Remember to replace the placeholder values with your own values:

```powershell
New-AzStorageEncryptionScope -ResourceGroupName <resource_group> `
    -AccountName <storage-account> `
    -EncryptionScopeName <encryption-scope> `
    -KeyUri <key-uri> `
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

To disable an encryption scope with PowerShell, call the Update-AzStorageEncryptionScope command and include the `-State` parameter with a value of `disabled`. To re-enable an encryption scope, call the same command with the `-State` parameter set to `enabled`.

```powershell
Update-AzStorageEncryptionScope -ResourceGroupName <resource_group> `
    -StorageAccountName <storage-account> `
    -EncryptionScopeName <encryption-scope> `
    -State disabled
```

# [Azure CLI](#tab/cli)

???Need CLI update

---

## Next steps

- [Azure Storage encryption for data at rest](../common/storage-service-encryption.md)
- [Use customer-managed keys with Azure Key Vault to manage Azure Storage encryption](../common/encryption-customer-managed-keys.md)
