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

[Locally redundant storage (LRS)](/azure/storage/common/storage-redundancy?#locally-redundant-storage), the lowest-cost redundancy option, automatically stores and replicates three copies of your data within a single datacenter. Although LRS protects your data against server rack and drive failures, it doesn't account for disasters such as fire or flooding within a datacenter. In the face of such disasters, all replicas of a storage account configured to use LRS might be lost or unrecoverable.

:::image type="complex" source="../../media/reliability-storage/locally-redundant-storage.png" alt-text="Diagram that shows how data is replicated in availability zones by using LRS." lightbox="../../media/reliability-storage/locally-redundant-storage.png" border="false":::
   A blue box represents the primary region. It contains a gray box that represents the datacenter. A dark purple box inside the datacenter box represents LRS. It contains a light purple box that includes the storage account and three icons labeled copy 1, copy 2, and copy 3.
:::image-end:::

Zone-redundant storage (ZRS), geo-redundant storage (GRS), and geo-zone-redundant storage (GZRS) provide extra protections. This article describes these options in detail.
