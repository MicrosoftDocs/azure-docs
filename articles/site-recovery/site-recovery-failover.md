---
title: Failover in Site Recovery | Microsoft Docs
description: Azure Site Recovery coordinates the replication, failover and recovery of virtual machines and physical servers. Learn about failover to Azure or a secondary datacenter.
services: site-recovery
author: rayne-wiselman
manager: carmonm
ms.service: site-recovery
ms.topic: article
ms.date: 09/11/2018
ms.author: ponatara

---
# Failover in Site Recovery
This article describes how to failover virtual machines and physical servers protected by Site Recovery.

## Prerequisites
1. Before you do a failover, do a [test failover](site-recovery-test-failover-to-azure.md) to ensure that everything is working as expected.
1. [Prepare the network](site-recovery-network-design.md) at target location before you do a failover.  

Use the following table to know about the failover options provided by Azure Site Recovery. These options are also listed for different failover scenarios.

| Scenario | Application recovery requirement | Workflow for Hyper-V | Workflow for VMware
|---|--|--|--|
|Planned failover due to an upcoming datacenter downtime| Zero data loss for the application when a planned activity is performed| For Hyper-V, ASR replicates data at a copy frequency that is specified by the user. Planned Failover is used to override the frequency and replicate the final changes before a failover is initiated. <br/> <br/> 1.	Plan a maintenance window as per your business's change management process. <br/><br/> 2.Notify users of upcoming downtime. <br/><br/> 3. Take the user-facing application offline.<br/><br/>4.Initiate Planned Failover using the ASR portal. The on-premises virtual machine is automatically shut-down.<br/><br/>Effective application data loss = 0 <br/><br/>A journal of recovery points is also provided in a retention window for a user who wants to use an older recovery point. (24 hours retention for Hyper-V).| For VMware, ASR replicates data continually using CDP. Failover gives the user the option to failover to the Latest data (including post application shut-down)<br/><br/> 1. Plan a maintenance window as per the change management process <br/><br/>2.Notify users of upcoming downtime <br/><br/>3.	Take the user-facing application offline. <br/><br/>4.	Initiate a Planned Failover using ASR portal to the Latest point after the application is offline. Use the "Unplanned Failover" option on the portal and select the Latest point to failover. The on-premises virtual machine is automatically shut-down.<br/><br/>Effective application data loss = 0 <br/><br/>A journal of recovery points in a retention window is provided for a customer who wants to use an older recovery point. (72 hours of retention for VMware).
|Failover due to an unplanned datacenter downtime (natural or IT disaster) | Minimal data loss for the application | 1.Initiate the organization’s BCP plan <br/><br/>2. Initiate Unplanned Failover using ASR portal to the Latest or a point from the retention window (journal).| 1.	Initiate the organization’s BCP plan. <br/><br/>2.	Initiate unplanned Failover using ASR portal to the Latest or a point from the retention window (journal).


