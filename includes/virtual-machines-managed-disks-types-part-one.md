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
# Disk types

Azure Managed Disks currently offers three disk types which are generally available and one currently in preview. These four disk types each have their own appropriate target customer scenarios, they are as follows:

|Disk Type  |Scenario  |
|---------|---------|
|Ultra SSD (Preview)     |IO-intensive workloads such as SAP HANA, top tier databases (e.g. SQL, Oracle), and other transaction-heavy workloads.         |
|Premium SSD     |Production and performance sensitive workloads         |
|Standard SSD     |Web servers, lightly used enterprise applications and Dev/Test         |
|Standard HDD     |Backup, Non-critical, Infrequent access         |

## Ultra SSD (Preview)

Azure Ultra SSD (preview) delivers high throughput, high IOPS, and consistent low latency disk storage for Azure IaaS VMs. This new offering provides top of the line performance at the same availability levels as our existing disks offerings. Additional benefits of Ultra SSD include the ability to dynamically change the performance of the disk along with your workloads without the need to restart your virtual machines. Ultra SSD is suited for data-intensive workloads such as SAP HANA, top tier databases, and transaction-heavy workloads.

### Performance

When you provision an Ultra SSD, you will have the option to independently configure the capacity and the performance of the disk. Ultra SSDs come in several fixed sizes from 4 GiB up to 64 TiB and feature a flexible performance configuration model that allows you to independently configure IOPS and throughput. Ultra SSDs can only be leveraged as data disks. We recommend using Premium SSDs as OS disks.

Some key capabilities of Ultra SSD are:

- Disk Capacity: Ultra SSD offers you a range of different disk sizes from 4 GiB up to 64 TiB.
- Disk IOPS: Ultra SSDs support IOPS limits of 300 IOPS/GiB, up to a maximum of 160 K IOPS per disk. To achieve the IOPS that you provisioned, ensure that the selected Disk IOPS are less than the VM IOPS. The minimum disk IOPS are 100 IOPS.
- Disk Throughput: With Ultra SSDs, the throughput limit of a single disk is 256 KiB/s for each provisioned IOPS, up to a maximum of 2000 MBps per disk (where MBps = 10^6 Bytes per second). The minimum disk throughput is 1 MiB.

### Disk size

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

### Ultra SSD Preview Scope and Limitations

During preview, Ultra SSD Disks:

- Will be initially supported in East US 2 in a single Availability Zone  
- Can only be used with Availability Zones (Availability Sets and Single VM deployments outside of Zones will not have the ability to attach an Ultra SSD Disk)
- Are only supported on ES/DS v3 VMs
- Are only available as data disks and only support 4k physical sector size  
- Can only be created as Empty disks  
- Currently can only be deployed using Resource Manager templates, CLI, and Python SDK.
- Will not (yet) support disk snapshots, VM Images, Availability Sets, Virtual Machine Scale Sets and Azure Disk Encryption.
- Will not (yet) support integration with Azure Backup or Azure Site Recovery.
- As with [most previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/), this feature should not be used for production workloads until General Availability (GA).

## Premium SSD

Azure Premium SSDs deliver high-performance, low-latency disk support for virtual machines (VMs) with input/output (I/O)-intensive workloads. To take advantage of the speed and performance of premium storage disks, you can migrate existing VM disks to Premium Storage.

### Disk size

Sizes marked with an asterisk are currently in preview.

| Premium Disk Type  | P4               | P6               | P10             | P15 | P20              | S30              | P40              | P50              | P60*              | P70*              | P80*              |
|---------------------|---------------------|---------------------|------------------|------------------|------------------|------------------|------------------|------------------|------------------|------------------|------------------|
| Disk size in GiB           | 32             | 64             | 128            | 256  | 512            | 1,024    | 2,048     | 4,095    | 8,192     | 16,384     | 32,767     |
| IOPS per disk       | Up to 120 | Up to 240              | Up to 500              | Up to 1,100 | Up to 2,300              | Up to 5,000              | Up to 7,500             | Up to 7,500              | Up to 12,500              | Up to 15,000              | Up to 20,000              |
| Throughput per disk | Up to 25 MiB/sec | Up to 50 MiB/sec | Up to 100 MiB/sec | Up to 125 MiB/sec | Up to 150 MiB/sec | Up to 200 MiB/sec | Up to 250 MiB/sec | Up to 250 MiB/sec| Up to 480 MiB/sec | Up to 750 MiB/sec | Up to 750 MiB/sec |

