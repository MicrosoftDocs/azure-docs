---
title: Integrate Azure Automation with Visual Stuido Team Services source control | Microsoft Docs
description: Scenario walks you through setting up integration with an Azure Automation account and Visual Stuido Team Services source control.
services: automation
documentationcenter: ''
author: eamono
manager: 
editor: ''
keywords: azure powershell, VSTS, source control, automation
ms.assetid: a43b395a-e740-41a3-ae62-40eac9d0ec00
ms.service: automation
ms.workload: infrastructure-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/24/2017 
---
# Azure Automation scenario - Automation source control integration with Visual Studio Team Services

In this scenario, you have a Visual Studio Team Services project that you are using to manage Azure Automation runbooks or DSC configurations under source control.
This article describes how to integrate VSTS with your Azure Automation environment so that continuous integration happens for each check-in.

## Getting the scenario

This scenario consists of two PowerShell runbooks that you can import directly from the [Runbook Gallery](automation-runbook-gallery.md) in the Azure portal or download from the [PowerShell Gallery](https://www.powershellgallery.com).

### Runbooks

Runbook | Description| 
--------|------------|
Sync-VSTS | Import runbooks or configurations from VSTS source control when a check-in is done. If run manually, it will import and publish all runbooks or configurations into the Automation account.| 
Sync-VSTSGit | Import runbooks or configurations from VSTS under Git source control when a check-in is done. If run manually, it will import and publish all runbooks or configurations into the Automation account.|

### Variables

Variable | Description|
-----------|------------|
VSToken | Secure variable asset you will create that contains the VSTS personal access token. You can learn how to create a VSTS personal access token on the [VSTS authentication page](https://www.visualstudio.com/en-us/docs/integrate/get-started/auth/overview). 
## Installing and configuring this scenario

Create a [personal access token](https://www.visualstudio.com/en-us/docs/integrate/get-started/auth/overview) in VSTS that you will use to sync the runbooks or configurations into your automation account.

![](media/automation-scenario-source-control-integration-with-VSTS/VSTSPersonalToken.png) 

Create a [secure variable](automation-variables.md) in your automation account to hold the personal access token so that the runbook can authenticate to VSTS and sync the runbooks or configurations into the Automation account. You can name this VSToken. 

![](media/automation-scenario-source-control-integration-with-VSTS/VSTSTokenVariable.png)

Import the runbook that will sync your runbooks or configurations into the automation account. You can use the [VSTS sample runbook](https://www.powershellgallery.com/packages/Sync-VSTS/1.0/DisplayScript) or the [VSTS with Git sample runbook] (https://www.powershellgallery.com/packages/Sync-VSTSGit/1.0/DisplayScript) from the PowerShellGallery.com depending on if you use VSTS source control or VSTS with Git and deploy to your automation account.

![](media/automation-scenario-source-control-integration-with-VSTS/VSTSPowerShellGallery.png)

You can now [publish](automation-creating-importing-runbook.md#publishing-a-runbook) this runbook so you can create a webhook. 
![](media/automation-scenario-source-control-integration-with-VSTS/VSTSPublishRunbook.png)

Create a [webhook](automation-webhooks.md) for this Sync-VSTS runbook and fill in the parameters as shown below. Make sure you copy the webhook url as you will need it for a service hook in VSTS. The VSAccessTokenVariableName is the name (VSToken) of the secure variable that you created earlier to hold the personal access token. 

Integrating with VSTS (Sync-VSTS.ps1) will take the following parameters.
### Sync-VSTS Parameters

Parameter | Description| 
--------|------------|
WebhookData | This will contain the checkin information sent from the VSTS service hook. You should leave this parameter blank.| 
ResourceGroup | This is the name of the resource group that the automation account is in.|
AutomationAccountName | The name of the automation account that will sync with VSTS.|
VSFolder | The name of the folder in VSTS where the runbooks and configurations exist.|
VSAccount | The name of the Visual Studio Team Services account.| 
VSAccessTokenVariableName | The name of the secure variable (VSToken) that holds the VSTS personal access token.| 


![](media/automation-scenario-source-control-integration-with-VSTS/VSTSWebhook.png)

If you are using VSTS with GIT (Sync-VSTSGit.ps1) it will take the following parameters.

Parameter | Description|
--------|------------|
WebhookData | This will contain the checkin information sent from the VSTS service hook. You should leave this parameter blank.| ResourceGroup | This the name of the resource group that the automation account is in.|
AutomationAccountName | The name of the automation account that will sync with VSTS.|
VSAccount | The name of the Visual Studio Team Services account.|
VSProject | The name of the project in VSTS where the runbooks and configurations exist.|
GitRepo | The name of the Git repository.|
GitBranch | The name of the branch in VSTS Git repository.|
Folder | The name of the folder in VSTS Git branch.|
VSAccessTokenVariableName | The name of the secure variable (VSToken) that holds the VSTS personal access token.|

![](media/automation-scenario-source-control-integration-with-VSTS/VSTSGitWebhook.png)

Create a service hook in VSTS for check-ins to the folder that triggers this webhook on code check-in. Select Web Hooks as the service to integrate with when you create a new subscription. You can learn more about service hooks on [VSTS Service Hooks documentation](https://www.visualstudio.com/en-us/docs/marketplace/integrate/service-hooks/get-started).
![](media/automation-scenario-source-control-integration-with-VSTS/VSTSServiceHook.png)

You should now be able to do all check-ins of your runbooks and configurations into VSTS and have these automatically sync’d into your automation account.

![](media/automation-scenario-source-control-integration-with-VSTS/VSTSSyncRunbookOutput.png)

If you run this runbook manually without being triggered by VSTS, you can leave the webhookdata parameter empty and it will do a full sync from the VSTS folder specified.

If you wish to uninstall the scenario, remove the service hook from VSTS, delete the runbook, and the VSToken variable.
