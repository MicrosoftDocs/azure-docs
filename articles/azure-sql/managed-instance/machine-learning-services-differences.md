---
title: Key differences for Machine Learning Services (preview)
description: This topic describes key differences between Machine Learning Services in Azure SQL Managed Instance and SQL Server Machine Learning Services.
services: sql-database
ms.service: sql-managed-instance
ms.subservice: machine-learning
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: garyericson
ms.author: garye
ms.reviewer: carlrab, davidph
manager: cgronlun
ms.date: 05/27/2020
---

# Key differences between Machine Learning Services in Azure SQL Managed Instance and SQL Server

The functionality of [Machine Learning Services in Azure SQL Managed Instance (preview)](machine-learning-services-overview.md) is nearly identical to [SQL Server Machine Learning Services](https://docs.microsoft.com/sql/advanced-analytics/what-is-sql-server-machine-learning). Following are some key differences.

> [!IMPORTANT]
> Machine Learning Services in Azure SQL Managed Instance is currently in public preview. To sign up, see [Sign up for the preview](machine-learning-services-overview.md#signup).

## Preview limitations

During the preview, the service has the following limitations:

- Loopback connections do not work (see [Loopback connection to SQL Server from a Python or R script](/sql/machine-learning/connect/loopback-connection)).
- External Resource pools are not supported.
- Only Python and R are supported. External languages such as Java cannot be added.
- Scenarios using the [Message Passing Interface](https://docs.microsoft.com/message-passing-interface/microsoft-mpi) (MPI) are not supported.

In case of a Service Level Objective (SLO) update, please update the SLO and raise a support ticket to re-enable the dedicated resource limits for R/Python.

## Language support

Machine Learning Services in SQL Managed Instance and SQL Server support both Python and R [extensibility framework](https://docs.microsoft.com/sql/advanced-analytics/concepts/extensibility-framework). The key differences are:

- The initial versions of Python and R are different between Machine Learning Services in SQL Managed Instance and SQL Server:

  |                      | Python | R     |
  |----------------------|--------|-------|
  | SQL Managed Instance | 3.7.1  | 3.5.2 |
  | SQL Server           | 3.5.2  | 3.3.3 |

- There is no need to configure `external scripts enabled` via `sp_configure`. Once you are [signed up](machine-learning-services-overview.md#signup) for the preview, machine learning is enabled for your SQL database.

## Packages

Python and R package management work differently between SQL Managed Instance and SQL Server. These differences are:

- Packages cannot perform outbound network calls. This limitation is similar to the [default firewall rules for Machine Learning Services](https://docs.microsoft.com//sql/advanced-analytics/security/firewall-configuration) in SQL Server, but can't be changed in SQL Managed Instance.
- There is no support for packages that depend on external runtimes (like Java) or need access to OS APIs for installation or usage.

For more information about managing Python and R packages, see:

- [Get Python package information](https://docs.microsoft.com/sql/machine-learning/package-management/python-package-information?context=azure/sql-database/context/ml-context&view=sql-server-ver15)
- [Get R package information](https://docs.microsoft.com/sql/machine-learning/package-management/r-package-information?context=azure/sql-database/context/ml-context&view=sql-server-ver15)

## Resource governance

It is not possible to limit R resources through [Resource Governor](https://docs.microsoft.com/sql/relational-databases/resource-governor/resource-governor) and external resource pools.

During the public preview, R resources are set to a maximum of 20% of the SQL Managed Instance resources, and depend on which service tier you choose. For more information, see [Azure SQL Database purchasing models](https://docs.microsoft.com/azure/sql-database/sql-database-service-tiers).

### Insufficient memory error

If there is insufficient memory available for R, you will get an error message. Common error messages are:

- Unable to communicate with the runtime for 'R' script for request id: *******. Please check the requirements of 'R' runtime
- 'R' script error occurred during execution of 'sp_execute_external_script' with HRESULT 0x80004004. ...an external script error occurred: "..could not allocate memory (0 Mb) in C function 'R_AllocStringBuffer'"
- An external script error occurred: Error: cannot allocate vector of size.

Memory usage depends on how much is used in your R scripts and the number of parallel queries being executed. If you receive the errors above, you can scale your database to a higher service tier to resolve this.

## Next steps

- See the overview, [Machine Learning Services in Azure SQL Managed Instance](machine-learning-services-overview.md).
- To learn how to use Python in Machine Learning Services, see [Run Python scripts](https://docs.microsoft.com/sql/machine-learning/tutorials/quickstart-python-create-script?context=/azure/azure-sql/managed-instance/context/ml-context&view=sql-server-ver15).
- To learn how to use R in Machine Learning Services, see [Run R scripts](https://docs.microsoft.com/sql/machine-learning/tutorials/quickstart-r-create-script?context=/azure/azure-sql/managed-instance/context/ml-context&view=sql-server-ver15).
