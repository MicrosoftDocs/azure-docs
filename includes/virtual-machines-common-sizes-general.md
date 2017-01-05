





## A-series
| Size | CPU cores | Memory: GiB | Local HDD: GiB | Max data disks | Max data disk throughput: IOPS | Max NICs / Network bandwidth |
| --- | --- | --- | --- | --- | --- | --- |
| Standard_A0 |1 |0.768 |20 |1 |1x500 |1 / low |
| Standard_A1 |1 |1.75 |70 |2 |2x500 |1 / moderate |
| Standard_A2 |2 |3.5 |135 |4 |4x500 |1 / moderate |
| Standard_A3 |4 |7 |285 |8 |8x500 |2 / high |
| Standard_A4 |8 |14 |605 |16 |16x500 |4 / high |
| Standard_A5 |2 |14 |135 |4 |4X500 |1 / moderate |
| Standard_A6 |4 |28 |285 |8 |8x500 |2 / high |
| Standard_A7 |8 |56 |605 |16 |16x500 |4 / high |
<br>

### Standard A0 - A4 using CLI and PowerShell
In the classic deployment model, some VM size names are slightly different in CLI and PowerShell:

* Standard_A0 is ExtraSmall 
* Standard_A1 is Small
* Standard_A2 is Medium
* Standard_A3 is Large
* Standard_A4 is ExtraLarge

## Av2-series

| Size        | CPU cores | Memory: GiB | Local SSD: GiB | Max data disks | Max data disk throughput: IOPS | Max NICs / Network bandwidth |
|-------------|-----------|--------------|-----------------------|----------------|--------------------|-----------------------|
| Standard_A1_v2 | 1         | 2            | 10                   | 2              | 2x500              | 1 / moderate              |
| Standard_A2_v2 | 2         | 4            | 20                   | 4              | 4x500              | 2 / moderate              |
| Standard_A4_v2 | 4         | 8            | 40                   | 8              | 8x500              | 4 / high                  |
| Standard_A8_v2 | 8         | 16           | 80                   | 16             | 16x500             | 8 / high                  |
| Standard_A2m_v2 | 2        | 16           | 20                   | 4              | 4X500              | 2 / moderate              |
| Standard_A4m_v2 | 4        | 32           | 40                   | 8              | 8x500              | 4 / high                  |
| Standard_A8m_v2 | 8        | 64           | 80                   | 16             | 16x500             | 8 / high                  |
<br>

## D-series
| Size | CPU cores | Memory: GiB | Local SSD: GiB | Max data disks | Max data disk throughput: IOPS | Max NICs / Network bandwidth |
| --- | --- | --- | --- | --- | --- | --- |
| Standard_D1 |1 |3.5 |50 |2 |2x500 |1 / moderate |
| Standard_D2 |2 |7 |100 |4 |4x500 |2 / high |
| Standard_D3 |4 |14 |200 |8 |8x500 |4 / high |
| Standard_D4 |8 |28 |400 |16 |16x500 |8 / high |
| Standard_D11 |2 |14 |100 |4 |4x500 |2 / high |
| Standard_D12 |4 |28 |200 |8 |8x500 |4 / high |
| Standard_D13 |8 |56 |400 |16 |16x500 |8 / high |
| Standard_D14 |16 |112 |800 |32 |32x500 |8 / very high |

<br>

## Dv2-series
| Size | CPU cores | Memory: GiB | Local SSD: GiB | Max data disks | Max data disk throughput: IOPS | Max NICs / Network bandwidth |
| --- | --- | --- | --- | --- | --- | --- |
| Standard_D1_v2 |1 |3.5 |50 |2 |2x500 |1 / moderate |
| Standard_D2_v2 |2 |7 |100 |4 |4x500 |2 / high |
| Standard_D3_v2 |4 |14 |200 |8 |8x500 |4 / high |
| Standard_D4_v2 |8 |28 |400 |16 |16x500 |8 / high |
| Standard_D5_v2 |16 |56 |800 |32 |32x500 |8 / extremely high |
| Standard_D11_v2 |2 |14 |100 |4 |4x500 |2 / high |
| Standard_D12_v2 |4 |28 |200 |8 |8x500 |4 / high |
| Standard_D13_v2 |8 |56 |400 |16 |16x500 |8 / high |
| Standard_D14_v2 |16 |112 |800 |32 |32x500 |8 / extremely high |
| Standard_D15_v2 |20 |140 |1,000 |40 |40x500 |8 / extremely high* |

