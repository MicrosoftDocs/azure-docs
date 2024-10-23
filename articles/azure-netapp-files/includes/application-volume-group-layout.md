---
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: include
ms.date: 01/31/2024
ms.author: anfdocs
ms.custom: include file

# application-volume-group-concepts.md
# application-volume-group-oracle-introduction.md
---

* AVG can deploy 1 to 8 data, log (and optionally, log-mirror), backup, and binary volumes in the selected zone using the same network features setting (Standard or Basic) and the same NFS version (NFSv4.1 or NFSv3).
* The hosting capacity pool needs to be configured with [Manual QoS](../azure-netapp-files-performance-considerations.md#manual-qos-volume-quota-and-throughput).
* Data volumes are deployed following anti-affinity rules to ensure they're spread over as many Azure NetApp Files storage endpoints as possible in the selected zone. The volumes are also assigned direct storage-endpoints for the best possible latency. 
* Up to three data volumes can be deployed on the same storage-endpoint in resource-constrained zones if capacity and throughput requirements permit. 
* Log, log-mirror, and backup volumes are deployed following no-grouping rules: none of these volumes can share storage-endpoints. These volumes are assigned direct-storage-endpoints.
* The binary volume can share a storage-endpoint with the backup volume and doesn't require a direct storage-endpoint.