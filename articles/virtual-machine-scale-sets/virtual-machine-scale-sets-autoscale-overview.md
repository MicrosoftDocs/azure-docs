---
title: Automatic scaling and virtual machine scale sets | Microsoft Docs
description: Learn about using diagnostics and autoscale resources to automatically scale virtual machines in a scale set.
services: virtual-machine-scale-sets
documentationcenter: ''
author: Thraka
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: d29a3385-179e-4331-a315-daa7ea5701df
ms.service: virtual-machine-scale-sets
ms.workload: infrastructure-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/05/2017
ms.author: adegeo
ms.custom: H1Hack27Feb2017

---
# How to use automatic scaling and Virtual Machine Scale Sets
Automatic scaling of virtual machines in a scale set is the creation or deletion of machines in the set as needed to match performance requirements. As the volume of work grows, an application may require additional resources to enable it to effectively perform tasks.

Automatic scaling is an automated process that helps ease management overhead. By reducing overhead, you don't need to continually monitor system performance or decide how to manage resources. Scaling is an elastic process. More resources can be added as the load increases. And as demand decreases, resources can be removed to minimize costs and maintain performance levels.

Set up automatic scaling on a scale set by using an Azure Resource Manager template, Azure PowerShell, Azure CLI, or the Azure portal.

## Set up scaling by using Resource Manager templates
Rather than deploying and managing each resource of your application separately, use a template that deploys all resources in a single, coordinated operation. In the template, application resources are defined and deployment parameters are specified for different environments. The template consists of JSON and expressions that you can use to construct values for your deployment. To learn more, look at [Authoring Azure Resource Manager templates](../azure-resource-manager/resource-group-authoring-templates.md).

In the template, you specify the capacity element:

```json
"sku": {
  "name": "Standard_A0",
  "tier": "Standard",
  "capacity": 3
},
```

Capacity identifies the number of virtual machines in the set. You can manually change the capacity by deploying a template with a different value. If you are deploying a template to only change the capacity, you can include only the SKU element with the updated capacity.

The capacity of your scale set can be automatically adjusted by using a combination of the **autoscaleSettings** resource and the diagnostics extension.

### Configure the Azure Diagnostics extension
Automatic scaling can only be done if metrics collection is successful on each virtual machine in the scale set. The Azure Diagnostics Extension provides the monitoring and diagnostics capabilities that meets the metrics collection needs of the autoscale resource. You can install the extension as part of the Resource Manager template.

This example shows the variables that are used in the template to configure the diagnostics extension:

```json
"diagnosticsStorageAccountName": "[concat(parameters('resourcePrefix'), 'saa')]",
"accountid": "[concat('/subscriptions/',subscription().subscriptionId,'/resourceGroups/', resourceGroup().name,'/providers/', 'Microsoft.Storage/storageAccounts/', variables('diagnosticsStorageAccountName'))]",
"wadlogs": "<WadCfg> <DiagnosticMonitorConfiguration overallQuotaInMB=\"4096\" xmlns=\"http://schemas.microsoft.com/ServiceHosting/2010/10/DiagnosticsConfiguration\"> <DiagnosticInfrastructureLogs scheduledTransferLogLevelFilter=\"Error\"/> <WindowsEventLog scheduledTransferPeriod=\"PT1M\" > <DataSource name=\"Application!*[System[(Level = 1 or Level = 2)]]\" /> <DataSource name=\"Security!*[System[(Level = 1 or Level = 2)]]\" /> <DataSource name=\"System!*[System[(Level = 1 or Level = 2)]]\" /></WindowsEventLog>",
"wadperfcounter": "<PerformanceCounters scheduledTransferPeriod=\"PT1M\"><PerformanceCounterConfiguration counterSpecifier=\"\\Processor(_Total)\\Thread Count\" sampleRate=\"PT15S\" unit=\"Percent\"><annotation displayName=\"Thread Count\" locale=\"en-us\"/></PerformanceCounterConfiguration></PerformanceCounters>",
"wadcfgxstart": "[concat(variables('wadlogs'),variables('wadperfcounter'),'<Metrics resourceId=\"')]",
"wadmetricsresourceid": "[concat('/subscriptions/',subscription().subscriptionId,'/resourceGroups/',resourceGroup().name ,'/providers/','Microsoft.Compute/virtualMachineScaleSets/',parameters('vmssName'))]",
"wadcfgxend": "[concat('\"><MetricAggregation scheduledTransferPeriod=\"PT1H\"/><MetricAggregation scheduledTransferPeriod=\"PT1M\"/></Metrics></DiagnosticMonitorConfiguration></WadCfg>')]"
```

Parameters are provided when the template is deployed. In this example, the name of the storage account (where data is stored) and the name of the scale set (where data is collected) are provided. Also in this Windows Server example, only the Thread Count performance counter is collected. All the available performance counters in Windows or Linux can be used to collect diagnostics information and can be included in the extension configuration.

