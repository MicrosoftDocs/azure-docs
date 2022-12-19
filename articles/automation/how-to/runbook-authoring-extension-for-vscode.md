---
title: Azure Automation extension for Visual Studio Code
description: Learn how to use the Azure Automation extension for Visual Studio Code to author runbooks.
ms.date: 12/18/2022
ms.topic: how-to
---


# Use Azure Automation extension for Visual Studio Code

This article explains about the extension that you can use through Visual Studio Code, to create and manage runbooks. You can perform all runbook management operations such as creating runbooks, editing runbook , triggering a job , tracking recent jobs outputs , linking a schedule and asset management.


## Prerequisites

The following items are required for completing the steps in this article:

- An Azure subscription. If you don't have an Azure subscription, create a
  [free account](https://azure.microsoft.com/free/) before you begin [Visual Studio Code](https://code.visualstudio.com).
- PowerShell modules and Python packages used by runbook must be locally installed on the machine to run the runbook locally. 

## Install and configure the Azure Automation extension

After you meet the prerequisites, you can install the [Azure Automation extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=azure-automation.vscode-azureautomation&ssr=false#overview) by
following these steps:

1. Open Visual Studio Code.
1. From the menu bar, go to **View** > **Extensions**.
1. In the search box, enter **Azure Automation**.
1. Select **Azure Automation** from the search results, and then select **Install**.
1. Select **Reload** when necessary.

## Using the Azure Automation extension

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


## Next steps

- For information on key features and limitations of Azure Automation extension see, [Runbook authoring through VS Code in Azure Automation](../automation-runbook-authoring.md)