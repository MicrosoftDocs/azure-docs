---
title: Debugging Azure Stream Analytics with Event Hub receivers | Microsoft Docs
description: Query best practices for considering Event Hub consumer groups in Stream Analytics jobs.
keywords: event hub limit, consumer group
services: stream-analytics
documentationcenter: ''
author: jeffstokes72
manager: jhubbard
editor: cgronlun

ms.assetid: 
ms.service: stream-analytics
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: data-services
ms.date: 04/03/2017
ms.author: jeffstok

---

# Best practices for Azure Stream Analytics and Event Hub consumer group receivers

Azure Event Hubs can be used in Stream Analytics to ingest or output data from a job. When using Event Hubs the best practice is to use multiple consumer groups to ensure job scalability. One of the reasons is that the number of readers in the stream analytics job for a given input impacts the number of readers in a single consumer group. The precise number of receivers is based on internal implementation details for the scale out topology logic and is not exposed externally. The number of readers can change either at the time of starting the job start time or during job upgrades.

> ![NOTE]
> When the number of readers change during job upgrades, transient warnings are written to Audit logs. Stream Analytics jobs will automatically recover from these transient issues.

## Cases where the number of readers per partition exceeds the Event Hub limit of 5 include:

* Multiple SELECT statements: If multiple SELECT statements that refer to **same** event hub input are used then each SELECT statement will cause a new receiver to be created.
* Union: Tt is possible to have multiple inputs that refer to the **same** Event Hub and consumer group when using UNIONs.
* Self-Join: Using self JOIN operations it is possible to refer to the **same** event hub multiple times.

## The following best practices will mitigate these concerns:

### Split your query into multiple steps using the WITH clause.

The WITH clause specifies a temporary named result set which can be referenced by a FROM clause in the query. It is defined within the execution scope of a single SELECT statement.

For example, instead of the query presented;

```
SELECT foo 
INTO output1
FROM inputEventHub

SELECT bar
INTO output2
FROM inputEventHub 
…
```

modify the query to this example;

```
WITH input (
   SELECT * FROM inputEventHub
) as data

SELECT foo
INTO output1
FROM data

SELECT bar
INTO output2
FROM data
…
```

### Ensure inputs bind to different consumer groups.

For queries where 3 or more inputs are connected to the same Event Hub consumer group, create separate consumer groups. This requires the creation of additional Stream Analytics inputs.


## Get help
For further assistance, try our [Azure Stream Analytics forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=AzureStreamAnalytics).

## Next steps
* [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
* [Get started using Azure Stream Analytics](stream-analytics-get-started.md)
* [Scale Azure Stream Analytics jobs](stream-analytics-scale-jobs.md)
* [Azure Stream Analytics query language reference](https://msdn.microsoft.com/library/azure/dn834998.aspx)
* [Azure Stream Analytics Management REST API reference](https://msdn.microsoft.com/library/azure/dn835031.aspx)
