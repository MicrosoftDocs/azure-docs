---
 title: Description of Azure Storage redundancy architecture
 description: Description of Azure Storage redundancy architecture
 author: anaharris-ms
 ms.service: azure
 ms.topic: include
 ms.date: 07/02/2024
 ms.author: anaharris
 ms.custom: include file
---

[Locally redundant storage (LRS)](/azure/storage/common/storage-redundancy?#locally-redundant-storage) replicates the data within your storage accounts to one or more Azure availability zones located in the primary region of your choice. Although there's no option to choose your preferred availability zone, Azure may move or expand LRS accounts across zones to improve load balancing. LRS provides at least 99.999999999 (11 nines) durability of objects over a given year. For more information about availability zones, see [What are Availability Zones?](../../availability-zones-overview.md).

:::image type="content" source="../../media/reliability-storage/locally-redundant-storage.png" alt-text="Diagram showing how data is replicated in availability zones with LRS." lightbox="../../media/reliability-storage/locally-redundant-storage.png" border="false":::

Zone-redundant storage (ZRS) and geo-redundant storage (GRS/GZRS) provide additional protections, and are described in detail in this article.
