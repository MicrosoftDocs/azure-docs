---
title: Test Azure Stream Analytics queries locally against live stream input using Visual Studio Code
description: This article describes how to test queries locally against live stream input using Azure Stream Analytics Tools for Visual Studio Code.
ms.service: stream-analytics
author: su-jie
ms.author: sujie
ms.date: 11/14/2019
ms.topic: conceptual
---
# Test Stream Analytics queries locally against live stream input Visual Studio Code

You can use Azure Stream Analytics tools for Visual Studio Code to test your Stream Analytics jobs locally against live stream input, such as Event Hub or IoT Hub. The results are output as JSON files to a folder in your project called **LocalRunOutputs**.

## Prerequisites

* Install [.NET core SDK](https://dotnet.microsoft.com/download) and restart Visual Studio Code.

* Use this [quickstart](quick-create-vs-code.md) to learn how to create a Stream Analytics job using Visual Studio Code.

## Define a live stream input

1. Right-click the **Inputs** folder in your Stream Analytics project. Then select **ASA: Add Input** from the context menu.

    ![Add input from Inputs folder](./media/quick-create-vs-code/add-input-from-inputs-folder.png)

    You can also select **Ctrl+Shift+P** to open the command palette and enter **ASA: Add Input**.

   ![Add Stream Analytics input in Visual Studio Code](./media/quick-create-vs-code/add-input.png)

2. Choose an input source type from drop down list.

   ![Select IoT Hub as input option](./media/quick-create-vs-code/iot-hub.png)

3. If you added the input from command palette, choose the ASA query script that will use the input. It should automatically populate with the file path to **myASAproj.asaql**.

   ![Select an ASA script in Visual Studio Code](./media/quick-create-vs-code/asa-script.png)

4. Choose **Select from your Azure Subscriptions** from the dropdown menu.

    ![Select from Subscriptions](./media/quick-create-vs-code/add-input-select-subscription.png)

5. Configure the newly generated json file. You can use the CodeLens such as **Select from your Subscriptions** in the screenshot below to help you enter a string, select from a dropdown list, or change the text directly in the file.

   ![Configure input in Visual Studio Code](./media/quick-create-vs-code/configure-input.png)

## Preview input

Select **Preview data** in your live input configuration file from the top line to make sure the input data is coming. Some input data is fetched from IoT Hub and shown in the preview window. Note that this may take a few seconds.

 ![Preview live input](./media/quick-create-vs-code/preview-live-input.png)

## Run queries locally

Return to your query editor, and select **Run locally**. Then select **Use live input** from the dropdown list.

![Select run locally in the query editor](./media/vscode-local-run/run-locally.png)

![Use live input](./media/vscode-local-run-live-input/run-locally-use-live-input.png)

The result is shown in the right window and refreshed every 3 seconds. You can select **Run** to test again. You can also select **Open in folder** to see the result files in file explorer and open them with Visual Studio Code or other tools such as Excel. Note that the result files are only available in JSON format.

The default time for the job to start creating output is set to **Now**. You can custom the time by clicking **Output start time** button in the result window.

![View local run result](./media/vscode-local-run-live-input/vscode-livetesting.gif)

## Next steps

* [Explore Azure Stream Analytics jobs with Visual Studio Code (Preview)](visual-studio-code-explore-jobs.md)

* [Set up CI/CD pipelines using npm package](setup-cicd-vs-code.md)
