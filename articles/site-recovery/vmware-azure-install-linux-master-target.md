---
title: Install a master target server for Linux VM failback with Azure Site Recovery
description: Learn how to set up a Linux master target server for failback to an on-premises site during disaster recovery of VMware VMs to Azure using Azure Site Recovery.
services: site-recovery
author: Jeronika-MS
ms.service: azure-site-recovery
ms.topic: how-to
ms.author: v-gajeronika
ms.reviewer: v-gajeronika
ms.date: 02/13/2026
ms.custom:
  - linux-related-content
  - sfi-image-nochange
# Customer intent: "As a system administrator, I want to install a Linux master target server for failback to an on-premises site, so that I can ensure a smooth disaster recovery process for VMware virtual machines migrated to Azure."
---


# Install a Linux master target server for failback

After you fail over your virtual machines to Azure, you can fail back the virtual machines to the on-premises site. To fail back, you need to reprotect the virtual machine from Azure to the on-premises site. For this process, you need an on-premises master target server to receive the traffic.

If your protected virtual machine is a Windows virtual machine, you need a Windows master target. For a Linux virtual machine, you need a Linux master target. Read the following steps to learn how to create and install a Linux master target.

> [!IMPORTANT]
> Master target server on LVM isn't supported.

## Overview
This article provides instructions for how to install a Linux master target.

Post comments or questions at the end of this article or on the [Microsoft Q&A question page for Azure Recovery Services](/answers/topics/azure-site-recovery.html).

## Prerequisites

* To choose the host on which to deploy the master target, determine if the failback is going to be to an existing on-premises virtual machine or to a new virtual machine.
  * For an existing virtual machine, the host of the master target must have access to the data stores of the virtual machine.
  * If the on-premises virtual machine doesn't exist (in case of Alternate Location Recovery), the failback virtual machine is created on the same host as the master target. You can choose any ESXi host to install the master target.
* The master target must be on a network that can communicate with the process server and the configuration server.
* The version of the master target must be equal to or earlier than the versions of the process server and the configuration server. For example, if the version of the configuration server is 9.4, the version of the master target can be 9.4 or 9.3 but not 9.5.
* The master target can only be a VMware virtual machine and not a physical server.

> [!NOTE]
> Don't turn on Storage vMotion on any management components such as a master target. If the master target moves after a successful reprotect, the virtual machine disks (VMDKs) can't be detached. In this case, failback fails.

## Sizing guidelines for creating master target server

Create the master target server in accordance with the following sizing guidelines:
- **RAM**: 6 GB or more
- **OS disk size**: 100 GB or more (to install OS)
- **Additional disk size for retention drive**: 1 TB
- **CPU cores**: 4 cores or more
- **Kernel**: 4.16.*

## Deploy the master target server

### Install Ubuntu 16.04.2 Minimal

>[!IMPORTANT]
>Ubuntu 16.04 (Xenial Xerus) has reached its end of life and is no longer supported by Canonical or the Ubuntu community. This means that no security updates or bug fixes will be provided for this version of Ubuntu. Continuing to use Ubuntu 16.04 may expose your system to potential security vulnerabilities or software compatibility issues. We strongly recommend upgrading to a supported version of Ubuntu, such as Ubuntu 18.04 or Ubuntu 20.04.

Take the following the steps to install the Ubuntu 16.04.2 64-bit
operating system.

