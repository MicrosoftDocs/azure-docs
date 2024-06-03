---
title: Overview of autoscale with Azure Virtual Machine Scale Sets
description: Learn about the different ways that you can automatically scale an Azure Virtual Machine Scale Set based on performance or on a fixed schedule
author: mimckitt
ms.author: mimckitt
ms.topic: overview
ms.service: virtual-machine-scale-sets
ms.subservice: autoscale
ms.date: 11/22/2022
ms.reviewer: jushiman
---

# Overview of autoscale with Azure Virtual Machine Scale Sets

An Azure Virtual Machine Scale Set can increase or decrease the number of VM instances that run your application. Instance count can be updated in several ways:

- Manually increasing or decreasing scale set capacity
- Based on a set schedule
- According to rules based on metrics thresholds
- Automatically based on usage patterns discovered by predictive artificial intelligence 

This automated and elastic behavior reduces the management overhead to monitor and optimize the performance of your application. This article provides an overview of which performance metrics are available and what actions autoscale can perform.

> [!NOTE]
> Use of autoscaling requires that the scale set is defined with a virtual machine scaling profile that defines the configuration of instances to add. Learn more about [Virtual Machine Scaling Profile](./virtual-machine-scale-sets-scaling-profile.md).

## Manual scaling

You can manually increase or decrease the number of instances in the virtual machine scale set by updating the `sku.capacity` property.

### Azure portal

1. Navigate to an existing Virtual machine scale set.
1. Under **Settings,** select the **Scaling** tab.
1. Choose **Manual Scale**, if it is not already selected.
1. Update the **Instance count**.
1. Press the **Save** button.

### Azure CLI

```azurecli
az vmss scale \
	--new-capacity 5 \
	--name <scale set name> \
	--resource-group <resource group name>
```

### Azure PowerShell

```azurepowershell
Update-AzVmss `
	-SkuCapacity 5 `
	-ResourceGroupName <resource group name> ` 
	-VMScaleSetName <scale set name>  `
```

## Benefits of autoscale
If your application demand increases, the load on the VM instances in your scale set increases. If this increased load is consistent, rather than just a brief demand, you can configure autoscale rules to increase and decrease the number of VM instances in the scale set.

> [!NOTE]
> When using automatic instance repairs for your scale set, the maximum number of instances in the scale set can be 1000. Learn more about [Automatic Instance Repairs](./virtual-machine-scale-sets-automatic-instance-repairs.md).

When these VM instances are created and your applications are deployed, the scale set starts to distribute traffic to them through the load balancer. You control what metrics to monitor, such as CPU or memory, how long the application load must meet a given threshold, and how many VM instances to add to the scale set.

On an evening or weekend, your application demand may decrease. If this decreased load is consistent over a period of time, you can configure autoscale rules to decrease the number of VM instances in the scale set. This scale-in action reduces the cost to run your scale set as you only run the number of instances required to meet the current demand.

## Use host-based metrics
You can create autoscale rules that built-in host metrics available from your VM instances. Host metrics give you visibility into the performance of the VM instances in a scale set without the need to install or configure additional agents and data collections. Autoscale rules that use these metrics can scale out or in the number of VM instances in response to CPU usage, memory demand, or disk access.

Autoscale rules that use host-based metrics can be created with one of the following tools:

- [Azure portal](virtual-machine-scale-sets-autoscale-portal.md)
- [Azure PowerShell](tutorial-autoscale-powershell.md)
- [Azure CLI](tutorial-autoscale-cli.md)
- [Azure template](tutorial-autoscale-template.md)

