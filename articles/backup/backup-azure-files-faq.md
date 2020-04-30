---
title: Back up Azure Files FAQ
description: In this article, discover answers to common questions about how to protect your Azure file shares with the Azure Backup service.
ms.date: 04/22/2020
ms.topic: conceptual
---

# Questions about backing up Azure Files

This article answers common questions about backing up Azure Files. In some of the answers, there are links to the articles that have comprehensive information. You can also post questions about the Azure Backup service in the [discussion forum](https://social.msdn.microsoft.com/forums/azure/home?forum=windowsazureonlinebackup).

To quickly scan the sections in this article, use the links to the right, under **In this article**.

## Configuring the backup job for Azure Files

### Why can't I see some of my Storage Accounts that I want to protect, which contain valid Azure file shares?

Refer to the [Support Matrix for Azure file shares backup](azure-file-share-support-matrix.md) to ensure the storage account belongs to one of the supported storage account types. It's also possible the Storage Account you're looking for is already protected or registered with another Vault. [Unregister the storage account](manage-afs-backup.md#unregister-a-storage-account) from the vault to discover the Storage Account in other vaults for protection.

### Why can't I see some of my Azure file shares in the Storage Account when I'm trying to configure backup?

Check if the Azure file share is already protected in the same Recovery Services vault or if it has been deleted recently.

### Can I protect File Shares connected to a Sync Group in Azure Files Sync?

Yes. Protection of Azure File Shares connected to Sync Groups is enabled.

### When trying to back up file shares, I clicked on a Storage Account for discovering the file shares in it. However, I didn't protect them. How do I protect these file shares with any other vault?

When trying to back up, selecting a Storage Account to discover file shares within it registers the Storage Account with the vault from which this is done. If you choose to protect the file shares with a different vault, [unregister](manage-afs-backup.md#unregister-a-storage-account) the chosen Storage Account from this vault.

### Can I change the Vault to which I back up my file shares?

Yes. However, you'll need to [stop protection on the file share](manage-afs-backup.md#stop-protection-on-a-file-share) from the connected vault, [unregister](manage-afs-backup.md#unregister-a-storage-account) this Storage Account, and then protect it from a different vault.

### How many Azure file shares can I protect in a Vault?

You can protect Azure file shares from up to 50 Storage Accounts per Vault. You can also protect up to 200 Azure file shares in a single vault.

### Can I protect two different file shares from the same Storage Account to different Vaults?

No. All file shares in a Storage Account can be protected only by the same Vault.

## Backup

### What should I do if my backups start failing due to the maximum limit reached error?

You can have up to 200 Snapshots for a file share at any point in time. The limit includes snapshots taken by Azure Backup as defined by your policy. If your backups start failing after reaching the limit, delete On-Demand snapshots for successful future backups.

## Restore

### Can I recover from a deleted Azure file share?

When an Azure file share is deleted, you're shown the list of backups that will be deleted and a confirmation is requested. Currently, a deleted Azure file share can't be restored.

### Can I restore from backups if I stopped protection on an Azure file share?

Yes. If you chose **Retain Backup Data** when you stopped protection, then you can restore from all existing restore points.

### What happens if I cancel an ongoing restore job?

If an ongoing restore job is canceled, the restore process stops and all files restored before the cancellation, stay in configured destination (original or alternate location) without any rollbacks.

## Manage backup

### Can I use PowerShell to configure/manage/restore backups of Azure File shares?

Yes. Refer to the detailed documentation [here](backup-azure-afs-automation.md).

### Can I access the snapshots taken by Azure Backups and mount them?

All snapshots taken by Azure Backup can be accessed by viewing snapshots in the portal, PowerShell, or CLI. To learn more about Azure Files share snapshots, see [Overview of share snapshots for Azure Files](../storage/files/storage-snapshots-files.md).

### What is the maximum retention I can configure for backups?

Refer to the [support matrix](azure-file-share-support-matrix.md) for details on maximum retention. Azure Backup does a real-time calculation of the number of snapshots when you enter the retention values while configuring backup policy. As soon as the number of snapshots corresponding to your defined retention values exceeds 200, the portal will show a warning requesting you to adjust your retention values. This is so you don’t exceed the limit of maximum number of snapshots supported by Azure Files for any file share at any point in time.

### What happens when I change the Backup policy for an Azure file share?

When a new policy is applied on file share(s), schedule and retention of the new policy is followed. If retention is extended, existing recovery points are marked to keep them as per new policy. If retention is reduced, they're marked for pruning in the next cleanup job and deleted.

## Next steps

To learn more about other areas of Azure Backup, see some of these other Backup FAQs:

- [Recovery Services vault FAQ](backup-azure-backup-faq.md)
- [Azure VM backup FAQ](backup-azure-vm-backup-faq.md)
- [Azure Backup agent FAQ](backup-azure-file-folder-backup-faq.md)
