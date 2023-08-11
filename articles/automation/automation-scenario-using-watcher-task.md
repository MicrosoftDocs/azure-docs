---
title: Track updated files with an Azure Automation watcher task
description: This article tells how to create a watcher task in the Azure Automation account to watch for new files created in a folder.
services: automation
ms.subservice: process-automation
ms.topic: how-to
ms.date: 12/17/2020
---

# Track updated files with a watcher task

Azure Automation uses a watcher task to look for events and trigger actions with PowerShell runbooks. The watcher task contains two parts, the watcher and the action. A watcher runbook runs at an interval defined in the watcher task, and outputs data to an action runbook.

> [!NOTE]
> Watcher tasks are not supported in Microsoft Azure operated by 21Vianet.

> [!IMPORTANT]
> Starting in May 2020, using Azure Logic Apps is the recommended and supported way to monitor for events, schedule recurring tasks, and trigger actions. See [Schedule and run recurring automated tasks, processes, and workflows with Azure Logic Apps](../logic-apps/concepts-schedule-automated-recurring-tasks-workflows.md).

This article walks you through creating a watcher task to monitor when a new file is added to a directory. You learn how to:

* Import a watcher runbook
* Create an Automation variable
* Create an action runbook
* Create a watcher task
* Trigger a watcher
* Inspect the output

## Prerequisites

To complete this article, the following are required:

* Azure subscription. If you don't have one yet, you can [activate your MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) or sign up for a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* [Automation account](./index.yml) to hold the watcher and action runbooks and the Watcher Task.
* A [hybrid runbook worker](automation-hybrid-runbook-worker.md) where the watcher task runs.
* PowerShell runbooks. PowerShell Workflow runbooks and Graphical runbooks aren't supported by watcher tasks.

## Import a watcher runbook

This article uses a watcher runbook called **Watcher runbook that looks for new files in a directory** to look for new files in a directory. The watcher runbook retrieves the last known write time to the files in a folder and looks at any files newer than that watermark.

You can import this runbook into your Automation account from the portal using the following steps.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for and select **Automation Accounts**. 
1. On the **Automation Accounts** page, select the name of your Automation account from the list.
1. In the left pane, select **Runbooks gallery** under **Process Automation**.
1. Make sure **GitHub** is selected in the **Source** drop-down list.
1. Search for **Watcher runbook**.
1. Select **Watcher runbook that looks for new files in a directory**, and select **Import** on the details page.
1. Give the runbook a name and optionally a description and click **OK** to import the runbook into your Automation account. You should see an **Import successful** message in a pane at the upper right of your window.
1. The imported runbook appears in the list under the name you gave it when you select Runbooks from the left-hand pane.
1. Click on the runbook, and on the runbook details page, select **Edit** and then click **Publish**. When prompted, click **Yes** to publish the runbook.

