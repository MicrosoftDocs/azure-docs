---
 title: Description of Azure Storage geo-redundant storage latency
 description: Description of Azure Storage geo-redundant storage latency
 author: anaharris-ms
 ms.service: azure
 ms.topic: include
 ms.date: 07/02/2024
 ms.author: anaharris
 ms.custom: include file
---

- **Asynchronous replication latency:** Data replication to the secondary region is asynchronous, which means that there's a lag between when data is written to the primary region and when it becomes available in the secondary region. This lag can result in potential data loss if a primary region failure occurs before recent data is replicated. The data loss is measured by the recovery point objective (RPO). You can expect the replication lag to be less than 15 minutes, but this time is an estimate and not guaranteed.
