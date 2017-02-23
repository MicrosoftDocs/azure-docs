


## F-series


| Size | CPU cores | Memory: GiB | Local SSD: GiB | Max data disks | Max disk throughput: IOPS | Max NICs / Network bandwidth |
| --- | --- | --- | --- | --- | --- | --- |
| Standard_F1 |1 |2 |16 |2 |2x500 |1 / moderate |
| Standard_F2 |2 |4 |32 |4 |4x500 |2 / high |
| Standard_F4 |4 |8 |64 |8 |8x500 |4 / high |
| Standard_F8 |8 |16 |128 |16 |16x500 |8 / high |
| Standard_F16 |16 |32 |256 |32 |32x500 |8 / extremely high |

<br>

## Fs-series*
| Size | CPU cores | Memory: GiB | Local SSD: GiB | Max data disks | Max cached disk throughput: IOPS / MBps (cache size in GiB) | Max uncached disk throughput: IOPS / MBps | Max NICs / Network bandwidth |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Standard_F1s |1 |2 |4 |2 |4,000 / 32 (12) |3,200 / 48 |1 / moderate |
| Standard_F2s |2 |4 |8 |4 |8,000 / 64 (24) |6,400 / 96 |2 / high |
| Standard_F4s |4 |8 |16 |8 |16,000 / 128 (48) |12,800 / 192 |4 / high |
| Standard_F8s |8 |16 |32 |16 |32,000 / 256 (96) |25,600 / 384 |8 / high |
| Standard_F16s |16 |32 |64 |32 |64,000 / 512 (192) |51,200 / 768 |8 / extremely high |

MBps = 10^6 bytes per second, and GiB = 1024^3 bytes.

*The maximum disk throughput (IOPS or MBps) possible with a Fs series VM may be limited by the number, size and striping of the attached disk(s).  For details, see [Premium Storage: High-performance storage for Azure virtual machine workloads](../articles/storage/storage-premium-storage.md).

<br>
