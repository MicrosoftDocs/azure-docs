---
# Required metadata
# For more information, see https://review.learn.microsoft.com/en-us/help/platform/learn-editor-add-metadata?branch=main
# For valid values of ms.service, ms.prod, and ms.topic, see https://review.learn.microsoft.com/en-us/help/platform/metadata-taxonomies?branch=main

title:       Overview of Msv3 and Mdsv3 Medium Memory Series
description: Overview of Msv3 and Mdsv3 Medium Memory virtual machines. These virtual machines provide faster performance and lower TCO.
author:      ayshakeen # GitHub alias
ms.author:   ayshak # Microsoft alias
ms.service:  virtual-machines
# ms.prod:   sizes
ms.topic:    conceptual
ms.date:     08/10/2023
---

# Msv3 and Mdsv3 Medium Memory Series 

The Msv3 and Mdsv3 Medium Memory(MM) series, powered by 4<sup>th</sup> generation Intel® Xeon® Scalable processors, are the next generation of memory-optimized VM sizes delivering faster performance, lower total cost of ownership and improved resilience to failures compared to previous generation Mv2 VMs. The Mv3 MM offers VM sizes of up to 4TB of memory and 4,000 MBps throughout to remote storage and provides up to 25% networking performance improvements over previous generations.

## Msv3 Medium Memory series

[Premium Storage](premium-storage-performance.md): Supported<br>
[Premium Storage caching](premium-storage-performance.md): Supported<br>
[Live Migration](maintenance-and-updates.md): Not Supported<br>
[Memory Preserving Updates](maintenance-and-updates.md): Not Supported<br>
[VM Generation Support](generation-2.md): Generation 2<br>
[Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md): Supported<br>
[Ephemeral OS Disks](ephemeral-os-disks.md): Not Supported<br>
[Nested Virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization): Not Supported <br>

|Size|vCPU|Memory: GiB|Max data disks|Max uncached Premium SSD  throughput: IOPS/MBps|Max uncached Ultra Disk and Premium SSD V2 disk throughput: IOPS/MBps|Max NICs|Max network bandwidth (Mbps)|
 | -------- | -------- | -------- | -------- | -------- | -------- | -------- | -------- |
|Standard_M12s_v3|12|240|64|16,250/390|16,250/390|4|4,000|
|Standard_M24s_v3|24|480|64|32,500/780|32,500/780|8|8,000|
|Standard_M48s_1_v3|48|974|64|65,000/ 1,560|65,000/ 1,560|8|16,000|
|Standard_M96s_1_v3|96|974|64|65,000/ 1,560|65,000/ 1,560|8|16,000|
|Standard_M96s_2_v3|96|1,946|64|130,000/ 3,120|130,000/ 3,120|8|30,000|
|Standard_M176s_3_v3|176|2794|64|130,000/ 4,000|130,000/ 4,000|8|40,000|
|Standard_M176s_4_v3|176|3892|64|130,000/ 4,000|130,000/ 4,000|8|40,000|

## Mdsv3 Medium Memory series

These virtual machines feature local SSD storage (up to 400 GiB).

[Premium Storage](premium-storage-performance.md): Supported<br>
[Premium Storage caching](premium-storage-performance.md): Supported<br>
[Live Migration](maintenance-and-updates.md): Not Supported<br>
[Memory Preserving Updates](maintenance-and-updates.md): Not Supported<br>
[VM Generation Support](generation-2.md): Generation 2<br>
[Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md): Supported<br>
[Ephemeral OS Disks](ephemeral-os-disks.md): Supported<br>
[Nested Virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization): Not Supported <br>

|Size|vCPU|Memory: GiB|Temp storage (SSD) GiB|Max data disks|Max temp storage throughput: IOPS/MBps*|Max uncached Premium SSD  throughput: IOPS/MBps|Max uncached Ultra Disk and Premium SSD V2 disk throughput: IOPS/MBps|Max NICs|Max network bandwidth (Mbps)|
| -------- | -------- | -------- | -------- | -------- | -------- | -------- | -------- | -------- | -------- |
|Standard_M12ds_v3|12|240|400|64|10,000/100|16,250/390|16,250/390|4|4,000|
|Standard_M24ds_v3|24|480|400|64|20,000/200|32,500/780|32,500/780|8|8,000|
|Standard_M48ds_1_v3|48|974|400|64|40,000/400|65,000/ 1,560|65,000/ 1,560|8|16,000|
|Standard_M96ds_1_v3|96|974|400|64|40,000/400|65,000/ 1,560|65,000/ 1,560|8|16,000|
|Standard_M96ds_2_v3|96|1,946|400|64|160,000/1600|130,000/ 3,120|130,000/ 3,120|8|30,000|
|Standard_M176ds_3_v3|176|2794|400|64|160,000/1600|130,000/ 4,000|130,000/ 4,000|8|40,000|
|Standard_M176ds_4_v3|176|3892|400|64|160,000/1600|130,000/ 4,000|130,000/ 4,000|8|40,000|

<sup>*</sup> Read iops is optimized for sequential reads<br>

[!INCLUDE [virtual-machines-common-sizes-table-defs](../../includes/virtual-machines-common-sizes-table-defs.md)]

## Other sizes and information

- [General purpose](sizes-general.md)
- [Memory optimized](sizes-memory.md)
- [Storage optimized](sizes-storage.md)
- [GPU optimized](sizes-gpu.md)
- [High performance compute](sizes-hpc.md)
- [Previous generations](sizes-previous-gen.md)

Pricing Calculator: [Pricing Calculator](https://azure.microsoft.com/pricing/calculator/)

More information on Disks Types: [Disk Types](./disks-types.md#ultra-disks)

