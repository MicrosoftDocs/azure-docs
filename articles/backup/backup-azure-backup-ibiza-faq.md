<properties
   pageTitle="Recovery Services vault FAQ | Microsoft Azure"
   description="This version of the FAQ supports the Public Preview release of the Azure Backup service. Answers to frequently asked questions about the backup agent, backup and retention, recovery, security and other common questions about the Azure Backup solution."
   services="backup"
   documentationCenter=""
   authors="markgalioto"
   manager="jwhit"
   editor=""
   keywords="backup solution; backup service"/>

<tags
   ms.service="backup"
   ms.workload="storage-backup-recovery"
	 ms.tgt_pltfrm="na"
	 ms.devlang="na"
	 ms.topic="get-started-article"
	 ms.date="08/21/2016"
	 ms.author="trinadhk; markgal; jimpark;"/>

# Public Preview release of Azure Backup service- FAQ

> [AZURE.SELECTOR]
- [Backup FAQ for Classic mode](backup-azure-backup-faq.md)
- [Backup FAQ for Resource Manager mode](backup-azure-backup-ibiza-faq.md)

This article provides information specific to Recovery Services vault and it supplements the [Azure Backup FAQ](backup-azure-backup-faq). The Azure Backup FAQ provides the full set of questions and answers about the Azure Backup service.  

You can ask questions about Azure Backup in the Disqus section of this article or a related article. You can also post questions about the Azure Backup service in the [discussion forum](https://social.msdn.microsoft.com/forums/azure/home?forum=windowsazureonlinebackup).

## Recovery Services vaults are v.2, are Backup vaults (v.1) still supported? <br/>
Yes, Backup vaults are still supported. Create Backup vaults in the [Classic portal](https://manage.windowsazure.com). Create Recovery Services vaults in the [Azure portal](https://portal.azure.com). However we strongly recommend you to create recovery services vault as all future enhancements will be available only in Recovery Services vault. 

## Can I migrate a Backup vault to a Recovery Services vault? <br/>
Unfortunately no, at this time you can't migrate the contents of a Backup vault to a Recovery Services vault. We are working on adding this functionality, but it is not available as part of Public Preview.

## Do Recovery Services vaults support v.1 or v.2 VMs? <br/>
Recovery Services vaults support v.1 and v.2 VMs. You can back up a VM created in the Classic portal (which is V.1), or a VM created in the Azure portal (which is V.2) to a Recovery Services vault.

## I have backed up my classic VMs in backup vault. Now I want migrate my VMs from classic mode to Resource Manager mode.  How Can I backup them in recovery services vault?
Backups of classic VMs in backup vault won't migrate automatically to recovery services vault when you migrate the VMs from classic to resource manager mode. Please follow these steps for migration of VM backups:

1. In backup vault, go to **Protected Items** tab and select the VM. Click on [Stop Protection](backup-azure-manage-vms-classic.md#stop-protecting-virtual-machines). Leave *Delete associated backup data* option **unchecked**. 
2. Migrate the virtual machine from classic mode to resource manager mode. Make sure that storage and network corresponding to virtual machine are also migrated to resource manager mode. 
3. Create a recovery services vault and configure backup on the migrated virtual machine using **Backup** action on top of vault dashboard. Learn More on how to [enable backup in recovery services vault](backup-azure-vms-first-look-arm.md)
