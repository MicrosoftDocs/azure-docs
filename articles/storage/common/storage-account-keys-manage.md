---
title: Manage account access keys
titleSuffix: Azure Storage
description: Learn how to view, manage, and rotate your storage account access keys.
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 12/18/2019
ms.author: tamram
---

# Manage storage account access keys

When you create a storage account, Azure generates two 512-bit storage account access keys. These keys can be used to authorize access to data in your storage account via Shared Key authorization.

Microsoft recommends that you use Azure Key Vault to manage your access keys, and that you regularly rotate and regenerate your keys. Using Azure Key Vault makes it easy to rotate your keys without interruption to your applications. You can also manually rotate your keys.

[!INCLUDE [storage-account-key-note-include](../../../includes/storage-account-key-note-include.md)]

## View access keys and connection string

[!INCLUDE [storage-view-keys-include](../../../includes/storage-view-keys-include.md)]

## Use Azure Key Vault to manage your access keys

Microsoft recommends using Azure Key Vault to manage and rotate your access keys. Your application can securely access your keys in Key Vault, so that you can avoid storing them with your application code. For more information about using Key Vault for key management, see the following articles:

- [Manage storage account keys with Azure Key Vault and PowerShell](../../key-vault/key-vault-overview-storage-keys-powershell.md)
- [Manage storage account keys with Azure Key Vault and the Azure CLI](../../key-vault/key-vault-ovw-storage-keys.md)

## Manually rotate access keys

Microsoft recommends that you rotate your access keys periodically to help keep your storage account secure. If possible, use Azure Key Vault to manage your access keys. If you are not using Key Vault, you will need to rotate your keys manually.

Two access keys are assigned so that you can rotate your keys. Having two keys ensures that your application maintains access to Azure Storage throughout the process.

> [!WARNING]
> Regenerating your access keys can affect any applications or Azure services that are dependent on the storage account key. Any clients that use the account key to access the storage account must be updated to use the new key, including media services, cloud, desktop and mobile applications, and graphical user interface applications for Azure Storage, such as [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/).

Follow this process to rotate your storage account keys:

1. Update the connection strings in your application code to use the secondary key.
2. Regenerate the primary access key for your storage account. On the **Access Keys** blade in the Azure portal, click **Regenerate Key1**, and then click **Yes** to confirm that you want to generate a new key.
3. Update the connection strings in your code to reference the new primary access key.
4. Regenerate the secondary access key in the same manner.

> [!NOTE]
> Microsoft recommends using only one of the keys in all of your applications at the same time. If you use Key 1 in some places and Key 2 in others, you will not be able to rotate your keys without some application losing access.

## Next steps

- [Azure storage account overview](storage-account-overview.md)
- [Create a storage account](storage-account-create.md)
