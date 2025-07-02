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



When implementing multi-region Azure Storage - whether that's for Table, Queue, Blob, or Files -  consider the following important factors:

- **Asynchronous replication latency**: Data replication to the secondary region is asynchronous, which means there's a lag between when data is written to the primary region and when it becomes available in the secondary region. This lag can result in potential data loss (measured as Recovery Point Objective or RPO) if a primary region failure occurs before recent data is replicated. The replication lag is expected to be less than 15 minutes, but this is an estimate and not guaranteed.

- **Secondary region access**: With GRS and GZRS configurations, the secondary region is not accessible for reads until a failover occurs. RA-GRS and RA-GZRS configurations provide read access to the secondary region during normal operations.

- **Feature limitations**: Some Azure Storage features are not supported or have limitations when using geo-redundant storage or when using customer-managed failover. These include certain blob types, access tiers, and management operations. Review [feature compatibility documentation](/azure/storage/common/storage-disaster-recovery-guidance#unsupported-features-and-services) before implementing geo-redundancy.