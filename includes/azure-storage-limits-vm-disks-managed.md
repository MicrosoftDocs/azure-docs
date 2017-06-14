**Standard managed virtual machine disks**

| Standard Disk Type | S4 | S6 | S10 | S20 | S30 |
| --- | --- |--- | --- | --- | --- |
| Disk Size | 30 GB | 64 GB | 128 GB | 512 GB | 1024 GB (1 TB)|
| IOPS per disk | 500 |500 |500 |500 |500 |
| Throughput per disk | 60 MB/sec | 60 MB/sec | 60 MB/sec | 60 MB/sec | 60 MB/sec | 

**Premium managed virtual machine disks: per disk limits**

| Premium Storage Disk Type | P10 | P20 | P30 |
| --- | --- | --- | --- |
| Disk size |128 GiB |512 GiB |1024 GiB (1 TB) |
| Max IOPS per disk |500 |2300 |5000 |
| Max throughput per disk |100 MB/s |150 MB/s |200 MB/s |

**Premium managed virtual machine disks: per VM limits**

| Resource | Default Limit |
| --- | --- |
| Max IOPS Per VM |80,000 IOPS with GS5 VM<sup>1</sup> |
| Max throughput per VM |2,000 MB/s with GS5 VM<sup>1</sup> |

<sup>1</sup>Refer to [VM Size](../articles/virtual-machines/linux/sizes.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) for limits on other VM sizes. 
