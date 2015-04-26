<properties 
	pageTitle="Create and upload a SUSE Linux VHD in Azure" 
	description="Learn to create and upload an Azure virtual hard disk (VHD) that contains a SUSE Linux operating system." 
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


# Prepare a SLES or openSUSE Virtual Machine for Azure

- [Prepare a SLES 11 SP3 Virtual Machine for Azure](#sles11)
- [Prepare a openSUSE 13.1+ Virtual Machine for Azure](#osuse)

##Prerequisites##

This article assumes that you have already installed a SUSE or openSUSE Linux operating system to a virtual hard disk. Multiple tools exist to create .vhd files, for example a virtualization solution such as Hyper-V. For instructions, see [Install the Hyper-V Role and Configure a Virtual Machine](http://technet.microsoft.com/library/hh846766.aspx). 


**SLES / openSUSE Installation Notes**

 - [SUSE Studio](http://www.susestudio.com) can easily create and manage your SLES / openSUSE images for Azure and Hyper-V. This is the recommended approach for customizing your own SUSE and openSUSE images. The following official images in the SUSE Studio Gallery can be downloaded or cloned into your own SUSE Studio:

  - [SLES 11 SP3 for Azure on SUSE Studio Gallery](http://susestudio.com/a/02kbT4/sles-11-sp3-for-windows-azure)
  - [openSUSE 13.1 for Azure on SUSE Studio Gallery](https://susestudio.com/a/02kbT4/opensuse-13-1-for-windows-azure)

- The newer VHDX format is not supported in Azure. You can convert the disk to VHD format using Hyper-V Manager or the convert-vhd cmdlet.

- When installing the Linux system it is recommended that you use standard partitions rather than LVM (often the default for many installations). This will avoid LVM name conflicts with cloned VMs, particularly if an OS disk ever needs to be attached to another VM for troubleshooting.  LVM or [RAID](virtual-machines-linux-configure-raid.md) may be used on data disks if preferred.

- Do not configure a swap partition on the OS disk. The Linux agent can be configured to create a swap file on the temporary resource disk.  More information about this can be found in the steps below.

- All of the VHDs must have sizes that are multiples of 1 MB.


## <a id="sles11"> </a>Prepare SUSE Linux Enterprise Server 11 SP3 ##

1. In the center pane of Hyper-V Manager, select the virtual machine.

2. Click **Connect** to open the window for the virtual machine.

3. Register your SUSE Linux Enterprise system to allow it to download updates and install packages.

4. Update the system with the latest patches:

		# sudo zypper update

5. Install the Azure Linux Agent from the SLES repository:

		# sudo zypper install WALinuxAgent

6. Modify the kernel boot line in your grub configuration to include additional kernel parameters for Azure. To do this open "/boot/grub/menu.lst" in a text editor and ensure that the default kernel includes the following parameters:

		console=ttyS0 earlyprintk=ttyS0 rootdelay=300

	This will ensure all console messages are sent to the first serial port, which can assist Azure support with debugging issues.

7.	It is recommended to edit the file "/etc/sysconfig/network/dhcp" and change the `DHCLIENT_SET_HOSTNAME` parameter to the following:

		DHCLIENT_SET_HOSTNAME="no"

8.	In "/etc/sudoers", comment out or remove the following lines if they exist:

		Defaults targetpw   # ask for the password of the target user i.e. root
		ALL    ALL=(ALL) ALL   # WARNING! Only use this together with 'Defaults targetpw'!

9.	Ensure that the SSH server is installed and configured to start at boot time.  This is usually the default.

10.	Do not create swap space on the OS disk

	The Azure Linux Agent can automatically configure swap space using the local resource disk that is attached to the VM after provisioning on Azure. Note that the local resource disk is a *temporary* disk, and might be emptied when the VM is deprovisioned. After installing the Azure Linux Agent (see previous step), modify the following parameters in /etc/waagent.conf appropriately:

		ResourceDisk.Format=y
		ResourceDisk.Filesystem=ext4
		ResourceDisk.MountPoint=/mnt/resource
		ResourceDisk.EnableSwap=y
		ResourceDisk.SwapSizeMB=2048    ## NOTE: set this to whatever you need it to be.

11.	Run the following commands to deprovision the virtual machine and prepare it for provisioning on Azure:

		# sudo waagent -force -deprovision
		# export HISTSIZE=0
		# logout

12. Click **Action -> Shut Down** in Hyper-V Manager. Your Linux VHD is now ready to be uploaded to Azure.


----------

## <a id="osuse"> </a>Prepare openSUSE 13.1+ ##

1. In the center pane of Hyper-V Manager, select the virtual machine

2. Click **Connect** to open the window for the virtual machine

3. On the shell, run the command '`zypper lr`'. If this command returns output similar to the following (note that version numbers may vary):

		# | Alias                 | Name                  | Enabled | Refresh
		--+-----------------------+-----------------------+---------+--------
		1 | Cloud:Tools_13.1      | Cloud:Tools_13.1      | Yes     | Yes
		2 | openSUSE_13.1_OSS     | openSUSE_13.1_OSS     | Yes     | Yes
		3 | openSUSE_13.1_Updates | openSUSE_13.1_Updates | Yes     | Yes

	then the repositories are configured as expected, no adjustments are necessary.

	If the command returns "No repositories defined..." then use the following commands to add these repos:

		# sudo zypper ar -f http://download.opensuse.org/repositories/Cloud:Tools/openSUSE_13.1 Cloud:Tools_13.1 
		# sudo zypper ar -f http://download.opensuse.org/distribution/13.1/repo/oss openSUSE_13.1_OSS
		# sudo zypper ar -f http://download.opensuse.org/update/13.1 openSUSE_13.1_Updates

	You can then verify the repositories have been added by running the command '`zypper lr`' again. In case one of the relevant update repositories is not enabled, enable it with following command:

		# sudo zypper mr -e [NUMBER OF REPOSITORY]


4. Update the kernel to the latest available version:

		# sudo zypper up kernel-default

	Or to update the system with all the latest patches:

		# sudo zypper update

5.	Install the Azure Linux Agent

		# sudo zypper install WALinuxAgent

6.	Modify the kernel boot line in your grub configuration to include additional kernel parameters for Azure. To do this open "/boot/grub/menu.lst" in a text editor and ensure that the default kernel includes the following parameters:

		console=ttyS0 earlyprintk=ttyS0 rootdelay=300

	This will ensure all console messages are sent to the first serial port, which can assist Azure support with debugging issues. In addition, remove the following parameters from the kernel boot line if they exist:

		libata.atapi_enabled=0 reserve=0x1f0,0x8

7.	It is recommended to edit the file "/etc/sysconfig/network/dhcp" and change the `DHCLIENT_SET_HOSTNAME` parameter to the following:

		DHCLIENT_SET_HOSTNAME="no"

8.	**Important:** In "/etc/sudoers", comment out or remove the following lines if they exist:

		Defaults targetpw   # ask for the password of the target user i.e. root
		ALL    ALL=(ALL) ALL   # WARNING! Only use this together with 'Defaults targetpw'!

9.	Ensure that the SSH server is installed and configured to start at boot time.  This is usually the default.

10.	Do not create swap space on the OS disk

	The Azure Linux Agent can automatically configure swap space using the local resource disk that is attached to the VM after provisioning on Azure. Note that the local resource disk is a *temporary* disk, and might be emptied when the VM is deprovisioned. After installing the Azure Linux Agent (see previous step), modify the following parameters in /etc/waagent.conf appropriately:

		ResourceDisk.Format=y
		ResourceDisk.Filesystem=ext4
		ResourceDisk.MountPoint=/mnt/resource
		ResourceDisk.EnableSwap=y
		ResourceDisk.SwapSizeMB=2048    ## NOTE: set this to whatever you need it to be.

11.	Run the following commands to deprovision the virtual machine and prepare it for provisioning on Azure:

		# sudo waagent -force -deprovision
		# export HISTSIZE=0
		# logout

12. Ensure the Azure Linux Agent runs at startup:

		# sudo systemctl enable waagent.service

13. Click **Action -> Shut Down** in Hyper-V Manager. Your Linux VHD is now ready to be uploaded to Azure.


