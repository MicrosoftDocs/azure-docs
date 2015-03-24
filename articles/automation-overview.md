<properties 
   pageTitle="Automation"
   description="Automation"
   services="automation"
   documentationCenter=""
   authors="bwren"
   manager="stevenka"
   editor="tysonn" />
<tags 
   ms.service="automation"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="03/16/2015"
   ms.author="bwren" />

# Azure Automation


## Overview

Azure Automation is an IT process automation solution for Microsoft Azure. You can use it to automate the creation, monitoring, deployment, and maintenance of resources in your Azure environment.  Dev/Ops can use Automation to construct, run, and manage runbooks to integrate, orchestrate, and automate IT business processes. Automation runbooks run on the Windows PowerShell Workflow engine.

## Comparison to Other Automation Tools

The following table compares Orchestrator to the other Microsoft automation tools, Service Management Automation and Microsoft Azure Automation.

| Automation Tool | Primary Function | Access to Resources | Runbooks |
|:--- |:--- |:--- |:--- |
|[Orchestrator](http://aka.ms/runbookauthor/orchestrator)|Orchestrator is intended for automation of all on-premises resources. It uses a different runbook engine than Service Management Automation and Azure Automation.|Orchestrator runbooks can access resources that are on-premises and in the private cloud. They can access resources in Azure using the Windows Azure Integration Pack for Orchestrator.Orchestrator runbooks can manage Azure Automation using the Azure cmdlets or Service Management Automation using Service Management Automation PowerShell module.|Orchestrator has a graphical interface to create runbooks without requiring any scripting. Its runbooks are composed of activities from Integration Packs that are written specifically for Orchestrator. You can also use the Run .NET Script activity to run PowerShell to perform any functionality that is not included in an integration pack.|
|[Service Management Automation](http://aka.ms/runbookauthor/sma)|Service Management Automation is installed locally in your data center as a component of Windows Azure Pack and is intended to automate management tasks in the private cloud.|While runbooks in SMA will typically use System Center and Windows Azure Pack cmdlets to access WAP components, they can access any resource in your data center. They can include Azure cmdlets in order to manage components in the public cloud for hybrid scenarios.SMA runbooks can access Orchestrator through the Orchestrator PowerShell module and Azure Automation through the Azure PowerShell module.|Service Management Automation and Azure Automation use an identical runbook format based on Windows PowerShell Workflow. While runbooks in Azure Automation will primarily use Azure cmdlets to access public cloud resources, runbooks in SMA will typically use System Center and Windows Azure Pack cmdlets to access WAP components.|
|Azure Automation|Azure Automation runbooks run in the Azure public cloud and are intended to automate Azure-related management tasks.|Runbooks in Azure Automation cannot access resources in your data center that are not accessible from the public cloud. They also have no way to access Orchestrator or SMA runbooks.Azure Automation runbooks can access any external resources that can be accessed from a Windows PowerShell Workflow.|Service Management Automation and Azure Automation use an identical runbook format based on Windows PowerShell Workflow. While runbooks in Azure Automation will primarily use Azure cmdlets to access public cloud resources, runbooks in SMA will typically use System Center and Windows Azure Pack cmdlets to access WAP components.|

