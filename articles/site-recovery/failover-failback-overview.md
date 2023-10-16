---
title: About failover and failback in Azure Site - Classic
description: Learn about failover and failback in Azure Site Recovery - Classic
ms.topic: conceptual
ms.date: 06/30/2021
ms.author: ankitadutta
author: ankitaduttaMSFT
ms.service: site-recovery
---
# About on-premises disaster recovery failover/failback - Classic

This article provides an overview of failover and failback during disaster recovery of on-premises machines to Azure with [Azure Site Recovery](site-recovery-overview.md) - Classic.

For information about failover and failback in Azure Site Recovery Modernized release, [see this article](failover-failback-overview-modernized.md).

## Recovery stages

Failover and failback in Site Recovery has four stages:

- **Stage 1: Fail over from on-premises**: After setting up replication to Azure for on-premises machines, when your on-premises site goes down, you fail those machines over to Azure. After failover, Azure VMs are created from replicated data.
- **Stage 2: Reprotect Azure VMs**: In Azure, you reprotect the Azure VMs so that they start replicating back to the on-premises site. The on-premises VM (if available) is turned off during reprotection, to help ensure data consistency.
- **Stage 3: Fail over from Azure**: When your on-premises site is running as normal again, you run another failover, this time to fail back Azure VMs to your on-premises site. You can fail back to the original location from which you failed over, or to an alternate location.
- **Stage 4: Reprotect on-premises machines**: After failing back, again enable replication of the on-premises machines to Azure.

## Failover

You perform a failover as part of your business continuity and disaster recovery (BCDR) strategy.

- As a first step in your BCDR strategy, you replicate your on-premises machines to Azure on an ongoing basis. Users access workloads and apps running on the on-premises source machines.
- If the need arises, for example if there's an outage on-premises, you fail the replicating machines over to Azure. Azure VMs are created using the replicated data.
- For business continuity, users can continue accessing apps on the Azure VMs.

Failover is a two-phase activity:

- **Failover**: The failover that creates and brings up an Azure VM using the selected recovery point.
- **Commit**: After failover you verify the VM in Azure:
    - You can then commit the failover to the selected recovery point, or select a different point for the commit.
    - After committing the failover, the recovery point can't be changed.


## Connect to Azure after failover

To connect to the Azure VMs created after failover using RDP/SSH, there are a number of requirements.

