---
title: Azure Backup Server and DPM FAQ
description: 'Answers to common questions about: The Azure Backup Server and DPM.'
services: backup
author: srinathvasireddy
manager: sivan
ms.service: backup
ms.topic: conceptual
ms.date: 07/05/2019
ms.author: srinathv
---

# Azure Backup Server and DPM - FAQ
This article answers frequently asked questions about the Azure Backup Server and DPM.

### Can I use Azure Backup Server to create a Bare Metal Recovery (BMR) backup for a physical server? <br/>
Yes.

### Can I register the server to multiple vaults?
No. A DPM or Azure Backup server can be registered to only one vault.


### Can I use DPM to back up apps in Azure Stack?
No. You can use Azure Backup to protect Azure Stack, Azure Backup doesn't support using DPM to back up apps in Azure Stack.

### If I've installed Azure Backup agent to protect my files and folders, can I install System Center DPM to back up on-premises workloads to Azure?
Yes. But you should set up DPM first, and then install the Azure Backup agent.  Installing components in this order ensures that the Azure Backup agent works with DPM. Installing the agent before installing DPM isn't advised or supported.

### Why can’t I add an external DPM server after installing UR7 and latest Azure Backup agent?
For the DPM servers with data sources that are protected to the cloud (by using an update rollup earlier than Update Rollup 7), you must wait at least one day after installing the UR7 and latest Azure Backup agent, to start **Add External DPM server**. The one-day time period is needed to upload the metadata of the DPM protection groups to Azure. Protection group metadata is uploaded the first time through a nightly job.

## VMware and Hyper-V backup

### Can I back up VMware vCenter servers to Azure?
Yes. You can use Azure Backup Server to back up VMware vCenter Server and ESXi hosts to Azure.

- [Learn more](backup-mabs-protection-matrix.md) about supported versions.
- [Follow these steps](backup-azure-backup-server-vmware.md) to back up a VMware server.

### Do I need a separate license to recover a full on-premises VMware/Hyper-V cluster?
You don't need separate licensing for VMware/Hyper-V protection.

- If you're a System Center customer, use System Center Data Protection Manager (DPM) to protect VMware VMs.
- If you aren't a System Center customer, you can use Azure Backup Server (pay-as-you-go) to protect VMware VMs.


## SharePoint

### Can I recover a SharePoint item to the original location if SharePoint is configured by using SQL AlwaysOn (with protection on disk)?
Yes, the item can be recovered to the original SharePoint site.

### Can I recover a SharePoint database to the original location if SharePoint is configured by using SQL AlwaysOn?
Because SharePoint databases are configured in SQL AlwaysOn, they cannot be modified unless the availability group is removed. As a result, DPM cannot restore a database to the original location. You can recover a SQL Server database to another SQL Server instance.

## Next steps

Read the other FAQs:

- [Learn more](backup-support-matrix-mabs-dpm.md) about Azure Backup Server and DPM support matrix.
- [Learn more](backup-azure-mabs-troubleshoot.md) about the Azure Backup Server and DPM troubleshooting guidelines.
