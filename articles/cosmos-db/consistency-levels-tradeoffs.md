---
title: Availability and performance tradeoffs for various consistency levels in Azure Cosmos DB | Microsoft Docs
description: Availability and performance tradeoffs for various consistency levels in Azure Cosmos DB.
keywords: consistency, performance, azure cosmos db, azure, Microsoft azure
services: cosmos-db
author: markjbrown

ms.service: cosmos-db
ms.devlang: na
ms.topic: conceptual
ms.date: 10/20/2018
ms.author: mjbrown

---

# Availability and performance tradeoffs for various consistency levels in Azure Cosmos DB

Distributed databases that rely on replication for high availability, low latency, or both must make tradeoffs. The tradeoffs are between read consistency vs. availability, latency, and throughput. 

Azure Cosmos DB approaches data consistency as a spectrum of choices instead of the two extremes of strong and eventual consistency. Developers can choose from five well-defined models on the consistency spectrum. From strongest to weakest, the models are:

- Strong 
- Bounded staleness 
- Session 
- Consistent prefix 
- Eventual 

Each model provides availability and performance tradeoffs and is backed by a comprehensive SLA.

## Consistency levels and latency

- The *read latency* for all consistency levels is always guaranteed to be less than 10 milliseconds at the 99th percentile. This read latency is backed by the SLA. The average read latency, at the 50th percentile, is typically two milliseconds or less.

-  The *write latency* for the remaining consistency levels is always guaranteed to be less than 10 milliseconds at the 99th percentile. This write latency is backed by the SLA. Azure Cosmos DB accounts that span several regions and are configured with strong consistency are an exception to this guarantee. The average write latency, at the 50th percentile, is usually five milliseconds or less.

- For accounts that have several regions configured with strong consistency, the write latency is guaranteed to be less than two times round-trip time (RTT) plus 10 milliseconds at the 99th percentile. This option is currently in preview. The RTT between any of the two farthest regions is associated with your Azure Cosmos DB account. The exact RTT latency is a function of speed-of-light distance and the exact Azure networking topology. Azure networking doesn't provide any latency SLAs for the RTT between any two Azure regions. 

    Azure Cosmos DB replication latencies are displayed in the Azure portal for your account. You can use the portal to monitor the replication latencies between various regions associated with your account.

## Consistency levels and throughput

- For the same number of request units, the session, consistent prefix, and eventual consistency levels provide approximately two times the read throughput when compared with strong and bounded staleness.

- For a given type of write operation, such as insert, replace, upsert, and delete, the write throughput for request units is the same for all consistency levels.

## Next steps

Learn more about global distribution and general consistency tradeoffs in distributed systems. See the following articles:

* [Consistency tradeoffs in modern distributed database systems design](https://www.computer.org/web/csdl/index/-/csdl/mags/co/2012/02/mco2012020037-abs.html)
* [High availability](high-availability.md)
* [Azure Cosmos DB SLA](https://azure.microsoft.com/support/legal/sla/cosmos-db/v1_2/)
