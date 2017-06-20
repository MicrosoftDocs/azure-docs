

* Dv2-series, D-series, G-series, and the DS/GS counterparts  are ideal for applications that demand faster CPUs, better local disk performance, or have higher memory demands.  They offer a powerful combination for many enterprise-grade applications.

D-series VMs are designed to run applications that demand higher compute power and temporary disk performance. D-series VMs provide faster processors, a higher memory-to-core ratio, and a solid-state drive (SSD) for the temporary disk. For details, see the announcement on the Azure blog, [New D-Series Virtual Machine Sizes](https://azure.microsoft.com/blog/2014/09/22/new-d-series-virtual-machine-sizes/).

Dv2-series, a follow-on to the original D-series, features a more powerful CPU. The Dv2-series CPU is about 35% faster than the D-series CPU. It is based on the latest generation 2.4 GHz Intel Xeon® E5-2673 v3 (Haswell) processor, and with the Intel Turbo Boost Technology 2.0, can go up to 3.1 GHz. The Dv2-series has the same memory and disk configurations as the D-series.


## GS-series*

ACU: 180 - 240

| Size | CPU cores | Memory: GiB | Local SSD: GiB | Max data disks | Max cached and local disk throughput: IOPS / MBps (cache size in GiB) | Max uncached disk throughput: IOPS / MBps | Max NICs / Network bandwidth |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Standard_GS1 |2 |28 |56 |4 |10,000 / 100 (264) |5,000 / 125 |2 / high |
| Standard_GS2 |4 |56 |112 |8 |20,000 / 200 (528) |10,000 / 250 |2 / high |
| Standard_GS3 |8 |112 |224 |16 |40,000 / 400 (1,056) |20,000 / 500 |4 / very high |
| Standard_GS4 |16 |224 |448 |32 |80,000 / 800 (2,112) |40,000 / 1,000 |8 / extremely high |
| Standard_GS5** |32 |448 |896 |64 |160,000 / 1,600 (4,224) |80,000 / 2,000 |8 / extremely high |

MBps = 10^6 bytes per second, and GiB = 1024^3 bytes.

*The maximum disk throughput (IOPS or MBps) possible with a GS series VM may be limited by the number, size and striping of the attached disk(s). For details, see [Premium Storage: High-performance storage for Azure virtual machine workloads](../articles/storage/storage-premium-storage.md). 

**Instance is isolated to hardware dedicated to a single customer.
<br>

## G-series

ACU: 180 - 240

| Size         | CPU cores | Memory: GiB | Local SSD: GiB | Max local disk throughput: IOPS / Read MBps / Write MBps | Max data disks / throughput: IOPS | Max NICs / Network bandwidth |
|--------------|-----------|-------------|----------------|----------------------------------------------------------|-----------------------------------|------------------------------|
| Standard_G1  | 2         | 28          | 384            | 6000 / 93 / 46                                           | 4 / 4 x 500                       | 2 / high                     |
| Standard_G2  | 4         | 56          | 768            | 12000 / 187 / 93                                         | 8 / 8 x 500                       | 2 / high                     |
| Standard_G3  | 8         | 112         | 1,536          | 24000 / 375 / 187                                        | 16 / 16 x 500                     | 4 / very high                |
| Standard_G4  | 16        | 224         | 3,072          | 48000 / 750 / 375                                        | 32 / 32 x 500                     | 8 / extremely high           |
| Standard_G5* | 32        | 448         | 6,144          | 96000 / 1500 / 750                                       | 64 / 64 x 500                     | 8 / extremely high           |

*Instance is isolated to hardware dedicated to a single customer.
<br>


## DSv2-series*

ACU: 210 - 250

| Size | CPU cores | Memory: GiB | Local SSD: GiB | Max data disks | Max cached disk throughput: IOPS / MBps (cache size in GiB) | Max uncached disk throughput: IOPS / MBps | Max NICs / Network bandwidth |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Standard_DS11_v2 |2 |14 |28 |4 |8,000 / 64 (72) |6,400 / 96 |2 high |
| Standard_DS12_v2 |4 |28 |56 |8 |16,000 / 128 (144) |12,800 / 192 |4 high |
| Standard_DS13_v2 |8 |56 |112 |16 |32,000 / 256 (288) |25,600 / 384 |8 high |
| Standard_DS14_v2 |16 |112 |224 |32 |64,000 / 512 (576) |51,200 / 768 |8 extremely high |
| Standard_DS15_v2*** |20 |140 |280 |40 |80,000 / 640 (720) |64,000 / 960 |8 extremely high** |

MBps = 10^6 bytes per second, and GiB = 1024^3 bytes.

*The maximum disk throughput (IOPS or MBps) possible with a DSv2 series VM may be limited by the number, size and striping of the attached disk(s).  For details, see [Premium Storage: High-performance storage for Azure virtual machine workloads](../articles/storage/storage-premium-storage.md).

**In some regions, accelerated networking is available for the Standard_DS15_v2 size. For more information about usage and availability, see [Accelerated Networking is in Preview](https://azure.microsoft.com/updates/accelerated-networking-in-preview/) and [Accelerated Networking for a virtual machine](../articles/virtual-network/virtual-network-accelerated-networking-powershell.md).

***Instance is isolated to hardware dedicated to a single customer.
<br>
Bps = 10^6 bytes per second, and GiB = 1024^3 bytes.

*The maximum disk throughput (IOPS or MBps) possible with a DS series VM may be limited by the number, size and striping of the attached disk(s).  For details, see [Premium Storage: High-performance storage for Azure virtual machine workloads](../articles/storage/storage-premium-storage.md).

## Dv2-series

ACU: 210 - 250

| Size              | CPU cores | Memory: GiB | Local SSD: GiB | Max local disk throughput: IOPS / Read MBps / Write MBps | Max data disks / throughput: IOPS | Max NICs / Network bandwidth |
|-------------------|-----------|-------------|----------------|----------------------------------------------------------|-----------------------------------|------------------------------|
| Standard_D11_v2   | 2         | 14          | 100            | 6000 / 93 / 46                                           | 4 / 4x500                         | 2 / high                     |
| Standard_D12_v2   | 4         | 28          | 200            | 12000 / 187 / 93                                         | 8 / 8x500                         | 4 / high                     |
| Standard_D13_v2   | 8         | 56          | 400            | 24000 / 375 / 187                                        | 16 / 16x500                       | 8 / high                     |
| Standard_D14_v2   | 16        | 112         | 800            | 48000 / 750 / 375                                        | 32 / 32x500                       | 8 / extremely high           |
| Standard_D15_v2** | 20        | 140         | 1,000          | 60000 / 937 / 468                                        | 40 / 40x500                       | 8 / extremely high*          |

*In some regions, accelerated networking is available for the Standard_D15_v2 size. For more information about usage and availability, see [Accelerated Networking is in Preview](https://azure.microsoft.com/updates/accelerated-networking-in-preview/) and [Accelerated Networking for a virtual machine](../articles/virtual-network/virtual-network-accelerated-networking-powershell.md).

**Instance is isolated to hardware dedicated to a single customer.

<br>

## DS-series*

ACU: 160

| Size | CPU cores | Memory: GiB | Local SSD: GiB | Max data disks | Max cached disk throughput: IOPS / MBps (cache size in GiB) | Max uncached disk throughput: IOPS / MBps | Max NICs / Network bandwidth |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Standard_DS11 |2 |14 |28 |4 |8,000 / 64 (72) |6,400 / 64 |2 / high |
| Standard_DS12 |4 |28 |56 |8 |16,000 / 128 (144) |12,800 / 128 |4 / high |
| Standard_DS13 |8 |56 |112 |16 |32,000 / 256 (288) |25,600 / 256 |8 / high |
| Standard_DS14 |16 |112 |224 |32 |64,000 / 512 (576) |51,200 / 512 |8 / very high |


MBps = 10^6 bytes per second, and GiB = 1024^3 bytes.

*The maximum disk throughput (IOPS or MBps) possible with a DS series VM may be limited by the number, size and striping of the attached disk(s).  For details, see [Premium Storage: High-performance storage for Azure virtual machine workloads](../articles/storage/storage-premium-storage.md).

## D-series

ACU: 160

| Size         | CPU cores | Memory: GiB | Local SSD: GiB | Max local disk throughput: IOPS / Read MBps / Write MBps | Max data disks / throughput: IOPS | Max NICs / Network bandwidth |
|--------------|-----------|-------------|----------------|----------------------------------------------------------|-----------------------------------|------------------------------|
| Standard_D11 | 2         | 14          | 100            | 6000 / 93 / 46                                           | 4 / 4x500                         | 2 / high                     |
| Standard_D12 | 4         | 28          | 200            | 12000 / 187 / 93                                         | 8 / 8x500                         | 4 / high                     |
| Standard_D13 | 8         | 56          | 400            | 24000 / 375 / 187                                        | 16 / 16x500                       | 8 / high                     |
| Standard_D14 | 16        | 112         | 800            | 48000 / 750 / 375                                        | 32 / 32x500                       | 8 / very high                |
<br>


<br>

