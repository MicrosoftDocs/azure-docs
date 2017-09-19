---
title: Supported data destinations/outputs available with Azure Machine Learning Data Preparation  | Microsoft Docs
description: This document provides a complete list of supported destinations/outputs available for Azure ML data prep
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
ms.date: 09/07/2017
---

# Supported data exports for this preview 
It is possible to export to several different formats. These formats can be used to retain intermediate results of data prep before integrating into the rest of the Machine Learning workflow.

## Types 
### CSV File 
Write a Comma-Separated Value file to storage

#### Options
- Line Endings
- Replace Nulls With
- Replace Errors with 
- Separator


### Parquet ###
Write a dataset storage as Parquet.

Parquet as a format can take various forms in storage. For smaller datasets a single '.parquet' file is sometimes used, various python libraries support reading/writing to single '.parquet' files. For the moment AMLWB relies on the PyArrow python library for writing out Parquet during local 'interactive' use. It means that single file parquet is the only supported Parquet output format locally.

During scale-out runs (on Spark), AMLWB relies on Spark's Parquet reading/writing capabilities. Spark's default output format for Parquet (currently the only one supported) is similar in structure to a HIVE dataset. It means a folder containing many '.parquet' files that are each a smaller partition of a larger dataset. AMLWB can read it 'partitioned' output in local and scale-out through use of the 'Parquet Dataset' option when adding a Parquet datasource.

#### Caveats ####
Parquet as a format is relatively young and has some implementation inconsistencies across different libraries. For instance, Spark places restrictions on what characters are valid to have in Column Names when writing out to Parquet which PyArrow does not. Any character in the set, " ,;{}()\\n\\t=", cannot be in a Column Name.

>[!NOTE]
>To ensure compatibility with Spark, anytime data is written to Parquet, occurrences of these characters in Column Names are replaced with '_' (underscore).**

>[!NOTE]
>To ensure consistency across local and scale-out any data written to Parquet, via the app, Python, or Spark, has its Column Names sanitized to ensure Spark compatibility.**



## Locations 
### Local 
Local hard drive or mapped network storage location

### Azure BLOB 
Azure Storage (BLOB), requires an Azure subscription

