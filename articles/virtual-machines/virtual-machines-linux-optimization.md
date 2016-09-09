<properties
	pageTitle="Optimizing your Linux VM on Azure | Microsoft Azure"
	description="Learn some optimization tips to make sure you have set up your Linux VM for optimal performance on Azure"
	keywords="linux virtual machine,virtual machine linux,ubuntu virtual machine" 
	services="virtual-machines-linux"
	documentationCenter=""
	authors="rickstercdn"
	manager="timlt"
	editor="tysonn"
	tags="azure-resource-manager" />

<tags
	ms.service="virtual-machines-linux"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-linux"
	ms.devlang="na"
	ms.topic="article"
	ms.date="06/21/2016"
	ms.author="rclaus"/>

# Optimize your Linux VM on Azure

Creating a Linux virtual machine (VM) is easy to do from the command line or from the portal. This tutorial shows you how to ensure you have set it up to optimize its performance on the Microsoft Azure platform. This topic uses an Ubuntu Server VM, but you can also create Linux virtual machine using [your own images as templates](virtual-machines-linux-create-upload-generic.md).  

## Prerequisites

This topic assumes you already have a working Azure Subscription ([free trial signup](https://azure.microsoft.com/pricing/free-trial/)), [installed the Azure CLI](../xplat-cli-install.md) and have already provisioned a VM into your Azure Subscription. Before doing anything with Azure - you have to authenticate to your subscription. To do this with Azure CLI, simply type `azure login` to start the interactive process. 

## Azure OS Disk

Once you create a Linux Vm in Azure, it has two disks associated with it. /dev/sda is your OS disk, /dev/sdb is your temporary disk.  Do not use the main OS disk (/dev/sda) for anything except the operating system as it is optimized for fast VM boot time and will not provide good performance for your workloads. You will want to attach one or more disks to your VM in order to get persistent and optimized storage for your data. 

## Adding Disks for Size and Performance targets 

Based on the VM size you choose, you can attach up to 16 additional disks on an A-Series, 32 disks on a D-Series and 64 disks on a G-Series machine - each up to 1 TB in size. It is recommended to add extra disks as needed per your space and IOps requirements. Each disk has a performance target of 500 IOps for Standard Storage and up to 5000 IOps per disk for Premium Storage.  For more information about Premium Storage disks, please refer to [Premium Storage: High-Performance Storage for Azure VMs](../storage/storage-premium-storage.md)

In order to achieve the highest IOps on Premium Storage disks where their cache settings have been set to either "ReadOnly" or "None", you must disable "barriers" while mounting the file system in Linux. You do not need barriers because the writes to Premium Storage backed disks are durable for these cache settings.

- If you use **reiserFS**, disable barriers using the mount option “barrier=none” (For enabling barriers, use “barrier=flush”)
- If you use **ext3/ext4**, disable barriers using the mount option “barrier=0” (For enabling barriers, use “barrier=1”)
- If you use **XFS**, disable barriers using the mount option “nobarrier” (For enabling barriers, use the option “barrier”)

## Storage Account Considerations

When you create your Linux VM in Azure, you should make sure you attach disks from storage accounts residing in the same region as your VM to ensure close proximity and minimize network latency.  Each Standard storage account has a maximum of 20k IOps and a 500 TB size capacity.  This works out to approximately 40 heavily used disks including both the OS disk and any data disks you create. For Premium Storage accounts, there is no Maximum IOps limit but there is a 32 TB size limit. 

When dealing with very high IOps workloads and you have chosen Standard Storage for your disks, you might need to split the disks across multiple storage accounts to make sure you have not hit the 20,000 IOps limit for Standard Storage accounts. Your VM can contain a mix of disks from across different storage accounts and storage account types to achieve your optimal configuration. 

## Your VM Temporary drive

By default when you create a new VM, Azure provides you with an OS disk (/dev/sda) and a temporary disk (/dev/sdb).  All additional disks you add will show up as /dev/sdc, /dev/sdd, /dev/sde and so on. All data on your temporary disk (/dev/sdb) is not durable and can be lost if specific events like VM Resizing, redeployment or maintenance forces a restart of your VM.  The size and type of your temporary disk is related to the VM size you chose at deployment time. In the case of any of the premium size VMs (DS, G and DS_V2 series) the temporary drive will be backed by a local SSD for additional performance of up to 48k IOps. 

## Linux Swap File

VM images deployed from the Azure Marketplace have a VM Linux Agent integrated with the OS which allows the VM to interact with various Azure services. Assuming you have deployed a standard image from the Azure Marketplace, you would need to do the following to correctly configure your Linux swap file settings:

Locate and modify two entries in the **/etc/waagent.conf** file. They control the existence of a dedicated swap file and size of the swap file. The parameters you are looking to modify are `ResourceDisk.EnableSwap=N` and `ResourceDisk.SwapSizeMB=0` 

You will need to change them to the following:

* ResourceDisk.EnableSwap=Y
* ResourceDisk.SwapSizeMB={size in MB to meet your needs} 

Once you have made the change, you will need to restart the waagent or restart your Linux VM in order to reflect those changes.  You know the changes have been implemented and a swap file has been created when a you use the `free` command to view free space. The example below has a 512MB swap file created as a result of modifying the waagent.conf file.

    admin@mylinuxvm:~$ free
                total       used       free     shared    buffers     cached
    Mem:       3525156     804168    2720988        408       8428     633192
    -/+ buffers/cache:     162548    3362608
    Swap:       524284          0     524284
    admin@mylinuxvm:~$
 
## I/O scheduling algorithm for Premium Storage

With the 2.6.18 Linux kernel, the default I/O scheduling algorithm was changed from Deadline to CFQ (Completely fair queuing algorithm). For random access I/O patterns, there is negligible difference in performance differences between CFQ and Deadline.  For SSD based disks where the disk I/O pattern is predominantly sequential, switching back to the NOOP or Deadline algorithm can achieve better I/O performance.

### View the current I/O scheduler

Use the following command:  

	admin@mylinuxvm:~# cat /sys/block/sda/queue/scheduler

You will see following output, which indicates the current scheduler.  

	noop [deadline] cfq

###Change the current device (/dev/sda) of I/O scheduling algorithm

Use the following commands:  

	azureuser@mylinuxvm:~$ sudo su -
	root@mylinuxvm:~# echo "noop" >/sys/block/sda/queue/scheduler
	root@mylinuxvm:~# sed -i 's/GRUB_CMDLINE_LINUX=""/GRUB_CMDLINE_LINUX_DEFAULT="quiet splash elevator=noop"/g' /etc/default/grub
	root@mylinuxvm:~# update-grub

>[AZURE.NOTE] Setting this for /dev/sda alone is not useful. It needs to be set on all data disks where sequential I/O dominates the I/O pattern.  

You should see the following output, indicating that grub.cfg has been rebuilt successfully and that the default scheduler has been updated to NOOP.  

	Generating grub configuration file ...
	Found linux image: /boot/vmlinuz-3.13.0-34-generic
	Found initrd image: /boot/initrd.img-3.13.0-34-generic
	Found linux image: /boot/vmlinuz-3.13.0-32-generic
	Found initrd image: /boot/initrd.img-3.13.0-32-generic
	Found memtest86+ image: /memtest86+.elf
	Found memtest86+ image: /memtest86+.bin
	done

For the Redhat distribution family, you only need the following command:   

	echo 'echo noop >/sys/block/sda/queue/scheduler' >> /etc/rc.local

## Using Software RAID to achieve higher I/Ops

If your workloads require more IOps than a single disk can provide, you will need to use a software RAID configuration of multiple disks. Because Azure already performs disk resiliency at the local fabric layer, you will achieve the highest level of performance from a RAID-0 striping configuration.  You will need to provision and create new disks in the Azure environment and attach them to your Linux VM prior to partitioning, formatting and mounting the drives.  More details on configuring a software RAID setup on your Linux VM in azure can be found in the **[Configuring Software RAID on Linux](virtual-machines-linux-configure-raid.md)** document.


## Next Steps

Remember, as with all optimization discussions, you will need to perform tests before and after each change to measure the impact the change will have.  Optimization is a step by step process that will have different results across different machines in your environment.  What works for one configuration may not work for others.

Some useful links to additional resources: 

- [Premium Storage: High-Performance Storage for Azure Virtual Machine Workloads](../storage/storage-premium-storage.md)
- [Azure Linux Agent User Guide](virtual-machines-linux-agent-user-guide.md)
- [Optimizing MySQL Performance on Azure Linux VMs](virtual-machines-linux-classic-optimize-mysql.md)
- [Configure Software RAID on Linux](virtual-machines-linux-configure-raid.md)
