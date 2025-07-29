---
 title: Description of Azure Storage availability zone normal operations experience
 description: Description of Azure Storage availability zone normal operations experience
 author: anaharris-ms
 ms.service: azure
 ms.topic: include
 ms.date: 07/02/2024
 ms.author: anaharris
 ms.custom: include file
---

- **Traffic routing between zones**: Storage with ZRS automatically distributes requests across storage clusters in multiple availability zones. Traffic distribution is transparent to applications and requires no client-side configuration.

- **Data replication between zones**: All write operations to ZRS are replicated synchronously across all availability zones within the region. When you upload or modify data, the operation isn't considered complete until the data has been successfully replicated across all of the availability zones. This synchronous replication ensures strong consistency and zero data loss during zone failures. However, it may result in slightly higher write latency compared to locally redundant storage.
