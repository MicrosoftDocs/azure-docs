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

In this article, you learn how to use Azure Site Recovery's in built monitoring features for monitoring and troubleshooting. Learn how to:
> [!div class="checklist"]
> - Use the Azure Site Recovery vault overview page
> - Monitor and troubleshoot replication issues
> - Monitor Azure Site Recovery Jobs/Operations
> - Subscribe to email notifications

## Azure Site Recovery overview page

Start at the vault overview page. The overview page summarizes all monitoring related information for the vault in a single dashboard. 

The Backup, Site Recovery toggle switch at the top lets you switch between the dashboard pages for Site Recovery and Backup. This selection, once made, is remembered and defaulted to the next time you open the overview page for the vault. Select the Site Recovery option to see the Site Recovery dashboard. The dashboard page automatically refreshes every five minutes.

![Monitoring features in the Azure Site Recovery overview page](media/site-recovery-monitor-and-troubleshoot/site-recovery-overview-page.png)

### Replicated Items

The replicated items section of the dashboard presents a replication health based break-up of replicating machines in the vault. Machines that are not replicating currently are listed as not applicable (example: failed over virtual machines that are currently running in the recovery region)

You can click the legend for each replication health state to see a list of virtual machines currently in that state. Click the view all link next to the section heading on the dashboard to see all the machines being managed in the vault.

### Failover test success

The failover test success section of the dashboard presents a break-up of virtual machines in the vault based on test failover status. 
 - Test recommended: Virtual machines that have not had a successful test failover since the time they reached a protected state.
 - Performed successfully: Virtual machines that have had one or more successful test failovers.
 - Not applicable: Virtual machines that are not currently eligible for a test failover (example: initial replication in progress, test failover in progress, failover in progress, failed over etc.) 

> [!IMPORTANT]
> As a best practice, it is recommended that you perform a test failover on your protected virtual machines once every six months. Performing a test failover is a non disruptive way to test failover of your servers and applications to an isolated environment, and helps you evaluate your business continuity preparedness.

Click the legend to see a list of virtual machines for each category.

> [!NOTE]
> A test failover operation on a virtual machine or a recovery plan is considered successful only after both the test failover operation and the cleanup test failover operation have completed successfully.

### Configuration issues

The Configuration issues section shows a list of issues that may impact your ability to successfully failover virtual machines. The class of issues listed in this section includes:
 - Missing configurations: Virtual machines missing necessary configurations such as recovery network, recovery resource group.
 - Missing resources/configuration drift: Configured target/recovery resources not found or not available in the subscription (resource deleted or migrated to a different subscription/resource group.) The following resources, if configured for virtual machines in the vault, are monitored for availability: target resource group, target virtual network, and subnet, log/target storage account, availability set, IP address.
 - Subscription quota: Available subscription quota balance is compared against the balance required to failover all virtual machines in the vault and insufficient balance is flagged. Available quotas for the following Azure resources are monitored: Virtual machine core count, virtual machine family core count, network interface card (NIC) count.
 - Software updates: The availability of new software updates, expiring software versions.

Barring software updates, the other classes of issues listed in this section, are detected through a periodic validation operation that runs every 12 hours by default. You can force the validation operation to run immediately by clicking on the refresh icon next to the section heading on the dashboard page.

Click on the links to get more details about the listed issues and virtual machines impacted by them. For issues impacting specific virtual machines, you can get more details by clicking the **needs attention** link under the target configurations column for the virtual machine. The details include recommendations on how you can remediate the detected issues.

### Error Summary

The error summary section, shows currently active health errors that may impact replication, and the number of impacted entities due to each.

Errors impacting on-premises infrastructure components if any are listed at the top(example: non-receipt of heartbeat from the Azure Site Recovery Provider/DRA software on the Configuration Server, VMM server, or Hyper-V host)

