<properties
	pageTitle="Manage Azure Key Vault using Azure Automation"
	description="Learn about how the Azure Automation service can be used to manage Azure Key Vault."
	services="Key-Vault, automation"
	documentationCenter=""
	authors="csand-msft"
	manager="eamono"
	editor=""/>

<tags
	ms.service="key-vault"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="03/16/2015"
	ms.author="csand"/>



#Managing Azure Key Vault using Azure Automation

This guide will introduce you to the Azure Automation service and how it can be used to simplify management of your keys and secrets in Azure Key Vault.

## What is Azure Automation?

[Azure Automation](http://azure.microsoft.com/services/automation/) is an Azure service for simplifying cloud management through process automation. Using Azure Automation, manual, frequently-repeated, long-running, and error-prone tasks can be automated to increase reliability, efficiency, and time to value for your organization.

Azure Automation provides a highly-reliable, highly-available workflow execution engine that scales to meet your needs. In Azure Automation, processes can be kicked off manually, by 3rd-party systems, or at scheduled intervals so that tasks happen exactly when needed.

Reduce operational overhead and free up IT and DevOps staff to focus on work that adds business value by moving your cloud management tasks to be run automatically by Azure Automation.


## How can Azure Automation help manage Azure Key Vault?

Key Vault can be managed in Azure Automation by using the [Azure Key Vault cmdlets](https://msdn.microsoft.com/library/azure/dn868052.aspx) that are available in the [Azure PowerShell tools](https://msdn.microsoft.com/library/azure/jj156055.aspx). Azure Automation has these cmdlets available out of the box, so that you can perform many of your Key Vault management tasks within the service. You can also pair these cmdlets in Azure Automation with the cmdlets for other Azure services, to automate complex tasks across Azure services and 3rd party systems.

With the Azure Key Vault cmdlets you can perform these tasks: create or import a key, create or update a secret, update attributes of a key, get a key or secret, or delete a key or secret.


## Next Steps

Now that you've learned the basics of Azure Automation and how it can be used to manage Azure Key Vault, follow these links to learn more about Azure Automation.

* See the Azure Automation [Getting Started Tutorial](automation-create-runbook-from-samples.md).
* See the [Azure Key Vault PowerShell scripts](https://gallery.technet.microsoft.com/scriptcenter/Azure-Key-Vault-Powershell-1349b091).
