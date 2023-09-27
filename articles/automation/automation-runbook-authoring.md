---
title: Runbook authoring using VS code in Azure Automation
description: This article provides an overview authoring runbooks in Azure Automation using the visual studio code.
services: automation
ms.subservice: process-automation
ms.date: 01/10/2023
ms.topic: conceptual
ms.custom:
---

# Runbook authoring through VS Code in Azure Automation

This article explains about the Visual Studio extension that you can use to create and manage runbooks. 

Azure Automation provides a new extension from VS Code to create and manage runbooks. Using this extension, you can perform all runbook management operations such as, creating and editing runbooks, triggering a job, tracking recent jobs output, linking a schedule, asset management, and local debugging. 

## Prerequisites 
- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).  
- [Visual Studio Code](https://code.visualstudio.com/).
- PowerShell modules and Python packages used by runbook must be locally installed on the machine to run the runbook locally. 

## Supported operating systems 

The test matrix includes the following operating systems:
1. **Windows Server 2022** with Windows PowerShell 5.1 and PowerShell Core 7.2.7
1. **Windows Server 2019** with Windows PowerShell 5.1 and PowerShell Core 7.2.7
1. **macOS 11** with PowerShell Core 7.2.7
1. **Ubuntu** 20.04 with PowerShell Core 7.2.7

>[!NOTE]
>- The extension should work anywhere in VS Code and it supports [PowerShell 7.2 or higher](/powershell/scripting/install/PowerShell-Support-Lifecycle?view=powershell-7.3&preserve-view=true). For Windows PowerShell, only version 5.1 is supported.
>-  PowerShell Core 6 is end-of-life and not supported.


## Key Features 

- **Simplified onboarding** – You can sign in using an Azure account in a simple and secure way. 
- **Multiple languages** - Supports all Automation runtime stack such as PowerShell 5, PowerShell 7, Python 2, and Python 3 Runbooks. 
- **Supportability**- Supports test execution of job, publishing Automation job and triggering job in Azure and Hybrid workers. You can execute runbooks locally.  
- Supports Python positional parameters and PowerShell parameters to trigger job. 
- **Webhooks simplified** – You can create a webhook, start a job through a webhook in simpler way. Also, support to link a schedule to a Runbook. 
- **Manage Automation Assets** – You can perform create, update, and delete operation against assets including certificates, variables, credentials, and connections. 
- **View properties** – You can view the properties and select Hybrid worker group to execute hybrid jobs and view the recent last 10 jobs executed. 
- **Debug locally** - You can debug the PowerShell scripts locally.
- **Runbook comparison** - You can compare the local runbook to the published or the draft runbook copy.
 
## Key Features of v1.0.8

- **Local directory configuration settings** - You can define the working directory that you want to save runbooks locally.
   - **Change Directory:Base Path** - You use the changed directory path when you reopen Visual Studio Code IDE. To change the directory using the Command Palette, use **Ctrl+Shift+P -> select Change Directory**. To change the base path from extension configuration settings, select **Manage** icon in the activity bar on the left and go to **Settings > Extensions > Azure Automation > Directory:Base Path**.
   - **Change Directory:Folder Structure** - You can change the local directory folder structure from *vscodeAutomation/accHash* to *subscription/resourceGroup/automationAccount*. Select **Manage** icon in the activity bar on the left and go to **Settings > Extensions > Azure Automation > Directory:Folder Structure**. You can change the default configuration setting from *vscodeAutomation/accHash* to *subscription/resourceGroupe/automationAccount* format.
    >[!NOTE]
    >If your automation account is integrated with source control you can provide the runbook folder path of your GitHub repo as the directory path. For example: changing directory to *C:\abc* would store runbooks in *C:\abc\vscodeAutomation..* or *C:\abc//subscriptionName//resourceGroupName//automationAccountName//runbookname.ps1*. 
- **Runbook management operations** - You can create runbook, fetch draft runbook, fetch published runbook, open local runbook in the editor, compare local runbook with a published or draft runbook copy, upload as draft, publish runbook, and delete runbook from your Automation account.
- **Runbook execution operations** - You can run a local version of Automation jobs such as, Start Automation jobs, Start Automation test job, view job outputs and run local version of the PowerShell Runbook in debug mode by allowing you to add breakpoints in the script. 
  >[!NOTE]
  > Currently, we support the use of internal cmdlets like `Get-AutomationVariable` only with non-encrypted assets.
 
- **Work with schedules, assets and webhooks** -  You can view the properties of a schedule, delete schedule, link schedule to link a schedule to a runbook.
- **Add webhook** - You can add a webhook to the runbook.
- **Update properties of assets** - You can create, update, view properties of assets such as Certificates, Connections, Credentials, Variables and Deletion of assets from the extension.


## Limitations
Currently, the following features aren't supported:  

- Creation of new schedules. 
- Adding new Certificates in Assets. 
- Upload Modules (PowerShell and Python) packages from the extension. 
- Auto-sync of local runbooks to Azure Automation account. You will have to perform the operation to **Fetch** or **Publish** runbook. 
- Management of Hybrid worker groups. 
- Graphical runbook and workflows. 
- For Python, we don't provide any debug options. We recommend that you install any debugger extension in your Python script.
- Currently, we support only the unencrypted assets in local run.

## Next steps

- For Runbook management operations and to test runbook and jobs, see [Use Azure Automation extension for Visual Studio Code](../automation/how-to/runbook-authoring-extension-for-vscode.md)
