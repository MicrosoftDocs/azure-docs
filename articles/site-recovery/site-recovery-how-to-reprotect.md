---
title: How to Reprotect from Azure to On-premises | Microsoft Docs
description: After failover of VMs to Azure, you can initiate a failback to bring VMs back to on-premises. Learn the steps how to do a reprotect before a failback.
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
ms.date: 02/13/2017
ms.author: ruturajd

---
# Reprotect from Azure to on-premises

## Overview
This article describes how to reprotect Azure virtual machines from Azure to the on-premises site. Follow the instructions in this article when you're ready to fail back your VMware virtual machines or Windows/Linux physical servers after they've failed over from the on-premises site to Azure using this [tutorial](site-recovery-vmware-to-azure-classic.md).

After reprotect completes and the protected virtual machines are replicating, you can initiate a failback on the VM to bring them to on-premises.

Post any comments or questions at the bottom of this article, or on the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).

For a quick video overview, you can also go through the video here.
> [!VIDEO https://channel9.msdn.com/Series/Azure-Site-Recovery/VMware-to-Azure-with-ASR-Video5-Failback-from-Azure-to-On-premises/player]

read about the complete process of failback here.

## Pre-requisites
Following are the few pre-requisite steps you need to take or consider when preparing for reprotect.

* If the VMs you want to fail back to are managed by a vCenter server, you need to make sure you have the required permissions for discovery of VMs on vCenter servers. [Read more](site-recovery-vmware-to-azure-classic.md#vmware-permissions-for-vcenter-access).
* If snapshots are present on the on-premises VM, then reprotection will fail. You can delete the snapshots before proceeding to reprotect.
* Before you fail back you’ll need to create two additional components:
  * **Create a process server**. Process server is used to receive the data from the protected VM in Azure and send the data on-premises. This requires it to be on a low latency network between the process server and the protected VM. Hence the process server can be on-premises (if you are using an express route connection) or on Azure if you are using a VPN.
  * **Create a master target server**: The master target server receives failback data. The management server you created on-premises has a master target server installed by default. However, depending on the volume of failed back traffic you might need to create a separate master target server for failback. 
		* [A linux VM needs a Linux master target server](site-recovery-how-to-install-linux-master-target.md). 
		* A windows VM needs a windows master target. You can re-use the on-premises PS+MT machine.
* Configuration server is required on-premises when you do a failback. During failback, the virtual machine must exist in the Configuration server database, failing which failback won't be successful. Hence ensure that you take regular scheduled backup of your server. If there was a disaster, you will need to restore it with the same IP address so that failback works.
* Ensure that you set the disk.enableUUID=true setting in Configuration Parameters of the Master target VM in VMware. If this row does not exist, add it. This is required to provide a consistent UUID to the VMDK so that it mounts correctly.
* **Master target server cannot be storage vMotioned**. This can cause the failback to fail. The VM will not come up since the disks will not be made available to it.
* You need a new drive added onto the Master target server. This drive is called a retention drive. Add a new disk and format the drive.
* Master target has other pre-requisites that are listed in [Common things to check on a Master Target before Reprotect](site-recovery-how-to-reprotect.md#common-things-to-check-after-completing-installation-of-master-target).


### Why do I need a S2S VPN or an ExpressRoute to replicate data back to on-premises?
Where replication from on-premises to Azure can happen over internet or an ExpressRoute with public peering, reprotect and failback requires a S2S VPN set up to replicate data. **The network should be provided such that the failed over VMs in Azure can reach(ping) the on-premises configuration server** . You may be also deploying a process server in the Azure network of the failed over VM - this process server should also be able to communicate with the on-premises configuration server.

### When should I install a Process server in Azure?


The Azure VMs that you want to reprotect, send the replication data to a Process server. Your network should be set up such that the process server is reachable from the Azure VM.

You can deploy a process server in Azure or use the existing process server that you used during failover. The important point to consider is the latency to send the data from Azure VMs to the process server. 

* If you have an express route set up, an on-premises PS can be used to send the data. This is because the latency between the VM and the PS would be low.
    
    ![Architecture Diagram for ExpressRoute](./media/site-recovery-failback-azure-to-vmware-classic/architecture.png)



* However, if you only have a S2S VPN, then we recommend deploying the process server in Azure.

    ![Architecture Diagram for VPN](./media/site-recovery-failback-azure-to-vmware-classic/architecture2.png)


Remember, that the replication will only happen over S2S VPN, or the private peering of your Express route network. Ensure that enough bandwidth is available over that network channel.

Read more on how to install an [Azure Process Server here](site-recovery-vmware-setup-azure-ps-resource-manager.md).

### What are the different ports to be open on different components so that reprotect can work?

![Failover-Failback all ports](./media/site-recovery-failback-azure-to-vmware-classic/Failover-Failback.png)

### Which Master Target server to use for reprotect?
A master target server is required on-premises to receive the data from the process server and then write to the on-premises VM's VMDK. If you are protecting Windows VMs, you need a Windows master target server, and here you can reuse the on-premises PS+MT <!-- !todo component -->. For Linux VMs, you will need to setup an additional Linux master target on-premises.


Click on the below links to read the steps on how to install a Master Target server.

* [How to install Windows Master Target server](site-recovery-vmware-to-azure.md#run-site-recovery-unified-setup)
* [How to install Linux Master Target server](site-recovery-how-to-install-linux-master-target.md)


#### Common things to check after completing installation of Master Target

* If the VM is present on-premises on the vCenter server, master target server needs access to the on-premises VM's VMDK. This is to write the replicated data to the VM's disks. For this you need to ensure that **the on-premises VM's datastore should be mounted on the MT's host with read write access**.

* If the VM is not present on-premises on the vCenter server, a new VM will need to be created during reprotect. This VM will be created on the ESX host on which you create the MT. Hence, choose the ESX host carefully, so that the failback VM is created on the host you want.
    
* **Master target server cannot be storage vMotioned**. This can cause the failback to fail. The VM will not come up since the disks will not be made available to it.

* You need a new drive added onto your existing Windows Master target server. This drive is called a retention drive. Add a new disk and format the drive. Retention Drive is used for stopping the points in time when the VM replicated back to on-premises. Some of the criteria of a retention drive are as below, without which the drive will not be listed for the master target server.
   
   * Volume shouldn't be in use for any other purpose (target of replication etc.)

   * Volume shouldn't be in lock mode.

   * Volume shouldn't be cache volume. (MT installation shouldn't exist on that volume. PS+MT custom installation volume is not eligible for retention volume. Here installed PS+MT volume is cache volume of MT.)

   * The Volume File system type shouldn't be FAT and FAT32.

   * The volume capacity should be non-zero.

   * Default retention volume for Windows is R volume.

   * Default retention volume for Linux is /mnt/retention.

* A linux failed over VM, needs a Linux Master target server. A Windows failed over VM, requires a Windows master target server.

* Install VMware tools on the master target server. Without the VMware tools, the datastores on the MT's ESXi host cannot be detected.

* Enable the disk.EnableUUID = True parameter on the MT VM via the vCenter properties. <!-- !todo Needs link. -->

* The Master Target should have atleast one VMFS datastore attached. If there is none, the Datastore input on the reprotect page will be empty and you will not be able to proceed.

* Master Target server cannot have any snapshots on the disks. If there are snapshots, Reprotect/Failback will fail.

* MT cannot have a Paravirtual SCSI controller. It can only be an LSI Logic controller. Without an LSI Logic controller, the reprotect will fail.

<!--
### Failback policy
To replicate back to on-premises, you will need a failback policy. This policy get automatically created when you create a forward direction policy. Note that

1. This policy gets auto associated with the configuration server during creation.
2. This policy is not editable.
3. The set values of the policy are (RPO Threshold = 15 Mins, Recovery Point Retention = 24 Hours, App Consistency Snapshot Frequency = 60 Mins)
   ![](./media/site-recovery-failback-azure-to-vmware-new/failback-policy.png)

-->

## Steps to reprotect

Before re-protection, make sure you have installed the [Process server](site-recovery-vmware-setup-azure-ps-resource-manager.md) in Azure and the on-premises Windows or [Linux Master Target](site-recovery-how-to-install-linux-master-target.md).

> [!NOTE]
> After a VM boots up in Azure, it takes some time for the agent to register back to the configuration server (upto 15 mins). During this time you will find reprotect to fail and the error message stating that the agent is not installed. Wait for a few minutes and then try Reprotect again.
 
 

1. In the Vault > replicated items > select the VM that's been failed over and right click to **Re-Protect**. You can also click the machine and select the reprotect from the command buttons.
2. In the blade, you can see that the direction of protection "Azure to On-premises" is already selected.
3. In **Master Target Server** and **Process Server** select the on-premises master target server, and the process server.
4. Select the **Datastore** to which you want to recover the disks on-premises. This option is used when the on-premises VM is deleted and new disks needs to be created. This option is ignored if the disks already exist, but you still need to specify a value.
5. Choose the retention drive. 
6. The failback policy will be auto-selected.
7. After you click **OK** to begin reprotection a job begins to replicate the VM from Azure to the on-premises site. You can track the progress on the **Jobs** tab.

If you want to recover to an alternate location (when the on-premises VM is deleted), select the retention drive and datastore configured for the master target server. When you fail back to the on-premises site the VMware VMs in the failback protection plan will use the same datastore as the master target server and a new VM will be created in vCenter. 
If you want to recover the Azure VM to an existing on-premises VM then the on-premises VM's datastores should be mounted with read/write access on the master target server's ESXi host.
    ![](./media/site-recovery-failback-azure-to-vmware-new/reprotectinputs.png)

You can also reprotect at a recovery plan level. If you have a replication group, it can only be reprotected using a recovery plan. While reprotecting via a recovery plan, you will need to give the above values for every protected machine.

> [!NOTE]
> A replication group should be protected back using the same Master target. If they are protected back using different Master target server, a common point in time cannot be taken for it.
 

After the reprotect succeed, the VM will enter into a protected state.

## Next steps

Once the VM has entered into protected state, you can initiate a failback. The failback will shutdown the VM in Azure and boot the VM on-premises. Hence there is a small downtime for the application. So choose the time for failback when your application can face a downtime.

[Steps to initiate failback of the VM](site-recovery-how-to-failback-azure-to-vmware.md#steps-to-failback)

## Common issues 

* If your virtual machines were created using a template, you should ensure before protection that each VM has a unique UUID for the disks. If the on-premises VM's UUID clashes with that of the Master target (because both were created from the same template), then reprotection will fail. You will need to deploy another Master target that has not been created from the same template.
* If you perform a read-only user vCenter discovery and protect virtual machines, it succeeds and failover works. During reprotection, failover fails because the datastores cannot be discovered. As a symptom, you will not see the datastores listed during reprotection. To resolve this issue, you can update the vCenter credential with an appropriate account that has permissions and retry the job. For more information, see [Replicate VMware virtual machines and physical servers to Azure with Azure Site Recovery](site-recovery-vmware-to-azure-classic.md#vmware-permissions-for-vcenter-access)
* When you fail back a Linux VM and run it on-premises, you can see that the Network Manager package has been uninstalled from the machine. This uninstallation happens because the Network Manager package is removed when the VM is recovered in Azure.
* When a Linux VM is configured with a static IP address and is failed over to Azure, the IP address is acquired via DHCP. When you fail over back to on-premises, the VM continues to use DHCP to acquire the IP address. Manually sign in to the machine and set the IP address back to a static address if necessary. A Windows VM can re-acquire its static IP.
* If you are using either ESXi 5.5 free edition or vSphere 6 Hypervisor free edition, failover would succeed, but failback would not succeed. To enable failback, upgrade to either program's evaluation license.
* If you cannot reach the configuration server from the Process Server, check connectivity to the configuration server by Telnet to the configuration server machine on port 443. You can also try to ping the configuration server from the Process Server machine. A Process Server should also have a heartbeat when it is connected to the configuration server.
* If you are trying to fail back to an alternate vCenter, make sure that your new vCenter is discovered and that the master target server is also discovered. A typical symptom is that the datastores are not accessible or visible in the **Reprotect** dialog box.
* A WS2008R2SP1 machine that is protected as a physical on-premises machine cannot be failed back from Azure to on-premises.