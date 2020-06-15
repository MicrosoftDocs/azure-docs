---
title: Manage databases with Azure Automation
description: Learn about how the Azure Automation service can be used to manage Azure SQL Database at scale.
services: sql-database
ms.service: sql-database
ms.subservice: operations
ms.custom: sqldbrb=1
ms.devlang: 
ms.topic: conceptual
author: juliemsft
ms.author: jrasnick
ms.reviewer: carlrab
ms.date: 03/12/2019
---

# Manage databases in Azure SQL Database by using Azure Automation

[!INCLUDE[appliesto-sqldb-sqlmi](../includes/appliesto-sqldb-sqlmi.md)]

This guide will introduce you to the Azure Automation service, and how it can be used to simplify the management of databases in Azure SQL Database.

## About Azure Automation

[Azure Automation](https://azure.microsoft.com/services/automation/) is an Azure service for simplifying cloud management through process automation. Using Azure Automation, long-running, manual, error-prone, and frequently repeated tasks can be automated to increase reliability, efficiency, and time to value for your organization. For information on getting started, see [Azure Automation intro](../../automation/automation-intro.md)

Azure Automation provides a workflow execution engine with high reliability and high availability, and that scales to meet your needs as your organization grows. In Azure Automation, processes can be kicked off manually, by third-party systems, or at scheduled intervals so that tasks happen exactly when needed.

Lower operational overhead and free up IT / DevOps staff to focus on work that adds business value by moving your cloud management tasks to be run automatically by Azure Automation.

## How Azure Automation can help manage your databases

With Azure Automation, you can manage databases in Azure SQL Database by using [PowerShell cmdlets](https://docs.microsoft.com/powershell/module/servicemanagement/azure/#sql) that are available in the [Azure PowerShell tools](/powershell/azure/overview). Azure Automation has these Azure SQL Database PowerShell cmdlets available out of the box, so that you can perform all of your SQL Database management tasks within the service. You can also pair these cmdlets in Azure Automation with the cmdlets for other Azure services, to automate complex tasks across Azure services and across third-party systems.

Azure Automation also has the ability to communicate with SQL servers directly, by issuing SQL commands using PowerShell.

The runbook and module galleries for [Azure Automation](../../automation/automation-runbook-gallery.md) offer a variety of runbooks from Microsoft and the community that you can import into Azure Automation. To use one, download a runbook from the gallery, or you can directly import runbooks from the gallery, or from your Automation account in the Azure portal.

## Next steps

Now that you've learned the basics of Azure Automation and how it can be used to manage Azure SQL Database, follow these links to learn more about Azure Automation.

- [Azure Automation Overview](../../automation/automation-intro.md)
- [My first runbook](../../automation/learn/automation-tutorial-runbook-graphical.md)
