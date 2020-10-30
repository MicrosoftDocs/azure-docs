---
title: Configure monitoring in Azure Monitor for VMs guest health using data collection rules (preview)
description: Describes how to modify default monitoring in Azure Monitor for VMs guest health at scale using resource manager templates.
ms.subservice: 
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 10/15/2020

---

# Configure monitoring in Azure Monitor for VMs guest health using data collection rules (preview)
[Azure Monitor for VMs guest health](vminsights-health-overview.md) allows you to view the health of a virtual machine as defined by a set of performance measurements that are sampled at regular intervals. This article describes how you can modify default monitoring across multiple virtual machines using data collection rules.


## Monitors
The health state of a virtual machine is determined by the [rollup of health](vminsights-health-overview.md#health-rollup-policy) from each of its monitors. There are two types of monitors in Azure Monitor for VMs guest health as shown in the following table.

| Monitor |	Description |
|:---|:---|
| Unit monitor | Measures some aspect of a resource or application. This might be checking a performance counter to determine the performance of the resource, or its availability. |
| Aggregate Monitor | Groups multiple monitors to provide a single aggregated health state. An aggregate monitor can contain one or more unit monitors and other aggregate monitors. |

The set of monitors used by Azure Monitor for VMs guest health and their configuration can't be directly changed. You can create [overrides](#overrides) though which modify the behavior of the default configuration. Overrides are defined in data collection rules. You can create multiple data collection rules each containing multiple overrides to achieve your required monitoring configuration.

## Monitor properties
The following table describes the properties that can be configured on each monitor.

| Property | Monitors | Description |
|:---|:---|:---|
| Enabled | Aggregate<br>Unit | If true, the state  monitor is calculated and contributes to the health of the virtual machine. It can triiger an alert of alerting is enabled. |
| Alerting | Aggregate<br>Unit | If true, an alert is triggered for the monitor when it moves to an unhealthy state. If false, the state of the monitor will still contribute to the health of the virtual machine which could trigger an alert. |
| Warning | Unit | Criteria for the warning state. If none, then the monitor will never enter a warning state. |
| Critical | Unit | Criteria for the critical state. If none, then the monitor will never enter a critical state. |
| Evaluation frequency | Unit | Frequency the health state is evaluated. |
| Lookback | Unit | Size of lookback window in seconds. See [monitorConfiguration element](#monitorconfiguration-element) for detailed description. |
| Evaluation Type | Unit | Defines which value to use from the sample set. See [monitorConfiguration element](#monitorconfiguration-element) for detailed description. |
| Min sample | Unit | Minimum number of values to use to calculate value. |
| Max sample | Unit | Maximum number of values to use to calculate value. |


## Default configuration
The following table lists the default configuration for each monitor. This default configuration can't be directly changed, but you can define [overrides](#overrides) that will modify the monitor configuration for certain virtual machines.


| Monitor | Enabled | Alerting | Warning | Critical | Evaluation Frequency | Lookback | Evaluation type | Min sample | Max samples |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| CPU utilization  | True | False | None | \> 90%    | 60 sec | 240 sec | Min | 2 | 3 |
| Available memory | True | False | None | \< 100 MB | 60 sec | 240 sec | Max | 2 | 3 |
| File system      | True | False | None | \< 100 MB | 60 sec | 120 sec | Max | 1 | 1 |


## Overrides
An *override* changes one ore more properties of a monitor. For example, an override could disable a monitor that's enabled by default, define warning criteria for the monitor, or modify the monitor's critical threshold. 

Overrides are defined in a [Data Collection Rule (DCR)](../platform/data-collection-rule-overview.md). You can create multiple DCRs with different sets of overrides and apply them to multiple virtual machines. You apply a DCR to a virtual machine by creating an association as described in [Configure data collection for the Azure Monitor agent (preview)](../platform/data-collection-rule-azure-monitor-agent.md#dcr-associations).


## Multiple overrides

A single monitor may have multiple overrides. If the overrides define different properties, then the resulting configuration is a combination of all the overrides.

For example, the `memory|available` monitor does not specify a warning threshold or enable alerting by default. Consider the following overrides applied to this monitor:

- Override 1 defines `alertConfiguration.isEnabled` property value as `true`
- Override 2 defines `monitorConfiguration.warningCondition` with with a threshold condition of `< 250`.

The resulting configuration would be a monitor that goes into a warning health state when less than 250Mb of memory is available and creates Severity 2 alert and also goes into critical health state when less than 100Mb of available memory is available and creates alert Severity 1 (or changes existing alert from severity 2 to 1 if it already existed).

If two overrides define the same property on the same monitor, one value will take precedence. Overrides will be applied based on their [scope](#scopes-element), from the most general to the most specific. This means that the most specific overrides will have the greatest chance of being applied. The specific order is as follows:

1. Global 
2. Subscription
3. Resource group
4. Virtual machine. 

If multiple overrides at the same scope level define the same property on the same monitor, then they are applied in the order they appear in the DCR. If the overrides are in different DCRs, then they are applied in alphabetical order of the DCR resource IDs.


## Data collection rule configuration
The JSON elements in the data collection rule that define overrides are described in the following sections. A complete example is provided in [Sample data collection rule](#sample-data-collection-rule).

## extensions structure
Guest health is implemented as an extension to the Azure Monitor agent, so overrides are defined in the `extensions` element of the data collection rule. 

```json
"extensions": [
    {
        "name": "Microsoft-VMInsights-Health",
        "streams": [
            "Microsoft-HealthStateChange"
        ],
        "extensionName": "HealthExtension",
        "extensionSettings": {   }
    }
]
```

| Element | Required | Description |
|:---|:---|:---|
| `name` | Yes | User defined string for the extension. |
| `streams` | Yes | List of streams that guest health data will be sent to. This must include **Microsoft-HealthStateChange**.  |
| `extensionName` | Yes | Name of the extension. This must be **HealthExtension**. |
| `extensionSettings` | Yes | Array of `healthRuleOverride` elements to be applied to default configuration. |


## extensionSettings element
Contains settings for the extension.

```json
"extensionSettings": {
    "schemaVersion": "1.0",
    "contentVersion": "",
    "healthRuleOverrides": [ ]
}
```

| Element | Required | Description |
|:---|:---|:---|
| `schemaVersion` | Yes | String defined by Microsoft to represent expected schema of the element. Currently must be set to 1.0 |
| `contentVersion` | No | String defined by user to track different versions of the health configuration, if required. |
| `healthRuleOverrides` | Yes | Array of `healthRuleOverride` elements to be applied to default configuration. |

## healthRulesOverrides element
Contains one or more `healthRuleOverride` elements that each define an override.

```json
"healthRuleOverrides": [
    {
        "scopes": [ ],
        "monitors": [ ],
        "monitorConfiguration": { },
        "alertConfiguration": {  },
        "isEnabled": true|false
    }
]
```

| Element | Required | Description |
|:---|:---|:---|
| `scopes` | Yes | List of one or more scopes that specify the virtual machines to which this override is applicable. Even though the DCR is associated with a virtual machine, the virtual machine must fall within a scope for the override to be applied. |
| `monitors` | Yes | List of one or more strings that define which monitors will receive this override.  |
| `monitorConfiguration` | No | Configuration for the monitor including health states and how they are calculated. |
| `alertConfiguration` | No | Alerting configuration for the monitor. |
| `isEnabled` | No | Controls whether monitor is enabled or not. Disabled monitor switches to special *Disabled* health state and states disabled unless re-enabled. If omitted, monitor will inherit its status from parent monitor in the hierarchy. |


## scopes element
Each overrides has one or more scopes the define which virtual machines the override should be applied to. The scope can be a subscription, resource group, or a single virtual machine. Even if the override is in a DCR associated to a particular virtual machine, it's only applied to that virtual machine if the virtual machine is within one of the scopes of the override. This allows you to broadly associate a smaller number of DCRs to a set of VMs but provide granular control over the assignment of each override within the DCR itself. You may want to create small set of DCRs and association those to a set of virtual machines using policy while specifying health monitor overrides for different subsets of those virtual machines using scopes element.

The following table shows examples of different scopes.

| Scope | Example |
|:---|:---|
| Single virtual machine | `/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg-name/providers/Microsoft.Compute/virutalMachines/my-vm` |
| All virtual machines in a resource group | `/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg-name` |
| All virtual machines in a subscription | `/subscriptions/00000000-0000-0000-0000-000000000000/` |
| All virtual machines the data collection rule is associated with | `*` |


### monitors element
List of one or more strings that define which monitors in health hierarchy will receive this override. Each element can be a monitor name or type name that matches one or more monitors that will receive this override. 

```json
"monitors": [
    "<monitor name>"
 ],
```



The following table lists the current available monitor names.

| Type name | Name | Description |
|:---|:---|:---|
| root | root | Top level monitor representing virtual machine health. | |
| cpu-utilization | cpu-utilization | CPU utilization monitor. | |
| logical-disks | logical-disks | Aggregate monitor for health state of all monitored disks on Windows virtual machine. | |
| logical-disks\|* | logical-disks\|C:<br>logical-disks\|D: | Aggregate monitor tracking health of a given disk on Windows virtual machine. | 
| logical-disks\|*\|free-space | logical-disks\|C:\|free-space<br>logical-disks\|D:\|free-space | Disk free space monitor on Windows virtual machine. |
| filesystems | filesystems | Aggregate monitor for health of all filesystems on Linux virtual machine. |
| filesystems\|* | filesystems\|/<br>filesystems\|/mnt | Aggregate monitor tracking health of a filesystem of Linux virtual machine. | filesystems|/var/log |
| filesystems\|*\|free-space | filesystems\|/\|free-space<br>filesystems\|/mnt\|free-space | Disk free space monitor on Linux virtual machine filesystem. | 
| memory | memory | Aggregate monitor for health of virtual machine memory. | |
| memory\|available| memory\|available | Monitor tracking available memory on the virtual machine. | |


## alertConfiguration element
Specifies whether an alert should be created from the monitor.

```json
"alertConfiguration": {
    "isEnabled": true|false
}
```

| Element | Mandatory | Description | 
|:---|:---|:---|
| `isEnabled` | No | If set to true, monitor will generate alert when switching to a critical or warning state and resolve alert when returning to healthy state. If false or omitted, no alert is generated.  |


## monitorConfiguration element
Applies only to unit monitors. Defines the configuration for the monitor including health states and how they are calculated.

Parameters define the algorithm to calculate the metric value to compare against thresholds. Instead of acting on one sample of data from underlying metric, the monitor evaluates several metric samples received within window from evaluation time and `lookbackSec` ago. All samples received within that timeframe are considered and if count of samples is greater than `maxSamples`, older samples above `maxSamples` are ignored. 

In case there are less samples in lookback interval than `minSamples`, monitor will switch in to *Unknown* health state indicating there isn’t enough data to make informed decision about health of underlying metrics. If greater number of samples then `minSamples` is available, an aggregation function specified by evaluationType parameter us run over the set to calculate a single value.


```json
"monitorConfiguration": {
        "evaluationType" : "<type-of-evaluation>",
        "lookbackSecs": <lookback-number-of-seconds>,
        "evaluationFrequencySecs": <evaluation-frequency-number-of-seconds>,
        "minSamples": <minimum-samples>,
        "maxSamples": <maximum-samples>,
        "warningCondition": {  },
        "criticalCondition": {  }
    }
}
```

| Element | Mandatory | Description | 
|:---|:---|:---|
| `evaluationFrequencySecs` | No | Defines frequency for health state evaluation. Each monitor is evaluated at the time the agent starts and on a regular interval defined by this parameter thereafter. |
| `lookbackSecs`   | No | Size of lookback window in seconds. |
| `evaluationType` | No | `min` – take minimum value from entire sample set<br>`max` - take maximum value from entire sample set<br>`avg` – take average of samples set values<br>`all` – compare every single value in the set to thresholds. Monitor switches state if and only if all samples in the set satisfy threshold condition. |
| `minSamples`     | No | Minimum number of values to use to calculate value. |
| `maxSamples`     | No | Maximum number of values to use to calculate value. |
| `warningCondition`  | No | Threshold and comparison logic for the warning condition. |
| `criticalCondition` | No | Threshold and comparison logic for the critical condition. |


## warningCondition element
Defines threshold and comparison logic for the warning condition. If this element isn't included, then the monitor will never switch to the warning health state.

```json
"warningCondition": {
    "isEnabled": true|false,
    "operator": "<comparison-operator>",
    "threshold": <threshold-value>
},
```

| Property | Mandatory | Description | 
|:---|:---|:---|
| `isEnabled` | No | Specifies whether condition is enabled. If set to **false**, condition is disabled even though threshold and operator properties may be set. |
| `threshold` | No | Defines threshold to compare evaluated value. |
| `operator`  | No | Defines comparison operator to use in threshold expression. Possible values: >, <, >=, <=, ==. |


## criticalCondition element
Defines threshold and comparison logic for the critical condition. If this element isn't included, then the monitor will never switch to the critical health state.

```json
"criticalCondition": {
    "isEnabled": true|false,
    "operator": "<comparison-operator>",
    "threshold": <threshold-value>
},
```

| Property | Mandatory | Description | 
|:---|:---|:---|
| `isEnabled` | No | Specifies whether condition is enabled. If set to **false**, condition is disabled even though threshold and operator properties may be set. |
| `threshold` | No | Defines threshold to compare evaluated value. |
| `operator`  | No | Defines comparison operator to use in threshold expression. Possible values: >, <, >=, <=, ==. |

## Sample data collection rule
The following sample data collection rule shows an example of an override to configure monitoring.


```json
{
  "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "defaultHealthDataCollectionRuleName": {
      "type": "string",
      "metadata": {
        "description": "Specifies the name of the data collection rule to create."
      },
      "defaultValue": "Microsoft-VMInsights-Health"
    },
    "destinationWorkspaceResourceId": {
      "type": "string",
      "metadata": {
        "description": "Specifies the Azure resource ID of the Log Analytics workspace to use to store virtual machine health data."
      }
    },
    "dataCollectionRuleLocation": {
      "type": "string",
      "metadata": {
        "description": "The location code in which the data collection rule should be deployed. Examples: eastus, westeurope, etc"
      }
    }
  },
  "resources": [
    {
      "type": "Microsoft.Insights/dataCollectionRules",
      "name": "[parameters('defaultHealthDataCollectionRuleName')]",
      "location": "[parameters('dataCollectionRuleLocation')]",
      "apiVersion": "2019-11-01-preview",
      "properties": {
        "description": "Data collection rule for VM Insights health.",
        "dataSources": {
          "performanceCounters": [
              {
                  "name": "VMHealthPerfCounters",
                  "streams": [ "Microsoft-Perf" ],
                  "scheduledTransferPeriod": "PT1M",
                  "samplingFrequencyInSeconds": 60,
                  "counterSpecifiers": [
                      "\\LogicalDisk(*)\\% Free Space",
                      "\\Memory\\Available Bytes",
                      "\\Processor(_Total)\\% Processor Time"
                  ]
              }
          ],
          "extensions": [
            {
              "name": "Microsoft-VMInsights-Health",
              "streams": [
                "Microsoft-HealthStateChange"
              ],
              "extensionName": "HealthExtension",
              "extensionSettings": {
                "schemaVersion": "1.0",
                "contentVersion": "",
                "healthRuleOverrides": [
                  {
                    "scopes": [ "*" ],
                    "monitors": ["root"],
                    "alertConfiguration": {
                      "isEnabled": true
                    }
                  }
                ]
              },
              "inputDataSources": [
                  "VMHealthPerfCounters"
              ]

            }
          ]
        },
        "destinations": {
          "logAnalytics": [
            {
              "workspaceResourceId": "[parameters('destinationWorkspaceResourceId')]",
              "name": "Microsoft-HealthStateChange-Dest"
            }
          ]
        },					
        "dataFlows": [
          {
            "streams": [
              "Microsoft-HealthStateChange"
            ],
            "destinations": [
              "Microsoft-HealthStateChange-Dest"
            ]
          }
        ]
      }
    }
  ]
}
```

## Next steps

- Read more about [data collection rules](../platform/data-collection-rule-overview.md).