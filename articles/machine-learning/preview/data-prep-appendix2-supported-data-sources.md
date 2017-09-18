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

# Supported Data Sources for this release 

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

## Locations
### Local
Local hard drive or mapped network storage location

### Azure BLOB
Azure Storage (BLOB), requires an Azure subscription

