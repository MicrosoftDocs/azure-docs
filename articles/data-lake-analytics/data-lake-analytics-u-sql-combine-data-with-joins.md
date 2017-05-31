---
title: 'Combine rowsets with U-SQL Joins in Azure Data Lake Analytics | Microsoft Docs'
description: Learn the how U-SQL uses Join operators to combine rowsets in Azure Data Lake Analytics.
services: data-lake-analytics
documentationcenter: ''
author: saveenr
manager: saveenr
editor: cgronlun

ms.assetid: 57143396-ab86-47dd-b6f8-613ba28c28d2
ms.service: data-lake-analytics
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 05/09/2017
ms.author: edmaca

---
# Combine rowsets with U-SQL joins

U-SQL provides common join operators such as INNER JOIN, LEFT/RIGHT/FULL OUTER JOIN, SEMI JOIN, to join not only tables but any rowsets (even those produced from files).

The following script joins the ``@searchlog`` with an advertisement impression log and gives us the advertisements for the query string for a given date.

```
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
```

U-SQL supports only the ANSI-compliant join syntax: Rowset1 JOIN Rowset2 ON predicate. The old syntax of FROM Rowset1, Rowset2 WHERE predicate is _not_ supported.
The predicate in a JOIN has to be an equality join and no expression. If you want to use an expression, add it to a previous rowset's select clause. If you want to do a different comparison, you can move it into the WHERE clause.

### Next steps
* [Overview of Microsoft Azure Data Lake Analytics](data-lake-analytics-overview.md)
* [Develop U-SQL scripts using Data Lake Tools for Visual Studio](data-lake-analytics-data-lake-tools-get-started.md)
* [Using U-SQL window functions for Azure Data Lake Analytics jobs](data-lake-analytics-use-window-functions.md)

