---
 title: include file
 description: include file
 services: virtual-machines
 author: jonbeck7
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 05/16/2019
 ms.author: azcspmt;jonbeck;cynthn
 ms.custom: include file
---

Memory optimized VM sizes offer a high memory-to-CPU ratio that are great for relational database servers, medium to large caches, and in-memory analytics. This article provides information about the number of vCPUs, data disks and NICs as well as storage throughput and network bandwidth for each size in this grouping. 

* The Mv2-Series offers the highest vCPU count (up to 208 vCPUs) and largest memory (up to 5.7 TiB) of any VM in the cloud. It’s ideal for extremely large databases or other applications that benefit from high vCPU counts and large amounts of memory.
 
* The M-Series offers a high vCPU count (up to 128 vCPUs) and a large amount of memory (up to 3.8 TiB). It’s also ideal for extremely large databases or other applications that benefit from high vCPU counts and large amounts of memory.

* Dv2-series, G-series, and the DSv2/GS counterparts are ideal for applications that demand faster vCPUs, better temporary storage performance, or have higher memory demands. They offer a powerful combination for many enterprise-grade applications.

* Dv2-series, a follow-on to the original D-series, features a more powerful CPU. The Dv2-series CPU is about 35% faster than the D-series CPU. It is based on the latest generation 2.4 GHz Intel Xeon® E5-2673 v3 2.4 GHz (Haswell) or E5-2673 v4 2.3 GHz (Broadwell) processors, and with the Intel Turbo Boost Technology 2.0, can go up to 3.1 GHz. The Dv2-series has the same memory and disk configurations as the D-series.

* The Ev3-series features the E5-2673 v4 2.3 GHz  (Broadwell) processor in a hyper-threaded configuration, providing a better value proposition for most general purpose workloads, and bringing the Ev3 into alignment with the general purpose VMs of most other clouds.  Memory has been expanded (from 7 GiB/vCPU to 8 GiB/vCPU) while disk and network limits have been adjusted on a per core basis to align with the move to hyperthreading.  The Ev3 is the follow up to the high memory VM sizes of the D/Dv2 families.

