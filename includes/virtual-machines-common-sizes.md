



| Type                                 | Series | Best for....                                                                                                                                   | ACU        |
|--------------------------------------|--------|------------------------------------------------------------------------------------------------------------------------------------------------|------------|
| [Economy](virtual-machines-windows-sizes-economy.md) | A0-7   | Development workloads, build servers, code repositories, low-traffic websites, micro services, early product experiments, and small databases. | 50-100     |
| [General-purpose](virtual-machines-windows-sizes-general.md) | D      | Applications that demand faster CPUs, better local disk performance, or higher memories. | 160        |
|                                      | Dv2    | Applications that demand more powerful CPUs, which are about 35% faster than D-series.                                                         | 210 - 250* |
| General-purpose with premium storage | DS     | Applications with similar demands to the D-series but require premium storage.                                                                 | 160        |
|                                      | DSv2   | Optimized for premium storage.                                                                                                                 | 210 - 250* |
| [High Performance Compute](virtual-machines-windows-sizes-hpc.md) | A8-11  | Compute-intensive workloads like HPC.                                                                                                          | 225*       |
|                                      | H      | Financial risk modeling, seismic and reservoir simulation, molecular modeling, and genomic research.                                           | TBD        |
| [Compute optimized](virtual-machines-windows-sizes-compute.md)                    | F      | Higher CPU to memory ratio. Good for web servers, network appliances, batch process and application servers.                                   | 210 - 250* |
|                                      | Fs     | The power of the F-series and premium storage.                                                                                                 | 210 - 250* |
| [GPU optimized](virtual-machines-windows-sizes-gpu.md)                                 | N      | NV sizes are ideal for remote visualization, streaming, gaming, encoding and VDI scenarios.                                                    | xxx-xxx*   |
|                                      |        | NC sizes are ideal for compute intensive and network intensive applications, algorithms, and simulations.                                      | xxx-xxx*   |
| [Memory optimized](virtual-machines-windows-sizes-memory.md)                    | G      | high disk throughput and IO. Workloads like Big Data, MPP, SQL and NO-SQL databases.                                                           | 180-240*   |
| Memory optimized with premium storage | GS     | Premium storage option for G-series.                                                                                                           | 180 - 240* |





--------------------------

There are multiple standard sizes to choose from on Azure. Considerations for some of these sizes include:

