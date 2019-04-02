---
 title: include file
 description: include file
 services: virtual-machines-windows, virtual-machines-linux
 author: laurenhughes
 ms.service: multiple
 ms.topic: include
 ms.date: 04/02/2019
 ms.author: lahugh
 ms.custom: include file
---

## Basic A

Premium Storage:  Not Supported

Premium Storage Caching:  Not Supported

The basic tier sizes are primarily for development workloads and other applications that don't require load balancing, auto-scaling, or memory-intensive virtual machines.

|Size – Size\Name | vCPU |Memory|NICs (Max)|Max temporary disk size |Max. data disks (1023 GB each)|Max. IOPS (300 per disk)|
|---|---|---|---|---|---|---|
|A0\Basic_A0|1|768 MB|2| 20 GB|1|1x300|
|A1\Basic_A1|1|1.75 GB|2| 40 GB |2|2x300|
|A2\Basic_A2|2|3.5 GB|2| 60 GB|4|4x300|
|A3\Basic_A3|4|7 GB|2| 120 GB |8|8x300|
|A4\Basic_A4|8|14 GB|2| 240 GB |16|16x300|

## A-series

ACU: 50-100

Premium Storage:  Not Supported

Premium Storage Caching:  Not Supported

| Size | vCPU | Memory: GiB | Temp storage (HDD): GiB | Max data disks | Max data disk throughput: IOPS | Max NICs / Expected network bandwidth (Mbps)  |
| --- | --- | --- | --- | --- | --- | --- |
| Standard_A0 <sup>1</sup> |1 |0.768 |20 |1 |1x500 |2 / 100 |
| Standard_A1 |1 |1.75 |70 |2 |2x500 |2 / 500  |
| Standard_A2 |2 |3.5 |135 |4 |4x500 |2 / 500 |
| Standard_A3 |4 |7 |285 |8 |8x500 |2 / 1000 |
| Standard_A4 |8 |14 |605 |16 |16x500 |4 / 2000 |
| Standard_A5 |2 |14 |135 |4 |4x500 |2 / 500 |
| Standard_A6 |4 |28 |285 |8 |8x500 |2 / 1000 |
| Standard_A7 |8 |56 |605 |16 |16x500 |4 / 2000 |

<br>

<sup>1</sup> The A0 size is over-subscribed on the physical hardware. For this specific size only, other customer deployments may impact the performance of your running workload. The relative performance is outlined below as the expected baseline, subject to an approximate variability of 15 percent.

## A-series - compute-intensive instances

ACU: 225

Premium Storage:  Not Supported

Premium Storage Caching:  Not Supported

The A8-A11 and H-series sizes are also known as *compute-intensive instances*. The hardware that runs these sizes is designed and optimized for compute-intensive and network-intensive applications, including high-performance computing (HPC) cluster applications, modeling, and simulations. The A8-A11 series uses Intel Xeon E5-2670 @ 2.6 GHZ and the H-series uses Intel Xeon E5-2667 v3 @ 3.2 GHz.  

| Size | vCPU | Memory: GiB | Temp storage (HDD): GiB | Max data disks | Max data disk throughput: IOPS | Max NICs|
| --- | --- | --- | --- | --- | --- | --- |
| Standard_A8 <sup>1</sup> |8 |56 |382 |32 |32x500 |2 |
| Standard_A9 <sup>1</sup> |16 |112 |382 |64 |64x500 |4 |
| Standard_A10 |8 |56 |382 |32 |32x500 |2  |
| Standard_A11 |16 |112 |382 |64 |64x500 |4 |

<sup>1</sup>For MPI applications, dedicated RDMA backend network is enabled by FDR InfiniBand network, which delivers ultra-low-latency and high bandwidth.  

## D-series

ACU: 160-250 <sup>1</sup>

Premium Storage:  Not Supported

Premium Storage Caching:  Not Supported

| Size         | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max temp storage throughput: IOPS / Read MBps / Write MBps | Max data disks / throughput: IOPS | Max NICs / Expected network bandwidth (Mbps) |
|--------------|-----------|-------------|----------------|----------------------------------------------------------|-----------------------------------|------------------------------|
| Standard_D1  | 1         | 3.5         | 50             | 3000 / 46 / 23                                           | 4 / 4x500                         | 2 / 500                 |
| Standard_D2  | 2         | 7           | 100            | 6000 / 93 / 46                                           | 8 / 8x500                         | 2 / 1000                     |
| Standard_D3  | 4         | 14          | 200            | 12000 / 187 / 93                                         | 16 / 16x500                         | 4 / 2000                     |
| Standard_D4  | 8         | 28          | 400            | 24000 / 375 / 187                                        | 32 / 32x500                       | 8 / 4000                     |

<sup>1</sup> VM Family can run on one of the following CPU's: 2.2 GHz Intel Xeon® E5-2660 v2,  2.4 GHz Intel Xeon® E5-2673 v3 (Haswell) or 2.3 GHz Intel XEON® E5-2673 v4 (Broadwell)  

## DS-series

ACU: 160-250 <sup>1</sup>

Premium Storage:  Supported

Premium Storage Caching:  Supported

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max cached and temp storage throughput: IOPS / MBps (cache size in GiB) | Max uncached disk throughput: IOPS / MBps | Max NICs / Expected network bandwidth (Mbps) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Standard_DS1 |1 |3.5 |7 |4 |4,000 / 32 (43) |3,200 / 32 |2 / 500 |
| Standard_DS2 |2 |7 |14 |8 |8,000 / 64 (86) |6,400 / 64 |2 / 1000 |
| Standard_DS3 |4 |14 |28 |16 |16,000 / 128 (172) |12,800 / 128 |4 / 2000 |
| Standard_DS4 |8 |28 |56 |32 |32,000 / 256 (344) |25,600 / 256 |8 / 4000 |

<sup>1</sup> VM Family can run on one of the following CPU's: 2.2 GHz Intel Xeon® E5-2660 v2,  2.4 GHz Intel Xeon® E5-2673 v3 (Haswell) or 2.3 GHz Intel XEON® E5-2673 v4 (Broadwell)  


Dv2_promo

Dsv2_promo