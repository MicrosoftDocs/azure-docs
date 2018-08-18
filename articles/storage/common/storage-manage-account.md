---
title: How to manage account keys or delete a storage account in the Azure portal | Microsoft Docs
description: Manage your account access keys or delete a storage account in the Azure portal.
services: storage
author: tamram

ms.service: storage
ms.topic:  article
ms.date: 08/18/2018
ms.author: tamram
---

# Manage Azure storage accounts

intro

## Storage account access keys

When you create a storage account, Azure generates two 512-bit storage access keys. You use these keys to authenticate access to your storage account. Azure enables you to regenerate the keys without interruption to your applications.

[!INCLUDE [storage-account-key-note-include](../../../includes/storage-account-key-note-include.md)]

### View and copy account access keys

To view your storage account credentials:

1. Navigate to the [Azure portal](https://portal.azure.com).
2. Locate your storage account.
3. In the **Settings** section of the storage account overview, select **Access keys**. Your account access keys appear, as well as the complete connection string for each key.
4. Find the **Key** value under **key1**, and click the **Copy** button to copy the account key.
5. Alternately, you can copy the entire connection string. Find the **Connection string** value under **key1**, and click the **Copy** button to copy the connection string.

    ![Screen shot showing how to view access keys in the Azure portal](media/storage-account-overview/portal-connection-string.png)

### Regenerate account access keys

Microsoft recommends that you change the access keys to your storage account periodically to help keep your storage account secure. Two access keys are assigned so that you can maintain connections to the storage account by using one access key while you regenerate the other access key.

> [!WARNING]
> Regenerating your access keys can affect services in Azure as well as your own applications that are dependent on the storage account. All clients that use the access key to access the storage account must be updated to use the new key.
> 
> 

**Media services** - If you have media services that are dependent on your storage account, you must re-sync the access keys with your media service after you regenerate the keys.

**Applications** - If you have web applications or cloud services that use the storage account, you will lose the connections if you regenerate keys, unless you roll your keys.

**Storage Explorers** - If you are using any [storage explorer applications](storage-explorers.md), you will probably need to update the storage key used by those applications.

Here is the process for rotating your storage access keys:

1. Update the connection strings in your application code to reference the secondary access key of the storage account.
2. Regenerate the primary access key for your storage account. On the **Access Keys** blade, click **Regenerate Key1**, and then click **Yes** to confirm that you want to generate a new key.
3. Update the connection strings in your code to reference the new primary access key.
4. Regenerate the secondary access key in the same manner.

## Update storage account settings

After you create your storage account, you can modify its configuration. For example, you can change how your data is replicated, or change the account's access tier from Hot to Cool. In the [Azure portal](https://portal.azure.com), navigate to your storage account, then find and click **Configuration** under **SETTINGS** to view and/or change the account configuration.

Changing storage account settings may result in added costs. For more details, see [Azure Storage Pricing](https://azure.microsoft.com/pricing/details/storage/) page.

## Delete a storage account
To remove a storage account that you are no longer using, navigate to the storage account in the [Azure portal](https://portal.azure.com), and click **Delete**. Deleting a storage account deletes the entire account, including all data in the account.

> [!WARNING]
> It's not possible to restore a deleted storage account or retrieve any of the content that it contained before deletion. Be sure to back up anything you want to save before you delete the account. This also holds true for any resources in the account—once you delete a blob, table, queue, or file, it is permanently deleted.
> 

If you try to delete a storage account associated with an Azure virtual machine, you may get an error about the storage account still being in use. For help troubleshooting this error, please see [Troubleshoot errors when you delete storage accounts](../common/storage-resource-manager-cannot-delete-storage-account-container-vhd.md).

## Next steps

