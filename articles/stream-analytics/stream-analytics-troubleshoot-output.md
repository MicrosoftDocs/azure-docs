---
title: Troubleshoot Azure Stream Analytics outputs
description: This article describes techniques to troubleshoot your output connections in Azure Stream Analytics jobs.
author: sidram
ms.author: sidram
ms.reviewer: mamccrea
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 12/07/2018
ms.custom: seodec18
---

# Troubleshoot Azure Stream Analytics outputs

This page describes common issues with output connections and how to troubleshoot and address them.

## Output not produced by job
1.  Verify connectivity to outputs by using the **Test Connection** button for each output.

2.  Look at [**Monitoring Metrics**](stream-analytics-monitoring.md) on the **Monitor** tab. Because the values are aggregated, the metrics are delayed by a few minutes.
    - If Input Events > 0, the job is able to read input data. If Input Events is not > 0, then:
      - To see whether the data source has valid data, check it by using [Service Bus Explorer](https://code.msdn.microsoft.com/windowsapps/Service-Bus-Explorer-f2abca5a). This check applies if the job is using Event Hub as input.
      - Check to see whether the data serialization format and data encoding are as expected.
      - If the job is using an Event Hub, check to see whether the body of the message is *Null*.

    - If Data Conversion Errors > 0 and climbing, the following might be true:
      - The output event does not conform to the schema of the target sink.
      - The event schema might not match the defined or expected schema of the events in the query.
      - The datatypes of some of the fields in the event might not match expectations.

    - If Runtime Errors > 0, it means that the job can receive the data but is generating errors while processing the query.
      - To find the errors, go to the [Audit Logs](../azure-resource-manager/management/view-activity-logs.md) and filter on *Failed* status.

    - If InputEvents > 0 and OutputEvents = 0, it means that one of the following is true:
      - Query processing resulted in zero output events.
      - Events or its fields might be malformed, resulting in zero output after query processing.
      - The job was unable to push data to the output sink for connectivity or authentication reasons.

    - In all the previously mentioned error cases, operations log messages explain additional details (including what is happening), except in cases where the query logic filtered out all events. If the processing of multiple events generates errors, Stream Analytics logs the first three error messages of the same type within 10 minutes to Operations logs. It then suppresses additional identical errors with a message that reads "Errors are happening too rapidly, these are being suppressed."

## Job output is delayed

### First output is delayed
When a Stream Analytics job is started, the input events are read, but there can be a delay in the output being produced in certain circumstances.

Large time values in temporal query elements can contribute to the output delay. To produce correct output over the large time windows, the streaming job starts up by reading data from the latest time possible (up to seven days ago) to fill the time window. During that time, no output is produced until the catch-up read of the outstanding input events is complete. This problem can surface when the system upgrades the streaming jobs, thus restarting the job. Such upgrades generally occur once every couple of months.

Therefore, use discretion when designing your Stream Analytics query. If you use a large time window (more than several hours, up to seven days) for temporal elements in the job's query syntax, it can lead to a delay on the first output when the job is started or restarted.  

One mitigation for this kind of first output delay is to use query parallelization techniques (partitioning the data), or add more Streaming Units to improve the throughput until the job catches up.  For more information, see [Considerations when creating Stream Analytics jobs](stream-analytics-concepts-checkpoint-replay.md)

These factors impact the timeliness of the first output that is generated:

1. Use of windowed aggregates (GROUP BY of Tumbling, Hopping, and Sliding windows)
   - For tumbling or hopping window aggregates, results are generated at the end of the window timeframe.
   - For a sliding window, the results are generated when an event enters or exits the sliding window.
   - If you are planning to use large window size (> 1 hour), it’s best to choose hopping or sliding window so that you can see the output more frequently.

2. Use of temporal joins (JOIN with DATEDIFF)
   - Matches are generated as soon as when both sides of the matched events arrive.
   - Data that lacks a match (LEFT OUTER JOIN) is generated at the end of the DATEDIFF window with respect to each event on the left side.

3. Use of temporal analytic functions (ISFIRST, LAST, and LAG with LIMIT DURATION)
   - For analytic functions, the output is generated for every event, there is no delay.

### Output falls behind
During normal operation of the job, if you find the job’s output is falling behind (longer and longer latency), you can pinpoint the root causes by examining these factors:
- Whether the downstream sink is throttled
- Whether the upstream source is throttled
- Whether the processing logic in the query is compute-intensive

To see those details, in the Azure portal, select the streaming job, and select the **Job diagram**. For each input, there is a per partition backlog event metric. If the backlog event metric keeps increasing, it’s an indicator that the system resources are constrained. Potentially that is due to of output sink throttling, or high CPU. For more information on using the job diagram, see [Data-driven debugging by using the job diagram](stream-analytics-job-diagram-with-metrics.md).

## Key violation warning with Azure SQL Database output

When you configure Azure SQL database as output to a Stream Analytics job, it bulk inserts records into the destination table. In general, Azure stream analytics guarantees [at least once delivery](https://docs.microsoft.com/stream-analytics-query/event-delivery-guarantees-azure-stream-analytics) to the output sink, one can still [achieve exactly-once delivery]( https://blogs.msdn.microsoft.com/streamanalytics/2017/01/13/how-to-achieve-exactly-once-delivery-for-sql-output/) to SQL output when SQL table has a unique constraint defined.

Once unique key constraints are set up on the SQL table, and there are duplicate records being inserted into SQL table, Azure Stream Analytics removes the duplicate record. It splits the data into batches and recursively inserting the batches until a single duplicate record is found. If the streaming job has a considerable number of duplicate rows, this split and insert process has to ignore the duplicates one by one, which is less efficient and time-consuming. If you see multiple key violation warning messages in your Activity log within the past hour, it’s likely that your SQL output is slowing down the entire job.

To resolve this issue, you should [configure the index]( https://docs.microsoft.com/sql/t-sql/statements/create-index-transact-sql) that is causing the key violation by enabling the IGNORE_DUP_KEY option. Enabling this option allows duplicate values to be ignored by SQL during bulk inserts and SQL Azure simply produces a warning message instead of an error. Azure Stream Analytics does not produce primary key violation errors anymore.

Note the following observations when configuring IGNORE_DUP_KEY for several types of indexes:

* You cannot set IGNORE_DUP_KEY on a primary key or a unique constraint that uses ALTER INDEX, you need to drop and recreate the index.  
* You can set the IGNORE_DUP_KEY option using ALTER INDEX for a unique index, which is different from PRIMARY KEY/UNIQUE constraint and created using CREATE INDEX or INDEX definition.  
* IGNORE_DUP_KEY doesn’t apply to column store indexes because you can’t enforce uniqueness on such indexes.  

## Column names are lower-cased by Azure Stream Analytics
When using the original compatibility level (1.0), Azure Stream Analytics used to change column names to lower case. This behavior was fixed in later compatibility levels. In order to preserve the case, we advise customers to move to the compatibility level 1.1 and later. You can find more information on [Compatibility level for Azure Stream Analytics jobs](https://docs.microsoft.com/azure/stream-analytics/stream-analytics-compatibility-level).


## Get help

For further assistance, try our [Azure Stream Analytics forum](https://social.msdn.microsoft.com/Forums/azure/home?forum=AzureStreamAnalytics).

## Next steps

* [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
* [Get started using Azure Stream Analytics](stream-analytics-real-time-fraud-detection.md)
* [Scale Azure Stream Analytics jobs](stream-analytics-scale-jobs.md)
* [Azure Stream Analytics Query Language Reference](https://docs.microsoft.com/stream-analytics-query/stream-analytics-query-language-reference)
* [Azure Stream Analytics Management REST API Reference](https://msdn.microsoft.com/library/azure/dn835031.aspx)
