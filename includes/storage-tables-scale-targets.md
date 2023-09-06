---
author: tamram
ms.service: azure-storage
ms.topic: include
ms.date: 03/09/2020
ms.author: tamram
---

The following table describes capacity, scalability, and performance targets for Table storage.

| Resource | Target |
|----------|---------------|
| Number of tables in an Azure storage account | Limited only by the capacity of the storage account |
| Number of partitions in a table | Limited only by the capacity of the storage account |
| Number of entities in a partition | Limited only by the capacity of the storage account |
| Maximum size of a single table | 500 TiB |
| Maximum size of a single entity, including all property values | 1 MiB |
| Maximum number of properties in a table entity | 255 (including the three system properties, **PartitionKey**, **RowKey**, and **Timestamp**) |
| Maximum total size of an individual property in an entity | Varies by property type. For more information, see **Property Types** in [Understanding the Table Service Data Model](/rest/api/storageservices/understanding-the-table-service-data-model). |
| Size of the **PartitionKey** | A string up to 1 KiB in size |
| Size of the **RowKey** | A string up to 1 KiB in size |
| Size of an entity group transaction | A transaction can include at most 100 entities and the payload must be less than 4 MiB in size. An entity group transaction can include an update to an entity only once. |
| Maximum number of stored access policies per table | 5 |
| Maximum request rate per storage account | 20,000 transactions per second, which assumes a 1-KiB entity size |
| Target throughput for a single table partition (1 KiB-entities) | Up to 2,000 entities per second |