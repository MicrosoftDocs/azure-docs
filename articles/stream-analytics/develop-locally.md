---
title: Develop and debug Azure Stream Analytics jobs locally 
description: Learn how to develop and test Azure Stream Analytics jobs on your local computer before you run them in Azure portal.
ms.author: zhenxilin
author: alexlzx
ms.topic: conceptual
ms.date: 12/27/2022
ms.service: stream-analytics
---

# Develop and debug Azure Stream Analytics jobs locally

Apart from creating and developing an Azure Stream Analytics job in the Azure portal, you can set up a Stream Analytics job using a developer tool on your computer. Azure Stream Analytics (ASA) allows you to use your favorite code editor, e.g.,  Visual Studio Code to build and test query locally with live data streams from Azure Event Hubs, IoT Hub, Blob Storage and other Azure resources. The ASA developer tool creates a fully functional node in local runtime to run your Stream Analytics job. You can also submit your local Stream Analytics jobs to Azure cloud and change the job running status. Using the ASA developer tool is a convenient way to build, test and manage your Stream Analytics jobs.

## Local development environments

The way in which you develop Stream Analytics jobs on your local computer depends on your tooling preferences and feature availability. See [Azure Stream Analytics feature comparison](feature-comparison.md) to see what features are supported for each development environment.

The environments in the following table support local development:

|Environment                              |Description    |
|-----------------------------------------|------------|
|[Visual Studio Code](visual-studio-code-explore-jobs.md)| The [Azure Stream Analytics tools extension](https://marketplace.visualstudio.com/items?itemName=ms-bigdatatools.vscode-asa) for Visual Studio Code allows you to author, manage, test your Stream Analytics job both locally and in the cloud with rich IntelliSense and native source control. It supports development on Linux, macOS and Windows. To learn more, see [Create an Azure Stream Analytics job in Visual Studio Code](quick-create-visual-studio-code.md). The extension also supports [Visual Studio Codespaces](https://visualstudio.microsoft.com/services/visual-studio-codespaces/), which is a cloud-hosted dev environment.|
|[Command prompt or terminal](stream-analytics-tools-for-visual-studio-cicd.md)|The Azure Stream Analytics CI/CD NuGet package provides tools for Visual studio project build, local testing on an arbitrary machine. The Azure Stream Analytics CI/CD npm package provides tools for Visual Studio Code project builds (which generates an Azure Resource Manager template) on an arbitrary machine.|

## Next steps

* [Test Stream Analytics queries locally with sample data using Visual Studio Code](visual-studio-code-local-run.md)
* [Test Stream Analytics queries locally against live stream input by using Visual Studio Code](visual-studio-code-local-run-live-input.md)