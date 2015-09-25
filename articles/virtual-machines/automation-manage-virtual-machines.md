<properties
	pageTitle="Manage VMs using Azure Automation | Microsoft Azure"
	description="Learn about how the Azure Automation service can be used to manage Azure virtual machines at scale."
	services="virtual-machines, automation"
	documentationCenter=""
	authors="jodoglevy"
	manager="eamono"
	editor=""/>

<tags
	ms.service="virtual-machines"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/11/2015"
	ms.author="jolevy"/>



#Managing Azure Virtual Machines using Azure Automation

This guide introduces you to the Azure Automation service and how it can be used to simplify managing your Azure virtual machines.

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-include.md)]

## What is Azure Automation?

[Azure Automation](http://azure.microsoft.com/services/automation/) is an Azure service for simplifying cloud management through process automation. By using Azure Automation, long-running, manual, error-prone, and frequently repeated tasks can be automated to increase reliability, efficiency, and time-to-value for your organization.

Azure Automation provides a highly reliable and highly available workflow execution engine that scales to meet your needs as your organization grows. In Azure Automation, processes can be kicked off manually, by third-party systems, or at scheduled intervals so that tasks happen exactly when needed.

You can lower operational overhead and free up IT and DevOps staff to focus on work that adds business value by running your cloud management tasks automatically with Azure Automation.


## How can Azure Automation help manage Azure virtual machines?

Virtual machines can be managed in Azure Automation by using [Azure PowerShell](https://msdn.microsoft.com/library/azure/jj156055.aspx). Azure Automation includes the Azure PowerShell cmdlets, so you can perform all of your virtual machine management tasks within the service. You can also pair the cmdlets in Azure Automation with the cmdlets for other Azure services, to automate complex tasks across Azure services and third-party systems.


## Next steps

Now that you've learned the basics of Azure Automation and how it can be used to manage Azure virtual machines, learn more:

[Get started with Azure Automation](../automation-create-runbook-from-samples.md)
