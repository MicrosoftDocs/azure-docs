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
ms.date: 02/22/2018
ms.author: bsiva

---

# Monitoring and troubleshooting Azure Site Recovery

In this article, you learn how to use Azure Site Recovery's in built monitoring features for monitoring and troubleshooting. Learn how to:
> [!div class="checklist"]
> - Use the Azure Site Recovery dashboard (vault overview page)
> - Monitor and troubleshoot replication issues
> - Monitor Azure Site Recovery Jobs/Operations
> - Subscribe to email notifications

## Using the Azure Site Recovery dashboard

The Azure Site Recovery dashboard on the vault overview page consolidates all monitoring information for the vault in a single location. Start at the vault dashboard and dive deeper to get more details by navigating through the parts of the dashboard. The major parts of the Azure Site Recovery dashboard are as follows:

### 1. Switch between Azure Backup and Azure Site Recovery dashboards

The toggle switch at the top of the overview page lets you switch between the dashboard pages for Site Recovery and Backup. This selection, once made, is remembered and defaulted to the next time you open the overview page for the vault. Select the Site Recovery option to see the Site Recovery dashboard. 

The various parts of the Azure Site Recovery dashboard page automatically refresh every 10 minutes, so that the dashboard reflects the latest available information.

![Monitoring features in the Azure Site Recovery overview page](media/site-recovery-monitor-and-troubleshoot/site-recovery-overview-page.png)

### 2. Replicated Items

The replicated items section of the dashboard presents an overview of the replication health of protected servers in the vault. 

<table>
<tr>
    <td>Healthy</td>
    <td>Replication is progressing normally for these servers and no error or warning symptoms have been detected.</td>
</tr>
<tr>
    <td>Warning </td>
    <td>One or more warning symptoms that may impact replication or indicate that replication isn't progressing normally has been detected for these servers.</td>
</tr>
<tr>
    <td>Critical</td>
    <td>One or more critical replication error symptoms have been detected for these servers. These error symptoms are typically indicators that replication is either stuck, or is not progressing as fast as the data change rate for these servers.</td>
</tr>
<tr>
    <td>Not applicable</td>
    <td>Servers that aren't currently expected to be replicating, such as servers that have been failed over.</td>
</tr>
</table>

To see a list of protected servers filtered by replication health, click the replication health description next to the donut. The view all link near the section title is a shortcut to the replicated items page for the vault. Use the view all link to see the list of all servers in the vault.

### 3. Failover test success

The failover test success section of the dashboard presents a break-up of virtual machines in the vault based on test failover status. 

<table>
<tr>
    <td>Test recommended</td>
    <td>Virtual machines that have not had a successful test failover since the time they reached a protected state.</td>
</tr>
<tr>
    <td>Performed successfully</td>
    <td>Virtual machines that have had one or more successful test failovers.</td>
</tr>
<tr>
    <td>Not applicable</td>
    <td>Virtual machines that are not currently eligible for a test failover. Examples are: Failed over servers, servers for which initial replication is in progress, servers for which a failover is in progress, servers for which a test failover is already in progress.</td>
</tr>
</table>

Click the test failover status next to the donut, so see the list of protected servers based on their test failover status.
 
> [!IMPORTANT]
> As a best practice, it is recommended that you perform a test failover on your protected servers at least once every six months. Performing a test failover is a non disruptive way to test failover of your servers and applications to an isolated environment, and helps you evaluate your business continuity preparedness.

 A test failover operation on a server or a recovery plan is considered successful only after both the test failover operation and the cleanup test failover operation have completed successfully.

### 4. Configuration issues

