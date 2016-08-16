<properties
	pageTitle="What is Azure Automation | Microsoft Azure"
	description="Learn what value Azure Automation provides and get answers to common questions so that you can get started in creating, using runbooks and Azure Automation DSC."
	services="automation"
	documentationCenter=""
	authors="mgoedtel"
	manager="jwhit"
	editor=""
	keywords="what is automation, azure automation, azure automation examples"/>
<tags
	ms.service="automation"
	ms.workload="tbd"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="get-started-article" 
	ms.date="05/10/2016"
	ms.author="magoedte;bwren"/>

# Azure Automation overview

Microsoft Azure Automation provides a way for users to automate the manual, long-running, error-prone, and frequently repeated tasks that are commonly performed in a cloud and enterprise environment. It saves time and increases the reliability of regular administrative tasks and even schedules them to be automatically performed at regular intervals. You can automate processes using runbooks or automate configuration management using Desired State Configuration. This article provides brief overview of Azure Automation and answers some common questions. You can refer to other articles in this library for more detailed information on the different topics.


## Automating processes with runbooks

A runbook is a set of tasks that perform some automated process in Azure Automation. It may be a simple process such as starting a virtual machine and creating a log entry, or you may have a complex runbook that combines other smaller runbooks to perform a complex process across multiple resources or even multiple clouds and on premise environments.  

For example, you might have an existing manual process for truncating a SQL database if it’s approaching maximum size that includes multiple steps such as connecting to the server, connecting to the database, get the current size of database, check if threshold has exceeded and then truncate it and notify user. Instead of manually performing each of these steps, you could create a runbook that would perform all of these tasks as a single process. You would start the runbook, provide the required information such as the SQL server name, database name, and recipient e-mail and then sit back while the process completes. 


## What can runbooks automate?

Runbooks in Azure Automation are based on Windows PowerShell or Windows PowerShell Workflow, so they do anything that PowerShell can do. If an application or service has an API, then a runbook can work with it. If you have a PowerShell module for the application, then you can load that module into Azure Automation and include those cmdlets in your runbook. Azure Automation runbooks run in the Azure cloud and can access any cloud resources or external resources that can be accessed from the cloud. Using [Hybrid Runbook Worker](automation-hybrid-runbook-worker.md), runbooks can run in your local data center to manage local resources. 


## Getting runbooks from the community

