---
title: Manage runbooks in Azure Automation
description: This article describes how to manage runbooks in Azure Automation.
services: automation
ms.subservice: process-automation
ms.date: 02/14/2019
ms.topic: conceptual
---
# Manage runbooks in Azure Automation

You can add a runbook to Azure Automation by either [creating a new one](#creating-a-runbook) or [importing an existing one](#importing-a-runbook) from a file or the [Runbook Gallery](automation-runbook-gallery.md). This article provides information on creating and importing runbooks from a file. You can get all the details of accessing community runbooks and modules in [Runbook and module galleries for Azure Automation](automation-runbook-gallery.md).

>[!NOTE]
>This article has been updated to use the new Azure PowerShell Az module. You can still use the AzureRM module, which will continue to receive bug fixes until at least December 2020. To learn more about the new Az module and AzureRM compatibility, see [Introducing the new Azure PowerShell Az module](https://docs.microsoft.com/powershell/azure/new-azureps-module-az?view=azps-3.5.0). For Az module installation instructions on your Hybrid Runbook Worker, see [Install the Azure PowerShell Module](https://docs.microsoft.com/powershell/azure/install-az-ps?view=azps-3.5.0). For your Automation account, you can update your modules to the latest version using [How to update Azure PowerShell modules in Azure Automation](automation-update-azure-modules.md).

## Creating a runbook

You can create a new runbook in Azure Automation using one of the Azure portals or Windows PowerShell. Once the runbook has been created, you can edit it using information in [Learning PowerShell Workflow](automation-powershell-workflow.md) and [Graphical authoring in Azure Automation](automation-graphical-authoring-intro.md).

### Create a runbook in the Azure portal

1. In the Azure portal, open your Automation account.
2. From the hub, select **Runbooks** under **Process Automation** to open the list of runbooks.
3. Click **Create a runbook**.
4. Enter a name for the runbook and select its [Type](automation-runbook-types.md). The runbook name must start with a letter and can contain letters, numbers, underscores, and dashes.
5. Click **Create** to create the runbook and open the editor.

### Create a runbook with PowerShell

You can use the [New-AzAutomationRunbook](https://docs.microsoft.com/powershell/module/az.automation/new-azautomationrunbook?view=azps-3.5.0) cmdlet to create an empty [PowerShell Workflow runbook](automation-runbook-types.md#powershell-workflow-runbooks). Use the `Type` parameter to specify one of the runbook types defined for `New-AzAutomationRunbook`.

The following example shows how to create a new empty runbook.

```azurepowershell-interactive
New-AzAutomationRunbook -AutomationAccountName MyAccount `
-Name NewRunbook -ResourceGroupName MyResourceGroup -Type PowerShell
```

## Importing a runbook

You can create a new runbook in Azure Automation by importing a PowerShell script or PowerShell Workflow (**.ps1**), an exported graphical runbook (**.graphrunbook**), or a Python2 script (**.py**).  You must specify the [type of runbook](automation-runbook-types.md) that is created during import, taking into account the following considerations.

* A **.ps1** file that doesn't contain a workflow can be imported into either a [PowerShell runbook](automation-runbook-types.md#powershell-runbooks) or a [PowerShell Workflow runbook](automation-runbook-types.md#powershell-workflow-runbooks). If you import it into a PowerShell Workflow runbook, it is converted to a workflow. In this case, comments are included in the runbook to describe the changes that have been made.

* A **.ps1** file containing a PowerShell Workflow can only be imported into a [PowerShell Workflow runbook](automation-runbook-types.md#powershell-workflow-runbooks). If the file contains multiple PowerShell workflows, the import fails. You must save each workflow to its own file and import each separately.

* A **.ps1** file containing a PowerShell Workflow should not be imported into a [PowerShell runbook](automation-runbook-types.md#powershell-runbooks), as the PowerShell script engine can't recognize it.

* A **.graphrunbook** file can only be imported into a new [graphical runbook](automation-runbook-types.md#graphical-runbooks). Note that you can only create a graphical runbook from a **.graphrunbook** file.

### Import a runbook from a file with the Azure portal

You can use the following procedure to import a script file into Azure Automation.

> [!NOTE]
> You can only import a **.ps1** file into a PowerShell Workflow runbook using the portal.

1. In the Azure portal, open your Automation account.
2. From the hub, select **Runbooks** under **Process Automation** to open the list of runbooks.
3. Click **Import a runbook**.
4. Click **Runbook file** and select the file to import.
5. If the **Name** field is enabled, you have the option of changing the runbook name. The name must start with a letter and can contain letters, numbers, underscores, and dashes.
6. The [runbook type](automation-runbook-types.md) is automatically selected, but you can change the type after taking the applicable restrictions into account.
7. Click **Create**. The new runbook appears in the list of runbooks for the Automation account.
8. You must [publish the runbook](#publishing-a-runbook) before you can run it.

> [!NOTE]
> After you import a graphical runbook or a graphical PowerShell Workflow runbook, you can convert it to another type. However, you can't convert one of these graphical runbooks to a textual runbook.

### Import a runbook from a script file with Windows PowerShell

Use the [Import-AzAutomationRunbook](https://docs.microsoft.com/powershell/module/az.automation/import-azautomationrunbook?view=azps-3.5.0) cmdlet to import a script file as a draft PowerShell Workflow runbook. If the runbook already exists, the import fails unless you use the `Force` parameter with the cmdlet.

The following example shows how to import a script file into a runbook.

```azurepowershell-interactive
$automationAccountName =  "AutomationAccount"
$runbookName = "Sample_TestRunbook"
$scriptPath = "C:\Runbooks\Sample_TestRunbook.ps1"
$RGName = "ResourceGroup"

Import-AzAutomationRunbook -Name $runbookName -Path $scriptPath `
-ResourceGroupName $RGName -AutomationAccountName $automationAccountName `
-Type PowerShellWorkflow
```

## Testing a runbook

When you test a runbook, the [Draft version](#publishing-a-runbook) is executed and any actions that it performs are completed. No job history is created, but the [Output](automation-runbook-output-and-messages.md#output-stream) and [Warning and Error](automation-runbook-output-and-messages.md#message-streams) streams are displayed in the Test output pane. Messages to the [Verbose stream](automation-runbook-output-and-messages.md#message-streams) are displayed in the Output pane only if the [VerbosePreference](automation-runbook-output-and-messages.md#preference-variables) variable is set to `Continue`.

Even though the draft version is being run, the runbook still executes normally and performs any actions against resources in the environment. For this reason, you should only test runbooks on non-production resources.

The procedure to test each [type of runbook](automation-runbook-types.md) is the same. There's no difference in testing between the textual editor and the graphical editor in the Azure portal.

1. Open the Draft version of the runbook in either the [textual editor](automation-edit-textual-runbook.md) or the [graphical editor](automation-graphical-authoring-intro.md).
1. Click the **Test** button to open the Test page.
1. If the runbook has parameters, they are listed in the left pane, where you can provide values to be used for the test.
1. If you want to run the test on a [Hybrid Runbook Worker](automation-hybrid-runbook-worker.md), change **Run Settings** to **Hybrid Worker** and select the name of the target group.  Otherwise, keep the default **Azure** to run the test in the cloud.
1. Click the **Start** button to begin the test.
1. You can use the buttons under the Output pane to stop or suspend a [PowerShell Workflow](automation-runbook-types.md#powershell-workflow-runbooks) or [graphical](automation-runbook-types.md#graphical-runbooks) runbook while it's being tested. When you suspend the runbook, it completes the current activity before being suspended. Once the runbook is suspended, you can stop it or restart it.
1. Inspect the output from the runbook in the Output pane.

## Publishing a runbook

When you create or import a new runbook, you must publish it before you can run it. Each runbook in Azure Automation has a Draft version and a Published version. Only the Published version is available to be run, and only the Draft version can be edited. The Published version is unaffected by any changes to the Draft version. When the Draft version should be made available, you publish it, overwriting the current Published version with the Draft version.

### Publish a runbook in the Azure portal

1. Open the runbook in the Azure portal.
2. Click **Edit**.
3. Click **Publish** and then **Yes** in response to the verification message.

### Publish a runbook using PowerShell

Use the [Publish-AzAutomationRunbook](https://docs.microsoft.com/powershell/module/Az.Automation/Publish-AzAutomationRunbook?view=azps-3.5.0) cmdlet to publish a runbook with Windows PowerShell. The following example shows how to publish a sample runbook.

```azurepowershell-interactive
$automationAccountName =  "AutomationAccount"
$runbookName = "Sample_TestRunbook"
$RGName = "ResourceGroup"

Publish-AzAutomationRunbook -AutomationAccountName $automationAccountName `
-Name $runbookName -ResourceGroupName $RGName
```

## Scheduling a runbook in the Azure portal

When your runbook has been published, you can schedule it for operation.

1. Open the runbook in the Azure portal.
2. Select **Schedules** under **Resources**.
3. Select **Add a schedule**.
4. In the Schedule Runbook pane, select **Link a schedule to your runbook**.
5. Choose **Create a new schedule** in the Schedule pane.
6. Enter a name, description, and other parameters in the New schedule pane. 
7. Once the schedule is created, highlight it and click **OK**. It should now be linked to your runbook.
8. Look for an email in your mailbox to notify you of the runbook status.

## Next steps

* To learn how you can benefit from the Runbook and PowerShell Module Gallery, see [Runbook and module galleries for Azure Automation](automation-runbook-gallery.md).
* To learn more about editing PowerShell and PowerShell Workflow runbooks with a textual editor, see [Editing textual runbooks in Azure Automation](automation-edit-textual-runbook.md).
* To learn more about graphical runbook authoring, see [Graphical authoring in Azure Automation](automation-graphical-authoring-intro.md).
