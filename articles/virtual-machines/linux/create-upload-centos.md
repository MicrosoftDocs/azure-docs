---
title: Create and upload a CentOS-based Linux VHD
description: Learn to create and upload an Azure virtual hard disk (VHD) that contains a CentOS-based Linux operating system.
author: srijang
ms.service: virtual-machines
ms.custom: linux-related-content
ms.collection: linux
ms.topic: how-to
ms.date: 12/14/2022
ms.author: srijangupta
ms.reviewer: mattmcinnes
---

# Prepare a CentOS-based virtual machine for Azure

> [!CAUTION]
>
> This article references CentOS, a Linux distribution that's nearing end-of-life (EOL) status. Consider your use and plan accordingly. For more information, see the [CentOS end-of-life guidance](~/articles/virtual-machines/workloads/centos/centos-end-of-life.md).

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Flexible scale sets

Learn to create and upload an Azure virtual hard disk (VHD) that contains a CentOS-based Linux operating system (OS). For more information, see:

* [Prepare a CentOS 6.x virtual machine (VM) for Azure](#centos-6x)
* [Prepare a CentOS 7.0+ VM for Azure](#centos-70)

## Prerequisites

This article assumes that you've already installed a CentOS (or similar derivative) Linux OS to a VHD. Multiple tools exist to create .vhd files. An example is a virtualization solution such as Hyper-V. For instructions, see [Install the Hyper-V role and configure a VM](/previous-versions/windows/it-pro/windows-server-2012-R2-and-2012/hh846766(v=ws.11)).

### CentOS installation notes

* For more tips on preparing Linux for Azure, see [General Linux installation notes](create-upload-generic.md#general-linux-installation-notes).
* The VHDX format isn't supported in Azure, only *fixed VHD*. You can convert the disk to VHD format by using Hyper-V Manager or the `convert-vhd` cmdlet. If you're using VirtualBox, you select **Fixed size** as opposed to the default that's dynamically allocated when you create the disk.
* The vfat kernel module must be enabled in the kernel.
* When you install the Linux system, we recommend that you use standard partitions rather than Logical Volume Manager (LVM), which is often the default for many installations. Using partitions avoids LVM name conflicts with cloned VMs, particularly if an OS disk ever needs to be attached to another identical VM for troubleshooting. [LVM](/previous-versions/azure/virtual-machines/linux/configure-lvm) or [RAID](/previous-versions/azure/virtual-machines/linux/configure-raid) can also be used on data disks.
* Kernel support for mounting user-defined functions (UDF) file systems is necessary. At first boot on Azure, the provisioning configuration is passed to the Linux VM by using UDF-formatted media that's attached to the guest. The Azure Linux agent or `cloud-init` must mount the UDF file system to read its configuration and provision the VM.
* Linux kernel versions below 2.6.37 don't support NUMA on Hyper-V with larger VM sizes. This issue primarily affects older distributions using the upstream Centos 2.6.32 kernel and was fixed in Centos 6.6 (kernel-2.6.32-504). Systems running custom kernels older than 2.6.37 or Red Hat Enterprise Linux (RHEL)-based kernels older than 2.6.32-504 must set the boot parameter `numa=off` on the kernel command line in *grub.conf*. For more information, see Red Hat [KB 436883](https://access.redhat.com/solutions/436883).
* Don't configure a swap partition on the OS disk.
* All VHDs on Azure must have a virtual size aligned to 1 MB. When you convert from a raw disk to VHD, you must ensure that the raw disk size is a multiple of 1 MB before conversion. For more information, see [Linux installation notes](create-upload-generic.md#general-linux-installation-notes).

> [!NOTE]
> _Cloud-init >= 21.2 removes the UDF requirement_. But without the UDF module enabled, the CD-ROM won't mount during provisioning, which prevents custom data from being applied. A workaround for this situation is to apply custom data by using user data. Unlike custom data, user data isn't encrypted. For more information, see [User data formats](https://cloudinit.readthedocs.io/en/latest/topics/format.html).

## CentOS 6.x

> [!IMPORTANT]
>CentOS 6 has reached its EOL and is no longer supported by the CentOS community. No further updates or security patches will be released for this version, leaving it vulnerable to potential security risks. We strongly recommend that you upgrade to a more recent version of CentOS to ensure the safety and stability of your system. For further assistance, consult with your IT department or system administrator.

1. In Hyper-V Manager, select the VM.

1. Select **Connect** to open a console window for the VM.

1. In CentOS 6, `NetworkManager` can interfere with the Azure Linux agent. Uninstall this package:

    ```bash
    sudo rpm -e --nodeps NetworkManager
    ```

1. Create or edit the file `/etc/sysconfig/network` and add the following text:

    ```config
    NETWORKING=yes
    HOSTNAME=localhost.localdomain
    ```

1. Create or edit the file `/etc/sysconfig/network-scripts/ifcfg-eth0` and add the following text:

    ```config
    DEVICE=eth0
    ONBOOT=yes
    BOOTPROTO=dhcp
    TYPE=Ethernet
    USERCTL=no
    PEERDNS=yes
    IPV6INIT=no
    ```

1. Modify udev rules to avoid generating static rules for the Ethernet interfaces. These rules can cause problems when you clone a VM in Azure or Hyper-V:

    ```bash
    sudo ln -s /dev/null /etc/udev/rules.d/75-persistent-net-generator.rules
    sudo rm -f /etc/udev/rules.d/70-persistent-net.rules
    ```

1. Ensure that the network service starts at boot time:

    ```bash
    sudo chkconfig network on
    ```

1. If you want to use the OpenLogic mirrors that are hosted within the Azure datacenters, replace the `/etc/yum.repos.d/CentOS-Base.repo` file with the following repositories. This action also adds the [openlogic] repository that includes extra packages, such as the Azure Linux agent:

   ```config
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

   #additional packages that might be useful
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

    > [!NOTE]
    > The rest of this article assumes that you're using at least the `[openlogic]` repo, which is used to install the Azure Linux agent.

1. Add the following line to `/etc/yum.conf`:

    ```config
    http_caching=packages
    ```

1. Clear the current yum metadata and update the system with the latest packages:

    ```bash
    sudo yum clean all
    ```

    Unless you're creating an image for an older version of CentOS, we recommend that you update all the packages to the latest:

    ```bash
    sudo yum -y update
    ```

    A reboot might be required after you run this command.

1. Optional: Install the drivers for the Linux Integration Services (LIS).

    > [!IMPORTANT]
    > The step is *required* for CentOS 6.3 and earlier and is optional for later releases.

    ```bash
    sudo rpm -e hypervkvpd  ## (might return an error if not installed, that's OK)
    sudo yum install microsoft-hyper-v
    ```

    Alternatively, you can follow the manual installation instructions on the [LIS download page](https://www.microsoft.com/download/details.aspx?id=55106) to install the RPM onto your VM.

1. Install the Azure Linux agent and dependencies. Start and enable the `waagent` service:

    ```bash
    sudo yum install python-pyasn1 WALinuxAgent
    sudo service waagent start
    sudo chkconfig waagent on
    ```

    The WALinuxAgent package removes the `NetworkManager` and `NetworkManager-gnome` packages if they weren't already removed, as described in step 3.

1. Modify the kernel boot line in your grub configuration to include other kernel parameters for Azure. To do this step, open `/boot/grub/menu.lst` in a text editor and ensure that the default kernel includes the following parameters:

    ```config
    console=ttyS0 earlyprintk=ttyS0 rootdelay=300
    ```

    This modification also ensures that all console messages are sent to the first serial port, which can assist Azure support with debugging issues.

    We also recommend that you *remove* the following parameters:

    ```config
    rhgb quiet crashkernel=auto
    ```

    Graphical and quiet boot aren't useful in a cloud environment where you want all the logs to be sent to the serial port. The `crashkernel` option can be left configured if you want. But this parameter reduces the amount of available memory in the VM by 128 MB or more, which might be a problem for smaller VM sizes.

    > [!IMPORTANT]
    > CentOS 6.5 and earlier must also set the kernel parameter `numa=off`. For more information, see Red Hat [KB 436883](https://access.redhat.com/solutions/436883).

1. Ensure that the Secure Shell server is installed and configured to start at boot time. This setting is usually the default.

1. Don't create swap space on the OS disk.

    The Azure Linux agent can automatically configure swap space by using the local resource disk that's attached to the VM after the VM is provisioned on Azure. The local resource disk is a *temporary* disk and might be emptied when the VM is deprovisioned. After you install the Azure Linux agent (see the previous step), modify the following parameters in `/etc/waagent.conf` appropriately:

    ```config
    ResourceDisk.Format=y
    ResourceDisk.Filesystem=ext4
    ResourceDisk.MountPoint=/mnt/resource
    ResourceDisk.EnableSwap=y
    ResourceDisk.SwapSizeMB=2048 ## NOTE: set this to whatever you need it to be.
    ```

1. Deprovision the VM and prepare it for provisioning on Azure:

    ```bash
    sudo waagent -force -deprovision+user
    sudo export HISTSIZE=0
    ```

   > [!NOTE]
   > If you're migrating a specific VM and don't want to create a generalized image, skip the deprovision step.

1. Select **Action** > **Shut Down** in Hyper-V Manager. Your Linux VHD is now ready to be [uploaded to Azure](./upload-vhd.md#option-1-upload-a-vhd).

## CentOS 7.0+

Follow the steps in the next sections if you're using CentOS 7.0+.

### Changes in CentOS 7 (and similar derivatives)

Preparing a CentOS 7 VM for Azure is similar to CentOS 6. Several significant differences are worth noting:

* The `NetworkManager` package no longer conflicts with the Azure Linux agent. This package is installed by default and we recommend that you don't remove it.
* GRUB2 is now used as the default bootloader, so the procedure for editing kernel parameters has changed. (See the "Configuration steps" section.)
* XFS is now the default file system. The ext4 file system can still be used if you want.
* Because CentOS 8 Stream and newer no longer include `network.service` by default, you need to install it manually:

    ```bash
    sudo yum install network-scripts
    sudo systemctl enable network.service
    ```

#### Configuration steps

1. In Hyper-V Manager, select the VM.

1. Select **Connect** to open a console window for the VM.

1. Create or edit the file `/etc/sysconfig/network` and add the following text:

    ```config
    NETWORKING=yes
    HOSTNAME=localhost.localdomain
    ```

1. Create or edit the file `/etc/sysconfig/network-scripts/ifcfg-eth0` and add the following text:

    ```config
    DEVICE=eth0
    ONBOOT=yes
    BOOTPROTO=dhcp
    TYPE=Ethernet
    USERCTL=no
    PEERDNS=yes
    IPV6INIT=no
    NM_CONTROLLED=no
    ```

1. Modify udev rules to avoid generating static rules for the Ethernet interfaces. These rules can cause problems when you clone a VM in Azure or Hyper-V:

    ```bash
    sudo ln -s /dev/null /etc/udev/rules.d/75-persistent-net-generator.rules
    ```

1. If you want to use the `OpenLogic` mirrors that are hosted within the Azure datacenters, replace the */etc/yum.repos.d/CentOS-Base.repo* file with the following repositories. This action also adds the [openlogic] repository that includes packages for the Azure Linux agent:

   ```confg
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

   #additional packages that might be useful
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

   > [!NOTE]
   > The rest of this article assumes that you're using at least the `[openlogic]` repo, which is used to install the Azure Linux agent.

1. Clear the current yum metadata and install any updates:

    ```bash
    sudo yum clean all
    ```

    Unless you're creating an image for an older version of CentOS, we recommend that you update all the packages to the latest:

    ```bash
    sudo yum -y update
    ```

    A reboot might be required after you run this command.

1. Modify the kernel boot line in your grub configuration to include other kernel parameters for Azure. To do this step, open `/etc/default/grub` in a text editor and edit the `GRUB_CMDLINE_LINUX` parameter. For example:

    ```config
    GRUB_CMDLINE_LINUX="rootdelay=300 console=ttyS0 earlyprintk=ttyS0 net.ifnames=0"
    ```

   This modification also ensures that all console messages are sent to the first serial port, which can assist Azure support with debugging issues. It also turns off the new CentOS 7 naming conventions for network interface cards. We also recommend that you *remove* the following parameters:

    ```config
    rhgb quiet crashkernel=auto
    ```

    Graphical and quiet boot aren't useful in a cloud environment where you want all the logs to be sent to the serial port. The `crashkernel` option can be left configured if you want. But this parameter reduces the amount of available memory in the VM by 128 MB or more, which might be a problem for smaller VM sizes.

1. After you're finished editing `/etc/default/grub`, rebuild the grub configuration:

    ```bash
    sudo grub2-mkconfig -o /boot/grub2/grub.cfg
    ```

   > [!NOTE]
   > If you're uploading a UEFI-enabled VM, the command to update grub is `grub2-mkconfig -o /boot/efi/EFI/centos/grub.cfg`. Also, the vfat kernel module must be enabled in the kernel. Otherwise, provisioning fails.
   >
   > Make sure the udf module is enabled. Removing or disabling it will cause a provisioning or boot failure. *(_Cloud-init >= 21.2 removes the udf requirement. For more information, read the top of the document.)*

1. If you're building the image from VMware, VirtualBox, or KVM, ensure that the Hyper-V drivers are included in the initramfs:

    1. Edit `/etc/dracut.conf` and add content:

        ```config
        add_drivers+=" hv_vmbus hv_netvsc hv_storvsc "
        ```

    1. Rebuild the initramfs:

        ```bash
        sudo dracut -f -v
        ```

1. Install the Azure Linux agent and dependencies for Azure VM extensions:

    ```bash
    sudo yum install python-pyasn1 WALinuxAgent
    sudo systemctl enable waagent
    ```

1. Install `cloud-init` to handle the provisioning:

    ```bash
    sudo yum install -y cloud-init cloud-utils-growpart gdisk hyperv-daemons
    ```

    - Configure `waagent` for `cloud-init`:

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

    if [[ -f /mnt/swapfile ]]; then
    echo Removing swapfile - RHEL uses a swapfile by default
    swapoff /mnt/swapfile
    rm /mnt/swapfile -f
    fi

    echo "Add console log file"
    cat >> /etc/cloud/cloud.cfg.d/05_logging.cfg <<EOF

    # This tells cloud-init to redirect its stdout and stderr to
    # 'tee -a /var/log/cloud-init-output.log' so the user can see output
    # there without needing to look on the console.
    output: {all: '| tee -a /var/log/cloud-init-output.log'}
    EOF
    ```

1. Swap configuration:

    1. Don't create swap space on the OS disk.

       Previously, the Azure Linux agent was used to automatically configure swap space by using the local resource disk that's attached to the VM after the VM is provisioned on Azure. However, `cloud-init` now handles this step. You *must not* use the Linux agent to format the resource disk to create the swap file. Modify the following parameters in `/etc/waagent.conf` appropriately:

        ```bash
        sudo sed -i 's/ResourceDisk.Format=y/ResourceDisk.Format=n/g' /etc/waagent.conf
        sudo sed -i 's/ResourceDisk.EnableSwap=y/ResourceDisk.EnableSwap=n/g' /etc/waagent.conf
        ```

    1. If you want to mount, format, and create the swap file, you can either:

       * Pass this command in as a `cloud-init` configuration every time you create a VM.
       * Use a `cloud-init` directive baked into the image to do this step every time the VM is created:

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

1. Run the following commands to deprovision the VM and prepare it for provisioning on Azure.

    > [!NOTE]
    > If you're migrating a specific VM and don't want to create a generalized image, skip the deprovision step.

    ```bash
    sudo rm -f /var/log/waagent.log
    sudo cloud-init clean
    sudo waagent -force -deprovision+user
    sudo rm -f ~/.bash_history
    sudo export HISTSIZE=0
    ```

1. Select **Action** > **Shut Down** in Hyper-V Manager. Your Linux VHD is now ready to be [uploaded to Azure](./upload-vhd.md#option-1-upload-a-vhd).

## Related content

You're now ready to use your CentOS Linux VHD to create new VMs in Azure. If this is the first time that you're uploading the .vhd file to Azure, see [Create a Linux VM from a custom disk](upload-vhd.md#option-1-upload-a-vhd).
