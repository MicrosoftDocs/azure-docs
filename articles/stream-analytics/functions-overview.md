---
title: User-defined functions in Azure Stream Analytics
description: This article is an overview of user-defined functions in Azure Stream Analytics.
author: ahartoon
ms.author: anboisve
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 04/07/2020
---

# User-defined functions in Azure Stream Analytics

The SQL-like query language in Azure Stream Analytics makes it easy to implement real-time analytics logic on streaming data. Stream Analytics provides additional flexibility through custom functions that are invoked in your query. The following code example is a UDF called `sampleFunction` that accepts one parameter, each input record the job receives, and the result is written to the output as `sampleResult`.

```sql
SELECT 
    UDF.sampleFunction(InputStream) AS sampleResult 
INTO 
    output 
FROM 
    InputStream 
```

## Types of functions

Azure Stream Analytics supports the following four function types: 

* JavaScript user-defined functions 
* JavaScript user-defined aggregates 
* C# user-defined functions (using Visual Studio) 
* Azure Machine Learning 

You can use these functions for scenarios such as real-time scoring using machine learning models, string manipulations, complex mathematical calculations, encoding and decoding data. 

## Limitations

User-defined functions are stateless, and the return value can only be a scalar value. You cannot call out to external REST endpoints from these user-defined functions, as it will likely impact performance of your job. 

Azure Stream Analytics does not keep a record of all functions invocations and returned results. To guarantee repeatability - for example, re-running your job from older timestamp produces the same results again - do not to use functions such as `Date.GetData()` or `Math.random()`, as these functions do not return the same result for each invocation.  

## Resource logs

Any runtime errors are considered fatal and are surfaced through activity and resource logs. It is recommended that your function handles all exceptions and errors and return a valid result to your query. This will prevent your job from going to a [Failed state](job-states.md).  

## Exception handling

Any exception during data processing is considered a catastrophic failure when consuming data in Azure Stream Analytics. User-defined functions have a higher potential to throw exceptions and cause the processing to stop. To avoid this issue, use a *try-catch* block in JavaScript or C# to catch exceptions during code execution. Exceptions that are caught can be logged and treated without causing a system failure. You are encouraged to always wrap your custom code in a *try-catch* block to avoid throwing unexpected exceptions to the processing engine.

## Next steps

* [JavaScript user-defined functions in Azure Stream Analytics](stream-analytics-javascript-user-defined-functions.md)
* [Azure Stream Analytics JavaScript user-defined aggregates](stream-analytics-javascript-user-defined-aggregates.md)
* [Develop .NET Standard user-defined functions for Azure Stream Analytics jobs](stream-analytics-edge-csharp-udf-methods.md)
* [Integrate Azure Stream Analytics with Azure Machine Learning](machine-learning-udf.md)
