<properties
	pageTitle="Create and upload an Ubuntu Linux VHD in Azure"
	description="Learn to create and upload an Azure virtual hard disk (VHD) that contains an Ubuntu Linux operating system."
	services="virtual-machines-linux"
	documentationCenter=""
	authors="szarkos"
	manager="timlt"
	editor="tysonn"
	tags="azure-resource-manager,azure-service-management"/>

<tags
	ms.service="virtual-machines-linux"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-linux"
	ms.devlang="na"
	ms.topic="article"
	ms.date="05/09/2016"
	ms.author="szark"/>

# Prepare an Ubuntu virtual machine for Azure

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-both-include.md)]

## Official Ubuntu cloud images
Ubuntu now publishes official Azure VHDs for download at [http://cloud-images.ubuntu.com/](http://cloud-images.ubuntu.com/). If you need to build your own specialized Ubuntu image for Azure, rather than use the manual procedure below it is recommended to start with these known working VHDs and customize as needed.


## Prerequisites

This article assumes that you have already installed an Ubuntu Linux operating system to a virtual hard disk. Multiple tools exist to create .vhd files, for example a virtualization solution such as Hyper-V. For instructions, see [Install the Hyper-V Role and Configure a Virtual Machine](http://technet.microsoft.com/library/hh846766.aspx).

**Ubuntu installation notes**

- Please see also [General Linux Installation Notes](virtual-machines-linux-create-upload-generic.md#general-linux-installation-notes) for more tips on preparing Linux for Azure.
- The VHDX format is not supported in Azure, only **fixed VHD**.  You can convert the disk to VHD format using Hyper-V Manager or the convert-vhd cmdlet.
- When installing the Linux system it is recommended that you use standard partitions rather than LVM (often the default for many installations). This will avoid LVM name conflicts with cloned VMs, particularly if an OS disk ever needs to be attached to another VM for troubleshooting. [LVM](virtual-machines-linux-configure-lvm.md) or [RAID](virtual-machines-linux-configure-raid.md) may be used on data disks if preferred.
- Do not configure a swap partition on the OS disk. The Linux agent can be configured to create a swap file on the temporary resource disk.  More information about this can be found in the steps below.
- All of the VHDs must have sizes that are multiples of 1 MB.


## Manual steps

> [AZURE.NOTE] Before creating your own custom Ubuntu image for Azure, please consider using the images from [http://cloud-images.ubuntu.com/](http://cloud-images.ubuntu.com/) instead.


1. In the center pane of Hyper-V Manager, select the virtual machine.

2. Click **Connect** to open the window for the virtual machine.

3.	Replace the current repositories in the image to use Ubuntu's Azure repos. The steps vary slightly depending on the Ubuntu version.

	Before editing /etc/apt/sources.list, it is recommended to make a backup:

		# sudo cp /etc/apt/sources.list /etc/apt/sources.list.bak

	Ubuntu 12.04:

		# sudo sed -i "s/[a-z][a-z].archive.ubuntu.com/azure.archive.ubuntu.com/g" /etc/apt/sources.list
		# sudo apt-get update

	Ubuntu 14.04:

		# sudo sed -i "s/[a-z][a-z].archive.ubuntu.com/azure.archive.ubuntu.com/g" /etc/apt/sources.list
		# sudo apt-get update

4. The Ubuntu Azure images are now following the *hardware enablement* (HWE) kernel. Update the operating system to the latest kernel by running the following commands:

	Ubuntu 12.04:

		# sudo apt-get update
		# sudo apt-get install linux-image-generic-lts-trusty linux-cloud-tools-generic-lts-trusty
		# sudo apt-get install hv-kvp-daemon-init
		(recommended) sudo apt-get dist-upgrade

		# sudo reboot

	Ubuntu 14.04:

		# sudo apt-get update
		# sudo apt-get install linux-image-virtual-lts-vivid linux-lts-vivid-tools-common
		# sudo apt-get install hv-kvp-daemon-init
		(recommended) sudo apt-get dist-upgrade

		# sudo reboot

5.	(optional) If the Ubuntu system encounters an error and reboots, then it will often wait at the grub boot prompt for user input preventing the system from booting properly. To prevent this, complete the following steps:

	a) Open the /etc/grub.d/00_header file.

	b) In the function **make_timeout()**, search for **if ["\${recordfail}" = 1 ]; then**

	c) Change the statement below this line to **set timeout=5**.

	d) Run 'sudo update-grub'.

6. Modify the kernel boot line for Grub to include additional kernel parameters for Azure. To do this open "/etc/default/grub" in a text editor, find the variable called `GRUB_CMDLINE_LINUX_DEFAULT` (or add it if needed) and edit it to include the following parameters:

		GRUB_CMDLINE_LINUX_DEFAULT="console=tty1 console=ttyS0 earlyprintk=ttyS0 rootdelay=300"

	Save and close this file, and then run '`sudo update-grub`'. This will ensure all console messages are sent to the first serial port, which can assist Azure technical support with debugging issues.

8.	Ensure that the SSH server is installed and configured to start at boot time.  This is usually the default.

9.	Install the Azure Linux Agent:

		# sudo apt-get update
		# sudo apt-get install walinuxagent

	Note that installing the `walinuxagent` package will remove the `NetworkManager` and `NetworkManager-gnome` packages, if they are installed.

10.	Run the following commands to deprovision the virtual machine and prepare it for provisioning on Azure:

		# sudo waagent -force -deprovision
		# export HISTSIZE=0
		# logout

11. Click **Action -> Shut Down** in Hyper-V Manager. Your Linux VHD is now ready to be uploaded to Azure.

## Next steps
You're now ready to use your Ubuntu Linux virtual hard disk to create new virtual machines in Azure. If this is the first time that you're uploading the .vhd file to Azure, see steps 2 and 3 in [Creating and uploading a virtual hard disk that contains the Linux operating system](virtual-machines-linux-classic-create-upload-vhd.md).

## References ##

Ubuntu hardware enablement (HWE) kernel:

- [http://blog.utlemming.org/2015/01/ubuntu-1404-azure-images-now-tracking.html](http://blog.utlemming.org/2015/01/ubuntu-1404-azure-images-now-tracking.html)
- [http://blog.utlemming.org/2015/02/1204-azure-cloud-images-now-using-hwe.html](http://blog.utlemming.org/2015/02/1204-azure-cloud-images-now-using-hwe.html)
