**Standard managed virtual machine disks**

| Standard Disk Type  | S4               | S6               | S10             | S15 | S20              | S30              | S40              | S50              | S60              | S70              | S80              |
|---------------------|---------------------|---------------------|------------------|------------------|------------------|------------------|------------------|------------------|------------------|------------------|------------------|
| Disk size           | 32 GB            | 64 GB            | 128 GB           | 256 GiB | 512 GB           | 1,024 GiB (1 TiB)   | 2,048 GiB (2TB)    | 4,095 GiB (4 TiB)   | 8,192 GiB (8 TiB)    | 16,384 GiB (16 TiB)    | 32,767 GiB (32 TiB)    |
| IOPS per disk       | 500              | 500              | 500              | 500 | 500              | 500              | 500             | 500              | 1,300              | 2,000              | 2,000              |
| Throughput per disk | 60 MiB/sec | 60 MiB/sec | 60 MiB/sec | 60 MiB/sec | 60 MiB/sec | 60 MiB/sec | 60 MiB/sec | 60 MiB/sec| 300 MiB/sec | 500 MiB/sec | 500 MiB/sec |

**Premium managed virtual machine disks: per disk limits**

| Premium Disks Type  | P4    | P6    | P10   | P15   | P20   | P30   | P40   | P50   | P60   | P70   | P80   |
|---------------------|-------|-------|-------|-------|-------|-------|-------|-------|
| Disk size           | 32 GiB | 64 GiB | 128 GiB| 256 GiB |512 GB            | 1,024 GiB (1 TiB)    | 2,048 GiB (2 TiB)    | 4,095 GiB (4 TiB)    | 8,192 GiB (8 TiB)    | 16,384 GiB (16 TiB)    | 32,767 GiB (32 TiB)    |
| IOPS per disk       | 120   | 240   | 500   | 1100   | 2300              | 5000              | 7500              | 7500              | 12,500              | 15,000              | 20,000              |
| Throughput per disk | 25 MiB/sec | 50 MiB/sec  | 100 MiB/sec | 125MB/sec | 150 MiB/sec | 200 MiB/sec | 250 MiB/sec | 250 MiB/sec | 480 MiB/sec | 750 MiB/sec | 750 MiB/sec |

**Premium managed virtual machine disks: per VM limits**

| Resource | Default Limit |
| --- | --- |
| Max IOPS Per VM |80,000 IOPS with GS5 VM |
| Max throughput per VM |2,000 MB/s with GS5 VM |
