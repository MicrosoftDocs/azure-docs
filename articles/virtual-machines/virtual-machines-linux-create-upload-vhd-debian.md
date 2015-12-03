<properties
	pageTitle="Prepare Debian Linux VHD | Microsoft Azure"
	description="Learn how to create Debian 7 & 8 VHD files for deployment in Azure."
	services="virtual-machines"
	documentationCenter=""
	authors="SuperScottz"
	manager="timlt"
	editor=""/>

<tags
	ms.service="virtual-machines"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-linux"
	ms.devlang="na"
	ms.topic="article"
	ms.date="12/01/2015"
	ms.author="mingzhan"/>




#Prepare Debian VHD for Azure

##Prerequisites
This section assumes that you have already installed a Debian Linux operating system from an .iso file downloaded from the [Debian website](https://www.debian.org/distrib/) to a virtual hard disk. Multiple tools exist to create .vhd files; Hyper-V is only one example. For instructions using Hyper-V, see [Install the Hyper-V Role and Configure a Virtual Machine](https://technet.microsoft.com/library/hh846766.aspx). 


## Installation Notes

- The newer VHDX format is not supported in Azure. You can convert the disk to VHD format using Hyper-V Manager or the **convert-vhd** cmdlet.
- When installing the Linux system it is recommended that you use standard partitions rather than LVM (often the default for many installations). This will avoid LVM name conflicts with cloned VMs, particularly if an OS disk ever needs to be attached to another VM for troubleshooting. LVM or RAID may be used on data disks if preferred.
- Do not configure a swap partition on the OS disk. The Azure Linux agent can be configured to create a swap file on the temporary resource disk. More information about this can be found in the steps below.
- All of the VHDs must have sizes that are multiples of 1 MB.


##Debian 7.x and 8.x

1. In Hyper-V Manager, select the virtual machine.

2. Click **Connect** to open a console window for the virtual machine.

3. Comment out the line for **deb cdrom** in `/etc/apt/source.list` if you set up the VM against an ISO file.

4. Edit the `/etc/default/grub` file and modify the **GRUB_CMDLINE_LINUX** parameter as follows to include additional kernel parameters for Azure.

        GRUB_CMDLINE_LINUX="console=ttyS0 earlyprintk=ttyS0 rootdelay=300"

5. Rebuild the grub and run:

        # sudo update-grub 

6. Install the dependency packages for Azure Linux Agent:

        # apt-get install -y git parted

7.	Install the Azure Linux Agent from Github using [guidance](virtual-machines-linux-update-agent.md) and choose version 2.0.14:

			# wget https://raw.githubusercontent.com/Azure/WALinuxAgent/WALinuxAgent-2.0.14/waagent
			# chmod +x waagent
			# cp waagent /usr/sbin
			# /usr/sbin/waagent -install -verbose

8. Deprovision the virtual machine and prepare it for provisioning on Azure and run:

        # sudo waagent –force -deprovision
        # export HISTSIZE=0
        # logout
 
9. Click **Action** -> Shut Down in Hyper-V Manager. Your Linux VHD is now ready to be uploaded to Azure.

##Using Credativ Script to create Debian VHD

There is a script available on the Credativ website that can help you to build the Debian VHD automatically. You can download it from [here](https://gitlab.credativ.com/de/azure-manage) and install it in in your Linux VM. To create a Debian VHD (for example, Debian 7) run:

        # azure_build_image --option release=wheezy --option image_prefix=lilidebian7 --option image_size_gb=30 SECTION

If any issue to use this script, just file a issue to Credativ [here](https://gitlab.credativ.com/groups/de/issues).

## Next Steps

You're now ready to use your Debian .vhd to create new Azure Virtual Machines.
