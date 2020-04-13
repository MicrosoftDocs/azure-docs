---
title: Configure Start/Stop VMs solution
description: This article describes how to configure the Start/Stop VMs during off-hours solution to support different use cases or scenarios.
services: automation
ms.subservice: process-automation
ms.date: 04/01/2020
ms.topic: conceptual
---

# How to configure Start/Stop VMs during off hours solution

With the Start/Stop VMs during off hours solution, you can:

- [Schedule VMs to start and stop](#schedule).
- Schedule VMs to start and stop in ascending order by [using Azure Tags](#tags) (not supported for classic VMs).
- Auto stop VMs based on [low CPU usage](#cpuutil).

This article describes how to successfully configure the solution to support these scenarios. You can also learn how to perform other common configuration settings for the solution, such as:

* [Configure email notifications](#configure-email-notifications)

* [Add a VM](#add-a-vm)

* [Exclude a VM](#exclude-a-vm)

* [Modify the startup and shutdown schedules](#modify-the-startup-and-shutdown-schedules)

## <a name="schedule"></a>Scenario 1: Start/Stop VMs on a schedule

This scenario is the default configuration when you first deploy the solution. For example, you can configure it to stop all VMs across a subscription when you leave work in the evening, and start them in the morning when you are back in the office. When you configure the schedules **Scheduled-StartVM** and **Scheduled-StopVM** during deployment, they start and stop targeted VMs. Configuring this solution to just stop VMs is supported, see [Modify the startup and shutdown schedules](#modify-the-startup-and-shutdown-schedules) to learn how to configure a custom schedule.

> [!NOTE]
> The time zone is your current time zone when you configure the schedule time parameter. However, it is stored in UTC format in Azure Automation. You do not have to do any time zone conversion as this is handled during the deployment.

You control which VMs are in scope by configuring the following variables: **External_Start_ResourceGroupNames**, **External_Stop_ResourceGroupNames**, and **External_ExcludeVMNames**.

You can enable either targeting the action against a subscription and resource group, or targeting a specific list of VMs, but not both.

### Target the start and stop actions against a subscription and resource group

1. Configure the **External_Stop_ResourceGroupNames** and **External_ExcludeVMNames** variables to specify the target VMs.

2. Enable and update the **Scheduled-StartVM** and **Scheduled-StopVM** schedules.

3. Run the **ScheduledStartStop_Parent** runbook with the ACTION parameter set to **start** and the WHATIF parameter set to **True** to preview your changes.

### Target the start and stop action by VM list

1. Run the **ScheduledStartStop_Parent** runbook with the ACTION parameter set to **start**, add a comma-separated list of VMs in the *VMList* parameter, and then set the WHATIF parameter to **True**. Preview your changes.

2. Configure the **External_ExcludeVMNames** parameter with a comma-separated list of VMs (VM1, VM2, VM3).

3. This scenario does not honor the **External_Start_ResourceGroupNames** and **External_Stop_ResourceGroupnames** variables. For this scenario, you need to create your own Automation schedule. For details, see [Scheduling a runbook in Azure Automation](../automation/automation-schedules.md).

    > [!NOTE]
    > The value for **Target ResourceGroup Names** is stored as the value for both **External_Start_ResourceGroupNames** and **External_Stop_ResourceGroupNames**. For further granularity, you can modify each of these variables to target different resource groups. For start action, use **External_Start_ResourceGroupNames**, and for stop action, use **External_Stop_ResourceGroupNames**. VMs are automatically added to the start and stop schedules.

## <a name="tags"></a>Scenario 2: Start/Stop VMS in sequence by using tags

In an environment that includes two or more components on multiple VMs supporting a distributed workload, supporting the sequence in which components are started and stopped in order is important. You can accomplish this scenario by performing the following steps:

### Target the start and stop actions against a subscription and resource group

1. Add a **sequencestart** and a **sequencestop** tag with a positive integer value to VMs that are targeted in **External_Start_ResourceGroupNames** and **External_Stop_ResourceGroupNames** variables. The start and stop actions are performed in ascending order. To learn how to tag a VM, see [Tag a Windows Virtual Machine in Azure](../virtual-machines/windows/tag.md) and [Tag a Linux Virtual Machine in Azure](../virtual-machines/linux/tag.md).

2. Modify the schedules **Sequenced-StartVM** and **Sequenced-StopVM** to the date and time that meet your requirements and enable the schedule.

3. Run the **SequencedStartStop_Parent** runbook with the ACTION parameter set to **start** and the WHATIF parameter set to **True** to preview your changes.

4. Preview the action and make any necessary changes before implementing against production VMs. When ready, manually execute the runbook with the parameter set to **False**, or let the Automation schedule **Sequenced-StartVM** and **Sequenced-StopVM** run automatically following your prescribed schedule.

### Target the start and stop action by VM list

1. Add a **sequencestart** and a **sequencestop** tag with a positive integer value to VMs you plan to add to the **VMList** parameter.

2. Run the **SequencedStartStop_Parent** runbook with the ACTION parameter set to **start**, add a comma-separated list of VMs in the *VMList* parameter, and then set the WHATIF parameter to **True**. Preview your changes.

3. Configure the **External_ExcludeVMNames** parameter with a comma-separated list of VMs (VM1, VM2, VM3).

4. This scenario does not honor the **External_Start_ResourceGroupNames** and **External_Stop_ResourceGroupnames** variables. For this scenario, you need to create your own Automation schedule. For details, see [Scheduling a runbook in Azure Automation](../automation/automation-schedules.md).

5. Preview the action and make any necessary changes before implementing against production VMs. When ready, manually execute the monitoring-and-diagnostics/monitoring-action-groupsrunbook with the parameter set to **False**, or let the Automation schedule **Sequenced-StartVM** and **Sequenced-StopVM** run automatically following your prescribed schedule.

## <a name="cpuutil"></a>Scenario 3: Start/Stop automatically based on CPU utilization

This solution can help manage the cost of running Azure Resource Manager and Classic virtual machines in your subscription by evaluating VMs that aren't used during non-peak periods, such as after hours, and automatically shutting them down if processor utilization is less than a specified percentage.

By default, the solution is pre-configured to evaluate the percentage CPU metric to see if average utilization is 5 percent or less. This scenario is controlled by the following variables and can be modified if the default values do not meet your requirements:

* **External_AutoStop_MetricName**

* **External_AutoStop_Threshold**

* **External_AutoStop_TimeAggregationOperator**

* **External_AutoStop_TimeWindow**

* **External_AutoStop_Frequency**

* **External_AutoStop_Severity**

You can enable and target the action against a subscription and resource group, or target a specific list of VMs.

When you run the **AutoStop_CreateAlert_Parent** runbook, it verifies that the targeted subscription, resource group(s) and VMs exist. If the VMs exist, it then calls the **AutoStop_CreateAlert_Child** runbook for each verified VM by the parent runbook. This child runbook performs the following:

* Creates a metric alert rule for each verified VM.

* Triggers the **AutoStop_VM_Child** runbook for a particular VM should the CPU drop below the configured threshold for the specified time interval. This runbook then attempts to stop the VM.

### To target the auto stop action against all VMs in a subscription

1. Ensure the **External_Stop_ResourceGroupNames** variable is empty or set to * (wildcard).

2. [Optional step] If you wish to exclude some VMs from the auto shutdown, you can add a comma separated list of VM names to the **External_ExcludeVMNames** variable.

3. Enable the **Schedule_AutoStop_CreateAlert_Parent** schedule to run to create the required Stop VM metric alert rules for all of the VMs in your subscription. Running this on a schedule will allow you to create new metric alert rules  as new VMs are added to the subscription.

### To target the auto stop action against all VMs in a resource group/multiple resource groups

1. Add a common separated list of resource group names to the **External_Stop_ResourceGroupNames** variable.

2. Optionally, if you want to exclude some of the VMs from the auto shutdown, you can add a comma separated list of VM names to the **External_ExcludeVMNames** variable.

3. Enable the **Schedule_AutoStop_CreateAlert_Parent** schedule to run to create the required **Stop VM metric** alert rules for all of the VMs in your resource groups. Running this on a schedule allows you to create new metric alert rules as new VMs are added to the resource group(s).

### To Target the auto stop action to a list of VMs

1. Create a new [Schedule](shared-resources/schedules.md#creating-a-schedule) and link it to the **AutoStop_CreateAlert_Parent** runbook, adding a comma separated list of VM names to the **VMList** parameter.

2. Optionally, if you want to exclude some VMs from the auto shutdown, you can add a comma separated list of VM names to the **External_ExcludeVMNames** variable.

## Configure email notifications

To change email notifications after the solution is deployed, modify action group that was created during deployment.  

> [!NOTE]
> Subscriptions in the Azure Government Cloud do not support the email functionality of this solution.

1. In the Azure portal, navigate to Monitor -> Action groups. Select the action group titled **StartStop_VM_Notication**.

    ![Automation Update Management solution page](media/automation-solution-vm-management/azure-monitor.png)

2. On the **StartStop_VM_Notification** page, click **Edit details** under **Details**. This opens the **Email/SMS/Push/Voice** page. Update the email address and click **OK** to save your changes.

    ![Automation Update Management solution page](media/automation-solution-vm-management/change-email.png)

    Alternatively you can add additional actions to the action group, to learn more about action groups, see [action groups](../azure-monitor/platform/action-groups.md)

The following is an example email that is sent when the solution shuts down virtual machines.

![Automation Update Management solution page](media/automation-solution-vm-management/email.png)

## <a name="add-exclude-vms"></a>Add/Exclude VMs

The solution provides the ability to add VMs to be targeted by the solution or specifically exclude machines from the solution.

### Add a VM

There are two options that you can use to make sure that a VM is included in the Start/Stop solution when it runs.

* Each of the parent [runbooks](automation-solution-vm-management.md#runbooks) of the solution has a **VMList** parameter. You can pass a comma-separated list of VM names to this parameter when scheduling the appropriate parent runbook for your situation and these VMs will be included when the solution runs.

* To select multiple VMs, set the **External_Start_ResourceGroupNames** and **External_Stop_ResourceGroupNames** with the resource group names that contain the VMs you want to start or stop. You can also set this value to `*`, to have the solution run against all resource groups in the subscription.

### Exclude a VM

To exclude a VM from the solution, you can add it to the **External_ExcludeVMNames** variable. This variable is a comma-separated list of specific VMs to exclude from the Start/Stop solution. This list is limited to 140 VMs. If you add more than 140 VMs to this comma-separated list, VMs that are set to be excluded may be inadvertently started or stopped.

## Modify the startup and shutdown schedules

Managing the startup and shutdown schedules in this solution follows the same steps as outlined in [Scheduling a runbook in Azure Automation](automation-schedules.md). There needs to be a separate schedule to start and to stop VMs.

Configuring the solution to just stop VMs at a certain time is supported. In this scenario you just create a **Stop** schedule and no corresponding **Start** scheduled. To do this, you need to:

1. Ensure you have added the resource groups for the VMs to shut down in the **External_Stop_ResourceGroupNames** variable.

2. Create your own schedule for the time you want to shut down the VMs.

3. Navigate to the **ScheduledStartStop_Parent** runbook and click **Schedule**. This allows you to select the schedule you created in the preceding step.

4. Select **Parameters and run settings** and set the **ACTION** parameter to **Stop**.

5. Select **OK** to save your changes.

## Next steps

* To learn how to troubleshoot Start/Stop VMs during off-hours, see [Troubleshooting Start/Stop VMs](troubleshoot/start-stop-vm.md).

* [Review](automation-solution-vm-management-logs.md) the Automation records written to Azure Monitor Logs and the example log search queries to analyze the status of Automation runbook jobs from Start/Stop VMs.
