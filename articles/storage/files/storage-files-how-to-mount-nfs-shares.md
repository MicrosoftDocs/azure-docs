---
title: Mount an NFS Azure file share on Linux
description: Learn how to mount a Network File System (NFS) Azure file share on Linux.
author: khdownie
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 10/16/2023
ms.author: kendownie
ms.custom: references_regions
---

# Mount NFS Azure file share on Linux

Azure file shares can be mounted in Linux distributions using either the Server Message Block (SMB) protocol or the Network File System (NFS) protocol. This article is focused on mounting with NFS. For details on mounting SMB Azure file shares, see [Use Azure Files with Linux](storage-how-to-use-files-linux.md). For details on each of the available protocols, see [Azure file share protocols](storage-files-planning.md#available-protocols).

## Applies to
| File share type | SMB | NFS |
|-|:-:|:-:|
| Standard file shares (GPv2), LRS/ZRS | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| Standard file shares (GPv2), GRS/GZRS | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| Premium file shares (FileStorage), LRS/ZRS | ![No](../media/icons/no-icon.png) | ![Yes](../media/icons/yes-icon.png) |

## Support

[!INCLUDE [files-nfs-limitations](../../../includes/files-nfs-limitations.md)]

### Regional availability

[!INCLUDE [files-nfs-regional-availability](../../../includes/files-nfs-regional-availability.md)]

## Prerequisites

- [Create an NFS share](storage-files-how-to-create-nfs-shares.md).
- Open port 2049 on the client you want to mount your NFS share to.

    > [!IMPORTANT]
    > NFS shares can only be accessed from trusted networks.

- Either [create a private endpoint](storage-files-networking-endpoints.md#create-a-private-endpoint) (recommended) or [restrict access to your public endpoint](storage-files-networking-endpoints.md#restrict-public-endpoint-access).
- To enable hybrid access to an NFS Azure file share, use one of the following networking solutions:
    - [Configure a Point-to-Site (P2S) VPN on Linux for use with Azure Files](storage-files-configure-p2s-vpn-linux.md).
    - [Configure a Site-to-Site VPN for use with Azure Files](storage-files-configure-s2s-vpn.md).
    - Configure [ExpressRoute](../../expressroute/expressroute-introduction.md).

## Disable secure transfer

1. Sign in to the [Azure portal](https://portal.azure.com/) and access the storage account containing the NFS share you created.
1. Select **Configuration**.
1. Select **Disabled** for **Secure transfer required**.
1. Select **Save**.

    :::image type="content" source="media/storage-files-how-to-mount-nfs-shares/disable-secure-transfer.png" alt-text="Screenshot of storage account configuration screen with secure transfer disabled." lightbox="media/storage-files-how-to-mount-nfs-shares/disable-secure-transfer.png":::

## Mount options

The following mount options are recommended or required when mounting NFS Azure file shares.

| **Mount option** | **Recommended value** | **Description** |
|******************|***********************|*****************|
| `vers` | 4 | Required. Specifies which version of the NFS protocol to use. Azure Files only supports NFS v4.1. |
| `minorversion` | 1 | Required. Specifies the minor version of the NFS protocol. Some Linux distros don't recognize minor versions on the `vers` parameter. So instead of `vers=4.1`, use `vers=4,minorversion=1`. |
| `sec` | sys | Required. Specifies the type of security to use when authenticating an NFS connection. Setting `sec=sys` uses the local UNIX UIDs and GIDs that use AUTH_SYS to authenticate NFS operations. |
| `rsize` | 1048576 | Recommended. Sets the maximum number of bytes to be transferred in a single NFS read operation. Specifying the maximum level of 1048576 bytes will usually result in the best performance. |
| `wsize` | 1048576 | Recommended. Sets the maximum number of bytes to be transferred in a single NFS write operation. Specifying the maximum level of 1048576 bytes will usually result in the best performance. |
| `noresvport` | n/a | Recommended. Tells the NFS client to use a non-privileged source port when communicating with an NFS server for the mount point. Using the `noresvport` mount option helps ensure that your NFS share has uninterrupted availability after a reconnection. Using this option is strongly recommended for achieving high availability. |
| `actimeo` | 30-60 | Recommended. Specifying `actimeo` sets all of `acregmin`, `acregmax`, `acdirmin`, and `acdirmax` to the same value. Using a value lower than 30 seconds can cause performance degradation because attribute caches for files and directories expire too quickly. We recommend setting `actimeo` between 30 and 60 seconds. |

## Mount an NFS share using the Azure portal

> [!NOTE]
> You can use the `nconnect` Linux mount option to improve performance for NFS Azure file shares at scale. For more information, see [Improve NFS Azure file share performance](nfs-performance.md#nconnect).

1. Once the file share is created, select the share and select **Connect from Linux**.
1. Enter the mount path you'd like to use, then copy the script.
1. Connect to your client and use the provided mounting script. Only the required mount options are included in the script, but you can add other [recommended mount options](#mount-options).

    :::image type="content" source="media/storage-files-how-to-create-mount-nfs-shares/mount-nfs-file-share-script.png" alt-text="Screenshot of file share connect blade.":::

You have now mounted your NFS share.

## Mount an NFS share using /etc/fstab

If you want the NFS file share to automatically mount every time the Linux server or VM boots, create a record in the **/etc/fstab** file for your Azure file share. Replace `YourStorageAccountName` and `FileShareName` with your information.

```bash
<YourStorageAccountName>.file.core.windows.net:/<YourStorageAccountName>/<FileShareName> /media/<YourStorageAccountName>/<FileShareName> nfs vers=4,minorversion=1,sec=sys 0 0
```

For more information, enter the command `man fstab` from the Linux command line.

### Validate connectivity

If your mount failed, it's possible that your private endpoint wasn't set up correctly or isn't accessible. For details on confirming connectivity, see [Verify connectivity](storage-files-networking-endpoints.md#verify-connectivity).

## NFS file share snapshots (preview)

Customers using NFS Azure file shares can now create, list, and delete snapshots of NFS Azure file shares. This allows users to roll back entire file systems or recover files that were accidentally deleted or corrupted.

> [!NOTE]
> This preview only supports management APIs (`AzRmStorageShare`), not data plane APIs (`AzStorageShare`). Azure Backup isn't currently supported for NFS file shares.

### Regional availability for NFS Azure file share snapshots

[!INCLUDE [files-nfs-snapshot-regions](../../../includes/files-nfs-snapshot-regions.md)]

### Create a snapshot of an NFS file share

You can create a snapshot of an NFS file share using Azure PowerShell or Azure CLI.

# [Azure PowerShell](#tab/powershell)

To create a snapshot of an existing file share, run the following PowerShell command. Replace `<resource-group-name>`, `<storage-account-name>`, and `<file-share-name>` with your own values.

```azurepowershell
New-AzRmStorageShare -ResourceGroupName "<resource-group-name>" -StorageAccountName "<storage-account-name>" -Name "<file-share-name>" -Snapshot
```

# [Azure CLI](#tab/cli)
To create a snapshot of an existing file share, run the following Azure CLI command. Replace `<file-share-name>` and `<storage-account-name>` with your own values.

```azurecli
az storage share snapshot --name <file-share-name> --account-name <storage-account-name>
```
---

### List snapshots for an NFS file share

You can list all file shares in a storage account, including the share snapshots, using Azure PowerShell or Azure CLI.

# [Azure PowerShell](#tab/powershell)

To list all file shares and snapshots in a storage account, run the following PowerShell command. Replace `<resource-group-name>` and `<storage-account-name>` with your own values.

```azurepowershell
Get-AzRmStorageShare -ResourceGroupName "<resource-group-name>" -StorageAccountName "<storage-account-name>" -IncludeSnapshot
```

# [Azure CLI](#tab/cli)
To list all file shares and snapshots in a storage account, run the following Azure CLI command. Replace `<storage-account-name>` with your own value.

```azurecli
az storage share list --account-name <storage-account-name> --include-snapshots
```
---

### Delete an NFS file share snapshot

You can delete share snapshots using Azure PowerShell or Azure CLI.

# [Azure PowerShell](#tab/powershell)

To delete a file share snapshot, run the following PowerShell command. Replace `<resource-group-name>`, `<storage-account-name>`, and `<file-share-name>` with your own values. The `SnapshotTime` parameter must follow the correct name format, such as `2021-05-10T08:04:08Z`.

```azurepowershell
Remove-AzRmStorageShare -ResourceGroupName "<resource-group-name>" -StorageAccountName "<storage-account-name>" -Name "<file-share-name>" -SnapshotTime "<snapshot-time>"
```

To delete a file share and all its snapshots, run the following PowerShell command. Replace `<resource-group-name>`, `<storage-account-name>`, and `<file-share-name>` with your own values.

```azurepowershell
Remove-AzRmStorageShare "<resource-group-name>" -StorageAccountName "<storage-account-name>" -Name "<file-share-name>" -Include Snapshots
```

# [Azure CLI](#tab/cli)

To delete a file share snapshot, run the following Azure CLI command. Replace `<storage-account-name>` and `<file-share-name>` with your own values. The `--snapshot` parameter must follow the correct name format, such as `2021-05-10T08:04:08Z`.

```azurecli
az storage share delete --account-name <storage-account-name> --name <file-share-name> --snapshot <snapshot-time>
```

To delete a file share and all its snapshots, run the following Azure CLI command. Replace `<storage-account-name>` and `<file-share-name>` with your own values.

```azurecli
az storage share delete --account-name <storage-account-name> --name <file-share-name> --delete-snapshots include
```
---

### Mount an NFS Azure file share snapshot

To mount the NFS Azure file share to a Linux VM (NFS client) and restore files from a snapshot, follow these steps.

1. Run the following command in a console. See [Mount options](#mount-options) for other recommended mount options. To improve copy performance, mount the snapshot with [nconnect](nfs-performance.md#nconnect) to use multiple TCP channels.
   
   ```bash
   sudo mount -o vers=4,minorversion=1,proto=tcp,sec=sys $server:/nfs4account/share /media/nfs
   ```
   
1. Change the directory to `/media/nfs/.snapshots` so you can view the available snapshots. The `.snapshots` directory is hidden by default, but you can access and read from it like any directory.
   
   ```bash
   cd /media/nfs/.snapshots
   ```
   
1. List the contents of the `.snapshots` folder.
   
   ```bash
   ls
   ```
   
1. Each snapshot has its own directory that serves as a recovery point. Change to the snapshot directory for which you want to restore files.
   
   ```bash
   cd <snapshot-name>
   ```
   
1. List the contents of the directory to view a list of files and directories that can be recovered.
   
   ```bash
   ls
   ```
   
1. Copy all files and directories from the snapshot to complete the restore.
   
   ```bash
   cp -r <snapshot-name> ../restore
   ```
   
The files and directories from the snapshot should now be available in the `/media/nfs/restore` directory.

## Next steps

- Learn more about Azure Files with [Planning for an Azure Files deployment](storage-files-planning.md).
- If you experience any issues, see [Troubleshoot NFS Azure file shares](/troubleshoot/azure/azure-storage/files-troubleshoot-linux-nfs?toc=/azure/storage/files/toc.json).
