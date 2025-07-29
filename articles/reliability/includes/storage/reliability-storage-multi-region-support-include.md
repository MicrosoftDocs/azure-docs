---
 title: Description of Azure Storage geo-redundant storage
 description: Description of Azure Storage geo-redundant storage
 author: anaharris-ms
 ms.service: azure
 ms.topic: include
 ms.date: 07/02/2024
 ms.author: anaharris
 ms.custom: include file
---

Azure Storage - whether that's for Blob, Files, Table, or Queue - provides a range of geo-redundancy and failover capabilities to suit different requirements.

> [!IMPORTANT]
> Geo-redundant storage only works within [Azure paired regions](/azure/reliability/regions-paired). If your storage account's region isn't paired, consider using the [alternative multi-region approaches](#alternative-multi-region-approaches).

#### Replication across paired regions

Azure Storage provides several types of geo-redundant storage in paired regions. Whichever type of geo-redundant storage you use, data in the secondary region is always replicated using locally redundant storage (LRS), providing protection against hardware failures within the secondary region.

- [Geo-redundant storage (GRS)](/azure/storage/common/storage-redundancy#geo-redundant-storage) provides support for planned and unplanned failovers to the Azure paired region when there's an outage in the primary region. GRS asynchronously replicates data from the primary region to the paired region.

   :::image type="content" source="../../media/reliability-storage/geo-redundant-storage.png" alt-text="Diagram showing how data is replicated with GRS." lightbox="../../media/reliability-storage/geo-redundant-storage.png" border="false":::

- [Geo-zone redundant storage (GZRS)](/azure/storage/common/storage-redundancy#geo-zone-redundant-storage) replicates data in multiple availability zones in the primary region, and also into the paired region.

  :::image type="content" source="../../media/reliability-storage/geo-zone-redundant-storage.png" alt-text="Diagram showing how data is replicated with GZRS." lightbox="../../media/reliability-storage/geo-zone-redundant-storage.png" border="false":::
