---
title: Develop and debug Azure Stream Analytics jobs locally 
description: Learn how to develop and test Azure Stream Analytics jobs on your local computer before you run them in Azure portal.
ms.author: mamccrea
author: mamccrea
ms.topic: conceptual
ms.date: 03/31/2020
ms.service: stream-analytics
---

# Develop and debug Azure Stream Analytics jobs locally

While you're able to create and test Azure Stream Analytics jobs in the Azure portal, many developers prefer a local development experience. Stream Analytics makes it easy to use your favorite code editor and development tools to create and test jobs with live event streams from Azure Event Hub, IoT Hub, and Blob Storage using a fully functioned single node local runtime. You can also submit jobs to Azure directly from your local development environment.

## Local development environments

The way in which you develop Stream Analytics jobs on your local computer depends on your tooling preferences and feature availability. See [Azure Stream Analytics feature comparison](feature-comparison.md) to see what features are supported for each development environment.

The environments in the following table support local development:

|Environment                              |Description    |
|-----------------------------------------|------------|
|[Visual Studio Code](visual-studio-code-explore-jobs.md)| The [Azure Stream Analytics Tools extension](https://marketplace.visualstudio.com/items?itemName=ms-bigdatatools.vscode-asa) for Visual Studio Code allows you to author, manage, and test your Stream analytics job both locally and in the cloud with rich IntelliSense and native source control. Supports development on Linux, MacOS, and Windows. To learn more, see [Create an Azure Stream Analytics job in Visual Studio Code](quick-create-vs-code.md).|
|[Visual Studio 2019](stream-analytics-tools-for-visual-studio-install.md) |Stream Analytics Tools is part of the Azure development and Data storage and processing workloads in Visual Studio. You can use Visual Studio to write custom C# user-defined functions and deserializers. To learn more, see [Create an Azure Stream Analytics job by using Visual Studio](stream-analytics-quick-create-vs.md).|
|[Command prompt or terminal](stream-analytics-tools-for-visual-studio-cicd.md)|The Azure Stream Analytics CI/CD NuGet package provides tools for Visual studio project build, local testing on an arbitrary machine. The Azure Stream Analytics CI/CD npm package provides tools for Visual Studio Code project builds (which generates an Azure Resource Manager template) on an arbitrary machine.|

## Next steps

* [Test Stream Analytics queries locally with sample data using Visual Studio Code](visual-studio-code-local-run.md)
* [Test Stream Analytics queries locally against live stream input by using Visual Studio Code](visual-studio-code-local-run-live-input.md)
* [Test Stream Analytics queries locally with Visual Studio](stream-analytics-vs-tools-local-run.md)
* [Test live data locally using Azure Stream Analytics tools for Visual Studio](stream-analytics-live-data-local-testing.md)
