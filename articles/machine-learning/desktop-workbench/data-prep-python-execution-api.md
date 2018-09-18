---
title: In-depth guide on how to use the Azure Machine Learning Data Preparations execution API | Microsoft Docs
description: This document provides details on executing previously designed Data Sources and Data Preparations packages
services: machine-learning
author: euangMS
ms.author: euang
manager: lanceo
ms.reviewer: jmartens, jasonwhowell, mldocs
ms.service: machine-learning
ms.component: core
ms.workload: data-services
ms.custom: 
ms.devlang: 
ms.topic: article 
ms.date: 02/01/2018

ROBOTS: NOINDEX
---
# Execute Data Sources and Data Preparations packages from Python

[!INCLUDE [workbench-deprecated](../../../includes/aml-deprecating-preview-2017.md)] 



To use an Azure Machine Learning Data Sources or Azure Machine Learning Data Preparations package within Python:

1. Go to the **Data** tab of your project.

2. Right-click the appropriate source.

3. Choose **Generate Data Access Code File.**

This action creates a short Python script that executes the package and returns a dataframe.

## Data Sources

The `azureml.dataprep.datasource` module contains a single function to execute a data source and return a dataframe: `load_datasource(path, secrets=None, spark=None)`.
- `path` is the path to the data source (.dsource file).
- `secrets` is an optional dictionary that maps keys to secrets.
- `spark` is an optional bool that specifies whether to return a Spark dataframe or a Pandas dataframe. By default, Azure Machine Learning Workbench determines which kind of dataframe to return at runtime based on context.

## Data Preparations packages

The `azureml.dataprep.package` module contains three functions that execute a data flow from a Data Preparations package.

### Execution functions

- `submit(package_path, dataflow_idx=0, secrets=None, spark=None)` submits the specified data flow for execution but does not return a dataframe.
- `run(package_path, dataflow_idx=0, secrets=None, spark=None)` runs the specified data flow and returns the results as a dataframe.
- `run_on_data(user_config, package_path, dataflow_idx=0, secrets=None, spark=None)` runs the specified data flow based on an in-memory data source and returns the results as a dataframe. The `user_config` argument is a dictionary that maps the absolute path of a data source (.dsource file) to an in-memory data source represented as a list of lists.

### Common arguments

- `package_path` is the path to the Data Preparations package (.dprep file).
- `dataflow_idx` is the zero-based index of which data flow in the package to execute. If the specified data flow references other data flows or data sources, they are executed as well.
- `secrets` is an optional dictionary that maps keys to secrets.
- `spark` is an optional bool that specifies whether to return a Spark dataframe or a Pandas dataframe. By default, Workbench determines which kind of dataframe to return at runtime based on context.
