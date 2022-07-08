---
title: Copy, back up and move your Azure Stream Analytics jobs between regions
description: This article describes how to move, copy, and back up an Azure Stream Analytics job.
author: su-jie
ms.author: sujie

ms.service: stream-analytics
ms.topic: how-to
ms.custom: subject-moving-resources
ms.date: 09/11/2019
#Customer intent: As an Azure Stream Analytics job developer or admin, I want export my job so that I can reuse, move between Azure regions, or back up.
---

# Copy, back up and move your Azure Stream Analytics jobs between regions

When you want to move, copy or back up your deployed Azure Stream Analytics jobs, you can use the job exporting function in Stream Analytics extension for Visual Studio Code or Visual Studio to achieve. It will help you to export your job's definition to local, then you can backup it there or resubmit it to another region.

> [!NOTE] 
> * We strongly recommend using [**Stream Analytics tools for Visual Studio Code**](./quick-create-visual-studio-code.md) for best local development experience. There are known feature gaps in Stream Analytics tools for Visual Studio 2019 (version 2.6.3000.0) and it won't be improved going forward. 
> * Copying a job to another region does not copy the last output time. Therefore, you cannot use [**When last stopped**](./start-job.md#start-options) option when starting the copied job.

## Before you begin
* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/).

* Sign in to the [Azure portal](https://portal.azure.com/).

* Install [Azure Stream Analytics extension for Visual Studio Code](quick-create-visual-studio-code.md#install-the-azure-stream-analytics-tools-extension) or [Azure Stream Analytics tools for Visual Studio](quick-create-visual-studio-code.md#install-the-azure-stream-analytics-tools-extension).  

## Visual Studio Code

1. Click the **Azure** icon on the Visual Studio Code Activity Bar and then expand **Stream Analytics** node. Your jobs should appear under your subscriptions.

   ![Open Stream Analytics Explorer](./media/vscode-explore-jobs/open-explorer.png)

2. To export a job to a local project, locate the job you wish to export in the **Stream Analytics Explorer** in Visual Studio Code. Then select a folder for your project.

    ![Locate ASA job in Visual Studio Code](./media/vscode-explore-jobs/export-job.png)

    The project is exported to the folder you select and added to your current workspace.

3. To publish the job to another region or backup using another name, select **Select from your subscriptions to publish** in the query editor (\*.asaql) and follow the instructions.

    ![Publish to Azure in Visual Studio Code](./media/quick-create-visual-studio-code/submit-job.png)

## Visual Studio

1. Follow the [export a deployed Azure Stream Analytics job to a project instructions](./stream-analytics-vs-tools.md#export-jobs-to-a-project).

2. Open the \*.asaql file in the Query Editor, select **Submit To Azure** in the script editor and follow the instructions to publish the job to another region or backup using a new name.

## Next steps

* [Quickstart: Create a Stream Analytics job by using Visual Studio Code](quick-create-visual-studio-code.md)
* [Quickstart: Create a Stream Analytics job by using Visual Studio](stream-analytics-quick-create-vs.md)