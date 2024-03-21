---
 title: include file
 description: include file
 author: roygara
 ms.service: azure-disk-storage
 ms.topic: include
 ms.date: 03/16/2023
 ms.author: rogarana
 ms.custom: include file
---

| Premium SSD sizes | P1 | P2 | P3 | P4 | P6 | P10 | P15 | P20 | P30 | P40 | P50 | P60 | P70 | P80 |
|-------------------|----|----|----|----|----|-----|-----|-----|-----|-----|-----|------|------|------|
| Disk size in GiB | 4 | 8 | 16 | 32 | 64 | 128 | 256 | 512 | 1,024 | 2,048 | 4,096 | 8,192 | 16,384 | 32,767 |
| Base provisioned IOPS per disk | 120 | 120 | 120 | 120 | 240 | 500 | 1,100 | 2,300 | 5,000 | 7,500 | 7,500 | 16,000 | 18,000 | 20,000 |
| **Expanded provisioned IOPS per disk | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | 8,000 | 16,000 | 20,000 | 20,000 | 20,000 | 20,000 |
| Base provisioned Throughput per disk | 25 MB/s | 25 MB/s | 25 MB/s | 25 MB/s | 50 MB/s | 100 MB/s | 125 MB/s | 150 MB/s | 200 MB/s | 250 MB/s | 250 MB/s| 500 MB/s | 750 MB/s | 900 MB/s |
| **Expanded provisioned throughput per disk | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | 300 MB/s | 600 MB/s | 900 MB/s| 900 MB/s | 900 MB/s | 900 MB/s |
| Max burst IOPS per disk | 3,500 | 3,500 | 3,500 | 3,500 | 3,500 | 3,500 | 3,500 | 3,500 | 30,000* | 30,000* | 30,000* | 30,000* | 30,000* | 30,000* |
| Max burst throughput per disk | 170 MB/s | 170 MB/s | 170 MB/s | 170 MB/s | 170 MB/s | 170 MB/s | 170 MB/s | 170 MB/s | 1,000 MB/s* | 1,000 MB/s* | 1,000 MB/s* | 1,000 MB/s* | 1,000 MB/s* | 1,000 MB/s* |
| Max burst duration | 30 min  | 30 min  | 30 min  | 30 min  | 30 min  | 30 min  | 30 min  | 30 min  | Unlimited* | Unlimited* | Unlimited* | Unlimited* | Unlimited* | Unlimited* |
| Eligible for reservation | No  | No  | No  | No  | No  | No  | No  | No  | Yes, up to one year | Yes, up to one year | Yes, up to one year | Yes, up to one year | Yes, up to one year | Yes, up to one year |

\*Applies only to disks with on-demand bursting enabled.<br>
\** Only applies to disks with performance plus (preview) enabled.