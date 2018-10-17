---
title: Supported data destinations and outputs available with Azure Machine Learning data preparation  | Microsoft Docs
description: This document provides a complete list of supported destinations and outputs available for Azure Machine Learning data preparation
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

# Supported data exports for this preview 

[!INCLUDE [workbench-deprecated](../../../includes/aml-deprecating-preview-2017.md)] 


It is possible to export to several different formats. You can use these formats to retain the intermediate results of data preparation before you integrate the results into the rest of the Machine Learning workflow.

## Types 
### CSV file 
Write a comma-separated-value file to storage.

#### Options
- Line endings
- Replace nulls with
- Replace errors with 
- Separator


### Parquet 
Write a dataset to storage as Parquet.

Parquet as a format can take various forms in storage. For smaller datasets, a single .parquet file is sometimes used. Various Python libraries support reading and writing to single .parquet files. 

Currently, Azure Machine Learning Workbench relies on the PyArrow Python library for writing out Parquet during local interactive use. This means that single-file Parquet is currently the only Parquet output format that's supported during local interactive use.

During scale-out runs (on Spark), Azure Machine Learning Workbench relies on Spark's Parquet reading and writing capabilities. Spark's default output format for Parquet (currently the only one supported) is similar in structure to a Hive dataset. This means that a folder contains many .parquet files that are each a smaller partition of a larger dataset. 

#### Caveats 
Parquet as a format is relatively young and has some implementation inconsistencies across different libraries. For instance, Spark places restrictions on which characters are valid in column names when writing out to Parquet. PyArrow does not do this. The following characters can't be in a column name: 
- ,
- ;
- {}
- ()
- \\n
- \\t
- =

>[!NOTE]
>- To ensure compatibility with Spark, any time you write data  to Parquet, occurrences of these characters in column names are replaced with and underscore ( _ ).
>- To ensure consistency across local and scale-out runs, any data written to Parquet, via the app, Python, or Spark, has its column names sanitized to ensure Spark compatibility. To ensure expected column names when writing to Parquet characters in Spark, remove the invalid set from the columns before writing them out.



## Locations 
### Local 
Local hard drive or mapped network storage location.

### Azure Blob storage
Azure Blob storage requires an Azure subscription.

