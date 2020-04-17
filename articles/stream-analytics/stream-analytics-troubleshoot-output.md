---
title: Troubleshoot Azure Stream Analytics outputs
description: This article describes techniques to troubleshoot your output connections in Azure Stream Analytics jobs.
author: sidram
ms.author: sidram
ms.reviewer: mamccrea
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 03/31/2020
ms.custom: seodec18
---

# Troubleshoot Azure Stream Analytics outputs

This article describes common issues with Azure Stream Analytics output connections and how to troubleshoot them. Many troubleshooting steps require that diagnostic logs be enabled for your Stream Analytics job. If you don't have diagnostic logs enabled, see [Troubleshoot Stream Analytics by using diagnostics logs](stream-analytics-job-diagnostic-logs.md).

## The job doesn't produce output

If the job doesn't produce outputs, verify connectivity:

1. Verify connectivity to outputs using the **Test Connection** button for each output.
1. Look at [Monitoring metrics](stream-analytics-monitoring.md) on the **Monitor** tab. Because the values are aggregated, the metrics are delayed by a few minutes.

   * If Input Events are greater than zero, the job can read the input data. If Input Events are not greater than zero, there is an issue with the job's input. See [Troubleshoot input connections](stream-analytics-troubleshoot-input.md) for more information.
   * If Data Conversion Errors are greater than zero and climbing, see [Azure Stream Analytics data errors](data-errors.md) for detailed information about data conversion errors.
   * If Runtime Errors are greater than zero, your job can receive data but it's generating errors while processing the query. To find the errors, go to the [audit logs](../azure-resource-manager/management/view-activity-logs.md), and then filter on the *Failed* status.
   * If InputEvents is greater than zero and OutputEvents equals zero, one of the following is true:
      * The query processing resulted in zero output events.
      * Events or fields might be malformed, resulting in a zero output after the query processing.
      * The job was unable to push data to the output sink for connectivity or authentication reasons.

   Operations log messages explain additional details, including what's happening, except in cases where the query logic filters out all events. If the processing of multiple events generates errors, the errors aggregate every 10 minutes.

## The first output is delayed

When a Stream Analytics job starts, the input events are read. But, there can be a delay in the output, in certain circumstances.

Large time values in temporal query elements can contribute to the output delay. To produce the correct output over large time windows, the streaming job reads data from the latest time possible to fill the time window. The data can be up to seven days past. No output produces until the outstanding input events are read. This problem can surface when the system upgrades the streaming jobs. When an upgrade takes place, the job restarts. Such upgrades generally occur once every couple of months.

Use discretion when designing your Stream Analytics query. If you use a large time window for temporal elements in the job's query syntax, it can lead to a delay in the first output when the job starts or restarts. More than several hours, up to seven days, is considered a large time window.

One mitigation for this kind of first output delay is to use query parallelization techniques, such as partitioning the data. Or, you can add more Streaming Units to improve the throughput until the job catches up.  For more information, see [Considerations when creating Stream Analytics jobs](stream-analytics-concepts-checkpoint-replay.md).

These factors impact the timeliness of the first output:

* The use of windowed aggregates, such as a GROUP BY clause of tumbling, hopping, and sliding windows:

  * For tumbling or hopping window aggregates, the results are generated at the end of the window timeframe.
  * For a sliding window, the results are generated when an event enters or exits the sliding window.
  * If you are planning to use a large window size, such as more than one hour, it’s best to choose a hopping or sliding window. These window types let you see the output more frequently.

* The use of temporal joins, such as JOIN with DATEDIFF:
  * Matches generate as soon as both sides of the matched events arrive.
  * Data that lacks a match, like LEFT OUTER JOIN, generates at the end of the DATEDIFF window, with respect to each event on the left side.

* The use of temporal analytic functions, such as ISFIRST, LAST, and LAG with LIMIT DURATION:
  * For analytic functions, the output generates for every event. There is no delay.

## The output falls behind

During the normal operation of a job, the output might have longer and longer periods of latency. If the output falls behind like that, you can pinpoint the root causes by examining the following factors:

* Whether the downstream sink is throttled.
* Whether the upstream source is throttled.
* Whether the processing logic in the query is compute-intensive.

To see the output details, select the streaming job in the Azure portal, and then select the **Job diagram**. For each input, there is a per partition backlog event metric. If the metric keeps increasing, it’s an indicator that the system resources are constrained. The increase is potentially due to output sink throttling, or high CPU usage. For more information, see [Data-driven debugging by using the job diagram](stream-analytics-job-diagram-with-metrics.md).

## Key violation warning in Azure SQL Database output

When you configure an Azure SQL Database as output to a Stream Analytics job, it bulk inserts records into the destination table. In general, Stream Analytics guarantees [at least once delivery](https://docs.microsoft.com/stream-analytics-query/event-delivery-guarantees-azure-stream-analytics) to the output sink. You can still [achieve exactly-once delivery]( https://blogs.msdn.microsoft.com/streamanalytics/2017/01/13/how-to-achieve-exactly-once-delivery-for-sql-output/) to a SQL output when a SQL table has a unique constraint defined.

When unique key constraints are set up on the SQL table and duplicate records are inserted into the SQL table, Stream Analytics removes the duplicate records. It splits the data into batches and recursively inserts the batches until a single duplicate record is found. The split and insert process ignores the duplicates one at a time. For a streaming job that has a considerable number of duplicate rows, the process is inefficient and time-consuming. If you see multiple key violation warning messages in your Activity log for the previous hour, it’s likely that your SQL output is slowing down the entire job.

To resolve this issue, [configure the index]( https://docs.microsoft.com/sql/t-sql/statements/create-index-transact-sql) causing the key violation by enabling the IGNORE_DUP_KEY option. This option allows SQL to ignore duplicate values during bulk inserts. Azure SQL Database simply produces a warning message instead of an error. Stream Analytics doesn't produce primary key violation errors anymore.

Note the following observations when configuring the IGNORE_DUP_KEY for several types of indexes:

* You can't set the IGNORE_DUP_KEY on a primary key or a unique constraint that uses ALTER INDEX. You need to drop and recreate the index.  
* You can't set the IGNORE_DUP_KEY option using ALTER INDEX for a unique index. This is different from a PRIMARY KEY/UNIQUE constraint and is created using a CREATE INDEX or INDEX definition.  
* The IGNORE_DUP_KEY doesn’t apply to column store indexes because you can’t enforce uniqueness on them.  

## Column names are lower-case in Stream Analytics (1.0)

When using the original compatibility level (1.0), Stream Analytics changes column names to lower-case. This behavior was fixed in later compatibility levels. To preserve the case, move to compatibility level 1.1 or later. See [Compatibility level for Stream Analytics jobs](https://docs.microsoft.com/azure/stream-analytics/stream-analytics-compatibility-level) for more information.

## Get help

For further assistance, try our [Stream Analytics forum](https://social.msdn.microsoft.com/Forums/azure/home?forum=AzureStreamAnalytics).

## Next steps

* [Introduction to Stream Analytics](stream-analytics-introduction.md)
* [Get started using Stream Analytics](stream-analytics-real-time-fraud-detection.md)
* [Scale Stream Analytics jobs](stream-analytics-scale-jobs.md)
* [Stream Analytics Query Language Reference](https://docs.microsoft.com/stream-analytics-query/stream-analytics-query-language-reference)
* [Stream Analytics Management REST API Reference](https://msdn.microsoft.com/library/azure/dn835031.aspx)
