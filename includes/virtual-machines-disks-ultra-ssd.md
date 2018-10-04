---
 title: include file
 description: include file
 services: virtual-machines
 author: roygara
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 09/24/2018
 ms.author: rogarana
 ms.custom: include file
---

# Ultra SSD (preview) Managed Disks for Azure Virtual Machine workloads

Azure Ultra SSD (preview) delivers high throughput, high IOPS, and consistent low latency disk storage for Azure IaaS VMs. This new offering provides top of the line performance at the same availability levels as our existing disks offerings. Additional benefits of Ultra SSD include the ability to dynamically change the performance of the disk along with your workloads without the need to restart your virtual machines. Ultra SSD is suited for data-intensive workloads such as SAP HANA, top tier databases, and transaction-heavy workloads.

## Ultra SSD Features

**Managed Disks**: Ultra SSDs are only available as Managed Disks. Ultra SSDs cannot be deployed as an Unmanaged Disk or Page Blob. While creating a Managed Disk, you specify the disk sku type as UltraSSD_LRS and indicate the size of disk, the IOPS, and throughput you need, and Azure creates and manages the disk for you.  

**Virtual Machines**: Ultra SSDs are designed to work with all Premium SSD enabled Azure Virtual Machine SKUs, however at preview time the VM sizes will be limited to ES/DS v3 VM instances.

**Dynamic Performance Configuration**: Ultra SSDs allow you to dynamically change the performance (IOPS and throughput) of the disk along with your workload needs without having to restart your virtual machines.

## Scalability and performance targets

When you provision an Ultra SSD, you will have the option to independently configure the capacity and the performance of the disk. Ultra SSDs come in several fixed sizes from 4 GiB up to 64 TiB and feature a flexible performance configuration model that allows you to independently configure IOPS and throughput. Ultra SSDs can only be leveraged as data disks. We recommend using Premium SSDs as OS disks.

Some key capabilities of Ultra SSD are:

- Disk Capacity: Ultra SSD offers you a range of different disk sizes from 4 GiB up to 64 TiB.
- Disk IOPS: Ultra SSDs support IOPS limits of 300 IOPS/GiB, up to a maximum of 160 K IOPS per disk. To achieve the IOPS that you provisioned, ensure that the selected Disk IOPS are less than the VM IOPS. The minimum disk IOPS is 100 IOPS.
- Disk Throughput: With Ultra SSDs, the throughput limit of a single disk is 256 KiB/s for each provisioned IOPS, up to a maximum of 2000 MBps per disk (where MBps = 10^6 Bytes per second). The minimum disk throughput is 1 MiB.

The following table summarizes the different configurations supported for different disk sizes:  

### Ultra SSD Managed Disk Offerings

|Disk Size (GiB)  |IOPS Caps  |Throughput Cap (MBps)  |
|---------|---------|---------|
|4     |1,200         |300         |
|8     |2,400         |600         |
|16     |4,800         |1,200         |
|32     |9,600         |2,000         |
|64     |19,200         |2,000         |
|128     |38,400         |2,000         |
|256     |76,800         |2,000         |
|512     |80,000         |2,000         |
|1,024-65,536 (sizes in this range increasing in increments of 1 TiB)     |160,000         |2,000         |

## Pricing and billing

When using Ultra SSDs, the following billing considerations apply:

- Managed Disk Size
- Managed Disk Provisioned IOPS
- Managed Disk Provisioned Throughput
- Ultra SSD VM reservation fee

### Managed Disk Size

Managed Disks are billed on the provisioned sizes. Azure maps the provisioned size (rounded up) to the nearest disk size offer. For details of the disk sizes offered, see the table in Scalability and Performance Targets section above. Each disk maps to a supported provisioned disk size and billed accordingly on an hourly basis. For example, if you provisioned a 200 GiB Ultra SSD Disk and deleted it after 20 hours, it will map to the disk size offer of 256 GiB and you'll be billed for the 256 GiB for 20 hours. This is regardless of the amount of actual data written to the disk.

### Managed Disk Provisioned IOPS

IOPS are the number of requests that your application is sending to the disks in one second. An input/output operation could be sequential or random, reads, or writes. Like disk size, the provisioned IOPS are billed on an hourly basis. 
For details of the disk IOPS offered, see the table in Scalability and Performance Targets section above.

### Managed Disk Provisioned Throughput

Throughput is the amount of data that your application is sending to the disks in a specified interval, measured in bytes/second. If your application is performing large input/output operations, it requires high throughput.  

There is a relation between Throughput and IOPS as shown in the following formula:  IOPS x IO size = Throughput

Therefore, it is important to determine the optimal Throughput and IOPS values that your application requires. As you try to optimize one, the other also gets affected. We recommend starting with a throughput corresponding to 16 KiB IO size, and adjusting if more throughput is needed.

For details on the supported disk throughput on Ultra SSD, see the table in Scalability and Performance Targets section above. Like disk size and IOPS, the provisioned throughput is billed on an hourly basis per MBps provisioned.

### Ultra SSD VM reservation fee

We are introducing a capability on the VM that indicates your VM is Ultra SSD compatible. An Ultra SSD Compatible VM allocates dedicated bandwidth capacity between the compute VM instance and the block storage scale unit to optimize the performance and reduce latency. Adding this capability on the VM results in a reservation charge that is only imposed if you enabled Ultra SSD capability on the VM without attaching an Ultra SSD disk to it. When an Ultra SSD disk is attached to the Ultra SSD compatible VM, this charge would not be applied. This charge is per vCPU provisioned on the VM.

Refer to the [Azure Disks pricing page](https://azure.microsoft.com/pricing/details/managed-disks/) for the new Ultra SSD Disks price details available in limited preview.

### Ultra SSD Preview Scope and Limitations

At preview, Ultra SSD Disks:

- Will be initially supported in East US 2 in a single Availability Zone  
- Can only be used with Availability Zones (Availability Sets and Single VM deployments outside of Zones will not have the ability to attach an Ultra SSD Disk)
- Are only supported on ES/DS v3 VMs
- Are only available as data disks and only support 4k physical sector size  
- Can only be created as Empty disks  
- Currently can only be deployed using Resource Manager templates, CLI, and Python SDK.
- Will not (yet) support disk snapshots, VM Images, Availability Sets, Virtual Machine Scale Sets and Azure Disk Encryption.
- Will not (yet) support integration with Azure Backup or Azure Site Recovery.
- As with [most previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/), this feature should not be used for production workloads until General Availability (GA).