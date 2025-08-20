---
 title: Description of Azure Storage geo-redundant storage dependency on paired regions
 description: Description of Azure Storage geo-redundant storage dependency on paired regions
 author: anaharris-ms
 ms.service: azure
 ms.topic: include
 ms.date: 07/02/2024
 ms.author: anaharris
 ms.custom: include file
---

Azure Storage geo-redundant configurations use [Azure paired regions](../../regions-paired.md) for secondary region replication. The secondary region is automatically determined based on your primary region selection and can't be customized. For a complete list of Azure paired regions, see [Azure regions list](../../regions-list.md).

   If your storage account's region isn't paired, consider using the [alternative multi-region approaches](#alternative-multi-region-approaches).
