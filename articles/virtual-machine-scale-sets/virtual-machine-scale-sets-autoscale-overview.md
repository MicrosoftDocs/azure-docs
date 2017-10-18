---
title: Automatically scale a virtual machine scale in Azure | Microsoft Docs
description: Learn about the different ways you can automatically scale an Azure virtual machine scale set
services: virtual-machine-scale-sets
documentationcenter: ''
author: iainfoulds
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid: d29a3385-179e-4331-a315-daa7ea5701df
ms.service: virtual-machine-scale-sets
ms.workload: infrastructure-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/18/2017
ms.author: iainfou
ms.custom: H1Hack27Feb2017

---
# How to use automatic scaling and Virtual Machine Scale Sets
Automatic scaling of virtual machines in a scale set is the creation or deletion of machines in the set as needed to match performance requirements. As the volume of work grows, an application may require additional resources to enable it to effectively perform tasks.

Automatic scaling is an automated process that helps ease management overhead. By reducing overhead, you don't need to continually monitor system performance or decide how to manage resources. Scaling is an elastic process. More resources can be added as the load increases. And as demand decreases, resources can be removed to minimize costs and maintain performance levels.

Set up automatic scaling on a scale set by using an Azure Resource Manager template, Azure PowerShell, Azure CLI, or the Azure portal.


## Benefits of auto scale
With auto scale rules, you can set thresholds that define the minimumally acceptable performance for a positive customer experience. If your application demand increases, the load on the VM instances in your scale set increases. If this increased load is consistent, rather than just a brief demand, you can configure auto scale rules to increase the number of VM instances in the scale set.

When these VM instances are created and your applications are deployed, the scale set starts to distribute traffic to them through the load balancer. You control what metrics to monitor, such as CPU or memory, how long the application load must meet a given threshold, and how many VM instances to add to the scale set.

On an evening or weekend, your application demand may decrease. If this decreased load is consistent over a period of time, you can configure auto scale rules to decrease the number of VM instances in the scale set. This scale-in action reduces the cost to run your scale set as you only run the number of instances required to meet the current demand.


## Use host-based metrics
You can create auto scale rules that built-in host metrics available from your VM instances. Host metrics give you visibility into the performance of the VM instances in a scale set without the need to install or configure additional agents and data collections. Auto scale rules that use these metrics can scale out or in the number of VM instances in response to CPU usage, memory demand, or disk access.

