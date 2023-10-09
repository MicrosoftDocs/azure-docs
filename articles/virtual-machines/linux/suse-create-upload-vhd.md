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
* Don't configure a swap partition on the OS disk. The Linux agent can be configured to create a swap file on the temporary resource disk.  More information about configuring swap space can be found in the steps below.
* All VHDs on Azure must have a virtual size aligned to 1 MB. When converting from a raw disk to VHD, you must ensure that the raw disk size is a multiple of 1 MB before conversion. See [Linux Installation Notes](create-upload-generic.md#general-linux-installation-notes) for more information.


> [!NOTE]
> **(_Cloud-init >= 21.2 removes the udf requirement._)** however without the udf module enabled the cdrom won't mount during provisioning, preventing custom data from being applied.  A workaround for this is to apply custom data. However, unlike custom data user data, isn't encrypted. https://cloudinit.readthedocs.io/en/latest/topics/format.html


## Use SUSE Studio

[SUSE Studio](https://studioexpress.opensuse.org/) can easily create and manage your SLES and openSUSE Leap images for Azure and Hyper-V. SUSE Studio is the recommended approach for customizing your own SLES and openSUSE Leap images.

As an alternative to building your own VHD, SUSE also publishes BYOS (Bring Your Own Subscription) images for SLES at [VM Depot](https://www.microsoft.com/research/wp-content/uploads/2016/04/using-and-contributing-vms-to-vm-depot.pdf).

## Prepare SUSE Linux Enterprise Server for Azure

1. Configure the Azure/Hyper-v modules if required.

    If your software hypervisor is not Hyper-V, other modules need to be added into the initramfs to successfully boot in Azure

    Edit the "/etc/dracut.conf" file and add the following line to the file then executeh the ```dracut```command to rebuild the initramfs file:

```config
add_drivers+=" hv_vmbus hv_netvsc hv_storvsc "
```

```bash
sudo dracut --verbose --force
```

2. Setup the Serial Console.

    In order to successfully work with the serial console, it's required to set up several variables in the "/etc/defaults/grub" file and recreate the grub on the server.

```config
# Add console=ttyS0 and earlyprintk=ttS0 to the variable
# remove "splash=silent" and "quiet" options.
GRUB_CMDLINE_LINUX_DEFAULT="audit=1 no-scroll fbcon=scrollback:0 mitigations=auto security=apparmor crashkernel=228M,high crashkernel=72M,low console=ttyS0 earlyprintk=ttyS0"

# Add "console serial" to GRUB_TERMINAL
GRUB_TERMINAL="console serial"

# Set the GRUB_SERIAL_COMMAND variable

GRUB_SERIAL_COMMAND="serial --speed=115200 --unit=0 --word=8 --parity=no --stop=1"
```

```shell
/usr/sbin/grub2-mkconfig -o /boot/grub2/grub.cfg 
```
 
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
sudo systemctl enable  waagent 
sudo systemctl enable cloud-init-local.service
sudo systemctl enable cloud-init.service
sudo systemctl enable cloud-config.service
sudo systemctl enable cloud-final.service
sudo systemctl daemon-reload
sudo cloud-init clean
```

7. Update the cloud-init configuration 

```bash
cat <<EOF | sudo /etc/cloud/cloud.cfg.d/91-azure_datasource.cfg 
datasource_list: [ Azure ]
datasource:
    Azure:
        apply_network_config: False

EOF
```

```bash
sudo cat <<EOF | sudo tee  /etc/cloud/cloud.cfg.d/05_logging.cfg
# This tells cloud-init to redirect its stdout and stderr to
# 'tee -a /var/log/cloud-init-output.log' so the user can see output
# there without needing to look on the console.
output: {all: '| tee -a /var/log/cloud-init-output.log'}
EOF

# Make sure mounts and disk_setup are in the init stage:
echo "Adding mounts and disk_setup to init stage"
sudo sed -i '/ - mounts/d' /etc/cloud/cloud.cfg
sudo sed -i '/ - disk_setup/d' /etc/cloud/cloud.cfg
sudo sed -i '/cloud_init_modules/a\\ - mounts' /etc/cloud/cloud.cfg
sudo sed -i '/cloud_init_modules/a\\ - disk_setup' /etc/cloud/cloud.cfg
```

8. If you want to mount, format, and create a swap partition you can either:
    * Pass this configuration in as a cloud-init config every time you create a VM.
    * Use a cloud-init directive baked into the image that configures swap space every time the VM is created:
	

```bash
cat  <<EOF | sudo tee -a /etc/systemd/system.conf
'DefaultEnvironment="CLOUD_CFG=/etc/cloud/cloud.cfg.d/00-azure-swap.cfg"'
EOF 

cat <<EOF | sudo tee /etc/cloud/cloud.cfg.d/00-azure-swap.cfg
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
    
9. Previously, the Azure Linux Agent was used to automatically configure swap space by using the local resource disk that is attached to the virtual machine after the virtual machine is provisioned on Azure. However, this step is now handled by cloud-init, you **must not** use the Linux Agent to format the resource disk or create the swap file. Use these commands to modify `/etc/waagent.conf` appropriately:


```bash
sudo sed -i 's/Provisioning.UseCloudInit=n/Provisioning.UseCloudInit=auto/g' /etc/waagent.conf
sudo sed -i 's/Provisioning.Enabled=y/Provisioning.Enabled=n/g' /etc/waagent.conf
sudo sed -i 's/ResourceDisk.Format=y/ResourceDisk.Format=n/g' /etc/waagent.conf
sudo sed -i 's/ResourceDisk.EnableSwap=y/ResourceDisk.EnableSwap=n/g' /etc/waagent.conf
```

> [!NOTE]
> Make sure the **'udf'** module is enabled. Removing/disabling them will cause a provisioning/boot failure.  **(_Cloud-init >= 21.2 removes the udf requirement. Please read top of document for more detail)**

10. Ensure the "/etc/fstab" file references the disk using its UUID (by-uuid)

11. Remove udev rules and network adapter configuration files to avoid generating static rules for the Ethernet interface(s). These rules can cause problems when cloning a virtual machine in Microsoft Azure or Hyper-V:

```bash
sudo rm -f /etc/udev/rules.d/70-persistent-net.rules
sudo rm -f /etc/udev/rules.d/85-persistent-net-cloud-init.rules
sudo rm -f /etc/sysconfig/network/ifcfg-eth* 
```

12. It's recommended to edit the "/etc/sysconfig/network/dhcp" file and change the `DHCLIENT_SET_HOSTNAME` parameter to the following:

```config
DHCLIENT_SET_HOSTNAME="no"
```

13. In the "/etc/sudoers" file, comment out or remove the following lines if they exist:

```output
Defaults targetpw   # ask for the password of the target user i.e. root
ALL    ALL=(ALL) ALL   # WARNING! Only use this setting together with 'Defaults targetpw'!
```


14. Ensure that the SSH server is installed and configured to start at boot time.

```bash
sudo systemctl enable sshd
```

15. Make sure to clean cloud-init stage;

```bash
sudo cloud-init clean --seed --logs
```

16. Run the following commands to deprovision the virtual machine and prepare it for provisioning on Azure:

>[!NOTE] 
> If you're migrating a specific virtual machine and don't wish to create a generalized image, skip the deprovision step

```bash
sudo rm -f /var/log/waagent.log
sudo waagent -force -deprovision+user
sudo export HISTSIZE=0
sudo rm -f ~/.bash_history
```
    
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

    You can then verify the repositories have been added by running the command '`zypper lr`' again. If one of the relevant update repositories isn't enabled, enable it with the following command:

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

6. Modify the kernel boot line in your grub configuration to include other kernel parameters for Azure. To do this, open "/boot/grub/menu.lst" in a text editor and ensure that the default kernel includes the following parameters:

    ```config-grub
     console=ttyS0 earlyprintk=ttyS0 
    ```

   This option ensures all console messages are sent to the first serial port, which can assist Azure support with debugging issues. In addition, remove the following parameters from the kernel boot line if they exist:

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

    The Azure Linux Agent can automatically configure swap space using the local resource disk that is attached to the VM after provisioning on Azure. The local resource disk is a *temporary* disk and will be emptied when the VM is deprovisioned. After installing the Azure Linux Agent (see previous step), modify the following parameters in the "/etc/waagent.conf" as follows:

    ```config-conf
    ResourceDisk.Format=n
    ResourceDisk.Filesystem=ext4
    ResourceDisk.MountPoint=/mnt/resource
    ResourceDisk.EnableSwap=n
    ResourceDisk.SwapSizeMB=2048    ## NOTE: set the size to whatever you need it to be.
    ```

11. Ensure the Azure Linux Agent runs at startup:

    ```bash
    sudo systemctl enable waagent.service
    ```

12. Run the following commands to deprovision the virtual machine and prepare it for provisioning on Azure:

> [!NOTE] 
> If you're migrating a specific virtual machine and don't wish to create a generalized image, skip the deprovision step.

```bash
    sudo rm -f ~/.bash_history # Remove current user history
    sudo -i
    sudo rm -rf /var/lib/waagent/
    sudo rm -f /var/log/waagent.log
    sudo waagent -force -deprovision+user
    sudo rm -f ~/.bash_history # Remove root user history
    sudo export HISTSIZE=0
```

13. Click **Action -> Shut Down** in Hyper-V Manager. Your Linux VHD is now ready to be [**uploaded to Azure**](./upload-vhd.md#option-1-upload-a-vhd).

## Next steps

You're now ready to use your SUSE Linux virtual hard disk to create new virtual machines in Azure. If this is the first time that you're uploading the .vhd file to Azure, see [Create a Linux VM from a custom disk](upload-vhd.md#option-1-upload-a-vhd).
