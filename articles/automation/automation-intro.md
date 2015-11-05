<properties
	pageTitle="What is Azure Automation"
	description="Learn what value Azure Automation provides and get answers to common questions so that you can get started in creating and using runbooks."
	services="automation"
	documentationCenter=""
	authors="bwren"
	manager="stevenka"
	editor=""/>

<tags
	ms.service="automation"
	ms.workload="tbd"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article" 
	ms.date="09/17/2015"
	ms.author="bwren"/>

# What is Azure Automation?

Microsoft Azure Automation provides a way for users to automate the manual, long-running, error-prone, and frequently repeated tasks that are commonly performed in a cloud and enterprise environment.  This article provides brief answers to common questions about Azure Automation.  You can refer to other articles in this library for more detailed information on the different topics.

## What value does Azure Automation provide?

Azure Automation saves time and increases the reliability of the regular administrative tasks that you perform in cloud and enterprise environments.  You can implement these processes as runbooks which can perform multiple tasks with no human intervention and even schedule them to be automatically performed at regular intervals.   

## What is a runbook?

A runbook is a set of tasks that perform some automated process in Azure Automation.  It may be a simple process such as starting a virtual machine or creating a log entry, or you may have a complex runbook that combines other smaller runbooks to perform a complex process across multiple resources or even multiple clouds. 

For example, you might have an existing manual process for provisioning a new virtual machine that includes multiple steps such as creating the virtual machine, connecting it to a network, assigning it an IP address, and then notifying a user that it's ready.  Instead of manually performing each of these steps, you could create a runbook that would perform all of these tasks as a single process.  You would start the runbook, provide the required information such as the virtual machine name, IP address, and recipient e-mail and then sit back while the process completes without you. 


## What can runbooks automate?

Runbooks in Azure Automation are based on Windows PowerShell or Windows PowerShell Workflow, so they do anything that PowerShell can do.  If an application or service has an API, then a runbook can work with it.  If you have a PowerShell module for it, then you can load that module into Azure Automation and include those cmdlets in your runbook.  Azure Automation runbooks run in the Azure cloud so that can access any resources in the cloud or external resources that can be accessed from the cloud.  Using [Hybrid Runbook Worker](automation-hybrid-runbook-worker.md), runbooks can run in your local data center to manage local resources.


## Where do I get runbooks?

The [Runbook Gallery](http://msdn.microsoft.com/library/azure/dn781422.aspx) contains runbooks from Microsoft and the community that you can either use unchanged in your environment or customize them for your own purposes.  They are also useful to as references to learn how to create your own runbooks. You can even contribute your own runbooks to the gallery that you think other users may find useful.


## How do I create my own runbooks?

You can [create your own runbooks](http://msdn.microsoft.com/library/azure/dn643637.aspx) from scratch or modify runbooks from the [Runbook Gallery](http://msdn.microsoft.com/library/azure/dn781422.aspx) for your own requirements.  There are three different [runbook types](automation-runbook-types.md) that you can choose from based on your requirements and PowerShell experience.  If you prefer to work directly with the PowerShell code, then you can use a [PowerShell runbook](automation-runbook-types.md#powershell-runbooks) or [PowerShell Workflow runbook](automation-runbook-types.md#powershell-workflow-runbooks) that you edit offline or [using the textual editor](http://msdn.microsoft.com/library/azure/dn879137.aspx) in the Azure portal.  If you prefer to edit a runbook without being exposed to the underlying code, then you can create a [Graphical runbook](automation-runbook-types.md#graphical-runbooks) using the [graphical editor](automation-graphical-authoring-intro.md)  in the Azure preview portal.


## How does Azure Automation relate to other automation tools?

[Service Management Automation (SMA)](http://technet.microsoft.com/library/dn469260.aspx) is intended to automate management tasks in the private cloud.  It is installed locally in your data center as a component of [Windows Azure Pack](http://www.microsoft.com/server-cloud/products/windows-azure-pack/default.aspx). SMA and Azure Automation use the same runbook format based on Windows PowerShell and Windows PowerShell Workflow, but SMA does not support [graphical runbooks](automation-graphical-authoring-intro.md). 

[System Center 2012 Orchestrator](http://technet.microsoft.com/library/hh237242.aspx) is intended for automation of on-premises resources. It uses a different runbook format than Azure Automation and Service Management Automation and has a graphical interface to create runbooks without requiring any scripting. Its runbooks are composed of activities from Integration Packs that are written specifically for Orchestrator. 

## Where can I get more information?

A variety of resources are available for you to learn more about Azure Automation and creating your own runbooks.

- **Azure Automation Library** is where you are right now.  The articles in this library provide complete documentation on the configuration and administration of Azure Automation and for authoring your own runbooks.
- [Azure PowerShell cmdlets](http://msdn.microsoft.com/library/jj156055.aspx) provides information for automating Azure operations using Windows PowerShell.  Runbooks use these cmdlets to work with Azure resources.
- [Management Blog](http://azure.microsoft.com/blog/topics/management) provides the latest information on Azure Automation and other management technologies from Microsoft.  You should subscribe to this blog to stay up to date with the latest from the Azure Automation team.
- [Automation Forum](http://go.microsoft.com/fwlink/p/?LinkId=390561) allows you to post questions about Azure Automation to be addressed by Microsoft and the Automation community.

## Can I provide feedback?

**Please give us feedback!**  If you are looking for an Azure Automation runbook solution or an integration module, post a Script Request on Script Center. If you have feedback or feature requests for Azure Automation, post them on [User Voice](http://feedback.windowsazure.com/forums/34192--general-feedback). Thanks!
