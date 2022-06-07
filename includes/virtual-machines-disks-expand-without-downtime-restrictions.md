---
 title: include file
 description: include file
 services: virtual-machines
 author: roygara
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 04/25/2022
 ms.author: rogarana
 ms.custom: include file
---    
- Only supported for data disks.
- Disks smaller than 4 TiB can't be expanded to 4 TiB or larger without downtime.
- Install and use either:
    - The [latest Azure CLI](/cli/azure/install-azure-cli)
    - The [latest Azure PowerShell module](/powershell/azure/install-az-ps)
    - The Azure portal if accessed through [https://aka.ms/iaasexp/DiskLiveResize](https://aka.ms/iaasexp/DiskLiveResize)
    - Or an Azure Resource Manager template with an API version that's 2021-04-01 or newer.
