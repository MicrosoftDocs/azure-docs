---
title: Create and upload a CentOS-based Linux VHD
description: Learn to create and upload an Azure virtual hard disk (VHD) that contains a CentOS-based Linux operating system.
author: srijang
ms.service: virtual-machines
ms.collection: linux
ms.topic: how-to
ms.date: 12/14/2022
ms.author: srijangupta
ms.reviewer: mattmcinnes
---
# Prepare a CentOS-based virtual machine for Azure

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Flexible scale sets 

Learn to create and upload an Azure virtual hard disk (VHD) that contains a CentOS-based Linux operating system.

* [Prepare a CentOS 6.x virtual machine for Azure](#centos-6x)
* [Prepare a CentOS 7.0+ virtual machine for Azure](#centos-70)


## Prerequisites

This article assumes that you've already installed a CentOS (or similar derivative) Linux operating system to a virtual hard disk. Multiple tools exist to create .vhd files, for example a virtualization solution such as Hyper-V. For instructions, see [Install the Hyper-V Role and Configure a Virtual Machine](/previous-versions/windows/it-pro/windows-server-2012-R2-and-2012/hh846766(v=ws.11)).

**CentOS installation notes**

* For more tips on preparing Linux for Azure, see [General Linux Installation Notes](create-upload-generic.md#general-linux-installation-notes).
* The VHDX format isn't supported in Azure, only **fixed VHD**.  You can convert the disk to VHD format using Hyper-V Manager or the convert-vhd cmdlet. If you're using VirtualBox, this means selecting **Fixed size** as opposed to the default dynamically allocated when creating the disk.
* The vfat kernel module must be enabled in the kernel
* When installing the Linux system it's **recommended** that you use standard partitions rather than LVM (often the default for many installations). This avoids LVM name conflicts with cloned VMs, particularly if an OS disk ever needs to be attached to another identical VM for troubleshooting. [LVM](/previous-versions/azure/virtual-machines/linux/configure-lvm) or [RAID](/previous-versions/azure/virtual-machines/linux/configure-raid) may be used on data disks.
* **Kernel support for mounting UDF file systems is necessary.** At first boot on Azure the provisioning configuration is passed to the Linux VM by using UDF-formatted media that is attached to the guest. The Azure Linux agent or cloud-init  must mount the UDF file system to read its configuration and provision the VM.
* Linux kernel versions below 2.6.37 don't support NUMA on Hyper-V with larger VM sizes. This issue primarily impacts older distributions using the upstream Centos 2.6.32 kernel, and was fixed in Centos 6.6 (kernel-2.6.32-504). Systems running custom kernels older than 2.6.37, or RHEL-based kernels older than 2.6.32-504 must set the boot parameter `numa=off` on the kernel command-line in grub.conf. For more information, see Red Hat [KB 436883](https://access.redhat.com/solutions/436883).
* Don't configure a swap partition on the OS disk.
* All VHDs on Azure must have a virtual size aligned to 1 MB. When converting from a raw disk to VHD, you must ensure that the raw disk size is a multiple of 1 MB before conversion. See [Linux Installation Notes](create-upload-generic.md#general-linux-installation-notes) for more information.

> [!NOTE]
> **(_Cloud-init >= 21.2 removes the udf requirement._)** however without the udf module enabled the cdrom will not mount during provisioning preventing custom data from being applied. A workaround for this would be to apply custom data using user data however, unlike custom data user data isn't encrypted. https://cloudinit.readthedocs.io/en/latest/topics/format.html


## CentOS 6.x

> [!IMPORTANT]
>Please note that CentOS 6 has reached its End Of Life (EOL) and is no longer supported by the CentOS community. This means that no further updates or security patches will be released for this version, leaving it vulnerable to potential security risks. We strongly recommend upgrading to a more recent version of CentOS to ensure the safety and stability of your system. Please consult with your IT department or system administrator for further assistance.

1. In Hyper-V Manager, select the virtual machine.

2. Click **Connect** to open a console window for the virtual machine.

3. In CentOS 6, NetworkManager can interfere with the Azure Linux agent. Uninstall this package by running the following command:

    ```bash
    sudo rpm -e --nodeps NetworkManager
    ```

4. Create or edit the file `/etc/sysconfig/network` and add the following text:

    ```output
    NETWORKING=yes
    HOSTNAME=localhost.localdomain
    ```

5. Create or edit the file `/etc/sysconfig/network-scripts/ifcfg-eth0` and add the following text:

    ```output
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

7. Ensure the network service starts at boot time by running the following command:

    ```bash
    sudo chkconfig network on
    ```

8. If you would like to use the OpenLogic mirrors that are hosted within the Azure datacenters, then replace the `/etc/yum.repos.d/CentOS-Base.repo` file with the following repositories.  This will also add the **[openlogic]** repository that includes extra packages such as the Azure Linux agent:

   ```output
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
    > The rest of this guide will assume you're using at least the `[openlogic]` repo, which will be used to install the Azure Linux agent below.

9. Add the following line to /etc/yum.conf:

	```output
	http_caching=packages
	```

10. Run the following command to clear the current yum metadata and update the system with the latest packages:

	```bash
	sudo yum clean all
	```

    Unless you're creating an image for an older version of CentOS, it's recommended to update all the packages to the latest:

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

    Alternatively, you can follow the manual installation instructions on the [LIS download page](https://www.microsoft.com/download/details.aspx?id=55106) to install the RPM onto your VM.

12. Install the Azure Linux Agent and dependencies. Start and enable waagent service:

	```bash
	sudo yum install python-pyasn1 WALinuxAgent
	sudo service waagent start
	sudo chkconfig waagent on
	```


    The WALinuxAgent package removes the NetworkManager and NetworkManager-gnome packages if they were not already removed as described in step 3.

13. Modify the kernel boot line in your grub configuration to include additional kernel parameters for Azure. To do this, open `/boot/grub/menu.lst` in a text editor and ensure that the default kernel includes the following parameters:

	```output
	console=ttyS0 earlyprintk=ttyS0 rootdelay=300
	```

    This will also ensure all console messages are sent to the first serial port, which can assist Azure support with debugging issues.

    In addition to the above, it's recommended to *remove* the following parameters:

	```output
	rhgb quiet crashkernel=auto
	```

    Graphical and `quiet boot` aren't useful in a cloud environment where we want all the logs to be sent to the serial port.  The `crashkernel` option may be left configured if desired, but note that this parameter will reduce the amount of available memory in the VM by 128 MB or more, which may be problematic on the smaller VM sizes.

    > [!Important]
    > CentOS 6.5 and earlier must also set the kernel parameter `numa=off`. See Red Hat [KB 436883](https://access.redhat.com/solutions/436883).

14. Ensure that the SSH server is installed and configured to start at boot time.  This is usually the default.

15. Don't create swap space on the OS disk.

    The Azure Linux Agent can automatically configure swap space using the local resource disk that is attached to the VM after provisioning on Azure. The local resource disk is a *temporary* disk, and might be emptied when the VM is deprovisioned. After installing the Azure Linux Agent (see previous step), modify the following parameters in `/etc/waagent.conf` appropriately:

	```output
	ResourceDisk.Format=y
	ResourceDisk.Filesystem=ext4
	ResourceDisk.MountPoint=/mnt/resource
	ResourceDisk.EnableSwap=y
	ResourceDisk.SwapSizeMB=2048 ## NOTE: set this to whatever you need it to be.
	```

16. Run the following commands to deprovision the virtual machine and prepare it for provisioning on Azure:

    ```bash
    sudo waagent -force -deprovision+user
    sudo export HISTSIZE=0
    ```
> [!NOTE]
> If you are migrating a specific virtual machine and do not wish to create a generalized image, skip the deprovision step.


17. Click **Action -> Shut Down** in Hyper-V Manager. Your Linux VHD is now ready to be [uploaded to Azure](./upload-vhd.md#option-1-upload-a-vhd).


## CentOS 7.0+

**Changes in CentOS 7 (and similar derivatives)**

Preparing a CentOS 7 virtual machine for Azure is similar to CentOS 6, however there are several important differences worth noting:

* The NetworkManager package no longer conflicts with the Azure Linux agent. This package is installed by default and we recommend that it'sn't removed.
* GRUB2 is now used as the default bootloader, so the procedure for editing kernel parameters has changed (see below).
* XFS is now the default file system. The ext4 file system can still be used if desired.
* Since CentOS 8 Stream and newer no longer include `network.service` by default, you need to install it manually:

	```bash
	sudo yum install network-scripts
	sudo systemctl enable network.service
	```

**Configuration Steps**

1. In Hyper-V Manager, select the virtual machine.

2. Click **Connect** to open a console window for the virtual machine.

3. Create or edit the file `/etc/sysconfig/network` and add the following text:

	```output
	NETWORKING=yes
	HOSTNAME=localhost.localdomain
	```

4. Create or edit the file `/etc/sysconfig/network-scripts/ifcfg-eth0` and add the following text:

	```output
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

   ```output
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
   > The rest of this guide will assume you're using at least the `[openlogic]` repo, which will be used to install the Azure Linux agent below.

7. Run the following command to clear the current yum metadata and install any updates:

	```bash
	sudo yum clean all
	```

    Unless you're creating an image for an older version of CentOS, it's recommended to update all the packages to the latest:

	```bash
	sudo yum -y update
	```

    A reboot maybe required after running this command.

8. Modify the kernel boot line in your grub configuration to include additional kernel parameters for Azure. To do this, open `/etc/default/grub` in a text editor and edit the `GRUB_CMDLINE_LINUX` parameter, for example:

	```output
	GRUB_CMDLINE_LINUX="rootdelay=300 console=ttyS0 earlyprintk=ttyS0 net.ifnames=0"
	```

   This will also ensure all console messages are sent to the first serial port, which can assist Azure support with debugging issues. It also turns off the new CentOS 7 naming conventions for NICs. In addition to the above, it's recommended to *remove* the following parameters:

	```output
	rhgb quiet crashkernel=auto
	```

    Graphical and quiet boot isn't useful in a cloud environment where we want all the logs to be sent to the serial port. The `crashkernel` option may be left configured if desired, but note that this parameter will reduce the amount of available memory in the VM by 128 MB or more, which may be problematic on the smaller VM sizes.

9. Once you're done editing `/etc/default/grub` per above, run the following command to rebuild the grub configuration:

	```bash
	sudo grub2-mkconfig -o /boot/grub2/grub.cfg
	```

> [!NOTE]
> If uploading an UEFI enabled VM, the command to update grub is `grub2-mkconfig -o /boot/efi/EFI/centos/grub.cfg`.  Also, the vfat kernel module must be enabled in the kernel otherwise provisioning will fail.
>
> Make sure the **'udf'** module is enable. Blocklisting or removing it will cause a provisioning failure. **(_Cloud-init >= 21.2 removes the udf requirement. Read top of document for more detail)**


10. If building the image from **VMware, VirtualBox or KVM:** Ensure the Hyper-V drivers are included in the initramfs:

    Edit `/etc/dracut.conf`, add content:

	```output
	add_drivers+=" hv_vmbus hv_netvsc hv_storvsc "
	```

    Rebuild the initramfs:

	```bash
	sudo dracut -f -v
	```

11. Install the Azure Linux Agent and dependencies for Azure VM Extensions:

	```bash
	sudo yum install python-pyasn1 WALinuxAgent
	sudo systemctl enable waagent
	```

12. Install cloud-init to handle the provisioning

    ```bash
    sudo yum install -y cloud-init cloud-utils-growpart gdisk hyperv-daemons
    ```
    1. Configure waagent for cloud-init
    ```bash
    sudo sed -i 's/Provisioning.Agent=auto/Provisioning.Agent=auto/g' /etc/waagent.conf
    sudo sed -i 's/ResourceDisk.Format=y/ResourceDisk.Format=n/g' /etc/waagent.conf
    sudo sed -i 's/ResourceDisk.EnableSwap=y/ResourceDisk.EnableSwap=n/g' /etc/waagent.conf
    ```
    ```bash    
    sudo echo "Adding mounts and disk_setup to init stage"
    sudo sed -i '/ - mounts/d' /etc/cloud/cloud.cfg
    sudo sed -i '/ - disk_setup/d' /etc/cloud/cloud.cfg
    sudo sed -i '/cloud_init_modules/a\\ - mounts' /etc/cloud/cloud.cfg
    sudo sed -i '/cloud_init_modules/a\\ - disk_setup' /etc/cloud/cloud.cfg
    ```
    ```bash
    sudo echo "Allow only Azure datasource, disable fetching network setting via IMDS"
    sudo cat > /etc/cloud/cloud.cfg.d/91-azure_datasource.cfg <<EOF
    datasource_list: [ Azure ]
    datasource:
        Azure:
            apply_network_config: False
    EOF

    if [[ -f /mnt/resource/swapfile ]]; then
    echo Removing swapfile - RHEL uses a swapfile by default
    swapoff /mnt/resource/swapfile
    rm /mnt/resource/swapfile -f
    fi

    echo "Add console log file"
    cat >> /etc/cloud/cloud.cfg.d/05_logging.cfg <<EOF

    # This tells cloud-init to redirect its stdout and stderr to
    # 'tee -a /var/log/cloud-init-output.log' so the user can see output
    # there without needing to look on the console.
    output: {all: '| tee -a /var/log/cloud-init-output.log'}
    EOF
    ```


13. Swap configuration
    
    Don't create swap space on the operating system disk.

    Previously, the Azure Linux Agent was used to automatically configure swap space by using the local resource disk that is attached to the virtual machine after the virtual machine is provisioned on Azure. However this is now handled by cloud-init, you **must not** use the Linux Agent to format the resource disk create the swap file, modify the following parameters in `/etc/waagent.conf` appropriately:

    ```bash
    sudo sed -i 's/ResourceDisk.Format=y/ResourceDisk.Format=n/g' /etc/waagent.conf
    sudo sed -i 's/ResourceDisk.EnableSwap=y/ResourceDisk.EnableSwap=n/g' /etc/waagent.conf
    ```

    If you want mount, format and create swap you can either:
    * Pass this in as a cloud-init config every time you create a VM
    * Use a cloud-init directive baked into the image that will do this every time the VM is created:

        ```bash
        sudo echo 'DefaultEnvironment="CLOUD_CFG=/etc/cloud/cloud.cfg.d/00-azure-swap.cfg"' >> /etc/systemd/system.conf	
        sudo cat > /etc/cloud/cloud.cfg.d/00-azure-swap.cfg << EOF
        #cloud-config
        # Generated by Azure cloud image build
        disk_setup:
          ephemeral0:
            table_type: mbr
            layout: [66, [33, 82]]
            overwrite: True
        fs_setup:
          - device: ephemeral0.1
            filesystem: ext4
          - device: ephemeral0.2
            filesystem: swap
        mounts:
          - ["ephemeral0.1", "/mnt"]
          - ["ephemeral0.2", "none", "swap", "sw,nofail,x-systemd.requires=cloud-init.service,x-systemd.device-timeout=2", "0", "0"]
        EOF
        ```

14. Run the following commands to deprovision the virtual machine and prepare it for provisioning on Azure:

    > [!NOTE]
    > If you are migrating a specific virtual machine and don't wish to create a generalized image, skip the deprovision step.    

	```bash
	sudo rm -f /var/log/waagent.log
	sudo cloud-init clean
	sudo waagent -force -deprovision+user
	sudo rm -f ~/.bash_history
	sudo export HISTSIZE=0
	```

15. Click **Action -> Shut Down** in Hyper-V Manager. Your Linux VHD is now ready to be [uploaded to Azure](./upload-vhd.md#option-1-upload-a-vhd).

## Next steps

You're now ready to use your CentOS Linux virtual hard disk to create new virtual machines in Azure. If this is the first time that you're uploading the .vhd file to Azure, see [Create a Linux VM from a custom disk](upload-vhd.md#option-1-upload-a-vhd).
