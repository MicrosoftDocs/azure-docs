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
ms.author: eamono
---
# Azure Automation scenario - Automation source control integration with Visual Studio Team Services

In this scenario, you will have a Visual Studio Team Services project that you are using to manage Azure Automation runbooks or DSC configurations under source control.
This article describes how to integrate VSTS with your Azure Automation environment so that continuous integration happens for each check in.

## Step 1:
Create a personal access token in VSTS that you will use to sync the runbooks or configurations into your automation account.

![](media/automation-scenario-source-control-integration-with-VSTS/VSTSPersonalToken.png)
## Step 2:
Create a secure variable in your automation account to hold the token.

![](media/automation-scenario-source-control-integration-with-VSTS/VSTSTokenVariable.png)
## Step 3:
Import the runbook that will sync your runbooks or configurations into the automation account. You can use the [VSTS sample runbook](https://www.powershellgallery.com/packages/Sync-VSTS/1.0/DisplayScript) or the [VSTS with Git sample runbook] (https://www.powershellgallery.com/packages/Sync-VSTSGit/1.0/DisplayScript) from the PowerShellGallery.com depending on if you use VSTS source control or VSTS with Git and deploy to your automation account.

![](media/automation-scenario-source-control-integration-with-VSTS/VSTSPowerShellGallery.png)

You can now publish this runbook so you can create a webhook. 
![](media/automation-scenario-source-control-integration-with-VSTS/VSTSPublishRunbook.png)
## Step 4:
Create a webhook for this Sync-VSTS runbook and fill in the parameters as shown below. Make sure you copy the webhook url as you will need it for a service hook in VSTS. The VSAccessTokenVariableName is the name of the secure variable you created earlier to hold the personal access token. 

Integrating with VSTS (Sync-VSTS.ps1) will take the following parameters.
![](media/automation-scenario-source-control-integration-with-VSTS/VSTSWebhook.png)

If you are using VSTS with GIT (Sync-VSTSGit.ps1) it will take the following parameters.
![](media/automation-scenario-source-control-integration-with-VSTS/VSTSGitWebhook.png)
## Step 5:
Create a service hook in VSTS for check ins to the folder that triggers this webhook on code check in.

![](media/automation-scenario-source-control-integration-with-VSTS/VSTSServiceHook.png)

You should now be able to do all checkins of your runbooks and configurations into VSTS and have these automatically sync’d into your automation account.

![](media/automation-scenario-source-control-integration-with-VSTS/VSTSSyncRunbookOutput.png)

If you run this runbook manually without being triggered by VSTS, you can leave the webhookdata parameter empty and it will just do full sync from the VSTS folder specified.
