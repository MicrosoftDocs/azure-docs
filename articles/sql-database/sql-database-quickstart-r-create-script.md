---
title: Create and run a simple R script
titleSuffix: Azure SQL Database Machine Learning Services (preview)
description: Run a simple R script in Azure SQL Database using Machine Learning Services (preview).
services: sql-database
ms.service: sql-database
ms.subservice: machine-learning
ms.custom: 
ms.devlang: r
ms.topic: quickstart
author: dphansen
ms.author: davidph
ms.reviewer:
manager: cgronlun
ms.date: 04/11/2019
---

# Create and run a simple R script in Azure SQL Database Machine Learning Services (preview)

In this quickstart you'll create and run a simple R script using the public preview of [Machine Learning Services (with R) in Azure SQL Database](sql-database-machine-learning-services-overview.md). You'll learn how to wrap a well-formed R script in the stored procedure [sp_execute_external_script](https://docs.microsoft.com/sql/relational-databases/system-stored-procedures/sp-execute-external-script-transact-sql) and execute the script in a SQL database.

[!INCLUDE[ml-preview-note](../../includes/ml-preview-note.md)]

## Prerequisites

- If you don't have an Azure subscription, [create an account](https://azure.microsoft.com/free/) before you begin.

- To run the example code in these exercises, you must first have an Azure SQL database with Machine Learning Services (with R) enabled. During the public preview, Microsoft will onboard you and enable machine learning for your existing or new database. Follow the steps in [Sign up for the preview](sql-database-machine-learning-services-overview.md#signup).

- You can connect to the SQL Database and run the R scripts using any database management or query tool, as long as it can connect to a SQL Database, and run a T-SQL query or stored procedure. In this quickstart you'll use [SQL Server Management Studio](sql-database-connect-query-ssms.md).

- For the [add a package](#add-package) exercise, you will also need to install [R](https://www.r-project.org/) and [RStudio Desktop](https://www.rstudio.com/products/rstudio/download/) on your local computer.

- This quickstart requires that you configure a server-level firewall rule. For information on how to do this, see [Create server-level firewall rule](sql-database-server-level-firewall-rule.md).

## Verify R exists

You can confirm that Machine Learning Services (with R) is enabled for your SQL database. Follow the steps below.

1. Open SQL Server Management Studio and connect to your SQL database. For more information on how to connect, see [Quickstart: Use SQL Server Management Studio to connect and query an Azure SQL database](sql-database-connect-query-ssms.md).

1. Run the following code:

    ```sql
    EXECUTE sp_execute_external_script
    @language =N'R',
    @script=N'print(31 + 11)';
    GO
    ```

    If all is well, you should see a result message like this one.

    ```text
    STDOUT message(s) from external script:
    42
    ```

1. If you get any errors, it might be because the public preview of Machine Learning Services (with R) is not enabled for your SQL database. See [Prerequisites](#prerequisites) above.

   > [!NOTE]
   > If you're an administrator, you can run external code automatically. You can grant permission to other users using the command: `GRANT EXECUTE ANY EXTERNAL SCRIPT TO ` *username*.

## Run a simple script

To run an R script, you'll pass it as an argument to the system stored procedure, [sp_execute_external_script](https://docs.microsoft.com/sql/relational-databases/system-stored-procedures/sp-execute-external-script-transact-sql).

> [!TIP]
> You can also use a [remote R client](https://docs.microsoft.com/sql/advanced-analytics/r/set-up-a-data-science-client), connect to your SQL database, and execute the code using the SQL Database as the compute context.

1. Run the following code. It passes a complete R script to [sp_execute_external_script](https://docs.microsoft.com/sql/relational-databases/system-stored-procedures/sp-execute-external-script-transact-sql) through the `@script` argument. Everything inside the `@script` argument must be valid R code.

    ```sql
    EXECUTE sp_execute_external_script
    @language = N'R',
    @script = N'
    a <- 1
    b <- 2
    c <- a/b
    d <- a*b
    print(c(c, d))
    '
    ```

2. Assuming that you have everything set up correctly, the correct result is calculated and the R `print` function returns the result to the **Messages** window. It should look something like this.

    **Results**

    ```text
    STDOUT message(s) from external script: 
    0.5 2
    ```

## Use inputs and outputs

By default, [sp_execute_external_script](https://docs.microsoft.com/sql/relational-databases/system-stored-procedures/sp-execute-external-script-transact-sql) accepts a single dataset as input, which typically you supply in the form of a valid SQL query. It then returns a single R data frame as output.
But other types of input can be passed as SQL variables, and you can output scalars and models as variables.

For now, let's look at just the default input and output variables of [sp_execute_external_script](https://docs.microsoft.com/sql/relational-databases/system-stored-procedures/sp-execute-external-script-transact-sql): `InputDataSet` and `OutputDataSet`.

1. Create a small table of test data by running the following T-SQL statement:

    ```sql
    CREATE TABLE RTestData (col1 INT NOT NULL)
    INSERT INTO RTestData VALUES (1);
    INSERT INTO RTestData VALUES (10);
    INSERT INTO RTestData VALUES (100);
    GO
    ```

    When the table has been created, use the following statement to query the table:
  
    ```sql
    SELECT * FROM RTestData
    ```

    **Results**

    ![Contents of the RTestData table](./media/sql-database-connect-query-r/select-rtestdata.png)

2. Run the following statement. It retrieves the data from the table using the `SELECT` statement, passes it through the R runtime, and returns the data as a data frame. The `WITH RESULT SETS` clause defines the schema of the returned data table for SQL Database, adding the column name *NewColName*.

    ```sql
    EXECUTE sp_execute_external_script
        @language = N'R'
        , @script = N'OutputDataSet <- InputDataSet;'
        , @input_data_1 = N'SELECT * FROM RTestData;'
    WITH RESULT SETS (([NewColName] INT NOT NULL));
    ```

    **Results**

    ![Output from R script that returns data from a table](./media/sql-database-connect-query-r/r-output-rtestdata.png)

3. Run the following script to change the names of the input and output variables. The default input and output variable names are `InputDataSet` and `OutputDataSet`. This script changes the names to `SQL_in` and `SQL_out`:

    ```sql
    EXECUTE sp_execute_external_script
      @language = N'R'
      , @script = N' SQL_out <- SQL_in;'
      , @input_data_1 = N' SELECT 12 as Col;'
      , @input_data_1_name  = N'SQL_in'
      , @output_data_1_name =  N'SQL_out'
      WITH RESULT SETS (([NewColName] INT NOT NULL));
    ```

   <!-- This doesn't make sense to me -->
    Note that R is case-sensitive, so the case of the input and output variables in `@input_data_1_name` and `@output_data_1_name` have to match the ones in the R code in `@script`. Also, the order of the parameters is important - you must specify the required parameters `@input_data_1` and `@output_data_1` first, in order to use the optional parameters `@input_data_1_name` and `@output_data_1_name`.

   > [!TIP]
   > Only one input dataset can be passed as a parameter, and you can return only one dataset. However, you can call other datasets from inside your R code and you can return outputs of other types in addition to the dataset. You can also add the OUTPUT keyword to any parameter to have it returned with the results.

<!-- I think this is unclear and unnecessary.
4. You can also generate values using the R script and leave the input query string in _@input_data_1_ blank.

    ```sql
    EXECUTE sp_execute_external_script
        @language = N'R'
        , @script = N' mytextvariable <- c("hello", " ", "world");
            OutputDataSet <- as.data.frame(mytextvariable);'
        , @input_data_1 = N''
    WITH RESULT SETS (([Col1] CHAR(20) NOT NULL));
    ```

    **Results**

    ![Query results using @script as input](./media/sql-database-connect-query-r/r-data-generated-output.png)
-->

## Check R version

If you would like to see which version of R is installed in your SQL database, do the following:

1. Run the script below on your SQL database.

    ```SQL
    EXECUTE sp_execute_external_script
    @language =N'R',
    @script=N'print(version)';
    GO
    ```

2. The R `print` function returns the version to the **Messages** window. In the example output below, you can see that SQL Database in this case have R version 3.4.4 installed.

    **Results**

    ```text
    STDOUT message(s) from external script:
                   _
    platform       x86_64-w64-mingw32
    arch           x86_64
    os             mingw32
    system         x86_64, mingw32
    status
    major          3
    minor          4.4
    year           2018
    month          03
    day            15
    svn rev        74408
    language       R
    version.string R version 3.4.4 (2018-03-15)
    nickname       Someone to Lean On
    ```

## List R packages

Microsoft provides a number of R packages pre-installed with Machine Learning Services in your SQL database. To see a list of which R packages are installed, including version, dependencies, license, and library path information, follow the steps below. To add additional packages, see the [add a package](#add-package) section.

1. Run the script below on your SQL database.

    ```SQL
    EXECUTE sp_execute_external_script @language = N'R'
    , @script = N'
    OutputDataSet <- data.frame(installed.packages()[,c("Package", "Version", "Depends", "License", "LibPath")]);'
    WITH result sets((Package NVARCHAR(255), Version NVARCHAR(100), Depends NVARCHAR(4000)
        , License NVARCHAR(1000), LibPath NVARCHAR(2000)));
    ```

2. The output is from `installed.packages()` in R and returned as a result set.

    **Results**

    ![Installed packages in R](./media/sql-database-connect-query-r/r-installed-packages.png)

## Add a package

If you need to use a package that is not already installed in your SQL database, you can install it using [sqlmlutils](https://github.com/Microsoft/sqlmlutils). Follow the steps below to install the package.

1. Download the latest **sqlmlutils** zip file from [github.com/Microsoft/sqlmlutils/tree/master/R/dist](https://github.com/Microsoft/sqlmlutils/tree/master/R/dist) to your local computer. You do not need to unzip the file.

1. If you don't have R installed, download R from [www.r-project.org](https://www.r-project.org/) and install it on your local computer. R is available for Windows, MacOS, and Linux. In this example, we are using Windows.

1. First, install the **RODBCext** package, which is a prerequisite for **sqlmlutils**. **RODBCext** also installs the dependency the **RODBC** package. Open a **Command Prompt** and run the following command:

    ```
    R -e "install.packages('RODBCext', repos='https://cran.microsoft.com')"
    ```

    If you get the following  error, "'R' is not recognized as an internal or external command, operable program or batch file", it likely means that the path to R.exe is not included in your **PATH** environment variable on Windows. You can either add the directory to the environment variable or navigate to the directory in the command prompt (for example `cd C:\Program Files\R\R-3.5.1\bin`) before running the command.

1. Use the **R CMD INSTALL** command to install **sqlmlutils**. Specify the path to the directory you have downloaded the zip file to and the name of the zip file. For example:

    ```
    R CMD INSTALL C:\Users\youruser\Downloads\sqlmlutils_0.5.0.zip
    ```

    The output you get should be similar to the following:

    ```text
    In R CMD INSTALL
    * installing to library 'C:/Users/youruser/Documents/R/win-library/3.5'
    package 'sqlmlutils' successfully unpacked and MD5 sums checked
    ```

1. In this example you will use RStudio Desktop as the IDE. You can use another IDE if you prefer. Download and install RStudio Desktop from [www.rstudio.com/products/rstudio/download/](https://www.rstudio.com/products/rstudio/download/), if you don't already have RStudio installed.

1. Open **RStudio** and create a new **R Script** file. Use the following R code to install a package using sqlmlutils. In the example below, you will install the [glue](https://cran.r-project.org/web/packages/glue/) package, which can format and interpolate a string.

    ```R
    library(sqlmlutils) 
    connection <- connectionInfo(server= "yourserver.database.windows.net", 
        database = "yourdatabase", uid = "yoursqluser", pwd = "yoursqlpassword")
    sql_install.packages(connectionString = connection, pkgs = "glue", verbose = TRUE, scope = "PUBLIC")
    ```

    > [!NOTE]
    > The **scope** can either be **PUBLIC** or **PRIVATE**. Public scope is useful for the database administrator to install packages that all users can use. Private scope makes the package only available to the user who installs it. If you don't specify the scope, the default scope is **PRIVATE**.

1. Now, verify that the **glue** package has been installed.

    ```R
    r<-sql_installed.packages(connectionString = connection, fields=c("Package", "LibPath", "Attributes", "Scope"))
    View(r)
    ```

    **Results**

    ![Contents of the RTestData table](./media/sql-database-connect-query-r/r-verify-package-install.png)


1. Once the package is installed, you can use it in your R script through **sp_execute_external_script**. Open **SQL Server Management Studio** and connect to your SQL database. Run the following script:

    ```sql
    EXEC sp_execute_external_script @language = N'R'
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

    You will see the following result in the Messages tab.

    **Results**

    ```text
    STDOUT message(s) from external script:
    My name is Fred, my age next year is 51, my anniversary is Sunday, June 14, 2020.
    ```

1. If you would like to remove the package, run the following R script in **RStudio** on your local computer.

    ```R
    library(sqlmlutils) 
    connection <- connectionInfo(server= "yourserver.database.windows.net", 
        database = "yourdatabase", uid = "yoursqluser", pwd = "yoursqlpassword")
    sql_remove.packages(connectionString = connection, pkgs = "glue", scope = "PUBLIC") 
    ```

> [!NOTE]
> Another way to install R packages to your SQL database is to uploads the R package to from the  byte stream with [CREATE EXTERNAL LIBRARY](https://docs.microsoft.com/sql/t-sql/statements/create-external-library-transact-sql).

## Next steps

To score new data based on this model, follow this quickstart:

> [!div class="nextstepaction"]
> [Create and train a predictive model in R with Azure SQL Database Machine Learning Services (preview)](sql-database-quickstart-r-train-score-model.md)

For more information on Machine Learning Services, see the articles below. While some of these articles are for SQL Server, most of the information is also applicable to Machine Learning Services (with R) in Azure SQL Database.

- [Azure SQL Database Machine Learning Services (with R)](sql-database-machine-learning-services-overview.md)
- [SQL Server Machine Learning Services](https://docs.microsoft.com/sql/advanced-analytics/what-is-sql-server-machine-learning)
- [Tutorial: Learn in-database analytics using R in SQL Server](https://docs.microsoft.com/sql/advanced-analytics/tutorials/sqldev-in-database-r-for-sql-developers)
- [End-to-end data science walkthrough for R and SQL Server](https://docs.microsoft.com/sql/advanced-analytics/tutorials/walkthrough-data-science-end-to-end-walkthrough)
- [Tutorial: Use RevoScaleR R functions with SQL Server data](https://docs.microsoft.com/sql/advanced-analytics/tutorials/deepdive-data-science-deep-dive-using-the-revoscaler-packages)
