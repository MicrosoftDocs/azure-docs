**Premium unmanaged virtual machine disks: per account limits**

| Resource | Default Limit |
| --- | --- |
| Total disk capacity per account |35 TB |
| Total snapshot capacity per account |10 TB |
| Max bandwidth per account (ingress + egress<sup>1</sup>) |<=50 Gbps |

<sup>1</sup>*Ingress* refers to all data (requests) being sent to a storage account. *Egress* refers to all data (responses) being received from a storage account.

**Premium unmanaged virtual machine disks: per disk limits**

| Premium Storage Disk Type | P10 | P20 | P30 |
| --- | --- | --- | --- |
| Disk size |128 GiB |512 GiB |1024 GiB (1 TB) |
| Max IOPS per disk |500 |2300 |5000 |
| Max throughput per disk |100 MB/s | 150 MB/s |200 MB/s |
| Max number of disks per storage account |280 |70 |35 |

**Premium unmanaged virtual machine disks: per VM limits**

| Resource | Default Limit |
| --- | --- |
| Max IOPS Per VM |80,000 IOPS with GS5 VM<sup>1</sup> |
| Max throughput per VM |2,000 MB/s with GS5 VM<sup>1</sup> |

<sup>1</sup>Refer to [VM Size](../articles/virtual-machines/linux/sizes.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) for limits on other VM sizes. 

