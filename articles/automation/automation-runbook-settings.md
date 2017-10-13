---
title: Runbook settings | Microsoft Docs
description: Describes the configuration settings for a runbook in Azure Automation and how to change them using both the Azure Management Portal and Windows PowerShell.
services: automation
documentationcenter: ''
author: mgoedtel
manager: stevenka
editor: tysonn

ms.assetid: a726f20c-a952-48b8-88ee-36d76aa3ac61
ms.service: automation
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 11/11/2016
ms.author: bwren

---
# Runbook settings
Each runbook in Azure Automation has multiple settings that help it to be identified and to change its logging behavior. Each of these settings is described below followed by procedures on how to modify them.

## Settings
### Name and description
You cannot change the name of a runbook after it has been created. The Description is optional and can be up to 512 characters.

### Tags
Tags allow you to assign distinct words and phrases to help identify a runbook. For example, when you submit a runbook to the [PowerShell Gallery](https://www.powershellgallery.com/), you specify particular tags to identify which categories the runbook should be listed in. You can specify multiple tags for a runbook by separating them with commas.

### Logging
By default, Verbose and Progress records are not written to job history. You can change the settings for a particular runbook to log these records. For more information on these records, see [Runbook Output and Messages](automation-runbook-output-and-messages.md).

## Changing runbook settings

### Changing runbook settings with the Azure portal
You can change settings for a runbook in the Azure portal from the **Settings** blade for the runbook.

1. In the Azure portal, select **Automation** and then then click the name of an automation account.
2. Select the **Runbooks** tab.
3. Click the name of a runbook and you are directed to the settings blade for the runbook. From here you can specify or modify tags, the runbook description, configure logging and tracing settings, and access support tools to help you solve problems.     

### Changing runbook settings with Windows PowerShell
You can use the [Set-AzureRmAutomationRunbook](https://msdn.microsoft.com/library/mt603786.aspx) cmdlet to change the settings for a runbook. If you want to specify multiple tags, you can either provide an array or a single string with comma delimited values to the Tags parameter. You can get the current tags with the [Get-AzureRmAutomationRunbook](https://msdn.microsoft.com/library/mt603728.aspx).

The following sample commands show how to set the properties for a runbook. This sample adds three tags to the existing tags and specifies that verbose records should be logged.

    $automationAccountName = "MyAutomationAccount"
    $runbookName = "Sample-TestRunbook"
    $tags = (Get-AzureRmAutomationRunbook -ResourceGroupName "ResourceGroup01" `
    –AutomationAccountName $automationAccountName –Name $runbookName).Tags
    $tags += "Tag1,Tag2,Tag3"
    Set-AzureRmAutomationRunbook -ResourceGroupName "ResourceGroup01" `
    –AutomationAccountName $automationAccountName –Name $runbookName –LogVerbose $true –Tags $tags

## Next steps
* To learn how to create and retrieve output and error messages from runbooks, see [Runbook Output and Messages](automation-runbook-output-and-messages.md) 
* To understand how to add a runbook that was already developed by the community or other source, or to create your own runbook see [Creating or Importing a Runbook](automation-creating-importing-runbook.md) 

