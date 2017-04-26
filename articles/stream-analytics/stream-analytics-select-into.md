---
title: Debugging Azure Stream Analytics queries using SELECT INTO | Microsoft Docs
description: Sample data mid-query using SELECT INTO statements in Stream Analytics
keywords: 
services: stream-analytics
documentationcenter: ''
author: jeffstokes72
manager: jhubbard
editor: cgronlun

ms.assetid: 9952e2cf-b335-4a5c-8f45-8d3e1eda2e20
ms.service: stream-analytics
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: data-services
ms.date: 04/20/2017
ms.author: jeffstok

---
# Debugging queries using SELECT INTO statements

In real-time data processing, knowing what the data looks like in the middle of the query can be very helpful. Since inputs or steps of an Azure Stream Analytics job can be read multiple times, we can write extra **SELECT INTO** statements to output intermediate data into storage and inspect the correctness of the data, just like “watch variables” when debugging a program.

## Using SELECT INTO to check the data stream

This example query in an Azure Stream Analytics job that has one stream input, two reference data inputs, and an output to Azure Table Storage joins data from the event hub and two reference blobs to get the name and category information:

![Select into query](./media/stream-analytics-select-into/stream-analytics-select-into-query1.png)

If you notice that the job is running, but no events are being produced in the output. From the Monitoring tile we can see that input is producing data, but we don’t know which step of the **JOIN** caused all the events to be dropped.

![Select into monitor tile](./media/stream-analytics-select-into/stream-analytics-select-into-monitor.png)
 
In this situation, we can add a few extra SELECT INTO statements to “log” the intermediate JOIN results as well as the data read from the input.

Let’s first add two new “temporary outputs”. They can be any sink you like. Here we use Azure Storage as an example:

![Select into monitor tile](./media/stream-analytics-select-into/stream-analytics-select-into-outputs.png)

Then let’s rewrite the query like this:

![Select into query](./media/stream-analytics-select-into/stream-analytics-select-into-query2.png)


Now start the job again and let it run for a few minutes. Then we can query temp1 and temp2 with Visual Studio Cloud Explorer:

![Select into temp table](./media/stream-analytics-select-into/stream-analytics-select-into-temp-table-1.png)

and also

![Select into temp table](./media/stream-analytics-select-into/stream-analytics-select-into-temp-table-2.png)

As we can see, temp1 and temp2 both have data, and the name column is populated correctly in temp2. However, there is still no data in output so something is wrong:

![Select into output table](./media/stream-analytics-select-into/stream-analytics-select-into-out-table-1.png)

By sampling the data, we are now almost certain that the issue is with the 2nd JOIN. Let’s download the reference data from the blob and take a look:

![Select into ref table](./media/stream-analytics-select-into/stream-analytics-select-into-ref-table-1.png)

As you can see, the format of GUID in this reference data is different from the format of the [from] column in temp2. That’s why our data wasn’t arriving in output1 as expected.

Let’s fix the data format, upload to reference blob and try again:

![Select into temp table](./media/stream-analytics-select-into/stream-analytics-select-into-ref-table-2.png)

And then we got the data in output with name and category properly formatted and populated as expected.

![Select into final table](./media/stream-analytics-select-into/stream-analytics-select-into-final-table.png)


## Get help

For further assistance, try our [Azure Stream Analytics forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=AzureStreamAnalytics)

## Next steps

* [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
* [Get started using Azure Stream Analytics](stream-analytics-get-started.md)
* [Scale Azure Stream Analytics jobs](stream-analytics-scale-jobs.md)
* [Azure Stream Analytics Query Language Reference](https://msdn.microsoft.com/library/azure/dn834998.aspx)
* [Azure Stream Analytics Management REST API Reference](https://msdn.microsoft.com/library/azure/dn835031.aspx)

