---
title: In-depth guide on how to use the Azure Machine Learning Data Preparation execution API | Microsoft Docs
description: This document provides details on executing previously designed data sources and data preparation packages
services: machine-learning
author: euangMS
ms.author: euang
manager: lanceo
ms.reviewer: 
ms.service: machine-learning
ms.workload: data-services
ms.custom: 
ms.devlang: 
ms.topic: article 
ms.date: 09/12/2017
---
# Execute data sources and data preparation packages from Python

To use a data source or data preparation package within Python:

- Go to the **Data** tab of your project.
- Right-click the appropriate source.
- Choose **Generate Data Access Code File.**

This action creates a short Python script that executes the package and returns a dataframe.

## Data sources

The `azureml.dataprep.datasource` module contains a single function to execute a data source and return a dataframe: `load_datasource(path, secrets=None, spark=None)`.
- `path` is the path to the data source (.dsource file).
- `secrets` is an optional dictionary that maps keys to secrets.
- `spark` is an optional bool that specifies whether to return a Spark dataframe or a Pandas dataframe. By default, Azure Machine Learning Workbench determines which kind of dataframe to return at runtime based on context.

## Data preparation packages

The `azureml.dataprep.package` module contains three functions that execute a dataflow from a data preparation package.

### Execution functions

- `submit(package_path, dataflow_idx=0, secrets=None, spark=None)` submits the specified dataflow for execution but does not return a dataframe.
- `run(package_path, dataflow_idx=0, secrets=None, spark=None)` runs the specified dataflow and returns the results as a dataframe.
- `run_on_data(user_config, package_path, dataflow_idx=0, secrets=None, spark=None)` runs the specified dataflow based on an in-memory data source and returns the results as a dataframe. The `user_config` argument is a dictionary that maps the absolute path of a data source (.dsource file) to an in-memory data source represented as a list of lists.

### Common arguments

- `package_path` is the path to the data preparation package (.dprep file).
- `dataflow_idx` is the zero-based index of which dataflow in the package to execute. If the specified dataflow references other dataflows or data sources, they are executed as well.
- `secrets` is an optional dictionary that maps keys to secrets.
- `spark` is an optional bool that specifies whether to return a Spark dataframe or a Pandas dataframe. By default, Machine Learning Workbench determines which kind of dataframe to return at runtime based on context.
