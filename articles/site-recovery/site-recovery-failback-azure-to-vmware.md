---
title: Failback VMware VMs from Azure to on-premises | Microsoft Docs
description: Learn about failing back to the on-premises site after failover of VMware VMs and physical servers to Azure.
services: site-recovery
documentationcenter: ''
author: ruturaj
manager: mkjain
editor: ''

ms.assetid: 5a47337f-89a9-43e8-8fdc-7da373c0fb0f
ms.service: site-recovery
ms.devlang: na
ms.tgt_pltfrm: na
ms.topic: article
ms.workload: required
ms.date: 03/27/2017
ms.author: ruturajd

---
# Fail back VMware virtual machines and physical servers to the on-premises site
> [!div class="op_single_selector"]
> * [VMware/physical machines from Azure](site-recovery-how-to-failback-azure-to-vmware.md)
> * [Hyper-V VMs from Azure](site-recovery-failback-from-azure-to-hyper-v.md)

This article describes how to failback Azure virtual machines from Azure to the on-premises site. Follow the instructions here when you're ready to fail back your VMware virtual machines or Windows or Linux physical servers after you have re-protected your machines using this [reference](site-recovery-how-to-reprotect.md).

>[!NOTE]
>If you are using the classic Azure portal, please refer to instructions mentioned [here](site-recovery-failback-azure-to-vmware-classic.md) for enhanced VMware to Azure architecture and [here](site-recovery-failback-azure-to-vmware-classic-legacy.md) for the legacy architecture

## Overview
The diagrams in this section show the failback architecture for this scenario.

When the Process Server is on-premises and you are using an Azure ExpressRoute connection, use this architecture:

![Architecture diagram for ExpressRoute](./media/site-recovery-failback-azure-to-vmware-classic/architecture.png)

When the Process Server is on Azure and you have either a VPN or an ExpressRoute connection, use this architecture:

![Architecture diagram for VPN](./media/site-recovery-failback-azure-to-vmware-classic/architecture2.png)

For a complete list of ports and the failback architecture diagram, refer to the following image:

![Failover-failback list of all ports](./media/site-recovery-failback-azure-to-vmware-classic/Failover-Failback.png)

After you’ve failed over to Azure, you fail back to your on-premises site in three stages:

* **Stage 1**: You reprotect the Azure VMs so that they start replicating back to the VMware VMs that are running on your on-premises site.
* **Stage 2**: After your Azure VMs are replicated to your on-premises site, you run a failover to fail back from Azure.
* **Stage 3**: After your data has failed back, you reprotect the on-premises VMs that you failed back to, so that they start replicating to Azure.

### Fail back to the original location or an alternate location
After you fail over a VMware VM, you can fail back to the same source VM if it still exists on-premises. In this scenario, only the deltas are failed back.

If you failed over physical servers, failback is always to a new VMware VM. Before failing back a physical machine, note that:
* A protected physical machine will come back as a virtual machine when it is failed over back from Azure to VMware. A Windows Server 2008 R2 SP1 physical machine, if it is protected and failed over to Azure, cannot be failed back. A Windows Server 2008 R2 SP1 machine that started as a virtual machine on-premises will be able to fail back.
* Ensure that you discover at least one master target server along with the necessary ESX/ESXi hosts that you need to fail back to.

If you fail back to the original VM, the following are required:

* If the VM is managed by a vCenter server, the master target's ESX host should have access to the VMs datastore.
* If the VM is on an ESX host but isn’t managed by vCenter, the hard disk of the VM must be in a datastore that's accessible by the MT's host.
* If your VM is on an ESX host and doesn't use vCenter, you should complete discovery of the ESX host of the MT before you reprotect. This applies if you're failing back physical servers too.
* Another option (if the on-premises VM exists) is to delete it before you do a failback. Failback then creates a new VM on the same host as the master target ESX host.

When you fail back to an alternate location, the data is recovered to the same datastore and the same ESX host as that used by the on-premises master target server.

