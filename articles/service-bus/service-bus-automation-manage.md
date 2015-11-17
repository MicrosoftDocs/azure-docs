<properties
	pageTitle="Manage Azure Service Bus using Azure Automation"
	description="Learn about how the Azure Automation service can be used to manage Azure Service Bus."
	services="service-bus, automation"
	documentationCenter=""
	authors="csand-msft"
	manager="eamono"
	editor=""/>

<tags
	ms.service="service-bus"
	ms.workload="core"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/28/2015"
	ms.author="csand"/>



# Managing Azure Service Bus using Azure Automation

This guide will introduce you to the Azure Automation service, and how it can be used to simplify management of Azure Service Bus.

## What is Azure Automation?

[Azure Automation](http://azure.microsoft.com/services/automation/) is an Azure service for simplifying cloud management through process automation. Using Azure Automation, manual, frequently-repeated, long-running, and error-prone tasks can be automated to increase reliability, efficiency, and time to value for your organization.

Azure Automation provides a highly-reliable, highly-available workflow execution engine that scales to meet your needs. In Azure Automation, processes can be kicked off manually, by 3rd-party systems, or at scheduled intervals so that tasks happen exactly when needed.

Reduce operational overhead and free up IT and DevOps staff to focus on work that adds business value by moving your cloud management tasks to be run automatically by Azure Automation.

## How can Azure Automation help manage Azure Service Bus?

You can manage Service Bus with Azure Automation by using the [Service Bus REST API](https://msdn.microsoft.com/library/azure/hh780717.aspx). Within Azure Automation you can write PowerShell workflow scripts to perform many of your Service Bus tasks using the REST API. You can also pair these REST API calls in Azure Automation with the cmdlets for other Azure services, to automate complex tasks across Azure services and 3rd party systems.

## Next Steps

Now that you've learned the basics of Azure Automation and how it can be used to manage Azure Service Bus, follow these links to learn more about Azure Automation.

* See the Azure Automation [Getting Started Tutorial](../automation-create-runbook-from-samples.md)
* See article on [Manage Service Bus with PowerShell](service-bus-powershell-how-to-provision.md)
 