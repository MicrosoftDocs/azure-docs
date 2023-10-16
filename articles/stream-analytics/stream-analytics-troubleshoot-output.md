---
title: Troubleshoot Azure Stream Analytics outputs
description: This article describes techniques to troubleshoot your output connections in Azure Stream Analytics jobs.
author: ajetasin
ms.author: ajetasi
ms.service: stream-analytics
ms.topic: troubleshooting
ms.date: 10/05/2020
ms.custom: seodec18
---

# Troubleshoot Azure Stream Analytics outputs

This article describes common issues with Azure Stream Analytics output connections and how to troubleshoot output issues. Many troubleshooting steps require resource and other diagnostic logs be enabled for your Stream Analytics job. If you don't have resource logs enabled, see [Troubleshoot Azure Stream Analytics by using resource logs](stream-analytics-job-diagnostic-logs.md).

## The job doesn't produce output

1. Verify connectivity to outputs by using the **Test Connection** button for each output.
1. Look at [Monitor Stream Analytics job with Azure portal](stream-analytics-monitoring.md) on the **Monitor** tab. Because the values are aggregated, the metrics are delayed by a few minutes.

   * If the **Input Events** value is greater than zero, the job can read the input data. If the **Input Events** value isn't greater than zero, there's an issue with the job's input. See [Troubleshoot input connections](stream-analytics-troubleshoot-input.md) for more information. If your job has reference data input, apply splitting by logical name when looking at **Input Events** metric. If there are no input events from your reference data alone, then it likely means that this input source has not be configured properly to fetch the right reference dataset.
   * If the **Data Conversion Errors** value is greater than zero and climbing, see [Azure Stream Analytics data errors](data-errors.md) for detailed information about data conversion errors.
   * If the **Runtime Errors** value is greater than zero, your job receives data but generates errors while processing the query. To find the errors, go to the [audit logs](../azure-monitor/essentials/activity-log.md), and then filter on the **Failed** status.
   * If the **Input Events** value is greater than zero and the **Output Events** value equals zero, one of the following statements is true:
      * The query processing resulted in zero output events.
      * Events or fields might be malformed, resulting in a zero output after the query processing.
      * The job was unable to push data to the output sink for connectivity or authentication reasons.

   Operations log messages explain additional details, including what's happening, except in cases where the query logic filters out all events. If the processing of multiple events generates errors, the errors aggregate every 10 minutes.

## The first output is delayed

When a Stream Analytics job starts, the input events are read. But, there can be a delay in the output, in certain circumstances.

Large time values in temporal query elements can contribute to the output delay. To produce the correct output over large time windows, the streaming job reads data from the latest time possible to fill the time window. The data can be up to seven days past. No output produces until the outstanding input events are read. This problem can surface when the system upgrades the streaming jobs. When an upgrade takes place, the job restarts. Such upgrades generally occur once every couple of months.

Use discretion when designing your Stream Analytics query. If you use a large time window for temporal elements in the job's query syntax, it can lead to a delay in the first output when the job starts or restarts. More than several hours, up to seven days, is considered a large time window.

One mitigation for this kind of first output delay is to use query parallelization techniques, such as partitioning the data. Or, you can add more Streaming Units to improve the throughput until the job catches up.  For more information, see [Considerations when creating Stream Analytics jobs](stream-analytics-concepts-checkpoint-replay.md).

These factors affect the timeliness of the first output:

* The use of windowed aggregates, such as a GROUP BY clause of tumbling, hopping, and sliding windows:

  * For tumbling or hopping window aggregates, the results generate at the end of the window timeframe.
  * For a sliding window, the results generate when an event enters or exits the sliding window.
  * If you're planning to use a large window size, such as more than one hour, it's best to choose a hopping or sliding window. These window types let you see the output more frequently.

* The use of temporal joins, such as JOIN with DATEDIFF:
  * Matches generate as soon as both sides of the matched events arrive.
  * Data that lacks a match, like LEFT OUTER JOIN, is generated at the end of the DATEDIFF window, for each event on the left side.

* The use of temporal analytic functions, such as ISFIRST, LAST, and LAG with LIMIT DURATION:
  * For analytic functions, the output is generated for every event. There is no delay.

## The output falls behind

During the normal operation of a job, the output might have longer and longer periods of latency. If the output falls behind like that, you can pinpoint the root causes by examining the following factors:

* Whether the downstream sink is throttled
* Whether the upstream source is throttled
* Whether the processing logic in the query is compute-intensive

To see the output details, select the streaming job in the Azure portal, and then select **Job diagram**. For each input, there's a backlog event metric per partition. If the metric keeps increasing, it's an indicator that the system resources are constrained. The increase is potentially due to output sink throttling, or high CPU usage. For more information, see [Data-driven debugging by using the job diagram](stream-analytics-job-diagram-with-metrics.md).