The Configuration issues section shows a list of issues that may impact your ability to successfully failover virtual machines. The classes of issues listed in this section are:
 - **Missing configurations:** Protected servers missing necessary configurations such as a recovery network or a recovery resource group.
 - **Missing resources:** Configured target/recovery resources not found or not available in the subscription. For example, the resource was deleted or was migrated to a different subscription or resource group. The following target/recovery configurations are monitored for availability: target resource group, target virtual network and subnet, log/target storage account, target availability set, target IP address.
 - **Subscription quota:** The available subscription resource quota balance is compared against the balance required to be able to failover all virtual machines in the vault. If the available balance is found insufficient, insufficient quota balance is reported. Quotas for the following Azure resources are monitored: Virtual machine core count, virtual machine family core count, network interface card (NIC) count.
 - **Software updates:** The availability of new software updates, expiring software versions.

Configuration issues (other than availability of software updates), are detected by a periodic validator operation that runs every 12 hours by default. You can force the validator operation to run immediately by clicking the refresh icon next to the *Configuration issues* section heading.

Click the links to get more details about the listed issues and virtual machines impacted by them. For issues impacting specific virtual machines, you can get more details by clicking the **needs attention** link under the target configurations column for the virtual machine. The details include recommendations on how you can remediate the detected issues.

### 5. Error Summary

The error summary section, shows the currently active replication error symptoms that may impact replication of servers in the vault, along with the number of impacted entities due to each error.

The replication error symptoms for servers in a critical or warning replication health state can be seen in the error summary table. 

- Errors impacting on-premises infrastructure components such as the non-receipt of a heartbeat from the Azure Site Recovery Provider running on the on-premises Configuration Server, VMM server, or Hyper-V host are listed at the beginning of the error summary section
- Replication error symptoms impacting protected servers is listed next. The error summary table entries are sorted by decreasing order of the error severity and then by decreasing order of the count of impacted servers.
 

> [!NOTE]
> 
>  Multiple replication error symptoms may be observed on a single server. If there are multiple error symptoms on a single server each error symptom would count that server in the list of its impacted servers. Once the underlying issue resulting in an error symptom is fixed, replication parameters improve and the error is cleared from the virtual machine.
>
> > [!TIP]
> The count of impacted servers is a useful way to understand if a single underlying issue may be impacting multiple servers. For example, a network glitch may potentially impact all servers replicating from an on-premises site to Azure. This view quickly conveys that fixing that one underlying issue will fix replication for multiple servers.
>

### 6. Infrastructure view

The infrastructure view provides a scenario wise visual representation of the infrastructural components involved in replication. It also visually depicts the health of the connectivity between the various servers and between the servers and the Azure services involved in replication. 

A green line indicates that connection is healthy, while a red line with the overlaid error icon indicates the existence of one or more error symptoms impacting connectivity between the components involved. Hovering the mouse pointer over the error icon on the line shows the error and the number of impacted entities. 

Clicking the error icon shows a filtered list of impacted entities for the error(s).

![Site Recovery infrastructure view (vault)](media/site-recovery-monitor-and-troubleshoot/site-recovery-vault-infra-view.png)

