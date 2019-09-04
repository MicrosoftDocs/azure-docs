---
title: Key differences for Azure SQL Database Machine Learning Services (preview)
description: This topic describes key differences between Azure SQL Database Machine Learning Services (with R) and SQL Server Machine Learning Services.
services: sql-database
ms.service: sql-database
ms.subservice: machine-learning
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: dphansen
ms.author: davidph
ms.reviewer: carlrab
manager: cgronlun
ms.date: 03/01/2019
---
# Key differences between Machine Learning Services in Azure SQL Database (preview) and SQL Server

The functionality of Azure SQL Database Machine Learning Services (with R) in  (preview) is similar to [SQL Server Machine Learning Services](https://docs.microsoft.com/sql/advanced-analytics/what-is-sql-server-machine-learning). Below are some key differences.

> [!IMPORTANT]
> Azure SQL Database Machine Learning Services is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Language support

SQL Server has support for R and Python through the [extensibility framework](https://docs.microsoft.com/sql/advanced-analytics/concepts/extensibility-framework). SQL Database does not support both languages. The key differences are:

- R is the only supported language in SQL Database. There is no support for Python at this time.
- The R version is 3.4.4.
- There is no need to configure `external scripts enabled` via `sp_configure`. Once you are [signed up](sql-database-machine-learning-services-overview.md#signup), machine learning is enabled for your SQL database.

## Package management

R package management and installation work different between SQL Database and SQL Server. These differences are:

- R packages are installed via [sqlmlutils](https://github.com/Microsoft/sqlmlutils) or [CREATE EXTERNAL LIBRARY](https://docs.microsoft.com/sql/t-sql/statements/create-external-library-transact-sql).
- Packages cannot perform outbound network calls. This limitation is similar to the [default firewall rules for Machine Learning Services](https://docs.microsoft.com//sql/advanced-analytics/security/firewall-configuration) in SQL Server, but can't be changed in SQL Database.
- There is no support for packages that depend on external runtimes (like Java) or need access to OS APIs for installation or usage.

## Writing to a temporary table

If you're using RODBC in Azure SQL Database, then you can't write to a temporary table, whether it's created inside or outside of the `sp_execute_external_script` session. The workaround is to use [RxOdbcData](https://docs.microsoft.com/machine-learning-server/r-reference/revoscaler/rxodbcdata) and [rxDataStep](https://docs.microsoft.com/machine-learning-server/r-reference/revoscaler/rxdatastep) (with overwrite=FALSE and append="rows") to write to a global temporary table created before the `sp_execute_external_script` query.

## Resource governance

It is not possible to limit R resources through [Resource Governor](https://docs.microsoft.com/sql/relational-databases/resource-governor/resource-governor) and external resource pools.

During the public preview, R resources are set to a maximum of 20% of the SQL Database resources, and depend on which service tier you choose. For more information, see [Azure SQL Database purchasing models](https://docs.microsoft.com/azure/sql-database/sql-database-service-tiers).
### Insufficient memory error

If there is insufficient memory available for R, you will get an error message. Common error messages are:

- Unable to communicate with the runtime for 'R' script for request id: *******. Please check the requirements of 'R' runtime
- 'R' script error occurred during execution of 'sp_execute_external_script' with HRESULT 0x80004004. ...an external script error occurred: "..could not allocate memory (0 Mb) in C function 'R_AllocStringBuffer'"
- An external script error occurred: Error: cannot allocate vector of size.

Memory usage depends on how much is used in your R scripts and the number of parallel queries being executed. If you receive the errors above, you can scale your database to a higher service tier to resolve this.

## Next steps

- See the overview, [Azure SQL Database Machine Learning Services with R (preview)](sql-database-machine-learning-services-overview.md).
- To learn how to use R to query Azure SQL Database Machine Learning Services (preview), see the [Quickstart guide](sql-database-connect-query-r.md).
- To get started with some simple R scripts, see [Create and run simple R scripts in Azure SQL Database Machine Learning Services (preview)](sql-database-quickstart-r-create-script.md).
