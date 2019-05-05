---
author: roygara
ms.service: virtual-machines
ms.topic: include
ms.date: 11/09/2018	
ms.author: rogarana
---
**Premium unmanaged virtual machine disks: Per-account limits**

| Resource | Default limit |
| --- | --- |
| Total disk capacity per account |35 TB |
| Total snapshot capacity per account |10 TB |
| Maximum bandwidth per account (ingress + egress)<sup>1</sup> |<=50 Gbps |

<sup>1</sup>*Ingress* refers to all data from requests that are sent to a storage account. *Egress* refers to all data from responses that are received from a storage account.

**Premium unmanaged virtual machine disks: Per-disk limits**

| Premium storage disk type | P10 | P20 | P30 | P40 | P50 |
| --- | --- | --- | --- | --- | --- |
| Disk size |128 GiB |512 GiB |1,024 GiB (1 TB) |2,048 GiB (2 TB)|4,095 GiB (4 TB)|
| Maximum IOPS per disk |500 |2,300 |5,000 |7,500 |7,500 |
| Maximum throughput per disk |100 MB/sec | 150 MB/sec |200 MB/sec |250 MB/sec |250 MB/sec |
| Maximum number of disks per storage account |280 |70 |35 | 17 | 8 |

**Premium unmanaged virtual machine disks: Per-VM limits**

| Resource | Default limit |
| --- | --- |
| Maximum IOPS per VM |80,000 IOPS with GS5 VM |
| Maximum throughput per VM |2,000 MB/sec with GS5 VM |

