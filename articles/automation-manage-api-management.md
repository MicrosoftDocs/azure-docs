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

[Azure Automation](http://azure.microsoft.com/services/automation/) is an Azure service for simplifying cloud management through process automation.  To learn more about Azure Automation see the [Azure Automation getting started guide](automation-create-runbook-from-samples.md).


## How can Azure Automation help manage Azure API Management?

API Management can be managed in Azure Automation by using the [API Management REST API](https://msdn.microsoft.com/library/azure/dn776326.aspx). Within Azure Automation you can write PowerShell workflow script to perform many of your API Management tasks using the REST API. You can also pair these REST API calls in Azure Automation with the cmdlets for other Azure services, to automate complex tasks across Azure services and 3rd party systems.


## Next Steps

Now that you've learned the basics of Azure Automation and how it can be used to manage Azure API Management, follow these links to learn more about Azure Automation.

* Check out the Azure Automation [Getting Started Guide](automation-create-runbook-from-samples.md)
