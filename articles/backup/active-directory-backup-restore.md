---
title: Back up and restore Active Directory 
description: Learn how to back up and restore Active Directory domain controllers.
ms.topic: conceptual
ms.date: 07/08/2020
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Back up and restore Active Directory domain controllers

Backing up Active Directory, and ensuring successful restores in cases of corruption, compromise or disaster is a critical part of Active Directory maintenance.

This article outlines the proper procedures for backing up and restoring Active Directory domain controllers with Azure Backup, whether they're Azure virtual machines or on-premises servers. It discusses a scenario where you need to restore an entire domain controller to its state at the time of backup. To see which restore scenario is appropriate for you, see [this article](/windows-server/identity/ad-ds/manage/forest-recovery-guide/ad-forest-recovery-guide).  

>[!NOTE]
> This article does not discuss restoring items from [Microsoft Entra ID](../active-directory/fundamentals/active-directory-whatis.md). For information on restoring Microsoft Entra users, see [this article](../active-directory/fundamentals/active-directory-users-restore.md).

## Best practices

- Make sure at least one domain controller is backed up. If you back up more than one domain controller, make sure all the ones holding the [FSMO (Flexible Single Master Operation) roles](/windows-server/identity/ad-ds/plan/planning-operations-master-role-placement) are backed up.

- Back up Active Directory frequently. The backup age should never be older than the tombstone lifetime (TSL) because objects older than the TSL will be "tombstoned" and no longer considered valid.
  - The default TSL, for domains built on Windows Server 2003 SP2 and later, is 180 days.
  - You can verify the configured TSL by using the following PowerShell script:

    ```powershell
    (Get-ADObject $('CN=Directory Service,CN=Windows NT,CN=Services,{0}' -f (Get-ADRootDSE).configurationNamingContext) -Properties tombstoneLifetime).tombstoneLifetime
    ```

- Have a clear disaster recovery plan that includes instructions on how to restore your domain controllers. To prepare for restoring an Active Directory forest, read the [Active Directory Forest Recovery Guide](/windows-server/identity/ad-ds/manage/ad-forest-recovery-guide).

- If you need to restore a domain controller, and have a remaining functioning domain controller in the domain, you can make a new server instead of restoring from backup. Add the **Active Directory Domain Services** server role to the new server to make it a domain controller in the existing domain. Then the Active Directory data will replicate to the new server. To remove the previous domain controller from Active Directory, follow the steps [in this article](/windows-server/identity/ad-ds/deploy/ad-ds-metadata-cleanup) to perform metadata cleanup.

>[!NOTE]
>Azure Backup does not include item level restore for Active Directory. If you wish to restore deleted objects, and you can access a domain controller, use the [Active Directory Recycle Bin](/windows-server/identity/ad-ds/get-started/adac/introduction-to-active-directory-administrative-center-enhancements--level-100-#ad_recycle_bin_mgmt). If that method is not available, you can use your domain controller backup to restore the deleted objects with the **ntdsutil.exe** tool as explained [here](https://support.microsoft.com/help/840001/how-to-restore-deleted-user-accounts-and-their-group-memberships-in-ac).
>
>For information about performing an authoritative restore of SYSVOL, see [this article](/windows-server/identity/ad-ds/manage/ad-forest-recovery-authoritative-recovery-sysvol).

## Backing up Azure VM domain controllers

If the domain controller is an Azure VM, you can back up the server using [Azure VM Backup](backup-azure-vms-introduction.md).

Read about [operational considerations for virtualized domain controllers](/windows-server/identity/ad-ds/get-started/virtual-dc/virtualized-domain-controllers-hyper-v#operational-considerations-for-virtualized-domain-controllers) to ensure successful backups (and future restores) of your Azure VM domain controllers.

## Backing up on-premises domain controllers

To back up an on-premises domain controller, you need to back up the server's System State data.

- If you're using MARS, follow [these instructions](backup-azure-system-state.md).
- If you're using MABS (Azure Backup Server), follow [these instructions](backup-mabs-system-state-and-bmr.md).

>[!NOTE]
> Restoring on-premises domain controllers (either from system state or from VMs) to the Azure cloud is not supported. If you would like the option of failover from an on-premises Active Directory environment to Azure, consider using [Azure Site Recovery](../site-recovery/site-recovery-active-directory.md).

## Restoring Active Directory

Active Directory data can be restored in one of two modes: **authoritative** or **nonauthoritative**. In an authoritative restore, the restored Active Directory data will override the data found on the other domain controllers in the forest.

However, in this scenario we're rebuilding a domain controller in an existing domain, so a **nonauthoritative** restore should be performed.

During the restore, the server will be started in Directory Services Restore Mode (DSRM). You'll need to provide the Administrator password for Directory Services Restore Mode.

>[!NOTE]
>If the DSRM password is forgotten, you can reset it using [these instructions](/previous-versions/windows/it-pro/windows-server-2012-r2-and-2012/cc754363(v=ws.11)).

### Restoring Azure VM domain controllers

To restore an Azure VM domain controller, see [Restore domain controller VMs](backup-azure-arm-restore-vms.md#restore-domain-controller-vms).

If you're restoring a single domain controller VM or multiple domain controller VMs in a single domain, restore them like any other VM. Directory Services Restore Mode (DSRM) is also available, so all Active Directory recovery scenarios are viable.

If you need to restore a single domain controller VM in a multiple domain configuration, restore the disks and create a VM [by using PowerShell](backup-azure-vms-automation.md#restore-the-disks).

If you're restoring the last remaining domain controller in the domain, or restoring multiple domains in one forest, we recommend a [forest recovery](/windows-server/identity/ad-ds/manage/ad-forest-recovery-single-domain-in-multidomain-recovery).

>[!NOTE]
> Virtualized domain controllers, from Windows 2012 onwards use [virtualization based safeguards](/windows-server/identity/ad-ds/introduction-to-active-directory-domain-services-ad-ds-virtualization-level-100#virtualization-based-safeguards). With these safeguards, Active directory understands if the VM restored is a domain controller, and performs the necessary steps to restore the Active Directory data.

### Restoring on-premises domain controllers

To restore an on-premises domain controller, follow the directions in for restoring system state to Windows Server, using the guidance for [special considerations for system state recovery on a domain controller](backup-azure-restore-system-state.md#special-considerations-for-system-state-recovery-on-a-domain-controller).

## Next steps

- [Support matrix for Azure Backup](backup-support-matrix.md)
