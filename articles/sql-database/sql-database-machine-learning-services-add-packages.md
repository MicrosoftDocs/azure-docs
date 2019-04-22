---
title: Add an R package
titleSuffix: Azure SQL Database Machine Learning Services (preview)
description: This tutorial explains how to install an R package that is not already installed in Azure SQL Database Machine Learning Services (preview).
services: sql-database
ms.service: sql-database
ms.subservice: machine-learning
ms.custom:
ms.devlang: r
ms.topic: tutorial
author: garyericson
ms.author: garye
ms.reviewer: davidph
manager: cgronlun
ms.date: 04/22/2019
---

# Add an R package to Azure SQL Database Machine Learning Services (preview)

This tutorial explains how to install an R package that is not already installed in your Azure SQL database. You install it using [sqlmlutils](https://github.com/Microsoft/sqlmlutils).

## Prequisites

- [R](https://www.r-project.org/) and [RStudio Desktop](https://www.rstudio.com/products/rstudio/download/) need to be installed on your local computer. R is available for Windows, MacOS, and Linux. This tutorial assumes you're using Windows.

## List R packages

Microsoft provides a number of R packages pre-installed with Machine Learning Services in your SQL database.

To see a list of which R packages are installed, including version, dependencies, license, and library path information, run the following script.

    ```SQL
    EXECUTE sp_execute_external_script @language = N'R'
        , @script = N'
    OutputDataSet <- data.frame(installed.packages()[,c("Package", "Version", "Depends", "License", "LibPath")]);'
    WITH RESULT SETS((
                Package NVARCHAR(255)
                , Version NVARCHAR(100)
                , Depends NVARCHAR(4000)
                , License NVARCHAR(1000)
                , LibPath NVARCHAR(2000)
                ));
    ```

The output is from `installed.packages()` in R and is returned as a result set. It looks similar to the following.

**Results**

![Installed packages in R](./media/sql-database-machine-learning-add-packages/r-installed-packages.png)

## Add a package

If you need to use a package that is not already installed in your SQL database, you can install it using [sqlmlutils](https://github.com/Microsoft/sqlmlutils).

For example, follow the steps below to install the **[glue](https://cran.r-project.org/web/packages/glue/)** package which can format and interpolate a string. These steps also install **sqlmlutils** and **RODBCext** (which is a prerequisite for **sqlmlutils**).

1. Open a **Command Prompt** and run the following command to install the **RODBCext** package:

    ```console
    R -e "install.packages('RODBCext', repos='https://cran.microsoft.com')"
    ```

    > [!TIP]
    > If you get the error, " 'R' is not recognized as an internal or external command, operable program or batch file", it likely means that the path to R.exe is not included in your **PATH** environment variable on Windows. You can either add the path to the environment variable or navigate to the folder in the command prompt (for example `cd C:\Program Files\R\R-3.5.1\bin`) and then retry the command.

1. Download the latest **sqlmlutils** zip file from https://github.com/Microsoft/sqlmlutils/tree/master/R/dist to your local computer. You do not need to unzip the file.

1. Use the **R CMD INSTALL** command in **Command Prompt** to install **sqlmlutils**. Specify the full path to the zip file you downloaded. For example:

    ```console
    R CMD INSTALL C:\Users\youruser\Downloads\sqlmlutils_0.5.0.zip
    ```

    The output you see should be similar to the following:

    ```text
    In R CMD INSTALL
    * installing to library 'C:/Users/youruser/Documents/R/win-library/3.5'
    package 'sqlmlutils' successfully unpacked and MD5 sums checked
    ```

1. Open **RStudio** and create a new **R Script** file. Use the following R code to install the **glue** package using `sqlmlutils`.

    ```R
    library(sqlmlutils) 
    connection <- connectionInfo(server= "yourserver.database.windows.net",
    database = "yourdatabase", uid = "yoursqluser", pwd = "yoursqlpassword")
    sql_install.packages(connectionString = connection, pkgs = "glue", verbose = TRUE, scope = "PUBLIC")
    ```

    > [!TIP]
    > The **scope** can be either **PUBLIC** or **PRIVATE**. Public scope is useful for the database administrator to install packages that all users can use. Private scope makes the package  available only to the user who installs it. If you don't specify the scope, the default scope is **PRIVATE**.

1. Verify that the **glue** package has been installed.

    ```R
    r<-sql_installed.packages(connectionString = connection, fields=c("Package", "LibPath", "Attributes", "Scope"))
    View(r)
    ```

    **Results**

    ![Contents of the RTestData table](./media/sql-database-connect-query-r/r-verify-package-install.png)

Once the package is installed, you can use it in an R script through **sp_execute_external_script**.

1. Open **SQL Server Management Studio** and connect to your SQL database.

1. Run the following script:

    ```sql
    EXECUTE sp_execute_external_script @language = N'R'
        , @script = N'
        library(glue)
    
        name <- "Fred"
        age <- 50
        anniversary <- as.Date("2020-06-14")
        text <- glue(''My name is {name}, '',
        ''my age next year is {age + 1}, '',
        ''my anniversary is {format(anniversary, "%A, %B %d, %Y")}.'')
        print(text)
        ';
    ```

    You will see the following result in the **Messages** tab.

    **Results**

    ```text
    STDOUT message(s) from external script:
    My name is Fred, my age next year is 51, my anniversary is Sunday, June 14, 2020.
    ```

If you would like to remove the package, run the following R script in **RStudio** on your local computer.

```R
library(sqlmlutils) 
connection <- connectionInfo(server= "yourserver.database.windows.net",
database = "yourdatabase", uid = "yoursqluser", pwd = "yoursqlpassword")
sql_remove.packages(connectionString = connection, pkgs = "glue", scope = "PUBLIC")
```

> [!TIP]
> Another way to install an R package to your SQL database is to upload the R package with [CREATE EXTERNAL LIBRARY](https://docs.microsoft.com/sql/t-sql/statements/create-external-library-transact-sql).

