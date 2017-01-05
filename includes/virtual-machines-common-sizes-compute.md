


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

## Size table definitions

* Storage capacity is shown in units of GiB or 1024^3 bytes. When comparing disks measured in GB (1000^3 bytes) to disks measured in GiB (1024^3) remember that capacity numbers given in GiB may appear smaller. For example, 1023 GiB = 1098.4 GB
* Disk throughput is measured in input/output operations per second (IOPS) and MBps where MBps = 10^6 bytes/sec.
* Data disks can operate in cached or uncached modes.  For cached data disk operation, the host cache mode is set to **ReadOnly** or **ReadWrite**.  For uncached data disk operation, the host cache mode is set to **None**.
* Maximum network bandwidth is the maximum aggregated bandwidth allocated and assigned per VM type. The maximum bandwidth provides guidance for selecting the right VM type to ensure adequate network capacity is available. When moving between Low, Moderate, High and Very High, the throughput will increase accordingly. Actual network performance will depend on many factors including network and application loads, and application network settings.
