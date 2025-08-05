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

Storage, including Azure Blob Storage, Azure Files, Table Storage, and Queue Storage, provides a range of geo-redundancy and failover capabilities to suit different requirements.

> [!IMPORTANT]
> GRS only works within [Azure paired regions](/azure/reliability/regions-paired). If your storage account's region isn't paired, consider using the [alternative multi-region approaches](#alternative-multi-region-approaches).

### Replication across paired regions

Storage provides several types of GRS in paired regions. Whichever type of GRS you use, data in the secondary region is always replicated by using LRS. This approach provides protection against hardware failures within the secondary region.

- [GRS](/azure/storage/common/storage-redundancy#geo-redundant-storage) provides support for planned and unplanned failovers to the Azure paired region when there's an outage in the primary region. GRS asynchronously replicates data from the primary region to the paired region.

   :::image type="complex" source="../../media/reliability-storage/geo-redundant-storage.png" alt-text="Diagram that shows how data is replicated by using GRS." lightbox="../../media/reliability-storage/geo-redundant-storage.png" border="false":::
      Two blue boxes represent the primary region and the secondary region. They each contain a gray box that represents the datacenter. A dark purple box inside the datacenter box represents LRS. It contains a light purple box that includes the storage account and three icons labeled copy 1, copy 2, and copy 3. A dotted line that represents GRS encompasses the LRS boxes in both regions. An arrow labeled geo-replication points from the storage account in the primary region to the storage account in the secondary region.
   :::image-end:::

- [GZRS](/azure/storage/common/storage-redundancy#geo-zone-redundant-storage) replicates data in multiple availability zones in the primary region and into the paired region.

  :::image type="complex" source="../../media/reliability-storage/geo-zone-redundant-storage.png" alt-text="Diagram that shows how data is replicated by using GZRS." lightbox="../../media/reliability-storage/geo-zone-redundant-storage.png" border="false":::
     A blue box represents the primary region. It contains a dark purple box that represents ZRS. This box contains three white boxes that represent availability zone 1, availability zone 2, and availability zone 3. Each availability zone box contains a gray box that represents a datacenter. Each datacenter box contains a light purple box that includes the storage account and an icon labeled copy 1, copy 2, and copy 3. Another blue box represents the secondary region. That box contains a gray box that represents the datacenter. A dark purple box inside the datacenter box represents LRS. It contains a light purple box that includes the storage account and three icons labeled copy 1, copy 2, and copy 3. A dotted line that represents GZRS encompasses the ZRS and LRS boxes in both regions. An arrow labeled geo-replication points from ZRS in the primary region to the storage account in the secondary region.
   :::image-end:::
