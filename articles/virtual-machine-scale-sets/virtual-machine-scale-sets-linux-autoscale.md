---
title: Auto scale virtual machine scale sets with the Azure CLI | Microsoft Docs
description: How to create auto scale rules for virtual machine scale sets with the Azure CLI 2.0
services: virtual-machine-scale-sets
documentationcenter: ''
author: iainfoulds
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid: 83e93d9c-cac0-41d3-8316-6016f5ed0ce4
ms.service: virtual-machine-scale-sets
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/16/2017
ms.author: iainfou

---
# Automatically scale machines in a virtual machine scale set with the Azure CLI 2.0
When you create a scale set, you define the number of VM instances that you wish to run. As your application demand changes, you can automatically increase or decrease the number of VM instances. The ability to auto scale lets you keep up with customer demand or respond to application performance changes throughout the lifecycle of your app.

This article shows you how to create auto scale rules with the Azure CLI 2.0 that monitor the performance of the VM instances in your scale set. These auto scale rules increase or decrease the number of VM instances in response to these performance metrics. You can also complete these steps with [Azure PowerShell](virtual-machine-scale-sets-windows-autoscale.md).


## Prerequisites
To create auto scale rules, you need an existing virtual machine scale set. You can create a scale set with the [Azure portal](virtual-machine-scale-sets-portal-create.md), [Azure CLI 2.0](virtual-machine-scale-sets-create.md#create-from-azure-cli), or [Azure PowerShell](virtual-machine-scale-sets-create.md#create-from-powershell).

To make it easier to create the auto scale rules, define some variables for your scale set. The following example defines variables for the scale set named *myScaleSet* in the resource group named *myResourceGroup* and in the *eastus* region. Your subscription ID is obtained with [az account show](/cli/azure/account#az_account_show). If you have multiple subscriptions associated with your account, only the first subscription is returned. Adjust the names and subscription ID as follows:

```azurecli
sub=$(az account show --query id -o tsv)
resourcegroup_name = "myResourceGroup"
scaleset_name = "myScaleSet"
location_name = "eastus"
```

## Define an auto scale profile
Auto scale rules are deployed as JSON (JavaScript Object Notation) with the Azure CLI 2.0. The complete JSON that defines and deploys the auto scale rules can be found later in the article. 

The start of the auto scale profile defines the default, minimum, and maximum scale set capacity. The following example sets the default, and minimum, capacity of *2* VM instances, and a maximum of *10*:

```json
{
  "name": "Auto scale rules",
  "capacity": {
    "minimum": "2",
    "maximum": "10",
    "default": "2"
  }
}
```


## Create a rule to automatically scale out
If your application demand increases, the load on the VM instances in your scale set increases. If this increased load is consistent, rather than just a brief demand, you can configure auto scale rules to increase the number of VM instances in the scale set. When these VM instances are created and your applications are deployed, the scale set starts to distribute traffic to them through the load balancer. You control what metrics to monitor, such as CPU or memory, how long the application load must meet a given threshold, and how many VM instances to add to the scale set.

Let's create a rule that increases the number of VM instances in a scale set when the average CPU load is greater than 60% over a 5-minute period. When the rule triggers, the number of VM instances is increased by 20%. In scale sets with a small number of VM instances, you could set the `type` to *ChangeCount* and increase the `value` by *1* or *2* instances. In scale sets with a large number of VM instances, an increase of 10% or 20% VM instances may be more appropriate.

The following parameters are used for this rule:

| Parameter         | Explanation                                                                                                          | Value          |
|-------------------|----------------------------------------------------------------------------------------------------------------------|----------------|
| *metricName*      | The performance metric to monitor and apply scale set actions on.                                                    | Percentage CPU |
| *timeGrain*       | How often the metrics are collected for analysis.                                                                    | 1 minute       |
| *timeAggregation* | Defines how the collected metrics should be aggregated for analysis.                                                 | Average        |
| *timeWindow*      | The amount of time monitored before the metric and threshold values are compared.                                    | 5 minutes      |
| *operator*        | Operator used to compare the metric data against the threshold.                                                      | Greater Than   |
| *threshold*       | The value that causes the auto scale rule to trigger an action.                                                      | 60%            |
| *direction*       | Defines if the scale set should scale up or down when the rule applies.                                              | Increase       |
| *type*            | Indicates that the number of VM instances should be changed by a percentage amount.                                  | Percent Change |
| *value*           | How many VM instances should be scaled up or down when the rule applies.                                             | 20             |
| *cooldown*        | The amount of time to wait before the rule is applied again so that the auto scale actions have time to take effect. | 5 minutes      |

The following example defines the rule to scale out the number of VM instances. The *metricResourceUri* uses the variables previously defined for the subscription ID, resource group name, and scale set name:

```json
{
  "metricTrigger": {
    "metricName": "Percentage CPU",
    "metricNamespace": "",
    "metricResourceUri": "/subscriptions/'$sub'/resourceGroups/'$resourcegroup_name'/providers/Microsoft.Compute/virtualMachineScaleSets/'$scaleset_name'",
    "metricResourceLocation": "'$location_name'",
    "timeGrain": "PT1M",
    "statistic": "Average",
    "timeWindow": "PT5M",
    "timeAggregation": "Average",
    "operator": "GreaterThan",
    "threshold": 60
  },
  "scaleAction": {
    "direction": "Increase",
    "type": "PercentChangeCount",
    "value": "20",
    "cooldown": "PT5M"
  }
}
```


## Create a rule to automatically scale in
On an evening or weekend, your application demand may decrease. If this decreased load is consistent over a period of time, you can configure auto scale rules to decrease the number of VM instances in the scale set. This scale in action reduces the cost to run your scale set as you only run the number of instances required to meet the current demand.

Create another rule that decreases the number of VM instances in a scale set when the average CPU load then drops below 30% over a 5-minute period. The following example defines the rule to scale out the number of VM instances. The *metricResourceUri* uses the variables previously defined for the subscription ID, resource group name, and scale set name:

```json
{
  "metricTrigger": {
    "metricName": "Percentage CPU",
    "metricNamespace": "",
    "metricResourceUri": "/subscriptions/'$sub'/resourceGroups/'$resourcegroup_name'/providers/Microsoft.Compute/virtualMachineScaleSets/'$scaleset_name'",
    "metricResourceLocation": "'$location_name'",
    "timeGrain": "PT1M",
    "statistic": "Average",
    "timeWindow": "PT5M",
    "timeAggregation": "Average",
    "operator": "LessThan",
    "threshold": 30
  },
  "scaleAction": {
    "direction": "Decrease",
    "type": "PercentChangeCount",
    "value": "20",
    "cooldown": "PT5M"
  }
}
```


## Apply auto scale rules to a scale set
The final step is to apply the auto scale profile and rules to your scale set. Your scale is then able to automatically scale in or out based on the application demand. Apply the auto scale profile with [az monitor autoscale-settings create](/cli/azure/monitor/autoscale-settings#az_monitor_autoscale_settings_create) as follows. The complete JSON uses the profile and rules noted in the previous sections.

```azurecli
az monitor autoscale-settings create \
    --resource-group myResourceGroup \
    --name autoscale \
    --parameters '{"autoscale_setting_resource_name": "autoscale",
      "enabled": true,
      "location": "'$location_name'",
      "notifications": [],
      "profiles": [
        {
          "name": "Auto created scale condition",
          "capacity": {
            "minimum": "2",
            "maximum": "10",
            "default": "2"
          },
          "rules": [
            {
              "metricTrigger": {
                "metricName": "Percentage CPU",
                "metricNamespace": "",
                "metricResourceUri": "/subscriptions/'$sub'/resourceGroups/'$resourcegroup_name'/providers/Microsoft.Compute/virtualMachineScaleSets/'$scaleset_name'",
                "metricResourceLocation": "'$location_name'",
                "timeGrain": "PT1M",
                "statistic": "Average",
                "timeWindow": "PT5M",
                "timeAggregation": "Average",
                "operator": "GreaterThan",
                "threshold": 70
              },
              "scaleAction": {
                "direction": "Increase",
                "type": "PercentChangeCount",
                "value": "20",
                "cooldown": "PT5M"
              }
            },
            {
              "metricTrigger": {
                "metricName": "Percentage CPU",
                "metricNamespace": "",
                "metricResourceUri": "/subscriptions/'$sub'/resourceGroups/'$resourcegroup_name'/providers/Microsoft.Compute/virtualMachineScaleSets/'$scaleset_name'",
                "metricResourceLocation": "'$location_name'",
                "timeGrain": "PT1M",
                "statistic": "Average",
                "timeWindow": "PT5M",
                "timeAggregation": "Average",
                "operator": "LessThan",
                "threshold": 30
              },
              "scaleAction": {
                "direction": "Decrease",
                "type": "PercentChangeCount",
                "value": "20",
                "cooldown": "PT5M"
              }
            }
          ]
        }
      ],
      "tags": {},
      "target_resource_uri": "/subscriptions/'$sub'/resourceGroups/'$resourcegroup_name'/providers/Microsoft.Compute/virtualMachineScaleSets/'$scaleset_name'"
    }'
```


## Monitor number of instances in a scale set
To see the number, and status, of VM instances, you can view a list of instances in your scale set with [az vmss list-instances](/cli/azure/vmss#az_vmss_list_instances). The status indicates if the VM instance is provisioning as the scale set automatically scales out, or is deprovisioning as the scale automatically scales in. The following example views the VM instance status for the scale set named *myScaleSet* in the resource group named *myResourceGroup*:

```azurecli
az vmss list-instances \
  --resource-group myResourceGroup \
  --name myScaleSet \
  --output table
```


## Auto scale based on a schedule
The previous examples automatically scaled a scale set in or out based on basic host metrics such as CPU or memory usage. You can also create auto scale rules based on schedules. These schedule-based rules allow you to automatically scale out the number of VM instances ahead of an anticipated increase in application demand, such as core work hours, and then automatically scale in the number of instances at a time that you anticipate less demand, such as the weekend.

To create auto scale rules based on a schedule rather than host metrics, use the Azure portal. Schedule-based rules cannot currently be created with the Azure CLI.


## Use in-guest metrics of App Insights
In these examples, basic host metrics for CPU or memory usage were used. These host metrics allow you to quickly create auto scale rules without the need to configure the collection of additional metrics. For more granular control over the metrics used to automatically scale your scale in or out, you can also use one of the following methods:

- **In-guest VM metrics with the Azure diagnostics extension**
    - The Azure diagnostics extension is an agent that runs inside a VM instance. The agent monitors and saves performance metrics to Azure storage. These performance metrics contain more detailed information about the status of the VM, such as *AverageReadTime* for disks or *PercentIdleTime* for CPU. You can create auto scale rules based on a more detailed awareness of the VM performance, not just the percentage of CPU usage or memory consumption.
    - To use the Azure diagnostics extension, you must create Azure storage accounts for your VM instances, install the Azure diagnostics agent, then configure the VMs to stream specific performance counters to the storage account.
    - For more information, see how to enable the Azure diagnostics extension on a [Linux VM](../virtual-machines/linux/diagnostic-extension.md) or [Windows VM](../virtual-machines/windows/ps-extensions-diagnostics.md).
- **Application-level metrics with App Insights**
    - To gain more visibility in to the performance of your applications, you can use Application Insights. You install a small instrumentation package in your application that monitors the app and sends telemetry to Azure. You can monitor metrics such as the response times of your application, the page load performance, and the session counts. These application metrics can be used to create auto scale rules at a granular and embedded level as you trigger rules based on actionable insights that may impact the customer experience.
    - For more information about App Insights, see [What is Application Insights](../application-insights/app-insights-overview.md).


## Next steps
In this article, you learned how to use auto scale rules to scale horizontally and increase or decrease the *number* of VM instances in your scale set. You can also scale vertically to increase or decrease the VM instance *size*. For more information, see [Vertical autoscale with virtual machine scale sets](virtual-machine-scale-sets-vertical-scale-reprovision.md).

For information on how to manage your VM instances, see [Manage virtual machine scale sets with Azure PowerShell](virtual-machine-scale-sets-windows-manage.md).

To learn how to generate alerts when your autoscale rules trigger, see [Use autoscale actions to send email and webhook alert notifications in Azure Monitor](../monitoring-and-diagnostics/insights-autoscale-to-webhook-email.md). You can also [Use audit logs to send email and webhook alert notifications in Azure Monitor](../monitoring-and-diagnostics/insights-auditlog-to-webhook-email.md).
