---
title: Azure Stream Analytics JavaScript user-defined functions | Microsoft Docs
description: Perform advanced query mechanics with JavaScript user-defined functions
keywords: javascript, user defined functions, udf
services: stream-analytics
author: jeffstokes72
manager: jhubbard
editor: cgronlun

ms.assetid:
ms.service: stream-analytics
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: data-services
ms.date: 03/28/2017
ms.author: jeffstok
---

# Azure Stream Analytics JavaScript user-defined functions
Azure Stream Analytics supports user-defined functions written in JavaScript. With the rich set of **String**, **RegExp**, **Math**, **Array**, and **Date** methods that JavaScript provides, complex data transformations with Stream Analytics jobs become easier to create.

## JavaScript user-defined functions
JavaScript user-defined functions support stateless, compute-only scalar functions that do not require external connectivity. The return value of a function can only be a scalar (single) value. After you add a JavaScript user-defined function to a job, you can use the function anywhere in the query, like a built-in scalar function.

Here are some scenarios where you might find JavaScript user-defined functions useful:
* Parsing and manipulating strings that have regular expression functions, for example, **Regexp_Replace()** and **Regexp_Extract()**
* Decoding and encoding data, for example, binary-to-hex conversion
* Performing mathematic computations with JavaScript **Math** functions
* Performing array operations like sort, join, find, and fill

Here are some things that you cannot do with a JavaScript user-defined function in Stream Analytics:
* Call out external REST endpoints, for example, performing reverse IP lookup or pulling reference data from an external source
* Perform custom event format serialization or deserialization on inputs/outputs
* Create custom aggregates

Although functions like **Date.GetDate()** or **Math.random()** are not blocked in the functions definition, you should avoid using them. These functions **do not** return the same result every time you call them, and the Azure Stream Analytics service does not keep a journal of function invocations and returned results. If a function returns different result on the same events, repeatability is not guaranteed when a job is restarted by you or by the Stream Analytics service.

## Add a JavaScript user-defined function in the Azure portal
To create a simple JavaScript user-defined function under an existing Stream Analytics job, do these steps:

1.	In the Azure portal, find your Stream Analytics job.
2.  Under **JOB TOPOLOGY**, select your function. An empty list of functions appears.
3.	To create a new user-defined function, select **Add**.
4.	On the **New Function** blade, for **Function Type**, select **JavaScript**. A default function template appears in the editor.
5.	For the **UDF alias**, enter **hex2Int**, and change the function implementation as follows:

    ```
    // Convert Hex value to integer.
    function main(hexValue) {
        return parseInt(hexValue, 16);
    }
    ```

6.	Select **Save**. Your function appears in the list of functions.
7.	Select the new **hex2Int** function, and check the function definition. All functions have a **UDF** prefix added to the function alias. You need to *include the prefix* when you call the function in your Stream Analytics query. In this case, you call **UDF.hex2Int**.

## Call a JavaScript user-defined function in a query

1. In the query editor, under **JOB TOPOLOGY**, select **Query**.
2.	Edit your query, and then call the user-defined function, like this:

    ```
    SELECT
        time,
        UDF.hex2Int(offset) AS IntOffset
    INTO
        output
    FROM
        InputStream
    ```

3.	To upload the sample data file, right-click the job input.
4.	To test your query, select **Test**.


## Supported JavaScript objects
Azure Stream Analytics JavaScript user-defined functions support standard, built-in JavaScript objects. For a list of these objects, see [Global Objects](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects).

### Stream Analytics and JavaScript type conversion

There are differences in the types that the Stream Analytics query language and JavaScript support. This table lists the conversion mappings between the two:

Stream Analytics | JavaScript
--- | ---
bigint | Number (JavaScript can only represent integers up to precisely 2^53)
DateTime | Date (JavaScript only supports milliseconds)
double | Number
nvarchar(MAX) | String
Record | Object
Array | Array
NULL | Null


Here are JavaScript-to-Stream Analytics conversions:


JavaScript | Stream Analytics
--- | ---
Number | Bigint (if the number is round and between long.MinValue and long.MaxValue; otherwise, it's double)
Date | DateTime
String | nvarchar(MAX)
Object | Record
Array | Array
Null, Undefined | NULL
Any other type (for example, a function or error) | Not supported (results in runtime error)

## Troubleshooting
JavaScript runtime errors are considered fatal, and are surfaced through the Activity log. To retrieve the log, in the Azure portal, go to your job and select **Activity log**.


## Other JavaScript user-defined function patterns

### Write nested JSON to output
If you have a follow-up processing step that uses a Stream Analytics job output as input, and it requires a JSON format, you can write a JSON string to output. The next example calls the **JSON.stringify()** function to pack all name/value pairs of the input, and then write them as a single string value in output.

**JavaScript user-defined function definition:**

```
function main(x) {
return JSON.stringify(x);
}
```

**Sample query:**
```
SELECT
    DataString,
    DataValue,
    HexValue,
    UDF.json_stringify(input) As InputEvent
INTO
    output
FROM
    input PARTITION BY PARTITIONID
```

## Get help
For additional help, try our [Azure Stream Analytics forum](https://social.msdn.microsoft.com/Forums/home?forum=AzureStreamAnalytics).

## Next steps
* [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
* [Get started using Azure Stream Analytics](stream-analytics-real-time-fraud-detection.md)
* [Scale Azure Stream Analytics jobs](stream-analytics-scale-jobs.md)
* [Azure Stream Analytics query language reference](https://msdn.microsoft.com/library/azure/dn834998.aspx)
* [Azure Stream Analytics management REST API reference](https://msdn.microsoft.com/library/azure/dn835031.aspx)
