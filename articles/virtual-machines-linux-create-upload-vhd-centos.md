<properties 
	pageTitle="Create and upload a CentOS-based Linux VHD in Azure" 
	description="Learn to create and upload an Azure virtual hard disk (VHD) that contains a CentOS-based Linux operating system." 
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

# Prepare a CentOS-Based Virtual Machine for Azure

- [Prepare a CentOS 6.x Virtual Machine for Azure](#centos6)
- [Prepare a CentOS 7.0+ Virtual Machine for Azure](#centos7)

##Prerequisites##

This article assumes that you have already installed a CentOS (or similar derivative) Linux operating system to a virtual hard disk. Multiple tools exist to create .vhd files, for example a virtualization solution such as Hyper-V. For instructions, see [Install the Hyper-V Role and Configure a Virtual Machine](http://technet.microsoft.com/library/hh846766.aspx). 


**CentOS Installation Notes**

- The newer VHDX format is not supported in Azure. You can convert the disk to VHD format using Hyper-V Manager or the convert-vhd cmdlet.

- When installing the Linux system it is recommended that you use standard partitions rather than LVM (often the default for many installations). This will avoid LVM name conflicts with cloned VMs, particularly if an OS disk ever needs to be attached to another VM for troubleshooting.  LVM or [RAID](virtual-machines-linux-configure-raid.md) may be used on data disks if preferred.

- NUMA is not supported for larger VM sizes due to a bug in Linux kernel versions below 2.6.37. This issue primarily impacts distributions using the upstream Red Hat 2.6.32 kernel. Manual installation of the Azure Linux agent (waagent) will automatically disable NUMA in the GRUB configuration for the Linux kernel. More information about this can be found in the steps below.

- Do not configure a swap partition on the OS disk. The Linux agent can be configured to create a swap file on the temporary resource disk.  More information about this can be found in the steps below.

- All of the VHDs must have sizes that are multiples of 1 MB.


## <a id="centos6"> </a>CentOS 6.x ##

1. In Hyper-V Manager, select the virtual machine.

2. Click **Connect** to open a console window for the virtual machine.

3. Uninstall NetworkManager by running the following command:

		# sudo rpm -e --nodeps NetworkManager

	**Note:** If the package is not already installed, this command will fail with an error message. This is expected.

4.	Create a file named **network** in the `/etc/sysconfig/` directory that contains the following text:

		NETWORKING=yes
		HOSTNAME=localhost.localdomain

5.	Create a file named **ifcfg-eth0** in the `/etc/sysconfig/network-scripts/` directory that contains the following text:

		DEVICE=eth0
		ONBOOT=yes
		BOOTPROTO=dhcp
		TYPE=Ethernet
		USERCTL=no
		PEERDNS=yes
		IPV6INIT=no

6.	Move (or remove) udev rules to avoid generating static rules for the Ethernet interface. These rules cause problems when cloning a virtual machine in Microsoft Azure or Hyper-V:

		# sudo mkdir -m 0700 /var/lib/waagent
		# sudo mv /lib/udev/rules.d/75-persistent-net-generator.rules /var/lib/waagent/
		# sudo mv /etc/udev/rules.d/70-persistent-net.rules /var/lib/waagent/


7. Ensure the network service will start at boot time by running the following command:

		# sudo chkconfig network on


8. **CentOS 6.3 Only**: Install the drivers for the Linux Integration Services

	**Important: The step is only valid for CentOS 6.3 and earlier.**  In CentOS 6.4+ the Linux Integration Services are *already available in the kernel*.

	a) Obtain the .iso file that contains the drivers for the Linux Integration Services from the [Microsoft Download Center](http://www.microsoft.com/download/details.aspx?id=41554).

	b) In Hyper-V Manager, in the **Actions** pane, click **Settings**.

	![Open Hyper-V settings](./media/virtual-machines-linux-create-upload-vhd/settings.png)

	c) In the **Hardware** pane, click **IDE Controller 1**.

	![Add DVD drive with install media](./media/virtual-machines-linux-create-upload-vhd/installiso.png)

	d) In the **IDE Controller** box, click **DVD Drive**, and then click **Add**.

	e) Select **Image file**, browse to **Linux IC v3.2.iso**, and then click **Open**.

	f) In the **Settings** page, click **OK**.

	g) Click **Connect** to open the window for the virtual machine.

	h) In the Command Prompt window, type the following commands:

		# sudo mount /dev/cdrom /media
		# sudo /media/install.sh
		# sudo reboot

9. Install the python-pyasn1 package by running the following command:

		# sudo yum install python-pyasn1

