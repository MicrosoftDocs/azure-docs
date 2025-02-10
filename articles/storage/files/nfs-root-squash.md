---
title: Configure root squash settings for NFS Azure file shares
description: Root squash is a security feature that prevents unauthorized root-level access to the NFS server by client machines. Learn how to configure root squash for NFS Azure file shares.
author: khdownie
ms.service: azure-file-storage
ms.custom: linux-related-content
ms.topic: conceptual
ms.date: 09/13/2024
ms.author: kendownie
---

# Configure root squash for Azure Files

Permissions for NFS file shares are enforced by the client OS rather than the Azure Files service. Root squash is an administrative security feature in NFS that prevents unauthorized root-level access to the NFS server by client machines. This functionality is an important part of protecting user data and system settings from manipulation by untrusted or compromised clients.

Administrators should enable root squash in environments where multiple users or systems access the NFS share, especially in scenarios where client machines aren't fully trusted. By converting root users to anonymous users, root squash ensures that even if a client machine is compromised, the attacker can't exploit root privileges to access or modify critical files on the NFS server.

In this article, you learn how to configure and change root squash settings for NFS Azure file shares.

## Applies to

| File share type | SMB | NFS |
|-|:-:|:-:|
| Standard file shares (GPv2), LRS/ZRS | ![No, this article doesn't apply to standard SMB Azure file shares LRS/ZRS.](../media/icons/no-icon.png) | ![NFS shares are only available in premium Azure file shares.](../media/icons/no-icon.png) |
| Standard file shares (GPv2), GRS/GZRS | ![No, this article doesn't apply to standard SMB Azure file shares GRS/GZRS.](../media/icons/no-icon.png) | ![NFS is only available in premium Azure file shares.](../media/icons/no-icon.png) |
| Premium file shares (FileStorage), LRS/ZRS | ![No, this article doesn't apply to premium SMB Azure file shares.](../media/icons/no-icon.png) | ![Yes, this article applies to premium NFS Azure file shares.](../media/icons/yes-icon.png) |

## How root squash works with Azure Files

Root squash works by re-mapping the user ID (UID) and the group ID (GID) of the root user to a UID and GID belonging to the anonymous user on server. Root users accessing the file system are automatically converted to the anonymous, less-privileged user/group with limited permissions.

Although root squash is the default behavior in NFS, it's not the default option when creating an NFS Azure file share. You must explicitly enable root squash on the file share. You can do this when you create an NFS Azure file share, or later on.

## Root squash settings

You can choose from three root squash settings:

- **No root squash:** Turn off root squashing. This option is mainly useful for diskless clients or workloads as specified by workload documentation. This is the default setting when creating a new NFS Azure file share.
- **All squash:** Map all UIDs and GIDs to the anonymous user. Useful for shares that require read-only access by all clients.
- **Root squash:** Map requests from UID/GID 0 (root) to the anonymous UID/GID. This doesn't apply to any other UIDs or GIDs that might be equally sensitive, such as user bin or group staff.

The following table highlights the UID behavior observed from the server when specific root squash options are configured.

| **Option** | **Client UID** | **Server UID** |
|------------|----------------|----------------|
| root_squash | 0 | 65534 |
| root_squash | 1000 | 1000 |
| no_root_squash | 0 | 0 |
| no_root_squash | 1000 | 1000 |
| all_squash | 0 | 65534 |
| all_squash | 1000 | 65534 |

## Configure root squash on an existing NFS file share

You can configure root squash settings via the Azure portal, Azure PowerShell, or Azure CLI.

# [Portal](#tab/azure-portal)

1. Sign in to the Azure portal and navigate to the FileStorage storage account containing the NFS Azure file share.

1. In the service menu, under **Data storage**, select **File shares**.

1. Select the file share for which you want to modify the root squash setting.

1. In the service menu, select **Properties**. Then toggle the **Root squash** setting as desired.

   :::image type="content" source="media/nfs-root-squash/toggle-root-squash.png" alt-text="Screenshot showing how to configure root squash settings for an NFS file share in the Azure portal." lightbox="media/nfs-root-squash/toggle-root-squash.png":::

1. Select **Save** to update the root squash value.

# [Azure PowerShell](#tab/azure-powershell)

1. Sign in to Azure and select your subscription.

   ```azurepowershell-interactive
   Connect-AzAccount
   Select-AzSubscription -SubscriptionId "<your-subscription-id>"
   ```

1. To enable root squash on the file share, run the following command. Replace `<resource-group-name>`, `<storage-account-name>`, and `<file-share-name>` with your own values.

   ```azurepowershell-interactive
   Update-AzRmStorageShare `
     -ResourceGroupName <resource-group-name> `
     -StorageAccountName <storage-account-name> `
     -Name <file-share-name> `
     -RootSquash RootSquash
   ```

1. To disable root squash on the file share, run the following command. Replace `<resource-group-name>`, `<storage-account-name>`, and `<file-share-name>` with your own values.

   ```azurepowershell-interactive
   Update-AzRmStorageShare `
     -ResourceGroupName <resource-group-name> `
     -StorageAccountName <storage-account-name> `
     -Name <file-share-name> `
     -RootSquash NoRootSquash
   ```

1. To force squash for all users, run the following command to map all user IDs to anonymous. Replace `<resource-group-name>`, `<storage-account-name>`, and `<file-share-name>` with your own values.

   ```azurepowershell-interactive
   Update-AzRmStorageShare `
     -ResourceGroupName <resource-group-name> `
     -StorageAccountName <storage-account-name> `
     -Name <file-share-name> `
     -RootSquash AllSquash
   ```

1. To view the root squash property for a file share, run the following command. Replace `<resource-group-name>`, `<storage-account-name>`, and `<file-share-name>` with your own values.

   ```azurepowershell-interactive
   Get-AzRmStorageShare `
     -ResourceGroupName <resource-group-name> `
     -StorageAccountName <storage-account-name> `
     -Name <file-share-name> | fl -Property ResourceGroupName, StorageAccountName, Name, QuotaGiB,AccessTier,EnabledProtocols,RootSquash
   ```

# [Azure CLI](#tab/azure-cli)

1. Sign in to Azure and set your subscription.

   ```azurecli-interactive
   az login
   az account set --subscription "<your-subscription-id>"  
   ```

1. To enable root squash on the file share, run the following command. Replace `<resource-group-name>`, `<storage-account-name>`, and `<file-share-name>` with your own values.

   ```azurecli-interactive
   az storage share-rm update \
     --resource-group <resource-group-name> \
     --storage-account <storage-account-name> \
     --name <file-share-name> \
     --root-squash RootSquash 
   ```

1. To disable root squash on the file share, run the following command. Replace `<resource-group-name>`, `<storage-account-name>`, and `<file-share-name>` with your own values.

   ```azurecli-interactive
   az storage share-rm update \
     --resource-group <resource-group-name> \
     --storage-account <storage-account-name> \
     --name <file-share-name> \
     --root-squash NoRootSquash 
   ```

1. To force squash for all users, run the following command to map all user IDs to anonymous. Replace `<resource-group-name>`, `<storage-account-name>`, and `<file-share-name>` with your own values.

   ```azurecli-interactive
   az storage share-rm update \
     --resource-group <resource-group-name> \
     --storage-account <storage-account-name> \
     --name <file-share-name> \
     --root-squash AllSquash 
   ```

1. To view the root squash property for a file share, run the following command. Replace `<resource-group-name>`, `<storage-account-name>`, and `<file-share-name>` with your own values.

   ```azurecli-interactive
   az storage share-rm show \
     --resource-group <resource-group-name> \
     --storage-account <storage-account-name> \
     --name <file-share-name>
   ```

---

## See also

- [NFS Azure file shares](files-nfs-protocol.md)
