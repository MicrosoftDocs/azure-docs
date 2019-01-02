---
title: Creating or importing a runbook in Azure Automation
description: This article describes how to create a new runbook in Azure Automation or import one from a file.
services: automation
ms.service: automation
ms.component: process-automation
author: georgewallace
ms.author: gwallace
ms.date: 08/06/2018
ms.topic: conceptual
manager: carmonm
---
# Creating or importing a runbook in Azure Automation

You can add a runbook to Azure Automation by either [creating a new one](#creating-a-new-runbook) or by importing an existing runbook from a file or from the [Runbook Gallery](automation-runbook-gallery.md). This article provides information on creating and importing runbooks from a file.  You can get all of the details on accessing community runbooks and modules in [Runbook and module galleries for Azure Automation](automation-runbook-gallery.md).

## Creating a new runbook

You can create a new runbook in Azure Automation using one of the Azure portals or Windows PowerShell. Once the runbook has been created, you can edit it using information in [Learning PowerShell Workflow](automation-powershell-workflow.md) and [Graphical authoring in Azure Automation](automation-graphical-authoring-intro.md).

### To create a new Azure Automation runbook with the Azure portal

1. In the Azure portal, open your Automation account.
1. From the Hub, select **Runbooks** to open the list of runbooks.
1. Click on the **Add a runbook** button and then **Create a new runbook**.
1. Type a **Name** for the runbook and select its [Type](automation-runbook-types.md). The runbook name must start with a letter and can have letters, numbers, underscores, and dashes.
1. Click **Create** to create the runbook and open the editor.

### To create a new Azure Automation runbook with Windows PowerShell
You can use the [New-AzureRmAutomationRunbook](https://docs.microsoft.com/powershell/module/azurerm.automation/new-azurermautomationrunbook) cmdlet to create an empty [PowerShell Workflow runbook](automation-runbook-types.md#powershell-workflow-runbooks). The **Type** parameter should also be included to specify one of the four runbook types.

The following sample commands show how to create a new empty runbook.

```azurepowershell-interactive
New-AzureRmAutomationRunbook -AutomationAccountName MyAccount `
-Name NewRunbook -ResourceGroupName MyResourceGroup -Type PowerShell
```

## Importing a runbook from a file into Azure Automation

You can create a new runbook in Azure Automation by importing a PowerShell script or PowerShell Workflow (.ps1 extension), an exported graphical runbook (.graphrunbook), or a Python 2 script (.py extension).  You must specify the [type of runbook](automation-runbook-types.md) that is created during import, taking into account the following considerations.

* A .graphrunbook file may only be imported into a new [graphical runbook](automation-runbook-types.md#graphical-runbooks), and graphical runbooks can only be created from a .graphrunbook file.
* A .ps1 file containing a PowerShell Workflow can only be imported into a [PowerShell Workflow runbook](automation-runbook-types.md#powershell-workflow-runbooks).  If the file contains multiple PowerShell Workflows, then the import will fail. You must save each workflow to its own file and import each separately.
* A .ps1 file that does not contain a workflow can be imported into either a [PowerShell runbook](automation-runbook-types.md#powershell-runbooks) or a [PowerShell Workflow runbook](automation-runbook-types.md#powershell-workflow-runbooks).  If it is imported into a PowerShell Workflow runbook, then it is converted to a workflow, and comments are included in the runbook specifying the changes that were made.

### To import a runbook from a file with the Azure portal

You can use the following procedure to import a script file into Azure Automation.  

> [!NOTE]
> Note that you can only import a .ps1 file into a PowerShell Workflow runbook using the portal.

1. In the Azure portal, open your Automation account.
2. From the Hub, select **Runbooks** to open the list of runbooks.
3. Click on the **Add a runbook** button and then **Import**.
4. Click **Runbook file** to select the file to import
5. If the **Name** field is enabled, then you have the option to change it.  The runbook name must start with a letter and can have letters, numbers, underscores, and dashes.
6. The [runbook type](automation-runbook-types.md) is automatically selected, but you can change the type after taking the applicable restrictions into account. 
7. The new runbook appears in the list of runbooks for the Automation Account.
8. You must [publish the runbook](#publishing-a-runbook) before you can run it.

> [!NOTE]
> After you import a graphical runbook or a graphical PowerShell workflow runbook, you have the option to convert to the other type if wanted. You can’t convert to a textual runbook.
>  
> 

### To import a runbook from a script file with Windows PowerShell
You can use the [Import-AzureRMAutomationRunbook](https://docs.microsoft.com/powershell/module/azurerm.automation/import-azurermautomationrunbook) cmdlet to import a script file as a draft PowerShell Workflow runbook. If the runbook already exists, the import fails unless you use the *-Force* parameter. 

The following sample commands show how to import a script file into a runbook.

```azurepowershell-interactive
$automationAccountName =  "AutomationAccount"
$runbookName = "Sample_TestRunbook"
$scriptPath = "C:\Runbooks\Sample_TestRunbook.ps1"
$RGName = "ResourceGroup"

Import-AzureRMAutomationRunbook -Name $runbookName -Path $scriptPath `
-ResourceGroupName $RGName -AutomationAccountName $automationAccountName `
-Type PowerShellWorkflow
```

## Publishing a runbook

When you create or import a new runbook, you must publish it before you can run it.  Each runbook in Automation has a Draft and a Published version. Only the Published version is available to be run, and only the Draft version can be edited. The Published version is unaffected by any changes to the Draft version. When the Draft version should be made available, then you publish it, which overwrites the Published version with the Draft version.

## To publish a runbook using the Azure portal

1. Open the runbook in the Azure portal.
1. Click the **Edit** button.
1. Click the **Publish** button and then **Yes** to the verification message.

## To publish a runbook using Windows PowerShell
You can use the [Publish-AzureRmAutomationRunbook](https://docs.microsoft.com/powershell/module/azurerm.automation/publish-azurermautomationrunbook) cmdlet to publish a runbook with Windows PowerShell. The following sample commands show how to publish a sample runbook.

```azurepowershell-interactive
$automationAccountName =  "AutomationAccount"
$runbookName = "Sample_TestRunbook"
$RGName = "ResourceGroup"

Publish-AzureRmAutomationRunbook -AutomationAccountName $automationAccountName `
-Name $runbookName -ResourceGroupName $RGName
```

## Next Steps

* To learn about how you can benefit from the Runbook and PowerShell Module Gallery, see  [Runbook and module galleries for Azure Automation](automation-runbook-gallery.md)
* To learn more about editing PowerShell and PowerShell Workflow runbooks with a textual editor, see [Editing textual runbooks in Azure Automation](automation-edit-textual-runbook.md)
* To learn more about Graphical runbook authoring, see [Graphical authoring in Azure Automation](automation-graphical-authoring-intro.md)