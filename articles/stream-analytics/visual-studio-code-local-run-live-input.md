---
title: Testing Azure Stream Analytics query locally against live stream input using Visual Studio Code extension.
description: This article describes how to test query locally against live stream input using the Azure Stream Analytics Tools extension for Visual Studio Code.
ms.service: stream-analytics
ms.custom: build-2023
author: alexlzx
ms.author: zhenxilin
ms.date: 05/24/2023
ms.topic: how-to
---

# Testing Stream Analytics query locally against live stream input with Visual Studio Code

Testing your Stream Analytics query locally against live stream input is a crucial step in ensuring the accuracy and efficiency of your query logic. With the Azure Stream Analytics (ASA) extension for Visual Studio Code (VS Code), you have the necessary tools to perform this testing seamlessly. This article guides you through the steps of setting up your environment, configuring the live stream input, and executing your query locally for thorough testing.

## Prerequisites

* Install the [.NET Core SDK](https://dotnet.microsoft.com/download) and restart Visual Studio Code.
* Follow [this quickstart](quick-create-visual-studio-code.md) to install and create a Stream Analytics job using Visual Studio Code.

## Define a live stream input

1. Right-click the **Inputs** folder in your Stream Analytics project and select **ASA: Add Input**.
    ![Screenshot of VSCode extension adding input via drop-down menu.](./media/quick-create-visual-studio-code/add-input-from-inputs-folder.png)
   OR press **Ctrl+Shift+P** to open the command palette and enter **ASA: Add Input**. Then choose the query script for processing the input stream. 
    ![Screenshot of VSCode extension adding input via command palette.](./media/quick-create-visual-studio-code/add-input.png)

2. Choose a live input source type from the drop-down list, **Select from your Azure Subscriptions** and enter a name for the input source. 
    ![Screenshot of VSCode extension showing series of steps for Event Hub input configuration.](./media/quick-create-visual-studio-code/add-input-select-subscription.png)

3. You see a new JSON file created under the **Input** folder. Open the file and **Select from your subscriptions** to help you configure your Event Hubs input. 
    ![Screenshot of VSCode extension showing the input json files.](./media/quick-create-visual-studio-code/configure-input.png)

4. Select **Preview data** to validate if the live input is successfully configured.
    ![Screenshot of VSCode extension previewing live input data.](./media/quick-create-visual-studio-code/preview-live-input.png)

## Run query locally

Open your query file, select **Run locally** or the **Play** button on the menu bar to open a **Local run option** window for configuring local run mode. 

![Screenshot of VSCode extension selecting "Run locally" in the query editor.](./media/vscode-local-run-live-input/run-locally.png)

Choose **Use Live Input and Local Output** to run job locally against live input stream and produce output results to a local folder. Then select **Run** to start running job locally. 

![Screenshot of VSCode extension selecting play mode for local run.](./media/vscode-local-run-live-input/run-live-input-and-local-output.png)

You can see a **Local test** window is opened and refreshed every 3 seconds. The output results are stored as JSON format in **LocalRunOutputs** folder.

![Screenshot of VSCode extension showing local test window.](./media/vscode-local-run-live-input/local-testing-window.png)


## Specify input partitions for local testing

To avoid ingesting all data from Event Hubs, you can specify specific partitions for your Event Hubs during local testing. 

1. Select **Run locally** to open the local run option window. 
2. Under **Select the input partitions** section and choose **Custom**.
3. Enter the specific partition numbers that you want to ingest data from for your local testing.

![Screenshot of VSCode extension specifying event hub partitions.](./media/vscode-local-run-live-input/specify-partitions.png)

By specifying the partitions, you can focus on testing your query logic without worrying about a large volume of data. This feature allows for more efficient and targeted testing of your Stream Analytics job.

## Submit job to Azure

Once you have completed testing your query locally, you can submit your Stream Analytics project to Azure and start running the job in the cloud. 
1. Select the **Submit to Azure** option or select the **Upload** button on the query file.
2. In the submit options window, you can **update an existing job in Azure** or **create a new job** for the upload.
3. Provide the necessary details, including your subscription, resource group, and region for the deployment.

![Screenshot of VSCode extension submitting job to Azure.](./media/vscode-local-run-live-input/submit-to-azure.png)

Once the submission process is complete, you can view your cloud job in a new window. From there, you can monitor its performance and manage its configurations as needed. You can also open the job in your browser by clicking on the link provided in the OUTPUT panel.

![Screenshot of VSCode extension showing cloud view job.](./media/vscode-local-run-live-input/cloud-view-job.png)

## Next steps

* [Export and manage Stream Analytics jobs using Visual Studio Code extension](visual-studio-code-explore-jobs.md)
* [Overview of running Stream Analytics jobs locally](visual-studio-code-local-run-all.md)
* [Test Stream Analytics queries locally with sample data](visual-studio-code-local-run.md)
* [Set up CI/CD pipelines using the ASA npm package](./cicd-overview.md)