Replication health errors impacting virtual machines are shown next (sorted by decreasing order of severity and impacted virtual machines.) If the replicated items section of the dashboard indicates there are virtual machines that aren't currently healthy, you'll see the issues impacting replication for these virtual machines in the error summary. 

This aggregation is helpful because a single issue may potentially impact multiple virtual machines. This grouping of impacted machines due to a particular issue or symptom, can help quickly understand if a single issue is impacting multiple virtual machines. For example, while replicating from an on-premises site to Azure, a network glitch or network ACL update that impacts connectivity from the on-premises site to Azure, impacts all virtual machines. This view can quickly convey that all machines are impacted by the same underlying issue and focus the troubleshooting issue on trying to solve the real problem.

> [!NOTE]
> At a given point, there maybe multiple replication health-related symptoms observed on a virtual machine. Each such symptom will manifest as a single replication error for the virtual machine. So, a virtual machine may have multiple replication errors at a given instant. Each such error would be listed as a separate line item in the error summary section, and the virtual machine would be counted against each such error. Once the underlying issue contributing to an error/symptom has been addressed, replication parameters improve and the error is cleared from the virtual machine.

### Infrastructure view

The infrastructure view provides a scenario wise visual representation of the infrastructural components involved in replication. It also depicts the connectivity between the servers and Azure services involved in replication. A green line indicates that connection is healthy, while a red line with the overlaid error icon indicates the existence of one or more error symptoms impacting connectivity between the components involved. A mouse over on the error icon on the line shows the error and the number of impacted entities. Further, clicking the error opens a page with the filtered list of impacted entities for the error(s).

![Site Recovery infrastructure view (vault)](media/site-recovery-monitor-and-troubleshoot/site-recovery-vault-infra-view.png)