This example shows the definition of the extension in the template:

```json
"extensionProfile": {
  "extensions": [
    {
      "name": "Microsoft.Insights.VMDiagnosticsSettings",
      "properties": {
        "publisher": "Microsoft.Azure.Diagnostics",
        "type": "IaaSDiagnostics",
        "typeHandlerVersion": "1.5",
        "autoUpgradeMinorVersion": true,
        "settings": {
          "xmlCfg": "[base64(concat(variables('wadcfgxstart'),variables('wadmetricsresourceid'),variables('wadcfgxend')))]",
          "storageAccount": "[variables('diagnosticsStorageAccountName')]"
        },
        "protectedSettings": {
          "storageAccountName": "[variables('diagnosticsStorageAccountName')]",
          "storageAccountKey": "[listkeys(variables('accountid'), variables('apiVersion')).key1]",
          "storageAccountEndPoint": "https://core.windows.net"
        }
      }
    }
  ]
}
```

When the diagnostics extension runs, the data is stored and collected in a table, in the storage account that you specify. In the **WADPerformanceCounters** table, you can find the collected data:

![](./media/virtual-machine-scale-sets-autoscale-overview/ThreadCountBefore2.png)

### Configure the autoScaleSettings resource
The autoscaleSettings resource uses the information from the diagnostics extension to decide whether to increase or decrease the number of virtual machines in the scale set.

This example shows the configuration of the resource in the template:

```json
{
  "type": "Microsoft.Insights/autoscaleSettings",
  "apiVersion": "2015-04-01",
  "name": "[concat(parameters('resourcePrefix'),'as1')]",
  "location": "[resourceGroup().location]",
  "dependsOn": [
    "[concat('Microsoft.Compute/virtualMachineScaleSets/',parameters('vmSSName'))]"
  ],
  "properties": {
    "enabled": true,
    "name": "[concat(parameters('resourcePrefix'),'as1')]",
    "profiles": [
      {
        "name": "Profile1",
        "capacity": {
          "minimum": "1",
          "maximum": "10",
          "default": "1"
        },
        "rules": [
          {
            "metricTrigger": {
              "metricName": "\\Process(_Total)\\Thread Count",
              "metricNamespace": "",
              "metricResourceUri": "[concat('/subscriptions/',subscription().subscriptionId, '/resourceGroups/', resourceGroup().name, '/providers/Microsoft.Compute/virtualMachineScaleSets/', parameters('vmSSName'))]",
              "timeGrain": "PT1M",
              "statistic": "Average",
              "timeWindow": "PT5M",
              "timeAggregation": "Average",
              "operator": "GreaterThan",
              "threshold": 650
            },
            "scaleAction": {
              "direction": "Increase",
              "type": "ChangeCount",
              "value": "1",
              "cooldown": "PT5M"
            }
          },
          {
            "metricTrigger": {
              "metricName": "\\Process(_Total)\\Thread Count",
              "metricNamespace": "",
              "metricResourceUri": "[concat('/subscriptions/',subscription().subscriptionId, '/resourceGroups/', resourceGroup().name, '/providers/Microsoft.Compute/virtualMachineScaleSets/', parameters('vmSSName'))]",
              "timeGrain": "PT1M",
              "statistic": "Average",
              "timeWindow": "PT5M",
              "timeAggregation": "Average",
              "operator": "LessThan",
              "threshold": 550
            },
            "scaleAction": {
              "direction": "Decrease",
              "type": "ChangeCount",
              "value": "1",
              "cooldown": "PT5M"
            }
          }
        ]
      }
    ],
    "targetResourceUri": "[concat('/subscriptions/', subscription().subscriptionId, '/resourceGroups/', resourceGroup().name, '/providers/Microsoft.Compute/virtualMachineScaleSets/', parameters('vmSSName'))]"
  }
}
```

In the example above, two rules are created for defining the automatic scaling actions. The first rule defines the scale-out action and the second rule defines the scale-in action. These values are provided in the rules:

