---
title: Quickstart for using R script in Azure SQL Database (preview) | Microsoft Docs
description: This topic shows you how to use R script in Azure SQL Database.
services: sql-database
ms.service: sql-database
ms.subservice: development
ms.custom: 
ms.devlang: r
ms.topic: quickstart
author: dphansen
ms.author: davidph
ms.reviewer:
manager: cgronlun
ms.date: 10/31/2018
---

# Quickstart: Use R in Azure SQL database (preview)

This article explains how you can run R scripts in Azure SQL database. It walks you through the basics of moving data between Azure SQL database and R: requirements, data structures, inputs, and outputs. It also explains how to wrap well-formed R code in a stored procedure [sp_execute_external_script](https://docs.microsoft.com/sql/relational-databases/system-stored-procedures/sp-execute-external-script-transact-sql) to build, train, and use machine learning models in Azure SQL database.

R support in Azure SQL database is used to execute R code and functions and the code is fully available to relational data as stored procedures, as T-SQL script containing R statements, or as R code containing T-SQL.

The key value proposition of using R scripts in Azure SQL database is the power of its enterprise R packages to deliver advanced analytics at scale, and the ability to bring calculations and processing to where the data resides, eliminating the need to pull data across the network.

There are some differences between using R in Azure SQL database and [SQL Server Machine Learning Services](https://review.docs.microsoft.com/sql/advanced-analytics/what-is-sql-server-machine-learning).

- R only. Currently there is no support for Python.
- No need to configure `external scripts enabled` via `sp_configure`.
- No need to give script execution permission to users.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

## Sign up for the preview

The preview of R support in Azure SQL database is not enabled by default. Sign up for the preview at [aka.ms/sqldb-r-preview-signup](https://aka.ms/sqldb-r-preview-signup).

When you sign up, you can either:

- Enable R support in an existing database
- Create a new database with R support

When your database with R support is ready, return to this page to learn how to execute R scripts in the context of a stored procedure.

## Prerequisites

To run the example code in these exercises, you must first have an Azure SQL database with R support enabled.
You can create a database using one of these quickstarts:

[!INCLUDE [prerequisites-create-db](../../includes/sql-database-connect-query-prerequisites-create-db-includes.md)]

You can connect to the Azure SQL database and run the R scripts using [SQL Server Management Studio](sql-database-connect-query-ssms.md), [Visual Studio Code](sql-database-connect-query-vscode.md), or the [Azure Portal](sql-database-connect-query-portal.md), You can also another database management or query tool, as long as it can connect to an Azure SQL database, and run a T-SQL query or stored procedure.

This quickstart also requires that you configure a server-level firewall rule. For a quickstart showing how to do this, see [Create server-level firewall rule](sql-database-get-started-portal-firewall.md).

You also need to sign up for the preview, as described above.

## Verify R exists

The following steps confirm that R is enabled for your Azure SQL database.

1. Something something
1. Something else something else
1. And more of something

## Basic R interaction

There are two ways to run R code in Azure SQL database:

+ Add a R script as an argument of the system stored procedure, [sp_execute_external_script](https://docs.microsoft.com/sql//relational-databases/system-stored-procedures/sp-execute-external-script-transact-sql.md).

+ From a [remote R client](https://review.docs.microsoft.com/sql/advanced-analytics/r/set-up-a-data-science-client), connect to SQL Server, and execute code using the SQL Server as the compute context. 

The following exercise is focused on the first interaction model: how to pass R code to a stored procedure.

1. Something something
1. Something else something else
1. And more of something

## Check R version

1. Something something
1. Something else something else
1. And more of something

## List R packages

1. Something something
1. Something else something else
1. And more of something

## Handle inputs and outputs

1. Something something
1. Something else something else
1. And more of something

## Create a predictive model

1. Something something
1. Something else something else
1. And more of something

## Predict and plot from model

1. Something something
1. Something else something else
1. And more of something

## Add a package

1. Something something
1. Something else something else
1. And more of something

## Clean up resources

If you're not going to continue to use this application, delete the Azure SQL database
with the following steps:

1. From the left-hand menu...
2. ...click Delete, type...and then click Delete

<!---Required:
To avoid any costs associated with following the quickstart procedure, a Clean
up resources (H2) should come just before Next steps (H2)
--->

## Next steps

Advance to the next article to learn how to create...
> [!div class="nextstepaction"]
> [Next steps button](contribute-get-started-mvc.md)

<!--- Required:
Quickstarts should always have a Next steps H2 that points to the next logical
quickstart in a series, or, if there are no other quickstarts, to some other
cool thing the customer can do. A single link in the blue box format should
direct the customer to the next article - and you can shorten the title in the
boxes if the original one doesn’t fit.
Do not use a "More info section" or a "Resources section" or a "See also section". --->