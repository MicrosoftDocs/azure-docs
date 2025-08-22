---
 title: Description of Azure Storage read-access geo-redundant storage secondary region access
 description: Description of Azure Storage read-access geo-redundant storage secondary region access
 author: anaharris-ms
 ms.service: azure
 ms.topic: include
 ms.date: 07/02/2024
 ms.author: anaharris
 ms.custom: include file
---

- **Secondary region access:** With geo-redundant storage (GRS) and geo-zone-redundant storage (GZRS) configurations, the secondary region isn't accessible for reads until a failover occurs.

    read-access geo-redundant storage (RA-GRS) and read-access geo-zone-redundant storage (RA-GZRS) configurations provide read access to the secondary region during normal operations, but because of the asynchronous replication latency, they might return slightly outdated data.
