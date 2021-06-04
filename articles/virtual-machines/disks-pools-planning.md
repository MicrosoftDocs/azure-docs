---
title: Planning for Azure disk pools
description: Learn how to approach an Azure disk pool.
author: roygara
ms.service: virtual-machines
ms.topic: conceptual
ms.date: 06/02/2021
ms.author: rogarana
ms.subservice: disks
---

# Disk pools planning guide

Before you deploy a disk pool, it is important to identify the performance requirements of your workload. Determining your requirements in advance allows you to get the most performance out of your disk pool. The performance of a disk pool is determined by three main factors: The disk pool's scalability target, the scalability targets for individual disks contained in the disk pool, and the networking configuration that connects the clients to the disk pool. Adjusting these three factors will tweak the performance you get from a disk pool.

## Optimize for low latency

If you're prioritizing low latency, use ultra disks inside your disk pool. Ultra disks allow for sub-ms latency disk IO. You must also evaluate your network configuration and ensure it's using the most optimal path. Your clients should be in the same virtual network as the disk pool, and if you're using ExpressRoute, consider using ExpressRoute FastPath to minimize network latency.

## Optimize for high throughput

If you're prioritizing throughput, begin by evaluating the number of disk pools required to deliver your throughput targets. Once you have the necessary targets, you can split it amongst each individual disk and their types. Currently, two disk types can be used in a disk pool, premium SSDs and ultra disks. Premium SSDs can deliver high IOPS and MBps that scales with their storage capacity, whereas ultra disks can scale their performance independent of their storage capacity. Select the type that is the best fit for your cost and performance balance. Also, confirm your network connectivity from your clients to the disk pool is not a bottleneck.


## Use cases

The following table lists some typical use cases for disk pools with Azure VMware Solution (AVS) and a recommended configuration.


|AVS use cases  |Suggested disk type  |Suggested network configuration  |
|---------|---------|---------|
|Block storage for active working sets, an extension of AVS vSAN.     |Ultra disks         |Use Express Route virtual network gateway: Ultra Performance or ErGw3AZ (10Gbps) to connect the disk pool virtual network to the AVS cloud and enable FastPath to minimize network latency.         |
|Tiering - tier infrequently accessed data from the AVS vSAN to the disk pool.     |Premium SSD         |Use Express Route virtual network gateway: Standard (1Gbps) or High Performance (2Gpbs) to connect the disk pool virtual network to the AVS cloud.         |
|Data storage for disaster recovery site on AVS - replicate data from on-premises or primary VMWare environment to the disk pool as a secondary site.     |Premium SSD         |Use Express Route virtual network gateway: Standard (1Gbps) or High Performance (2Gpbs) to connect the disk pool virtual network to the AVS cloud.         |

Refer to the [Networking planning checklist for Azure VMware Solution](../azure-vmware/tutorial-network-checklist.md) to plan for your networking setup, along with other AVS considerations.

## Disk pool scalability and performance targets

|Resource  |Limit  |
|---------|---------|
|Maximum number of disks per disk pool|32|
|Maximum IOPS per disk pool|25,600|
|Maximum number of iSCSI initiators|16|

### Scale targets example

The following example should give you an idea how all the different performance factors work together:

As an example, if we provisioned two 1 TiB premium SSDs (P30, with a provisioned target of 5000 IOPS and 200 Mbps) into a disk pool, we could achieve 2 x 5000 IOPS but our throughput would be capped at 384 MBps by the disk pool itself. To exceed this 384 MBps limit, we would have to use four 1 TiB P30 premium SSDs and two different disk pools. Two different disk pools would allow us to achieve 384 MBps per each disk pool.    

## Next steps

- [Write concepts](contribute-how-to-write-concept.md)
- [Links](links-how-to.md)