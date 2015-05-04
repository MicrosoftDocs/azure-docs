<properties
	pageTitle="Manage Azure HDInsight using Azure Automation"
	description="Learn about how the Azure Automation service can be used to manage Azure HDInsight."
	services="HDInsight, automation"
	documentationCenter=""
	authors="elcooper"
	manager="eamono"
	editor=""/>

<tags
	ms.service="HDInsight"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="04/13/2015"
	ms.author="elcooper"/>



#Managing Azure HDInsight using Azure Automation
This guide will introduce you to the Azure Automation service and how it can be used to simplify management of your clusters and automate common tasks in Azure HDInsight.

## What is Azure Automation?
[Azure Automation](http://azure.microsoft.com/services/automation/) is an Azure service for simplifying cloud management through process automation. Using Azure Automation, manual, frequently-repeated, long-running, and error-prone tasks can be automated to increase reliability, efficiency, and time to value for your organization.

Azure Automation provides a highly-reliable, highly-available workflow execution engine that scales to meet your needs. In Azure Automation, processes can be kicked off manually, by 3rd-party systems, or at scheduled intervals so that tasks happen exactly when needed.

Reduce operational overhead and free up IT and DevOps staff to focus on work that adds business value by scheduling your cloud management tasks to run automatically on Azure Automation.


## How can Azure Automation help manage Azure HDInsight?

HDInsight can be managed in Azure Automation by using the [Azure HDInsight cmdlets](https://msdn.microsoft.com/library/azure/dn479228.aspx) that are available in the [Azure PowerShell tools](https://msdn.microsoft.com/library/azure/jj156055.aspx). Azure Automation has these cmdlets available out of the box, so that you can perform your HDInsight management tasks within the service. You can also pair these cmdlets in Azure Automation with the cmdlets for other Azure services, to automate complex tasks across Azure services and 3rd party systems.

With the Azure HDInsight cmdlets you can automate tasks such as provisioning HDInsight clusters on Linux or Windows, scaling clusters, managing clusters, and submitting MapReduce jobs. These are just a few of the many tasks that you can automate using PowerShell in Azure Automation.  


## Next steps
Now that you've learned the basics of Azure Automation and how it can be used to manage Azure HDInsight, follow this link to learn more about Azure Automation.

* See the Azure Automation [Getting Started Tutorial](automation-create-runbook-from-samples.md).

