---
 title: include file
 description: include file
 services: virtual-machines
 author: ngdiarra
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 06/09/2022
 ms.author: ngdiarra;mimckitt
 ms.custom: include file
---

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max cached and temp storage throughput: IOPS/MBps (cache size in GiB) | Burst cached and temp storage throughput: IOPS/MBps<sup>3</sup> | Max uncached disk throughput: IOPS/MBps |  Burst uncached disk throughput: IOPS/MBps<sup>3</sup>| Max NICs/ Expected network bandwidth  (Mbps) |
|---|---|---|---|---|---|---|---|---|---|
| Standard_E2s_v3<sup>4</sup>                | 2  | 16  | 32  | 4  | 4000/32 (50)       | 4000/100    | 3200/48    | 4000/200 | 2/1000 |
| Standard_E4s_v3 <sup>1</sup>   | 4  | 32  | 64  | 8  | 8000/64 (100)      | 8000/200    | 6400/96    | 8000/200 | 2/2000 |
| Standard_E8s_v3 <sup>1</sup>   | 8  | 64  | 128 | 16 | 16000/128 (200)    | 16000/400   | 12800/192  | 16000/400 | 4/4000 |
| Standard_E16s_v3 <sup>1</sup>  | 16 | 128 | 256 | 32 | 32000/256 (400)    | 32000/800   | 25600/384  | 32000/800 | 8/8000 |
| Standard_E20s_v3               | 20 | 160 | 320 | 32 | 40000/320 (400)    | 40000/1000  | 32000/480  | 40000/1000 | 8/10000 |
| Standard_E32s_v3 <sup>1</sup>  | 32 | 256 | 512 | 32 | 64000/512 (800)    | 64000/1600  | 51200/768  | 64000/1600 | 8/16000 |
| Standard_E48s_v3               | 48 | 384 | 768 | 32 | 96000/768 (1200)   | 96000/2000  | 76800/1152 | 80000/2000 | 8/24000 |
| Standard_E64s_v3 <sup>1</sup>  | 64 | 432 | 864 | 32 | 128000/1024 (1600) | 128000/2000 | 80000/1200 | 80000/2000 | 8/30000 |
| Standard_E64is_v3 <sup>2</sup> | 64 | 432 | 864 | 32 | 128000/1024 (1600) | 128000/2000 | 80000/1200 | 80000/2000 | 8/30000 |

<sup>1</sup> [Constrained core sizes available](./constrained-vcpu.md).<br>
<sup>2</sup> Instance is isolated to hardware dedicated to a single customer.<br>
<sup>3</sup> Esv3-series VMs can [burst](./disk-bursting.md) their disk performance and get up to their bursting max for up to 30 minutes at a time.<br>
<sup>4</sup> Accelerated networking can only be applied to a single NIC. 