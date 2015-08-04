<properties 
   pageTitle="Stream Analytics limits table"
   description="Describes system limits and recommended sizes for Stream Analytics components and connections."
   services="stream-analytics"
   documentationCenter="NA"
   authors="jeffstokes72"
   manager="paulettm"
   editor="cgronlun" />
<tags 
   ms.service="stream-analytics"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="big-data"
   ms.date="07/13/2015"
   ms.author="jeffstok" />

| Limit identifier | Limit       | Comments |
|----------------- | ------------|--------- |
| Maximum number of Streaming Units per subscription per region | 50 | A request to increase streaming units for your subscription beyond 50 can be made by contacting [Microsoft Support](https://support.microsoft.com/en-us). |
| Maximum throughput of a Streaming Unit | 1MB/s* | Maximum throughput per SU depends on the scenario. Actual throughput may be lower and depends query complexity and partitioning. Further details can be found in the [Scale Azure Stream Analytics jobs to increase throughput](../articles/stream-analytics/stream-analytics-scale-jobs.md) article. |
| SELECT statement query limitation | 5 outputs per query | This limit may be increased in the future. |
| SELECT statement subquery limitation | 14 aggregates per subquery | This limit may be increased in the future. |