* Azure Compute offers virtual machine sizes that are Isolated to a specific hardware type and dedicated to a single customer.  These virtual machine sizes are best suited for workloads that require a high degree of isolation from other customers for workloads involving elements like compliance and regulatory requirements.  Customers can also choose to further subdivide the resources of these Isolated virtual machines by using [Azure support for nested virtual machines](https://azure.microsoft.com/blog/nested-virtualization-in-azure/).  Please see the tables of virtual machine families below for your isolated VM options.

## Esv3-series 

ACU: 160-190 <sup>1</sup>

Premium Storage:  Supported

Premium Storage caching:  Supported

ESv3-series instances are based on the 2.3 GHz Intel XEON ® E5-2673 v4 (Broadwell) processor and can achieve 3.5GHz with Intel Turbo Boost Technology 2.0 and use premium storage. Ev3-series instances are ideal for memory-intensive enterprise applications.


| Size             | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max cached and temp storage throughput: IOPS / MBps (cache size in GiB) | Max uncached disk throughput: IOPS / MBps | Max NICs / Expected network bandwidth (Mbps) |
|------------------|--------|-------------|----------------|----------------|-----------------------------------------------------------------------|-------------------------------------------|------------------------------------------------|
| Standard_E2s_v3 | 2      | 16          | 32             | 4              | 4000 / 32 (50)                                                       | 3200 / 48                                | 2 / 1000                                   |
| Standard_E4s_v3&nbsp;<sup>2</sup> | 4      | 32          | 64             | 8              | 8000 / 64 (100)                                                      | 6400 / 96                                | 2 / 2000                                   |
| Standard_E8s_v3&nbsp;<sup>2</sup> | 8      | 64          | 128            | 16             | 16000 / 128 (200)                                                    | 12800 / 192                              | 4 / 4000                                       |
| Standard_E16s_v3&nbsp;<sup>2</sup> | 16     | 128         | 256            | 32             | 32000 / 256 (400)                                                    | 25600 / 384                              | 8 / 8000                                       |
| Standard_E20s_v3                   | 20     | 160         | 320            | 32             | 40000 / 320 (400)                                                    | 32000 / 480                              | 8 / 10000                                       |
| Standard_E32s_v3&nbsp;<sup>2</sup> | 32     | 256         | 512            | 32             | 64000 / 512 (800)                                                    | 51200 / 768                              | 8 / 16000                             |
| Standard_E48s_v3&nbsp;<sup>2</sup> | 48     | 384         | 768            | 32             | 96000/768 (1200)                                                   | 76800 / 1152                             | 8 / 24000                             |
| Standard_E64s_v3&nbsp;<sup>2</sup> | 64     | 432         | 864            | 32             | 128000 / 1024 (1600)                                                   | 80000 / 1200                             | 8 / 30000                             |
| Standard_E64is_v3&nbsp;<sup>3</sup> | 64     | 432         | 864            | 32             | 128000 / 1024 (1600)                                                   | 80000 / 1200                             | 8 / 30000                             |


<sup>1</sup> Esv3-series VM’s feature Intel® Hyper-Threading Technology.

<sup>2</sup> Constrained core sizes available.

<sup>3</sup> Instance is isolated to hardware dedicated to a single customer.


## Ev3-series 

ACU: 160 - 190 <sup>1</sup>

Premium Storage:  Not Supported

Premium Storage caching:  Not Supported

Ev3-series instances are based on the 2.3 GHz Intel XEON ® E5-2673 v4 (Broadwell) processor and can achieve 3.5GHz with Intel Turbo Boost Technology 2.0. Ev3-series instances are ideal for memory-intensive enterprise applications.

Data disk storage is billed separately from virtual machines. To use premium storage disks, use the ESv3 sizes. The pricing and billing meters for ESv3 sizes are the same as Ev3-series. 


| Size            | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max temp storage throughput: IOPS / Read MBps / Write MBps | Max NICs / Network bandwidth |
|-----------------|-----------|-------------|----------------|----------------|----------------------------------------------------------|------------------------------|
| Standard_E2_v3  | 2         | 16          | 50             | 4              | 3000/46/23                                               | 2 / 1000                 |
| Standard_E4_v3  | 4         | 32          | 100            | 8              | 6000/93/46                                               | 2 / 2000                 |
| Standard_E8_v3  | 8         | 64          | 200            | 16             | 12000/187/93                                             | 4 / 4000                     |
| Standard_E16_v3 | 16        | 128         | 400            | 32             | 24000/375/187                                            | 8 / 8000                     |
| Standard_E20_v3 | 20        | 160         | 500            | 32             | 30000/469/234                                            | 8 / 10000                     |
| Standard_E32_v3 | 32        | 256         | 800            | 32             | 48000/750/375                                            | 8 / 16000                 |
| Standard_E48_v3 | 48        | 384         | 1200            | 32             | 96000/1000/500                                            | 8 / 24000                 |
| Standard_E64_v3 | 64        | 432         | 1600           | 32             | 96000/1000/500                                           | 8 / 30000           |
| Standard_E64i_v3&nbsp;<sup>2,&nbsp;3</sup> | 64        | 432         | 1600           | 32             | 96000/1000/500                                           | 8 / 30000           |

<sup>1</sup> Ev3-series VM’s feature Intel® Hyper-Threading Technology.

<sup>2</sup> Constrained core sizes available.

<sup>3</sup> Instance is isolated to hardware dedicated to a single customer.


## Mv2-series

Premium Storage: Supported

Premium Storage caching: Supported

Write Accelerator: [Supported](https://docs.microsoft.com/azure/virtual-machines/windows/how-to-enable-write-accelerator)

The Mv2-series features high throughput, low latency, directly mapped local NVMe storage running on a hyper-threaded Intel® Xeon® Platinum 8180M 2.5GHz (Skylake) processor with an all core base frequency of 2.5 GHz and a max turbo frequency of 3.8 GHz. All Mv2-series virtual machine sizes can use both standard and premium persistent disks. Mv2-series instances are memory optimized VM sizes providing unparalleled computational performance to support large in-memory databases and workloads, with a high memory-to-CPU ratio that is ideal for relational database servers, large caches, and in-memory analytics. 

|Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max cached and temp storage throughput: IOPS / MBps (cache size in GiB) | Max uncached disk throughput: IOPS / MBps | Max NICs / Expected network bandwidth (Mbps) |
|-----------------|------|-------------|----------------|----------------|-----------------------------------------------------------------------|-------------------------------------------|------------------------------|
| Standard_M208ms_v2<sup>1, 2</sup> | 208 | 5700 | 4096 | 64 | 80000 / 800 (7040) | 40000 / 1000 | 8 / 16000 |
| Standard_M208s_v2<sup>1, 2</sup> | 208 | 2850 | 4096 | 64 | 80000 / 800 (7040) | 40000 / 1000 | 8 / 16000 |

Mv2-series VM’s feature Intel® Hyper-Threading Technology  

<sup>1</sup> These large VMs require one of these supported guest OSes: Windows Server 2016, Windows Server 2019, SLES 12 SP4, SLES 15.

<sup>2</sup> Mv2-series VMs are generation 2 only. If you're using Linux, see the following section for how to find and select a SUSE Linux image.

#### Find a SUSE image

To select an appropriate SUSE Linux image in the Azure portal: 

1. In the Azure portal, select **Create a resource** 
1. Search for “SUSE SAP” 
1. SLES for SAP generation 2 images are available as either pay-as-you-go, or bring your own subscription (BYOS). In the search results, expand the desired image category:

    * SUSE Linux Enterprise Server (SLES) for SAP
    * SUSE Linux Enterprise Server (SLES) for SAP (BYOS)
    
1. SUSE images compatible with the Mv2-series are prefixed with the name `GEN2:`. The following SUSE images are available for Mv2-series VMs:

    * GEN2: SUSE Linux Enterprise Server (SLES) 12 SP4 for SAP Applications
    * GEN2: SUSE Linux Enterprise Server (SLES) 15 for SAP Applications
    * GEN2: SUSE Linux Enterprise Server (SLES) 12 SP4 for SAP Applications (BYOS)
    * GEN2: SUSE Linux Enterprise Server (SLES) 15 for SAP Applications (BYOS)

#### Select a SUSE image via Azure CLI

To see a list of the currently available SLES for SAP image for Mv2-series VMs, use the following [`az vm image list`](https://docs.microsoft.com/cli/azure/vm/image?view=azure-cli-latest#az-vm-image-list) command:

```azurecli
az vm image list --output table --publisher SUSE --sku gen2 --all
```

The command outputs the currently available Generation 2 VMs available from SUSE for Mv2-series VMs. 

Example output:

```
Offer          Publisher  Sku          Urn                                        Version
-------------  ---------  -----------  -----------------------------------------  ----------
SLES-SAP       SUSE       gen2-12-sp4  SUSE:SLES-SAP:gen2-12-sp4:2019.05.13       2019.05.13
SLES-SAP       SUSE       gen2-15      SUSE:SLES-SAP:gen2-15:2019.05.13           2019.05.13
SLES-SAP-BYOS  SUSE       gen2-12-sp4  SUSE:SLES-SAP-BYOS:gen2-12-sp4:2019.05.13  2019.05.13
SLES-SAP-BYOS  SUSE       gen2-15      SUSE:SLES-SAP-BYOS:gen2-15:2019.05.13      2019.05.13
```

## M-series 

ACU: 160-180 <sup>1</sup>

Premium Storage:  Supported

Premium Storage caching:  Supported

Write Accelerator:  [Supported](https://docs.microsoft.com/azure/virtual-machines/windows/how-to-enable-write-accelerator)

| Size            | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max cached and temp storage throughput: IOPS / MBps (cache size in GiB) | Max uncached disk throughput: IOPS / MBps | Max NICs / Expected network bandwidth (Mbps) |
|-----------------|------|-------------|----------------|----------------|-----------------------------------------------------------------------|-------------------------------------------|------------------------------|
| Standard_M8ms&nbsp;<sup>3</sup>    | 8  | 218.75 | 256  | 8  | 10000 / 100 (793)  | 5000  / 125 | 4 / 2000 |
| Standard_M16ms&nbsp;<sup>3</sup>   | 16 | 437.5  | 512  | 16 | 20000 / 200 (1587) | 10000 / 250 | 8 / 4000 |
| Standard_M32ts | 32 | 192    | 1024 | 32 | 40000 / 400 (3174) | 20000 / 500 | 8 / 8000 |
| Standard_M32ls | 32 | 256    | 1024 | 32 | 40000 / 400 (3174) | 20000 / 500 | 8 / 8000 |
| Standard_M32ms&nbsp;<sup>3</sup>   | 32 | 875    | 1024 | 32 | 40000 / 400 (3174) | 20000 / 500 | 8 / 8000 |
| Standard_M64s  | 64 | 1024   | 2048 | 64 | 80000 / 800 (6348)| 40000 / 1000 | 8 / 16000          |
| Standard_M64ls  | 64 | 512    | 2048 | 64 | 80000 / 800 (6348) | 40000 / 1000 | 8 / 16000 |
| Standard_M64ms&nbsp;<sup>3</sup>  | 64   | 1792 | 2048 | 64 | 80000 / 800 (6348)| 40000 / 1000 | 8 / 16000          |
| Standard_M128s&nbsp;<sup>2</sup> | 128  | 2048        | 4096  | 64 | 160000 / 1600 (12696) | 80000 / 2000                            | 8 / 30000          |
| Standard_M128ms&nbsp;<sup>2,&nbsp;3,&nbsp;4</sup> | 128  | 3892  | 4096 | 64 | 160000 / 1600 (12696) | 80000 / 2000                            | 8 / 30000          |
| Standard_M64   | 64  | 1024 | 7168  | 64 | 80000  / 800  (1228) | 40000 / 1000 | 8 / 16000 |
| Standard_M64m  | 64  | 1792 | 7168  | 64 | 80000  / 800  (1228) | 40000 / 1000 | 8 / 16000 |
| Standard_M128&nbsp;<sup>2  | 128 | 2048 | 14336 | 64 | 250000 / 1600 (2456) | 80000 / 2000 | 8 / 32000 |
| Standard_M128m&nbsp;<sup>2 | 128 | 3892 | 14336 | 64 | 250000 / 1600 (2456) | 80000 / 2000 | 8 / 32000 |



<sup>1</sup> M-series VM’s feature Intel® Hyper-Threading Technology

<sup>2</sup> More than 64 vCPU’s require one of these supported guest OSes: Windows Server 2016, Ubuntu 16.04 LTS, SLES 12 SP2, and Red Hat Enterprise Linux, CentOS 7.3 or Oracle Linux 7.3 with LIS 4.2.1.

<sup>3</sup> Constrained core sizes available.

<sup>4</sup> Instance is isolated to hardware dedicated to a single customer.
<br>


## DSv2-series 11-15

ACU: 210 - 250 <sup>1</sup>

Premium Storage:  Supported

Premium Storage caching:  Supported

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max cached and temp storage throughput: IOPS / MBps (cache size in GiB) | Max uncached disk throughput: IOPS / MBps | Max NICs / Expected network bandwidth (Mbps) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Standard_DS11_v2&nbsp;<sup>3</sup> |2 |14 |28 |8 |8000 / 64 (72) |6400 / 96 |2 / 1500 |
| Standard_DS12_v2&nbsp;<sup>3</sup> |4 |28 |56 |16 |16000 / 128 (144) |12800 / 192 |4 / 3000 |
| Standard_DS13_v2&nbsp;<sup>3</sup> |8 |56 |112 |32 |32000 / 256 (288) |25600 / 384 |8 / 6000 |
| Standard_DS14_v2&nbsp;<sup>3</sup>|16 |112 |224 |64 |64000 / 512 (576) |51200 / 768 |8 / 12000 |
| Standard_DS15_v2&nbsp;<sup>2</sup> |20 |140 |280 |64 |80000 / 640 (720) |64000 / 960 |8 / 25000&nbsp;<sup>4</sup>

<sup>1</sup> The maximum disk throughput (IOPS or MBps) possible with a DSv2 series VM may be limited by the number, size and striping of the attached disk(s).  For details, see [Designing for high performance](../articles/virtual-machines/windows/premium-storage-performance.md).  
<sup>2</sup> Instance is isolated to hardware dedicated to a single customer.  
<sup>3</sup> Constrained core sizes available.  
<sup>4</sup> 25000 Mbps with Accelerated Networking. 

<br>

## Dv2-series 11-15

ACU: 210 - 250

Premium Storage:  Not Supported

Premium Storage caching:  Not Supported

| Size              | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max temp storage throughput: IOPS / Read MBps / Write MBps | Max data disks / throughput: IOPS | Max NICs / Expected network bandwidth (Mbps) |
|-------------------|-----------|-------------|----------------|----------------------------------------------------------|-----------------------------------|------------------------------|
| Standard_D11_v2   | 2         | 14          | 100            | 6000 / 93 / 46                                           | 8 / 8x500                         | 2 / 1500                     |
| Standard_D12_v2   | 4         | 28          | 200            | 12000 / 187 / 93                                         | 16 / 16x500                         | 4 / 3000                     |
| Standard_D13_v2   | 8         | 56          | 400            | 24000 / 375 / 187                                        | 32 / 32x500                       | 8 / 6000                     |
| Standard_D14_v2   | 16        | 112         | 800            | 48000 / 750 / 375                                        | 64 / 64x500                       | 8 / 12000          |
| Standard_D15_v2&nbsp;<sup>1</sup> | 20        | 140         | 1000          | 60000 / 937 / 468                                        | 64 / 64x500                       | 8 / 25000&nbsp;<sup>2</sup> |

<sup>1</sup> Instance is isolated to hardware dedicated to a single customer.  
<sup>2</sup> 25000 Mbps with Accelerated Networking. 