## Prerequisites
* To fail back VMware VMs and physical servers, you need a VMware environment. Failing back to a physical server isn’t supported.
* To fail back, you must have created an Azure network when you initially set up protection. Failback needs a VPN or ExpressRoute connection from the Azure network in which the Azure VMs are located to the on-premises site.
* If the VMs that you want to fail back to are managed by a vCenter server, make sure that you have the required permissions for discovery of VMs on vCenter servers. For more information, see [Replicate VMware virtual machines and physical servers to Azure with Azure Site Recovery](site-recovery-vmware-to-azure-classic.md#vmware-permissions-for-vcenter-access).
* If snapshots are present on a VM, reprotection fails. You can delete the snapshots or the disks.
* Before you fail back, create these components:
  * **Create a Process Server in Azure**. This component is an Azure VM that you create and keep running during failback. You can delete the VM after failback is complete.
  * **Create a master target server**: The master target server sends and receives failback data. The management server that you created on-premises has a master target server that's installed by default. However, depending on the volume of failed-back traffic, you might need to create a separate master target server for failback.
  * To create an additional master target server that runs on Linux, set up the Linux VM before you install the master target server, as described later.
* A configuration server is required on-premises when you do a failback. During failback, the virtual machine must exist in the configuration server database. If the configuration server database contains no VM, failback cannot succeed. Therefore, ensure that you make regular scheduled backups of your server. In a disaster, you need to restore it with the same IP address so that failback works.
* Set the disk.enableUUID=true setting in **Configuration Parameters** of the master target VM in VMware. If this row does not exist, add it. This setting is required to provide a consistent universally unique identifier (UUID) to the virtual machine disk (VMDK) file so that it is mounted correctly.
* Be aware of a "Master target server cannot be storage vMotioned" condition, which can cause the failback to fail. The VM cannot come up because the disks aren't made available to it.
* Add a drive, called a retention drive, onto the master target server. Add a disk, and format the drive.

## Failback policy
To replicate back to on-premises, you need a failback policy. The policy is automatically created when you create a forward direction policy, and it is automatically associated with the configuration server. It is not editable. The policy has the following replication settings:

* RPO threshold = 15 minutes
* Recovery point retention = 24 hours
* App consistent snapshot frequency = 60 minutes

 ![Replication settings of the failback policy](./media/site-recovery-failback-azure-to-vmware-new/failback-policy.png)

## Set up a Process Server in Azure
Install a Process Server in Azure so that the Azure VMs can send the data back to the on-premises master target server.

If you have protected your virtual machines as classic resources (that is, the VM recovered in Azure is a VM that was created by using the classic deployment model), you need a Process Server in Azure. If you have recovered the VMs with Azure Resource Manager as the deployment type, the Process Server must have Resource Manager as the deployment type. The deployment type is selected by the Azure virtual network that you deploy the Process Server to.

1. In **Vault** > **Settings** > **Site Recovery Infrastructure** (under **Manage**) > **Configuration Servers** (under **For VMware and Physical Machines**), select the configuration server.
2. Click **Process Server**.

  ![Process Server button](./media/site-recovery-failback-azure-to-vmware-classic/add-processserver.png)
3. Choose to deploy the Process Server as **Deploy a failback Process Server in Azure**.
4. Select the subscription that you have recovered the VMs to.
5. Select the Azure network that you have recovered the VMs to. The Process Server needs to be in the same network so that the recovered VMs and the Process Server can communicate.
6. If you selected a *classic deployment model* network, create a VM via the Azure Marketplace, and then install the Process Server in it.

 ![The "Add Process Server" window](./media/site-recovery-failback-azure-to-vmware-classic/add-classic.png)

 As you're creating the Process Server, pay attention to the following:
 * The name of the image is *Microsoft Azure Site Recovery Process Server V2*. Select **Classic** as the deployment model.

       ![Select "Classic" as the Process Server deployment model](./media/site-recovery-failback-azure-to-vmware-classic/templatename.png)
 * Install the Process Server according to the instructions in [Replicate VMware virtual machines and physical servers to Azure with Azure Site Recovery](site-recovery-vmware-to-azure-classic.md#step-5-install-the-management-server).
7. If you select the *Resource Manager* Azure network, deploy the Process Server by providing the following information:

  * The name of the resource group that you want to deploy the server to
  * The name of the server
  * A username and password for signing in to the server
  * The storage account that you want to deploy the server to
  * The subnet and the network interface that you want to connect to it
   >[!NOTE]
   >You must create your own [network interface](../virtual-network/virtual-networks-multiple-nics.md) (NIC) and select it while you are deploying the Process Server.

    ![Enter information in the "Add Process Server" dialog box](./media/site-recovery-failback-azure-to-vmware-classic/psinputsadd.png)

8. Click **OK**. This action triggers a job that creates a Resource Manager deployment type virtual machine during the Process Server setup. To register the server to the configuration server, run the setup inside the VM by following the instructions in [Replicate VMware virtual machines and physical servers to Azure with Azure Site Recovery](site-recovery-vmware-to-azure-classic.md#step-5-install-the-management-server). A job to deploy the Process Server is also triggered.

  The Process Server is listed on the **Configuration servers** > **Associated servers** > **Process Servers** tab.

    ![](./media/site-recovery-failback-azure-to-vmware-new/pslistingincs.png)

    > [!NOTE]
    > The Process Server isn't visible under **VM properties**. It's visible only on the **Servers** tab in the management server that it's registered to. It can take 10 to 15 minutes for the Process Server to appear.


## Set up the master target server on-premises
The master target server receives the failback data. The server is automatically installed on the on-premises management server, but if you're failing back too much data, you might need to set up an additional master target server. To set up a master target server on-premises, do the following:

> [!NOTE]
> To set up a master target server on Linux, skip to the next procedure. Use only CentOS 6.6 minimal operating system as the master target OS.

1. If you're setting up the master target server on Windows, open the quick-start page from the VM that you're installing the master target server on.
2. Download the installation file for the Azure Site Recovery Unified Setup wizard.
3. Run the setup and, in **Before you begin**, select **Add additional Process Servers to scale out deployment**.
4. Complete the wizard in the same way you did when you [set up the management server](site-recovery-vmware-to-azure-classic.md#step-5-install-the-management-server). On the **Configuration Server Details** page, specify the IP address of the master target server, and enter a passphrase to access the VM.

### Set up a Linux VM as the master target server
To set up the management server running the master target server as a Linux VM, install the CentOS 6.6 minimal operating system. Next, retrieve the SCSI IDs for each SCSI hard disk, install some additional packages, and apply some custom changes.

#### Install CentOS 6.6

1. Install the CentOS 6.6 minimal operating system on the management server VM. Keep the ISO on a DVD drive, and boot the system. Skip the media testing. Select **US English** as the language, select **Basic Storage Devices**, check that the hard drive doesn’t have any important data, click **Yes**, and discard any data. Enter the host name of the management server, and select the server network adapter.  In the **Editing System** dialog box, select **Connect automatically**, and then add a static IP address, network, and DNS settings. Specify a time zone. To access the management server, enter the root password.
2. When you're asked what type of installation you want, select **Create Custom Layout** as the partition. Click **Next**. Select **Free**, and then click **Create**. Create **/**,  **/var/crash**, and **/home partitions** with **FS Type:** **ext4**. Create the swap partition as **FS Type: swap**.
3. If pre-existing devices are found, a warning message appears. Click **Format** to format the drive with the partition settings. Click **Write change to disk** to apply the partition changes.
4. Select **Install boot loader** > **Next** to install the boot loader on the root partition.
5. When the installation is complete, click **Reboot**.

#### Retrieve the SCSI IDs

1. After the installation, retrieve the SCSI IDs for each SCSI hard disk in the VM. To do so, shut down the management server VM. In the VM properties in VMware, right-click the VM entry > **Edit Settings** > **Options**.
2. Select **Advanced** > **General item**, and then click **Configuration Parameters**. This option is unavailable when the machine is running. For the option to be available, the machine must be shut down.
3. Do either of the following:
 * If the row **disk.EnableUUID** exists, make sure that the value is set to **True** (case sensitive). If the value is already set to True, you can cancel and test the SCSI command inside a guest operating system after it’s booted.
 * If the row **disk.EnableUUID** doesn’t exist, click **Add Row**, and then add it with the **True** value. Don’t use double quotation marks.

#### Install additional packages
Download and install additional packages.

1. Make sure the master target server is connected to the Internet.
2. To download and install 15 packages from the CentOS repository, run this command: `# yum install –y xfsprogs perl lsscsi rsync wget kexec-tools`.
3. If the source machines you’re protecting are running Linux with a Reiser or XFS file system for the root or boot device, download and install additional packages as follows:

   * \# cd /usr/local
   * \# wget [http://elrepo.org/linux/elrepo/el6/x86_64/RPMS/kmod-reiserfs-0.0-1.el6.elrepo.x86_64.rpm](http://elrepo.org/linux/elrepo/el6/x86_64/RPMS/kmod-reiserfs-0.0-1.el6.elrepo.x86_64.rpm)
   * \# wget [http://elrepo.org/linux/elrepo/el6/x86_64/RPMS/reiserfs-utils-3.6.21-1.el6.elrepo.x86_64.rpm](http://elrepo.org/linux/elrepo/el6/x86_64/RPMS/reiserfs-utils-3.6.21-1.el6.elrepo.x86_64.rpm)
   * \# rpm –ivh kmod-reiserfs-0.0-1.el6.elrepo.x86_64.rpm reiserfs-utils-3.6.21-1.el6.elrepo.x86_64.rpm
   * \# wget [http://mirror.centos.org/centos/6.6/os/x86_64/Packages/xfsprogs-3.1.1-16.el6.x86_65.rpm](http://mirror.centos.org/centos/6.6/os/x86_64/Packages/xfsprogs-3.1.1-16.el6.x86_65.rpm)
   * \# rpm –ivh xfsprogs-3.1.1-16.el6.x86_64.rpm
   * \# yum install device-mapper-multipath (required to enable multipath packages on the master target server)

#### Apply custom changes
After you’ve completed the post-installation steps and installed the packages, apply custom changes by doing the following:

1. Copy the RHEL 6-64 Unified Agent binary to the VM. To untar the binary, run this command: `tar –zxvf <file name>`.
2. To give permissions, run this command: `# chmod 755 ./ApplyCustomChanges.sh`.
3. Run the following script: `# ./ApplyCustomChanges.sh`. Run it only once. After it runs successfully, reboot the server.

## Run the failback
### Reprotect the Azure VMs
1. In **Vault**, in **Replicated items**, right-click the VM that has been failed over, and then select **Re-Protect**.
2. On the blade, you can see that the direction of protection **Azure to On-premises** is already selected.
3. In **Master Target Server** and **Process Server**, select the on-premises master target server and the Azure VM Process Server.
4. Select the datastore that you want to recover the disks on-premises to. Use this option when the on-premises VM is deleted and you need to create new disks. Ignore the option if the disks already exist, but you still need to specify a value.
5. Use a retention drive to stop the points in time when the VM is replicated back to on-premises. Some criteria of a retention drive are listed here. Without these criteria, the drive is not listed for the master target server.

  * Volume shouldn't be in use for any other purpose (target of replication, and so forth).
  * Volume shouldn't be in lock mode.
  * Volume shouldn't be cache volume. (The master target installation shouldn't exist on that volume. The Process Server plus master target custom installation volume is not eligible for retention volume. Here, the installed Process Server plus master target volume is the cache volume of the master target.)
  * The volume file system type shouldn't be FAT and FAT32.
  * The volume capacity should be non-zero.
  * The default retention volume for Windows is R volume.
  * The default retention volume for Linux is /mnt/retention.

6. The failback policy is automatically selected.
7. After you click **OK** to begin reprotection, a job begins to replicate the VM from Azure to the on-premises site. You can track the progress on the **Jobs** tab.

If you want to recover to an alternate location, select the retention drive and datastore that are configured for the master target server. When you fail back to the on-premises site, the VMware VMs in the failback protection plan use the same datastore as the master target server. If you want to recover the replica Azure VM to the same on-premises VM, the on-premises VM should already be in the same datastore as the master target server. If there's no VM on-premises, a new one is created during reprotection.

![Select "Azure to on-premises" in the drop-down menu](./media/site-recovery-failback-azure-to-vmware-new/reprotectinputs.png)

You can also reprotect at a recovery plan level. If you have a replication group, you can reprotect it only by using a recovery plan. When you reprotect by using a recovery plan, use the previous values for every protected machine.

> [!NOTE]
> Replication groups should be protected back with the same master target. If they are protected back with different master target servers, a common point in time cannot be determined for them.

### Run a failover to the on-premises site
After you reprotect the VM, you can initiate a failover from Azure to on-premises.

1. On the replicated items page, right-click the virtual machine, and then select **Unplanned Failover**.
2. In **Confirm Failover**, verify the failover direction (from Azure), and then select the recovery point that you want to use for the failover (the latest, or the latest app-consistent recovery point). An app-consistent recovery point occurs before the most recent point in time, and it will cause some data loss.
3. During failover, Site Recovery shuts down the Azure VMs. After you check that failback has been completed as expected, you can check to ensure that the Azure VMs have been shut down as expected.

### Reprotect the on-premises site
After failback has been completed, commit the virtual machine to ensure that the VMs recovered in Azure are deleted. To do so, right-click the protected item, and then click **Commit**. This action triggers a job that removes the former recovered virtual machines in Azure.

After the commit is completed, your data should be back on the on-premises site, but it won’t be protected. To start replicating to Azure again, do the following:

1. In **Vault**, in **Setting** > **Replicated items**, select the VMs that have failed back, and then click **Re-Protect**.
2. Give the value of the Process Server that needs to be used to send data back to Azure.
3. Click **OK**.

After the reprotection is complete, the VM replicates back to Azure and you can do a failover.

### Resolve common failback issues
* If you perform a read-only user vCenter discovery and protect virtual machines, it succeeds and failover works. During reprotection, failover fails because the datastores cannot be discovered. As a symptom, you will not see the datastores listed during reprotection. To resolve this issue, you can update the vCenter credential with an appropriate account that has permissions and retry the job. For more information, see [Replicate VMware virtual machines and physical servers to Azure with Azure Site Recovery](site-recovery-vmware-to-azure-classic.md#vmware-permissions-for-vcenter-access)
* When you fail back a Linux VM and run it on-premises, you can see that the Network Manager package has been uninstalled from the machine. This uninstallation happens because the Network Manager package is removed when the VM is recovered in Azure.
* When a VM is configured with a static IP address and is failed over to Azure, the IP address is acquired via DHCP. When you fail over back to on-premises, the VM continues to use DHCP to acquire the IP address. Manually sign in to the machine and set the IP address back to a static address if necessary.
* If you are using either ESXi 5.5 free edition or vSphere 6 Hypervisor free edition, failover would succeed, but failback would not succeed. To enable failback, upgrade to either program's evaluation license.
* If you cannot reach the configuration server from the Process Server, check connectivity to the configuration server by Telnet to the configuration server machine on port 443. You can also try to ping the configuration server from the Process Server machine. A Process Server should also have a heartbeat when it is connected to the configuration server.
* If you are trying to fail back to an alternate vCenter, make sure that your new vCenter is discovered and that the master target server is also discovered. A typical symptom is that the datastores are not accessible or visible in the **Reprotect** dialog box.
* A WS2008R2SP1 machine that is protected as a physical on-premises machine cannot be failed back from Azure to on-premises.

## Fail back with ExpressRoute
You can fail back over a VPN connection or by using an ExpressRoute connection. If you want to use an ExpressRoute connection, note the following:

* The ExpressRoute connection should be set up on the Azure virtual network that the source machines fail over to and where the Azure VMs are located after the failover occurs.
* Data is replicated to an Azure storage account on a public endpoint. To use an ExpressRoute connection, set up public peering in ExpressRoute with the target data center for Site Recovery replication.
