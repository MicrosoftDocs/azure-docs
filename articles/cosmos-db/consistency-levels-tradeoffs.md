---
title: Availability and performance tradeoffs for various consistency levels in Azure Cosmos DB | Microsoft Docs
description: Availability and performance tradeoffs for various consistency levels in Azure Cosmos DB.
keywords: consistency, performance, azure cosmos db, azure, Microsoft azure
services: cosmos-db
author: markjbrown

ms.service: cosmos-db
ms.topic: conceptual
ms.date: 10/20/2018
ms.author: mjbrown

---

# Availability and performance tradeoffs for various consistency levels in Azure Cosmos DB

Distributed databases relying on replication for high availability, low latency or both, make the fundamental tradeoff between the read consistency vs. availability, latency and throughput. Azure Cosmos DB approaches data consistency as a spectrum of choices instead of the two extremes of strong and eventual consistency. Cosmos DB empowers developers to choose among the five well-defined consistency models from the consistency spectrum (strongest to weakest) – **strong**, **bounded staleness**, **session**, **consistent prefix**, and **eventual**. Each of the five consistency models provides availability and performance tradeoffs and are backed by comprehensive SLAs.

## Consistency levels and latency

- The **read latency** for all consistency levels is always guaranteed to be less than 10 milliseconds at the 99th percentile and is backed by the SLA. The average (at the 50th percentile) read latency is typically 2 milliseconds or less.

- Except for the Cosmos accounts that span several regions and are configured with the strong consistency, the **write latency** for the remaining consistency levels is always guaranteed to be less than 10 milliseconds at the 99th percentile. This write latency is backed by the SLA. The average (at the 50th percentile) write latency is usually 5 milliseconds or less.

- For the Cosmos accounts that have several regions configured with strong consistency (currently in preview), the **write latency** is guaranteed to be less than < (2 * Round-trip time/RTT) + 10 milliseconds at the 99th percentile. The RTT between any of the two farthest regions associated with your Cosmos account. The exact RTT latency is a function of speed-of-light-distance and the exact Azure networking topology. Azure Networking doesn't provide any latency SLAs for the RTT between any two Azure regions. Cosmos DB replication latencies are displayed in Azure portal for your Cosmos account, allowing you to monitor the replication latencies between various regions associated with your Cosmos account.

## Consistency levels and throughput

- For the same number of request units, the session, consistent prefix, and eventual consistency levels provide approximately 2X read throughput when compared with strong and bounded staleness.

- For a given type of write operation such as insert, replace, upsert, delete, etc. the write throughput for request units is identical for all consistency levels.

## Next steps

Next you can learn more about global distribution and general consistency tradeoffs in distributed systems using the following articles:

* [Consistency tradeoffs in modern distributed database systems design](https://www.computer.org/web/csdl/index/-/csdl/mags/co/2012/02/mco2012020037-abs.html)
* [High availability](high-availability.md)
* [Cosmos DB SLA](https://azure.microsoft.com/support/legal/sla/cosmos-db/v1_2/)