10. If you would like to use the OpenLogic mirrors that are hosted within the Azure datacenters, then replace the /etc/yum.repos.d/CentOS-Base.repo file with the following repositories.  This will also add the **[openlogic]** repository that includes packages for the Azure Linux agent:

		[openlogic]
		name=CentOS-$releasever - openlogic packages for $basearch
		baseurl=http://olcentgbl.trafficmanager.net/openlogic/$releasever/openlogic/$basearch/
		enabled=1
		gpgcheck=0
		
		[base]
		name=CentOS-$releasever - Base
		baseurl=http://olcentgbl.trafficmanager.net/centos/$releasever/os/$basearch/
		gpgcheck=1
		gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-6
		
		#released updates
		[updates]
		name=CentOS-$releasever - Updates
		baseurl=http://olcentgbl.trafficmanager.net/centos/$releasever/updates/$basearch/
		gpgcheck=1
		gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-6
		
		#additional packages that may be useful
		[extras]
		name=CentOS-$releasever - Extras
		baseurl=http://olcentgbl.trafficmanager.net/centos/$releasever/extras/$basearch/
		gpgcheck=1
		gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-6
		
		#additional packages that extend functionality of existing packages
		[centosplus]
		name=CentOS-$releasever - Plus
		baseurl=http://olcentgbl.trafficmanager.net/centos/$releasever/centosplus/$basearch/
		gpgcheck=1
		enabled=0
		gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-6
		
		#contrib - packages by Centos Users
		[contrib]
		name=CentOS-$releasever - Contrib
		baseurl=http://olcentgbl.trafficmanager.net/centos/$releasever/contrib/$basearch/
		gpgcheck=1
		enabled=0
		gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-6

	**Note:** The rest of this guide will assume you are using at least the [openlogic] repo, which will be used to install the Azure Linux agent below.


11.	Add the following line to /etc/yum.conf:

		http_caching=packages

	And **on CentOS 6.3 only** add the following line:

		exclude=kernel*

12. Disable the yum module "fastestmirror" by editing the file "/etc/yum/pluginconf.d/fastestmirror.conf", and under `[main]` type the following

		set enabled=0

13.	Run the following command to clear the current yum metadata:

		# yum clean all

14. **CentOS 6.3 only**, update the kernel using the following command:

		# sudo yum --disableexcludes=all install kernel

15.	Modify the kernel boot line in your grub configuration to include additional kernel parameters for Azure. To do this open "/boot/grub/menu.lst" in a text editor and ensure that the default kernel includes the following parameters:

		console=ttyS0 earlyprintk=ttyS0 rootdelay=300 numa=off

	This will also ensure all console messages are sent to the first serial port, which can assist Azure support with debugging issues. This will disable NUMA due to a bug in the kernel version used by CentOS 6.

	In addition to the above, it is recommended to *remove* the following parameters:

		rhgb quiet crashkernel=auto

	Graphical and quiet boot are not useful in a cloud environment where we want all the logs to be sent to the serial port.

	The `crashkernel` option may be left configured if desired, but note that this parameter will reduce the amount of available memory in the VM by 128MB or more, which may be problematic on the smaller VM sizes.


16.	Ensure that the SSH server is installed and configured to start at boot time.  This is usually the default.

17. Install the Azure Linux Agent by running the following command:

		# sudo yum install WALinuxAgent

	Note that installing the WALinuxAgent package will remove the NetworkManager and NetworkManager-gnome packages if they were not already removed as described in step 2.

18.	Do not create swap space on the OS disk

	The Azure Linux Agent can automatically configure swap space using the local resource disk that is attached to the VM after provisioning on Azure. Note that the local resource disk is a *temporary* disk, and might be emptied when the VM is deprovisioned. After installing the Azure Linux Agent (see previous step), modify the following parameters in /etc/waagent.conf appropriately:

		ResourceDisk.Format=y
		ResourceDisk.Filesystem=ext4
		ResourceDisk.MountPoint=/mnt/resource
		ResourceDisk.EnableSwap=y
		ResourceDisk.SwapSizeMB=2048    ## NOTE: set this to whatever you need it to be.

19.	Run the following commands to deprovision the virtual machine and prepare it for provisioning on Azure:

		# sudo waagent -force -deprovision
		# export HISTSIZE=0
		# logout

20. Click **Action -> Shut Down** in Hyper-V Manager. Your Linux VHD is now ready to be uploaded to Azure.


----------


## <a id="centos7"> </a>CentOS 7.0+ ##

**Changes in CentOS 7 (and similar derivatives)**

Preparing a CentOS 7 virtual machine for Azure is very similar to CentOS 6, however there are several important differences worth noting:

 - The NetworkManager package no longer conflicts with the Azure Linux agent. This package is installed by default and we recommend that it is not removed.
 - GRUB2 is now used as the default bootloader, so the procedure for editing kernel parameters has changed (see below).
 - XFS is now the default file system. The ext4 file system can still be used if desired.


**Configuration Steps**

1. In Hyper-V Manager, select the virtual machine.

2. Click **Connect** to open a console window for the virtual machine.

3.	Create a file named **network** in the `/etc/sysconfig/` directory that contains the following text:

		NETWORKING=yes
		HOSTNAME=localhost.localdomain

