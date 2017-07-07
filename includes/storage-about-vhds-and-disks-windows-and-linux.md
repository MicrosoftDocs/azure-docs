
## About VHDs

The VHDs used in Azure are .vhd files stored as page blobs in a standard or premium storage account in Azure. For details about page blobs, see [Understanding block blobs and page blobs](/rest/api/storageservices/Understanding-Block-Blobs--Append-Blobs--and-Page-Blobs/). For details about premium storage, see [High-performance premium storage and Azure VMs](../articles/storage/storage-premium-storage.md).

Azure supports the fixed disk VHD format. The fixed format lays the logical disk out linearly within the file, so that disk offset X is stored at blob offset X. A small footer at the end of the blob describes the properties of the VHD. Often, the fixed format wastes space because most disks have large unused ranges in them. However, Azure stores .vhd files in a sparse format, so you receive the benefits of both the fixed and dynamic disks at the same time. For more details, see [Getting started with virtual hard disks](https://technet.microsoft.com/library/dd979539.aspx).

All .vhd files in Azure that you want to use as a source to create disks or images are read-only. When you create a disk or image, Azure makes copies of the .vhd files. These copies can be read-only or read-and-write, depending on how you use the VHD.

When you create a virtual machine from an image, Azure creates a disk for the virtual machine that is a copy of the source .vhd file. To protect against accidental deletion, Azure places a lease on any source .vhd file that’s used to create an image, an operating system disk, or a data disk.

Before you can delete a source .vhd file, you’ll need to remove the lease by deleting the disk or image. To delete a .vhd file that is being used by a virtual machine as an operating system disk, you can delete the virtual machine, the operating system disk, and the source .vhd file all at once by deleting the virtual machine and deleting all associated disks. However, deleting a .vhd file that’s a source for a data disk requires several steps in a set order. First you detach the disk from the virtual machine, then delete the disk, and then delete the .vhd file.

> [!WARNING]
> If you delete a source .vhd file from storage, or delete your storage account, Microsoft can't recover that data for you.
> 

## Types of disks 

Azure Disks are designed for 99.999% availability. Azure Disks have consistently delivered enterprise-grade durability, with an industry-leading ZERO% Annualized Failure Rate.

There are two performance tiers for storage that you can choose from when creating your disks -- Standard Storage and Premium Storage. Also, there are two types of disks -- unmanaged and managed -- and they can reside in either performance tier.


### Standard storage 

Standard Storage is backed by HDDs, and delivers cost-effective storage while still being performant. Standard storage can be replicated locally in one datacenter, or be geo-redundant with primary and secondary data centers. For more information about storage replication, please see [Azure Storage replication](../articles/storage/storage-redundancy.md). 

For more information about using Standard Storage with VM disks, please see [Standard Storage and Disks](../articles/storage/storage-standard-storage.md).

### Premium storage 

Premium Storage is backed by SSDs, and delivers high-performance, low-latency disk support for VMs running I/O-intensive workloads. You can use Premium Storage with DS, DSv2, GS, Ls, or FS series Azure VMs. For more information, please see [Premium Storage](../articles/storage/storage-premium-storage.md).

### Unmanaged disks

Unmanaged disks are the traditional type of disks that have been used by VMs. With these, you create your own storage account and specify that storage account when you create the disk. You have to make sure you don't put too many disks in the same storage account, because you could exceed the [scalability targets](../articles/storage/storage-scalability-targets.md) of the storage account (20,000 IOPS, for example), resulting in the VMs being throttled. With unmanaged disks, you have to figure out how to maximize the use of one or more storage accounts to get the best performance out of your VMs.

### Managed disks 

Managed Disks handles the storage account creation/management in the background for you, and ensures that you do not have to worry about the scalability limits of the storage account. You simply specify the disk size and the performance tier (Standard/Premium), and Azure creates and manages the disk for you. Even as you add disks or scale the VM up and down, you don't have to worry about the storage being used. 

You can also manage your custom images in one storage account per Azure region, and use them to create hundreds of VMs in the same subscription. For more information about Managed Disks, please see the [Managed Disks Overview](../articles/storage/storage-managed-disks-overview.md).

We recommend that you use Azure Managed Disks for new VMs, and that you convert your previous unmanaged disks to managed disks, to take advantage of the many features available in Managed Disks.

### Disk comparison

The following table provides a comparison of Premium vs Standard for both unmanaged and managed disks to help you decide what to use.

|    | Azure Premium Disk | Azure Standard Disk |
|--- | ------------------ | ------------------- |
| Disk Type | Solid State Drives (SSD) | Hard Disk Drives (HDD)  |
| Overview  | SSD-based high-performance, low-latency disk support for VMs running IO-intensive workloads or hosting mission critical production environment | HDD-based cost effective disk support for Dev/Test VM scenarios |
| Scenario  | Production and performance sensitive workloads | Dev/Test, non-critical, <br>Infrequent access |
| Disk Size | P4: 32 GB (Managed Disks only)<br>P6: 64 GB (Managed Disks only)<br>P10: 128 GB<br>P20: 512 GB<br>P30: 1024 GB<br>P40: 2048 GB<br>P50: 4095 GB | Unmanaged Disks: 1 GB – 4 TB (4095 GB) <br><br>Managed Disks:<br> S4: 32 GB <br>S6: 64 GB <br>S10: 128 GB <br>S20: 512 GB <br>S30: 1024 GB <br>S40: 2048 GB<br>S50: 4095 GB| 
| Max Throughput per Disk | 250 MB/s | 60 MB/s | 
| Max IOPS per Disk | 7500 IOPS | 500 IOPS | 