## Key violation warning with Azure SQL Database output

When you configure an Azure SQL database as output to a Stream Analytics job, it bulk inserts records into the destination table. In general, Azure Stream Analytics guarantees [at-least-once delivery](/stream-analytics-query/event-delivery-guarantees-azure-stream-analytics) to the output sink. You can still [achieve exactly-once delivery]( https://blogs.msdn.microsoft.com/streamanalytics/2017/01/13/how-to-achieve-exactly-once-delivery-for-sql-output/) to a SQL output when a SQL table has a unique constraint defined.

When you set up unique key constraints on the SQL table, Azure Stream Analytics removes duplicate records. It splits the data into batches and recursively inserts the batches until a single duplicate record is found. The split and insert process ignores the duplicates one at a time. For a streaming job that has many duplicate rows, the process is inefficient and time-consuming. If you see multiple key violation warning messages in your Activity log for the previous hour, it's likely that your SQL output is slowing down the entire job.

To resolve this issue, [configure the index](/sql/t-sql/statements/create-index-transact-sql) that's causing the key violation by enabling the IGNORE_DUP_KEY option. This option allows SQL to ignore duplicate values during bulk inserts. Azure SQL Database simply produces a warning message instead of an error. As a result, Azure Stream Analytics no longer produces primary key violation errors.

Note the following observations when configuring IGNORE_DUP_KEY for several types of indexes:

* You can't set IGNORE_DUP_KEY on a primary key or a unique constraint that uses ALTER INDEX. You need to drop the index and recreate it.  
* You can set IGNORE_DUP_KEY by using ALTER INDEX for a unique index. This instance is different from a PRIMARY KEY/UNIQUE constraint and is created by using a CREATE INDEX or INDEX definition.  
* The IGNORE_DUP_KEY option doesn't apply to column store indexes because you can't enforce uniqueness on them.

## SQL output retry logic

When a Stream Analytics job with SQL output receives the first batch of events, the following steps occur:

1. The job attempts to connect to SQL.
2. The job fetches the schema of the destination table.
3. The job validates column names and types against the destination table schema.
4. The job prepares an in-memory data table from the output records in the batch.
5. The job writes the data table to SQL using BulkCopy [API](/dotnet/api/system.data.sqlclient.sqlbulkcopy.writetoserver).

During these steps, the SQL output can experience following types of errors:

* Transient [errors](/azure/azure-sql/database/troubleshoot-common-errors-issues#transient-fault-error-messages-40197-40613-and-others) that are retried using an exponential backoff retry strategy. The minimum retry interval depends on the individual error code, but the intervals are typically less than 60 seconds. The upper limit can be at most five minutes. 

   [Login failures](/azure/azure-sql/database/troubleshoot-common-errors-issues#unable-to-log-in-to-the-server-errors-18456-40531) and [firewall issues](/azure/azure-sql/database/troubleshoot-common-errors-issues#cannot-connect-to-server-due-to-firewall-issues) are retried at least 5 minutes after the previous try and are retried until they succeed.

* Data errors, such as casting errors and schema constraint violations, are handled with output error policy. These errors are handled by retrying binary split batches until the individual record causing the error is handled by skip or retry. Primary Unique key constraint violation is [always handled](./stream-analytics-troubleshoot-output.md#key-violation-warning-with-azure-sql-database-output).

* Non-transient errors can happen when there are SQL service issues or internal code defects. For example, when errors like (Code 1132) Elastic Pool hitting its storage limit, retries do not resolve the error. In these scenarios, the Stream Analytics job experiences [degradation](job-states.md).
* `BulkCopy` timeouts can happen during `BulkCopy` in Step 5. `BulkCopy` can experience operation timeouts occasionally. The default minimum configured  timeout is five minutes and it's doubled when hit consecutively.
Once the timeout is above 15 minutes, the max batch size hint to `BulkCopy` is reduced to half until 100 events per batch are left.

## Column names are lowercase in Azure Stream Analytics (1.0)

When using the original compatibility level (1.0), Azure Stream Analytics changes column names to lowercase. This behavior was fixed in later compatibility levels. To preserve the case, move to compatibility level 1.1 or later. For more information, see [Compatibility level for Stream Analytics jobs](./stream-analytics-compatibility-level.md).

## Get help

For further assistance, try our [Microsoft Q&A question page for Azure Stream Analytics](/answers/topics/azure-stream-analytics.html).

## Next steps

* [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
* [Get started using Azure Stream Analytics](stream-analytics-real-time-fraud-detection.md)
* [Scale Azure Stream Analytics jobs](stream-analytics-scale-jobs.md)
* [Azure Stream Analytics Query Language reference](/stream-analytics-query/stream-analytics-query-language-reference)
* [Azure Stream Analytics management REST API reference](/rest/api/streamanalytics/)