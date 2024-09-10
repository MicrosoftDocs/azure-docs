---
author: guywi-ms
ms.author: guywild
ms.service: azure-monitor
ms.topic: include
ms.date: 08/28/2024
---

Each Azure region that supports availability zones has a set of datacenters equipped with independent power, cooling, and networking infrastructure. 

Azure Monitor Logs availability zones are [redundant](../../reliability/availability-zones-overview.md#zonal-and-zone-redundant-services), which means that Microsoft spreads service requests and replicates data across different zones in supported regions. If an incident affects one zone, Microsoft uses a different availability zone in the region instead, automatically. You don't need to take any action because switching between zones is seamless. 

In most regions, Azure Monitor Logs availability zones support **data resilience**, which means your stored data is protected against data loss related to zonal failures, but service operations might still be impacted by regional incidents. If the service is unable to run queries, you can't view the logs until the issue is resolved.

A subset of the availability zones that support data resilience also support **service resilience**, which means that Azure Monitor Logs service operations - for example, log ingestion, queries, and alerts - can continue in the event of a zone failure. 

Availability zones protect against infrastructure-related incidents, such as storage failures. They don’t protect against application-level issues, such as faulty code deployments or certificate failures, which impact the entire region.