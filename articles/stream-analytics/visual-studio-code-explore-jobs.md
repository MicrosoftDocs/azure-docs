---
title: Explore Azure Stream Analytics jobs in Visual Studio Code
description: This article shows you how to export an Azure Stream Analytics job to a local project, list jobs and view job entities.
ms.service: stream-analytics
author: su-jie
ms.author: sujie
ms.date: 07/21/2021
ms.topic: how-to
---

# Explore Azure Stream Analytics with Visual Studio Code (Preview)

The Azure Stream Analytics for Visual Studio Code extension gives developers a lightweight experience for managing their Stream Analytics jobs. It can be used on Windows, Mac and Linux. With the Azure Stream Analytics extension, you can:

- [Create](quick-create-visual-studio-code.md), start, and stop jobs
- Export existing jobs to a local project
- List jobs and view job entities
- View job diagram and debug in Job Monitor

## Export a job to a local project

To export a job to a local project, locate the job you wish to export in the **Stream Analytics Explorer** in Visual Studio Code. Then select a folder for your project. The project is exported to the folder you select, and you can continue to manage the job from Visual Studio Code. For more information on using Visual Studio Code to manage Stream Analytics jobs, see the Visual Studio Code [quickstart](quick-create-visual-studio-code.md).

![Export ASA job in Visual Studio Code](./media/vscode-explore-jobs/export-job.png)

## List job and view job entities

You can use the job view to interact with Azure Stream Analytics jobs from Visual Studio.


1. Click the **Azure** icon on Visual Studio Code Activity Bar and then expand **Stream Analytics node**. Your jobs should appear under your subscriptions.

   ![Open Stream Analytics Explorer](./media/vscode-explore-jobs/open-explorer.png)

2. Expand your job node, you can open and view the job query,  configuration, inputs, outputs and functions. 

3. Right click your job node, and choose the **Open Job View in Portal** node to open the job view in the Azure portal.

   ![Open job view in portal](./media/vscode-explore-jobs/open-job-view.png)

## View job diagram and debug in Job Monitor

You can use job monitor in Visual Studio Code to view and troubleshoot your Azure Stream Analytics jobs.

### View job diagram and job summary
1. Select **Job Monitor**. Your Job Monitor should appear, and job diagram should be loaded automatically.
   
   ![Open Job Monitor](./media/vscode-explore-jobs/open-job-monitor.png)

2.	You can view your job diagram and click on **Job Summary** to view properties and information of your job. 

      ![View Job Summary](./media/vscode-explore-jobs/view-jobs-summary.png)

3.	You can click on **Test Connection** button to test connection to your input and output.

      ![Test Connection](./media/vscode-explore-jobs/test-connection.png)

4.	You can also click on **Locate Script** button to view your query.
   
      ![View Query](./media/vscode-explore-jobs/view-query.png)

### Monitor and debug with Metrics

1.	Click on the arrow button, you can open the Metrics panel.

      ![Open Metrics Panel](./media/vscode-explore-jobs/open-metrics-panel.png)

2.	You can interact with it and analyze your job with key metrics showing in chart. You can choose to view job-level metrics or nodes level metrics. And you can also decide which metrics you want them to show in the chart.

      ![View Metrics](./media/vscode-explore-jobs/view-metrics.png)

### Debug with diagnostic logs and activity logs

You can view your job’s diagnostic logs and activity logs for troubleshooting.

1. Select **Diagnostic Logs** tab.

   ![View Diagnostic Logs](./media/vscode-explore-jobs/view-diagnostic-log.png)

2. Select **Activity Logs** tab 

   ![View Activity Logs](./media/vscode-explore-jobs/view-activity-logs.png)

## Next steps

* [Create an Azure Stream Analytics cloud job in Visual Studio Code (Preview)](quick-create-visual-studio-code.md)
