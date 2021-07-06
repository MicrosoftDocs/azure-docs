---
 author: normesta
 ms.service: storage
 ms.topic: include
 ms.date: 09/28/2020
 ms.author: normesta
---

This table shows [account-level metrics](../articles/azure-monitor/essentials/metrics-supported.md#microsoftstoragestorageaccounts).

| Metric | Description |
| ------------------- | ----------------- |
| UsedCapacity | The amount of storage used by the storage account. For standard storage accounts, it's the sum of capacity used by blob, table, file, and queue. For premium storage accounts and Blob storage accounts, it is the same as BlobCapacity. <br/><br/> Unit: Bytes <br/> Aggregation Type: Average <br/> Value example: 1024 |