| Rule | Description |
| ---- | ----------- |
| metricName        | This value is the same as the performance counter that you defined in the wadperfcounter variable for the diagnostics extension. In the example above, the Thread Count counter is used.    |
| metricResourceUri | This value is the resource identifier of the virtual machine scale set. This identifier contains the name of the resource group, the name of the resource provider, and the name of the scale set to scale. |
| timeGrain         | This value is the granularity of the metrics that are collected. In the preceding example, data is collected on an interval of one minute. This value is used with timeWindow. |
| statistic         | This value determines how the metrics are combined to accommodate the automatic scaling action. The possible values are: Average, Min, Max. |
| timeWindow        | This value is the range of time in which instance data is collected. It must be between 5 minutes and 12 hours. |
| timeAggregation   | This value determines how the data that is collected should be combined over time. The default value is Average. The possible values are: Average, Minimum, Maximum, Last, Total, Count. |
| operator          | This value is the operator that is used to compare the metric data and the threshold. The possible values are: Equals, NotEquals, GreaterThan, GreaterThanOrEqual, LessThan, LessThanOrEqual. |
| threshold         | This value is the value that triggers the scale action. Be sure to provide a sufficient difference between the threshold values for the **scale-out** and **scale-in** actions. If you set the same values for both actions, the system anticipates constant change, which prevents it from implementing a scaling action. For example, setting both to 600 threads in the preceding example doesn't work. |
| direction         | This value determines the action that is taken when the threshold value is achieved. The possible values are Increase or Decrease. |
| type              | This value is the type of action that should occur and must be set to ChangeCount. |
| value             | This value is the number of virtual machines that are added to or removed from the scale set. This value must be 1 or greater. |
| cooldown          | This value is the amount of time to wait since the last scaling action before the next action occurs. This value must be between one minute and one week. |

Depending on the performance counter, you are using, some of the elements in the template configuration are used differently. In the preceding example, the performance counter is Thread Count, the threshold value is 650 for a scale-out action, and the threshold value is 550 for the scale-in action. If you use a counter such as %Processor Time, the threshold value is set to the percentage of CPU usage that determines a scaling action.

When a scaling action is triggered, such as a high load, the capacity of the set is increased based on the value in the template. For example, in a scale set where the capacity is set to 3 and the scale action value is set to 1:

![](./media/virtual-machine-scale-sets-autoscale-overview/ResourceExplorerBefore.png)

When the current load causes the average thread count to go above the threshold of 650:

![](./media/virtual-machine-scale-sets-autoscale-overview/ThreadCountAfter.png)

A **scale-out** action is triggered that causes the capacity of the set to be increased by one:

```json
"sku": {
  "name": "Standard_A0",
  "tier": "Standard",
  "capacity": 4
},
```

The result is a virtual machine is added to the scale set:

![](./media/virtual-machine-scale-sets-autoscale-overview/ResourceExplorerAfter.png)

After a cooldown period of five minutes, if the average number of threads on the machines stays over 600, another machine is added to the set. If the average thread count stays below 550, the capacity of the scale set is reduced by one and a machine is removed from the set.

## Set up scaling using Azure PowerShell

To see examples of using PowerShell to set up autoscaling, look at [Azure Monitor PowerShell quick start samples](../monitoring-and-diagnostics/insights-powershell-samples.md).

## Set up scaling using Azure CLI

To see examples of using Azure CLI to set up autoscaling, look at [Azure Monitor Cross-platform CLI quick start samples](../monitoring-and-diagnostics/insights-cli-samples.md).

## Set up scaling using the Azure portal

To see an example of using the Azure portal to set up autoscaling, look at [Create a Virtual Machine Scale Set using the Azure portal](virtual-machine-scale-sets-portal-create.md).

## Investigate scaling actions

* **Azure portal**  
You can currently get a limited amount of information using the portal.

* **Azure Resource Explorer**  
This tool is the best for exploring the current state of your scale set. Follow this path and you should see the instance view of the scale set that you created:  
**Subscriptions > {your subscription} > resourceGroups > {your resource group} > providers > Microsoft.Compute > virtualMachineScaleSets > {your scale set} > virtualMachines**

* **Azure PowerShell**  
Use this command to get some information:

  ```powershell
  Get-AzureRmResource -name vmsstest1 -ResourceGroupName vmsstestrg1 -ResourceType Microsoft.Compute/virtualMachineScaleSets -ApiVersion 2015-06-15
  Get-Autoscalesetting -ResourceGroup rainvmss -DetailedOutput
  ```

* Connect to the jumpbox virtual machine just like you would any other machine and then you can remotely access the virtual machines in the scale set to monitor individual processes.

## Next Steps
* Look at [Automatically scale machines in a Virtual Machine Scale Set](virtual-machine-scale-sets-windows-autoscale.md) to see an example of how to create a scale set with automatic scaling configured.

* Find examples of Azure Monitor monitoring features in [Azure Monitor PowerShell quick start samples](../monitoring-and-diagnostics/insights-powershell-samples.md)

* Learn about notification features in [Use autoscale actions to send email and webhook alert notifications in Azure Monitor](../monitoring-and-diagnostics/insights-autoscale-to-webhook-email.md).

* Learn about how to [Use audit logs to send email and webhook alert notifications in Azure Monitor](../monitoring-and-diagnostics/insights-auditlog-to-webhook-email.md)

* Learn about [advanced autoscale scenarios](virtual-machine-scale-sets-advanced-autoscale.md).