To create autoscale rules that use more detailed performance metrics, you can [install and configure the Azure diagnostics extension](#in-guest-vm-metrics-with-the-azure-diagnostics-extension) on VM instances, or [configure your application use App Insights](#application-level-metrics-with-app-insights).

Autoscale rules that use host-based metrics, in-guest VM metrics with the Azure diagnostic extension, and App Insights can use the following configuration settings.

### Metric sources
Autoscale rules can use metrics from one of the following sources:

| Metric source        | Use case                                                                                                                     |
|----------------------|------------------------------------------------------------------------------------------------------------------------------|
| Current scale set    | For host-based metrics that do not require additional agents to be installed or configured.                                  |
| Storage account      | The Azure diagnostic extension writes performance metrics to Azure storage that is then consumed to trigger autoscale rules. |
| Service Bus Queue    | Your application or other components can transmit messages on an Azure Service Bus queue to trigger rules.                   |
| Application Insights | An instrumentation package installed in your application that streams metrics directly from the app.                         |

### Autoscale rule criteria
The following host-based metrics are available for use when you create autoscale rules. If you use the Azure diagnostic extension or App Insights, you define which metrics to monitor and use with autoscale rules.

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

When you create autoscale rules to monitor a given metric, the rules look at one of the following metrics aggregation actions:

| Aggregation type |
|------------------|
| Average          |
| Minimum          |
| Maximum          |
| Total            |
| Last             |
| Count            |

The autoscale rules are then triggered when the metrics are compared against your defined threshold with one of the following operators:

| Operator                 |
|--------------------------|
| Greater than             |
| Greater than or equal to |
| Less than                |
| Less than or equal to    |
| Equal to                 |
| Not equal to             |

### Actions when rules trigger
When an autoscale rule triggers, your scale set can automatically scale in one of the following ways:

| Scale operation     | Use case                                                                                                                               |
|---------------------|----------------------------------------------------------------------------------------------------------------------------------------|
| Increase count by   | A fixed number of VM instances to create. Useful in scale sets with a smaller number of VMs.                                           |
| Increase percent by | A percentage-based increase of VM instances. Good for larger scale sets where a fixed increase may not noticeably improve performance. |
| Increase count to   | Create as many VM instances are required to reach a desired maximum amount.                                                            |
| Decrease count by   | A fixed number of VM instances to remove. Useful in scale sets with a smaller number of VMs.                                           |
| Decrease percent by | A percentage-based decrease of VM instances. Good for larger scale sets where a fixed decrease may not noticeably reduce resource consumption and costs. |
| Decrease count to   | Remove as many VM instances are required to reach a desired minimum amount.                                                            |

## In-guest VM metrics with the Azure diagnostics extension
The Azure diagnostics extension is an agent that runs inside a VM instance. The agent monitors and saves performance metrics to Azure storage. These performance metrics contain more detailed information about the status of the VM, such as *AverageReadTime* for disks or *PercentIdleTime* for CPU. You can create autoscale rules based on a more detailed awareness of the VM performance, not just the percentage of CPU usage or memory consumption.

To use the Azure diagnostics extension, you must create Azure storage accounts for your VM instances, install the Azure diagnostics agent, then configure the VMs to stream specific performance counters to the storage account.

For more information, see the articles for how to enable the Azure diagnostics extension on a [Linux VM](../virtual-machines/extensions/diagnostics-linux.md) or [Windows VM](../virtual-machines/extensions/diagnostics-windows.md).

## Application-level metrics with App Insights
To gain more visibility in to the performance of your applications, you can use Application Insights. You install a small instrumentation package in your application that monitors the app and sends telemetry to Azure. You can monitor metrics such as the response times of your application, the page load performance, and the session counts. These application metrics can be used to create autoscale rules at a granular and embedded level as you trigger rules based on actionable insights that may impact the customer experience.

For more information about App Insights, see [What is Application Insights](../azure-monitor/app/app-insights-overview.md).

## Scheduled autoscale
You can also create autoscale rules based on schedules. These schedule-based rules allow you to automatically scale the number of VM instances at fixed times. With performance-based rules, there may be a performance impact on the application before the autoscale rules trigger and the new VM instances are provisioned. If you can anticipate such demand, the additional VM instances are provisioned and ready for the additional customer use and application demand.

The following examples are scenarios that may benefit the use of schedule-based autoscale rules:

- Automatically scale out the number of VM instances at the start of the work day when customer demand increases. At the end of the work day, automatically scale in the number of VM instances to minimize resource costs overnight when application use is low.
- If a department uses an application heavily at certain parts of the month or fiscal cycle, automatically scale the number of VM instances to accommodate their additional demands.
- When there is a marketing event, promotion, or holiday sale, you can automatically scale the number of VM instances ahead of anticipated customer demand. 

## Limitations
- You can have up to 20 Autoscale rules for a given scale set.

## Next steps
You can create autoscale rules that use host-based metrics with one of the following tools:

- [Azure PowerShell](tutorial-autoscale-powershell.md)
- [Azure CLI](tutorial-autoscale-cli.md)
- [Azure template](tutorial-autoscale-template.md)

For information on how to manage your VM instances, see [Manage Virtual Machine Scale Sets with Azure PowerShell](./virtual-machine-scale-sets-manage-powershell.md).

To learn how to generate alerts when your autoscale rules trigger, see [Use autoscale actions to send email and webhook alert notifications in Azure Monitor](../azure-monitor/autoscale/autoscale-webhook-email.md). You can also [Use audit logs to send email and webhook alert notifications in Azure Monitor](../azure-monitor/alerts/alerts-log-webhook.md).




