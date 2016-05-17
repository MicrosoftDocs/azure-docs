<properties
	pageTitle="Create and upload a Red Hat Enterprise Linux VHD for use in Azure"
	description="Learn to create and upload an Azure virtual hard disk (VHD) that contains a Red Hat Linux operating system."
	services="virtual-machines-linux"
	documentationCenter=""
	authors="SuperScottz"
	manager="timlt"
	editor="tysonn"
    tags="azure-resource-manager,azure-service-management"/>

<tags
	ms.service="virtual-machines-linux"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-linux"
	ms.devlang="na"
	ms.topic="article"
	ms.date="02/17/2016"
	ms.author="mingzhan"/>


# Prepare a Red Hat-based virtual machine for Azure

In this article, you will learn how to prepare a Red Hat Enterprise Linux (RHEL) virtual machine for use in Azure. Versions of RHEL that are covered in this article are 6.7, 7.1 and 7.2. Hypervisors for preparation that are covered in this article are Hyper-V, Kernel-based Virtual Machine (KVM), and VMware. For more information on eligibility requirements for participating in Red Hat's Cloud Access program, see [Red Hat's Cloud Access website](http://www.redhat.com/en/technologies/cloud-computing/cloud-access) and [Running RHEL on Azure](https://access.redhat.com/articles/1989673).

[Prepare a RHEL 6.7 virtual machine from Hyper-V Manager](#rhel67hyperv)

[Prepare a RHEL 7.1/7.2 virtual machine from Hyper-V Manager](#rhel7xhyperv)

[Prepare a RHEL 6.7 virtual machine from KVM](#rhel67kvm)

[Prepare a RHEL 7.1/7.2 virtual machine from KVM](#rhel7xkvm)

[Prepare a RHEL 6.7 virtual machine from VMware](#rhel67vmware)

[Prepare a RHEL 7.1/7.2 virtual machine from VMware](#rhel7xvmware)

[Prepare a RHEL 7.1/7.2 virtual machine from a kickstart file](#rhel7xkickstart)


## Prepare a Red Hat-based virtual machine from Hyper-V Manager
### Prerequisites
This section assumes that you have already installed a RHEL image (from an ISO file that you obtained from Red Hat's website) to a virtual hard disk (VHD). For more details on how to use Hyper-V Manager to install an operating system image, see [Install the Hyper-V Role and Configure a Virtual Machine](http://technet.microsoft.com/library/hh846766.aspx).

**RHEL installation notes**

- Please see also [General Linux Installation Notes](virtual-machines-linux-create-upload-generic.md#general-linux-installation-notes) for more tips on preparing Linux for Azure.

- The newer VHDX format is not supported in Azure. You can convert the disk to VHD format by using Hyper-V Manager or the **convert-vhd** PowerShell cmdlet.

- VHDs must be created as "fixed"--dynamic VHDs are not supported.

- When you're installing the Linux system, we recommend that you use standard partitions rather than LVM (often the default for many installations). This will avoid LVM name conflicts with cloned VMs, particularly if an OS disk ever needs to be attached to another VM for troubleshooting. LVM or [RAID](virtual-machines-linux-configure-raid.md) may be used on data disks if preferred.

- Do not configure a swap partition on the OS disk. You can configure the Linux agent to create a swap file on the temporary resource disk. More information about this is available in the steps below.

- All of the VHDs must have sizes that are multiples of 1 MB.

- When you use **qemu-img** to convert disk images to VHD format, note that there is a known bug in qemu-img versions 2.2.1 or later. This bug results in an improperly formatted VHD. The issue is intended to be fixed in an upcoming release of qemu-img. For now, we recommend that you use qemu-img version 2.2.0 or earlier.

### <a id="rhel67hyperv"> </a>Prepare a RHEL 6.7 virtual machine from Hyper-V Manager###


1.	In Hyper-V Manager, select the virtual machine.

2.	Click **Connect** to open a console window for the virtual machine.

3.	Uninstall NetworkManager by running the following command:

        # sudo rpm -e --nodeps NetworkManager

    Note that if the package is not already installed, this command will fail with an error message. This is expected.

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

6.	Move (or remove) udev rules to avoid generating static rules for the Ethernet interface. These rules cause problems when you clone a virtual machine in Microsoft Azure or Hyper-V:

        # sudo mkdir -m 0700 /var/lib/waagent
        # sudo mv /lib/udev/rules.d/75-persistent-net-generator.rules /var/lib/waagent/
        # sudo mv /etc/udev/rules.d/70-persistent-net.rules /var/lib/waagent/

7.	Ensure that the network service will start at boot time by running the following command:

        # sudo chkconfig network on

8.	Register your Red Hat subscription to enable the installation of packages from the RHEL repository by running the following command:

        # sudo subscription-manager register --auto-attach --username=XXX --password=XXX

9.	The WALinuxAgent package `WALinuxAgent-<version>` has been pushed to the Red Hat extras repository. Enable the extras repository by running the following command:

        # subscription-manager repos --enable=rhel-6-server-extras-rpms

10.	Modify the kernel boot line in your grub configuration to include additional kernel parameters for Azure. To do this, open `/boot/grub/menu.lst` in a text editor and ensure that the default kernel includes the following parameters:

        console=ttyS0
        earlyprintk=ttyS0
        rootdelay=300
        numa=off

    This will also ensure that all console messages are sent to the first serial port, which can assist Azure support with debugging issues. This will disable NUMA due to a bug in the kernel version that is used by RHEL 6.

    In addition to the above action, we recommend that you remove the following parameters:

        rhgb quiet crashkernel=auto

    Graphical and quiet boot are not useful in a cloud environment where we want all the logs to be sent to the serial port.

    The crashkernel option can be left configured if desired, but note that this parameter will reduce the amount of available memory in the VM by 128 MB or more. This might be problematic on smaller VM sizes.

11.	Ensure that the SSH server is installed and configured to start at boot time. This is usually the default. Modify /etc/ssh/sshd_config to include the following line:

        ClientAliveInterval 180

12.	Install the Azure Linux Agent by running the following command:

        # sudo yum install WALinuxAgent
        # sudo chkconfig waagent on

    Note that installing the WALinuxAgent package will remove the NetworkManager and NetworkManager-gnome packages if they were not already removed as described in step 2.

13.	Do not create swap space on the OS disk.
The Azure Linux Agent can automatically configure swap space by using the local resource disk that is attached to the VM after the VM is provisioned on Azure. Note that the local resource disk is a temporary disk, and might be emptied when the VM is deprovisioned. After you install the Azure Linux Agent (see the previous step), modify the following parameters in /etc/waagent.conf appropriately:

        ResourceDisk.Format=y
        ResourceDisk.Filesystem=ext4
        ResourceDisk.MountPoint=/mnt/resource
        ResourceDisk.EnableSwap=y
        ResourceDisk.SwapSizeMB=2048    ## NOTE: set this to whatever you need it to be.

14.	Unregister the subscription (if necessary) by running the following command:

        # sudo subscription-manager unregister

15.	Run the following commands to deprovision the virtual machine and prepare it for provisioning on Azure:

        # sudo waagent -force -deprovision
        # export HISTSIZE=0
        # logout

16.	Click **Action > Shut Down** in Hyper-V Manager. Your Linux VHD is now ready to be uploaded to Azure.
 

### <a id="rhel7xhyperv"> </a>Prepare a RHEL 7.1/7.2 virtual machine from Hyper-V Manager###

1.  In Hyper-V Manager, select the virtual machine.

2.	Click **Connect** to open a console window for the virtual machine.

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

5.	Ensure that the network service will start at boot time by running the following command:

        # sudo chkconfig network on

6.	Register your Red Hat subscription to enable the installation of packages from the RHEL repository by running the following command:

        # sudo subscription-manager register --auto-attach --username=XXX --password=XXX

7.	Modify the kernel boot line in your grub configuration to include additional kernel parameters for Azure. To do this, open `/etc/default/grub` in a text editor and edit the **GRUB_CMDLINE_LINUX** parameter. For example:

        GRUB_CMDLINE_LINUX="rootdelay=300
        console=ttyS0
        earlyprintk=ttyS0"

    This will also ensure that all console messages are sent to the first serial port, which can assist Azure support with debugging issues. In addition to the above action, we recommend that you remove the following parameters:

        rhgb quiet crashkernel=auto

	Graphical and quiet boot are not useful in a cloud environment where we want all the logs to be sent to the serial port.
    The crashkernel option can be left configured if desired, but note that this parameter will reduce the amount of available memory in the VM by 128 MB or more. This might be problematic on smaller VM sizes.

8.	After you are done editing `/etc/default/grub`, run the following command to rebuild the grub configuration:

        # sudo grub2-mkconfig -o /boot/grub2/grub.cfg

9.	Ensure that the SSH server is installed and configured to start at boot time. This is usually the default. Modify `/etc/ssh/sshd_config` to include the following line:

        ClientAliveInterval 180

10.	The WALinuxAgent package `WALinuxAgent-<version>` has been pushed to the Red Hat extras repository. Enable the extras repository by running the following command:

        # subscription-manager repos --enable=rhel-7-server-extras-rpms

11.	Install the Azure Linux Agent by running the following command:

        # sudo yum install WALinuxAgent
        # sudo systemctl enable waagent.service

12.	Do not create swap space on the OS disk. The Azure Linux Agent can automatically configure swap space by using the local resource disk that is attached to the VM after the VM is provisioned on Azure. Note that the local resource disk is a temporary disk, and might be emptied when the VM is deprovisioned. After you install the Azure Linux Agent (see the previous step), modify the following parameters in `/etc/waagent.conf` appropriately:

        ResourceDisk.Format=y
        ResourceDisk.Filesystem=ext4
        ResourceDisk.MountPoint=/mnt/resource
        ResourceDisk.EnableSwap=y
        ResourceDisk.SwapSizeMB=2048    ## NOTE: set this to whatever you need it to be.

13.	If you want to unregister the subscription, run the following command:

        # sudo subscription-manager unregister

14.	Run the following commands to deprovision the virtual machine and prepare it for provisioning on Azure:

        # sudo waagent -force -deprovision
        # export HISTSIZE=0
        # logout

15.	Click **Action > Shut Down** in Hyper-V Manager. Your Linux VHD is now ready to be uploaded to Azure.
 


## Prepare a Red Hat-based virtual machine from KVM

### <a id="rhel67kvm"> </a>Prepare a RHEL 6.7 virtual machine from KVM###


1.	Download the KVM image of RHEL 6.7 from Red Hat's website.

2.	Set a root password.

    Generate an encrypted password and copy the output of the command:

        # openssl passwd -1 changeme

    Set a root password with guestfish:

        # guestfish --rw -a <image-name>
        ><fs> run
        ><fs> list-filesystems
        ><fs> mount /dev/sda1 /
        ><fs> vi /etc/shadow
        ><fs> exit

	Change the second field of the root user from “!!” to the encrypted password.

3.	Create a virtual machine in KVM from the qcow2 image, set the disk type to **qcow2**, and set the virtual network interface device model to **virtio**. Then start the virtual machine and sign in as root.

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

6.	Move (or remove) the udev rules to avoid generating static rules for the Ethernet interface. These rules cause problems when you clone a virtual machine in Microsoft Azure or Hyper-V:

        # mkdir -m 0700 /var/lib/waagent
        # mv /lib/udev/rules.d/75-persistent-net-generator.rules /var/lib/waagent/
        # mv /etc/udev/rules.d/70-persistent-net.rules /var/lib/waagent/

7.	Ensure that the network service will start at boot time by running the following command:

        # chkconfig network on

8.	Register your Red Hat subscription to enable the installation of packages from the RHEL repository by running the following command:

        # subscription-manager register --auto-attach --username=XXX --password=XXX

9.	Modify the kernel boot line in your grub configuration to include additional kernel parameters for Azure. To do this, open `/boot/grub/menu.lst` in a text editor and ensure that the default kernel includes the following parameters:

        console=ttyS0 earlyprintk=ttyS0 rootdelay=300 numa=off

    This will also ensure that all console messages are sent to the first serial port, which can assist Azure support with debugging issues. This will disable NUMA due to a bug in the kernel version that is used by RHEL 6.

    In addition to the above action, we recommend that you remove the following parameters:

        rhgb quiet crashkernel=auto

    Graphical and quiet boot are not useful in a cloud environment where we want all the logs to be sent to the serial port.
    The crashkernel option may be left configured if desired, but note that this parameter will reduce the amount of available memory in the VM by 128 MB or more. This might be problematic on smaller VM sizes.

10. Add Hyper-V modules into initramfs:  

    Edit `/etc/dracut.conf` and add content:
    add_drivers+=”hv_vmbus hv_netvsc hv_storvsc”

    Rebuild initramfs:
        # dracut –f -v

11.	Uninstall cloud-init:

        # yum remove cloud-init

12.	Ensure that the SSH server is installed and configured to start at boot time:

        # chkconfig sshd on

    Modify /etc/ssh/sshd_config to include the following lines:

        PasswordAuthentication yes
        ClientAliveInterval 180

    Restart sshd:

		# service sshd restart

13.	The WALinuxAgent package `WALinuxAgent-<version>` has been pushed to the Red Hat extras repository. Enable the extras repository by running the following command:

        # subscription-manager repos --enable=rhel-6-server-extras-rpms

14.	Install the Azure Linux Agent by running the following command:

        # yum install WALinuxAgent
        # chkconfig waagent on

15.	The Azure Linux Agent can automatically configure swap space by using the local resource disk that is attached to the VM after the VM is provisioned on Azure. Note that the local resource disk is a temporary disk, and might be emptied when the VM is deprovisioned. After you install the Azure Linux Agent (see the previous step), modify the following parameters in **/etc/waagent.conf** appropriately:

        ResourceDisk.Format=y
        ResourceDisk.Filesystem=ext4
        ResourceDisk.MountPoint=/mnt/resource
        ResourceDisk.EnableSwap=y
        ResourceDisk.SwapSizeMB=2048    ## NOTE: set this to whatever you need it to be.

16.	Unregister the subscription (if necessary) by running the following command:

        # subscription-manager unregister

17.	Run the following commands to deprovision the virtual machine and prepare it for provisioning on Azure:

        # waagent -force -deprovision
        # export HISTSIZE=0
        # logout

18.	Shut down the VM in KVM.

19.	Convert the qcow2 image to VHD format.
    First convert the image to raw format:

         # qemu-img convert -f qcow2 –O raw rhel-6.7.qcow2 rhel-6.7.raw
    Make sure that the size of the raw image is aligned with 1 MB. Otherwise, round up the size to align with 1 MB:
         # MB=$((1024*1024))
         # size=$(qemu-img info -f raw --output json "rhel-6.7.raw" | \
                  gawk 'match($0, /"virtual-size": ([0-9]+),/, val) {print val[1]}')
         # rounded_size=$((($size/$MB + 1)*$MB))

         # qemu-img resize rhel-6.7.raw $rounded_size

    Convert the raw disk to a fixed-sized VHD:

         # qemu-img convert -f raw -o subformat=fixed -O vpc rhel-6.7.raw rhel-6.7.vhd


### <a id="rhel7xkvm"> </a>Prepare a RHEL 7.1/7.2 virtual machine from KVM###


1.	Download the KVM image of RHEL 7.1 (or 7.2) from the Red Hat website. We will use RHEL 7.1 as the example here.

2.	Set a root password.

    Generate an encrypted password, and copy the output of the command:

        # openssl passwd -1 changeme

    Set a root password with guestfish.

        # guestfish --rw -a <image-name>
        ><fs> run
        ><fs> list-filesystems
        ><fs> mount /dev/sda1 /
        ><fs> vi /etc/shadow
        ><fs> exit

    Change the second field of root user from “!!” to the encrypted password.

3.	Create a virtual machine in KVM from the qcow2 image, set the disk type to **qcow2**, and set the virtual network interface device model to **virtio**. Then start the virtual machine and sign in as root.

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

6.	Ensure that the network service will start at boot time by running the following command:

        # chkconfig network on

7.	Register your Red Hat subscription to enable installation of packages from the RHEL repository by running the following command:

        # subscription-manager register --auto-attach --username=XXX --password=XXX

8.	Modify the kernel boot line in your grub configuration to include additional kernel parameters for Azure. To do this, open `/etc/default/grub` in a text editor and edit the **GRUB_CMDLINE_LINUX** parameter. For example:

        GRUB_CMDLINE_LINUX="rootdelay=300
        console=ttyS0
        earlyprintk=ttyS0"

    This will also ensure that all console messages are sent to the first serial port, which can assist Azure support with debugging issues. In addition to the above action, we recommend that you remove the following parameters:

        rhgb quiet crashkernel=auto

    Graphical and quiet boot are not useful in a cloud environment where we want all the logs to be sent to the serial port.
    The crashkernel option can be left configured if desired, but note that this parameter will reduce the amount of available memory in the VM by 128 MB or more. This might be problematic on smaller VM sizes.

9.	After you are done editing `/etc/default/grub`, run the following command to rebuild the grub configuration:

        # grub2-mkconfig -o /boot/grub2/grub.cfg

10.	Add Hyper-V modules into initramfs:

    Edit `/etc/dracut.conf` and add content:

        add_drivers+=”hv_vmbus hv_netvsc hv_storvsc”

    Rebuild initramfs:

        # dracut –f -v

11.	Uninstall cloud-init:

        # yum remove cloud-init

12.	Ensure that the SSH server is installed and configured to start at boot time:

        # systemctl enable sshd

    Modify /etc/ssh/sshd_config to include the following lines:

        PasswordAuthentication yes
        ClientAliveInterval 180

    Restart sshd:

        systemctl restart sshd

13.	The WALinuxAgent package `WALinuxAgent-<version>` has been pushed to the Red Hat extras repository. Enable the extras repository by running the following command:

        # subscription-manager repos --enable=rhel-7-server-extras-rpms

14.	Install the Azure Linux Agent by running the following command:

        # yum install WALinuxAgent

    Enable the waagent service:

        # systemctl enable waagent.service

15.	Do not create swap space on the OS disk. The Azure Linux Agent can automatically configure swap space by using the local resource disk that is attached to the VM after the VM is provisioned on Azure. Note that the local resource disk is a temporary disk, and might be emptied when the VM is deprovisioned. After you install the Azure Linux Agent (see the previous step), modify the following parameters in `/etc/waagent.conf` appropriately:

        ResourceDisk.Format=y
        ResourceDisk.Filesystem=ext4
        ResourceDisk.MountPoint=/mnt/resource
        ResourceDisk.EnableSwap=y
        ResourceDisk.SwapSizeMB=2048    ## NOTE: set this to whatever you need it to be.

16.	Unregister the subscription (if necessary) by running the following command:

        # subscription-manager unregister

17.	Run the following commands to deprovision the virtual machine and prepare it for provisioning on Azure:

        # sudo waagent -force -deprovision
        # export HISTSIZE=0
        # logout

18.	Shut down the virtual machine in KVM.

19.	Convert the qcow2 image to VHD format.

    First convert the image to raw format:

         # qemu-img convert -f qcow2 –O raw rhel-7.1.qcow2 rhel-7.1.raw

    Make sure that the size of the raw image is aligned with 1 MB. Otherwise, round up the size to align with 1 MB:

         # MB=$((1024*1024))
         # size=$(qemu-img info -f raw --output json "rhel-7.1.raw" | \
                  gawk 'match($0, /"virtual-size": ([0-9]+),/, val) {print val[1]}')
         # rounded_size=$((($size/$MB + 1)*$MB))

         # qemu-img resize rhel-7.1.raw $rounded_size

    Convert the raw disk to a fixed-sized VHD:

         # qemu-img convert -f raw -o subformat=fixed -O vpc rhel-7.1.raw rhel-7.1.vhd


## Prepare a Red Hat-based virtual machine from VMware
### Prerequisites
This section assumes that you have already installed a RHEL virtual machine in VMware. For details on how to install an operating system in VMware, see [VMware Guest Operating System Installation Guide](http://partnerweb.vmware.com/GOSIG/home.html).

- When you install the Linux operating system, we recommend that you use standard partitions rather than LVM (often the default for many installations). This will avoid LVM name conflicts with cloned VMs, particularly if an OS disk ever needs to be attached to another VM for troubleshooting. LVM or RAID can be used on data disks if preferred.

- Do not configure a swap partition on the OS disk. You can configure the Linux agent to create a swap file on the temporary resource disk. You can find more information about this in the steps below.

- When you create the virtual hard disk, select **Store virtual disk as a single file**.



### <a id="rhel67vmware"> </a>Prepare a RHEL 6.7 virtual machine from VMware###

1.	Uninstall NetworkManager by running the following command:

         # sudo rpm -e --nodeps NetworkManager

    Note that if the package is not already installed, this command will fail with an error message. This is expected.

2.	Create a file named **network** in the /etc/sysconfig/ directory that contains the following text:

        NETWORKING=yes
        HOSTNAME=localhost.localdomain

3.	Create a file named **ifcfg-eth0** in the /etc/sysconfig/network-scripts/ directory that contains the following text:

        DEVICE=eth0
        ONBOOT=yes
        BOOTPROTO=dhcp
        TYPE=Ethernet
        USERCTL=no
        PEERDNS=yes
        IPV6INIT=no

4.	Move (or remove) the udev rules to avoid generating static rules for the Ethernet interface. These rules cause problems when you clone a virtual machine in Microsoft Azure or Hyper-V:

        # sudo mkdir -m 0700 /var/lib/waagent
        # sudo mv /lib/udev/rules.d/75-persistent-net-generator.rules /var/lib/waagent/
        # sudo mv /etc/udev/rules.d/70-persistent-net.rules /var/lib/waagent/

5.	Ensure that the network service will start at boot time by running the following command:

        # sudo chkconfig network on

6.	Register your Red Hat subscription to enable the installation of packages from the RHEL repository by running the following command:

        # sudo subscription-manager register --auto-attach --username=XXX --password=XXX

7.	The WALinuxAgent package `WALinuxAgent-<version>` has been pushed to the Red Hat extras repository. Enable the extras repository by running the following command:

        # subscription-manager repos --enable=rhel-6-server-extras-rpms

8.	Modify the kernel boot line in your grub configuration to include additional kernel parameters for Azure. To do this, open "/boot/grub/menu.lst" in a text editor and ensure that the default kernel includes the following parameters:

        console=ttyS0
        earlyprintk=ttyS0
        rootdelay=300
        numa=off

    This will also ensure that all console messages are sent to the first serial port, which can assist Azure support with debugging issues. This will disable NUMA due to a bug in the kernel version that is used by RHEL 6.
    In addition to the above action, we recommend that you remove the following parameters:

        rhgb quiet crashkernel=auto

    Graphical and quiet boot are not useful in a cloud environment where we want all the logs to be sent to the serial port.
    The crashkernel option can be left configured if desired, but note that this parameter will reduce the amount of available memory in the VM by 128 MB or more. This might be problematic on smaller VM sizes.

9.	Add Hyper-V modules into initramfs:

	    Edit `/etc/dracut.conf` and add content:

	        add_drivers+=”hv_vmbus hv_netvsc hv_storvsc”

	    Rebuild initramfs:

	        # dracut –f -v

10.	Ensure that the SSH server is installed and configured to start at boot time. This is usually the default. Modify `/etc/ssh/sshd_config` to include the following line:

        ClientAliveInterval 180

11.	Install the Azure Linux Agent by running the following command:

        # sudo yum install WALinuxAgent
        # sudo chkconfig waagent on

12.	Do not create swap space on the OS disk:

    The Azure Linux Agent can automatically configure swap space by using the local resource disk that is attached to the VM after the VM is provisioned on Azure. Note that the local resource disk is a temporary disk, and might be emptied when the VM is deprovisioned. After you install the Azure Linux Agent (see the previous step), modify the following parameters in `/etc/waagent.conf` appropriately:

        ResourceDisk.Format=y
        ResourceDisk.Filesystem=ext4
        ResourceDisk.MountPoint=/mnt/resource
        ResourceDisk.EnableSwap=y
        ResourceDisk.SwapSizeMB=2048    ## NOTE: set this to whatever you need it to be.

13.	Unregister the subscription (if necessary) by running the following command:

        # sudo subscription-manager unregister

14.	Run the following commands to deprovision the virtual machine and prepare it for provisioning on Azure:

        # sudo waagent -force -deprovision
        # export HISTSIZE=0
        # logout

15.	Shut down the VM, and convert the VMDK file to a .vhd file.

    First convert the image to raw format:

        # qemu-img convert -f vmdk –O raw rhel-6.7.vmdk rhel-6.7.raw

    Make sure that the size of the raw image is aligned with 1 MB. Otherwise, round up the size to align with 1 MB:

        # MB=$((1024*1024))
        # size=$(qemu-img info -f raw --output json "rhel-6.7.raw" | \
                gawk 'match($0, /"virtual-size": ([0-9]+),/, val) {print val[1]}')
        # rounded_size=$((($size/$MB + 1)*$MB))
        # qemu-img resize rhel-6.7.raw $rounded_size

    Convert the raw disk to a fixed-sized VHD:

        # qemu-img convert -f raw -o subformat=fixed -O vpc rhel-6.7.raw rhel-6.7.vhd


### <a id="rhel7xvmware"> </a>Prepare a RHEL 7.1/7.2 virtual machine from VMware###

1.	Create a file named **network** in the /etc/sysconfig/ directory that contains the following text:

        NETWORKING=yes
        HOSTNAME=localhost.localdomain

2.	Create a file named **ifcfg-eth0** in the /etc/sysconfig/network-scripts/ directory that contains the following text:

        DEVICE=eth0
        ONBOOT=yes
        BOOTPROTO=dhcp
        TYPE=Ethernet
        USERCTL=no
        PEERDNS=yes
        IPV6INIT=no

3.	Ensure that the network service will start at boot time by running the following command:

        # sudo chkconfig network on

4.	Register your Red Hat subscription to enable the installation of packages from the RHEL repository by running the following command:

        # sudo subscription-manager register --auto-attach --username=XXX --password=XXX

5.	Modify the kernel boot line in your grub configuration to include additional kernel parameters for Azure. To do this, open `/etc/default/grub` in a text editor and edit the **GRUB_CMDLINE_LINUX** parameter. For example:

        GRUB_CMDLINE_LINUX="rootdelay=300
        console=ttyS0
        earlyprintk=ttyS0"

    This will also ensure that all console messages are sent to the first serial port, which can assist Azure support with debugging issues. In addition to the above action, we recommend that you remove the following parameters:

        rhgb quiet crashkernel=auto

    Graphical and quiet boot are not useful in a cloud environment where we want all the logs to be sent to the serial port.
    The crashkernel option can be left configured if desired, but note that this parameter will reduce the amount of available memory in the VM by 128 MB or more. This might be problematic on smaller VM sizes.

6.	After you are done editing `/etc/default/grub`, run the following command to rebuild the grub configuration:

         # sudo grub2-mkconfig -o /boot/grub2/grub.cfg

7.	Add Hyper-V modules into initramfs:

    Edit `/etc/dracut.conf`, add content:

        add_drivers+=”hv_vmbus hv_netvsc hv_storvsc”

    Rebuild initramfs:

        # dracut –f -v

8.	Ensure that the SSH server is installed and configured to start at boot time. This is usually the default. Modify `/etc/ssh/sshd_config` to include the following line:

        ClientAliveInterval 180

9.	The WALinuxAgent package `WALinuxAgent-<version>` has been pushed to the Red Hat extras repository. Enable the extras repository by running the following command:

        # subscription-manager repos --enable=rhel-7-server-extras-rpms

10.	Install the Azure Linux Agent by running the following command:

        # sudo yum install WALinuxAgent
        # sudo systemctl enable waagent.service

11.	Do not create swap space on the OS disk. The Azure Linux Agent can automatically configure swap space by using the local resource disk that is attached to the VM after the VM is provisioned on Azure. Note that the local resource disk is a temporary disk, and might be emptied when the VM is deprovisioned. After you install the Azure Linux Agent (see the previous step), modify the following parameters in `/etc/waagent.conf` appropriately:

        ResourceDisk.Format=y
        ResourceDisk.Filesystem=ext4
        ResourceDisk.MountPoint=/mnt/resource
        ResourceDisk.EnableSwap=y
        ResourceDisk.SwapSizeMB=2048    ## NOTE: set this to whatever you need it to be.

12.	If you want to unregister the subscription, run the following command:

        # sudo subscription-manager unregister

13.	Run the following commands to deprovision the virtual machine and prepare it for provisioning on Azure:

        # sudo waagent -force -deprovision
        # export HISTSIZE=0
        # logout

14.	Shut down the VM, and convert the VMDK file to VHD format.

    First convert the image to raw format:

        # qemu-img convert -f vmdk –O raw rhel-7.1.vmdk rhel-7.1.raw

    Make sure that the size of the raw image is aligned with 1 MB. Otherwise, round up the size to align with 1 MB:

        # MB=$((1024*1024))
        # size=$(qemu-img info -f raw --output json "rhel-7.1.raw" | \
                 gawk 'match($0, /"virtual-size": ([0-9]+),/, val) {print val[1]}')
        # rounded_size=$((($size/$MB + 1)*$MB))
        # qemu-img resize rhel-7.1.raw $rounded_size

    Convert the raw disk to a fixed-sized VHD:

        # qemu-img convert -f raw -o subformat=fixed -O vpc rhel-7.1.raw rhel-7.1.vhd


## Prepare a Red Hat-based virtual machine from an ISO by using a kickstart file automatically


### <a id="rhel7xkickstart"> </a>Prepare a RHEL 7.1/7.2 virtual machine from a kickstart file###


1.	Create a kickstart file with the content below, and save the file. For details about kickstart installation, see the [Kickstart Installation Guide](https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux/7/html/Installation_Guide/chap-kickstart-installations.html).



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
        NM_CONTROLLED=yes
        EOF

        # Deprovision and prepare for Azure
        waagent -force -deprovision

        %end

2.	Place the kickstart file in a place that is accessible from the installation system.

3.	In Hyper-V Manager, create a new VM. On the **Connect Virtual Hard Disk** page, select **Attach a virtual hard disk later**, and complete the New Virtual Machine Wizard.

4.	Open the VM settings:

    a.	Attach a new virtual hard disk to the VM. Make sure to select **VHD Format** and **Fixed Size**.

    b.	Attach the installation ISO to the DVD drive.

    c.	Set the BIOS to boot from CD.

5.	Start the VM. When the installation guide appears, press **Tab** to configure the boot options.

6.	Enter `inst.ks=<the location of the kickstart file>` at the end of the boot options, and press **Enter**.

7.	Wait for the installation to finish. When it’s finished, the VM will be shut down automatically. Your Linux VHD is now ready to be uploaded to Azure.

## Known issues
There are known issues when you are using RHEL 7.1 in Hyper-V and Azure.

### Disk I/O freeze

This issue might occur during frequent storage disk I/O activities with RHEL 7.1 in Hyper-V and Azure.   

Repro rate:

This issue is intermittent. However, it occurs more frequently during frequent disk I/O operations in Hyper-V and Azure.   


[AZURE.NOTE] This known issue has already been addressed by Red Hat. To install the associated fixes, run the following command:

    # sudo yum update

### The Hyper-V driver could not be included in the initial RAM disk when using a non-Hyper-V hypervisor

In some cases, Linux installers might not include the drivers for Hyper-V in the initial RAM disk (initrd or initramfs) unless it detects that it is running in a Hyper-V environment.

When you're using a different virtualization system (i.e. Virtualbox, Xen, etc.) to prepare your Linux image, you might need to rebuild initrd to ensure that at least the hv_vmbus and hv_storvsc kernel modules are available on the initial RAM disk. This is a known issue at least on systems based on the upstream Red Hat distribution.

To resolve this issue, you need to add Hyper-V modules into initramfs and rebuild it:

Edit `/etc/dracut.conf` and add content:

        add_drivers+=”hv_vmbus hv_netvsc hv_storvsc”

Rebuild initramfs:

        # dracut –f -v

For more details, see the information about [rebuilding initramfs](https://access.redhat.com/solutions/1958).

## Next steps
You're now ready to use your Red Hat Enterprise Linux virtual hard disk to create new virtual machines in Azure. If this is the first time that you're uploading the .vhd file to Azure, see steps 2 and 3 in [Creating and uploading a virtual hard disk that contains the Linux operating system](virtual-machines-linux-classic-create-upload-vhd.md).

For more details about the hypervisors that are certified to run Red Hat Enterprise Linux, see [the Red Hat website](https://access.redhat.com/certified-hypervisors).
