---
title: Azure Stream Analytics JavaScript User-Defined Functions | Microsoft Docs
description: IoT sensor tags and data streams with stream analytics and real-time data processing
keywords: iot solution, get started with iot, tools
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
ms.date: 02/01/2017
ms.author: jeffstok
---

# Azure Stream Analytics JavaScript User-Defined Functions
Azure Stream Analytics supports User-Defined Functions (UDFs) written in JavaScript. With the rich set of String, RegExp, Math, Array, and Date methods that JavaScript provides, complex data transformations with Stream Analytics jobs become easier to create.

## Overview
JavaScript UDFs support stateless, compute-only scalar functions which do not require external connectivity. The return value of a function can only be a scalar (single) value. Once added to a job the function can be used at any place in the query like a built-in scalar function.

Here are some example scenarios where you will find JavaScript UDFs useful:
* Parsing and manipulating string with regular expression functions, for example, Regexp_Replace() and Regexp_Extract()
* Decoding and encoding data, for example, binary to hex conversion
* Mathematic computations with JavaScript Math functions
* Array operations like sorting, joining, find, and fill

Below are things that you cannot do with a JavaScript UDF in Stream Analytics:
* Calling out external REST endpoints, for example, reverse IP lookup or pulling reference data from an external source
* Custom event format serialization or deserialization on inputs/outputs
* Custom aggregates

Although they are not blocked in the functions definition, you should avoid using functions like Date.GetDate(), or Math.random(). These functions **do not** return the same result every time you call them and Azure Stream Analytics service does not keep a journal of function invocations and returned results. Therefore if a function returns different result on the same event(s), repeatability will not be guaranteed when a job is restarted by you or by the Stream Analytics service.

## Adding a JavaScript UDF from Azure portal
To create a simple JavaScript User-Defined Function under an existing Stream Analytics job follow these steps.

1.	Open the Azure portal.

2.	Locate your Stream Analytics job, then click on functions link under **JOB TOPOLOGY**.
 
3.	You will see an empty list of existing functions, click on the **Add** icon to add a new UDF.

4.	On the **New Function** blade, select JavaScript as the Function Type and you will see a default function template appear in the editor.
 
5.	Put in _hex2Int_ as the UDF alias and change the function implementation as below

    ```
    // Convert Hex value to integer.
    function main(hexValue) {
        return parseInt(hexValue, 16);
    }
    ```

6.	Click the **Save** button, your function will appear on the function list. 

7.	Click on the new function **hex2Int** and you can check the function definition. Note that all functions will have added a prefix “UDF” in front of the function alias. You will need to call the function **with the prefix** in your Stream Analytics query, in this case **UDF.hex2Int**.
 
## Calling JavaScript UDF in a query

1. Open the query editor by clicking **Query** under **JOB TOPOLOGY**. 

2.	Edit your query and call the UDF you just added as below:

    ```
    SELECT 
        time,
        UDF.hex2Int(offset) AS IntOffset
    INTO
        output
    FROM
        InputStream
    ```

3.	Right click on the job input to upload sample data file.
 
4.	Click on **Test** to test your query.


## Supported JavaScript Objects
Azure Stream Analytics JavaScript UDF supports standard built-in objects of JavaScript language. For the list of objects, please refer to the document on [Global Objects](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects).

### Stream Analytics and JavaScript Type Conversion

There are differences between types supported in Stream Analytics query language and JavaScript. The following table lists the conversion mappings between the two.


---
Stream Analytics | JavaScript
--- | ---
bigint | Number (note that JavaScript can only represent integer up to 2^53 precisely)
DateTime | Date (note that JavaScript only support milliseconds) 
double | Number
nvarchar(MAX) | String
Record | Object
Array | Array
NULL | Null


JavaScript to ASA conversions are listed as well.

---
JavaScript | Stream Analytics
--- | ---
Number | Bigint if number is round and between long.MinValue and long.MaxValue, double otherwise
Date | DateTime
String | nvarchar(MAX)
Object | Record
Array | Array
Null, Undefined | NULL
any other type, e.g. Function, Error, etc. | Not supported – runtime error

## Troubleshooting
JavaScript runtime errors will be considered fatal and surfaced through the Activity log. To retrieve the log from Azure portal, go to your job and click on **Activity log**.
 

## Other JavaScript UDF usage patterns

### Writing nested JSON to output
Writing a JSON string to output is a common task when you have follow-up processing step which takes Stream Analytics job output as input and it requires a JSON format. Below example calls JSON.stringify() function to pack all name/value pairs of the input and write them as a single string value in output. 

### JavaScript UDF definition:

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
For further assistance, try our [Azure Stream Analytics forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=AzureStreamAnalytics)

## Next steps
* [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
* [Get started using Azure Stream Analytics](stream-analytics-get-started.md)
* [Scale Azure Stream Analytics jobs](stream-analytics-scale-jobs.md)
* [Azure Stream Analytics Query Language Reference](https://msdn.microsoft.com/library/azure/dn834998.aspx)
* [Azure Stream Analytics Management REST API Reference](https://msdn.microsoft.com/library/azure/dn835031.aspx)