* D-series VMs are designed to run applications that demand higher compute power and temporary disk performance. D-series VMs provide faster processors, a higher memory-to-core ratio, and a solid-state drive (SSD) for the temporary disk. For details, see the announcement on the Azure blog, [New D-Series Virtual Machine Sizes](https://azure.microsoft.com/blog/2014/09/22/new-d-series-virtual-machine-sizes/).
* Dv2-series, a follow-on to the original D-series, features a more powerful CPU. The Dv2-series CPU is about 35% faster than the D-series CPU. It is based on the latest generation 2.4 GHz Intel Xeon® E5-2673 v3 (Haswell) processor, and with the Intel Turbo Boost Technology 2.0, can go up to 3.1 GHz. The Dv2-series has the same memory and disk configurations as the D-series.
* F-series is based on the 2.4 GHz Intel Xeon® E5-2673 v3 (Haswell) processor, which can achieve clock speeds as high as 3.1 GHz with the Intel Turbo Boost Technology 2.0. This is the same CPU performance as the Dv2-series of VMs.  At a lower per-hour list price, the F-series is the best value in price-performance in the Azure portfolio based on the Azure Compute Unit (ACU) per core. 
  
    The F-series also introduces a new standard in VM size naming for Azure. For this series and VM sizes released in the future, the numeric value after the family name letter will match the number of CPU cores. Additional capabilities, such as optimized for premium storage, will be designated by letters following the numeric CPU core count. This naming format will be used for future VM sizes released but will not retroactively change the names of any existing VM sizes which have been released.
* G-series VMs offer the most memory and run on hosts that have Intel Xeon E5 V3 family processors.
* DS-series, DSv2-series, Fs-series and GS-series VMs can use Premium Storage, which provides high-performance, low-latency storage for I/O intensive workloads. These VMs use solid-state drives (SSDs) to host a virtual machine’s disks and also provide a local SSD disk cache. Premium Storage is available in certain regions. For details, see [Premium Storage: High-performance storage for Azure virtual machine workloads](../articles/storage/storage-premium-storage.md).
*   The A-series and Av2-series VMs can be deployed on a variety of hardware types and processors. The size is throttled, based upon the hardware, to offer consistent processor performance for the running instance, regardless of the hardware it is deployed on. To determine the physical hardware on which this size is deployed, query the virtual hardware from within the Virtual Machine.
* The A0 size is over-subscribed on the physical hardware. For this specific size only, other customer deployments may impact the performance of your running workload. The relative performance is outlined below as the expected baseline, subject to an approximate variability of 15 percent.

The size of the virtual machine affects the pricing. The size also affects the processing, memory, and storage capacity of the virtual machine. Storage costs are calculated separately based on used pages in the storage account. For details, see [Virtual Machines Pricing Details](https://azure.microsoft.com/pricing/details/virtual-machines/) and [Azure Storage Pricing](https://azure.microsoft.com/pricing/details/storage/). 

The following considerations might help you decide on a size:

* The A8-A11 and H-series sizes are also known as *compute-intensive instances*. The hardware that runs these sizes is designed and optimized for compute-intensive and network-intensive applications, including high-performance computing (HPC) cluster applications, modeling, and simulations. The A8-A11 series uses Intel Xeon E5-2670 @ 2.6 GHZ and the H-series uses Intel Xeon E5-2667 v3 @ 3.2 GHz. For detailed information and considerations about using these sizes, see [About the H-series and compute-intensive A-series VMs](../articles/virtual-machines/virtual-machines-windows-a8-a9-a10-a11-specs.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json). 
* Dv2-series, D-series, G-series, and the DS/GS counterparts  are ideal for applications that demand faster CPUs, better local disk performance, or have higher memory demands.  They offer a powerful combination for many enterprise-grade applications.
* The F-series VMs are an excellent choice for workloads that demand faster CPUs but do not need as much memory or local SSD per CPU core.  Workloads such as analytics, gaming servers, web servers, and batch processing will benefit from the value of the F-series.
* Some of the physical hosts in Azure data centers may not support larger virtual machine sizes, such as A5 – A11. As a result, you may see the error message **Failed to configure virtual machine <machine name>** or **Failed to create virtual machine <machine name>** when resizing an existing virtual machine to a new size; creating a new virtual machine in a virtual network created before April 16, 2013; or adding a new virtual machine to an existing cloud service. See  [Error: “Failed to configure virtual machine”](https://social.msdn.microsoft.com/Forums/9693f56c-fcd3-4d42-850e-5e3b56c7d6be/error-failed-to-configure-virtual-machine-with-a5-a6-or-a7-vm-size?forum=WAVirtualMachinesforWindows) on the support forum for workarounds for each deployment scenario.  
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
| [Standard_A1-8v2](#av2-series) |100 |
| [Standard_A2m-8mv2](#av2-series) |100 |
| [A8-A11](#a-series) |225* |
| [D1-14](#d-series) |160 |
| [D1-15v2](#dv2-series) |210 - 250* |
| [DS1-14](#ds-series) |160 |
| [DS1-15v2](#dsv2-series) |210-250* |
| [F1-F16](#f-series) |210-250* |
| [F1s-F16s](#fs-series) |210-250* |
| [G1-5](#g-series) |180 - 240* |
| [GS1-5](#gs-series) |180 - 240* |
| [H](#h-series) |290 - 300* |

ACUs marked with a * use Intel® Turbo technology to increase CPU frequency and provide a performance boost.  The amount of the boost can vary based on the VM size, workload, and other workloads running on the same host.

## Size tables
The following tables show the sizes and the capacities they provide.

* Storage capacity is shown in units of GiB or 1024^3 bytes. When comparing disks measured in GB (1000^3 bytes) to disks measured in GiB (1024^3) remember that capacity numbers given in GiB may appear smaller. For example, 1023 GiB = 1098.4 GB
* Disk throughput is measured in input/output operations per second (IOPS) and MBps where MBps = 10^6 bytes/sec.
* Data disks can operate in cached or uncached modes.  For cached data disk operation, the host cache mode is set to **ReadOnly** or **ReadWrite**.  For uncached data disk operation, the host cache mode is set to **None**.
* Maximum network bandwidth is the maximum aggregated bandwidth allocated and assigned per VM type. The maximum bandwidth provides guidance for selecting the right VM type to ensure adequate network capacity is available. When moving between Low, Moderate, High and Very High, the throughput will increase accordingly. Actual network performance will depend on many factors including network and application loads, and application network settings.


<br>















## Next steps
* Learn about [azure subscription and service limits, quotas, and constraints](../articles/azure-subscription-service-limits.md).
* Learn more [about the H-series and compute-intensive A-series VMs](../articles/virtual-machines/virtual-machines-windows-a8-a9-a10-a11-specs.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) for workloads like High-performance Computing (HPC).

