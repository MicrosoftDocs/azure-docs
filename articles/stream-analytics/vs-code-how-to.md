---
title: Explore Azure Stream Analytics with Visual Studio Code (Preview)
description: This article shows you how to export an Azure Stream Analytics job to a local project, list jobs and view job entities, and set up a CI/CD pipeline for your Stream Analytics job.
ms.service: stream-analytics
author: mamccrea
ms.author: mamccrea
ms.date: 05/06/2019
ms.topic: conceptual
---

# Explore Azure Stream Analytics with Visual Studio Code (Preview)

The Azure Stream Analytics for Visual Studio Code extension gives developers a lightweight experience for managing their Stream Analytics jobs. With the Azure Stream Analytics extension, you can:

- [Create](quick-create-vs-code.md), start, and stop jobs
- Export existing jobs to a local project
- Run queries locally
- Set up a CI/CD pipeline

## Export a job to a local project

To export a job to a local project, locate the job you wish to export in the **Stream Analytics Explorer** in Visual Studio code. Then select a folder for your project. The project is exported to the folder you select, and you can continue to manage the job from Visual Studio Code. For more information on using Visual Studio Code to manage Stream Analytics jobs, see the Visual Studio Code [quickstart](quick-create-vs-code.md).

![Export ASA job in Visual Studio Code](./media/vs-code-how-to/export-job.png)

## Run queries locally

You can use the Azure Stream Analytics extension for Visual Studio Code to test your Stream Analytics jobs locally with sample data.

1. Once you've created your Stream Analytics job, use  **Ctrl+Shift+P** to open the command pallet. Then type and select **ASA: Add Input**.

    ![Add ASA Input in Visual Studio code](./media/vs-code-how-to/add-input.png)

2. Select **Local Input**.

    ![Add ASA local input in Visual Studio code](./media/vs-code-how-to/add-local-input.png)

3. Select **+ New Local Input**.

    ![Add a new ASA local input in Visual Studio code](./media/vs-code-how-to/add-new-local-input.png)

4. Enter the same input alias that you used in your query.

    ![Add a new ASA local input alias](./media/vs-code-how-to/new-local-input-alias.png)

5. In the **LocalInput_DefaultLocalStream.json** file, enter the file path where your local data file is located.

    ![Enter local file path in Visual Studio](./media/vs-code-how-to/local-file-path.png)

6. Return to your query editor, and select **Run locally**.

    ![Select run locally in the query editor](./media/vs-code-how-to/run-locally.png)

## Set up a CI/CD pipeline

You can enable continuous integration and deployment for Azure Stream Analytics jobs using the **asa-cicd tools** NPM package. The NPM package provides the tools for the auto-deployment of Stream Analytics Visual Studio Code projects. It can be used on Windows, macOS, and Linux without installing Visual Studio Code.

Once you have [downloaded the package](https://www.npmjs.com/package/azure-streamanalytics-cicd), use the following command to output the Azure Resource Manager templates. If the **outputPath** is not specified, the templates will be placed in the **Deploy** folder under the project's **bin** folder.

```powershell
asa-cicd build -scriptPath <scriptFullPath> -outputPath <outputPath>
```

## Next steps

* [Create an Azure Stream Analytics cloud job in Visual Studio Code (Preview)](quick-create-vs-code.md)