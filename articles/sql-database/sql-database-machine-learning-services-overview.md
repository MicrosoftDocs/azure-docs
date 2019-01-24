---
title: Machine Learning Services (with R) in Azure SQL Database (Preview) Overview
description: This topic describes Azure SQL Database Machine Learning Services (with R) and explains how it works.
services: sql-database
ms.service: sql-database
ms.subservice: machine-learning-services
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: dphansen
ms.author: davidph
ms.reviewer: carlrab
manager: cgronlun
ms.date: 01/24/2019
---
# Machine Learning Services (with R) in Azure SQL Database (preview)

Machine Learning Services is an add-on to Azure SQL Database, used for executing in-database R scripts. The feature includes Microsoft R packages for high-performance predictive analytics and machine learning. Code is fully available to relational data as stored procedures, as T-SQL script containing R statements, or as R code containing T-SQL.

> [!NOTE]
> Machine Learning Services (with R) in Azure SQL Database is currently in public preview. [Sign up for the preview](#signup) below.

## What you can do with R

Use the power of enterprise R packages to deliver advanced analytics at scale, and the ability to bring calculations and processing to where the data resides, eliminating the need to pull data across the network.

Machine Learning Services includes a base distribution of R, overlaid with enterprise R packages from Microsoft so that you can load and process large amounts of data on multiple cores and aggregate the results into a single consolidated output. Microsoft's R functions and algorithms are engineered for both scale and utility, delivering predictive analytics, statistical modeling, data visualizations, and leading-edge machine learning algorithms.

## R packages

The following R packages from Microsoft are included:

| R package | Description|
|-|-|
|  [RevoScaleR](https://docs.microsoft.com/sql/advanced-analytics/r/ref-r-revoscaler) | RevoScaleR is the primary library for scalable R. Functions in this library are among the most widely used. Data transformations and manipulation, statistical summarization, visualization, and many forms of modeling and analyses are found in these libraries. Additionally, functions in these libraries automatically distribute workloads across available cores for parallel processing, with the ability to work on chunks of data that are coordinated and managed by the calculation engine. |
| [MicrosoftML (R)](https://docs.microsoft.com/sql/advanced-analytics/r/ref-r-microsoftml) | MicrosoftML adds machine learning algorithms to create custom models for text analysis, image analysis, and sentiment analysis. |
| [sqlRUtils](https://docs.microsoft.com/sql/advanced-analytics/r/ref-r-sqlrutils) | sqlRUtils provides helper functions for putting R scripts into a T-SQL stored procedure, registering a stored procedure with a database, and running the stored procedure from an R development environment.
| [olapR](https://docs.microsoft.com/sql/advanced-analytics/r/ref-r-olapr) | olapR is for building or executing an MDX query in R script. |

<a name="signup"></a>

## Sign up for the preview

To sign up for the public preview, follow these steps:

1. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

2. Send an email to Microsoft at [sqldbml@microsoft.com](mailto:sqldbml@microsoft.com) to sign up for the public preview. The public preview of Machine Learning Services (with R) in SQL Database is not enabled by default.

Once you are enrolled in the program, Microsoft will onboard you to the public preview and either migrate your existing database or create a new database on an R enabled service.

Machine Learning Services (with R) in SQL Database is currently only available in the vCore-based purchasing model in the **General Purpose** and **Business Critical** service tiers for standalone and elastic pool deployment choices. In this initial public preview, the **Hyperscale** service tier and **Managed Instance** deployment choice are not supported.

Currently, R is the only supported language. There is no support for Python at this time. The preview is initially available in a limited number of regions in US, Asia Europe, and Australia with additional regions being added later.

Do not use Machine Learning Services with R for production workloads during the public preview.

## Next steps

- See the [key differences from SQL Server Machine Learning Services](sql-database-machine-learning-services-differences.md)
- To learn how to use Machine Learning Services (with R) in Azure SQL Database, see [Quickstart guide](sql-database-connect-query-r.md).
- Learn more with [SQL Server R language tutorials](https://docs.microsoft.com/sql/advanced-analytics/tutorials/sql-server-r-tutorials)