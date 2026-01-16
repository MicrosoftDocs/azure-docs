---
 title: Description of Azure Storage availability zone normal operations experience - data replication
 description: Description of Azure Storage availability zone normal operations experience - data replication
 author: anaharris-ms
 ms.service: azure
 ms.topic: include
 ms.date: 07/02/2024
 ms.author: anaharris
 ms.custom: include file
---

All write operations to ZRS are replicated synchronously across all availability zones within the region. When you upload or modify data, the operation isn't considered complete until the data has been successfully replicated across all of the availability zones. This synchronous replication ensures strong consistency and zero data loss during zone failures.
