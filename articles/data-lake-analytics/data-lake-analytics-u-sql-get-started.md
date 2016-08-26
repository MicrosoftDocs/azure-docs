<properties 
   pageTitle="Develop U-SQL scripts using Data Lake Tools for Visual Studio | Azure" 
   description="Learn how to install Data Lake Tools for Visual Studio, how to develop and test U-SQL scripts. " 
   services="data-lake-analytics" 
   documentationCenter="" 
   authors="edmacauley" 
   manager="paulettm" 
   editor="cgronlun"/>
 
<tags
   ms.service="data-lake-analytics"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data" 
   ms.date="05/16/2016"
   ms.author="edmaca"/>

# Tutorial: Get started with Azure Data Lake Analytics U-SQL language

U-SQL is a language that unifies the benefits of SQL with the expressive power of your own code to process all data at any scale. U-SQL’s scalable distributed query capability enables you to efficiently analyze data in the store and across relational stores such as Azure SQL Database.  It enables you to process unstructured data by applying schema on read, insert custom logic and UDF's, and includes extensibility to enable fine grained control over how to execute at scale. To learn more about the design philosophy behind U-SQL, please refer to this [Visual Studio blog post](https://blogs.msdn.microsoft.com/visualstudio/2015/09/28/introducing-u-sql-a-language-that-makes-big-data-processing-easy/).

There are some differences from ANSI SQL or T-SQL. For example, its keywords such as SELECT have to be in UPPERCASE. 

It’s type system and expression language inside select clauses, where predicates etc are in C#. 
This means the data types are the C# types and the data types use C# NULL semantics, and the comparison operations inside a predicate follow C# syntax (e.g., a == "foo").  This also means, that the values are full .NET objects, allowing you to easily use any method to operate on the object (eg "f o o o".Split(' ')  ). 

For more information, see [U-SQL Reference](http://go.microsoft.com/fwlink/p/?LinkId=691348).

###Prerequisites

You must complete [Tutorial: develop U-SQL scripts using Data Lake Tools for Visual Studio](data-lake-analytics-data-lake-tools-get-started.md).

In the tutorial, you ran a Data Lake Analytics job with the following U-SQL script:

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

This script doesn't have any transformation steps. It reads from the source file called **SearchLog.tsv**, schematizes it, and outputs the rowset back into a file called **SearchLog-first-u-sql.csv**. 

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

You can use scalar variables as well to make your script maintenance easier. The previous U-SQL script can also be written as the following:

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
      
## Transform rowsets

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

The WHERE clause uses [C# boolean expression](https://msdn.microsoft.com/library/6a71f45d.aspx). You can use the C# expression language to do your own expressions and functions. You can even perform more complex filtering by combining them with logical conjunctions (ANDs) and disjunctions (ORs). 

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

## Aggregate rowsets

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

Every U-SQL script runs with a default database (master) and default schema (DBO) as its default context. You can create your own database and/or schema. To change the context, use the **USE** statement to change the context.


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
    
The following script demonstrates using the defined view:

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
- [Using U-SQL window functions for Azure Data Lake Analytics jobs](data-lake-analytics-use-window-functions.md)
- [Monitor and troubleshoot Azure Data Lake Analytics jobs using Azure Portal](data-lake-analytics-monitor-and-troubleshoot-jobs-tutorial.md)

## Let us know what you think

- [Suggest new documentation backlog](data-lake-analytics-documentation-backlog.md)
- [Submit a feature request](http://aka.ms/adlafeedback)
- [Get help in the forums](http://aka.ms/adlaforums)
- [Provide feedback on U-SQL](http://aka.ms/usqldiscuss)