The [Runbook Gallery](automation-runbook-gallery.md#runbooks-in-runbook-gallery) contains runbooks from Microsoft and the community that you can either use unchanged in your environment or customize them for your own purposes. They are also useful to as references to learn how to create your own runbooks. You can even contribute your own runbooks to the gallery that you think other users may find useful. 


## Creating Runbooks with Azure Automation 

You can [create your own runbooks](automation-creating-importing-runbook.md) from scratch or modify runbooks from the [Runbook Gallery](http://msdn.microsoft.com/library/azure/dn781422.aspx) for your own requirements. There are three different [runbook types](automation-runbook-types.md) that you can choose from based on your requirements and PowerShell experience. If you prefer to work directly with the PowerShell code, then you can use a [PowerShell runbook](automation-runbook-types.md#powershell-runbooks) or [PowerShell Workflow runbook](automation-runbook-types.md#powershell-workflow-runbooks) that you edit offline or with the [textual editor](http://msdn.microsoft.com/library/azure/dn879137.aspx) in the Azure portal. If you prefer to edit a runbook without being exposed to the underlying code, then you can create a [Graphical runbook](automation-runbook-types.md#graphical-runbooks) using the [graphical editor](automation-graphical-authoring-intro.md) in the Azure portal. 

Prefer watching to reading? Have a look at the below video from Microsoft Ignite session in May 2015. Note: While the concepts and features discussed in this video are correct, Azure Automation has progressed a lot since this video was recorded, it now has a more extensive UI in the Azure portal, and supports additional capabilities.

> [AZURE.VIDEO microsoft-ignite-2015-automating-operational-and-management-tasks-using-azure-automation]


## Automating configuration management with Desired State Configuration 

[PowerShell DSC](https://technet.microsoft.com/library/dn249912.aspx) is a management platform that allows you to manage, deploy and enforce configuration for physical hosts and virtual machines using a declarative PowerShell syntax. You can define configurations on a central DSC Pull Server that target machines can automatically retrieve and apply. DSC provides a set of PowerShell cmdlets that you can use to manage configurations and resources.  

[Azure Automation DSC](automation-dsc-overview.md) is a cloud based solution for PowerShell DSC that provides services required for enterprise environments.  You can manage your DSC resources in Azure Automation and apply configurations to virtual or physical machines that retrieve them from a DSC Pull Server in the Azure cloud.  It also provides reporting services that inform you of important events such as when nodes have deviated from their assigned configuration and when a new configuration has been applied. 


## Creating your own DSC configurations with Azure Automation

[DSC configurations](automation-dsc-overview.md#azure-automation-dsc-terms) specify the desired state of a node.  Multiple nodes can apply the same configuration to assure that they all maintain an identical state.  You can create a configuration using any text editor on your local machine and then import it into Azure Automation where you can compile it and apply it nodes.


## Getting modules and configurations 

You can get [PowerShell modules](automation-runbook-gallery.md#modules-in-powershell-gallery) containing cmdlets that you can use in your runbooks and DSC configurations from the [PowerShell Gallery](http://www.powershellgallery.com/). You can launch this gallery from the Azure portal and import modules directly into Azure Automation, or you can download and import them manually. You cannot install the modules directly from the Azure portal, but you can download them install them as you would any other module. 


## Example practical applications of Azure Automation 

Following are just a few examples of what are the kinds of automation scenarios with Azure Automation. 

* Create and copy virtual machines in different Azure subscriptions. 
* Schedule file copies from a local machine to an Azure Blob Storage container. 
* Automate security functions such as deny requests from a client when a denial of service attack is detected. 
* Ensure machines continually align with configured security policy.
* Manage continuous deployment of application code across cloud and on premises infrastructure. 
* Build an Active Directory forest in Azure for your lab environment. 
* Truncate a table in a SQL database if DB is approaching maximum size. 
* Remotely update environment settings for an Azure website. 


## How does Azure Automation relate to other automation tools?

[Service Management Automation (SMA)](http://technet.microsoft.com/library/dn469260.aspx) is intended to automate management tasks in the private cloud. It is installed locally in your data center as a component of [Microsoft Azure Pack](https://www.microsoft.com/en-us/server-cloud/). SMA and Azure Automation use the same runbook format based on Windows PowerShell and Windows PowerShell Workflow, but SMA does not support [graphical runbooks](automation-graphical-authoring-intro.md).  

[System Center 2012 Orchestrator](http://technet.microsoft.com/library/hh237242.aspx) is intended for automation of on-premises resources. It uses a different runbook format than Azure Automation and Service Management Automation and has a graphical interface to create runbooks without requiring any scripting. Its runbooks are composed of activities from Integration Packs that are written specifically for Orchestrator. 


## Where can I get more information? 

A variety of resources are available for you to learn more about Azure Automation and creating your own runbooks. 

* **Azure Automation Library** is where you are right now. The articles in this library provide complete documentation on the configuration and administration of Azure Automation and for authoring your own runbooks. 
* [Azure PowerShell cmdlets](http://msdn.microsoft.com/library/jj156055.aspx) provides information for automating Azure operations using Windows PowerShell. Runbooks use these cmdlets to work with Azure resources. 
* [Management Blog](https://azure.microsoft.com/blog/tag/azure-automation/) provides the latest information on Azure Automation and other management technologies from Microsoft. You should subscribe to this blog to stay up to date with the latest from the Azure Automation team. 
* [Automation Forum](http://go.microsoft.com/fwlink/p/?LinkId=390561) allows you to post questions about Azure Automation to be addressed by Microsoft and the Automation community. 
* [Azure Automation Cmdlets](https://msdn.microsoft.com/library/mt244122.aspx) provides information for automating administration tasks. It contains cmdlets to manage Automation accounts, assets, runbooks, DSC.


## Can I provide feedback? 

**Please give us feedback!** If you are looking for an Azure Automation runbook solution or an integration module, post a Script Request on Script Center. If you have feedback or feature requests for Azure Automation, post them on [User Voice](http://feedback.windowsazure.com/forums/34192--general-feedback). Thanks! 


