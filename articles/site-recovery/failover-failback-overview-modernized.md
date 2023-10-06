---
title: About failover and failback in Azure Site Recovery - Modernized
description: Learn about failover and failback in Azure Site Recovery - Modernized
ms.topic: conceptual
ms.date: 10/06/2023
ms.author: ankitadutta
ms.service: site-recovery
author: ankitaduttaMSFT
---
# About on-premises disaster recovery failover/failback - Modernized

This article provides an overview of failover and failback during disaster recovery of on-premises machines to Azure with [Azure Site Recovery](site-recovery-overview.md) - Modernized.

For information about failover and failback in Azure Site Recovery Classic releases, [see this article](failover-failback-overview.md).

## Recovery stages

Failover and failback in Site Recovery has four stages:

- **Stage 1: Fail over from on-premises**: After setting up replication to Azure for on-premises machines, when your on-premises site goes down, you fail those machines over to Azure. After failover, Azure VMs are created from replicated data.
- **Stage 2: Reprotect Azure VMs**: In Azure, you reprotect the Azure VMs so that they start replicating back to the on-premises site. The on-premises VM (if available) is turned off during reprotection, to help ensure data consistency.
- **Stage 3: Fail over from Azure**: When your on-premises site is running as normal again, you run another failover, this time to fail back Azure VMs to your on-premises site. You can fail back to the original location from which you failed over, or to an alternate location. This activity is referred as *planned failover*.
- **Stage 4: Reprotect on-premises machines**: After failing back, again enable replication of the on-premises machines to Azure.

## Failover

You perform a failover as part of your business continuity and disaster recovery (BCDR) strategy.

- As a first step in your BCDR strategy, you replicate your on-premises machines to Azure on an ongoing basis. Users access workloads and apps running on the on-premises source machines.
- If the need arises, for example if there's an outage on-premises, you fail the replicating machines over to Azure. Azure VMs are created using the replicated data.
- For business continuity, users can continue accessing apps on the Azure VMs.

Failover is a two-phase activity:

- **Failover**: The failover that creates and brings up an Azure VM using the selected recovery point.
- **Commit**: After failover you verify the VM in Azure:
    - You can then commit the failover to the selected recovery point or select a different point for the commit.
    - After committing the failover, the recovery point can't be changed.


## Connect to Azure after failover

To connect to the Azure VMs created after failover using RDP/SSH, there are several requirements.

