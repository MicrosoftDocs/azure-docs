---
title: Extend U-SQL scripts with R in Azure Data Lake Analytics | Microsoft Docs
description: 'Learn how to run R code in U-SQL Scripts'
services: data-lake-analytics
documentationcenter: ''
author: saveenr
manager: sukvg
editor: cgronlun

ms.assetid: c1c74e5e-3e4a-41ab-9e3f-e9085da1d315
ms.service: data-lake-analytics
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 05/01/2017
ms.author: saveenr

---

# Tutorial: Get started with extending U-SQL with R

The following example illustrates the basic steps for deploying R code:
* Use the REFERENCE ASSEMBLY statement to enable R extensions for the U-SQL Script.
* Use the REDUCE operation to partition the input data on a key.
* The R extensions for U-SQL include a built-in reducer (Extension.R.Reducer) that runs R code on each vertex assigned to the reducer. 
* Usage of dedicated named data frames called inputFromUSQL and outputToUSQL respectively to pass data between USQL and R. Input and output DataFrame identifier names are fixed (that is, users cannot change these predefined names of input and output DataFrame identifiers).


--

    REFERENCE ASSEMBLY [ExtPython];

    DECLARE @myScript = @"
    def get_mentions(tweet):
        return ';'.join( ( w[1:] for w in tweet.split() if w[0]=='@' ) )

    def usqlml_main(df):
        del df['time']
        del df['author']
        df['mentions'] = df.tweet.apply(get_mentions)
        del df['tweet']
        return df
    ";

    @t  = 
        SELECT * FROM 
           (VALUES
               ("D1","T1","A1","@foo Hello World @bar"),
               ("D2","T2","A2","@baz Hello World @beer")
           ) AS 
               D( date, time, author, tweet );

    @m  =
        REDUCE @t ON date
        PRODUCE date string, mentions string
        USING new Extension.Python.Reducer(pyScript:@myScript);

    OUTPUT @m
        TO "/tweetmentions.csv"
        USING Outputters.Csv();

## How R Integrates with U-SQL

### Datatypes
* String and numeric columns from U-SQL are converted as-is between R DataFrame and U-SQL [supported types: double, string, bool, integer, byte].
* Factor datatype is not supported in U-SQL.
* byte[] must be serialized as a base64-encoded string.
* U-SQL strings can be converted to factors in R code, once U-SQL create R input dataframe or by setting the reducer parameter stringsAsFactors: true.

### Schemas
* U-SQL datasets cannot have duplicate column names.
* U-SQL datasets column names must be strings.
* Column names must be the same in U-SQL and R scripts.
* Readonly column cannot be part of the output dataframe. Because readonly columns are automatically injected back in the U-SQL table if it is a part of output schema of UDO.

## Next Steps
* [Overview of Microsoft Azure Data Lake Analytics](data-lake-analytics-overview.md)
* [Develop U-SQL scripts using Data Lake Tools for Visual Studio](data-lake-analytics-data-lake-tools-get-started.md)
* [Using U-SQL window functions for Azure Data Lake Analytics jobs](data-lake-analytics-use-window-functions.md)
