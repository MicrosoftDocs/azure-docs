---
title: Azure Monitor for VMs guest health (preview)
description: Azure Monitor for VMs guest health allows you to view the health of a virtual machine as defined by a set of performance measurements that are sampled at regular intervals. 
ms.subservice: 
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 09/08/2020

---

# Azure Monitor for VMs guest health (preview)
Azure Monitor for VMs guest health allows you to view the health of a virtual machine as defined by a set of performance measurements that are sampled at regular intervals. This article provides a general overview of the feature and shows you how you can view the health of your virtual machines and receive alerts when a virtual machine becomes unhealthy.

## Viewing VM health
When the Health feature is enabled for a subscription, a new **Guest VM Health** column is added to the **Get Started** page. This gives you a quick view of the health of each virtual machine in a particular subscription or resource group. The current health of each virtual machine is displayed while icons for each group show the number of virtual machines currently in each state in that group.

[![Get started page with guest VM health](media/vminsights-health-overview/get-started-page.png)](media/vminsights-health-overview/get-started-page.png#lightbox)


## Monitors
Click on a virtual machine's health status to view its detailed health. The overall health of a computer is measured by multiple monitors, which each measures the health of some aspect of a managed object. 

![Monitors](media/vminsights-health-overview/monitors.png)

Monitors each have three potential health states and will be in one and only one at any given time. When a monitor is initialized, it starts in a healthy state. The state changes only if the specified conditions for another state are detected.

There are two types of monitors as shown in the following table.

| Monitor | Description |
|:---|:---|
| Unit monitor | Measures some aspect of a resource or application. This might be checking a performance counter to determine the performance of the resource, or its availability. |
| Aggregate Monitor | Groups multiple monitors to provide a single health aggregated health state. An aggregate monitor can contain one or more unit monitors and other aggregate monitors. |


  
### Health rollup policy
The health state of a virtual machine is determined by the rollup of health from each of its unit and aggregate monitors. Each aggregate monitor uses a worst state health rollup policy where the state of the aggregate monitor matches the state of the child monitor with the worst health state.  

In the following example, the **Free space** monitor is in a critical state which roles up to the aggregates for its instance and then to **File systems**. Even though **CPU utilization** in in a warning state, the virtual machine is set to critical since this is the worst state underneath it. If the free space were to return to a healthy state, then the virtual machine would change to a warning state since CPU utilization would then become the monitor with the worst state.

![Health rollup example](media/vminsights-health-overview/health-rollup-example.png)


### Monitors
The following table lists the aggregate and unit monitors currently available for each VM. 

| Monitor | Type | Description |
|:---|:---|:---|
| CPU utilization | Unit | Percentage utilization of the processor. |
| File systems | Aggregate | Aggregate health of all file systems on the VM. |
| File system  | Aggregate | Health of each individual file system on the VM. The name of the monitor is the name of the file system. |
| Free space | Unit | Percentage free space on the file system. |
| Memory | Aggregate | Aggregate health of the memory on the VM. |
| Available memory | Unit | Available megabytes on the VM.



## Monitor details
Select a monitor to view its detail which includes the following tabs.

**Overview** provides a description of the monitor, the last time it was evaluated, and the last time that the state changed. Also lists the last three unique sample values.

[![Monitor details overview](media/vminsights-health-overview/monitor-details-overview.png)](media/vminsights-health-overview/monitor-details-overview.png#lightbox)

**History** lists the history of state changes for the monitor. You can expand any of the state changes to view values evaluated to determine the health state. Click **View configuration applied** to view the configuration of the monitor at the time that the health state was performed. 

Each monitor samples values on the agent every minute and compares sampled values to the criteria for each health state. If the criteria for particular state is true, then the monitor is set to that state. If none of the criteria are true, then the monitor is set to a healthy state. Data is sent from the agent to Azure Monitor every three minutes or immediately if there is a state change.

Each monitor has a lookback window and analyzes any samples collected within that time using a minimum or maximum value. For example, a monitor may have a lookback window of 240 seconds looking for the maximum value among at least 2 sampled values but no more than the last 3. While values are sampled at a regular rate, the number sampled in a particular window may vary slightly if there is any disruption in the agent operation.


[![Monitor details history](media/vminsights-health-overview/monitor-details-history.png)](media/vminsights-health-overview/monitor-details-history.png#lightbox)

### Configuration
View and modify the configuration of the monitor for the selected VM. See [Configure monitoring in Azure Monitor for VMs guest health (preview)](vminsights-health-enable.md) for details.

[![Monitor details configuration](media/vminsights-health-overview/monitor-details-configuration.png)](media/vminsights-health-overview/monitor-details-configuration.png#lightbox)


## Alerts
An [alert](../platform/alerts-alerts-overview.md) will be created for each virtual machine anytime it changes to a Warning or Critical state. View the alert from **Alerts** in the **Azure Monitor** menu or the virtual machine's menu in the Azure portal.

Alerts are not created for individual monitors but for the virtual machine itself. This means that if a monitor changes to a state that doesn't effect the current state of the virtual machine (because it's less than or equal to the current state), then no alert is created because the virtual machine state didn't change.

If an alert is already open when the VM state changes, then a second alert won't be created, but the severity of the alert will be changed to match the severity of the VM. For example, if the VM changes to a Critical state when a Warning alert was already open, that alert will be changed to a Critical State. If the VM changes to a Warning state when a Critical alert was already open, that alert will be changed to a Warning State. 

If the VM changes to a Healthy state, then the alert will be closed.
