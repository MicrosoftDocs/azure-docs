---
title: Create and manage encryption scopes (preview)
description: 
services: storage
author: tamram

ms.service: storage
ms.date: 04/10/2020
ms.topic: conceptual
ms.author: tamram
ms.reviewer: cbrooks
ms.subservice: common
---

# Create and manage encryption scopes (preview)


## Create an encryption scope

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

???Need PS module

# [Azure CLI](#tab/cli)

???Need CLI update

---

An encryption scope is automatically enabled when you create it. After you create the encryption scope, you can specify that encryption scope on a request to create a container or a blob.

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

> [!NOTE]
> It is not possible to delete an encryption scope in the preview (???will it be possible in GA???).

## Next steps
