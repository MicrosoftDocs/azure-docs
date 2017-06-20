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
* The R code is embedded in the U-SQL script.

--

    DECLARE @myRScript = @"
    inputFromUSQL$Species = as.factor(inputFromUSQL$Species)
    lm.fit=lm(unclass(Species)~.-Par, data=inputFromUSQL)
    #do not return readonly columns and make sure that the column names are the same in usql and r scripts,
    outputToUSQL=data.frame(summary(lm.fit)$coefficients)
    colnames(outputToUSQL) <- c(""Estimate"", ""StdError"", ""tValue"", ""Pr"")
    outputToUSQL
    ";
    
    @RScriptOutput = REDUCE … USING new Extension.R.Reducer(command:@myRScript, rReturnType:"dataframe");

The following example illustrates a more complex usage. In this case, the R code is deployed as a RESOURCE that is the U-SQL script.

--

    REFERENCE ASSEMBLY [ExtR];

    DEPLOY RESOURCE @"/usqlext/samples/R/RinUSQL_PredictUsingLinearModelasDF.R";
    DEPLOY RESOURCE @"/usqlext/samples/R/my_model_LM_Iris.rda";
    DECLARE @IrisData string = @"/usqlext/samples/R/iris.csv";
    DECLARE @OutputFilePredictions string = @"/my/R/Output/LMPredictionsIris.txt";
    DECLARE @PartitionCount int = 10;

    @InputData =
        EXTRACT 
            SepalLength double,
            SepalWidth double,
            PetalLength double,
            PetalWidth double,
            Species string
        FROM @IrisData
        USING Extractors.Csv();

    @ExtendedData =
        SELECT 
            Extension.R.RandomNumberGenerator.GetRandomNumber(@PartitionCount) AS Par,
            SepalLength,
            SepalWidth,
            PetalLength,
            PetalWidth
        FROM @InputData;

    // Predict Species

    @RScriptOutput = REDUCE @ExtendedData ON Par
        PRODUCE Par, fit double, lwr double, upr double
        READONLY Par
        USING new Extension.R.Reducer(scriptFile:"RinUSQL_PredictUsingLinearModelasDF.R", rReturnType:"dataframe", stringsAsFactors:false);
        OUTPUT @RScriptOutput TO @OutputFilePredictions USING Outputters.Tsv();

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
