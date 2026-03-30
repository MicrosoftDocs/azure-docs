---
title: Back up and restore Active Directory using Azure Backup 
description: Learn how to back up and restore Active Directory domain controllers for Azure VM and on-premises servers using Azure Backup.
ms.topic: how-to
ms.date: 08/25/2025
author: AbhishekMallick-MS
ms.author: v-mallicka
ms.custom: engagement-fy24
# Customer intent: "As an IT administrator, I want to back up and restore Active Directory domain controllers, so that I can ensure data integrity and availability during corruption or disaster scenarios."
---

# Back up and restore Active Directory domain controllers using Azure Backup

This article describes how to back up and restore Active Directory domain controllers using Azure Backup, either running on Azure virtual machines (VMs) or on-premises servers. You can use the recommended procedures to protect your Active Directory environment and recover domain controllers during corruption, compromise, or disaster. For guidance on choosing the right restore scenario for your needs, see [the Active Directory Forest Recovery Guide](/windows-server/identity/ad-ds/manage/forest-recovery-guide/ad-forest-recovery-guide).

>[!NOTE]
> This article doesn't discuss restoring items from [Microsoft Entra ID](../active-directory/fundamentals/active-directory-whatis.md). For information on restoring Microsoft Entra users, see [this article](../active-directory/fundamentals/active-directory-users-restore.md).

## Best practices

Before you start protection of Active Directory, check the following best practices:

- Make sure at least one domain controller is backed up.

- Back up Active Directory frequently. The backup age mustn't be older than the tombstone lifetime (TSL) because objects older than the TSL is *tombstoned* and no longer considered valid.
  - The default TSL, for domains built on Windows Server 2003 SP2 and later, is 180 days.
  - You can verify the configured TSL by using the following PowerShell script:

    ```powershell
    (Get-ADObject $('CN=Directory Service,CN=Windows NT,CN=Services,{0}' -f (Get-ADRootDSE).configurationNamingContext) -Properties tombstoneLifetime).tombstoneLifetime
    ```

- Have a clear disaster recovery plan that includes instructions on how to restore your domain controllers. To prepare for restoring an Active Directory forest, read the [Active Directory Forest Recovery Guide](/windows-server/identity/ad-ds/manage/ad-forest-recovery-guide).

- If you need to restore a domain controller, and have a remaining functioning domain controller in the domain, you can make a new server instead of restoring from backup. Add the **Active Directory Domain Services** server role to the new server to make it a domain controller in the existing domain. Then the Active Directory data replicates to the new server. To remove the previous domain controller from Active Directory, follow the steps [in this article](/windows-server/identity/ad-ds/deploy/ad-ds-metadata-cleanup) to perform metadata cleanup.

>[!NOTE]
>Azure Backup doesn't include item level restore for Active Directory. If you wish to restore deleted objects, and you can access a domain controller, use the [Active Directory Recycle Bin](/windows-server/identity/ad-ds/get-started/adac/introduction-to-active-directory-administrative-center-enhancements--level-100-#ad_recycle_bin_mgmt). If that method isn't available, you can use your domain controller backup to restore the deleted objects with the **ntdsutil.exe** tool as explained [here](https://support.microsoft.com/help/840001/how-to-restore-deleted-user-accounts-and-their-group-memberships-in-ac).
>
>For information about performing an authoritative restore of SYSVOL, see [this article](/windows-server/identity/ad-ds/manage/ad-forest-recovery-authoritative-recovery-sysvol).

## Back up domain controllers

You can back up domain controllers using Azure Backup. This operation allows you to protect your Active Directory environment and ensure that you can recover from any potential issues.

**Choose a domain controller environment**:

# [Azure VM](#tab/azure-vm)

If the domain controller is an Azure VM, you can back up the server using [Azure VM Backup](backup-azure-vms-introduction.md).

Read about [operational considerations for virtualized domain controllers](/windows-server/identity/ad-ds/get-started/virtual-dc/virtualized-domain-controllers-hyper-v#operational-considerations-for-virtualized-domain-controllers) to ensure successful backups (and future restores) of your Azure VM domain controllers.

# [On-premises](#tab/on-premises)

To back up an on-premises domain controller, you need to back up the server's System State data.

- If you're using MARS, follow [these instructions](backup-azure-system-state.md).
- If you're using Microsoft Azure Backup Server (MABS), follow [these instructions](backup-mabs-system-state-and-bmr.md).

>[!NOTE]
> On-premises domain controllers restore (either from system state or from VMs) to the Azure cloud isn't supported. If you would like the option of failover from an on-premises Active Directory environment to Azure, consider using [Azure Site Recovery](../site-recovery/site-recovery-active-directory.md).

---


## Restore Active Directory

When restoring Active Directory data, you can choose one of the following modes:

- **Authoritative restore**: The restored data replaces the data on all other domain controllers in the forest. Use this mode if you need to recover deleted objects and ensure they're replicated across your environment.
- **Nonauthoritative restore**: The restored domain controller receives updates from other domain controllers after recovery. This is the recommended approach when rebuilding a domain controller in an existing domain.

For most scenarios, including rebuilding a domain controller, you should perform a **nonauthoritative restore**.

During the restore, the server is started in Directory Services Restore Mode (DSRM). You need to provide the Administrator password for Directory Services Restore Mode.

>[!NOTE]
>If you forget the DSRM password, [reset it](/previous-versions/windows/it-pro/windows-server-2012-r2-and-2012/cc754363(v=ws.11)).

**Choose a domain controller environment for restore**:

# [Azure VM](#tab/azure-vm)


To restore an Azure VM domain controller, see [Restore domain controller VMs](backup-azure-arm-restore-vms.md#restore-domain-controller-vms).

If you're restoring a single domain controller VM or multiple domain controller VMs in a single domain, restore them like any other VM. Directory Services Restore Mode (DSRM) is also available, so all Active Directory recovery scenarios are viable.

If you need to restore a single domain controller VM in a multiple domain configuration, restore the disks and create a VM [by using PowerShell](backup-azure-vms-automation.md#restore-the-disks).

If you're restoring the last remaining domain controller in the domain, or restoring multiple domains in one forest, we recommend a [forest recovery](/windows-server/identity/ad-ds/manage/ad-forest-recovery-single-domain-in-multidomain-recovery).

>[!NOTE]
> Virtualized domain controllers, from Windows 2012 onwards use [virtualization based safeguards](/windows-server/identity/ad-ds/introduction-to-active-directory-domain-services-ad-ds-virtualization-level-100#virtualization-based-safeguards). With these safeguards, Active directory understands if the VM restored is a domain controller, and performs the necessary steps to restore the Active Directory data.

# [On-premises](#tab/on-premises)

To restore an on-premises domain controller, follow the directions in for restoring system state to Windows Server, using the guidance for [special considerations for system state recovery on a domain controller](backup-azure-restore-system-state.md#special-considerations-for-system-state-recovery-on-a-domain-controller).

---

## Next steps

- [Support matrix for Azure Backup](backup-support-matrix.md)
