---
 title: include file
 description: include file
 services: virtual-machines
 author: roygara
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 03/05/2020
 ms.author: rogarana
 ms.custom: include file
---

1. Only one VNET can be linked to a DiskAccess object.
1. Your VNET must be in the same subscription as your DiskAccess object to link them.
1. Up to 10 disks or snapshots can be imported or exported at the same time with the same DiskAccess object.
1. You cannot request manual approval to link a VNET to a DiskAccess object.
1. The differential capability is not supported for incremental snapshots that are associated with a DiskAccess object. 
