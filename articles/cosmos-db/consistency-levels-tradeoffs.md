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

Azure Cosmos DB approaches data consistency as a spectrum of choices. This approach includes more options than the two extremes of strong and eventual consistency. You can choose from five well-defined models on the consistency spectrum. From strongest to weakest, the models are:

- Strong 
- Bounded staleness 
- Session 
- Consistent prefix 
- Eventual 

Each model provides availability and performance tradeoffs and is backed by a comprehensive SLA.

## Consistency levels and latency

- The read latency for all consistency levels is always guaranteed to be less than 10 milliseconds at the 99th percentile. This read latency is backed by the SLA. The average read latency, at the 50th percentile, is typically 2 milliseconds or less. Azure Cosmos accounts that span several regions and are configured with strong consistency are an exception to this guarantee.

-  The write latency for the remaining consistency levels is always guaranteed to be less than 10 milliseconds at the 99th percentile. This write latency is backed by the SLA. The average write latency, at the 50th percentile, is usually 5 milliseconds or less.

Some Azure Cosmos accounts might have several regions configured with strong consistency. In this case, the write latency is guaranteed to be less than two times round-trip time (RTT) plus 10 milliseconds at the 99th percentile. The RTT between any of the two farthest regions is associated with your Azure Cosmos account. It's equal to the RTT between any of the two farthest regions associated with your Azure Cosmos account. This option is currently in preview. 

The exact RTT latency is a function of speed-of-light distance and the Azure networking topology. Azure networking doesn't provide any latency SLAs for the RTT between any two Azure regions. For your Azure Cosmos account, replication latencies are displayed in the Azure portal. You can use the Azure portal to monitor the replication latencies between various regions that are associated with your account.

## Consistency levels and throughput

- For the same number of request units, the session, consistent prefix, and eventual consistency levels provide about two times the read throughput when compared with strong and bounded staleness.

- For a given type of write operation, such as insert, replace, upsert, and delete, the write throughput for request units is identical for all consistency levels.

## Next steps

Learn more about global distribution and general consistency tradeoffs in distributed systems. See the following articles:

* [Consistency tradeoffs in modern distributed database systems design](https://www.computer.org/web/csdl/index/-/csdl/mags/co/2012/02/mco2012020037-abs.html)
* [High availability](high-availability.md)
* [Azure Cosmos DB SLA](https://azure.microsoft.com/support/legal/sla/cosmos-db/v1_2/)
