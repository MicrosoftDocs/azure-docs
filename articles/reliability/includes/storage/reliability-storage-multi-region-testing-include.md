---
 title: Description of Azure Storage geo-redundant storage testing
 description: Description of Azure Storage geo-redundant storage testing
 author: anaharris-ms
 ms.service: azure
 ms.topic: include
 ms.date: 07/02/2024
 ms.author: anaharris
 ms.custom: include file
---

You can simulate regional failures to test your disaster recovery procedures.

- **Planned failover testing:** For geo-redundant storage (GRS) accounts, you can perform planned failover operations during maintenance windows to test the complete failover and failback process. Planned failover doesn't require data loss, but it does involve downtime during both failover and failback.

- **Secondary endpoint testing:** For read-access geo-redundant storage (RA-GRS) and read-access geo-zone-redundant storage (RA-GZRS) configurations, regularly test read operations against the secondary endpoint to ensure that your application can successfully read data from the secondary region.
