---
title: Create and upload an Oracle Linux VHD 
description: Learn to create and upload an Azure virtual hard disk (VHD) that contains an Oracle Linux operating system.
author: srijang
ms.service: virtual-machines
ms.collection: linux
ms.subservice: oracle
ms.workload: infrastructure-services
ms.custom: devx-track-linux
ms.topic: how-to
ms.date: 11/09/2021
ms.author: srijangupta
ms.reviewer: mattmcinnes
---

# Prepare an Oracle Linux virtual machine for Azure

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Flexible scale sets 

This article assumes that you've already installed an Oracle Linux operating system to a virtual hard disk. Multiple tools exist to create .vhd files, for example a virtualization solution such as Hyper-V. For instructions, see [Install the Hyper-V Role and Configure a Virtual Machine](/previous-versions/windows/it-pro/windows-server-2012-R2-and-2012/hh846766(v=ws.11)).

## Oracle Linux installation notes
* See also [General Linux Installation Notes](create-upload-generic.md#general-linux-installation-notes) for more tips on preparing Linux for Azure.
* Hyper-V and Azure support Oracle Linux with either the Unbreakable Enterprise Kernel (UEK) or the Red Hat Compatible Kernel.
* Oracle's UEK2 isn't supported on Hyper-V and Azure as it doesn't include the required drivers.
* The VHDX format is not supported in Azure, only **fixed VHD**.  You can convert the disk to VHD format using Hyper-V Manager or the convert-vhd cmdlet.
* **Kernel support for mounting UDF file systems is required.** At first boot on Azure, the provisioning configuration is passed to the Linux VM via UDF-formatted media that is attached to the guest. The Azure Linux agent must be able to mount the UDF file system to read its configuration and provision the VM.
* When installing the Linux system, we recommend that you use standard partitions rather than LVM (often the default for many installations). These standard partitions avoid LVM name conflicts with cloned VMs, particularly if an OS disk ever needs to be attached to another VM for troubleshooting. [LVM](/previous-versions/azure/virtual-machines/linux/configure-lvm) or [RAID](/previous-versions/azure/virtual-machines/linux/configure-raid) may be used on data disks if preferred.
* Linux kernel versions earlier than 2.6.37 don't support NUMA on Hyper-V with larger VM sizes. This issue primarily impacts older distributions using the upstream Red Hat 2.6.32 kernel and was fixed in Oracle Linux 6.6 and later.
* Don't configure a swap partition on the OS disk.
* All VHDs on Azure must have a virtual size aligned to 1 MB. When converting from a raw disk to VHD, you must ensure that the raw disk size is a multiple of 1 MB before conversion. See [Linux Installation Notes](create-upload-generic.md#general-linux-installation-notes) for more information.
* Make sure that the `Addons` repository is enabled. Edit the file `/etc/yum.repos.d/public-yum-ol6.repo`(Oracle Linux 6) or `/etc/yum.repos.d/public-yum-ol7.repo`(Oracle Linux 7), and change the line `enabled=0` to `enabled=1` under **[ol6_addons]** or **[ol7_addons]** in this file.

## Oracle Linux 6.X 

> [!IMPORTANT]
> Keep in consideration Oracle Linux 6.x is already EOL. Oracle Linux version 6.10 has available [ELS support](https://www.oracle.com/a/ocom/docs/linux/oracle-linux-extended-support-ds.pdf), which [will end on 07/2024](https://www.oracle.com/a/ocom/docs/elsp-lifetime-069338.pdf).

You must complete specific configuration steps in the operating system for the virtual machine to run in Azure.

1. In the center pane of Hyper-V Manager, select the virtual machine.
2. Click **Connect** to open the window for the virtual machine.
3. Uninstall NetworkManager by running the following command:

    ```bash
    sudo rpm -e --nodeps NetworkManager
    ```

   > [!NOTE]
   > If the package isn't already installed, this command fails with an error message. This messages is expected.

4. Create a file named **network** in the `/etc/sysconfig/` directory that contains the following text:

    ```config   
    NETWORKING=yes
    HOSTNAME=localhost.localdomain
    ```

5. Create a file named **ifcfg-eth0** in the `/etc/sysconfig/network-scripts/` directory that contains the following text:

    ```config
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

8. Install python-pyasn1 by running the following command:

    ```bash
    sudo yum install python-pyasn1
    ```

9. Modify the kernel boot line in your grub configuration to include more kernel parameters for Azure. To do this open "/boot/grub/menu.lst" in a text editor and ensure that the kernel includes the following parameters:

    ```config-grub
    console=ttyS0 earlyprintk=ttyS0 
    ```

   This setting ensures all console messages are sent to the first serial port, which can assist Azure support with debugging issues.
   
   In addition to the above, we recommend to *remove* the following parameters:

    ```config-grub
    rhgb quiet crashkernel=auto
    ```

   Graphical and quiet boot aren't useful in a cloud environment where we want all the logs to be sent to the serial port.
   
   The `crashkernel` option may be left configured if desired, but note that this parameter reduces the amount of available memory in the VM by 128 MB or more, which may be problematic on the smaller VM sizes.

10. Ensure that the SSH server is installed and configured to start at boot time.  This is usually the default.
11. Install the Azure Linux Agent by running the following command. The latest version is 2.0.15.

    ```bash
    sudo yum install WALinuxAgent
    ```

    Installing the WALinuxAgent package removes the NetworkManager and NetworkManager-gnome packages if they weren't already removed as described in step 2.

12. Don't create swap space on the OS disk.
    
    The Azure Linux Agent can automatically configure swap space using the local resource disk that is attached to the VM after provisioning on Azure. The local resource disk is a *temporary* disk and might be emptied when the VM is deprovisioned. After installing the Azure Linux Agent (see previous step), modify the following parameters in /etc/waagent.conf appropriately:

    ```config-conf
    ResourceDisk.Format=y
    ResourceDisk.Filesystem=ext4
    ResourceDisk.MountPoint=/mnt
    ResourceDisk.EnableSwap=y
    ResourceDisk.SwapSizeMB=2048    ## NOTE: set this to whatever you need it to be.
    ```

13. Run the following commands to deprovision the virtual machine and prepare it for provisioning on Azure:

    ```bash
    sudo waagent -force -deprovision
    sudo export HISTSIZE=0
    sudo logout
    ```

14. Click **Action -> Shut Down** in Hyper-V Manager. Your Linux VHD is now ready to be [**uploaded to Azure**](./upload-vhd.md#option-1-upload-a-vhd).

---
## Oracle Linux 7.0 and later
**Changes in Oracle Linux 7**

Preparing an Oracle Linux 7 virtual machine for Azure is similar to Oracle Linux 6, however there are several significant  differences worth noting:

* Azure supports Oracle Linux with either the Unbreakable Enterprise Kernel (UEK) or the Red Hat Compatible Kernel. Oracle Linux with UEK is recommended.
* The NetworkManager package no longer conflicts with the Azure Linux agent. This package is installed by default, and we recommend that it's not removed.
* GRUB2 is now used as the default bootloader, so the procedure for editing kernel parameters has changed (see below).
* XFS is now the default file system. The ext4 file system can still be used if desired.

**Configuration steps**

1. In Hyper-V Manager, select the virtual machine.
2. Click **Connect** to open a console window for the virtual machine.
3. Create a file named **network** in the `/etc/sysconfig/` directory that contains the following text:

    ```config
    NETWORKING=yes
    HOSTNAME=localhost.localdomain
    ```

4. Create a file named **ifcfg-eth0** in the `/etc/sysconfig/network-scripts/` directory that contains the following text:

    ```config
    DEVICE=eth0
    ONBOOT=yes
    BOOTPROTO=dhcp
    TYPE=Ethernet
    USERCTL=no
    PEERDNS=yes
    IPV6INIT=no
    ```

5. Modify udev rules to avoid generating static rules for the Ethernet interface(s). These rules can cause problems when cloning a virtual machine in Microsoft Azure or Hyper-V:

    ```bash
    sudo ln -s /dev/null /etc/udev/rules.d/75-persistent-net-generator.rules
    ```

6. Ensure the network service starts at boot time by running the following command:

    ```bash
    sudo chkconfig network on
    ```

7. Install the python-pyasn1 package by running the following command:

    ```bash
    sudo yum install python-pyasn1
    ```

8. Run the following command to clear the current yum metadata and install any updates:

    ```bash 
    sudo yum clean all
    sudo yum -y update
    ```

9. Modify the kernel boot line in your grub configuration to include more kernel parameters for Azure. To do this open "/etc/default/grub" in a text editor and edit the `GRUB_CMDLINE_LINUX` parameter, for example:

    ```config-grub
    GRUB_CMDLINE_LINUX="console=ttyS0 earlyprintk=ttyS0 net.ifnames=0"
    ```

   This will also ensure all console messages are sent to the first serial port, which can assist Azure support with debugging issues. It also turns off the naming conventions for NICs in Oracle Linux 7 with the Unbreakable Enterprise Kernel. In addition to the above, it is recommended to *remove* the following parameters:

    ```config-grub
       rhgb quiet crashkernel=auto
    ```
 
   Graphical and quiet boot aren't useful in a cloud environment where we want all the logs to be sent to the serial port.
   
   The `crashkernel` option may be left configured if desired, but note that this parameter will reduce the amount of available memory in the VM by 128 MB or more, which may be problematic on the smaller VM sizes.

10. Once you're done editing "/etc/default/grub" per above, run the following command to rebuild the grub configuration:

    ```bash
    sudo grub2-mkconfig -o /boot/grub2/grub.cfg
    ```

11. Ensure that the SSH server is installed and configured to start at boot time.  This is usually the default.
12. Install the Azure Linux Agent and dependencies:

    ```bash
    sudo yum install WALinuxAgent
    sudo systemctl enable waagent
    ```

13. Install cloud-init to handle the provisioning

    ```bash
    sudo yum install -y cloud-init cloud-utils-growpart gdisk hyperv-daemons
    ```

14. Configure waagent for cloud-init

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

15. Swap configuration. Don't create swap space on the operating system disk.

     Previously, the Azure Linux Agent was used automatically to configure swap space by using the local resource disk that is attached to the virtual machine after the virtual   machine is provisioned on Azure. However, this is now handled by cloud-init, you **must not** use the Linux Agent to format the resource disk create the swap file, modify the following parameters in `/etc/waagent.conf` appropriately:

    ```bash
    sudo sed -i 's/ResourceDisk.Format=y/ResourceDisk.Format=n/g' /etc/waagent.conf
    sudo sed -i 's/ResourceDisk.EnableSwap=y/ResourceDisk.EnableSwap=n/g' /etc/waagent.conf
    ```

     If you want mount, format, and create swap you can either:
     * Pass this in as a cloud-init config every time you create a VM
     * Use a cloud-init directive baked into the image that will do this every time the VM is created:

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

15. Run the following commands to deprovision the virtual machine and prepare it for provisioning on Azure:

    ```bash
    sudo cloud-init clean
    sudo rm -f /var/log/waagent.log
    sudo waagent -force -deprovision
    sudo rm -f ~/.bash_history
    sudo export HISTSIZE=0
    ```

    > [!NOTE]
    > If you're migrating a specific virtual machine and don't want to create a generalized image, skip the deprovision step.

16. Click **Action -> Shut Down** in Hyper-V Manager. Your Linux VHD is now ready to be [**uploaded to Azure**](./upload-vhd.md#option-1-upload-a-vhd).

## Next steps
You're now ready to use your Oracle Linux .vhd to create new virtual machines in Azure. If this is the first time that you're uploading the .vhd file to Azure, see [Create a Linux VM from a custom disk](upload-vhd.md#option-1-upload-a-vhd).
