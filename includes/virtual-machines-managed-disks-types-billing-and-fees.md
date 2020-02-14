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

**Transactions**: You're billed for the number of transactions that you perform on a standard managed disk. For standard SSDs, each I/O operation less than or equal to 256 KiB of throughput is considered a single I/O operation. I/O operations larger than 256 KiB of throughput are considered multiple I/Os of size 256 KiB. For Standard HDDs, each IO operation is considered as a single transaction, regardless of the I/O size.

For detailed information on pricing for Managed Disks, including transaction costs, see [Managed Disks Pricing](https://azure.microsoft.com/pricing/details/managed-disks).

### Ultra disk VM reservation fee

Azure VMs have the capability to indicate if they are compatible with ultra disks. An ultra disk compatible VM allocates dedicated bandwidth capacity between the compute VM instance and the block storage scale unit to optimize the performance and reduce latency. Adding this capability on the VM results in a reservation charge that is only imposed if you enabled ultra disk capability on the VM without attaching an ultra disk to it. When an ultra disk is attached to the ultra disk compatible VM, this charge would not be applied. This charge is per vCPU provisioned on the VM. 

> [!Note]
> For [constrained core VM sizes](../articles/virtual-machines/linux/constrained-vcpu.md), the reservation fee is based on the actual number of vCPUs and not the constrained cores. For Standard_E32-8s_v3, the reservation fee will be based on 32 cores. 

Refer to the [Azure Disks pricing page](https://azure.microsoft.com/pricing/details/managed-disks/) for ultra disk pricing details.

### Azure disk reservation

Disk reservation is the option to purchase one year of disk storage in advance at a discount, reducing your total cost. When purchasing a disk reservation, you select a specific Disk SKU in a target region, for example, 10 P30 (1TiB) premium SSDs in East US 2 region for a one year term. The reservation experience is similar to reserved virtual machine (VM) instances. You can bundle VM and Disk reservations to maximize your savings. For now, Azure Disks Reservation offers one year commitment plan for premium SSD SKUs from P30 (1TiB) to P80 (32 TiB) in all production regions. For more details on the Reserved Disks pricing, see [Azure Disks pricing page](https://azure.microsoft.com/pricing/details/managed-disks/).