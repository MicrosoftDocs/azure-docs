---
title: Manage Stream Analytics in Visual Studio Code
description: Manage Azure Stream Analytics jobs in Visual Studio Code. Export cloud jobs, list entities, and debug with the Job Diagram and Monitor.
ms.service: azure-stream-analytics
author: spelluru
ms.author: spelluru
ms.date: 08/25/2026
ms.topic: how-to
ms.custom: sfi-image-nochange
ai-usage: ai-assisted

#customer intent: As a Stream Analytics developer, I want to export and manage my Stream Analytics jobs in Visual Studio Code so that I can monitor and troubleshoot them across platforms.
---

# Manage and export Stream Analytics jobs in Visual Studio Code

The Azure Stream Analytics (ASA) extension for Visual Studio Code lets you manage your cloud Stream Analytics jobs without leaving your editor. You can monitor and troubleshoot jobs on Windows, macOS, and Linux. By using the extension, you can:

- Create, start, and stop a cloud job in Azure.
- Export existing jobs to a local machine.
- List jobs and view job entities.
- View and debug a job by using the **Job Diagram** and **Job Monitor**.

## Export a job to a local machine

Export an existing cloud job to your local machine so you can edit and manage it in Visual Studio Code.

1. Open Visual Studio Code and select the **Azure** icon on the activity bar. If you didn't install the ASA extension, follow the steps to [set up the Stream Analytics extension](./quick-create-visual-studio-code.md).
1. Select **STREAM ANALYTICS** in the explorer to locate the job you want to export.

![Screenshot of VS Code extension exporting ASA job to Visual Studio Code.](./media/vscode-explore-jobs/export-job.png)

## List a job and view job entities

Use the job view to interact with Azure Stream Analytics jobs from Visual Studio Code.

1. Select the **Azure** icon on the Visual Studio Code activity bar and then expand the **Stream Analytics** node. Your jobs appear under your subscriptions.

   ![Screenshot of VS Code extension opening Stream Analytics Explorer.](./media/vscode-explore-jobs/open-explorer.png)

1. Expand your job node to open and view the job query, configuration, inputs, outputs, and functions.

1. Select and hold (or right-click) your job node, and select **Open Job View in Portal** to open the job view in the Azure portal.

   ![Screenshot of VS Code extension opening job view in portal.](./media/vscode-explore-jobs/open-job-view.png)

## View job diagram and job summary

Use Job Monitor in Visual Studio Code to view and troubleshoot your Azure Stream Analytics jobs. Open the job diagram and review the job summary to get started.

1. Select **Job Monitor**. The Job Monitor opens, and the job diagram loads automatically.

   ![Screenshot of VS Code extension opening Job Monitor.](./media/vscode-explore-jobs/open-job-monitor.png)

1. View your job diagram and select **Job Summary** to view the properties and information of your job.

   ![Screenshot of VS Code extension viewing Job Summary.](./media/vscode-explore-jobs/view-jobs-summary.png)

1. Select **Test Connection** to test the connection to your input and output.

   ![Screenshot of VS Code extension testing connection.](./media/vscode-explore-jobs/test-connection.png)

1. Select **Locate Script** to view your query.

   ![Screenshot of VS Code extension viewing the job query.](./media/vscode-explore-jobs/view-query.png)

## Monitor and debug with metrics

Use the **Metrics** panel to analyze job-level and node-level metrics while you debug your job.

1. Select the arrow button to open the **Metrics** panel.

   ![Screenshot of VS Code extension opening Metrics Panel.](./media/vscode-explore-jobs/open-metrics-panel.png)

1. Analyze your job with the key metrics shown in the chart. View job-level or node-level metrics, and select which metrics to show in the chart.

   ![Screenshot of VS Code extension viewing job metrics.](./media/vscode-explore-jobs/view-metrics.png)

## Debug with diagnostic logs and activity logs

View your job's diagnostic logs and activity logs to troubleshoot issues.

1. Select the **Diagnostic Logs** tab.

   ![Screenshot of VS Code extension viewing Diagnostic Logs.](./media/vscode-explore-jobs/view-diagnostic-log.png)

1. Select the **Activity Logs** tab.

   ![Screenshot of VS Code extension viewing Activity Logs.](./media/vscode-explore-jobs/view-activity-logs.png)

## Next step

> [!div class="nextstepaction"]
> [Create an Azure Stream Analytics cloud job using Visual Studio Code extension](quick-create-visual-studio-code.md)
