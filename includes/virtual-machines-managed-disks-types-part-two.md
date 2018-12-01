---
 title: include file
 description: include file
 services: virtual-machines
 author: roygara
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 12/03/2018
 ms.author: rogarana
 ms.custom: include file
---
**Outbound data transfers**: [Outbound data transfers](https://azure.microsoft.com/pricing/details/bandwidth/) (data going out of Azure data centers) incur billing for bandwidth usage.

**Transactions**: You are billed for the number of transactions that you perform on a standard managed disk.

Standard SSD Disks use IO Unit size of 256KB. If the data being transferred is less than 256 KB, it is considered 1 I/O unit. Larger I/O sizes are counted as multiple I/Os of size 256 KB. For example, a 1,100 KB I/O is counted as five I/O units.

There is no cost for transactions for a premium managed disk.

For detailed information on pricing for Managed Disks, see [Managed Disks Pricing](https://azure.microsoft.com/pricing/details/managed-disks).

### Ultra SSD VM reservation fee

We are introducing a capability on the VM that indicates your VM is Ultra SSD compatible. An Ultra SSD Compatible VM allocates dedicated bandwidth capacity between the compute VM instance and the block storage scale unit to optimize the performance and reduce latency. Adding this capability on the VM results in a reservation charge that is only imposed if you enabled Ultra SSD capability on the VM without attaching an Ultra SSD disk to it. When an Ultra SSD disk is attached to the Ultra SSD compatible VM, this charge would not be applied. This charge is per vCPU provisioned on the VM.

Refer to the [Azure Disks pricing page](https://azure.microsoft.com/pricing/details/managed-disks/) for the new Ultra SSD Disks price details available in limited preview.

## Disk comparison

The following table provides a comparison of Standard HDD, Standard SSD, and Premium SSD for unmanaged and managed disks to help you decide what to use. Sizes denoted with an asterisk are currently in preview.

|   |Azure Ultra SSD (Preview)   |Azure Premium Disk   |Azure Standard SSD   |Azure Standard HDD   |
|---------|---------|---------|---------|---------|
|Disk Type   |SSD   |SSD   |SSD   |HDD   |
|Scenario   |IO-intensive workloads such as SAP HANA, top tier databases (e.g. SQL, Oracle), and other transaction-heavy workloads.   |Production and performance sensitive workloads   |Web servers, lightly used enterprise applications and Dev/Test   |Backup, Non-critical, Infrequent access   |
|Overview   |Highest performance offering   |SSD-based high-performance, low-latency disk support for VMs running IO-intensive workloads or hosting mission critical production environment   |More consistent performance and reliability than HDD. Optimized for low-IOPS workloads   |HDD-based cost effective disk for infrequent access   |
|Disk size   |65,536 GiB (Preview)   |4,095 GiB (GA), 32,767 GiB (Preview)    |4,095 (GA) GiB, 32,767 GiB (Preview)   |4,095 GiB (GA), 32,767 GiB (Preview)   |
|Max Throughput   |2,000 MiB/s (Preview)   |250 (GA) MiB/s, 750 MiB/s (Preview)   |60 MiB/s (GA), 500 MiB/s (Preview)   |60 Mib/s (GA), 500 MiB/s (Preview)   |
|Max IOPS   |160,000 (Preview)   |7500 (GA), 20,000 (Preview)   |500 (GA), 2,000 (Preview)   |500 (GA), 2,000 (Preview)   |
|   |   |   |   |   |