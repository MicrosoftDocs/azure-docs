---
 title: Bsv2-series summary include
 description: Include file for sizes content for Bsv2-series VMs.
 services: virtual-machines
 author: mattmcinnes
 ms.topic: include
 ms.service: virtual-machines
 ms.subservice: sizes
 ms.date: 04/11/2024
 ms.author: mattmcinnes
 ms.custom: include file
---

Bsv2-series virtual machines run on Intel® Xeon® Platinum 8473C (Sapphire Rapids), or Intel® Xeon® Platinum 8370C (Ice Lake) processor in a [hyper threaded](https://www.intel.com/content/www/us/en/architecture-and-technology/hyper-threading/hyper-threading-technology.html) configuration, providing low-cost CPU burstable general purpose virtual machines. Bsv2-series virtual machines utilize a CPU credit model to track how much CPU is consumed - the virtual machine accumulates CPU credits when a workload is operating below the base CPU performance threshold and, uses credits when running above the base CPU performance threshold until all of its credits are consumed. Upon consuming all the CPU credits, a Bsv2-series virtual machine is throttled back to its base CPU performance until it accumulates the credits to CPU burst again.

Bsv2-series virtual machines offer a balance of compute, memory, and network resources and are a cost-effective way to run a broad spectrum of general-purpose workloads, including large-scale micro-services, small and medium databases, virtual desktops, and business-critical applications; and are also an affordable option to run your code repositories and dev/test environments. Bsv2-Series offers virtual machines of up to 32 vCPU and 128 Gib of RAM, with max network bandwidth of up to 6250 Mbps and max uncached disk throughput of 600 Mbps. Bsv2-series virtual machines also support attachments of Standard SSD, Standard HDD, and Premium SSD disk types with a default Remote-SSD support, you can also attach Ultra Disk storage based on its regional availability. Disk storage is billed separately from virtual machines. [See pricing for disks](https://azure.microsoft.com/pricing/details/managed-disks/).  