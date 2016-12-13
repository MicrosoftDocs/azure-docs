---
title: Extend U-SQL scripts with Python | Microsoft Docs
description: 'Learn how to run Python code in U-SQL Scripts'
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
ms.date: 12/05/2016
ms.author: saveenr

---

# Tutorial: Get started with extending U-SQL with Python

Python Extensions for U-SQL enable developers to perform massively parallel execution of Python code. The example below illustrates the basic steps:

* Use the REFERENCE ASSEMBLY statement to enable Python extensions for the U-SQL Script
* Using the REDUCE operation to partition the input data on a key
* The Python extensions for U-SQL include a built-in reducer (Extension.Python.Reducer) that runs Python code on each vertex assigned to the reducer
* The U-SQL script contains the embedded Python code that has a function called usqlml_main that accepts a pandas DataFrame as input and returns a pandas DataFrame as output.

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
 

## See also
* [Overview of Microsoft Azure Data Lake Analytics](data-lake-analytics-overview.md)
* [Develop U-SQL scripts using Data Lake Tools for Visual Studio](data-lake-analytics-data-lake-tools-get-started.md)
* [Using U-SQL window functions for Azure Data Lake Analytics jobs](data-lake-analytics-use-window-functions.md)
* [Monitor and troubleshoot Azure Data Lake Analytics jobs using Azure portal](data-lake-analytics-monitor-and-troubleshoot-jobs-tutorial.md)

## Let us know what you think
* [Submit a feature request](http://aka.ms/adlafeedback)
* [Get help in the forums](http://aka.ms/adlaforums)
* [Provide feedback on U-SQL](http://aka.ms/usqldiscuss)

