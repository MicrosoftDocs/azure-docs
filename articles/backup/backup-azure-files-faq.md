---
title: Back up Azure Files FAQ
description: This article provides details about how to protect your Azure Files in Azure. This abstract displays in the search result.
services: backup
keywords: Don’t add or edit keywords without consulting your SEO champ.
author: markgalioto
ms.author: markgal
ms.date: 2/21/2018
ms.topic: tutorial
ms.service: backup
ms.workload: storage-backup-recovery
manager: carmonm

---

# Questions about backing up Azure Files
This article answers common questions about backing up Azure Files. In some of the answers, there are links to the articles that have comprehensive information. You can also post questions about the Azure Backup service in the [discussion forum](https://social.msdn.microsoft.com/forums/azure/home?forum=windowsazureonlinebackup).

To quickly scan the sections in this article, use the links to the right, under **In this article**.

## Configuring the backup job for Azure Files

### Why can’t I see some of my Storage Accounts I want to protect, that contain valid File shares? <br/>
During preview, Backup for Azure File Shares does not support all types of Storage Accounts. Refer to the list [here](troubleshoot-azure-files.md#preview-boundaries) to see the list of supported Storage Accounts.

### Why can’t I see some of my File shares in the Storage Account when I’m trying to configure backup? <br/>
Check if the File share is already protected in the same Recovery Services vault or has been deleted recently.

### Why can’t I protect File Shares connected to a Sync Group in Azure Files Sync? <br/>
Protection of Azure File Shares connected to Sync Groups is in limited preview. Please write to [AskAzureBackupTeam@microsoft.com](email:askazurebackupteam@microsoft.com) with your Subscription ID to requested access. 

### In which geos can I back up Azure File shares <br/>
Backup for Azure File shares is currently in Preview and is available only in the following geos: 
-	Australia South East (ASE) 
- Brazil South (BRS)
- Canada Central (CNC)
-	Canada East (CE)
-	Central US (CUS)
-	East Asia (EA)
-	East Australia (AE) 
-	East US (EUS)
-	East US 2 (EUS2)
-	India Central (INC) 
-	North Central US (NCUS) 
-	North Europe (NE) 
-	South Central US (SCUS) 
-	South East Asia (SEA)
-	UK South (UKS) 
-	UK West (UKW) 
-	West Europe (WE) 
-	West US (WUS)
-	West Central US (WCUS)
-	West US 2 (WUS 2)

Please write to [AskAzureBackupTeam@microsoft.com](email:askazurebackupteam@microsoft.com) if you need to use it in a specific geo that is not listed above.

### How many file shares can I protect in a Vault?<br/>
During the preview, you can protect File shares from up to 25 Storage Accounts per Vault. You can also protect up to 200 File shares in a single vault. 

## Backup

### How many On-Demand backups can I take per file share? <br/>
At any point in time, you can have up to 200 Snapshots for a file share. The limit includes snapshots taken by Azure Backup as defined by your policy. If your backups start failing after reaching the limit, delete On-Demand restore points for successful future backups.

### After enabling Virtual Networks on my Storage Account, the Backup of file shares in the account started failing. Why?
Backup for Azure File shares does not support Storage Accounts that have Virtual Networks enabled. Disable Virtual Networks in Storage Accounts to enable successful backups. 

## Restore

### Can I recover from a deleted file share? <br/>
When a file share is deleted, you are shown the list of backups that will also be deleted and a confirmation is sought. A deleted file share cannot be restored.

### Can I restore from backups if I stopped protection on a file share? <br/>
Yes. If you chose **Retain Backup Data** when you stopped protection, then you can restore from all existing restore points.

## Manage Backup

### Can I access the snapshots taken by Azure Backups and mount it? <br/>
All Snapshots taken by Azure Backup can be accessed by Viewing Snapshots in the portal, PowerShell, or CLI. You can mount them using the procedure [here](../storage/files/storage-how-to-use-files-snapshots.md#mount-a-file-share).

### What is the maximum retention I can configure for Backups? <br/>
Backup for Azure File shares offers the ability to retain your daily backups up to 120 days.

### What happens when I change the Backup policy for a file share? <br/>
When a new policy is applied on file share(s), schedule and retention of the new policy is followed. If retention is extended, existing recovery points are marked to keep them as per new policy. If retention is reduced, they are marked for pruning in the next cleanup job and subsequently deleted.


## See also
This information is just about backing up Azure Files, to learn more about other areas of Azure Backup, see some of these other Backup FAQs:
-  [Recovery Services vault FAQ](backup-azure-backup-faq.md)
-  [Azure VM backup FAQ](backup-azure-vm-backup-faq.md)
-  [Azure Backup agent FAQ](backup-azure-file-folder-backup-faq.md)