*In some regions, accelerated networking is available for the Standard_D15_v2 size. For more information about usage and availability, see [Accelerated Networking is in Preview](https://azure.microsoft.com/updates/accelerated-networking-in-preview/) and [Accelerated Networking for a virtual machine](../articles/virtual-network/virtual-network-accelerated-networking-powershell.md).

<br>

## General-purpose storage optimized

## DS-series*
| Size | CPU cores | Memory: GiB | Local SSD: GiB | Max data disks | Max cached disk throughput: IOPS / MBps (cache size in GiB) | Max uncached disk throughput: IOPS / MBps | Max NICs / Network bandwidth |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Standard_DS1 |1 |3.5 |7 |2 |4,000 / 32 (43) |3,200 / 32 |1 / moderate |
| Standard_DS2 |2 |7 |14 |4 |8,000 / 64 (86) |6,400 / 64 |2 / high |
| Standard_DS3 |4 |14 |28 |8 |16,000 / 128 (172) |12,800 / 128 |4 / high |
| Standard_DS4 |8 |28 |56 |16 |32,000 / 256 (344) |25,600 / 256 |8 / high |
| Standard_DS11 |2 |14 |28 |4 |8,000 / 64 (72) |6,400 / 64 |2 / high |
| Standard_DS12 |4 |28 |56 |8 |16,000 / 128 (144) |12,800 / 128 |4 / high |
| Standard_DS13 |8 |56 |112 |16 |32,000 / 256 (288) |25,600 / 256 |8 / high |
| Standard_DS14 |16 |112 |224 |32 |64,000 / 512 (576) |51,200 / 512 |8 / very high |

MBps = 10^6 bytes per second, and GiB = 1024^3 bytes.

*The maximum disk throughput (IOPS or MBps) possible with a DS series VM may be limited by the number, size and striping of the attached disk(s).  For details, see [Premium Storage: High-performance storage for Azure virtual machine workloads](../articles/storage/storage-premium-storage.md).

<br>

## DSv2-series*
| Size | CPU cores | Memory: GiB | Local SSD: GiB | Max data disks | Max cached disk throughput: IOPS / MBps (cache size in GiB) | Max uncached disk throughput: IOPS / MBps | Max NICs / Network bandwidth |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Standard_DS1_v2 |1 |3.5 |7 |2 |4,000 / 32 (43) |3,200 / 48 |1 moderate |
| Standard_DS2_v2 |2 |7 |14 |4 |8,000 / 64 (86) |6,400 / 96 |2 high |
| Standard_DS3_v2 |4 |14 |28 |8 |16,000 / 128 (172) |12,800 / 192 |4 high |
| Standard_DS4_v2 |8 |28 |56 |16 |32,000 / 256 (344) |25,600 / 384 |8 high |
| Standard_DS5_v2 |16 |56 |112 |32 |64,000 / 512 (688) |51,200 / 768 |8 extremely high |
| Standard_DS11_v2 |2 |14 |28 |4 |8,000 / 64 (72) |6,400 / 96 |2 high |
| Standard_DS12_v2 |4 |28 |56 |8 |16,000 / 128 (144) |12,800 / 192 |4 high |
| Standard_DS13_v2 |8 |56 |112 |16 |32,000 / 256 (288) |25,600 / 384 |8 high |
| Standard_DS14_v2 |16 |112 |224 |32 |64,000 / 512 (576) |51,200 / 768 |8 extremely high |
| Standard_DS15_v2 |20 |140 |280 |40 |80,000 / 640 (720) |64,000 / 960 |8 extremely high** |

MBps = 10^6 bytes per second, and GiB = 1024^3 bytes.

*The maximum disk throughput (IOPS or MBps) possible with a DSv2 series VM may be limited by the number, size and striping of the attached disk(s).  For details, see [Premium Storage: High-performance storage for Azure virtual machine workloads](../articles/storage/storage-premium-storage.md).

**In some regions, accelerated networking is available for the Standard_DS15_v2 size. For more information about usage and availability, see [Accelerated Networking is in Preview](https://azure.microsoft.com/updates/accelerated-networking-in-preview/) and [Accelerated Networking for a virtual machine](../articles/virtual-network/virtual-network-accelerated-networking-powershell.md).

<br>

## Size table definitions

* Storage capacity is shown in units of GiB or 1024^3 bytes. When comparing disks measured in GB (1000^3 bytes) to disks measured in GiB (1024^3) remember that capacity numbers given in GiB may appear smaller. For example, 1023 GiB = 1098.4 GB
* Disk throughput is measured in input/output operations per second (IOPS) and MBps where MBps = 10^6 bytes/sec.
* Data disks can operate in cached or uncached modes.  For cached data disk operation, the host cache mode is set to **ReadOnly** or **ReadWrite**.  For uncached data disk operation, the host cache mode is set to **None**.
* Maximum network bandwidth is the maximum aggregated bandwidth allocated and assigned per VM type. The maximum bandwidth provides guidance for selecting the right VM type to ensure adequate network capacity is available. When moving between Low, Moderate, High and Very High, the throughput will increase accordingly. Actual network performance will depend on many factors including network and application loads, and application network settings.
