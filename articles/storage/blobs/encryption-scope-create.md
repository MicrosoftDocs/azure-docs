---
title: Create encryption scopes
description: 
services: storage
author: tamram

ms.service: storage
ms.date: 04/08/2020
ms.topic: conceptual
ms.author: tamram
ms.reviewer: cbrooks
ms.subservice: common
---

# Create encryption scopes


## Create an encryption scope

To create an encryption scope in the Azure portal, follow these steps:

1. Navigate to your storage account in the Azure portal.
1. Select the **Encryption** setting.
1. Select the **Encryption Scopes** tab.
1. Click the **Add** button to add a new encryption scope.
1. In the Create **Encryption Scope** pane, enter a name for the new scope.
1. Select the type of encryption, either **Microsoft-managed keys** or **Customer-managed keys**.
    1. If you selected **Microsoft-managed keys**, click **Create** to create the encryption scope.
    1. If you selected **Customer-managed keys**, specify a key vault, key, and key version to use for this encryption scope, as shown in the following image.

    :::image type="content" source="media/encryption-scope-create/create-encryption-scope-customer-managed-key.png" alt-text="Screenshot showing how to create encryption scope in Azure portal":::

> [!NOTE]
> To configure customer-managed keys for use with an encryption scope, you must enable the Soft Delete and Purge Protection properties on the key vault. The key vault must be in the same region as the storage account. For more information, see [Use customer-managed keys with Azure Key Vault to manage Azure Storage encryption](../common/encryption-customer-managed-keys.md).



## Disable an encryption scope