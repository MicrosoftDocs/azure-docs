---
title: View Azure Stream Analytics jobs in Visual Studio
description: This article describes how to view Stream Analytics jobs in Visual Studio.
services: stream-analytics
author: su-jie
ms.author: sujie
manager: kfile
ms.reviewer: mamccrea
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 07/10/2018
---

# Use Visual Studio to view Azure Stream Analytics jobs

Azure Stream Analytics tools for Visual Studio makes it easy for developers to manage their Stream Analytics jobs directly from the IDE. With Azure Stream Analytics tools, you can:
- [Create new jobs](stream-analytics-quick-create-vs.md)
- Start, stop, and [monitor jobs](stream-analytics-monitor-jobs-use-vs.md)
- Check job results
- Export existing jobs to a project
- Test input and output connections
- [Run queries locally](stream-analytics-vs-tools-local-run.md)

Learn how to [install Azure Stream Analytics tools for Visual Studio](stream-analytics-tools-for-visual-studio-install.md).

## Explore the job view

You can use the job view to interact with Azure Stream Analytics jobs from Visual Studio.

### Open the job view

1. In **Server Explorer**, select **Stream Analytics jobs** and then select **Refresh**. Your job should appear under **Stream Analytics jobs**.

    ![Stream Analytics server explorer list](./media/stream-analytics-vs-tools/stream-analytics-tools-for-vs-list-jobs-01.png)



2. Expand your job node, and double-click on the **Job View** node to open a job view.
    
   ![Expanded job node](./media/stream-analytics-vs-tools/stream-analytics-tools-for-vs-job-view-01.png)

### Start and stop jobs

Azure Stream Analytics jobs can be fully managed from the job view in Visual Studio. Use the controls to start, stop, or delete a job.
    
   ![Stream Analytics job controls](./media/stream-analytics-vs-tools/azure-stream-analytics-job-view-controls.png)


## Check job results

Stream Analytics tools for Visual Studio currently supports output preview for Azure Data Lake Storage and blob storage. To view result, simply double click the output node of the job diagram in **Job View** and enter the appropriate credentials.

   ![Stream Analytics job blob output](./media/stream-analytics-vs-tools/stream-analytics-blob-preview.png)


## Export jobs to a project

There are two ways you can export an existing job to a project.

1. In **Server Explorer**, under the Stream Analytics Jobs node, right-click the job node. Select **Export to New Stream Analytics Project**.
    
   ![Export job to project](./media/stream-analytics-vs-tools/stream-analytics-tools-for-vs-export-job-01.png)
    
    The generated project appears in **Solution Explorer**.
    
   ![Solution explorer](./media/stream-analytics-vs-tools/stream-analytics-tools-for-vs-export-job-02.png)

2. In the job view, select **Generate Project**.
    
   ![Generate project from job view](./media/stream-analytics-vs-tools/stream-analytics-tools-for-vs-export-job-03.png)

## Test connections

Input and output connections can be tested from the **Job View** by selecting an option from the **Test Connection** dropdown.

   ![Test Connection dropdown](./media/stream-analytics-vs-tools/stream-analytics-test-connection-dropdown.png)

The **Test Connection** results are displayed in the **Output** window.

   ![Test Connection results](./media/stream-analytics-vs-tools/stream-analytics-test-connection-results.png)

## Next steps

* [Monitor and manage Azure Stream Analytics jobs using Visual Studio](stream-analytics-monitor-jobs-use-vs.md)
* [Quickstart: Create a Stream Analytics job using Visual Studio](stream-analytics-quick-create-vs.md)
* [Tutorial: Deploy an Azure Stream Analytics job with CI/CD using Azure Pipelines](stream-analytics-tools-visual-studio-cicd-vsts.md)
* [Continuously integrate and develop with Stream Analytics tools](stream-analytics-tools-for-visual-studio-cicd.md)
