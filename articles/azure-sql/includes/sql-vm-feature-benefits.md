---
title: Feature benefits for the SQL Server on Azure VM
description: Feature benefits unlocked by registering your SQL Server on Azure VM with the SQL IaaS agent extension
ms.topic: include
author: MashaMSFT
ms.author: mathoma
ms.reviewer: 
---

| Feature | Description |
| --- | --- |
| **Portal management** | Unlocks [management in the portal](manage-sql-vm-portal.md), so that you can view all of your SQL Server VMs in one place, and so that you can enable and disable SQL specific features directly from the portal. <br/> Management mode: Lightweight & full|  
| **Automated backup** |Automates the scheduling of backups for all databases for either the default instance or a [properly installed](./frequently-asked-questions-faq.yml) named instance of SQL Server on the VM. For more information, see [Automated backup for SQL Server in Azure virtual machines (Resource Manager)](automated-backup-sql-2014.md). <br/> Management mode: Full|
| **Automated patching** |Configures a maintenance window during which important Windows and SQL Server security updates to your VM can take place, so  you can avoid updates during peak times for your workload. For more information, see [Automated patching for SQL Server in Azure virtual machines (Resource Manager)](automated-patching.md). <br/> Management mode: Full|
| **Azure Key Vault integration** |Enables you to automatically install and configure Azure Key Vault on your SQL Server VM. For more information, see [Configure Azure Key Vault integration for SQL Server on Azure Virtual Machines (Resource Manager)](azure-key-vault-integration-configure.md). <br/> Management mode: Full|
| **Flexible licensing** | Save on cost by [seamlessly transitioning](licensing-model-azure-hybrid-benefit-ahb-change.md) from the bring-your-own-license (also known as the Azure Hybrid Benefit) to the pay-as-you-go licensing model and back again. <br/> Management mode: Lightweight & full| 
| **Flexible version / edition** | If you decide to change the [version](change-sql-server-version.md) or [edition](change-sql-server-edition.md) of SQL Server, you can update the metadata within the Azure portal without having to redeploy the entire SQL Server VM.  <br/> Management mode: Lightweight & full| 
| **Defender for Cloud portal integration** | If you've enabled [Microsoft Defender for SQL](../../../security-center/defender-for-sql-usage.md), then you can view Defender for Cloud recommendations directly in the [SQL virtual machines](manage-sql-vm-portal.md) resource of the Azure portal. See [Security best practices](security-considerations-best-practices.md) to learn more.  <br/> Management mode: Lightweight & full|
| **SQL best practices assessment** | Enables you to assess the health of your SQL Server VMs using configuration best practices. For more information, see [SQL best practices assessment](sql-assessment-for-sql-vm.md).  <br/> Management mode: Full| 
| **View disk utilization in portal** | Allows you to view a graphical representation of the disk utilization of your SQL data files in the Azure portal.  <br/> Management mode: Full | 
|||

