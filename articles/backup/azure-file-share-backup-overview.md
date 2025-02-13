---
title: About Azure File share backup
description: Learn how to back up Azure file shares in the Recovery Services vault
ms.topic: overview
ms.date: 11/20/2024
ms.service: azure-backup
ms.custom:
  - engagement-fy23
  - ignite-2023
author: jyothisuri
ms.author: jsuri
---

# About Azure File share backup

Azure File share backup is a native, cloud-based backup solution that protects your data in the cloud and eliminates additional maintenance overheads involved in on-premises backup solutions. The Azure Backup service smoothly integrates with Azure File Sync, and allows you to centralize your file share data as well as your backups. The simple, secure, and managed backup solution enables you to perform *snapshot backup* and *vaulted backup (preview)* to protect your enterprise file shares so that you can recover the data in case of any accidental or malicious deletion.

>[!Note]
>Vaulted backup for Azure File share is currently in preview.

## Key benefits of Azure File share backup

Protection of Azure File share provides the following benefits by using *Snapshot* and *Vaulted (preview)* backup tiers:

* **Zero infrastructure**: No deployment is needed to configure protection for your file shares.
* **Customized retention**: You can configure backups with daily/weekly/monthly/yearly retention according to your requirements.
* **Built in management capabilities**: You can schedule backups and specify the desired retention period without the additional overhead of data pruning.
* **Instant restore**: Azure File share backup uses file share snapshots, so you can select just the files you want to restore instantly.
* **Alerting and reporting**: You can configure alerts for backup and restore failures and use the reporting solution provided by Azure Backup to get insights on backups across your files shares.
* **Protection against accidental deletion of file shares**: Azure Backup enables the [soft delete feature](../storage/files/storage-files-prevent-file-share-deletion.md) on a storage account level with a retention period of 14 days. Even if a malicious actor deletes the file share, the file share’s contents and recovery points (snapshots) are retained for a configurable retention period, allowing the successful and complete recovery of source contents and snapshots with no data loss.
* **Protection against accidental deletion of snapshots**: Azure Backup acquires a lease on the snapshots taken by scheduled/on-demand backup jobs. The lease acts as a lock that adds a layer of protection and secures the snapshots against accidental deletion.

### Additional key benefit for vaulted backup (preview)

**Comprehensive data protection**: The vaulted backup (preview) for Azure Files enables you to protect data from any type of data loss irrespective of the severity or blast radius. With offsite backups, there is no hard dependency on the availability of source data to continue your business operations.

## Architecture for Azure File share backup

This section shows the backup flow for Azure File share by using the backup tiers - Snapshot tier and Vault-Standard tier (preview).

**Choose a backup tier**:

# [Snapshot tier](#tab/snapshot)

:::image type="content" source="./media/azure-file-share-backup-overview/azure-file-shares-backup-architecture.png" alt-text="Diagram shows the Azure File share backup architecture for snapshot tier." lightbox="./media/azure-file-share-backup-overview/azure-file-shares-backup-architecture.png":::

# [Vault-Standard tier (preview)](#tab/vault-standard)

:::image type="content" source="./media/azure-file-share-backup-overview/azure-file-shares-backup-architecture-for-vault-standard.png" alt-text="Diagram shows the Azure File share backup architecture for vault-standard tier." lightbox="./media/azure-file-share-backup-overview/azure-file-shares-backup-architecture-for-vault-standard.png":::

---

## How the backup process for Azure File share works?

1. The first step in configuring backup for Azure File shares is creating a Recovery Services vault. The vault gives you a consolidated view of the backups configured across different workloads.

2. Once you create a vault, the Azure Backup service discovers the storage accounts that can be registered with the vault. You can select the storage account hosting the file shares you want to protect.

3. After you select the storage account, the Azure Backup service lists the set of file shares present in the storage account and stores their names in the management layer catalog.

4. Then configure the backup policy (backup tier, schedule, and retention) according to your requirements, and select the file shares to back up. The Azure Backup service registers the schedules in the control plane to do scheduled backups.

