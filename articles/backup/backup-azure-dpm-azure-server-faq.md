---
title: Azure Backup and Azure Server FAQ
description: 'Answers to common questions about: The Azure Backup DPM and Azure Server.'
services: backup
author: srinathvasireddy
manager: sivan
ms.service: backup
ms.topic: conceptual
ms.date: 07/03/2019
ms.author: srinathvasireddy
---

# Azure Backup DPM and Azure Server - Frequently asked questions
This article answers common questions about the Azure Backup DPM and Azure Server.

## DPM and Azure Backup Server backup

### Which DPM versions are supported?
Supported DPM versions are summarized in the [support matrix](backup-azure-dpm-introduction.md#prerequisites-and-limitations). We recommend that you install the latest DPM updates, and run the [latest version](https://aka.ms/azurebackup_agent) of the Azure Backup agent on the DPM server.

### Can I register the server to multiple vaults?
No. A DPM or Azure Backup server can be registered to only one vault.

### Can I use Azure Backup Server to create a Bare Metal Recovery (BMR) backup for a physical server? <br/>
Yes.

### Can I use DPM to back up apps in Azure Stack?
No. You can use Azure Backup to protect Azure Stack, Azure Backup doesn't support using DPM to back up apps in Azure Stack.

### If I've installed Azure Backup agent to protect my files and folders, can I install System Center DPM to back up on-premises workloads to Azure?
Yes. But you should set up DPM first, and then install the Azure Backup agent.  Installing components in this order ensures that the Azure Backup agent works with DPM. Installing the agent before installing DPM isn't advised or supported.


## Azure Backup agent

### Where can I find common questions about the Azure Backup agent for Azure VM backup?

- For the agent running on Azure VMs, read this [FAQ](backup-azure-vm-backup-faq.md).
- For the agent used to backup up Azure file folders, read this [FAQ](backup-azure-file-folder-backup-faq.md).


## VMware and Hyper-V backup

### Can I back up VMware vCenter servers to Azure?
Yes. You can use Azure Backup Server to back up VMware vCenter Server and ESXi hosts to Azure.

- [Learn more](backup-mabs-protection-matrix.md) about supported versions.
- [Follow these steps](backup-azure-backup-server-vmware.md) to back up a VMware server.

### Do I need a separate license to recover an full on-premises VMware/Hyper-V cluster?
You don't need separate licensing for VMware/Hyper-V protection.

- If you're a System Center customer, use System Center Data Protection Manager (DPM) to protect VMware VMs.
- If you aren't a System Center customer, you can use Azure Backup Server (pay-as-you-go) to protect VMware VMs.


## General backup

### What operating systems are supported for backup?
Azure Backup supports these operating systems for backing up files and folders, and apps protected by Azure Backup Server and DPM.

**OS** | **SKU** | **Details**
--- | --- | ---
Workstation | |
Windows 10 64 bit | Enterprise, Pro, Home | Machines should be running the latest services packs and updates.
Windows 8.1 64 bit | Enterprise, Pro | Machines should be running the latest services packs and updates.
Windows 8 64 bit | Enterprise, Pro | Machines should be running the latest services packs and updates.
Windows 7 64 bit | Ultimate, Enterprise, Professional, Home Premium, Home Basic, Starter | Machines should be running the latest services packs and updates.
Server | |
Windows Server 2019 64 bit | Standard, Datacenter, Essentials | With the latest service packs/updates.
Windows Server 2016 64 bit | Standard, Datacenter, Essentials | With the latest service packs/updates.
Windows Server 2012 R2 64 bit | Standard, Datacenter, Foundation | With the latest service packs/updates.
Windows Server 2012 64 bit | Datacenter, Foundation, Standard | With the latest service packs/updates.
Windows Storage Server 2016 64 bit | Standard, Workgroup | With the latest service packs/updates.
Windows Storage Server 2012 R2 64 bit | Standard, Workgroup, Essential | With the latest service packs/updates.
Windows Storage Server 2012 64 bit | Standard, Workgroup | With the latest service packs/updates.
Windows Server 2008 R2 SP1 64 bit | Standard, Enterprise, Datacenter, Foundation | With the latest updates.
Windows Server 2008 64 bit | Standard, Enterprise, Datacenter | With latest updates.

For Azure VM Linux backups, Azure Backup supports [the list of distributions endorsed by Azure](../virtual-machines/linux/endorsed-distros.md), except Core OS Linux and 32-bit operating system. Other bring-your-own Linux distributions might work as long as the VM agent is available on the VM, and support for Python exists.

### How is the data source size determined?
The following table explains how each data source size is determined.

**Data source** | **Details**
--- | ---
Volume |The amount of data being backed up from single volume VM being backed up.
SQL Server database |Size of single SQL database size being backed up.
SharePoint | Sum of the content and configuration databases within a SharePoint farm being backed up.
Exchange |Sum of all Exchange databases in an Exchange server being backed up.
BMR/System state |Each individual copy of BMR or system state of the machine being backed up.

### Why is the size of the data transferred to the Recovery Services vault smaller than the data selected for backup?
Data backed up from Azure Backup Agent, DPM, and Azure Backup Server is compressed and encrypted before being transferred. With compression and encryption is applied, the data in the vault is 30-40% smaller.

### Can I delete individual files from a recovery point in the vault?
No, Azure Backup doesn't support deleting or purging individual items from stored backups.

### Why can’t I add an external DPM server after installing UR7 and latest Azure Backup agent?
For the DPM servers with data sources that are protected to the cloud (by using an update rollup earlier than Update Rollup 7), you must wait at least one day after installing the UR7 and latest Azure Backup agent, to start **Add External DPM server**. The one-day time period is needed to upload the metadata of the DPM protection groups to Azure. Protection group metadata is uploaded the first time through a nightly job.

### What is the minimum version of the Microsoft Azure Recovery Services agent needed?
The minimum version of the Microsoft Azure Recovery Services agent, or Azure Backup agent, required to enable this feature is 2.0.8719.0.  To view the agent's version: open Control Panel **>** All Control Panel items **>** Programs and features **>** Microsoft Azure Recovery Services Agent. If the version is less than 2.0.8719.0, download and install the [latest Azure Backup agent](https://go.microsoft.com/fwLink/?LinkID=288905).

![Clear External DPM](./media/backup-azure-dpm-azure-server-faq/external-dpm-azurebackupagentversion.png)

## SharePoint

### Which versions of DPM support SQL Server 2014 and SQL 2012 (SP2)?
DPM 2012 R2 with Update Rollup 4 supports both.

### Can I recover a SharePoint item to the original location if SharePoint is configured by using SQL AlwaysOn (with protection on disk)?
Yes, the item can be recovered to the original SharePoint site.

### Can I recover a SharePoint database to the original location if SharePoint is configured by using SQL AlwaysOn?
Because SharePoint databases are configured in SQL AlwaysOn, they cannot be modified unless the availability group is removed. As a result, DPM cannot restore a database to the original location. You can recover a SQL Server database to another SQL Server instance.

## Next steps

Read the other FAQs:

- [Common questions](backup-azure-vm-backup-faq.md) about Azure VM backups.
- [Common questions](backup-azure-file-folder-backup-faq.md) about the Azure Backup agent
