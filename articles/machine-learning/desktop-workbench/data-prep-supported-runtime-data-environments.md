---
title: Supported combinations of execution and data environments for Azure Machine Learning Data Preparations | Microsoft Docs
description: This document provides a complete list of supported combinations of different runtimes and data sources for Azure Machine Learning Data Preparations
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
# Supported matrix for this release 

[!INCLUDE [workbench-deprecated](../../../includes/aml-deprecating-preview-2017.md)] 


When your code loads data by using Azure Machine Learning Data Sources or Azure Machine Learning Data Preparations, getting either a Pandas or Spark dataframe, the following combinations of experiment compute environments and data locations are supported:

|     |Local files  |Azure Blob storage  |SQL Server database***  |
|---------|---------|---------|---------|---------|
|Local Python    |     Supported    |Not supported         | Not supported        |         |
|Docker (Linux VM) Python     |Supported in project files only*         | Not supported        |        Not supported |         |
|Docker (Linux VM) PySpark     |Supported in project files only*     |Supported         | Supported**        |         |
|Azure Data Science Virtual Machine Python     |Supported in project files only*         |Not supported         |Not supported         |         |
|Azure Data Science Virtual Machine PySPark     | Supported in project files only*        |Not supported         |Not supported         |         |
|Azure HDInsight PySpark     | Not supported        |Supported         |Supported**         |         |
|Azure HDInsight Python     | Not supported        | Not supported        | Not supported        |         |

Azure Data Lake Store is not currently supported for any compute target.

*When local file paths are used, files within the project are copied into the compute environment and then read there. Files outside the project are not copied, and the paths will no longer resolve in the compute environment. Consider using Data Source Substitution so that your code can use a local file when running locally. Then switch to an Azure Storage blob for a different run configuration. You also can use sampling support on data sources to manage runs on large data only in certain run configurations.

**Uses Maven JDBC SQL Server driver 6.2.1. You must ensure that this package (or a compatible one) is included in your spark_dependencies.yml file for the compute environment.

***Supports Azure SQL Database or SQL Server provided the database can be reached from the compute environment. 
