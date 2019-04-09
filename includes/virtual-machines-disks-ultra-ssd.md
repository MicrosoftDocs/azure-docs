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

# Ultra disks (preview) managed disks for Azure virtual machine workloads

Azure ultra disks (preview) delivers high throughput, high IOPS, and consistent low latency disk storage for Azure IaaS VMs. This new offering provides top of the line performance at the same availability levels as our existing disks offerings. Additional benefits of ultra disks include the ability to dynamically change the performance of the disk along with your workloads without the need to restart your virtual machines. Ultra disks are suited for data-intensive workloads such as SAP HANA, top tier databases, and transaction-heavy workloads.

## Ultra disk features

**Managed disks**: Ultra disks are only available as managed disks. Ultra disks cannot be deployed as an unmanaged disk or page blob. While creating a managed disk, you specify the disk sku type as UltraSSD_LRS and indicate the size of disk, the IOPS, and throughput you need, and Azure creates and manages the disk for you.  

**Virtual Machines**: Ultra disks are designed to work with all Premium SSD enabled Azure Virtual Machine SKUs; however, as it is currently in preview, the VMs are sized as ES/DS v3.

**Dynamic Performance Configuration**: Ultra disks allow you to dynamically change the performance (IOPS and throughput) of the disk along with your workload needs without having to restart your virtual machines.

## Scalability and performance targets

When you provision an ultra disks, you will have the option to independently configure the capacity and the performance of the disk. Ultra disks come in several fixed sizes from 4 GiB up to 64 TiB and feature a flexible performance configuration model that allows you to independently configure IOPS and throughput. Ultra disks can only be leveraged as data disks. We recommend using Premium SSDs as OS disks.

Some key capabilities of ultra disks are:

- Disk Capacity: Ultra disks offers you a range of different disk sizes from 4 GiB up to 64 TiB.
- Disk IOPS: Ultra disks support IOPS limits of 300 IOPS/GiB, up to a maximum of 160 K IOPS per disk. To achieve the IOPS that you provisioned, ensure that the selected Disk IOPS are less than the VM IOPS. The minimum disk IOPS is 100 IOPS.
- Disk Throughput: With ultra disks, the throughput limit of a single disk is 256 KiB/s for each provisioned IOPS, up to a maximum of 2000 MBps per disk (where MBps = 10^6 Bytes per second). The minimum disk throughput is 1 MiB.

The following table summarizes the different configurations supported for different disk sizes:  

### Ultra disks managed disk offerings

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

When using ultra disks, the following billing considerations will be applied:

- Managed Disk Size
- Managed Disk Provisioned IOPS
- Managed Disk Provisioned Throughput
- Ultra disk VM reservation fee

### Managed disk size

Managed Disks are billed on the VM sizes that you choose while provisioning a new Azure VM. Azure maps the provisioned size (rounded up) to the nearest disk size offer. For details of the disk sizes offered, see the table in Scalability and Performance Targets section above. Each disk maps to a supported provisioned disk size and will billed accordingly on an hourly basis. For example, if you provisioned a 200 GiB ultra disk and deleted it after 20 hours, it will map to the disk size offer of 256 GiB and you'll be billed for the 256 GiB for 20 hours. This billing was based on compute-hour consumption regardless of the volume of data actually written to the disk.

### Managed disk provisioned IOPS

IOPS are the number of requests that your application is sending to the disks per second. An input/output operation could be sequential read or write or random read or write. Based on disk size or the number of disks attached to the VM, the average number of IOPS are billed on an hourly basis. 
For details of the disk IOPS offered, see the table in Scalability and Performance Targets section above.

### Managed disk provisioned throughput

Throughput is the amount of data that your application is sending to the disks in a specified interval, measured in bytes/second. If your application is performing large input/output operations, it requires high throughput.  

There is a relation between Throughput and IOPS as shown in the following formula:  IOPS x IO size = Throughput

Therefore, it is important to determine the optimal Throughput and IOPS values that your application requires. As you try to optimize one, the other also gets affected. We recommend starting with a throughput corresponding to 16 KiB IO size, and adjusting if more throughput is needed.

For details on the supported disk throughput on ultra disks, see the table in Scalability and Performance Targets section above. Like disk size and IOPS, the provisioned throughput is billed on an hourly basis per MBps provisioned.

### Ultra disk VM reservation fee

We are introducing a capability on the VM that indicates your VM is ultra disk compatible. An ultra disk compatible VM allocates dedicated bandwidth capacity between the compute VM instance and the block storage scale unit to optimize the performance and reduce latency. Adding this capability on the VM results in a reservation charge that is only imposed if you enabled ultra disk capability on the VM without attaching an ultra disk to it. When an ultra disk is attached to the ultra compatible VM, this charge would not be applied. This charge is per vCPU provisioned on the VM.

Refer to the [Azure Disks pricing page](https://azure.microsoft.com/pricing/details/managed-disks/) for the new ultra Disks price details available in limited preview.

### Ultra disk preview scope and limitations

At preview, ultra disks:

- Will be initially supported in East US 2 in a single Availability Zone  
- Can only be used with Availability Zones (Availability Sets and Single VM deployments outside of Zones will not have the ability to attach an ultra disk)
- Are only supported on ES/DS v3 VMs
- Are only available as data disks and only support 4k physical sector size  
- Can only be created as Empty disks  
- Currently can only be deployed using Resource Manager templates, CLI, and Python SDK.
- Will not (yet) support disk snapshots, VM Images, Availability Sets, Virtual Machine Scale Sets and Azure Disk Encryption.
- Will not (yet) support integration with Azure Backup or Azure Site Recovery.
- As with [most previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/), this feature should not be used for production workloads until General Availability (GA).
