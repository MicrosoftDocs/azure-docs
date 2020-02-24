---
 title: include file
 description: include file
 services: virtual-machines
 author: roygara
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 02/18/2020
 ms.author: rogarana
 ms.custom: include file
---

For now, only premium SSDs can enable shared disks. The disk sizes that support this feature are P15 and greater. Different disk sizes may have a different `maxShares` limit, which you cannot exceed when setting the `maxShares` value.

For each disk, you can define a `maxShares` value that represents the maximum number of nodes that can simultaneously share the disk. For example, if you plan to set up a 2-node failover cluster, you would set `maxShares=2`. The maximum value is an upper bound. Nodes can join or leave the cluster (mount or unmount the disk) as long as the number of nodes is lower than the specified `maxShares` value.

> [!NOTE]
> The `maxShares` value can only be set or edited when the disk is detached from all nodes.

The following table illustrates the allowed maximum values for `maxShares` by disk size:

|Disk sizes  |maxShares limit  |
|---------|---------|
|P15, P20     |2         |
|P30, P40, P50     |5         |
|P60, P70, P80     |10         |

The IOPS and bandwidth limits for a disk are not affected by the `maxShares` value. For example, the max IOPS of a P15 disk are 1100 whether maxShares = 1 or maxShares > 1.