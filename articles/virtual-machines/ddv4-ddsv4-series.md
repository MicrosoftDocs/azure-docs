---
 title: Ddv4 and Ddsv4-series - Azure Virtual Machines
 description: Specifications for the Dv4, Ddv4, Dsv4 and Ddsv4-series VMs.
 author: brbell
 ms.author: brbell
 ms.reviewer: cynthn
 ms.custom: mimckitt
 ms.service: virtual-machines
 ms.topic: conceptual
 ms.date: 06/01/2020
---

# Ddv4 and Ddsv4-series

The Ddv4 and Ddsv4-series runs on the Intel&reg; Xeon&reg; Platinum 8272CL (Cascade Lake) processors in a hyper-threaded configuration, providing a better value proposition for most general-purpose workloads. It features a sustained all core Turbo clock speed of 3.4 GHz. 

D-series use cases include enterprise-grade applications, relational databases, in-memory caching, and analytics.

> [!NOTE]
> We are aware of an issue in the Azure host software that currently causes RHEL 7.x and CentOS 7.x Linux distributions to not boot or run on Ddv4/Ddsv4 VM sizes. Viewing the Azure serial console log of the VM will show a Linux kernel panic early in the boot process. Other Linux distributions or virtual appliances based on a Linux kernel version 4.6 or earlier will similarly not boot or run. An update to the Azure host is planned in the next few weeks that will resolve this issue and enable the full range of Linux distros and virtual appliances to operate properly.

## Ddv4-series

Ddv4-series sizes run on the Intel&reg; Xeon&reg; Platinum 8272CL (Cascade Lake). The Ddv4-series offer a combination of vCPU, memory and temporary disk for most production workloads. Ddv4-series VMs feature [Intel&reg; Hyper-Threading Technology](https://www.intel.com/content/www/us/en/architecture-and-technology/hyper-threading/hyper-threading-technology.html).

The new Ddv4 VM sizes will include fast, larger local SSD storage (up to 2,400 GiB) and are designed for applications that benefit from low latency, high-speed local storage, such as applications that require fast reads/ writes to temp storage or that need temp storage for caches or temporary files.  You can attach Standard SSDs and Standard HDDs storage to the Ddv4 VMs. Remote Data disk storage is billed separately from virtual machines.

>[!NOTE]
> To use Ultra Disk or Premium SSD disk storage use the Ddsv4 sizes. 

ACU: 195-210

Premium Storage:  Not Supported

Premium Storage caching:  Not Supported

Live Migration: Supported

Memory Preserving Updates: Supported

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max cached and temp storage throughput: IOPS/MBps | Max uncached disk throughput: IOPS/MBps | Max NICs/Expected Network bandwidth (Mbps) |
|---|---|---|---|---|---|---|---|
| Standard_D2d_v4 | 2 | 8 | 75 | 4 | 19000/120(50) | 3000/48 | 2/1000 |
| Standard_D4d_v4 | 4 | 16 | 150 | 8 | 38500/242(100) | 6400/96 | 2/2000 |
| Standard_D8d_v4 | 8 | 32 | 300 | 16 | 77000/485(200) | 12800/192 | 4/4000 |
| Standard_D16d_v4 | 16 | 64 | 600 | 32 | 154000/968(400) | 25600/384 | 8/8000 |
| Standard_D32d_v4 | 32 | 128 | 1200 | 32 | 308000/1936(800) | 51200/768 | 8/16000 |
| Standard_D48d_v4 | 48 | 192 | 1800 | 32 | 462000/2904(1200) | 76800/1152 | 8/24000 |
| Standard_D64d_v4 | 64 | 256 | 2400 | 32 | 615000/3872(1600) | 80000/1200 | 8/30000 |

## Ddsv4-series

Ddsv4-series run on the Intel&reg; Xeon&reg; Platinum 8272CL (Cascade Lake). The Ddsv4-series offer a combination of vCPU, memory and temporary disk for most production workloads. Ddsv4-series VMs feature [Intel&reg; Hyper-Threading Technology](https://www.intel.com/content/www/us/en/architecture-and-technology/hyper-threading/hyper-threading-technology.html).

The new Ddv4 VM sizes include fast, larger local SSD storage (up to 2,400 GiB) and are designed for applications that benefit from low latency, high-speed local storage, such as applications that require fast reads/ writes to temp storage or that need temp storage for caches or temporary files. 

 > [!NOTE]
 >The pricing and billing meters for Ddsv4 sizes are the same as Ddv4-series.

ACU: 195-210

Premium Storage:  Supported

Premium Storage caching:  Supported

Live Migration: Supported

Memory Preserving Updates: Supported

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max cached and temp storage throughput: IOPS/MBps | Max uncached disk throughput: IOPS/MBps | Max NICs/Expected Network bandwidth (Mbps) |
|---|---|---|---|---|---|---|---|
| Standard_D2ds_v4 | 2 | 8 | 75 | 4 | 19000/120(50) | 3000/48 | 2/1000 |
| Standard_D4ds_v4 | 4 | 16 | 150 | 8 | 38500/242(100) | 6400/96 | 2/2000 |
| Standard_D8ds_v4 | 8 | 32 | 300 | 16 | 77000/485(200) | 12800/192 | 4/4000 |
| Standard_D16ds_v4 | 16 | 64 | 600 | 32 | 154000/968(400) | 25600/384 | 8/8000 |
| Standard_D32ds_v4 | 32 | 128 | 1200 | 32 | 308000/1936(800) | 51200/768 | 8/16000 |
| Standard_D48ds_v4 | 48 | 192 | 1800 | 32 | 462000/2904(1200) | 76800/1152 | 8/24000 |
| Standard_D64ds_v4 | 64 | 256 | 2400 | 32 | 615000/3872(1600) | 80000/1200 | 8/30000 |

[!INCLUDE [virtual-machines-common-sizes-table-defs](../../includes/virtual-machines-common-sizes-table-defs.md)]

## Other sizes

- [General purpose](sizes-general.md)
- [Memory optimized](sizes-memory.md)
- [Storage optimized](sizes-storage.md)
- [GPU optimized](sizes-gpu.md)
- [High performance compute](sizes-hpc.md)
- [Previous generations](sizes-previous-gen.md)

## Next steps

Learn more about how [Azure compute units (ACU)](acu.md) can help you compare compute performance across Azure SKUs.
