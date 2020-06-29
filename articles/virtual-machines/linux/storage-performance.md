---
title: Optimize performance on Azure Lsv2-series virtual machines - Storage 
description: Learn how to optimize performance for your solution on the Lsv2-series virtual machines.
services: virtual-machines-linux
author: laurenhughes
ms.service: virtual-machines-linux
ms-subservice: sizes
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 08/05/2019
ms.author: joelpell
---

# Optimize performance on the Lsv2-series virtual machines

Lsv2-series virtual machines support a variety of workloads that need high I/O and throughput on local storage across a wide range of applications and industries.  The Lsv2-series is ideal for Big Data, SQL, NoSQL databases, data warehousing and large transactional databases, including Cassandra, MongoDB, Cloudera, and Redis.

The design of the Lsv2-series Virtual Machines (VMs) maximizes the AMD EPYC™ 7551 processor to provide the best performance between the processor, memory, NVMe devices, and the VMs. Working with partners in Linux, several builds are available Azure Marketplace that are optimized for Lsv2-series performance and currently include:

- Ubuntu 18.04
- Ubuntu 16.04
- RHEL 8.0
- Debian 9
- Debian 10

This article provides tips and suggestions to ensure your workloads and applications achieve the maximum performance designed into the VMs. The information on this page will be continuously updated as more Lsv2 optimized images are added to the Azure Marketplace.

## AMD EYPC™ chipset architecture

Lsv2-series VMs use AMD EYPC™ server processors based on the Zen microarchitecture. AMD developed Infinity Fabric (IF) for EYPC™ as scalable interconnect for its NUMA model that could be used for on-die, on-package, and multi-package communications. Compared with QPI (Quick-Path Interconnect) and UPI (Ultra-Path Interconnect) used on Intel modern monolithic-die processors, AMD’s many-NUMA small-die architecture may bring both performance benefits as well as challenges. The actual impact of memory bandwidth and latency constraints could vary depending on the type of workloads running.

## Tips to maximize performance

* If you are uploading a custom Linux GuestOS for your workload, note that Accelerated Networking will be **OFF** by default. If you intend to enable Accelerated Networking, enable it at the time of VM creation for best performance.

* The hardware that powers the Lsv2-series VMs utilizes NVMe devices with eight I/O Queue Pairs (QP)s. Every NVMe device I/O queue is actually a pair: a submission queue and a completion queue. The NVMe driver is set up to optimize the utilization of these eight I/O QPs by distributing I/O’s in a round robin schedule. To gain max performance, run eight jobs per device to match.

* Avoid mixing NVMe admin commands (for example, NVMe SMART info query, etc.) with NVMe I/O commands during active workloads. Lsv2 NVMe devices are backed by Hyper-V NVMe Direct technology, which switches into “slow mode” whenever any NVMe admin commands are pending. Lsv2 users could see a dramatic performance drop in NVMe I/O performance if that happens.

* Lsv2 users should not rely on device NUMA information (all 0) reported from within the VM for data drives to decide the NUMA affinity for their apps. The recommended way for better performance is to spread workloads across CPUs if possible.

* The maximum supported queue depth per I/O queue pair for Lsv2 VM NVMe device is 1024 (vs. Amazon i3 QD 32 limit). Lsv2 users should limit their (synthetic) benchmarking workloads to queue depth 1024 or lower to avoid triggering queue full conditions, which can reduce performance.

## Utilizing local NVMe storage

Local storage on the 1.92 TB NVMe disk on all Lsv2 VMs is ephemeral. During a successful standard reboot of the VM, the data on the local NVMe disk will persist. The data will not persist on the NVMe if the VM is redeployed, de-allocated, or deleted. Data will not persist if another issue causes the VM, or the hardware it is running on, to become unhealthy. When this happens, any data on the old host is securely erased.

There will also be cases when the VM needs to be moved to a different host machine, for example, during a planned maintenance operation. Planned maintenance operations and some hardware failures can be anticipated with [Scheduled Events](scheduled-events.md). Scheduled Events should be used to stay updated on any predicted maintenance and recovery operations.

