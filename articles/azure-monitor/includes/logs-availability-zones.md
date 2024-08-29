---
author: guywi-ms
ms.author: guywild
ms.service: azure-monitor
ms.topic: include
ms.date: 08/28/2024
---

Each Azure region that supports availability zones has a set of datacenters equipped with independent power, cooling, and networking infrastructure. 

Azure Monitor Logs availability zones are [zone-redundant](../../reliability/availability-zones-overview.md#zonal-and-zone-redundant-services), which means that Microsoft manages spreading service requests and replicating data across different zones in supported regions. If one zone is affected by an incident, Microsoft manages failover to a different availability zone in the region automatically. You don't need to take any action because switching between zones is seamless. 

In most regions, Azure Monitor Logs availability zones support **data resilience**, which means your stored data is protected against zonal failures, but service operations might be impacted by regional incidents. A subset of the availability zones that support data resilience currently also support **service resilience**, which means that Azure Monitor Logs service operations - for example, log ingestion, queries, and alerts - can continue in the event of a zone failure. 