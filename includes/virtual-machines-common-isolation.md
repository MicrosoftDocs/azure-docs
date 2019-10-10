---
 title: include file
 description: include file
 services: virtual-machines
 author: ayshakeen
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 09/18/2019
 ms.author: azcspmt;ayshak;cynthn
 ms.custom: include file
---

Azure Compute offers virtual machine sizes that are Isolated to a specific hardware type and dedicated to a single customer.  These virtual machine sizes are best suited for workloads that require a high degree of isolation from other customers for workloads involving elements like compliance and regulatory requirements.  Customers can also choose to further subdivide the resources of these Isolated virtual machines by using [Azure support for nested virtual machines](https://azure.microsoft.com/blog/nested-virtualization-in-azure/).

Utilizing an isolated size guarantees that your virtual machine will be the only one running on that specific server instance.  The current Isolated virtual machine offerings include:
* Standard_E64is_v3
* Standard_E64i_v3
* Standard_M128ms
* Standard_GS5
* Standard_G5
* Standard_DS15_v2
* Standard_D15_v2
* Standard_F72s_v2

You can learn more about each available isolated size [here](https://docs.microsoft.com/azure/virtual-machines/windows/sizes-memory).