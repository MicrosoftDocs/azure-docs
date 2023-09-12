---
title: Create and upload a SUSE Linux VHD in Azure
description: Learn to create and upload an Azure virtual hard disk (VHD) that contains a SUSE Linux operating system.
author: srijang
ms.service: virtual-machines
ms.subservice: imaging
ms.collection: linux
ms.workload: infrastructure-services
ms.custom: devx-track-linux
ms.topic: how-to
ms.date: 12/14/2022
ms.author: srijangupta
ms.reviewer: mattmcinnes
---
# Prepare a SLES or openSUSE Leap virtual machine for Azure

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Flexible scale sets **Applies to:** :heavy_check_mark: Uniform scale sets

In some cases, you may want to use customized SUSE or openSUSE Leap Linux VMs in your Azure environment and be able to build these types of VMs through automation.  This article demonstrates how to create and upload a custom Azure virtual hard disk (VHD) that contains a SUSE Linux operating system.

## Prerequisites

This article assumes that you have already installed a SUSE or openSUSE Leap Linux operating system to a virtual hard disk. Multiple tools exist to create .vhd files, for example a virtualization solution such as Hyper-V. For instructions, see [Install the Hyper-V Role and Configure a Virtual Machine](/previous-versions/windows/it-pro/windows-server-2012-R2-and-2012/hh846766(v=ws.11)).

## SLES / openSUSE Leap installation notes

