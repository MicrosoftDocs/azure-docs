---
title: Scheduling recurring updates in Azure Update Manager
description: This article details how to use Azure Update Manager to set update schedules that install recurring updates on your machines.
ms.service: azure-update-manager
ms.date: 10/28/2024
ms.topic: how-to
author: SnehaSudhirG
ms.author: sudhirsneha
---

# Schedule recurring updates for machines by using the Azure portal and Azure Policy

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers.

You can use Azure Update Manager to create and save recurring deployment schedules. You can create a schedule on a daily, weekly, or hourly cadence. You can specify the machines that must be updated as part of the schedule and the updates to be installed.

This schedule then automatically installs the updates according to the created schedule for a single VM and at scale.

Update Manager uses a maintenance control schedule instead of creating its own schedules. Maintenance control enables customers to manage platform updates. For more information, see [Maintenance control documentation](/azure/virtual-machines/maintenance-control).

## Prerequisites for scheduled patching

1. See [Prerequisites for Update Manager](prerequisites.md).
1. Patch orchestration of the Azure machines should be set to **Customer Managed Schedules**. For more information, see [Enable schedule patching on existing VMs](prerequsite-for-schedule-patching.md#enable-scheduled-patching-on-azure-vms). For Azure Arc-enabled machines, it isn't a requirement.

	> [!NOTE]
	> If you set the patch mode to **Azure orchestrated** (`AutomaticByPlatform`) but do not enable the **BypassPlatformSafetyChecksOnUserSchedule** flag and do not attach a maintenance configuration to an Azure machine, it's treated as an [automatic guest patching](/azure/virtual-machines/automatic-vm-guest-patching)-enabled machine. The Azure platform automatically installs updates according to its own schedule. [Learn more](prerequisites.md).

## Scheduled patching in an availability set

All VMs in a common [availability set](/azure/virtual-machines/availability-set-overview) aren't updated concurrently.

VMs in a common availability set are updated within Update Domain boundaries. VMs across multiple Update Domains aren't updated concurrently. 

In scenarios where machines from the same availability set are being patched at the same time in different schedules, it is likely that they might not get patched or could potentially fail if the maintenance window exceeds. To avoid this, we recommend that you either increase the maintenance window or split the machines belonging to the same availability set across multiple schedules at different times. 


## Configure reboot settings

The registry keys listed in [Configure Automatic Updates by editing the registry](/windows/deployment/update/waas-wu-settings#configuring-automatic-updates-by-editing-the-registry) and [Registry keys used to manage restart](/windows/deployment/update/waas-restart#registry-keys-used-to-manage-restart) can cause your machines to reboot. A reboot can occur even if you specify **Never Reboot** in the **Schedule** settings. Configure these registry keys to best suit your environment.

## Service limits

We recommend the following limits for the indicators.

| Indicator    | Public Cloud Limit          | Mooncake/Fairfax Limit |
|----------|----------------------------|--------------------------|
| Number of schedules per subscription per region     | 250  | 250 |
| Total number of resource associations to a schedule | 3,000 | 3,000 |
| Resource associations on each dynamic scope    | 1,000 | 1,000 |
| Number of dynamic scopes per resource group or subscription per region     | 250  | 250  |
| Number of dynamic scopes per schedule   | 200  | 100  |
| Total number of subscriptions attached to all dynamic scopes per schedule   | 200  | 100  |

For more information, see the [service limits for Dynamic scope](dynamic-scope-overview.md#service-limits).

## Schedule recurring updates on a single VM

You can schedule updates from the **Overview** or **Machines** pane on the **Update Manager** page or from the selected VM.

To schedule recurring updates on a single VM:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. On the **Azure Update Manager** | **Overview** page, select your subscription, and then select **Schedule updates**.

1. On the **Create new maintenance configuration** page, you can create a schedule for a single VM.

	Currently, VMs and maintenance configuration in the same subscription are supported.

1. On the **Basics** page, select **Subscription**, **Resource Group**, and all options in **Instance details**.
    - Select **Maintenance scope** as **Guest (Azure VM, Azure Arc-enabled VMs/servers)**.
	- Select **Add a schedule**. In **Add/Modify schedule**, specify the schedule details, such as:
	
		- **Start on**
		- **Maintenance window** (in hours). The upper maintenance window is 3 hours 55 minutes.
		- **Repeats** (monthly, daily, or weekly)
		- **Add end date**
		- **Schedule summary**

	The hourly option isn't supported in the portal but can be used through the [API](./manage-vms-programmatically.md#create-a-maintenance-configuration-schedule).

	:::image type="content" source="./media/scheduled-updates/scheduled-patching-basics-page.png" alt-text="Screenshot that shows the Scheduled patching basics page.":::

	For **Repeats monthly**, there are two options:

	- Repeat on a calendar date (optionally run on the last date of the month).
	- Repeat on nth (first, second, etc.) x day (for example, Monday, Tuesday) of the month. You can also specify an offset from the day set. It could be +6/-6. For example, if you want to patch on the first Saturday after a patch on Tuesday, set the recurrence as the second Tuesday of the month with a +4 day offset. Optionally, you can also specify an end date when you want the schedule to expire.

1. On the **Machines** tab, select your machine, and then select **Next**.

   Update Manager doesn't support driver updates.

1. On the **Tags** tab, assign tags to maintenance configurations.

1. On the **Review + create** tab, verify your update deployment options, and then select **Create**.

# [From the Machines pane](#tab/schedule-updates-single-machine)

1. Sign in to the [Azure portal](https://portal.azure.com).

1. On the **Azure Update Manager** | **Machines** page, select your subscription, select your machine, and then select **Schedule updates**.

1. In **Create new maintenance configuration**, you can create a schedule for a single VM and assign a machine and tags. Follow the procedure from step 3 listed in **From the Overview pane** of [Schedule recurring updates on a single VM](#schedule-recurring-updates-on-a-single-vm) to create a maintenance configuration and assign a schedule.

# [From a selected VM](#tab/singlevm-schedule-home)

1. Select your virtual machine to open the **Virtual machines | Updates** page.
1. Under **Operations**, select **Updates**.
1. On the **Updates** tab, select **Go to Updates using Update Center**.
1. In **Updates preview**, select **Schedule updates**. In **Create new maintenance configuration**, you can create a schedule for a single VM. Follow the procedure from step 3 listed in **From the Overview pane** of [Schedule recurring updates on a single VM](#schedule-recurring-updates-on-a-single-vm) to create a maintenance configuration and assign a schedule.

---
A notification confirms that the deployment was created.

## Schedule recurring updates at scale

To schedule recurring updates at scale, follow these steps.

You can schedule updates from the **Overview** or **Machines** pane.

# [From the Overview pane](#tab/schedule-updates-scale-overview)

1. Sign in to the [Azure portal](https://portal.azure.com).

1. On the **Azure Update Manager** | **Overview** page, select your subscription, and then select **Schedule updates**.

1. On the **Create new maintenance configuration** page, you can create a schedule for multiple machines.

	Currently, VMs and maintenance configuration in the same subscription are supported.

1. On the **Basics** tab, select **Subscription**, **Resource Group**, and all options in **Instance details**.
	- Select **Add a schedule**. In **Add/Modify schedule**, specify the schedule details, such as:
	
		- **Start on**
		- **Maintenance window** (in hours)
		- **Repeats** (monthly, daily, or weekly)
		- **Add end date**
		- **Schedule summary**

	The hourly option isn't supported in the portal but can be used through the [API](./manage-vms-programmatically.md#create-a-maintenance-configuration-schedule).

1. On the **Machines** tab, verify if the selected machines are listed. You can add or remove machines from the list. Select **Next**.

1. On the **Updates** tab, specify the updates to include in the deployment, such as update classifications or KB ID/packages that must be installed when you trigger your schedule.

	Update Manager doesn't support driver updates.

1. On the **Tags** tab, assign tags to maintenance configurations.

1. On the **Review + create** tab, verify your update deployment options, and then select **Create**.

# [From the Machines pane](#tab/schedule-updates-scale-machine)

1. Sign in to the [Azure portal](https://portal.azure.com).

1. On the **Azure Update Manager** | **Machines** page, select your subscription, select your machines, and then select **Schedule updates**.

On the **Create new maintenance configuration** page, you can create a schedule for a single VM. Follow the procedure from step 3 listed in **From the Overview pane** of [Schedule recurring updates on a single VM](#schedule-recurring-updates-on-a-single-vm) to create a maintenance configuration and assign a schedule.

---
A notification confirms that the deployment was created.

## Attach a maintenance configuration

 A maintenance configuration can be attached to multiple machines. It can be attached to machines at the time of creating a new maintenance configuration or even after you create one.

 1. On the **Azure Update Manager** page, select **Machines**, and then select your subscription.
 1. Select your machine, and on the **Updates** pane, select **Scheduled updates** to create a maintenance configuration or attach an existing maintenance configuration to the scheduled recurring updates.
1. On the **Scheduling** tab, select **Attach maintenance configuration**.
1. Select the maintenance configuration that you want to attach, and then select **Attach**.
1. On the **Updates** pane, select **Scheduling** > **Attach maintenance configuration**.
1. On the **Attach existing maintenance configuration** page, select the maintenance configuration that you want to attach, and then select **Attach**.

    :::image type="content" source="./media/scheduled-updates/scheduled-patching-attach-maintenance-inline.png" alt-text="Screenshot that shows Scheduled patching attach maintenance configuration." lightbox="./media/scheduled-updates/scheduled-patching-attach-maintenance-expanded.png":::

## Schedule recurring updates from maintenance configuration

You can browse and manage all your maintenance configurations from a single place.

1. Search **Maintenance configurations** in the Azure portal. It shows a list of all maintenance configurations along with the maintenance scope, resource group, location, and the subscription to which it belongs.

1. You can filter maintenance configurations by using filters at the top. Maintenance configurations related to guest OS updates are the ones that have maintenance scope as **InGuestPatch**.

You can create a new guest OS update maintenance configuration or modify an existing configuration.

:::image type="content" source="./media/scheduled-updates/maintenance-configurations.png" alt-text="Screenshot that shows maintenance configuration.":::

### Create a new maintenance configuration

1. Go to **Machines** and select machines from the list.
1. On the **Updates** pane, select **Scheduled updates**.
1. On the **Create a maintenance configuration** pane, follow step 3 in this [procedure](#schedule-recurring-updates-on-a-single-vm) to create a maintenance configuration.
1. On the **Basics** tab, select the **Maintenance scope** as **Guest (Azure VM, Arc-enabled VMs/servers)**.

   :::image type="content" source="./media/scheduled-updates/create-maintenance-configuration.png" alt-text="Screenshot that shows creating a maintenance configuration.":::

### Add or remove machines from maintenance configuration

1. Go to **Machines** and select the machines from the list.
1. On the **Updates** page, select **One-time updates**.
1. On the **Install one-time updates** pane, select **Machines** > **Add machine**.

	:::image type="content" source="./media/scheduled-updates/add-or-remove-machines-from-maintenance-configuration-inline.png" alt-text="Screenshot that shows adding or removing machines from maintenance configuration." lightbox="./media/scheduled-updates/add-or-remove-machines-from-maintenance-configuration-expanded.png":::

### Change update selection criteria

1. On the **Install one-time updates** pane, select the resources and machines to install the updates.
1. On the **Machines** tab, select **Add machine** to add machines that weren't previously selected, and then select **Add**.
1. On the **Updates** tab, specify the updates to include in the deployment.
1. Select **Include KB ID/package** and **Exclude KB ID/package**, respectively, to select updates like **Critical**, **Security**, and **Feature updates**.

   :::image type="content" source="./media/scheduled-updates/change-update-selection-criteria-of-maintenance-configuration-inline.png" alt-text="Screenshot that shows changing update selection criteria of Maintenance configuration." lightbox="./media/scheduled-updates/change-update-selection-criteria-of-maintenance-configuration-expanded.png":::

## Onboard to schedule by using Azure Policy

Update Manager allows you to target a group of Azure or non-Azure VMs for update deployment via Azure Policy. The grouping using a policy keeps you from having to edit your deployment to update machines. You can use subscription, resource group, tags, or regions to define the scope. You can use this feature for the built-in policies, which you can customize according to your use case.

> [!NOTE]
> This policy also ensures that the patch orchestration property for Azure machines is set to **Customer Managed Schedules** because it's a prerequisite for scheduled patching.

### Assign a policy

Azure Policy allows you to assign standards and assess compliance at scale. For more information, see [Overview of Azure Policy](../governance/policy/overview.md). To assign a policy to scope:

1. Sign in to the [Azure portal](https://portal.azure.com) and select **Policy**.
1. Under **Assignments**, select **Assign policy**.
1. On the **Assign policy** page, on the **Basics** tab:
	- For **Scope**, choose your subscription and resource group and choose **Select**.
	- Select **Policy definition** to view a list of policies.
	- On the **Available Definitions** pane, select **Built in** for **Type**. In **Search**, enter **Schedule recurring updates using Azure Update Manager** and click **Select**.

	  :::image type="content" source="./media/scheduled-updates/dynamic-scoping-defintion.png" alt-text="Screenshot that shows how to select the definition.":::
	
	- Ensure that **Policy enforcement** is set to **Enabled**, and then select **Next**.
1. On the **Parameters** tab, by default, only the **Maintenance configuration ARM ID** is visible.

   If you don't specify any other parameters, all machines in the subscription and resource group that you selected on the **Basics** tab are covered under scope. If you want to scope further based on resource group, location, OS, tags, and so on, clear **Only show parameters that need input or review** to view all parameters:

	- **Maintenance Configuration ARM ID**: A mandatory parameter to be provided. It denotes the Azure Resource Manager (ARM) ID of the schedule that you want to assign to the machines.
	- **Resource groups**: You can optionally specify a resource group if you want to scope it down to a resource group. By default, all resource groups within the subscription are selected.
	- **Operating System types**: You can select Windows or Linux. By default, both are preselected.
	- **Machine locations**: You can optionally specify the regions that you want to select. By default, all are selected.
	- **Tags on machines**: You can use tags to scope down further. By default, all are selected.
	- **Tags operator**: If you select multiple tags, you can specify if you want the scope to be machines that have all the tags or machines that have any of those tags.

	:::image type="content" source="./media/scheduled-updates/dynamic-scoping-assign-policy.png" alt-text="Screenshot that shows how to assign a policy.":::

1. On the **Remediation** tab, in **Managed Identity** > **Type of Managed Identity**, select **System assigned managed identity**. **Permissions** is already set as **Contributor** according to the policy definition.

   If you select **Remediation**, the policy is in effect on all the existing machines in the scope or else it's assigned to any new machine that's added to the scope.

1. On the **Review + create** tab, verify your selections, and then select **Create** to identify the noncompliant resources to understand the compliance state of your environment.

### View compliance

To view the current compliance state of your existing resources:

1. In **Policy Assignments**, select **Scope** to select your subscription and resource group.
1. In **Definition type**, select the policy. In the list, select the assignment name.
1. Select **View compliance**. **Resource compliance** lists the machines and reasons for failure.

	:::image type="content" source="./media/scheduled-updates/dynamic-scoping-policy-compliance.png" alt-text="Screenshot that shows policy compliance.":::

## Check your scheduled patching run

You can check the deployment status and history of your maintenance configuration runs from the Update Manager portal. For more information, see [Update deployment history by maintenance run ID](./manage-multiple-machines.md#update-deployment-history-by-maintenance-run-id).


## Timeline of Maintenance Window

The maintenance window controls the number of updates that can be installed on your virtual machine and Arc-enabled servers. We recommend that you go through the following table to understand the timeline for a maintenance window while installing an update:

For example, if a maintenance window is of 3 hours and starts at 3:00 PM, the following are the details on how the updates are installed:

#### [Windows](#tab/windows-maintenance)

| **Update Type** | **Details** |
| ---------- | ------------- |
| Service Pack | If you are installing a Service Pack, you need 20 mins left in the maintenance window for the updates to be successfully installed, else the update is skipped. </br> In this example, you must finish installing the service pack by 5:40 PM. |  
| Other updates | If you are installing any other update besides Service Pack, you need to have 15 mins left in the maintenance window, else it is skipped. </br> In this example, you must finish installing the other updates by 5:45 PM.| 
| Reboot | If the machine(s) needs a reboot, you need to have 10 minutes left in the maintenance window, else the reboot is skipped. </br> In this example, you must start the reboot by 5:50 PM. </br> **Note**: For Azure virtual machines and Arc-enabled servers, Azure Update Manager waits for a maximum of 15 minutes for Azure VMs and 25 minutes for Arc servers after a reboot to complete the reboot operation before marking it as failed. |

#### [Linux](#tab/linux-maintenance)

| **Update Type** | **Details** |
| ---------- | ------------- |
| Reboot | If the VMs need a reboot, you need to have 15 minutes left in the maintenance window, else the reboot is skipped. </br> **Note**: This is only applicable for Azure VMs and not for Arc-enabled servers. </br> In this example, you must start the reboot by 5:45 PM. |
| Updates installed in batches | If the batch size is X, then the minimum time required to update the packages is calculated as follows </br></br> - If X is less than or equal to 3, the minimum required time  = 5 x X minutes. </br> - If X is greater than 3, the minimum required time = 15+2 x (X-3) minutes. </br> **Note**:  Only Azure Update Manager service controls the batch size (X) of the updates. |

---

> [!NOTE]
> - Azure Update Manager doesn't stop installing the new updates if it's approaching the end of the maintenance window.
> - Azure Update Manger doesn't terminate in-progress updates if the maintenance window is exceeded and only the remaining updates that must be installed aren't attempted. We recommend that you re-evaluate the duration of your maintenance window to ensure all the updates are installed . 
> - If the maintenance window is exceeded on Windows, it's often because a service pack update is taking a long time to install.



## Next steps

* Learn more about [Dynamic scope](dynamic-scope-overview.md), an advanced capability of schedule patching.
* Learn more about how to [Configure schedule patching on Azure VMs for business continuity](prerequsite-for-schedule-patching.md).
* Follow the instructions on how to [manage various operations of Dynamic scope](manage-dynamic-scoping.md)
* Learn about [pre and post events](pre-post-scripts-overview.md) to automatically perform tasks before and after a scheduled maintenance configuration.
