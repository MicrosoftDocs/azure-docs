---
title: 'Common questions - Azure to Azure disaster recovery with Azure Site Recovery | Microsoft Docs'
description: This article summarizes common questions when you set up disaster recovery of Azure VMs to aonther Azure region using Azure Site Recovery
author: asgang
manager: rochakm
ms.service: site-recovery
ms.date: 12/12/2018
ms.topic: conceptual
ms.author: asgang

---
# Common questions - Azure to Azure replication

This article provides answers to common questions we see when deploying disaster recovery of Azure VMs to another Azure region. If you have questions after reading this article, post them on the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/Forums/azure/home?forum=hypervrecovmgr).


## General
### How is Site Recovery priced?
Review [Azure Site Recovery pricing](https://azure.microsoft.com/blog/know-exactly-how-much-it-will-cost-for-enabling-dr-to-your-azure-vm/) details.

### How to configure Site Recovery on Azure VMs. What are the best practices?
1. [Understand Azure to Azure architecture](azure-to-azure-architecture.md)
2. [Review the supported and not-supported configurations](azure-to-azure-support-matrix.md)
3. [Set up disaster recovery for Azure VMs](azure-to-azure-how-to-enable-replication.md)
4. [Run a test failover](azure-to-azure-tutorial-dr-drill.md)
5. [Failover and failback to primary region](azure-to-azure-tutorial-failover-failback.md)

## Replication

### Can I replicate Azure disk encryption enabled VMs?
Yes, you can replicate them. Refer [article](azure-to-azure-how-to-enable-replication-ade-vms.md) to enable replication of Azure disk encryption (ADE) enabled VMs. Please note that only Azure VMs running Windows OS and enabled for encryption with Azure AD app are currently supported by Azure Site Recovery.

### Can I replicate VMs to another subscription?
Yes, You can replicate Azure VMs to a different subscription with in the same Azure Active Directory tenant.
Configuring DR [across subscriptions](https://azure.microsoft.com/blog/cross-subscription-dr) is simple. You can select another subscription at the time of replication.

### Can I replicate zone pinned Azure VMs to another region.
Yes, you can [replicate zone pinned VMs](https://azure.microsoft.com/blog/disaster-recovery-of-zone-pinned-azure-virtual-machines-to-another-region) to another region.

### Can I exclude disks?

Yes, you can exclude disks at the time of protection using power shell. Refer [powershell guidance](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-powershell#replicate-azure-virtual-machine) to exclude disk

###How often can I replicate to Azure?
Replication is continuous when replicating Azure VMs to another Azure region. Check the [Azure to Azure](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-architecture#replication-process) replication architecture to understand the details.

### Can I replicate Virtual machines within a same region? I need this to migrate VMs?
You cannot use Azure to Azure DR solution to replicate VMs within a same region.

### Can I replicate VMs to any Azure region?
With Site Recovery, you can replicate and recover VMs between any two regions within the same geographic cluster. Geographic clusters are defined keeping data latency and sovereignty in mind. For more information, see Site Recovery [region support matrix](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-support-matrix#region-support).

### Does Site Recovery require internet connectivity?

No, Site Recovery does not require internet connectivity but access to Site Recovery URLs and IP ranges as mentioned in this [article](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-about-networking#outbound-connectivity-for-ip-address-ranges)

## Replication Policy

### What is a Replication policy?
It defines the settings for recovery point retention history and app consistent snapshot frequency. By default, Azure Site Recovery creates a new replication policy with default settings of ‘24 hours’ for recovery point retention and ’60 minutes’ for app consistent snapshot frequency. [Learn more](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-tutorial-enable-replication#configure-replication-settings) how to configure replication policy]

### What is crash consistent recovery point?
Crash consistent recovery point represents the on-disk data as if the VM crashed or the power cord was pulled from the server at the time snapshot was taken. It doesn’t include anything that was in memory when the snapshot was taken. Today, most applications can recover well from crash consistent snapshots. A crash-consistent recovery point is usually enough for no database operating systems and applications like file servers, DHCP servers, print servers, and so on.

### What is application consistent recovery point? 
Application-consistent recovery points are created from app-consistent snapshots that capture the same data as crash-consistent snapshots, with the addition of all data in memory and all transactions in process. Because of their extra content, application-consistent snapshots are the most involved and take the longest to perform. Application-consistent recovery points are recommended for database operating systems and applications such as SQL.

### How are recovery points generated and saved?
To understand how Site Recovery generates recovery points lets take an example of the Replication policy, which has Recovery point retention window of 24 hours and App consistent frequency snapshot of 1 hour.
Site Recovery creates crash consistent point every 5 minutes and user doesn’t have any control to change this frequency. Therefore, for the last one-hour user will have 12 crash consistent points and 1 app consistent point to choose from. As the time progresses, Site Recovery prunes all the recovery points beyond last 1 hour and only save one recovery point per hour.
For illustration, in the screenshot below:


1. For time less than last 1 hour, there are recovery points with the frequency of 5 minutes.
2. For time beyond last 1 hour, we can see that only one recovery point per hour is kept.

  ![recovery points-generation](./media/azure-to-azure-troubleshoot-errors/recoverypoints.png)


### How far back can I recover?
The oldest recovery point you can use is 72 hours.

### What will happen if I have a replication policy of 24 hours and there is no recovery points generation due to some issue for more than 24 hours. Does my previous recovery points will be pruned?
No, Site Recovery will keep your all previous recovery points in this case. 

### After replication is enabled on a VM, how do I change the replication policy? 
Go to Site Recovery Vault > Site Recovery Infrastructure > Replication policies. Select policy that you want to edit and save the changes. Any change will apply to all the existing replications too. 

### Are all the recovery points complete copy of the VM or differential?
In case of Initial replication the first recovery point, which gets generated will have the complete copy and any successive recovery points will have delta changes.

### Does increasing recovery points retention windows increases the storage cost?
Yes, If you increase the retention period from 24 hours to 72 hours then Site Recovery will save the recovery points for addition 48 hours which will incurred you storage charges. For example if a single recovery point has delta changes of 10 GB and per GB cost is $0.16 per month, then it would be $1.6 * 48 additional charges per month.

## Multi-VM Consistency 

### What is Multi- VM consistency?
It means making sure that the recovery point is consistent across all the replicated virtual machines.
Site Recovery provides an option of "Multi-VM consistency" which when selected  creates a replication group to replicate all the machines together that are part of the group.
All the virtual machines will have shared crash consistent and app-consistent recovery points when failed over.
Go through the tutorial to [enable "Multi-VM" consistency](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-tutorial-enable-replication#enable-replication).

### Can I failover single virtual machine within a "Multi-VM" consistency replication group?
By selecting "Multi-VM consistency" option you are stating that the application has a dependency on all the virtual machines within a group. Hence, single virtual machine failover is not allowed. 

### How many virtual machines can I replicate as a part of "Multi-VM" consistency replication group?
You can replicate 16 virtual machine together in a replication group.

### When should I enable Multi-VM consistency ?
Enabling multi-VM consistency can impact a workload performance( as it is CPU intensive) and should only be used if machines are running the same workload and you need consistency across multiple machines. For example if you have 2 sql servers and 2 web servers in an application then you should have "Multi-VM" consistency for the sql servers only.


## Failover

### Is failover automatic?

Failover isn't automatic. You initiate failovers with single click in the portal, or you can use Site Recovery [PowerShell](azure-to-azure-powershell.md) to trigger a failover. 

### Can I retain Public IP address after failover?

Public IP address of the production application **cannot be retained on failover**. Workloads brought up as part of failover process must be assigned an Azure Public IP resource available in the target region. This step can be done either manually or is automated with recovery plans. Refer [article](https://docs.microsoft.com/azure/site-recovery/concepts-public-ip-address-with-site-recovery#public-ip-address-assignment-using-recovery-plan) to assign Public IP address using Recovery Plan.  

### Can I retain private IP address during failover?
Yes, you can retain private IP address. By default, when you enable disaster recovery for Azure VMs, Site Recovery creates target resources based on source resource settings. For Azure VMs configured with static IP addresses, Site Recovery tries to provision the same IP address for the target VM, if it's not in use. Refer [article](site-recovery-retain-ip-azure-vm-failover.md) to retain private IP address under different conditions.

### After failover, the server does not have the same IP address as the source VM. Why is it assigned with a new IP address?

Site Recovery tries to provide the IP address on the best effort basis at the time of failover. In case it is being taken by some other virtual machine, the next available IP address is set as the target. 
For a full explanation of how Site Recovery handles addressing, [review this article.](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-network-mapping#set-up-ip-addressing-for-target-vms)

### What does Latest(lowest RPO) recovery points means?
This option first processes all the data that has been sent to Site Recovery service, to create a recovery point for each VM before failing over to it. This option provides the lowest RPO (Recovery Point Objective), because the VM created after failover will have all the data replicated to Site Recovery when the failover was triggered.

### Does Latest (lowest RPO) recovery points have impact on Failover RTO?
Yes, as Site Recovery will process all the pending data before Failing over, this option will have higher RTO as compared to others.

### What does Latest processed option in recovery points mean?
This option fails over all VMs in the plan to the latest recovery point processed by Site Recovery. To see the latest recovery point for a specific VM, check Latest Recovery Points in the VM settings. This option provides a low RTO (Recovery Time Objective), because no time is spent processing unprocessed data.

### If I'm replicating between two Azure regions what happens if my primary region experiences an unexpected outage?
You can trigger a failover  after the outage. Site Recovery doesn't need connectivity from the primary region to perform the failover.

## Recovery Plan

### What is a Recovery Plan ?
Recovery plans in Site Recovery orchestrate failover recovery of VMs. It helps make the recovery consistently accurate, repeatable, and automated. A recovery plan addresses the following needs for the user:

- Defining a group of virtual machines that failover together.
- Defining the dependencies between the virtual machines so that the application comes up accurately.
- Automating the recovery along with custom manual actions so that tasks other than the failover of the virtual machines can also be achieved.

[Learn more](site-recovery-create-recovery-plans.md) about recovery plans.

### How does sequencing is achieved in a Recovery Plan?

In Recovery Plan, you can create multiple groups to achieve sequencing. Every group failover at a time, which means VMs that are part of same group will failover together followed by another group. Check how to [model application using the recovery plan.](recovery-plan-overview.md#model-apps). 

### How can I find the RTO of a recovery plan?
To check the RTO of a Recovery plan, test failover the Recovery plan and go to the Site Recovery Jobs.
For example as shown below, SAP Test Recovery Plan took 8 minutes 59 seconds to failover all the virtual machines and perform any actions specified.

  ![com-error](./media/azure-to-azure-troubleshoot-errors/recoveryplanrto.PNG)

### Can I add automation runbooks to the Recovery Plan?
Yes, you can integrate Azure automation runbooks into your recovery plan. [Learn more](site-recovery-runbook-automation.md)

## Reprotect and Failback 

### After doing a failover from primary region to disaster recovery region does VMs in a DR region gets protected automatically?
No, when you [failover](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-tutorial-failover-failback) Azure VMs from one region to another, the VMs boot up in the DR region in an unprotected state. To fail back the VMs to the primary region, you need to [reprotect](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-how-to-reprotect) the VMs in the secondary region.

### At the time of reprotection does Site Recovery replicate complete data from secondary region to primary region?
It depends on the situation, for example if the source region VM exist then only changes between the source disk and the target disk are synchronized. The differentials are computed by comparing both the disks and then transferred. This usually take a few hours to complete. Refer [article]( https://docs.microsoft.com/azure/site-recovery/azure-to-azure-how-to-reprotect#what-happens-during-reprotection) to learn details about what happens during reprotection.

### How much time does it take to failback?
Once reprotection is done then usually its the amount of time similar to failover from primary region to secondary  region. 

## Security
### Is replication data sent to the Site Recovery service?
No, Site Recovery doesn't intercept replicated data, and doesn't have any information about what's running on your virtual machines. Only the metadata needed to orchestrate replication and failover is sent to the Site Recovery service.  
Site Recovery is ISO 27001:2013, 27018, HIPAA, DPA certified, and is in the process of SOC2 and FedRAMP JAB assessments.

### Does Site Recovery encrypt replication?
Yes, both encryption-in-transit and [encryption in Azure](https://docs.microsoft.com/azure/storage/storage-service-encryption) are supported.

## Next steps
* [Review](azure-to-azure-support-matrix.md) support requirements.
* [Set up](azure-to-azure-tutorial-enable-replication.md) Azure to Azure replication.
