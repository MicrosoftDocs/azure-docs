<properties 
   pageTitle="Creating or Importing a Runbook"
   description="Creating or Importing a Runbook"
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
   ms.date="03/16/2015"
   ms.author="bwren" />

# Creating or Importing a Runbook

You can add a runbook to Azure Automation by either [Creating a new Azure Automation Runbook](#CreateRunbook) or importing an existing runbook from a file or from the Runbook Gallery. This topic provides procedures for each of these methods.

## Creating a new Azure Automation Runbook

You can create a new runbook in Azure Automation using either the Azure Management Portal or Windows PowerShell. Once the runbook has been created, you can edit it using information in the [Runbook Authoring Guide](http://aka.ms/runbookauthor).

### To create a new Azure Automation runbook with the Azure Management Portal

1. In the Azure Management Portal, click, **New**, **App Services**, **Automation**, **Runbook**, **Quick Create**.

2. Enter the required information, and then click **Create**. The runbook name must start with a letter and can have letters, numbers, underscores, and dashes.

3. If you want to edit the runbook now, then click **Edit Runbook**. Otherwise, click **OK**.

4. Your new runbook will appear on the **Runbooks** tab.

### To create a new Azure Automation runbook with Windows PowerShell

You can use the [New-AzureAutomationRunbook](http://aka.ms/runbookauthor/cmdlet/newazurerunbook) cmdlet to create an empty runbook in Azure Automation. You can either specify the Name parameter to create an empty runbook that you can later edit, or you can specify the Path parameter to import a script file. The script file must contain a single Windows PowerShell Workflow. The name of the file will be used for the name of the workflow.

The following sample commands show how to create a new empty runbook.

    $automationAccountName = "MyAutomationAccount"
    $runbookName = "Sample-TestRunbook"
    New-AzureAutomationRunbook –AutomationAccountName $automationAccountName –Name $runbookName

## Importing a Runbook into Azure Automation

### To import a runbook from the Runbook Gallery

The [Runbook Gallery](http://aka.ms/runbookgallery) provides a variety of runbooks from Microsoft and the community that you can import into Azure Automation. You can either download these runbooks and then [To import a runbook from a script file with the Azure Management portal](#ImportRunbookScript), or you can import them directly into Azure Automation using the following procedure.

1. In the Azure Management portal, click, **New**, **App Services**, **Automation**, **Runbook**, **From Gallery**.

2. Select a category to view related runbooks, and select a runbook to view its details. When you select the runbook you want, click the right arrow button.

3. Review the contents of the runbook and note any requirements in the description. Click the right arrow button when you’re done.

4. Enter the runbook details and then click the checkmark button. The runbook name will already be filled in.

5. The runbook will appear on the **Runbooks** tab for the Automation Account.

You can only import directly from the Runbook Gallery using the Azure portal. You cannot perform this function using Windows PowerShell.

>[AZURE.NOTE] You should validate the contents of any runbooks that you get from the Runbook Gallery and use extreme caution in installing and running them in a production environment.|

### To import a runbook from a script file with the Azure Management portal

When you import a script file into Azure Automation, changes may be made to the script when it is imported to convert it into a valid runbook. Comments will be included in the final runbook describing the changes that were made in order to perform the conversion.

- If the script file contains a single [Windows PowerShell workflow](http://aka.ms/runbookauthor/powershellworkflows), then it will be imported directly into Azure Automation without any changes.

- If the script file contains multiple workflows, then the import will fail. You must save each workflow to its own script file and import each separately.

- If the script file does not contain a workflow, then it will be imported and converted to a workflow. See the comments in the runbook for the changes that were made.

You can use the following procedure to import a script file into Azure Automation.

1. In the Azure Management portal, select **Automation** and then select an Automation Account.

2. Click **Import**.

3. Click **Browse for File** and locate the script file to import.

4. If you want to edit the runbook now, then click **Edit Runbook**. Otherwise, click OK.

5. Your new runbook will appear on the **Runbooks** tab for the Automation Account.

### <a name="ImportRunbookScriptPS"></a>To import a runbook from a script file with Windows PowerShell

You can use the [Set-AzureAutomationRunbookDefinition](http://aka.ms/runbookauthor/cmdlet/setazurerunbookdefinition) cmdlet to import a script file into the Draft version of an existing runbook. The script file must contain a single Windows PowerShell Workflow. If the runbook already has a Draft version, then the import will fail unless you use the Overwrite parameter. After the runbook has been imported, you can publish it with [Publish-AzureAutomationRunbook](http://aka.ms/runbookauthor/cmdlet/publishazurerunbook).

The following sample commands show how to import a script file into an existing runbook and then publish it.

    $automationAccountName = "MyAutomationAccount"
    $runbookName = "Sample-TestRunbook"
    $scriptPath = "c:\runbooks\Sample-TestRunbook.ps1"

    Set-AzureAutomationRunbookDefinition –AutomationAccountName $automationAccountName –Name $runbookName –Path $ scriptPath -Overwrite
    Publish-AzureAutomationRunbook –AutomationAccountName $automationAccountName –Name $runbookName
