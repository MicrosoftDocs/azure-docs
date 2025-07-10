---
title: About Azure Files backup
description: Learn how to back up Azure Files in the Recovery Services vault
ms.topic: overview
ms.date: 05/06/2025
ms.service: azure-backup
ms.custom:
  - engagement-fy23
  - ignite-2023
author: jyothisuri
ms.author: jsuri
# Customer intent: As an IT administrator managing cloud storage, I want to understand the backup aspects before configuring Azure Files backup using a Recovery Services vault, so that I can ensure data protection, streamline recovery processes, and eliminate on-premises maintenance overhead.
---

# About Azure Files backup

Azure Files backup is a native cloud solution that protects your data and eliminates on-premises maintenance overheads. Azure Backup integrates with Azure File Sync, centralizing your File Share data and backups. The secure, managed backup solution supports **snapshot** and **vaulted** backups to protect your enterprise File Shares, ensuring data recovery from accidental or malicious deletion.

## Key benefits of Azure Files backup

Protection of Azure Files provides the following benefits by using *Snapshot* and *Vaulted* backup tiers:

* **Zero infrastructure**: No deployment is needed to configure protection for your File Shares.
* **Customized retention**: You can configure backups with daily/weekly/monthly/yearly retention according to your requirements.
* **Built in management capabilities**: You can schedule backups and set retention periods without the need for data pruning.
* **Instant restore**: Azure Files backup uses File Share snapshots, so you can select just the files you want to restore instantly.
* **Alerting and reporting**: You can configure alerts for backup and restore failures and use the reporting solution provided by Azure Backup to get insights on backups across your files shares.
* **Protection against accidental deletion of File Shares**: Azure Backup enables the [soft delete feature](../storage/files/storage-files-prevent-file-share-deletion.md) on a storage account level with a retention period of 14 days. If a malicious actor deletes the File Share, its contents and snapshots are retained for a set period, ensuring complete recovery with no data loss.
* **Protection against accidental deletion of snapshots**: Azure Backup acquires a lease on the snapshots taken by scheduled/on-demand backup jobs. The lease acts as a lock that adds a layer of protection and secures the snapshots against accidental deletion.

### Additional key benefit for vaulted backup

**Comprehensive data protection**: The vaulted backup for Azure Files enables you to protect data from any type of data loss irrespective of the severity or blast radius. With offsite backups, there's no hard dependency on the availability of source data to continue your business operations.

## Architecture for Azure Files backup

This section shows the backup flow for Azure Files by using the backup tiers - Snapshot tier and Vault-Standard tier.

**Choose a backup tier**:

# [Snapshot tier](#tab/snapshot)

:::image type="content" source="./media/azure-file-share-backup-overview/azure-file-shares-backup-architecture.png" alt-text="Diagram shows the Azure Files backup architecture for snapshot tier." lightbox="./media/azure-file-share-backup-overview/azure-file-shares-backup-architecture.png":::

# [Vault-Standard tier](#tab/vault-standard)

:::image type="content" source="./media/azure-file-share-backup-overview/azure-file-shares-backup-architecture-for-vault-standard.png" alt-text="Diagram shows the Azure Files backup architecture for vault-standard tier." lightbox="./media/azure-file-share-backup-overview/azure-file-shares-backup-architecture-for-vault-standard.png":::

---

## How the backup process for Azure Files works?

1. The first step in configuring backup for Azure Files is creating a Recovery Services vault. The vault gives you a consolidated view of the backups configured across different workloads.

2. Once you create a vault, the Azure Backup service discovers the storage accounts that can be registered with the vault. You can select the storage account hosting the File Shares you want to protect.

3. After you select the storage account, the Azure Backup service lists the set of File Shares present in the storage account and stores their names in the management layer catalog.

4. Then configure the backup policy (backup tier, schedule, and retention) according to your requirements, and select the File Shares to back up. The Azure Backup service registers the schedules in the control plane to do scheduled backups.

