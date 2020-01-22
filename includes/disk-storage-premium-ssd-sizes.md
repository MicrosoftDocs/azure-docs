---
 title: include file
 description: include file
 services: virtual-machines
 author: roygara
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 10/24/2019
 ms.author: rogarana
 ms.custom: include file
---

| Premium SSD sizes | P1* | P2* | P3* | P4 | P6 | P10 | P15 | P20 | P30 | P40 | P50 | P60 | P70 | P80 |
|-------------------|----|----|----|----|----|-----|-----|-----|-----|-----|-----|------|------|------|
| Disk size in GiB | 4 | 8 | 16 | 32 | 64 | 128 | 256 | 512 | 1,024 | 2,048 | 4,096 | 8,192 | 16,384 | 32,767 |
| IOPS per disk | 120 | 120 | 120 | 120 | 240 | 500 | 1,100 | 2,300 | 5,000 | 7,500 | 7,500 | 16,000 | 18,000 | 20,000 |
| Throughput per disk | 25 MiB/sec | 25 MiB/sec | 25 MiB/sec | 25 MiB/sec | 50 MiB/sec | 100 MiB/sec | 125 MiB/sec | 150 MiB/sec | 200 MiB/sec | 250 MiB/sec | 250 MiB/sec| 500 MiB/sec | 750 MiB/sec | 900 MiB/sec |
| Max burst IOPS per disk** | 3,500 | 3,500 | 3,500 | 3,500 | 3,500 | 3,500 | 3,500 | 3,500 |
| Max burst throughput per disk** | 170 MiB/sec | 170 MiB/sec | 170 MiB/sec | 170 MiB/sec | 170 MiB/sec | 170 MiB/sec | 170 MiB/sec | 170 MiB/sec |
| Max burst duration** | 30 min  | 30 min  | 30 min  | 30 min  | 30 min  | 30 min  | 30 min  | 30 min  |

\*Denotes a disk size that is currently in preview, for regional availability information see [New disk sizes: Managed and unmanaged](https://docs.microsoft.com/azure/virtual-machines/linux/faq-for-disks#new-disk-sizes-managed-and-unmanaged).  
\*\*Denotes a feature that is currently in preview, see [Disk bursting](https://docs.microsoft.com/azure/virtual-machines/linux/disk-bursting#regional-availability) for more information.
