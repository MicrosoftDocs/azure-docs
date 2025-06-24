---
title: Migrate files between SMB Azure file shares
description: Learn how to migrate files from one SMB Azure file share to another using Robocopy, a common migration tool.
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 05/08/2024
ms.author: kendownie
author: khdownie
# Customer intent: As a cloud administrator, I want to migrate files between SMB Azure file shares using Robocopy, so that I can efficiently transition data with minimal downtime and optimize storage performance.
---

# Migrate files from one SMB Azure file share to another
This article describes how to migrate files between SMB file shares hosted in Azure Files. You can use this method to migrate between HDD and SSD file shares, file shares using a different billing model, or file shares in different regions.

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
| Microsoft.Storage | Pay-as-you-go | HDD (standard) | GeoZone (GZRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |

## Migrate using Robocopy
Follow these steps to migrate using Robocopy, a command-line file copy utility included with Windows.

1. Deploy a Windows virtual machine (VM) in Azure in the same region as your source file share. Keeping the data and networking in Azure is faster and avoids outbound data transfer charges. For optimal performance, we recommend a multi-core VM type with at least 56 GiB of memory, for example **Standard_DS5_v2**.

2. Mount both the source and target file shares to the VM. Be sure to mount them using the storage account key to make sure the VM has access to all the files. Don't use a domain identity.

3. Run this command at the Windows command prompt. Optionally, you can include flags for logging features as a best practice (/NP, /NFL, /NDL, /UNILOG). Remember to replace `s:\` and `t:\` with the paths to the mounted source and target shares as appropriate.
   
   ```console
   robocopy s:\ t:\ /MIR /COPYALL /MT:16 /R:2 /W:1 /B /IT /DCOPY:DAT
   ```
   
   You can run the command while your source is still online, but IOPS and throughput used for the robocopy job counts against your file share limits.

4. After the initial run completes, run the same robocopy command again to copy over all the changes that happened since the initial run. Any data unchanged since the last copy job is skipped.

5. You can repeat step 4 as many times as you would like before cutting over to the new file share.

## See also

- [Migrate to Azure file shares using RoboCopy](storage-files-migration-robocopy.md)
- [Migrate files from one Azure file share to another when using Azure File Sync](../file-sync/file-sync-share-to-share-migration.md)
