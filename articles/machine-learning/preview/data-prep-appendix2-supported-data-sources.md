---
title: Supported data sources available with Azure Machine Learning Data Preparation  | Microsoft Docs
description: This document provides a complete list of supported data sources available for Azure ML data prep
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
The following document outlines the currently supported list of Data Sources in Data Prep.

The supported data sources for this release are listed below.

## Types 
### Directory vs File
Files/Directories - Choose a single file and read it into Data Prep, the file type is parsed to determine the default parameters for the file connection that is on the next screen. Choose a directory or set of files within a directory (the file picker is multiselect), using either approach results in the files being read in as a single dataflow with the files appended to each other (with headers stripped out if needed)

The supported types of file are;
- Delimited(csv, tsv, txt, etc.), 
- Fixed Width
- Plain Text
- JSON File

### CSV File
Read a Comma-Separated Value file from storage

#### Options
- Separator
- Comment
- Headers
- Decimal Symbol
- File Encoding
- Lines To Skip

### TSV File
Read a Tab Separated Value file from storage

#### Options
- Comment
- Headers
- File Encoding
- Lines To Skip

### Excel (.xls/xlsx)
Read an Excel file, one sheet at a time by specifying sheet name or number

#### Options
- Sheet Name/Number
- Headers
- Lines To Skip

### JSON File
Read a JSON file from storage, note the file is "flattened" on read

#### Options
- None

### Parquet
Read a Parquet dataset, either single file or folder.

Parquet as a format can take various forms in storage. For smaller datasets a single '.parquet' file is sometimes used, various python libraries support reading/writing to single '.parquet' files. For the moment AMLWB relies on the PyArrow python library for reading Parquet during local 'interactive' use. It supports single '.parquet' files (as long as they were written as such, not a part of larger dataset) as well as Parquet Datasets. A Parquet Dataset is a collection of more than one '.parquet' file each of which represent a smaller partition of a larger dataset. Datasets are usually contained in a folder and are the default parquet output format for common platform's such as Spark and Hive.

>[!NOTE]
>When reading Parquet data that is in a folder with multiple '.parquet' files it is safest to select the directory for reading and to tick the 'Parquet Dataset' option. This will make PyArrow read the whole folder instead of the individual files, ensuring support for reading more complicated ways of storing Parquet on disk (such as folder partitioning.)**

Scale-out execution relies on Spark's Parquet reading capabilities and supports single files as well as folders, similarly to local interactive.

#### Options
- Parquet Dataset
  - This option determines whether AMLWB will expand a given directory and attempt to read each file in it individually (The unticked mode) or treat the directory as the whole data set and let PyArrow figure out the best way to interpret the files (The ticked mode).


## Locations
### Local
Local hard drive or mapped network storage location

### Azure BLOB
Azure Storage (BLOB), requires an Azure subscription

