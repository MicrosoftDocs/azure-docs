---
title: Create and upload an Ubuntu Linux VHD in Azure
description: Learn to create and upload an Azure virtual hard disk (VHD) that contains an Ubuntu Linux operating system.
author: srijang
ms.service: virtual-machines
ms.custom: linux-related-content
ms.collection: linux
ms.topic: how-to
ms.date: 07/28/2021
ms.author: srijangupta
ms.reviewer: mattmcinnes
---

# Prepare an Ubuntu virtual machine for Azure

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Flexible scale sets

Ubuntu now publishes official Azure virtual hard disks (VHDs) for download at the [Ubuntu Cloud Images webpage](https://cloud-images.ubuntu.com/). If you need to build your own specialized Ubuntu image for Azure instead of using the manual procedure that follows, start with these known working VHDs and customize them, as needed. You can always find the latest image releases at the following locations:

* Ubuntu 18.04/Bionic: [bionic-server-cloudimg-amd64-azure.vhd.zip](https://cloud-images.ubuntu.com/bionic/current/bionic-server-cloudimg-amd64-azure.vhd.tar.gz)
* Ubuntu 20.04/Focal: [focal-server-cloudimg-amd64-azure.vhd.zip](https://cloud-images.ubuntu.com/focal/current/focal-server-cloudimg-amd64-azure.vhd.tar.gz)
* Ubuntu 22.04/Jammy: [jammy-server-cloudimg-amd64-azure.vhd.zip](https://cloud-images.ubuntu.com/jammy/current/jammy-server-cloudimg-amd64-azure.vhd.tar.gz)

## Prerequisites

This article assumes that you've already installed an Ubuntu Linux operating system (OS) to a VHD. Multiple tools exist to create .vhd files. An example is a virtualization solution such as Hyper-V. For instructions, see [Install the Hyper-V role and configure a virtual machine (VM)](/previous-versions/windows/it-pro/windows-server-2012-R2-and-2012/hh846766(v=ws.11)).

### Ubuntu installation notes

* For more tips on preparing Linux for Azure, see [General Linux installation notes](create-upload-generic.md#general-linux-installation-notes).
* The VHDX format isn't supported in Azure, only *fixed VHD*. You can convert the disk to VHD format by using Hyper-V Manager or the `Convert-VHD` cmdlet.
* When you install the Linux system, we recommend that you use standard partitions rather than Logical Volume Manager (LVM), which is often the default for many installations. These standard partitions avoid LVM name conflicts with cloned VMs, particularly if an OS disk ever needs to be attached to another VM for troubleshooting. [LVM](/previous-versions/azure/virtual-machines/linux/configure-lvm) or [RAID](/previous-versions/azure/virtual-machines/linux/configure-raid) can also be used on data disks.
* Don't configure a swap partition or swap file on the OS disk. You can configure the `cloud-init` provisioning agent to create a swap file or a swap partition on the temporary resource disk. For more information about this process, see the following steps.
* All VHDs on Azure must have a virtual size aligned to 1 MB. When you convert from a raw disk to VHD, you must ensure that the raw disk size is a multiple of 1 MB before conversion. For more information, see [Linux installation notes](create-upload-generic.md#general-linux-installation-notes).

## Manual steps

> [!NOTE]
> Before you attempt to create your own custom Ubuntu image for Azure, consider using the prebuilt and tested images from the [Ubuntu Cloud Images webpage](https://cloud-images.ubuntu.com/) instead.
>
1. In the center pane of Hyper-V Manager, select the VM.

1. Select **Connect** to open the window for the VM.

1. Replace the current repositories in the image to use Ubuntu's Azure repository.

    Before you edit `/etc/apt/sources.list`, we recommend that you make a backup:

    ```bash
    sudo cp /etc/apt/sources.list /etc/apt/sources.list.bak
    ```
    
    ```bash
    sudo sed -i 's#http://archive\.ubuntu\.com/ubuntu#http://azure\.archive\.ubuntu\.com/ubuntu#g' /etc/apt/sources.list
    sudo sed -i 's#http://[a-z][a-z]\.archive\.ubuntu\.com/ubuntu#http://azure\.archive\.ubuntu\.com/ubuntu#g' /etc/apt/sources.list
    sudo sed -i 's#http://security\.ubuntu\.com/ubuntu#http://azure\.archive\.ubuntu\.com/ubuntu#g' /etc/apt/sources.list
    sudo sed -i 's#http://[a-z][a-z]\.security\.ubuntu\.com/ubuntu#http://azure\.archive\.ubuntu\.com/ubuntu#g' /etc/apt/sources.list
    sudo apt-get update
    ```

1. The Ubuntu Azure images are now using the [Azure-tailored kernel](https://ubuntu.com/blog/microsoft-and-canonical-increase-velocity-with-azure-tailored-kernel). Update the OS to the latest Azure-tailored kernel and install Azure Linux tools (including Hyper-V dependencies):

    ```bash
    sudo apt update
    sudo apt install linux-azure linux-image-azure linux-headers-azure linux-tools-common linux-cloud-tools-common linux-tools-azure linux-cloud-tools-azure
    sudo apt full-upgrade
    sudo reboot
    ```

1. Modify the kernel boot line for GRUB to include extra kernel parameters for Azure. To do this step, open `/etc/default/grub` in a text editor, find the variable called `GRUB_CMDLINE_LINUX_DEFAULT` (or add it if needed), and edit it to include the following parameters:

    ```config
    GRUB_CMDLINE_LINUX_DEFAULT="console=tty1 console=ttyS0,115200n8 earlyprintk=ttyS0,115200 rootdelay=300 quiet splash"
    ```

1. Save and close this file, and then run `sudo update-grub`. This step ensures that all console messages are sent to the first serial port, which can assist Azure technical support with debugging issues.

1. Ensure that the SSH server is installed and configured to start at boot time. This setting is usually the default.

1. Install `cloud-init` (the provisioning agent) and the Azure Linux agent (the guest extensions handler). `Cloud-init` uses `netplan` to configure the system network configuration (during provisioning and each subsequent boot) and `gdisk` to partition resource disks.

    ```bash
    sudo apt update
    sudo apt install cloud-init gdisk netplan.io walinuxagent && systemctl stop walinuxagent
    ```

    > [!NOTE]
    > The `walinuxagent` package might remove the `NetworkManager` and `NetworkManager-gnome` packages, if they're installed.

1. Remove `cloud-init` default configurations and leftover `netplan` artifacts that might conflict with `cloud-init` provisioning on Azure:

    ```bash
    sudo rm -f /etc/cloud/cloud.cfg.d/50-curtin-networking.cfg /etc/cloud/cloud.cfg.d/curtin-preserve-sources.cfg /etc/cloud/cloud.cfg.d/99-installer.cfg /etc/cloud/cloud.cfg.d/subiquity-disable-cloudinit-networking.cfg
    sudo rm -f /etc/cloud/ds-identify.cfg
    sudo rm -f /etc/netplan/*.yaml
    ```

1. Configure `cloud-init` to provision the system by using the Azure data source:

    ```bash
    cat <<EOF | sudo tee /etc/cloud/cloud.cfg.d/90_dpkg.cfg
    datasource_list: [ Azure ]
    EOF
    
    cat <<EOF | sudo tee /etc/cloud/cloud.cfg.d/90-azure.cfg
    system_info:
       package_mirrors:
         - arches: [i386, amd64]
           failsafe:
             primary: http://archive.ubuntu.com/ubuntu
             security: http://security.ubuntu.com/ubuntu
           search:
             primary:
               - http://azure.archive.ubuntu.com/ubuntu/
             security: []
         - arches: [armhf, armel, default]
           failsafe:
             primary: http://ports.ubuntu.com/ubuntu-ports
             security: http://ports.ubuntu.com/ubuntu-ports
    EOF
    
    cat <<EOF | sudo tee /etc/cloud/cloud.cfg.d/10-azure-kvp.cfg
    reporting:
      logging:
        type: log
      telemetry:
        type: hyperv
    EOF
    ```

1. Configure the Azure Linux agent to rely on `cloud-init` to perform provisioning. For more information on these options, look at the [WALinuxAgent project](https://github.com/Azure/WALinuxAgent).

    ```bash
    sudo sed -i 's/Provisioning.Enabled=y/Provisioning.Enabled=n/g' /etc/waagent.conf
    sudo sed -i 's/Provisioning.UseCloudInit=n/Provisioning.UseCloudInit=y/g' /etc/waagent.conf
    sudo sed -i 's/ResourceDisk.Format=y/ResourceDisk.Format=n/g' /etc/waagent.conf
    sudo sed -i 's/ResourceDisk.EnableSwap=y/ResourceDisk.EnableSwap=n/g' /etc/waagent.conf
    ```
    
    ```bash
    cat <<EOF | sudo tee -a /etc/waagent.conf
    # For Azure Linux agent version >= 2.2.45, this is the option to configure,
    # enable, or disable the provisioning behavior of the Linux agent.
    # Accepted values are auto (default), waagent, cloud-init, or disabled.
    # A value of auto means that the agent will rely on cloud-init to handle
    # provisioning if it is installed and enabled, which in this case it will.
    Provisioning.Agent=auto
    EOF
    ```

1. Clean `cloud-init` and Azure Linux agent runtime artifacts and logs:

    ```bash
    sudo cloud-init clean --logs --seed
    sudo rm -rf /var/lib/cloud/
    sudo systemctl stop walinuxagent.service
    sudo rm -rf /var/lib/waagent/
    sudo rm -f /var/log/waagent.log
    ```

1. Deprovision the VM and prepare it for provisioning on Azure.

    > [!NOTE]
    > The `sudo waagent -force -deprovision+user` command generalizes the image by attempting to clean the system and make it suitable for reprovisioning. The `+user` option deletes the last provisioned user account and associated data.

    ```bash
    sudo waagent -force -deprovision+user
    sudo rm -f ~/.bash_history
    ```

    > [!WARNING]
    > Deprovisioning by using the preceding command doesn't guarantee that the image is cleared of all sensitive information and is suitable for redistribution.

1. Select **Action** > **Shut Down** in Hyper-V Manager.

1. Azure only accepts fixed-size VHDs. If the VM's OS disk isn't a fixed-size VHD, use the `Convert-VHD` PowerShell cmdlet and specify the `-VHDType Fixed` option. For more information, look at the docs for `Convert-VHD` at [Convert-VHD](/powershell/module/hyper-v/convert-vhd).

1. To bring a Generation 2 VM on Azure, follow these steps:

   1. Change the directory to the `boot EFI` directory:
    
        ```bash
        cd /boot/efi/EFI
        ```

   1. Copy the `ubuntu` directory to a new directory named `boot`:

        ```bash
        sudo cp -r ubuntu/ boot
        ```

   1. Change the directory to the newly created boot directory:

        ```bash
        cd boot
        ```

   1. Rename the `shimx64.efi` file:

        ```bash
        sudo mv shimx64.efi bootx64.efi
        ```

   1. Rename the `grub.cfg` file to `bootx64.cfg`:

        ```bash
        sudo mv grub.cfg bootx64.cfg
        ```

## Related content

You're now ready to use your Ubuntu Linux VHD to create new VMs in Azure. If this is the first time that you're uploading the .vhd file to Azure, see [Create a Linux VM from a custom disk](upload-vhd.md#option-1-upload-a-vhd).
