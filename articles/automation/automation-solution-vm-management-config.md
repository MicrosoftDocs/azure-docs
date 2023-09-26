---
title: Configure Azure Automation Start/Stop VMs during off-hours
description: This article tells how to configure the Start/Stop VMs during off-hours feature to support different use cases or scenarios.
services: automation
ms.subservice: process-automation
ms.date: 03/16/2023
ms.topic: conceptual
ms.custom: engagement-fy23
---

# Configure Start/Stop VMs during off-hours

> [!NOTE]
> Start/Stop VM during off-hours version 1 is unavailable in the marketplace now as it will retire by 30 September 2023. We recommend you start using [version 2](../azure-functions/start-stop-vms/overview.md), which is now generally available. The new version offers all existing capabilities and provides new features, such as multi-subscription support from a single Start/Stop instance. If you have the version 1 solution already deployed, you can still use the feature, and we will provide support until 30 September 2023. The details of the announcement will be shared soon. 

This article describes how to configure the [Start/Stop VMs during off-hours](automation-solution-vm-management.md) feature to support the described scenarios. You can also learn how to:

* [Configure email notifications](#configure-email-notifications)
* [Add a VM](#add-a-vm)
* [Exclude a VM](#exclude-a-vm)
* [Modify the startup and shutdown schedules](#modify-the-startup-and-shutdown-schedules)

## <a name="schedule"></a>Scenario 1: Start/Stop VMs on a schedule

This scenario is the default configuration when you first deploy Start/Stop VMs during off-hours. For example, you can configure the feature to stop all VMs across a subscription when you leave work in the evening, and start them in the morning when you are back in the office. When you configure the schedules **Scheduled-StartVM** and **Scheduled-StopVM** during deployment, they start and stop targeted VMs. 

Configuring the feature to just stop VMs is supported. See [Modify the startup and shutdown schedules](#modify-the-startup-and-shutdown-schedules) to learn how to configure a custom schedule.

> [!NOTE]
> The time zone used by the feature is your current time zone when you configure the schedule time parameter. However, Azure Automation stores it in UTC format in Azure Automation. You don't have to do any time zone conversion, as this is handled during machine deployment.

To control the VMs that are in scope, configure the variables: `External_Start_ResourceGroupNames`, `External_Stop_ResourceGroupNames`, and `External_ExcludeVMNames`.

You can enable either targeting the action against a subscription and resource group, or targeting a specific list of VMs, but not both.

### Target the start and stop actions against a subscription and resource group

1. Configure the `External_Stop_ResourceGroupNames` and `External_ExcludeVMNames` variables to specify the target VMs.

1. Enable and update the **Scheduled-StartVM** and **Scheduled-StopVM** schedules.

1. Run the **ScheduledStartStop_Parent** runbook with the **ACTION** parameter field set to **start** and the **WHATIF** parameter field set to True to preview your changes.

### Target the start and stop action by VM list

1. Run the **ScheduledStartStop_Parent** runbook with **ACTION** set to **start**.

1. Add a comma-separated list of VMs (without spaces) in the **VMList** parameter field. An example list is `vm1,vm2,vm3`.

1. Set the **WHATIF** parameter field to True to preview your changes.

1. Configure the `External_ExcludeVMNames` variable with a comma-separated list of VMs (VM1,VM2,VM3), without spaces between comma-separated values.

1. This scenario does not honor the `External_Start_ResourceGroupNames` and `External_Stop_ResourceGroupnames` variables. For this scenario, you need to create your own Automation schedule. For details, see [Schedule a runbook in Azure Automation](shared-resources/schedules.md).

    > [!NOTE]
    > The value for **Target ResourceGroup Names** is stored as the values for both `External_Start_ResourceGroupNames` and `External_Stop_ResourceGroupNames`. For further granularity, you can modify each of these variables to target different resource groups. For start action, use `External_Start_ResourceGroupNames`, and use `External_Stop_ResourceGroupNames` for stop action. VMs are automatically added to the start and stop schedules.

## <a name="tags"></a>Scenario 2: Start/Stop VMs in sequence by using tags

In an environment that includes two or more components on multiple VMs supporting a distributed workload, supporting the sequence in which components are started and stopped in order is important. 

### Target the start and stop actions against a subscription and resource group

1. Add a `sequencestart` and a `sequencestop` tag with positive integer values to VMs that are targeted in `External_Start_ResourceGroupNames` and `External_Stop_ResourceGroupNames` variables. The start and stop actions are performed in ascending order. To learn how to tag a VM, see [Tag a Windows virtual machine in Azure](../virtual-machines/tag-portal.md) and [Tag a Linux virtual machine in Azure](../virtual-machines/tag-cli.md).

1. Modify the schedules **Sequenced-StartVM** and **Sequenced-StopVM** to the date and time that meet your requirements and enable the schedule.

1. Run the **SequencedStartStop_Parent** runbook with **ACTION** set to **start** and **WHATIF** set to True to preview your changes.

1. Preview the action and make any necessary changes before implementing against production VMs. When ready, manually execute the runbook with the parameter set to **False**, or let the Automation schedules **Sequenced-StartVM** and **Sequenced-StopVM** run automatically following your prescribed schedule.

### Target the start and stop actions by VM list

1. Add a `sequencestart` and a `sequencestop` tag with positive integer values to VMs that you plan to add to the `VMList` parameter.

1. Run the **SequencedStartStop_Parent** runbook with **ACTION** set to **start**.

1. Add a comma-separated list of VMs (without spaces) in the **VMList** parameter field. An example list is `vm1,vm2,vm3`.

1. Set **WHATIF** to True to preview your changes. 

1. Configure the `External_ExcludeVMNames` variable with a comma-separated list of VMs, without spaces between comma-separated values.

1. This scenario does not honor the `External_Start_ResourceGroupNames` and `External_Stop_ResourceGroupnames` variables. For this scenario, you need to create your own Automation schedule. For details, see [Schedule a runbook in Azure Automation](shared-resources/schedules.md).

1. Preview the action and make any necessary changes before implementing against production VMs. When ready, manually execute the **monitoring-and-diagnostics/monitoring-action-groupsrunbook** with the parameter set to **False**. Alternatively, let the Automation schedules **Sequenced-StartVM** and **Sequenced-StopVM** run automatically following your prescribed schedule.

## <a name="cpuutil"></a>Scenario 3: Stop automatically based on CPU utilization

Start/Stop VMs during off-hours can help manage the cost of running Azure Resource Manager and classic VMs in your subscription by evaluating machines that aren't used during non-peak periods, such as after hours, and automatically shutting them down if processor utilization is less than a specified percentage.

By default, the feature is pre-configured to evaluate the percentage CPU metric to see if average utilization is 5 percent or less. This scenario is controlled by the following variables and can be modified if the default values don't meet your requirements:

* `External_AutoStop_MetricName`
* `External_AutoStop_Threshold`
* `External_AutoStop_TimeAggregationOperator`
* `External_AutoStop_TimeWindow`
* `External_AutoStop_Frequency`
* `External_AutoStop_Severity`

You can enable and target the action against a subscription and resource group, or target a specific list of VMs.

When you run the **AutoStop_CreateAlert_Parent** runbook, it verifies that the targeted subscription, resource group(s), and VMs exist. If the VMs exist, the runbook calls the **AutoStop_CreateAlert_Child** runbook for each VM verified by the parent runbook. This child runbook:

* Creates a metric alert rule for each verified VM.
* Triggers the **AutoStop_VM_Child** runbook for a particular VM if the CPU drops below the configured threshold for the specified time interval. 
* Attempts to stop the VM.

### Target the autostop action against all VMs in a subscription

1. Ensure that the `External_Stop_ResourceGroupNames` variable is empty or set to * (wildcard).

1. [Optional] If you want to exclude some VMs from the autostop action, you can add a comma-separated list of VM names to the `External_ExcludeVMNames` variable.

1. Enable the **Schedule_AutoStop_CreateAlert_Parent** schedule to run to create the required Stop VM metric alert rules for all of the VMs in your subscription. Running this type of schedule lets you create new metric alert rules as new VMs are added to the subscription.

### Target the autostop action against all VMs in a resource group or multiple resource groups

1. Add a comma-separated list of resource group names to the `External_Stop_ResourceGroupNames` variable.

1. If you want to exclude some of the VMs from the autostop, you can add a comma-separated list of VM names to the `External_ExcludeVMNames` variable.

1. Enable the **Schedule_AutoStop_CreateAlert_Parent** schedule to run to create the required Stop VM metric alert rules for all of the VMs in your resource groups. Running this operation on a schedule allows you to create new metric alert rules as new VMs are added to the resource group(s).

### Target the autostop action to a list of VMs

1. Create a new [schedule](shared-resources/schedules.md#create-a-schedule) and link it to the **AutoStop_CreateAlert_Parent** runbook, adding a comma-separated list of VM names to the `VMList` parameter.

1. Optionally, if you want to exclude some VMs from the autostop action, you can add a comma-separated list of VM names (without spaces) to the `External_ExcludeVMNames` variable.

## Configure email notifications

To change email notifications after Start/Stop VMs during off-hours is deployed, you can modify the action group created during deployment.  

> [!NOTE]
> Subscriptions in the Azure Government cloud don't support the email functionality of this feature.

1. In the Azure portal, click on **Alerts** under **Monitoring**, then **Manage actions**. On the **Manage actions** page, make sure you're on the **Action groups** tab. Select the action group called **StartStop_VM_Notification**.

    :::image type="content" source="media/automation-solution-vm-management/azure-monitor-sm.png" alt-text="Screenshot of the Monitor - Action groups page." lightbox="media/automation-solution-vm-management/azure-monitor-lg.png":::

1. On the **StartStop_VM_Notification** page, the **Basics** section will be filled in for you and can't be edited, except for the **Display name** field. Edit the name, or accept the suggested name. In the **Notifications** section, click the pencil icon to edit the action details. This opens the **Email/SMS message/Push/Voice** pane. Update the email address and click **OK** to save your changes.

    :::image type="content" source="media/automation-solution-vm-management/change-email.png" alt-text="Screenshot of the Email/SMS message/Push/Voice page showing an example email address updated.":::

    You can add additional actions to the action group. To learn more about action groups, see [action groups](../azure-monitor/alerts/action-groups.md)

The following is an example email that is sent when the feature shuts down virtual machines.

:::image type="content" source="media/automation-solution-vm-management/email.png" alt-text="Screenshot of an example email sent when the feature shuts down virtual machines." lightbox="media/automation-solution-vm-management/email.png":::

## <a name="add-exclude-vms"></a>Add or exclude VMs

The feature allows you to add VMs to be targeted or excluded. 

### Add a VM

There are two ways to ensure that a VM is included when the feature runs:

* Each of the parent runbooks of the feature has a `VMList` parameter. You can pass a comma-separated list of VM names (without spaces) to this parameter when scheduling the appropriate parent runbook for your situation, and these VMs will be included when the feature runs.

* To select multiple VMs, set `External_Start_ResourceGroupNames` and `External_Stop_ResourceGroupNames` with the resource group names that contain the VMs you want to start or stop. You can also set the variables to a value of `*` to have the feature run against all resource groups in the subscription.

### Exclude a VM

To exclude a VM from Stop/start VMs during off-hours, you can add its name to the `External_ExcludeVMNames` variable. This variable is a comma-separated list of specific VMs (without spaces) to exclude from the feature. This list is limited to 140 VMs. If you add more than 140 VMs to this list, VMs that are set to be excluded might be inadvertently started or stopped.

## Modify the startup and shutdown schedules

Managing the startup and shutdown schedules in this feature follows the same steps as outlined in [Schedule a runbook in Azure Automation](shared-resources/schedules.md). Separate schedules are required to start and stop VMs.

Configuring the feature to just stop VMs at a certain time is supported. In this scenario you just create a stop schedule and no corresponding start schedule. 

1. Ensure that you've added the resource groups for the VMs to shut down in the `External_Stop_ResourceGroupNames` variable.

1. Create your own schedule for the time when you want to shut down the VMs.

1. Navigate to the **ScheduledStartStop_Parent** runbook and click **Schedule**. This allows you to select the schedule you created in the preceding step.

1. Select **Parameters and run settings** and set the **ACTION** field to **Stop**.

1. Select **OK** to save your changes.


## Create alerts

Start/Stop VMs during off-hours doesn't include a predefined set of Automation job alerts. Review [Forward job data to Azure Monitor Logs](automation-manage-send-joblogs-log-analytics.md#azure-monitor-log-records) to learn about log data forwarded from the Automation account related to the runbook job results and how to create job failed alerts to support your DevOps or operational processes and procedures.

## Next steps

* To monitor the feature during operation, see [Query logs from Start/Stop VMs during off-hours](automation-solution-vm-management-logs.md).
* To handle problems during VM management, see [Troubleshoot Start/Stop VMs during off-hours issues](troubleshoot/start-stop-vm.md).
