

## Operating system disk

Every virtual machine has one attached operating system disk. It’s registered as a SATA drive and labeled as the C: drive by default. This disk has a maximum capacity of 1023 gigabytes (GB). 

##Temporary disk

The temporary disk is automatically created for you. On Windows virtual machines, this disk is labeled as the D: drive by default and it used for storing pagefile.sys. On Linux virtual machines, the disk is typically /dev/sdb and is formatted and mounted to /mnt/resource by the Azure Linux Agent.

The size of the temporary disk varies, based on the size of the virtual machine. For more information, see [Sizes for Linux virtual machines](../articles/virtual-machines/virtual-machines-linux-sizes.md) or [Sizes for Windows virtual machines](../articles/virtual-machines/virtual-machines-windows-sizes.md).

>[AZURE.WARNING] Don’t store data on the temporary disk. It provides temporary storage for applications and processes and is intended to only store data such as page or swap files. To remap this disk to a different drive letter for a Windows virtual machine, see [Change the drive letter of the Windows temporary disk](../articles/virtual-machines/virtual-machines-windows-classic-change-drive-letter.md).

For more information on how Azure uses the temporary disk, see [Understanding the temporary drive on Microsoft Azure Virtual Machines](https://blogs.msdn.microsoft.com/mast/2013/12/06/understanding-the-temporary-drive-on-windows-azure-virtual-machines/)

## Data disk

A data disk is a VHD that’s attached to a virtual machine to store application data, or other data you need to keep. Data disks are registered as SCSI drives and are labeled with a letter that you choose.  Each data disk has a maximum capacity of 1023 GB. The size of the virtual machine determines how many data disks you can attach to it and the type of storage you can use to host the disks.

>[AZURE.NOTE] For more details about virtual machines capacities, see [Sizes for Linux virtual machines](../articles/virtual-machines/virtual-machines-linux-sizes.md) or [Sizes for Windows virtual machines](../articles/virtual-machines/virtual-machines-windows-sizes.md).

Azure creates an operating system disk when you create a virtual machine from an image. If you use an image that includes data disks, Azure also creates the data disks when it creates the virtual machine. Otherwise, you add data disks after you create the virtual machine.

You can add data disks to a virtual machine at any time, by **attaching** the disk to the virtual machine. You can use a VHD that you’ve uploaded or copied to your storage account, or one that Azure creates for you. Attaching a data disk associates the VHD file from your storage account with the virtual machine, by placing a ‘lease’ on the VHD so it can’t be deleted from storage while it’s still attached.

## About VHDs

The VHDs used in Azure are .vhd files stored as page blobs in a standard or premium storage account in Azure. For details about page blobs, see [Understanding block blobs and page blobs](https://msdn.microsoft.com/library/ee691964.aspx). For details about premium storage, see [Premium storage: High-performance storage for Azure virtual machine workloads](../articles/storage/storage-premium-storage.md).

Azure supports the fixed disk VHD format. The fixed format lays the logical disk out linearly within the file, so that disk offset X is stored at blob offset X. A small footer at the end of the blob describes the properties of the VHD. Often, the fixed format wastes space because most disks have large unused ranges in them. However, Azure stores .vhd files in a sparse format, so you receive the benefits of both the fixed and dynamic disks at the same time. For more details, see [Getting started with virtual hard disks](https://technet.microsoft.com/library/dd979539.aspx).

All .vhd files in Azure that you want to use as a source to create disks or images are read-only. When you create a disk or image, Azure makes copies of the .vhd files. These copies can be read-only or read-and-write, depending on how you use the VHD.

When you create a virtual machine from an image, Azure creates a disk for the virtual machine that is a copy of the source .vhd file. To protect against accidental deletion, Azure places a lease on any source .vhd file that’s used to create an image, an operating system disk, or a data disk.

Before you can delete a source .vhd file, you’ll need to remove the lease by deleting the disk or image. To delete a .vhd file that is being used by a virtual machine as an operating system disk, you can delete the virtual machine, the operating system disk, and the source .vhd file all at once by deleting the virtual machine and deleting all associated disks. However, deleting a .vhd file that’s a source for a data disk requires several steps in a set order -- detach the disk from the virtual machine, delete the disk, and then delete the .vhd file.

>[AZURE.WARNING] If you delete a source .vhd file from storage, or delete your storage account, Microsoft can't recover that data for you.




