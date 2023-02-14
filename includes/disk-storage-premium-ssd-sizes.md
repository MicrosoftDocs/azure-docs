---
 title: include file
 description: include file
 services: virtual-machines
 author: roygara
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 02/14/2023
 ms.author: rogarana
 ms.custom: include file
---

| Premium SSD sizes | P1 | P2 | P3 | P4 | P6 | P10 | P15 | P20 | P30 | P40 | P50 | P60 | P70 | P80 |
|-------------------|----|----|----|----|----|-----|-----|-----|-----|-----|-----|------|------|------|
| Disk size in GiB | 4 | 8 | 16 | 32 | 64 | 128 | 256 | 512 | 1,024 | 2,048 | 4,096 | 8,192 | 16,384 | 32,767 |
| Base provisioned IOPS per disk | 120 | 120 | 120 | 120 | 240 | 500 | 1,100 | 2,300 | 5,000 | 7,500 | 7,500 | 16,000 | 18,000 | 20,000 |
| Expanded provisioned IOPS per disk | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | 8,000 | 16,000 | 20,000 | 20,000 | 20,000 | 20,000 |
| Base provisioned Throughput per disk | 25 MB/sec | 25 MB/sec | 25 MB/sec | 25 MB/sec | 50 MB/sec | 100 MB/sec | 125 MB/sec | 150 MB/sec | 200 MB/sec | 250 MB/sec | 250 MB/sec| 500 MB/sec | 750 MB/sec | 900 MB/sec |
| Expanded provisioned Throughput per disk | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | 300 MB/sec | 600 MB/sec | 900 MB/sec| 900 MB/sec | 900 MB/sec | 900 MB/sec |
| Max burst IOPS per disk | 3,500 | 3,500 | 3,500 | 3,500 | 3,500 | 3,500 | 3,500 | 3,500 | 30,000* | 30,000* | 30,000* | 30,000* | 30,000* | 30,000* |
| Max burst throughput per disk | 170 MB/sec | 170 MB/sec | 170 MB/sec | 170 MB/sec | 170 MB/sec | 170 MB/sec | 170 MB/sec | 170 MB/sec | 1,000 MB/sec* | 1,000 MB/sec* | 1,000 MB/sec* | 1,000 MB/sec* | 1,000 MB/sec* | 1,000 MB/sec* |
| Max burst duration | 30 min  | 30 min  | 30 min  | 30 min  | 30 min  | 30 min  | 30 min  | 30 min  | Unlimited* | Unlimited* | Unlimited* | Unlimited* | Unlimited* | Unlimited* |
| Eligible for reservation | No  | No  | No  | No  | No  | No  | No  | No  | Yes, up to one year | Yes, up to one year | Yes, up to one year | Yes, up to one year | Yes, up to one year | Yes, up to one year |

\*Applies only to disks with on-demand bursting enabled.