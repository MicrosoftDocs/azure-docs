---
title: About Azure file share backup
description: Learn how to back up Azure file shares in the Recovery Services vault 
ms.topic: conceptual
ms.date: 03/05/2020
---

# About Azure file share backup

Azure file share backup is a native, cloud based backup solution that protects your data in the cloud and eliminates additional maintenance overheads involved in on-premises backup solutions. The Azure Backup service smoothly integrates with Azure file sync, and allows you to centralize your file share data as well as your backups. This simple, reliable, and secure solution enables you to configure protection for your enterprise file shares in few simple steps with an assurance that you can recover your data in case of any disaster scenario.

## Key benefits of Azure file share backup

* **Zero infrastructure**: No deployment is needed to configure protection for your file shares.
* **Customized retention**: You can configure backups with daily/weekly/monthly/yearly retention according to your requirements.
* **Built in management capabilities**: You can schedule backups and specify the desired retention period without the additional overhead of data pruning.
* **Instant restore**: Azure file share backup uses file share snapshots, so you can select just the files you want to restore instantly.
* **Alerting and reporting**: You can configure alerts for backup and restore failures and use the reporting solution provided by Azure Backup to get insights on backups across your files shares.
* **Protection against accidental deletion of file shares**: Azure Backup enables the [soft delete feature](https://docs.microsoft.com/azure/storage/files/storage-files-prevent-file-share-deletion) on a storage account level with a retention period of 14 days. Even if a malicious actor deletes the file share, the file share’s contents and recovery points (snapshots) are retained for a configurable retention period, allowing the successful and complete recovery of source contents and snapshots with no data loss.

## Architecture

![Azure file share backup architecture](./media/azure-file-share-backup-overview/azure-file-shares-backup-architecture.png)

## How the backup process works

1. The first step in configuring backup for Azure File shares is creating a recovery services vault. The vault gives you a consolidated view of the backups configured across different workloads.

2. Once you create a vault, the Azure Backup service discovers the storage accounts that can be registered with the vault. You can select the storage account hosting the file shares you want to protect.

3. After you select the storage account, the Azure Backup service lists the set of file shares present in the storage account and stores their names in the management layer catalog.

4. You then configure the backup policy (schedule and retention) according to your requirements, and select the file shares to back up. The Azure Backup service registers the schedules in the control plane to do scheduled backups.

5. Based on the policy specified, the Azure Backup scheduler triggers backups at the scheduled time. As part of that job, the file share snapshot is created using  the File share API. Only the snapshot URL is stored in the metadata store.

    >[!NOTE]
    >The file share data is not transferred to the Backup service, since the Backup service creates and manages snapshots that are part of your storage account, and backups are not transferred to the vault.

6. You can restore the Azure file share contents (individual files or the full share) from snapshots available on the source file share. Once the operation is triggered, the snapshot URL is retrieved from the metadata store and the data is listed and transferred from the source snapshot to the target file share of your choice.

7. The backup and restore job monitoring data is pushed to the Azure Backup Monitoring service. This allows you to monitor cloud backups for your file shares in a single dashboard. In addition, you can also configure alerts or email notifications when backup health is affected. Emails are sent via the Azure email service.

## Backup costs

Currently you will be charged only for snapshots, since Azure file share backup is a snapshot-based solution. Storage charges incurred for snapshots are billed along with Azure Files Usage according to the pricing details mentioned [here](https://azure.microsoft.com/pricing/details/storage/files/).

## Next steps

* Learn how to [Back up Azure file shares](backup-afs.md)
* Find answers to [Questions about backing up Azure Files](backup-azure-files-faq.md)
