---
title: Sizes for cloud services | Microsoft Docs
description: Lists the different virtual machine sizes (and IDs) for Azure cloud service web and worker roles.
services: cloud-services
documentationcenter: ''
author: Thraka
manager: timlt
editor: ''

ms.assetid: 1127c23e-106a-47c1-a2e9-40e6dda640f6
ms.service: cloud-services
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: tbd
ms.date: 10/27/2016
ms.author: adegeo

---
# Sizes for Cloud Services
This topic describes the available sizes and options for Cloud Service role instances (web roles and worker roles). It also provides deployment considerations to be aware of when planning to use these resources. Each size has an ID that you will put in your [service definition file](cloud-services-model-and-package.md#csdef).

Cloud Services is one of several types of compute resources offered by Azure. Click [here](cloud-services-choose-me.md) for more information about Cloud Services.

> [!NOTE]
> To see related Azure limits, see [Azure Subscription and Service Limits, Quotas, and Constraints](../azure-subscription-service-limits.md)
> 
> 

## Sizes for web and worker role instances
There are multiple standard sizes to choose from on Azure. Considerations for some of these sizes include:

* D-series VMs are designed to run applications that demand higher compute power and temporary disk performance. D-series VMs provide faster processors, a higher memory-to-core ratio, and a solid-state drive (SSD) for the temporary disk. For details, see the announcement on the Azure blog, [New D-Series Virtual Machine Sizes](https://azure.microsoft.com/blog/2014/09/22/new-d-series-virtual-machine-sizes/).
* Dv2-series, a follow-on to the original D-series, features a more powerful CPU. The Dv2-series CPU is about 35% faster than the D-series CPU. It is based on the latest generation 2.4 GHz Intel Xeon® E5-2673 v3 (Haswell) processor, and with the Intel Turbo Boost Technology 2.0, can go up to 3.1 GHz. The Dv2-series has the same memory and disk configurations as the D-series.
* G-series VMs offer the most memory and run on hosts that have Intel Xeon E5 V3 family processors.
* The A-series VMs can be deployed on a variety of hardware types and processors. The size is throttled, based upon the hardware, to offer consistent processor performance for the running instance, regardless of the hardware it is deployed on. To determine the physical hardware on which this size is deployed, query the virtual hardware from within the Virtual Machine.
* The A0 size is over-subscribed on the physical hardware. For this specific size only, other customer deployments may impact the performance of your running workload. The relative performance is outlined below as the expected baseline, subject to an approximate variability of 15 percent.

The size of the virtual machine affects the pricing. The size also affects the processing, memory, and storage capacity of the virtual machine. Storage costs are calculated separately based on used pages in the storage account. For details, see [Virtual Machines Pricing Details](https://azure.microsoft.com/pricing/details/virtual-machines/) and [Azure Storage Pricing](https://azure.microsoft.com/pricing/details/storage/). 

The following considerations might help you decide on a size:

* The A8-A11 and H-series sizes are also known as *compute-intensive instances*. The hardware that runs these sizes is designed and optimized for compute-intensive and network-intensive applications, including high-performance computing (HPC) cluster applications, modeling, and simulations. The A8-A11 series uses Intel Xeon E5-2670 @ 2.6 GHZ and the H-series uses Intel Xeon E5-2667 v3 @ 3.2 GHz. For detailed information and considerations about using these sizes, see [About the H-series and compute-intensive A-series VMs](../virtual-machines/virtual-machines-windows-a8-a9-a10-a11-specs.md). 
* Dv2-series, D-series, G-series, are ideal for applications that demand faster CPUs, better local disk performance, or have higher memory demands.  They offer a powerful combination for many enterprise-grade applications.
* Some of the physical hosts in Azure data centers may not support larger virtual machine sizes, such as A5 – A11. As a result, you may see the error message **Failed to configure virtual machine {machine name}** or **Failed to create virtual machine {machine name}** when resizing an existing virtual machine to a new size; creating a new virtual machine in a virtual network created before April 16, 2013; or adding a new virtual machine to an existing cloud service. See  [Error: “Failed to configure virtual machine”](https://social.msdn.microsoft.com/Forums/9693f56c-fcd3-4d42-850e-5e3b56c7d6be/error-failed-to-configure-virtual-machine-with-a5-a6-or-a7-vm-size?forum=WAVirtualMachinesforWindows) on the support forum for workarounds for each deployment scenario.  
* Your subscription might also limit the number of cores you can deploy in certain size families. To increase a quota, contact Azure Support.

## Performance considerations
We have created the concept of the Azure Compute Unit (ACU) to provide a way of comparing compute (CPU) performance across Azure SKUs. This will help you easily identify which SKU is most likely to satisfy your performance needs.  ACU is currently standardized on a Small (Standard_A1) VM being 100 and all other SKUs then represent approximately how much faster that SKU can run a standard benchmark. 

> [!IMPORTANT]
> The ACU is only a guideline.  The results for your workload may vary. 
> 
> 

<br>

| SKU Family | ACU/Core |
| --- | --- |
| [Standard_A0](#a-series) |50 |
| [Standard_A1-4](#a-series) |100 |
| [Standard_A5-7](#a-series) |100 |
| [A8-A11](#a-series) |225* |
| [D1-14](#d-series) |160 |
| [D1-15v2](#dv2-series) |210 - 250* |
| [G1-5](#g-series) |180 - 240* |
| [H](#h-series) |290 - 300* |

ACUs marked with a * use Intel® Turbo technology to increase CPU frequency and provide a performance boost.  The amount of the boost can vary based on the VM size, workload, and other workloads running on the same host.

## Size tables
The following tables show the sizes and the capacities they provide.

* Storage capacity is shown in units of GiB or 1024^3 bytes. When comparing disks measured in GB (1000^3 bytes) to disks measured in GiB (1024^3) remember that capacity numbers given in GiB may appear smaller. For example, 1023 GiB = 1098.4 GB
* Disk throughput is measured in input/output operations per second (IOPS) and MBps where MBps = 10^6 bytes/sec.
* Data disks can operate in cached or uncached modes. For cached data disk operation, the host cache mode is set to **ReadOnly** or **ReadWrite**.  For uncached data disk operation, the host cache mode is set to **None**.
* Maximum network bandwidth is the maximum aggregated bandwidth allocated and assigned per VM type. The maximum bandwidth provides guidance for selecting the right VM type to ensure adequate network capacity is available. When moving between Low, Moderate, High and Very High, the throughput will increase accordingly. Actual network performance will depend on many factors including network and application loads, and application network settings.

## A-series
| Size | CPU cores | Memory: GiB | Local HDD: GiB | Max data disks | Max data disk throughput: IOPS | Max NICs / Network bandwidth |
| --- | --- | --- | --- | --- | --- | --- |
| Standard_A0 |1 |0.768 |20 |1 |1x500 |1 / low |
| Standard_A1 |1 |1.75 |70 |2 |2x500 |1 / moderate |
| Standard_A2 |2 |3.5 GB |135 |4 |4x500 |1 / moderate |
| Standard_A3 |4 |7 |285 |8 |8x500 |2 / high |
| Standard_A4 |8 |14 |605 |16 |16x500 |4 / high |
| Standard_A5 |2 |14 |135 |4 |4X500 |1 / moderate |
| Standard_A6 |4 |28 |285 |8 |8x500 |2 / high |
| Standard_A7 |8 |56 |605 |16 |16x500 |4 / high |

## A-series - compute-intensive instances
For information and considerations about using these sizes, see [About the H-series and compute-intensive A-series VMs](../virtual-machines/virtual-machines-windows-a8-a9-a10-a11-specs.md).

| Size | CPU cores | Memory: GiB | Local HDD: GiB | Max data disks | Max data disk throughput: IOPS | Max NICs / Network bandwidth |
| --- | --- | --- | --- | --- | --- | --- |
| Standard_A8* |8 |56 |382 |16 |16x500 |2 / high |
| Standard_A9* |16 |112 |382 |16 |16x500 |4 / very high |
| Standard_A10 |8 |56 |382 |16 |16x500 |2 / high |
| Standard_A11 |16 |112 |382 |16 |16x500 |4 / very high |

*RDMA capable

## D-series
| Size | CPU cores | Memory: GiB | Local SSD: GiB | Max data disks | Max data disk throughput: IOPS | Max NICs / Network bandwidth |
| --- | --- | --- | --- | --- | --- | --- |
| Standard_D1 |1 |3.5 |50 |2 |2x500 |1 / moderate |
| Standard_D2 |2 |7 |100 |4 |4x500 |2 / high |
| Standard_D3 |4 |14 |200 |8 |8x500 |4 / high |
| Standard_D4 |8 |28 |400 |16 |16x500 |8 / high |
| Standard_D11 |2 |14 |100 |4 |4x500 |2 / high |
| Standard_D12 |4 |28 |200 |8 |8x500 |4 / high |
| Standard_D13 |8 |56 |400 |16 |16x500 |8 / high |
| Standard_D14 |16 |112 |800 |32 |32x500 |8 / very high |

## Dv2-series
| Size | CPU cores | Memory: GiB | Local SSD: GiB | Max data disks | Max data disk throughput: IOPS | Max NICs / Network bandwidth |
| --- | --- | --- | --- | --- | --- | --- |
| Standard_D1_v2 |1 |3.5 |50 |2 |2x500 |1 / moderate |
| Standard_D2_v2 |2 |7 |100 |4 |4x500 |2 / high |
| Standard_D3_v2 |4 |14 |200 |8 |8x500 |4 / high |
| Standard_D4_v2 |8 |28 |400 |16 |16x500 |8 / high |
| Standard_D5_v2 |16 |56 |800 |32 |32x500 |8 / extremely high |
| Standard_D11_v2 |2 |14 |100 |4 |4x500 |2 / high |
| Standard_D12_v2 |4 |28 |200 |8 |8x500 |4 / high |
| Standard_D13_v2 |8 |56 |400 |16 |16x500 |8 / high |
| Standard_D14_v2 |16 |112 |800 |32 |32x500 |8 / extremely high |
| Standard_D15_v2 |20 |140 |1,000 |40 |40x500 |8 / extremely high |

## G-series
| Size | CPU cores | Memory: GiB | Local SSD: GiB | Max data disks | Max disk throughput: IOPS | Max NICs / Network bandwidth |
| --- | --- | --- | --- | --- | --- | --- |
| Standard_G1 |2 |28 |384 |4 |4 x 500 |1 / high |
| Standard_G2 |4 |56 |768 |8 |8 x 500 |2 / high |
| Standard_G3 |8 |112 |1,536 |16 |16 x 500 |4 / very high |
| Standard_G4 |16 |224 |3,072 |32 |32 x 500 |8 / extremely high |
| Standard_G5 |32 |448 |6,144 |64 |64 x 500 |8 / extremely high |

## H-series
Azure H-series virtual machines are the next generation high performance computing VMs aimed at high end computational needs, like molecular modeling, and computational fluid dynamics. These 8 and 16 core VMs are built on the Intel Haswell E5-2667 V3 processor technology featuring DDR4 memory and local SSD based storage. 

In addition to the substantial CPU power, the H-series offers diverse options for low latency RDMA networking using FDR InfiniBand and several memory configurations to support memory intensive computational requirements.

| Size | CPU cores | Memory: GiB | Local SSD: GiB | Max data disks | Max disk throughput: IOPS | Max NICs / Network bandwidth |
| --- | --- | --- | --- | --- | --- | --- |
| Standard_H8 |8 |56 |1000 |16 |16 x 500 |8 / high |
| Standard_H16 |16 |112 |2000 |32 |32 x 500 |8 / very high |
| Standard_H8m |8 |112 |1000 |16 |16 x 500 |8 / high |
| Standard_H16m |16 |224 |2000 |32 |32 x 500 |8 / very high |
| Standard_H16r* |16 |112 |2000 |32 |32 x 500 |8 / very high |
| Standard_H16mr* |16 |224 |2000 |32 |32 x 500 |8 / very high |

*RDMA capable

## Notes: Standard A0 - A4 using CLI and PowerShell
In the classic deployment model, some VM size names are slightly different in CLI and PowerShell:

* Standard_A0 is ExtraSmall 
* Standard_A1 is Small
* Standard_A2 is Medium
* Standard_A3 is Large
* Standard_A4 is ExtraLarge

## Configure sizes for Cloud Services
You can specify the Virtual Machine size of a role instance as part of the service model described by the [service definition file](cloud-services-model-and-package.md#csdef). The size of the role determines the number of CPU cores, the memory capacity, and the local file system size that is allocated to a running instance. Choose the role size based on your application's resource requirement.

Here is an example for setting the role size to be [Standard_D2](#general-purpose-d) for a Web Role instance:

```xml
<WorkerRole name="Worker1" vmsize="<mark>Standard_D2</mark>">
...
</WorkerRole>
```

## Next steps
* Learn about [azure subscription and service limits, quotas, and constraints](../azure-subscription-service-limits.md).
* Learn more [about the H-series and compute-intensive A-series VMs](../virtual-machines/virtual-machines-windows-a8-a9-a10-a11-specs.md) for workloads like High-performance Computing (HPC).

