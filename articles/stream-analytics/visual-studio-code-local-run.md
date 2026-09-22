---
title: Test Stream Analytics Jobs Locally in VS Code
description: Test Azure Stream Analytics queries locally with sample data in Visual Studio Code to validate your query logic before you run the job in Azure.
ms.service: azure-stream-analytics
author: spelluru
ms.author: spelluru
ms.date: 08/25/2026
ms.topic: how-to
ms.custom: sfi-image-nochange
ai-usage: ai-assisted

#customer intent: As a Stream Analytics developer, I want to test my job queries locally with sample data in Visual Studio Code so that I can validate my query logic before I run the job in Azure.
---

# Test Stream Analytics queries locally with sample data using Visual Studio Code

Use Azure Stream Analytics tools for Visual Studio Code to test your Stream Analytics jobs locally with sample data. Testing locally lets you validate your query logic quickly before you run the job in Azure. Visual Studio Code saves the output results as JSON files in the **LocalRunOutputs** folder of your project.

## Prerequisites

* Completion of the [Create a Stream Analytics job by using Visual Studio Code](quick-create-visual-studio-code.md) quickstart.

* The [.NET SDK](https://dotnet.microsoft.com/download) installed. Restart Visual Studio Code after you install the SDK.

## Prepare sample data

Prepare sample input data files first. If you already have sample data files on your machine, you can skip this step.

To validate your query against a live streaming source instead of saved sample data, see [Test Stream Analytics queries locally against live stream input by using Visual Studio Code](visual-studio-code-local-run-live-input.md).

1. Select **Preview data** in your input configuration file from the top line. Visual Studio Code fetches some input data from IoT Hub and shows it in the preview window.

1. After the data appears, select **Save as** to save it to a local file.

 ![Screenshot of the input configuration file in Visual Studio Code with Preview data selected to fetch live input.](./media/quick-create-visual-studio-code/preview-live-input.png)

## Define a local input

Define a local input in your Stream Analytics project so that your query can read from the sample data file instead of a live source. Use the following steps to add and configure the local input:

1. Select **input.json** under the Inputs folder in your Stream Analytics project. Then select **Add local input** from the top line.

    ![Screenshot of a Stream Analytics project in Visual Studio Code with Add local input selected from the top line.](./media/quick-create-visual-studio-code/add-input-from-project.png)

    You can also use **Ctrl+Shift+P** to open the command palette and enter **ASA: Add Input**.

   ![Screenshot of the Visual Studio Code command palette with the ASA: Add Input command entered.](./media/quick-create-visual-studio-code/add-input.png)

1. Select **Local Input**.

    ![Screenshot of Visual Studio Code showing the Local Input option selected for a Stream Analytics input.](./media/vscode-local-run/add-local-input.png)

1. Select **+ New Local Input**.

    ![Screenshot of Visual Studio Code showing the New Local Input option selected for a Stream Analytics input.](./media/vscode-local-run/add-new-local-input.png)

1. Enter the same input alias that you used in your query.

    ![Screenshot of Visual Studio Code showing the input alias entry for a new Stream Analytics local input.](./media/vscode-local-run/new-local-input-alias.png)

1. In the newly generated **LocalInput_Input.json** file, enter the path to your local data file.

    ![Screenshot of the LocalInput_Input.json file in Visual Studio Code with the local data file path entered.](./media/vscode-local-run/local-file-path.png)

1. Select **Preview Data** to preview the input data. Visual Studio Code automatically detects the serialization type (JSON or CSV) for your data. Use the selector to view your data in **Table** or **Raw** format. The following table is an example of data in the **Table format**:

     ![Screenshot of the local input data previewed in Table format in Visual Studio Code.](./media/vscode-local-run/local-file-preview-table.png)

    The following table is an example of data in the **Raw format**:

    ![Screenshot of the local input data previewed in Raw format in Visual Studio Code.](./media/vscode-local-run/local-file-preview-raw.png)

## Run queries locally

Run your query against the local input to validate the query logic before you run the job in Azure.

1. Return to your query editor, and select **Run locally**. Then select **Use local input** from the dropdown list.

    ![Screenshot of the Stream Analytics query editor in Visual Studio Code with Run locally selected.](./media/vscode-local-run/run-locally.png)

    ![Screenshot of Visual Studio Code showing the Use local input option selected from the dropdown list.](./media/vscode-local-run/run-locally-use-local-input.png)

1. Review the result in the right window. Select **Run** to test again, or select **Open in folder** to see the result files in the file explorer and open them with other tools. The result files are only available in JSON format.

    ![Screenshot of the local run results shown in the right window of Visual Studio Code.](./media/vscode-local-run/run-locally-result.png)

## Related content

* [Overview of local Stream Analytics runs in Visual Studio Code with ASA Tools](visual-studio-code-local-run-all.md)
* [Explore Azure Stream Analytics jobs with Visual Studio Code (preview)](visual-studio-code-explore-jobs.md)
* [Set up CI/CD pipelines and unit testing by using the npm package](./cicd-overview.md)
