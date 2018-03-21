---
title: In-depth guide on how to use the Azure Machine Learning Data Preparations Operationalization | Microsoft Docs
description: This document provides details on executing previously designed Data Sources and Data Preparations packages
services: machine-learning
author: hughz
ms.author: cforbe
manager: mwinkle
ms.reviewer: garyericson, jasonwhowell, mldocs
ms.service: machine-learning
ms.workload: data-services
ms.custom: 
ms.devlang: 
ms.topic: article 
ms.date: 02/13/2018
---

# Data Preparation Operationalization 

## Operationalization Scenario

The following are the different Data Preparation Operationalization scenarios that a user could come across.

### Develop your model based on training data

Suppose you are looking to create and deploy a real-time scoring API service. The first step is to develop a model for scoring based on some set of training data. Data Prep imports a sample of your training data as a new data source. Once the data is prepared, the DataPrep Package contains the preparation steps. Using an AzureML Experimentation Account, the user can iterate on a machine learning model for generating labels for each input in the training data.

As features of the data need to be updated, the user returns to the DataPrep package to prepare the data in a new way and save those steps. This iteration process of generating new features and tweaking their machine learning model continues until the model accurately scores their test data. 

### Deploy your model to the Azure Model Management Service

Now you have customer data that you would like to score in real time. Using the Azure Model Management Service, you can deploy this model from the AzureML Python CLI as a service. The deployed service exposes a REST endpoint for receiving customer data in real time and returning the corresponding output labels from your trained model.

For ease of use, the model endpoint accepts data in JSON format. The input should be a JSON string representing a 2-dimensional array of data, which will be passed through the ReadJSONLiteral transform and converted into a DataPrep data source. The data prep package created during the experimentation phase can then be executed against the streamed JSON data. The resulting dataframe can then be passed to the trained model for scoring.

## Read JSON Literal Transformation

### Description

For operationalization purposes, Data Prep contains a **ReadJsonLiteral** transform to execute an activity and generate a Pandas or Spark Dataframe. This transformation uniquely takes as input an existing data prep package and a JSON data source. This transform is exposed through the DataPrep Python CLI.

### Instructions

#### PythonCLI

From the Azure Machine Learning Workbench, open the Command-Line Interface (File > Open Command Prompt).

In this example, the TrainingPreparationSteps data prep package is used to prepare the data and add the volume feature to each input.

```
>>> import azureml.dataprep.package as azdp

>>> azdp.run_on_data.__doc__
"Generate a dataframe based on a selected dataflow in a package using in-memory data sources.
'user_config' is expected as a dictionary that maps the absolute path of a dsource file to an in-memory data source represented as a list of lists."

>>> real_time_customer_data = [[1.0, 1.5, 2.5], [2.5, 1.5, 3]]
>>> azdp.run_on_data({ "C:\\TrainingSampleData.dsource": real_time_customer_data}, "C:\\TrainingPreparationSteps.dprep")
    Height   Width   Depth  Volumne
0   1.0       1.5    2.5    3.75
1   2.5       1.5    3.0    11.25
```

`run_on_data()` has the following optional parameters
 - `dataflow_idx`: specify the index of the desired dataflow to execute in the package
 - `secrets`: secret store dictionary (key: secretId, value: stored secret)
 - `spark`: provide a spark session for spark execution

#### Input

A 2-dimensional array input ("array of arrays"). In Python, the input should be a list of lists. Since JSON does not have a native date type, any Python datetime.datetime objects will be converted into to ISO-formatted date strings. For REST endpoints, the input should be a JSON literal string representing a 2-D JSON array.

#### Output

A Pandas or Spark DataFrame. The type of DataFrame is determined by the framework selected in the run configuration (`.runconfig`). The resulting dataframe can be passed as input to the trained model for scoring.
