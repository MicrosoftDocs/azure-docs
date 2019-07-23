---
title: Azure Stream Analytics feature comparison
description: This article compares the features supported for Azure Stream Analytics cloud and IoT Edge jobs in the Azure portal, Visual Studio, and Visual Studio Code.
services: stream-analytics
author: mamccrea
ms.author: mamccrea
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 06/27/2019
---

# Azure Stream Analytics feature comparison

With Azure Stream Analytics, you can create streaming solutions in the cloud and at the IoT Edge using [Azure portal](stream-analytics-quick-create-portal.md), [Visual Studio](stream-analytics-quick-create-vs.md), and [Visual Studio Code](quick-create-vs-code.md). The tables in this article show which features are supported by each platform for both job types.

## Cloud job features


|Feature  |Portal  |Visual Studio  |Visual Studio Code  |
|---------|---------|---------|---------|
|Cross platform     |Mac</br>Linux</br>Windows         |Windows        |Mac</br>Linux</br>Windows          |
|Script authoring     |Yes         |Yes         |Yes         |
|Script Intellisense     |Syntax highlighting         |Syntax highlighting</br>Code completion</br>Error marker         |Syntax highlighting</br>Code completion</br>Error marker         |
|Define inputs, outputs, and job configurations     |Yes         |Yes         |Yes         |
|Blob output partitioning     |Yes         |Yes         |Yes         |
|Power BI as output     |Yes         |Yes         |No         |
|SQL database reference data     |Yes         |Yes         |Yes         |
|Custom message properties     |Yes         |No         |No         |
|Share inputs and outputs across multiple queries     |No         |Yes         |Yes         |
|JavaScript UDF and UDA     |Yes         |Yes         |Windows only         |
|Machine Learning callouts     |Yes, but the query cannot be tested        |Yes, but cannot be tested locally         |No         |
|Compatibility level     |1.0</br>1.1</br>1.2         |1.0</br>1.1</br>1.2          |1.0</br>1.1</br>1.2          |
|Built-in ML-based Anomaly Detection functions     |Yes         |Yes         |Yes         |
|Built-in GeoSpatial functions     |Yes         |Yes         |Yes         |
|Query testing with a sample file     |Yes         |Yes         |Yes         |
|Live data local testing     |No         |Yes         |No         |
|List jobs and view job entities     |Yes         |Yes         |Yes         |
|Export a job to a local project     |No         |Yes         |Yes         |
|Submit, start, and stop jobs     |Yes         |Yes         |Yes         |
|Source control     |No         |Yes         |Yes         |
|CI/CD support     |Partial         |Yes         |Yes         |
|View job metrics and diagram     |Yes         |Yes         |Open in portal         |
|View job runtime errors     |Yes         |Yes         |No         |
|Diagnostic logs     |Yes         |No         |No         |


## IoT Edge job features

|Feature  |Portal  |Visual Studio  |Visual Studio Code  |
|---------|---------|---------|---------|
|Job authoring     |Yes         |Yes         |No         |
|Source control     |No         |Yes         |No         |
|Export a job to a local project     |No         |Yes         |No         |
|Query testing with a sample file     |Yes         |Yes         |No         |
|Share inputs and outputs across multiple queries     |No         |Yes         |No         |
|C# UDF     |No         |Yes         |No         |
|Submit, start, and stop jobs     |Yes         |Yes         |No         |
|List jobs and view job entities     |Yes         |Yes         |No         |
|View job metrics and diagram     |Yes         |Partial         |No         |
|View job runtime errors     |Yes         |Partial         |No         |
|CI/CD support     |No         |No         |No         |


## Next steps

* [Azure Stream Analytics on IoT Edge](stream-analytics-edge.md)
* [Tutorial: Write a C# user-defined function for Azure Stream Analytics IoT Edge job (Preview)](stream-analytics-edge-csharp-udf.md)
* [Develop Stream Analytics IoT Edge jobs using Visual Studio tools](stream-analytics-tools-for-visual-studio-edge-jobs.md)
* [Use Visual Studio to view Azure Stream Analytics jobs](stream-analytics-vs-tools.md)
* [Explore Azure Stream Analytics with Visual Studio Code (Preview)](vscode-explore-jobs.md)


