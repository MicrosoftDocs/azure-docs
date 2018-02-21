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
Azure Files Backup is currently in Preview, and only supported Storage Accounts can be configured for Backup. Be sure the Storage Account you are looking for, is a supported storage account.

### Why can’t I see some of my File shares in the Storage Account when I’m trying to configure backup? <br/>
Check if the File share is already protected in the same Recovery Services vault. Ensure that the File share you are looking to protect has not been deleted recently.

### Why can’t I protect File Shares connected to a Sync Group in Azure Files Sync? <br/>
Protection of Azure File Shares connected to Sync Groups is in limited preview. Please write to [AskAzureBackupTeam@microsoft.com](email:askazurebackupteam@microsoft.com) with your Subscription ID to requested access. 

### In which geos can I back up Azure File shares <br/>
Backup for Azure File shares is currently in Preview and is available only in the following geos. 
-	Canada Central (CNC)
-	Canada East (CE) 
-	Central US (CUS)
-	East Asia (EA)
-	East Australia (AE) 
-	India Central (INC) 
-	North Central US (NCUS) 
-	UK South (UKS) 
-	UK West (UKW) 
-	West Central US (WCUS)
-	West US 2 (WUS 2)

Backup for Azure File shares will be available in the following geos starting *February 23rd*.
-	Australia South East (ASE) 
-	Brazil South (BRS) 
-	East US (EUS) 
-	East US 2 (EUS2) 
-	North Europe (NE) 
-	South Central US (SCUS) 
-	South East Asia (SEA)
-	West Europe (WE) 
-	West US (WUS)  

Please write to [AskAzureBackupTeam@microsoft.com](email:askazurebackupteam@microsoft.com) if you need to use it in a specific geo that is not listed above.

### How many file shares can I protect in a Vault?<br/>
During the preview, you can protect File shares from up to 25 Storage Accounts per Vault. You can also protect up to 200 File shares in a single vault. 

## Backup

### How many On-Demand backups can I take per file share? <br/>
At any point in time, you can have up to 200 Snapshots for a file share, including the ones taken by Azure Backup as defined by your policy. If your backups start failing because of reaching this limit, please delete On-Demand restore points accordingly.

### After enabling Virtual Networks on my Storage Account, the Backup of file shares in the account started failing. Why?
Currently, Azure Files backup is not supported for Storage Accounts that have Virtual Networks enabled. Disable Virtual Networks in Storage Accounts you want to back up. 

## Restore

### Can I recover from a deleted file share? <br/>
When you try to delete a file share, you will be shown the list of backups which will also be deleted if you proceed and a confirmation will be sought. You cannot restore from a deleted file share.

### Can I restore from backups if I stopped protection on a file share? <br/>
Yes. If you chose **Retain Backup Data** when you stopped protection, then you can restore from all existing restore points.

## Manage Backup

### Can I access the snapshots taken by Azure Backups and mount it? <br/>
All Snapshots taken by Azure Backup can be accessed by Viewing Snapshots in the portal, PowerShell or CLI. You can mount them using the procedure here.

### What is the maximum retention I can configure for Backups? <br/>
Backup for Azure File shares offers the ability to retain your daily backups up to 120 days.

### What happens when I change the Backup policy for a file share? <br/>
When a new policy is applied on file share(s), schedule and retention of the new policy is followed. If retention is extended, existing recovery points are marked to keep them as per new policy. If retention is reduced, they are marked for pruning in the next cleanup job and subsequently deleted.


## See also
This information is just about backing up Azure Files, to learn more about other areas of Azure Backup, see some of these other Backup FAQs:
-  [Recovery Services vault FAQ](backup-azure-backup-faq.md)
-  [Azure VM backup FAQ](backup-azure-vm-backup-faq.md)
-  [Azure Backup agent FAQ](backup-azure-file-folder-backup-faq.md)
