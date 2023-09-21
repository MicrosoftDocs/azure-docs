---
title: Avoid service interruptions in Azure Stream Analytics jobs
description: This article describes guidance on making your Stream Analytics jobs upgrade resilient.
author: ajetasin
ms.author: ajetasi
ms.service: stream-analytics
ms.topic: how-to
ms.date: 11/10/2022
ms.custom: seodec18
---

# Guarantee Stream Analytics job reliability during service updates

Part of being a fully managed service is the capability to introduce new service functionality and improvements at a rapid pace. As a result, Stream Analytics can have a service update deploy on a weekly (or more frequent) basis. No matter how much testing is done there is still a risk that an existing, running job may break due to the introduction of a bug. If you are running mission critical jobs, these risks need to be avoided. You can reduce this risk by following Azure’s **[paired region](../availability-zones/cross-region-replication-azure.md)** model. 

## How do Azure paired regions address this concern?

Stream Analytics guarantees jobs in paired regions are updated in separate batches. Each batch has one or more regions which may be updated concurrently. The Stream Analytics service ensures any new update passes rigorous internal rings to have the highest quality. The service also proactively looks for many signals after deploying to each batch to get more confidence that there are no bugs introduced. The deployment of an update to Stream Analytics would not occur at the same time in a set of paired regions. As a result there is a sufficient time gap between the updates to identify potential issues and remediate them.

The article on **[availability and paired regions](../availability-zones/cross-region-replication-azure.md)** has the most up-to-date information on which regions are paired.

It is recommended to deploy identical jobs to both paired regions. You should then [monitor these jobs](./stream-analytics-job-metrics.md#scenarios-to-monitor) to get notified when something unexpected happens. If one of these jobs ends up in a [Failed state](./job-states.md) after a Stream Analytics service update, you can contact customer support to help identify the root cause. You should also fail over any downstream consumers to the healthy job output.

## Next steps

* [Introduction to Stream Analytics](stream-analytics-introduction.md)
* [Get started with Stream Analytics](stream-analytics-real-time-fraud-detection.md)
* [Scale Stream Analytics jobs](stream-analytics-scale-jobs.md)
* [Stream Analytics query language reference](/stream-analytics-query/stream-analytics-query-language-reference)
* [Stream Analytics management REST API reference](/rest/api/streamanalytics/)
