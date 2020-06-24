---
title: Test Azure Stream Analytics queries locally against live stream input by using Visual Studio Code
description: This article describes how to test queries locally against live stream input by using Azure Stream Analytics Tools for Visual Studio Code.
ms.service: stream-analytics
author: su-jie
ms.author: sujie
ms.date: 11/14/2019
ms.topic: conceptual
---
# Test Stream Analytics queries locally against live stream input by using Visual Studio Code

You can use Azure Stream Analytics Tools for Visual Studio Code to test your Stream Analytics jobs locally against live stream input. The input can come from a source like Azure Event Hubs or Azure IoT Hub. The output results are sent as JSON files to a folder in your project called **LocalRunOutputs**.

## Prerequisites

* Install the [.NET Core SDK](https://dotnet.microsoft.com/download) and restart Visual Studio Code.

* Use [this quickstart](quick-create-vs-code.md) to learn how to create a Stream Analytics job by using Visual Studio Code.

## Define a live stream input

1. Right-click the **Inputs** folder in your Stream Analytics project. Then select **ASA: Add Input** from the context menu.

   ![Add input from the Inputs folder](./media/quick-create-vs-code/add-input-from-inputs-folder.png)

   You can also select **Ctrl+Shift+P** to open the command palette and enter **ASA: Add Input**.

   ![Add Stream Analytics input in Visual Studio Code](./media/quick-create-vs-code/add-input.png)

2. Choose an input source type from the drop-down list.

   ![Select IoT hub as the input option](./media/quick-create-vs-code/iot-hub.png)

3. If you added the input from the command palette, choose the Stream Analytics query script that will use the input. It should be automatically populated with the file path to **myASAproj.asaql**.

   ![Select a Stream Analytics script in Visual Studio Code](./media/quick-create-vs-code/asa-script.png)

4. Choose **Select from your Azure Subscriptions** from the drop-down menu.

    ![Select from subscriptions](./media/quick-create-vs-code/add-input-select-subscription.png)

5. Configure the newly generated JSON file. You can use the CodeLens feature to help you enter a string, select from a drop-down list, or change the text directly in the file. The following screenshot shows **Select from your Subscriptions** as an example.

   ![Configure input in Visual Studio Code](./media/quick-create-vs-code/configure-input.png)

## Preview input

To make sure that the input data is coming, select **Preview data** in your live input configuration file from the top line. Some input data comes from an IoT hub and is shown in the preview window. The preview might take a few seconds to appear.

 ![Preview live input](./media/quick-create-vs-code/preview-live-input.png)

## Run queries locally

Return to your query editor, and select **Run locally**. Then select **Use Live Input** from the drop-down list.

![Select "Run locally" in the query editor](./media/vscode-local-run/run-locally.png)

![Select "Use Live Input"](./media/vscode-local-run-live-input/run-locally-use-live-input.png)

The result is shown in the right window and refreshed every 3 seconds. You can select **Run** to test again. You can also select **Open in folder** to see the result files in File Explorer and open them with Visual Studio Code or a tool like Excel. Note that the result files are available only in JSON format.

The default time for the job to start creating output is set to **Now**. You can customize the time by selecting the **Output start time** button in the result window.

![View local run result](./media/vscode-local-run-live-input/vscode-livetesting.gif)

## Next steps

* [Explore Azure Stream Analytics jobs with Visual Studio Code (preview)](visual-studio-code-explore-jobs.md)

* [Set up CI/CD pipelines by using the npm package](setup-cicd-vs-code.md)
