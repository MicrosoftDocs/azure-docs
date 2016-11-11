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

This article provides an overview of the Azure Backup service and lists the Backup features available in Azure Government. Azure Backup is the Azure-based service you can use to back up (or protect) and restore your data in the Microsoft cloud. If you're new to Azure Backup and would like an overview of the available features, read the article, [What is Azure Backup](../backup/backup-introduction-to-azure-backup.md). Azure Backup provides these key benefits:

- Automatic storage management
- Unlimited scaling
- Multiple storage options
- Unlimited data transfer
- Data encryption
- Application-consistent backup
- Long-term retention

> [!IMPORTANT]
> Currently, Azure Government Backup supports Service Manager deployments, also known as the classic deployment model. Resource Manager deployments are not yet supported. See the following article for the [difference between Azure Resource Manager and classic deployment models](../resource-manager-deployment-model.md).


## Azure Backup components available in Azure Government Backup

As mentioned, Azure Government Backup supports the classic deployment model. The following articles how to protect each component in the classic version of the Azure portal.

### Virtual Machines

- [Prepare your virtual machine environment](backup-azure-vms-prepare.md)
- [Back up virtual machines](backup-vms-first-look.md)
- [Restore virtual machines](backup-restore-vms.md)
- [Manage virtual machines](backup-azure-manage-vms-classic.md)
- [Using PowerShell to back up virtual machines](backup-vms-classic-automation.md)

### System Center Data Protection Manager

- [Back up System Center Data Protection Manager](backup/backup-dpm-introduction-classic.md)

### Azure Backup Server

- [Azure Backup Server](backup-azure-microsoft-azure-backup-classic.md)

### Windows Server and Windows computers

- [Back up Windows Server and Windows client computers](backup-configure-vault-classic.md)
- [Restore Windows Server and Windows client computers](backup-azure-restore-windows-server.md)
- [Manage Windows Server and Windows client computer backups](backup-azure-manage-windows-server.md)
- [Using Powershell to back up Windows Server](backup-client-automation-classic.md)
