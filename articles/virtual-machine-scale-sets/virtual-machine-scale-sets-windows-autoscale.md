---
title: Auto scale virtual machine scale sets with Azure PowerShell | Microsoft Docs
description: How to create auto scale rules for virtual machine scale sets with Azure PowerShell
services: virtual-machine-scale-sets
documentationcenter: ''
author: iainfoulds
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid: 88886cad-a2f0-46bc-8b58-32ac2189fc93
ms.service: virtual-machine-scale-sets
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/16/2017
ms.author: iainfou

---
# Automatically scale machines in a virtual machine scale set with Azure PowerShell
When you create a scale set, you define the number of VM instances you wish to run. As your application demand changes, you can automatically increase or decrease the number of VM instances. You can also complete these steps with the [Azure CLI 2.0](virtual-machine-scale-sets-linux-autoscale.md).


## Prerequisites
To create auto scale rules, you need an existing virtual machine scale set. You can create a scale set with the [Azure portal](), [Azure PowerShell](), or [Azure CLI 2.0]().

To make it easier to create the auto scale rules, define some variables for your scale set. The following example defines variables for the scale set named *myScaleSet* in the resource group named *myResourceGroup* and in the *East US* region. Your subscription ID is obtained with [Get-AzureRmSubscription](). If you have multiple subscriptions associated with your account, only the first subscription is returned. Adjust the names and subscription ID as follows:

```powershell
$mySubscriptionId = (Get-AzureRmSubscription).Id
$myResourceGroup = "myResourceGroupScaleSet"
$myScaleSet = "myScaleSet"
$myLocation = "East US"
```


## Create a rule to automatically scale out
If your application demand increases, the load on the VM instances in your scale set increases. If this increased load is consistent, rather than just a brief demand, you can configure auto scale rules to increase the number of VM instances in the scale set. When these VM instances are created and your applications are deployed, the scale set starts to distribute traffic to them through the load balancer. You control what metrics to monitor, such as CPU or memory, how long the application load must meet a given threshold, and how many VM instances to add to the scale set.

Let's create a rule with [New-AzureRmAutoscaleRule]() that increases the number of VM instances in a scale set when the average CPU load is greater than 60% over a 5 minute period. When the rule triggers, the number of VM instances is increased by 20%. In scale sets with a small number of VM instances, you could leave out `-ScaleActionScaleType` and only specify `-ScaleActionValue` to increase by *1* or *2* instances. In scale sets with a large number of VM instances, an increase of 10% or 20% VM instances may be more appropriate.

The following parameters are used for this rule:

| Parameter               | Explanation                                                                                                          | Value          |
|-------------------------|----------------------------------------------------------------------------------------------------------------------|----------------|
| *-MetricName*           | The performance metric to monitor and apply scale set actions on.                                                    | Percentage CPU |
| *-Operator*             | Operator used to compare the metric data against the threshold.                                                      | Greater Than   |
| *-Threshold*            | The value that causes the auto scale rule to trigger an action.                                                      | 60%            |
| *-TimeGrain*            | How often the metrics are collected for analysis.                                                                    | 1 minute       |
| *-TimeWindow*           | The amount of time monitored before the metric and threshold values are compared.                                    | 5 minutes      |
| *-ScaleActionCooldown*  | The amount of time to wait before the rule is applied again so that the auto scale actions have time to take effect. | 5 minutes      |
| *-ScaleActionDirection* | Defines if the scale set should scale up or down when the rule applies.                                              | Increase       |
| *–ScaleActionScaleType* | Indicates that the number of VM instances should be change by a percentange amount.                                  | Percent Change |
| *-ScaleActionValue*     | How many VM instances should be scaled up or down when the rule applies.                                             | 1              |

The following example creates an object named *myRuleScaleOut* that holds this scale up rule. The *-MetricResourceId* uses the variables previously defined for the subscription ID, resource group name, and scale set name:

```powershell
$myRuleScaleOut = New-AzureRmAutoscaleRule `
  -MetricName "Percentage CPU" `
  -MetricResourceId /subscriptions/$mySubscriptionId/resourceGroups/$myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/$myScaleSet `
  -Operator GreaterThan `
  -MetricStatistic Average `
  -Threshold 60 `
  -TimeGrain 00:01:00 `
  -TimeWindow 00:05:00 `
  -ScaleActionCooldown 00:05:00 `
  -ScaleActionDirection Increase `
  –ScaleActionScaleType PercentChangeCount `
  -ScaleActionValue 20
