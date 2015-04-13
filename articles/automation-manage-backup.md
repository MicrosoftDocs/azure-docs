 
<properties 
        pageTitle="Manage Azure Backup using Azure Automation" 
        description="Learn about how the Azure Automation service can be used to manage Azure Backup." 
        services="backup, automation" 
        documentationCenter="" 
        authors="eamonoreilly" 
        manager="jwinter" 
        editor=""/>
 
<tags 
        ms.service="backup" 
        ms.workload="storage-backup-recovery" 
        ms.tgt_pltfrm="na" 
        ms.devlang="na" 
        ms.topic="article" 
        ms.date="04/13/2015" 
        ms.author="eamono"/>
 
 
#Managing Azure Backup using Azure Automation
 
This guide will introduce you to the Azure Automation service, and how it can be used to simplify management of Azure Backup.
 
## What is Azure Automation?
 
[Azure Automation](http://azure.microsoft.com/services/automation/) is an Azure service for simplifying cloud management through process automation. Using Azure Automation, long-running, manual, error-prone, and frequently repeated tasks can be automated to increase reliability, efficiency, and time to value for your organization.
 
Azure Automation provides a highly-reliable and highly-available workflow execution engine that scales to meet your needs as your organization grows. In Azure Automation, processes can be kicked off manually, by 3rd-party systems, or at scheduled intervals so that tasks happen exactly when needed.
 
Lower operational overhead and free up IT / DevOps staff to focus on work that adds business value by moving your cloud management tasks to be run automatically by Azure Automation. 
 
 
## How can Azure Automation help manage Azure Backup?
 
Backup can be managed in Azure Automation by using the PowerShell cmdlets that are available in the [Windows MSOnlineBackup module](https://technet.microsoft.com/en-us/library/hh770400.aspx). Azure Automation can call these PowerShell cmdlets, so that you can perform all of your Backup management tasks within the service. You can also pair these cmdlets in Azure Automation with the cmdlets for other Azure services, to automate complex tasks across Azure services and 3rd party systems.
 
 
## Next Steps
 
Now that you've learned the basics of Azure Automation and how it can be used to manage Azure Backup, follow these links to learn more about Azure Automation.
 
* Check out the Azure Automation [Getting Started Guide](http://go.microsoft.com/fwlink/?LinkId=390560)