To create auto scale rules that use more detailed performance metrics, you can [install and configure the Azure diagnostics extension](#in-guest-vm-metrics-with-the-azure-diagnostics-extension) on VM instances, or [configure your application use App Insights](#application-level-metrics-with-app-insights).

Auto scale rules that use host-based metrics, in-guest VM metrics with the Azure diagnostic extension, and App Insights can use the following configuration settings.

### Metric sources
Auto scales can use metrics from one of the following sources:

| Metric source        | Use case                                                                                                                      |
|----------------------|-------------------------------------------------------------------------------------------------------------------------------|
| Current scale set    | For host-based metrics that do not require additional agents to be installed or configured.                                   |
| Storage account      | The Azure diagnostic extension writes performance metrics to Azure storage that is then consumed to trigger auto scale rules. |
| Service Bus Queue    | Your application or other components can transmit messages on an Azure Service Bus queue to trigger rules.                    |
| Application Insights | An instrumentation package installed in your application that streams metrics directly from the app.                          |


### Auto scale rule criteria
The following host-based metrics are available for use when you create auto scale rules. If you use the Azure diagnostic extension or App Insights, you define which metrics to monitor and use with auto scale rules.

| Metric name               |
|---------------------------|
| Percentage CPU            |
| Network In                |
| Network Out               |
| Disk Read Bytes           |
| Disk Write Bytes          |
| Disk Read Operations/Sec  |
| Disk Write Operations/Sec |
| CPU Credits Remaining     |
| CPU Credits Consumed      |

When you create auto scale rules to monitor a given metric, the rules look at one of the following metrics aggregation actions:

| Aggregation type |
|------------------|
| Average          |
| Minimum          |
| Maximum          |
| Total            |
| Last             |
| Count            |

The auto scale rules are then triggered when the metrics are compared against your defined threshold with one of the following operators:

| Operator                 |
|--------------------------|
| Greater than             |
| Greater than or equal to |
| Less than                |
| Less than or equal to    |
| Equal to                 |
| Not equal to             |


### Actions when rules trigger
When an auto scale rule triggers, your scale set can automatically scale in one of the following ways:

| Scale operation     | Use case                                                                                                                               |
|---------------------|----------------------------------------------------------------------------------------------------------------------------------------|
| Increase count by   | A fixed number of VM instances to create. Useful in scale sets with a smaller number of VMs.                                           |
| Increase percent by | A percentage-based increase of VM instances. Good for larger scale sets where a fixed increase may not noticeably improve performance. |
| Increase count to   | Create as many VM instances are required to reach a desired maximum amount.                                                            |
| Decrease count to   | A fixed number of VM instances to remove. Useful in scale sets with a smaller number of VMs.                                           |
| Decrease percent by | A percentage-based decrease of VM instances. Good for larger scale sets where a fixed increase may not noticeably reduce resource consumption and costs. |
| Decrease count to   | Remove as many VM instances are required to reach a desired minimum amount.                                                            |


## In-guest VM metrics with the Azure diagnostics extension
The Azure diagnostics extension is an agent that runs inside a VM instance. The agent monitors and saves performance metrics to Azure storage. These performance metrics contain more detailed information about the status of the VM, such as *AverageReadTime* for disks or *PercentIdleTime* for CPU. You can create auto scale rules based on a more detailed awareness of the VM performance, not just the percentage of CPU usage or memory consumption.

To use the Azure diagnostics extension, you must create Azure storage accounts for your VM instances, install the Azure diagnostics agent, then configure the VMs to stream specific performance counters to the storage account.

For more information, see the articles for how to enable the Azure diagnostics extension on a [Linux VM](../virtual-machines/linux/diagnostic-extension.md) or [Windows VM](../virtual-machines/windows/ps-extensions-diagnostics.md).


## Application-level metrics with App Insights
To gain more visibility in to the performance of your applications, you can use Application Insights. You install a small instrumentation package in your application that monitors the app and sends telemetry to Azure. You can monitor metrics such as the response times of your application, the page load performance, and the session counts. These application metrics can be used to create auto scale rules at a granular and embedded level as you trigger rules based on actionable insights that may impact the customer experience.

For more information about App Insights, see [What is Application Insights](../application-insights/app-insights-overview.md).


## Schedule
You can also create auto scale rules based on schedules. These schedule-based rules allow you to automatically scale the number of VM instances at fixed times. With performance-based rules, there may be a performance impact on the application before the auto scale rules trigger and the new VM instances are provisioned. If you can anticipate such demand, the additional VM instances are provisioned and ready for the additional customer use and application demand.

The following examples are scenarios that may benefit the use of schedule-based auto scale rules:

- Automatically scale out the number of VM instances at the start of the work day when customer demand increases. At the end of the work day, automatically scale in the number of VM instances to minimize resource costs overnight when application use is low.
- If a department uses an application heavily at certain parts of the month or fiscal cycle, automatically scale the number of VM instances to accomodate their additional demands.
- When there is a marketing event, promotion, or holiday sale, you can automatically scale the number of VM instances ahead of anticipated customer demand. 


## Next Steps
* Look at [Automatically scale machines in a Virtual Machine Scale Set](virtual-machine-scale-sets-windows-autoscale.md) to see an example of how to create a scale set with automatic scaling configured.

* Find examples of Azure Monitor monitoring features in [Azure Monitor PowerShell quick start samples](../monitoring-and-diagnostics/insights-powershell-samples.md)

* Learn about notification features in [Use autoscale actions to send email and webhook alert notifications in Azure Monitor](../monitoring-and-diagnostics/insights-autoscale-to-webhook-email.md).

* Learn about how to [Use audit logs to send email and webhook alert notifications in Azure Monitor](../monitoring-and-diagnostics/insights-auditlog-to-webhook-email.md)

* Learn about [advanced autoscale scenarios](virtual-machine-scale-sets-advanced-autoscale.md).