4.	Create a file named **ifcfg-eth0** in the `/etc/sysconfig/network-scripts/` directory that contains the following text:

		DEVICE=eth0
		ONBOOT=yes
		BOOTPROTO=dhcp
		TYPE=Ethernet
		USERCTL=no
		PEERDNS=yes
		IPV6INIT=no

5.	Move (or remove) udev rules to avoid generating static rules for the Ethernet interface. These rules cause problems when cloning a virtual machine in Microsoft Azure or Hyper-V:

		# sudo mkdir -m 0700 /var/lib/waagent
		# sudo mv /lib/udev/rules.d/75-persistent-net-generator.rules /var/lib/waagent/ 2>/dev/null
		# sudo mv /etc/udev/rules.d/70-persistent-net.rules /var/lib/waagent/ 2>/dev/null

6. Ensure the network service will start at boot time by running the following command:

		# sudo chkconfig network on

7. Install the python-pyasn1 package by running the following command:

		# sudo yum install python-pyasn1

8. If you would like to use the OpenLogic mirrors that are hosted within the Azure datacenters, then replace the /etc/yum.repos.d/CentOS-Base.repo file with the following repositories.  This will also add the **[openlogic]** repository that includes packages for the Azure Linux agent:

		[openlogic]
		name=CentOS-$releasever - openlogic packages for $basearch
		baseurl=http://olcentgbl.trafficmanager.net/openlogic/$releasever/openlogic/$basearch/
		enabled=1
		gpgcheck=0
		
		[base]
		name=CentOS-$releasever - Base
		baseurl=http://olcentgbl.trafficmanager.net/centos/$releasever/os/$basearch/
		gpgcheck=1
		gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-7
		
		#released updates
		[updates]
		name=CentOS-$releasever - Updates
		baseurl=http://olcentgbl.trafficmanager.net/centos/$releasever/updates/$basearch/
		gpgcheck=1
		gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-7
		
		#additional packages that may be useful
		[extras]
		name=CentOS-$releasever - Extras
		baseurl=http://olcentgbl.trafficmanager.net/centos/$releasever/extras/$basearch/
		gpgcheck=1
		gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-7
		
		#additional packages that extend functionality of existing packages
		[centosplus]
		name=CentOS-$releasever - Plus
		baseurl=http://olcentgbl.trafficmanager.net/centos/$releasever/centosplus/$basearch/
		gpgcheck=1
		enabled=0
		gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-7
		
		#contrib - packages by Centos Users
		[contrib]
		name=CentOS-$releasever - Contrib
		baseurl=http://olcentgbl.trafficmanager.net/centos/$releasever/contrib/$basearch/
		gpgcheck=1
		enabled=0
		gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-7
		


	**Note:** The rest of this guide will assume you are using at least the [openlogic] repo, which will be used to install the Azure Linux agent below.

9.	Run the following command to clear the current yum metadata and install any updates:

		# sudo yum clean all
		# sudo yum -y update

10.	Modify the kernel boot line in your grub configuration to include additional kernel parameters for Azure. To do this open "/etc/default/grub" in a text editor and edit the `GRUB_CMDLINE_LINUX` parameter, for example:

		GRUB_CMDLINE_LINUX="rootdelay=300 console=ttyS0 earlyprintk=ttyS0"

	This will also ensure all console messages are sent to the first serial port, which can assist Azure support with debugging issues. In addition to the above, it is recommended to *remove* the following parameters:

		rhgb quiet crashkernel=auto

	Graphical and quiet boot are not useful in a cloud environment where we want all the logs to be sent to the serial port.

	The `crashkernel` option may be left configured if desired, but note that this parameter will reduce the amount of available memory in the VM by 128MB or more, which may be problematic on the smaller VM sizes.

11. Once you are done editing "/etc/default/grub" per above, run the following command to rebuild the grub configuration:

		# sudo grub2-mkconfig -o /boot/grub2/grub.cfg

12.	Ensure that the SSH server is installed and configured to start at boot time.  This is usually the default.

13. Install the Azure Linux Agent by running the following command:

		# sudo yum install WALinuxAgent

14.	Do not create swap space on the OS disk

	The Azure Linux Agent can automatically configure swap space using the local resource disk that is attached to the VM after provisioning on Azure. Note that the local resource disk is a *temporary* disk, and might be emptied when the VM is deprovisioned. After installing the Azure Linux Agent (see previous step), modify the following parameters in /etc/waagent.conf appropriately:

		ResourceDisk.Format=y
		ResourceDisk.Filesystem=ext4
		ResourceDisk.MountPoint=/mnt/resource
		ResourceDisk.EnableSwap=y
		ResourceDisk.SwapSizeMB=2048    ## NOTE: set this to whatever you need it to be.

15.	Run the following commands to deprovision the virtual machine and prepare it for provisioning on Azure:

		# sudo waagent -force -deprovision
		# export HISTSIZE=0
		# logout

16. Click **Action -> Shut Down** in Hyper-V Manager. Your Linux VHD is now ready to be uploaded to Azure.


