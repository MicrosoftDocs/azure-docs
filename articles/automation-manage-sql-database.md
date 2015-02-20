<properties 
	pageTitle="Manage Azure SQL Databases using Azure Automation" 
	description="Learn about how the Azure Automation service can be used to manage Azure SQL databases at scale." 
	services="automation, sql-database" 
	documentationCenter="" 
	authors="jodoglevy" 
	manager="eamono" 
	editor=""/>

<tags 
	ms.service="sql-database" 
	ms.workload="data-management" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="02/20/2015" 
	ms.author="jolevy"/>



#Managing Azure SQL Databases using Azure Automation

This guide will introduce you to the Azure Automation service, and how it can be used to simplify management of your Azure SQL databases.


## What is Azure Automation?

[Azure Automation](http://azure.microsoft.com/en-us/services/automation/) is an Azure service for simplifying cloud management through process automation. Using Azure Automation, long-running, manual, error-prone, and frequently repeated tasks can be automated to increase reliability, efficiency, and time to value for your organization.

Azure Automation provides a highly-reliable and highly-available workflow execution engine that scales to meet your needs as your organization grows. In Azure Automation, processes can be kicked off manually, by 3rd-party systems, or at scheduled intervals so that tasks happen exactly when needed.

Lower operational overhead and free up IT / DevOps staff to focus on work that adds business value by moving your cloud management tasks to be run automatically by Azure Automation. 


## How can Azure Automation help manage Azure SQL databases?

Azure SQL Database can be managed in Azure Automation by using the PowerShell cmdlets that are available in the [Azure PowerShell tools](https://msdn.microsoft.com/en-us/library/azure/jj156055.aspx). Azure Automation has these Azure SQL Database PowerShell cmdlets available out of the box, so that you can perform all of your SQL DB management tasks within the service. You can also pair these cmdlets in Azure Automation with the cmdlets for other Azure services, to automate complex tasks across Azure services and 3rd party systems.

Azure Automation also has the ability to communicate with SQL servers directly, by issuing SQL commands using PowerShell.


## Next Steps

Now that you've learned the basics of Azure Automation and how it can be used to manage Azure SQL databases, follow these links to learn more about Azure Automation.

* Check out the Azure Automation [Getting Started Guide](http://go.microsoft.com/fwlink/?LinkId=390560)
