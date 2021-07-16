---
title: Understand Azure NetApp Files backup | Microsoft Docs
description: Describes what Azure NetApp Files backup does, the cost model, requirements, and considerations.  
services: azure-netapp-files
documentationcenter: ''
author: b-juche
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 08/15/2021
ms.author: b-juche
---
# Understand Azure NetApp Files backup

Azure NetApp Files backup expands the data protection capabilities of Azure NetApp Files by providing fully managed backup solution for long-term recovery, archive, and compliance. Backups created by the service are stored in Azure storage, independent of volume snapshots that are available for near-term recovery or cloning. Backups taken by the service can be restored to new Azure NetApp Files volumes within the region. Azure NetApp Files backup supports both policy-based (scheduled) backups and manual (on-demand) backups.  

> [!IMPORTANT]
> The Azure NetApp Files backup feature is currently in preview. You need to submit a waitlist request for accessing the feature through the **[Azure NetApp Files Backup Public Preview](https://aka.ms/anfbackuppreviewsignup)** page. Wait for an official confirmation email from the Azure NetApp Files team before using the Azure NetApp Files backup feature.

## Cost model for Azure NetApp Files backup

Pricing for Azure NetApp Files backup is based on the total amount of storage consumed by the backup. There are no setup charges or minimum usage fees. 
Backup restore is priced based on the total amount of backup capacity restored during the billing cycle.

### Pricing example

Assume the following situations:

* Your source volume is from the Azure NetApp Files Premium service level. It has a volume quota size of 1000 GiB and a volume consumed size of 500 GiB at the beginning of the first day of a month. The volume is in the US South Central region.
* You’ve configured an hourly snapshot policy with 5 local snapshots to keep, and daily backup policy to keep 30 backup copies.
* For simplicity, assume your source volume has a constant 1% data change every day, but the total volume consumed size does not grow (remains at 500 GiB).

When the backup policy is assigned to the volume, the baseline backup to service-managed Azure storage is initiated. When the backup is complete, the baseline backup of 500 GiB will be added to the backup list of the volume. After the baseline transfer, daily backups only backs up changed blocks. Assume 5-GiB daily incremental backups added, the total backup storage consumed would be `500GiB + 30*5GiB = 650GiB`.

You will be billed at the end of month for backup at the rate of $0.05 per month for the total amount of storage consumed by the backup.  That is, 650 GiB with a total monthly backup charge of `650*$0.05=$32.5`. Regular Azure NetApp Files storage capacity applies to local snapshots. See the [Azure NetApp Files Pricing](https://azure.microsoft.com/pricing/details/netapp/) page for more information.

If you choose to restore a backup of, for example, 600 GiB to a new volume, you will be charged at the rate of $0.02 per GiB of backup capacity restores. In this case, it will be `600*$0.02 = $12` for the restore operation. 

## Requirements and considerations

You need to be aware of several requirements and considerations before using Azure NetApp Files backup: 

* Azure NetApp Files backup is available in the regions associated with your Azure NetApp Files subscription. 
Azure NetApp Files backup in a region can only protect an Azure NetApp Files volume that is located in that same region. For example, backups created by the service in West US 2 for a volume located in West US 2 are sent to Azure storage that is located also in West US 2. Azure NetApp Files does not support backups or backup replication to a different region.  

* There can be a delay up to 5 minutes in displaying a backup after the backup is actually completed.

* Currently, the Azure NetApp Files backup feature supports backing up the daily, weekly, and monthly local snapshots created by the associated snapshot policy to the Azure storage. Hourly backups are not currently supported.

* Azure NetApp Files backup uses the [Zone-Redundant storage](../storage/common/storage-redundancy.md#redundancy-in-the-primary-region) (ZRS) account that replicates the data synchronously across three Azure availability zones in the region, except for the regions listed below where only [Locally Redundant Storage](../storage/common/storage-redundancy.md#redundancy-in-the-primary-region) (LRS) storage is supported:   

    * West US   

    LRS can recover from server-rack and drive failures. However, if a disaster such as a fire or flooding occurs within the data center, all replicas of a storage account using LRS might be lost or unrecoverable. 

* Using policy-based (scheduled) Azure NetApp Files backup requires that snapshot policy is configured and enabled. See [Manage snapshots by using Azure NetApp Files](azure-netapp-files-manage-snapshots.md).   
    The volume that needs to be backed up requires a configured snapshot policy for creating snapshots. The configured number of backups are stored in the Azure storage. 

* If an issue occurs (for example, no sufficient space left on the volume) and causes the snapshot policy to stop creating new snapshots, the backup feature will not have any new snapshots to back up. 

## Next steps

* [Resource limits for Azure NetApp Files](azure-netapp-files-resource-limits.md)
* [Configure policy-based backups](backup-configure-policy-based.md)
* [Configure manual backups](backup-configure-manual.md)
* [Manage backup policies](backup-manage-policies.md)
* [Search backups](backup-search.md)
* [Restore a backup to a new volume](backup-restore-new-volume.md)
* [Disable backup functionality for a volume](backup-disable.md)
* [Delete backups of a volume](backup-delete.md)
* [Volume backup metrics](azure-netapp-files-metrics.md#volume-backup-metrics)
* [Azure NetApp Files backup FAQs](azure-netapp-files-faqs.md#azure-netapp-files-backup-faqs)

