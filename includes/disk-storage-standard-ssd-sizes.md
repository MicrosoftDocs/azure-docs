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

| Standard SSD sizes | E1 | E2 | E3 | E4 | E6 | E10 | E15 | E20 | E30 | E40 | E50 | E60 | E70 | E80 |
|--------------------|----|----|----|----|----|-----|-----|-----|-----|-----|-----|------|------|------|
| Disk size in GiB | 4 | 8 | 16 | 32 | 64 | 128 | 256 | 512 | 1,024 | 2,048 | 4,096 | 8,192 | 16,384 | 32,767 |
| Base IOPS per disk | Up to 500 | Up to 500 | Up to 500 | Up to 500 | Up to 500 | Up to 500 | Up to 500 | Up to 500 | Up to 500 | Up to 500 | Up to 500 | Up to 2,000 | Up to 4,000 | Up to 6,000 |
| *Expanded IOPS per disk | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Up to 1,500 | Up to 3,000 | Up to 6,000 | Up to 6,000 | Up to 6,000 | Up to 6,000 |
| Base throughput per disk |  Up to 60 MB/sec | Up to 60 MB/sec | Up to 60 MB/sec | Up to 60 MB/sec |  Up to 60 MB/sec  |  Up to 60 MB/sec | Up to 60 MB/sec | Up to 60 MB/sec | Up to 60 MB/sec | Up to 60 MB/sec | Up to 60 MB/sec| Up to 400 MB/sec |  Up to 600 MB/sec | Up to 750 MB/sec |
| *Expanded throughput per disk |  N/A | N/A | N/A | N/A |  N/A  |  N/A | N/A | N/A | Up to 150 MB/sec | Up to 300 MB/sec | Up to 600 MB/sec| Up to 750 MB/sec |  Up to 750 MB/sec | Up to 750 MB/sec |
| Max burst IOPS per disk | 600 | 600 | 600 | 600 | 600 | 600 | 600 | 600 | 1000 |
| Max burst throughput per disk | 150 MB/sec | 150 MB/sec | 150 MB/sec | 150 MB/sec | 150 MB/sec | 150 MB/sec | 150 MB/sec | 150 MB/sec | 250 MB/sec |
| Max burst duration | 30 min  | 30 min  | 30 min  | 30 min  | 30 min  | 30 min  | 30 min  | 30 min  | 30 min |

\* Only applies to disks with performance plus enabled.