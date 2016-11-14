---
title: Azure Government Backup | Microsoft Docs
description: This article provides an overview of the Azure Backup features available in Azure Government.
services: backup
documentationcenter: ''
author: markgalioto
manager: cfreeman


ms.assetid: a7622135-8790-4be4-a02a-7b9ac8a4996f
ms.service: backup
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 11/11/2016
ms.author: markgal;

---
# Azure Government Backup

This article provides an overview of the Azure Backup service and lists the Backup features available in Azure Government. Azure Backup is the Azure-based service you can use to back up (or protect) your data to the Microsoft cloud. Protecting your data in Azure not only means backing it up to the cloud, but restoring the data in the cloud or to an on-premises installation. Azure Backup provides these key benefits:

- Automatic storage management
- Unlimited scaling
- Multiple storage options
- Unlimited data transfer
- Data encryption
- Application-consistent backup
- Long-term retention

If you're new to Azure Backup and would like an overview of the available features, read the article, [What is Azure Backup](../backup/backup-introduction-to-azure-backup.md).

> [!IMPORTANT]
> Currently, Azure Government Backup supports Service Manager deployments, also known as the classic deployment model. Resource Manager deployments are not yet supported. See the following article for the [difference between Azure Resource Manager and classic deployment models](../resource-manager-deployment-model.md).

[! INCLUDE[learn about backup deployment models](../includes/backup-deployment-models.md)]

## Azure Backup components available in Azure Government Backup

You can use Azure Backup to protect: files, folders, volumes, virtual machines, applications, and workloads. Depending on what you want to protect, and where that data exists, you use a different Azure Backup component. The following sections have links to articles in the Azure Backup public documentation for each component.

Each article explains how to use the Azure Backup component in the classic version portal.

### Windows Server and Windows computers

- [Back up Windows Server and Windows client computers](../backup/backup-configure-vault-classic.md)
- [Restore Windows Server and Windows client computers](../backup/backup-azure-restore-windows-server.md)
- [Manage Windows Server and Windows client computer backups](../backup/backup-azure-manage-windows-server.md)
- [Using Powershell to back up Windows Server](../backup/backup-client-automation-classic.md)

### Virtual Machines

- [Prepare your virtual machine environment](../backup/backup-azure-vms-prepare.md)
- [Back up virtual machines](../backup/backup-azure-vms-first-look.md)
- [Restore virtual machines](../backup/backup-azure-restore-vms.md)
- [Manage virtual machines](../backup/backup-azure-manage-vms-classic.md)
- [Using PowerShell to back up virtual machines](../backup/backup-azure-vms-classic-automation.md)

### System Center Data Protection Manager

- [Back up System Center Data Protection Manager](../backup/backup-azure-dpm-introduction-classic.md)

### Azure Backup Server

- [Azure Backup Server](../backup/backup-azure-microsoft-azure-backup-classic.md)

Azure Backup Server is an Azure Backup component that functions similarly to System Center Data Protection Manager (DPM). Azure Backup Server can protect application workloads such as: Hyper-V VMs, Microsoft SQL Server, SharePoint Server, Microsoft Exchange, and Windows clients to the cloud from a single console.

## Next steps

If you aren't sure where to begin, start with the article, [Back up a Windows server or client to Azure using the classic deployment model](../backup/backup-configure-vault-classic.md). This tutorial leads you through the steps for setting up a backup project on a Windows Server or computer.

If you already know that you could use Azure Backup, but want to know the costs, see the [Backup Pricing page](http://azure.microsoft.com/pricing/details/backup/). There is a list of Frequently Asked Questions that may provide useful information. Also note there are two Azure Government regions in the **Region** dropdown menu. 
