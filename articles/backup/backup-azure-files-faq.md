---
title: Back up Azure Files FAQ
description: In this article, discover answers to common questions about how to protect your Azure file shares with the Azure Backup service.
ms.date: 07/29/2019
ms.topic: conceptual
---

# Questions about backing up Azure Files

This article answers common questions about backing up Azure Files. In some of the answers, there are links to the articles that have comprehensive information. You can also post questions about the Azure Backup service in the [discussion forum](https://social.msdn.microsoft.com/forums/azure/home?forum=windowsazureonlinebackup).

To quickly scan the sections in this article, use the links to the right, under **In this article**.

## Configuring the backup job for Azure Files

### Why can't I see some of my Storage Accounts I want to protect, that contain valid Azure file shares?

During preview, Backup for Azure file Shares does not support all types of Storage Accounts. Refer to the list [here](troubleshoot-azure-files.md#limitations-for-azure-file-share-backup-during-preview) to see the list of supported Storage Accounts. It is also possible that the Storage Account you are looking for is already protected or registered with another Vault. [Unregister](troubleshoot-azure-files.md#configuring-backup) from the vault to discover the Storage Account in other Vaults for protection.

### Why can't I see some of my Azure file shares in the Storage Account when I'm trying to configure backup?

Check if the Azure file share is already protected in the same Recovery Services vault or if it has been deleted recently.

### Can I protect File Shares connected to a Sync Group in Azure Files Sync?

Yes. Protection of Azure File Shares connected to Sync Groups is enabled and part of Public preview.

### When trying to back up file shares, I clicked on a Storage Account for discovering the file shares in it. However, I did not protect them. How do I protect these file shares with any other Vault?

When trying to back up, selecting a Storage Account to discover file shares within it registers the Storage Account with the Vault from which this is done. If you choose to protect the file shares with a different Vault, [Unregister](troubleshoot-azure-files.md#configuring-backup) the chosen Storage Account from this Vault.

### Can I change the Vault to which I back up my file shares?

Yes. However, you'll need to  [Stop protection on a file share](manage-afs-backup.md#stop-protection-on-a-file-share) from the connected Vault, [Unregister](troubleshoot-azure-files.md#configuring-backup) this Storage Account, and then protect it from a different Vault.

### In which geos can I back up Azure File shares?

Backup for Azure File shares is currently in Preview and is available only in the following geos:

- Australia East (AE)
- Australia South East (ASE)
- Brazil South (BRS)
- Canada Central (CNC)
- Canada East (CE)
- Central US (CUS)
- East Asia (EA)
- East US (EUS)
- East US 2 (EUS2)
- Japan East (JPE)
- Japan West (JPW)
- India Central (INC)
- India South (INS)
- Korea Central (KRC)
- Korea South (KRS)
- North Central US (NCUS)
- North Europe (NE)
- South Central US (SCUS)
- South East Asia (SEA)
- UK South (UKS)
- UK West (UKW)
- West Europe (WE)
- West US (WUS)
- West Central US (WCUS)
- West US 2 (WUS 2)
- US Gov Arizona (UGA)
- US Gov Texas (UGT)
- US Gov Virginia (UGV)
- Australia Central (ACL)
- India West(INW)
- South Africa North(SAN)
- UAE North(UAN)
- France Central (FRC)
- Germany North (GN)                       
- Germany West Central (GWC)
- South Africa West (SAW)
- UAE Central (UAC)
- NWE (Norway East)     
- NWW (Norway West)
- SZN (Switzerland North)

Write to [AskAzureBackupTeam@microsoft.com](email:askazurebackupteam@microsoft.com) if you need to use it in a specific geo that is not listed above.

### How many Azure file shares can I protect in a Vault?

During the preview, you can protect Azure file shares from up to 50 Storage Accounts per Vault. You can also protect up to 200 Azure file shares in a single vault.

### Can I protect two different file shares from the same Storage Account to different Vaults?

No. All file shares in a Storage Account can be protected only by the same Vault.

## Backup

### How many scheduled backups can I configure per file share?

Azure Backup currently supports configuring scheduled once-daily backups of Azure File Shares.

### How many On-Demand backups can I take per file share?

You can have up to 200 Snapshots for a file share at any point in time. The limit includes snapshots taken by Azure Backup as defined by your policy. If your backups start failing after reaching the limit, delete On-Demand restore points for successful future backups.

## Restore

### Can I recover from a deleted Azure file share?

When an Azure file share is deleted, you're shown the list of backups that will be deleted and a confirmation is sought. A deleted Azure file share can't be restored.

### Can I restore from backups if I stopped protection on an Azure file share?

Yes. If you chose **Retain Backup Data** when you stopped protection, then you can restore from all existing restore points.

### What happens if I cancel an ongoing restore job?

If an ongoing restore job is canceled, the restore process stops and all files restored before the cancellation, stay in configured destination (original or alternate location) without any rollbacks.

## Manage backup

### Can I use PowerShell to configure/manage/restore backups of Azure File shares?

Yes. Please refer to the detailed documentation [here](backup-azure-afs-automation.md)

### Can I access the snapshots taken by Azure Backups and mount it?

All Snapshots taken by Azure Backup can be accessed by Viewing Snapshots in the portal, PowerShell, or CLI. To learn more about Azure Files share snapshots, see [Overview of share snapshots for Azure Files (preview)](../storage/files/storage-snapshots-files.md).

### What is the maximum retention I can configure for backups?

Backup for Azure file shares offers the ability to configure policies with retention up to 180 days. However, using the ["On-demand backup" option in PowerShell](backup-azure-afs-automation.md#trigger-an-on-demand-backup), you can retain a recovery point even for 10 years.

### What happens when I change the Backup policy for an Azure file share?

When a new policy is applied on file share(s), schedule and retention of the new policy is followed. If retention is extended, existing recovery points are marked to keep them as per new policy. If retention is reduced, they're marked for pruning in the next cleanup job and deleted.

## Next steps

To learn more about other areas of Azure Backup, see some of these other Backup FAQs:

- [Recovery Services vault FAQ](backup-azure-backup-faq.md)
- [Azure VM backup FAQ](backup-azure-vm-backup-faq.md)
- [Azure Backup agent FAQ](backup-azure-file-folder-backup-faq.md)
