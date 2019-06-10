---
title: Understand the health of your Azure virtual machines | Microsoft Docs
description: This article describes how to understand the health of virtual machines and underlying operating system with Azure Monitor for VMs.
services: azure-monitor
documentationcenter: ''
author: mgoedtel
manager: carmonm
editor: 
ms.assetid: 
ms.service: azure-monitor
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 05/22/2019
ms.author: magoedte
---

# Understand the health of your Azure virtual machines

Azure includes individual services for specific roles or tasks in the monitoring space. However, it doesn't provide in-depth health perspectives of operating systems hosted on Azure virtual machines (VMs). Although you can use Azure Monitor for different conditions, it's not designed to model and represent the health of core components, or the overall health of VMs.

The Azure Monitor for VM's health feature proactively monitors the availability and performance of the Windows or Linux guest OS. It uses a model that represents key components and their relationships, provides criteria that specifies how to measure component health, and alerts you when it detects an unhealthy condition.

The health of an Azure VM and the underlying operating system can be observed from two perspectives by using the Azure Monitor for VM's health feature. These perspectives are directly from a VM, or across all VMs in a resource group from Azure Monitor.

This article will help you understand how to quickly assess, investigate, and resolve health issues when they are detected by the Azure Monitor for VM's health feature.

For information about configuring Azure Monitor for VMs, see [Enable Azure Monitor for VMs](vminsights-enable-overview.md).

## Monitoring configuration details

This section outlines the default health criteria to monitor Azure Windows and Linux VMs. All health criteria are pre-configured to alert when an unhealthy condition is detected.

### Windows VMs

- Available megabytes of memory
- Average disk seconds per write (logical disk)
- Average disk seconds per write (disk)
- Average logical disk seconds per read
- Average logical disk seconds per transfer
- Average disk seconds per read
- Average disk seconds per transfer
- Current disk queue length (logical disk)
- Current disk queue length (disk)
- Disk percent idle time
- File system error or corruption
- Logical disk free space (%) low
- Logical disk free space (MB) low
- Logical disk percent idle time
- Memory pages per second
- Percent bandwidth used read
- Percent bandwidth used total
- Percent bandwidth used writes
- Percentage of committed memory in use
- Disk percent idle time
- DHCP client service health
- DNS client service health
- RPC service health
- Server service health
- Total CPU utilization percentage
- Windows event log service health
- Windows firewall service health
- Windows remote management service health

### Linux VMs
- Disk avg. disk sec/transfer
- Disk avg. disk sec/read
- Disk avg. disk sec/write
- Disk health
- Logical disk free space
- Logical disk % free space
- Logical disk % free inodes
- Network adapter health
- Total percent processor time
- Operating system available megabytes of memory

## Sign in to the Azure portal

