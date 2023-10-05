---
title: Extend U-SQL scripts with Python in Azure Data Lake Analytics
description: Learn how to run Python code in U-SQL scripts using Azure Data Lake Analytics
ms.service: data-lake-analytics
ms.reviewer: whhender
ms.topic: how-to
ms.date: 01/20/2023
ms.custom: devx-track-python
---

# Extend U-SQL scripts with Python code in Azure Data Lake Analytics

[!INCLUDE [retirement-flag](includes/retirement-flag.md)]

## Prerequisites

Before you begin, ensure the Python extensions are installed in your Azure Data Lake Analytics account.

* Navigate to your Data Lake Analytics Account in the Azure portal
* In the left menu, under **GETTING STARTED** select **Sample Scripts**
* Select **Install U-SQL Extensions** then **OK**

## Overview

Python Extensions for U-SQL enable developers to perform massively parallel execution of Python code. The following example illustrates the basic steps:

* Use the `REFERENCE ASSEMBLY` statement to enable Python extensions for the U-SQL Script
* Using the `REDUCE` operation to partition the input data on a key
* The Python extensions for U-SQL include a built-in reducer (`Extension.Python.Reducer`) that runs Python code on each vertex assigned to the reducer
* The U-SQL script contains the embedded Python code that has a function called `usqlml_main` that accepts a pandas DataFrame as input and returns a pandas DataFrame as output.

```usql
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
       ) AS date, time, author, tweet );
@m  =
    REDUCE @t ON date
    PRODUCE date string, mentions string
    USING new Extension.Python.Reducer(pyScript:@myScript);
OUTPUT @m
    TO "/tweetmentions.csv"
    USING Outputters.Csv();
```

## How Python Integrates with U-SQL

### Datatypes

* String and numeric columns from U-SQL are converted as-is between Pandas and U-SQL
* U-SQL Nulls are converted to and from Pandas `NA` values

### Schemas

* Index vectors in Pandas aren't supported in U-SQL. All input data frames in the Python function always have a 64-bit numerical index from 0 through the number of rows minus 1.
* U-SQL datasets can't have duplicate column names
* U-SQL datasets column names that aren't strings.

### Python Versions

Only Python 3.5.1 (compiled for Windows) is supported.

### Standard Python modules

All the standard Python modules are included.

### More Python modules

Besides the standard Python libraries, several commonly used Python libraries are included:

* pandas
* numpy
* numexpr

### Exception Messages

Currently, an exception in Python code shows up as generic vertex failure. In the future, the U-SQL Job error messages will display the Python exception message.

### Input and Output size limitations

Every vertex has a limited amount of memory assigned to it. Currently, that limit is 6 GB for an AU. Because the input and output DataFrames must exist in memory in the Python code, the total size for the input and output can't exceed 6 GB.

## Next steps

* [Overview of Microsoft Azure Data Lake Analytics](data-lake-analytics-overview.md)
* [Develop U-SQL scripts using Data Lake Tools for Visual Studio](data-lake-analytics-data-lake-tools-get-started.md)
* [Using U-SQL window functions for Azure Data Lake Analytics jobs](./data-lake-analytics-u-sql-get-started.md)
* [Use Azure Data Lake Tools for Visual Studio Code](data-lake-analytics-data-lake-tools-for-vscode.md)