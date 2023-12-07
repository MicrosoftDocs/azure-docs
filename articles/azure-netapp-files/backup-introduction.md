---
title: Understand Azure NetApp Files backup | Microsoft Docs
description: Describes what Azure NetApp Files backup does, supported regions, and the cost model.  
services: azure-netapp-files
documentationcenter: ''
author: b-hchen
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.date: 09/29/2023
ms.author: anfdocs
ms.custom: references_regions
---

# Understand Azure NetApp Files backup

Azure NetApp Files backup expands the data protection capabilities of Azure NetApp Files by providing fully managed backup solution for long-term recovery, archive, and compliance. Backups created by the service are stored in Azure storage, independent of volume snapshots that are available for near-term recovery or cloning. Backups taken by the service can be restored to new Azure NetApp Files volumes within the region. Azure NetApp Files backup supports both policy-based (scheduled) backups and manual (on-demand) backups. For more information, see [How Azure NetApp Files snapshots work](snapshots-introduction.md).

> [!IMPORTANT]
> The Azure NetApp Files backup feature is currently in preview. You need to submit a waitlist request for accessing the feature through the **[Azure NetApp Files Backup Public Preview](https://aka.ms/anfbackuppreviewsignup)** page. The Azure NetApp Files backup feature is expected to be enabled within a week after you submit the waitlist request. You can check the status of feature registration by using the following command: 
>
> ```azurepowershell-interactive
> Get-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFBackupPreview                                                      
> 
> FeatureName      ProviderName     RegistrationState   
> -----------      ------------     -----------------   
> ANFBackupPreview Microsoft.NetApp Registered
> ```

## Supported regions 

Azure NetApp Files backup is supported for the following regions:   

* Australia Central
* Australia Central 2
* Australia East
* Australia Southeast
* Brazil South
* Canada Central
* Canada East
* Central US
* East Asia
* East US
* East US 2
* France Central
* Germany North
* Germany West Central
* Japan East
* Japan West
* Korea Central
* North Central US
* North Europe
* Norway East
* Norway West
* Qatar Central
* South Africa North
* South Central US
* South India
* Southeast Asia
* Sweden Central
* UAE Central
* UAE North
* UK South
* West Europe
* West US
* West US 2
* West US 3

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

When the backup policy is assigned to the volume, the baseline backup to service-managed Azure storage is initiated. When the backup is complete, the baseline backup of 500 GiB will be added to the backup list of the volume. After the baseline transfer, daily backups only back up changed blocks. Assume 5-GiB daily incremental backups added, the total backup storage consumed would be `500GiB + 30*5GiB = 650GiB`.

You'll be billed at the end of month for backup at the rate of $0.05 per month for the total amount of storage consumed by the backup.  That is, 650 GiB with a total monthly backup charge of `650*$0.05=$32.5`. Regular Azure NetApp Files storage capacity applies to local snapshots. For more information, see the [Azure NetApp Files Pricing](https://azure.microsoft.com/pricing/details/netapp/) page.

If you choose to restore a backup of, for example, 600 GiB to a new volume, you'll be charged at the rate of $0.02 per GiB of backup capacity restores. In this case, it will be `600*$0.02 = $12` for the restore operation. 

## Next steps

* [Requirements and considerations for Azure NetApp Files backup](backup-requirements-considerations.md) 
* [Resource limits for Azure NetApp Files](azure-netapp-files-resource-limits.md)
* [Configure policy-based backups](backup-configure-policy-based.md)
* [Configure manual backups](backup-configure-manual.md)
* [Manage backup policies](backup-manage-policies.md)
* [Search backups](backup-search.md)
* [Restore a backup to a new volume](backup-restore-new-volume.md)
* [Disable backup functionality for a volume](backup-disable.md)
* [Delete backups of a volume](backup-delete.md)
* [Volume backup metrics](azure-netapp-files-metrics.md#volume-backup-metrics)
* [Azure NetApp Files backup FAQs](faq-backup.md)
* [How Azure NetApp Files snapshots work](snapshots-introduction.md)


