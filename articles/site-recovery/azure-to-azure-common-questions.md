---
title: Common questions about Azure VM disaster recovery with Azure Site Recovery
description: This article answers common questions about Azure VM disaster recovery when you use Azure Site Recovery.
author: sideeksh
manager: rochakm
ms.date: 04/29/2019
ms.topic: conceptual

---
# Common questions: Azure-to-Azure disaster recovery

This article answers common questions about disaster recovery of Azure VMs to another Azure region for when you use [Azure Site Recovery](site-recovery-overview.md).

## General

### How is Site Recovery priced?

Review [Azure Site Recovery pricing for VMs](https://azure.microsoft.com/blog/know-exactly-how-much-it-will-cost-for-enabling-dr-to-your-azure-vm/).

### How does the free tier for Azure Site Recovery work?

Every instance that is protected with Azure Site Recovery is free for the first 31 days of protection. After that period, protection for each instance is at the rates in [Azure Site Recovery pricing for Azure Virtual Machines](https://azure.microsoft.com/blog/know-exactly-how-much-it-will-cost-for-enabling-dr-to-your-azure-vm/).

### During the first 31 days, will I incur any other Azure charges?

Yes. Even though Azure Site Recovery is free during the first 31 days of a protected instance, you might incur charges for Azure Storage, storage transactions, and data transfers. A recovered Virtual Machine might also incur Azure compute charges. Get complete details on pricing at [Azure Site Recovery pricing](https://azure.microsoft.com/pricing/details/site-recovery).

### What are the best practices for Azure Virtual Machines disaster recovery?

1. [Understand Azure-to-Azure architecture](azure-to-azure-architecture.md)
1. [Review the supported and not-supported configurations](azure-to-azure-support-matrix.md)
1. [Set up disaster recovery for Azure VMs](azure-to-azure-how-to-enable-replication.md)
1. [Run a test failover](azure-to-azure-tutorial-dr-drill.md)
1. [Fail over and fail back to the primary region](azure-to-azure-tutorial-failover-failback.md)

### How is capacity ensured in the target region?

The Site Recovery team and Azure capacity management team plan for sufficient infrastructure capacity. When you start a failover, the teams also help ensure VM instances that are protected by Site Recovery will deploy to the target region.

## Replication

### Can I replicate VMs enabled through Azure disk encryption?

Yes. Site Recovery supports disaster recovery of VMs that have Azure Disk Encryption enabled. When you enable replication, Azure copies all the required disk encryption keys and secrets from the source region to the target region in the user context. If you don't have the appropriate permissions, your security administrator can use a script to copy the keys and secrets.

- Site Recovery supports Azure Disk Encryption for Azure VMs that are running Windows.
- Site Recovery supports Azure Disk Encryption version 0.1, which has a schema that requires Azure Active Directory (Azure AD). Site Recovery also supports version 1.1, which doesn't require Azure AD. [Learn more about the extension schema for Azure disk encryption](../virtual-machines/extensions/azure-disk-enc-windows.md#extension-schema).
  - For Azure Disk Encryption version 1.1, you have to use the Windows VMs with managed disks.
  - [Learn more](azure-to-azure-how-to-enable-replication-ade-vms.md) about enabling replication for encrypted VMs.

### Can I select an Automation account from a different resource group?

This is currently not supported via portal but you can choose an Automation account from a different resource group via Powershell.

### After specifying an Automation account that is in a different resource group than the vault, am I permitted to delete the runbook if there is no other vault to specify?

The custom runbook created is a tool and it’s safe to delete if the same is longer not required.

### Can I replicate VMs to another subscription?

Yes, you can replicate Azure VMs to a different subscription within the same Azure AD tenant.

Configure disaster recovery [across subscriptions](https://azure.microsoft.com/blog/cross-subscription-dr) by selecting another subscription at the time of replication.

### Can I replicate zone-pinned Azure VMs to another region?

Yes, you can [replicate zone-pinned VMs](https://azure.microsoft.com/blog/disaster-recovery-of-zone-pinned-azure-virtual-machines-to-another-region) to another region.

### Can I exclude disks?

Yes, you can exclude disks at the time of protection by using PowerShell. For more information, see [how to exclude disks from replication](azure-to-azure-exclude-disks.md).

### Can I add new disks to replicated VMs and enable replication for them?

Yes, adding new disks to replicated VMs and enabling replication for them is supported for Azure VMs with managed disks. When you add a new disk to an Azure VM that's enabled for replication, replication health for the VM shows a warning. That warning states that one or more disks on the VM are available for protection. You can enable replication for added disks.

- If you enable protection for the added disks, the warning will disappear after the initial replication.
- If you don't enable replication for the disk, you can dismiss the warning.
- If you fail over a VM that has an added disk and replication enabled, there are replication points. The replication points will show the disks that are available for recovery.

For example, let's say a VM has a single disk and you add a new one. There might be a replication point that was created before you added the disk. This replication point will show that it consists of "1 of 2 disks."

Site Recovery doesn't support "hot remove" of a disk from a replicated VM. If you remove a VM disk, you need to disable and then re-enable replication for the VM.

### How often can I replicate to Azure?

Replication is continuous when you're replicating Azure VMs to another Azure region. For more information, see the [Azure-to-Azure replication architecture](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-architecture#replication-process).

### Can I replicate virtual machines within a region? I need this functionality to migrate VMs.

You can't use an Azure-to-Azure disk recovery solution to replicate VMs within a region.

### Can I replicate VM instances to any Azure region?

By using Site Recovery, you can replicate and recover VMs between any two regions within the same geographic cluster. Geographic clusters are defined with data latency and sovereignty in mind. For more information, see the Site Recovery [region support matrix](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-support-matrix#region-support).

### Does Site Recovery require internet connectivity?

No, Site Recovery doesn't require internet connectivity. But it does require access to Site Recovery URLs and IP ranges, as mentioned in [networking in Azure VM disaster recovery](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-about-networking#outbound-connectivity-for-urls).

### Can I replicate an application that has a separate resource group for separate tiers?

Yes, you can replicate the application and keep the disaster recovery configuration in a separate resource group too.

For example, if your application has each tier's application, database, and web in a separate resource group, then you have to select the [replication wizard](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-how-to-enable-replication#enable-replication) three times to protect all the tiers. Site Recovery will replicate these three tiers into three different resource groups.

### Can I move storage accounts across resource groups?

No, this is an unsupported scenario. However, if you accidentally move storage accounts to a different resource group and delete the original resource group, then you can create a new resource group with the same name as the old resource group and then move the storage account to this resource group.

## Replication policy

### What is a replication policy?

A replication policy defines the settings for the retention history of recovery points. The policy also defines the frequency of app-consistent snapshots. By default, Azure Site Recovery creates a new replication policy with default settings of:

- 24 hours for the retention history of recovery points.
- 60 minutes for the frequency of app-consistent snapshots.

[Learn more about replication settings](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-tutorial-enable-replication#configure-replication-settings).

### What is a crash-consistent recovery point?

A crash-consistent recovery point has the on-disk data as if you pulled the power cord from the server during the snapshot. The crash-consistent recovery point doesn't include anything that was in memory when the snapshot was taken.

Today, most applications can recover well from crash-consistent snapshots. A crash-consistent recovery point is usually enough for no-database operating systems and applications like file servers, DHCP servers, and print servers.

### What is the frequency of crash-consistent recovery point generation?

Site Recovery creates a crash-consistent recovery point every 5 minutes.

### What is an application-consistent recovery point?

Application-consistent recovery points are created from application-consistent snapshots. Application-consistent recovery points capture the same data as crash-consistent snapshots while also capturing data in memory and all transactions in process.

Because of their extra content, application-consistent snapshots are the most involved and take the longest. We recommend application-consistent recovery points for database operating systems and applications such as SQL Server.

### What is the impact of application-consistent recovery points on application performance?

Application-consistent recovery points capture all the data in memory and in process. Because recovery points capture that data, they require framework like Volume Shadow Copy Service on Windows to quiesce the application. If the capturing process is frequent, it can affect performance when the workload is already busy. We don't recommend that you use low frequency for app-consistent recovery points for non-database workloads. Even for database workload, 1 hour is enough.

### What is the minimum frequency of application-consistent recovery point generation?

Site Recovery can create an application-consistent recovery point with a minimum frequency of 1 hour.

### How are recovery points generated and saved?

To understand how Site Recovery generates recovery points, let's see an example of a replication policy. This replication policy has a recovery point with a 24-hour retention window and an app-consistent frequency snapshot of 1 hour.

Site Recovery creates a crash-consistent recovery point every 5 minutes. You can't change this frequency. For the last hour, you can choose from 12 crash-consistent points and 1 app-consistent point. As time progresses, Site Recovery prunes all the recovery points beyond the last hour and saves only 1 recovery point per hour.

The following screenshot illustrates the example. In the screenshot:

- Within the past hour, there are recovery points with a frequency of 5 minutes.
- Beyond the past hour, Site Recovery keeps only 1 recovery point.

   ![List of generated recovery points](./media/azure-to-azure-troubleshoot-errors/recoverypoints.png)

### How far back can I recover?

The oldest recovery point that you can use is 72 hours.

### I have a replication policy of 24 hours. What will happen if a problem prevents Site Recovery from generating recovery points for more than 24 hours? Will my previous recovery points be lost?

No, Site Recovery will keep all your previous recovery points. Depending on the recovery points' retention window, Site Recovery replaces the oldest point only if it generates new points. Because of the problem, Site Recovery can't generate any new recovery points. Until there are new recovery points, all the old points will remain after you reach the window of retention.

### After replication is enabled on a VM, how do I change the replication policy?

Go to **Site Recovery Vault** > **Site Recovery Infrastructure** > **Replication policies**. Select the policy that you want to edit, and save the changes. Any change will apply to all the existing replications too.

### Are all the recovery points a complete copy of the VM or a differential?

The first recovery point that's generated has the complete copy. Any successive recovery points have delta changes.

### Does increasing the retention period of recovery points increase the storage cost?

Yes, if you increase the retention period from 24 hours to 72 hours, Site Recovery will save the recovery points for an additional 48 hours. The added time will incur storage charges. For example, a single recovery point might have delta changes of 10 GB with a per-GB cost of $0.16 per month. Additional charges would be $1.60 × 48 per month.

### Can I enable replication with app-consistency in Linux servers?

Yes. Azure Site Recovery for Linux Operation System supports application custom scripts for app-consistency. The custom script with pre and post-options will be used by the Azure Site Recovery Mobility Agent during app-consistency. [Learn more](https://docs.microsoft.com/azure/site-recovery/site-recovery-faq#can-i-enable-replication-with-app-consistency-in-linux-servers)

## Multi-VM consistency

### What is multi-VM consistency?

Multi-VM consistency ensures that the recovery point is consistent across all the replicated virtual machines.

Site Recovery provides a **Multi-VM consistency** option, which creates a replication group of all the machines.

When you fail over the virtual machines, they'll have shared crash-consistent and app-consistent recovery points.

Go through the tutorial to [enable multi-VM consistency](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-tutorial-enable-replication#enable-replication-for-a-vm).

### Can I fail over a single virtual machine within a multi-VM consistency replication group?

When you select the **Multi-VM consistency** option, you're stating that the application has a dependency on all the virtual machines within a group. Single virtual machine failover isn't allowed.

### How many virtual machines can I replicate as a part of a multi-VM consistency replication group?

You can replicate 16 virtual machines together in a replication group.

### When should I enable multi-VM consistency?

Because multi-VM consistency is CPU intensive, enabling it can affect workload performance. Use multi-VM consistency only if machines are running the same workload and you need consistency across multiple machines. For example, if you have two SQL Server instances and two web servers in an application, you should have multi-VM consistency for the SQL Server instances only.

### Can you add an already replicating VM to a replication group?
You can add a VM to a new replication group while enabling replication. You can also add a VM to an existing replication group while enabling replication. However, you cannot add an already replicating VM to a new replication group or existing replication group.
 
## Failover


### How is capacity ensured in the target region for Azure VMs?

The Site Recovery team and Azure capacity management team plan for sufficient infrastructure capacity. When you start a failover, the teams also help ensure VM instances that are protected by Site Recovery will deploy to the target region.

### Is failover automatic?

Failover isn't automatic. You can start failovers with a single click in the portal, or you can use [PowerShell](azure-to-azure-powershell.md) to trigger a failover.

### Can I keep a public IP address after a failover?

You can't keep the public IP address of the production application after a failover.

When you bring up a workload as part of the failover process, you need to assign an Azure public IP resource to the workload. The Azure public IP resource has to be available in the target region. You can assign the Azure public IP resource manually, or you can automate it with a recovery plan. Learn how to [set up public IP addresses after failover](concepts-public-ip-address-with-site-recovery.md#public-ip-address-assignment-using-recovery-plan).

### Can I keep a private IP address during a failover?

Yes, you can keep a private IP address. By default, when you enable disaster recovery for Azure VMs, Site Recovery creates target resources based on source resource settings. For Azure Virtual Machines configured with static IP addresses, Site Recovery tries to provision the same IP address for the target VM if it's not in use.
Learn about [keeping IP addresses during failover](site-recovery-retain-ip-azure-vm-failover.md).

### After a failover, why is the server assigned a new IP address?

Site Recovery tries to provide the IP address at the time of failover. If another virtual machine is taking that address, Site Recovery sets the next available IP address as the target.

Learn more about [setting up network mapping and IP addressing for virtual networks](azure-to-azure-network-mapping.md#set-up-ip-addressing-for-target-vms).

### What are **Latest (lowest RPO)** recovery points?

The **Latest (lowest RPO)** option first processes all the data that has been sent to the Site Recovery. After the service processes the data, it creates a recovery point for each VM before failing over to the VM. This option provides the lowest recovery point objective (RPO). The VM created after failover has all the data replicated to Site Recovery from when the failover was triggered.

### Do **Latest (lowest RPO)** recovery points have an impact on failover RTO?

Yes. Site Recovery processes all pending data before failing over, so this option has a higher recovery time objective (RTO) compared to other options.

### What does the **Latest processed** option in recovery points mean?

The **Latest processed** option fails over all VMs in the plan to the latest recovery point that Site Recovery processed. To see the latest recovery point for a specific VM, check **Latest Recovery Points** in the VM settings. This option provides a low RTO, because no time is spent processing unprocessed data.

### What happens if my primary region experiences an unexpected outage?

You can trigger a failover after the outage. Site Recovery doesn't need connectivity from the primary region to do the failover.

### What is an RTO of a VM failover?

Site Recovery has an [RTO SLA of 2 hours](https://azure.microsoft.com/support/legal/sla/site-recovery/v1_2/). However, most of the time, Site Recovery fails over virtual machines within minutes. You can calculate the RTO by going to the failover jobs, which show the time it took to bring up the VM. For Recovery plan RTO, refer to the next section.

## Recovery plans

### What is a recovery plan?

A recovery plan in Site Recovery orchestrates the failover recovery of VMs. It helps make the recovery consistently accurate, repeatable, and automated. A recovery plan addresses the following needs:

- Defining a group of virtual machines that fail over together
- Defining the dependencies between virtual machines so that the application comes up accurately
- Automating the recovery along with custom manual actions to achieve tasks other than the failover of virtual machines

Learn more [about creating recovery plans](site-recovery-create-recovery-plans.md).

### How is sequencing achieved in a recovery plan?

In a recovery plan, you can create multiple groups to achieve sequencing. Every group fails over at one time. Virtual machines that are part of the same group fail over together, followed by another group. To learn how to model an application by using a recovery plan, see [About recovery plans](recovery-plan-overview.md#model-apps).

### How can I find the RTO of a recovery plan?

To check the RTO of a recovery plan, do a test failover for the recovery plan and go to **Site Recovery jobs**.
In the following example, see the job **SAPTestRecoveryPlan**. The job took 8 minutes and 59 seconds to fail over all the virtual machines and do specified actions.

![List of Site Recovery jobs](./media/azure-to-azure-troubleshoot-errors/recoveryplanrto.PNG)

### Can I add automation runbooks to the recovery plan?

Yes, you can integrate Azure Automation runbooks into your recovery plan. Learn more about [adding Azure Automation runbooks](site-recovery-runbook-automation.md).

## Reprotection and failback

### I failed over from the primary region to a disaster recovery region. Are VMs in a DR region protected automatically?

No. When you [fail over](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-tutorial-failover-failback) Azure VMs from one region to another, the VMs start up in the DR region in an unprotected state. To fail back the VMs to the primary region, you need to [reprotect](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-how-to-reprotect) the VMs in the secondary region.

### At the time of reprotection, does Site Recovery replicate complete data from the secondary region to the primary region?

It depends on the situation. If the source region VM exists, then only changes between the source disk and the target disk are synchronized. Site Recovery computes the differentials by comparing the disks, and then it transfers the data. This process usually takes a few hours. For more information about what happens during reprotection, see [Reprotect failed over Azure VM instances to the primary region](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-how-to-reprotect#what-happens-during-reprotection).

### How much time does it take to fail back?

After reprotection, failback takes about the same amount of time it takes to fail over from the primary region to a secondary region.

## <a name="capacity"></a>Capacity

### How is capacity ensured in the target region for Azure VMs?

The Site Recovery team and Azure capacity management team plan for sufficient infrastructure capacity. When you start a failover, the teams also help ensure VM instances that are protected by Site Recovery will deploy to the target region.

### Does Site Recovery work with reserved instances?

Yes, you can purchase [reserved Azure VMs](https://azure.microsoft.com/pricing/reserved-vm-instances/) in the disaster recovery region, and Site Recovery failover operations will use them. No additional configuration is needed.

## Security

### Is replication data sent to the Site Recovery service?

No, Site Recovery doesn't intercept replicated data, and it doesn't have any information about what's running on your VMs. Only the metadata needed to orchestrate replication and failover is sent to the Site Recovery service.

Site Recovery is ISO 27001:2013, 27018, HIPAA, and DPA certified. The service is undergoing SOC2 and FedRAMP JAB assessments.

### Does Site Recovery encrypt replication?

Yes, both encryption in transit and [encryption at rest in Azure](https://docs.microsoft.com/azure/storage/storage-service-encryption) are supported.

## Next steps

- [Review Azure-to-Azure support requirements](azure-to-azure-support-matrix.md).
- [Set up Azure-to-Azure replication](azure-to-azure-tutorial-enable-replication.md).
- If you have questions after reading this article, post them on the [Microsoft Q&A question page for Azure Recovery Services](https://docs.microsoft.com/answers/topics/azure-site-recovery.html).
