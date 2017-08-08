---
title: Update Azure modules in Azure Automation | Microsoft Docs
description: This article describes how you can now update common Azure PowerShell modules provided by default in Azure Automation.
services: automation
documentationcenter: ''
author: MGoedtel
manager: carmonm
editor: tysonn

ms.assetid: 
ms.service: automation
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 06/13/2017
ms.author: magoedte

---

# How to update Azure PowerShell modules in Azure Automation

The most common Azure PowerShell modules are provided by default in each Automation account.  The Azure team updates the Azure modules regularly, so in the Automation account we provide a way for you to update the modules in the account when new versions are available from the portal.  

Because modules are updated regularly by the product group, changes can occur with the  included cmdlets, which may negatively impact your runbooks depending on the type of change, such as renaming a parameter or deprecating a cmdlet entirely. To avoid impacting your runbooks and the processes they automate, it is strongly recommended that you test and validate before proceeding.  If you do not have a dedicated Automation account intended for this purpose, consider creating one so that you can test many different scenarios and permutations during the development of your runbooks, in addition to iterative changes such as updating the PowerShell modules.  After the results are validated and you have applied any changes required, proceed with coordinating the migration of any runbooks that required modification and perform the update as described below in production.     

## Updating Azure Modules

1. In the Modules blade of your Automation account there is an option called **Update Azure Modules**.  It is always enabled.<br><br> ![Update Azure Modules option in Modules blade](media/automation-update-azure-modules/automation-update-azure-modules-option.png)

2. Click **Update Azure Modules** and you will be presented with a confirmation notification that asks you if you want to continue.<br><br> ![Update Azure Modules notification](media/automation-update-azure-modules/automation-update-azure-modules-popup.png)

3. Click **Yes** and the module update process will begin.  The update process takes about 15-20 minutes to update the following modules:

  * Azure
  *	Azure.Storage
  *	AzureRm.Automation
  *	AzureRm.Compute
  *	AzureRm.Profile
  *	AzureRm.Resources
  *	AzureRm.Sql
  * AzureRm.Storage

    If the modules are already up to date, then the process will complete in a few seconds.  When the update process completes you will be notified.<br><br> ![Update Azure Modules update status](media/automation-update-azure-modules/automation-update-azure-modules-updatestatus.png)

> [!NOTE]
> Azure Automation will use the latest modules in your Automation account when a new scheduled job is run.    

If you use cmdlets from these Azure PowerShell modules in your runbooks to manage Azure resources, then you will want to perform this update process every month or so to assure that you have the latest modules.

## Next steps

* To learn more about Integration Modules and how to create custom modules to further integrate Automation with other systems, services, or solutions, see [Integration Modules](automation-integration-modules.md).

* Consider source control integration using [GitHub Enterprise](automation-scenario-source-control-integration-with-github-ent.md) or [Visual Studio Team Services](automation-scenario-source-control-integration-with-vsts.md) to centrally manage and control releases of your Automation runbook and configuration portfolio.  