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

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max cached and temp storage throughput: IOPS/MBps (cache size in GiB) | Max burst cached and temp storage throughput: IOPS/MBps<sup>2</sup> | Max uncached disk throughput: IOPS/MBps | Max burst uncached disk throughput: IOPS/MBps<sup>1</sup> | Max NICs/ Expected network bandwidth (Mbps) |
|---|---|---|---|---|---|---|---|---|---|
| Standard_D2s_v3<sup>2</sup>  | 2  | 8   | 16  | 4  | 4000/32 (50)       | 4000/200    |3200/48    | 4000/200   | 2/1000  |
| Standard_D4s_v3  | 4  | 16  | 32  | 8  | 8000/64 (100)      | 8000/200    |6400/96    | 8000/200   | 2/2000  |
| Standard_D8s_v3  | 8  | 32  | 64  | 16 | 16000/128 (200)    | 16000/400   |12800/192  | 16000/400  | 4/4000  |
| Standard_D16s_v3 | 16 | 64  | 128 | 32 | 32000/256 (400)    | 32000/800   |25600/384  | 32000/800  | 8/8000  |
| Standard_D32s_v3 | 32 | 128 | 256 | 32 | 64000/512 (800)    | 64000/1600  |51200/768  | 64000/1600 | 8/16000 |
| Standard_D48s_v3 | 48 | 192 | 384 | 32 | 96000/768 (1200)   | 96000/2000  |76800/1152 | 80000/2000 | 8/24000 |
| Standard_D64s_v3 | 64 | 256 | 512 | 32 | 128000/1024 (1600) | 128000/2000 |80000/1200 | 80000/2000 | 8/30000 |