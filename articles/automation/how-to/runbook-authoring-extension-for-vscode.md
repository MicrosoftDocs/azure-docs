---
title: Azure Automation extension for Visual Studio Code
description: Learn how to use the Azure Automation extension for Visual Studio Code to author runbooks.
ms.date: 01/10/2023
ms.topic: how-to
---

# Use Azure Automation extension for Visual Studio Code

This article explains about the Visual Studio that you can use to create and manage runbooks. You can perform all runbook management operations such as creating runbooks, editing runbook, triggering a job, tracking recent jobs outputs, linking a schedule, asset management and local debugging.


## Prerequisites

The following items are required for completing the steps in this article:

- An Azure subscription. If you don't have an Azure subscription, create a
  [free account](https://azure.microsoft.com/free/) 
- [Visual Studio Code](https://code.visualstudio.com).
- PowerShell modules and Python packages used by runbook must be locally installed on the machine to run the runbook locally. 

## Install and configure the Azure Automation extension

After you meet the prerequisites, you can install the [Azure Automation extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=azure-automation.vscode-azureautomation&ssr=false#overview) by
following these steps:

1. Open Visual Studio Code.
1. From the menu bar, go to **View** > **Extensions**.
1. In the search box, enter **Azure Automation**.
1. Select **Azure Automation** from the search results, and then select **Install**.
1. Select **Reload** when necessary.

## Connect to Azure Account

To view all the resources within your Automation account, you must connect to your Azure account. Follow the steps to connect to Azure from Visual Studio Code:

1. You can sign in to Azure from the Azure Automation extension or the Command Palette.
    - To sign in from the Azure Automation extension: select **Sign in to Azure**. 
   
      Or

    - To sign in from the Command Palette: from the menu bar, go to **View > Command Palette** and enter **Azure:Sign-in**.

1.  Follow the sign in instructions to sign in to Azure.
    After you're connected, you will find the Azure account name on the status bar of Visual Studio Code. 

## Select subscriptions

When you sign in for the first time, the extension loads only the default subscription resources and Automation accounts. To add or remove subscriptions, follow these steps:

1. You can use the Command Palette or the window footer to start the subscription command.
    - To sign in from Command Palette - from the menu bar, go to **View > Command Palette** and enter **Azure: Select Subscriptions**.
    
      Or

    - To sign in from window footer - In the window footer, select the segment that matches **Azure: your account**.

1. Use the filter to find the subscriptions by name.
1. Check or uncheck each subscription to add or remove them from the list of subscriptions shown by Azure Automation extension.
1. Select **OK** after you have completed adding or removing the subscriptions.


## Using the Azure Automation extension

The extension simplifies the process of creating and editing runbooks. You can now test them locally without logging into the Azure portal. The various actions that you can perform are listed below:

### Create a runbook

To create a runbook in the Automation account. Follow these steps:

1. Sign in to Azure from the Azure Automation extension.
1. Select **Runbooks**
1. Right click and select **Create Runbook** to create a new Runbook in the Automation account.

   :::image type="content" source="media/runbook-authoring-extension-for-vscode/create-runbook-inline.png" alt-text="Screenshot on how to create runbook using the Azure Automation extension." lightbox="media/runbook-authoring-extension-for-vscode/create-runbook-expanded.png":::

### Publish a runbook

To publish a runbook in the Automation account. Follow these steps:

1. In Automation account, select the runbook.
1. Right click and select **Publish  runbook** to publish the runbook.

   A notification appears that the runbook is successfully published.

   :::image type="content" source="media/runbook-authoring-extension-for-vscode/publish-runbook-inline.png" alt-text="Screenshot on how to publish runbook using the Azure Automation extension." lightbox="media/runbook-authoring-extension-for-vscode/publish-runbook-expanded.png":::
   

### Run local version of Automation job

To run local version of Automation job, follow these steps:

1. In Automation account, select the runbook.
1. Right click and select **Run Local** to run local version of the Automation job.

   :::image type="content" source="media/runbook-authoring-extension-for-vscode/run-local-job-inline.png" alt-text="Screenshot on how to run local version of job using the Azure Automation extension." lightbox="media/runbook-authoring-extension-for-vscode/run-local-job-expanded.png":::


### Run Automation job

To run the Automation job, follow these steps:

1. In Automation account, select the runbook.
1. Right click and select **Start Automation job** to run the Automation job.

   :::image type="content" source="media/runbook-authoring-extension-for-vscode/start-automation-job-inline.png" alt-text="Screenshot on how to run Automation job using the Azure Automation extension." lightbox="media/runbook-authoring-extension-for-vscode/start-automation-job-expanded.png":::

### Add new webhook

To add a webhook to the runbook, follow these steps:

1. In Automation account, select the runbook.
1. Right click and select **Add New Webhook**.
1. Select and copy the Webhook URI. 
1. Use the command palette and select **Azure Automation Trigger Webhook**
1. Paste the Webhook URI.
   
   A notification appears that JobId is created successfully.

   :::image type="content" source="media/runbook-authoring-extension-for-vscode/add-new-webhook-inline.png" alt-text="Screenshot that shows the notification after successfully adding a new webhook." lightbox="media/runbook-authoring-extension-for-vscode/add-new-webhook-expanded.png":::
   

### Link a schedule

1. In Automation account, go to **Schedules** and select your schedule.
1. Go to **Runbooks**, select your runbook.
1. Right click and select **Link Schedule** and confirm the schedule.
1. In the drop-down select **Azure**
   
   A notification appears that the schedule is linked.


### Manage Assets
1. In Automation account, go to **Assets** > **fx Variables**.
1. Right click and select **Create or Update**.
1. Provide a name in the text box.

   A notification appears that the variable is created, you can view the new variable in **fx Variables** option.

### Run local in debug mode
1. In Automation account, go to **Runbooks** and select a runbook.
1. In the edit pane, add the break point.
1. Right click on the runbook and select **Run local in Debug Mode**.
  
  :::image type="content" source="media/runbook-authoring-extension-for-vscode/run-local-debug-mode-inline.png" alt-text="Screenshot that shows the running of local runbook in debug mode." lightbox="media/runbook-authoring-extension-for-vscode/add-new-webhook-expanded.png":::

### Compare local runbook
1. In Automation account, go to **Runbooks** and select a runbook
1. Right click on the runbook and select **Compare local runbook**.
1. In the edit pane, you will see the information in two layouts - runbook copy and published/draft copy.
  >[!NOTE]
  >If the runbook is **InEdit** mode, you will have to select either the Compare Published content or Compare Draft content to compare.
  
  :::image type="content" source="media/runbook-authoring-extension-for-vscode/compare-local-runbook-inline.png" alt-text="Screenshot that shows how to compare local runbook." lightbox="media/runbook-authoring-extension-for-vscode/compare-local-runbook-expanded.png":::

## Next steps

- For information on key features and limitations of Azure Automation extension see, [Runbook authoring through VS Code in Azure Automation](../automation-runbook-authoring.md)