## Run a failover
This procedure describes how to run a failover for a [recovery plan](site-recovery-create-recovery-plans.md). Alternatively you can run the failover for a single virtual machine or physical server from the **Replicated items** page as described [here](vmware-azure-tutorial-failover-failback.md#run-a-failover-to-azure).


![Failover](./media/site-recovery-failover/Failover.png)

1. Select **Recovery Plans** > *recoveryplan_name*. Click **Failover**
2. On the **Failover** screen, select a **Recovery Point** to failover to. You can use one of the following options:
	1.  **Latest**: This option starts the job by first processing all the data that has been sent to Site Recovery service. Processing the data creates a recovery point for each virtual machine. This recovery point is used by the virtual machine during failover. This option provides the lowest RPO (Recovery Point Objective) as the virtual machine created after failover has all the data that has been replicated to Site Recovery service when the failover was triggered.
	1.  **Latest processed**: This option fails over all virtual machines of the recovery plan to the latest recovery point that has already been processed by Site Recovery service. When you are doing test failover of a virtual machine, time stamp of the latest processed recovery point is also shown. If you are doing failover of a recovery plan, you can go to individual virtual machine and look at **Latest Recovery Points** tile to get this information. As no time is spent to process the unprocessed data, this option provides a low RTO (Recovery Time Objective) failover option.
	1.  **Latest app-consistent**: This option fails over all virtual machines of the recovery plan to the latest application consistent recovery point that has already been processed by Site Recovery service. When you are doing test failover of a virtual machine, time stamp of the latest app-consistent recovery point is also shown. If you are doing failover of a recovery plan, you can go to individual virtual machine and look at **Latest Recovery Points** tile to get this information.
	1.  **Latest multi-VM processed**: This option is only available for recovery plans that have at least one virtual machine with multi-VM consistency ON. Virtual machines that are part of a replication group failover to the latest common multi-VM consistent recovery point. Other virtual machines failover to their latest processed recovery point.  
	1.  **Latest multi-VM app-consistent**: This option is only available for recovery plans that have at least one virtual machine with multi-VM consistency ON. Virtual machines that are part of a replication group failover to the latest common multi-VM application-consistent recovery point. Other virtual machines failover to their latest application-consistent recovery point.
	1.	**Custom**: If you are doing test failover of a virtual machine, then you can use this option to failover to a particular recovery point.

	> [!NOTE]
	> The option to choose a recovery point is only available when you are failing over to Azure.
	>
	>


1. If some of the virtual machines in the recovery plan were failed over in a previous run and now the virtual machines are active on both source and target location, you can use **Change direction** option to decide the direction in which the failover should happen.
1. If you're failing over to Azure and data encryption is enabled for the cloud (applies only when you have protected Hyper-v virtual machines from a VMM Server), in **Encryption Key** select the certificate that was issued when you enabled data encryption during setup on the VMM server.
1. Select **Shut-down machine before beginning failover** if you want Site Recovery to attempt to do a shutdown of source virtual machines before triggering the failover. Failover continues even if shut-down fails.  

	> [!NOTE]
	> If Hyper-v virtual machines are protected, the option to shut-down also tries to synchronize the on-premises data that has not yet been sent to the service before triggering the failover.
	>
	>

1. You can follow the failover progress on the **Jobs** page. Even if errors occur during an unplanned failover, the recovery plan runs until it is complete.
1. After the failover, validate the virtual machine by logging-in to it. If you want to switch to another recovery point of the virtual machine, then you can use **Change recovery point** option.
1. Once you are satisfied with the failed over virtual machine, you can **Commit** the failover. **Commit deletes all the recovery points available with the service** and **Change recovery point** option is no longer available.

## Planned failover
Virtual machines/physical servers protected using Site Recovery also support **Planned failover**. Planned failover is a zero data loss failover option. When a planned failover is triggered, first the source virtual machines are shut-down, the latest data is synchronized and then a failover is triggered.

> [!NOTE]
> During failover of Hyper-v virtual machines from one on-premises site to another on-premises site, to come back to the primary on-premises site you have to first **reverse-replicate** the virtual machine back to primary site and then trigger a failover. If the primary virtual machine is not available, then before starting to **reverse-replicate** you have to restore the virtual machine from a backup.   
>
>
## Failover job

![Failover](./media/site-recovery-failover/FailoverJob.png)

When a  failover is triggered, it involves following steps:

1. Prerequisites check: This step ensures that all conditions required for failover are met
1. Failover: This step processes the data and makes it ready so that an Azure virtual machine can be created out of it. If you have chosen **Latest** recovery point, this step creates a recovery point from the data that has been sent to the service.
1. Start: This step creates an Azure virtual machine using the data processed in the previous step.

> [!WARNING]
> **Don't Cancel an in progress failover**: Before failover is started, replication for the virtual machine is stopped. If you **Cancel** an in progress job, failover stops but the virtual machine will not start to replicate. Replication cannot be started again.
>
>

## Time taken for failover to Azure

In certain cases, failover of virtual machines requires an extra intermediate step that usually takes around 8  to 10 minutes to complete. In the following cases, the time taken to failover will be higher than usual:

* VMware virtual machines using mobility service of version older than 9.8
* Physical servers
* VMware Linux virtual machines
* Hyper-V virtual machines protected as physical servers
* VMware virtual machines where following drivers are not present as boot drivers
	* storvsc
	* vmbus
	* storflt
	* intelide
	* atapi
* VMware virtual machines that don't have DHCP service enabled irrespective of whether they are using DHCP or static IP addresses

In all the other cases, this intermediate step is not required and the time taken for the failover is lower.

## Using scripts in Failover
You might want to automate certain actions while doing a failover. You can use scripts or [Azure automation runbooks](site-recovery-runbook-automation.md) in [recovery plans](site-recovery-create-recovery-plans.md) to do that.

## Post failover considerations
Post failover you might want to consider the following recommendations:
### Retaining drive letter after failover
To retain the drive letter on virtual machines after failover, you can set the **SAN Policy** for the virtual machine to **OnlineAll**. [Read more](https://support.microsoft.com/help/3031135/how-to-preserve-the-drive-letter-for-protected-virtual-machines-that-are-failed-over-or-migrated-to-azure).

## Prepare to connect to Azure VMs after failover

If you want to connect to Azure VMs using RDP/SSH after failover, follow the requirements summarized in the table [here](site-recovery-test-failover-to-azure.md#prepare-to-connect-to-azure-vms-after-failover).

Follow the steps described [here](site-recovery-failover-to-azure-troubleshoot.md) to troubleshoot any connectivity issues post failover.


## Next steps

> [!WARNING]
> Once you have failed over virtual machines and the on-premises data center is available, you should [**Reprotect**](vmware-azure-reprotect.md) VMware virtual machines back to the on-premises data center.

Use [**Planned failover**](hyper-v-azure-failback.md) option to **Failback** Hyper-v virtual machines back to on-premises from Azure.

If you have failed over a Hyper-v virtual machine to another on-premises data center managed by a VMM server and the primary data center is available, then use **Reverse replicate** option to start the replication back to the primary data center.
