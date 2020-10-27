---
 title: include file
 description: include file
 services: virtual-machines-linux
 author: cynthn
 ms.service: virtual-machines-linux
 ms.topic: include
 ms.date: 06/19/2018
 ms.author: cynthn
 ms.custom: include file
---

## Deployment considerations

* For availability of N-series VMs, see [Products available by region](https://azure.microsoft.com/regions/services/).

* N-series VMs can only be deployed in the Resource Manager deployment model.

* N-series VMs differ in the type of Azure Storage they support for their disks. NC and NV VMs only support VM disks that are backed by Standard Disk Storage (HDD). NCv2, NCv3, ND, NDv2, and NVv2 VMs only support VM disks that are backed by Premium Disk Storage (SSD).

* If you want to deploy more than a few N-series VMs, consider a pay-as-you-go subscription or other purchase options. If you're using an [Azure free account](https://azure.microsoft.com/free/), you can use only a limited number of Azure compute cores.

* You might need to increase the cores quota (per region) in your Azure subscription, and increase the separate quota for NC, NCv2, NCv3, ND, NDv2, NV, or NVv2 cores. To request a quota increase, [open an online customer support request](../articles/azure-portal/supportability/how-to-create-azure-support-request.md) at no charge. Default limits may vary depending on your subscription category.




