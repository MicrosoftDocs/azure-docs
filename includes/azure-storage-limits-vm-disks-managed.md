---
 title: include file
 description: include file
 services: virtual-machines
 author: roygara
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 06/02/2021
 ms.author: rogarana
 ms.custom: include file
---

### Disk type comparison

The following table provides a comparison of the five disk types to help you decide which to use.

|         | Ultra disk | Premium SSD v2 | Premium SSD | Standard SSD | <nobr>Standard HDD</nobr> |
| ------- | ---------- | ----------- | ------------ | ------------ | ------------ |
| **Disk type** | SSD | SSD |SSD | SSD | HDD |
| **Scenario**  | IO-intensive workloads such as [SAP HANA](workloads/sap/hana-vm-operations-storage.md), top tier databases (for example, SQL, Oracle), and other transaction-heavy workloads. | Production and performance-sensitive workloads that consistently require low latency and high IOPS and throughput | Production and performance sensitive workloads | Web servers, lightly used enterprise applications and dev/test | Backup, non-critical, infrequent access |
| **Max disk size** | 65,536 GiB | 65,536 GiB |32,767 GiB | 32,767 GiB | 32,767 GiB |
| **Max throughput** | 4,000 MB/s | 1,200 MB/s | 900 MB/s | 750 MB/s | 500 MB/s |
| **Max IOPS** | 160,000 | 80,000 | 20,000 | 6,000 | 2,000, 3,000* |
| **Usable as OS Disk?** | No | No | Yes | Yes | Yes |

\* Only applies to disks with performance plus (preview) enabled.

### Standard HDD managed disks
[!INCLUDE [disk-storage-standard-hdd-sizes](disk-storage-standard-hdd-sizes.md)]

### Standard SSD managed disks
[!INCLUDE [disk-storage-standard-ssd-sizes](disk-storage-standard-ssd-sizes.md)]

### Premium SSD managed disks: Per-disk limits 
[!INCLUDE [disk-storage-premium-ssd-sizes](disk-storage-premium-ssd-sizes.md)]

### Premium SSD managed disks: Per-VM limits

| Resource | Limit |
| --- | --- |
| Maximum IOPS Per VM |80,000 IOPS with GS5 VM |
| Maximum throughput per VM |2,000 MB/s with GS5 VM |
