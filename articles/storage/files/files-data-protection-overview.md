---
title: Data protection overview for Azure Files
description: Learn how to protect your data in Azure Files. Understand the concepts and processes involved with backup and recovery of Azure file shares.
author: khdownie
ms.service: azure-file-storage
ms.topic: conceptual
ms.date: 07/26/2023
ms.author: kendownie
---

# Azure Files data protection overview

Azure Files gives you many tools to protect your data, including soft delete, share snapshots, Azure Backup, and Azure File Sync. This article describes how to protect your data in Azure Files, and the concepts and processes involved with backup and recovery of Azure file shares.

:::row:::
    :::column:::
        > [!VIDEO https://www.youtube.com/embed/TOHaNJpAOfc]
    :::column-end:::
    :::column:::
        Watch this video to learn how Azure Files advanced data protection helps enterprises stay protected against ransomware and accidental data loss while delivering greater business continuity.
   :::column-end:::
:::row-end:::

## Why you should protect your data

For Azure Files, data protection refers to protecting the storage account, file shares, and data within them from being deleted or modified, and for restoring data after it's been deleted or modified.

There are several reasons why you should protect your file share data.

- **Recovery from accidental data loss:** Recover data that's accidentally deleted or corrupted.
- **Upgrade scenarios:** Restore to a known good state after a failed upgrade attempt.
- **Ransomware protection:** Recover data without paying ransom to cybercriminals.
- **Long-term retention:** Comply with data retention requirements.
- **Business continuity:** Prepare your infrastructure to be highly available for critical workloads.

## Back up and restore Azure file shares
You can configure [Azure Backup](../../backup/azure-file-share-backup-overview.md?toc=/azure/storage/files/toc.json) to back up your file shares using the Azure portal, Azure PowerShell, Azure CLI, or REST API. You can also [use Azure File Sync](#use-azure-file-sync-for-hybrid-cloud-backups) to back up on-premises file server data on an Azure file share.

# [Azure portal](#tab/portal)

To learn how to back up and restore Azure file shares using the Azure portal, see the following articles:

- [Back up Azure file shares](../../backup/backup-afs.md?toc=/azure/storage/files/toc.json)
- [Restore Azure file shares](../../backup/restore-afs.md?toc=/azure/storage/files/toc.json)
- [Manage Azure file share backups](../../backup/manage-afs-backup.md?toc=/azure/storage/files/toc.json)

# [Azure PowerShell](#tab/powershell)

To learn how to back up and restore Azure file shares using Azure PowerShell, see the following articles:

- [Back up Azure file shares with PowerShell](../../backup/backup-azure-afs-automation.md?toc=/azure/storage/files/toc.json)
- [Restore Azure file shares with PowerShell](../../backup/restore-afs-powershell.md?toc=/azure/storage/files/toc.json)
- [Manage Azure file share backups with PowerShell](../../backup/manage-afs-powershell.md?toc=/azure/storage/files/toc.json)

# [Azure CLI](#tab/cli)

To learn how to back up and restore Azure file shares using Azure CLI, see the following articles:

- [Back up Azure file shares with Azure CLI](../../backup/backup-afs-cli.md?toc=/azure/storage/files/toc.json)
- [Restore Azure file shares with Azure CLI](../../backup/restore-afs-cli.md?toc=/azure/storage/files/toc.json)
- [Manage Azure file share backups with Azure CLI](../../backup/manage-afs-backup-cli.md?toc=/azure/storage/files/toc.json)

# [REST API](#tab/rest)

To learn how to back up and restore Azure file shares using the REST API, see the following articles:

- [Back up Azure file shares with REST API](../../backup/backup-azure-file-share-rest-api.md?toc=/azure/storage/files/toc.json)
- [Restore Azure file shares with REST API](../../backup/restore-azure-file-share-rest-api.md?toc=/azure/storage/files/toc.json)
- [Manage Azure file share backups with REST API](../../backup/manage-azure-file-share-rest-api.md?toc=/azure/storage/files/toc.json)
---

## Data redundancy

Azure Files offers multiple redundancy options, including geo-redundancy, to help protect your data from service outages due to hardware problems or natural disasters. To find out which option is best for your use case, see [Azure Files data redundancy](files-redundancy.md).

> [!IMPORTANT]
> Azure Files only supports geo-redundancy (GRS or GZRS) for standard SMB file shares. Premium file shares and NFS file shares must use locally redundant storage (LRS) or zone redundant storage (ZRS).

## Disaster recovery and failover
In the case of a disaster or unplanned outage, restoring access to file share data is usually critical to keeping the business operational. Depending on the criticality of the data hosted in your file shares, you might need a disaster recovery strategy that includes failing your Azure file shares over to a secondary region.

Azure Files offers customer-managed failover for standard storage accounts if the data center in the primary region becomes unavailable. See [Disaster recovery and failover for Azure Files](files-disaster-recovery.md).

## Prevent accidental deletion of storage accounts and file shares

Data loss doesn't always occur because of a disaster. More often, it's the result of human error. Azure gives you tools to prevent accidental deletion of storage accounts and file shares.

### Storage account locks

Storage account locks enable admins to lock the storage account to prevent users from accidentally deleting the storage account. There are two types of storage account locks:

- **CannotDelete** lock prevents users from deleting a storage account, but permits modifying its configuration.
- **ReadOnly** lock prevents users from deleting a storage account or modifying its configuration.

For more information, see [Apply an Azure Resource Manager lock to a storage account](../common/lock-account-resource.md).

### Soft delete

Soft delete works on a file share level to protect Azure file shares against accidental deletion. If a share with soft delete enabled is deleted, it moves to a soft deleted state internally and can be retrieved until the retention period expires. Azure file shares are still billed on the used capacity when they're soft deleted.

For more information, see [Enable soft delete on Azure file shares](storage-files-enable-soft-delete.md) and [Prevent accidental deletion of Azure file shares](storage-files-prevent-file-share-deletion.md).

## Share snapshots

File share snapshots are point-in-time copies of your Azure file share that you can take manually or automatically via Azure Backup. You can then restore individual files from these snapshots. You can take up to 200 snapshots per file share.

Snapshots are incremental in nature, capturing only the changes since the last snapshot. That means they're space and cost efficient. You're billed on the differential storage utilization of each snapshot, making it practical to have multiple recovery points to cater low RPO requirements.

For more information, see [Overview of share snapshots for Azure Files](storage-snapshots-files.md).

## Use Azure File Sync for hybrid cloud backups

Using Azure File Sync with Azure Backup is an easy solution for hybrid cloud backups from on-premises to cloud. Azure File Sync keeps the files in sync and centralized.

:::image type="content" source="media/files-data-protection-overview/azure-file-sync-with-azure-backup.png" alt-text="Architecture diagram for using Azure File Sync along with Azure Backup to back up multiple file servers." border="false":::

This method simplifies disaster recovery and gives you multiple options. You can recover single files or directories, or perform a rapid restore of your entire file share. Just bring up a new server on the primary and point it to the centralized Azure file share where it can access the data. Over time, files will be locally cached or tiered to the cloud based on Azure File Sync settings.

## See also

- [Azure Files redundancy](files-redundancy.md)
- [Azure Files disaster recovery and failover](files-disaster-recovery.md)
