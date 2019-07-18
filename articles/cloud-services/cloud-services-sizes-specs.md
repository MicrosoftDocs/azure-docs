---
title: Virtual machine sizes for Azure Cloud services | Microsoft Docs
description: Lists the different virtual machine sizes (and IDs) for Azure cloud service web and worker roles.
services: cloud-services
documentationcenter: ''
author: jpconnock
manager: jpconnock
editor: ''

ms.assetid: 1127c23e-106a-47c1-a2e9-40e6dda640f6
ms.service: cloud-services
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: tbd
ms.date: 07/18/2017
ms.author: jeconnoc

---
# Sizes for Cloud Services
This topic describes the available sizes and options for Cloud Service role instances (web roles and worker roles). It also provides deployment considerations to be aware of when planning to use these resources. Each size has an ID that you put in your [service definition file](cloud-services-model-and-package.md#csdef). Prices for each size are available on the [Cloud Services Pricing](https://azure.microsoft.com/pricing/details/cloud-services/) page.

> [!NOTE]
> To see related Azure limits, see [Azure Subscription and Service Limits, Quotas, and Constraints](../azure-subscription-service-limits.md)
>
>

## Sizes for web and worker role instances
There are multiple standard sizes to choose from on Azure. Considerations for some of these sizes include:

* D-series VMs are designed to run applications that demand higher compute power and temporary disk performance. D-series VMs provide faster processors, a higher memory-to-core ratio, and a solid-state drive (SSD) for the temporary disk. For details, see the announcement on the Azure blog, [New D-Series Virtual Machine Sizes](https://azure.microsoft.com/blog/2014/09/22/new-d-series-virtual-machine-sizes/).
* Dv3-series, Dv2-series, a follow-on to the original D-series, features a more powerful CPU. The Dv2-series CPU is about 35% faster than the D-series CPU. It is based on the latest generation 2.4 GHz Intel Xeon® E5-2673 v3 (Haswell) processor, and with the Intel Turbo Boost Technology 2.0, can go up to 3.1 GHz. The Dv2-series has the same memory and disk configurations as the D-series.
* G-series VMs offer the most memory and run on hosts that have Intel Xeon E5 V3 family processors.
* The A-series VMs can be deployed on various hardware types and processors. The size is throttled, based on the hardware, to offer consistent processor performance for the running instance, regardless of the hardware it is deployed on. To determine the physical hardware on which this size is deployed, query the virtual hardware from within the Virtual Machine.
* The A0 size is over-subscribed on the physical hardware. For this specific size only, other customer deployments may impact the performance of your running workload. The relative performance is outlined below as the expected baseline, subject to an approximate variability of 15 percent.

The size of the virtual machine affects the pricing. The size also affects the processing, memory, and storage capacity of the virtual machine. Storage costs are calculated separately based on used pages in the storage account. For details, see [Cloud Services Pricing Details](https://azure.microsoft.com/pricing/details/cloud-services/) and [Azure Storage Pricing](https://azure.microsoft.com/pricing/details/storage/).

The following considerations might help you decide on a size:

* The A8-A11 and H-series sizes are also known as *compute-intensive instances*. The hardware that runs these sizes is designed and optimized for compute-intensive and network-intensive applications, including high-performance computing (HPC) cluster applications, modeling, and simulations. The A8-A11 series uses Intel Xeon E5-2670 @ 2.6 GHZ and the H-series uses Intel Xeon E5-2667 v3 @ 3.2 GHz. For detailed information and considerations about using these sizes, see [High performance compute VM sizes](../virtual-machines/windows/sizes-hpc.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).
* Dv3-series, Dv2-series, D-series, G-series, are ideal for applications that demand faster CPUs, better local disk performance, or have higher memory demands. They offer a powerful combination for many enterprise-grade applications.
* Some of the physical hosts in Azure data centers may not support larger virtual machine sizes, such as A5 – A11. As a result, you may see the error message **Failed to configure virtual machine {machine name}** or **Failed to create virtual machine {machine name}** when resizing an existing virtual machine to a new size; creating a new virtual machine in a virtual network created before April 16, 2013; or adding a new virtual machine to an existing cloud service. See [Error: “Failed to configure virtual machine”](https://social.msdn.microsoft.com/Forums/9693f56c-fcd3-4d42-850e-5e3b56c7d6be/error-failed-to-configure-virtual-machine-with-a5-a6-or-a7-vm-size?forum=WAVirtualMachinesforWindows) on the support forum for workarounds for each deployment scenario.
* Your subscription might also limit the number of cores you can deploy in certain size families. To increase a quota, contact Azure Support.

## Performance considerations
We have created the concept of the Azure Compute Unit (ACU) to provide a way of comparing compute (CPU) performance across Azure SKUs and to identify which SKU is most likely to satisfy your performance needs.  ACU is currently standardized on a Small (Standard_A1) VM being 100 and all other SKUs then represent approximately how much faster that SKU can run a standard benchmark.

> [!IMPORTANT]
> The ACU is only a guideline. The results for your workload may vary.
>
>

<br>

| SKU Family | ACU/Core |
| --- | --- |
| [ExtraSmall](#a-series) |50 |
| [Small-ExtraLarge](#a-series) |100 |
| [A5-7](#a-series) |100 |
| [A8-A11](#a-series) |225* |
| [A v2](#av2-series) |100 |
| [D](#d-series) |160 |
| [D v2](#dv2-series) |160 - 190* |
| [D v3](#dv3-series) |160 - 190* |
| [E v3](#ev3-series) |160 - 190* |
| [F](#f-series) |210 - 250*|
| [G](#g-series) |180 - 240* |
| [H](#h-series) |290 - 300* |

ACUs marked with a * use Intel® Turbo technology to increase CPU frequency and provide a performance boost. The amount of the boost can vary based on the VM size, workload, and other workloads running on the same host.

## Size tables
The following tables show the sizes and the capacities they provide.

* Storage capacity is shown in units of GiB or 1024^3 bytes. When comparing disks measured in GB (1000^3 bytes) to disks measured in GiB (1024^3) remember that capacity numbers given in GiB may appear smaller. For example, 1023 GiB = 1098.4 GB
* Disk throughput is measured in input/output operations per second (IOPS) and MBps where MBps = 10^6 bytes/sec.
* Data disks can operate in cached or uncached modes. For cached data disk operation, the host cache mode is set to **ReadOnly** or **ReadWrite**. For uncached data disk operation, the host cache mode is set to **None**.
* Maximum network bandwidth is the maximum aggregated bandwidth allocated and assigned per VM type. The maximum bandwidth provides guidance for selecting the right VM type to ensure adequate network capacity is available. When moving between Low, Moderate, High and Very High, the throughput increases accordingly. Actual network performance will depend on many factors including network and application loads, and application network settings.

## A-series
| Size            | CPU cores | Memory: GiB  | Temporary Storage: GiB       | Max NICs / Network bandwidth |
|---------------- | --------- | ------------ | -------------------- | ---------------------------- |
| ExtraSmall      | 1         | 0.768        | 20                   | 1 / low |
| Small           | 1         | 1.75         | 225                  | 1 / moderate |
| Medium          | 2         | 3.5          | 490                  | 1 / moderate |
| Large           | 4         | 7            | 1000                 | 2 / high |
| ExtraLarge      | 8         | 14           | 2040                 | 4 / high |
| A5              | 2         | 14           | 490                  | 1 / moderate |
| A6              | 4         | 28           | 1000                 | 2 / high |
| A7              | 8         | 56           | 2040                 | 4 / high |

## A-series - compute-intensive instances
For information and considerations about using these sizes, see [High performance compute VM sizes](../virtual-machines/windows/sizes-hpc.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

| Size            | CPU cores | Memory: GiB  | Temporary Storage: GiB       | Max NICs / Network bandwidth |
|---------------- | --------- | ------------ | -------------------- | ---------------------------- |
| A8*             |8          | 56           | 1817                 | 2 / high |
| A9*             |16         | 112          | 1817                 | 4 / very high |
| A10             |8          | 56           | 1817                 | 2 / high |
| A11             |16         | 112          | 1817                 | 4 / very high |

\*RDMA capable

## Av2-series

| Size            | CPU cores | Memory: GiB  | Temporary Storage (SSD): GiB       | Max NICs / Network bandwidth |
|---------------- | --------- | ------------ | -------------------- | ---------------------------- |
| Standard_A1_v2  | 1         | 2            | 10                   | 1 / moderate                 |
| Standard_A2_v2  | 2         | 4            | 20                   | 2 / moderate                 |
| Standard_A4_v2  | 4         | 8            | 40                   | 4 / high                     |
| Standard_A8_v2  | 8         | 16           | 80                   | 8 / high                     |
| Standard_A2m_v2 | 2         | 16           | 20                   | 2 / moderate                 |
| Standard_A4m_v2 | 4         | 32           | 40                   | 4 / high                     |
| Standard_A8m_v2 | 8         | 64           | 80                   | 8 / high                     |


## D-series
| Size            | CPU cores | Memory: GiB  | Temporary Storage (SSD): GiB       | Max NICs / Network bandwidth |
|---------------- | --------- | ------------ | -------------------- | ---------------------------- |
| Standard_D1     | 1         | 3.5          | 50                   | 1 / moderate |
| Standard_D2     | 2         | 7            | 100                  | 2 / high |
| Standard_D3     | 4         | 14           | 200                  | 4 / high |
| Standard_D4     | 8         | 28           | 400                  | 8 / high |
| Standard_D11    | 2         | 14           | 100                  | 2 / high |
| Standard_D12    | 4         | 28           | 200                  | 4 / high |
| Standard_D13    | 8         | 56           | 400                  | 8 / high |
| Standard_D14    | 16        | 112          | 800                  | 8 / very high |

## Dv2-series
| Size            | CPU cores | Memory: GiB  | Temporary Storage (SSD): GiB       | Max NICs / Network bandwidth |
|---------------- | --------- | ------------ | -------------------- | ---------------------------- |
| Standard_D1_v2  | 1         | 3.5          | 50                   | 1 / moderate |
| Standard_D2_v2  | 2         | 7            | 100                  | 2 / high |
| Standard_D3_v2  | 4         | 14           | 200                  | 4 / high |
| Standard_D4_v2  | 8         | 28           | 400                  | 8 / high |
| Standard_D5_v2  | 16        | 56           | 800                  | 8 / extremely high |
| Standard_D11_v2 | 2         | 14           | 100                  | 2 / high |
| Standard_D12_v2 | 4         | 28           | 200                  | 4 / high |
| Standard_D13_v2 | 8         | 56           | 400                  | 8 / high |
| Standard_D14_v2 | 16        | 112          | 800                  | 8 / extremely high |
| Standard_D15_v2 | 20        | 140          | 1,000                | 8 / extremely high |

## Dv3-series

| Size            | CPU cores | Memory: GiB   | Temporary Storage (SSD): GiB       | Max NICs / Network bandwidth |
|---------------- | --------- | ------------- | -------------------- | ---------------------------- |
| Standard_D2_v3  | 2         | 8             | 50                   | 2 / moderate |
| Standard_D4_v3  | 4         | 16            | 100                  | 2 / high |
| Standard_D8_v3  | 8         | 32            | 200                  | 4 / high |
| Standard_D16_v3 | 16        | 64            | 400                  | 8 / extremely high |
| Standard_D32_v3 | 32        | 128           | 800                  | 8 / extremely high |
| Standard_D64_v3 | 64        | 256           | 1600                 | 8 / extremely high |

## Ev3-series

| Size            | CPU cores | Memory: GiB   | Temporary Storage (SSD): GiB       | Max NICs / Network bandwidth |
|---------------- | --------- | ------------- | -------------------- | ---------------------------- |
| Standard_E2_v3  | 2         | 16            | 50                   | 2 / moderate |
| Standard_E4_v3  | 4         | 32            | 100                  | 2 / high |
| Standard_E8_v3  | 8         | 64            | 200                  | 4 / high |
| Standard_E16_v3 | 16        | 128           | 400                  | 8 / extremely high |
| Standard_E32_v3 | 32        | 256           | 800                  | 8 / extremely high |
| Standard_E64_v3 | 64        | 432           | 1600                 | 8 / extremely high |

## F-series


| Size            | CPU cores | Memory: GiB   | Temporary Storage (SSD): GiB       | Max NICs / Network bandwidth |
|---------------- | --------- | ------------- | -------------------- | ---------------------------- |
| Standard_F1     | 1         | 2             | 16                   | 2 / 750  |
| Standard_F2     | 2         | 4             | 32                   | 2 / 1500 |
| Standard_F4     | 4         | 8             | 64                   | 4 / 3000 |
| Standard_F8     | 8         | 16            | 128                  | 8 / 6000 |
| Standard_F16    | 16        | 32            | 256                  | 8 / 12000|


## G-series
| Size            | CPU cores | Memory: GiB  | Temporary Storage (SSD): GiB       | Max NICs / Network bandwidth |
|---------------- | --------- | ------------ | -------------------- | ---------------------------- |
| Standard_G1     | 2         | 28           | 384                  |1 / high |
| Standard_G2     | 4         | 56           | 768                  |2 / high |
| Standard_G3     | 8         | 112          | 1,536                |4 / very high |
| Standard_G4     | 16        | 224          | 3,072                |8 / extremely high |
| Standard_G5     | 32        | 448          | 6,144                |8 / extremely high |

## H-series
Azure H-series virtual machines are the next generation high performance computing VMs aimed at high end computational needs, like molecular modeling, and computational fluid dynamics. These 8 and 16 core VMs are built on the Intel Haswell E5-2667 V3 processor technology featuring DDR4 memory and local SSD-based storage.

In addition to the substantial CPU power, the H-series offers diverse options for low latency RDMA networking using FDR InfiniBand and several memory configurations to support memory intensive computational requirements.

| Size            | CPU cores | Memory: GiB  | Temporary Storage (SSD): GiB       | Max NICs / Network bandwidth |
|---------------- | --------- | ------------ | -------------------- | ---------------------------- |
| Standard_H8     | 8         | 56           | 1000                 | 8 / high |
| Standard_H16    | 16        | 112          | 2000                 | 8 / very high |
| Standard_H8m    | 8         | 112          | 1000                 | 8 / high |
| Standard_H16m   | 16        | 224          | 2000                 | 8 / very high |
| Standard_H16r*  | 16        | 112          | 2000                 | 8 / very high |
| Standard_H16mr* | 16        | 224          | 2000                 | 8 / very high |

\*RDMA capable

## Configure sizes for Cloud Services
You can specify the Virtual Machine size of a role instance as part of the service model described by the [service definition file](cloud-services-model-and-package.md#csdef). The size of the role determines the number of CPU cores, the memory capacity, and the local file system size that is allocated to a running instance. Choose the role size based on your application's resource requirement.

Here is an example for setting the role size to be Standard_D2 for a Web Role instance:

```xml
<WorkerRole name="Worker1" vmsize="Standard_D2">
...
</WorkerRole>
```

## Changing the size of an existing role

As the nature of your workload changes or new VM sizes become available, you may want to change the size of your role. To do so, you must change the VM size in your service definition file (as shown above), repackage your Cloud Service, and deploy it.

>[!TIP]
> You may want to use different VM sizes for your role in different environments (eg. test vs production). One way to do this is to create multiple service definition (.csdef) files in your project, then create different cloud service packages per environment during your automated build using the CSPack tool. To learn more about the elements of a cloud services package and how to create them, see [What is the cloud services model and how do I package it?](cloud-services-model-and-package.md)
>
>

## Get a list of sizes
You can use PowerShell or the REST API to get a list of sizes. The REST API is documented [here](/previous-versions/azure/reference/dn469422(v=azure.100)). The following code is a PowerShell command that will list all the sizes available for Cloud Services. 

```powershell
Get-AzureRoleSize | where SupportedByWebWorkerRoles -eq $true | select InstanceSize, RoleSizeLabel
```

## Next steps
* Learn about [azure subscription and service limits, quotas, and constraints](../azure-subscription-service-limits.md).
* Learn more [about high performance compute VM sizes](../virtual-machines/windows/sizes-hpc.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) for HPC workloads.
