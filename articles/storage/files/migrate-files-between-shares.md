---
title: Copy Files Between Azure File Shares
description: Learn how to copy files from one Azure file share to another using common copy tools such as AzCopy and Robocopy.
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 02/03/2026
ms.author: kendownie
author: khdownie
# Customer intent: As a cloud administrator, I want to copy files between Azure file shares so that I can efficiently transition data with minimal downtime and optimize storage performance.
---

# Copy files from one Azure file share to another

This article describes how to copy files between Azure file shares using common copy tools. You can copy files between HDD and SSD file shares, file shares using a different billing model, or file shares in different Azure regions. 

This article doesn't provide guidance for migrations to Azure Files. If you want to migrate to Azure Files, see [Migrate to SMB Azure file shares](storage-files-migration-overview.md) or [Migrate to NFS Azure file shares](storage-files-migration-nfs.md). If you're using Azure File Sync and you want to migrate between Azure file shares, see [Migrate files from one Azure file share to another when using Azure File Sync](../file-sync/file-sync-share-to-share-migration.md).

## Choose a file copy tool

The file copy tool you should choose depends on whether you want to copy files between SMB file shares or NFS file shares. The following table lists the various copy tools available, and their compatibility.

| **Copy tool** | **SMB** | **NFS** | **Description** |
|-|:-:|:-:|-|
| **[AzCopy](/azure/storage/common/storage-use-azcopy-files)** | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | AzCopy is generally recommended because it uses server-to-server APIs, meaning data is copied directly between storage servers without passing through a local machine. This provides better performance. You can run AzCopy from Windows, Linux, or macOS. |
| **[Robocopy](/windows-server/administration/windows-commands/robocopy)** | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) | Robocopy is a Windows command-line utility that uses the SMB protocol for file copy operations. It requires mounting both file shares to a Windows virtual machine (VM). While this adds overhead and cost, you might choose Robocopy if you need advanced options such as mirroring, granular retry control, or real-time logging. |
| **[fpsync/rsync](storage-files-migration-nfs.md#using-fpsync-vs-rsync)** | ![No](../media/icons/no-icon.png) | ![Yes](../media/icons/yes-icon.png) | rsync is a versatile, single-threaded, open-source file copy tool. It can copy locally, to/from another host over any remote shell, or to/from a remote rsync daemon. fpsync is multithreaded and therefore offers some advantages, including the ability to run rsync jobs in parallel. Both tools require mounting the shares on a VM. |

## Copy files using AzCopy

You can use AzCopy, a command-line utility, to copy files between Azure file shares. AzCopy uses server-to-server APIs, so data is copied directly between storage servers. The instructions are different depending on whether you're using SMB or NFS file shares.

Although AzCopy doesn't require mounting the file shares to a VM, it does require a lightweight VM to run its binaries and orchestrate the copy between the two file shares via REST.

The AzCopy commands in this article use the `azcopy copy` command to copy files. The `azcopy sync` command can help synchronize deltas from the initial baseline, which is useful for setting up copy operations in another region. See [Synchronize files](/azure/storage/common/storage-use-azcopy-files#synchronize-files) for more information.

### AzCopy scale limits and performance

If you're just copying a few files, you shouldn't run into any scale limits. However, for optimal performance, each AzCopy job should transfer fewer than 10 million files. Jobs that transfer more than 50 million files can experience degraded performance because the AzCopy job tracking mechanism incurs significant overhead. To reduce overhead, consider dividing large jobs into smaller ones. There's no hard limit on individual file sizes.

The time it takes to copy can vary depending on several factors, including: the total number of files and directories to transfer, the average file size (many small files take longer to process than fewer large files), network bandwidth and latency between source and destination, storage account throttling limits, and concurrent operations on the source or destination shares.

### Properties preserved when copying files with AzCopy

When you use the `--preserve-info` and `--preserve-permissions` flags, AzCopy preserves the following file attributes and permissions:

| Type | Properties (--preserve-info) | Permissions (--preserve-permissions) |
|------|------------------------------|--------------------------------------|
| **SMB file shares** | File attributes (ReadOnly, Hidden, System, Directory, Archive, None, Temporary, Offline, NotContentIndexed, NoScrubData), creation time, last write time | ACLs |
| **NFS file shares** | Creation time, last write time | Owner, group, file mode |

### Copy files between SMB file shares

To copy files between SMB file shares, use the [azcopy copy](/azure/storage/common/storage-use-azcopy-files#copy-files-between-storage-accounts) command.

> [!TIP]
> These examples enclose path arguments with single quotes (''). Use single quotes in all command shells except for the Windows Command Shell (cmd.exe). If you're using a Windows Command Shell (cmd.exe), enclose path arguments with double quotes ("") instead of single quotes ('').

#### Copy a single file between SMB file shares

Use the following command to copy a single file from one SMB file share to another.

```azcopy
azcopy copy 'https://<source-storage-account-name>.file.core.windows.net/<file-share-name>/<file-path><SAS-token>' 'https://<destination-storage-account-name>.file.core.windows.net/<file-share-name>/<file-path><SAS-token>' --preserve-permissions=true --preserve-info=true
```

#### Copy a directory between SMB file shares

Use the following command to copy a directory and all of its files from one SMB file share to another. The result is a directory in the destination file share with the same name.

```azcopy
azcopy copy 'https://<source-storage-account-name>.file.core.windows.net/<file-share-name>/<directory-path><SAS-token>' 'https://<destination-storage-account-name>.file.core.windows.net/<file-share-name><SAS-token>' --recursive --preserve-permissions=true --preserve-info=true
```

#### Copy an entire SMB file share to another storage account

Use the following command to copy an entire SMB file share to another storage account.

```azcopy
azcopy copy 'https://<source-storage-account-name>.file.core.windows.net/<file-share-name><SAS-token>' 'https://<destination-storage-account-name>.file.core.windows.net/<file-share-name><SAS-token>' --recursive --preserve-permissions=true --preserve-info=true
```

#### Copy all SMB file shares, directories, and files to another storage account

Use the following command to copy all SMB file shares, directories, and files from one storage account to another.

```azcopy
azcopy copy 'https://<source-storage-account-name>.file.core.windows.net/<SAS-token>' 'https://<destination-storage-account-name>.file.core.windows.net/<SAS-token>' --recursive --preserve-permissions=true --preserve-info=true
```

### Copy files between NFS file shares

To copy files between NFS Azure file shares, use the [azcopy copy](/azure/storage/common/storage-use-azcopy-files#copy-files-between-storage-accounts) command with the `--from-to=FileNFSFileNFS` flag. The `FileNFSFileNFS` scenario uses the server-to-server copy API. Alternatively, you can use open source file copy tools such as [fpsync and rsync](storage-files-migration-nfs.md#using-fpsync-vs-rsync).

> [!TIP]
> These examples enclose path arguments with single quotes (''). Use single quotes in all command shells except for the Windows Command Shell (cmd.exe). If you're using a Windows Command Shell (cmd.exe), enclose path arguments with double quotes ("") instead of single quotes ('').

#### Copy a single file between NFS file shares

Use the following command to copy a single file from one NFS file share to another.

```azcopy
azcopy copy 'https://<source-storage-account-name>.file.core.windows.net/<file-share-name>/<file-path><SAS-token>' 'https://<destination-storage-account-name>.file.core.windows.net/<file-share-name>/<file-path><SAS-token>' --preserve-permissions=true --preserve-info=true --from-to=FileNFSFileNFS
```

#### Copy a directory between NFS file shares

Use the following command to copy a directory and all of its files from one NFS file share to another. The result is a directory in the destination file share with the same name.

```azcopy
azcopy copy 'https://<source-storage-account-name>.file.core.windows.net/<file-share-name>/<directory-path><SAS-token>' 'https://<destination-storage-account-name>.file.core.windows.net/<file-share-name><SAS-token>' --recursive --preserve-permissions=true --preserve-info=true --from-to=FileNFSFileNFS
```

#### Copy an entire NFS file share to another storage account

Use the following command to copy an entire NFS file share to another storage account.

```azcopy
azcopy copy 'https://<source-storage-account-name>.file.core.windows.net/<file-share-name><SAS-token>' 'https://<destination-storage-account-name>.file.core.windows.net/<file-share-name><SAS-token>' --recursive --preserve-permissions=true --preserve-info=true --from-to=FileNFSFileNFS
```

#### Copy all NFS file shares, directories, and files to another storage account

Use the following command to copy all NFS file shares, directories, and files from one storage account to another.

```azcopy
azcopy copy 'https://<source-storage-account-name>.file.core.windows.net/<SAS-token>' 'https://<destination-storage-account-name>.file.core.windows.net/<SAS-token>' --recursive --preserve-permissions=true --preserve-info=true --from-to=FileNFSFileNFS
```

## Copy files using Robocopy

Follow these steps to copy files using Robocopy, a command-line utility included with Windows. You can only use this method with Windows and SMB file shares.

1. Deploy a Windows virtual machine (VM) in Azure in the same region as your source file share. Keeping the data and networking in Azure is faster and avoids outbound data transfer charges. For optimal performance, we recommend a multi-core VM type with at least 56 GiB of memory, for example **Standard_DS5_v2**.

1. Mount both the source and target file shares to the VM. To make sure the VM has access to all the files, mount the Azure file share with [admin-level access](storage-files-identity-configure-file-level-permissions.md#mount-the-file-share-with-admin-level-access): either with identity-based access with admin-level Azure RBAC roles (recommended) or with storage account key (less secure).

1. Run this command at the Windows command prompt. Optionally, you can include flags for logging features as a best practice (/NP, /NFL, /NDL, /UNILOG). Remember to replace `s:\` and `t:\` with the paths to the mounted source and target shares as appropriate.
   
   ```console
   robocopy s:\ t:\ /MIR /COPYALL /MT:16 /R:2 /W:1 /B /IT /DCOPY:DAT
   ```
   
   You can run the command while your source is still online, but IOPS and throughput used for the Robocopy job counts against your file share limits.

1. After the initial run completes, run the same Robocopy command again to copy over all the changes that happened since the initial run. Any data unchanged since the last copy job is skipped.

1. You can repeat step 4 as many times as you would like before cutting over to the new file share.

## See also

- [Transfer data with AzCopy and file storage](/azure/storage/common/storage-use-azcopy-files)
- [Migrate to SMB Azure file shares](storage-files-migration-overview.md)
- [Migrate to NFS Azure file shares](storage-files-migration-nfs.md)
