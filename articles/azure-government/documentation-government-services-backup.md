---
title: Azure Government Backup | Microsoft Docs
description: This article provides an overview of the Azure Backup features available in Azure Government.
services: azure-government
documentationcenter: ''
author: markgalioto
manager: carmonm


ms.assetid: a7622135-8790-4be4-a02a-7b9ac8a4996f
ms.service: azure-government
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: azure-government
ms.date: 1/5/2017
ms.author: sogup

---
# Azure Government Backup

This article provides an overview of the Azure Backup service and lists the Backup features available in Azure Government. Azure Backup is the Azure-based service you can use to back up (or protect) your data to the Microsoft cloud. Protecting your data in Azure not only means backing it up to the cloud, but restoring the data either to the cloud, or to an on-premises installation. Azure Backup provides these key benefits:

- Automatic storage management
- Unlimited scaling
- Multiple storage options
- Unlimited data transfer
- Data encryption
- Application-consistent backup
- Long-term retention

If you're new to Azure Backup and would like an overview of the available features, read the article, [What is Azure Backup](../backup/backup-introduction-to-azure-backup.md).

[!INCLUDE [learn-about-backup-deployment models](../../includes/backup-deployment-models.md)]

## Azure Backup components available in Azure Government Backup

You can use Azure Backup to protect: files, folders, volumes, virtual machines, applications, and workloads. Depending on what you want to protect, and where that data exists, you use a different Azure Backup component. The following sections have links to articles in the Azure Backup public documentation for each component. 

### Using Windows Server and Windows computers in Azure portal

- [Back up Windows Server and Windows client computers](../backup/backup-configure-vault.md)
- [Restore Windows Server and Windows client computers](../backup/backup-azure-restore-windows-server.md)
- [Manage Windows Server and Windows client computer backups](../backup/backup-azure-manage-windows-server.md)
- [Using PowerShell to back up Windows Server](../backup/backup-client-automation.md)

### Using Virtual Machines in Azure portal

- [Prepare your virtual machine environment](../backup/backup-azure-arm-vms-prepare.md)
- [Back up virtual machines](../backup/backup-azure-vms-first-look-arm.md)
- [Restore virtual machines](../backup/backup-azure-arm-restore-vms.md)
- [Manage virtual machines](../backup/backup-azure-manage-vms.md)
- [Using PowerShell to back up virtual machines](../backup/backup-azure-vms-automation.md)

### Using System Center Data Protection Manager in Azure portal

- [Back up System Center Data Protection Manager](../backup/backup-azure-dpm-introduction.md)

### Using Azure Backup Server in Azure portal

Azure Backup Server is an Azure Backup component that functions similarly to System Center Data Protection Manager (DPM) with one exception - Azure Backup Server cannot save data to tape. Azure Backup Server can protect application workloads such as: Hyper-V VMs, Microsoft SQL Server, SharePoint Server, Microsoft Exchange, and Windows clients to the cloud from a single console. Azure Backup Server does not require a System Center license.

- [Azure Backup Server](../backup/backup-azure-microsoft-azure-backup.md)

### Upgrade a Backup vault to a Recovery Services vault

- [Upgrade now](../backup/backup-azure-upgrade-backup-to-recovery-services.md)


## Next steps

If you aren't sure where to begin, start with the article, [Back up Windows Server and Windows client computers](../backup/backup-configure-vault.md). This tutorial leads you through the steps for setting up a backup project on a Windows Server or computer.

If you already know that you could use Azure Backup, but want to know the costs, see the [Backup Pricing page](https://azure.microsoft.com/pricing/details/backup/). There is a list of Frequently Asked Questions that may provide useful information. Also note there are multiple Azure Government regions in the **Region** dropdown menu.
