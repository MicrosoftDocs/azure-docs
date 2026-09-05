---
title: 'Stream Analytics: Portal vs. Visual Studio Code'
description: Compare the features that the Azure portal and Visual Studio Code support for building Azure Stream Analytics jobs so you can choose the right tool.
author: spelluru
ms.author: spelluru
ms.service: azure-stream-analytics
ms.topic: product-comparison
ms.date: 08/25/2026
ai-usage: ai-assisted
#customer intent: As a Stream Analytics developer, I want to compare the Azure portal and Visual Studio Code so that I can choose the best tool for building my streaming jobs.
---

# Choose a developer tool for building Stream Analytics jobs

Azure Stream Analytics gives you two tools for building streaming jobs: the Azure portal and the [Azure Stream Analytics tools extension for Visual Studio Code](quick-create-visual-studio-code.md). Use the extension to write, debug, and run your streaming query locally. Each tool supports a different set of features, so the right choice depends on your development workflow.

This article compares the features that the Azure portal and Visual Studio Code support so you can choose the tool that fits your needs.

> [!NOTE]
> Visual Studio Code tools don't support jobs in the China East, China North, Germany Central, and Germany Northeast regions.

## Cloud job features

The following table compares the cloud job authoring features that the Azure portal and the Visual Studio Code extension support, including source control, testing, monitoring, and language support.

| Feature | Portal | Visual Studio Code |
| --- | --- | --- |
| Cross platform | Mac<br/>Linux<br/>Windows | Mac<br/>Linux<br/>Windows |
| Script authoring | Yes | Yes |
| Script IntelliSense | Syntax highlighting | Syntax highlighting<br/>Code completion<br/>Error marker |
| Define all types of inputs, outputs, and job configurations | Yes | Yes |
| Source control | No | Yes |
| CI/CD support | Partial | Yes |
| Share inputs and outputs across multiple queries | No | Yes |
| Query testing with a sample file | Yes | Yes |
| Live data local testing | No | Yes |
| Time policy support in query testing | No | Yes |
| List jobs and view job entities | Yes | Yes |
| Export a job to a local project | No | Yes |
| Submit, start, and stop jobs | Yes | Yes |
| View job metrics and diagram | Yes | Yes |
| View job runtime errors | Yes | Yes |
| Resource logs | Yes | Yes |
| Custom message properties | Yes | Yes |
| C# custom code function and deserializer | Read-only mode | Yes |
| JavaScript UDF and UDA | Yes | Windows only |
| Azure Machine Learning | Yes | Yes |
| Compatibility level | 1.0<br/>1.1<br/>1.2 (default) | 1.0<br/>1.1<br/>1.2 (default) |
| Built-in ML-based anomaly detection functions | Yes | Yes |
| Built-in geospatial functions | Yes | Yes |
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


## Related content

* [Azure Stream Analytics on IoT Edge](stream-analytics-edge.md)
* [Tutorial: Write a C# user-defined function for Azure Stream Analytics IoT Edge job (Preview)](stream-analytics-edge-csharp-udf.md)
* [Develop Stream Analytics IoT Edge jobs using Visual Studio tools](stream-analytics-tools-for-visual-studio-edge-jobs.md)
* [Use Visual Studio to view Azure Stream Analytics jobs](stream-analytics-vs-tools.md)
* [Explore Azure Stream Analytics with Visual Studio Code (Preview)](visual-studio-code-explore-jobs.md)


