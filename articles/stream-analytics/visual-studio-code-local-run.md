---
title: Test an Azure Stream Analytics job locally with sample data using Visual Studio Code
description: How to test queries locally with sample data using Azure Stream Analytics Tools for Visual Studio Code.
ms.service: stream-analytics
author: alexlzx
ms.author: zhenxilin
ms.date: 12/27/2022
ms.topic: how-to
---

# Test Stream Analytics queries locally with sample data using Visual Studio Code

You can use Azure Stream Analytics tools for Visual Studio Code to test your Stream Analytics jobs locally with sample data. The output results can be found as JSON files in the **LocalRunOutputs** folder of your project.

For more information, see [Overview of local Stream Analytics runs in Visual Studio Code with ASA Tools](visual-studio-code-local-run-all.md).

## Prerequisites

* Install [.NET core SDK](https://dotnet.microsoft.com/download) and restart Visual Studio Code.

* Use this [quickstart](quick-create-visual-studio-code.md) to learn how to create a Stream Analytics job using Visual Studio Code.

## Prepare sample data

You need to prepare sample input data files first. If you already have some sample data files on your machine, you can skip this step and move on to the next one.

1. Click **Preview data** in your input configuration file from the top line. Some input data will be fetched from IoT Hub and shown in the preview window.

2. Once the data is shown, select **Save as** to save the data to a local file.

 ![Preview live input](./media/quick-create-visual-studio-code/preview-live-input.png)

## Define a local input

1. Select **input.json** under Inputs folder in your Stream Analytics project. Then select **Add local input** from the top line.

    ![Add local input from project](./media/quick-create-visual-studio-code/add-input-from-project.png)

    You can also use **Ctrl+Shift+P** to open the command palette and enter **ASA: Add Input**.

   ![Add Stream Analytics input in VS Code](./media/quick-create-visual-studio-code/add-input.png)

2. Select **Local Input**.

    ![Add ASA local input in Visual Studio Code](./media/vscode-local-run/add-local-input.png)

3. Select **+ New Local Input**.

    ![Add a new ASA local input in Visual Studio Code](./media/vscode-local-run/add-new-local-input.png)

4. Enter the same input alias that you used in your query.

    ![Add a new ASA local input alias](./media/vscode-local-run/new-local-input-alias.png)

5. In the newly generated **LocalInput_Input.json** file, enter the file path where your local data file is located.

    ![Enter local file path in Visual Studio](./media/vscode-local-run/local-file-path.png)

6. Select **Preview Data** to preview the input data. The serialization type (JSON or CSV) for your data is automatically detected. Use the selector to view your data in **Table** or **Raw** format. The following table is an example of data in the **Table format**:

     ![Preview local data in table format](./media/vscode-local-run/local-file-preview-table.png)

    The following table is an example of data in the **Raw format**:

    ![Preview local data in raw format](./media/vscode-local-run/local-file-preview-raw.png)

## Run queries locally

Return to your query editor, and select **Run locally**. Then select **Use local input** from the dropdown list.

![Select run locally in the query editor](./media/vscode-local-run/run-locally.png)

![Use local input](./media/vscode-local-run/run-locally-use-local-input.png)

The result is shown in the right window. You can select **Run** to test again. You can also select **Open in folder** to see the result files in file explorer and further open them with other tools. The result files are only available in JSON format.

![View local run result](./media/vscode-local-run/run-locally-result.png)

## Next steps


* [Overview of local Stream Analytics runs in Visual Studio Code with ASA Tools](visual-studio-code-local-run-all.md)
* [Test Stream Analytics queries locally against live stream input by using Visual Studio Code](visual-studio-code-local-run-live-input.md)
* [Explore Azure Stream Analytics jobs with Visual Studio Code (preview)](visual-studio-code-explore-jobs.md)
* [Set up CI/CD pipelines and unit testing by using the npm package](./cicd-overview.md)
