---
title: Create and upload a Red Hat Enterprise Linux VHD for use in Azure | Microsoft Docs
description: Learn to create and upload an Azure virtual hard disk (VHD) that contains a Red Hat Linux operating system.
services: virtual-machines-linux
documentationcenter: ''
author: szarkos
manager: jeconnoc
editor: tysonn
tags: azure-resource-manager,azure-service-management

ms.assetid: 6c6b8f72-32d3-47fa-be94-6cb54537c69f
ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: na
ms.topic: article
ms.date: 08/07/2018
ms.author: szark

---
# Prepare a Red Hat-based virtual machine for Azure
In this article, you will learn how to prepare a Red Hat Enterprise Linux (RHEL) virtual machine for use in Azure. The versions of RHEL that are covered in this article are 6.7+ and 7.1+. The hypervisors for preparation that are covered in this article are Hyper-V, kernel-based virtual machine (KVM), and VMware. For more information about eligibility requirements for participating in Red Hat's Cloud Access program, see [Red Hat's Cloud Access website](http://www.redhat.com/en/technologies/cloud-computing/cloud-access) and [Running RHEL on Azure](https://access.redhat.com/ecosystem/ccsp/microsoft-azure).

## Prepare a Red Hat-based virtual machine from Hyper-V Manager

### Prerequisites
This section assumes that you have already obtained an ISO file from the Red Hat website and installed the RHEL image to a virtual hard disk (VHD). For more details about how to use Hyper-V Manager to install an operating system image, see [Install the Hyper-V Role and Configure a Virtual Machine](http://technet.microsoft.com/library/hh846766.aspx).

**RHEL installation notes**

* Azure does not support the VHDX format. Azure supports only fixed VHD. You can use Hyper-V Manager to convert the disk to VHD format, or you can use the convert-vhd cmdlet. If you use VirtualBox, select **Fixed size** as opposed to the default dynamically allocated option when you create the disk.
* Azure supports only generation 1 virtual machines. You can convert a generation 1 virtual machine from VHDX to the VHD file format and from dynamically expanding to a fixed-size disk. You can't change a virtual machine's generation. For more information, see [Should I create a generation 1 or 2 virtual machine in Hyper-V?](https://technet.microsoft.com/windows-server-docs/compute/hyper-v/plan/should-i-create-a-generation-1-or-2-virtual-machine-in-hyper-v).
* The maximum size that's allowed for the VHD is 1,023 GB.
* When you install the Linux operating system, we recommend that you use standard partitions rather than Logical Volume Manager (LVM), which is often the default for many installations. This practice will avoid LVM name conflicts with cloned virtual machines, particularly if you ever need to attach an operating system disk to another identical virtual machine for troubleshooting. [LVM](configure-lvm.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) or [RAID](configure-raid.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) may be used on data disks.
* Kernel support for mounting Universal Disk Format (UDF) file systems is required. At first boot on Azure, the UDF-formatted media that is attached to the guest passes the provisioning configuration to the Linux virtual machine. The Azure Linux Agent must be able to mount the UDF file system to read its configuration and provision the virtual machine.
* Do not configure a swap partition on the operating system disk. The Linux Agent can be configured to create a swap file on the temporary resource disk.  More information about this can be found in the following steps.
* All VHDs on Azure must have a virtual size aligned to 1MB. When converting from a raw disk to VHD you must ensure that the raw disk size is a multiple of 1MB before conversion. More details can be found in the steps below. See also [Linux Installation Notes](create-upload-generic.md#general-linux-installation-notes) for more information.

### Prepare a RHEL 6 virtual machine from Hyper-V Manager

1. In Hyper-V Manager, select the virtual machine.

1. Click **Connect** to open a console window for the virtual machine.

1. In RHEL 6, NetworkManager can interfere with the Azure Linux agent. Uninstall this package by running the following command:
   
        # sudo rpm -e --nodeps NetworkManager

1. Create or edit the `/etc/sysconfig/network` file, and add the following text:
   
        NETWORKING=yes
        HOSTNAME=localhost.localdomain

1. Create or edit the `/etc/sysconfig/network-scripts/ifcfg-eth0` file, and add the following text:
   
        DEVICE=eth0
        ONBOOT=yes
        BOOTPROTO=dhcp
        TYPE=Ethernet
        USERCTL=no
        PEERDNS=yes
        IPV6INIT=no

1. Move (or remove) the udev rules to avoid generating static rules for the Ethernet interface. These rules cause problems when you clone a virtual machine in Microsoft Azure or Hyper-V:

        # sudo ln -s /dev/null /etc/udev/rules.d/75-persistent-net-generator.rules
        
        # sudo rm -f /etc/udev/rules.d/70-persistent-net.rules

1. Ensure that the network service will start at boot time by running the following command:

		# sudo chkconfig network on

1. Register your Red Hat subscription to enable the installation of packages from the RHEL repository by running the following command:

		# sudo subscription-manager register --auto-attach --username=XXX --password=XXX

1. The WALinuxAgent package, `WALinuxAgent-<version>`, has been pushed to the Red Hat extras repository. Enable the extras repository by running the following command:

		# subscription-manager repos --enable=rhel-6-server-extras-rpms

1. Modify the kernel boot line in your grub configuration to include additional kernel parameters for Azure. To do this modification, open `/boot/grub/menu.lst` in a text editor, and ensure that the default kernel includes the following parameters:
    
		console=ttyS0 earlyprintk=ttyS0 rootdelay=300
    
    This will also ensure that all console messages are sent to the first serial port, which can assist Azure support with debugging issues.
    
    In addition, we recommended that you remove the following parameters:
    
		rhgb quiet crashkernel=auto
    
    Graphical and quiet boot are not useful in a cloud environment where we want all the logs to be sent to the serial port.  You can leave the `crashkernel` option configured if desired. Note that this parameter reduces the amount of available memory in the virtual machine by 128 MB or more. This configuration might be problematic on smaller virtual machine sizes.


1. Ensure that the secure shell (SSH) server is installed and configured to start at boot time, which is usually the default. Modify /etc/ssh/sshd_config to include the following line:

		ClientAliveInterval 180

1. Install the Azure Linux Agent by running the following command:

        # sudo yum install WALinuxAgent

        # sudo chkconfig waagent on

    Installing the WALinuxAgent package removes the NetworkManager and NetworkManager-gnome packages if they were not already removed in step 3.

1. Do not create swap space on the operating system disk.

    The Azure Linux Agent can automatically configure swap space by using the local resource disk that is attached to the virtual machine after the virtual machine is provisioned on Azure. Note that the local resource disk is a temporary disk and that it might be emptied when the virtual machine is deprovisioned. After you install the Azure Linux Agent in the previous step, modify the following parameters in /etc/waagent.conf appropriately:

		ResourceDisk.Format=y
		ResourceDisk.Filesystem=ext4
		ResourceDisk.MountPoint=/mnt/resource
		ResourceDisk.EnableSwap=y
		ResourceDisk.SwapSizeMB=2048    ## NOTE: set this to whatever you need it to be.

1. Unregister the subscription (if necessary) by running the following command:

		# sudo subscription-manager unregister

1. Run the following commands to deprovision the virtual machine and prepare it for provisioning on Azure:

        # sudo waagent -force -deprovision

        # export HISTSIZE=0

        # logout

1. Click **Action** > **Shut Down** in Hyper-V Manager. Your Linux VHD is now ready to be uploaded to Azure.


### Prepare a RHEL 7 virtual machine from Hyper-V Manager

1. In Hyper-V Manager, select the virtual machine.

1. Click **Connect** to open a console window for the virtual machine.

1. Create or edit the `/etc/sysconfig/network` file, and add the following text:
   
        NETWORKING=yes
        HOSTNAME=localhost.localdomain

1. Create or edit the `/etc/sysconfig/network-scripts/ifcfg-eth0` file, and add the following text:
   
        DEVICE=eth0
        ONBOOT=yes
        BOOTPROTO=dhcp
        TYPE=Ethernet
        USERCTL=no
        PEERDNS=yes
        IPV6INIT=no
		NM_CONTROLLED=no

1. Ensure that the network service will start at boot time by running the following command:

		# sudo systemctl enable network

1. Register your Red Hat subscription to enable the installation of packages from the RHEL repository by running the following command:

		# sudo subscription-manager register --auto-attach --username=XXX --password=XXX

1. Modify the kernel boot line in your grub configuration to include additional kernel parameters for Azure. To do this modification, open `/etc/default/grub` in a text editor, and edit the `GRUB_CMDLINE_LINUX` parameter. For example:
   
        GRUB_CMDLINE_LINUX="rootdelay=300 console=ttyS0 earlyprintk=ttyS0 net.ifnames=0"
   
   This will also ensure that all console messages are sent to the first serial port, which can assist Azure support with debugging issues. This configuration also turns off the new RHEL 7 naming conventions for NICs. In addition, we recommend that you remove the following parameters:
   
        rhgb quiet crashkernel=auto
   
    Graphical and quiet boot are not useful in a cloud environment where we want all the logs to be sent to the serial port. You can leave the `crashkernel` option configured if desired. Note that this parameter reduces the amount of available memory in the virtual machine by 128 MB or more, which might be problematic on smaller virtual machine sizes.

1. After you are done editing `/etc/default/grub`, run the following command to rebuild the grub configuration:

		# sudo grub2-mkconfig -o /boot/grub2/grub.cfg

1. Ensure that the SSH server is installed and configured to start at boot time, which is usually the default. Modify `/etc/ssh/sshd_config` to include the following line:

		ClientAliveInterval 180

1. The WALinuxAgent package, `WALinuxAgent-<version>`, has been pushed to the Red Hat extras repository. Enable the extras repository by running the following command:

		# subscription-manager repos --enable=rhel-7-server-extras-rpms

1. Install the Azure Linux Agent by running the following command:

        # sudo yum install WALinuxAgent

        # sudo systemctl enable waagent.service

1. Do not create swap space on the operating system disk.

    The Azure Linux Agent can automatically configure swap space by using the local resource disk that is attached to the virtual machine after the virtual machine is provisioned on Azure. Note that the local resource disk is a temporary disk, and it might be emptied when the virtual machine is deprovisioned. After you install the Azure Linux Agent in the previous step, modify the following parameters in `/etc/waagent.conf` appropriately:

		ResourceDisk.Format=y
		ResourceDisk.Filesystem=ext4
		ResourceDisk.MountPoint=/mnt/resource
		ResourceDisk.EnableSwap=y
		ResourceDisk.SwapSizeMB=2048    ## NOTE: set this to whatever you need it to be.

1. If you want to unregister the subscription, run the following command:

		# sudo subscription-manager unregister

1. Run the following commands to deprovision the virtual machine and prepare it for provisioning on Azure:

        # sudo waagent -force -deprovision

        # export HISTSIZE=0

        # logout

1. Click **Action** > **Shut Down** in Hyper-V Manager. Your Linux VHD is now ready to be uploaded to Azure.


## Prepare a Red Hat-based virtual machine from KVM
### Prepare a RHEL 6 virtual machine from KVM

1. Download the KVM image of RHEL 6 from the Red Hat website.

1. Set a root password.

	Generate an encrypted password, and copy the output of the command:

		# openssl passwd -1 changeme

	Set a root password with guestfish:
		
		# guestfish --rw -a <image-name>
		> <fs> run
		> <fs> list-filesystems
		> <fs> mount /dev/sda1 /
		> <fs> vi /etc/shadow
		> <fs> exit

   Change the second field of the root user from "!!" to the encrypted password.

1. Create a virtual machine in KVM from the qcow2 image. Set the disk type to **qcow2**, and set the virtual network interface device model to **virtio**. Then, start the virtual machine, and sign in as root.

1. Create or edit the `/etc/sysconfig/network` file, and add the following text:
   
        NETWORKING=yes
        HOSTNAME=localhost.localdomain

1. Create or edit the `/etc/sysconfig/network-scripts/ifcfg-eth0` file, and add the following text:
   
        DEVICE=eth0
        ONBOOT=yes
        BOOTPROTO=dhcp
        TYPE=Ethernet
        USERCTL=no
        PEERDNS=yes
        IPV6INIT=no

1. Move (or remove) the udev rules to avoid generating static rules for the Ethernet interface. These rules cause problems when you clone a virtual machine in Azure or Hyper-V:

        # sudo ln -s /dev/null /etc/udev/rules.d/75-persistent-net-generator.rules

        # sudo rm -f /etc/udev/rules.d/70-persistent-net.rules

1. Ensure that the network service will start at boot time by running the following command:

		# chkconfig network on

1. Register your Red Hat subscription to enable the installation of packages from the RHEL repository by running the following command:

		# subscription-manager register --auto-attach --username=XXX --password=XXX

1. Modify the kernel boot line in your grub configuration to include additional kernel parameters for Azure. To do this configuration, open `/boot/grub/menu.lst` in a text editor, and ensure that the default kernel includes the following parameters:
    
        console=ttyS0 earlyprintk=ttyS0 rootdelay=300
    
    This will also ensure that all console messages are sent to the first serial port, which can assist Azure support with debugging issues.
    
    In addition, we recommend that you remove the following parameters:
    
        rhgb quiet crashkernel=auto
    
    Graphical and quiet boot are not useful in a cloud environment where we want all the logs to be sent to the serial port. You can leave the `crashkernel` option configured if desired. Note that this parameter reduces the amount of available memory in the virtual machine by 128 MB or more, which might be problematic on smaller virtual machine sizes.


1. Add Hyper-V modules to initramfs:  

    Edit `/etc/dracut.conf`, and add the following content:

		add_drivers+=" hv_vmbus hv_netvsc hv_storvsc "

    Rebuild initramfs:

		# dracut -f -v

1. Uninstall cloud-init:

		# yum remove cloud-init

1. Ensure that the SSH server is installed and configured to start at boot time:

		# chkconfig sshd on

	Modify /etc/ssh/sshd_config to include the following lines:

		PasswordAuthentication yes
		ClientAliveInterval 180

1. The WALinuxAgent package, `WALinuxAgent-<version>`, has been pushed to the Red Hat extras repository. Enable the extras repository by running the following command:

		# subscription-manager repos --enable=rhel-6-server-extras-rpms

1. Install the Azure Linux Agent by running the following command:

        # yum install WALinuxAgent

        # chkconfig waagent on

1. The Azure Linux Agent can automatically configure swap space by using the local resource disk that is attached to the virtual machine after the virtual machine is provisioned on Azure. Note that the local resource disk is a temporary disk, and it might be emptied when the virtual machine is deprovisioned. After you install the Azure Linux Agent in the previous step, modify the following parameters in **/etc/waagent.conf** appropriately:

		ResourceDisk.Format=y
		ResourceDisk.Filesystem=ext4
		ResourceDisk.MountPoint=/mnt/resource
		ResourceDisk.EnableSwap=y
		ResourceDisk.SwapSizeMB=2048    ## NOTE: set this to whatever you need it to be.

1. Unregister the subscription (if necessary) by running the following command:

		# subscription-manager unregister

1. Run the following commands to deprovision the virtual machine and prepare it for provisioning on Azure:

        # waagent -force -deprovision

        # export HISTSIZE=0

        # logout

1. Shut down the virtual machine in KVM.

1. Convert the qcow2 image to the VHD format.

> [!NOTE]
> There is a known bug in qemu-img versions >=2.2.1 that results in an improperly formatted VHD. The issue has been fixed in QEMU 2.6. It is recommended to use either qemu-img 2.2.0 or lower, or update to 2.6 or higher. Reference: https://bugs.launchpad.net/qemu/+bug/1490611.
>


	First convert the image to raw format:

		# qemu-img convert -f qcow2 -O raw rhel-6.9.qcow2 rhel-6.9.raw

	Make sure that the size of the raw image is aligned with 1 MB. Otherwise, round up the size to align with 1 MB:

		# MB=$((1024*1024))
		# size=$(qemu-img info -f raw --output json "rhel-6.9.raw" | \
		  gawk 'match($0, /"virtual-size": ([0-9]+),/, val) {print val[1]}')

		# rounded_size=$((($size/$MB + 1)*$MB))
		# qemu-img resize rhel-6.9.raw $rounded_size

	Convert the raw disk to a fixed-sized VHD:

		# qemu-img convert -f raw -o subformat=fixed -O vpc rhel-6.9.raw rhel-6.9.vhd

	Or, with qemu version **2.6+** include the `force_size` option:

		# qemu-img convert -f raw -o subformat=fixed,force_size -O vpc rhel-6.9.raw rhel-6.9.vhd

		
### Prepare a RHEL 7 virtual machine from KVM

1. Download the KVM image of RHEL 7 from the Red Hat website. This procedure uses RHEL 7 as the example.

1. Set a root password.

	Generate an encrypted password, and copy the output of the command:

		# openssl passwd -1 changeme

	Set a root password with guestfish:

		# guestfish --rw -a <image-name>
		> <fs> run
		> <fs> list-filesystems
		> <fs> mount /dev/sda1 /
		> <fs> vi /etc/shadow
		> <fs> exit

   Change the second field of root user from "!!" to the encrypted password.

1. Create a virtual machine in KVM from the qcow2 image. Set the disk type to **qcow2**, and set the virtual network interface device model to **virtio**. Then, start the virtual machine, and sign in as root.

1. Create or edit the `/etc/sysconfig/network` file, and add the following text:
   
        NETWORKING=yes
        HOSTNAME=localhost.localdomain

1. Create or edit the `/etc/sysconfig/network-scripts/ifcfg-eth0` file, and add the following text:
   
        DEVICE=eth0
        ONBOOT=yes
        BOOTPROTO=dhcp
        TYPE=Ethernet
        USERCTL=no
        PEERDNS=yes
        IPV6INIT=no
        NM_CONTROLLED=no

1. Ensure that the network service will start at boot time by running the following command:

		# sudo systemctl enable network

1. Register your Red Hat subscription to enable installation of packages from the RHEL repository by running the following command:

		# subscription-manager register --auto-attach --username=XXX --password=XXX

1. Modify the kernel boot line in your grub configuration to include additional kernel parameters for Azure. To do this configuration, open `/etc/default/grub` in a text editor, and edit the `GRUB_CMDLINE_LINUX` parameter. For example:
   
        GRUB_CMDLINE_LINUX="rootdelay=300 console=ttyS0 earlyprintk=ttyS0 net.ifnames=0"
   
   This command also ensures that all console messages are sent to the first serial port, which can assist Azure support with debugging issues. The command also turns off the new RHEL 7 naming conventions for NICs. In addition, we recommend that you remove the following parameters:
   
        rhgb quiet crashkernel=auto
   
    Graphical and quiet boot are not useful in a cloud environment where we want all the logs to be sent to the serial port. You can leave the `crashkernel` option configured if desired. Note that this parameter reduces the amount of available memory in the virtual machine by 128 MB or more, which might be problematic on smaller virtual machine sizes.

1. After you are done editing `/etc/default/grub`, run the following command to rebuild the grub configuration:

		# grub2-mkconfig -o /boot/grub2/grub.cfg

1. Add Hyper-V modules into initramfs.

	Edit `/etc/dracut.conf` and add content:

		add_drivers+=" hv_vmbus hv_netvsc hv_storvsc "

	Rebuild initramfs:

		# dracut -f -v

1. Uninstall cloud-init:

		# yum remove cloud-init

1. Ensure that the SSH server is installed and configured to start at boot time:

		# systemctl enable sshd

    Modify /etc/ssh/sshd_config to include the following lines:

		PasswordAuthentication yes
		ClientAliveInterval 180

1. The WALinuxAgent package, `WALinuxAgent-<version>`, has been pushed to the Red Hat extras repository. Enable the extras repository by running the following command:

		# subscription-manager repos --enable=rhel-7-server-extras-rpms

1. Install the Azure Linux Agent by running the following command:

		# yum install WALinuxAgent

	Enable the waagent service:

		# systemctl enable waagent.service

1. Do not create swap space on the operating system disk.

    The Azure Linux Agent can automatically configure swap space by using the local resource disk that is attached to the virtual machine after the virtual machine is provisioned on Azure. Note that the local resource disk is a temporary disk, and it might be emptied when the virtual machine is deprovisioned. After you install the Azure Linux Agent in the previous step, modify the following parameters in `/etc/waagent.conf` appropriately:

		ResourceDisk.Format=y
		ResourceDisk.Filesystem=ext4
		ResourceDisk.MountPoint=/mnt/resource
		ResourceDisk.EnableSwap=y
		ResourceDisk.SwapSizeMB=2048    ## NOTE: set this to whatever you need it to be.

1. Unregister the subscription (if necessary) by running the following command:

		# subscription-manager unregister

1. Run the following commands to deprovision the virtual machine and prepare it for provisioning on Azure:

        # sudo waagent -force -deprovision

        # export HISTSIZE=0

        # logout

1. Shut down the virtual machine in KVM.

1. Convert the qcow2 image to the VHD format.

> [!NOTE]
> There is a known bug in qemu-img versions >=2.2.1 that results in an improperly formatted VHD. The issue has been fixed in QEMU 2.6. It is recommended to use either qemu-img 2.2.0 or lower, or update to 2.6 or higher. Reference: https://bugs.launchpad.net/qemu/+bug/1490611.
>


	First convert the image to raw format:

		# qemu-img convert -f qcow2 -O raw rhel-7.4.qcow2 rhel-7.4.raw

	Make sure that the size of the raw image is aligned with 1 MB. Otherwise, round up the size to align with 1 MB:

		# MB=$((1024*1024))
		# size=$(qemu-img info -f raw --output json "rhel-7.4.raw" | \
		  gawk 'match($0, /"virtual-size": ([0-9]+),/, val) {print val[1]}')

		# rounded_size=$((($size/$MB + 1)*$MB))
		# qemu-img resize rhel-7.4.raw $rounded_size

	Convert the raw disk to a fixed-sized VHD:

		# qemu-img convert -f raw -o subformat=fixed -O vpc rhel-7.4.raw rhel-7.4.vhd

	Or, with qemu version **2.6+** include the `force_size` option:

		# qemu-img convert -f raw -o subformat=fixed,force_size -O vpc rhel-7.4.raw rhel-7.4.vhd


## Prepare a Red Hat-based virtual machine from VMware
### Prerequisites
This section assumes that you have already installed a RHEL virtual machine in VMware. For details about how to install an operating system in VMware, see [VMware Guest Operating System Installation Guide](http://partnerweb.vmware.com/GOSIG/home.html).

* When you install the Linux operating system, we recommend that you use standard partitions rather than LVM, which is often the default for many installations. This will avoid LVM name conflicts with cloned virtual machine, particularly if an operating system disk ever needs to be attached to another virtual machine for troubleshooting. LVM or RAID can be used on data disks if preferred.
* Do not configure a swap partition on the operating system disk. You can configure the Linux agent to create a swap file on the temporary resource disk. You can find more information about this in the steps that follow.
* When you create the virtual hard disk, select **Store virtual disk as a single file**.

### Prepare a RHEL 6 virtual machine from VMware
1. In RHEL 6, NetworkManager can interfere with the Azure Linux agent. Uninstall this package by running the following command:
   
        # sudo rpm -e --nodeps NetworkManager

1. Create a file named **network** in the /etc/sysconfig/ directory that contains the following text:

		NETWORKING=yes
		HOSTNAME=localhost.localdomain

1. Create or edit the `/etc/sysconfig/network-scripts/ifcfg-eth0` file, and add the following text:
   
        DEVICE=eth0
        ONBOOT=yes
        BOOTPROTO=dhcp
        TYPE=Ethernet
        USERCTL=no
        PEERDNS=yes
        IPV6INIT=no

1. Move (or remove) the udev rules to avoid generating static rules for the Ethernet interface. These rules cause problems when you clone a virtual machine in Azure or Hyper-V:

        # sudo ln -s /dev/null /etc/udev/rules.d/75-persistent-net-generator.rules

        # sudo rm -f /etc/udev/rules.d/70-persistent-net.rules

1. Ensure that the network service will start at boot time by running the following command:

		# sudo chkconfig network on

1. Register your Red Hat subscription to enable the installation of packages from the RHEL repository by running the following command:

		# sudo subscription-manager register --auto-attach --username=XXX --password=XXX

1. The WALinuxAgent package, `WALinuxAgent-<version>`, has been pushed to the Red Hat extras repository. Enable the extras repository by running the following command:

		# subscription-manager repos --enable=rhel-6-server-extras-rpms

1. Modify the kernel boot line in your grub configuration to include additional kernel parameters for Azure. To do this, open `/etc/default/grub` in a text editor, and edit the `GRUB_CMDLINE_LINUX` parameter. For example:
   
        GRUB_CMDLINE_LINUX="rootdelay=300 console=ttyS0 earlyprintk=ttyS0"
   
   This will also ensure that all console messages are sent to the first serial port, which can assist Azure support with debugging issues. In addition, we recommend that you remove the following parameters:
   
        rhgb quiet crashkernel=auto
   
    Graphical and quiet boot are not useful in a cloud environment where we want all the logs to be sent to the serial port. You can leave the `crashkernel` option configured if desired. Note that this parameter reduces the amount of available memory in the virtual machine by 128 MB or more, which might be problematic on smaller virtual machine sizes.

1. Add Hyper-V modules to initramfs:

	Edit `/etc/dracut.conf`, and add the following content:

		add_drivers+=" hv_vmbus hv_netvsc hv_storvsc "

	Rebuild initramfs:

		# dracut -f -v

1. Ensure that the SSH server is installed and configured to start at boot time, which is usually the default. Modify `/etc/ssh/sshd_config` to include the following line:

	ClientAliveInterval 180

1. Install the Azure Linux Agent by running the following command:

        # sudo yum install WALinuxAgent

        # sudo chkconfig waagent on

1. Do not create swap space on the operating system disk.

	The Azure Linux Agent can automatically configure swap space by using the local resource disk that is attached to the virtual machine after the virtual machine is provisioned on Azure. Note that the local resource disk is a temporary disk, and it might be emptied when the virtual machine is deprovisioned. After you install the Azure Linux Agent in the previous step, modify the following parameters in `/etc/waagent.conf` appropriately:

		ResourceDisk.Format=y
		ResourceDisk.Filesystem=ext4
		ResourceDisk.MountPoint=/mnt/resource
		ResourceDisk.EnableSwap=y
		ResourceDisk.SwapSizeMB=2048    ## NOTE: set this to whatever you need it to be.

1. Unregister the subscription (if necessary) by running the following command:

		# sudo subscription-manager unregister

1. Run the following commands to deprovision the virtual machine and prepare it for provisioning on Azure:

        # sudo waagent -force -deprovision

        # export HISTSIZE=0

        # logout

1. Shut down the virtual machine, and convert the VMDK file to a .vhd file.

> [!NOTE]
> There is a known bug in qemu-img versions >=2.2.1 that results in an improperly formatted VHD. The issue has been fixed in QEMU 2.6. It is recommended to use either qemu-img 2.2.0 or lower, or update to 2.6 or higher. Reference: https://bugs.launchpad.net/qemu/+bug/1490611.
>


	First convert the image to raw format:

		# qemu-img convert -f vmdk -O raw rhel-6.9.vmdk rhel-6.9.raw

	Make sure that the size of the raw image is aligned with 1 MB. Otherwise, round up the size to align with 1 MB:

		# MB=$((1024*1024))
		# size=$(qemu-img info -f raw --output json "rhel-6.9.raw" | \
		  gawk 'match($0, /"virtual-size": ([0-9]+),/, val) {print val[1]}')

		# rounded_size=$((($size/$MB + 1)*$MB))
		# qemu-img resize rhel-6.9.raw $rounded_size

	Convert the raw disk to a fixed-sized VHD:

		# qemu-img convert -f raw -o subformat=fixed -O vpc rhel-6.9.raw rhel-6.9.vhd

	Or, with qemu version **2.6+** include the `force_size` option:

		# qemu-img convert -f raw -o subformat=fixed,force_size -O vpc rhel-6.9.raw rhel-6.9.vhd


### Prepare a RHEL 7 virtual machine from VMware
1. Create or edit the `/etc/sysconfig/network` file, and add the following text:
   
        NETWORKING=yes
        HOSTNAME=localhost.localdomain

1. Create or edit the `/etc/sysconfig/network-scripts/ifcfg-eth0` file, and add the following text:
   
        DEVICE=eth0
        ONBOOT=yes
        BOOTPROTO=dhcp
        TYPE=Ethernet
        USERCTL=no
        PEERDNS=yes
        IPV6INIT=no
        NM_CONTROLLED=no

1. Ensure that the network service will start at boot time by running the following command:

		# sudo systemctl enable network

1. Register your Red Hat subscription to enable the installation of packages from the RHEL repository by running the following command:

		# sudo subscription-manager register --auto-attach --username=XXX --password=XXX

1. Modify the kernel boot line in your grub configuration to include additional kernel parameters for Azure. To do this modification, open `/etc/default/grub` in a text editor, and edit the `GRUB_CMDLINE_LINUX` parameter. For example:
   
        GRUB_CMDLINE_LINUX="rootdelay=300 console=ttyS0 earlyprintk=ttyS0 net.ifnames=0"
   
   This configuration also ensures that all console messages are sent to the first serial port, which can assist Azure support with debugging issues. It also turns off the new RHEL 7 naming conventions for NICs. In addition, we recommend that you remove the following parameters:
   
        rhgb quiet crashkernel=auto
   
    Graphical and quiet boot are not useful in a cloud environment where we want all the logs to be sent to the serial port. You can leave the `crashkernel` option configured if desired. Note that this parameter reduces the amount of available memory in the virtual machine by 128 MB or more, which might be problematic on smaller virtual machine sizes.

1. After you are done editing `/etc/default/grub`, run the following command to rebuild the grub configuration:

		# sudo grub2-mkconfig -o /boot/grub2/grub.cfg

1. Add Hyper-V modules to initramfs.

	Edit `/etc/dracut.conf`, add content:

		add_drivers+=" hv_vmbus hv_netvsc hv_storvsc "

	Rebuild initramfs:

		# dracut -f -v

1. Ensure that the SSH server is installed and configured to start at boot time. This setting is usually the default. Modify `/etc/ssh/sshd_config` to include the following line:

		ClientAliveInterval 180

1. The WALinuxAgent package, `WALinuxAgent-<version>`, has been pushed to the Red Hat extras repository. Enable the extras repository by running the following command:

		# subscription-manager repos --enable=rhel-7-server-extras-rpms

1. Install the Azure Linux Agent by running the following command:

        # sudo yum install WALinuxAgent

        # sudo systemctl enable waagent.service

1. Do not create swap space on the operating system disk.

    The Azure Linux Agent can automatically configure swap space by using the local resource disk that is attached to the virtual machine after the virtual machine is provisioned on Azure. Note that the local resource disk is a temporary disk, and it might be emptied when the virtual machine is deprovisioned. After you install the Azure Linux Agent in the previous step, modify the following parameters in `/etc/waagent.conf` appropriately:

		ResourceDisk.Format=y
		ResourceDisk.Filesystem=ext4
		ResourceDisk.MountPoint=/mnt/resource
		ResourceDisk.EnableSwap=y
		ResourceDisk.SwapSizeMB=2048    ## NOTE: set this to whatever you need it to be.

1. If you want to unregister the subscription, run the following command:

		# sudo subscription-manager unregister

1. Run the following commands to deprovision the virtual machine and prepare it for provisioning on Azure:

        # sudo waagent -force -deprovision

        # export HISTSIZE=0

        # logout

1. Shut down the virtual machine, and convert the VMDK file to the VHD format.

> [!NOTE]
> There is a known bug in qemu-img versions >=2.2.1 that results in an improperly formatted VHD. The issue has been fixed in QEMU 2.6. It is recommended to use either qemu-img 2.2.0 or lower, or update to 2.6 or higher. Reference: https://bugs.launchpad.net/qemu/+bug/1490611.
>


	First convert the image to raw format:

		# qemu-img convert -f vmdk -O raw rhel-7.4.vmdk rhel-7.4.raw

	Make sure that the size of the raw image is aligned with 1 MB. Otherwise, round up the size to align with 1 MB:

		# MB=$((1024*1024))
		# size=$(qemu-img info -f raw --output json "rhel-7.4.raw" | \
		  gawk 'match($0, /"virtual-size": ([0-9]+),/, val) {print val[1]}')

		# rounded_size=$((($size/$MB + 1)*$MB))
		# qemu-img resize rhel-7.4.raw $rounded_size

	Convert the raw disk to a fixed-sized VHD:

		# qemu-img convert -f raw -o subformat=fixed -O vpc rhel-7.4.raw rhel-7.4.vhd

	Or, with qemu version **2.6+** include the `force_size` option:

		# qemu-img convert -f raw -o subformat=fixed,force_size -O vpc rhel-7.4.raw rhel-7.4.vhd


## Prepare a Red Hat-based virtual machine from an ISO by using a kickstart file automatically
### Prepare a RHEL 7 virtual machine from a kickstart file

1.  Create a kickstart file that includes the following content, and save the file. For details about kickstart installation, see the [Kickstart Installation Guide](https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux/7/html/Installation_Guide/chap-kickstart-installations.html).

        # Kickstart for provisioning a RHEL 7 Azure VM

        # System authorization information
          auth --enableshadow --passalgo=sha512

        # Use graphical install
        text

        # Do not run the Setup Agent on first boot
        firstboot --disable

        # Keyboard layouts
        keyboard --vckeymap=us --xlayouts='us'

        # System language
        lang en_US.UTF-8

        # Network information
        network  --bootproto=dhcp

        # Root password
        rootpw --plaintext "to_be_disabled"

        # System services
        services --enabled="sshd,waagent,NetworkManager"

        # System timezone
        timezone Etc/UTC --isUtc --ntpservers 0.rhel.pool.ntp.org,1.rhel.pool.ntp.org,2.rhel.pool.ntp.org,3.rhel.pool.ntp.org

        # Partition clearing information
        clearpart --all --initlabel

        # Clear the MBR
        zerombr

        # Disk partitioning information
        part /boot --fstype="xfs" --size=500
        part / --fstyp="xfs" --size=1 --grow --asprimary

        # System bootloader configuration
        bootloader --location=mbr

        # Firewall configuration
        firewall --disabled

        # Enable SELinux
        selinux --enforcing

        # Don't configure X
        skipx

        # Power down the machine after install
        poweroff

        %packages
        @base
        @console-internet
        chrony
        sudo
        parted
        -dracut-config-rescue

        %end

        %post --log=/var/log/anaconda/post-install.log

        #!/bin/bash

        # Register Red Hat Subscription
        subscription-manager register --username=XXX --password=XXX --auto-attach --force

        # Install latest repo update
        yum update -y

        # Enable extras repo
        subscription-manager repos --enable=rhel-7-server-extras-rpms

        # Install WALinuxAgent
        yum install -y WALinuxAgent

        # Unregister Red Hat subscription
        subscription-manager unregister

        # Enable waaagent at boot-up
        systemctl enable waagent

        # Disable the root account
        usermod root -p '!!'

        # Configure swap in WALinuxAgent
        sed -i 's/^\(ResourceDisk\.EnableSwap\)=[Nn]$/\1=y/g' /etc/waagent.conf
        sed -i 's/^\(ResourceDisk\.SwapSizeMB\)=[0-9]*$/\1=2048/g' /etc/waagent.conf

        # Set the cmdline
        sed -i 's/^\(GRUB_CMDLINE_LINUX\)=".*"$/\1="console=tty1 console=ttyS0 earlyprintk=ttyS0 rootdelay=300"/g' /etc/default/grub

        # Enable SSH keepalive
        sed -i 's/^#\(ClientAliveInterval\).*$/\1 180/g' /etc/ssh/sshd_config

        # Build the grub cfg
        grub2-mkconfig -o /boot/grub2/grub.cfg

        # Configure network
        cat << EOF > /etc/sysconfig/network-scripts/ifcfg-eth0
        DEVICE=eth0
        ONBOOT=yes
        BOOTPROTO=dhcp
        TYPE=Ethernet
        USERCTL=no
        PEERDNS=yes
        IPV6INIT=no
        NM_CONTROLLED=no
        EOF

        # Deprovision and prepare for Azure
        waagent -force -deprovision

        %end

1. Place the kickstart file where the installation system can access it.

1. In Hyper-V Manager, create a new virtual machine. On the **Connect Virtual Hard Disk** page, select **Attach a virtual hard disk later**, and complete the New Virtual Machine Wizard.

1. Open the virtual machine settings:

	a.  Attach a new virtual hard disk to the virtual machine. Make sure to select **VHD Format** and **Fixed Size**.

	b.  Attach the installation ISO to the DVD drive.

	c.  Set the BIOS to boot from CD.

1. Start the virtual machine. When the installation guide appears, press **Tab** to configure the boot options.

1. Enter `inst.ks=<the location of the kickstart file>` at the end of the boot options, and press **Enter**.

1. Wait for the installation to finish. When it's finished, the virtual machine will be shut down automatically. Your Linux VHD is now ready to be uploaded to Azure.

## Known issues
### The Hyper-V driver could not be included in the initial RAM disk when using a non-Hyper-V hypervisor

In some cases, Linux installers might not include the drivers for Hyper-V in the initial RAM disk (initrd or initramfs) unless Linux detects that it is running in a Hyper-V environment.

When you're using a different virtualization system (that is, Virtualbox, Xen, etc.) to prepare your Linux image, you might need to rebuild initrd to ensure that at least the hv_vmbus and hv_storvsc kernel modules are available on the initial RAM disk. This is a known issue at least on systems that are based on the upstream Red Hat distribution.

To resolve this issue, add Hyper-V modules to initramfs and rebuild it:

Edit `/etc/dracut.conf`, and add the following content:

		add_drivers+=" hv_vmbus hv_netvsc hv_storvsc "

Rebuild initramfs:

		# dracut -f -v

For more details, see the information about [rebuilding initramfs](https://access.redhat.com/solutions/1958).

## Next steps
You're now ready to use your Red Hat Enterprise Linux virtual hard disk to create new virtual machines in Azure. If this is the first time that you're uploading the .vhd file to Azure, see [Create a Linux VM from a custom disk](upload-vhd.md#option-1-upload-a-vhd).

For more details about the hypervisors that are certified to run Red Hat Enterprise Linux, see [the Red Hat website](https://access.redhat.com/certified-hypervisors).
