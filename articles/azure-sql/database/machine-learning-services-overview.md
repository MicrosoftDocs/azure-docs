---
title: Machine Learning Services with R (preview)
description: This article describes Azure SQL Database Machine Learning Services (with R) and explains how it works.
services: sql-database
ms.service: sql-database
ms.subservice: machine-learning
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: garyericson
ms.author: garye
ms.reviewer: carlrab
manager: cgronlun
ms.date: 11/20/2019
ROBOTS: NOINDEX
---

# Azure SQL Database Machine Learning Services with R (preview)
[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]

Machine Learning Services is a feature of Azure SQL Database, used for executing in-database R scripts. The feature includes Microsoft R packages for high-performance predictive analytics and machine learning. The relational data can be used in R scripts through stored procedures, T-SQL script containing R statements, or R code containing T-SQL.

[!INCLUDE[ml-preview-note](../../../includes/sql-database-ml-preview-note.md)]

## What you can do with R

Use the power of the R language to deliver advanced analytics and machine learning in-database. This ability brings calculations and processing to where the data resides, eliminating the need to pull data across the network. Also, you can leverage the power of enterprise R packages to deliver advanced analytics at scale.

Machine Learning Services includes a base distribution of R, overlaid with enterprise R packages from Microsoft. Microsoft's R functions and algorithms are engineered for both scale and utility, delivering predictive analytics, statistical modeling, data visualizations, and leading-edge machine learning algorithms.

### R packages

Most common open-source R packages are pre-installed in Machine Learning Services. The following R packages from Microsoft are also included:

| R package | Description|
|-|-|
| [Microsoft R Open](https://mran.microsoft.com/rro) | Microsoft R Open is the enhanced distribution of R from Microsoft. It's a complete open-source platform for statistical analysis and data science. It's based on and 100% compatible with R, and includes additional capabilities for improved performance and reproducibility. |
| [RevoScaleR](https://docs.microsoft.com/sql/advanced-analytics/r/ref-r-revoscaler) | RevoScaleR is the primary library for scalable R. Functions in this library are among the most widely used. Data transformations and manipulation, statistical summarization, visualization, and many forms of modeling and analyses are found in these libraries. Additionally, functions in these libraries automatically distribute workloads across available cores for parallel processing, with the ability to work on chunks of data that are coordinated and managed by the calculation engine. |
| [MicrosoftML (R)](https://docs.microsoft.com/sql/advanced-analytics/r/ref-r-microsoftml) | MicrosoftML adds machine learning algorithms to create custom models for text analysis, image analysis, and sentiment analysis. |

In addition to the pre-installed packages, you can [install additional packages](machine-learning-services-add-r-packages.md).

<a name="signup"></a>

## Sign up for the preview (closed)

> [!IMPORTANT]
> Sign up for Azure SQL Database Machine Learning Services (preview) is currently **closed**.

## Next steps

- See the [key differences from SQL Server Machine Learning Services](machine-learning-services-differences.md).
- To learn how to use R to query Azure SQL Database Machine Learning Services (preview), see the [Quickstart guide](connect-query-r.md).
- To get started with some simple R scripts, see [Create and run simple R scripts in Azure SQL Database Machine Learning Services (preview)](r-script-create-quickstart.md).
 