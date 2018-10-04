---
title: "Tutorial: Azure Stream Analytics JavaScript user-defined functions | Microsoft Docs "
description: In this tutorial, you perform advanced query mechanics with JavaScript user-defined functions
keywords: javascript, user defined functions, udf
services: stream-analytics
author: rodrigoamicrosoft
manager: kfile

ms.assetid:
ms.service: stream-analytics
ms.topic: tutorial
ms.reviewer: mamccrea
ms.custom: mvc
ms.date: 04/01/2018
ms.workload: data-services
ms.author: rodrigoa

#Customer intent: "As an IT admin/developer I want to run JavaScript user-defined functions within Stream Analytics jobs."

---

# Tutorial: Azure Stream Analytics JavaScript user-defined functions
 
Azure Stream Analytics supports user-defined functions written in JavaScript. With the rich set of **String**, **RegExp**, **Math**, **Array**, and **Date** methods that JavaScript provides, complex data transformations with Stream Analytics jobs become easier to create.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Define a JavaScript user-defined function
> * Add the function to the portal
> * Define a query that runs the function

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

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
    function hex2Int(hexValue) {
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

## Clean up resources

When no longer needed, delete the resource group, the streaming job, and all related resources. Deleting the job avoids billing the streaming units consumed by the job. If you're planning to use the job in future, you can stop it and re-start it later when you need. If you are not going to continue to use this job, delete all resources created by this quickstart by using the following steps:

1. From the left-hand menu in the Azure portal, click **Resource groups** and then click the name of the resource you created.  
2. On your resource group page, click **Delete**, type the name of the resource to delete in the text box, and then click **Delete**.

## Get help
For additional help, try our [Azure Stream Analytics forum](https://social.msdn.microsoft.com/Forums/azure/home?forum=AzureStreamAnalytics).

## Next steps

In this tutorial, you have created a Stream Analytics job that runs a simple JavaScript user-defined function. To learn more about Stream Analytics, continue to the real-time scenario articles:

> [!div class="nextstepaction"]
> [Real-time Twitter sentiment analysis in Azure Stream Analytics](stream-analytics-twitter-sentiment-analysis-trends.md)
