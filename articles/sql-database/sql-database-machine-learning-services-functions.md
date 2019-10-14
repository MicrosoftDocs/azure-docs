---
title: Write advanced R functions
titleSuffix: Azure SQL Database Machine Learning Services (preview)
description: Learn how to write an R function for advanced statistical computation in Azure SQL Database using Machine Learning Services (preview).
services: sql-database
ms.service: sql-database
ms.subservice: machine-learning
ms.custom:
ms.devlang: r
ms.topic: conceptual
author: garyericson
ms.author: garye
ms.reviewer: davidph
manager: cgronlun
ms.date: 04/11/2019
---

# Write advanced R functions in Azure SQL Database using Machine Learning Services (preview)

This article describes how to embed R mathematical and utility functions in a SQL stored procedure. Advanced statistical functions that are complicated to implement in T-SQL can be done in R with only a single line of code.

[!INCLUDE[ml-preview-note](../../includes/sql-database-ml-preview-note.md)]

## Prerequisites

- If you don't have an Azure subscription, [create an account](https://azure.microsoft.com/free/) before you begin.

- To run the example code in these exercises, you must first have an Azure SQL database with Machine Learning Services (with R) enabled. During the public preview, Microsoft will onboard you and enable machine learning for your existing or new database. Follow the steps in [Sign up for the preview](sql-database-machine-learning-services-overview.md#signup).

- Make sure you've installed the latest [SQL Server Management Studio](https://docs.microsoft.com/sql/ssms/sql-server-management-studio-ssms) (SSMS). You can run R scripts using other database management or query tools, but in this quickstart you'll use SSMS.

## Create a stored procedure to generate random numbers

For simplicity, let's use the R `stats` package that's installed and loaded by default with Azure SQL Database using Machine Learning Services (preview). The package contains hundreds of functions for common statistical tasks, among them the `rnorm` function. This function generates a specified number of random numbers using the normal distribution, given a standard deviation and means.

For example, the following R code returns 100 numbers on a mean of 50, given a standard deviation of 3.

```R
as.data.frame(rnorm(100, mean = 50, sd = 3));
```

To call this line of R from T-SQL, run `sp_execute_external_script` and add the R function in the R script parameter, like this:

```sql
EXECUTE sp_execute_external_script @language = N'R'
    , @script = N'
OutputDataSet <- as.data.frame(rnorm(100, mean = 50, sd =3));
'
    , @input_data_1 = N'   ;'
WITH RESULT SETS(([Density] FLOAT NOT NULL));
```

What if you'd like to make it easier to generate a different set of random numbers?

That's easy when combined with SQL. You define a stored procedure that gets the arguments from the user, then pass those arguments into the R script as variables.

```sql
CREATE PROCEDURE MyRNorm (
    @param1 INT
    , @param2 INT
    , @param3 INT
    )
AS
EXECUTE sp_execute_external_script @language = N'R'
    , @script = N'
OutputDataSet <- as.data.frame(rnorm(mynumbers, mymean, mysd));
'
    , @input_data_1 = N'   ;'
    , @params = N' @mynumbers int, @mymean int, @mysd int'
    , @mynumbers = @param1
    , @mymean = @param2
    , @mysd = @param3
WITH RESULT SETS(([Density] FLOAT NOT NULL));
```

- The first line defines each of the SQL input parameters that are required when the stored procedure is executed.

- The line beginning with `@params` defines all variables used by the R code, and the corresponding SQL data types.

- The lines that immediately follow map the SQL parameter names to the corresponding R variable names.

Now that you've wrapped the R function in a stored procedure, you can easily call the function and pass in different values, like this:

```sql
EXECUTE MyRNorm @param1 = 100
    , @param2 = 50
    , @param3 = 3
```

## Use R utility functions for troubleshooting

The `utils` package, installed by default, provides a variety of utility functions for investigating the current R environment. These functions can be useful if you're finding discrepancies in the way your R code performs in SQL and in outside environments. For example, you might use the R `memory.limit()` function to get memory for the current R environment.

Because the `utils` package is installed but not loaded by default, you must use the `library()` function to load it first.

```sql
EXECUTE sp_execute_external_script @language = N'R'
    , @script = N'
library(utils);
mymemory <- memory.limit();
OutputDataSet <- as.data.frame(mymemory);
'
    , @input_data_1 = N' ;'
WITH RESULT SETS(([Col1] INT NOT NULL));
```

> [!TIP]
> Many users like to use the system timing functions in R, such as `system.time` and `proc.time`,  to capture the time used by R processes and analyze performance issues.
