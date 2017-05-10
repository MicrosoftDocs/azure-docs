---
title: Overview of Recovery Services vaults | Microsoft Docs
description: An overview and comparison between Recovery Services vaults and Backup vaults.
services: backup
documentationcenter: ' '
author: markgalioto
manager: carmonm

ms.assetid: 38d4078b-ebc8-41ff-9bc8-47acf256dc80
ms.service: backup
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 05/09/2017
ms.author: markgal;arunak

---
# Recovery Service vaults

This article describes the features of a Recovery Services vault. A Recovery Services vault is a storage entity in Azure that houses data. The data is typically copies of data or configuration information for your virtual machines (VMs), workloads, servers or workstations. A Recovery Services vault is the Resource Manager version, or updated version, of a Backup vault. Microsoft encourages you to use Recovery Services vaults, and to convert any Backup vaults to Recovery Services vaults.

## What is a Recovery Services vault?

A Recovery Services vault is an entity that stores all the backups and recovery points you create over time. The Recovery Services vault also contains the backup policy applied to the protected files and folders.

## Managing your backup and restores using Recovery Services vaults
Point to articles explaining how to backup:
- files and folders
- VMs
- other

[Managing articles](backup-azure-manage-windows-server.md)

Securing cloud backup data in Recovery Services vaults

## Comparing Recovery Services vaults and Backup vaults

Recovery Services vaults are based on the Azure Resource Manager model of Azure, where as Backup vaults are based on the Azure Service Manager model. When you upgrade a Backup vault to a Recovery Services vault, the backup data remains intact during and after the upgrade process. Recovery Services vaults use features in Azure not available for Backup vaults such as

- **Enhanced capabilities to help secure backup data**: With Recovery Services vaults, Azure Backup provides security capabilities to protect cloud backups. These security features ensure that you can secure your backups, and safely recover data from cloud backups even if production and backup servers are compromised. [Learn more](backup-azure-security-feature.md)

- **Central monitoring for your hybrid IT environment**: With Recovery Services vaults, you can monitor not only your [Azure IaaS VMs](backup-azure-manage-vms.md) but also your [on-premises assets](backup-azure-manage-windows-server.md#manage-backup-items) from a central portal. [Learn more](http://azure.microsoft.com/blog/alerting-and-monitoring-for-azure-backup)

- **Role-Based Access Control (RBAC)**: RBAC provides fine-grained access management control in Azure. [Azure provides a number of built-in roles](../active-directory/role-based-access-built-in-roles.md), and Azure Backup has three [built-in roles to manage recovery points](backup-rbac-rs-vault.md). : Recovery Services vaults are based on the Azure Resource Manager model and bring you the benefits of RBAC which restricts backup and restore access to the defined set of user roles. [Learn more](backup-rbac-rs-vault.md)

- **Protect all configurations of Azure Virtual Machines**: Recovery Services vaults protect Resource Manager-based VMs including Premium Disks, Managed Disks and Encrypted VMs. Upgrading a Backup vault to a Recovery Services vault give you the opportunity to upgrade your Service Manager-based VMs to Resource Manager-based VMs. Though you are upgrading the vault, you can retain your Service Manager-based VM recovery points as well as configure protection for the upgraded (Resource Manager-enabled) VMs in the same vault. [Learn more](http://azure.microsoft.com/blog/azure-backup-recovery-services-vault-ga)

- **Instant restore for IaaS VMs**: Using Recovery Services vaults, you can restore files and folders from an IaaS VM without restoring the entire VM, which enables faster restore times. Instant restore for IaaS VMs is available for both Windows and Linux VMs. [Learn more](http://azure.microsoft.com/blog/instant-file-recovery-from-azure-linux-vm-backup-using-azure-backup-preview)

## Next Steps
See the article for:
[Back up an IaaS VM](backup-azure-arm-vms-prepare.md)
[Back up an Azure Backup Server](backup-azure-microsoft-azure-backup.md)
[Back up a Windows Server](backup-configure-vault.md)
