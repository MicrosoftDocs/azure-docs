---
title: Troubleshoot Azure Stream Analytics queries
description: This article describes techniques to troubleshoot your queries in Azure Stream Analytics jobs.
services: stream-analytics
author: sidram
ms.author: sidram
ms.reviewer: mamccrea
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 10/11/2018
---

# Troubleshoot Azure Stream Analytics queries

This article describes common issues with developing Stream Analytics queries and how to troubleshoot them.

## Query is not producing expected output 
1.  Examine errors by testing locally:
    - On the **Query** tab, select **Test**. Use the downloaded sample data to [test the query](stream-analytics-test-query.md). Examine any errors and attempt to correct them.   
    - You can also [test your query directly on live input](stream-analytics-live-data-local-testing.md) using Stream Analytics tools for Visual Studio.

2.  If you use [**Timestamp By**](https://msdn.microsoft.com/library/azure/mt573293.aspx), verify that the events have timestamps greater than the [job start time](stream-analytics-out-of-order-and-late-events.md).

3.  Eliminate common pitfalls, such as:
    - A [**WHERE**](https://msdn.microsoft.com/library/azure/dn835048.aspx) clause in the query filtered out all events, preventing any output from being generated.
    - A [**CAST**](https://msdn.microsoft.com/azure/stream-analytics/reference/cast-azure-stream-analytics) function fails, causing the job to fail. To avoid type cast failures, use [**TRY_CAST**](https://msdn.microsoft.com/azure/stream-analytics/reference/try-cast-azure-stream-analytics) instead.
    - When you use window functions, wait for the entire window duration to see an output from the query.
    - The timestamp for events precedes the job start time and, therefore, events are being dropped.

4.  Ensure event ordering policies are configured as expected. Go to the **Settings** and select [**Event Ordering**](stream-analytics-out-of-order-and-late-events.md). The policy is *not* applied when you use the **Test** button to test the query. This result is one difference between testing in-browser versus running the job in production. 

5. Debug by using audit and diagnostic logs:
    - Use [Audit Logs](../azure-resource-manager/resource-group-audit.md), and filter to identify and debug errors.
    - Use [job diagnostic logs](stream-analytics-job-diagnostic-logs.md) to identify and debug errors.

## Job is consuming too many Streaming Units
Ensure you take advantage of parallelization in Azure Stream Analytics. You can learn to [scale with query parallelization](stream-analytics-parallelization.md) of Stream Analytics jobs by configuring input partitions and tuning the analytics query definition.

## Debug queries progressively

In real-time data processing, knowing what the data looks like in the middle of the query can be helpful. Because inputs or steps of an Azure Stream Analytics job can be read multiple times, you can write extra SELECT INTO statements. Doing so outputs intermediate data into storage and lets you inspect the correctness of the data, just as *watch variables* do when you debug a program.

The following example query in an Azure Stream Analytics job has one stream input, two reference data inputs, and an output to Azure Table Storage. The query joins data from the event hub and two reference blobs to get the name and category information:

![Example SELECT INTO query](./media/stream-analytics-select-into/stream-analytics-select-into-query1.png)

Note that the job is running, but no events are being produced in the output. On the **Monitoring** tile, shown here, you can see that the input is producing data, but you don’t know which step of the **JOIN** caused all the events to be dropped.

![The Monitoring tile](./media/stream-analytics-select-into/stream-analytics-select-into-monitor.png)
 
In this situation, you can add a few extra SELECT INTO statements to "log" the intermediate JOIN results and the data that's read from the input.

In this example, we've added two new "temporary outputs." They can be any sink you like. Here we use Azure Storage as an example:

![Adding extra SELECT INTO statements](./media/stream-analytics-select-into/stream-analytics-select-into-outputs.png)

You can then rewrite the query like this:

![Rewritten SELECT INTO query](./media/stream-analytics-select-into/stream-analytics-select-into-query2.png)

Now start the job again, and let it run for a few minutes. Then query temp1 and temp2 with Visual Studio Cloud Explorer to produce the following tables:

**temp1 table**
![SELECT INTO temp1 table](./media/stream-analytics-select-into/stream-analytics-select-into-temp-table-1.png)

**temp2 table**
![SELECT INTO temp2 table](./media/stream-analytics-select-into/stream-analytics-select-into-temp-table-2.png)

As you can see, temp1 and temp2 both have data, and the name column is populated correctly in temp2. However, because there is still no data in output, something is wrong:

![SELECT INTO output1 table with no data](./media/stream-analytics-select-into/stream-analytics-select-into-out-table-1.png)

By sampling the data, you can be almost certain that the issue is with the second JOIN. You can download the reference data from the blob and take a look:

![SELECT INTO ref table](./media/stream-analytics-select-into/stream-analytics-select-into-ref-table-1.png)

As you can see, the format of the GUID in this reference data is different from the format of the [from] column in temp2. That’s why the data didn’t arrive in output1 as expected.

You can fix the data format, upload it to reference blob, and try again:

![SELECT INTO temp table](./media/stream-analytics-select-into/stream-analytics-select-into-ref-table-2.png)

This time, the data in the output is formatted and populated as expected.

![SELECT INTO final table](./media/stream-analytics-select-into/stream-analytics-select-into-final-table.png)

## Get help

For further assistance, try our [Azure Stream Analytics forum](https://social.msdn.microsoft.com/Forums/azure/home?forum=AzureStreamAnalytics).

## Next steps

* [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
* [Get started using Azure Stream Analytics](stream-analytics-real-time-fraud-detection.md)
* [Scale Azure Stream Analytics jobs](stream-analytics-scale-jobs.md)
* [Azure Stream Analytics Query Language Reference](https://msdn.microsoft.com/library/azure/dn834998.aspx)
* [Azure Stream Analytics Management REST API Reference](https://msdn.microsoft.com/library/azure/dn835031.aspx)