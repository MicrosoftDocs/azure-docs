---
author: tamram
ms.service: storage
ms.topic: include
ms.date: 06/20/2019
ms.author: tamram
---
| Resource | Target |
|----------|---------------|
| Maximum size of a single table | 500 TiB |
| Maximum size of a table entity | 1 MiB |
| Maximum number of properties in a table entity | 255, which includes three system properties: PartitionKey, RowKey, and Timestamp |
| Maximum total size of property values in an entity | 1 MiB |
| Maximum total size of an individual property in an entity | Varies by property type. For more information, see **Property Types** in [Understanding the Table Service Data Model](/rest/api/storageservices/understanding-the-table-service-data-model). |
| Maximum number of stored access policies per table | 5 |
| Maximum request rate per storage account | 20,000 transactions per second, which assumes a 1-KiB entity size |
| Target throughput for a single table partition (1 KiB-entities) | Up to 2,000 entities per second |