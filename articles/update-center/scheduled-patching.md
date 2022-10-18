---
title: Scheduling recurring updates in Update management center (preview)
description: The article details how to use update management center (preview) in Azure to set update schedules that install recurring updates on your machines.
ms.service: update-management-center
ms.date: 04/21/2022
ms.topic: conceptual
author: SnehaSudhirG
ms.author: sudhirsneha
---

# Schedule recurring updates for machines using update management center (Preview)

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers.

You can use update management center (preview) in Azure to create and save recurring deployment schedules. You can create a schedule on a daily, weekly or hourly cadence, specify the machines that must be updated as part of the schedule, and the updates to be installed. This schedule will then automatically install the updates as per the created schedule for single VM and at scale.

Update management center (preview) uses maintenance control schedule instead of creating its own schedules. Maintenance control enables customers to manage platform updates. For more information, see [Maintenance control documentation](/azure/virtual-machines/maintenance-control).

## Prerequisites for scheduled patching

1. See [Prerequisites for Update management center (preview)](./overview.md#prerequisites)
1. Patch orchestration of the Azure machines should be set to **Azure Orchestrated (Automatic By Platform)**. For Azure Arc-enabled machines, it isn't a requirement.

	> [!Note]
	> If you set the patch orchestration mode to Azure orchestrated (Automatic By Platform) but don't attach a maintenance configuration to an Azure machine, it is treated as [Automatic Guest patching](../virtual-machines/automatic-vm-guest-patching.md) enabled machine and Azure platform will automatically install updates as per its own schedule.


## Schedule recurring updates on single VM

>[!NOTE]
> You can schedule updates from the Overview or Machines blade in update management center (preview) page or from the selected VM.

# [From Overview blade](#tab/schedule-updates-single-overview)

To schedule recurring updates on a single VM, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In **Update management center (preview)**, **Overview**, select your **Subscription**, and select **Schedule updates**.

1. In **Create new maintenance configuration**, you can create a schedule for a single VM.

	> [!Note] 
	> Currently, VMs and maintenance configuration in the same subscription are supported.

1. In the **Basics** page, select **Subscription**, **Resource Group** and all options in **Instance details**.
	- Select **Add a schedule** and in **Add/Modify schedule**, specify the schedule details such as:
	
		- Start on
		- Maintenance window (in hours)
		- Repeats (monthly, daily or weekly)
		- Add end date
		- Schedule summary

	> [!NOTE]
	> The hourly option is currently not supported in the portal, but can be used through the [API](./manage-vms-programmatically.md#create-a-maintenance-configuration-schedule). 

	:::image type="content" source="./media/scheduled-updates/scheduled-patching-basics-page.png" alt-text="Scheduled patching basics page.":::
 
	
	For the Repeats-monthly, there are two options: 

	- Repeat on a calendar date (optionally run on last date of the month)
	- Repeat on nth (first, second, etc.) x day (for example, Monday, Tuesday) of the month. You can also specify an offset from the day set. It could be +6/-6. For example, for customers who want to patch on the first Saturday after a patch on Tuesday, they would set the recurrence as the second Tuesday of the month with a +4 day offset. Optionally you can also specify an end date when you want the schedule to expire.

1. In the **Machines** page, select your machine and select **Next** to continue.

1. In the **Tags** page, assign tags to maintenance configurations.

1. In the **Review + Create** page, verify your update deployment options and select **Create**.


# [From Machines blade](#tab/schedule-updates-single-machine)

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In **Update management center (Preview)**, **Machines**, select your **Subscription**, select your machine and select **Schedule updates**.

1. In **Create new maintenance configuration**, you can create a schedule for a single VM, assign machine and tags. Follow the procedure from step 3 listed in **From Overview blade** of [Schedule recurring updates on single VM](#schedule-recurring-updates-on-single-vm) to create a maintenance configuration and assign a schedule.


# [From a selected VM](#tab/singlevm-schedule-home)

1. Select your virtual machine and the **virtual machines | Updates** page opens.
1. Under **Operations**, select **Updates**.
1. In **Updates**, select **Go to Updates using Update Center**.
1. In **Updates preview**, select **Schedule updates** and in **Create new maintenance configuration**, you can create a schedule for a single VM. Follow the procedure from step 3 listed in **From Overview blade** of [Schedule recurring updates on single VM](#schedule-recurring-updates-on-single-vm) to create a maintenance configuration and assign a schedule.

---

A notification appears that the deployment has been created.


## Schedule recurring updates at scale

To schedule recurring updates at scale, follow these steps:

>[!NOTE]
> You can schedule updates from the Overview or Machines blade.

# [From Overview blade](#tab/schedule-updates-scale-overview)
 
1. Sign in to the [Azure portal](https://portal.azure.com).

1. In **Update management center (Preview)**, **Overview**, select your **Subscription** and select **Schedule updates**.

1. In the **Create new maintenance configuration** page, you can create a schedule for multiple machines.

	> [!Note] 
	> Currently, VMs and maintenance configuration in the same subscription are supported.

1. In the **Basics** page, select **Subscription**, **Resource Group** and all options in **Instance details**.
	- Select **Add a schedule** and in **Add/Modify schedule**, specify the schedule details such as:
	
		- Start on
		- Maintenance window (in hours)
		- Repeats(monthly, daily or weekly)
		- Add end date
		- Schedule summary

	> [!NOTE]
	> The hourly option is currently not supported in the portal, but can be used through the [API](./manage-vms-programmatically.md#create-a-maintenance-configuration-schedule). 

1. In the **Machines** page, verify if the selected machines are listed. You can add or remove machines from the list. Select **Next** to continue.

1. In the **Tags** page, assign tags to maintenance configurations.

1. In the **Review + Create** page, verify your update deployment options and select **Create**.


# [From Machines blade](#tab/schedule-updates-scale-machine)

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In **Update management center (Preview)**, **Machines**, select your **Subscription**, select your machines and select **Schedule updates**.

In **Create new maintenance configuration**, you can create a schedule for a single VM. Follow the procedure from step 3 listed in **From Overview blade** of [Schedule recurring updates on single VM](#schedule-recurring-updates-on-single-vm) to create a maintenance configuration and assign a schedule.

---

A notification appears that the deployment is created.


 ## Attach a maintenance configuration
 A maintenance configuration can be attached to multiple machines. It can be attached to machines at the time of creating a new maintenance configuration or even after you've created one.

 1. In **Update management center**, select **Machines** and select your **Subscription**.
 1. Select your machine and in **Updates (Preview)**, select **Scheduled updates** to create a maintenance configuration  or attach existing maintenance configuration to the scheduled recurring updates.
1. In **Scheduling**, select **Attach maintenance configuration**. 
1. Select the maintenance configuration that you would want to attach and select **Attach**. 
1. In **Updates (Preview)**, select **Scheduling** and **+Attach maintenance configuration**. 
1. In the **Attach existing maintenance configuration** page, select the maintenance configuration that you want to attach and select **Attach**. 

	:::image type="content" source="./media/scheduled-updates/scheduled-patching-attach-maintenance-inline.png" alt-text="Scheduled patching attach maintenance configuration." lightbox="./media/scheduled-updates/scheduled-patching-attach-maintenance-expanded.png":::
 
## Schedule recurring updates from maintenance configuration

You can browse and manage all your maintenance configurations from a single place. 

1. Search **Maintenance configurations** in the Azure portal. It shows a list of all maintenance configurations along with the maintenance scope, resource group, location, and the subscription to which it belongs. 

1. You can filter maintenance configurations using filters at the top. Maintenance configurations related to Guest OS updates are the ones that have Maintenance scope as **InGuestPatch**.

You can create a new Guest OS update maintenance configuration or modify an existing configuration:

:::image type="content" source="./media/scheduled-updates/maintenance-configurations.png" alt-text="Maintenance configuration.":::


### Create a new maintenance configuration

1. Go to **Machines** and select machines from the list.
1. In the **Updates (Preview)**, select **Scheduled updates**.
1. In **Create a maintenance configuration**, follow step 3 in this [procedure](#schedule-recurring-updates-on-single-vm) to create a maintenance configuration.

	:::image type="content" source="./media/scheduled-updates/create-maintenance-configuration.png" alt-text="Create Maintenance configuration.":::
	

### Add/remove machines from maintenance configuration

1. Go to **Machines** and select the machines from the list.
1. In **Updates (Preview)** page, select **One-time updates**.
1. In **Install one-time updates**, **Machines**, select **+Add machine**.

	:::image type="content" source="./media/scheduled-updates/add-or-remove-machines-from-maintenance-configuration-inline.png" alt-text="Add/remove machines from Maintenance configuration." lightbox="./media/scheduled-updates/add-or-remove-machines-from-maintenance-configuration-expanded.png":::
 

### Change update selection criteria

1. In **Install one-time updates**, select the resources and machines to install the updates.
1. In **Machines**, select **+Add machine** to add machines that were previously not selected and click **Add**.
1. In **Updates**, specify the updates to include in the deployment. 
1. Select **Include KB ID/package** and **Exclude KB ID/package** respectively to select category of updates like Critical, Security, Feature updates etc.

   :::image type="content" source="./media/scheduled-updates/change-update-selection-criteria-of-maintenance-configuration-inline.png" alt-text="Change update selection criteria of Maintenance configuration." lightbox="./media/scheduled-updates/change-update-selection-criteria-of-maintenance-configuration-expanded.png":::

## Dynamic scoping

The update management center (preview) allows you to target a dynamic group of Azure or non-Azure VMs for update deployment. Using a dynamic group keeps you from having to edit your deployment to update machines. You can use subscription, resource group, tags or regions to define the scope and use dynamic scoping by using built-in policies which you can customize as per your use-case.

> [!NOTE]
> This policy also ensures that the patch orchestration property for Azure machines is set to **Automatic by Platform** or **Azure-orchestrated (preview)** as it is a prerequisite for scheduled patching.

### Assign a policy

Policy allows you to assign standards and assess compliance at scale. [Learn more](../governance/policy/overview.md). To assign a policy to scope, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com) and select **Policy**.
1. In **Assignments**, select **Assign policy**.
1. Under **Basics**, in the **Assign policy** page:
	- In **Scope**, choose your subscription, resource group, and choose **Select**.
	- Select **Policy definition** to view a list of policies.
	- In **Available Definitions**, select **Built in** for Type and in search, enter - *[Preview] Schedule recurring updates using Update Management Center* and click **Select**.

	:::image type="content" source="./media/scheduled-updates/dynamic-scoping-defintion.png" alt-text="Screenshot that shows on how to select the definition.":::
	
	- Ensure that **Policy enforcement** is set to **Enabled** and select **Next**.
1. In **Parameters**, by default, only the Maintenance configuration ARM ID is visible. 

	>[!NOTE]
	> If you do not specify any other parameters, all machines in the subscription and resource group that you selected in **Basics** will be covered under scope. However, if you want to scope further based on resource group, location, OS, tags and so on, deselect **Only show parameters that need input or review** to view all parameters.

	- Maintenance Configuration ARM ID: A mandatory parameter to be provided. It denotes the ARM ID of the schedule that you want to assign to the machines.
	- Resource groups: You can specify a resource group optionally if you want to scope it down to a resource group. By default, all resource groups within the subscription are selected.
	- Operating System types: You can select Windows or Linux. By default, both are preselected.
	- Machine locations: You can optionally specify the regions that you want to select. By default, all are selected.
	- Tags on machines: You can use tags to scope down further. By default, all are selected.
	- Tags operator: In case you have selected multiple tags, you can specify if you want the scope to be machines that have all the tags or machines which have any of those tags.

	:::image type="content" source="./media/scheduled-updates/dynamic-scoping-assign-policy.png" alt-text="Screenshot that shows on how to assign a policy.":::

1. In **Remediation**, **Managed Identity**, **Type of Managed Identity**, select System assigned managed identity and **Permissions** is already set as *Contributor* according to the policy definition.

	>[!NOTE]
	> If you select Remediation, the policy would be effective on all the existing machines in the scope else, it is assigned to any new machine which is added to the scope.

1. In **Review + Create**, verify your selections, and select **Create** to identify the non-compliant resources to understand the compliance state of your environment.

### View Compliance

To view the current compliance state of your existing resources:

1. In **Policy Assignments**, select **Scope** to select your subscription and resource group.
1. In **Definition type**, select policy and in the list, select the assignment name.
1. Select **View compliance**. The Resource Compliance lists the machines and reasons for failure.

	:::image type="content" source="./media/scheduled-updates/dynamic-scoping-policy-compliance.png" alt-text="Screenshot that shows on policy compliance.":::

## Check your scheduled patching run
You can check the deployment status and history of your maintenance configuration runs from the Update management center portal. Follow [Update deployment history by maintenance run ID](./manage-multiple-machines.md#update-deployment-history-by-maintenance-run-id).


## Limitations and known issues

The known issues and limitations of scheduled patching are:

1. For concurrent/conflicting schedule, only one schedule will be triggered. The other schedule will be triggered once a schedule is finished.
1. If a machine is newly created, the schedule might have 15 minutes of schedule trigger delay in case of Azure VMs.

## Next steps

* To view update assessment and deployment logs generated by update management center (preview), see [query logs](query-logs.md).
* To troubleshoot issues, see the [Troubleshoot](troubleshoot.md) update management center (preview).