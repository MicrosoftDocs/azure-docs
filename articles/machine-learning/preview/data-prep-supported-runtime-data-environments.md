---
title: Supported combinations of execution and data environments for Azure Machine Learning Data Preparation  | Microsoft Docs
description: This document provides a complete list of supported combinations of different runtimes and data sources for Azure ML data prep
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
ms.date: 09/15/2017
---
# Supported matrix for this release 
When your code is loading data using Data Sources, or with Data Preparations, getting either a Pandas or Spark dataframe, the following combinations of experiment compute environments and data locations are supported:

|     |Local Files  |Azure BLOB  |SQL Server Database***  |
|---------|---------|---------|---------|---------|
|Local Python    |     Supported    |Not Supported         | Not Supported        |         |
|Docker (Linux VM) Python     |Supported in Project files only*         | Not Supported        |        Not Supported |         |
|Docker (Linux VM) PySpark     |Supported in Project Files only*     |Supported         | Supported**        |         |
|Azure Data Science Virtual Machine Python     |Supported in Project files only*         |Not Supported         |Not Supported         |         |
|Azure Data Science Virtual Machine PySPark     | Supported in Project files only*        |Not Supported         |Not Supported         |         |
|Azure HDInsight PySpark     | Not Supported        |Supported         |Supported**         |         |
|Azure HDInsight Python     | Not Supported        | Not Supported        | Not Supported        |         |

Azure Data Lake Store is not currently supported for any compute target.

*When local file paths are used, files within the project are copied into the compute environment and then be read there. Files outside the project are not copied and the paths will no longer resolve in the compute environment. Consider using Data Source Substitution so that your code can use a local file when running locally and then switch to an Azure Storage blob for a different run configuration. You can also use sampling support on Data Sources to manage runs on large data only in certain run configurations.

**Uses Maven JDBC SQL Server driver 6.2.1. You must ensure this package (or a compatible one) is included in your spark_dependencies.yml file for the compute environment.

***Supports Azure SQL Database, Azure SQL Data Warehouse, or Microsoft SQL Server provided the database can be reached from the compute environment. 
