<properties
	pageTitle="Prepare Debian Linux VHD | Microsoft Azure"
	description="Learn how to create Debian 7 & 8 VHD files for deployment in Azure."
	services="virtual-machines-linux"
	documentationCenter=""
	authors="szarkos"
	manager="timlt"
	editor=""
    tags="azure-resource-manager,azure-service-management"/>

<tags
	ms.service="virtual-machines-linux"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-linux"
	ms.devlang="na"
	ms.topic="article"
	ms.date="05/09/2016"
	ms.author="szark"/>



# Prepare a Debian VHD for Azure

## Prerequisites
This section assumes that you have already installed a Debian Linux operating system from an .iso file downloaded from the [Debian website](https://www.debian.org/distrib/) to a virtual hard disk. Multiple tools exist to create .vhd files; Hyper-V is only one example. For instructions using Hyper-V, see [Install the Hyper-V Role and Configure a Virtual Machine](https://technet.microsoft.com/library/hh846766.aspx).


## Installation notes

- Please see also [General Linux Installation Notes](virtual-machines-linux-create-upload-generic.md#general-linux-installation-notes) for more tips on preparing Linux for Azure.
- The newer VHDX format is not supported in Azure. You can convert the disk to VHD format using Hyper-V Manager or the **convert-vhd** cmdlet.
- When installing the Linux system it is recommended that you use standard partitions rather than LVM (often the default for many installations). This will avoid LVM name conflicts with cloned VMs, particularly if an OS disk ever needs to be attached to another VM for troubleshooting. [LVM](virtual-machines-linux-configure-lvm.md) or [RAID](virtual-machines-linux-configure-raid.md) may be used on data disks if preferred.
- Do not configure a swap partition on the OS disk. The Azure Linux agent can be configured to create a swap file on the temporary resource disk. More information about this can be found in the steps below.
- All of the VHDs must have sizes that are multiples of 1 MB.


## Use Azure-Manage to create Debian VHDs

There are tools available for generating Debian VHDs for Azure, such as the [azure-manage](https://gitlab.credativ.com/de/azure-manage) scripts from [credativ](http://www.credativ.com/). This is the recommended approach versus creating an image from scratch. For example, to create a Debian 8 VHD run the following commands to download azure-manage (and dependencies) and run the azure_build_image script:

	# sudo apt-get update
	# sudo apt-get install git qemu-utils mbr kpartx debootstrap

	# sudo apt-get install python3-pip
	# sudo pip3 install azure-storage azure-servicemanagement-legacy pytest pyyaml
	# git clone https://gitlab.credativ.com/de/azure-manage.git
	# cd azure-manage
	# sudo pip3 install .

	# sudo azure_build_image --option release=jessie --option image_size_gb=30 --option image_prefix=debian-jessie-azure section


## Manually prepare a Debian VHD

1. In Hyper-V Manager, select the virtual machine.

2. Click **Connect** to open a console window for the virtual machine.

3. Comment out the line for **deb cdrom** in `/etc/apt/source.list` if you set up the VM against an ISO file.

4. Edit the `/etc/default/grub` file and modify the **GRUB_CMDLINE_LINUX** parameter as follows to include additional kernel parameters for Azure.

        GRUB_CMDLINE_LINUX="console=tty0 console=ttyS0,115200 earlyprintk=ttyS0,115200 rootdelay=30"

5. Rebuild the grub and run:

        # sudo update-grub

6. Add Debian's Azure repositories to /etc/apt/sources.list for either Debian 7 or 8:

	**Debian 7.x "Wheezy"**

		deb http://debian-archive.trafficmanager.net/debian wheezy-backports main
		deb-src http://debian-archive.trafficmanager.net/debian wheezy-backports main
		deb http://debian-archive.trafficmanager.net/debian-azure wheezy main
		deb-src http://debian-archive.trafficmanager.net/debian-azure wheezy main


	**Debian 8.x "Jessie"**

		deb http://debian-archive.trafficmanager.net/debian jessie-backports main
		deb-src http://debian-archive.trafficmanager.net/debian jessie-backports main
		deb http://debian-archive.trafficmanager.net/debian-azure jessie main
		deb-src http://debian-archive.trafficmanager.net/debian-azure jessie main


7. Install the Azure Linux Agent:

		# sudo apt-get update
		# sudo apt-get install waagent

8. For Debian 7, it is required to run the 3.16-based kernel from the wheezy-backports repository. First create a file called /etc/apt/preferences.d/linux.pref with the following contents:

		Package: linux-image-amd64 initramfs-tools
		Pin: release n=wheezy-backports
		Pin-Priority: 500

	Then run "sudo apt-get install linux-image-amd64" to install the new kernel.

8. Deprovision the virtual machine and prepare it for provisioning on Azure and run:

        # sudo waagent –force -deprovision
        # export HISTSIZE=0
        # logout

9. Click **Action** -> Shut Down in Hyper-V Manager. Your Linux VHD is now ready to be uploaded to Azure.


## Next steps

You're now ready to use your Debian virtual hard disk to create new virtual machines in Azure. If this is the first time that you're uploading the .vhd file to Azure, see steps 2 and 3 in [Creating and uploading a virtual hard disk that contains the Linux operating system](virtual-machines-linux-classic-create-upload-vhd.md).
