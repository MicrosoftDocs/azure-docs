---
title: Optimize performance on Lsv3, Lasv3, and Lsv2-series Linux VMs 
description: Learn how to optimize performance for your solution on the Lsv3, Lasv3, and Lsv2-series Linux virtual machines (VMs) on Azure.
author: sasha-melamed 
ms.service: virtual-machines 
ms.subservice: sizes
ms.collection: linux 
ms.topic: conceptual 
ms.tgt_pltfrm: vm-linux 
ms.workload: infrastructure-services 
ms.date: 06/01/2022
ms.author: sasham 
--- 

# Optimize performance on Lsv3, Lasv3, and Lsv2-series Linux VMs

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Uniform scale sets  

Lsv3, Lasv3, and Lsv2-series Azure Virtual Machines (Azure VMs) support various workloads that need high I/O and throughput on local storage across a wide range of applications and industries.  The L-series is ideal for Big Data, SQL, NoSQL databases, data warehousing and large transactional databases, including Cassandra, MongoDB, Cloudera, and Redis. 

Several builds are available Azure Marketplace due to work with partners in Linux. These builds are optimized for Lsv3, Lasv3, and Lsv2-series performance. Available builds include the following and later versions of: 

- Ubuntu 16.04 
- RHEL 8.0 and clones, including CentOS, Rocky Linux, and Alma Linux 
- Debian 9 
- SUSE Linux 15 
- Oracle Linux 8.0 

This article provides tips and suggestions to ensure your workloads and applications achieve the maximum performance designed into the VMs.  

## AMD EPYC&trade; chipset architecture 

Lasv3 and Lsv2-series VMs use AMD EPYC&trade; server processors based on the Zen micro-architecture. AMD developed Infinity Fabric (IF) for EPYC&trade; as scalable interconnect for its NUMA model that can be used for on-die, on-package, and multi-package communications. Compared with QPI (Quick-Path Interconnect) and UPI (Ultra-Path Interconnect) used on Intel modern monolithic-die processors, AMD's many-NUMA small-die architecture can bring both performance benefits and challenges. The actual effects of memory bandwidth and latency constraints might vary depending on the type of workloads running. 

## Tips to maximize performance 

* If you're uploading a custom Linux GuestOS for your workload, Accelerated Networking is turned off by default. If you intend to enable Accelerated Networking, enable it at the time of VM creation for best performance. 
* To gain max performance, run multiple jobs with deep queue depth per device. 
* Avoid mixing NVMe admin commands (for example, NVMe SMART info query, etc.) with NVMe I/O commands during active workloads. Lsv3, Lasv3, and Lsv2 NVMe devices are backed by Hyper-V NVMe Direct technology, which switches into “slow mode” whenever any NVMe admin commands are pending. Lsv3, Lasv3, and Lsv2 users might see a dramatic performance drop in NVMe I/O performance if that happens. 
* Lsv2 users aren't recommended to rely on device NUMA information (all 0) reported from within the VM for data drives to decide the NUMA affinity for their apps. The recommended way for better performance is to spread workloads across CPUs if possible. 
* The maximum supported queue depth per I/O queue pair for Lsv3, Lasv3, and Lsv2 VM NVMe device is 1024. Lsv3, Lasv3, and Lsv2 users are recommended to limit their (synthetic) benchmarking workloads to queue depth 1024 or lower to avoid triggering queue full conditions, which can reduce performance. 
*  The best performance is obtained when I/O is done directly to each of the raw NVMe devices with no partitioning, no file systems, no RAID config, etc. Before starting a testing session, ensure the configuration is in a known fresh/clean state by running `blkdiscard` on each of the NVMe devices. To obtain the most consistent performance during benchmarking, it's recommended to precondition the NVMe devices before testing by issuing random writes to all of the devices' LBAs twice as defined in the SNIA Solid State Storage Enterprise Performance Test Specification.

## Utilizing local NVMe storage 

Local storage on the 1.92 TB NVMe disk on all Lsv3, Lasv3, and Lsv2 VMs is ephemeral. During a successful standard reboot of the VM, the data on the local NVMe disk persists. The data doesn't persist on the NVMe if the VM is redeployed, deallocated, or deleted. Data doesn't persist if another issue causes the VM, or the hardware it's running on, to become unhealthy. When scenario happens, any data on the old host is securely erased. 

There are also cases when the VM needs to be moved to a different host machine, for example, during a planned maintenance operation. Planned maintenance operations and some hardware failures can be anticipated with [Scheduled Events](scheduled-events.md). Use Scheduled Events to stay updated on any predicted maintenance and recovery operations. 

In the case that a planned maintenance event requires the VM to be recreated on a new host with empty local disks, the data needs to be resynchronized (again, with any data on the old host being securely erased). This scenario occurs because Lsv3, Lasv3, and Lsv2-series VMs don't currently support live migration on the local NVMe disk. 

There are two modes for planned maintenance. 

### Standard VM customer-controlled maintenance 

- The VM is moved to an updated host during a 30-day window. 
- Lsv3, Lasv3, and Lsv2 local storage data could be lost, so backing-up data prior to the event is recommended. 

### Automatic maintenance 

- Occurs if the customer doesn't execute customer-controlled maintenance, or because of emergency procedures, such as a security zero-day event. 
- Intended to preserve customer data, but there's a small risk of a VM freeze or reboot. 
- Lsv3, Lasv3, and Lsv2 local storage data could be lost, so backing-up data prior to the event is recommended. 

For any upcoming service events, use the controlled maintenance process to select a time most convenient to you for the update. Prior to the event, back up your data in premium storage. After the maintenance event completes, you can return your data to the refreshed Lsv3, Lasv3, and Lsv2 VMs local NVMe storage. 

Scenarios that maintain data on local NVMe disks include: 

- The VM is running and healthy. 
- The VM is rebooted in place (by you or Azure). 
- The VM is paused (stopped without deallocation). 
- Most the planned maintenance servicing operations. 

Scenarios that securely erase data to protect the customer include: 

- The VM is redeployed, stopped (deallocated), or deleted (by you). 
- The VM becomes unhealthy and has to service heal to another node due to a hardware issue. 
- A few of the planned maintenance servicing operations that require the VM to be reallocated to another host for servicing. 

## Frequently asked questions 

The following are frequently asked questions about these series.

### How do I start deploying L-series VMs?

Much like any other VM, use the [Portal](quick-create-portal.md), [Azure CLI](quick-create-cli.md), or [PowerShell](quick-create-powershell.md) to create a VM. 

### Does a single NVMe disk failure cause all VMs on the host to fail?  

If a disk failure is detected on the hardware node, the hardware is in a failed state. When this problem occurs, all VMs on the node are automatically deallocated and moved to a healthy node. For Lsv3, Lasv3, and Lsv2-series VMs, this problem means that the customer's data on the failing node is also securely erased. The customer needs to recreate the data on the new node.

### Do I need to change the blk_mq settings?

RHEL/CentOS 7.x automatically uses blk-mq for the NVMe devices. No configuration changes or settings are necessary. 

## Next steps 

See specifications for all [VMs optimized for storage performance](../sizes-storage.md) on Azure 
