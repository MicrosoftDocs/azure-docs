---
title: Create and upload an Oracle Linux VHD | Microsoft Docs
description: Learn to create and upload an Azure virtual hard disk (VHD) that contains an Oracle Linux operating system.
services: virtual-machines-linux
documentationcenter: ''
author: szarkos
manager: gwallace
editor: tysonn
tags: azure-service-management,azure-resource-manager

ms.assetid: dd96f771-26eb-4391-9a89-8c8b6d691822
ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: na
ms.topic: article
ms.date: 03/12/2018
ms.author: szark

---
# Prepare an Oracle Linux virtual machine for Azure
[!INCLUDE [learn-about-deployment-models](../../../includes/learn-about-deployment-models-both-include.md)]

## Prerequisites
This article assumes that you have already installed an Oracle Linux operating system to a virtual hard disk. Multiple tools exist to create .vhd files, for example a virtualization solution such as Hyper-V. For instructions, see [Install the Hyper-V Role and Configure a Virtual Machine](https://technet.microsoft.com/library/hh846766.aspx).

### Oracle Linux installation notes
* Please see also [General Linux Installation Notes](create-upload-generic.md#general-linux-installation-notes) for more tips on preparing Linux for Azure.
* Oracle's Red Hat compatible kernel and their UEK3 (Unbreakable Enterprise Kernel) are both supported on Hyper-V and Azure. For best results, please be sure to update to the latest kernel while preparing your Oracle Linux VHD.
* Oracle's UEK2 is not supported on Hyper-V and Azure as it does not include the required drivers.
* The VHDX format is not supported in Azure, only **fixed VHD**.  You can convert the disk to VHD format using Hyper-V Manager or the convert-vhd cmdlet.
* When installing the Linux system it is recommended that you use standard partitions rather than LVM (often the default for many installations). This will avoid LVM name conflicts with cloned VMs, particularly if an OS disk ever needs to be attached to another VM for troubleshooting. [LVM](configure-lvm.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) or [RAID](configure-raid.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) may be used on data disks if preferred.
* NUMA is not supported for larger VM sizes due to a bug in Linux kernel versions below 2.6.37. This issue primarily impacts distributions using the upstream Red Hat 2.6.32 kernel. Manual installation of the Azure Linux agent (waagent) will automatically disable NUMA in the GRUB configuration for the Linux kernel. More information about this can be found in the steps below.
* Do not configure a swap partition on the OS disk. The Linux agent can be configured to create a swap file on the temporary resource disk.  More information about this can be found in the steps below.
* All VHDs on Azure must have a virtual size aligned to 1MB. When converting from a raw disk to VHD you must ensure that the raw disk size is a multiple of 1MB before conversion. See [Linux Installation Notes](create-upload-generic.md#general-linux-installation-notes) for more information.
* Make sure that the `Addons` repository is enabled. Edit the file `/etc/yum.repos.d/public-yum-ol6.repo`(Oracle Linux 6) or `/etc/yum.repos.d/public-yum-ol7.repo`(Oracle Linux 7), and change the line `enabled=0` to `enabled=1` under **[ol6_addons]** or **[ol7_addons]** in this file.

## Oracle Linux 6.4+
You must complete specific configuration steps in the operating system for the virtual machine to run in Azure.

1. In the center pane of Hyper-V Manager, select the virtual machine.
2. Click **Connect** to open the window for the virtual machine.
3. Uninstall NetworkManager by running the following command:
   
        # sudo rpm -e --nodeps NetworkManager
   
    **Note:** If the package is not already installed, this command will fail with an error message. This is expected.
4. Create a file named **network** in the `/etc/sysconfig/` directory that contains the following text:
   
        NETWORKING=yes
        HOSTNAME=localhost.localdomain
5. Create a file named **ifcfg-eth0** in the `/etc/sysconfig/network-scripts/` directory that contains the following text:
   
        DEVICE=eth0
        ONBOOT=yes
        BOOTPROTO=dhcp
        TYPE=Ethernet
        USERCTL=no
        PEERDNS=yes
        IPV6INIT=no
6. Modify udev rules to avoid generating static rules for the Ethernet interface(s). These rules can cause problems when cloning a virtual machine in Microsoft Azure or Hyper-V:
   
        # sudo ln -s /dev/null /etc/udev/rules.d/75-persistent-net-generator.rules
        # sudo rm -f /etc/udev/rules.d/70-persistent-net.rules
7. Ensure the network service will start at boot time by running the following command:
   
        # chkconfig network on
8. Install python-pyasn1 by running the following command:
   
        # sudo yum install python-pyasn1
9. Modify the kernel boot line in your grub configuration to include additional kernel parameters for Azure. To do this open "/boot/grub/menu.lst" in a text editor and ensure that the default kernel includes the following parameters:
   
        console=ttyS0 earlyprintk=ttyS0 rootdelay=300 numa=off
   
   This will also ensure all console messages are sent to the first serial port, which can assist Azure support with debugging issues. This will disable NUMA due to a bug in Oracle's Red Hat compatible kernel.
   
   In addition to the above, it is recommended to *remove* the following parameters:
   
        rhgb quiet crashkernel=auto
   
   Graphical and quiet boot are not useful in a cloud environment where we want all the logs to be sent to the serial port.
   
   The `crashkernel` option may be left configured if desired, but note that this parameter will reduce the amount of available memory in the VM by 128MB or more, which may be problematic on the smaller VM sizes.
10. Ensure that the SSH server is installed and configured to start at boot time.  This is usually the default.
11. Install the Azure Linux Agent by running the following command. The latest version is 2.0.15.
    
        # sudo yum install WALinuxAgent
    
    Note that installing the WALinuxAgent package will remove the NetworkManager and NetworkManager-gnome packages if they were not already removed as described in step 2.
12. Do not create swap space on the OS disk.
    
    The Azure Linux Agent can automatically configure swap space using the local resource disk that is attached to the VM after provisioning on Azure. Note that the local resource disk is a *temporary* disk, and might be emptied when the VM is deprovisioned. After installing the Azure Linux Agent (see previous step), modify the following parameters in /etc/waagent.conf appropriately:
    
        ResourceDisk.Format=y
        ResourceDisk.Filesystem=ext4
        ResourceDisk.MountPoint=/mnt/resource
        ResourceDisk.EnableSwap=y
        ResourceDisk.SwapSizeMB=2048    ## NOTE: set this to whatever you need it to be.
13. Run the following commands to deprovision the virtual machine and prepare it for provisioning on Azure:
    
        # sudo waagent -force -deprovision
        # export HISTSIZE=0
        # logout
14. Click **Action -> Shut Down** in Hyper-V Manager. Your Linux VHD is now ready to be uploaded to Azure.

---
## Oracle Linux 7.0+
**Changes in Oracle Linux 7**

Preparing an Oracle Linux 7 virtual machine for Azure is very similar to Oracle Linux 6, however there are several important differences worth noting:

* Both the Red Hat compatible kernel and Oracle's UEK3 are supported in Azure.  The UEK3 kernel is recommended.
* The NetworkManager package no longer conflicts with the Azure Linux agent. This package is installed by default and we recommend that it is not removed.
* GRUB2 is now used as the default bootloader, so the procedure for editing kernel parameters has changed (see below).
* XFS is now the default file system. The ext4 file system can still be used if desired.

**Configuration steps**

1. In Hyper-V Manager, select the virtual machine.
2. Click **Connect** to open a console window for the virtual machine.
3. Create a file named **network** in the `/etc/sysconfig/` directory that contains the following text:
   
        NETWORKING=yes
        HOSTNAME=localhost.localdomain
4. Create a file named **ifcfg-eth0** in the `/etc/sysconfig/network-scripts/` directory that contains the following text:
   
        DEVICE=eth0
        ONBOOT=yes
        BOOTPROTO=dhcp
        TYPE=Ethernet
        USERCTL=no
        PEERDNS=yes
        IPV6INIT=no
5. Modify udev rules to avoid generating static rules for the Ethernet interface(s). These rules can cause problems when cloning a virtual machine in Microsoft Azure or Hyper-V:
   
        # sudo ln -s /dev/null /etc/udev/rules.d/75-persistent-net-generator.rules
6. Ensure the network service will start at boot time by running the following command:
   
        # sudo chkconfig network on
7. Install the python-pyasn1 package by running the following command:
   
        # sudo yum install python-pyasn1
8. Run the following command to clear the current yum metadata and install any updates:
   
        # sudo yum clean all
        # sudo yum -y update
9. Modify the kernel boot line in your grub configuration to include additional kernel parameters for Azure. To do this open "/etc/default/grub" in a text editor and edit the `GRUB_CMDLINE_LINUX` parameter, for example:
   
        GRUB_CMDLINE_LINUX="rootdelay=300 console=ttyS0 earlyprintk=ttyS0 net.ifnames=0"
   
   This will also ensure all console messages are sent to the first serial port, which can assist Azure support with debugging issues. It also turns off the new OEL 7 naming conventions for NICs. In addition to the above, it is recommended to *remove* the following parameters:
   
       rhgb quiet crashkernel=auto
   
   Graphical and quiet boot are not useful in a cloud environment where we want all the logs to be sent to the serial port.
   
   The `crashkernel` option may be left configured if desired, but note that this parameter will reduce the amount of available memory in the VM by 128MB or more, which may be problematic on the smaller VM sizes.
10. Once you are done editing "/etc/default/grub" per above, run the following command to rebuild the grub configuration:
    
        # sudo grub2-mkconfig -o /boot/grub2/grub.cfg
11. Ensure that the SSH server is installed and configured to start at boot time.  This is usually the default.
12. Install the Azure Linux Agent by running the following command:
    
        # sudo yum install WALinuxAgent
        # sudo systemctl enable waagent
13. Do not create swap space on the OS disk.
    
    The Azure Linux Agent can automatically configure swap space using the local resource disk that is attached to the VM after provisioning on Azure. Note that the local resource disk is a *temporary* disk, and might be emptied when the VM is deprovisioned. After installing the Azure Linux Agent (see the previous step), modify the following parameters in /etc/waagent.conf appropriately:
    
        ResourceDisk.Format=y
        ResourceDisk.Filesystem=ext4
        ResourceDisk.MountPoint=/mnt/resource
        ResourceDisk.EnableSwap=y
        ResourceDisk.SwapSizeMB=2048    ## NOTE: set this to whatever you need it to be.
14. Run the following commands to deprovision the virtual machine and prepare it for provisioning on Azure:
    
        # sudo waagent -force -deprovision
        # export HISTSIZE=0
        # logout
15. Click **Action -> Shut Down** in Hyper-V Manager. Your Linux VHD is now ready to be uploaded to Azure.

## Next steps
You're now ready to use your Oracle Linux .vhd to create new virtual machines in Azure. If this is the first time that you're uploading the .vhd file to Azure, see [Create a Linux VM from a custom disk](upload-vhd.md#option-1-upload-a-vhd).

