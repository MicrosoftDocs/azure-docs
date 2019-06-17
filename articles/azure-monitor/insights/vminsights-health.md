---
title: Monitor virtual machine health with Azure Monitor for VMs (preview)| Microsoft Docs
description: This article describes how you understand the health of the virtual machine and underlying operating system with Azure Monitor for VMs.
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

Azure includes multiple services that individually perform a specific role or task in the monitoring space, but haven't provided an in-depth health perspective of the operating system hosted on Azure virtual machines. While you could monitor for different conditions using Azure Monitor, it wasn't designed to model and represent health of core components or overall health of the virtual machine. With Azure Monitor for VMs health feature, it proactively monitors the availability and performance of the Windows or Linux guest OS with a model that represent key components and their relationships, criteria that specifies how to measure the health of those components, and alert you when an unhealthy condition is detected.  

Viewing the overall health state of the Azure VM and underlying operating system can be observed from two perspectives with Azure Monitor for VMs health, directly from the virtual machine or across all VMs in a resource group from Azure Monitor.

This article will help you understand how to quickly assess, investigate, and resolve health issues detected.

For information about configuring Azure Monitor for VMs, see [Enable Azure Monitor for VMs](vminsights-enable-overview.md).

## Monitoring configuration details

This section outlines the default health criteria defined to monitor Azure Windows and Linux virtual machines. All health criteria are pre-configured to alert when the unhealthy condition is met. 

### Windows VMs

- Available Megabytes of Memory 
- Average Disk Seconds Per Write (Logical Disk)
- Average Disk Seconds Per Write (Disk)
- Average Logical Disk Seconds Per Read
- Average Logical Disk Seconds Per Transfer
- Average Disk Seconds Per Read
- Average Disk Seconds Per Transfer
- Current Disk Queue Length (Logical Disk)
- Current Disk Queue Length (Disk)
- Disk Percent Idle Time
- File system error or corruption
- Logical Disk Free Space (%) Low
- Logical Disk Free Space (MB) Low
- Logical Disk Percent Idle Time
- Memory Pages Per Second
- Percent Bandwidth Used Read
- Percent Bandwidth Used Total
- Percent Bandwidth Used Write
- Percentage of Committed Memory in Use
- Disk Percent Idle Time
- DHCP Client Service Health
- DNS Client Service Health
- RPC Service Health
- Server Service Health
- Total CPU Utilization Percentage
- Windows Event Log Service Health
- Windows Firewall Service Health
- Windows Remote Management Service Health

### Linux VMs
- Disk Avg. Disk sec/Transfer 
- Disk Avg. Disk sec/Read 
- Disk Avg. Disk sec/Write 
- Disk Health
- Logical Disk Free Space
- Logical Disk % Free Space
- Logical Disk % Free Inodes
- Network Adapter Health
- Total Percent Processor Time
- Operating System Available Megabytes of Memory

## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com). 

## Introduction to Health experience

Before diving into using the Health feature for a single virtual machine or group of VMs, it's important we provide a brief introduction so you understand how the information is presented and what the visualizations represent.  

### View health directly from a virtual machine 

To view the health of an Azure VM, select **Insights (preview)** from the left-hand pane of the virtual machine. On the VM insights page, **Health** is open by default and shows the health view of the VM.  

![Azure Monitor for VMs health overview of a selected Azure virtual machine](./media/vminsights-health/vminsights-directvm-health.png)

