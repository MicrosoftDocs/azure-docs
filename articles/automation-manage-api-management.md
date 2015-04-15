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
	ms.date="03/16/2015"
	ms.author="csand"/>



#Managing Azure API Management using Azure Automation

This guide will introduce you to the Azure Automation service, and how it can be used to simplify management of Azure API Management.

## What is Azure Automation?

[Azure Automation](http://azure.microsoft.com/services/automation/) is an Azure service for simplifying cloud management through process automation. Using Azure Automation, manual, frequently-repeated, long-running, and error-prone tasks can be automated to increase reliability, efficiency, and time to value for your organization.

Azure Automation provides a highly-reliable, highly-available workflow execution engine that scales to meet your needs. In Azure Automation, processes can be kicked off manually, by 3rd-party systems, or at scheduled intervals so that tasks happen exactly when needed.

Reduce operational overhead and free up IT and DevOps staff to focus on work that adds business value by moving your cloud management tasks to be run automatically by Azure Automation.


## How can Azure Automation help manage Azure API Management?

API Management can be managed in Azure Automation by using the [API Management REST API](https://msdn.microsoft.com/library/azure/dn776326.aspx). Within Azure Automation you can write PowerShell workflow scripts to perform many of your API Management tasks using the REST API. You can also pair these REST API calls in Azure Automation with the cmdlets for other Azure services, to automate complex tasks across Azure services and 3rd party systems.


## Next Steps

Now that you've learned the basics of Azure Automation and how it can be used to manage Azure API Management, follow these links to learn more.

* See the Azure Automation [Getting Started Tutorial](automation-create-runbook-from-samples.md).
* Read the [PowerShell Module for the #Azure API Management REST APIs](https://alexandrebrisebois.wordpress.com/2014/08/17/powershell-module-for-the-azure-api-management-rest-apis/) community blog post.
