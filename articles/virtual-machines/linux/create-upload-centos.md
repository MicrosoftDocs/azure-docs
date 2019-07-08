---
title: Create and upload a CentOS-based Linux VHD in Azure
description: Learn to create and upload an Azure virtual hard disk (VHD) that contains a CentOS-based Linux operating system.
services: virtual-machines-linux
documentationcenter: ''
author: szarkos
manager: gwallace
editor: tysonn
tags: azure-resource-manager,azure-service-management

ms.assetid: 0e518e92-e981-43f4-b12c-9cba1064c4bb
ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: na
ms.topic: article
ms.date: 05/04/2018
ms.author: szark

---
# Prepare a CentOS-based virtual machine for Azure

Learn to create and upload an Azure virtual hard disk (VHD) that contains a CentOS-based Linux operating system.

* [Prepare a CentOS 6.x virtual machine for Azure](#centos-6x)
* [Prepare a CentOS 7.0+ virtual machine for Azure](#centos-70)


## Prerequisites

This article assumes that you have already installed a CentOS (or similar derivative) Linux operating system to a virtual hard disk. Multiple tools exist to create .vhd files, for example a virtualization solution such as Hyper-V. For instructions, see [Install the Hyper-V Role and Configure a Virtual Machine](https://technet.microsoft.com/library/hh846766.aspx).

**CentOS installation notes**

* Please see also [General Linux Installation Notes](create-upload-generic.md#general-linux-installation-notes) for more tips on preparing Linux for Azure.
* The VHDX format is not supported in Azure, only **fixed VHD**.  You can convert the disk to VHD format using Hyper-V Manager or the convert-vhd cmdlet. If you are using VirtualBox this means selecting **Fixed size** as opposed to the default dynamically allocated when creating the disk.
* When installing the Linux system it is *recommended* that you use standard partitions rather than LVM (often the default for many installations). This will avoid LVM name conflicts with cloned VMs, particularly if an OS disk ever needs to be attached to another identical VM for troubleshooting. [LVM](configure-lvm.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) or [RAID](configure-raid.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) may be used on data disks.
* Kernel support for mounting UDF file systems is required. At first boot on Azure the provisioning configuration is passed to the Linux VM via UDF-formatted media that is attached to the guest. The Azure Linux agent must be able to mount the UDF file system to read its configuration and provision the VM.
* Linux kernel versions below 2.6.37 do not support NUMA on Hyper-V with larger VM sizes. This issue primarily impacts older distributions using the upstream Red Hat 2.6.32 kernel, and was fixed in RHEL 6.6 (kernel-2.6.32-504). Systems running custom kernels older than 2.6.37, or RHEL-based kernels older than 2.6.32-504 must set the boot parameter `numa=off` on the kernel command-line in grub.conf. For more information see Red Hat [KB 436883](https://access.redhat.com/solutions/436883).
* Do not configure a swap partition on the OS disk. The Linux agent can be configured to create a swap file on the temporary resource disk.  More information about this can be found in the steps below.
* All VHDs on Azure must have a virtual size aligned to 1MB. When converting from a raw disk to VHD you must ensure that the raw disk size is a multiple of 1MB before conversion. See [Linux Installation Notes](create-upload-generic.md#general-linux-installation-notes) for more information.

## CentOS 6.x

1. In Hyper-V Manager, select the virtual machine.

2. Click **Connect** to open a console window for the virtual machine.

3. In CentOS 6, NetworkManager can interfere with the Azure Linux agent. Uninstall this package by running the following command:

    ```bash
    sudo rpm -e --nodeps NetworkManager
    ```

4. Create or edit the file `/etc/sysconfig/network` and add the following text:

    ```console
    NETWORKING=yes
    HOSTNAME=localhost.localdomain
    ```

5. Create or edit the file `/etc/sysconfig/network-scripts/ifcfg-eth0` and add the following text:

    ```console
    DEVICE=eth0
    ONBOOT=yes
    BOOTPROTO=dhcp
    TYPE=Ethernet
    USERCTL=no
    PEERDNS=yes
    IPV6INIT=no
    ```

6. Modify udev rules to avoid generating static rules for the Ethernet interface(s). These rules can cause problems when cloning a virtual machine in Microsoft Azure or Hyper-V:

    ```bash
    sudo ln -s /dev/null /etc/udev/rules.d/75-persistent-net-generator.rules
    sudo rm -f /etc/udev/rules.d/70-persistent-net.rules
    ```

7. Ensure the network service will start at boot time by running the following command:

    ```bash
    sudo chkconfig network on
    ```

8. If you would like to use the OpenLogic mirrors that are hosted within the Azure datacenters, then replace the `/etc/yum.repos.d/CentOS-Base.repo` file with the following repositories.  This will also add the **[openlogic]** repository that includes additional packages such as the Azure Linux agent:

    ```console
    [openlogic]
    name=CentOS-$releasever - openlogic packages for $basearch
    baseurl=http://olcentgbl.trafficmanager.net/openlogic/$releasever/openlogic/$basearch/
    enabled=1
    gpgcheck=0

    [base]
    name=CentOS-$releasever - Base
    #mirrorlist=http://mirrorlist.centos.org/?release=$releasever&arch=$basearch&repo=os&infra=$infra
    baseurl=http://olcentgbl.trafficmanager.net/centos/$releasever/os/$basearch/
    gpgcheck=1
    gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-6

    #released updates
    [updates]
    name=CentOS-$releasever - Updates
    #mirrorlist=http://mirrorlist.centos.org/?release=$releasever&arch=$basearch&repo=updates&infra=$infra
    baseurl=http://olcentgbl.trafficmanager.net/centos/$releasever/updates/$basearch/
    gpgcheck=1
    gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-6

    #additional packages that may be useful
    [extras]
    name=CentOS-$releasever - Extras
    #mirrorlist=http://mirrorlist.centos.org/?release=$releasever&arch=$basearch&repo=extras&infra=$infra
    baseurl=http://olcentgbl.trafficmanager.net/centos/$releasever/extras/$basearch/
    gpgcheck=1
    gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-6

    #additional packages that extend functionality of existing packages
    [centosplus]
    name=CentOS-$releasever - Plus
    #mirrorlist=http://mirrorlist.centos.org/?release=$releasever&arch=$basearch&repo=centosplus&infra=$infra
    baseurl=http://olcentgbl.trafficmanager.net/centos/$releasever/centosplus/$basearch/
    gpgcheck=1
    enabled=0
    gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-6

    #contrib - packages by Centos Users
    [contrib]
    name=CentOS-$releasever - Contrib
    #mirrorlist=http://mirrorlist.centos.org/?release=$releasever&arch=$basearch&repo=contrib&infra=$infra
    baseurl=http://olcentgbl.trafficmanager.net/centos/$releasever/contrib/$basearch/
    gpgcheck=1
    enabled=0
    gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-6
    ```

    > [!Note]
    > The rest of this guide will assume you are using at least the `[openlogic]` repo, which will be used to install the Azure Linux agent below.

9. Add the following line to /etc/yum.conf:

	```console
	http_caching=packages
	```

10. Run the following command to clear the current yum metadata and update the system with the latest packages:

	```bash
	yum clean all
	```

    Unless you are creating an image for an older version of CentOS, it is recommended to update all the packages to the latest:

	```bash
	sudo yum -y update
	```

    A reboot may be required after running this command.

11. (Optional) Install the drivers for the Linux Integration Services (LIS).

    > [!IMPORTANT]
    > The step is **required** for CentOS 6.3 and earlier, and optional for later releases.

    ```bash
    sudo rpm -e hypervkvpd  ## (may return error if not installed, that's OK)
    sudo yum install microsoft-hyper-v
    ```

    Alternatively, you can follow the manual installation instructions on the [LIS download page](https://go.microsoft.com/fwlink/?linkid=403033) to install the RPM onto your VM.

12. Install the Azure Linux Agent and dependencies:

	```bash
	sudo yum install python-pyasn1 WALinuxAgent
	```

    The WALinuxAgent package will remove the NetworkManager and NetworkManager-gnome packages if they were not already removed as described in step 3.

13. Modify the kernel boot line in your grub configuration to include additional kernel parameters for Azure. To do this, open `/boot/grub/menu.lst` in a text editor and ensure that the default kernel includes the following parameters:

	```console
	console=ttyS0 earlyprintk=ttyS0 rootdelay=300
	```

    This will also ensure all console messages are sent to the first serial port, which can assist Azure support with debugging issues.

    In addition to the above, it is recommended to *remove* the following parameters:

	```console
	rhgb quiet crashkernel=auto
	```

    Graphical and quiet boot are not useful in a cloud environment where we want all the logs to be sent to the serial port.  The `crashkernel` option may be left configured if desired, but note that this parameter will reduce the amount of available memory in the VM by 128MB or more, which may be problematic on the smaller VM sizes.

    > [!Important]
    > CentOS 6.5 and earlier must also set the kernel parameter `numa=off`. See Red Hat [KB 436883](https://access.redhat.com/solutions/436883).

14. Ensure that the SSH server is installed and configured to start at boot time.  This is usually the default.

15. Do not create swap space on the OS disk.

    The Azure Linux Agent can automatically configure swap space using the local resource disk that is attached to the VM after provisioning on Azure. Note that the local resource disk is a *temporary* disk, and might be emptied when the VM is deprovisioned. After installing the Azure Linux Agent (see previous step), modify the following parameters in `/etc/waagent.conf` appropriately:

	```console
	ResourceDisk.Format=y
	ResourceDisk.Filesystem=ext4
	ResourceDisk.MountPoint=/mnt/resource
	ResourceDisk.EnableSwap=y
	ResourceDisk.SwapSizeMB=2048 ## NOTE: set this to whatever you need it to be.
	```

16. Run the following commands to deprovision the virtual machine and prepare it for provisioning on Azure:

	```bash
	sudo waagent -force -deprovision
	export HISTSIZE=0
	logout
	```

17. Click **Action -> Shut Down** in Hyper-V Manager. Your Linux VHD is now ready to be uploaded to Azure.



## CentOS 7.0+

**Changes in CentOS 7 (and similar derivatives)**

Preparing a CentOS 7 virtual machine for Azure is very similar to CentOS 6, however there are several important differences worth noting:

* The NetworkManager package no longer conflicts with the Azure Linux agent. This package is installed by default and we recommend that it is not removed.
* GRUB2 is now used as the default bootloader, so the procedure for editing kernel parameters has changed (see below).
* XFS is now the default file system. The ext4 file system can still be used if desired.

**Configuration Steps**

1. In Hyper-V Manager, select the virtual machine.

2. Click **Connect** to open a console window for the virtual machine.

3. Create or edit the file `/etc/sysconfig/network` and add the following text:

	```console
	NETWORKING=yes
	HOSTNAME=localhost.localdomain
	```

4. Create or edit the file `/etc/sysconfig/network-scripts/ifcfg-eth0` and add the following text:

	```console
	DEVICE=eth0
	ONBOOT=yes
	BOOTPROTO=dhcp
	TYPE=Ethernet
	USERCTL=no
	PEERDNS=yes
	IPV6INIT=no
	NM_CONTROLLED=no
	```

5. Modify udev rules to avoid generating static rules for the Ethernet interface(s). These rules can cause problems when cloning a virtual machine in Microsoft Azure or Hyper-V:

	```bash
	sudo ln -s /dev/null /etc/udev/rules.d/75-persistent-net-generator.rules
	```

6. If you would like to use the OpenLogic mirrors that are hosted within the Azure datacenters, then replace the `/etc/yum.repos.d/CentOS-Base.repo` file with the following repositories.  This will also add the **[openlogic]** repository that includes packages for the Azure Linux agent:

	```console
	[openlogic]
	name=CentOS-$releasever - openlogic packages for $basearch
	baseurl=http://olcentgbl.trafficmanager.net/openlogic/$releasever/openlogic/$basearch/
	enabled=1
	gpgcheck=0
	
	[base]
	name=CentOS-$releasever - Base
	#mirrorlist=http://mirrorlist.centos.org/?release=$releasever&arch=$basearch&repo=os&infra=$infra
	baseurl=http://olcentgbl.trafficmanager.net/centos/$releasever/os/$basearch/
	gpgcheck=1
	gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-7
	
	#released updates
	[updates]
	name=CentOS-$releasever - Updates
	#mirrorlist=http://mirrorlist.centos.org/?release=$releasever&arch=$basearch&repo=updates&infra=$infra
	baseurl=http://olcentgbl.trafficmanager.net/centos/$releasever/updates/$basearch/
	gpgcheck=1
	gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-7
	
	#additional packages that may be useful
	[extras]
	name=CentOS-$releasever - Extras
	#mirrorlist=http://mirrorlist.centos.org/?release=$releasever&arch=$basearch&repo=extras&infra=$infra
	baseurl=http://olcentgbl.trafficmanager.net/centos/$releasever/extras/$basearch/
	gpgcheck=1
	gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-7
	
	#additional packages that extend functionality of existing packages
	[centosplus]
	name=CentOS-$releasever - Plus
	#mirrorlist=http://mirrorlist.centos.org/?release=$releasever&arch=$basearch&repo=centosplus&infra=$infra
	baseurl=http://olcentgbl.trafficmanager.net/centos/$releasever/centosplus/$basearch/
	gpgcheck=1
	enabled=0
	gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-7
	```
	
    > [!Note]
    > The rest of this guide will assume you are using at least the `[openlogic]` repo, which will be used to install the Azure Linux agent below.

7. Run the following command to clear the current yum metadata and install any updates:

	```bash
	sudo yum clean all
	```

    Unless you are creating an image for an older version of CentOS, it is recommended to update all the packages to the latest:

	```bash
	sudo yum -y update
	```

    A reboot maybe required after running this command.

8. Modify the kernel boot line in your grub configuration to include additional kernel parameters for Azure. To do this, open `/etc/default/grub` in a text editor and edit the `GRUB_CMDLINE_LINUX` parameter, for example:

	```console
	GRUB_CMDLINE_LINUX="rootdelay=300 console=ttyS0 earlyprintk=ttyS0 net.ifnames=0"
	```

   This will also ensure all console messages are sent to the first serial port, which can assist Azure support with debugging issues. It also turns off the new CentOS 7 naming conventions for NICs. In addition to the above, it is recommended to *remove* the following parameters:

	```console
	rhgb quiet crashkernel=auto
	```

    Graphical and quiet boot are not useful in a cloud environment where we want all the logs to be sent to the serial port. The `crashkernel` option may be left configured if desired, but note that this parameter will reduce the amount of available memory in the VM by 128MB or more, which may be problematic on the smaller VM sizes.

9. Once you are done editing `/etc/default/grub` per above, run the following command to rebuild the grub configuration:

	```bash
	sudo grub2-mkconfig -o /boot/grub2/grub.cfg
	```

10. If building the image from **VMware, VirtualBox or KVM:** Ensure the Hyper-V drivers are included in the initramfs:

    Edit `/etc/dracut.conf`, add content:

	```console
	add_drivers+=”hv_vmbus hv_netvsc hv_storvsc”
	```

    Rebuild the initramfs:

	```bash
	sudo dracut -f -v
	```

11. Install the Azure Linux Agent and dependencies:

	```bash
	sudo yum install python-pyasn1 WALinuxAgent
	sudo systemctl enable waagent
	```

12. Do not create swap space on the OS disk.

    The Azure Linux Agent can automatically configure swap space using the local resource disk that is attached to the VM after provisioning on Azure. Note that the local resource disk is a *temporary* disk, and might be emptied when the VM is deprovisioned. After installing the Azure Linux Agent (see previous step), modify the following parameters in `/etc/waagent.conf` appropriately:

	```console
	ResourceDisk.Format=y
	ResourceDisk.Filesystem=ext4
	ResourceDisk.MountPoint=/mnt/resource
	ResourceDisk.EnableSwap=y
	ResourceDisk.SwapSizeMB=2048    ## NOTE: set this to whatever you need it to be.
	```

13. Run the following commands to deprovision the virtual machine and prepare it for provisioning on Azure:

	```bash
	sudo waagent -force -deprovision
	export HISTSIZE=0
	logout
	```

14. Click **Action -> Shut Down** in Hyper-V Manager. Your Linux VHD is now ready to be uploaded to Azure.

## Next steps

You're now ready to use your CentOS Linux virtual hard disk to create new virtual machines in Azure. If this is the first time that you're uploading the .vhd file to Azure, see [Create a Linux VM from a custom disk](upload-vhd.md#option-1-upload-a-vhd).
