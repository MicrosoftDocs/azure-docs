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

- **Planned failover testing:** For GRS accounts, you can perform planned failover operations during maintenance windows to test the complete failover and failback process. Although planned failover doesn't require data loss, it does involve downtime during both failover and failback.

- **Secondary endpoint testing:** For RA-GRS and RA-GZRS configurations, regularly test read operations against the secondary endpoint to ensure that your application can successfully read data from the secondary region.
