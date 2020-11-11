---
 title: include file
 description: include file
 services: virtual-machines
 author: roygara
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 10/22/2020
 ms.author: rogarana
 ms.custom: include file
---

Azure Disk Storage offers built-in bursting capabilities to provide higher performance for handling short-term unexpected traffic. Premium SSDs have the flexibility to increase disk performance without increasing the actual disk size. This capability allows you to match your workload performance needs and reduce costs. 

> [!NOTE]
> This feature is currently in preview. 

This feature is ideal for events that temporarily require a consistently higher level of performance, like holiday shopping, performance testing, or running a training environment. To handle these events, you can use a higher performance tier for as long as you need it. You can then return to the original tier when you no longer need the additional performance.

## How it works

When you first deploy or provision a disk, the baseline performance tier for that disk is set based on the provisioned disk size. You can use a higher performance tier to meet higher demand. When you no longer need that performance level, you can return to the initial baseline performance tier.

Your billing changes as your tier changes. For example, if you provision a P10 disk (128 GiB), your baseline performance tier is set as P10 (500 IOPS and 100 MBps). You'll be billed at the P10 rate. You can upgrade the tier to match the performance of P50 (7,500 IOPS and 250 MBps) without increasing the disk size. During the time of the upgrade, you'll be billed at the P50 rate. When you no longer need the higher performance, you can return to the P10 tier. The disk will once again be billed at the P10 rate.

| Disk size | Baseline performance tier | Can be upgraded to |
|----------------|-----|-------------------------------------|
| 4 GiB | P1 | P2, P3, P4, P6, P10, P15, P20, P30, P40, P50 |
| 8 GiB | P2 | P3, P4, P6, P10, P15, P20, P30, P40, P50 |
| 16 GiB | P3 | P4, P6, P10, P15, P20, P30, P40, P50 | 
| 32 GiB | P4 | P6, P10, P15, P20, P30, P40, P50 |
| 64 GiB | P6 | P10, P15, P20, P30, P40, P50 |
| 128 GiB | P10 | P15, P20, P30, P40, P50 |
| 256 GiB | P15 | P20, P30, P40, P50 |
| 512 GiB | P20 | P30, P40, P50 |
| 1 TiB | P30 | P40, P50 |
| 2 TiB | P40 | P50 |
| 4 TiB | P50 | None |
| 8 TiB | P60 |  P70, P80 |
| 16 TiB | P70 | P80 |
| 32 TiB | P80 | None |

For billing information, see [Managed disk pricing](https://azure.microsoft.com/pricing/details/managed-disks/).