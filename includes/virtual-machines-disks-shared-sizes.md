---
 title: include file
 description: include file
 services: virtual-machines
 author: roygara
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 10/14/2022
 ms.author: rogarana
 ms.custom: include file
---

For now, only ultra disks, premium SSD v2, premium SSD, and standard SSDs can enable shared disks. Different disk sizes may have a different `maxShares` limit, which you can't exceed when setting the `maxShares` value.

For each disk, you can define a `maxShares` value that represents the maximum number of nodes that can simultaneously share the disk. For example, if you plan to set up a 2-node failover cluster, you would set `maxShares=2`. The maximum value is an upper bound. Nodes can join or leave the cluster (mount or unmount the disk) as long as the number of nodes is lower than the specified `maxShares` value.

> [!NOTE]
> The `maxShares` value can only be set or edited when the disk is detached from all nodes.

### Premium SSD ranges

The following table illustrates the allowed maximum values for `maxShares` by premium SSD sizes:

|Disk sizes  |maxShares limit  |
|---------|---------|
|P1,P2,P3,P4,P6,P10,P15,P20     |3         |
|P30, P40, P50     |5         |
|P60, P70, P80     |10         |

The IOPS and bandwidth limits for a disk aren't affected by the `maxShares` value. For example, the max IOPS of a P15 disk is 1100 whether maxShares = 1 or maxShares > 1.

### Standard SSD ranges

The following table illustrates the allowed maximum values for `maxShares` by standard SSD sizes:

|Disk sizes  |maxShares limit  |
|---------|---------|
|E1,E2,E3,E4,E6,E10,E15,E20     |3         |
|E30, E40, E50     |5         |
|E60, E70, E80     |10         |

The IOPS and bandwidth limits for a disk aren't affected by the `maxShares` value. For example, the max IOPS of a E15 disk is 500 whether maxShares = 1 or maxShares > 1.

### Ultra disk ranges

The minimum `maxShares` value is 1, while the maximum `maxShares` value is 15. There are no size restrictions on ultra disks, any size ultra disk can use any value for `maxShares`, up to and including the maximum value.

### Premium SSD v2 ranges

The minimum `maxShares` value is 1, while the maximum `maxShares` value is 15. There are no size restrictions on Premium SSD v2, any size Premium SSD v2 disk can use any value for `maxShares`, up to and including the maximum value.
