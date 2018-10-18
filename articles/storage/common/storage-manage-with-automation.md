---
title: Manage Azure Storage using Azure Automation
description: Learn about how the Azure Automation service can be used to manage Azure Storage at scale.
services: storage, automation
author: jodoglevy
ms.service: storage
ms.topic: article
ms.date: 05/23/2016
ms.author: eamono
ms.component: common
---
# Managing Azure Storage using Azure Automation
This guide will introduce you to the Azure Automation service, and how it can be used to simplify management of your Azure Storage blobs, tables, and queues.

## What is Azure Automation?
[Azure Automation](https://azure.microsoft.com/services/automation/) is an Azure service for simplifying cloud management through process automation. Using Azure Automation, long-running, manual, error-prone, and frequently repeated tasks can be automated to increase reliability and efficiency, and reduce time to value for your organization.

Azure Automation provides a highly-reliable and highly-available workflow execution engine that scales to meet your needs as your organization grows. In Azure Automation, processes can be kicked off manually, by 3rd-party systems, or at scheduled intervals so that tasks happen exactly when needed.

Lower operational overhead and free up IT / DevOps staff to focus on work that adds business value by moving your cloud management tasks to be run automatically by Azure Automation.

## How can Azure Automation help manage Azure Storage?
Azure Storage can be managed in Azure Automation by using the PowerShell cmdlets that are available in [Azure PowerShell](https://msdn.microsoft.com/library/azure/jj156055.aspx). Azure Automation has these Storage PowerShell cmdlets available out of the box, so that you can perform all of your blob, table, and queue management tasks within the service. You can also pair these cmdlets in Azure Automation with the cmdlets for other Azure services, to automate complex tasks across Azure services and 3rd party systems.

The [Azure Automation runbook gallery](https://azure.microsoft.com/blog/2014/10/07/introducing-the-azure-automation-runbook-gallery/) contains a variety of product team and community runbooks to get started automating management of Azure Storage, other Azure services, and 3rd party systems. Gallery runbooks include:

* [Remove Azure Storage Blobs that are Certain Days Old Using Automation Service](https://gallery.technet.microsoft.com/scriptcenter/Remove-Storage-Blobs-that-aae4b761)
* [Download a Blob from Azure Storage](https://gallery.technet.microsoft.com/scriptcenter/a-Blob-from-Azure-Storage-6bc13745)
* [Backup all disks for a single Azure VM or for all VMs in a Cloud Service](https://gallery.technet.microsoft.com/scriptcenter/Backup-all-disks-for-a-ede940d5)

## Next Steps
Now that you've learned the basics of Azure Automation and how it can be used to manage Azure Storage blobs, tables, and queues, follow these links to learn more about Azure Automation.

See the Azure Automation tutorial [Creating or importing a runbook in Azure Automation](../../automation/automation-creating-importing-runbook.md).

