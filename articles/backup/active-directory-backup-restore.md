---
title: Back up and restore Active Directory 
description: Learn how to back up and restore Active Directory domain controllers.
ms.topic: conceptual
ms.date: 07/08/2020
---

# Back up and restore Active Directory

Backing up Active Directory, and ensuring successful restores in cases of corruption, compromise or disaster is a critical part of Active Directory maintenance.

This article will outline the proper procedures for backing up and restoring Active Directory domain controllers with Azure Backup, whether they Azure virtual machines or on-premises servers. It discusses the scenario where all Active Directory data needs to be restored, because there are no functioning domain controllers left in the forest.

>[!NOTE]
> This article does not discuss restoring items from [Azure Active Directory](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-whatis). For information on restoring Azure Active Directory users, see [this article](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-users-restore).

## Best practices

- Make sure at least one domain controller is backed up. If you back up more than one domain controller, make sure all the ones holding the [FSMO (Flexible Single Master Operation) roles](https://docs.microsoft.com/windows-server/identity/ad-ds/plan/planning-operations-master-role-placement) are backed up.

- Back up Active Directory frequently. The backup should never be more than the tombstone period (by default 60 days), because objects older than the tombstone period will be "tombstoned" and no longer considered valid.

- Have a clear disaster recovery plan that includes instructions on how to restore your domain controllers. To prepare for restoring an Active Directory forest, read the [Active Directory Forest Recovery Guide](https://docs.microsoft.com/windows-server/identity/ad-ds/manage/ad-forest-recovery-guide).

- Only use backups to restore all of Active Directory if none of the domain controllers in the domain are functioning. If you have a functioning domain controller, you should make a new server, add the **Active Directory Domain Services** server role to make it a domain controller in the existing domain. Then the Active Directory data will replicate to the new server.

>[!NOTE]
>Azure Backup does not include item level restore for Active Directory. If you wish to restore deleted objects, and you can access a domain controller, use the [Active Directory Recycle Bin](https://docs.microsoft.com/windows-server/identity/ad-ds/get-started/adac/introduction-to-active-directory-administrative-center-enhancements--level-100-#ad_recycle_bin_mgmt). If that method is not available, you can use the **ndtdsutil.exe** tool as explained [here](https://support.microsoft.com/help/840001/how-to-restore-deleted-user-accounts-and-their-group-memberships-in-ac).
>
>For information about performing an authoritative restore of SYSVOL, see [this article](https://docs.microsoft.com/windows-server/identity/ad-ds/manage/ad-forest-recovery-authoritative-recovery-sysvol).

## Backing up Azure VM domain controllers

If the domain controller is an Azure VM, you can back up the server using [Azure VM Backup](backup-azure-vms-introduction.md).

Read about [operational considerations for virtualized domain controllers](https://docs.microsoft.com/windows-server/identity/ad-ds/get-started/virtual-dc/virtualized-domain-controllers-hyper-v#operational-considerations-for-virtualized-domain-controllers) to ensure successful backups (and future restores) of your Azure VM domain controllers.

## Backing up on-premises domain controllers

To back up an on-premises domain controller, you need to back up the server's System State data.

- If you're using MARS, follow [these instructions](backup-azure-system-state.md).
- If you're using MABS (Azure Backup Server), follow [these instructions](backup-mabs-system-state-and-bmr.md).

>[!NOTE]
> Restoring on-premises domain controllers (either from system state or from VMs) to the Azure cloud is not supported. If you would like the option of failover from an on-premises Active Directory environment to Azure, consider using [Azure Site Recovery](https://docs.microsoft.com/azure/site-recovery/site-recovery-active-directory).

## Restoring Active Directory

Active Directory data can be restored in one of two modes: **authoritative** or **nonauthoritative**. In an authoritative restore, the restored Active Directory data will override the data found on the other domain controllers in the forest.

However, in our scenario there are no functioning domain controllers in the forest, so a **nonauthoritative** restore should be performed.

During the restore, the server will be started in Directory Services Restore Mode (DSRM). You'll need to provide the Administrator password for Directory Services Restore Mode.

>[!NOTE]
>If the DSRM password is forgotten, you can reset it using [these instructions](https://docs.microsoft.com/previous-versions/windows/it-pro/windows-server-2012-r2-and-2012/cc754363(v=ws.11)).

### Restoring Azure VM domain controllers

To restore an Azure VM domain controller, see [How to restore Azure VM data in Azure portal](backup-azure-arm-restore-vms.md).

If you're restoring a single domain controller VM or multiple domain controller VMs in a single domain, restore the VMs like any other. Directory Services Restore Mode (DSRM) is also available, so all Active Directory recovery scenarios are viable.

If it's the last remaining domain controller in the domain, or a recovery in an isolated network is performed, use a [forest recovery](https://docs.microsoft.com/windows-server/identity/ad-ds/manage/ad-forest-recovery-single-domain-in-multidomain-recovery).

If you need to restore multiple domains in one forest, we recommend a [forest recovery](https://docs.microsoft.com/windows-server/identity/ad-ds/manage/ad-forest-recovery-single-domain-in-multidomain-recovery).

### Restoring on-premises domain controllers

To restore an on-premises domain controller, follow the directions in for restoring system state to Windows Server, using the guidance for [special considerations for system state recovery on a domain controller](backup-azure-restore-system-state.md##special-considerations-for-system-state-recovery-on-a-domain-controller).

## Next steps

- [Support matrix for Azure Backup](backup-support-matrix.md)
