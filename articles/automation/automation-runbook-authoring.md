---
title: Runbook authoring using VS code in Azure Automation
description: This article provides an overview authoring runbooks in Azure Automation using the visual studio code.
services: automation
ms.subservice: process-automation
ms.date: 12/18/2022
ms.topic: conceptual
ms.custom: devx-track-azurepowershell
---

# Runbook authoring through VS Code in Azure Automation

This article explains about the extension that you can use through Visual Studio Code, to create and manage runbooks. 

Azure Automation provides a new extension from VS Code to create and manage runbooks. Using this extension, you can perform all runbook operations such as, create and edit runbooks, trigger a job, track recent jobs output, link a schedule and asset management. 

## Prerequisites 
- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).  

- PowerShell modules and Python packages used by runbook must be locally installed on the machine to run the runbook locally. 

## Supported operating systems 
Currently, the extension supports the following 64-bit operating systems: 
- Windows 
- Linux 

## Key Features 

- **Simplified onboarding** – You can sign in using an Azure account in a simple and secure way. 
- **Multiple languages** - Supports all Automation runtime stack such as PowerShell 5, PowerShell 7, Python 2, and Python 3 Runbooks. 
- **Supportability**- Supports test execution of job, publishing Automation job and triggering job in Azure and Hybrid workers. You can execute runbooks locally.  
Supports Python positional parameters and PowerShell parameters to trigger job. 
- **Webhooks simplified** – You can create a webhook, start a job through a webhook in simpler way. Also, support to link a schedule to a Runbook. 
- **Manage Automation Assets** – You can perform create, update, and delete operation against assets including certificates, variables, credentials, and connections. 
- **View properties** – You can view the properties and select Hybrid worker group to execute hybrid jobs and view the recent last 10 jobs executed. 
 
## Key Features of v1.0.6
- **Local directory operation** - You can define the working directory that you want to save runbooks locally.
- **Runbook management operations** - You can create runbook, fetch draft runbook, fetch published runbook, open local runbook in the editor, upload as draft, publish runbook and delete runbook from your Automation account.
- **Test Runbook and Jobs** - You can run a local version of Automation jobs. Start Automation jobs, Start Automation test job, and view job outputs
- **Work with schedules, assets and webhooks** -  You can view the properties of a schedule, delete schedule, link schedule to link a schedule to a runbook.
- **Add webhook** - You can add a webhook to the runbook.
- **Update properties of assets** - You can create, update, view properties of assets such as Certificates, Connections, Credentials, Variables and Deletion of assets from the extension.


## Limitations
Currently, the following list of features aren't supported:  

- Creation of new schedules. 
- Adding new certificates. 
- Upload Modules (PowerShell and Python) packages from the extension. 
- Auto-sync of local runbooks to Azure Automation account runbooks. Ensure to perform the **Fetch** or **Publish** runbook. 
- Management of Hybrid worker groups. 
- Graphical runbook and workflows. 

## Next steps

- For Runbook management operations and to test runbook and jobs, see [Use Azure Automation extension for Visual Studio Code](../automation/how-to/runbook-authoring-extension-for-vscode.md)

