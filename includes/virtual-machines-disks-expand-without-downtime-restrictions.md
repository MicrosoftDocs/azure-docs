---
 title: include file
 description: include file
 services: virtual-machines
 author: roygara
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 11/02/2021
 ms.author: rogarana
 ms.custom: include file
---

- Currently only available in West Central US.
- Only supported for data disks.
- Disks smaller than 4 TiB can't be expanded to 4 TiB or larger without downtime.
    - If you increase the size of a disk to 4 TiB or larger, it can then be expanded without downtime.
- Install and use either the [latest Azure CLI](/cli/azure/install-azure-cli), [latest Azure PowerShell module](/powershell/azure/install-az-ps), the Azure portal if accessed through [https://aka.ms/iaasexp/DiskLiveResize](https://aka.ms/iaasexp/DiskLiveResize), or an Azure Resource Manager template with an API version that's 2021-04-01 or newer.