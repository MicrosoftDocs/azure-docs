---
 title: include file
 description: include file
 services: virtual-machines-windows, virtual-machines-linux
 author: cynthn
 ms.service: multiple
 ms.topic: include
 ms.date: 05/16/2019
 ms.author: cynthn;azcspmt;jonbeck
 ms.custom: include file
---

This section provides information on previous generations of virtual machine sizes. These sizes can still be used, but there are newer generations available. 

## F-series

F-series is based on the 2.4 GHz Intel Xeon® E5-2673 v3 (Haswell) processor, which can achieve clock speeds as high as 3.1 GHz with the Intel Turbo Boost Technology 2.0. This is the same CPU performance as the Dv2-series of VMs.  

F-series VMs are an excellent choice for workloads that demand faster CPUs but do not need as much memory or temporary storage per vCPU.  Workloads such as analytics, gaming servers, web servers, and batch processing will benefit from the value of the F-series.

ACU: 210 - 250

Premium Storage:  Not Supported

Premium Storage caching:  Not Supported

| Size         | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max temp storage throughput: IOPS / Read MBps / Write MBps | Max data disks / throughput: IOPS | Max NICs / Expected network bandwidth (Mbps) |
|--------------|-----------|-------------|----------------|----------------------------------------------------------|-----------------------------------|------------------------------|
| Standard_F1  | 1         | 2           | 16             | 3000 / 46 / 23                                           | 4 / 4x500                         | 2 / 750                 |
| Standard_F2  | 2         | 4           | 32             | 6000 / 93 / 46                                           | 8 / 8x500                         | 2 / 1500                     |
| Standard_F4  | 4         | 8           | 64             | 12000 / 187 / 93                                         | 16 / 16x500                         | 4 / 3000                     |
| Standard_F8  | 8         | 16          | 128            | 24000 / 375 / 187                                        | 32 / 32x500                       | 8 / 6000                     |
| Standard_F16 | 16        | 32          | 256            | 48000 / 750 / 375                                        | 64 / 64x500                       | 8 / 12000           |

## Fs-series <sup>1</sup>

The Fs-series provides all the advantages of the F-series, in addition to Premium storage.

ACU: 210 - 250

Premium Storage:  Supported

Premium Storage caching:  Supported

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max cached and temp storage throughput: IOPS / MBps (cache size in GiB) | Max uncached disk throughput: IOPS / MBps | Max NICs / Expected network bandwidth (Mbps) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Standard_F1s |1 |2 |4 |4 |4000 / 32 (12) |3200 / 48 |2 / 750 |
| Standard_F2s |2 |4 |8 |8 |8000 / 64 (24) |6400 / 96 |2 / 1500 |
| Standard_F4s |4 |8 |16 |16 |16000 / 128 (48) |12800 / 192 |4 / 3000 |
| Standard_F8s |8 |16 |32 |32 |32000 / 256 (96) |25600 / 384 |8 / 6000 |
| Standard_F16s |16 |32 |64 |64 |64000 / 512 (192) |51200 / 768 |8 / 12000 |

MBps = 10^6 bytes per second, and GiB = 1024^3 bytes.

<sup>1</sup> The maximum disk throughput (IOPS or MBps) possible with a Fs series VM may be limited by the number, size, and striping of the attached disk(s).  For details, see [Designing for high performance](../articles/virtual-machines/windows/premium-storage-performance.md).  

## Ls-series

The Ls-series offers up to 32 vCPUs, using the [Intel® Xeon® processor E5 v3 family](https://www.intel.com/content/www/us/en/processors/xeon/xeon-e5-solutions.html). The Ls-series gets the same CPU performance as the G/GS-Series and comes with 8 GiB of memory per vCPU.

The Ls-series does not support the creation of a local cache to increase the IOPS achievable by durable data disks. The high throughput and IOPS of the local disk makes Ls-series VMs ideal for NoSQL stores such as Apache Cassandra and MongoDB which replicate data across multiple VMs to achieve persistence in the event of the failure of a single VM.

ACU: 180-240

Premium Storage:  Supported

Premium Storage caching:  Not Supported
 
| Size          | vCPU | Memory (GiB) | Temp storage (GiB) | Max data disks | Max temp storage throughput (IOPS / MBps) | Max uncached disk throughput (IOPS / MBps) | Max NICs / Expected network bandwidth (Mbps) | 
|----------------|-----------|-------------|--------------------------|----------------|-------------------------------------------------------------|-------------------------------------------|------------------------------| 
| Standard_L4s   | 4  | 32  | 678   | 16 | 20000 / 200 | 5000 / 125  | 2 / 4000  | 
| Standard_L8s   | 8  | 64  | 1388 | 32 | 40000 / 400 | 10000 / 250 | 4 / 8000  | 
| Standard_L16s  | 16 | 128 | 2807 | 64 | 80000 / 800 | 20000 / 500 | 8 / 16000 | 
| Standard_L32s&nbsp;<sup>1</sup> | 32   | 256  | 5630 | 64   | 160000 / 1600   | 40000 / 1000     | 8 / 20000 | 

The maximum disk throughput possible with Ls-series VMs may be limited by the number, size, and striping of any attached disks. For details, see [Designing for high performance](../articles/virtual-machines/windows/premium-storage-performance.md).

<sup>1</sup> Instance is isolated to hardware dedicated to a single customer.

## NVv2-series (Preview)

**Newer size recommendation**: [NVv3-series (Preview)](https://docs.microsoft.com/azure/virtual-machines/linux/sizes-gpu#nvv3-series-preview-1)

The NVv2-series virtual machines are powered by [NVIDIA Tesla M60](https://images.nvidia.com/content/tesla/pdf/188417-Tesla-M60-DS-A4-fnl-Web.pdf) GPUs and NVIDIA GRID technology with Intel Broadwell CPUs. These virtual machines are targeted for GPU accelerated graphics applications and virtual desktops where customers want to visualize their data, simulate results to view, work on CAD, or render and stream content. Additionally, these virtual machines can run single precision workloads such as encoding and rendering. NVv2 virtual machines support Premium Storage and come with twice the system memory (RAM) when compared with its predecessor NV-series.  

Each GPU in NVv2 instances comes with a GRID license. This license gives you the flexibility to use an NV instance as a virtual workstation for a single user, or 25 concurrent users can connect to the VM for a virtual application scenario.

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | GPU | GPU memory: GiB | Max data disks | Max NICs | Virtual Workstations | Virtual Applications | 
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Standard_NV6s_v2 |6 |112 |320 | 1 | 8 | 12 | 4 | 1 | 25 |
| Standard_NV12s_v2 |12 |224 |640 | 2 | 16 | 24 | 8 | 2 | 50 |
| Standard_NV24s_v2 |24 |448 |1280 | 4 | 32 | 32 | 8 | 4 | 100 |

### Standard A0 - A4 using CLI and PowerShell

In the classic deployment model, some VM size names are slightly different in CLI and PowerShell:

* Standard_A0 is ExtraSmall
* Standard_A1 is Small
* Standard_A2 is Medium
* Standard_A3 is Large
* Standard_A4 is ExtraLarge