```


## Create a rule to automatically scale in
On an evening or weekend, your application demand may decrease. If this decreased load is consistent over a period of time, you can configure auto scale rules to decrease the number of VM instances in the scale set. This scale in action reduces the cost to run your scale set as you only run the number of instances required to meet the current demand.

Create a rule with [New-AzureRmAutoscaleRule]() that decreases the number of VM instances in a scale set when the average CPU load then drops below 30% over a 5 minute period. When the rule triggers, the number of VM instances is decreased by 20%.The following example creates an object named *myRuleScaleDown* that holds this scale up rule. The *-MetricResourceId* uses the variables previously defined for the subscription ID, resource group name, and scale set name:

```powershell
$myRuleScaleIn = New-AzureRmAutoscaleRule `
  -MetricName "Percentage CPU" `
  -MetricResourceId /subscriptions/$mySubscriptionId/resourceGroups/$myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/$myScaleSet `
  -Operator LessThan `
  -MetricStatistic Average `
  -Threshold 30 `
  -TimeGrain 00:01:00 `
  -TimeWindow 00:05:00 `
  -ScaleActionCooldown 00:05:00 `
  -ScaleActionDirection Decrease `
  –ScaleActionScaleType PercentChangeCount `
  -ScaleActionValue 20
```


–ScaleActionScaleType PercentChangeCount 


## Define an auto scale profile
To associate your auto scale rules with a scale set, you create a profile. The auto scale profile defines the default, minimum, and maximum scale set capacity, and associates your auto scale rules. Create an auto scale profile with [New-AzureRmAutoscaleProfile](). The following example sets the default, and minimum, capacity of *2* VM instances, and a maximum of *10*. The scale out and scale in rules created in the preceding steps are then attached:

```powershell
$myScaleProfile = New-AzureRmAutoscaleProfile `
  -DefaultCapacity 2  `
  -MaximumCapacity 10 `
  -MinimumCapacity 2 `
  -Rules $myRuleScaleOut,$myRuleScaleIn `
  -Name "autoprofile"
```


## Apply auto scale rules to a scale set
The final step is to apply the auto scale profile to your scale set. Your scale is then able to automatically scale in or out based on the application demand. Apply the auto scale profile with [Add-AzureRmAutoscaleSetting]() as follows:

```powershell
Add-AzureRmAutoscaleSetting `
  -Location $myLocation `
  -Name "autosetting" `
  -ResourceGroup $myResourceGroup `
  -TargetResourceId /subscriptions/$mySubscriptionId/resourceGroups/$myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/$myScaleSet `
  -AutoscaleProfiles $myScaleProfile
```


## Monitor number of instances in a scale set
To see the number, and status, of VM instances, you can view a list of instances in your scale set with [Get-AzureRmVmssVM](). The status indicates if the VM instance is provisioning as the scale set automatically scales out, or is deprovisioning as the scale automatically scales in. The following example views the VM instance status for the scale set named *myScaleSet* in the resource group named *myResourceGroup*:

```powershell
Get-AzureRmVmssVM -ResourceGroupName "myResourceGroup" -VMScaleSetName "myScaleSet"
```


## Auto scale based on a schedule
The previous examples automatically scaled a scale set in or out based on basic host metrics such as CPU or memory usage. You can also create auto scales based on schedules. These schedule-based rules allow you to automatically scale out the number of VM instances ahead of an anticipated increase in application demand, such as core work hours, and then automatically scale in the number of instances at a time that you anticipate less demand, such as the weekend. To create auto scale rules based on a schedule rather than host metrics, use the Azure portal. Schedule-based rules cannot currently be created with Azure PowerShell.


## Use in-guest metrics of App Insights
In these examples, basic host metrics for CPU or memory usage were used. 


## Next steps
* For information on how to manage your VM instances, see [Manage virtual machine scale sets with Azure PowerShell](virtual-machine-scale-sets-windows-manage.md).
* Learn more about vertical scaling by reviewing [Vertical autoscale with Virtual Machine Scale sets](virtual-machine-scale-sets-vertical-scale-reprovision.md)
* Find examples of Azure Monitor monitoring features in [Azure Monitor PowerShell quick start samples](../monitoring-and-diagnostics/insights-powershell-samples.md)
* Learn about notification features in [Use autoscale actions to send email and webhook alert notifications in Azure Monitor](../monitoring-and-diagnostics/insights-autoscale-to-webhook-email.md)
* Learn how to [Use audit logs to send email and webhook alert notifications in Azure Monitor](../monitoring-and-diagnostics/insights-auditlog-to-webhook-email.md)

