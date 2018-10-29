---
 title: include file
 description: include file
 services: virtual-machines
 author: roygara
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 09/24/2018
 ms.author: rogarana
 ms.custom: include file
---

**Standard managed virtual machine HDDs**

| Standard Disk Type  | S4               | S6               | S10             | S15 | S20              | S30              | S40              | S50              | S60              | S70              | S80              |
|---------------------|---------------------|---------------------|------------------|------------------|------------------|------------------|------------------|------------------|------------------|------------------|------------------|
| Disk size in GiB          | 32             | 64             | 128            | 256  | 512            | 1,024    | 2,048     | 4,095    | 8,192     | 16,384     | 32,767     |
| IOPS per disk       | Up to 500              | Up to 500              | Up to 500              | Up to 500 | Up to 500              | Up to 500              | Up to 500             | Up to 500              | Up to 1,300              | Up to 2,000              | Up to 2,000              |
| Throughput per disk | Up to 60 MiB/sec | Up to 60 MiB/sec | Up to 60 MiB/sec | Up to 60 MiB/sec | Up to 60 MiB/sec | Up to 60 MiB/sec | Up to 60 MiB/sec | Up to 60 MiB/sec| Up to 300 MiB/sec | Up to 500 MiB/sec | Up to 500 MiB/sec |

**Standard managed virtual machine SSDs**

| Standard SSD Disk Type  | E10               | E15               | E20             | E30 | E40              | E50              | E60              | E70              | E80              |
|---------------------|---------------------|---------------------|------------------|------------------|------------------|------------------|------------------|------------------|------------------|
| Disk size in GiB           | 128             | 256             | 512            | 1,024  | 2,048            | 4,095     | 8,192     | 16,384     | 32,767    |
| IOPS per disk       | Up to 500              | Up to 500              | Up to 500              | Up to 500 | Up to 500              | Up to 500              | Up to 500             | Up to 500              | Up to 1,300              | Up to 2,000              | Up to 2,000              |
| Throughput per disk | Up to 60 MB/sec | Up to 60 MB/sec | Up to 60 MB/sec | Up to 60 MB/sec | Up to 60 MB/sec | Up to 60 MB/sec | Up to 60 MB/sec | Up to 60 MB/sec| Up to 300 MiB/sec |  Up to 500 MiB/sec | Up to 500 MiB/sec |

**Premium managed virtual machine disks: per disk limits**

| Premium Disk Type  | P4               | P6               | P10             | P15 | P20              | S30              | P40              | P50              | P60              | P70              | P80              |
|---------------------|---------------------|---------------------|------------------|------------------|------------------|------------------|------------------|------------------|------------------|------------------|------------------|
| Disk size in GiB           | 32             | 64             | 128            | 256  | 512            | 1,024    | 2,048     | 4,095    | 8,192     | 16,384     | 32,767     |
| IOPS per disk       | Up to 120 | Up to 240              | Up to 500              | Up to 1,100 | Up to 2,300              | Up to 5,000              | Up to 7,500             | Up to 7,500              | Up to 12,500              | Up to 15,000              | Up to 20,000              |
| Throughput per disk | Up to 25 MiB/sec | Up to 50 MiB/sec | Up to 100 MiB/sec | Up to 125 MiB/sec | Up to 150 MiB/sec | Up to 200 MiB/sec | Up to 250 MiB/sec | Up to 250 MiB/sec| Up to 480 MiB/sec | Up to 750 MiB/sec | Up to 750 MiB/sec |

**Premium managed virtual machine disks: per VM limits**

| Resource | Default Limit |
| --- | --- |
| Max IOPS Per VM |80,000 IOPS with GS5 VM |
| Max throughput per VM |2,000 MB/s with GS5 VM |