**Failover** | **Location** | **Actions**
--- | --- | ---
**Azure VM running Windows** | On the on-premises machine before failover | **Access over the internet**: Enable RDP. Make sure that TCP and UDP rules are added for **Public**, and that RDP is allowed for all profiles in **Windows Firewall** > **Allowed Apps**.<br/><br/> **Access over site-to-site VPN**: Enable RDP on the machine. Check that RDP is allowed in the **Windows Firewall** -> **Allowed apps and features**, for **Domain and Private** networks.<br/><br/>  Make sure the operating system SAN policy is set to **OnlineAll**. [Learn more](https://support.microsoft.com/kb/3031135).<br/><br/> Make sure there are no Windows updates pending on the VM when you trigger a failover. Windows Update might start when you fail over, and you won't be able to log onto the VM until updates are done.
**Azure VM running Windows** | On the Azure VM after failover |  [Add a public IP address](/archive/blogs/srinathv/how-to-add-a-public-ip-address-to-azure-vm-for-vm-failed-over-using-asr) for the VM.<br/><br/> The network security group rules on the failed over VM (and the Azure subnet to which it is connected) must allow incoming connections to the RDP port.<br/><br/> Check **Boot diagnostics** to verify a screenshot of the VM. If you can't connect, check that the VM is running, and review [troubleshooting tips](https://social.technet.microsoft.com/wiki/contents/articles/31666.troubleshooting-remote-desktop-connection-after-failover-using-asr.aspx).
**Azure VM running Linux** | On the on-premises machine before failover | Ensure that the Secure Shell service on the VM is set to start automatically on system boot.<br/><br/> Check that firewall rules allow an SSH connection to it.
**Azure VM running Linux** | On the Azure VM after failover | The network security group rules on the failed over VM (and the Azure subnet to which it is connected) need to allow incoming connections to the SSH port.<br/><br/> [Add a public IP address](/archive/blogs/srinathv/how-to-add-a-public-ip-address-to-azure-vm-for-vm-failed-over-using-asr) for the VM.<br/><br/> Check **Boot diagnostics** for a screenshot of the VM.<br/><br/>

## Types of failover

Site Recovery provides different failover options.

**Failover** | **Details** | **Recovery** | **Workflow**
--- | --- | --- | ---
**Test failover** | Used to run a drill that validates your BCDR strategy, without any data loss or downtime.| Creates a copy of the VM in Azure, with no impact on ongoing replication, or on your production environment. | 1. Run a test failover on a single VM, or on multiple VMs in a recovery plan.<br/><br/> 2. Select a recovery point to use for the test failover.<br/><br/> 3. Select an Azure network in which the Azure VM will be located when it's created after failover. The network is only used for the test failover.<br/><br/> 4. Verify that the drill worked as expected. Site Recovery automatically cleans up VMs created in Azure during the drill.
**Planned failover-Hyper-V**  | Usually used for planned downtime.<br/><br/> Source VMs are shut down. The latest data is synchronized before initiating the failover. | Zero data loss for the planned workflow. | 1. Plan a downtime maintenance window and notify users.<br/><br/> 2. Take user-facing apps offline.<br/><br/> 3. Initiate a planned failover with the latest recovery point. The failover doesn't run if the machine isn't shut down, or if errors are encountered.<br/><br/> 4. After the failover, check that the replica Azure VM is active in Azure.<br/><br/> 5. Commit the failover to finish up. The commit action deletes all recovery points.
**Failover-Hyper-V** | Usually run if there's an unplanned outage, or the primary site isn't available.<br/><br/> Optionally shut down the VM, and synchronize final changes before initiating the failover.  | Minimal data loss for apps. | 1. Initiate your BCDR plan. <br/><br/> 2. Initiate a failover. Specify whether Site Recovery should shut down the VM and synchronize/replicate the latest changes before triggering the failover.<br/><br/> 3. You can fail over to a number of recovery point options, summarized in the table below.<br/><br/> If you don't enable the option to shut down the VM, or if Site Recovery can't shut it down, the latest recovery point is used.<br/>The failover runs even if the machine can't be shut down.<br/><br/> 4. After failover, you check that the replica Azure VM is active in Azure.<br/> If required, you can select a different recovery point from the retention window of 24 hours.<br/><br/> 5. Commit the failover to finish up. The commit action deletes all available recovery points.
**Failover-VMware** | Usually run if there's an unplanned outage, or the primary site isn't available.<br/><br/> Optionally specify that Site Recovery should try to trigger a shutdown of the VM, and to synchronize and replicate final changes before initiating the failover.  | Minimal data loss for apps. | 1. Initiate your BCDR plan. <br/><br/> 2. Initiate a failover from Site Recovery. Specify whether Site Recovery should try to trigger VM shutdown and synchronize before running the failover.<br/> The failover runs even if the machines can't be shut down.<br/><br/> 3. After the failover, check that the replica Azure VM is active in Azure. <br/>If required, you can select a different recovery point from the retention window of 72 hours.<br/><br/> 5. Commit the failover to finish up. The commit action deletes all recovery points.<br/> For Windows VMs, Site Recovery disables the VMware tools during failover.

## Failover processing

In some scenarios, failover requires additional processing that takes around 8 to 10 minutes to complete. You might notice longer test failover times for:

* VMware VMs running a Mobility service version older than 9.8.
* Physical servers.
* VMware Linux VMs.
* Hyper-V VMs protected as physical servers.
* VMware VMs that don't have the DHCP service enabled.
* VMware VMs that don't have the following boot drivers: storvsc, vmbus, storflt, intelide, atapi.

## Recovery point options

During failover, you can select a number of recovery point options.

**Option** | **Details**
--- | ---
**Latest (lowest RPO)** | This option provides the lowest recovery point objective (RPO). It first processes all the data that has been sent to Site Recovery service, to create a recovery point for each VM, before failing over to it. This recovery point has all the data replicated to Site Recovery when the failover was triggered.
**Latest processed**  | This option fails over VMs to the latest recovery point processed by Site Recovery. To see the latest recovery point for a specific VM, check **Latest Recovery Points** in the VM settings. This option provides a low RTO (Recovery Time Objective), because no time is spent processing unprocessed data.
**Latest app-consistent** |  This option fails over VMs to the latest application-consistent recovery point processed by Site Recovery, if app-consistent recovery points are enabled. Check the latest recovery point in the VM settings.
**Latest multi-VM processed** | This option is available for recovery plans with one or more VMs that have multi-VM consistency enabled. VMs with the setting enabled fail over to the latest common multi-VM consistent recovery point. Any other VMs in the plan fail over to the latest processed recovery point.
**Latest multi-VM app-consistent** |  This option is available for recovery plans with one or more VMs that have multi-VM consistency enabled. VMs that are part of a replication group fail over to the latest common multi-VM application-consistent recovery point. Other VMs fail over to their latest application-consistent recovery point.
**Custom** | Use this option to fail over a specific VM to a particular recovery point in time. This option isn't available for recovery plans.

> [!NOTE]
> Recovery points can't be migrated to another Recovery Services vault.

## Reprotection/failback

After failover to Azure, the replicated Azure VMs are in an unprotected state.

- As a first step to failing back to your on-premises site, you need to start the Azure VMs replicating to on-premises. The reprotection process depends on the type of machines you failed over.
- After machines are replicating from Azure to on-premises, you can run a failover from Azure to your on-premises site.
- After machines are running on-premises again, you can enable replication so that they replicate to Azure for disaster recovery.

Failback works as follows:

- To fail back, a VM needs at least one recovery point in order to fail back. In a recovery plan, all VMs in the plan need at least one recovery point.
- We recommend that you use the **Latest** recovery point to fail back (this is a crash-consistent point).
	- There is an app-consistent recovery point option. In this case, a single VM recovers to its latest available app-consistent recovery point. For a recovery plan with a replication group, each replication group recovers to its common available recovery point.
	- App-consistent recovery points can be behind in time, and there might be loss in data.
- During failover from Azure to the on-premises site, Site Recovery shuts down the Azure VMs. When you commit the failover, Site Recovery removes the failed back Azure VMs in Azure.


## VMware/physical reprotection/failback

To reprotect and fail back VMware machines and physical servers from Azure to on-premises, you need a failback infrastructure, and there are a number of requirements.

- **Temporary process server in Azure**: To fail back from Azure, you set up an Azure VM to act as a process server to handle replication from Azure. You can delete this VM after failback finishes.
- **VPN connection**: To fail back, you need a VPN connection (or ExpressRoute) from the Azure network to the on-premises site.
- **Separate master target server**: By default, the master target server that was installed with the configuration server on the on-premises VMware VM handles failback. If you need to fail back large volumes of traffic, set up a separate on-premises master target server for this purpose.
- **Failback policy**: To replicate back to your on-premises site, you need a failback policy. This policy is automatically created when you create a replication policy from on-premises to Azure.
    - This policy is automatically associated with the configuration server.
	- You can't edit this policy.
	- Policy values: RPO threshold - 15 minutes; Recovery point retention - 24 Hours; App-consistent snapshot frequency - 60 minutes.

Learn more about VMware/physical reprotection and failback:
- [Review](vmware-azure-reprotect.md#before-you-begin) additional requirements for reprotection and failback.
- [Deploy](vmware-azure-prepare-failback.md#deploy-a-process-server-in-azure) a process server in Azure.
- [Deploy](vmware-azure-prepare-failback.md#deploy-a-separate-master-target-server) a separate master target server.

When you reprotect Azure VMs to on-premises, you can specify that you want to fail back to the original location, or to an alternate location.

- **Original location recovery**: This fails back from Azure to the same source on-premises machine if it exists. In this scenario, only changes are replicated back to on-premises.
- **Alternate location recovery**: If the on-premises machine doesn't exist, you can fail back from Azure to an alternate location. When you reprotect the Azure VM to on-premises, the on-premises machine is created. Full data replication occurs from Azure to on-premises. - - [Review](concepts-types-of-failback.md) the requirements and limitations for location failback.



## Hyper-V reprotection/failback

To reprotect and fail back Hyper-V VMs from Azure to on-premises:

- You can only fail back Hyper-V VMs replicating using a storage account. Failback of Hyper-V VMs that replicate using managed disks isn't supported.
- On-premises Hyper-V hosts (or System Center VMM if used) should be connected to Azure.
- You run a planned failback from Azure to on-premises.
- No specific components need to be set up for Hyper-V VM failback.
- During planned failover, you can select options to synchronize data before failback:
    - **Synchronize data before failover**: This option minimizes downtime for virtual machines as it synchronizes machines without shutting them down.
	    - Phase 1: Takes a snapshot of the Azure VM and copies it to the on-premises Hyper-V host. The machine continues running in Azure.
		- Phase 2: Shuts down the Azure VM so that no new changes occur there. The final set of delta changes is transferred to the on-premises server and the on-premises VM is started up.
    - **Synchronize data during failover only**: This option is faster because we expect that most of the disk has changed, and thus don't perform checksum calculations. It performs a download of the disk. We recommend that you use this option if the VM has been running in Azure for a while (a month or more), or if the on-premises VM has been deleted.

[Learn more](hyper-v-azure-failback.md) about Hyper-V reprotection and failback.

When you reprotect Azure VMs to on-premises, you can specify that you want to fail back to the original location, or to an alternate location.

- **Original location recovery**: This fails back from Azure to the same source on-premises machine if it exists. In this scenario, you select one of the synchronization options described in the previous procedure.
- **Alternate location recovery**: If the on-premises machine doesn't exist, you can fail back from Azure to an alternate location. When you reprotect the Azure VM to on-premises, the on-premises machine is created. With this option, we recommend that you select the option to synchronize data before failover
- [Review](hyper-v-azure-failback.md) the requirements and limitations for location failback.


After failing back to the on-premises site, you enable **Reverse Replicate** to start replicating the VM to Azure, completing the cycle.




## Next steps
- Fail over [specific VMware VMs](vmware-azure-tutorial-failover-failback.md)
- Fail over [specific Hyper-V VMs](hyper-v-azure-failover-failback-tutorial.md).
- [Create](site-recovery-create-recovery-plans.md) a recovery plan.
- Fail over [VMs in a recovery plan](site-recovery-failover.md).
- [Prepare for](vmware-azure-failback.md) VMware reprotection and failback.
- Fail back [Hyper-V VMs](hyper-v-azure-failback.md).
