---
title: Test Azure Stream Analytics queries locally with Visual Studio Code
description: This article describes how to test queries locally by using Azure Stream Analytics Tools for Visual Studio Code.
ms.service: stream-analytics
ms.date: 11/26/2021
ms.topic: how-to
---

# Overview of local testing of Stream Analytics jobs in Visual Studio Code with ASA Tools

You can use **Azure Stream Analytics Tools** (ASA Tools) for Visual Studio Code to test your Stream Analytics jobs locally. When speaking of locality, there are three aspects to consider: the job execution context (a local machine or the Azure cloud service), the input sources, and the output sinks.

In local runs the query is executed on the local machine. For input, data can be ingested from local files or live sources. Output results are either sent as files to a local folder, or to the live sinks.

## Input considerations for local runs

In VS Code, you can define **live and local inputs**:

- **Live inputs** are configuration files pointing to an instance of the supported inputs (stream and reference data). They also offer to preview and sample data to JSON files.
- **Local inputs** are configuration files pointing to a local file of the supported format (JSON/CSV/AVRO). Those files can be sampled from a live input, or generated in any other way.

When creating a local input, it can be aligned to an existing live input. In this case, it will mock the live input during local input runs. Its configuration file will be named after the live input, prefixed by `Local_`. The data file used by this local input isn't expected to follow the format and serialization format defined in the live input. Their formats are independent.

## Output considerations for local runs

When running a job to **local outputs**, the output results are sent to a folder in your project called **LocalRunOutputs**. In this mode, outputs don't need to be defined. The only constraint is that each `INTO` statement in the query points to a unique output name. After a run to local outputs, a JSON file will be created for each unique output name.

## Local run modes

There are three modes supported by ASA Tools in VS Code to run jobs locally:

* Local run with local input and local output: best for offline development at no cost, unit testing with the [npm package](./cicd-overview.md)…
* Local run with live input and local output: best for input configuration, de-serialization, and partitioning debugging…
* Local run with live input and live output: best for output configuration, serialization, and conversion errors debugging…

Each mode supports different input and output configuration:

|Execution|Mode|Input|Output|
|-|-|-|-|
|VS Code|Local input to local output|JSON/CSV/AVRO files|JSON files (the corresponding live output format isn't used even if it exists)|
|VS Code|Live input to local output|All input adapters|JSON files (the corresponding live output format isn't used even if it exists)|
|VS Code|Live input to live output|All input adapters|Event Hub, Storage Account, Azure SQL|
|Azure|N/A|All input adapters|All output adapters|

When running jobs locally, no costs are incurred from the Azure Stream Analytics service. It isn't necessary to create a Stream Analytics resource in Azure.

## Getting started

Use [this quickstart](quick-create-visual-studio-code.md) to learn how to create a Stream Analytics job by using Visual Studio Code and ASA Tools.

Then for step-by-step tutorials on local runs, see:

- [Test Stream Analytics queries locally with sample data using Visual Studio Code](visual-studio-code-local-run.md)
- [Test Stream Analytics queries locally against live stream input by using Visual Studio Code](visual-studio-code-local-run-live-input.md)

## Next steps

* [Explore Azure Stream Analytics jobs with Visual Studio Code (preview)](visual-studio-code-explore-jobs.md)
* [Set up CI/CD pipelines and unit testing by using the npm package](./cicd-overview.md)
