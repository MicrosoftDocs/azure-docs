---
title: Known Issues for Machine Learning Services (with R) in Azure SQL Database (Preview) Overview
description: This topic describes known issues for Azure SQL Database Machine Learning Services (with R).
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
# Key differences between Machine Learning Services in Azure SQL Database and SQL Server

The functionality of Machine Learning Services (with R) in Azure SQL Database is similar to [SQL Server Machine Learning Services](https://docs.microsoft.com/sql/advanced-analytics/what-is-sql-server-machine-learning). Below are some key differences between these.

## Language support and configuration

- R only. Currently there is no support for Python.
- R version is 3.4.4
- No need to configure `external scripts enabled` via `sp_configure`. Once you are [signed up](sql-database-machine-learning-services-overview.md#signup), machine learning is enabled for your SQL database.

## Package management

- R packages are installed via [sqlmlutils](https://github.com/Microsoft/sqlmlutils) or [CREATE EXTERNAL LIBRARY](https://docs.microsoft.com/sql/t-sql/statements/create-external-library-transact-sql).
- Packages cannot perform outbound network calls. This limitation is similar to the [default firewall rules](https://docs.microsoft.com//sql/advanced-analytics/security/firewall-configuration) in SQL Server, but cannot be changed.
- No support for packages that depend on external runtimes (like Java) or need access to OS APIs for installation or usage.

## Resource governance

There is no support for [Resource Governor](https://docs.microsoft.com/sql/relational-databases/resource-governor/resource-governor) or external resource pools. R resources are a percentage of the SQL resources, and depend on which service tier you choose. For more information, see [Azure SQL Database purchasing models](https://docs.microsoft.com/azure/sql-database/sql-database-service-tiers).

## Security isolation

- SQLPAL provides isolation for external processes.

## Next steps

- See the [SQL Server Machine Learning Services](https://docs.microsoft.com/sql/advanced-analytics) documentation for general information
- To learn how to use Machine Learning Services (with R) in Azure SQL Database, see [Quickstart guide](sql-database-connect-query-r.md).
- Learn more with [SQL Server R language tutorials](https://docs.microsoft.com/sql/advanced-analytics/tutorials/sql-server-r-tutorials)