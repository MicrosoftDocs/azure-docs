---
title: Key differences for Machine Learning Services
description: This article describes key differences between Machine Learning Services in Azure SQL Managed Instance and SQL Server Machine Learning Services.
services: sql-database
ms.service: sql-managed-instance
ms.subservice: machine-learning
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: garyericson
ms.author: garye
ms.reviewer: sstein, davidph
manager: cgronlun
ms.date: 10/27/2020
---

# Key differences between Machine Learning Services in Azure SQL Managed Instance and SQL Server

This article describes the few, key differences in functionality between [Machine Learning Services in Azure SQL Managed Instance](machine-learning-services-overview.md) and [SQL Server Machine Learning Services](https://docs.microsoft.com/sql/advanced-analytics/what-is-sql-server-machine-learning).

## Language support

Machine Learning Services in both SQL Managed Instance and SQL Server support the Python and R [extensibility framework](/sql/machine-learning/concepts/extensibility-framework). The key differences in SQL Managed Instance are:

- Only Python and R are supported. External languages such as Java cannot be added.

- The initial versions of Python and R are different:

  | System               | Python | R     |
  |----------------------|--------|-------|
  | SQL Managed Instance | 3.7.1  | 3.5.2 |
  | SQL Server           | 3.5.2  | 3.3.3 |

## Python and R Packages

There is no support in SQL Managed Instance for packages that depend on external runtimes (like Java) or need access to OS APIs for installation or usage.

For more information about managing Python and R packages, see:

- [Get Python package information](https://docs.microsoft.com/sql/machine-learning/package-management/python-package-information?context=/azure/azure-sql/managed-instance/context/ml-context&view=azuresqldb-mi-current&preserve-view=true)
- [Get R package information](https://docs.microsoft.com/sql/machine-learning/package-management/r-package-information?context=/azure/azure-sql/managed-instance/context/ml-context&view=azuresqldb-mi-current&preserve-view=true)

## Resource governance

In SQL Managed Instance, it's not possible to limit R resources through [Resource Governor](/sql/relational-databases/resource-governor/resource-governor?view=azuresqldb-mi-current&preserve-view=true), and external resource pools are not supported.

By default, R resources are set to a maximum of 20% of the available SQL Managed Instance resources when extensibility is enabled. To change this default percentage, create an Azure support ticket at [https://azure.microsoft.com/support/create-ticket/](https://azure.microsoft.com/support/create-ticket/).

Extensibility is enabled with the following SQL commands (SQL Managed Instance will restart and be unavailable for a few seconds):

```sql
sp_configure 'external scripts enabled', 1;
RECONFIGURE WITH OVERRIDE;
```

To disable extensibility and restore 100% of memory and CPU resources to SQL Server, use the following commands:

```sql
sp_configure 'external scripts enabled', 0;
RECONFIGURE WITH OVERRIDE;
```

The total resources available to SQL Managed Instance depend on which service tier you choose. For more information, see [Azure SQL Database purchasing models](/azure/sql-database/sql-database-service-tiers).

### Insufficient memory error

Memory usage depends on how much is used in your R scripts and the number of parallel queries being executed. If there is insufficient memory available for R, you'll get an error message. Common error messages are:

- `Unable to communicate with the runtime for 'R' script for request id: *******. Please check the requirements of 'R' runtime`
- `'R' script error occurred during execution of 'sp_execute_external_script' with HRESULT 0x80004004. ...an external script error occurred: "..could not allocate memory (0 Mb) in C function 'R_AllocStringBuffer'"`
- `An external script error occurred: Error: cannot allocate vector of size.`

If you receive one of these errors, you can resolve it by scaling your database to a higher service tier.

## Next steps

- See the overview, [Machine Learning Services in Azure SQL Managed Instance](machine-learning-services-overview.md).
- To learn how to use Python in Machine Learning Services, see [Run Python scripts](/sql/machine-learning/tutorials/quickstart-python-create-script?context=/azure/azure-sql/managed-instance/context/ml-context&view=azuresqldb-mi-current&preserve-view=true).
- To learn how to use R in Machine Learning Services, see [Run R scripts](/sql/machine-learning/tutorials/quickstart-r-create-script?context=/azure/azure-sql/managed-instance/context/ml-context&view=azuresqldb-mi-current&preserve-view=true).
