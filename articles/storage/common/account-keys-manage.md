---
title: Manage account access keys
titleSuffix: Azure Storage
description: Learn how to view, manage, and rotate your storage account access keys.
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 12/11/2019
ms.author: tamram
---

# Manage storage account access keys

## Access keys

When you create a storage account, Azure generates two 512-bit storage account access keys. These keys can be used to authorize access to your storage account via Shared Key. You can rotate and regenerate the keys without interruption to your applications, and Microsoft recommends that you do so regularly.

[!INCLUDE [storage-account-key-note-include](../../../includes/storage-account-key-note-include.md)]

[!INCLUDE [storage-recommend-azure-ad-include](../../../includes/storage-recommend-azure-ad-include.md)]

### View account keys and connection string

[!INCLUDE [storage-view-keys-include](../../../includes/storage-view-keys-include.md)]

### Regenerate access keys

Microsoft recommends that you regenerate your access keys periodically to help keep your storage account secure. Two access keys are assigned so that you can rotate your keys. When you rotate your keys, you ensure that your application maintains access to Azure Storage throughout the process.

> [!WARNING]
> Regenerating your access keys can affect any applications or Azure services that are dependent on the storage account key. Any clients that use the account key to access the storage account must be updated to use the new key, including media services, cloud, desktop and mobile applications, and graphical user interface applications for Azure Storage, such as [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/).

Follow this process to rotate your storage account keys:

1. Update the connection strings in your application code to use the secondary key.
2. Regenerate the primary access key for your storage account. On the **Access Keys** blade in the Azure portal, click **Regenerate Key1**, and then click **Yes** to confirm that you want to generate a new key.
3. Update the connection strings in your code to reference the new primary access key.
4. Regenerate the secondary access key in the same manner.

### Managing Your Storage Account Keys

Storage account keys are 512-bit strings created by Azure that, along with the storage account name, can be used to access the data objects stored in the storage account, for example, blobs, entities within a table, queue messages, and files on an Azure file share. Controlling access to the storage account keys controls access to the data plane for that storage account.

Each storage account has two keys referred to as "Key 1" and "Key 2" in the [Azure portal](https://portal.azure.com/) and in the PowerShell cmdlets. These can be regenerated manually using one of several methods, including, but not limited to using the [Azure portal](https://portal.azure.com/), PowerShell, the Azure CLI, or programmatically using the .NET Storage Client Library or the Azure Storage Services REST API.

There are various reasons to regenerate your storage account keys.

* You may regenerate them periodically for security.
* You might regenerate your storage account keys if your application or network security is compromised.
* Another instance for key regeneration is when team members with access to the keys leave. Shared Access Signatures were designed primarily to address this scenario – you should share an account-level SAS connection string or token, instead of sharing access keys, with most individuals or applications.

#### Key regeneration plan
You should not regenerate an access key in use without planning. Abrupt key regeneration can block access to a storage account for existing applications, causing major disruption. Azure Storage accounts provide two keys, so that you can regenerate one key at a time.

Before you regenerate your keys, be sure you have a list of all applications dependent on the storage account, as well as any other services you are using in Azure. For example, if you are using Azure Media Services use your storage account, you must resync the access keys with your media service after you regenerate the key. If you are using an application such as a storage explorer, you will need to provide new keys to those applications as well. If you have VMs whose VHD files are stored in the storage account, they will not be affected by regenerating the storage account keys.

You can regenerate your keys in the Azure portal. Once keys are regenerated, they can take up to 10 minutes to be synchronized across Storage Services.

When you're ready, here's the general process detailing how you should change your key. In this case, the assumption is that you are currently using Key 1 and you are going to change everything to use Key 2 instead.

1. Regenerate Key 2 to ensure that it is secure. You can do this in the Azure portal.
2. In all of the applications where the storage key is stored, change the storage key to use Key 2's new value. Test and publish the application.
3. After all of the applications and services are up and running successfully, regenerate Key 1. This ensures that anybody to whom you have not expressly given the new key will no longer have access to the storage account.

If you are currently using Key 2, you can use the same process, but reverse the key names.

You can migrate over a couple of days, changing each application to use the new key and publishing it. After all of them are done, you should then go back and regenerate the old key so it no longer works.

Another option is to put the storage account key in an [Azure Key Vault](https://azure.microsoft.com/services/key-vault/) as a secret and have your applications retrieve the key from there. Then when you regenerate the key and update the Azure Key Vault, the applications will not need to be redeployed because they will pick up the new key from the Azure Key Vault automatically. You can have the application read the key each time it needs it, or the application can cache it in memory and if it fails when using it, retrieve the key again from the Azure Key Vault.

Using Azure Key Vault also adds another level of security for your storage keys. Using the Key Vault, enables you to avoid writing storage keys in application configuration files. It also prevents exposure of keys to everyone with access to those configuration files.

Azure Key Vault also has the advantage of using Azure AD to control access to your keys. You can grant access to the specific applications that need to retrieve the keys from Key Vault, without exposing them to other applications that do not need access to the keys.

> [!NOTE]
> Microsoft recommends using only one of the keys in all of your applications at the same time. If you use Key 1 in some places and Key 2 in others, you will not be able to rotate your keys without some application losing access.

## Next steps

- [Azure storage account overview](storage-account-overview.md)
- [Create a storage account](storage-quickstart-create-account.md)
