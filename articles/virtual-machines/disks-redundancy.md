---
title: ZRS for managed disks
description: Learn about ZRS for managed disks
author: roygara
ms.author: rogarana
ms.date: 02/12/2021
ms.topic: how-to
ms.service: virtual-machines
ms.subservice: disks
---

ZRS disks synchronously write data to three Availability Zones in a region, providing higher durability and availability than our locally redundant storage (LRS) disks. However, the write latency for LRS disks is better than ZRS because LRS disks synchronously write data to three copies in a data center. Hence, we recommend ZRS disks for workloads when write latency is less critical than durability and availability achieved by data redundancy in multiple zones. ZRS option is supported for only Premium SSD and Standard SSD disks.  

 

You can achieve better availability for VMs using LRS disks by leveraging applications like SQL Always On to synchronously write data to two zones and automatically failover to another zone during a disaster.  However, suppose you are using industry-specific proprietary software, legacy applications such as an old version of SQL, Cassandra, etc., that don't support application-level synchronous writes across zones. In that case, you can leverage ZRS disks for better availability. In the event of an entire zone going down due to hardware failures or natural disasters, when your virtual machines become unavailable in the zone, you can attach ZRS disks to a VM in another zone. You can also attach a shared ZRS disk to a standby VM in a secondary zone in deallocated state. In the event of a failure in the primary zone, you can quickly start the standby VM and make it active using SCSI persistent reservation.  

 

You can also leverage ZRS disks for shared disks attached to failover clusters where disks are shared with multiple VMs such as SQL failover cluster instance (FCI), SAP ASCS. We allow you to attach a shared ZRS disk to VMs spread on multiple zones to help you take advantage of both ZRS disks and Availability Zones for VMs for higher availability.  