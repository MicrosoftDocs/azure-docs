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



> [!NOTE]
> See [Configure monitoring in Azure Monitor for VMs guest health (preview)](vminsights-health-configure.md) for an explanation of health states and criteria and configuring them in the Azure portal. That article will assist you in determining the detailed monitoring that you want to configure. This article focuses on implementing that monitoring logic using data collection rules.


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

For example, the `memory|available` monitor does not specify a warning threshold or enable monitoring by default. Consider the following overrides applied to this monitor:

- Override 1 defines `alertConfiguration.isEnabled` property value as `true`
- Override 2 defines `monitorConfiguration.warningCondition` with with a threshold condition of `< 250`.

The resulting configuration would be a monitor that goes into a warning health state when less than 250Mb of memory is available and creates Severity 2 alert and also goes into critical health state when less than 100Mb of available memory is available and creates alert Severity 1 (or changes existing alert from severity 2 to 1 if it already existed).


If two overrides define the same property on the same monitor, one value will take precedence. Overrides will be applied based on their [scope](#global-scope), from the most general to the most specific. This means that the most specific overrides will have the greatest chance of being applied. The specific order is as follows:

1. Global 
2. Subscription
3. Resource group
4. Virtual machine. 

If multiple overrides at the same scope level define the same property on the same monitor, then they are applied in the order they appear in the DCR. If the overrides are in different DCRs, then they are applied in alphabetical order of the DCR resource IDs.


## Data collection rule configuration
The JSON elements in the data collection rule that define overrides are described in the following sections. A complete example is provided in [Sample data collection rule](sample-data-collection-rule.md).

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
Has the [healthRuleOverrides](#healthruleoverrides-element) which contains the definition for each override.

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
| `alertConfiguration` | No | Array of `healthRuleOverride` elements to be applied to default configuration. |
| `isEnabled` | Yes | Controls whether monitor is enabled or not. Disabled monitor switches to special *Disabled* health state and states disabled unless re-enabled. If omitted, monitor will inherit its status from parent monitor in the hierarchy. |


## scopes element
Each overrides has one or more scopes the define which virtual machines the override should be applied to. The scope can be a subscription, resource group, or a single virtual machine. Even if the override is in a DCR associated to a particular virtual machine, it's only applied to that virtual machine if the virtual machine is within one of the scopes of the override. This allows you to broadly associate a smaller number of DCRs to a set of VMs but provide granular control over the assignment of each override within the DCR itself. You may want to create small set of DCRs and association those to a set of virtual machines using policy while specifying health monitor overrides for different subsets of those virtual machines using scopes element.

The following table shows examples of different scopes.

| Scope | Example |
|:---|:---|
| Single virtual machine | `/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg-name/providers/Microsoft.Compute/virutalMachines/my-vm` |
| All virtual machines in a resource group | `/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg-name` |
| All virtual machines in a subscription | `/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups` |
| All virtual machines the data collection rule is associated with | `*` |


### monitors element
List of one or more strings that define which monitors in health hierarchy will receive this override. Each element can be the name of a monitor or a regular expression that matches the name of one or more monitors that will receive this override. 

```json
"monitors": [
    "<monitor name>"
 ],
```



The following table lists the current available monitor names.

| Name | Description | Example |
|:---|:---|:---|
| root | Top level monitor representing virtual machine health. | |
| cpu-utilization | CPU utilization monitor. | |
| logical-disks | Aggregate monitor for health state of all monitored disks on Windows virtual machine. | |
| logical-disks\|\<disk-name\> | Aggregate monitor tracking health of a given disk. | logical-disks\|C:<br>logical-disks\|D: |
| logical-disks\|\<disk-name\>\|free-space | Disk free space monitor on Windows VM. | logical-disks\|C:\|free-space |
| filesystems | Aggregate monitor for health of all filesystems on Linux VM. |
| filesystems\|\<mount-point\> | Aggregate monitor tracking health of a filesystem of Linux virtual machine. | filesystems|/var/log |
| filesystem\|\<mount-point\>\|free-space | Disk free space monitor on Linux virtual machine filesystem. | filesystems\|/var/log\|free-space |
| memory | Aggregate monitor for health of virtual machine memory. | |
| memory\|available | Monitor tracking available memory on the virtual machine. | |


## alertConfiguration element
Specifies whether an alert should be created from the monitor.

```json
"alertConfiguration": {
    "isEnabled": true|false
}
```

| Element | Mandatory | Description | 
|:---|:---|:---|
| `isEnabled` | Yes | If set to true, monitor will generate alert when switching to a critical or warning state and resolve alert when returning to healthy state. |


## monitorConfiguration element
Applies only to unit monitors. Defines the configuration for the monitor including health states and how they are calculated.

Parameters algorithm to calculate metric value to compare against thresholds. Instead of acting on one sample of data from underlying metric, monitor evaluates several metric samples received within window from evaluation time and `lookbackSec` ago. All samples received within that `timeframe` are considered and if count of samples is greater than `maxSamples`, older samples above `maxSamples` are ignored. 

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
| `evaluationFrequencySecs` | No | Defines frequency for health state evaluation. Each monitor is evaluated at the time agent starts and on a regular interval defined by this parameter thereafter. |
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
        "description": "The location code in which the data colleciton rule should be deployed. Examples: eastus, westeurope, etc"
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
              }
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