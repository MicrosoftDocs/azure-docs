---
title: Azure Stream Analytics feature comparison
description: This article compares the features supported for Azure Stream Analytics cloud and IoT Edge jobs in the Azure portal, Visual Studio, and Visual Studio Code.
services: stream-analytics
author: mamccrea
ms.author: mamccrea
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 06/26/2019
---

# Azure Stream Analytics feature comparison

With Azure Stream Analytics, you can create streaming solutions in the cloud and at the IoT Edge using Azure portal, Visual Studio, and Visual Studio Code. The tables in this article show which features are supported by each platform for both job types. The features are organized by category to provide context.

## Cloud job features

|Feature category|Features|Portal|Visual Studio|Visual Studio Code|
|-|-|-|-|-|
|Environment|Cross platform (Mac, Linux, Windows)| * | * | * |
|Job authoring|Script authoring</br></br>Script Intellisense</br></br>Define inputs, outputs, and job configurations|* </br></br>Syntax highlighting</br></br>* | * </br></br></br> * </br></br> * | * </br></br></br> * </br></br> *|
|Inputs and outputs|Blob output partitioning</br></br>Power BI as output</br></br>SQL database reference data</br></br>Custom message properties| * </br></br></br> * </br></br></br> * </br></br></br> * | * </br></br></br> * </br></br></br> * </br></br></br>  | * </br></br></br>  </br></br></br> * </br></br></br>  |
|Job management|Share inputs/outputs across multiple queries|  | * | * |
|Extensibility| JavaScript UDF and UDA </br></br> Machine Learning Callouts| * </br></br></br> * | * </br></br></br> * | * </br></br></br>  |
|Compatibility level|1.0, 1.1, 1.2| * | * | * |
|Built-in functions| Built-in ML based Anomaly Detection Functions </br></br> GeoSpatial| * </br></br></br></br> * | * </br></br></br></br> * | * </br></br></br></br> * |
|Debugging and testing|Query testing with sample file</br></br>Live data testing| * </br></br>  | * </br></br> * | * </br></br>  |
|Explore jobs|List jobs and view job entities</br></br>Export a job to local project| * </br></br></br>  | * </br></br></br> * | * </br></br></br> * |
|Job operations|Submit job, Start, stop job| * | * | * |
|CI/CD and automation|Source control</br></br>CI/CD support| * </br></br> Partial | * </br></br> * | * </br></br> * |
|Monitoring and troubleshooting|View job metrics and diagram</br></br>View job runtime errors</br></br>Diagnostic logs| * </br></br></br> * </br></br></br> * | * </br></br></br> * </br></br></br>  | Portal </br></br></br>  </br></br></br>  |

## IoT Edge job features

|Feature category|Features|Portal|Visual Studio|Visual Studio Code|
|-|-|-|-|-|
|Job authoring|Job authoring</br></br>Source control</br></br>Export a job to local project</br></br>Query testing with local file| * </br></br>  </br></br>  </br></br> * | * </br></br> * </br></br> * </br></br> * |  </br></br>  </br></br>  </br></br>  |
|Job management|Share inputs/outputs across multiple queries|  | * |  |
|Extensibility|C# UDF|  | * |  |
|Debugging and testing|Query testing with a sample file| * | *|  |
|Job operations|Submit, start, and stop job</br></br>List jobs and view job entities| * </br></br></br> * | * </br></br></br> * |  </br></br></br> |
|Monitoring and troubleshooting|View job metrics and diagram</br></br>View job runtime errors| * </br></br></br> * | Partial </br></br></br> Partial|  </br></br></br>  |
|CI/CD and automation|Source control</br></br>CI/CD support| </br></br>  | * </br></br> * |  </br></br>  |