## Standard SSD

Azure Standard Solid State Drives (SSD) Managed Disks are a cost-effective storage option optimized for workloads that need consistent performance at lower IOPS levels. Standard SSD offers a good entry level experience for those who wish to move to the cloud, especially if you experience issues with the variance of workloads running on your HDD solutions on premises. Standard SSDs deliver better availability, consistency, reliability and latency compared to HDD Disks, and are suitable for Web servers, low IOPS application servers, lightly used enterprise applications, and Dev/Test workloads.

### Disk size

Sizes marked with an asterisk are currently in preview.

| Standard SSD Disk Type  | E10               | E15               | E20             | E30 | E40              | E50              | E60*              | E70*              | E80*              |
|---------------------|---------------------|---------------------|------------------|------------------|------------------|------------------|------------------|------------------|------------------|
| Disk size in GiB           | 128             | 256             | 512            | 1,024  | 2,048            | 4,095     | 8,192     | 16,384     | 32,767    |
| IOPS per disk       | Up to 500              | Up to 500              | Up to 500              | Up to 500 | Up to 500              | Up to 500              | Up to 500             | Up to 500              | Up to 1,300              | Up to 2,000              | Up to 2,000              |
| Throughput per disk | Up to 60 MiB/sec | Up to 60 MiB/sec | Up to 60 MiB/sec | Up to 60 MiB/sec | Up to 60 MiB/sec | Up to 60 MiB/sec | Up to 60 MiB/sec | Up to 60 MiB/sec| Up to 300 MiB/sec |  Up to 500 MiB/sec | Up to 500 MiB/sec |

## Standard HDD

Azure Standard Storage delivers reliable, low-cost disk support for VMs running latency-insensitive workloads. It also supports blobs, tables, queues, and files. With Standard Storage, the data is stored on hard disk drives (HDDs). When working with VMs, you can use standard SSD and HDD disks for Dev/Test scenarios and less critical workloads, and premium SSD disks for mission-critical production applications. Standard Storage is available in all Azure regions.

### Disk size

Sizes marked with an asterisk are currently in preview.

| Standard Disk Type  | S4               | S6               | S10             | S15 | S20              | S30              | S40              | S50              | S60*              | S70*              | S80*              |
|---------------------|---------------------|---------------------|------------------|------------------|------------------|------------------|------------------|------------------|------------------|------------------|------------------|
| Disk size in GiB          | 32             | 64             | 128            | 256  | 512            | 1,024    | 2,048     | 4,095    | 8,192     | 16,384     | 32,767     |
| IOPS per disk       | Up to 500              | Up to 500              | Up to 500              | Up to 500 | Up to 500              | Up to 500              | Up to 500             | Up to 500              | Up to 1,300              | Up to 2,000              | Up to 2,000              |
| Throughput per disk | Up to 60 MiB/sec | Up to 60 MiB/sec | Up to 60 MiB/sec | Up to 60 MiB/sec | Up to 60 MiB/sec | Up to 60 MiB/sec | Up to 60 MiB/sec | Up to 60 MiB/sec| Up to 300 MiB/sec | Up to 500 MiB/sec | Up to 500 MiB/sec |

## Billing

When using Managed Disks, the following billing considerations apply:

- Disk Type
- Managed Disk Size
- Snapshots
- Outbound data transfers
- Number of Transactions

**Managed Disk Size**: Managed disks are billed on the provisioned size. Azure maps the provisioned size (rounded up) to the nearest disk size offer. For details of the disk sizes offered, see the table in Scalability and Performance Targets section above. Each disk maps to a supported provisioned disk size and billed accordingly. For example, if you provisioned a 200 GiB Standard SSD, it will map to the disk size offer of E15 (256 GiB). Billing for any provisioned disk is prorated hourly by using the monthly price for the Premium Storage offer. For example, if you provisioned an E10 disk and deleted it after 20 hours, you're billed for the E10 offering prorated to 20 hours. This is regardless of the amount of actual data written to the disk.
