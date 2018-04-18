---
title: Troubleshoot for malformed input events in Azure Stream Analytics| Microsoft Docs
description: How do I know which event in my input data is causing issue in a Stream Analytics job
keywords: ''
documentationcenter: ''
services: stream-analytics
author: SnehaGunda
manager: Kfile

ms.assetid: 
ms.service: stream-analytics
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: data-services
ms.date: 03/05/2018
ms.author: sngun
---

# Common issues in Stream Analytics and steps to troubleshoot

## Troubleshoot for malformed input events

When the input stream of your Stream Analytics job contains malformed messages, it causes serialization issues. Malformed messages include incorrect serialization such as missing parenthesis in a JSON object or incorrect time stamp format. When a Stream Analytics job receives a malformed message, it drops the message and notifies user with a warning. A warning symbol is shown on the **Inputs** tile of your Stream Analytics job (This warning sign exists as long as the job is in running state):

![Inputs tile](media/stream-analytics-malformed-events/inputs_tile.png)

You can enable the diagnostics logs to view the details of the warning. For malformatted input events, the execution logs contain an entry with the message that looks like: “Message: Could not deserialize the input event(s) from resource <blob URI> as json)". 

### Troubleshooting steps

1. Navigate to the input tile and click to view warnings.
2. The input details tile displays a set of warnings with details about the issue. Following is an example warning message, the warning message shows the Partition, Offset, and sequence numbers where there is malformed JSON data. 

   ![Warning message with offset](media/stream-analytics-malformed-events/warning_message_with_offset.png)

3. To get the JSON data that has incorrect format, run the CheckMalformedEvents.cs code, you can get the it from the [GitHub samples repository](https://github.com/Azure/azure-stream-analytics/tree/master/Samples/CheckMalformedEventsEH). This code reads the partition Id, offset, and prints the data that's located in that offset. 

4. Once you read the data, you can analyze and correct the serialization format. 

## Handling duplicate records when using Azure SQL Database as output for a Stream Analytics job

When you configure Azure SQL database as output to a Stream Analytics job, it bulk inserts records into the destination table. In general, Azure stream analytics guarantees [at least once delivery]( https://msdn.microsoft.com/azure/stream-analytics/reference/event-delivery-guarantees-azure-stream-analytics) to the output sink, one can still [achieve exactly-once delivery]( https://blogs.msdn.microsoft.com/streamanalytics/2017/01/13/how-to-achieve-exactly-once-delivery-for-sql-output/) to SQL output when SQL table has a unique constraint defined. 

Once unique key constraints are setup on the SQL table, and there are duplicate records being inserted into SQL table, Azure Stream Analytics removes the duplicate record by splitting the data into batches and recursively inserting the batches until a single duplicate record is found. If there are considerable number of duplicate rows in your pipeline, splitting and recursively inserting data ignoring duplicates one by one is a time-consuming process. If you see multiple key violation warning messages in your Activity log within the past hour, it’s likely that your SQL output is slowing down the entire job. 
To resolve this issue, you should [configure the index]( https://docs.microsoft.com/sql/t-sql/statements/create-index-transact-sql) that is causing the key violation by enabling the IGNORE_DUP_KEY option. Enabling this option allows duplicate values to be ignored by SQL during bulk inserts and SQL Azure simply produces a warning message instead of an error. Azure Stream Analytics does not produce primary key violation errors anymore.

Note the following observations when configuring IGNORE_DUP_KEY for several types of indexes:

* You cannot set IGNORE_DUP_KEY on a primary key or a unique constraint that uses ALTER INDEX, you need to drop and recreate the index.  
* You can set the IGNORE_DUP_KEY option using ALTER INDEX for a unique index, which is different from PRIMARY KEY/UNIQUE constraint and created using CREATE INDEX or INDEX definition.  
* IGNORE_DUP_KEY doesn’t apply to column store indexes because you can’t enforce uniqueness on such indexes.  

## Next steps

* [Azure Stream Analytics Query Language Reference](https://msdn.microsoft.com/library/azure/dn834998.aspx)
* [Azure Stream Analytics Management REST API Reference](https://msdn.microsoft.com/library/azure/dn835031.aspx)

