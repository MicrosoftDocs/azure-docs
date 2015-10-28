<properties 
   pageTitle="Develop U-SQL scripts using Data Lake Tools for Visual Studio | Azure" 
   description="Learn how to install Data Lake Tools for Visual Studio, how to develop and test U-SQL scripts. " 
   services="data-lake-analytics" 
   documentationCenter="" 
   authors="mumian" 
   manager="paulettm" 
   editor="cgronlun"/>
 
<tags
   ms.service="data-lake-analytics"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data" 
   ms.date="10/26/2015"
   ms.author="jgao"/>

# Tutorial: Get started with Azure Data Lake Analytics U-SQL language

Learn how to develop U-SQL scripts.

U-SQL is a language that unifies the benefits of SQL with the expressive power of your own code to process all data at any scale. U-SQL’s scalable distributed query capability enables you to efficiently analyze data in the store and across relational stores such as Azure SQL Database.  It enables you to process unstructured data by applying schema on read, insert custom logic and UDF's, and includes extensibility to enable fine grained control over how to execute at scale. To learn more about the design philosophy behind U-SQL, please refer to this [Visual Studio blog post](http://blogs.msdn.com/b/visualstudio/archive/2015/09/28/introducing-u-sql.aspx).

There are some differences from ANSI SQL or T-SQL. For example, its keywords such as SELECT have to be in UPPERCASE. 

It’s type system and expression language inside select clauses, where predicates etc are in C#. 
This means the data types are the C# types and the data types use C# NULL semantics, and the comparison operations inside a predicate follow C# syntax (e.g., a == "foo").  This also means, that the values are full .NET objects, allowing you to easily use any method to operate on the object (eg "f o o o".Split(' ')  ). 

