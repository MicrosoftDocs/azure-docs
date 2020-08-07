---
title: Back up Azure Files FAQ
description: In this article, discover answers to common questions about how to protect your Azure file shares with the Azure Backup service.
ms.date: 04/22/2020
ms.topic: conceptual
---

# Questions about backing up Azure Files

This article answers common questions about backing up Azure Files. In some of the answers, there are links to the articles that have comprehensive information. You can also post questions about the Azure Backup service in the [Microsoft Q&A question page for discussion](https://docs.microsoft.com/answers/topics/azure-backup.html).

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

If the file share is in the soft deleted state, you need to first undelete the file share to perform the restore operation. The undelete operation will bring the file share into the active state where you can restore to any point in time. To learn how to undelete your file share, visit [this link](https://docs.microsoft.com/azure/storage/files/storage-files-enable-soft-delete?tabs=azure-portal#restore-soft-deleted-file-share) or see the [Undelete File Share Script](./scripts/backup-powershell-script-undelete-file-share.md). If the file share is permanently deleted, you won't be able restore the contents and snapshots.

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

### What is the impact on existing recovery points and snapshots when I modify the Backup policy for an Azure file share to switch from “Daily Policy" to "GFS Policy”?

When you modify a Daily backup policy to GFS policy (adding weekly/monthly/yearly retention), the behavior is as follows:

- **Retention**: If you're adding weekly/monthly/yearly retention as part of modifying the policy, all the future recovery points created as part of the scheduled backup will be tagged according to the new policy. All the existing recovery points will still be considered as daily recovery points and so won’t be tagged as weekly/monthly/yearly.

- **Snapshots and recovery points cleanup**:

  - If daily retention is extended, the expiration date of the existing recovery points is updated according to the daily retention value configured in the new policy.
  - If daily retention is reduced, the existing recovery points and snapshots are marked for deletion in the next cleanup run job according to the daily retention value configured in the new policy, and then deleted.

Here's an example of how this works:

#### Existing Policy [P1]

|Retention Type |Schedule |Retention  |
|---------|---------|---------|
|Daily    |    Every day at 8 PM    |  100 days       |

#### New Policy [Modified P1]

| Retention Type | Schedule                       | Retention |
| -------------- | ------------------------------ | --------- |
| Daily          | Every day at 9 PM              | 50 days   |
| Weekly         | On Sunday at 9 PM              | 3 weeks   |
| Monthly        | On Last Monday at 9 PM         | 1 month   |
| Yearly         | In Jan on Third Sunday at 9 PM | 4 years   |

#### Impact

1. The expiration date of existing recovery points will be adjusted according to the daily retention value of the new policy:  that is, 50 days. So any recovery point that’s older than 50 days will be marked for deletion.

2. The existing recovery points won’t be tagged as weekly/monthly/yearly based on new policy.

3. All the future backups will be triggered according to the new schedule: that is, at 9 PM.

4. The expiration date of all future recovery points will be aligned with the new policy.

>[!NOTE]
>The policy changes will affect only the recovery points created as part of the scheduled backup job run. For on-demand backups, retention is determined by the **Retain Till** value specified at the time of taking backup.

### What is the impact on existing recovery points when I modify an existing GFS Policy?

When a new policy is applied on file shares, all the future scheduled backups will be taken according to the schedule configured in the modified policy.  The retention of all existing recovery points is aligned according to the new retention values configured. So if the retention is extended, existing recovery points are marked to be retained according to the new policy. If the retention is reduced, they're marked for clean-up in the next cleanup job and then deleted.

Here's an example of how this works:

#### Existing Policy [P2]

| Retention Type | Schedule           | Retention |
| -------------- | ------------------ | --------- |
| Daily          | Every day at 8 PM | 50 days   |
| Weekly         | On Monday at 8 PM  | 3 weeks   |

#### New Policy [Modified P2]

| Retention Type | Schedule               | Retention |
| -------------- | ---------------------- | --------- |
| Daily          | Every day at 9 PM     | 10 days   |
| Weekly         | On Monday at 9 PM      | 2 weeks   |
| Monthly        | On Last Monday at 9 PM | 2 months  |

#### Impact of change

1. The expiration date of existing daily recovery points will be aligned according to the new daily retention value, that is 10 days. So any daily recovery point older than 10 days will be deleted.

2. The expiration date of existing weekly recovery points will be aligned according to the new weekly retention value, that is two weeks. So any weekly recovery point older than two weeks will be deleted.

3. The monthly recovery points will only be created as part of future backups based on the new policy configuration.

4. The expiration date of all future recovery points will be aligned with the new policy.

>[!NOTE]
>The policy changes will affect only the recovery points created as part of the scheduled backup. For on-demand backups, retention is determined by the **Retain Till** value specified at the time of taking the backup.

## Next steps

- [Troubleshoot problems while backing up Azure file shares](troubleshoot-azure-files.md)
