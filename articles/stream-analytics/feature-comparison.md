---
title: Azure Stream Analytics feature comparison
description: This article compares the features supported for Azure Stream Analytics cloud and IoT Edge jobs in the Azure portal, Visual Studio, and Visual Studio Code.
author: mamccrea
ms.author: mamccrea
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 06/27/2019
---

# Azure Stream Analytics feature comparison

With Azure Stream Analytics, you can create streaming solutions in the cloud and at the IoT Edge using [Azure portal](stream-analytics-quick-create-portal.md), [Visual Studio](stream-analytics-quick-create-vs.md), and [Visual Studio Code](quick-create-vs-code.md). The tables in this article show which features are supported by each platform for both job types.

> [!NOTE]
> Visual Studio and Visual Studio Code tools don't support jobs in the China East, China North, Germany Central, and Germany NorthEast regions.

## Cloud job features


|Feature  |Portal  |Visual Studio  |Visual Studio Code  |
|---------|---------|---------|---------|
|Cross platform     |Mac</br>Linux</br>Windows         |Windows        |Mac</br>Linux</br>Windows          |
|Script authoring     |Yes         |Yes         |Yes         |
|Script Intellisense     |Syntax highlighting         |Syntax highlighting</br>Code completion</br>Error marker         |Syntax highlighting</br>Code completion</br>Error marker         |
|Define all types of inputs, outputs, and job configurations     |Yes         |Yes         |Yes         |
|Source control     |No         |Yes         |Yes         |
|CI/CD support     |Partial         |Yes         |Yes         |
|Share inputs and outputs across multiple queries     |No         |Yes         |Yes         |
|Query testing with a sample file     |Yes         |Yes        |Yes         |
|Live data local testing     |No         |Yes       |Yes      |
|List jobs and view job entities     |Yes         |Yes        |Yes         |
|Export a job to a local project     |No         |Yes         |Yes         |
|Submit, start, and stop jobs     |Yes         |Yes         |Yes         |
|View job metrics and diagram     |Yes         |Yes         |Open in portal         |
|View job runtime errors     |Yes         |Yes         |No         |
|Resource logs     |Yes         |No         |No         |
|Custom message properties     |Yes         |Yes         |No       |
|C# custom code function and Deserializer|Read-only mode|Yes|No|
|JavaScript UDF and UDA     |Yes         |Yes         |Windows only         |
|Machine Learning Service     |Yes        |Yes         |No         |
|Machine Learning Studio     |Yes, but the query cannot be tested        |Yes |No         |
|Compatibility level     |1.0</br>1.1</br>1.2  (default)         |1.0</br>1.1</br>1.2 (default)           |1.0</br>1.1</br>1.2 (default)           |
|Built-in ML-based Anomaly Detection functions     |Yes         |Yes         |Yes         |
|Built-in GeoSpatial functions     |Yes         |Yes         |Yes         |



## IoT Edge job features

|Feature  |Portal  |Visual Studio  |Visual Studio Code  |
|---------|---------|---------|---------|
|Job authoring     |Yes         |Yes         |No         |
|Source control     |No         |Yes         |No         |
|Export a job to a local project     |No         |Yes         |No         |
|Query testing with a sample file     |Yes         |Yes         |No         |
|Share inputs and outputs across multiple queries     |No         |Yes         |No         |
|C# UDF     |No         |Yes         |No         |
|Submit jobs     |Yes         |Yes         |No         |
|List jobs and view job entities     |Yes         |Yes         |No         |
|View job metrics and diagram     |Yes         |Partial         |No         |
|View job runtime errors     |Yes         |Partial         |No         |
|CI/CD support     |No         |No         |No         |


## Next steps

* [Azure Stream Analytics on IoT Edge](stream-analytics-edge.md)
* [Tutorial: Write a C# user-defined function for Azure Stream Analytics IoT Edge job (Preview)](stream-analytics-edge-csharp-udf.md)
* [Develop Stream Analytics IoT Edge jobs using Visual Studio tools](stream-analytics-tools-for-visual-studio-edge-jobs.md)
* [Use Visual Studio to view Azure Stream Analytics jobs](stream-analytics-vs-tools.md)
* [Explore Azure Stream Analytics with Visual Studio Code (Preview)](visual-studio-code-explore-jobs.md)


