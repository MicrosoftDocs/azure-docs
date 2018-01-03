---
title: Monitor and troubleshoot Azure Site Recovery | Microsoft Docs
description: Monitor and troubleshoot Azure Site Recovery replication issues and operations using the portal 
services: site-recovery
documentationcenter: ''
author: bsiva
manager: abhemraj
editor: raynew

ms.assetid: 
ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 01/06/2017
ms.author: bsiva

---

# Monitoring and troubleshooting Azure Site Recovery

In this article you'll learn how to use Azure Site Recovery's in built monitoring features for monitoring and troubleshooting. Learn how to:
> [!div class="checklist"]
> - Use the Azure Site Recovery vault overview page
> - Monitor and troubleshoot replication issues
> - Monitor Azure Site Recovery Jobs/Operations
> - Subscribe to email notifications

## Azure Site Recovery overview page

Start at the vault overview page. The overview page summarizes all monitoring related information for the vault in a single dashboard. 

The Backup, Site Recovery toggle switch at the top lets you switch between the dashboard pages for Site Recovery and Backup. This selection, once made, is remembered and defaulted to the next time you open the overview page for the vault. Select the Site Recovery option to see the Site Recovery dashboard. The dashboard page automatically refreshes every 5 minutes.

![Monitoring features in the Azure Site Recovery overview page](media/site-recovery-monitor-and-troubleshoot/site-recovery-overview-page.png)

### Replicated Items

The replicated items section of the dashboard presents a replication health based break-up of replicating machines in the vault. Machines that are not replicating currently are listed as not applicable (example: failed over virtual machines that are currently running in the recovery region)

You can click the legend for each replication health state to see a list of virtual machines currently in that state. Click the view all link next to the section heading on the dashboard to see all the machines being managed in the vault.

### Failover test success

The failover test success section of the dashboard presents a break-up of virtual machines in the vault based on test failover status. 
 - Test recommended: Virtual machines that have not had a successful test failover since the time they reached a protected state.
 - Performed successfuly: Virtual machines that have had one or more successful test failovers.
 - Not applicable: Virtual machines that are not currently eligible for a test failover (example: initial replication in progress, test failover in progress, failover in progress, failed over etc.) 

> [!IMPORTANT]
> As a best practice, it is recommended that you perform a test failover on your protected virtual machines once every 6 months. Performing a test failover is a non disruptive way to test failover of your servers and applications to an isolated environment, and helps you evaluate your business continuity preparedness.

Click the legend to see a list of virtual machines for each category.

> [!NOTE]
> A test failover operation on a virtual machine or a recovery plan is considered successful only after both the test failover operation and the cleanup test failover operation have completed successfully.

### Configuration issues

The Configuration issues section shows a list of issues that may impact your ability to successfully failover virtual machines. The class of issues listed in this section include the following:
 - Missing configurations : Virtual machines missing necessary configurations such as recovery network, recovery resource group.
 - Missing resources/configuration drift: Configured target/recovery resources not found or not available in the subscription (resource deleted or migrated to a different subscription/resource group.) The following resources, if configured for virtual machines in the vault, are monitored for availability: target resource group, target virtual network and subnet, log/target storage account, availability set, IP address.
 - Subscription quota: Available subscription quota balance is compared against the balance required to failover all virtual machines in the vault and insufficient balance is flagged. Available quotas for the following Azure resources are monitored: Virtual machine core count, virtual machine family core count, network interface card (NIC) count.
 - Software updates: The availability of new software updates, expiring software versions.

Barring software updates, the other classes of issues listed in this section, are detected through a periodic validation operation that runs every 12 hours by default. You can force the validation operation to run immediately by clicking on the refresh icon next to the section heading on the dashboard page.

Click on the links to get more details about the listed issues and virtual machines impacted by them. For issues impacting specific virtual machines, you can get more details by clicking the **needs attention** link under the target configurations column for the virtual machine. The details include recommendations on how you can remediate the detected issues.

### Error Summary

The error summary section, shows currently active health errors that may impact replication, and the number of impacted entities due to each.

Errors impacting on-premises infrastructure components if any are listed at the top(example: non-receipt of hearbeat from the Azure Site Recovery Provider/DRA software on the Configuration Server, VMM server or Hyper-V host)

Replication health errors impacting virtual machines are shown next (sorted by decreasing order of severity and impacted virtual machines.) If the replicated items section of the dashboard indicates there are virtual machines that aren't currently healthy, you'll be able to see the issues impacting replication for these virtual machines in the error summary. 

This aggregation is helpful because a single issue may potentially impact multiple virtual machines. This grouping of impacted machines due to a particular issue or csymptom, can help quickly understand if a single issue is impacting multiple virtual machines. For example, while replicating from an on-premises site to Azure, a network glitch or network ACL update that impacts connectivity from the on-premises site to Azure, will impact all virtual machines. This view can quickly convey that all machines are impacted by the same underlying issue and focus the troubleshooting issue on trying to solve the real problem.

> [!NOTE]
> At a given point there maybe multiple replication health related symptoms observed on a virtual machine. Each such symptom will manifest as a single replication error for the virtual machine. So, a virtual machine may have multiple replication errors at a given instant. Each such error would be listed as a seperate line item in the error summary section, and the virtual machine would be counted against each such error. Once the underlying issue cause contributing to an error/symptom has been addressed, replication parameters will improve and the error will be cleared from the virtual machine.

### Infrastructure view



## Monitor and troubleshoot replication issues

## Monitor Azure Site Recovery Jobs/Operations

## Subscribe to email notifications