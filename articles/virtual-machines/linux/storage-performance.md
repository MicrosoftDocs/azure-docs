---
title: Optimizing performance on the Lsv2-series Virtual Machines - Storage | Microsoft Docs
description: Lists the different compute optimized sizes available for Linux virtual machines in Azure. Lists information about the number of vCPUs, data disks and NICs as well as storage throughput and network bandwidth for sizes in this series.
services: virtual-machines-linux
author: 
manager: jeconnoc
tags: 

ms.assetid: 
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 04/01/2019
ms.author: 

---

Increase your performance on storage optimized virtual machines
Joel Pelley, Azure Compute, Virtual Machines

Lsv2-series virtual machines support a variety of workloads that need high I/O and throughput on local storage across a wide range of applications and industries.  The Lsv2-series is ideal for Big Data, SQL, NoSQL databases, data warehousing and large transactional databases, including Cassandra, MongoDB, Cloudera, and Redis.

## TODO
As part of designing the Lsv2-series Virtual Machines (VMs) we worked closely with AMD to maximize the performance and synergy between the processor, memory, NVMe devices and the VMs.  We also worked closely with both the Windows and Linux communities to understand their needs and opportunities to make sure the software was being tuned for performance together with the hardware.

This resulted in the optimized version of Windows Server 2019 Datacenter and Canonical’s Ubuntu 18.04 and 16.04, released in early December 2018 to the Azure Marketplace, which supports maximum performance on the NVMe devices in Lsv2-series VMs.  We are continuing to work with the Linux community to bring more distributions optimized for Lsv2-series performance into the Azure Marketplace and will provide updates soon.
Our customers have also approached us to find out how they could architect or tune their workloads and applications for Lsv2-series VMs.  Their goals is to make sure that they are able to achieve the maximum performance designed into the VMs.  In response, we have collected this list of tips to help you maximize your performance on the Lsv2-series in your specific workloads and applications.
We will continue to update this information as we bring additional tips for application and workload improvements.  We will continue to provide updates when we add new images in the Azure Marketplace that support optimized Lsv2-series performance.

Utilizing the Local NVMe Storage
The local storage on the 1.92TB NVMe disk on all Lsv2 VMs is ephemeral.  During a successful standard reboot of the VM the data on the local NVMe disk will persist.  The data will not continue to persist on the NVMe if the VM is redeployed, deallocated or deleted or another issue causes the VM, or the hardware it is running on, to become unhealthy.  When this happens, any data on the old host is securely erased.
There will also be cases when the VM needs to be moved to a different host machine, such as during a planned maintenance operation.  Azure is able to anticipate some hardware failures and all planned maintenance operations.  This information is provided via Scheduled Events. It is recommended to use Scheduled Events to stay updated on predicted maintenance and recovery operations.
In the case that a planned maintenance event requires the VM to be recreated on a new host with empty local disks, the data will need to be resynchronized (again, with any data on the old host being securely erased).  This occurs because Lsv2 does not currently support Live Migration on the local NVMe disk.  
Today, there are 2 modes for planned maintenance:
1.	Standard VM Customer controlled maintenance
a.	The VM is moved to an updated host during a ~30-day window 
b.	Lsv2 ephemeral data could be lost, so backing-up data prior to the event is recommended

2.	Automatic maintenance 
a.	Occurs if the customer does not execute #1 or in the event of emergency procedures such as a security zero-day event 
b.	Azure’s intent is to preserve customer data, but there is a small risk of a VM freeze or reboot
c.	Lsv2 ephemeral data could be lost, so backing-up data prior to the event is recommended

We recommend for any upcoming service events that you take advantage of the controlled maintenance process to select the time most convenient to you for the update to be performed.  Prior to the event, you may back-up your data in premium storage.  After the maintenance event completes, you can return your data to the refreshed Lsv2 VMs local NVMe storage.
•	VM states that maintain the data on the local NVMe disks includes:
o	VM is running and healthy
o	VM is rebooted in place (by you or Azure)
o	VM is paused (stopped without deallocation)
o	The majority of the planned maintenance servicing operations

•	VM states that securely erase the data to protect the customer include:
o	VM is redeployed, stopped (deallocated), or deleted (by you)
o	VM becomes unhealthy and has to service heal to another node due to a hardware issue
o	A small number of the planned maintenance servicing operations, that require the VM to be reallocated to another host for servicing

For more information on options for backing up the data in the Local Storage on the NVMe in Lsv2, please follow this link:  https://docs.microsoft.com/en-us/azure/virtual-machines/windows/backup-and-disaster-recovery-for-azure-iaas-disks
For more information on Azure’s Scheduled Events program, please follow this link:  https://docs.microsoft.com/en-us/azure/virtual-machines/windows/scheduled-events

