---
 title: include file
 description: include file
 services: virtual-machines
 author: roygara
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 07/08/2020
 ms.author: rogarana
 ms.custom: include file
---
All the latest generation of VM sizes support encryption at host:

|Type  |Not Supported  |Supported  |
|---------|---------|---------|
|General purpose     | Dv3, Dv2, Av2        | B, DSv2, Dsv3, DC, DCv2, Dav4, Dasv4        |
|Compute optimized     |         | Fsv2        |
|Memory optimized     | Ev3        | DSv2, Esv3, M, Mv2, Eav4, Easv4        |
|Storage optimized     |         | Ls, Lsv2 (NVMe disks not encrypted)        |
|GPU     | NC, NV        | NCv2, NCv3, ND, NVv3, NVv4, NDv2 (preview)        |
|High performance compute     | H        | HB, HC, HBv2        |
|Previous generations     | F, A, D, L, G        | DS, GS, Fs, NVv2        |
