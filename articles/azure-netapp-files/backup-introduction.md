---
title: Understand Azure NetApp Files backup
description: Describes what Azure NetApp Files backup does, supported regions, and the cost model.
services: azure-netapp-files
author: b-hchen
ms.service: azure-netapp-files
ms.topic: concept-article
ms.date: 07/18/2025
ms.author: anfdocs
ms.custom: references_regions
# Customer intent: As a data administrator, I want to understand the capabilities and pricing of the Azure NetApp Files backup service, so that I can effectively implement and manage data protection strategies for long-term recovery and compliance.
---

# Understand Azure NetApp Files backup

Azure NetApp Files backup expands the data protection capabilities of Azure NetApp Files by providing fully managed backup solution for long-term recovery, archive, and compliance. Backups created by the service are stored in Azure storage, independent of volume snapshots that are available for near-term recovery or cloning. Backups taken by the service can be restored to new Azure NetApp Files volumes within the region. Azure NetApp Files backup supports both policy-based (scheduled) backups and manual (on-demand) backups. For more information, see [How Azure NetApp Files snapshots work](snapshots-introduction.md).

## Supported regions 

Azure NetApp Files backup is available in all Azure NetApp Files-enabled regions.

>[!NOTE]
>With Elastic zone-redundant storage, Azure NetApp Files backup is limited to regions that support [Elastic zone-redundant storage](elastic-zone-redundant-concept.md#supported-regions). 

## Backup vault 

Backup vaults are organizational units to manage backups. You must create a backup vault before you can create a backup. 

Although it's possible to create multiple backup vaults in your Azure NetApp Files account, it's recommended you have only one backup vault.

>[!IMPORTANT]
>If you have existing backups on Azure NetApp Files, you must migrate the backups to a backup vault before you can perform any operation with the backup. To learn how to migrate, see [Manage backup vaults](backup-vault-manage.md#migrate-backups-to-a-backup-vault).

## Cost model for Azure NetApp Files backup

Pricing for Azure NetApp Files backup is based on the total amount of storage consumed by the backup. There are no setup charges or minimum usage fees. 

Backup restore is priced based on the total amount of backup capacity restored during the billing cycle.

As a pricing example, assume the following situations:

* Your source volume is from the Azure NetApp Files Premium service level. It has a volume quota size of 1000 GiB and a volume consumed size of 500 GiB at the beginning of the first day of a month. The volume is in the US South Central region.
* For simplicity, assume your source volume has a constant 1% data change every day, but the total volume consumed size doesn't grow (remains at 500 GiB).

When the backup policy is assigned to the volume, the baseline backup to service-managed Azure storage is initiated. When the backup is complete, the baseline backup of 500 GiB is added to the backup list of the volume. After the baseline transfer, daily backups only back up changed blocks. Assume 5-GiB daily incremental backups added, the total backup storage consumed is `500GiB + 30*5GiB = 650GiB`.

You're billed at the end of month for backup at the rate of $0.05 per month for the total amount of storage consumed by the backup. That is, 650 GiB with a total monthly backup charge of `650*$0.05=$32.5`. Regular Azure NetApp Files storage capacity applies to local snapshots. For more information, see the [Azure NetApp Files Pricing](https://azure.microsoft.com/pricing/details/netapp/) page.

If you choose to restore a backup of, for example, 600 GiB to a new volume, you're charged at the rate of $0.02 per GiB of backup capacity restores. In this case, it's `600*$0.02 = $12` for the restore operation. 

## Next steps

* [Requirements and considerations for Azure NetApp Files backup](backup-requirements-considerations.md) 
* [Resource limits for Azure NetApp Files](azure-netapp-files-resource-limits.md)
* [Configure policy-based backups](backup-configure-policy-based.md)
* [Configure manual backups](backup-configure-manual.md)
* [Manage backup policies](backup-manage-policies.md)
* [Search backups](backup-search.md)
* [Restore a backup to a new volume](backup-restore-new-volume.md)
* [Delete backups of a volume](backup-delete.md)
* [Volume backup metrics](azure-netapp-files-metrics.md#volume-backup-metrics)
* [Azure NetApp Files backup FAQs](faq-backup.md)
* [How Azure NetApp Files snapshots work](snapshots-introduction.md)
