---
title: How to install a Linux master target server for failover from Azure to on-premises| Microsoft Docs
description: Before reprotecting a Linux virtual machine, you need a Linux master target server. Learn how to install one.
services: site-recovery
documentationcenter: ''
author: ruturaj
manager: gauravd
editor: ''

ms.assetid: 44813a48-c680-4581-a92e-cecc57cc3b1e
ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload:
ms.date: 08/11/2017
ms.author: ruturajd

---
# Install a Linux master target server
After you fail over your virtual machines, you can fail back the virtual machines to the on-premises site. To fail back, you need to reprotect the virtual machine from Azure to the on-premises site. For this process, you need an on-premises master target server to receive the traffic. 

If your protected virtual machine is a Windows virtual machine, then you need a Windows master target. For a Linux virtual machine, you need a Linux master target. Read the following steps to learn how to create and install a Linux master target.

> [!IMPORTANT]
> Starting with release of the 9.10.0 master target server, the latest master target server can be only installed on an Ubuntu 16.04 server. New installations aren't allowed on  CentOS6.6 servers. However, you can continue to upgrade your old master target servers by using the 9.10.0 version.

## Overview
This article provides instructions for how to install a Linux master target.

Post comments or questions at the end of this article or on the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).

## Prerequisites

* To choose the host on which to deploy the master target, determine if the failback is going to be to an existing on-premises virtual machine or to a new virtual machine. 
	* For an existing virtual machine, the host of the master target should have access to the data stores of the virtual machine.
	* If the on-premises virtual machine does not exist, the failback virtual machine is created on the same host as the master target. You can choose any ESXi host to install the master target.
* The master target should be on a network that can communicate with the process server and the configuration server.
* The version of the master target must be equal to or earlier than the versions of the process server and the configuration server. For example, if the version of the configuration server is 9.4, the version of the master target can be 9.4 or 9.3 but not 9.5.
* The master target can only be a VMware virtual machine and not a physical server.

## Create the master target according to the sizing guidelines

Create the master target in accordance with the following sizing guidelines:
- **RAM**: 6 GB or more
- **OS disk size**: 100 GB or more (to install CentOS6.6)
- **Additional disk size for retention drive**: 1 TB
- **CPU cores**: 4 cores or more

The following supported Ubuntu kernels are supported.


|Kernel Series  |Support up to  |
|---------|---------|
|4.4      |4.4.0-81-generic         |
|4.8      |4.8.0-56-generic         |
|4.10     |4.10.0-24-generic        |


## Deploy the master target server

### Install Ubuntu 16.04.2 Minimal

Take the following the steps to install the Ubuntu 16.04.2 64-bit
operating system.

