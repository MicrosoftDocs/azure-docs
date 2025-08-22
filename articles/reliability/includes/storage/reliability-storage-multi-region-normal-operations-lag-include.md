---
 title: Description of Azure Storage geo-redundant storage lag
 description: Description of Azure Storage geo-redundant storage lag
 author: anaharris-ms
 ms.service: azure
 ms.topic: include
 ms.date: 07/02/2024
 ms.author: anaharris
 ms.custom: include file
---

   The asynchronous nature of cross-region replication means that there's typically a lag time between when data is written to the primary region and when it's available in the secondary region. You can monitor the replication time by using the [Last Sync Time property](/azure/storage/common/last-sync-time-get).
