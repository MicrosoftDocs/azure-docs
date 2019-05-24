---
author: tamram
ms.service: storage
ms.topic: include
ms.date: 10/26/2018
ms.author: tamram
---
| Resource | Target |
|----------|---------------|
| Maximum size of a single table | 500 TiB |
| Maximum size of a table entity | 1 MiB |
| Maximum number of properties in a table entity | 255, which includes three system properties: PartitionKey, RowKey, and Timestamp |
| Maximum number of stored access policies per table | 5 |
| Maximum request rate per storage account | 20,000 transactions per second, which assumes a 1-KiB entity size |
| Target throughput for a single table partition (1 KiB-entities) | Up to 2,000 entities per second |