AMD EYPC Chipset Architecture
Lsv2 series is using AMD EPYC server processors based on the Zen microarchitecture. AMD developed Infinity Fabric (IF) for EPYC as scalable interconnect for its NUMA model that could be used for on-die, on-package, and multi-package communications. Compared with QPI (Quick-Path Interconnect) and UPI (Ultra-Path Interconnect) used on Intel modern monolithic-die processors, AMD’s many-NUMA small-die architecture may bring both performance benefits as well as challenges.  The actual impact of memory bandwidth and latency constraints could vary depending on the type of workloads running.

Tips for Maximizing Performance on Lsv2-Series VMs
1.	The hardware that powers the Lsv2-series VMs utilizes NVMe devices with 8 I/O Queue Pairs (QP)s.  Every NVMe device I/O queue is actually a pair (submission queue and completion queue).The NVMe driver is setup to optimize the utilization of these 8 I/O QPs by distributing I/O’s in a round robin manner.  One tip to gain max performance is to run 8 jobs per device to match.

2.	Avoid mixing NVMe admin commands (e.g. NVMe SMART info query etc.) with NVMe I/O commands during active workloads. Lv2 NVMe devices are backed by Hyper-V NVMe Direct technology, which will switch into “slow mode” whenever any NVMe admin commands are pending.  Lv2 users could see a dramatic performance drop in NVMe I/O performance if that happens.

3.	Lv2 user should not rely on device NUMA information (all 0) reported from within the VM for data drives to decide the NUMA affinity for their apps. The recommended way for better performance is to spread workloads across CPUs if possible.   (Azure will address VM device NUMA issue in the future).

4.	The maximum supported queue depth per I/O queue pair for Lv2 VM NVME device is 1024 (vs. Amazon i3 QD 32 limit). Lv2 users should limit their (synthetic) benchmarking workloads to queue depth 1024 or lower to avoid triggering queue full conditions, which can reduce performance.

Frequently Asked Questions (FAQ)
1.	How do I start deploying Lsv2-series VMs?
Much like any other VM in GA for Azure, the customer can go to the Portal or CLI to make the request for Lsv2 in the available regions.  

2.	Are the Lsv2-series VMs available globally?
At this time, they are available only in four regions (East US, East US 2, West Europe and SE Asia), and we will be expanding capacity and availability globally throughout 2019 and 2020.  We plan to add West US 2 and North Europe in H1 CY19 and will continue to announce additional regions in 2019 and 2020.

3.	Will a single NVMe disk failure cause all VMs on the host to fail?
Today, if a disk failure is detected on the hardware node, the hardware is in a failed state.  When this occurs, all VMs on the node are automatically deallocated and moved to a healthy node.  In the case of Lsv2, this means that the customer’s data on the failing node is also securely erased and will need to be recreated by the customer on the new node.  As noted, before when Live Migration becomes available on Lsv2, the data on the failing node will be proactively moved with the VMs as they are transferred to another node.

On Windows
4.	Do I need to make Polling adjustments in Windows in WS2012 or WS2016?
NVMe Polling is only available on WS2019 on Azure.  

5.	Can I switch back to a traditional ISR model?
Lsv2 has been optimized for NVMe Polling and updates will continue to be added throughout 2019 to continue to boost performance.

6.	Can I tweak the Polling settings in WS2019?
The polling settings are not user adjustable.

On Linux

7.	Do I need to make any tweaks to rq_affinity for perf?
The rq_affinity setting is a minor tweak when going for the absolute maximum IOPS.  Get everything else working well first, and then see if setting rq_affinity to 0 makes a difference.

8.	Do I need to change the blk_mq settings?
RHEL/CentOS 7.x automatically uses blk-mq for the NVMe devices.  No configuration changes or settings are necessary.  The scsi_mod.use_blk_mq setting is for SCSI only and was used during Lv2 Preview because the NVMe devices were visible in the guest VMs as SCSI devices.  But for Lv2 GA, the NVMe devices are visible as NVMe devices, so the SCSI blk-mq setting is irrelevant.

9.	Do I need to change “fio”?
To get maximum IOPS with a performance measuring tool like ‘fio’ in the L64v2 and L80v2 VM sizes, we recommend setting “rq_affinity” to 0 on each NVMe device.  For example, this command line will set “rq_affinity” to zero for all 10 NVMe devices in an L80v2 VM:

# for i in `seq 0 9`; do echo 0 >/sys/block/nvme${i}n1/queue/rq_affinity; done
  
Also note that the best performance is obtained when I/O is done directly to each of the raw NVMe devices with no partitioning, no file systems, no RAID 0 config, etc.   Before starting a testing session, ensure the configuration is in a known fresh/clean state by running blkdiscard on each of the NVMe devices.
