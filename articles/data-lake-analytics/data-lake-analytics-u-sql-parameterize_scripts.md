---
title: 'Parameterize U-SQL scripts in Azure Data Lake Analytics | Microsoft Docs'
description: Learn how to parameterize U-SQL scripts in Azure Data Lake Analytics.
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
ms.date: 05/10/2017
ms.author: edmaca

---
# Parameterizing U-SQL scripts

When working with U-SQL scripts, it is convenient to parameterize the scripts. Parameters allow the main body to remain the same, and still control the script's execution by passing in separate parameter values. A typical scenario involves a script processes data over some time range and a developer may want to parameterize the script on 
a beginning date and an ending date. 

There are two ways in which scripts are parameterized:
* The script allows the safe addition of parameters at the top of the script. U-SQL supports this method.
* A Job submission API allows callers to send parameters. U-SQL does not support this method.

## Example scripts

Here is a simple initial script:

```
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
    TO "/output/data.csv"
    USING Outputters.Csv();
```    
   
In this scenario, we parameterize the ``Region`` by adding a `DECLARE EXTERNAL` statement.

```
DECLARE EXTERNAL @TargetRegion = "en-us";

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
    TO "/output/data.csv"
    USING Outputters.Csv();
```    

Running, this script defaults to filtering to only the rows from the `en-us` region. So far, we have defined a parameter
in the script. The `EXTERNAL` keyword indicates that someone can redefine the `@TargetRegion` value by prepending a DECLARE 
statement that defines the `@TargetRegion` parameter.

The following script shows what the parameterized script looks like when someone has provided a value for the parameter. This script 
now filters to rows that have a region of `en-gb`.

```
DECLARE @TargetRegion = "en-gb";

DECLARE EXTERNAL @TargetRegion = "en-us";

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
    TO "/output/data.csv"
    USING Outputters.Csv();
```    


## Next steps
* [Overview of Microsoft Azure Data Lake Analytics](data-lake-analytics-overview.md)
* [Develop U-SQL scripts using Data Lake Tools for Visual Studio](data-lake-analytics-data-lake-tools-get-started.md)
* [Monitor and troubleshoot Azure Data Lake Analytics jobs using Azure portal](data-lake-analytics-monitor-and-troubleshoot-jobs-tutorial.md)