In the case that a planned maintenance event requires the VM to be recreated on a new host with empty local disks, the data will need to be resynchronized (again, with any data on the old host being securely erased). This occurs because Lsv2-series VMs do not currently support live migration on the local NVMe disk.

There are two modes for planned maintenance.

### Standard VM customer-controlled maintenance

- The VM is moved to an updated host during a 30-day window.
- Lsv2 local storage data could be lost, so backing-up data prior to the event is recommended.

### Automatic maintenance

- Occurs if the customer does not execute customer-controlled maintenance, or in the event of emergency procedures such as a security zero-day event.
- Intended to preserve customer data, but there is a small risk of a VM freeze or reboot.
- Lsv2 local storage data could be lost, so backing-up data prior to the event is recommended.

For any upcoming service events, use the controlled maintenance process to select a time most convenient to you for the update. Prior to the event, you may back up your data in premium storage. After the maintenance event completes, you can return your data to the refreshed Lsv2 VMs local NVMe storage.

Scenarios that maintain data on local NVMe disks include:

- The VM is running and healthy.
- The VM is rebooted in place (by you or Azure).
- The VM is paused (stopped without de-allocation).
- The majority of the planned maintenance servicing operations.

Scenarios that securely erase data to protect the customer include:

- The VM is redeployed, stopped (de-allocated), or deleted (by you).
- The VM becomes unhealthy and has to service heal to another node due to a hardware issue.
- A small number of the planned maintenance servicing operations that requires the VM to be reallocated to another host for servicing.

To learn more about options for backing up data in local storage, see [Backup and disaster recovery for Azure IaaS disks](backup-and-disaster-recovery-for-azure-iaas-disks.md).

## Frequently asked questions

* **How do I start deploying Lsv2-series VMs?**  
   Much like any other VM, use the [Portal](quick-create-portal.md), [Azure CLI](quick-create-cli.md), or [PowerShell](quick-create-powershell.md) to create a VM.

* **Will a single NVMe disk failure cause all VMs on the host to fail?**  
   If a disk failure is detected on the hardware node, the hardware is in a failed state. When this occurs, all VMs on the node are automatically de-allocated and moved to a healthy node. For Lsv2-series VMs, this means that the customer’s data on the failing node is also securely erased and will need to be recreated by the customer on the new node. As noted, before live migration becomes available on Lsv2, the data on the failing node will be proactively moved with the VMs as they are transferred to another node.

* **Do I need to make any adjustments to rq_affinity for performance?**  
   The rq_affinity setting is a minor adjustment when using the absolute maximum input/output operations per second (IOPS). Once everything else is working well, then try to set rq_affinity to 0 to see if it makes a difference.

* **Do I need to change the blk_mq settings?**  
   RHEL/CentOS 7.x automatically uses blk-mq for the NVMe devices. No configuration changes or settings are necessary. The scsi_mod.use_blk_mq setting is for SCSI only and was used during Lsv2 Preview because the NVMe devices were visible in the guest VMs as SCSI devices. Currently, the NVMe devices are visible as NVMe devices, so the SCSI blk-mq setting is irrelevant.

* **Do I need to change “fio”?**  
   To get maximum IOPS with a performance measuring tool like ‘fio’ in the L64v2 and L80v2 VM sizes, set “rq_affinity” to 0 on each NVMe device.  For example, this command line will set “rq_affinity” to zero for all 10 NVMe devices in an L80v2 VM:

   ```console
   for i in `seq 0 9`; do echo 0 >/sys/block/nvme${i}n1/queue/rq_affinity; done
   ```

   Also note that the best performance is obtained when I/O is done directly to each of the raw NVMe devices with no partitioning, no file systems, no RAID 0 config, etc. Before starting a testing session, ensure the configuration is in a known fresh/clean state by running `blkdiscard` on each of the NVMe devices.
   
## Next steps

* See specifications for all [VMs optimized for storage performance](sizes-storage.md) on Azure
