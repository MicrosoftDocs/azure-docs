---
title: About Azure Data Lake Storage Gen 2 vaulted backup (preview)
description: Learn how the Azure Data Lake Storage Gen2 vaulted backup works
ms.topic: overview
ms.date: 04/16/2025
author: jyothisuri
ms.author: jsuri
ms.custom: engagement-fy24
--- 

# About Azure Data Lake Storage Gen 2 vaulted backup (preview)

[Azure Data Lake Storage (ADLS)](/azure/storage/blobs/data-lake-storage-introduction) vaulted backup is a simple, cloud-native process you can use to back up and restore your general-purpose v2 storage accounts with a [hierarchical namespace](/azure/storage/blobs/data-lake-storage-namespace). The solution gives you granular control to choose all or specific containers to back up or restore by storing backups in backup vault.

>[!Note]
>- This feature is currently in limited preview and is available in specific regions only. See the [supported regions](azure-data-lake-storage-backup-support-matrix.md#supported-regions).
>- To enroll in this preview feature, fill [this form](https://forms.office.com/r/sixidTkYb4)  and write to [AskAzureBackupTeam@microsoft.com](mailto:AskAzureBackupTeam@microsoft.com).

## How does Azure Data Lake Storage Gen2 backup work?

Vaulted backup leverages platform capabilities like snapshots and object replication to copy data to the Backup vault. Object replication asynchronously copies block blobs from a source storage account to a destination backup storage account, including the blob's contents, versions, metadata, and properties.  

When you configure protection, Azure Backup provisions a destination storage account (managed by Azure Backup within the Backup vault) and establishes an object replication policy at the container level on both the source and destination storage accounts. During a backup job, Azure Backup creates a recovery point marker on the source storage account and monitors the destination for its replication. Once the marker is replicated to the destination, a recovery point is created.

*The following diagram shows the recovery point creation process after the snapshot is taken:*

:::image type="content" source="./media/azure-data-lake-storage-backup-overview/recovery-point-creation-architecture.png" alt-text="Diagram shows the recovery point creation process in the backup flow."::: 

Learn about the [supported scenarios and limitations for Azure Data Lake Storage Gen 2 backup](azure-data-lake-storage-backup-support-matrix.md).

## Protection

To configure backups for ADLS, you first need to create a Backup vault. The vault gives you a consolidated view of the backups that are configured across different datasources. Vaulted backup is configured at the storage account level, but you have the option to exclude containers that don't require backup. If your storage account has more than 100 containers, you must exclude containers to reduce the count to 100 or below.

Backup schedules and retention settings are managed using a backup policy. You can configure backups to run daily or weekly and specify the timing for creating recovery points. Additionally, you can set different retention periods for backups taken on a daily, weekly, monthly, or yearly basis for up to 10 years. Retention rules are applied in a specific order of priority, with yearly rules taking precedence over monthly and weekly rules. If no other rules apply, default retention settings are used.

Azure backup automatically triggers a scheduled backup job. Object replication asynchronously copies block blobs from a source storage account to a destination backup storage account, including the blob's contents, versions, metadata, and properties as per the backup frequency. The backups are retained in the vault as per the retention duration defined in the backup policy and are deleted once the duration is over.

You can enable backup for multiple storage accounts in single vault using single or multiple backup policies. Vaulted backups provide long-term data retention for up to 10 years.

### Manage backup

When the backup configuration for an ADLS is finished, a backup instance is created in the Backup vault. You can perform any backup-related operations, such as initiating restores, monitoring, stopping protection, and so on, through its corresponding backup instance.

To configure backup of ADLS and to restore it to an earlier backup, the Backup vault's managed identity requires certain permissions on the storage accounts that need to be protected or restored to. For convenience of use, these minimum permissions have been consolidated under the Storage Account Backup Contributor role.

We recommend you assign this role to the Backup vault before you configure backup. However, you can also perform the role assignment while configuring backup. A managed identity is a special type of service principle that can be used only with Azure resources. Learn more about [managed identities](/azure/active-directory/managed-identities-azure-resources/overview).

### Restore

You can restore data from any point in time where a recovery point exists. Recovery points are created when a storage account is in a protected state and remain available for restoration as long as they fall within the retention period defined by the backup policy. You can choose to perform a granular recovery by selecting specific containers, applying a prefix-based filter, or restore the entire storage account.

If you want to restore the recovery point to different subscription, then at present that also needs to be allowlisted by Azure backup team. You can use the same sign-up form to request this.

Currently, the vaulted backup solution supports restoring data only to a different storage account within the same region as the vault. However, restoring data from older recovery points may result in a longer recovery time (higher RTO).

## Next steps

- [Configure vaulted backup for Azure Data Lake Storage Gen 2 using Azure portal (preview)](azure-data-lake-storage-configure-backup.md).
- [Restore Azure Data Lake Storage Gen  2 using Azure portal (preview)](azure-data-lake-storage-restore.md).