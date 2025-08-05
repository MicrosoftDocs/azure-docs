---
 title: Description of Azure Storage geo-redundant storage normal operations experience
 description: Description of Azure Storage geo-redundant storage normal operations experience
 author: anaharris-ms
 ms.service: azure
 ms.topic: include
 ms.date: 07/02/2024
 ms.author: anaharris
 ms.custom: include file
---

This section describes what to expect when a storage account is configured for geo-redundancy and all regions are operational.

- **Traffic routing between regions:** Storage uses an active/passive approach where all write operations and most read operations are directed to the primary region.

  For RA-GRS and RA-GZRS configurations, applications can optionally read from the secondary region by accessing the secondary endpoint. This approach requires explicit application configuration and isn't automatic. Also, because of the asynchronous replication lag, data in the secondary region might be slightly outdated.

- **Data replication between regions:** Write operations are first committed to the primary region by using the configured redundancy type (LRS for GRS and RA-GRS or ZRS for GZRS and RA-GZRS). After successful completion in the primary region, data is asynchronously replicated to the secondary region where it's stored by using LRS.

  [!INCLUDE [Storage - Multi Region Normal operations - lag](reliability-storage-multi-region-normal-operations-lag-include.md)]
