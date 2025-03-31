---
title: Migrate files between SMB Azure file shares
description: Learn how to migrate files from one SMB Azure file share to another using Robocopy, a common migration tool.
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 05/08/2024
ms.author: kendownie
author: khdownie
---

# Migrate files from one SMB Azure file share to another

This article describes how to migrate files between SMB Azure file shares. One common reason to do this is if you need to migrate from an HDD file share to an SSD file share to get increased performance for your application workload.

> [!WARNING]
> If you're using Azure File Sync, the migration process is different than described in this article. Instead, see [Migrate files from one Azure file share to another when using Azure File Sync](../file-sync/file-sync-share-to-share-migration.md).

## Applies to
| Management model | Billing model | Media tier | Redundancy | SMB | NFS |
|-|-|-|-|:-:|:-:|
| Microsoft.Storage | Provisioned v2 | HDD (standard) | Local (LRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Provisioned v2 | HDD (standard) | Zone (ZRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Provisioned v2 | HDD (standard) | Geo (GRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Provisioned v2 | HDD (standard) | GeoZone (GZRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Provisioned v1 | SSD (premium) | Local (LRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Provisioned v1 | SSD (premium) | Zone (ZRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Pay-as-you-go | HDD (standard) | Local (LRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Pay-as-you-go | HDD (standard) | Zone (ZRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Pay-as-you-go | HDD (standard) | Geo (GRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Pay-as-you-go | HDD (standard) | GeoZone (GZRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) ||

## Migrate using Robocopy

Follow these steps to migrate using Robocopy, a command-line file copy utility included with Windows.

1. Deploy a Windows virtual machine (VM) in Azure in the same region as your source file share. Keeping the data and networking in Azure is faster and avoids outbound data transfer charges. For optimal performance, we recommend a multi-core VM type with at least 56 GiB of memory, for example **Standard_DS5_v2**.

1. Mount both the source and target file shares to the VM. Be sure to mount them using the storage account key to make sure the VM has access to all the files. Don't use a domain identity.

1. Run this command at the Windows command prompt. Optionally, you can include flags for logging features as a best practice (/NP, /NFL, /NDL, /UNILOG).
   
   ```console
   robocopy <source> <target> /MIR /COPYALL /MT:16 /R:2 /W:1 /B /IT /DCOPY:DAT
   ```
   
   Here is an example command with source mounted as `s:\` and target mounted as `t:\`:
   
   ```console
   robocopy s:\ t:\ /MIR /COPYALL /MT:16 /R:2 /W:1 /B /IT /DCOPY:DAT
   ```
   
   You can run the command while your source is still online, but IOPS and throughput used for the robocopy job counts against your file share limits.

1. After the initial run completes, disconnect your application from the existing share and run the same robocopy command again. This will copy over all the changes that happened since the initial run, skipping any file data that has already copied over.

1. After the command completes for the second time, you can redirect your application to the new share.

## See also

- [Migrate to Azure file shares using RoboCopy](storage-files-migration-robocopy.md)
- [Migrate files from one Azure file share to another when using Azure File Sync](../file-sync/file-sync-share-to-share-migration.md)
