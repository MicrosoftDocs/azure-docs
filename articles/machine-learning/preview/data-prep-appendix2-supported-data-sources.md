---
title: Supported Data Sources | Microsoft Docs
description: Tells which data sources are supported for AML workbench
author: cforbe
ms.author: cforbe@microsoft.com
ms.date: 9/7/2017
---
# Supported Data Sources #

## Types ##
### Common to all file sources ###

### Directory vs File ###
File - Choose a single file and read it into Data Prep, the file type is parsed to determine the default parameters for the file connection that is on the next screen.

Directory - Choose a directory or set of files within a directory (the file picker is multiselect), using either approach results in the files being read in as a single dataflow with the files appended to each other (with headers stripped out of needed)
### CSV File ###
Read a Comma Separated Value file from storage.

#### Options: ####
- Separator
- Comment
- Headers
- Decimal Symbol
- File Encoding
- Lines To Skip

### TSV File ###
Read a Tab Separated Value file from storage.

#### Options: ####
- Comment
- Headers
- File Encoding
- Lines To Skip

### Excel (.xls/xlsx) ###
Read an Excel file, one sheet at a time by specifying sheet name or number.

#### Options: ####
- Sheet Name/Number
- Headers
- Lines To Skip

### JSON File ###
Read a JSON file from storage, note the file will be "flattened" on read.

#### Options: ####
- None


## Locations ##
### Local ###
Local hard drive or mapped network storage location.

### Azure BLOB ###
Azure Storage (BLOB), requires an Azure subscription.

### Azure Data Lake ###
Azure Data Lake Storage, requires an Azure subscription.