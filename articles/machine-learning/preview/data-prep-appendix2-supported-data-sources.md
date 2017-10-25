---
title: Supported data sources available with Azure Machine Learning data preparation  | Microsoft Docs
description: This document provides a complete list of supported data sources available for Azure Machine Learning data preparation.
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

# Supported data sources for Azure Machine Learning data preparation 
The following document outlines the currently supported list of data sources for Azure Machine Learning data preparation.

The supported Data Sources for this release are as follows.

## Types 
### Directory vs. file
Files and directories: Choose a single file and read it into data preparation. The file type is parsed to determine the default parameters for the file connection shown on the next screen. Choose a directory or a set of files within a directory (the file picker is multiselect). Either approach results in the files being read in as a single data flow, with the files appended to each other (with headers stripped out if needed).

The supported file types are:
- Delimited (.csv, .tsv, .txt, etc.)
- Fixed width
- Plain text
- JSON file

### CSV file
Read a comma-separated value file from storage.

#### Options
- Separator
- Comment
- Headers
- Decimal symbol
- File encoding
- Lines to skip

### TSV file
Read a tab-separated value file from storage.

#### Options
- Comment
- Headers
- File encoding
- Lines to skip

### Excel (.xls/.xlsx)
Read an Excel file one sheet at a time by specifying sheet name or number.

#### Options
- Sheet name or number
- Headers
- Lines to skip

### JSON file
Read a JSON file from storage. Note that the file is "flattened" on read.

#### Options
- None

### Parquet
Read a Parquet dataset, either a single file or folder.

Parquet as a format can take various forms in storage. For smaller datasets, a single .parquet file is sometimes used. Various Python libraries support reading or writing to single .parquet files. For the moment, Azure Machine Learning data preparation relies on the PyArrow Python library for reading Parquet during local "interactive" use. It supports single .parquet files (as long as they were written as such, and not as part of a larger dataset), as well as Parquet datasets. A Parquet dataset is a collection of more than one .parquet file, each of which represents a smaller partition of a larger dataset. Datasets are usually contained in a folder and are the default parquet output format for common platforms such as Spark and Hive.

>[!NOTE]
>When reading Parquet data that's in a folder with multiple .parquet files, it's safest to select the directory for reading, and to tick the "Parquet dataset" option. This will make PyArrow read the whole folder instead of the individual files, ensuring support for reading more complicated ways of storing Parquet on disk (such as folder partitioning).

Scale-out execution relies on Spark's Parquet reading capabilities and supports single files as well as folders, similar to local interactive use.

#### Options
- Parquet dataset. This option determines whether Azure Machine Learning data preparation expands a given directory and attempts to read each file individually (the unticked mode), or whether it treats the directory as the whole dataset and lets PyArrow figure out the best way to interpret the files (the ticked mode).


## Locations
### Local
A local hard drive or a mapped network storage location.

### Azure BLOB
Azure Storage (BLOB), which requires an Azure subscription.

