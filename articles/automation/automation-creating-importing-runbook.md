<properties 
	pageTitle="Creating or importing a runbook in Azure Automation"
	description="This article describes how to create a new runbook in Azure Automation or import one from a file."
	services="automation"
	documentationCenter=""
	authors="bwren"
	manager="stevenka"
	editor="tysonn" />
<tags 
	ms.service="automation"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="na"
	ms.workload="infrastructure-services"
	ms.date="09/22/2015"
	ms.author="bwren" />

# Creating or importing a runbook in Azure Automation

You can add a runbook to Azure Automation by either [creating a new one](#creating-a-new-runbook) or by importing an existing runbook from a file or from the [Runbook Gallery](automation-runbook-gallery.md). This article provides information on creating and importing runbooks from a file.  You can get all of the details on accessing community runbooks and modules in [Runbook and module galleries for Azure Automation](automation-runbook-gallery.md).

## Creating a new runbook

You can create a new runbook in Azure Automation using one of the Azure portals or Windows PowerShell. Once the runbook has been created, you can edit it using information in [Learning PowerShell Workflow](automation-powershell-workflow.md) and [Graphical authoring in Azure Automation](automation-graphical-authoring-intro.md).

### To create a new Azure Automation runbook with the Azure portal

You can only work with [PowerShell Workflow runbooks](automation-runbook-types.md#powershell-workflow-runbooks) in the Azure portal.

1. In the Azure portal, click, **New**, **App Services**, **Automation**, **Runbook**, **Quick Create**.
2. Enter the required information, and then click **Create**. The runbook name must start with a letter and can have letters, numbers, underscores, and dashes.
3. If you want to edit the runbook now, then click **Edit Runbook**. Otherwise, click **OK**.
4. Your new runbook will appear on the **Runbooks** tab.


### To create a new Azure Automation runbook with the Azure preview portal

1. In the Azure Preview Portal, open your Automation account. 
2. Click on the **Runbooks** tile to open the list of runbooks.
3. Click on the **Add a runbook** button and then **Create a new runbook**.
2. Type a **Name** for the runbook and select its [Type](automation-runbook-types.md). The runbook name must start with a letter and can have letters, numbers, underscores, and dashes.
3. Click **Create** to create the runbook and open the editor.


### To create a new Azure Automation runbook with Windows PowerShell

You can use the [New-AzureAutomationRunbook](https://msdn.microsoft.com/library/dn690272.aspx) cmdlet to create an empty [PowerShell Workflow runbook](automation-runbook-types.md#powershell-workflow-runbooks). You can either specify the **Name** parameter to create an empty runbook that you can later edit, or you can specify the **Path** parameter to import a script file. 

The following sample commands show how to create a new empty runbook.

    $automationAccountName = "MyAutomationAccount"
    $runbookName = "Sample-TestRunbook"
    New-AzureAutomationRunbook –AutomationAccountName $automationAccountName –Name $runbookName 

## Importing a runbook from a file into Azure Automation

You can create a new runbook in Azure Automation by importing a PowerShell script or PowerShell Workflow (.ps1 extension) or an exported graphical runbook (.graphrunbook).  You must specify the [type of runbook](automation-runbook-types.md) that will be created from the import taking into account the following considerations. 

- A .graphrunbook file may only be imported into a new [graphical runbook](automation-runbook-types.md#graphical-runbooks), and graphical runbooks can only be created from a .graphrunbook file.
- A .ps1 file containing a PowerShell Workflow can only be imported into a [PowerShell Workflow runbook](automation-runbook-types.md#powershell-workflow-runbooks).  If the file contains multiple PowerShell Workflows, then the import will fail. You must save each workflow to its own file and import each separately.
- A .ps1 file that does not contain a workflow can be imported into either a [PowerShell runbook](automation-runbook-types.md#powershell-runbooks) or a [PowerShell Workflow runbook](automation-runbook-types.md#powershell-workflow-runbooks).  If it is imported into a PowerShell Workflow runbook, then it will be converted to a workflow, and comments will be included in the runbook specifying the changes that were made.

### To import a runbook from a file with the Azure portal
You can use the following procedure to import a script file into Azure Automation.  Note that you can only import a .ps1 file into a PowerShell Workflow runbook using this portal.  You must use the Azure preview portal for other types.

1. In the Azure Management portal, select **Automation** and then select an Automation Account.
2. Click **Import**.
3. Click **Browse for File** and locate the script file to import.
4. If you want to edit the runbook now, then click **Edit Runbook**. Otherwise, click OK.
5. The new runbook will appear on the **Runbooks** tab for the Automation Account.
6. You must [publish the runbook](#publishing-a-runbook) before you can run it.


### To import a runbook from a file with the Azure preview portal
You can use the following procedure to import a script file into Azure Automation.  Note that you can only import a .ps1 file into a PowerShell Workflow runbook using this portal.

1. In the Azure Preview Portal, open your Automation account. 
2. Click on the **Runbooks** tile to open the list of runbooks.
3. Click on the **Add a runbook** button and then **Import**.
4. Click **Runbook file** to select the file to import
2. If the **Name** field is enabled, then you have the option to change it.  The runbook name must start with a letter and can have letters, numbers, underscores, and dashes.
3. Select a [runbook type](automation-runbook-types.md) taking into account the restrictions listed above.
3. The new runbook will appear in the list of runbooks for the Automation Account.
4. You must [publish the runbook](#publishing-a-runbook) before you can run it.

### To import a runbook from a script file with Windows PowerShell

You can use the [Set-AzureAutomationRunbookDefinition](https://msdn.microsoft.com/library/dn690267.aspx) cmdlet to import a script file into the Draft version of an existing runbook. The script file must contain a single Windows PowerShell Workflow. If the runbook already has a Draft version, then the import will fail unless you use the Overwrite parameter. After the runbook has been imported, you can publish it with [Publish-AzureAutomationRunbook](https://msdn.microsoft.com/library/dn690266.aspx).

The following sample commands show how to import a script file into an existing runbook and then publish it.

    $automationAccountName = "MyAutomationAccount"
    $runbookName = "Sample-TestRunbook"
    $scriptPath = "c:\runbooks\Sample-TestRunbook.ps1"

    Set-AzureAutomationRunbookDefinition –AutomationAccountName $automationAccountName –Name $runbookName –Path $ scriptPath -Overwrite
    Publish-AzureAutomationRunbook –AutomationAccountName $automationAccountName –Name $runbookName


## Publishing a runbook

When you create or import a new runbook, you must publish it before you can run it.  Each runbook in Azure Automation has a Draft and a Published version. Only the Published version is available to be run, and only the Draft version can be edited. The Published version is unaffected by any changes to the Draft version. When the Draft version should be made available, then you publish it which overwrites the Published version with the Draft version.

## To publish a runbook using the Azure portal

1. Open the runbook in the Azure portal.
1. At the top of the screen, click **Author**.
1. At the bottom of the screen, click **Publish** and then **Yes** to the verification message.

## To publish a runbook using the Azure preview portal

1. Open the runbook in the Azure preview portal.
1. Click the **Edit** button.
1. Click the **Publish** button and then **Yes** to the verification message.


## To publish a runbook using Windows PowerShell

You can use the [Publish-AzureAutomationRunbook](https://msdn.microsoft.com/library/dn690266.aspx) cmdlet to publish a runbook with Windows PowerShell. The following sample commands show how to publish a sample runbook.

	$automationAccountName = "MyAutomationAccount"
	$runbookName = "Sample-TestRunbook"
	
	Publish-AzureAutomationRunbook –AutomationAccountName $automationAccountName –Name $runbookName



## Related articles

- [Runbook and module galleries for Azure Automation](automation-runbook-gallery.md)
- [Editing textual runbooks in Azure Automation](automation-edit-textual-runbook.md)
- [Graphical authoring in Azure Automation](automation-graphical-authoring-intro.md)