5. Based on the selected policy, the Azure Backup scheduler triggers backups at the scheduled time.

   The backup process depends on the backup tier selected in the backup policy.

   | Backup tier | Description |
   | --- | --- |
   | **Snapshot tier** | The file share snapshot is created using the File share API. The snapshot URL is stored in the metadata store only. |
   | **Vault-Standard tier (preview)** | Once the file share snapshot is created, the changed files and data blocks since the last backup are identified and transferred to the vault. The time taken for data transfer depends on the amount of data and number of files changed. |

6. You can restore the Azure File share contents (individual files or the full share) from snapshots available on the source file share. Once the operation is triggered, the snapshot URL is retrieved from the metadata store and the data is listed and transferred from the source snapshot to the target file share of your choice.

   If you have vaulted backup (preview) enabled and the snapshot corresponding to the selected recovery point is not found, restore will be triggered by using the backup data in the vault. You can restore the complete file share contents to an alternate location.

7. If you're using Azure File Sync, the Backup service indicates to the Azure File Sync service the paths of the files being restored, which then triggers a background change detection process on these files. Any files that have changed are synced down to the server endpoint. This process happens in parallel with the original restore to the Azure File share.

   >[!Note]
   >Vaulted backup (preview) currently doesn't support restore to a file share registered with File sync service.

8. The backup and restore job monitoring data is pushed to the Azure Backup Monitoring service. This allows you to monitor cloud backups for your file shares in a single dashboard. In addition, you can also configure alerts or email notifications when backup health is affected. Emails are sent via the Azure email service.

## Backup costs

For snapshot tier, you'll incur the following costs:

- **Snapshot storage cost**: Storage charges incurred for snapshots are billed along with Azure Files usage according to the pricing details mentioned [here](https://azure.microsoft.com/pricing/details/storage/files/)

- **Protected Instance fee**: Starting from September 1, 2020, you're charged a protected instance fee as per the [pricing details](https://azure.microsoft.com/pricing/details/backup/). The protected instance fee depends on the total size of protected file shares in a storage account.

To get detailed estimates for backing up Azure File shares, you can download the detailed [Azure Backup pricing estimator](https://aka.ms/AzureBackupCostEstimates).  

>[!Note]
>There are no additional charges for vaulted backups during preview. However, you will incur the cost for the snapshots taken as part of the backup process.

## How lease snapshot works?

When Azure Backup takes a snapshot, scheduled or on-demand, it adds a lock on the snapshot using the lease snapshot capability of the _Files_ platform. The lock protects the snapshots from accidental deletion, and the lock’s duration is infinite. If a file share has leased snapshots, the deletion is no more a one-click operation. Therefore, you also get protection against accidental deletion of the backed-up file share.

To protect a snapshot from deletion while restore operation is in progress, Azure Backup checks the lease status on the snapshot. If it's non-leased, it adds a lock by taking a lease on the snapshot.

The following diagram explains the lifecycle of the lease acquired by Azure Backup:

:::image type="content" source="./media/azure-file-share-backup-overview/backup-lease-lifecycle-diagram.png" alt-text="Diagram explaining the lifecycle of the lease acquired by Azure Backup." border="false":::

## How Cross Subscription Backup for Azure File share (preview) works?

Cross Subscription Backup (CSB) for Azure File share (preview) enables you to back up file shares across subscriptions. This feature is useful when you want to centralize backup management for file shares across different subscriptions. You can back up file shares from a source subscription to a Recovery Services vault in a target subscription.

Learn about the [additional prerequisites](backup-azure-files.md#prerequisites) and [steps to configure Cross Subscription Backup for Azure File share (preview)](backup-azure-files.md#configure-the-backup). For information on the supported regions for Cross Subscription Backup, see the [Azure File share backup support matrix](azure-file-share-support-matrix.md#supported-regions-for-cross-subscription-backup-preview).

## Next steps

* [Back up Azure File shares](backup-afs.md).
* [Frequently asked questions about backing up Azure Files](backup-azure-files-faq.yml).
