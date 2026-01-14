---
 title: Description of Azure Storage geo-redundant storage failback experience
 description: Description of Azure Storage geo-redundant storage failback experience
 author: anaharris-ms
 ms.service: azure
 ms.topic: include
 ms.date: 07/02/2024
 ms.author: anaharris
 ms.custom: include file
---

The failback process differs significantly between Microsoft-managed and customer-managed failover scenarios.

- **Customer-managed failover (unplanned):** After an unplanned failover, the storage account is configured with locally redundant storage (LRS). To fail back, you need to re-establish the geo-redundant storage (GRS) relationship and wait for the data to be replicated.

- **Customer-managed failover (planned):** After a planned failover, the storage account remains geo-replicated. You can initiate another customer-managed failover to fail back to the original primary region. [The same failover considerations apply](#behavior-during-a-region-failure).

- **Microsoft-managed failover:** If Microsoft initiates a failover, it's likely that a significant disaster occurred in the primary region, and the primary region might not be recoverable. Any timelines or recovery plans depend on the extent of the regional disaster and recovery efforts. You should monitor Azure Service Health communications for details.
