---
title: Azure Cosmos DB multi-master benefits
description: Understand the benefits of multi-master in Azure Cosmos DB. 
author: markjbrown
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 07/08/2019
ms.author: mjbrown
---

# Understand multi-master benefits in Azure Cosmos DB

Cosmos DB account operators should choose appropriate global distribution configuration to ensure the latency, availability and RTO requirements for their applications. Azure Cosmos accounts configured with multiple write locations offer significant benefits over accounts with single write location including, 99.999% write availability SLA, <10 ms write latency SLA at the 99th percentile and RTO = 0 in a regional disaster.

## Comparison of features

|Application Requirement|Multiple Write Locations|Single Write Location|Note|
|---|---|---|---|
|Write latency SLA of <10ms at P99|**Yes**|No|Accounts with Single Write Location incur additional cross-region network latency for each write.|
|Read latency SLA of <10ms at P99|**Yes**|Yes| |
|Write SLA of 99.999%|**Yes**|No|Accounts with Single Write Location guarantee SLA of 99.99%|
|RTO = 0|**Yes**|No|Zero down time for writes in case of regional disasters. Accounts with single write location have RTO of 15 min.|

## Next Steps

If you would still like to disable EnableMultipleWriteLocations in your Azure Cosmos account, please [open a support ticket](https://azure.microsoft.com/support/create-ticket/).
