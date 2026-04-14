---
title: About Azure Data Lake Storage Vaulted Backup
description: Learn how the Azure Data Lake Storage vaulted backup works
ms.topic: overview
ms.date: 11/18/2025
author: AbhishekMallick-MS
ms.author: v-mallicka
ms.custom: engagement-fy24
# Customer intent: As a data engineer, I want to understand the backup aspects before configuring backups for Azure Data Lake Storage, so that I can ensure reliable data protection and restore capabilities for my storage accounts.
--- 

# About Azure Data Lake Storage vaulted backup

[Azure Data Lake Storage](/azure/storage/blobs/data-lake-storage-introduction) vaulted backup is a streamlined, cloud-native solution to back up, and restore general-purpose v2 storage accounts with a [hierarchical namespace](/azure/storage/blobs/data-lake-storage-namespace). It allows selective backup and restoration of containers, and store backups in a dedicated vault for granular control.

Azure Backup now enables enhanced protection and recovery for Azure Data Lake Storage through vaulted backups that offer ransomware resilience, secure offsite storage, and long-term data retention. See the [Microsoft Community Hub blog](https://techcommunity.microsoft.com/blog/azurestorageblog/protect-azure-data-lake-storage-with-vaulted-backups/4410707).

For more insights on Azure Backup’s support for vaulted backups in Azure Data Lake Storage that enables secure, long-term, and isolated data protection, see the [Microsoft Community Hub blog](https://azure.microsoft.com/updates?id=488835).

>[!Note]
>This feature is currently available in specific regions only. See the [supported regions](azure-data-lake-storage-backup-support-matrix.md#supported-regions).

## How the backup process for Azure Data Lake Storage works

Vaulted backup uses platform capabilities such as snapshots and object replication to copy data to the Backup vault. Object replication asynchronously copies block blobs from a source storage account to a destination backup storage account, including the blob's contents, versions, metadata, and properties.  

When you configure protection, Azure Backup sets up a destination storage account within the Backup vault and applies an object replication policy at the container level for both source and destination accounts. During backup, Azure Backup places a recovery point marker on the source account and tracks its replication. After the marker is replicated to the destination, the recovery point is created. Backup may take a minimum of 30–40 minutes, as backups rely on snapshots, and are taken in every 15 minutes and require two snapshots to detect changes before triggering the backup.

*The following diagram shows the recovery point creation process after the snapshot is taken:*

:::image type="content" source="./media/azure-data-lake-storage-backup-overview/recovery-point-creation-architecture.png" alt-text="Diagram shows the recovery point creation process in the backup flow."::: 

Learn about the [supported scenarios and limitations for Azure Data Lake Storage backup](azure-data-lake-storage-backup-support-matrix.md).

## Azure Data Lake Storage backup configuration and retention

The Azure Data Lake Storage backup requires a Backup vault that provides a centralized view of configured backups. Vaulted backup is set at the storage account level, with the option to exclude containers. 
>[!Note]
>The maximum number of containers in a storage account that can be protected is 100.  If an account has over 100 containers, reduce the count to **<= 100**. Learn [about the supported container count for backup](azure-data-lake-storage-backup-support-matrix.md#protection-limits).

Backup policies manage schedules and retention, supporting daily or weekly backups and recovery point creation. Retention can be set for daily, weekly, monthly, or yearly backups and can be retained up to **10 years**, with yearly rules taking priority. If no other rules are set, the default retention rule applies.

Azure Backup automatically runs scheduled jobs, replicating block blobs from the source to the destination storage account. It preserves contents, versions, metadata, and properties based on the backup frequency. Backups remain in the vault per policy and are deleted once the retention period ends.

>[!Note]
>- Backup can be enabled for multiple storage accounts in a single vault using one or multiple backup policies.
>- Vaulted backups support long-term retention for up to 10 years.

### Backup management 

After the Azure Data Lake Storage backup configuration is complete, a backup instance is created in the Backup vault. Use it to initiate restores, monitor activity, stop protection, and perform other backup operations.

The Backup vault's managed identity needs specific permissions on storage accounts for backup and restore operations. These permissions are bundled into the **Storage Account Backup Contributor** role for ease of management.

You can assign the role to the Backup vault before/during configuring backup. A managed identity is a service principal exclusive to Azure resources.
Learn more about [managed identities](/azure/active-directory/managed-identities-azure-resources/overview).

### Restoration from backups

You can restore data from any point in time where a recovery point exists. Recovery points are created when a storage account is in a protected state. These recovery points remain available for restoration as long as they fall within the retention period defined by the backup policy. You can do a granular recovery by selecting specific containers, applying a prefix-based filter, or restore the entire storage account.


Azure Backup allows restoring data from any recovery point within the retention period set by the backup policy. Recovery points are created when the storage account is in protected state, and can be used to restore until they expire as per the retention policy. This solution allows performing granular recovery by selecting containers, applying a prefix-based filter, or restoring the full storage account.

>[!Note]
>- Currently, the vaulted backup solution supports restoring data only to a different storage account within the same region as the vault. However, restoring data from older recovery points might result in a longer recovery time (higher [Recovery Time Objective](azure-backup-glossary.md#recovery-time-objective-rto)).

## Next steps

- [Configure vaulted backup for Azure Data Lake Storage using Azure portal, PowerShell, or Azure CLI](azure-data-lake-storage-configure-backup.md).
- [Restore Azure Data Lake Storage using Azure portal](azure-data-lake-storage-restore.md).
- [Manage vaulted backup for Azure Data Lake Storage using Azure portal](azure-data-lake-storage-backup-manage.md).
- [Troubleshoot Azure Data Lake Storage backup](azure-data-lake-storage-backup-troubleshoot.md).