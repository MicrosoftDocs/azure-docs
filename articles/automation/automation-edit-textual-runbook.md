---
title: Edit textual runbooks in Azure Automation
description: This article tells how to use the Azure Automation textual editor to work with PowerShell and PowerShell Workflow runbooks.
services: automation
ms.service: automation
ms.subservice: process-automation
author: mgoedtel
ms.author: magoedte
ms.date: 08/01/2018
ms.topic: conceptual
manager: carmonm
---
# Edit textual runbooks in Azure Automation

You can use the textual editor in Azure Automation to edit [PowerShell runbooks](automation-runbook-types.md#powershell-runbooks) and [PowerShell Workflow runbooks](automation-runbook-types.md#powershell-workflow-runbooks). This editor has the typical features of other code editors, such as IntelliSense. It also uses color coding with additional special features to assist you in accessing resources common to runbooks. 

The textual editor includes a feature to insert code for cmdlets, assets, and child runbooks into a runbook. Instead of typing in the code yourself, you can select from a list of available resources and the editor inserts the appropriate code into the runbook.

Each runbook in Azure Automation has two versions, Draft and Published. You edit the Draft version of the runbook and then publish it so it can be executed. The Published version cannot be edited. For more information, see [Publish a runbook](manage-runbooks.md#publish-a-runbook).

This article provides detailed steps for performing different functions with this editor. These are not applicable to [graphical runbooks](automation-runbook-types.md#graphical-runbooks). To work with these runbooks, see [Graphical authoring in Azure Automation](automation-graphical-authoring-intro.md).

## Edit a runbook with the Azure portal

1. In the Azure portal, select your Automation account.
2. Under **PROCESS AUTOMATION**, select **Runbooks** to open the list of runbooks.
3. Choose the runbook to edit and then click **Edit**.
4. Edit the runbook.
5. Click **Save** when your edits are complete.
6. Click **Publish** if you want to publish the latest draft version of the runbook.

### Insert a cmdlet into a runbook

1. In the canvas of the textual editor, position the cursor where you want to place the cmdlet.
2. Expand the **Cmdlets** node in the Library control.
3. Expand the module containing the cmdlet to use.
4. Right-click the cmdlet name to insert and select **Add to canvas**. If the cmdlet has more than one parameter set, the editor adds the default set. You can also expand the cmdlet to select a different parameter set.
5. Note that the code for the cmdlet is inserted with its entire list of parameters.
6. Provide an appropriate value in place of the value surrounded by angle brackets (<>) for any required parameters. Remove any parameters that you don't need.

### Insert code for a child runbook into a runbook

1. In the canvas of the textual editor, position the cursor where you want to place the code for the [child runbook](automation-child-runbooks.md).
2. Expand the **Runbooks** node in the Library control.
3. Right-click the runbook to insert and select **Add to canvas**.
4. The code for the child runbook is inserted with any placeholders for any runbook parameters.
5. Replace the placeholders with appropriate values for each parameter.

### Insert an asset into a runbook

1. In the Canvas control of the textual editor, position the cursor where you want to place the code for the child runbook.
2. Expand the **Assets** node in the Library control.
3. Expand the node for the desired asset type.
4. Right-click the asset name to insert and select **Add to canvas**. For [variable assets](automation-variables.md), select either **Add "Get Variable" to canvas** or **Add "Set Variable" to canvas**, depending on whether you want to get or set the variable.
5. Note that the code for the asset is inserted into the runbook.

## Edit an Azure Automation runbook using Windows PowerShell

To edit a runbook with Windows PowerShell, use the editor of your choice and save the runbook to a **.ps1** file. You can use the [Export-AzAutomationRunbook](/powershell/module/Az.Automation/Export-AzAutomationRunbook) cmdlet to retrieve the contents of the runbook. You can use the  [Import-AzAutomationRunbook](/powershell/module/Az.Automation/import-azautomationrunbook) cmdlet to replace the existing draft runbook with the modified one.

### Retrieve the contents of a runbook using Windows PowerShell

The following sample commands show how to retrieve the script for a runbook and save it to a script file. In this example, the Draft version is retrieved. It's also possible to retrieve the Published version of the runbook, although this version can't be changed.

```powershell-interactive
$resourceGroupName = "MyResourceGroup"
$automationAccountName = "MyAutomatonAccount"
$runbookName = "Hello-World"
$scriptFolder = "c:\runbooks"

Export-AzAutomationRunbook -Name $runbookName -AutomationAccountName $automationAccountName -ResourceGroupName $resourceGroupName -OutputFolder $scriptFolder -Slot Draft
```

### Change the contents of a runbook using Windows PowerShell

The following sample commands show how to replace the existing contents of a runbook with the contents of a script file. 

```powershell-interactive
$resourceGroupName = "MyResourceGroup"
$automationAccountName = "MyAutomatonAccount"
$runbookName = "Hello-World"
$scriptFolder = "c:\runbooks"

Import-AzAutomationRunbook -Path "$scriptfolder\Hello-World.ps1" -Name $runbookName -Type PowerShell -AutomationAccountName $automationAccountName -ResourceGroupName $resourceGroupName -Force
Publish-AzAutomationRunbook -Name $runbookName -AutomationAccountName $automationAccountName -ResourceGroupName $resourceGroupName
```

## Next steps

* [Manage runbooks in Azure Automation](manage-runbooks.md).
* [Learning PowerShell workflow](automation-powershell-workflow.md).
* [Graphical authoring in Azure Automation](automation-graphical-authoring-intro.md).
* [Certificates](automation-certificates.md).
* [Connections](automation-connections.md).
* [Credentials](automation-credentials.md).
* [Schedules](automation-schedules.md).
* [Variables](automation-variables.md).
* [PowerShell cmdlet reference](https://docs.microsoft.com/powershell/module/az.automation/?view=azps-3.7.0#automation).
