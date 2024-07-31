---
title: Create and upload an Oracle Linux VHD
description: Learn to create and upload an Azure virtual hard disk (VHD) that contains an Oracle Linux operating system.
author: srijang
ms.service: azure-virtual-machines
ms.collection: linux
ms.subservice: oracle
ms.custom: linux-related-content
ms.topic: how-to
ms.date: 11/09/2021
ms.author: srijangupta
ms.reviewer: mattmcinnes
---

# Prepare an Oracle Linux virtual machine for Azure

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Flexible scale sets

This article assumes that you've already installed an Oracle Linux operating system (OS) to a virtual hard disk (VHD). Multiple tools exist to create .vhd files. An example is a virtualization solution such as Hyper-V. For instructions, see [Install the Hyper-V role and configure a virtual machine (VM)](/previous-versions/windows/it-pro/windows-server-2012-R2-and-2012/hh846766(v=ws.11)).

## Oracle Linux installation notes

* For more tips on preparing Linux for Azure, see [General Linux installation notes](create-upload-generic.md#general-linux-installation-notes).
* Hyper-V and Azure support Oracle Linux with either the Unbreakable Enterprise Kernel (UEK) or the Red Hat Compatible Kernel.
* Oracle's UEK2 isn't supported on Hyper-V and Azure because it doesn't include the required drivers.
* The VHDX format isn't supported in Azure, only *fixed VHD*. You can convert the disk to VHD format by using Hyper-V Manager or the `convert-vhd` cmdlet.
* *Kernel support for mounting user-defined functions (UDF) file systems is required.* At first boot on Azure, the provisioning configuration is passed to the Linux VM via UDF-formatted media that's attached to the guest. The Azure Linux agent must be able to mount the UDF file system to read its configuration and provision the VM.
* When you install the Linux system, we recommend that you use standard partitions rather than Logical Volume Manager (LVM), which is often the default for many installations. These standard partitions avoid LVM name conflicts with cloned VMs, particularly if an OS disk ever needs to be attached to another VM for troubleshooting. [LVM](/previous-versions/azure/virtual-machines/linux/configure-lvm) or [RAID](/previous-versions/azure/virtual-machines/linux/configure-raid) can also be used on data disks.
* Linux kernel versions earlier than 2.6.37 don't support NUMA on Hyper-V with larger VM sizes. This issue primarily affects older distributions that use the upstream Red Hat 2.6.32 kernel and was fixed in Oracle Linux 6.6 and later.
* Don't configure a swap partition on the OS disk.
* All VHDs on Azure must have a virtual size aligned to 1 MB. When you convert from a raw disk to VHD, you must ensure that the raw disk size is a multiple of 1 MB before conversion. For more information, see [Linux installation notes](create-upload-generic.md#general-linux-installation-notes).
* Make sure that the `Addons` repository is enabled. Edit the file `/etc/yum.repos.d/public-yum-ol6.repo`(Oracle Linux 6) or `/etc/yum.repos.d/public-yum-ol7.repo`(Oracle Linux 7). Change the line `enabled=0` to `enabled=1` under [ol6_addons] or [ol7_addons] in this file.

## Oracle Linux 6.X

> [!IMPORTANT]
> Remember that Oracle Linux 6.x is already at end of life. Oracle Linux version 6.10 has available [Extended Lifecycle Support](https://www.oracle.com/a/ocom/docs/linux/oracle-linux-extended-support-ds.pdf), which [ends July 2024](https://www.oracle.com/a/ocom/docs/elsp-lifetime-069338.pdf).

You must complete specific configuration steps in the OS for the VM to run in Azure.

1. In the center pane of Hyper-V Manager, select the VM.
1. Select **Connect** to open the window for the VM.
1. Uninstall `NetworkManager`:

    ```bash
    sudo rpm -e --nodeps NetworkManager
    ```

   > [!NOTE]
   > If the package isn't already installed, this command fails with an error message. This message is expected.

1. Create a file named **network** in the `/etc/sysconfig/` directory that contains the following text:

    ```config
    NETWORKING=yes
    HOSTNAME=localhost.localdomain
    ```

1. Create a file named **ifcfg-eth0** in the `/etc/sysconfig/network-scripts/` directory that contains the following text:

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

1. Install `python-pyasn1`:

    ```bash
    sudo yum install python-pyasn1
    ```

1. Modify the kernel boot line in your grub configuration to include more kernel parameters for Azure. To do this step, open `/boot/grub/menu.lst` in a text editor and ensure that the kernel includes the following parameters:

    ```config-grub
    console=ttyS0 earlyprintk=ttyS0
    ```

   This setting ensures that all console messages are sent to the first serial port, which can assist Azure support with debugging issues.

   In addition to the preceding steps, we recommend that you *remove* the following parameters:

    ```config-grub
    rhgb quiet crashkernel=auto
    ```

   Graphical and quiet boot aren't useful in a cloud environment where you want all the logs to be sent to the serial port.

   The `crashkernel` option can be left configured if you want. This parameter reduces the amount of available memory in the VM by 128 MB or more, which might be a problem for smaller VM sizes.

1. Ensure that the SSH server is installed and configured to start at boot time. This setting is usually the default.
1. Install the Azure Linux agent by running the following command. The latest version is 2.0.15.

    ```bash
    sudo yum install WALinuxAgent
    ```

    Installing the `WALinuxAgent` package removes the `NetworkManager` and `NetworkManager-gnome` packages if they weren't already removed, as described in step 2.

1. Don't create swap space on the OS disk.

    The Azure Linux agent can automatically configure swap space by using the local resource disk that's attached to the VM after provisioning on Azure. The local resource disk is a *temporary* disk and might be emptied when the VM is deprovisioned. After you install the Azure Linux agent (see the previous step), modify the following parameters in `/etc/waagent.conf` appropriately:

    ```config-conf
    ResourceDisk.Format=y
    ResourceDisk.Filesystem=ext4
    ResourceDisk.MountPoint=/mnt
    ResourceDisk.EnableSwap=y
    ResourceDisk.SwapSizeMB=2048    ## NOTE: set this to whatever you need it to be.
    ```

1. Deprovision the VM and prepare it for provisioning on Azure:

    ```bash
    sudo waagent -force -deprovision
    sudo export HISTSIZE=0
    sudo logout
    ```

1. Select **Action** > **Shut Down** in Hyper-V Manager. Your Linux VHD is now ready to be [uploaded to Azure](./upload-vhd.md#option-1-upload-a-vhd).

---
## Oracle Linux 7.0 and later

Follow the steps in the next sections if you're using Oracle Linux 7.0 or later.

### Changes in Oracle Linux 7

Preparing an Oracle Linux 7 VM for Azure is similar to Oracle Linux 6, but several differences are worth noting:

* Azure supports Oracle Linux with either the Unbreakable Enterprise Kernel (UEK) or the Red Hat Compatible Kernel. We recommend that you use Oracle Linux with UEK.
* The `NetworkManager` package no longer conflicts with the Azure Linux agent. This package is installed by default, and we recommend that you don't remove it.
* GRUB2 is now used as the default bootloader, so the procedure for editing kernel parameters has changed. (See the "Configuration steps" section.)
* XFS is now the default file system. The ext4 file system can still be used if you want.

#### Configuration steps

1. In Hyper-V Manager, select the VM.
1. Select **Connect** to open a console window for the VM.
1. Create a file named **network** in the `/etc/sysconfig/` directory that contains the following text:

    ```config
    NETWORKING=yes
    HOSTNAME=localhost.localdomain
    ```

1. Create a file named **ifcfg-eth0** in the `/etc/sysconfig/network-scripts/` directory that contains the following text:

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
    ```

1. Ensure that the network service starts at boot time:

    ```bash
    sudo chkconfig network on
    ```

1. Install the `python-pyasn1` package:

    ```bash
    sudo yum install python3-pyasn1
    ```

1. Clear the current yum metadata and install any updates:

    ```bash
    sudo yum clean all
    sudo yum -y update
    ```

1. Modify the kernel boot line in your grub configuration to include more kernel parameters for Azure. To do this step, open `/etc/default/grub` in a text editor and edit the `GRUB_CMDLINE_LINUX` parameter. For example:

    ```config-grub
    GRUB_CMDLINE_LINUX="console=ttyS0 earlyprintk=ttyS0 net.ifnames=0"
    ```

   This modification also ensures that all console messages are sent to the first serial port, which can assist Azure support with debugging issues. It also turns off the naming conventions for network interface cards in Oracle Linux 7 with the UEK. We also recommend that you *remove* the following parameters:

    ```config-grub
       rhgb quiet crashkernel=auto
    ```

   Graphical and quiet boot aren't useful in a cloud environment where you want all the logs to be sent to the serial port.

   The `crashkernel` option can be left configured if you want. This parameter reduces the amount of available memory in the VM by 128 MB or more, which might be a problem for smaller VM sizes.

1. After you're finished editing `/etc/default/grub`, rebuild the grub configuration:

    ```bash
    sudo grub2-mkconfig -o /boot/grub2/grub.cfg
    ```

1. Ensure that the SSH server is installed and configured to start at boot time. This setting is usually the default.
1. Install the Azure Linux agent and dependencies:

    ```bash
    sudo yum install WALinuxAgent
    sudo systemctl enable waagent
    ```

1. Install `cloud-init` to handle the provisioning:

    ```bash
    sudo yum install -y cloud-init cloud-utils-growpart gdisk hyperv-daemons
    ```

1. Configure `waagent` for `cloud-init`:

    ```bash
    sudo sed -i 's/Provisioning.UseCloudInit=n/Provisioning.UseCloudInit=y/g' /etc/waagent.conf
    sudo sed -i 's/Provisioning.Enabled=y/Provisioning.Enabled=n/g' /etc/waagent.conf
    ```

    ```bash
    sudo echo "Adding mounts and disk_setup to init stage"
    sudo sed -i '/ - mounts/d' /etc/cloud/cloud.cfg
    sudo sed -i '/ - disk_setup/d' /etc/cloud/cloud.cfg
    sudo sed -i '/cloud_init_modules/a\\ - mounts' /etc/cloud/cloud.cfg
    sudo sed -i '/cloud_init_modules/a\\ - disk_setup' /etc/cloud/cloud.cfg
    ```

    ```bash
    echo "Allow only Azure datasource, disable fetching network setting via IMDS"
    ```

    ```bash
    sudo cat > /etc/cloud/cloud.cfg.d/91-azure_datasource.cfg <<EOF
    datasource_list: [ Azure ]
    datasource:
        Azure:
            apply_network_config: False
    EOF


    if [[ -f /mnt/resource/swapfile ]]; then
    echo Removing swapfile - Oracle Linux uses a swapfile by default
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
   1. Don't create swap space on the operating system disk.

      Previously, the Azure Linux agent was used automatically to configure swap space by using the local resource disk that's attached to the VM after the VM is provisioned on Azure. However, `cloud-init` now handles this step. You *must not* use the Linux agent to format the resource disk to create the swap file. Modify the following parameters in `/etc/waagent.conf` appropriately:

        ```bash
        sudo sed -i 's/ResourceDisk.Format=y/ResourceDisk.Format=n/g' /etc/waagent.conf
        sudo sed -i 's/ResourceDisk.EnableSwap=y/ResourceDisk.EnableSwap=n/g' /etc/waagent.conf
        ```

     1. If you want to mount, format, and create the swap, you can either:

        * Pass this code in as a `cloud-init` configuration every time you create a VM.
        * Use a `cloud-init` directive baked into the image to do this step every time the VM is created:

        ```bash
        echo 'DefaultEnvironment="CLOUD_CFG=/etc/cloud/cloud.cfg.d/00-azure-swap.cfg"' >> /etc/systemd/system.conf
        cat > /etc/cloud/cloud.cfg.d/00-azure-swap.cfg << EOF
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
          - ["ephemeral0.1", "/mnt/resource"]
          - ["ephemeral0.2", "none", "swap", "sw,nofail,x-systemd.requires=cloud-init.service,x-systemd.device-timeout=2", "0", "0"]
        EOF
        ```

1. Deprovision the VM and prepare it for provisioning on Azure:

    ```bash
    sudo cloud-init clean
    sudo rm -f /var/log/waagent.log
    sudo waagent -force -deprovision
    sudo rm -f ~/.bash_history
    sudo export HISTSIZE=0
    ```

    > [!NOTE]
    > If you're migrating a specific VM and don't want to create a generalized image, skip the deprovision step.

1. Select **Action** > **Shut Down** in Hyper-V Manager. Your Linux VHD is now ready to be [uploaded to Azure](./upload-vhd.md#option-1-upload-a-vhd).

## Related content

You're now ready to use your Oracle Linux .vhd to create new VMs in Azure. If this is the first time that you're uploading the .vhd file to Azure, see [Create a Linux VM from a custom disk](upload-vhd.md#option-1-upload-a-vhd).