> [!TIP]
> Ensure that the on-premises infrastructure components (Configuration Server, additional process servers, replicating VMware virtual machines, Hyper-V hosts, VMM servers) are running the latest version of Azure Site Recovery software. To be able to use all the features of the infrastructure view, you need to be running [Update rollup 22](https://support.microsoft.com/help/4072852) or later for Azure Site Recovery

To use the infrastructure view, select the appropriate replication scenario (Azure virtual machines, VMware virtual machines/physical server, or Hyper-V) depending on your source environment. The infrastructure view presented in the vault overview page is an aggregated view for the vault. You can drill down further into the individual components by clicking on the boxes.

An infrastructure view scoped to the context of a single replicating machine is available on the replicated item overview page. To go to the overview page for a replicating server, go to replicated items from the vault menu and select the server to see the details for.

### Infrastructure view - FAQ

**Q.** Why am I not seeing the infrastructure view for my VM? </br>
**A.** The infrastructure view feature is only available for virtual machines that are replicating to Azure. The feature is currently not available for virtual machines that are replicating between on-premises sites.

**Q.** Why is the count of virtual machines in the vault infrastructure view different from the total count shown in the replicated items donut?</br>
**A.** The vault infrastructure view is scoped by replication scenarios. Only virtual machines participating in the currently selected replication scenario are included in the count of virtual machines shown in the infrastructure view. Also, for the selected scenario, only virtual machines that are currently configured to replicate to Azure are included in the count of virtual machines shown in the infrastructure view (Fo example: failed over virtual machines, virtual machines replicating back to an on-premise site are not included in the infrastructure view.)

**Q.** Why is the count of replicated items shown in the essentials drawer on the overview page different from the total count of replicated items shown in the donut chart on the dashboard?</br>
**A.** Only those virtual machines for which initial replication has completed are included in the count shown in the essentials drawer. The replicated items donut total includes all virtual machines in the vault including servers for which initial replication is currently in progress.

**Q.** Which replication scenarios is the infrastructure view available for? </br>
**A.**
>[!div class="mx-tdBreakAll"]
>|Replication Scenario  | VM State  | Infrastructure view available  |
>|---------|---------|---------|
>|Virtual machines replicating between two on-premises sites     | -        | No      |
>|All     | Failed over         |  No       |
>|Virtual machines replicating between two Azure regions     | Initial replication in progress or Protected         | Yes         |
>|VMware virtual machines replicating to Azure     | Initial replication in progress or Protected        | Yes        |
>|VMware virtual machines replicating to Azure     | Failed over virtual machines being replicated back to an on-premises VMware Site         | No        |
>|Hyper-V virtual machines replicating to Azure     | Initial replication in progress or Protected        | Yes       |
>|Hyper-V virtual machines replicating to Azure     | Failed over/ Failback in progress        |  No       |


### 7. Recovery Plans

The Recovery plans section shows the count of recovery plans in the vault. Click the number to see the list of recovery plans, create new recovery plans, or edit existing ones. 

### 8. Jobs

Azure Site Recovery jobs track the status of Azure Site Recovery operations. Most operations in Azure Site Recovery are executed asynchronously, with a tracking job being used to track progress of the operation.  To learn how to monitor the status of an operation, see the [Monitor Azure Site Recovery Jobs/Operations](#monitor-azure-site-recovery-jobsoperations) section.

This Jobs section of the dashboard gives the following information:

<table>
<tr>
    <td>Failed</td>
    <td>Failed Azure Site Recovery jobs in the last 24 hours</td>
</tr>
<tr>
    <td>In Progress</td>
    <td>Azure Site Recovery jobs that are currently in progress</td>
</tr>
<tr>
    <td>Waiting for input</td>
    <td>Azure Site Recovery jobs that are currently paused waiting for an input from the user.</td>
</tr>
</table>

The View All link next to the section heading is a shortcut to go to the jobs list page.

## Monitor and troubleshoot replication issues

In addition to the information available in the vault dashboard page, you can get additional details and troubleshooting information in the virtual machines list page and the virtual machine details page. You can view the list of protected virtual machines in the vault by selecting the **Replicated items** option from the vault menu. Alternately, you can get to a filtered list of the protected items by clicking any of the scoped shortcuts available on the vault dashboard page.

![Site Recovery replicated items list view](media/site-recovery-monitor-and-troubleshoot/site-recovery-virtual-machine-list-view.png)

The filter option on the replicated items list page lets you apply various filters such as replication health, and replication policy. 

The column selector option lets you specify additional columns to be shown such as RPO, target configuration issues, and replication errors. You can initiate operations on a virtual machine, or view errors impacting the virtual machine by right-clicking on a particular row of the list of machines.

To drill down further, select a virtual machine by clicking on it. This opens the virtual machine details page. The overview page under virtual machine details contains a dashboard where you'll find additional information pertaining to the machine. 

On the overview page for the replicating machine, you'll find:
- RPO (recovery point objective): Current RPO for the virtual machine and the time at which the RPO was last computed.
- Latest available recovery points for the machine
- Configuration issues if any that may impact the failover readiness of the machine. Click the link to get more details.
- Error details: List of replication error symptoms currently observed on the machine along with possible causes and recommended remediations
- Events: A chronological list of recent events impacting the machine. While error details shows the currently observable error symptoms on the machine, events is a historical record of various events that may have impacted the machine including error symptoms that may have previously been noticed for the machine.
- Infrastructure view for machines replicating to Azure

![Site Recovery replicated item details/overview](media/site-recovery-monitor-and-troubleshoot/site-recovery-virtual-machine-details.png)

The action menu at the top of the page provides options to perform various operations such as test failover on the virtual machine. The error details button on the action menu lets you see all currently active errors including replication errors, configuration issues, and configuration best practices based warnings for the virtual machine.

> [!TIP]
> How is RPO or recovery point objective different from the latest available recovery point?
> 
>Azure Site Recovery uses a multi step asynchronous process to replicate virtual machines to Azure. In the penultimate step of replication, recent changes on the virtual machine along with metadata are copied into a log/cache storage account. Once these changes along with the tag to identify a recoverable point has been written to the storage account in the target region, Azure Site Recovery has the information necessary to generate a recoverable point for the virtual machine. At this point, the RPO has been met for the changes uploaded to the storage account thus far. In other words, the RPO for the virtual machine at this point expressed in units of time, is equal to amount of time elapsed from the timestamp corresponding to the recoverable point.
>
>The Azure Site Recovery service, operating in the background, picks the uploaded data from the storage account and applies them onto the replica disks created for the virtual machine. It then generates a recovery point and makes this point available for recovery at failover. The latest available recovery point indicates the timestamp corresponding to the latest recovery point that has already been processed and applied to the replica disks.
>> [!WARNING]
> A skewed clock or incorrect system time on the replicating source machine or the on-premises infrastructure servers will skew the computed RPO value. To ensure accurate reporting of RPO values ensure that the system clock on the servers involved in replication is accurate. 
>

## Monitor Azure Site Recovery Jobs/Operations

Azure Site Recovery executes the operations you specify asynchronously. Examples of operations you can perform are enable replication, create recovery plan, test failover, update replication settings etc. Every such operation has a corresponding Job that is created to track and audit the operation. The job object has all the necessary information required for you to track the state and the progress of the operation. You can track the status of the various Site Recovery operations for the vault from the Jobs page. 

To see the list of Site Recovery jobs for the vault go the **Monitoring and Reports** section of the vault menu and select Jobs > Site Recovery Jobs. Select a job from the list of jobs on the page by clicking on it to get more details on the specified job. If a job hasn't completed successfully or has errors, you can see more information on the error and possible remediation by clicking the error details button at the top of job details page (also accessible from the Jobs list page by right-clicking on the unsuccessful job.) You can use the filter option from the action menu on the top of the jobs list page to filter the list based on a specific criteria, and use the export button to export details of the selected jobs to excel. You can also access the jobs list view from the shortcut available on the Site Recovery dashboard page. 

 For operations that you perform from the Azure portal, the created job and its current status can also be tracked from the notifications section (the bell icon on the top right) of the Azure portal.

## Subscribe to email notifications

The in-built email notification feature lets you subscribe to receive email notifications for critical events. If subscribed, email notifications are sent for the following events:
- Replication health of a replicating machine degrading to critical.
- No connectivity between the on-premises infrastructure components and the Azure Site Recovery service. Connectivity to the Site Recovery service from the on-premises infrastructure components such as the Configuration Server (VMware) or System Center Virtual Machine Manager(Hyper-V) registered to the vault is detected using a heartbeat mechanism.
- Failover operation failures if any.

To subscribe to receive email notifications for Azure Site Recovery, go the **Monitoring and Reports** section of the vault menu and:
1. Select Alerts and Events > Site Recovery Events.
2. Select "Email notifications" from the menu on top of the events page that is opened.
3. Use the email notification wizard to turn on or off email notifications and to select recipients for the notifications. You may specify that all subscription admins be sent notifications, and/or provide a list of email addresses to send notifications to. 
