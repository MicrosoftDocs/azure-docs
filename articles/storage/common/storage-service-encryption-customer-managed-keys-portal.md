---
title: Use customer-managed keys with Azure Storage encryption
description: Learn how to use customer-managed keys with Azure Storage encryption. Customer-managed keys enable you to create, rotate, disable, and revoke access controls.
services: storage
author: tamram

ms.service: storage
ms.topic: article
ms.date: 04/16/2019
ms.author: tamram
ms.subservice: common
---

# Use customer-managed keys with Azure Storage encryption

You can use customer-managed keys with Azure Storage encryption. Customer-managed keys enable you to create, rotate, disable, and revoke access controls. Use Azure Key Vault to manage your keys and audit your key usage. You can either create your own keys and store them in a key vault, or you can use the Azure Key Vault APIs to generate keys. The storage account and the key vault must be in the same region, but they can be in different subscriptions. For more information about Azure Key Vault, see [What is Azure Key Vault?](../../key-vault/key-vault-overview.md).

This article shows how to configure a key vault with customer-managed keys using the [Azure portal](https://portal.azure.com/). 

> [!IMPORTANT]
> Using customer-managed keys with Azure Storage encryption requires that the key vault have two required properties configured, **Soft Delete** and **Do Not Purge**. These properties are enabled by default when you create a new key vault in the Azure portal. However, if you need to enable these properties on an existing key vault, you must use either PowerShell or Azure CLI.

## Enable customer-managed keys

To enable customer-managed keys, follow these steps:

1. Navigate to your storage account.
1. On the **Settings** blade for the storage account, click **Encryption**. Select the **Use your own key** option, as shown in the following figure.

    ![Portal screenshot showing encryption option](./media/storage-service-encryption-customer-managed-keys-portal/ssecmk1.png)

## Specify a key

After you enable custom key management, you'll have the opportunity to specify a key to associate with the storage account.

### Specify a key as a URI

To specify a key as a URI, follow these steps:

1. To locate the key URI in the Azure portal, navigate to your key vault, and select the **Keys** setting. Select the desired key, then click the key to view its settings. Copy the value of the **Key Identifier** field, which provides the URI.

    ![Screenshot showing key vault key URI](media/storage-service-encryption-customer-managed-keys/key-uri-portal.png)

1. In the **Encryption** settings for your storage account, choose the **Enter key URI** option.
1. In the **Key URI** field, specify the URI.

   ![Portal Screenshot showing Encryption with enter key uri option](./media/storage-service-encryption-customer-managed-keys-portal/ssecmk2.png)

### Specify a key from a key vault

To specify a key from a key vault, first make sure that you have a key vault that contains a key. To specify a key from a key vault, follow these steps:

1. Choose the **Select from Key Vault** option.
2. Choose the key vault containing the key you want to use.
3. Choose the key from the key vault.

   ![Portal Screenshot showing Encryptions use your own key option](./media/storage-service-encryption-customer-managed-keys-portal/ssecmk3.png)

4. If the storage account does not have access to the key vault, you can run the Azure PowerShell command shown in the following image to grant access.

    ![Portal Screenshot showing access denied for key vault](./media/storage-service-encryption-customer-managed-keys-portal/ssecmk4.png)

You can also grant access via the Azure portal by navigating to the Azure Key Vault in the Azure portal and granting access to the storage account. Be sure to replace the placeholder values shown in angle brackets with your own values:

## Next steps

- [Azure Storage encryption for data at rest](storage-service-encryption.md) 
- [What is Azure Key Vault](https://docs.microsoft.com/azure/key-vault/key-vault-whatis)?
