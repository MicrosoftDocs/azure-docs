<properties 
   pageTitle="Editing a Runbook"
   description="Editing a Runbook"
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

# Editing a Runbook in Azure Automation

Each runbook in Azure Automation has two versions, Draft and Published. You edit the Draft version of the workflow and then publish it so it can be executed. The Published version cannot be edited.

## <a name="Portal"></a>To Edit a Runbook with the Azure Management Portal

The Azure Management Portal includes an editor that you can use to view and edit runbooks. In addition to providing basic text editing capabilities, the editor provides the ability to automatically insert code for [Global Assets](#InsertGlobalSetting), [Activities](#InsertActivity), and [Runbooks](#InsertRunbook).

1. In the Azure Management Portal, select **Automation** and then then click the name of an automation account.

2. Select the **Runbooks** tab.

3. Click the name of the runbook you want to edit.

4. Select the **Author** tab.

5. Either click **Draft** at the top of the screen or the **Edit** button at the bottom of the screen.

6. Perform the required editing.

7. Click **Save** when your edits are complete.

8. Click **Publish** if you want the latest draft version of the runbook to be published.

### Inserting Code into a Runbook

The Azure Automation editor includes a feature to insert code for Activities, Settings and Runbooks into a runbook. Rather than typing in the code yourself, you can select from a list of available assets and have the appropriate code inserted into the runbook.

#### <a name="InsertRunbook"></a>To Insert Code for a Runbook into a Runbook

1. Open the runbook in the Azure Management Portal editor.

2. At the bottom of the screen, click **Insert** and then **Runbook**.

3. Select the runbook to insert from the center column and click the right arrow.

4. If the runbook has parameters, they will be listed for your information.

5. Click the check button.

6. Code to run the selected runbook will be inserted into the current runbook.

7. If the runbook requires parameters, provide an appropriate value in place of the data type surrounded by braces <>.

#### <a name="InsertGlobalSetting"></a>To Insert a Global Asset into a Runbook

1. Open the runbook in the Azure Management Portal editor.

1. At the bottom of the screen, click **Insert** and then **Setting**.

1. In the **Setting Action** column, select the type of code that you require

1. Select from the available assets in the center column.

1. Click the check button.

#### <a name="InsertActivity"></a>To Insert an Activity into a Runbook

1. Open the runbook in the Azure Management Portal editor.

1. At the bottom of the screen, click **Insert** and then **Activity**.

1. In the **Integration Module** column, select the module that contains the activity.

1. In the **Activity** pane, select an activity.

1. In the **Description** column, note the description of the activity. Optionally, you can click View detailed help to launch help for the activity in the browser.

1. Click the right arrow.

1. If the activity has parameters, they will be listed for your information.

1. Click the check button.

1. Code to run the activity will be inserted into the runbook.

1. If the activity requires parameters, provide an appropriate value in place of the data type surrounded by braces <>.

## <a name="PowerShell"></a>To Edit an Azure Automation Runbook Using Windows PowerShell

To edit a runbook with Windows PowerShell, you edit the workflow using the editor of your choice and save it to a .ps1 file. You can use the [Get-AzureAutomationRunbookDefinition](http://aka.ms/runbookauthor/cmdlet/getazurerunbookdefinition) cmdlet to retrieve the contents of the runbook and then [Set-AzureAutomationRunbookDefinition](http://aka.ms/runbookauthor/cmdlet/setazurerunbookdefinition) cmdlet to replace the existing draft workflow with the modified one.

### To Retrieve the Contents of a Runbook Using Windows PowerShell

The following sample commands show how to retrieve the script for a runbook and save it to a script file. In this example, the Draft version is retrieved. It is also possible to retrieve the Published version of the runbook although this version cannot be changed.

    $automationAccountName = "MyAutomationAccount"
    $runbookName = "Sample-TestRunbook"
    $scriptPath = "c:\runbooks\Sample-TestRunbook.ps1"
    
    $runbookDefinition = Get-AzureAutomationRunbookDefinition -AutomationAccountName $automationAccountName -Name $runbookName -Slot Draft
    $runbookContent = $runbookDefinition.Content

    Out-File -InputObject $runbookContent -FilePath $scriptPath

### To Change the Contents of a Runbook Using Windows PowerShell

The following sample commands show how to replace the existing contents of a runbook with the contents of a script file containing a workflow. Note that this is the same sample procedure as in [To import a runbook from a script file with Windows PowerShell](../automation-creating-or-importing-a-runbook#ImportRunbookScriptPS).

    $automationAccountName = "MyAutomationAccount"
    $runbookName = "Sample-TestRunbook"
    $scriptPath = "c:\runbooks\Sample-TestRunbook.ps1"

    Set-AzureAutomationRunbookDefinition -AutomationAccountName $automationAccountName -Name $runbookName -Path $scriptPath -Overwrite
    Publish-AzureAutomationRunbook –AutomationAccountName $automationAccountName –Name $runbookName
