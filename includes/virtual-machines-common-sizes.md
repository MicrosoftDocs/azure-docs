
To see general limits on Azure VMs, see [Azure subscription and service limits, quotas, and constraints](../articles/azure-subscription-service-limits.md).

The standard sizes consist of several series: A, D, DS, F, Fs, G, and GS. Considerations for some of these sizes include:

*   D-series VMs are designed to run applications that demand higher compute power and temporary disk performance. D-series VMs provide faster processors, a higher memory-to-core ratio, and a solid-state drive (SSD) for the temporary disk. For details, see the announcement on the Azure blog, [New D-Series Virtual Machine Sizes](https://azure.microsoft.com/blog/2014/09/22/new-d-series-virtual-machine-sizes/).

*   Dv2-series, a follow-on to the original D-series, features a more powerful CPU. The Dv2-series CPU is about 35% faster than the D-series CPU. It is based on the latest generation 2.4 GHz Intel Xeon® E5-2673 v3 (Haswell) processor, and with the Intel Turbo Boost Technology 2.0, can go up to 3.1 GHz. The Dv2-series has the same memory and disk configurations as the D-series.

* F-series is based on the 2.4 GHz Intel Xeon® E5-2673 v3 (Haswell) processor, which can achieve clock speeds as high as 3.1 GHz with the Intel Turbo Boost Technology 2.0. This is the same CPU performance as the Dv2-series of VMs.  At a lower per-hour list price, the F-series is the best value in price-performance in the Azure portfolio based on the Azure Compute Unit (ACU) per core. 

	The F-series also introduces a new standard in VM size naming for Azure. For this series and VM sizes released in the future, the numeric value after the family name letter will match the number of CPU cores. Additional capabilities, such as optimized for premium storage, will be designated by letters following the numeric CPU core count. This naming format will be used for future VM sizes released but will not retroactively change the names of any existing VM sizes which have been released.


*   G-series VMs offer the most memory and run on hosts that have Intel Xeon E5 V3 family processors.


*   DS-series, DSv2-series, Fs-series and GS-series VMs can use Premium Storage, which provides high-performance, low-latency storage for I/O intensive workloads. These VMs use solid-state drives (SSDs) to host a virtual machine’s disks and also provide a local SSD disk cache. Premium Storage is available in certain regions. For details, see [Premium Storage: High-performance storage for Azure virtual machine workloads](../articles/storage/storage-premium-storage.md).


*   The A-series VMs can be deployed on a variety of hardware types and processors. The size is throttled, based upon the hardware, to offer consistent processor performance for the running instance, regardless of the hardware it is deployed on. To determine the physical hardware on which this size is deployed, query the virtual hardware from within the Virtual Machine.

*   The A0 size is over-subscribed on the physical hardware. For this specific size only, other customer deployments may impact the performance of your running workload. The relative performance is outlined below as the expected baseline, subject to an approximate variability of 15 percent.


The size of the virtual machine affects the pricing. The size also affects the processing, memory, and storage capacity of the virtual machine. Storage costs are calculated separately based on used pages in the storage account. For details, see [Virtual Machines Pricing Details](https://azure.microsoft.com/pricing/details/virtual-machines/) and [Azure Storage Pricing](https://azure.microsoft.com/pricing/details/storage/). 


The following considerations might help you decide on a size:


* The A8-A11 sizes are also known as *compute-intensive instances*. The hardware that runs these sizes is designed and optimized for compute-intensive and network-intensive applications, including high-performance computing (HPC) cluster applications, modeling, and simulations. For detailed information and considerations about using these sizes, see [About the A8, A9, A10, and A11 compute intensive instances](../articles/virtual-machines/virtual-machines-windows-a8-a9-a10-a11-specs.md).


*	Dv2-series, D-series, G-series, and the DS/GS counterparts  are ideal for applications that demand faster CPUs, better local disk performance, or have higher memory demands.  They offer a powerful combination for many enterprise-grade applications.

* The F-series VMs are an excellent choice for workloads that demand faster CPUs but do not need as much memory or local SSD per CPU core.  Workloads such as analytics, gaming servers, web servers, and batch processing will benefit from the value of the F-series.

*   Some of the physical hosts in Azure data centers may not support larger virtual machine sizes, such as A5 – A11. As a result, you may see the error message **Failed to configure virtual machine <machine name>** or **Failed to create virtual machine <machine name>** when resizing an existing virtual machine to a new size; creating a new virtual machine in a virtual network created before April 16, 2013; or adding a new virtual machine to an existing cloud service. See  [Error: “Failed to configure virtual machine”](https://social.msdn.microsoft.com/Forums/9693f56c-fcd3-4d42-850e-5e3b56c7d6be/error-failed-to-configure-virtual-machine-with-a5-a6-or-a7-vm-size?forum=WAVirtualMachinesforWindows) on the support forum for workarounds for each deployment scenario.  


## Performance considerations

We have created the concept of the Azure Compute Unit (ACU) to provide a way of comparing compute (CPU) performance across Azure SKUs. This will help you easily identify which SKU is most likely to satisfy your performance needs.  ACU is currently standardized on a Small (Standard_A1) VM being 100 and all other SKUs then represent approximately how much faster that SKU can run a standard benchmark. 

>[AZURE.IMPORTANT] The ACU is only a guideline.  The results for your workload may vary. 

<br>

|SKU Family	|ACU/Core |
|---|---|
|[Standard_A0](#a-series)	|50 |
|[Standard_A1-4](#a-series)	|100 |
|[Standard_A5-7](#a-series)	|100 |
|[A8-A11](#a-series)	|225*|
|[D1-14](#d-series)	|160 |
|[D1-15v2](#dv2-series)	|210 - 250*|
|[DS1-14](#ds-series)	|160 |
|[DS1-15v2](#dsv2-series)	|210-250* |
|[F1-F16](#f-series) | 210-250*|
|[F1s-F16s](#fs-series) | 210-250*|
|[G1-5](#g-series)	|180 - 240*|
|[GS1-5](#gs-series)	|180 - 240*|


ACUs marked with a * use Intel® Turbo technology to increase CPU frequency and provide a performance boost.  The amount of the boost can vary based on the VM size, workload, and other workloads running on the same host.

## Size tables

The following tables show the sizes and the capacities they provide.

* Storage capacity is represented by using 1024^3 bytes as the unit of measurement for GB. This is sometimes referred to as gibibyte, or base 2 definition. When comparing sizes that use different base systems, remember that base 2 sizes may appear smaller than base 10 but for any specific size (such as 1 GB) a base 2 system provides more capacity than a base 10 system, because 1024^3 is greater than 1000^3.

* Maximum network bandwidth is the maximum aggregated bandwidth allocated and assigned per VM type. The maximum bandwidth provides guidance for selecting the right VM type to ensure adequate network capacity is available. When moving between Low, Moderate, High and Very High, the throughput will increase accordingly. Actual network performance will depend on many factors including network and application loads, and application network settings.


## A-series

|Size |CPU cores|Memory|NICs (Max)|Max. disk size|Max. data disks (1023 GB each)|Max. IOPS (500 per disk)| Max network bandwidth |
|---|---|---|---|---|---|---|---|
|Standard_A0 |1|768 MB|1| Temporary = 20 GB |1|1x500| low |
|Standard_A1 |1|1.75 GB|1|Temporary = 70 GB |2|2x500| moderate |
|Standard_A2 |2|3.5 GB|1|Temporary = 135 GB |4|4x500| moderate |
|Standard_A3 |4|7 GB|2|Temporary = 285 GB |8|8x500| high |
|Standard_A4 |8|14 GB|4|Temporary = 605 GB |16|16x500| high |
|Standard_A5 |2|14 GB|1|Temporary = 135 GB |4|4X500| moderate |
|Standard_A6 |4|28 GB|2|Temporary = 285 GB |8|8x500| high |
|Standard_A7 |8|56 GB|4|Temporary = 605 GB |16|16x500| high |



## A-series - compute-intensive instances

For information and considerations about using these sizes, see [About the A8, A9, A10, and A11 compute intensive instances](../articles/virtual-machines/virtual-machines-windows-a8-a9-a10-a11-specs.md).

|Size |CPU cores|Memory|NICs (Max)|Max. disk size|Max. data disks (1023 GB each)|Max. IOPS (500 per disk)| Max network bandwidth |
|---|---|---|---|---|---|---|---|
|Standard_A8|8|56 GB|2| Temporary = 382 GB  |16|16x500| high |
|Standard_A9|16|112 GB|4| Temporary = 382 GB  |16|16x500| very high |
|Standard_A10|8|56 GB|2| Temporary = 382 GB  |16|16x500| high |
|Standard_A11|16|112 GB|4| Temporary = 382 GB  |16|16x500| very high |

## D-series

|Size |CPU cores|Memory|NICs (Max)|Max. disk size|Max. data disks (1023 GB each)|Max. IOPS (500 per disk)| Max network bandwidth |
|---|---|---|---|---|---|---|---|
|Standard_D1 |1|3.5 GB|1|Temporary (SSD) =50 GB |2|2x500| moderate |
|Standard_D2 |2|7 GB|2|Temporary (SSD) =100 GB |4|4x500| high |
|Standard_D3 |4|14 GB|4|Temporary (SSD) =200 GB |8|8x500| high |
|Standard_D4 |8|28 GB|8|Temporary (SSD) =400 GB |16|16x500| high |
|Standard_D11 |2|14 GB|2|Temporary (SSD) =100 GB |4|4x500| high |
|Standard_D12 |4|28 GB|4|Temporary (SSD) =200 GB |8|8x500| high |
|Standard_D13 |8|56 GB|8|Temporary (SSD) =400 GB |16|16x500| high |
|Standard_D14 |16|112 GB|8|Temporary (SSD) =800 GB |32|32x500| very high |


## Dv2-series

|Size |CPU cores|Memory|NICs (Max)|Max. disk size|Max. data disks (1023 GB each)|Max. IOPS (500 per disk)| Max network bandwidth |
|---|---|---|---|---|---|---|---|
|Standard_D1_v2 |1|3.5 GB|1|Temporary (SSD) =50 GB |2|2x500| moderate |
|Standard_D2_v2 |2|7 GB|2|Temporary (SSD) =100 GB |4|4x500| high |
|Standard_D3_v2 |4|14 GB|4|Temporary (SSD) =200 GB |8|8x500| high |
|Standard_D4_v2 |8|28 GB|8|Temporary (SSD) =400 GB |16|16x500| high |
|Standard_D5_v2 |16|56 GB|8|Temporary (SSD) =800 GB |32|32x500| extremely high |
|Standard_D11_v2 |2|14 GB|2|Temporary (SSD) =100 GB |4|4x500| high |
|Standard_D12_v2 |4|28 GB|4|Temporary (SSD) =200 GB |8|8x500| high |
|Standard_D13_v2 |8|56 GB|8|Temporary (SSD) =400 GB |16|16x500| high |
|Standard_D14_v2 |16|112 GB|8|Temporary (SSD) =800 GB |32|32x500| extremely high |
|Standard_D15_v2 |20|140 GB|8|Temporary (SSD) =1 TB |40|40x500| extremely high |


## DS-series*

|Size |CPU cores|Memory|NICs (Max)|Max. disk size|Max. data disks (1023 GB each)|Cache size (GB)|Max. disk IOPS &amp; bandwidth| Max network bandwidth |
|---|---|---|---|---|---|---|---|---|
|Standard_DS1 |1|3.5|1|Local SSD disk = 7 GB |2|43| 3,200  32 MB per second | moderate |
|Standard_DS2 |2|7|2|Local SSD disk = 14 GB |4|86| 6,400  64 MB per second | high |
|Standard_DS3 |4|14|4|Local SSD disk = 28 GB |8|172| 12,800  128 MB per second | high |
|Standard_DS4 |8|28|8|Local SSD disk = 56 GB |16|344| 25,600  256 MB per second | high |
|Standard_DS11 |2|14|2|Local SSD disk = 28 GB |4|72| 6,400  64 MB per second | high |
|Standard_DS12 |4|28|4|Local SSD disk = 56 GB |8|144| 12,800  128 MB per second | high |
|Standard_DS13 |8|56|8|Local SSD disk = 112 GB |16|288| 25,600  256 MB per second | high |
|Standard_DS14 |16|112|8|Local SSD disk = 224 GB |32|576| 51,200  512 MB per second | very high |

*The maximum input/output operations per second (IOPS) and throughput (bandwidth) possible with a DS series VM is affected by the size of the disk. For details, see [Premium Storage: High-performance storage for Azure virtual machine workloads](../articles/storage/storage-premium-storage.md).


## DSv2-series*

|Size |CPU cores|Memory|NICs (Max)|Max. disk size|Max. data disks (1023 GB each)|Cache size (GB)|Max. disk IOPS &amp; bandwidth| Max network bandwidth |
|---|---|---|---|---|---|---|---|---|
|Standard_DS1_v2 |1|3.5|1|Local SSD disk = 7 GB |2|43| 3,200  48 MB per second | moderate |
|Standard_DS2_v2 |2|7|2|Local SSD disk = 14 GB |4|86| 6,400  96 MB per second | high |
|Standard_DS3_v2 |4|14|4|Local SSD disk = 28 GB |8|172| 12,800  192 MB per second | high |
|Standard_DS4_v2 |8|28|8|Local SSD disk = 56 GB |16|344| 25,600  384 MB per second | high |
|Standard_DS5_v2 |16|56|8|Local SSD disk = 112 GB |32|688| 51,200  768 MB per second | extremely high |
|Standard_DS11_v2 |2|14|2|Local SSD disk = 28 GB |4|72| 6,400  96 MB per second | high |
|Standard_DS12_v2 |4|28|4|Local SSD disk = 56 GB |8|144| 12,800  192 MB per second | high |
|Standard_DS13_v2 |8|56|8|Local SSD disk = 112 GB |16|288| 25,600  384 MB per second | high |
|Standard_DS14_v2 |16|112|8|Local SSD disk = 224 GB |32|576| 51,200  768 MB per second | extremely high |
|Standard_DS15_v2 |20|140 GB|8|Local SSD disk = 280 GB |40| 720|64,000 960 MB per second | extremely high |


*The maximum input/output operations per second (IOPS) and throughput (bandwidth) possible with a DS series VM is affected by the size of the disk. For details, see [Premium Storage: High-performance storage for Azure virtual machine workloads](../articles/storage/storage-premium-storage.md).


## F-series


| Size         | CPU cores | Memory | NICs (Max) | Disk size          | Max data disks (1023 GB each) | Max IOPS (500 per disk) | Max network bandwidth |
|--------------|-----------|--------|------------|-------------------------|--------------------------|--------------------------|-------------|
| Standard_F1  | 1         | 2 GB   | 1          | Temporary (SSD) =16 GB  | 2                        | 2x500                    | moderate    |
| Standard_F2  | 2         | 4 GB   | 2          | Temporary (SSD) =32 GB  | 4                        | 4x500                    | high        |
| Standard_F4  | 4         | 8 GB   | 4          | Temporary (SSD) =64 GB  | 8                        | 8x500                    | high        |
| Standard_F8  | 8         | 16 GB  | 8          | Temporary (SSD) =128 GB | 16                       | 16x500                   | high        |
| Standard_F16 | 16        | 32 GB  | 8          | Temporary (SSD) =256 GB | 32                       | 32x500                   | extremely high   |



## Fs-series*

| Size          | CPU cores | Memory | NICs (Max) | Disk size         | Max data disks (1023 GB each) | Cache size (GB) | Max disk IOPS & bandwidth | Max network bandwidth |
|---------------|-----------|--------|------------|------------------------|-----------|-----------|----------------------------|------------|
| Standard_F1s  | 1         | 2      | 1          | Local SSD disk = 4 GB  | 2         | 12        | 3,200 48 MB per second     | moderate   |
| Standard_F2s  | 2         | 4      | 2          | Local SSD disk = 8 GB  | 4         | 24        | 6,400 96 MB per second     | high       |
| Standard_F4s  | 4         | 8      | 4          | Local SSD disk = 16 GB | 8         | 48        | 12,800 192 MB per second   | high       |
| Standard_F8s  | 8         | 16     | 8          | Local SSD disk = 32 GB | 16        | 96        | 25,600 384 MB per second   | high       |
| Standard_F16s | 16        | 32     | 8          | Local SSD disk = 64 GB | 32        | 192       | 51,200 768 MB per second   | extremely high  |



*The maximum input/output operations per second (IOPS) and throughput (bandwidth) possible with a Fs series VM is affected by the size of the disk. For details, see [Premium Storage: High-performance storage for Azure virtual machine workloads](../articles/storage/storage-premium-storage.md).





## G-series

|Size |CPU cores|Memory|NICs (Max)|Max. disk size|Max. data disks (1023 GB each)|Max. IOPS (500 per disk)| Max network bandwidth |
|---|---|---|---|---|---|---|---|
|Standard_G1 |2|28 GB|1|Local SSD disk = 384 GB |4|4 x 500| high |
|Standard_G2 |4|56 GB|2|Local SSD disk = 768 GB |8|8 x 500| high |
|Standard_G3 |8|112 GB|4|Local SSD disk = 1,536 GB |16|16 x 500| very high | 
|Standard_G4 |16|224 GB|8|Local SSD disk = 3,072 GB |32|32 x 500| extremely high |
|Standard_G5 |32|448 GB|8|Local SSD disk = 6,144 GB |64| 64 x 500 | extremely high |




## GS-series

|Size |CPU cores|Memory|NICs (Max)|Max. disk size|Max. data disks (1023 GB each)|Cache size (GB)|Max. disk IOPS &amp; bandwidth| Max network bandwidth |
|---|---|---|---|---|---|---|---|---|
|Standard_GS1|2|28|1|Local SSD disk = 56 GB |4|264| 5,000  125 MB per second | high |
|Standard_GS2|4|56|2|Local SSD disk = 112 GB |8|528| 10,000  250 MB per second | high | 
|Standard_GS3|8|112|4|Local SSD disk = 224 GB |16|1056| 20,000  500 MB per second | very high |
|Standard_GS4|16|224|8|Local SSD disk = 448 GB |32|2112| 40,000  1,000 MB per second | extremely high |
|Standard_GS5|32|448|8|Local SSD disk = 896 GB |64|4224| 80,000  2,000 MB per second | extremely high |

## N-series

The NC and NV sizes are also known as GPU-enabled instances. These are specialized virtual machines that include NVIDIA's GPU cards, optimized for different scenarios and use cases. The NV sizes are optimized and designed for remote visualization, streaming, gaming, encoding and VDI scenarios utilizing frameworks such as OpenGL and DirectX. The NC sizes are more optimized for compute intensive and network intensive applications, algorithms, including CUDA and OpenCL based applications and simulations. 


### NV instances
The NV instances are powered by NVIDIA’s Tesla M60 GPUs and NVIDIA GRID for desktop accelerated applications and virtual desktops where customers will be able to visualize their data or simulations. Users will be able to visualize their graphics intensive workflows on the NV instances to get superior graphics capability and additionally run single precision workloads such as encoding and rendering. The Tesla M60 delivers 4096 CUDA cores in a dual-GPU design with up to 36 streams of 1080p H.264.


| Size | Cores | GPU            | Memory | Disk        |
|------|-------|----------------|--------|-------------|
| NV6  | 6     | 1 x NVIDIA M60 | 56 GB  | 380 GB SSD  |
| NV12 | 12    | 2 x NVIDIA M60 | 112 GB | 680 GB SSD  |
| NV24 | 24    | 4 x NVIDIA M60 | 224 GB | 1440 GB SSD | 



### NC instances

The NC instances are powered by NVIDIA’s Tesla K80. Users can now crunch through data much faster by leveraging CUDA for energy exploration applications, crash simulations, ray traced rendering, deep learning and more. The Tesla K80 delivers 4992 CUDA cores with a dual-GPU design, up to 2.91 Teraflops of double-precision and up to 8.93 Teraflops of single-precision performance. 


| Size | Cores | GPU            | Memory | Disk        |
|------|-------|----------------|--------|-------------|
| NC6  | 6     | 1 x NVIDIA K80 | 56 GB  | 380 GB SSD  |
| NC12 | 12    | 2 x NVIDIA K80 | 112 GB | 680 GB SSD  |
| NC24 | 24    | 4 x NVIDIA K80 | 224 GB | 1440 GB SSD |

## Notes: Standard A0 - A4 using CLI and PowerShell 


In the classic deployment model, some VM size names are slightly different in CLI and PowerShell:

* Standard_A0 is ExtraSmall 
* Standard_A1 is Small
* Standard_A2 is Medium
* Standard_A3 is Large
* Standard_A4 is ExtraLarge


## Next steps

- Learn about [azure subscription and service limits, quotas, and constraints](../articles/azure-subscription-service-limits.md).
- Learn more [about the A8, A9, A10, and A11 compute intensive instances](../articles/virtual-machines/virtual-machines-windows-a8-a9-a10-a11-specs.md) for workloads like High-performance Computing (HPC).



