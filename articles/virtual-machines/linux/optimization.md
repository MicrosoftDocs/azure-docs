---
title: Optimize your Linux VM on Azure 
description: Learn some optimization tips to make sure you have set up your Linux VM for optimal performance on Azure
author: rickstercdn
ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.topic: how-to
ms.date: 09/06/2016
ms.author: rclaus
ms.subservice: disks

---
# Optimize your Linux VM on Azure
Creating a Linux virtual machine (VM) is easy to do from the command line or from the portal. This tutorial shows you how to ensure you have set it up to optimize its performance on the Microsoft Azure platform. This topic uses an Ubuntu Server VM, but you can also create Linux virtual machine using [your own images as templates](create-upload-generic.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).  

## Prerequisites
This topic assumes you already have a working Azure subscription ([free trial signup](https://azure.microsoft.com/pricing/free-trial/)) and have already provisioned a VM into your Azure subscription. Make sure that you have the latest [Azure CLI](/cli/azure/install-az-cli2) installed and logged in to your Azure subscription with [az login](/cli/azure/reference-index) before you [create a VM](quick-create-cli.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

## Azure OS Disk
Once you create a Linux VM in Azure, it has two disks associated with it. **/dev/sda** is your OS disk, **/dev/sdb** is your temporary disk.  Do not use the main OS disk (**/dev/sda**) for anything except the operating system as it is optimized for fast VM boot time and does not provide good performance for your workloads. You want to attach one or more disks to your VM to get persistent and optimized storage for your data. 

## Adding Disks for Size and Performance targets
Based on the VM size, you can attach up to 16 additional disks on an A-Series, 32 disks on a D-Series and 64 disks on a G-Series machine - each up to 32 TB in size. You add extra disks as needed per your space and IOps requirements. Each disk has a performance target of 500 IOps for Standard Storage and up to 20,000 IOps per disk for Premium Storage.

To achieve the highest IOps on Premium Storage disks where their cache settings have been set to either **ReadOnly** or **None**, you must disable **barriers** while mounting the file system in Linux. You do not need barriers because the writes to Premium Storage backed disks are durable for these cache settings.

* If you use **reiserFS**, disable barriers using the mount option `barrier=none` (For enabling barriers, use `barrier=flush`)
* If you use **ext3/ext4**, disable barriers using the mount option `barrier=0` (For enabling barriers, use `barrier=1`)
* If you use **XFS**, disable barriers using the mount option `nobarrier` (For enabling barriers, use the option `barrier`)

## Unmanaged storage account considerations
The default action when you create a VM with the Azure CLI is to use Azure Managed Disks.  These disks are handled by the Azure platform and do not require any preparation or location to store them.  Unmanaged disks require a storage account and have some additional performance considerations.  For more information about managed disks, see [Azure Managed Disks overview](../windows/managed-disks-overview.md).  The following section outlines performance considerations only when you use unmanaged disks.  Again, the default and recommended storage solution is to use managed disks.

If you create a VM with unmanaged disks, make sure that you attach disks from storage accounts residing in the same region as your VM to ensure close proximity and minimize network latency.  Each Standard storage account has a maximum of 20k IOps and a 500 TB size capacity.  This  limit works out to approximately 40 heavily used disks including both the OS disk and any data disks you create. For Premium Storage accounts, there is no Maximum IOps limit but there is a 32 TB size limit. 

When dealing with high IOps workloads and you have chosen Standard Storage for your disks, you might need to split the disks across multiple storage accounts to make sure you have not hit the 20,000 IOps limit for Standard Storage accounts. Your VM can contain a mix of disks from across different storage accounts and storage account types to achieve your optimal configuration.
 

## Your VM Temporary drive
By default when you create a VM, Azure provides you with an OS disk (**/dev/sda**) and a temporary disk (**/dev/sdb**).  All additional disks you add show up as **/dev/sdc**, **/dev/sdd**, **/dev/sde** and so on. All data on your temporary disk (**/dev/sdb**) is not durable, and can be lost if specific events like VM Resizing, redeployment, or maintenance forces a restart of your VM.  The size and type of your temporary disk is related to the VM size you chose at deployment time. All of the premium size VMs (DS, G, and DS_V2 series) the temporary drive are backed by a local SSD for additional performance of up to 48k IOps. 

## Linux Swap Partition
If your Azure VM is from an Ubuntu or CoreOS image, then you can use CustomData to send a cloud-config to cloud-init. If you [uploaded a custom Linux image](upload-vhd.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) that uses cloud-init, you also configure swap partitions using cloud-init.

On Ubuntu Cloud Images, you must use cloud-init to configure the swap partition. For more information, see [AzureSwapPartitions](https://wiki.ubuntu.com/AzureSwapPartitions).

For images without cloud-init support, VM images deployed from the Azure Marketplace have a VM Linux Agent integrated with the OS. This agent allows the VM to interact with various Azure services. Assuming you have deployed a standard image from the Azure Marketplace, you would need to do the following to correctly configure your Linux swap file settings:

Locate and modify two entries in the **/etc/waagent.conf** file. They control the existence of a dedicated swap file and size of the swap file. The parameters you need to verify are are `ResourceDisk.EnableSwap` and `ResourceDisk.SwapSizeMB` 

To enable a properly enabled disk and mounted swap file, ensure the parameters have the following settings:

* ResourceDisk.EnableSwap=Y
* ResourceDisk.SwapSizeMB={size in MB to meet your needs} 

Once you have made the change, you need to restart the waagent or restart your Linux VM to reflect those changes.  You know the changes have been implemented and a swap file has been created when you use the `free` command to view free space. The following example has a 512MB swap file created as a result of modifying the **waagent.conf** file:

```bash
azuseruser@myVM:~$ free
            total       used       free     shared    buffers     cached
Mem:       3525156     804168    2720988        408       8428     633192
-/+ buffers/cache:     162548    3362608
Swap:       524284          0     524284
```

## I/O scheduling algorithm for Premium Storage
With the 2.6.18 Linux kernel, the default I/O scheduling algorithm was changed from Deadline to CFQ (Completely fair queuing algorithm). For random access I/O patterns, there is negligible difference in performance differences between CFQ and Deadline.  For SSD-based disks where the disk I/O pattern is predominantly sequential, switching back to the NOOP or Deadline algorithm can achieve better I/O performance.

### View the current I/O scheduler
Use the following command:  

```bash
cat /sys/block/sda/queue/scheduler
```

You see following output, which indicates the current scheduler.  

```bash
noop [deadline] cfq
```

### Change the current device (/dev/sda) of I/O scheduling algorithm
Use the following commands:  

```bash
azureuser@myVM:~$ sudo su -
root@myVM:~# echo "noop" >/sys/block/sda/queue/scheduler
root@myVM:~# sed -i 's/GRUB_CMDLINE_LINUX=""/GRUB_CMDLINE_LINUX_DEFAULT="quiet splash elevator=noop"/g' /etc/default/grub
root@myVM:~# update-grub
```

> [!NOTE]
> Applying this setting for **/dev/sda** alone is not useful. Set on all data disks where sequential I/O dominates the I/O pattern.  

You should see the following output, indicating that **grub.cfg** has been rebuilt successfully and that the default scheduler has been updated to NOOP.  

```bash
Generating grub configuration file ...
Found linux image: /boot/vmlinuz-3.13.0-34-generic
Found initrd image: /boot/initrd.img-3.13.0-34-generic
Found linux image: /boot/vmlinuz-3.13.0-32-generic
Found initrd image: /boot/initrd.img-3.13.0-32-generic
Found memtest86+ image: /memtest86+.elf
Found memtest86+ image: /memtest86+.bin
done
```

For the Red Hat distribution family, you only need the following command:   

```bash
echo 'echo noop >/sys/block/sda/queue/scheduler' >> /etc/rc.local
```

Ubuntu 18.04 with the Azure-tuned kernel uses multi-queue I/O schedulers. In that scenario, `none` is the appropriate selection instead of `noop`. For more information, see [Ubuntu I/O Schedulers](https://wiki.ubuntu.com/Kernel/Reference/IOSchedulers).

## Using Software RAID to achieve higher I/Ops
If your workloads require more IOps than a single disk can provide, you need to use a software RAID configuration of multiple disks. Because Azure already performs disk resiliency at the local fabric layer, you achieve the highest level of performance from a RAID-0 striping configuration.  Provision and create disks in the Azure environment and attach them to your Linux VM before partitioning, formatting and mounting the drives.  More details on configuring a software RAID setup on your Linux VM in azure can be found in the **[Configuring Software RAID on Linux](configure-raid.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)** document.

As an alternative to a traditional RAID configuration, you can also choose to install Logical Volume Manager (LVM) in order to configure a number of physical disks into a single striped logical storage volume. In this configuration, reads and writes are distributed to multiple disks contained in the volume group (similar to RAID0). For performance reasons, it is likely you will want to stripe your logical volumes so that reads and writes utilize all your attached data disks.  More details on configuring a striped logical volume on your Linux VM in Azure can be found in the **[Configure LVM on a Linux VM in Azure](configure-lvm.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)** document.

## Next Steps
Remember, as with all optimization discussions, you need to perform tests before and after each change to measure the impact the change has.  Optimization is a step by step process that has different results across different machines in your environment.  What works for one configuration may not work for others.

Some useful links to additional resources:

* [Azure Linux Agent User Guide](../extensions/agent-linux.md)
* [Configure Software RAID on Linux](configure-raid.md)