1.   Go to the [download link](http://old-releases.ubuntu.com/releases/16.04.2/ubuntu-16.04.2-server-amd64.iso), choose the closest mirror and download an Ubuntu 16.04.2 minimal 64-bit ISO.
Keep an Ubuntu 16.04.2 minimal 64-bit ISO in the DVD drive and start the system.

> [!NOTE]
> From, version [9.42](https://support.microsoft.com/en-us/topic/update-rollup-55-for-azure-site-recovery-kb5003408-b19c8190-5f88-43ea-85b1-d9e0cc5ca7e8), Ubuntu 20.04 operating system is supported for Linux master target server.If you wish to use the latest OS, proceed setting up the machine with Ubuntu 20.04 iso image.

1.  Select **English** as your preferred language, and then select **Enter**.

    :::image type="content" source="./media/vmware-azure-install-linux-master-target/image1.png" alt-text="Select a language.":::
1. Select **Install Ubuntu Server**, and then select **Enter**.

    :::image type="content" source="./media/vmware-azure-install-linux-master-target/image2.png" alt-text="Select Install Ubuntu Server.":::

1.  Select **English** as your preferred language, and then select **Enter**.

    :::image type="content" source="./media/vmware-azure-install-linux-master-target/image3.png" alt-text="Select English as your preferred language.":::

1. Select the appropriate option from the **Time Zone** options list, and then select **Enter**.

    :::image type="content" source="./media/vmware-azure-install-linux-master-target/image4.png" alt-text="Select the correct time zone.":::

1. Select **No** (the default option), and then select **Enter**.

     :::image type="content" source="./media/vmware-azure-install-linux-master-target/image5.png" alt-text="Configure the keyboard.":::
1. Select **English (US)** as the country/region of origin for the keyboard, and then select **Enter**.

1. Select **English (US)** as the keyboard layout, and then select **Enter**.

1. Enter the hostname for your server in the **Hostname** box, and then select **Continue**.

1. To create a user account, enter the user name, and then select **Continue**.

      :::image type="content" source="./media/vmware-azure-install-linux-master-target/image9.png" alt-text="Create a user account.":::

1. Enter the password for the new user account, and then select **Continue**.

1.  Confirm the password for the new user, and then select **Continue**.

    :::image type="content" source="./media/vmware-azure-install-linux-master-target/image11.png" alt-text="Confirm the passwords.":::

1.  In the next selection for encrypting your home directory, select **No** (the default option), and then select **Enter**.

1. If the time zone displayed is correct, select **Yes** (the default option), and then select **Enter**. To reconfigure your time zone, select **No**.

1. From the partitioning method options, select **Guided - use entire disk**, and then select **Enter**.

     :::image type="content" source="./media/vmware-azure-install-linux-master-target/image14.png" alt-text="Select the partitioning method option.":::

1.  Select the appropriate disk from the **Select disk to partition** options, and then select **Enter**.

    :::image type="content" source="./media/vmware-azure-install-linux-master-target/image15.png" alt-text="Select the disk.":::

1.  Select **Yes** to write the changes to disk, and then select **Enter**.

    :::image type="content" source="./media/vmware-azure-install-linux-master-target/image16-ubuntu.png" alt-text="Select the default option.":::

1.  In the configure proxy selection, select the default option, select **Continue**, and then select **Enter**.

     :::image type="content" source="./media/vmware-azure-install-linux-master-target/image17-ubuntu.png" alt-text="Screenshot that shows where to select Continue and then select Enter.":::

1.  Select **No automatic updates** option in the selection for managing upgrades on your system, and then select **Enter**.

     :::image type="content" source="./media/vmware-azure-install-linux-master-target/image18-ubuntu.png" alt-text="Select how to manage upgrades.":::

    > [!WARNING]
    > Because the Azure Site Recovery master target server requires a very specific version of Ubuntu, you must ensure that the kernel upgrades are disabled for the virtual machine. If they're enabled, any regular upgrades cause the master target server to malfunction. Make sure you select the **No automatic updates** option.

1.  Select default options. If you want OpenSSH for SSH connect, select the **OpenSSH server** option, and then select **Continue**.

    :::image type="content" source="./media/vmware-azure-install-linux-master-target/image19-ubuntu.png" alt-text="Select software.":::

1. In the selection for installing the GRUB boot loader, Select **Yes**, and then select **Enter**.

    :::image type="content" source="./media/vmware-azure-install-linux-master-target/image20.png" alt-text="GRUB boot installer.":::


1. Select the appropriate device for the boot loader installation (preferably **/dev/sda**), and then select **Enter**.

    :::image type="content" source="./media/vmware-azure-install-linux-master-target/image21.png" alt-text="Select appropriate device.":::

1. Select **Continue**, and then select **Enter** to finish the installation.

    :::image type="content" source="./media/vmware-azure-install-linux-master-target/image22.png" alt-text="Finish the installation.":::

1. After the installation finishes, sign in to the VM with the new user credentials. (Refer to **Step 10** for more information.)

1. Use the steps that are described in the following screenshot to set the ROOT user password. Then sign in as ROOT user.

    :::image type="content" source="./media/vmware-azure-install-linux-master-target/image23.png" alt-text="Set the ROOT user password.":::


### Configure the machine as a master target server

To get the ID for each SCSI hard disk in a Linux virtual machine, enable the **disk.EnableUUID = TRUE** parameter. To enable this parameter, follow these steps:

1. Shut down your virtual machine.

1. Right-click the entry for the virtual machine in the left pane, and then select **Edit Settings**.

1. Select the **Options** tab.

1. In the left pane, select **Advanced** > **General**, and then select the **Configuration Parameters** button on the lower-right part of the screen.

    :::image type="content" source="./media/vmware-azure-install-linux-master-target/image24-ubuntu.png" alt-text="Open configuration parameter.":::

    The **Configuration Parameters** option isn't available when the machine is running. To make this tab active, shut down the virtual machine.

1. Check if a row with **disk.EnableUUID** already exists.

   - If the value exists and is set to **False**, change the value to **True**. (The values aren't case-sensitive.)

   - If the value exists and is set to **True**, select **Cancel**.

   - If the value doesn't exist, select **Add Row**.

   - In the name column, add **disk.EnableUUID**, and then set the value to **TRUE**.

     :::image type="content" source="./media/vmware-azure-install-linux-master-target/image25.png" alt-text="Checking whether disk.EnableUUID already exists.":::

#### Disable kernel upgrades

Azure Site Recovery master target server requires a specific version of the Ubuntu. Ensure that the kernel upgrades are disabled for the virtual machine. If kernel upgrades are enabled, it can cause the master target server to malfunction.

#### Download and install extra packages

> [!NOTE]
> Make sure that you have Internet connectivity to download and install extra packages. If you don't have Internet connectivity, you need to manually find these Deb packages and install them.

 ```bash
    sudo apt-get install -y multipath-tools lsscsi python-pyasn1 lvm2 kpartx
 ```

> [!NOTE]
> From version [9.42](https://support.microsoft.com/en-us/topic/update-rollup-55-for-azure-site-recovery-kb5003408-b19c8190-5f88-43ea-85b1-d9e0cc5ca7e8), the Ubuntu 20.04 operating system is supported for Linux master target server.
> If you want to use the latest OS, upgrade the operating system to Ubuntu 20.04 before proceeding. To upgrade the operating system later, you can follow the instructions listed [here](#upgrade-os-of-master-target-server-from-ubuntu-1604-to-ubuntu-2004).

### Get the installer for setup

If your master target has internet connectivity, use the following steps to download the installer. Otherwise, copy the installer from the process server and then install it.

#### Download the master target installation packages

[Download](https://aka.ms/latestlinuxmobsvc) the latest Linux master target installation bits for Ubuntu 20.04.

[Download](https://aka.ms/oldlinuxmobsvc) the older Linux master target installation bits for Ubuntu 16.04.

> [!NOTE]
> Use the latest Ubuntu operating system version for setting up the master target server.

To download it by using Linux, type:

```bash
   sudo wget https://aka.ms/latestlinuxmobsvc -O latestlinuxmobsvc.tar.gz
```

> [!WARNING]
> Make sure that you download and unzip the installer in your home directory. If you unzip to **/usr/Local**, the installation fails.


#### Access the installer from the process server

1. On the process server, go to **C:\Program Files (x86)\Microsoft Azure Site Recovery\home\svsystems\pushinstallsvc\repository**.

1. Copy the required installer file from the process server, and save it as **latestlinuxmobsvc.tar.gz** in your home directory.


### Apply custom configuration changes

To apply custom configuration changes, use the following steps as a root user:

1. Run the following command to extract the binary.

    ```bash
       sudo tar -xvf latestlinuxmobsvc.tar.gz
    ```
    :::image type="content" source="./media/vmware-azure-install-linux-master-target/image16.png" alt-text="Screenshot of the command to run.":::

1. Run the following command to grant permission.

    ```bash
       sudo chmod 755 ./ApplyCustomChanges.sh
    ```

1. Run the following command to run the script.

    ```bash
       sudo ./ApplyCustomChanges.sh
    ```

> [!NOTE]
> Run the script only once on the server. Then, shut down the server. Restart the server after you add a disk, as described in the next section.

### Add a retention disk to the Linux master target virtual machine

Use the following steps to create a retention disk:

1. Attach a new 1-TB disk to the Linux master target virtual machine, and then start the machine.

1. Use the **multipath -ll** command to find the multipath ID of the retention disk: **multipath -ll**

    :::image type="content" source="./media/vmware-azure-install-linux-master-target/image27.png" alt-text="Multipath ID.":::

1. Format the drive, and then create a file system on the new drive: **mkfs.ext4 /dev/mapper/\<Retention disk's multipath id>**.

1. After you create the file system, mount the retention disk.

    ```bash
    sudo mkdir /mnt/retention
    sudo mount /dev/mapper/<Retention disk's multipath id> /mnt/retention
    ```

1. Create the **fstab** entry to mount the retention drive every time the system starts.

    ```bash
       sudo vi /etc/fstab
    ```

    Select **Insert** to begin editing the file. Create a new line, and then insert the following text. Edit the disk multipath ID based on the highlighted multipath ID from the previous command.

    **/dev/mapper/\<Retention disks multipath id> /mnt/retention ext4 rw 0 0**

    Select **Esc**, and then type **:wq** (write and quit) to close the editor window.

### Install the master target

> [!IMPORTANT]
> The version of the master target server must be equal to or earlier than the versions of the process server and the configuration server. If this condition isn't met, reprotect succeeds, but replication fails.


> [!NOTE]
> Before you install the master target server, check that the **/etc/hosts** file on the virtual machine contains entries that map the local hostname to the IP addresses associated with all network adapters.

1. Run the following command to install the master target.

    ```bash
    sudo ./install -q -d /usr/local/ASR -r MT -v VmWare
    ```

1. Copy the passphrase from **C:\ProgramData\Microsoft Azure Site Recovery\private\connection.passphrase** on the configuration server. Then save it as **passphrase.txt** in the same local directory by running the following command:

    ```bash
       sudo echo <passphrase> >passphrase.txt
    ```

    Example:

    ```bash
       sudo echo itUx70I47uxDuUVY >passphrase.txt`
    ```

1. Note the configuration server's IP address. Run the following command to register the server with the configuration server:

    ```bash
    sudo /usr/local/ASR/Vx/bin/UnifiedAgentConfigurator.sh -i <ConfigurationServer IP Address> -P passphrase.txt
    ```

    Example:

    ```bash
    sudo /usr/local/ASR/Vx/bin/UnifiedAgentConfigurator.sh -i 104.40.75.37 -P passphrase.txt
    ```

Wait until the script finishes. If the master target registers successfully, the master target appears on the **Site Recovery Infrastructure** page of the portal.


#### Install the master target by using interactive installation

1. Run the following command to install the master target. For the agent role, choose **master target**.

    ```bash
    sudo ./install
    ```

1. Choose the default location for installation, and then select **Enter** to continue.

    :::image type="content" source="./media/vmware-azure-install-linux-master-target/image17.png" alt-text="Choosing a default location for installation of master target.":::

After the installation finishes, register the configuration server by using the command line.

1. Note the IP address of the configuration server. You need it in the next step.

1. Run the following command to register the server with the configuration server:

    ```bash
    sudo /usr/local/ASR/Vx/bin/UnifiedAgentConfigurator.sh
    ```

    Wait until the script finishes. If the master target is registered successfully, the master target appears on the **Site Recovery Infrastructure** page of the portal.


### Install VMware tools or open-vm-tools on the master target server

Install VMware tools or open-vm-tools on the master target server so it can discover the data stores. If you don't install the tools, the reprotected screen doesn't list the data stores. After you install VMware tools, restart the server.

### Upgrade the master target server

Running the installer automatically detects that the agent is installed on the master target server. To complete the upgrade, follow these steps:
1. Copy the tar.gz file from the configuration server to the Linux master target server.
1. Run this command to validate the version you're running: `cat /usr/local/.vx_version`.
1. Extract the tar file: `tar -xvf latestlinuxmobsvc.tar.gz`.
1. Give permissions to execute changes: `chmod 755 ./install`.
1. Run the upgrade script: `sudo ./install`.
1. The installer detects the agent is installed on the master target server. To upgrade, select **Y**.
1. Validate the agent is running the new version: `cat /usr/local/.vx_version`.

After the setup completes, check the version of the master target server by using the following command:

```bash
   sudo cat /usr/local/.vx_version
```

You see that the **Version** field gives the version number of the master target server.

## Upgrade OS of master target server from Ubuntu 16.04 to Ubuntu 20.04

From 9.42 version, ASR supports Linux master target server on Ubuntu 20.04. To upgrade the OS of existing master target server,

1. Ensure the Linux scale-out master target server isn't used for re-protect operation of any protected VM.
1. Uninstall master target server installer from the machine.
1. Upgrade the operating system from Ubuntu 16.04 to 20.04.
1. After successful upgrade OS, reboot the machine.
1. [Download the latest installer](#download-the-master-target-installation-packages) and follow the instructions given [above](#install-the-master-target) to complete installation of master target server.


## Common issues

* Make sure you don't turn on Storage vMotion on any management components such as a master target. If the master target moves after a successful reprotect, the virtual machine disks (VMDKs) can't be detached. In this case, failback fails.

* The master target shouldn't have any snapshots on the virtual machine. If there are snapshots, failback fails.

* Due to some custom NIC configurations, the network interface is disabled during startup, and the master target agent can't initialize. Make sure that the following properties are correctly set. Check these properties in the Ethernet card file's `/etc/network/interfaces`.
    * `auto eth0`
    * `iface eth0 inet dhcp`

    Restart the networking service by using the following command: <br>

```bash
   sudo systemctl restart networking
```

## Next steps
After the installation and registration of the master target has finished, you can see the master target appear on the **master target** section in **Site Recovery Infrastructure**, under the configuration server overview.

You can now proceed with [reprotection](vmware-azure-reprotect.md), followed by failback.
