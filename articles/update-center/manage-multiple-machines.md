---
title: Manage multiple machines in update management center (preview)
description: The article details how to use Update management center (preview) in Azure to manage multiple supported machines and view their compliance state in the Azure portal.
ms.service: update-management-center
ms.date: 05/02/2023
ms.topic: conceptual
author: SnehaSudhirG
ms.author: sudhirsneha
---

# Manage multiple machines with update management center (Preview)

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers.

> [!IMPORTANT]
> - For a seamless scheduled patching experience, we recommend that for all Azure VMs, you update the patch orchestration to **Customer Managed Schedules (Preview)**. If you fail to update the patch orchestration, you can experience a disruption in business continuity because the schedules will fail to patch the VMs.[Learn more](prerequsite-for-schedule-patching.md).


This article describes the various features that update management center (Preview) offers to manage the system updates on your machines. Using the update management center (preview), you can:

- Quickly assess the status of available operating system updates.
- Deploy updates.
- Set up recurring update deployment schedule.
- Get insights on the number of machines managed.
- Information on how they're managed, and other relevant details. 

Instead of performing these actions from a selected Azure VM or Arc-enabled server, you can manage all your machines in the Azure subscription.


## View update management center (Preview) status 

1. Sign in to the [Azure portal](https://portal.azure.com).

1. To view update assessment across all machines, including Azure Arc-enabled servers  navigate to **Update management center(Preview)**.

   :::image type="content" source="./media/manage-multiple-machines/overview-page-inline.png" alt-text="Screenshot of update management center overview page in the Azure portal." lightbox="./media/manage-multiple-machines/overview-page-expanded.png":::
   
     In the **Overview** page - the summary tiles show the following status:

   - **Filters**—use filters to focus on a subset of your resources. The selectors above the tiles return **Subscription**, **Resource group**, **Resource type** (Azure VMs and Arc-enabled servers) **Location**, and **OS** type (Windows or Linux) based on the Azure role-based access rights you've been granted. You can combine filters to scope to a specific resource. 

   - **Update status of machines**—shows the update status information for assessed machines that had applicable or needed updates. You can filter the results based on classification types. By default, all [classifications](../automation/update-management/overview.md#update-classifications) are selected and as per the classification selection, the tile is updated.

      The graph provides a snapshot for all your machines in your subscription, regardless of whether you have used update management center (preview) for that machine. This assessment data comes from Azure Resource Graph, and it stores the data for seven days. 

      From the assessment data available, machines are classified into the following categories:

      - **No updates available**—no updates are pending for these machines and these machines are up to date.
      -  **Updates available**—updates are pending for these machines and these machines aren't up to date.
      - **Reboot Required**—pending a reboot for the updates to take effect.
      - **No updates data**—no assessment data is available for these machines. 
   
      The following could be the reasons for no assessment data:
      - No assessment has been done over the last seven days
      - The machine has an unsupported OS
      - The machine is in an unsupported region and you can't perform an assessment.

   - **Patch orchestration configuration of Azure virtual machines** — all the Azure machines inventoried in the subscription are summarized by each update orchestration method. Values are: 

      - **Customer Managed Schedules (Preview)**—enables schedule patching on your existing VMs. 
      - **Azure Managed - Safe Deployment**—this mode enables automatic VM guest patching for the Azure virtual machine. Subsequent patch installation is orchestrated by Azure. 
      - **Image Default**—for Linux machines, it uses the default patching configuration.
      - **OS orchestrated**—the OS automatically updates the machine.
      - **Manual updates**—you control the application of patches to a machine by applying patches manually inside the machine. In this mode, automatic updates are disabled for Windows OS. 
   
    
 
   For more information about each orchestration method see, [automatic VM guest patching for Azure VMs](../virtual-machines/automatic-vm-guest-patching.md#patch-orchestration-modes). 

   - **Update installation status**—by default, the tile shows the status for the last 30 days. Using the **Time** picker, you can choose a different range. The values are:
      - **Failed**—is when one or more updates in the deployment have failed.
      - **Completed**—is when the deployment ends successfully by the time range selected. 
      - **Completed with warnings**—is when the deployment is completed successfully but had warnings.
      - **In progress**—is when the deployment is currently running.

- Select the **Update status of machines** or **Patch orchestration configuration of Azure Virtual machines** to go to the **Machines** page. 
- Select the **Update installation status**, to go to the **History** page. 

- **Pending Windows updates** — the tile shows the status of pending updates for Windows machines in your subscription.
- **Pending Linux updates** — the tile shows the status of pending updates for Linux machines in your subscription.

## Summary of machine status

Update management center (preview) in Azure enables you to browse information about your Azure VMs and Arc-enabled servers across your Azure subscriptions relevant to update management center (preview). The section shows how you can filter information to understand the update status of your machine resources, and for multiple machines, initiate an update assessment, update deployment, and manage their update settings. 

 In the update management center (preview) page, select **Machines** from the left menu.

   :::image type="content" source="./media/manage-multiple-machines/update-center-machines-page-inline.png" alt-text="Screenshot of update management center(preview) Machines page in the Azure portal." lightbox="./media/manage-multiple-machines/update-center-machines-page-expanded.png":::

   On the page, the table lists all the machines in the specified subscription, and for each machine it helps you understand the following details that show up based on the latest assessment.
   - **Update status**—the total number of updates available identified as applicable to the machine's OS.
   - **Operating system**—the operating system running on the machine.
   - **Resource type**—the machine is either hosted in Azure or is a hybrid machine managed by Arc-enabled servers.
   - **Patch orchestration**— the patches are applied following availability-first principles and managed by Azure.
   - **Periodic assessment**—an update setting that allows you to enable automatic periodic checking of updates.

The column **Patch Orchestration**, in the machine's patch mode has the following values:

   * **Customer Managed Schedules (Preview)**—enables schedule patching on your existing VMs. The new patch orchestration option enables the two VM properties - **Patch mode = Azure-orchestrated** and **BypassPlatformSafetyChecksOnUserSchedule = TRUE** on your behalf after receiving your consent.
   * **Azure Managed - Safe Deployment**—for a group of virtual machines undergoing an update, the Azure platform will orchestrate updates. The VM is set to [automatic VM guest patching](../virtual-machines/automatic-vm-guest-patching.md).(i.e), the patch mode is **AutomaticByPlatform**.
   * **Automatic by OS**—the machine is automatically updated by the OS.
   * **Image Default**—for Linux machines, its default patching configuration is used.
   * **Manual**—you control the application of patches to a machine by applying patches manually inside the machine. In this mode automatic updates are disabled for Windows OS.
   

The machine's status—for an Azure VM, it shows it's [power state](../virtual-machines/states-billing.md#power-states-and-billing), and for an Arc-enabled server, it shows if it's connected or not. 

Use filters to focus on a subset of your resources. The selectors above the tiles return subscriptions, resource groups, resource types (that is, Azure VMs and Arc-enabled servers), regions, etc. and are based on the Azure role-based access rights you've been granted. You can combine filters to scope to a specific resource.

The summary tiles at the top of the page summarize the number of machines that have been assessed and their update status. 

To manage the machine's update settings, see [Manage update configuration settings](manage-update-settings.md).

### Check for updates

For machines that haven't had a compliance assessment scan for the first time, you can select one or more of them from the list and then select the **Check for updates**. You'll receive status messages as the configuration is performed.

   :::image type="content" source="./media/manage-multiple-machines/update-center-assess-now-multi-selection-inline.png" alt-text="Screenshot of initiating a scan assessment for selected machines with the check for updates option." lightbox="./media/manage-multiple-machines/update-center-assess-now-multi-selection-expanded.png":::

  Otherwise, a compliance scan is initiated, and then the results are forwarded and stored in **Azure Resource Graph**. This process takes several minutes. When the assessment is completed, a confirmation message appears on the page.

   :::image type="content" source="./media/manage-multiple-machines/update-center-assess-now-complete-banner-inline.png" alt-text="Screenshot of assessment banner on Manage Machines page." lightbox="./media/manage-multiple-machines/update-center-assess-now-complete-banner-expanded.png":::   


Select a machine from the list to open update management center (Preview) scoped to that machine. Here, you can view its detailed assessment status, update history, configure its patch orchestration options, and initiate an update deployment. 

### Deploy the updates

For assessed machines that are reporting updates available, select one or more of the machines from the list and initiate an update deployment that starts immediately. Select the machine and go to **One-time update**. 

   :::image type="content" source="./media/manage-multiple-machines/update-center-install-updates-now-multi-selection-inline.png" alt-text="Screenshot of install one time updates for machine(s) on updates preview page." lightbox="./media/manage-multiple-machines/update-center-install-updates-now-multi-selection-expanded.png":::
   
 A notification appears to confirm that an activity has started and another is created when it's completed. When it's successfully completed, the installation operation results are available to view from either the **Update history** tab, when you select the machine from the **Machines** page, or on the **History** page, which you're redirected to automatically after initiating the update deployment. The status of the operation can be viewed at any time from the [Azure Activity log](../azure-monitor/essentials/activity-log.md).

### Set up a recurring update deployment

You can create a recurring update deployment for your machines. Select your machine and select **Scheduled updates**. This opens [Create new maintenance configuration](scheduled-patching.md) flow.


## Update deployment history

Update management center (preview) enables you to browse information about your Azure VMs and Arc-enabled servers across your Azure subscriptions relevant to Update management center (preview). You can filter information to understand the update assessment and deployment history for multiple machines. In Update management center (preview), select **History** from the left menu.


## Update deployment history by machines

Provides a summarized status of update and assessment actions performed against your Azure VMs and Arc-enabled servers. You can also drill into a specific machine to view update-related details and manage it directly, review the detailed update or assessment history for the machine, and other related details in the table. 

:::image type="content" source="./media/manage-multiple-machines/update-center-history-page-inline.png" alt-text="Screenshot of update center History page in the Azure portal." lightbox="./media/manage-multiple-machines/update-center-history-page-expanded.png":::

   - **Machine Name**
   - **Status** 
   - **Update installed**
   - **Update operation** 
   - **Operation type** 
   - **Operation start time**
   - **Resource Type**
   - **Tags**
   - **Last assessed time**

## Update deployment history by maintenance run ID
In the **History** page, select **By maintenance run ID** to view the history of the maintenance run schedules. Each record shows  

   :::image type="content" source="./media/manage-multiple-machines/update-center-history-by-maintenance-run-id-inline.png" alt-text="Screenshot of update center History page by maintenance run ID in the Azure portal." lightbox="./media/manage-multiple-machines/update-center-history-by-maintenance-run-id-expanded.png":::

- **Maintenance run ID**
- **Status**
- **Updated machines**
- **Operation start time**
- **Operation end time**

When you select any one maintenance run ID record, you can view an expanded status of the maintenance run. It contains information about machines and updates. It includes the number of machines that were updated and updates installed on them, along with the status of each of the machines in the form of a pie chart. At the end of the page, it contains a list view of both machines and updates that were a part of this maintenance run.

   :::image type="content" source="./media/manage-multiple-machines/update-center-maintenance-run-record-inline.png" alt-text="Screenshot of maintenance run ID record." lightbox="./media/manage-multiple-machines/update-center-maintenance-run-record-expanded.png":::


### Resource Graph

The update assessment and deployment data are available for querying in Azure Resource Graph. You can apply this data to scenarios that include security compliance, security operations, and troubleshooting. Select **Go to resource graph** to go to the Azure Resource Graph Explorer. It enables running Resource Graph queries directly in the Azure portal. Resource Graph supports Azure CLI, Azure PowerShell, Azure SDK for Python, and more. For more information, see [First query with Azure Resource Graph Explorer](../governance/resource-graph/first-query-portal.md).

When the Resource Graph Explorer opens, it is automatically populated with the same query used to generate the results presented in the table on the **History** page in Update management center (preview). Ensure that you review the [query Update logs](query-logs.md) article to learn about the log records and their properties, and the sample queries included. 

## Next steps

* To set up and manage recurring deployment schedules, see [Schedule recurring updates](scheduled-patching.md)
* To view update assessment and deployment logs generated by update management center (preview), see [query logs](query-logs.md).
