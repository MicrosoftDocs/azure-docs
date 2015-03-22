<properties 
	pageTitle="Create and upload an Ubuntu Linux VHD in Azure" 
	description="Learn to create and upload an Azure virtual hard disk (VHD) that contains an Ubuntu Linux operating system." 
	services="virtual-machines" 
	documentationCenter="" 
	authors="szarkos" 
	manager="timlt" 
	editor="tysonn"/>

<tags 
	ms.service="virtual-machines" 
	ms.workload="infrastructure-services" 
	ms.tgt_pltfrm="vm-linux" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="01/13/2015" 
	ms.author="szarkos"/>


# Prepare an Ubuntu Virtual Machine for Azure

##Prerequisites##

This article assumes that you have already installed an Ubuntu Linux operating system to a virtual hard disk. Multiple tools exist to create .vhd files, for example a virtualization solution such as Hyper-V. For instructions, see [Install the Hyper-V Role and Configure a Virtual Machine](http://technet.microsoft.com/library/hh846766.aspx). 

**Ubuntu Installation Notes**

- The newer VHDX format is not supported in Azure. You can convert the disk to VHD format using Hyper-V Manager or the convert-vhd cmdlet.

- When installing the Linux system it is recommended that you use standard partitions rather than LVM (often the default for many installations). This will avoid LVM name conflicts with cloned VMs, particularly if an OS disk ever needs to be attached to another VM for troubleshooting.  LVM or [RAID](virtual-machines-linux-configure-raid.md) may be used on data disks if preferred.

- Do not configure a swap partition on the OS disk. The Linux agent can be configured to create a swap file on the temporary resource disk.  More information about this can be found in the steps below.

- All of the VHDs must have sizes that are multiples of 1 MB.


## <a id="ubuntu"> </a>Ubuntu 12.04+ ##

1. In the center pane of Hyper-V Manager, select the virtual machine.

2. Click **Connect** to open the window for the virtual machine.

3.	Replace the current repositories in the image to use Ubuntu's Azure repos. The steps vary slightly depending on the Ubuntu version.

	Before editing /etc/apt/sources.list, it is recommended to make a backup

		# sudo cp /etc/apt/sources.list /etc/apt/sources.list.bak

	Ubuntu 12.04:

		# sudo sed -i "s/[a-z][a-z].archive.ubuntu.com/azure.archive.ubuntu.com/g" /etc/apt/sources.list
		# sudo apt-add-repository 'http://archive.canonical.com/ubuntu precise-backports main'
		# sudo apt-get update

	Ubuntu 12.10:

		# sudo sed -i "s/[a-z][a-z].archive.ubuntu.com/azure.archive.ubuntu.com/g" /etc/apt/sources.list
		# sudo apt-add-repository 'http://archive.canonical.com/ubuntu quantal-backports main'
		# sudo apt-get update

	Ubuntu 14.04+:

		# sudo sed -i "s/[a-z][a-z].archive.ubuntu.com/azure.archive.ubuntu.com/g" /etc/apt/sources.list
		# sudo apt-get update

4. Update the operating system to the latest kernel by running the following commands : 

	Ubuntu 12.04:

		# sudo apt-get update
		# sudo apt-get install hv-kvp-daemon-init linux-backports-modules-hv-precise-virtual
		(recommended) sudo apt-get dist-upgrade

		# sudo reboot

	Ubuntu 12.10:

		# sudo apt-get update
		# sudo apt-get install hv-kvp-daemon-init linux-backports-modules-hv-quantal-virtual
		(recommended) sudo apt-get dist-upgrade

		# sudo reboot
	
	Ubuntu 14.04+:

		# sudo apt-get update
		# sudo apt-get install hv-kvp-daemon-init
		(recommended) sudo apt-get dist-upgrade

		# sudo reboot

5.	(optional) If the Ubuntu system encounters an error and reboots, then it will often wait at the grub boot prompt for user input preventing the system from booting properly. To prevent this, complete the following steps:

	a) Open the /etc/grub.d/00_header file.

	b) In the function **make_timeout()**, search for **if ["\${recordfail}" = 1 ]; then**

	c) Change the statement below this line to **set timeout=5**.

	d) Run 'sudo update-grub'.

6. Modify the kernel boot line for Grub to include additional kernel parameters for Azure. To do this open "/etc/default/grub" in a text editor, find the variable called `GRUB_CMDLINE_LINUX_DEFAULT` (or add it if needed) and edit it to include the following parameters:

		GRUB_CMDLINE_LINUX_DEFAULT="console=ttyS0 earlyprintk=ttyS0 rootdelay=300"

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


