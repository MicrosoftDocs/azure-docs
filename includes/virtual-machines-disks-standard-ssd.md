---
 title: include file
 description: include file
 services: virtual-machines
 author: roygara
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 08/14/2018
 ms.author: rogarana
 ms.custom: include file
---

# Standard SSD Managed Disks for Azure Virtual machine workloads

Azure Standard Solid State Drives (SSD) Managed Disks are a cost-effective storage option optimized for workloads that need consistent performance at lower IOPS levels. Standard SSD offers a good entry level experience for those who wish to move to the cloud, especially if you experience issues with the variance of workloads running on your HDD solutions on premises. Standard SSDs deliver better availability, consistency, reliability and latency compared to HDD Disks, and are suitable for Web servers, low IOPS application servers, lightly used enterprise applications, and Dev/Test workloads.

## Standard SSD Features

**Managed Disks**: Standard SSDs are only available as Managed Disks. Unmanaged Disks and Page Blobs are not supported on Standard SSD. While creating the Managed Disk, you specify the disk type as Standard SSD and indicate the size of disk you need, and Azure creates and manages the disk for you.
Standard SSDs support all service management operations offered by Managed Disks. For example, you can create, copy or snapshot Standard SSD Managed Disks in the same way you do with Managed Disks.

**Virtual Machines**: Standard SSDs can be used with all Azure VMs, including the VM types that do not support Premium Disks. For example, if you're using an A-series VM, or N-series VM, or DS-series, or any other Azure VM series, you can use Standard SSDs with that VM. With the introduction of Standard SSD, we are enabling a broad range of workloads that previously used HDD-based disks to transition to SSD-based disks, and experience the consistent performance, higher availability, better latency, and an overall better experience that come with SSDs.

**Highly durable and available**: Standard SSDs are built on the same Azure Disks platform, which has consistently delivered high availability and durability for disks. Azure Disks are designed for 99.999 percent availability. Like all Managed Disks, Standard SSDs will also offer Local Redundant Storage (LRS). With LRS, the platform maintains multiple replicas of data for every disk and has consistently delivered enterprise-grade durability for IaaS disks, with an industry-leading ZERO percent Annualized Failure Rate.

**Snapshots**: Like all Managed Disks, Standard SSDs also support creation of Snapshots. Snapshot type can be either Standard (HDD) or Premium (SSD). For cost saving, we recommend Snapshot type of Standard (HDD) for all Azure disk types. This is because when you create a managed disk from a snapshot, you're always able to choose a higher tier such as Standard SSD or Premium SSD.

## Scalability and performance targets

The following table contains disk sizes, which are currently offered for Standard SSD.

|Standard SSD Disk Type  |Disk Size  |IOPS per Disk  |Throughput per disk  |
|---------|---------|---------|---------|
|E10     |128 GiB         |Up to 500         |Up to 60 MiB per second         |
|E15     |256 GiB         |Up to 500         |Up to 60 MiB per second         |
|E20     |512 GiB         |Up to 500         |Up to 60 MiB per second         |
|E30     |1,024 GiB       |Up to 500         |Up to 60 MiB per second         |
|E40     |2,048 GiB       |Up to 500         |Up to 60 MiB per second         |
|E50     |4,095 GiB       |Up to 500         |Up to 60 MiB per second         |
|E60     |8,192 GiB       |Up to 1,300       |Up to 300 MiB per second        |
|E70     |16,384 GiB      |Up to 2,000       |Up to 500 MiB per second        |
|E80     |32,767 GiB      |Up to 2,000       |Up to 500 MiB per second        |

Standard SSDs are designed to provide single-digit millisecond latencies for most IO operations, and to deliver the IOPS and throughput up to the limits described in the above table. Actual IOPS and Throughput may vary sometimes depending on the traffic patterns. Standard SSDs will provide more consistent performance than the HDD disks with the lower latency.

Premium SSDs on the other hand, perform better than Standard SSDs, with low latencies, high IOPS/throughput, and even better consistency with provisioned disk performance. It is the recommended disk type for critical production workloads. If your workload requires high-performance, low-latency disk support, you should consider using Premium Storage.

Like the Premium SSDs, Standard SSDs also use IO Unit size of 256 KiB. If the data being transferred is less than 256 KiB, it is considered 1 I/O unit. Larger I/O sizes are counted as multiple I/Os of size 256 KiB. For example, a 1,100 KiB I/O is counted as five I/O units.

## Pricing and billing

When using Standard SSDs, the following billing considerations apply:

- Managed Disk Size
- Snapshots
- Outbound data transfers
- Transactions

**Managed Disk Size**: Managed disks are billed on the provisioned size. Azure maps the provisioned size (rounded up) to the nearest disk size offer. For details of the disk sizes offered, see the table in Scalability and Performance Targets section above. Each disk maps to a supported provisioned disk size and billed accordingly. For example, if you provisioned a 200 GiB Standard SSD, it will map to the disk size offer of E15 (256 GiB). Billing for any provisioned disk is prorated hourly by using the monthly price for the Premium Storage offer. For example, if you provisioned an E10 disk and deleted it after 20 hours, you're billed for the E10 offering prorated to 20 hours. This is regardless of the amount of actual data written to the disk.

**Snapshots**: Snapshots of Managed Disks are billed for the capacity used by the snapshots, at the target and at the source, if any. For more information on snapshots, see [Managed Disk Snapshots](https://docs.microsoft.com/azure/virtual-machines/windows/managed-disks-overview#managed-disk-snapshots).

**Outbound data transfers**: [Outbound data transfers](https://azure.microsoft.com/pricing/details/bandwidth/) (data going out of Azure data centers) incur billing for bandwidth usage.

**Transactions**: Similar to Standard HDD, transactions on Standard SSDs incur billing. Transactions include both read and write operations on the disk. I/O unit size used for accounting the transactions on Standard SSD is 256 KiB. Larger I/O sizes are counted as multiple I/Os of size 256 KiB.

For more information on pricing for Virtual Machines and Managed Disks, see:

- [Virtual Machines Pricing](https://azure.microsoft.com/pricing/details/virtual-machines/linux/)
- [Managed Disks Pricing](https://azure.microsoft.com/pricing/details/managed-disks/)

## Next steps

To learn more about creating standard SSDs, refer to the sample that shows how to create a VM with multiple standard SSDs.

> [!div class="nextstepaction"]
> [Create a VM with multiple standard SSDs](https://github.com/azure/azure-quickstart-templates/tree/master/101-vm-with-standardssd-disk/)