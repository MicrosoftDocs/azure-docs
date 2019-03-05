---
 title: include file
 description: include file
 services: virtual-machines
 author: roygara
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 01/22/2019
 ms.author: rogarana
 ms.custom: include file
---
**Outbound data transfers**: [Outbound data transfers](https://azure.microsoft.com/pricing/details/bandwidth/) (data going out of Azure data centers) incur billing for bandwidth usage.

**Transactions**: You're billed for the number of transactions that you perform on a standard managed disk. Azure charges $0.0036 per 100,000 transactions for standard HDDs. Transactions include both read and write operations to storage.

Standard SSDs use IO Unit size of 256 KB. If the data being transferred is less than 256 KB, it is considered one I/O unit. Larger I/O sizes are counted as multiple I/Os of size 256 KB. For example, a 1,100 KB I/O is counted as five I/O units.

There is no cost for transactions for a premium managed disk.

For detailed information on pricing for Managed Disks, see [Managed Disks Pricing](https://azure.microsoft.com/pricing/details/managed-disks).

### Ultra SSD VM reservation fee

Azure VMs have the capability to indicate if they are compatible with ultra SSD. An ultra disk compatible VM allocates dedicated bandwidth capacity between the compute VM instance and the block storage scale unit to optimize the performance and reduce latency. Adding this capability on the VM results in a reservation charge that is only imposed if you enabled ultra disk capability on the VM without attaching an ultra disk to it. When an ultra disk is attached to the ultra disk compatible VM, this charge would not be applied. This charge is per vCPU provisioned on the VM.

Refer to the [Azure Disks pricing page](https://azure.microsoft.com/pricing/details/managed-disks/) for ultra disk Disks pricing details.