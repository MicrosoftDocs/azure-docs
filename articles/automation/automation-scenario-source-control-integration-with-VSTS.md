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

In this scenario, you will have a Visual Studio Team Services project that you are using to manage Azure Automation runbooks or DSC configurations under source control.
This article describes how to integrate VSTS with your Azure Automation environment so that continuous integration happens for each check in.

## Getting the scenario

This scenario consists of two PowerShell runbooks that you can import directly from the [Runbook Gallery](automation-runbook-gallery.md) in the Azure portal or download from the [PowerShell Gallery](https://www.powershellgallery.com).

### Runbooks

Runbook | Description| 
--------|------------|
Sync-VSTS | Runbook will import runbooks or configurations from VSTS source control when a check in is done. If run manually, it will import and publish all runbooks or configurations into the Automation account.| 
Sync-VSTSGit | Runbook will import runbooks or configurations from VSTS under Git source control when a check in is done. If run manually, it will import and publish all runbooks or configurations into the Automation account.|

### Variables

Variable | Description|
-----------|------------|
VSToken | Secure variable asset you will create that contains the VSTS personal access token. You can learn how to create a VSTS personal access token on the [VSTS authentication page](https://www.visualstudio.com/en-us/docs/integrate/get-started/auth/overview). 
## Step 1:
Create a [personal access token](https://www.visualstudio.com/en-us/docs/integrate/get-started/auth/overview) in VSTS that you will use to sync the runbooks or configurations into your automation account.

![](media/automation-scenario-source-control-integration-with-VSTS/VSTSPersonalToken.png)
## Step 2:
Create a [secure variable](automation-variables.md) in your automation account to hold the personal access token so that the runbook can authenticate to VSTS and sync the runbooks into the Automation account. 

![](media/automation-scenario-source-control-integration-with-VSTS/VSTSTokenVariable.png)
## Step 3:
Import the runbook that will sync your runbooks or configurations into the automation account. You can use the [VSTS sample runbook](https://www.powershellgallery.com/packages/Sync-VSTS/1.0/DisplayScript) or the [VSTS with Git sample runbook] (https://www.powershellgallery.com/packages/Sync-VSTSGit/1.0/DisplayScript) from the PowerShellGallery.com depending on if you use VSTS source control or VSTS with Git and deploy to your automation account.

![](media/automation-scenario-source-control-integration-with-VSTS/VSTSPowerShellGallery.png)

You can now [publish](automation-creating-importing-runbook#to-publish-a-runbook-using-the-azure-portal.md) this runbook so you can create a webhook. 
![](media/automation-scenario-source-control-integration-with-VSTS/VSTSPublishRunbook.png)
## Step 4:
Create a [webhook](automation-webhooks.md) for this Sync-VSTS runbook and fill in the parameters as shown below. Make sure you copy the webhook url as you will need it for a service hook in VSTS. The VSAccessTokenVariableName is the name (VSToken) of the secure variable that you created earlier to hold the personal access token. 

Integrating with VSTS (Sync-VSTS.ps1) will take the following parameters.
![](media/automation-scenario-source-control-integration-with-VSTS/VSTSWebhook.png)

If you are using VSTS with GIT (Sync-VSTSGit.ps1) it will take the following parameters.
![](media/automation-scenario-source-control-integration-with-VSTS/VSTSGitWebhook.png)
## Step 5:
Create a service hook in VSTS for check ins to the folder that triggers this webhook on code check in. Select Web Hooks as the service to integrate with you create a new subscription. You can learn more about service hooks on [VSTS Service Hooks documentation](https://www.visualstudio.com/en-us/docs/marketplace/integrate/service-hooks/get-started).
![](media/automation-scenario-source-control-integration-with-VSTS/VSTSServiceHook.png)

You should now be able to do all checkins of your runbooks and configurations into VSTS and have these automatically sync’d into your automation account.

![](media/automation-scenario-source-control-integration-with-VSTS/VSTSSyncRunbookOutput.png)

If you run this runbook manually without being triggered by VSTS, you can leave the webhookdata parameter empty and it will just do full sync from the VSTS folder specified.
