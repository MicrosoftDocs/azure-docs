---
title: Supported data sources available with Azure Machine Learning data preparation  | Microsoft Docs
description: This document provides a complete list of supported data sources available for Azure Machine Learning data preparation
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

# Supported data sources for this release 
The following document outlines the list of currently supported data sources in Azure Machine Learning data preparation.

The supported data sources for this release are as follows.

## Types 
### Directory versus file
*Files/Directories*: Choose a single file and read it into data preparation. The file type is parsed to determine the default parameters for the file connection that is on the next screen. Choose a directory or set of files within a directory (the file picker is multiselect). Either approach results in the files being read as a single dataflow with the files appended to each other (with headers stripped out if needed).

The file types are as follows:
- Delimited (.csv, .tsv, .txt, and so on) 
- Fixed width
- Plain text
- JSON file

### CSV file
Reads a comma-separated value file from storage.

#### Options
- Separator
- Comment
- Headers
- Decimal symbol
- File encoding
- Lines to skip

### TSV file
Reads a tab-separated value file from storage.

#### Options
- Comment
- Headers
- File encoding
- Lines to skip

### Excel (.xls/.xlsx)
Reads an Excel file, one sheet at a time, by specifying sheet name or number.

#### Options
- Sheet name/number
- Headers
- Lines to skip

### JSON file
Read a JSON file from storage. Note that the file is "flattened" on read.

#### Options
None

### Parquet
Read a Parquet dataset, either a single file or folder.

Parquet as a format can take various forms in storage. For smaller datasets, a single '.parquet' file is sometimes used. Various Python libraries support reading or writing to single '.parquet' file. Currently, AMLWB relies on the PyArrow Python library for reading Parquet during local 'interactive' use. It supports single '.parquet' files (as long as they were written as such, not as part of a larger dataset). It also supports Parquet datasets. 

A Parquet dataset is a collection of more than one '.parquet' file, each of which represents a smaller partition of a larger dataset. Datasets are usually contained in a folder. They are the default Parquet output format for common platforms such as Spark and Hive.

>[!NOTE]
>When you're reading Parquet data that is in a folder with multiple '.parquet' files, it's safest to select the directory for reading and to tick the **Parquet Dataset** option. This makes PyArrow read the whole folder instead of the individual files. This ensures support for reading more complicated ways of storing Parquet on disk (such as folder partitioning.)

Scale-out execution relies on Spark's Parquet reading capabilities and supports single files as well as folders.

#### Options
*Parquet dataset*: This option determines whether AMLWB uses the unticked mode or the ticked mode. The unticked mode expands a given directory and attempts to read each file in it individually. The ticked mode treats the directory as the whole data set and lets PyArrow figure out the best way to interpret the files.


## Locations
### Local
Local hard drive or mapped network storage location.

### Azure Blob storage
Azure storage (Blob). Requires an Azure subscription.

