---
title: Planning for Azure disk pools
description: Learn how to approach an Azure disk pool.
author: roygara
ms.service: virtual-machines
ms.topic: conceptual
ms.date: 05/18/2021
ms.author: rogarana
ms.subservice: disks
---

# Disk pools planning guide

Before you deploy a disk pool, it is important to identify the performance requirements of your workload. Determining your requirements in advance allows you to get the most performance out of your disk pool. The performance of a disk pool is determined by three main factors: The disk pool's scalability target, the scalability targets for individual disks contained in the disk pool, and the networking configuration that connects the clients to the disk pool. Adjusting these three factors will tweak the performance you get from a disk pool. It is important to characterize the performance requirements of your workload based on latency and throughput.

## Optimize for low latency

If you're prioritizing low latency, use ultra disks inside your disk pool. Ultra disks will allow for sub-ms latency disk IO. You must also evaluate your network configuration and ensure it's using the most optimal path. Your clients should be in the same virtual network as the disk pool, and if you're using ExpressRoute, consider using ExpressRoute FastPath to minimize network latency.

## Optimize for high throughput

If you're prioritizing throughput, begin by evaluating the number of disk pools required to deliver your throughput targets. Once you have the necessary targets, you can split it amongst each individual disk and their types. Currently, two disk types can be used in a disk pool, premium SSDs and ultra disks. Premium SSDs can deliver high IOPS and MBps that scales with their storage capacity, whereas ultra disks can scale their performance independent of their storage capacity. Select the type that is the best fit for your cost and performance balance. Also, confirm your network connectivity from your clients to the disk pool is not a bottleneck.


## Disk pool scalability and performance targets


|Resource  |Limit  |
|---------|---------|
|Maximum number of disks per disk pool|32|
|Maximum IOPS per disk pool|25,600|
|Maximum number of iSCSI initiators|16|

## Next steps

- [Write concepts](contribute-how-to-write-concept.md)
- [Links](links-how-to.md)