**Step 1:** Go to the [download link](https://www.ubuntu.com/download/server/thank-you?version=16.04.2&architecture=amd64) and choose the closest mirror from which download an Ubuntu 16.04.2 minimal 64-bit ISO.

Keep an Ubuntu 16.04.2 minimal 64-bit ISO in the DVD drive and start the system.

**Step 2:** Select **English** as your preferred language, and then select **Enter**.

![Select a language](./media/site-recovery-how-to-install-linux-master-target/ubuntu/image1.png)

**Step 3:** Select **Install Ubuntu Server**, and then select **Enter**.

![Select Install Ubuntu Server](./media/site-recovery-how-to-install-linux-master-target/ubuntu/image2.png)

**Step 4:** Select **English** as your preferred language, and then select **Enter**.

![Select English as your preferred language](./media/site-recovery-how-to-install-linux-master-target/ubuntu/image3.png)

**Step 5:** Select the appropriate option from the **Time Zone** options list, and then select **Enter**.

![Select the correct time zone](./media/site-recovery-how-to-install-linux-master-target/ubuntu/image4.png)

**Step 6:** Select **No** (the default option), and then select **Enter**.


![Configure the keyboard](./media/site-recovery-how-to-install-linux-master-target/ubuntu/image5.png)

**Step 7:** Select **English (US)** as the country of origin for the keyboard, and then select **Enter**.

![Select US as the country of origin](./media/site-recovery-how-to-install-linux-master-target/ubuntu/image6.png)

**Step 8:** Select **English (US)** as the keyboard layout, and then select **Enter**.

![Select US English as the keyboard layout](./media/site-recovery-how-to-install-linux-master-target/ubuntu/image7.png)

**Step 9:** Enter the hostname for your server in the **Hostname** box, and then select **Continue**.

![Enter the hostname for your server](./media/site-recovery-how-to-install-linux-master-target/ubuntu/image8.png)

**Step 10:** To create a user account, enter the user name, and then select **Continue**.

![Create a user account](./media/site-recovery-how-to-install-linux-master-target/ubuntu/image9.png)

**Step 11:** Enter the password for the new user account, and then select **Continue**.

![Enter the password](./media/site-recovery-how-to-install-linux-master-target/ubuntu/image10.png)

**Step 12:** Confirm the password for the new user, and then select **Continue**.

![Confirm the passwords](./media/site-recovery-how-to-install-linux-master-target/ubuntu/image11.png)

**Step 13:** Select **No** (the default option), and then select **Enter**.

![Set up users and passwords](./media/site-recovery-how-to-install-linux-master-target/ubuntu/image12.png)

**Step 14:** If the time zone that's displayed is correct, select **Yes** (the default option), and then select **Enter**.

To reconfigure your time zone, select **No**.

![Configure the clock](./media/site-recovery-how-to-install-linux-master-target/ubuntu/image13.png)

**Step 15:** From the partitioning method options, select **Guided - use entire disk**, and then select **Enter**.

![Select the partitioning method option](./media/site-recovery-how-to-install-linux-master-target/ubuntu/image14.png)

**Step 16:** Select the appropriate disk from the **Select disk to partition** options, and then select **Enter**.


![Select the disk](./media/site-recovery-how-to-install-linux-master-target/ubuntu/image15.png)

**Step 17:** Select **Yes** to write the changes to disk, and then select **Enter**.

![Write the changes to disk](./media/site-recovery-how-to-install-linux-master-target/ubuntu/image16.png)

**Step 18:** Select the default option, select **Continue**, and then select **Enter**.

![Select the default option](./media/site-recovery-how-to-install-linux-master-target/ubuntu/image17.png)

**Step 19:** Select the appropriate option for managing upgrades on your system, and then select **Enter**.

![Select how to manage upgrades](./media/site-recovery-how-to-install-linux-master-target/ubuntu/image18.png)

> [!WARNING]
> Because the Azure Site Recovery master target server requires a very specific version of the Ubuntu, you need to ensure that the kernel upgrades are disabled for the virtual machine. If they are enabled, then any regular upgrades cause the master target server to malfunction. Make sure you select the **No automatic updates** option.


**Step 20:** Select default options. If you want openSSH for SSH connect, select the **OpenSSH server** option, and then select **Continue**.

![Select software](./media/site-recovery-how-to-install-linux-master-target/ubuntu/image19.png)

**Step 21:** Select **Yes**, and then select **Enter**.

![Isntall the GRUB boot loader](./media/site-recovery-how-to-install-linux-master-target/ubuntu/image20.png)

**Step 22:** Select the appropriate device for the boot loader installation (preferably **/dev/sda**), and then select **Enter**.

![Select a device for boot loader installation](./media/site-recovery-how-to-install-linux-master-target/ubuntu/image21.png)

**Step 23:** Select **Continue**, and then select **Enter** to finish the installation.

![Finish the installation](./media/site-recovery-how-to-install-linux-master-target/ubuntu/image22.png)

After the installation has finished, sign in to the VM with the new user credentials. (Refer to **Step 10** for more information.)

Take the steps that are described in the following screenshot to set the ROOT user password. Then sign in as ROOT user.

![Set the ROOT user password](./media/site-recovery-how-to-install-linux-master-target/ubuntu/image23.png)


### Prepare the machine for configuration as a master target server
Next, prepare the machine for configuration as a master target server.

To get the ID for each SCSI hard disk in a Linux virtual machine,
 enable the **disk.EnableUUID = TRUE** parameter.

To enable this parameter, take the following steps:

1. Shut down your virtual machine.

2. Right-click the entry for the virtual machine in the left pane, and then select **Edit Settings**.

3. Select the **Options** tab.

4. In the left pane, select **Advanced** > **General**, and then select the **Configuration Parameters** button on the lower-right part of the screen.

	![Options tab](./media/site-recovery-how-to-install-linux-master-target/media/image20.png)

	The **Configuration Parameters** option is not available when the machine is running. To make this tab active, shut down the virtual machine.

5. See whether a row with **disk.EnableUUID** already exists.

	- If the value exists and is set to **False**, change the value to **True**. (The values are not case-sensitive.)

	- If the value exists and is set to **True**, select **Cancel**.

	- If the value does not exist, select **Add Row**.

	- In the name column, add **disk.EnableUUID**, and then set the value to **TRUE**.

	![Checking whether disk.EnableUUID already exists](./media/site-recovery-how-to-install-linux-master-target/media/image21.png)

#### Disable kernel upgrades

Azure Site Recovery master target server requires a very specific version of the Ubuntu, ensure that the kernel upgrades are disabled for the virtual machine.

If kernel upgrades are enabled, then any regular upgrades cause the master target server to malfunction.

#### Download and install additional packages

> [!NOTE]
> Make sure that you have Internet connectivity to download and install additional packages. If you don't have Internet connectivity, you need to manually find these RPM packages and install them.

```
apt-get install -y multipath-tools lsscsi python-pyasn1 lvm2 kpartx
```

### Get the installer for setup

If your master target has Internet connectivity, you can use the following steps to download the installer. Otherwise, you can copy the installer from the process server and then install it.

#### Download the master target installation packages

[Download the latest Linux master target installation bits](https://aka.ms/latestlinuxmobsvc).

To download it by using Linux, type:

```
wget https://aka.ms/latestlinuxmobsvc -O latestlinuxmobsvc.tar.gz
```

Make sure that you download and unzip the installer in your home directory. If you unzip to **/usr/Local**, then the installation  fails.


#### Access the installer from the process server

1. On the process server, go to **C:\Program Files (x86)\Microsoft Azure Site Recovery\home\svsystems\pushinstallsvc\repository**.

2. Copy the required installer file from the process server, and save it as **latestlinuxmobsvc.tar.gz** in your home directory.


### Apply custom configuration changes

To apply custom configuration changes, use the following steps:


1. Run the following command to untar the binary.
	```
	tar -zxvf latestlinuxmobsvc.tar.gz
	```
	![Screenshot of the command to run](./media/site-recovery-how-to-install-linux-master-target/image16.png)

2. Run the following command to give permission.
	```
	chmod 755 ./ApplyCustomChanges.sh
	```

3. Run the following command to run the script.
	```
	./ApplyCustomChanges.sh
	```
> [!NOTE]
> Run the script only once on the server. Shut down the server. Then restart the server after you add a disk, as described in the next section.

### Add a retention disk to the Linux master target virtual machine

Use the following steps to create a retention disk:

1. Attach a new 1-TB disk to the Linux master target virtual machine, and then start the machine.

2. Use the **multipath -ll** command to learn the multipath ID of the retention disk.

	```
	multipath -ll
	```
	![The multipath ID of the retention disk](./media/site-recovery-how-to-install-linux-master-target/media/image22.png)

3. Format the drive, and then create a file system on the new drive.

	```
	mkfs.ext4 /dev/mapper/<Retention disk's multipath id>
	```
	![Creating a file system on the drive](./media/site-recovery-how-to-install-linux-master-target/media/image23.png)

4. After you create the file system, mount the retention disk.
	```
	mkdir /mnt/retention
	mount /dev/mapper/<Retention disk's multipath id> /mnt/retention
	```
	![Mounting the retention disk](./media/site-recovery-how-to-install-linux-master-target/media/image24.png)

5. Create the **fstab** entry to mount the retention drive every time the system starts.
	```
	vi /etc/fstab
	```
	Select **Insert** to begin editing the file. Create a new line, and then insert the following text. Edit the disk multipath ID based on the highlighted multipath ID from the previous command.

	**/dev/mapper/<Retention disks multipath id> /mnt/retention ext4 rw 0 0**

	Select **Esc**, and then type **:wq** (write and quit) to close the editor window.

### Install the master target

> [!IMPORTANT]
> The version of the master target server must be equal to or earlier than the versions of the process server and the configuration server. If this condition is not met, reprotect succeeds, but replication fails.


> [!NOTE]
> Before you install the master target server, check that the **/etc/hosts** file on the virtual machine contains entries that map the local hostname to the IP addresses that are associated with all network adapters.

1. Copy the passphrase from **C:\ProgramData\Microsoft Azure Site Recovery\private\connection.passphrase** on the configuration server. Then save it as **passphrase.txt** in the same local directory by running the following command:

	```
	echo <passphrase> >passphrase.txt
	```
	Example: 
	
	```
	echo itUx70I47uxDuUVY >passphrase.txt
	```

2. Note the configuration server's IP address. You need it in the next step.

3. Run the following command to install the master target server and register the server with the configuration server.

 	```
	./install -q -d /usr/local/ASR -r MT -v VmWare
	/usr/local/ASR/Vx/bin/UnifiedAgentConfigurator.sh -i <ConfigurationServer IP Address> -P passphrase.txt
	```

	Example: 
	
	```
	/usr/local/ASR/Vx/bin/UnifiedAgentConfigurator.sh -i 104.40.75.37 -P passphrase.txt
	```

	Wait until the script finishes. If the master target registers sucessfully, the master target is listed on the **Site Recovery Infrastructure** page of the portal.


#### Install the master target by using interactive installation

1. Run the following command to install the master target. For the agent role, choose **Master Target**.

	```
	./install
	```

2. Choose the default location for installation, and then select **Enter** to continue.

	![Choosing a default location for installation of master target](./media/site-recovery-how-to-install-linux-master-target/image17.png)

After the installation has finished, register the configuration server by using the command line.

1. Note the IP address of the configuration server. You need it in the next step.

2. Run the following command to install the master target server and register the server with the configuration server.

	```
	./install -q -d /usr/local/ASR -r MT -v VmWare
	/usr/local/ASR/Vx/bin/UnifiedAgentConfigurator.sh -i <ConfigurationServer IP Address> -P passphrase.txt
	```
	Example: 

	```
	/usr/local/ASR/Vx/bin/UnifiedAgentConfigurator.sh -i 104.40.75.37 -P passphrase.txt
	```

   Wait until the script finishes. If the master target is registered succesfully, the master target is listed on the **Site Recovery Infrastructure** page of the portal.


### Upgrade the master target

Run the installer. It automatically detects that the agent is installed on the master target. To upgrade, select **Y**.  After the setup has been completed, check the version of the master target installed by using the following command.

	```
	cat /usr/local/.vx_version
	```

You can see that the **Version** field gives the version number of the master target.

### Install VMware tools on the master target server

You need to install VMware tools on the master target so that it can discover the data stores. If the tools are not installed, the reprotect screen isn't listed in the data stores. After installation of the VMware tools, you need to restart.

## Next steps
After the installation and registration of the master target has finsihed, you can see the master target appear on the **Master Target** section in **Site Recovery Infrastructure**, under the configuration server overview.

You can now proceed with [reprotection](site-recovery-how-to-reprotect.md), followed by failback.

## Common issues

* Make sure you do not turn on Storage vMotion on any management components such as a master target. If the master target moves after a successful reprotect, the virtual machine disks (VMDKs) cannot be detached. In this case, failback fails.

* The master target should not have any snapshots on the virtual machine. If there are snapshots, failback fails.

* Due to some custom NIC configurations at some customers, the network interface is disabled during startup, and the master target agent cannot initialize. Make sure that the following properties are correctly set. Check these properties in the Ethernet card file's /etc/sysconfig/network-scripts/ifcfg-eth*.
	* BOOTPROTO=dhcp
	* ONBOOT=yes
