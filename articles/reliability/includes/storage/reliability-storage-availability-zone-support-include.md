---
 title: Diagram of Azure Storage zone redundant storage
 description: Diagram of Azure Storage zone redundant storage
 author: anaharris-ms
 ms.service: azure
 ms.topic: include
 ms.date: 07/02/2024
 ms.author: anaharris
 ms.custom: include file
---

:::image type="complex" source="../../media/reliability-storage/zone-redundant-storage.png" alt-text="Diagram that shows how data is replicated in the primary region with zone-redundant storage (ZRS)." lightbox="../../media/reliability-storage/zone-redundant-storage.png" border="false":::
   A blue box represents the primary region. It contains a dark purple box that represents ZRS. This box contains three white boxes that represent availability zone 1, availability zone 2, and availability zone 3. Each availability zone box contains a gray box that represents a datacenter. Each datacenter box contains a light purple box that includes the storage account and an icon labeled copy 1, copy 2, and copy 3.
:::image-end:::
