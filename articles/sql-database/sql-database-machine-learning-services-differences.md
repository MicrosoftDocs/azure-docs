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
ms.date: 01/17/2019
---
# Key differences between Machine Learning Services (with R) in Azure SQL Database (preview) and SQL Server Machine Learning Services

The functionality of Machine Learning Services (with R) in Azure SQL Database is similar to [SQL Server Machine Learning Services](https://docs.microsoft.com/sql/advanced-analytics/what-is-sql-server-machine-learning). 

However, there are some key differences:

- R only. Currently there is no support for Python.
- R version is 3.4.4
- No need to configure `external scripts enabled` via `sp_configure`.
- Packages have to be installed via [sqlmlutils](https://github.com/Microsoft/sqlmlutils) or [CREATE EXTERNAL LIBRARY](https://docs.microsoft.com/sql/t-sql/statements/create-external-library-transact-sql).
- Packages cannot perform outbound network calls. This is similar to the [default firewall rules](https://docs.microsoft.com//sql/advanced-analytics/security/firewall-configuration) in SQL Server, but cannot be changed.
- There is no separate external resource governance. R resources are a certain percentage of the SQL resources, depending on the tier.
- SQLPAL provides isolation for external processes.

## Next steps

- See the [SQL Server Machine Learning Services](https://docs.microsoft.com/sql/advanced-analytics) documentation for general information
- To learn how to use Machine Learning Services (with R) in Azure SQL Database, see [Quickstart guide](sql-database-connect-query-r.md).
- Learn more with [SQL Server R language tutorials](https://docs.microsoft.com/sql/advanced-analytics/tutorials/sql-server-r-tutorials)