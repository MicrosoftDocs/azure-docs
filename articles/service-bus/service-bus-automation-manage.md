<properties
	pageTitle="Manage Azure Service Bus using Azure Automation | Microsoft Azure"
	description="Learn how to use the Azure Automation service to manage Azure Service Bus."
	services="service-bus, automation"
	documentationCenter=""
	authors="mgoedtel"
	manager="jwhit"
	editor=""/>

<tags
	ms.service="service-bus"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/29/2016"
	ms.author="magoedte;csand"/>

# Managing Azure Service Bus using Azure Automation

This guide will introduce you to the Azure Automation service, and how it can be used to simplify management of Azure Service Bus.

## What is Azure Automation?

[Azure Automation](../automation/automation-intro.md) is an Azure service for simplifying cloud management through process automation and desired state configuration. Using Azure Automation, manual, repeated, long-running, and error-prone tasks can be automated to increase reliability, efficiency, and time to value for your organization.

Azure Automation provides a highly-reliable, highly-available workflow execution engine that scales to meet your needs. In Azure Automation, processes can be kicked off manually, by 3rd-party systems, or at scheduled intervals so that tasks happen exactly when needed.

Reduce operational overhead and free up IT and DevOps staff to focus on work that adds business value by moving your cloud management tasks to be run automatically by Azure Automation.

## How can Azure Automation help manage Azure Service Bus?

You can manage Service Bus with Azure Automation by using the [Service Bus REST API](https://msdn.microsoft.com/en-us/library/azure/mt639375.aspx). Within Azure Automation you can run PowerShell scripts to perform many of your Service Bus tasks using the REST API. You can also pair these REST API calls in Azure Automation with the cmdlets for other Azure services, to automate complex tasks across Azure services and 3rd party systems.

Here are some examples of using PowerShell to manage Azure Service Bus:

* [Custom PowerShell cmdlets to manage Azure Service Bus queues](https://blogs.technet.microsoft.com/uktechnet/2014/12/04/sample-of-custom-powershell-cmdlets-to-manage-azure-servicebus-queues)
* [How to create Service Bus queues, topics and subscriptions using a PowerShell script](http://blogs.msdn.com/b/paolos/archive/2014/12/02/how-to-create-a-service-bus-queues-topics-and-subscriptions-using-a-powershell-script.aspx)
* [Create Azure Service Bus Namespaces using PowerShell](http://buildazure.com/2015/09/24/create-azure-service-bus-namespaces-using-powershell-and-x-plat-cli/)

The PowerShell module for working with Azure service bus in Automation runbooks can be downloaded from the [PowerShell Gallery](https://www.powershellgallery.com/packages/AzureServiceBusCreation/1.0).


## Next steps

Now that you've learned the basics of Azure Automation and how it can be used to manage Azure Service Bus, follow these links to learn more about Azure Automation.

* See the Azure Automation [Getting Started Tutorial](../automation/automation-first-runbook-graphical.md)
* See how to [manage Service Bus with PowerShell](service-bus-powershell-how-to-provision.md)
