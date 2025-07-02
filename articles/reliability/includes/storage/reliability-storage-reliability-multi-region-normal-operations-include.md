---
 title: include file
 description: include file
 author: anaharris-ms
 ms.service: azure
 ms.topic: include
 ms.date: 07/02/2024
 ms.author: anaharris
 ms.custom: include file
---




This section describes what to expect when a storage account is configured for geo-redundancy and all regions are operational.

- **Traffic routing between regions**: Azure Table Storage uses an active/passive approach where all write operations and most read operations are directed to the primary region.

  For RA-GRS and RA-GZRS configurations, applications can optionally read from the secondary region by accessing the secondary endpoint, but this requires explicit application configuration and is not automatic.

- **Data replication between regions**: Write operations are first committed to the primary region using the configured redundancy type (LRS for GRS/RA-GRS, or ZRS for GZRS/RA-GZRS). After successful completion in the primary region, data is asynchronously replicated to the secondary region where it's stored using locally redundant storage (LRS).

   The asynchronous nature of cross-region replication means there's typically a lag time between when data is written to primary and when it's available in the secondary region. You can monitor the replication time through the [Last Sync Time property](/azure/storage/common/last-sync-time-get).