5. Based on the selected policy, the Azure Backup scheduler triggers backups at the scheduled time.

   The backup process depends on the backup tier selected in the backup policy.

   | Backup tier | Description |
   | --- | --- |
   | **Snapshot tier** | The File Share snapshot is created using the File Share API. The snapshot URL is stored in the metadata store only. |
   | **Vault-Standard tier** | Once the File Share snapshot is created, the changed files and data blocks since the last backup are identified and transferred to the vault. The time taken for data transfer depends on the amount of data and number of files changed. |

6. You can restore the Azure Files contents (individual files or the full share) from snapshots available on the source File Share. Once the operation is triggered, the snapshot URL is retrieved from the metadata store, and the data is listed and transferred from the source snapshot to the target File Share of your choice.

   If the vaulted backup is in enabled state and the snapshot corresponding to the selected recovery point isn't found, Azure Backup uses the backup data in the vault for restore. You can restore the complete File Share contents to an alternate location.

7. If you're using Azure File Sync, the Backup service indicates to the Azure File Sync service the paths of the files being restored, which then triggers a background change detection process on these files. Any changed files sync down to the server endpoint. This process happens in parallel with the original restore to the Azure Files.

   
8. The backup and restore job monitoring data is pushed to the Azure Backup Monitoring service. This data allows you to monitor cloud backups for your File Shares in a single dashboard. In addition, you can also configure alerts or email notifications when backup health is affected. Emails are sent via the Azure email service.

## Backup costs

For snapshot tier, you incur the following costs:

- **Snapshot storage cost**: Storage charges incurred for snapshots are billed along with Azure Files usage according to the pricing details mentioned [here](https://azure.microsoft.com/pricing/details/storage/files/)

- **Protected Instance fee**: Starting from September 1, 2020, you're charged a protected instance fee as per the [pricing details](https://azure.microsoft.com/pricing/details/backup/). The protected instance fee depends on the total size of protected File Shares in a storage account.

To get detailed estimates for backing up Azure Files, you can download the detailed [Azure Backup pricing estimator](https://aka.ms/AzureBackupCostEstimates).  

>[!IMPORTANT]
>For vaulted backup, you will incur a protected instance fee and charges for backup storage for your standard and premium shares from April 1,2025.

## How lease snapshot works?

When Azure Backup takes a snapshot, scheduled, or on-demand, it adds a lock on the snapshot using the lease snapshot capability of the _Files_ platform. The lock protects the snapshots from accidental deletion, and the lock’s duration is infinite. If a File Share has leased-snapshots, the deletion is no more a one-click operation. Therefore, you also get protection against accidental deletion of the backed-up File Share.

To protect a snapshot from deletion while restore operation is in progress, Azure Backup checks the lease status on the snapshot. If it's a non-leased-snapshot, it adds a lock by taking a lease on the snapshot.

The following diagram explains the lifecycle of the lease acquired by Azure Backup:

:::image type="content" source="./media/azure-file-share-backup-overview/backup-lease-lifecycle-diagram.png" alt-text="Diagram explaining the lifecycle of the lease acquired by Azure Backup." border="false":::

## How Cross Subscription Backup for Azure Files works?

Cross Subscription Backup (CSB) for Azure Files enables you to back up File Shares across subscriptions. This feature is useful when you want to centralize backup management for File Shares across different subscriptions. You can back up File Shares from a source subscription to a Recovery Services vault in a target subscription.

Learn about the [additional prerequisites](backup-azure-files.md#prerequisites) and [steps to configure Cross Subscription Backup for Azure Files](backup-azure-files.md#configure-the-backup).

## Next steps

* [Back up Azure Files](backup-afs.md).
* [Frequently asked questions about backing up Azure Files](backup-azure-files-faq.yml).
* [Well-architected reliability design principles for Azure Files vaultes backup](/azure/well-architected/service-guides/azure-files#reliability).
