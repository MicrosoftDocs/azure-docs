---
title: Get started with U-SQL language in Azure Data Lake Analytics
description: Learn the basics of the U-SQL language in Azure Data Lake Analytics. Write your first query using variables to extra data from files, transform the rowset, and aggregate data.
ms.reviewer: whhender
ms.service: data-lake-analytics
ms.topic: how-to
ms.date: 10/14/2022
---
# Get started with U-SQL in Azure Data Lake Analytics

[!INCLUDE [retirement-flag](includes/retirement-flag.md)]

U-SQL is a language that combines declarative SQL with imperative C# to let you process data at any scale. Through the scalable, distributed-query capability of U-SQL, you can efficiently analyze data across relational stores such as Azure SQL Database. With U-SQL, you can process unstructured data by applying schema on read and inserting custom logic and UDFs. Additionally, U-SQL includes extensibility that gives you fine-grained control over how to execute at scale.

## Learning resources

* The [U-SQL Tutorial](/u-sql/concepts) provides a guided walkthrough of most of the U-SQL language. This document is recommended reading for all developers wanting to learn U-SQL.
* For detailed information about the **U-SQL language syntax**, see the [U-SQL Language Reference](/u-sql/).
* To understand the **U-SQL design philosophy**, see the Visual Studio blog post [Introducing U-SQL – A Language that makes Big Data Processing Easy](https://blogs.msdn.microsoft.com/visualstudio/2015/09/28/introducing-u-sql-a-language-that-makes-big-data-processing-easy/).

## Let's create some data

The following U-SQL script is simple and lets us create a sample data file that we can reference in our other U-SQL scripts. We'll discuss the key concepts that make this script go in the next section.

```usql
USE DATABASE master;
USE SCHEMA dbo;
@a  = 
    SELECT * FROM 
        (VALUES
            (399266, "2/15/2012 11:53:16 AM", "en-us", "microsoft", 73, "microsoft.com;xbox.com", "NULL"),
			(382045, "2/15/2012 11:53:18 AM", "en-gb", "azure data lake analytics", 614, "microsoft.com;portal.azure.com", "portal.azure.com"),
			(382045, "2/16/2012 11:53:20 AM", "en-gb", "usql", 74, "microsoft.com;github.com", "NULL"),
			(106479, "2/16/2012 11:53:50 AM", "en-ca", "xbox", 24, "xbox.com;xbox.com/xbox360", "xbox.com/xbox360"),
			(906441, "2/16/2012 11:54:01 AM", "en-us", "machine learning", 1213, "microsoft.com;github.com", "NULL"),
			(304305, "2/16/2012 11:54:03 AM", "en-us", "outlook", 60, "microsoft.com;office.com;live.com","microsoft.com"),
			(460748, "2/16/2012 11:54:04 AM", "en-us", "azure storage", 1270, "microsoft.com;portal.azure.com", "portal.azure.com"),
			(354841, "2/16/2012 11:59:01 AM", "en-us", "azure", 610, "microsoft.com;portal.azure.com", "portal.azure.com"),
			(354068, "2/16/2012 12:00:33 PM", "en-mx", "key vault", 422, "microsoft.com;portal.azure.com", "portal.azure.com"),
			(347413, "2/16/2012 12:11:55 PM", "en-gr", "github", 305, "github.com", "NULL"),
			(840614, "2/16/2012 12:13:56 PM", "en-us", "surface", 1220, "microsoft.com", "NULL"),
			(656666, "2/16/2012 12:15:55 PM", "en-us", "visual studio", 691, "microsoft.com;code.visualstudio.com", "NULL"),
			(951513, "2/16/2012 12:17:00 PM", "en-us", "power bi", 63, "microsoft.com;app.powerbi.com", "powerbi.com"),
			(350350, "2/16/2012 12:18:17 PM", "en-us", "data factory", 30, "microsoft.com;portal.azure.com", "NULL"),
			(641615, "2/16/2012 12:19:55 PM", "en-us", "event hubs", 119, "microsoft.com;portal.azure.com", "NULL")
        ) AS 
              D( UserId, Start, Region, Query, Duration, Urls, ClickedUrls );
OUTPUT @a
    TO "Samples/Data/SearchLog.tsv"
    USING Outputters.Tsv();
```

## Read data from a file

Now that we have some data, let's read it from the file we created.

```usql
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
```

This script doesn't have any transformation steps. It reads from the source file called `SearchLog.tsv`, schematizes it, and writes the rowset back into a file called SearchLog-first-u-sql.csv.

Notice the question mark next to the data type in the `Duration` field. It means that the `Duration` field could be null.

### Key concepts

* **Rowset variables**: Each query expression that produces a rowset can be assigned to a variable. U-SQL follows the T-SQL variable naming pattern (`@searchlog`, for example) in the script.
* The **EXTRACT** keyword reads data from a file and defines the schema on read. `Extractors.Tsv` is a built-in U-SQL extractor for tab-separated-value files. You can develop custom extractors.
* The **OUTPUT** writes data from a rowset to a file. `Outputters.Csv()` is a built-in U-SQL outputter to create a comma-separated-value file. You can develop custom outputters.

### File paths

The EXTRACT and OUTPUT statements use file paths. File paths can be absolute or relative:

This following absolute file path refers to a file in a Data Lake Store named `mystore`:

```usql
adl://mystore.azuredatalakestore.net/Samples/Data/SearchLog.tsv
```

This following file path starts with `"/"`. It refers to a file in the default Data Lake Store account:

```usql
/output/SearchLog-first-u-sql.csv
```

## Use scalar variables

You can use scalar variables as well to make your script maintenance easier. The previous U-SQL script can also be written as:

```usql
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
```

## Transform rowsets

Use **SELECT** to transform rowsets. This script will select the columns Start, Region, and Duration, and will write those rows to a file when Region has a value of "en-gb":

```usql
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
```

The WHERE clause uses a [C# Boolean expression](/dotnet/csharp/language-reference/operators/index). You can use the C# expression language to do your own expressions and functions. You can even perform more complex filtering by combining them with logical conjunctions (ANDs) and disjunctions (ORs).

The following script uses the DateTime.Parse() method and a conjunction. columns Start, Region, and Duration, where Region has a value of "en-gb". Then it checks for values of the Duration column between certain dates and writes those values to a file:

```usql
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
```

 >[!NOTE]
 >The second query is operating on the result of the first rowset, which creates a composite of the two filters. You can also reuse a variable name, and the names are scoped lexically.

## Aggregate rowsets

U-SQL gives you the familiar ORDER BY, GROUP BY, and aggregations.

The following query finds the total duration per region, and then displays the top five durations in order.

U-SQL rowsets don't preserve their order for the next query. Thus, to order an output, you need to add ORDER BY to the OUTPUT statement:

```usql
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
```

The U-SQL ORDER BY clause requires using the FETCH clause in a SELECT expression.

The U-SQL HAVING clause can be used to restrict the output to groups that satisfy the HAVING condition:

```usql
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
```

For advanced aggregation scenarios, see the U-SQL reference documentation for [aggregate, analytic, and reference functions.](/u-sql/built-in-functions)

## Next steps

* [Overview of Microsoft Azure Data Lake Analytics](data-lake-analytics-overview.md)
* [Develop U-SQL scripts by using Data Lake Tools for Visual Studio](data-lake-analytics-data-lake-tools-get-started.md)