You can also download the runbook from the [Azure Automation GitHub organization](https://github.com/azureautomation).

1. Navigate to the Azure Automation GitHub organization page for [Watch-NewFile.ps1](https://github.com/azureautomation/watcher-runbook-that-looks-for-new-files-in-a-directory#watcher-runbook-that-looks-for-new-files-in-a-directory).
1. To download the runbook from GitHub, select **Code** from the right-hand side of the page, and then select **Download ZIP** to download the whole code in a zip file.
1. Extract the contents and [import the runbook](manage-runbooks.md#import-a-runbook-from-the-azure-portal).

## Create an Automation variable

An [Automation variable](./shared-resources/variables.md) is used to store the timestamps that the preceding runbook reads and stores from each file.

1. Select **Variables** under **Shared Resources** and click **+ Add a variable**.
1. Enter **Watch-NewFileTimestamp** for the name.
1. Select **DateTime** for the type. It will default to the current date and time.

   :::image type="content" source="./media/automation-watchers-tutorial/create-new-variable.png" alt-text="Screenshot of creating a new variable blade.":::

1. Click **Create** to create the Automation variable.

## Create an action runbook

An action runbook is used in a watcher task to act on the data passed to it from a watcher runbook. You must import a predefined action runbook, either from the Azure portal of from the [Azure Automation GitHub organization](https://github.com/azureautomation).

You can import this runbook into your Automation account from the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for and select **Automation Accounts**. 
1. On the **Automation Accounts** page, select the name of your Automation account from the list.
1. In the left pane, select **Runbooks gallery** under **Process Automation**.
1. Make sure **GitHub** is selected in the **Source** drop-down list.
1. Search for **Watcher action**, select **Watcher action that processes events triggered by a watcher runbook**, and click **Import**.
1. Optionally, change the name of the runbook on the import page, and then click **OK** to import the runbook. You should see an **Import successful** message in the notification pane in the upper right-hand side of the browser.
1. Go to your Automation Account page, and click on **Runbooks** on the left. Your new runbook should be listed under the name you gave it in the previous step. Click on the runbook, and on the runbook details page, select **Edit** and then click **Publish**. When prompted, click **Yes** to publish the runbook.

To create an action runbook by downloading it from the [Azure Automation GitHub organization](https://github.com/azureautomation):

1. Navigate to the Azure Automation GitHub organization page for [Process-NewFile.ps1](https://github.com/azureautomation/watcher-action-that-processes-events-triggerd-by-a-watcher-runbook).
1. To download the runbook from GitHub, select **Code** from the right-hand side of the page, and then select **Download ZIP** to download the whole code in a zip file.
1. Extract the contents and [import the runbook](manage-runbooks.md#import-a-runbook-from-the-azure-portal).

## Create a watcher task

In this step, you configure the watcher task referencing the watcher and action runbooks defined in the preceding sections.

1. Navigate to your Automation account and select **Watcher tasks** under **Process Automation**.
1. Select the Watcher tasks page and click **+ Add a watcher task**.
1. Enter **WatchMyFolder** as the name.

1. Select **Configure watcher** and choose the **Watch-NewFile** runbook.

1. Enter the following values for the parameters:

   * **FOLDERPATH** - A folder on the Hybrid Runbook Worker where new files get created, for example, **d:\examplefiles**.
   * **EXTENSION** - Extension for the configuration. Leave blank to process all file extensions.
   * **RECURSE** - Recursive operation. Leave this value as the default.
   * **RUN SETTINGS** - Setting for running the runbook. Pick the hybrid worker.

1. Click **OK**, and then **Select** to return to the Watcher page.
1. Select **Configure action** and choose the **Process-NewFile** runbook.
1. Enter the following values for the parameters:

   * **EVENTDATA** - Event data. Leave blank. Data is passed in from the watcher runbook.
   * **Run Settings** - Setting for running the runbook. Leave as Azure, as this runbook runs in Azure Automation.

1. Click **OK**, and then **Select** to return to the Watcher page.
1. Click **OK** to create the watcher task.

   :::image type="content" source="./media/automation-watchers-tutorial/watchertaskcreation.png" alt-text="Screenshot of configuring  watcher action in the Azure portal.":::


## Trigger a watcher

You must run a test as described below to ensure that the watcher task works as expected. 

1. Remote into the Hybrid Runbook Worker.
1. Open **PowerShell** and create a test file in the folder.

```azurepowerShell-interactive
New-Item -Name ExampleFile1.txt
```

The following example shows the expected output.

```output
    Directory: D:\examplefiles


Mode                LastWriteTime         Length Name
----                -------------         ------ ----
-a----       12/11/2017   9:05 PM              0 ExampleFile1.txt
```

## Inspect the output

1. Navigate to your Automation account and select **Watcher tasks** under **Process Automation**.
1. Select the watcher task **WatchMyFolder**.
1. Click on **View watcher streams** under **Streams** to see that the watcher has found the new file and started the action runbook.
1. To see the action runbook jobs, click on **View watcher action jobs**. Each job can be selected to view the details of the job.

   :::image type="content" source="./media/automation-watchers-tutorial/WatcherActionJobs.png" alt-text="Screenshot of a watcher action jobs from the Azure portal.":::


The expected output when the new file is found can be seen in the following example:

```output
Message is Process new file...

Passed in data is @{FileName=D:\examplefiles\ExampleFile1.txt; Length=0}
```

## Next steps

To learn more about authoring your own runbook, see [Create a PowerShell runbook](./learn/powershell-runbook-managed-identity.md).