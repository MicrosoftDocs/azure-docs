---
title: Failover in Site Recovery | Microsoft Docs
description: Azure Site Recovery coordinates the replication, failover and recovery of virtual machines and physical servers. Learn about failover to Azure or a secondary datacenter.
services: site-recovery
documentationcenter: ''
author: prateek9us
manager: gauravd
editor: ''

ms.assetid: 44813a48-c680-4581-a92e-cecc57cc3b1e
ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 06/05/2017
ms.author: pratshar

---
# Failover in Site Recovery
This article describes how to failover virtual machines and physical servers protected by Site Recovery.

## Prerequisites
1. Before you do a failover, do a [test failover](site-recovery-test-failover-to-azure.md) to ensure that everything is working as expected.
1. [Prepare the network](site-recovery-network-design.md) at target location before you do a failover.  


## Run a failover
This procedure describes how to run a failover for a [recovery plan](site-recovery-create-recovery-plans.md). Alternatively you can run the failover for a single virtual machine or physical server from the **Replicated items** page


![Failover](./media/site-recovery-failover/Failover.png)

1. Select **Recovery Plans** > *recoveryplan_name*. Click **Failover**
2. On the **Failover** screen, select a **Recovery Point** to failover to. You can use one of the following options:
	1.    **Latest** (default): This option first processes all the data that has been sent to Site Recovery service to create a recovery point for each virtual machine before failing them over to it. This option provides the lowest RPO (Recovery Point Objective) as the virtual machine created after failover has all the data that has been replicated to Site Recovery service when the failover was triggered.
	1.  **Latest processed**: This option fails over all virtual machines of the recovery plan to the latest recovery point that has already been processed by Site Recovery service. When you are doing test failover of a virtual machine, time stamp of the latest processed recovery point is also shown. If you are doing failover of a recovery plan, you can go to individual virtual machine and look at **Latest Recovery Points** tile to get this information. As no time is spent to process the unprocessed data, this option provides a low RTO (Recovery Time Objective) failover option.
	1.    **Latest app-consistent**: This option fails over all virtual machines of the recovery plan to the latest application consistent recovery point that has already been processed by Site Recovery service. When you are doing test failover of a virtual machine, time stamp of the latest app-consistent recovery point is also shown. If you are doing failover of a recovery plan, you can go to individual virtual machine and look at **Latest Recovery Points** tile to get this information.
	1.	**Custom**: If you are doing test failover of a virtual machine, then you can use this option to failover to a particular recovery point.

	> [!NOTE]
	> The option to choose a recovery point is only available when you are failing over to Azure.
	>
	>


1. If some of the virtual machines in the recovery plan were failed over in a previous run and now the virtual machines are active on both source and target location, you can use **Change direction** option to decide the direction in which the failover should happen.
1. If you're failing over to Azure and data encryption is enabled for the cloud (applies only when you have protected Hyper-v virtual machines from a VMM Server), in **Encryption Key** select the certificate that was issued when you enabled data encryption during setup on the VMM server.
1. Select **Shut down machine before beginning failover** if you want Site Recovery to attempt do a shutdown of source virtual machines before triggering the failover. Failover continues even if shutdown fails.  

	> [!NOTE]
	> In case of Hyper-v virtual machines, this option also tries to synchronize the on-premises data that has not yet been sent to the service before triggering the failover.
	>
	>

1. You can follow the failover progress on the **Jobs** page. Even if errors occur during an unplanned failover, the recovery plan runs until it is complete.
1. After the failover, validate the virtual machine by logging into it. If you want to go another recovery point for the virtual machine, then you can use **Change recovery point** option.
1. Once you are satisfied with the failed over virtual machine, you can **Commit** the failover. This deletes all the recovery points available with the service and **Change recovery point** option will no longer be available.

## Planned failover
Apart from, Failover, Hyper-V virtual machines protected using Site Recovery also support **Planned failover**. This is a zero data loss failover option. When a planned failover is triggered, first the source virtual machines are shutdown, the data yet to be synchronized is synchronized and then a failover is triggered.

> [!NOTE]
> When you failover Hyper-v virtual machines from one on-premises site to another on-premises site, to come back to the primary on-premises site you have to first **reverse replicate** the virtual machine back to primary site and then trigger a failover. If the primary virtual machine is not available, then before starting to **reverse replicate** you have to restore the virtual machine from a backup.   
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

In certain cases, failover of virtual machines requires an extra intermediate step that usually takes around 8  to 10 minutes to complete. These cases are as following:

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

In all the other cases this intermediate step is not required and the time taken for the failover is significantly lower. 





## Using scripts in Failover
You might want to automate certain actions while doing a failover. You can use scripts or [Azure automation runbooks](site-recovery-runbook-automation.md) in [recovery plans](site-recovery-create-recovery-plans.md) to do that.

## Other considerations
* **Drive letter** — To retain the drive letter on virtual machines after failover you can set the **SAN Policy** for the virtual machine to **OnlineAll**. [Read more](https://support.microsoft.com/en-us/help/3031135/how-to-preserve-the-drive-letter-for-protected-virtual-machines-that-are-failed-over-or-migrated-to-azure).



## Next steps
Once you have failed over virtual machines and the on-premises data center is available, you should [**Re-protect**](site-recovery-how-to-reprotect.md) VMware virtual machines back to the on-premises data center.

Use [**Planned failover**](site-recovery-failback-from-azure-to-hyper-v.md) option to **Failback** Hyper-v virtual machines back to on-premises from Azure.

If you have failed over a Hyper-v virtual machine to another on-premises data center managed by a VMM server and the primary data center is available, then use **Reverse replicate** option to start the replication back to the primary data center.
