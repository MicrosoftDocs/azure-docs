---
title: Reprotect from Azure to an on-premises site | Microsoft Docs
description: After failover of VMs to Azure, you can initiate a failback to bring VMs back to on-premises. Learn how to reprotect before a failback.
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
ms.workload: storage-backup-recovery
ms.date: 06/05/2017
ms.author: ruturajd

---
# Reprotect from Azure to an on-premises site



## Overview
This article describes how to reprotect Azure virtual machines from Azure to the on-premises site. Follow the instructions in this article when you're ready to fail back your VMware virtual machines or Windows/Linux physical servers after they've failed over from the on-premises site to Azure by using [Replicate VMware virtual machines and physical servers to Azure with Azure Site Recovery](site-recovery-failover.md).

> [!WARNING]
> You cannot fail back after you [complete migration](site-recovery-migrate-to-azure.md#what-do-we-mean-by-migration), move the virtual machine to another resource group, or delete the Azure virtual machine.


After reprotection finishes and the protected virtual machines are replicating, you can initiate a failback on the virtual machines to bring them to the on-premises site.

Post comments or questions at the end of this article or on the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).

For a quick overview, watch the following video about how to fail over from Azure to an on-premises site.
> [!VIDEO https://channel9.msdn.com/Series/Azure-Site-Recovery/VMware-to-Azure-with-ASR-Video5-Failback-from-Azure-to-On-premises/player]


## Prerequisites
Following are the prerequisite actions that you need to take or consider when you prepare to reprotect virtual machines.

* If a vCenter server manages the virtual machines that you want to fail back to, make sure that you have the [required permissions](site-recovery-vmware-to-azure-classic.md#vmware-permissions-for-vcenter-access) for discovery of virtual machines on vCenter servers.

  > [!WARNING]
  > If snapshots are present on the on-premises master target or the virtual machine, reprotection will fail. You can delete the snapshots on the master target before you proceed to reprotect. The snapshots on the virtual machine will be automatically merged during a reprotect job.

* Before you fail back, create two additional components:
  * **Process server**: The[process server](site-recovery-vmware-setup-azure-ps-resource-manager.md) receives data from the protected virtual machine in Azure and sends data to the on-premises site. A low-latency network is required between the process server and the protected virtual machine. Thus, you can have an on-premises process server if you are using an Azure ExpressRoute connection or an Azure-based process server if you are using a VPN.
  * **Master target server**: The master target server receives failback data. The on-premises management server that you created has a master target server installed by default. However, depending on the volume of failed-back traffic, you might need to create a separate master target server for failback.

		* [A Linux virtual machine needs a Linux master target server](site-recovery-how-to-install-linux-master-target.md).
		* A Windows virtual machine needs a Windows master target server. You can use the on-premises process server and master target machines again.
* A configuration server is required on-premises when you fail back. During failback, the virtual machine must exist in the configuration server database. Otherwise, failback won't be successful. Make sure that you take regularly scheduled backups of your server. If there's a disaster, restore the server with the same IP address so that failback works.
* Set the `disk.EnableUUID=true` setting in configuration parameters of the master target virtual machine in VMware. If this row does not exist, add it. This setting is required to provide a consistent UUID to the virtual machine disk (VMDK) so that it mounts correctly.
* *You cannot use Storage vMotion on the master target server*. This can cause the failback to fail. The virtual machine will not start because the disks will not be made available to it. To prevent this, exclude the master target servers from your vMotion list.
* Add a new drive to the master target server. This drive is called a retention drive. Add a new disk and format the drive.
* Master target has other prerequisites that are listed in [Common things to check on a master target before reprotect](site-recovery-how-to-reprotect.md#common-things-to-check-after-completing-installation-of-the-master-target-server).


### Frequently asked questions

#### Why do I need a S2S VPN or an ExpressRoute connection to replicate data back to the on-premises site?
Where replication from on-premises to Azure can happen over the Internet or an ExpressRoute connection that has public peering, reprotection and failback require a site-to-site (S2S) VPN to replicate data. Provide the network so that the failed-over virtual machines in Azure can reach (ping) the on-premises configuration server. You might also deploy a process server in the Azure network of the failed-over virtual machine. This process server should also be able to communicate with the on-premises configuration server.

#### When should I install a process server in Azure?


The virtual machines on Azure that you want to reprotect send replication data to a process server. Set up your network so that the virtual machines on Azure can reach the process server.

You can deploy a process server in Azure or use the existing process server that you used during failover. The important point to consider is the latency to send the data from the virtual machines on Azure to the process server.

If you have an ExpressRoute connection set up, you can use an on-premises process server to send data because the latency between the virtual machine and the process server is low.

 ![Architecture diagram for ExpressRoute](./media/site-recovery-failback-azure-to-vmware-classic/architecture.png)



However, if you have only an S2S VPN, we recommend deploying the process server in Azure.

 ![Architecture diagram for VPN](./media/site-recovery-failback-azure-to-vmware-classic/architecture2.png)


Remember that replication will happen only over the S2S VPN or the private peering of your ExpressRoute network. Ensure that enough bandwidth is available over that network channel.

For information about installing an Azure-based process server, see [Manage a process server running in Azure](site-recovery-vmware-setup-azure-ps-resource-manager.md).

> [!TIP]
> We always recommend using an Azure-based process server during failback. The replication performance is higher if the process server is closer to the replicating virtual machine (the failed-over machine in Azure). However, during your proof of concept (POC) or demonstration, you can use the on-premises process server along with ExpressRoute with private peering to complete the POC faster.



#### What are the ports to open on different components so that reprotection can work?

![Ports for failover and failback](./media/site-recovery-failback-azure-to-vmware-classic/Failover-Failback.png)

#### Which master target server should I use for reprotection?
An on-premises master target server is required to receive data from the process server and then write to the on-premises virtual machine's VMDK. If you are protecting Windows virtual machines, you need a Windows master target server. You can reuse the on-premises process server and master target <!-- !todo component -->. For Linux virtual machines, you need to set up an additional on-premises Linux master target.


For information about installing a master target server, see:

* [How to install Windows master target server](site-recovery-vmware-to-azure.md#run-site-recovery-unified-setup)
* [How to install Linux master target server](site-recovery-how-to-install-linux-master-target.md)


#### What datastore types are supported on the on-premises ESXi host during failback?

Currently, Azure Site Recovery supports failing back only to a virtual machine file system (VMFS) datastore. A vSAN or NFS datastore is not supported. Due to this limitation, the datastore selection input in the reprotect screen will be empty in the case of NFS datastores, or it will show the vSAN datastore but fail during the job. If you intend to fail back, you can create a VMFS datastore on-premises and fail back to it. This failback will be cause a full download of the VMDK.

### Common things to check after completing installation of the master target server

* If the virtual machine is present on-premises on the vCenter server, the master target server needs access to the on-premises virtual machine's VMDK. Access is needed to write the replicated data to the virtual machine's disks. Ensure that the on-premises virtual machine's datastore is mounted on the master target's host with read/write access.

* If the virtual machine is not present on-premises on the vCenter server, Site recovery service needs to create a new virtual machine during reprotection. This virtual machine will be created on the ESX host on which you create the master target. Choose the ESX host carefully, so that the failback virtual machine is created on the host that you want.

* *You cannot use Storage vMotion for the master target server*. This can cause the failback to fail. The virtual machine will not start because the disks are not available to it.

  > [!WARNING]
  > If a master target undergoes a Storage vMotion task after reprotection, the protected virtual machines disks that are attached to the master target will migrate to the target of the vMotion task. If you try to fail back after this, detachment of the disk fails because the disks are not found. It then becomes hard to find the disks in your storage accounts. You will need to find them manually and attach them to the virtual machine. After that, the on-premises virtual machine can be booted.

* Add a retention drive to your existing Windows master target server. Add a new disk and format the drive. The retention drive is used to stop the points in time when the virtual machine replicates back to the on-premises site. Following are some criteria of a retention drive. Without these criteria, the drive will not be listed for the master target server.

   * The volume is not used for any other purpose, such as a target of replication.

   * The volume is not in lock mode.

   * The volume is not a cache volume. The master target installation shouldn't exist on that volume. The process server and master target custom installation volume is not eligible for a retention volume. When the process server and master target are installed on a volume, the volume is a cache volume of the master target.

   * The file system type of the volume are not FAT or FAT32.

   * The volume capacity is nonzero.

   * The default retention volume for Windows is the R volume.

   * The default retention volume for Linux is /mnt/retention.

   > [!IMPORTANT]
   > You need to add a new drive if you're using an existing process server/configuration server machine or a scale or a process server/master target server machine. The new drive should meet the preceding requirements. If the retention drive is not present, it won't be in the selection drop-down list on the portal. After you add a drive to the on-premises master target, it takes up to 15 minutes for the drive to appear in the selection on the portal. You can also refresh the configuration server if the drive does not appear after 15 minutes.



* A Linux failed-over virtual machine needs a Linux master target server. A Windows failed-over virtual machine requires a Windows master target server.

* Install VMware tools on the master target server. Without the VMware tools, the datastores on the master target's ESXi host cannot be detected.

* Enable the `disk.EnableUUID=true` parameter on the master target virtual machine by using the vCenter properties. <!-- !todo Needs link. -->

* The master target should have at least one VMFS datastore attached. If there is none, the **Datastore** input on the reprotect page will be empty, and you will not be able to proceed.

* The master target server cannot have snapshots on the disks. If there are snapshots, reprotection and failback will fail.

* The master target cannot have a Paravirtual SCSI controller. The controller can only be an LSI Logic controller. Without an LSI Logic controller, reprotection will fail.

<!--
### Failback policy
To replicate back to on-premises, you will need a failback policy. This policy get automatically created when you create a forward direction policy. Note that

1. This policy gets auto associated with the configuration server during creation.
2. This policy is not editable.
3. The set values of the policy are (RPO Threshold = 15 Mins, Recovery Point Retention = 24 Hours, App Consistency Snapshot Frequency = 60 Mins)
   ![](./media/site-recovery-failback-azure-to-vmware-new/failback-policy.png)

-->

## Steps to reprotect

> [!NOTE]
> After a virtual machine boots up in Azure, it takes some time for the agent to register back to the configuration server (up to 15 minutes). During this time, reprotection will fail, and an error message indicates that the agent is not installed. Wait for a few minutes, and then try reprotection again.



1. In **Vault** > **Replicated items**, right-click the virtual machine that's been failed over, and then select **Re-Protect**. You can also click the machine and select **Re-Protect** from the command buttons.
2. In the blade, notice that the direction of protection, **Azure to On-premises**, is already selected.
3. In **Master Target Server** and **Process Server**, select the on-premises master target server and the process server.
4. For **Datastore**, select the datastore to which you want to recover the disks on-premises. This option is used when the on-premises virtual machine is deleted, and you need to create new disks. This option is ignored if the disks already exist, but you still need to specify a value.
5. Choose the retention drive.
6. The failback policy is automatically selected.
7. Click **OK** to begin reprotection. A job begins to replicate the virtual machine from Azure to the on-premises site. You can track the progress on the **Jobs** tab.

If you want to recover to an alternate location (when the on-premises virtual machine is deleted), select the retention drive and datastore that are configured for the master target server. When you fail back to the on-premises site, the VMware virtual machines in the failback protection plan will use the same datastore as the master target server. A new virtual machine will be created in vCenter.

If you want to recover the virtual machine on Azure to an existing on-premises virtual machine, mount the on-premises virtual machine's datastores with read/write access on the master target server's ESXi host.
    ![Re-protect dialog box](./media/site-recovery-failback-azure-to-vmware-new/reprotectinputs.png)

You can also reprotect at the level of a recovery plan. A replication group can be reprotected only through a recovery plan. When you reprotect by using a recovery plan, you need to provide the values for every protected machine.

> [!NOTE]
> Use the same master target server to reprotect a replication group. If you use a different master target server to reprotect a replication group, the server cannot provide a common point in time.

> [!NOTE]
> The on-premises virtual machine is turned off during reprotection. This helps ensure the data consistency during replication. Do not turn on the virtual machine after reprotection finishes.

After the reprotection succeeds, the virtual machine will enter a protected state.

## Next steps

After the virtual machine has entered a protected state, you can initiate a failback. The failback will shut down the virtual machine in Azure and boot the on-premises virtual machine. Expect some downtime for the application. Choose a time for failback when the application can tolerate downtime.

[Steps to initiate failback of the virtual machine](site-recovery-how-to-failback-azure-to-vmware.md#steps-to-fail-back)

## Common problems

* If you used a template to create your virtual machines, ensure that each virtual machine has its own UUID for the disks. If the on-premises virtual machine's UUID clashes with that of the master target because both were created from the same template, reprotection will fail. Deploy another master target that has not been created from the same template.
* If you perform a read-only user vCenter discovery and protect virtual machines, protection succeeds, and failover works. During reprotection, failover fails because the datastores cannot be discovered. As a symptom, you will not see the datastores listed during reprotection. To resolve this problem, you can update the vCenter credential with an appropriate account that has permissions, and retry the job. For more information, see [Replicate VMware virtual machines and physical servers to Azure with Azure Site Recovery](site-recovery-vmware-to-azure-classic.md#vmware-permissions-for-vcenter-access).
* When you fail back a Linux virtual machine and run it on-premises, you can see that the Network Manager package has been uninstalled from the machine. This uninstallation happens because the Network Manager package is removed when the virtual machine is recovered in Azure.
* When a Linux virtual machine is configured with a static IP address and is failed over to Azure, the IP address is acquired from DHCP. When you fail over to on-premises, the virtual machine continues to use DHCP to acquire the IP address. Manually sign in to the machine, and set the IP address back to a static address if necessary. A Windows virtual machine can acquire its static IP again.
* If you use either ESXi 5.5 free edition or vSphere 6 Hypervisor free edition, failover succeeds, but failback does not succeed. To enable failback, upgrade to either program's evaluation license.
* If you cannot reach the configuration server from the process server, use Telnet to check connectivity to the configuration server on port 443. You can also try to ping the configuration server from the process server. A process server should also have a heartbeat when it is connected to the configuration server.
* If you are trying to fail back to an alternate vCenter, make sure that your new vCenter is discovered and that the master target server is also discovered. A typical symptom is that the datastores are not accessible or visible in the **Reprotect** dialog box.
* A Windows Server 2008 R2 SP1 server that is protected as a physical on-premises server cannot be failed back from Azure to an on-premises site.
