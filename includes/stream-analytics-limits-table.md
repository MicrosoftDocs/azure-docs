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
   ms.date="07/22/2016"
   ms.author="jeffstok" />

| Limit identifier | Limit       | Comments |
|----------------- | ------------|--------- |
| Maximum number of Streaming Units per subscription per region | 50 | A request to increase streaming units for your subscription beyond 50 can be made by contacting [Microsoft Support](https://support.microsoft.com/en-us). |
| Maximum throughput of a Streaming Unit | 1MB/s* | Maximum throughput per SU depends on the scenario. Actual throughput may be lower and depends upon query complexity and partitioning. Further details can be found in the [Scale Azure Stream Analytics jobs to increase throughput](../articles/stream-analytics/stream-analytics-scale-jobs.md) article. |
| Maximum number of inputs per job | 60 | There is a hard limit of 60 inputs per Stream Analytics job. |
| Maximum number of outputs per job | 60 | There is a hard limit of 60 outputs per Stream Analytics job. |
| Maximum number of functions per job | 60 | There is a hard limit of 60 functions per Stream Analytics job. |
| Maximum number of jobs per region | 1500 | Each subscription may have up to 1500 jobs per geographical region. |

