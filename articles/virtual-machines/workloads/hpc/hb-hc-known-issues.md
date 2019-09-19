---
title: Known issues with HB-series and HC-series VMs - Azure Virtual Machines | Microsoft Docs
description: Learn about known issues with HB-series VM sizes in Azure. 
services: virtual-machines
documentationcenter: ''
author: vermagit
manager: gwallace
editor: ''
tags: azure-resource-manager

ms.service: virtual-machines
ms.workload: infrastructure-services
ms.topic: article
ms.date: 05/07/2019
ms.author: amverma
---

# Known issues with HB-series and HC-series VMs

This article provides the most common issues and solutions when using HB-series and HC-series VMs.

## DRAM on HB-series

HB-series VMs can only expose 228 GB of RAM to guest VMs at this time. This is due to a known limitation of Azure hypervisor to prevent pages from being assigned to the local DRAM of AMD CCX’s (NUMA domains) reserved for the guest VM.

## Accelerated Networking

Azure Accelerated Networking is not enabled at this time, but will as we progress through the Preview period. We will notify customers when this feature is supported.

## qp0 Access Restriction

To prevent low-level hardware access that can result in security vulnerabilities, Queue Pair 0 is not accessible to guest VMs. This should only affect actions typically associated with administration of the ConnectX-5 NIC, and running some InfiniBand diagnostics like ibdiagnet, but not end-user applications themselves.

## UD Transport

At launch, the HB- and HC-series do not support Dynamically Connected Transport (DCT). Support for DCT will be implemented over time. Reliable Connection (RC) and Unreliable Datagram (UD) transports are supported.

## GSS Proxy

GSS Proxy has a known bug in CentOS/RHEL 7.5 that can manifest as a significant performance and responsiveness penalty when used with NFS. This can be mitigated with:

```console
sed -i 's/GSS_USE_PROXY="yes"/GSS_USE_PROXY="no"/g' /etc/sysconfig/nfs
```

## Cache Cleaning

On HPC systems, it is often useful to clean up the memory after a job has finished before the next user is assigned the same node. After running applications in Linux you may find that your available memory reduces while your buffer memory increases, despite not running any applications.

![Screenshot of command prompt](./media/known-issues/cache-cleaning-1.png)

Using `numactl -H` will show which NUMAnode(s) the memory is buffered with (possibly all). In Linux, users can clean the caches in three ways to return buffered or cached memory to ‘free’. You need to be root or have sudo permissions.

```console
echo 1 > /proc/sys/vm/drop_caches [frees page-cache]
echo 2 > /proc/sys/vm/drop_caches [frees slab objects e.g. dentries, inodes]
echo 3 > /proc/sys/vm/drop_caches [cleans page-cache and slab objects]
```

![Screenshot of command prompt](./media/known-issues/cache-cleaning-2.png)

## Kernel warnings

You may see the following kernel warning messages when booting a HB-series VM under Linux.

```console
[  0.004000] WARNING: CPU: 4 PID: 0 at arch/x86/kernel/smpboot.c:376 topology_sane.isra.3+0x80/0x90
[  0.004000] sched: CPU #4's llc-sibling CPU #0 is not on the same node! [node: 1 != 0]. Ignoring dependency.
[  0.004000] Modules linked in:
[  0.004000] CPU: 4 PID: 0 Comm: swapper/4 Not tainted 3.10.0-957.el7.x86_64 #1
[  0.004000] Hardware name: Microsoft Corporation Virtual Machine/Virtual Machine, BIOS 090007 05/18/2018
[  0.004000] Call Trace:
[  0.004000] [<ffffffffb8361dc1>] dump_stack+0x19/0x1b
[  0.004000] [<ffffffffb7c97648>] __warn+0xd8/0x100
[  0.004000] [<ffffffffb7c976cf>] warn_slowpath_fmt+0x5f/0x80
[  0.004000] [<ffffffffb7c02b34>] ? calibrate_delay+0x3e4/0x8b0
[  0.004000] [<ffffffffb7c574c0>] topology_sane.isra.3+0x80/0x90
[  0.004000] [<ffffffffb7c57782>] set_cpu_sibling_map+0x172/0x5b0
[  0.004000] [<ffffffffb7c57ce1>] start_secondary+0x121/0x270
[  0.004000] [<ffffffffb7c000d5>] start_cpu+0x5/0x14
[  0.004000] ---[ end trace 73fc0e0825d4ca1f ]---
```

You can ignore this warning. This is due to a known limitation of the Azure hypervisor that will be addressed over time.

## Next steps

Learn more about [high-performance computing](https://docs.microsoft.com/azure/architecture/topics/high-performance-computing/) in Azure.