> [!TIP]
> Ensure that the on-premises infrastructure components (Configuration Server, additional process servers, replicating VMware virtual machines, Hyper-V hosts, VMM servers) are running the latest version of Azure Site Recovery software. To be able to use all the features of the infrastructure view, you need to be running [Update rollup 22](https://support.microsoft.com/help/4072852) or later for Azure Site Recovery

To use the infrastructure view, select the appropriate replication scenario (Azure virtual machines, VMware virtual machines/physical server, or Hyper-V) depending on your source environment. The infrastructure view presented in the vault overview page is an aggregated view for the vault. You can drill down further into the individual components by clicking on the boxes.

The infrastructure view presented in the replicated item overview page for a replicating machine, presents a scoped view of the various pieces involved in replication for the selected machine.

> [!NOTE]
> The infrastructure view is available only for virtual machines that are configured to replicate to Azure. The view is not available for machines that are failed over, or are replicating to an on-premises site.


## Monitor and troubleshoot replication issues

In addition to the information available in the vault dashboard page, you can get additional details and troubleshooting information in the virtual machines list page and the virtual machine details page. You can view the list of protected virtual machines in the vault by selecting the **Replicated items** option from the vault menu. Alternately, you can get to a filtered list of the protected items by clicking any of the scoped shortcuts available on the vault dashboard page.

![Site Recovery replicated items list view](media/site-recovery-monitor-and-troubleshoot/site-recovery-virtual-machine-list-view.png)

The filter option on the replicated items list page lets you apply various filters such as replication health, and replication policy. The column selector option lets you specify additional columns to be shown such as RPO, target configuration issues, and replication errors. You can initiate operations on a virtual machine, or view errors impacting the virtual machine by right-clicking on a particular row of the list of machines.

To drill down further, select a virtual machine by clicking on it. This opens the virtual machine details page. The overview page under virtual machine details contains a dashboard where you'll find additional information pertaining to the machine. 

On the overview page for the replicating machine, you'll find:
- RPO (recovery point objective): Current RPO for the virtual machine and the time at which the RPO was last computed.
- Latest available recovery points for the machine
- Configuration issues if any that may impact the failover readiness of the machine. Click the link to get more details.
- Error details: List of replication error symptoms currently observed on the machine along with possible causes and recommended remediations
- Events: A chronological list of recent events impacting the machine (replication errors show the list of symptoms currently observed on the machine, events is a historical record of various events that may have impacted the machine including error symptoms that may have previously been noticed for the machine)
- Infrastructure view for machines replicating to Azure

![Site Recovery replicated item details/overview](media/site-recovery-monitor-and-troubleshoot/site-recovery-virtual-machine-details.png)

> [!TIP]
> How is RPO or recovery point objective different from the latest available recovery point?
> 
>Azure Site Recovery uses a multi step asynchronous process to replicate virtual machines to Azure. In the penultimate step of replication, recent changes on the virtual machine along with metadata are copied into a log/cache storage account. Once these changes along with the tag to identify a recoverable point has been written to the storage account in the target region, Azure Site Recovery has the information necessary to generate a recoverable point for the virtual machine. At this point the RPO has been met for the changes uploaded to the storage account thus far. In other words, the RPO for the virtual machine at this point expressed in units of time, is equal to amount of time elapsed from the timestamp corresponding to the recoverable point.
>
>The Azure Site Recovery service, operating in the background, picks the uploaded data from the storage account and applies them onto the replica disks created for the virtual machine. It then generates a recovery point and makes this point available for recovery at failover. The latest available recovery point indicates the timestamp corresponding to the latest recovery point that has already been processed and applied to the replica disks.
>

The action menu at the top of the page provides options to perform various operations such as test failover on the virtual machine. The error details button on the action menu lets you see all currently active errors including replication errors, configuration issues and configuration best practices based warnings for the virtual machine.

> [!WARNING]
> A skewed clock or incorrect system time on the replicating source machine or the on-premises infrastructure servers will skew the computed RPO value. To ensure accurate reporting of RPO values ensure that the system clock on the servers involved in replication is accurate.    



## Monitor Azure Site Recovery Jobs/Operations

Azure Site Recovery executes the operations you specify asynchronously. Examples of operations you can perform are enable replication, create recovery plan, test failover, update replication settings etc. Every such operation has a corresponding Job that is created to track and audit the operation. The job object has all the necessary information required for you to track the state and the progress of the operation. You can track the status of the various Site Recovery operations for the vault from the Jobs page. 

To see the list of Site Recovery jobs for the vault go the **Monitoring and Reports** section of the vault menu and select Jobs > Site Recovery Jobs. Select a job from the list of jobs on the page by clicking on it to get more details on the specified job. If a job hasn't completed successfully or has errors, you can see more information on the error and possible remediation by clicking the error details button at the top of job details page (also accessible from the Jobs list page by right-clicking on the unsuccessful job.) You can use the filter option from the action menu on the top of the jobs list page to filter the list based on a specific criteria, and use the export button to export details of the selected jobs to excel. You can also access the jobs list view from the shortcut available on the Site Recovery dashboard page. 

 For operations that you perform from the Azure portal, the created job and its current status can also be tracked from the notifications section (the bell icon on the top right) of the Azure portal.

## Subscribe to email notifications

The in-built email notification feature lets you subscribe to receive email notifications for critical events. If subscribed, email notifications are sent for the following events:
- Replication health of a replicating machine degrading to critical
- No connectivity between the on-premises infrastructure components and the Azure Site Recovery service. Connectivity to the Site Recovery service from the on-premises infrastructure components such as the Configuration Server (VMware) or System Center Virtual Machine Manager(Hyper-V) registered to the vault is detected using a heartbeat mechanism.
- Failover operation failures if any.

To subscribe to receive email notifications for Azure Site Recovery, go the **Monitoring and Reports** section of the vault menu and:
1. Select Alerts and Events > Site Recovery Events.
2. Select "Email notifications" from the menu on top of the events page that is opened.
3. Use the email notification wizard to turn on or off email notifications and to select recipients for the notifications. You may specify that all subscription admins be sent notifications, and/or provide a list of email addresses to send notifications to. 