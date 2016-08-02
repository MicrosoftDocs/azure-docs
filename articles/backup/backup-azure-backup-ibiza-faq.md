<properties
   pageTitle="Public preview release of Azure Backup FAQ | Microsoft Azure"
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
	 ms.date="07/01/2016"
	 ms.author="trinadhk; markgal; jimpark;"/>

# Public Preview release of Azure Backup service- FAQ

> [AZURE.SELECTOR]
- [Backup FAQ for Classic mode](backup-azure-backup-faq.md)
- [Backup FAQ for ARM mode](backup-azure-backup-ibiza-faq.md)

This article provides information specific to the Azure Backup service Public Preview release. This article is updated when new frequently-asked questions arrive, and it supplements the [Azure Backup FAQ](backup-azure-backup-faq). The Azure Backup FAQ provides the full set of questions and answers about the Azure Backup service.  

You can ask questions about Azure Backup in the Disqus section of this article or a related article. You can also post questions about the Azure Backup service in the [discussion forum](https://social.msdn.microsoft.com/forums/azure/home?forum=windowsazureonlinebackup).

## What's in the Public Preview release?
The Public Preview release introduces the Recovery Services vault and ARM support when protecting Azure VMs. The Recovery Services vault is the next generation of vaults. It is the vault used by the Azure Backup and the Azure Site Recovery(ASR) services. Think of it as the v.2 vault.

## Recovery Services and Backup vaults

**Q1. Recovery Services vaults are v.2, are Backup vaults (v.1) still supported?** <br/>
A1. Yes, Backup vaults are still supported. Create Backup vaults in the Classic portal. Create Recovery Services vaults in the Azure portal.

**Q2. Can I migrate a Backup vault to a Recovery Services vault?** <br/>
A2. Unfortunately no, at this time you can't migrate the contents of a Backup vault to a Recovery Services vault. We are working on adding this functionality, but it is not available as part of Public Preview.

**Q3. Do Recovery Services vaults support v.1 or v.2 VMs?** <br/>
 A3. Recovery Services vaults support v.1 and v.2 VMs. You can back up a VM created in the Classic portal (which is V.1), or a VM created in the Azure portal (which is V.2) to a Recovery Services vault.


## ARM support for Azure VMs

**Q1. Are there any limitations with ARM support for Azure VMs?** <br/>
A1. The PowerShell cmdlets for ARM are currently not available. You must use the Azure portal UI to add resources to a resource group.
