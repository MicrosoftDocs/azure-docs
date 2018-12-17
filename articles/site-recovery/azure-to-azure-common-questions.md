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
Yes, you can replicate them. Refer [article](azure-to-azure-how-to-enable-replication-ade-vms.md) to enable replication of Azure disk encryption (ADE) enabled VMs.

### Can I replicate VMs to another subscription?
Yes, You can replicate Azure VMs to a different subscription with in the same Azure Active Directory tenant.
Configuring DR [across subscriptions](https://azure.microsoft.com/blog/cross-subscription-dr) is simple. You can select another subscription at the time of replication.

### Can I replicate zone pinned Azure VMs to another region.
Yes, you can [replicate zone pinned VMs](https://azure.microsoft.com/blog/disaster-recovery-of-zone-pinned-azure-virtual-machines-to-another-region) to another region.

### Can I exclude disks?

Yes, you can exclude disks at the time of protection using power shell. Refer [powershell guidance](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-powershell#replicate-azure-virtual-machine) to exclude disk

###How often can I replicate to Azure?
Replication is continuous when replicating Azure VMs to another Azure region.


## Replication Policy

### What is a Replication policy?
It defines the settings for recovery point retention history and app consistent snapshot frequency. By default, Azure Site Recovery creates a new replication policy with default settings of ‘24 hours’ for recovery point retention and ’60 minutes’ for app consistent snapshot frequency.

### How far back can I recover?
The oldest recovery point you can use is 72 hours.

### After replication is enabled on a VM, how do I change the replication policy? 
Go to Site Recovery Vault > Site Recovery Infrastructure > Replication policies. Select policy that you want to edit and save the changes. Any change will apply to all the existing replications too. 

### What are application consistent points?
Application-consistent snapshots use Volume Shadow Copy Service (VSS) to ensure that applications are in a consistent state when the snapshot is taken. If you enable application-consistent snapshots, it will affect the performance of applications running on source virtual machines. Ensure that the value you set is less than the number of additional recovery points you configure.

## Failover

### Is failover automatic?

Failover isn't automatic. You initiate failovers with single click in the portal, or you can use Site Recovery [PowerShell](azure-to-azure-powershell.md) to trigger a failover. 

### Can I retain Public IP address after failover?

Public IP address cannot be retained.

### Can I retain private IP address during failover?
Yes, you can retain private IP address. Refer [article](site-recovery-retain-ip-azure-vm-failover.md)to retain private IP address under different conditions.
 
### What does Latest(lowest RPO) recovery points means?
This option first processes all the data that has been sent to Site Recovery service, to create a recovery point for each VM before failing over to it. This option provides the lowest RPO (Recovery Point Objective), because the VM created after failover will have all the data replicated to Site Recovery when the failover was triggered.

### Does Latest (lowest RPO) recovery points have impact on Failover RTO?
Yes, as Site Recovery will process all the pending data before Failing over, this option will have higher RTO as compared to others.

### What does Latest processed option in recovery points mean?
This option fails over all VMs in the plan to the latest recovery point processed by Site Recovery. To see the latest recovery point for a specific VM, check Latest Recovery Points in the VM settings. This option provides a low RTO (Recovery Time Objective), because no time is spent processing unprocessed data.

## Next steps
* [Review](azure-to-azure-support-matrix.md) support requirements.
* [Set up](azure-to-azure-tutorial-enable-replication.md) Azure to Azure replication.
