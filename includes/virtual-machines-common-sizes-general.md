
The A-series and Av2-series VMs can be deployed on a variety of hardware types and processors. The size is throttled, based upon the hardware, to offer consistent processor performance for the running instance, regardless of the hardware it is deployed on. To determine the physical hardware on which this size is deployed, query the virtual hardware from within the Virtual Machine.

## A-series



| Size | CPU cores | Memory: GiB | Local HDD: GiB | Max data disks | Max data disk throughput: IOPS | Max NICs / Network bandwidth |
| --- | --- | --- | --- | --- | --- | --- |
| Standard_A0* |1 |0.768 |20 |1 |1x500 |1 / low |
| Standard_A1 |1 |1.75 |70 |2 |2x500 |1 / moderate |
| Standard_A2 |2 |3.5 |135 |4 |4x500 |1 / moderate |
| Standard_A3 |4 |7 |285 |8 |8x500 |2 / high |
| Standard_A4 |8 |14 |605 |16 |16x500 |4 / high |
| Standard_A5 |2 |14 |135 |4 |4X500 |1 / moderate |
| Standard_A6 |4 |28 |285 |8 |8x500 |2 / high |
| Standard_A7 |8 |56 |605 |16 |16x500 |4 / high |
<br>

*The A0 size is over-subscribed on the physical hardware. For this specific size only, other customer deployments may impact the performance of your running workload. The relative performance is outlined below as the expected baseline, subject to an approximate variability of 15 percent.

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

D-series VMs are designed to run applications that demand higher compute power and temporary disk performance. D-series VMs provide faster processors, a higher memory-to-core ratio, and a solid-state drive (SSD) for the temporary disk. For details, see the announcement on the Azure blog, [New D-Series Virtual Machine Sizes](https://azure.microsoft.com/blog/2014/09/22/new-d-series-virtual-machine-sizes/).

| Size | CPU cores | Memory: GiB | Local SSD: GiB | Max data disks | Max data disk throughput: IOPS | Max NICs / Network bandwidth |
| --- | --- | --- | --- | --- | --- | --- |
| Standard_D1 |1 |3.5 |50 |2 |2x500 |1 / moderate |
| Standard_D2 |2 |7 |100 |4 |4x500 |2 / high |
| Standard_D3 |4 |14 |200 |8 |8x500 |4 / high |
| Standard_D4 |8 |28 |400 |16 |16x500 |8 / high |


<br>

## Dv2-series

Dv2-series, a follow-on to the original D-series, features a more powerful CPU. The Dv2-series CPU is about 35% faster than the D-series CPU. It is based on the latest generation 2.4 GHz Intel Xeon® E5-2673 v3 (Haswell) processor, and with the Intel Turbo Boost Technology 2.0, can go up to 3.1 GHz. The Dv2-series has the same memory and disk configurations as the D-series.


| Size | CPU cores | Memory: GiB | Local SSD: GiB | Max data disks | Max data disk throughput: IOPS | Max NICs / Network bandwidth |
| --- | --- | --- | --- | --- | --- | --- |
| Standard_D1_v2 |1 |3.5 |50 |2 |2x500 |1 / moderate |
| Standard_D2_v2 |2 |7 |100 |4 |4x500 |2 / high |
| Standard_D3_v2 |4 |14 |200 |8 |8x500 |4 / high |
| Standard_D4_v2 |8 |28 |400 |16 |16x500 |8 / high |
| Standard_D5_v2 |16 |56 |800 |32 |32x500 |8 / extremely high |



<br>


## DS-series*


| Size | CPU cores | Memory: GiB | Local SSD: GiB | Max data disks | Max cached disk throughput: IOPS / MBps (cache size in GiB) | Max uncached disk throughput: IOPS / MBps | Max NICs / Network bandwidth |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Standard_DS1 |1 |3.5 |7 |2 |4,000 / 32 (43) |3,200 / 32 |1 / moderate |
| Standard_DS2 |2 |7 |14 |4 |8,000 / 64 (86) |6,400 / 64 |2 / high |
| Standard_DS3 |4 |14 |28 |8 |16,000 / 128 (172) |12,800 / 128 |4 / high |
| Standard_DS4 |8 |28 |56 |16 |32,000 / 256 (344) |25,600 / 256 |8 / high |


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


MBps = 10^6 bytes per second, and GiB = 1024^3 bytes.

*The maximum disk throughput (IOPS or MBps) possible with a DSv2 series VM may be limited by the number, size and striping of the attached disk(s).  For details, see [Premium Storage: High-performance storage for Azure virtual machine workloads](../articles/storage/storage-premium-storage.md).


<br>


