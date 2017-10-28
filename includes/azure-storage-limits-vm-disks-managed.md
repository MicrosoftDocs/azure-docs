**Standard managed virtual machine disks**

| Standard Disk Type  | S4               | S6               | S10              | S20              | S30              | S40              | S50              | 
|---------------------|---------------------|---------------------|------------------|------------------|------------------|------------------|------------------| 
| Disk size           | 32 GB            | 64 GB            | 128 GB           | 512 GB           | 1024 GB (1 TB)   | 2048 GB (2TB)    | 4095 GB (4 TB)   | 
| IOPS per disk       | 500              | 500              | 500              | 500              | 500              | 500             | 500              | 
| Throughput per disk | 60 MB/sec | 60 MB/sec | 60 MB/sec | 60 MB/sec | 60 MB/sec | 60 MB/sec | 60 MB/sec | 

**Premium managed virtual machine disks: per disk limits**

| Premium Disks Type  | P4    | P6    | P10   | P20   | P30   | P40   | P50   | 
|---------------------|-------|-------|-------|-------|-------|-------|-------|
| Disk size           | 32 GB | 64 GB | 128 GB| 512 GB            | 1024 GB (1 TB)    | 2048 GB (2 TB)    | 4095 GB (4 TB)    | 
| IOPS per disk       | 120   | 240   | 500   | 2300              | 5000              | 7500              | 7500              | 
| Throughput per disk | 25 MB/sec | 50 MB/sec  | 100 MB/sec | 150 MB/sec | 200 MB/sec | 250 MB/sec | 250 MB/sec |

**Premium managed virtual machine disks: per VM limits**

| Resource | Default Limit |
| --- | --- |
| Max IOPS Per VM |80,000 IOPS with GS5 VM<sup>1</sup> |
| Max throughput per VM |2,000 MB/s with GS5 VM<sup>1</sup> |

<sup>1</sup>Refer to [VM Size](../articles/virtual-machines/linux/sizes.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) for limits on other VM sizes. 
