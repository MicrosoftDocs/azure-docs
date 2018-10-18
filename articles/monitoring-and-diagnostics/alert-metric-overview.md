---

title: Understand how metric alerts work in Azure Monitor.
description: Get an overview of what you can do with metric alerts and how they work in Azure Monitor.
author: snehithm
ms.author: snmuvva 
ms.date: 9/18/2018
ms.topic: conceptual
ms.service: azure-monitor
ms.component: alerts

---

# Understand how metric alerts work in Azure Monitor

Metric alerts in Azure Monitor work on top of multi-dimensional metrics. These metrics could be platform metrics, [custom metrics](metrics-custom-overview.md), [popular logs from Log Analytics converted to metrics](monitoring-metric-alerts-logs.md), Application Insights standard metrics. Metric alerts evaluate at regular intervals to check if conditions on one or more metric time-series are true and notify you when the evaluations are met. Metric alerts are stateful, that is, they only send out notifications when the state changes.

## How do metric alerts work

You can define a metric alert rule by specifying a target resource to be monitored, metric name and the condition (an operator and a threshold) and an action group to be triggered when the alert rule fires.
Let's say you have created a simple metric alert rule as follows:

- Target Resource (the Azure resource you want to monitor): myVM
- Metric: Percentage CPU
- Time Aggregation (Statistic that is run over raw metric values. Supported time aggregations are Min, Max, Avg, Total): Average
- Period(The look back window over which metric values are checked):      Over the last 5 mins
- Frequency(The frequency with which the metric alert checks if the conditions are met): 1 min
- Operator:     Greater Than
- Threshold:      70

From the time the alert rule is created, the monitor runs every 1 min and looks at metric values for the last 5 minutes and checks if the average of those values exceeds 70. If the condition is met that is, the average Percentage CPU for the last 5 minutes exceeds 70, the alert rule fires an activated notification. If you have configured an email or a web hook action in the action group associated with the alert rule, you will receive an activated notification on both.

This particular instance of the alert rule firing can also be viewed in the Azure portal in the All Alerts blade.

Say, the usage on "myVM" continues being above the threshold in subsequent checks, the alert rule will not fire again until the condition is resolved.

After sometime, if the usage on "myVM" comes back down to normal that is, goes below the specified threshold. The alert rule monitors the condition for two more times, to send out a resolved notification. The alert rule sends out a resolved/deactivated message when the alert condition is not met for three consecutive periods to reduce noise in case of flapping conditions.

As the resolved notification is sent out via web hooks or email, the status of the alert instance (called  Monitor state) in Azure portal is also set to resolved.

## Monitoring at scale using metric alerts in Azure Monitor

### Using dimensions

Metric alerts in Azure Monitor also support monitoring multiple dimension value combinations with one rule. Let's understand why you might use multiple dimension combinations with the help of an example.

Say you have an App Service plan for your website. You want to monitor CPU usage on multiple instances running your web site/app. You can do that using a metric alert rule as follows

- Target resource: myAppServicePlan
- Metric: Percentage CPU
- Dimensions
  - Instance = InstanceName1, InstanceName2
- Time Aggregation: Average
- Period: Over the last 5 mins
- Frequency: 1 min
- Operator: GreaterThan
- Threshold: 70

Like before, this rule monitors if the average CPU usage for the last 5 minutes exceeds 70%. However, with the same rule you can monitor two instances running your website. Each instance will get monitored individually and you will get notifications individually.

Say, you have a web app that is seeing massive demand and you will need to add more instances. The above rule still monitors just two instances. However, you can create a rule as follows.

- Target resource: myAppServicePlan
- Metric: Percentage CPU
- Dimensions
  - Instance = *
- Time Aggregation: Average
- Period: Over the last 5 mins
- Frequency: 1 min
- Operator: GreaterThan
- Threshold: 70

This rule will automatically monitor all values for the instance i.e you can monitor your instances as they come up without needing to modify your metric alert rule again.

### Monitoring multiple resources using metric alerts

As you have seen from the previous section, it is possible to have a single metric alert rule that monitors each individual dimension combination (i.e a metric time series). However, previously you were still limited to doing it one resource at a time. Azure Monitor also supports monitoring multiple resources with one metric alert rule. This feature is currently preview and supported only on virtual machines. Also, a single metric alert can monitor resources in one Azure region.

You can specify the scope of monitoring by a single metric alert in one of three ways:

- as a list of virtual machines in one Azure region within a subscription
- all virtual machines (in one Azure region) in one or more resource groups in a subscription
- all virtual machines (in one Azure region) in one subscription

Creating metric alert rules that monitor multiple resources is not currently supported through Azure portal. You can create these rules through [Azure Resource Manager templates](monitoring-create-metric-alerts-with-templates.md#resource-manager-template-for-metric-alert-that-monitors-multiple-resources). You will receive individual notifications for each virtual machine. 

## Typical latency

For metric alerts, typically you will get notified in under 5 minutes if you set the alert rule frequency to be 1 min. In cases of heavy load for notification systems, you might see a longer latency.

## Supported resource types for metric alerts

You can find the full list of supported resource types in this [article](monitoring-near-real-time-metric-alerts.md#metrics-and-dimensions-supported).

If you are using classic metric alerts today and are looking to see if metric alerts support the all the resource types you are using, the following table shows the resource types supported by classic metric alerts and if they are supported by metric alerts today or not.

|Resource type supported by classic metric alerts | Supported by metric alerts |
|-------------------------------------------------|----------------------------|
| Microsoft.ApiManagement/service | Yes |
| Microsoft.Batch/batchAccounts| Yes|
|Microsoft.Cache/redis| Yes
|Microsoft.ClassicCompute/virtualMachines | No |
|Microsoft.ClassicCompute/domainNames/slots/roles | No|
|Microsoft.CognitiveServices/accounts | No |
|Microsoft.Compute/virtualMachines | Yes|
|Microsoft.Compute/virtualMachineScaleSets| Yes|
|Microsoft.ClassicStorage/storageAccounts| No |
|Microsoft.DataFactory/datafactories | Yes|
|Microsoft.DBforMySQL/servers| Yes|
|Microsoft.DBforPostgreSQL/servers| Yes|
|Microsoft.Devices/IotHubs | No|
|Microsoft.DocumentDB/databaseAccounts| No|
|Microsoft.EventHub/namespaces | Yes|
|Microsoft.Logic/workflows | Yes|
|Microsoft.Network/loadBalancers |Yes|
|Microsoft.Network/publicIPAddresses| Yes|
|Microsoft.Network/applicationGateways| Yes|
|Microsoft.Network/expressRouteCircuits| Yes|
|Microsoft.Network/trafficManagerProfiles | Yes|
|Microsoft.Search/searchServices | No|
|Microsoft.ServiceBus/namespaces| No|
|Microsoft.Storage/storageAccounts | Yes|
|Microsoft.StreamAnalytics/streamingjobs| Yes|
|Microsoft.TimeSeriesInsights/environments | Yes|
|Microsoft. Web/serverfarms | Yes |
|Microsoft. Web/sites (excluding functions) | Yes|
|Microsoft. Web/hostingEnvironments/multiRolePools | No|
|Microsoft. Web/hostingEnvironments/workerPools| No
|Microsoft.SQL/Servers | No|

## Next steps

- [Learn how to create, view and manage metric alerts in Azure](alert-metric.md)
- [Learn how to deploy metric alerts using Azure Resource Manager templates](monitoring-create-metric-alerts-with-templates.md)
- [Learn more about action groups](monitoring-action-groups.md)
