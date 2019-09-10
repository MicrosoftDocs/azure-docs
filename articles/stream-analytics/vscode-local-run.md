---
title: Test Azure Stream Analytics queries locally with Visual Studio Code (Preview)
description: This article describes how to test queries locally with Azure Stream Analytics Tools for Visual Studio Code.
ms.service: stream-analytics
author: su-jie
ms.author: sujie
ms.date: 05/15/2019
ms.topic: conceptual
---

# Test Stream Analytics queries locally with Visual Studio Code

You can use Azure Stream Analytics tools for Visual Studio Code to test your Stream Analytics jobs locally with sample data.

Use this [quickstart](quick-create-vs-code.md) to learn how to create a Stream Analytics job using Visual Studio Code.

## Run queries locally

You can use the Azure Stream Analytics extension for Visual Studio Code to test your Stream Analytics jobs locally with sample data.

1. Once you've created your Stream Analytics job, use  **Ctrl+Shift+P** to open the command palette. Then type and select **ASA: Add Input**.

    ![Add ASA Input in Visual Studio code](./media/vscode-local-run/add-input.png)

2. Select **Local Input**.

    ![Add ASA local input in Visual Studio code](./media/vscode-local-run/add-local-input.png)

3. Select **+ New Local Input**.

    ![Add a new ASA local input in Visual Studio code](./media/vscode-local-run/add-new-local-input.png)

4. Enter the same input alias that you used in your query.

    ![Add a new ASA local input alias](./media/vscode-local-run/new-local-input-alias.png)

5. In the **LocalInput_DefaultLocalStream.json** file, enter the file path where your local data file is located.

    ![Enter local file path in Visual Studio](./media/vscode-local-run/local-file-path.png)

6. Return to your query editor, and select **Run locally**.

    ![Select run locally in the query editor](./media/vscode-local-run/run-locally.png)

## Next steps

* [Create an Azure Stream Analytics cloud job in Visual Studio Code (Preview)](quick-create-vs-code.md)

* [Explore Azure Stream Analytics jobs with Visual Studio Code (Preview)](vscode-explore-jobs.md)