For more information, see [U-SQL Reference](http://go.microsoft.com/fwlink/p/?LinkId=691348).

**Prerequisites**

- **Visual Studio 2015, Visual Studio 2013 update 4, or Visual Studio 2012 with Visual C++ Installed** 
- **Microsoft Azure SDK for .NET version 2.5 or above**.  Install it using the [Web platform installer](http://www.microsoft.com/web/downloads/platform.aspx).
- **[Data Lake Tools for Visual Studio](http://aka.ms/adltoolsvs)**. 
	
	Once Data Lake Tools for Visual Studio is installed, you will see a **Data Lake** menu in Visual Studio:
	
	![U-SQL Visual Studio menu](./media/data-lake-analytics-data-lake-tools-get-started/data-lake-analytics-data-lake-tools-menu.png)

- **Basic knowledge of Data Lake Analytics and the Data Lake Tools for Visual Studio**. To get started, see:
 
	- [Get Started with Azure Data Lake Analytics using Azure Preview Portal](data-lake-analytics-get-started-portal.md).
	- [Develop U-SQL script using Data Lake tools for Visual Studio](data-lake-analytics-data-lake-tools-get-started.md).

- **A Data Lake Analytics account**.  See [Create an Azure Data Lake (ADL) Analytics account](data-lake-analytics-get-started-portal.md#create_adl_analytics_account).
- **Upload the sample data to the Data Lake Analytics account**. See [Upload SearchLog.tsv to the default Data Lake Storage account](data-lake-analytics-get-started-portal.md#update-data-to-the-default-adl-storage-account).

	The Data Lake Tools doesn't support creating Data Lake Analytics accounts.  So you have to create it using the Azure Preview Portal, Azure PowerShell, .NET SDK or Azure CLI. 
    To run a Data Lake Analytics job, you will need some data. Even though the Data Lake Tools supports uploading data, you will use the portal to upload the sample data to make this tutorial easier to follow. 

## Connect to Azure from Visual Studio

Before you can build and test any U-SQL script, you must first connect to Azure.

**To connect to Data Lake Analytics**

1. Open Visual Studio.
2. From the **Data Lake** menu, click **Options and Settings**.
4. Click **Sign In**, or **Change User** if someone has signed in, and follow the instructions to sign in.
5. Click **OK** to close the Options and Settings dialog.

**To browse your Data Lake Analytics accounts**

1. From Visual Studio, open **Server Explorer** by press **CTRL+ALT+S**.
2. From **Server Explorer**, expand **Azure**, and then expand **Data Lake Analytics**. You shall see a list of your Data Lake Analytics accounts if there are any. You cannot create Data Lake Analytics accounts from the studio. To create an account, see [Get Started with Azure Data Lake Analytics using Azure Preview Portal](data-lake-analytics-get-started-portal.md) or [Get Started with Azure Data Lake Analytics using Azure PowerShell](data-lake-get-started-powershell.md).


## Develop your first U-SQL scripts 

The main purpose of this section is to understand the process of writing and testing a U-SQL application using Data Lake Tools for Visual Studio. The U-SQL statements are also used in other Data Lake Analytics tutorials. It simply reads a tab--delimited file (tsv) file and outputs the file as a comma-delimited (csv) file.  
 
**To create and submit a Data Lake Analytics job** 

1. From the **File** menu, click **New**, and then click **Project**.
2. Select the U-SQL Project type.

	![new U-SQL Visual Studio project](./media/data-lake-analytics-data-lake-tools-get-started/data-lake-analytics-data-lake-tools-new-project.png)
	
3. Click **OK**. Visual studio creates a solution with a Script.usql file.
4. Enter the following script into the Script.usql file:

        @searchlog =
            EXTRACT UserId          int,
                    Start           DateTime,
                    Region          string,
                    Query           string,
                    Duration        int?,
                    Urls            string,
                    ClickedUrls     string
            FROM "/Samples/Data/SearchLog.tsv"
            USING Extractors.Tsv();
        
        OUTPUT @searchlog   
            TO "/output/SearchLog-first-u-sql.csv"
        USING Outputters.Csv();

		The next section in this article will explain the script in details.  You just need to focus on understanding the development and testing process in this section.
5. Next to the **Submit** button, specify the Analytics account.
5. From **Solution Explorer**, right click **Script.usql**, and then click **Build Script**. Verify the result in the Output pane.  If you have an error in your script, you will see an error output here. 
6. From **Solution Explorer**, right click **Script.usql**, and then click **Submit Script**.
7. Verify the **Analytics Account**, and then click **Submit**. Submission results and job link are available in the Data Lake Tools for Visual Studio Results window when the submission is completed.
8. You can click the **Refresh** button to see the latest job status and refresh the screen. Wait until the job is completed successfully.  If the job failed, it is most likely missing the source file.  You can use the "error" tab in the tool to see the error returned from the service. Please see the Prerequisite section of this tutorial. For additional troubleshooting information, see [Monitor and troubleshoot Azure Data Lake Analytics jobs](data-lake-analytics-monitor-and-troubleshoot-jobs-tutorial.md).

	
**To see the job output**

1. From **Server Explorer**, expand **Azure**, expand **Data Lake Analytics**, expand your Data Lake Analytics account, expand **Storage Accounts**, right-click the default Data Lake Storage account, and then click **Explorer**. 
2.  Double-click **output** to open the folder
3.  Double-click **SearchLog-frist-u-sql.csv**.
4.  You can also double-click on the output file in the job graph view in order to navigate directly to the output file.

## Understanding the first U-SQL script

Let's take a closer look of the script you wrote in the last section:

        @searchlog =
            EXTRACT UserId          int,
                    Start           DateTime,
                    Region          string,
                    Query           string,
                    Duration        int?,
                    Urls            string,
                    ClickedUrls     string
            FROM "/Samples/Data/SearchLog.tsv"
            USING Extractors.Tsv();
        
        OUTPUT @searchlog   
            TO "/output/SearchLog-first-usql.csv"
        USING Outputters.Csv();

This script doesn't have any transformation steps. It reads from the source file called **SearchLog.tsv**, schematizes it, and outputs the rowset back into a file called **SearchLog-from-adltools.csv**. 

Notice the question mark next to the data type of the Duration field. That means the Duration field could be null.

Some concepts and keywords found in the script:

- **Rowset variables**: Each query expression that produces a rowset can be assigned to a variable. U-SQL follows the T-SQL variable naming pattern, for example, **@searchlog** in the script. 
    Note the assignment does not force execution. It merely names the expression and gives you the ability to build-up more complex expressions.
- **EXTRACT** gives you the ability to define a schema on read. The schema is specified by a column name and C# type name pair per column. It uses a so-called **Extractor**, for example, **Extractors.Tsv()** to extract tsv files. You can develop custom extractors.
- **OUTPUT** takes a rowset and serializes it. The Outputters.Csv() output a comma-separated file into the specified location. You can also develop custom Outputters.
- Notice the two paths are relative paths. You can also use absolute paths.  For example 
    
        adl://<ADLStorageAccountName>.azuredatalakestore.net:443/Samples/Data/SearchLog.tsv
        
    You must use absolute path to access the files in the linked Storage accounts.  The syntax for files stored in linked Azure Storage account is:
    
        wasb://<BlobContainerName>@<StorageAccountName>.blob.core.windows.net/Samples/Data/SearchLog.tsv

    >[AZURE.NOTE] Azure Blob container with public blobs or public containers access permissions are not currently supported.

## Use scalar variables

You can use scalar variables as well to make your script maintenance easier. Your first U-SQL script can also be written as the following:

    DECLARE @in  string = "/Samples/Data/SearchLog.tsv";
    DECLARE @out string = "/output/SearchLog-scalar-variables.csv";
    
    @searchlog =
        EXTRACT UserId          int,
                Start           DateTime,
                Region          string,
                Query           string,
                Duration        int?,
                Urls            string,
                ClickedUrls     string
        FROM @in
        USING Extractors.Tsv();
    
    OUTPUT @searchlog   
        TO @out
        USING Outputters.Csv();
      
##Transform rowsets

Use **SELECT** to transform rowsets: 

    @searchlog =
        EXTRACT UserId          int,
                Start           DateTime,
                Region          string,
                Query           string,
                Duration        int?,
                Urls            string,
                ClickedUrls     string
        FROM "/Samples/Data/SearchLog.tsv"
        USING Extractors.Tsv();
    
    @rs1 =
        SELECT Start, Region, Duration
        FROM @searchlog
    WHERE Region == "en-gb";
    
    OUTPUT @rs1   
        TO "/output/SearchLog-transform-rowsets.csv"
        USING Outputters.Csv();

The WHERE clause uses [C# boolean expression](https://msdn.microsoft.com/library/6a71f45d.aspx). You can use the C# expression language to do your own expressions and functions. You can even perform more complex filtering by combining them with logical conjunctions (ands) and disjunctions (ors). 

The following script uses the DateTime.Parse() method and a conjunction.

    @searchlog =
        EXTRACT UserId          int,
                Start           DateTime,
                Region          string,
                Query           string,
                Duration        int?,
                Urls            string,
                ClickedUrls     string
        FROM "/Samples/Data/SearchLog.tsv"
        USING Extractors.Tsv();
    
    @rs1 =
        SELECT Start, Region, Duration
        FROM @searchlog
    WHERE Region == "en-gb";
    
    @rs1 =
        SELECT Start, Region, Duration
        FROM @rs1
        WHERE Start >= DateTime.Parse("2012/02/16") AND Start <= DateTime.Parse("2012/02/17");
    
    OUTPUT @rs1   
        TO "/output/SearchLog-transform-datatime.csv"
        USING Outputters.Csv();
        
Notice that the second query is operating on the result of the first rowset and thus the result is a composition of the two filters. You can also reuse a variable name and the names are scoped lexically.

##Aggregate rowsets

U-SQL provides you with the familiar **ORDER BY**, **GROUP BY** and aggregations.

The following query finds the total duration per region, and then outputs the top 5 durations in order. 

U-SQL rowsets do not preserve their order for the next query. Thus, to order an output, you need to add ORDER BY to the OUTPUT statement as shown below: 

    DECLARE @outpref string = "/output/Searchlog-aggregation";
    DECLARE @out1    string = @outpref+"_agg.csv";
    DECLARE @out2    string = @outpref+"_top5agg.csv";
    
    @searchlog =
        EXTRACT UserId          int,
                Start           DateTime,
                Region          string,
                Query           string,
                Duration        int?,
                Urls            string,
                ClickedUrls     string
        FROM "/Samples/Data/SearchLog.tsv"
        USING Extractors.Tsv();
    
    @rs1 =
        SELECT
            Region,
            SUM(Duration) AS TotalDuration
        FROM @searchlog
    GROUP BY Region;
    
    @res =
    SELECT *
    FROM @rs1
    ORDER BY TotalDuration DESC
    FETCH 5 ROWS;
    
    OUTPUT @rs1
        TO @out1
        ORDER BY TotalDuration DESC
        USING Outputters.Csv();
    OUTPUT @res
        TO @out2 
        ORDER BY TotalDuration DESC
        USING Outputters.Csv();
        
U-SQL ORDER BY clause has to be combined with the FETCH clause in a SELECT expression. 

U-SQL HAVING clause can be used to restrict the output to groups that satisfy the HAVING condition:

    @searchlog =
        EXTRACT UserId          int,
                Start           DateTime,
                Region          string,
                Query           string,
                Duration        int?,
                Urls            string,
                ClickedUrls     string
        FROM "/Samples/Data/SearchLog.tsv"
        USING Extractors.Tsv();
    
    @res =
        SELECT
            Region,
            SUM(Duration) AS TotalDuration
        FROM @searchlog
    GROUP BY Region
    HAVING SUM(Duration) > 200;
    
    OUTPUT @res
        TO "/output/Searchlog-having.csv"
        ORDER BY TotalDuration DESC
        USING Outputters.Csv();


## Join data

U-SQL provides common join operators such as INNER JOIN, LEFT/RIGHT/FULL OUTER JOIN, SEMI JOIN, to join not only tables but any rowsets (even those produced from files).

The following script joins the searchlog with an advertisement impression log and gives us the advertisements for the query string for a given date.

    @adlog =
        EXTRACT UserId int,
                Ad string,
                Clicked int
        FROM "/Samples/Data/AdsLog.tsv"
        USING Extractors.Tsv();
    
    @join =
        SELECT a.Ad, s.Query, s.Start AS Date
        FROM @adlog AS a JOIN <insert your DB name>.dbo.SearchLog1 AS s 
                        ON a.UserId == s.UserId
        WHERE a.Clicked == 1;
    
    OUTPUT @join   
        TO "/output/Searchlog-join.csv"
        USING Outputters.Csv();


U-SQL only supports the ANSI compliant join syntax: Rowset1 JOIN Rowset2 ON predicate. The old syntax of FROM Rowset1, Rowset2 WHERE predicate is NOT supported.
The predicate in a JOIN has to be an equality join and no expression. If you want to use an expression, add it to a previous rowset's select clause. If you want to do a different comparison, you can move it into the WHERE clause.

        
## Create databases, table-valued functions, views, and tables

U-SQL allows you to use data in the context of a database and schema. So you don't have to always read from or write to files. 

Every U-SQL script runs with a default database (master) and default schema (dbo) as its default context. You can create your own database and/or schema. To change the context, use the **USE** statement to change the context.


### Create a table-valued function (TVF)

In the previous U-SQL script, you repeated using EXTRACT reading from the same source file. U-SQL table-valued function enables you to encapsulate the data for future reuse.   

The following script creates a TVF called *Searchlog()* in the default database and schema:

    DROP FUNCTION IF EXISTS Searchlog;
    
    CREATE FUNCTION Searchlog() 
    RETURNS @searchlog TABLE
    (
                UserId          int,
                Start           DateTime,
                Region          string,
                Query           string,
                Duration        int?,
                Urls            string,
                ClickedUrls     string
    )
    AS BEGIN 
    @searchlog =
        EXTRACT UserId          int,
                Start           DateTime,
                Region          string,
                Query           string,
                Duration        int?,
                Urls            string,
                ClickedUrls     string
        FROM "/Samples/Data/SearchLog.tsv"
    USING Extractors.Tsv();
    RETURN;
    END;
    
The following script shows you how to use the TVF defined in the previous script:

    @res =
        SELECT
            Region,
            SUM(Duration) AS TotalDuration
        FROM Searchlog() AS S
    GROUP BY Region
    HAVING SUM(Duration) > 200;
    
    OUTPUT @res
        TO "/output/SerachLog-use-tvf.csv"
        ORDER BY TotalDuration DESC
        USING Outputters.Csv();
        
### Create views

If you only have one query expression that you want to abstract and do not want to parameterize it, you can create a view instead of a table-valued function. 

The following script creates a view called *SearchlogView* in the default database and schema:

    DROP VIEW IF EXISTS SearchlogView;
    
    CREATE VIEW SearchlogView AS  
        EXTRACT UserId          int,
                Start           DateTime,
                Region          string,
                Query           string,
                Duration        int?,
                Urls            string,
                ClickedUrls     string
        FROM "/Samples/Data/SearchLog.tsv"
    USING Extractors.Tsv();
    
The following script demonstates using the defined view:

    @res =
        SELECT
            Region,
            SUM(Duration) AS TotalDuration
        FROM SearchlogView
    GROUP BY Region
    HAVING SUM(Duration) > 200;
    
    OUTPUT @res
        TO "/output/Searchlog-use-view.csv"
        ORDER BY TotalDuration DESC
        USING Outputters.Csv();

### Create tables 

Similar to relational database table, U-SQL allows you to create a table with a predefined schema or create a table and infer the schema from the query that populates the table (also known as CREATE TABLE AS SELECT or CTAS).

The following script create a database and two tables:

    DROP DATABASE IF EXISTS SearchLogDb;
    CREATE DATABASE SeachLogDb
    USE DATABASE SearchLogDb;
    
    DROP TABLE IF EXISTS SearchLog1;
    DROP TABLE IF EXISTS SearchLog2;
    
    CREATE TABLE SearchLog1 (
                UserId          int,
                Start           DateTime,
                Region          string,
                Query           string,
                Duration        int?,
                Urls            string,
                ClickedUrls     string,
    
                INDEX sl_idx CLUSTERED (UserId ASC) 
                    PARTITIONED BY HASH (UserId)
    );
    
    INSERT INTO SearchLog1 SELECT * FROM master.dbo.Searchlog() AS s;
    
    CREATE TABLE SearchLog2(
        INDEX sl_idx CLUSTERED (UserId ASC) 
                PARTITIONED BY HASH (UserId)
    ) AS SELECT * FROM master.dbo.Searchlog() AS S; // You can use EXTRACT or SELECT here


### Query tables

You can query the tables (created in the previous script) in the same way as you query over the data files. Instead of creating a rowset using EXTRACT, you now can just refer to the table name. 

The transform script you used previously is modified to read from the tables:

    @rs1 =
        SELECT
            Region,
            SUM(Duration) AS TotalDuration
        FROM SearchLogDb.dbo.SearchLog2
    GROUP BY Region;
    
    @res =
        SELECT *
        FROM @rs1
        ORDER BY TotalDuration DESC
        FETCH 5 ROWS;
    
    OUTPUT @res
        TO "/output/Searchlog-query-table.csv"
        ORDER BY TotalDuration DESC
        USING Outputters.Csv();

Note that you currently cannot run a SELECT on a table in the same script as the script where you create that table.


##Conclusion

What is covered in the tutorial is only a small part of U-SQL. Because of the scope of this tutorial, it can't cover everything, such as:

- Use CROSS APPLY to unpack parts of strings, arrays and maps into rows.
- Operate partitioned sets of data (file sets and partitioned tables).
- Develop user defined operators such as extractors, outputters, processors, user-defined aggregators in C#.
- Use U-SQL windowing functions.
- Manage U-SQL code with views, table-valued functions and stored procedures.
- Run arbitrary custom code on your processing nodes. 
- Connect to Azure SQL Databases and federate queries across them and your U-SQL and Azure Data Lake data.

## See also 

- [Overview of Microsoft Azure Data Lake Analytics](data-lake-analytics-overview.md)
- [Develop U-SQL scripts using Data Lake Tools for Visual Studio](data-lake-analytics-data-lake-tools-get-started.md)
- [Using U-SQL window functions for Azure Data Lake Aanlytics jobs](data-lake-analytics-use-window-functions.md)
- [Monitor and troubleshoot Azure Data Lake Analytics jobs using Azure Preview Portal](data-lake-analytics-monitor-and-troubleshoot-jobs-tutorial.md)

## Let us know what you think

- [Suggest new documentation backlog](data-lake-analytics-documentation-backlog.md)
- [Submit a feature request](http://aka.ms/adlafeedback)
- [Get help in the forums](http://aka.ms/adlaforums)
- [Provide feedback on U-SQL](http://aka.ms/usqldiscuss)










