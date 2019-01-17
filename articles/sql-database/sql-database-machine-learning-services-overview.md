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
ms.date: 01/17/2019
---
# Machine Learning Services (with R) in Azure SQL Database (preview)

Azure SQL Database Machine Learning Services is an add-on to a database engine instance, used for executing R code on a SQL database. The feature includes Microsoft R packages for high-performance predictive analytics and machine learning. Code is fully available to relational data as stored procedures, as T-SQL script containing R statements, or as R code containing T-SQL.

Use the power of enterprise R packages to deliver advanced analytics at scale, and the ability to bring calculations and processing to where the data resides, eliminating the need to pull data across the network.

<a name="signup"></a>

## Sign up for the preview

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

The public preview of Machine Learning Services (with R) in SQL Database is not enabled by default. Send an email to Microsoft at [sqldbml@microsoft.com](mailto:sqldbml@microsoft.com) to sign up for the public preview.

Once you are enrolled in the program, Microsoft will onboard you to the public preview and either migrate your existing database or create a new database on an R enabled service.

Machine Learning Services (with R) in SQL Database is currently only available in the vCore-based purchasing model in the **General Purpose** and **Business Critical** service tiers for single and pooled databases. In this initial public preview, neither the **Hyperscale** service tier nor **Managed Instance** are supported.

Currently, R is the only supported language. There is no support for Python at this time. The preview is initially available in a limited number of regions in US, Asia Europe, and Australia with additional regions being added later.

You should not use Machine Learning Services with R for production workloads during the public preview.

## Different from SQL Server

The functionality of Machine Learning Services (with R) in Azure SQL Database is similar to [SQL Server Machine Learning Services](https://docs.microsoft.com/sql/advanced-analytics/what-is-sql-server-machine-learning). However, there are some differences:

- R only. Currently there is no support for Python.
- R version is 3.4.4
- No need to configure `external scripts enabled` via `sp_configure`.
- Packages have to be installed via **sqlmlutils**.
- There is no separate external resource governance. R resources are a certain percentage of the SQL resources, depending on the tier.

## Next steps

- To learn how to use Machine Learning Services (with R) in Azure SQL Database, see [Quickstart guide](sql-database-connect-query-r.md).
- Learn more with [SQL Server R language tutorials](https://docs.microsoft.com/sql/advanced-analytics/tutorials/sql-server-r-tutorials)
