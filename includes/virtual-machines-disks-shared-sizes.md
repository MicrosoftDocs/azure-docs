---
 title: include file
 description: include file
 services: virtual-machines
 author: roygara
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 04/06/2020
 ms.author: rogarana
 ms.custom: include file
---

For now, only ultra disks and premium SSDs can enable shared disks. Different disk sizes may have a different `maxShares` limit, which you cannot exceed when setting the `maxShares` value. For premium SSDs, the disk sizes that support sharing their disks are P15 and greater.

For each disk, you can define a `maxShares` value that represents the maximum number of nodes that can simultaneously share the disk. For example, if you plan to set up a 2-node failover cluster, you would set `maxShares=2`. The maximum value is an upper bound. Nodes can join or leave the cluster (mount or unmount the disk) as long as the number of nodes is lower than the specified `maxShares` value.

> [!NOTE]
> The `maxShares` value can only be set or edited when the disk is detached from all nodes.

### Premium SSD ranges

The following table illustrates the allowed maximum values for `maxShares` by premium disk sizes:

|Disk sizes  |maxShares limit  |
|---------|---------|
|P15, P20     |2         |
|P30, P40, P50     |5         |
|P60, P70, P80     |10         |

The IOPS and bandwidth limits for a disk are not affected by the `maxShares` value. For example, the max IOPS of a P15 disk is 1100 whether maxShares = 1 or maxShares > 1.

### Ultra disk ranges

The minimum `maxShares` value is 1, while the maximum `maxShares` value is 5. There are no size restrictions on ultra disks, any size ultra disk can use any value for `maxShares`, up to and including the maximum value.