**Failover** | **Location** | **Actions**
--- | --- | ---
**Azure VM running Windows** | On the on-premises machine before failover | **Access over the internet**: Enable RDP. Make sure that TCP and UDP rules are added for **Public**, and that RDP is allowed for all profiles in **Windows Firewall** > **Allowed Apps**.<br/><br/> **Access over site-to-site VPN**: Enable RDP on the machine. Check that RDP is allowed in the **Windows Firewall** -> **Allowed apps and features**, for **Domain and Private** networks.<br/><br/>  Make sure the operating system SAN policy is set to **OnlineAll**. [Learn more](https://support.microsoft.com/kb/3031135).<br/><br/> Make sure there are no Windows updates pending on the VM when you trigger a failover. Windows Update might start when you failover, and you won't be able to log onto the VM until updates are done.
**Azure VM running Windows** | On the Azure VM after failover |  [Add a public IP address](/archive/blogs/srinathv/how-to-add-a-public-ip-address-to-azure-vm-for-vm-failed-over-using-asr) for the VM.<br/><br/> The network security group rules on the failed over VM (and the Azure subnet to which it is connected) must allow incoming connections to the RDP port.<br/><br/> Check **Boot diagnostics** to verify a screenshot of the VM. If you can't connect, check that the VM is running, and review [troubleshooting tips](https://social.technet.microsoft.com/wiki/contents/articles/31666.troubleshooting-remote-desktop-connection-after-failover-using-asr.aspx).
**Azure VM running Linux** | On the on-premises machine before failover | Ensure that the Secure Shell service on the VM is set to start automatically on system boot.<br/><br/> Check that firewall rules allow an SSH connection to it.
**Azure VM running Linux** | On the Azure VM after failover | The network security group rules on the failed over VM (and the Azure subnet to which it is connected) need to allow incoming connections to the SSH port.<br/><br/> [Add a public IP address](/archive/blogs/srinathv/how-to-add-a-public-ip-address-to-azure-vm-for-vm-failed-over-using-asr) for the VM.<br/><br/> Check **Boot diagnostics** for a screenshot of the VM.<br/><br/>

## Types of failover

Site Recovery provides different failover options.

**Failover** | **Details** | **Recovery** | **Workflow**
--- | --- | --- | ---
**Test failover** | Used to run a drill that validates your BCDR strategy, without any data loss or downtime.| Creates a copy of the VM in Azure, with no impact on ongoing replication, or on your production environment. | 1. Run a test failover on a single VM, or on multiple VMs in a recovery plan.<br/><br/> 2. Select a recovery point to use for the test failover.<br/><br/> 3. Select an Azure network in which the Azure VM will be located when it's created after failover. The network is only used for the test failover.<br/><br/> 4. Verify that the drill worked as expected. Site Recovery automatically cleans up VMs created in Azure during the drill.
**Planned failover-Hyper-V**  | Usually used for planned downtime.<br/><br/> Source VMs are shut down. The latest data is synchronized before initiating the failover. | Zero data loss for the planned workflow. | 1. Plan a downtime maintenance window and notify users.<br/><br/> 2. Take user-facing apps offline.<br/><br/> 3. Initiate a planned failover with the latest recovery point. The failover doesn't run if the machine isn't shut down, or if errors are encountered.<br/><br/> 4. After the failover, check that the replica Azure VM is active in Azure.<br/><br/> 5. Commit the failover to finish up. The commit action deletes all recovery points.
**Failover-Hyper-V** | Usually run if there's an unplanned outage, or the primary site isn't available.<br/><br/> Optionally shut down the VM and synchronize final changes before initiating the failover.  | Minimal data loss for apps. | 1. Initiate your BCDR plan. <br/><br/> 2. Initiate a failover. Specify whether Site Recovery should shut down the VM and synchronize/replicate the latest changes before triggering the failover.<br/><br/> 3. You can failover to a number of recovery point options, summarized in the table below.<br/><br/> If you don't enable the option to shut down the VM, or if Site Recovery can't shut it down, the latest recovery point is used.<br/>The failover runs even if the machine can't be shut down.<br/><br/> 4. After failover, you check that the replica Azure VM is active in Azure.<br/> If required, you can select a different recovery point from the retention window of 24 hours.<br/><br/> 5. Commit the failover to finish up. The commit action deletes all available recovery points.
**Failover-VMware** | Usually run if there's an unplanned outage, or the primary site isn't available.<br/><br/> Optionally specify that Site Recovery should try to trigger a shutdown of the VM, and to synchronize and replicate final changes before initiating the failover.  | Minimal data loss for apps. | 1. Initiate your BCDR plan. <br/><br/> 2. Initiate a failover from Site Recovery. Specify whether Site Recovery should try to trigger VM shutdown and synchronize before running the failover.<br/> The failover runs even if the machines can't be shut down.<br/><br/> 3. After the failover, check that the replica Azure VM is active in Azure. <br/>If required, you can select a different recovery point from the retention window of 72 hours.<br/><br/> 5. Commit the failover to finish up. The commit action deletes all recovery points.<br/> For Windows VMs, Site Recovery disables the VMware tools during failover.
**Planned failover-VMware** | You can perform a planned failover from Azure to on-premises. | Since it is a planned failover activity, the recovery point is generated after the planned failover job is triggered. | When the planned failover is triggered, pending changes are copied to on-premises, a latest recovery point of the VM is generated and Azure VM is shut down.<br/><br/> Follow the failover process as discussed [here](vmware-azure-tutorial-failover-failback-modernized.md#planned-failover-from-azure-to-on-premises). Post this, on-premises machine is turned on. After a successful planned failover, the machine will be active in your on-premises environment.

## Failover processing

In some scenarios, failover requires additional processing that takes around 8 to 10 minutes to complete. You might notice longer test failover times for:

* VMware VMs that don't have the DHCP service enabled.
* VMware VMs that don't have the following boot drivers: storvsc, vmbus, storflt, intelide, atapi.

## Recovery point options

During failover, you can select a number of recovery point options.

**Option** | **Details**
--- | ---
**Latest (lowest RPO)** | This option provides the lowest recovery point objective (RPO). It first processes all the data that has been sent to Site Recovery service, to create a recovery point for each VM, before failing over to it. It initially attempts to process and apply all data sent to Site Recovery service in the target location and create a recovery point using the processed data. However, if at the time failover was triggered, there is no data uploaded to Site Recovery service waiting to be processed, Azure Site Recovery will not perform any processing and hence, won't create a new recovery point. In this scenario, it will instead failover using the previously processed recovery point only.
**Latest processed**  | This option fails over VMs to the latest recovery point processed by Site Recovery. To see the latest recovery point for a specific VM, check **Latest Recovery Points** in the VM settings. This option provides a low RTO (Recovery Time Objective), because no time is spent processing unprocessed data.
**Latest app-consistent** |  This option fails over VMs to the latest application-consistent recovery point processed by Site Recovery if app-consistent recovery points are enabled. Check the latest recovery point in the VM settings.
**Latest multi-VM processed** | This option is available for recovery plans with one or more VMs that have multi-VM consistency enabled. VMs with the setting enabled failover to the latest common multi-VM consistent recovery point. Any other VMs in the plan failover to the latest processed recovery point.
**Latest multi-VM app-consistent** |  This option is available for recovery plans with one or more VMs that have multi-VM consistency enabled. VMs that are part of a replication group failover to the latest common multi-VM application-consistent recovery point. Other VMs failover to their latest application-consistent recovery point.
**Custom** | Use this option to failover a specific VM to a particular recovery point in time. This option isn't available for recovery plans.

> [!NOTE]
> Recovery points can't be migrated to another Recovery Services vault.

## Reprotection/planned failover

After failover to Azure, the replicated Azure VMs are in an unprotected state.

- As a first step to failing back to your on-premises site, you need to start the Azure VMs replicating to on-premises. The reprotection process depends on the type of machines you failed over.
- After machines are replicating from Azure to on-premises, you can run a failover from Azure to your on-premises site.
- After machines are running on-premises again, you can enable replication so that they replicate to Azure for disaster recovery.
- Only disks replicated from on-premises to Azure will be replicated back from Azure during re-protect operation. Newly added disks to failed over Azure VM will not be replicated to on-premises machine. 
- An appliance can have up to 60 disks attached to it. If the VMs being failed back have more than a collective total of 60 disks, or if you're failing back large volumes of traffic, create a separate appliance for failback.

**Planned failover works as follows**:

- To fail back to on-premises, a VM needs at least one recovery point in order to fail back. In a recovery plan, all VMs in the plan need at least one recovery point.
- As this is a planned failover activity, you will be allowed to select the type of recovery point you want to fail back to. We recommend that you use a crash-consistent point.
	- There is also an app-consistent recovery point option. In this case, a single VM recovers to its latest available app-consistent recovery point. For a recovery plan with a replication group, each replication group recovers to its common available recovery point.
	- App-consistent recovery points can be behind in time, and there might be loss in data.
- During failover from Azure to the on-premises site, Site Recovery shuts down the Azure VMs. When you commit the failover, Site Recovery removes the failed back Azure VMs in Azure.


## VMware/physical reprotection/failback

To reprotect and fail back VMware machines and physical servers from Azure to on-premises, ensure that you have a healthy appliance.

**Appliance selection**

- You can select any of the Azure Site Recovery replication appliances registered under a vault to re-protect to on-premises. You do not require a separate Process server in Azure for re-protect operation and a scale-out Master Target server for Linux VMs.
- Replication appliance doesn’t require additional network connection/ports (as compared with forward protection) during failback. Same appliance can be used for forward and backward protections if it is in healthy state. It should not impact the performance of the replications.
- When selecting the appliance, ensure that the target datastore where the source machine is located, is accessible by the appliance. The datastore of the source machine should always be accessible by the appliance. Even if the machine and appliance are located in different ESX servers, as long as the data store is shared between them, reprotection will succeed. 
  > [!NOTE]
  > - Storage vMotion of replication appliance is not supported after re-protect operation.
  > - When selecting the appliance, ensure that the target datastore where the source machine is located, is accessible by the appliance.


**Re-protect job**

- If this is a new re-protect operation, then by default, a new log storage account will be automatically created by Azure Site Recovery in the target region. Retention disk is not required.
- In case of Alternate Location Recovery and Original Location Recovery, the original configurations of source machines will be retrieved.
  > [!NOTE]
  > - Static IP address can’t be retained in case of Alternate location re-protect (ALR) or Original location re-protect (OLR).
  > - fstab, LVMconf would be changed.


**Failure**

- Any failed re-protect job can be retried. During retry, you can choose any healthy replication appliance.

When you reprotect Azure machines to on-premises, you will be notified that you are failing back to the original location, or to an alternate location.

- **Original location recovery**: This fails back from Azure to the same source on-premises machine if it exists. In this scenario, only changes are replicated back to on-premises.
  - **Data store selection during OLR**: The data store attached to the source machine will be automatically selected.
- **Alternate location recovery**: If the on-premises machine doesn't exist, you can fail back from Azure to an alternate location. When you reprotect the Azure VM to on-premises, the on-premises machine is created. Full data replication occurs from Azure to on-premises. [Review](concepts-types-of-failback.md) the requirements and limitations for location failback.
  - **Data store selection during ALR**: Any data store managed by vCenter on which the appliance is situated and is accessible (read and write permissions) by the appliance can be chosen (original/new). You can choose cache storage account used for re-protection.

- After failover is complete, mobility agent in the Azure VM will be registered with Site Recovery Services automatically. If registration fails, a critical health issue will be raised on the failed over VM. After issue is resolved, registration will be automatically triggered. You can manually complete the registration after resolving the errors.


## Cancel failover

If your on-premises environment is not ready or if you face any challenges, you can cancel the failover.

Once you have initiated the planned failover and it completes successfully, your on-premises environment becomes  available for usage. But after the completion of the operation, if you want to failover to a different recovery point, then you can cancel the failover.


- Only planned failover can be canceled.

- You can cancel a planned failover from the **Replicated items** page in your Recovery Services vault.

- After the failover is canceled, your machines in Azure are turned back on, and replication once again starts from Azure to on-premises.


## Next steps

> [!div class="nextstepaction"]
> [Failover VMware VMs to Azure (modernized)](vmware-azure-tutorial-failover-failback-modernized.md#run-a-failover-to-azure)

> [!div class="nextstepaction"]
> [Planned failover (modernized)](vmware-azure-tutorial-failover-failback-modernized.md#planned-failover-from-azure-to-on-premises)

> [!div class="nextstepaction"]
> [Re-protect (modernized)](vmware-azure-tutorial-failover-failback-modernized.md#re-protect-the-on-premises-machine-to-azure-after-successful-planned-failover)

> [!div class="nextstepaction"]
> [Cancel failover (modernized)](vmware-azure-tutorial-failover-failback-modernized.md#cancel-planned-failover)


