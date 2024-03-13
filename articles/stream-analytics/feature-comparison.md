---
title: Choose a developer tool for building Stream Analytic jobs
description: This article compares the features supported for Azure Stream Analytics cloud and IoT Edge jobs in the Azure portal, Visual Studio, and Visual Studio Code.
author: alexlzx
ms.author: zhenxilin
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 11/09/2022
---

# Choose developer tool for building Stream Analytic jobs

Beside building your Stream Analytic jobs in the Azure portal, you can use the [Azure Stream Analytics Tools extension for Visual Studio Code](quick-create-visual-studio-code.md) to write, debug and run your streaming query locally for better development experience. 

This table shows what features are supported between Azure portal and Visual Studio Code. 

> [!NOTE]
> Visual Studio Code tools don't support jobs in the China East, China North, Germany Central, and Germany NorthEast regions.

## Cloud job features

|Feature  |Portal  |Visual Studio Code  |
|---------|---------|---------|
|Cross platform     |Mac</br>Linux</br>Windows        |Mac</br>Linux</br>Windows          |
|Script authoring     |Yes         |Yes         |
|Script Intellisense     |Syntax highlighting         |Syntax highlighting</br>Code completion</br>Error marker         |
|Define all types of inputs, outputs, and job configurations     |Yes         |Yes         |
|Source control     |No          |Yes         |
|CI/CD support     |Partial         |Yes         |
|Share inputs and outputs across multiple queries     |No          |Yes         |
|Query testing with a sample file     |Yes        |Yes         |
|Live data local testing     |No        |Yes      |
| Time policy support in query testing | No        |Yes      |
|List jobs and view job entities     |Yes          |Yes         |
|Export a job to a local project     |No        |Yes         |
|Submit, start, and stop jobs     |Yes          |Yes         |
|View job metrics and diagram     |Yes         |Yes         |
|View job runtime errors     |Yes        |Yes         |
|Resource logs     |Yes        |Yes         |
|Custom message properties     |Yes        |Yes       |
|C# custom code function and Deserializer|Read-only mode|Yes|
|JavaScript UDF and UDA     |Yes        |Windows only         |
|Azure Machine Learning      |Yes        |Yes         |
|Compatibility level     |1.0</br>1.1</br>1.2  (default)         |1.0</br>1.1</br>1.2 (default)           |
|Built-in ML-based Anomaly Detection functions     |Yes         |Yes         |
|Built-in GeoSpatial functions     |Yes         |Yes         |
| Power BI output | Yes | No |
| Protobuf serialization | Yes | No |
| Autogranting managed identity permissions for added endpoints | Yes | No | 

<!-- 
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
|View job metrics and diagram     |Yes         |Yes         |Yes         |
|View job runtime errors     |Yes         |Yes         |Yes         |
|Resource logs     |Yes         |No         |Yes         |
|Custom message properties     |Yes         |Yes         |Yes       |
|C# custom code function and Deserializer|Read-only mode|Yes|Yes|
|JavaScript UDF and UDA     |Yes         |Yes         |Windows only         |
|Azure Machine Learning      |Yes        |Yes         |Yes         |
|Compatibility level     |1.0</br>1.1</br>1.2  (default)         |1.0</br>1.1</br>1.2 (default)           |1.0</br>1.1</br>1.2 (default)           |
|Built-in ML-based Anomaly Detection functions     |Yes         |Yes         |Yes         |
|Built-in GeoSpatial functions     |Yes         |Yes         |Yes         |
 -->

<!-- 
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
|CI/CD support     |No         |No         |No         | -->


## Next steps

* [Azure Stream Analytics on IoT Edge](stream-analytics-edge.md)
* [Tutorial: Write a C# user-defined function for Azure Stream Analytics IoT Edge job (Preview)](stream-analytics-edge-csharp-udf.md)
* [Develop Stream Analytics IoT Edge jobs using Visual Studio tools](stream-analytics-tools-for-visual-studio-edge-jobs.md)
* [Use Visual Studio to view Azure Stream Analytics jobs](stream-analytics-vs-tools.md)
* [Explore Azure Stream Analytics with Visual Studio Code (Preview)](visual-studio-code-explore-jobs.md)