On the **Health** tab, under the section **Guest VM health**, the table shows the current health state of your virtual machine and the total number of VM Health alerts raised by an unhealthy component. For more information, see [Alerts](#alerts) for additional details about the alerting experience.  

The health states defined for a VM are described in the following table: 

|Icon |Health state |Meaning |
|-----|-------------|---------------|
| |Healthy |Health state is healthy if it is within the defined health conditions, indicating no issues detected for the VM and it is functioning as required. With a parent rollup monitor, health rolls-up and it reflects the best-case or worst-case state of the child.|
| |Critical |Health state is critical if it is not within the defined health condition, indicating that one or more critical issues were detected, which need to be addressed in order to restore normal functionality. With a parent rollup monitor, health rolls-up and it reflects the best-case or worst-case state of the child.|
| |Warning |Health state is warning if it is between two thresholds for the defined health condition, where one indicates a *Warning* state and the other indicates a *Critical* state (three health state thresholds can be configured), or when a non-critical issue is detected which may cause critical problems if not resolved. With a parent rollup monitor, if one or more of the children is in a warning state, then the parent will reflect *warning* state. If there is a child that is in a *Critical* and another child in a *Warning* state, the parent rollup will show a health state of *Critical*.|
| |Unknown |Health state is *Unknown* when it cannot be computed for several reasons. See the following footnote <sup>1</sup> for additional details and possible solutions to solve them. |

<sup>1</sup>
The Unknown health state is caused by the following issues:

- Agent has been reconfigured and no longer reports to the workspace specified when Azure Monitor for VMs was enabled. To configure the agent to report to the workspace see, [adding or removing a workspace](../platform/agent-manage.md#adding-or-removing-a-workspace).
- VM has been deleted.
- Workspace associated with Azure Monitor for VMs is deleted. To recover the workspace, if you have Premier support benefits you can open a support request with [Premier](https://premier.microsoft.com/).
- Solution dependencies have been deleted. To reenable the ServiceMap and InfrastructureInsights solutions in your Log Analytics workspace, you can reinstall using an [Azure Resource Manager template](vminsights-enable-at-scale-powershell.md#install-the-servicemap-and-infrastructureinsights-solutions) that's provided or by using the Configure Workspace option found on the Get Started tab.
- VM has been shutdown.
- Azure VM service is unavailable or maintenance is being performed.
- Workspace [daily data or retention limit](../platform/manage-cost-storage.md) is met.

Selecting **View health diagnostics** opens a page showing all the components of the VM, associated health criteria, state changes, and other significant issues encountered by monitoring components related to the VM. For more information, see [Health diagnostics](#health-diagnostics). 

Under the **Component health** section, the table shows a health rollup status of the primary performance categories monitored by health criteria for those areas, specifically **CPU**, **Memory**, **Disk**, and **Network**.  Selecting any one of the components opens a page listing all of the individual health criterion monitoring aspects of that component and the respective health state of each.  

When accessing Health from an Azure VM running the Windows operating system, the health state of the top five core Windows services are shown under the section **Core services health**.  Selecting any one of the services opens a page listing the health criteria monitoring that component and its health state.  Clicking on the name of the health criteria will open the property pane, and from here you can review the configuration details, including if the health criteria has a corresponding Azure Monitor alert defined. To learn more, see [Health Diagnostics and working with health criteria](#health-diagnostics).  

### Aggregate virtual machine perspective

To view health collection for all of your virtual machines in a resource group, from the navigation list in the portal, select **Azure Monitor** and then select **Virtual Machines (preview)**.  

![VM Insights monitoring view from Azure Monitor](./media/vminsights-health/vminsights-aggregate-health.png)

From the **Subscription** and **Resource Group** drop-down lists, select the appropriate resource group that includes the VMs related to the group, in order to view their reported health state.  Your selection only applies to the Health feature and does not carry over to Performance or Map.

On the **Health** tab, you are able to learn the following:

* How many VMs are in a critical or unhealthy state, versus how many are healthy or not submitting data (referred to as an unknown state)?
* Which VMs by operating system (OS) are reporting an unhealthy state and how many?
* How many VMs are unhealthy because of an issue detected with a processor, disk, memory, or network adapter, categorized by health state?  
* How many VMs are unhealthy because of an issue detected with a core operating system service, categorized by health state?

Here you can quickly identify the top critical issues detected by the health criteria  proactively monitoring the VM, and review VM Health alert details and associated knowledge article intended to assist in the diagnosis and remediation of the issue.  Select any of the severities to open the [All Alerts](../../azure-monitor/platform/alerts-overview.md#all-alerts-page) page filtered by that severity.

The **VM distribution by operating system** list shows VMs listed by Windows edition or Linux distribution, along with their version. In each operating system category, the VMs are broken down further based on the health of the VM. 

![VM Insights virtual machine distribution perspective](./media/vminsights-health/vminsights-vmdistribution-by-os.png)

You can click on any column item - **VM count**, **Critical**, **Warning**, **Healthy** or **Unknown** to drill-down into the **Virtual Machines** page see a list of filtered results matching the column selected. For example, if we want to review all VMs running **Red Hat Enterprise Linux release 7.5**, click on the **VM count** value for that OS and it will open the following page, listing the virtual machines matching that filter and their currently known health state.  

![Example rollup of Red Hat Linux VMs](./media/vminsights-health/vminsights-rollup-vm-rehl-01.png)
 
On the **Virtual Machines** page, if you select the name of a VM under the column **VM Name**, you are directed to the VM instance page with more details of the alerts and health criteria issues identified that are affecting the selected VM.  From here, you can filter the health state details by clicking on **Health State** icon in the upper left-hand corner of the page to see which components are unhealthy or you can view VM Health alerts raised by an unhealthy component categorized by alert severity.    

From the VM list view, clicking on the name of a VM opens the **Health** page for that selected VM, similarly as if you selected **Insights (preview)** from the VM directly.

![VM insights of a selected Azure virtual machine](./media/vminsights-health/vminsights-directvm-health.png)

Here it shows a rollup **Health Status** for the virtual machine and **Alerts**, categorized by severity, which represent VM Health alerts raised when the health state changes from health to unhealthy for a health criteria.  Selecting **VMs in critical condition** will open a page with a list of one or more VMs that are in a critical health state.  Clicking on the health status for one of the VMs in the list will show the **Health Diagnostics** view of the VM.  Here you can find out which health criteria is reflecting a health state issue. When the **Health Diagnostics** page opens, it shows all the components of the VM and their associated health criteria with current health state. For more information, see [Health Diagnostic](#health-diagnostics).  

Selecting **View all health criteria** opens a page showing a list of all the health criteria available with this feature.  The information can be further filtered based on the following options:

* **Type** – There are three kinds of health criteria types to assess conditions and roll up overall health state of the monitored VM.  
    a. **Unit** – Measures some aspect of the virtual machine. This health criteria type might be checking a performance counter to determine the performance of the component, running a script to perform a synthetic transaction, or watch for an event that indicates an error.  By default the filter is set to unit.  
    b. **Dependency** - Provides health rollup between different entities. This health criteria allows the health of an entity to depend on the health of another kind of entity that it relies on for successful operation.  
    c. **Aggregate** -  Provides a combined health state of similar health criteria. Unit and dependency health criterion will typically be configured under an aggregate health criterion. In addition to providing better general organization of the many different health criteria targeted at an entity, aggregate health criterion provides a unique health state for distinct categories of the entities.

* **Category** - Type of health criteria used to group criteria of similar type for reporting purposes.  They are either **Availability** or **Performance**.

You can drill further down to see which instances are unhealthy by clicking on a value under the **Unhealthy Component** column.  On the page, a table lists the components, which are in a critical health state.    

## Health diagnostics

The **Health Diagnostics** page allows you to visualize the Health Model of a VM, listing all the components of the VM, associated health criteria, state changes, and other significant issues identified by monitored components related to the VM.

![Example of Health Diagnostics page for a VM](./media/vminsights-health/health-diagnostics-page-01.png)

You can launch Health Diagnostics in the following ways.

* By rollup health state for all VMs from the aggregate VM perspective in Azure Monitor.  On the **health** page, click on the icon for **Critical**, **Warning**, **Healthy**, or **Unknown** health state under the section **Guest VM health** and drill down to the page that lists all the VMs matching that filtered category.  Clicking on the value in the **Health State** column will open Health Diagnostics scoped to that particular VM.      

* By operating system from the aggregate VM perspective in Azure Monitor. Under **VM distribution**, selecting any one of the column values will open the **Virtual Machines** page and return a list in the table matching the filtered category.  Clicking on the value under **Health State** column opens Health Diagnostics for the selected VM.    
 
* From the guest VM on the Azure Monitor for VMs **Health** tab, by selecting **View health diagnostics** 

Health Diagnostics organizes health information into the following categories: 

* Availability
* Performance
 
All health criteria defined for a specific component such as logical disk, CPU, etc. can be viewed without filtering on the two categories (that is an all-up view of all criteria), or filter the results by either category when selecting **Availability** or **Performance** options on the page. Additionally, the category of the criteria can be seen next to it in the **Health Criteria** column. If the criteria doesn't match the selected category, it will show the message **No health criteria available for the selected category** in the **Health Criteria** column.  

State of a health criteria is defined by one of the four states – *Critical*, *Warning*, *Healthy*, and *Unknown*. The first three are configurable, meaning you can modify the threshold values of the monitors directly from the Health Criteria configuration pane or using the Azure Monitor REST API [update monitor operation](https://docs.microsoft.com/rest/api/monitor/microsoft.workloadmonitor/monitors/update). *Unknown* is not configurable and reserved for specific scenarios.  

Health diagnostics page has three main sections:

* Component Model 
* Health Criteria
* State Changes 

![Sections of Health Diagnostics page](./media/vminsights-health/health-diagnostics-page-02.png)

### Component model

The left-most column in the Health Diagnostics page is the component model. All the components, which are associated with the VM, are displayed in this column along with their current health state. 

In the following example, the discovered components are disk, logical disk, processor, memory, and operating system. Multiple instances of these components are discovered and displayed in this column. For example, the image below shows the VM has two instances of logical disks - C: and D:, which are in a healthy state.  

![Example component model presented in Health diagnostics](./media/vminsights-health/health-diagnostics-page-component.png)

### Health criteria

The center column in the Health Diagnostics page is the **Health Criteria** column. The health model defined for the VM is displayed in a hierarchical tree. The health model for a VM consists of unit and aggregate health criteria.  

![Example health criteria presented in Health diagnostics](./media/vminsights-health/health-diagnostics-page-healthcriteria.png)

A health criterion measures the health of the monitored instance with some criteria, which could be a threshold value, state of an entity, etc. A health criterion has either two or three configurable health state thresholds as described earlier. At any given point, the health criterion can be in only one of its potential states. 

The overall health of a target is determined by the health of each of its health criteria defined in the health model. It is a combination of health criteria targeted directly at the target, health criteria targeted at components rolling up to the target through an aggregate health criterion. This hierarchy is illustrated in the **Health Criteria** section of the Health Diagnostics page. The health rollup policy is part of the configuration of the aggregate health criteria (default is set to *Worst-of*). You can find a list of default set of health criteria running as part of this feature under the section [Monitoring configuration details](#monitoring-configuration-details), and you can use the Azure Monitor REST API [monitor instances - list by resource operation](https://docs.microsoft.com/rest/api/monitor/microsoft.workloadmonitor/monitorinstances/listbyresource) to get a list of all the health criteria and its detailed configuration running against the Azure VM resource.  

**Unit** Health criteria type can have their configuration modified by clicking on the ellipse link to the far right and selecting **Show Details** to open the configuration pane. 

![Configuring a health criteria example](./media/vminsights-health/health-diagnostics-vm-example-02.png)

In the configuration pane for the selected health criteria, using the example **Average Disk Seconds Per Write**, its threshold can be configured with a different numeric value. It is a two-state monitor, meaning it only changes from healthy to warning. Other health criterion may be three states, where you can configure the value for the warning and critical health state threshold. You can also modify the threshold using the Azure Monitor REST API [update monitor operation](https://docs.microsoft.com/rest/api/monitor/microsoft.workloadmonitor/monitors/update).

>[!NOTE]
>Applying health criteria configuration changes to one instance is applied to all monitored instances.  For example, if you select **Disk -1 D:** and modify the **Average Disk Seconds Per Write** threshold, it doesn't apply to only that instance, but all other disk instances discovered and monitored on the VM.
>

![Configuring a health criteria of a unit monitor example](./media/vminsights-health/health-diagnostics-criteria-config-01.png)

If you want to learn more about the health indicator, knowledge articles are included to help you identify problems, causes, and resolutions. Click on the **View information** link on the page and it opens a new tab in your browser showing the specific knowledge article. At any time, you can review all of the health criterion knowledge articles included with Azure Monitor for VMs Health feature [here](https://docs.microsoft.com/azure/monitoring/infrastructure-health/).
  
### State changes

The right-most column in the Health Diagnostics page is **State Changes**. It lists all the state changes associated with the health criteria that is selected in the **Health Criteria** section or the state change of the VM if a VM was selected from the **Component Model** or **Health Criteria** column of the table. 

![Example state changes presented in Health diagnostics](./media/vminsights-health/health-diagnostics-page-statechanges.png)

This section consists of the health criteria state and the associated time sorted by the latest state on top.   

### Association of Component Model, Health Criteria, and State change columns 

The three columns are interlinked with each other. When you select a discovered instance in the **Component Model** section, the **Health Criteria** section is filtered to that component view and correspondingly the **State Change** section is updated based on the selected health criteria. 

![Example of selecting monitored instance and results](./media/vminsights-health/health-diagnostics-vm-example-01.png)

In the above example, when you select **Disk - 1 D:**, the Health Criteria tree is filtered to **Disk - 1D:**. The **State Change** column shows the state change based on the availability of **Disk - 1 D:**. 

To see an updated health state, you can refresh the Health Diagnostics page by clicking the **Refresh** link.  If there is an update to the health criterion's health state based on the pre-defined polling interval, this task allows you to avoid waiting and reflects the latest health state.  The **Health Criteria State** is a filter allowing you to scope the results based on the selected health state - *Healthy*, *Warning*, *Critical*, *Unknown*, and *All*.  The **Last Updated** time in the top-right corner represents the last time when the Health Diagnostics page was refreshed.  

## Alerts

Azure Monitor for VMs Health feature integrates with [Azure Alerts](../../azure-monitor/platform/alerts-overview.md) and raises an alert when the predefined health criteria change from healthy to an unhealthy state when the condition is detected. Alerts are categorized by severity - Sev 0 through 4, with Sev 0 representing the highest severity level. 

Alerts are not associated with an action group to notify you when the alert has been triggered. The subscription owner needs to configure notifications following the steps [later in this section](#configure-alerts).   

Total number of VM Health alerts categorized by severity is available on the **Health** dashboard under the section **Alerts**. When you select either the total number of alerts or the number corresponding to a severity level, the **Alerts** page opens and lists all alerts matching your selection.  For example, if you selected the row corresponding to **Sev level 1**, then you see the following view:

![Example of all Severity Level 1 alerts](./media/vminsights-health/vminsights-sev1-alerts-01.png)

On the **Alerts** page, it is not only scoped to show alerts matching your selection, but are also filtered by **Resource type** to only show health alerts raised by the virtual machine resource.  It is reflected in the list of alerts, under the column **Target Resource**, where it shows the Azure VM the alert was raised for when the particular health criteria's unhealthy condition was met.  

Alerts from other resource types or services are not intended to be included in this view, such as log alerts based on log queries or metric alerts that you would normally view from the default Azure Monitor [All Alerts](../../azure-monitor/platform/alerts-overview.md#all-alerts-page) page. 

You can filter this view by selecting values in the dropdown menus at the top of the page.

|Column |Description | 
|-------|------------| 
|Subscription |Select an Azure subscription. Only alerts in the selected subscription are included in the view. | 
|Resource Group |Select a single resource group. Only alerts with targets in the selected resource group are included in the view. | 
|Resource type |Select one or more resource types. By default, only alerts of target **Virtual machines** is selected and included in this view. This column is only available after a resource group has been specified. | 
|Resource |Select a resource. Only alerts with that resource as a target are included in the view. This column is only available after a resource type has been specified. | 
|Severity |elect an alert severity, or select *All* to include alerts of all severities. | 
|Monitor Condition |Select a monitor condition to filter alerts if they have been *Fired* by the system or *Resolved* by the system if the condition is no longer active. Or select *All* to include alerts of all conditions. | 
|Alert state |Select an alert state, *New*, *Acknowledge*, *Closed*, or select *All* to include alerts of all states. | 
|Monitor service |Select a service, or select *All* to include all services. Only alerts from *VM Insights* are supported for this feature.| 
|Time range| Only alerts fired within the selected time window are included in the view. Supported values are the past hour, the past 24 hours, the past 7 days, and the past 30 days. | 

The **Alert detail** page is displayed when you select an alert, providing details of the alert and allowing you to change its state. To learn more about managing alerts, see [Create, view, and manage alerts using Azure Monitor](../../azure-monitor/platform/alerts-metric.md).  

>[!NOTE]
>At this time, creating new alerts based on health criteria or modify existing health alert rules in Azure Monitor from the portal is not supported.  
>

![Alert details pane for a selected alert](./media/vminsights-health/alert-details-pane-01.png)

Alert state can also be changed for one or multiple alerts by selecting them and then selecting **Change state** from the **All Alerts** page, on the upper left-hand corner. On the **Change alert state** pane you select one of the states, add a description of the change in the **Comment** field, and then click **Ok** to commit your changes. While the information is verified and the changes are applied, you can track its progress under **Notifications** from the menu.  

### Configure alerts
Certain alert management tasks cannot be managed from the Azure portal and have to be performed using the [Azure Monitor REST API](https://docs.microsoft.com/rest/api/monitor/microsoft.workloadmonitor/components). Specifically:

- Enabling or disabling an alert for health criteria 
- Set up notifications for health criteria alerts 

The approach used in each example is using [ARMClient](https://github.com/projectkudu/armclient) on your Windows machine. If you are not familiar with this method, see [Using ARMClient](../platform/rest-api-walkthrough.md#use-armclient).  

#### Enable or disable alert rule

To enable or disable an alert for a specific health criteria, the health criteria property *alertGeneration* needs to be modified with a value of either **Disabled** or **Enabled**. To identify the *monitorId* of a particular health criteria, the following example will show how to query for that value for the criteria **LogicalDisk\Avg Disk Seconds Per Transfer**.

1. In a terminal window, type **armclient.exe login**. Doing so prompts you to sign in to Azure.

2. Type the following command to retrieve all the health criterion active on a specific virtual machine and identify the value for *monitorId* property. 

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

    The output should resemble the following:
    
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

To identify bottlenecks and overall utilization with your VMs performance, see [View Azure VM Performance](vminsights-performance.md), or to view discovered application dependencies, see [View Azure Monitor for VMs Map](vminsights-maps.md). 