To sign in, go to the [Azure portal](https://portal.azure.com).

## Introduction to Azure Monitor for VM's health feature

Before you use the health feature for a single VM or group of VMs, it's important to understand how the information is presented and what the visualizations represent.

### View health directly from a VM

To view the health of an Azure VM, select **Insights (preview)** from the left pane of the VM. In the VM insights page, the **Health** tab is open by default and shows the health view of the VM.

![Azure Monitor for VM's health overview of a selected Azure virtual machine](./media/vminsights-health/vminsights-directvm-health.png)

In the **Health** tab under **Guest VM health**, the table shows the health state of your VM and the total number of VM health alerts raised by an unhealthy component.

For more information, see [Alerts](#alerts).

The health states defined for a VM are described in the following table:

|Icon |Health state |Meaning |
|-----|-------------|---------------|
| |Healthy |The VM is within the defined health conditions. This state indicates there are no issues detected and the VM is functioning normally. With a parent rollup monitor, health rolls up and reflects the best-case or worst-case state of the child.|
| |Critical |The state is not within the defined health condition, indicating that one or more critical issues were detected. These issues to be addressed in order to restore normal functionality. With a parent rollup monitor, the health state rolls up and reflects the best-case or worst-case state of the child.|
| |Warning |The state is between two thresholds for the defined health condition, where one indicates a warning state and the other indicates a critical state (three health state thresholds can be configured), or when a non-critical issue is detected that can cause critical problems if it's not resolved. With a parent rollup monitor, if one or more of the children is in a warning state, then the parent will reflect a warning state. If there's a child in a critical state and another child in a warning state, the parent rollup will show the health state as critical.|
| |Unknown |The state can't be computed for several reasons. See the following section for additional details and possible solutions. |

An Unknown health state can be caused by the following issues:

- The agent has been reconfigured and no longer reports to the workspace specified when Azure Monitor for VMs was enabled. To configure the agent to report to the workspace see, [adding or removing a workspace](../platform/agent-manage.md#adding-or-removing-a-workspace).
- The VM has been deleted.
- The workspace associated with Azure Monitor for VMs was deleted. You can recover the workspace if you have Premier support benefits. Go to [Premier](https://premier.microsoft.com/) and open a support request.
- The solution dependencies were deleted. To re-enable the ServiceMap and InfrastructureInsights in your Log Analytics workspace, reinstall these solutions by using the [Azure Resource Manager template](vminsights-enable-at-scale-powershell.md#install-the-servicemap-and-infrastructureinsights-solutions). Or, use the Configure Workspace option found in the Get Started tab.
- The VM was shut down.
- The Azure VM service is unavailable, or maintenance is being performed.
- The workspace [daily data or retention limit](../platform/manage-cost-storage.md) was met.

Select **View health diagnostics** to open a page showing all the components of the VM, associated health criteria, state changes, and other significant issues encountered by monitoring components related to the VM.

For more information, see [Health diagnostics](#health-diagnostics).

In the **Component health** section, the table shows a health rollup status of the primary performance categories monitored by health criteria for those areas, specifically **CPU**, **Memory**, **Disk**, and **Network**. Selecting any one of the components opens a page that lists all of the health criterion monitoring and the respective health state of that component.

When accessing Health from an Azure VM running the Windows operating system, the health state of the top five core Windows services is shown under **Core services health**. Selecting any one of the services opens a page listing the health criteria monitoring that component and its health state. Selecting the name of the health criteria opens the property pane. In this pane, you can review the configuration details, including if the health criteria has a corresponding Azure Monitor alert.

For more information, see [Health Diagnostics and working with health criteria](#health-diagnostics).

### Aggregate VM perspective

To view the health collection for all your VMs in a resource group, select **Azure Monitor** from the navigation list in the portal, and then select **Virtual Machines (preview)**.

![VM Insights monitoring view from Azure Monitor](./media/vminsights-health/vminsights-aggregate-health.png)

In the **Subscription** and **Resource Group** drop-down lists, select the appropriate resource group that includes the VMs related to the group, to view their reported health state. Your selection only applies to the health feature and does not carry over to Performance or Map.

The **Health** tab provides the following information:

* How many VMs are in a critical or unhealthy state, versus how many are healthy or not submitting data (referred to as an unknown state).
* Which and how many VMs by operating system (OS) are reporting an unhealthy state.
* How many VMs are unhealthy because of an issue detected with a processor, disk, memory, or network adapter, categorized by health state.
* How many VMs are unhealthy because of an issue detected with a core operating system service, categorized by health state.

In the Health tab, you can identify the critical issues detected by the health criteria monitoring the VM, and review alert details and associated knowledge articles. These articles can assist in the diagnosis and remediation of the issues. Select any of the severities to open the [All Alerts](../../azure-monitor/platform/alerts-overview.md#all-alerts-page) page filtered by that severity.

The **VM distribution by operating system** list shows VMs listed by Windows edition or Linux distribution, along with their version. In each operating system category, the VMs are broken down further based on the health of the VM.

![VM Insights virtual machine distribution perspective](./media/vminsights-health/vminsights-vmdistribution-by-os.png)

Select any column including **VM count**, **Critical**, **Warning**, **Healthy**, and **Unknown** to see a list of filtered results in the Virtual Machines page that match the column selected. For example, to review all VMs running Red Hat Enterprise Linux release 7.5, select the **VM count** value for that OS, and it will list the VMs matching that filter and their current health state.

![Example rollup of Red Hat Linux VMs](./media/vminsights-health/vminsights-rollup-vm-rehl-01.png)

In the **Virtual Machines** page, if you select the name of a VM under the column **VM Name**, you're directed to the VM instance page. This page provides more details of the alerts and health criteria issues that are affecting the selected VM. From here, you can filter the health state details by selecting **Health State** icon in the upper leftmost corner of the page to see which components are unhealthy, or you can view VM Health alerts raised by an unhealthy component categorized by alert severity.

From the VM list view, selecting the name of a VM opens the **Health** page for that selected VM, similarly as if you selected **Insights (preview)** from the VM directly.

![VM insights of a selected Azure virtual machine](./media/vminsights-health/vminsights-directvm-health.png)

The **Insights (preview)** page shows a rollup health status for the VM and alerts, categorized by severity, which represents VM Health alerts raised when the health state changes from healthy to unhealthy based on criteria. Selecting **VMs in critical condition** opens a page with a list of one or more VMs that are in a critical health state.

Selecting the health status for one of the VMs in the list shows the **Health Diagnostics** view of the VM. In this view, you can find out which health criteria is reflecting a health state issue. When the **Health Diagnostics** page opens, it shows all the components of the VM and their associated health criteria with current health state.

For more information, see [Health Diagnostics](#health-diagnostics).

Selecting **View all health criteria** opens a page showing a list of all the health criteria available with this feature. The information can be further filtered based on the following options:

* **Type**. There are three types of health criteria to assess conditions and roll up the overall health state of a monitored VM:
    - **Unit**. Measures some aspect of a VM. This health criteria type might be checking a performance counter to determine the performance of the component, running a script to perform a synthetic transaction, or watching for an event that indicates an error. The filter is set to unit by default.
    - **Dependency**. Provides a health rollup between different entities. This health criteria allows the health of an entity to depend on the health of another type of entity that it relies on for successful operation.
    - **Aggregate** Provides a combined health state of similar health criteria. Unit and dependency health criterion are typically configured under an aggregate health criterion. In addition to providing better general organization of the many different health criteria targeted at an entity, aggregate health criterion provides a unique health state for distinct categories of the entities.

* **Category**. The type of health criteria used to group similar criteria for reporting purposes. These criteria are either **Availability** or **Performance**.

To see which instances are unhealthy, select a value under the **Unhealthy Component** column. In this page, a table lists the components that are in a critical health state.

## Health diagnostics

The **Health Diagnostics** page allows you to visualize the Health Model of a VM, listing all the components of the VM, associated health criteria, state changes, and other significant issues identified by monitored components related to the VM.

![Example of Health Diagnostics page for a VM](./media/vminsights-health/health-diagnostics-page-01.png)

You can start Health Diagnostics by using the following methods:

* By rollup health-state for all VMs from the aggregate VM perspective in Azure Monitor:

    1. On the **health** page, select the icon for **Critical**, **Warning**, **Healthy**, or **Unknown** health state under the section **Guest VM health**. 
    2. Go to the page that lists all the VMs matching that filtered category. 
    3. Select the value in the **Health State** column to open health diagnostics scoped to that particular VM.

* By operating system from the aggregate VM perspective in Azure Monitor. Under **VM distribution**, selecting any one of the column values will open the **Virtual Machines** page and return a list in the table matching the filtered category. Selecting the value under **Health State** column opens Health Diagnostics for the selected VM.
 
* From the guest VM in the Azure Monitor for VMs **Health** tab, by selecting **View health diagnostics**.

Health Diagnostics organizes health information into two categories: **Availability** and **Performance**.
 
All health criteria defined for a specific component such as logical disk, CPU, and so on, can be viewed without filtering on the two categories (in an all-up view of all criteria), or filter the results by either category when selecting **Availability** or **Performance**. Also, the category of the criteria can be seen next to it in the **Health Criteria** column. If the criteria doesn't match the selected category, it will show the message **No health criteria available for the selected category** in the **Health Criteria** column.

State of a health criteria is defined by one of the four states: **Critical**, **Warning**, **Healthy**, and **Unknown**. The first three states are configurable, meaning you can modify the threshold values of the monitors directly from the Health Criteria configuration pane, or by using the Azure Monitor REST API [update monitor operation](https://docs.microsoft.com/rest/api/monitor/microsoft.workloadmonitor/monitors/update). **Unknown** is not configurable and reserved for specific scenarios.

The Health Diagnostics page has three main sections:

* Component Model
* Health Criteria
* State Changes

![Sections of Health Diagnostics page](./media/vminsights-health/health-diagnostics-page-02.png)

### Component model

The leftmost column in the Health Diagnostics page is the component model. All of the components, which are associated with the VM, are displayed in this column along with their current health state.

In the following example, the discovered components are **Disk**, **Logical Disk**, **Processor**, **Memory**, and **Operating System**. Multiple instances of these components are discovered and displayed in this column. For example, the image below shows the VM has two instances of logical disks, **C:** and **D:**, which are in a healthy state.

![Example component model presented in Health diagnostics](./media/vminsights-health/health-diagnostics-page-component.png)

### Health criteria

The center column in the Health Diagnostics page is the **Health Criteria** column. The health model defined for the VM is displayed in a hierarchical tree. The health model for a VM consists of unit and aggregate health criteria.

![Example health criteria presented in Health diagnostics](./media/vminsights-health/health-diagnostics-page-healthcriteria.png)

A health criterion measures the health of a monitored instance, which could be a threshold value, state of an entity, and so on. A health criterion has either two or three configurable health state thresholds as described earlier. At any given point, the health criterion can be in only one of its potential states.

The health model defines criteria that determine the health of the overall target and components of the target. The hierarchy of criteria is illustrated in the **Health Criteria** section of the Health Diagnostics page.

The health rollup policy is part of the configuration of the aggregate health criteria (default is set to **Worst-of**). You can find a list of default set of health criteria running as part of this feature under the section [Monitoring configuration details](#monitoring-configuration-details). You can also use the Azure Monitor REST API [monitor instances - list by resource operation](https://docs.microsoft.com/rest/api/monitor/microsoft.workloadmonitor/monitorinstances/listbyresource) for a list of all the health criteria and configuration details running against the Azure VM resource.

**Unit** health criteria type can have their configuration modified by selecting the ellipses link to the rightmost and then selecting **Show Details** to open the configuration pane.

![Configuring a health criteria example](./media/vminsights-health/health-diagnostics-vm-example-02.png)

In the configuration pane for the selected health criteria, by using the example **Average Disk Seconds Per Write**, the threshold can be configured with a different numeric value. It is a two-state monitor, meaning it only changes from healthy to warning. Other health criterion can be three states, where you can configure the value for the warning and critical health state threshold. You can also modify the threshold using the Azure Monitor REST API [update monitor operation](https://docs.microsoft.com/rest/api/monitor/microsoft.workloadmonitor/monitors/update).

>[!NOTE]
>Applying health criteria configuration changes to one instance applies them to all monitored instances. For example, if you select **Disk -1 D:** and modify the **Average Disk Seconds Per Write** threshold, it doesn't apply only to that instance, but all other disk instances discovered and monitored on the VM.


![Configuring a health criteria of a unit monitor example](./media/vminsights-health/health-diagnostics-criteria-config-01.png)

To learn more about the health indicator, knowledge articles are included to help you identify problems, causes, and resolutions, select **View information** on the page to open a new tab showing the specific knowledge article.

To review all of the health criterion knowledge articles included with Azure Monitor for VMs Health feature, see [Azure Monitor health knowledge documentation](https://docs.microsoft.com/azure/monitoring/infrastructure-health/).

### State changes

The rightmost column in the Health Diagnostics page is **State Changes**. It lists all the state changes associated with the health criteria that is selected in the **Health Criteria** section or the state change of the VM if a VM was selected from the **Component Model** or **Health Criteria** column of the table.

![Example state changes presented in Health diagnostics](./media/vminsights-health/health-diagnostics-page-statechanges.png)

This section consists of the health criteria state and the associated time sorted by the latest state on top.

### Association of Component Model, Health Criteria, and State change columns

The three columns are interlinked with each other. When you select a discovered instance in the **Component Model** section, the **Health Criteria** section is filtered to that component view and correspondingly the **State Change** section is updated based on the selected health criteria.

![Example of selecting monitored instance and results](./media/vminsights-health/health-diagnostics-vm-example-01.png)

In the previous example, when you select **Disk - 1 D:**, the Health Criteria tree is filtered to **Disk - 1D:**. The **State Change** column shows the state change based on the availability of **Disk - 1 D:**.

To see an updated health state, you can refresh the Health Diagnostics page by selecting the **Refresh** link. If there is an update to the health criterion's health state based on the pre-defined polling interval, this task allows you to avoid waiting and reflects the latest health state. The **Health Criteria State** is a filter allowing you to scope the results based on the selected health state - Healthy, Warning, Critical, Unknown, and All. The **Last Updated** time in the upper-right corner represents the last time the Health Diagnostics page was refreshed.

## Alerts

Azure Monitor for VMs Health feature integrates with [Azure Alerts](../../azure-monitor/platform/alerts-overview.md) and raises an alert when the predefined health criteria change from healthy to an unhealthy state when the condition is detected. Alerts are categorized by severity, from Sev 0 through Sev 4, with Sev 0 representing the highest severity level.

Alerts are not associated with an action group to notify you when the alert has been triggered. The subscription owner needs to configure notifications following the steps in the [Configure alerts](#configure-alerts) section.

The total number of VM Health alerts categorized by severity is available on the **Health** dashboard under the section **Alerts**. When you select either the total number of alerts or the number corresponding to a severity level, the **Alerts** page opens and lists all alerts matching your selection.

For example, if you select the row corresponding to **Sev level 1**, you'll see the following view:

![Example of all Severity Level 1 alerts](./media/vminsights-health/vminsights-sev1-alerts-01.png)

On the **Alerts** page, it is not only scoped to show alerts matching your selection, but are also filtered by **Resource type** to only show health alerts raised by the VM resource. It is reflected in the list of alerts, under the column **Target Resource**, where it shows the Azure VM the alert was raised for when the particular health criteria's unhealthy condition was met.

Alerts from other resource types or services are not intended to be included in this view, such as log alerts based on log queries or metric alerts that you would normally view from the default Azure Monitor [All Alerts](../../azure-monitor/platform/alerts-overview.md#all-alerts-page) page.

You can filter this view by selecting values in the dropdown menus at the top of the page.

|Column |Description |
|-------|------------|
|Subscription |Select an Azure subscription. Only alerts in the selected subscription are included in the view. |
|Resource Group |Select a single resource group. Only alerts with targets in the selected resource group are included in the view. |
|Resource type |Select one or more resource types. By default, only alerts of target **Virtual machines** is selected and included in this view. This column is only available after a resource group has been specified. | 
|Resource |Select a resource. Only alerts with that resource as a target are included in the view. This column is only available after a resource type has been specified. | 
|Severity |elect an alert severity, or select **All** to include alerts of all severities. | 
|Monitor Condition |Select a monitor condition to filter alerts if they have been fired or resolved by the system if the condition is no longer active. Or, select **All** to include alerts of all conditions. |
|Alert state |Select an alert state, **New**, **Acknowledge**, **Closed**, or **All** to include alerts of all states. |
|Monitor service |Select a service, or select **All** to include all services. Only alerts from VM Insights are supported for this feature.|
|Time range| Only alerts fired within the selected time window are included in the view. Supported values are the past hour, the past 24 hours, the past 7 days, and the past 30 days. | 

The **Alert detail** page is displayed when you select an alert, providing details of the alert and allowing you to change its state. To learn more about managing alerts, see [Create, view, and manage alerts using Azure Monitor](../../azure-monitor/platform/alerts-metric.md).

>[!NOTE]
>Creating new alerts based on health criteria or modify existing health alert rules in Azure Monitor from the portal is not currently supported.
>

![Alert details pane for a selected alert](./media/vminsights-health/alert-details-pane-01.png)

Alert state can also be changed for one or multiple alerts by selecting them and then selecting **Change state** from the **All Alerts** page, on the upper left-hand corner. On the **Change alert state** pane you select one of the states, add a description of the change in the **Comment** field, and then click **Ok** to commit your changes. When the information is verified and the changes are applied, you can track its progress under **Notifications** from the menu.

### Configure alerts
Certain alert management tasks cannot be managed from the Azure portal and have to be performed by using the [Azure Monitor REST API](https://docs.microsoft.com/rest/api/monitor/microsoft.workloadmonitor/components). Specifically:

- Enabling or disabling an alert for health criteria 
- Set up notifications for health criteria alerts 

The approach used in each example is using [ARMClient](https://github.com/projectkudu/armclient) on your Windows machine. If you are not familiar with this method, see [Using ARMClient](../platform/rest-api-walkthrough.md#use-armclient).

#### Enable or disable alert rule

To enable or disable an alert for a specific health criteria, the health criteria property *alertGeneration* needs to be modified with a value of either **Disabled** or **Enabled**. To identify the *monitorId* of a particular health criteria, the following example will show how to query for that value for the criteria **LogicalDisk\Avg Disk Seconds Per Transfer**.

1. In a terminal window, type **armclient.exe login**. Doing so prompts you to sign in to Azure.

2. Type the following command to retrieve all the health criterion active on a specific VM and identify the value for *monitorId* property. 

    ```
    armclient GET "subscriptions/subscriptionId/resourceGroups/resourcegroupName/providers/Microsoft.Compute/virtualMachines/vmName/providers/Microsoft.WorkloadMonitor/monitors?api-version=2018-08-31-preview”
    ```

    The following example shows the output of that command. Take note of the value of *MonitorId*. This value is required for the next step where we need to specify the ID of the health criteria and modify its property to create an alert.

    ```
    "id": "/subscriptions/a7f23fdb-e626-4f95-89aa-3a360a90861e/resourcegroups/Lab/providers/Microsoft.Compute/virtualMachines/SVR01/providers/Microsoft.WorkloadMonitor/monitors/ComponentTypeId='LogicalDisk',MonitorId='Microsoft_LogicalDisk_AvgDiskSecPerRead'",
      "name": "ComponentTypeId='LogicalDisk',MonitorId='Microsoft_LogicalDisk_AvgDiskSecPerRead'",
      "type": "Microsoft.WorkloadMonitor/virtualMachines/monitors"
    },
    {
      "properties": {
        "description": "Monitor the performance counter LogicalDisk\\Avg Disk Sec Per Transfer",
        "monitorId": "Microsoft_LogicalDisk_AvgDiskSecPerTransfer",
        "monitorName": "Microsoft.LogicalDisk.AvgDiskSecPerTransfer",
        "monitorDisplayName": "Average Logical Disk Seconds Per Transfer",
        "parentMonitorName": null,
        "parentMonitorDisplayName": null,
        "monitorType": "Unit",
        "monitorCategory": "PerformanceHealth",
        "componentTypeId": "LogicalDisk",
        "componentTypeName": "LogicalDisk",
        "componentTypeDisplayName": "Logical Disk",
        "monitorState": "Enabled",
        "criteria": [
          {
            "healthState": "Warning",
            "comparisonOperator": "GreaterThan",
            "threshold": 0.1
          }
        ],
        "alertGeneration": "Enabled",
        "frequency": 1,
        "lookbackDuration": 17,
        "documentationURL": "https://aka.ms/Ahcs1r",
        "configurable": true,
        "signalType": "Metrics",
        "signalName": "VMHealth_Avg. Logical Disk sec/Transfer"
      },
      "etag": null,
    ```

3. Type the following command to modify the *alertGeneration* property.

    ```
    armclient patch subscriptions/subscriptionId/resourceGroups/resourcegroupName/providers/Microsoft.Compute/virtualMachines/vmName/providers/Microsoft.WorkloadMonitor/monitors/Microsoft_LogicalDisk_AvgDiskSecPerTransfer?api-version=2018-08-31-preview "{'properties':{'alertGeneration':'Disabled'}}"
    ```   

4. Type the GET command used in step 2 to verify the value of the property is set to **Disabled**.

#### Associate Action group with health criteria

Azure Monitor for VMs Health supports SMS and email notifications when alerts are generated when health criteria becomes unhealthy. To configure notifications, you need to note the name of the Action group that is configured to send SMS or email notifications. 

>[!NOTE]
>This action needs to be performed against each VM monitored that you want to receive a notification for, it does not apply to all VMs in the resource group.

1. In a terminal window, type **armclient.exe login**. Doing so prompts you to sign in to Azure.

2. Type the following command to associate an Action group with alert rules.
 
    ```
    $payload = "{'properties':{'ActionGroupResourceIds':['/subscriptions/subscriptionId/resourceGroups/resourcegroupName/providers/microsoft.insights/actionGroups/actiongroupName']}}" 
    armclient PUT https://management.azure.com/subscriptions/subscriptionId/resourceGroups/resourcegroupName/providers/Microsoft.Compute/virtualMachines/vmName/providers/Microsoft.WorkloadMonitor/notificationSettings/default?api-version=2018-08-31-preview $payload
    ```

3. To verify the value of the property **actionGroupResourceIds** was successfully updated, type the following command.

    ```
    armclient GET "subscriptions/subscriptionName/resourceGroups/resourcegroupName/providers/Microsoft.Compute/virtualMachines/vmName/providers/Microsoft.WorkloadMonitor/notificationSettings?api-version=2018-08-31-preview"
    ```

    The output should resemble the following criteria:
    
    ```
    {
	  "value": [
		{
		  "properties": {
			"actionGroupResourceIds": [
			  "/subscriptions/a7f23fdb-e626-4f95-89aa-3a360a90861e/resourceGroups/Lab/providers/microsoft.insights/actionGroups/Lab-IT%20Ops%20Notify"
			]
		  },
		  "etag": null,
		  "id": "/subscriptions/a7f23fdb-e626-4f95-89aa-3a360a90861e/resourcegroups/Lab/providers/Microsoft.Compute/virtualMachines/SVR01/providers/Microsoft.WorkloadMonitor/notificationSettings/default",
		  "name": "notificationSettings/default",
		  "type": "Microsoft.WorkloadMonitor/virtualMachines/notificationSettings"
		}
	  ],
	  "nextLink": null
    }
    ```

## Next steps

To identify limitations and overall VM performance, see [View Azure VM Performance](vminsights-performance.md). To learn about discovered application dependencies, see [View Azure Monitor for VMs Map](vminsights-maps.md).
