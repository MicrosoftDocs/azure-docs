---
title: 'Tutorial: Get started with Azure Data Lake Analytics U-SQL language | Microsoft Docs'
description: Use this tutorial to learn about the Azure Data Lake Analytics U-SQL language.
services: data-lake-analytics
documentationcenter: ''
author: edmacauley
manager: jhubbard
editor: cgronlun

ms.assetid: 57143396-ab86-47dd-b6f8-613ba28c28d2
ms.service: data-lake-analytics
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 12/05/2016
ms.author: edmaca

---
# Tutorial: Get started with Azure Data Lake Analytics U-SQL language
U-SQL is a language that combines the benefits of SQL with the expressive power of your own code to process data at any scale. Through the scalable, distributed-query capability of U-SQL, you can efficiently analyze data across relational stores such as Azure SQL Database. With U-SQL, you can process unstructured data by applying schema on read and inserting custom logic and UDFs. Additionally, U-SQL includes extensibility that gives you fine-grained control over how to execute at scale. To learn more about the design philosophy behind U-SQL, see the Visual Studio blog post [Introducing U-SQL – A Language that makes Big Data Processing Easy](https://blogs.msdn.microsoft.com/visualstudio/2015/09/28/introducing-u-sql-a-language-that-makes-big-data-processing-easy/).

U-SQL differs in some ways from ANSI SQL or T-SQL. For example, keywords such as SELECT must be in all-uppercase letters.

 Its type system and expression language, inside SELECT clauses and WHERE predicates, are C#. This means that the data types are the C# types, they use C# NULL semantics, and the comparison operations inside a predicate follow C# syntax (for example, a == "foo"). It also means that the values are full .NET objects, so you can easily use any method to operate on the object (for example, "f o o o".Split(' ')).

For more information about U-SQL, see the [U-SQL Language Reference](http://go.microsoft.com/fwlink/p/?LinkId=691348).

### Prerequisites
If you have not already done so, please read and complete [Tutorial: Develop U-SQL scripts using Data Lake Tools for Visual Studio](data-lake-analytics-data-lake-tools-get-started.md). After you have completed the tutorial, return to this article.

In the tutorial, you ran an Azure Data Lake Analytics job with the following U-SQL script:

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

This script doesn't have any transformation steps. It reads from the source file called SearchLog.tsv, schematizes it, and writes the rowset back into a file called SearchLog-first-u-sql.csv.

Notice the question mark next to the data type in the **Duration** field. It means that the **Duration** field could be null.

In the script, you'll find the following concepts and keywords:

* Rowset variables: Each query expression that produces a rowset can be assigned to a variable. U-SQL follows the T-SQL variable naming pattern (@searchlog, for example) in the script.

 >[!NOTE]
 >The assignment does not force execution. It merely names the expression so that you can build up more complex expressions.
* EXTRACT: By using this keyword, you can define a schema on read. The schema is specified by a column name and C# type name pair per column. The schema uses a so-called extractor (Extractors.Tsv(), for example) to extract .tsv files. You can develop custom extractors.
* OUTPUT: This keyword takes a rowset and serializes it. Outputters.Csv() writes a comma-separated file into the specified location. You can also develop custom outputters.

 >[!NOTE]
 >The two paths are relative paths. You can also use absolute paths. For example:    
 >     adl://\<ADLStorageAccountName>.azuredatalakestore.net:443/Samples/Data/SearchLog.tsv
 >
 >You must use an absolute path to access the files in the linked storage accounts.  The syntax for files stored in linked Azure storage account is:
 >     wasb://\<BlobContainerName>@\<StorageAccountName>.blob.core.windows.net/Samples/Data/SearchLog.tsv

 >[!NOTE]
 >Azure Blob storage containers with public blobs or public containers access permissions are not currently supported.

## Use scalar variables
You can use scalar variables as well to make your script maintenance easier. The previous U-SQL script can also be written as:

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

The WHERE clause uses a [C# Boolean expression](https://msdn.microsoft.com/library/6a71f45d.aspx). You can use the C# expression language to do your own expressions and functions. You can even perform more complex filtering by combining them with logical conjunctions (ANDs) and disjunctions (ORs).

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
        TO "/output/SearchLog-transform-datetime.csv"
        USING Outputters.Csv();

 >[!NOTE]
 >The second query is operating on the result of the first rowset, which creates a composite of the two filters. You can also reuse a variable name, and the names are scoped lexically.

## Aggregate rowsets
U-SQL gives you the familiar ORDER BY, GROUP BY, and aggregations.

The following query finds the total duration per region, and then displays the top five durations in order.

U-SQL rowsets do not preserve their order for the next query. Thus, to order an output, you need to add ORDER BY to the OUTPUT statement:

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

The U-SQL ORDER BY clause has to be combined with the FETCH clause in a SELECT expression.

The U-SQL HAVING clause can be used to restrict the output to groups that satisfy the HAVING condition:

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


U-SQL supports only the ANSI-compliant join syntax: Rowset1 JOIN Rowset2 ON predicate. The old syntax of FROM Rowset1, Rowset2 WHERE predicate is _not_ supported.
The predicate in a JOIN has to be an equality join and no expression. If you want to use an expression, add it to a previous rowset's select clause. If you want to do a different comparison, you can move it into the WHERE clause.

## Create databases, table-valued functions, views, and tables
In U-SQL, you can use data in the context of a database and schema, and you don't always have to read from or write to files.

Every U-SQL script runs with a default database (master) and default schema (DBO) as its default context. You can create your own database or schema. To change the context, use the USE statement.

### Create a TVF
In the previous U-SQL script, you repeated the use of EXTRACT to read from the same source file. With the U-SQL table-valued function (TVF), you can encapsulate the data for future reuse.  

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

The following script shows you how to use the TVF that was defined in the previous script:

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
If you have only one query expression that you want to abstract and do not want to create a parameter from it, you can create a view instead of a table-valued function.

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

The following script demonstrates the use of the defined view:

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
As with relational database tables, with U-SQL you can create a table with a predefined schema or create a table that infers the schema from the query that populates the table (also known as CREATE TABLE AS SELECT or CTAS).

Create a database and two tables by using the following script:

    DROP DATABASE IF EXISTS SearchLogDb;
    CREATE DATABASE SearchLogDb;
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
                    DISTRIBUTED BY HASH (UserId)
    );

    INSERT INTO SearchLog1 SELECT * FROM master.dbo.Searchlog() AS s;

    CREATE TABLE SearchLog2(
        INDEX sl_idx CLUSTERED (UserId ASC)
                DISTRIBUTED BY HASH (UserId)
    ) AS SELECT * FROM master.dbo.Searchlog() AS S; // You can use EXTRACT or SELECT here


### Query tables
You can query tables, such as those created in the previous script, in the same way that you query the data files. Instead of creating a rowset by using EXTRACT, you now can refer to the table name.

To read from the tables, modify the transform script that you used previously:

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

 >[!NOTE]
 >Currently, you cannot run a SELECT on a table in the same script as the one where you created the table.

## Conclusion
This tutorial covers only a small part of U-SQL. Because of its limited scope, the tutorial has not discussed many other benefits of U-SQL. For example, you can:

* Use CROSS APPLY to unpack parts of strings, arrays, and maps into rows.
* Operate partitioned sets of data (file sets and partitioned tables).
* Develop user-defined operators such as extractors, outputters, processors, and user-defined aggregators in C#.
* Use U-SQL windowing functions.
* Manage U-SQL code with views, table-valued functions, and stored procedures.
* Run arbitrary custom code on your processing nodes.
* Connect to SQL databases and federate queries across them and your U-SQL and Azure Data Lake data.

## See also
* [Overview of Microsoft Azure Data Lake Analytics](data-lake-analytics-overview.md)
* [Develop U-SQL scripts using Data Lake Tools for Visual Studio](data-lake-analytics-data-lake-tools-get-started.md)
* [Using U-SQL window functions for Azure Data Lake Analytics jobs](data-lake-analytics-use-window-functions.md)
* [Monitor and troubleshoot Azure Data Lake Analytics jobs using Azure portal](data-lake-analytics-monitor-and-troubleshoot-jobs-tutorial.md)

## Let us know what you think
* [Submit a feature request](http://aka.ms/adlafeedback)
* [Get help in the forums](http://aka.ms/adlaforums)
* [Provide feedback on U-SQL](http://aka.ms/usqldiscuss)
