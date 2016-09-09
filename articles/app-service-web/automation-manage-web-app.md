<properties
	pageTitle="Manage Azure Web App using Azure Automation | Microsoft Azure"
	description="Learn about how the Azure Automation service can be used to manage Azure Web App."
	services="app-service\web, automation"
	documentationCenter=""
	authors="mgoedtel"
	manager="jwhit"
	editor=""/>

<tags
	ms.service="app-service-web"
	ms.workload="web"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/29/2016"
	ms.author="magoedte;csand"/>

#Managing Azure Web App using Azure Automation

This guide will introduce you to the Azure Automation service, and how it can be used to simplify management of Azure Web App.

## What is Azure Automation?

[Azure Automation](../automation/automation-intro.md) is an Azure service for simplifying cloud management through process automation. Using Azure Automation, manual, repeated, long-running, and error-prone tasks can be automated to increase reliability, efficiency, and time to value for your organization.

Azure Automation provides a highly-reliable, highly-available workflow execution engine that scales to meet your needs. In Azure Automation, processes can be kicked off manually, by 3rd-party systems, or at scheduled intervals so that tasks happen exactly when needed.

Reduce operational overhead and free up IT and DevOps staff to focus on work that adds business value by moving your cloud management tasks to be run automatically by Azure Automation.


## How can Azure Automation help manage Azure Web App?

Web App can be managed in Azure Automation by using the PowerShell cmdlets that are available in the [Azure PowerShell modules](../powershell-install-configure.md). You can [install these Web App PowerShell cmdlets in Azure Automation](https://azure.microsoft.com/blog/announcing-azure-resource-manager-support-azure-automation-runbooks/), so that you can perform all of your Web App management tasks within the service. You can also pair these cmdlets in Azure Automation with the cmdlets for other Azure services to automate complex tasks across Azure services and 3rd party systems.

Here are some examples of managing App Services with Automation:

* [Scripts for managing Web Apps](https://azure.microsoft.com/documentation/scripts/)

## Next steps

Now that you've learned the basics of Azure Automation and how it can be used to manage Azure Web App, follow these links to learn more about Azure Automation.

* See the Azure Automation [Getting Started Tutorial](../automation/automation-first-runbook-graphical.md)
