---
 title: include file
 description: include file
 author: anaharris-ms
 ms.service: azure
 ms.topic: include
 ms.date: 07/02/2024
 ms.author: anaharris
 ms.custom: include file
---


<!-- John: should this be "multiple copies" instead of "three copies"?-->
[Locally redundant storage (LRS)](/azure/storage/common/storage-redundancy?#locally-redundant-storage), the lowest-cost redundancy option, automatically stores and replicates three copies of your storage account within a single datacenter. Although LRS protects your data against server rack and drive failures, it doesn't account for disasters such as fire or flooding within a datacenter. In the face of such disasters, all replicas of a storage account configured to use LRS might be lost or unrecoverable.

:::image type="content" source="/azure/reliability/media/reliability-storage-files/locally-redundant-storage" alt-text="Diagram showing how data is replicated in availability zones with LRS" lightbox="/azure/reliability/media/reliability-storage-files/locally-redundant-storage" border="false":::

Zone-redundant storage (ZRS) and geo-redundant storage (GRS/GZRS) provide additional protections, and are described in detail in this article.