* For more tips on preparing Linux images for Azure, see [General Linux Installation Notes](create-upload-generic.md#general-linux-installation-notes)
* The VHDX format isn't supported in Azure, only **fixed VHD**.  You can convert the disk to VHD format using Hyper-V Manager or the convert-vhd cmdlet.
* Azure supports Gen1 (BIOS boot) and Gen2 (UEFI boot) virtual machines.
* The `vfat` kernel module must be enabled in the kernel
* When installing the Linux operating system, use standard partitions rather than logical volume manager (LVM) managed partitions, which is often the default for many installations. Using standard partitions will avoid LVM name conflicts with cloned VMs, particularly if an OS disk ever needs to be attached to another VM for troubleshooting. [LVM](/previous-versions/azure/virtual-machines/linux/configure-lvm) or [RAID](/previous-versions/azure/virtual-machines/linux/configure-raid) may be used on data disks if preferred.
* Don't configure a swap partition on the OS disk. The Linux agent can be configured to create a swap file on the temporary resource disk.  More information about configuring swap space can be found in the steps below.
* All VHDs on Azure must have a virtual size aligned to 1 MB. When converting from a raw disk to VHD, you must ensure that the raw disk size is a multiple of 1 MB before conversion. See [Linux Installation Notes](create-upload-generic.md#general-linux-installation-notes) for more information.


> [!NOTE]
> **(_Cloud-init >= 21.2 removes the udf requirement._)** however without the udf module enabled the cdrom will not mount during provisioning preventing custom data from being applied.  A workaround for this would be to apply custom data using user data however, unlike custom data user data is not encrypted. https://cloudinit.readthedocs.io/en/latest/topics/format.html


## Use SUSE Studio

[SUSE Studio](https://studioexpress.opensuse.org/) can easily create and manage your SLES and openSUSE Leap images for Azure and Hyper-V. SUSE Studio is the recommended approach for customizing your own SLES and openSUSE Leap images.

As an alternative to building your own VHD, SUSE also publishes BYOS (Bring Your Own Subscription) images for SLES at [VM Depot](https://www.microsoft.com/research/wp-content/uploads/2016/04/using-and-contributing-vms-to-vm-depot.pdf).

## Prepare SUSE Linux Enterprise Server for Azure

1. In the center pane of Hyper-V Manager, select the virtual machine.
2. Click **Connect** to open the window for the virtual machine.
3. Register your SUSE Linux Enterprise system to allow it to download updates and install packages.
4. Update the system with the latest patches:

    ```bash
    sudo zypper update
    ```
    
5. Install Azure Linux Agent and cloud-init

    ```bash
    sudo SUSEConnect -p sle-module-public-cloud/15.2/x86_64  (SLES 15 SP2)
    sudo zypper refresh
    sudo zypper install python-azure-agent
    sudo zypper install cloud-init
    ```

6. Enable waagent & cloud-init to start on boot

    ```bash
    sudo chkconfig waagent on
    sudo systemctl enable cloud-init-local.service
    sudo systemctl enable cloud-init.service
    sudo systemctl enable cloud-config.service
    sudo systemctl enable cloud-final.service
    sudo systemctl daemon-reload
    sudo cloud-init clean
    ```

7. Update waagent and cloud-init configuration

    ```bash
    sudo sed -i 's/Provisioning.UseCloudInit=n/Provisioning.UseCloudInit=auto/g' /etc/waagent.conf
    sudo sed -i 's/Provisioning.Enabled=y/Provisioning.Enabled=n/g' /etc/waagent.conf
    sudo sh -c 'printf "datasource:\n  Azure:" > /etc/cloud/cloud.cfg.d/91-azure_datasource.cfg'
    sudo sh -c 'printf "reporting:\n  logging:\n    type: log\n  telemetry:\n    type: hyperv" > /etc/cloud/cloud.cfg.d/10-azure-kvp.cfg'
    ```

8. Edit the "/etc/default/grub" file to ensure console logs are sent to the serial port by adding the following line:

    ```config-grub
    console=ttyS0 earlyprintk=ttyS0 
    ```

    Next, apply this change by running the following command:

    ```bash
    sudo grub2-mkconfig -o /boot/grub2/grub.cfg
    ```

    This configuration will ensure all console messages are sent to the first serial port, which can assist Azure support with debugging issues.

9. Ensure the "/etc/fstab" file references the disk using its UUID (by-uuid)

10. Modify udev rules to avoid generating static rules for the Ethernet interface(s). These rules can cause problems when cloning a virtual machine in Microsoft Azure or Hyper-V:

    ```bash
    sudo ln -s /dev/null /etc/udev/rules.d/75-persistent-net-generator.rules
    sudo rm -f /etc/udev/rules.d/70-persistent-net.rules
    ```

11. It's recommended to edit the "/etc/sysconfig/network/dhcp" file and change the `DHCLIENT_SET_HOSTNAME` parameter to the following:

    ```config
    DHCLIENT_SET_HOSTNAME="no"
    ```

12. In the "/etc/sudoers" file, comment out or remove the following lines if they exist:

    ```output
    Defaults targetpw   # ask for the password of the target user i.e. root
    ALL    ALL=(ALL) ALL   # WARNING! Only use this setting together with 'Defaults targetpw'!
    ```

13. Ensure that the SSH server is installed and configured to start at boot time.

14. Swap configuration

    Don't create swap space on the operating system disk.

    Previously, the Azure Linux Agent was used to automatically configure swap space by using the local resource disk that is attached to the virtual machine after the virtual machine is provisioned on Azure. However this step is now handled by cloud-init, you **must not** use the Linux Agent to format the resource disk or create the swap file. Use these commands to modify `/etc/waagent.conf` appropriately:

    ```bash
    sudo sed -i 's/ResourceDisk.Format=y/ResourceDisk.Format=n/g' /etc/waagent.conf
    sudo sed -i 's/ResourceDisk.EnableSwap=y/ResourceDisk.EnableSwap=n/g' /etc/waagent.conf
    ```

    For more information on the waagent.conf configuration options, see the [Linux agent configuration](../extensions/agent-linux.md#configuration) documentation.

    If you want to mount, format and create a swap partition you can either:
    * Pass this configuration in as a cloud-init config every time you create a VM.
    * Use a cloud-init directive baked into the image that configures swap space every time the VM is created:

        ```bash
        sudo echo 'DefaultEnvironment="CLOUD_CFG=/etc/cloud/cloud.cfg.d/00-azure-swap.cfg"' >> /etc/systemd/system.conf
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
          - ["ephemeral0.1", "/mnt/ressource"]
          - ["ephemeral0.2", "none", "swap", "sw,nofail,x-systemd.requires=cloud-init.service,x-systemd.device-timeout=2", "0", "0"]
        EOF
        ```
> [!NOTE]
> Make sure the **'udf'** module is enabled. Blocklisting or removing it will cause a provisioning failure.  **(_Cloud-init >= 21.2 removes the udf requirement. Please read top of document for more detail)**


15. Run the following commands to deprovision the virtual machine and prepare it for provisioning on Azure:

> [!NOTE] 
> If you're migrating a specific virtual machine and don't wish to create a generalized image, skip the deprovision step

```bash
    sudo rm -f /var/log/waagent.log
    sudo cloud-init clean
    sudo waagent -force -deprovision+user
    sudo rm -f ~/.bash_history
    sudo export HISTSIZE=0
 ```
    
16. Click **Action -> Shut Down** in Hyper-V Manager. Your Linux VHD is now ready to be [**uploaded to Azure**](./upload-vhd.md#option-1-upload-a-vhd).

---

## Prepare openSUSE 15.2+

1. In the center pane of Hyper-V Manager, select the virtual machine.
2. Click **Connect** to open the window for the virtual machine.
3. In a terminal, run the command '`zypper lr`'. If this command returns output similar to the following, then the repositories are configured as expected and no adjustments are necessary (note that version numbers may vary):

   | # | Alias                 | Name                  | Enabled | Refresh
   | - | :-------------------- | :-------------------- | :------ | :------
   | 1 | Cloud:Tools_15.2      | Cloud:Tools_15.2      | Yes     | Yes
   | 2 | openSUSE_15.2_OSS     | openSUSE_15.2_OSS     | Yes     | Yes
   | 3 | openSUSE_15.2_Updates | openSUSE_15.2_Updates | Yes     | Yes

    If the command returns "No repositories defined..." then use the following commands to add these repos:

    ```bash
    sudo zypper ar -f http://download.opensuse.org/repositories/Cloud:Tools/openSUSE_15.2 Cloud:Tools_15.2
    sudo zypper ar -f https://download.opensuse.org/distribution/15.2/repo/oss openSUSE_15.2_OSS
    sudo zypper ar -f http://download.opensuse.org/update/15.2 openSUSE_15.2_Updates
    ```

    You can then verify the repositories have been added by running the command '`zypper lr`' again. If one of the relevant update repositories isn't enabled, enable it with following command:

    ```bash
    sudo zypper mr -e [NUMBER OF REPOSITORY]
    ```

4. Update the kernel to the latest available version:

    ```bash
    sudo zypper up kernel-default
    ```

    Or to update the operating system with all the latest patches:

    ```bash
    sudo zypper update
    ```

5. Install the Azure Linux Agent.

    ```bash
    sudo zypper install WALinuxAgent
    ```

6. Modify the kernel boot line in your grub configuration to include additional kernel parameters for Azure. To do this, open "/boot/grub/menu.lst" in a text editor and ensure that the default kernel includes the following parameters:

    ```config-grub
     console=ttyS0 earlyprintk=ttyS0 
    ```

   This option will ensure all console messages are sent to the first serial port, which can assist Azure support with debugging issues. In addition, remove the following parameters from the kernel boot line if they exist:

    ```config-grub
     libata.atapi_enabled=0 reserve=0x1f0,0x8
    ```

7. It's recommended to edit the "/etc/sysconfig/network/dhcp" file and change the `DHCLIENT_SET_HOSTNAME` parameter to the following setting:

    ```config
     DHCLIENT_SET_HOSTNAME="no"
    ```

8. **Important:** In the "/etc/sudoers" file, comment out or remove the following lines if they exist:

    ```output
    Defaults targetpw   # ask for the password of the target user i.e. root
    ALL    ALL=(ALL) ALL   # WARNING! Only use this together with 'Defaults targetpw'!
    ```

9. Ensure that the SSH server is installed and configured to start at boot time.
10. Don't create swap space on the OS disk.

    The Azure Linux Agent can automatically configure swap space using the local resource disk that is attached to the VM after provisioning on Azure. Note that the local resource disk is a *temporary* disk, and might be emptied when the VM is deprovisioned. After installing the Azure Linux Agent (see previous step), modify the following parameters in the "/etc/waagent.conf" as follows:

    ```config-conf
    ResourceDisk.Format=y
    ResourceDisk.Filesystem=ext4
    ResourceDisk.MountPoint=/mnt/resource
    ResourceDisk.EnableSwap=y
    ResourceDisk.SwapSizeMB=2048    ## NOTE: set the size to whatever you need it to be.
    ```

11. Ensure the Azure Linux Agent runs at startup:

    ```bash
    sudo systemctl enable waagent.service
    ```

12. Run the following commands to deprovision the virtual machine and prepare it for provisioning on Azure:

> [!NOTE] 
> If you're migrating a specific virtual machine and don't wish to create a generalized image, skip the deprovision step

```bash
    sudo rm -f ~/.bash_history # Remove current user history
    sudo rm -rf /var/lib/waagent/
    sudo rm -f /var/log/waagent.log
    sudo waagent -force -deprovision+user
    sudo rm -f ~/.bash_history # Remove root user history
    sudo export HISTSIZE=0
```

13. Click **Action -> Shut Down** in Hyper-V Manager. Your Linux VHD is now ready to be [**uploaded to Azure**](./upload-vhd.md#option-1-upload-a-vhd).

## Next steps

You're now ready to use your SUSE Linux virtual hard disk to create new virtual machines in Azure. If this is the first time that you're uploading the .vhd file to Azure, see [Create a Linux VM from a custom disk](upload-vhd.md#option-1-upload-a-vhd).
