<properties
	pageTitle="Manage Azure API Management using Azure Automation"
	description="Learn about how the Azure Automation service can be used to manage Azure API Management."
	services="api-management, automation"
	documentationCenter=""
	authors="csand-msft"
	manager="eamono"
	editor=""/>

<tags
	ms.service="api-management"
	ms.workload="mobile"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="05/24/2016"
	ms.author="csand"/>



#Managing Azure API Management using Azure Automation

This guide will introduce you to the Azure Automation service, and how it can be used to simplify management of Azure API Management.

## What is Azure Automation?

[Azure Automation](https://azure.microsoft.com/services/automation/) is an Azure service for simplifying cloud management through process automation. Using Azure Automation, manual, repeated, long-running, and error-prone tasks can be automated to increase reliability, efficiency, and time to value for your organization.

Azure Automation provides a highly-reliable, highly-available workflow execution engine that scales to meet your needs. In Azure Automation, processes can be kicked off manually, by 3rd-party systems, or at scheduled intervals so that tasks happen exactly when needed.

Reduce operational overhead and free up IT and DevOps staff to focus on work that adds business value by moving your cloud management tasks to be run automatically by Azure Automation.


## How can Azure Automation help manage Azure API Management?

API Management can be managed in Azure Automation by using the [Windows PowerShell cmdlets for Azure API Management API](https://azure.microsoft.com/updates/full-set-of-windows-powershell-cmdlets-for-azure-api-management-api/). Within Azure Automation you can write PowerShell workflow scripts to perform many of your API Management tasks using the cmdlets. You can also pair these cmdlets in Azure Automation with the cmdlets for other Azure services, to automate complex tasks across Azure services and 3rd party systems.

Here are some examples of using API Management with Automation:
* [Azure API Management – Using PowerShell for backup and restore](https://blogs.msdn.microsoft.com/katriend/2015/10/02/azure-api-management-using-powershell-for-backup-and-restore/)

## Next Steps

Now that you've learned the basics of Azure Automation and how it can be used to manage Azure API Management, follow these links to learn more.

* See the Azure Automation [getting started tutorial](../automation/automation-first-runbook-graphical.md).
