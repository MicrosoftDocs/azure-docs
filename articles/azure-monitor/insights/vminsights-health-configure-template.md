---
title: Configure monitoring in Azure Monitor for VMs guest health using resource manager template (preview)
description: Describes how to modify default monitoring in Azure Monitor for VMs guest health at scale using resource manager templates.
ms.subservice: 
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 10/15/2020

---

# Configure monitoring in Azure Monitor for VMs guest health using resource manager template (preview)
Azure Monitor for VMs guest health allows you to view the health of a virtual machine as defined by a set of performance measurements that are sampled at regular intervals. This article describes how you can modify default monitoring across multiple virtual machines using resource manager templates.

See [Configure monitoring in Azure Monitor for VMs guest health (preview)](vminsights-health-configure.md) for an explanation of health states and criteria and configuring them in the Azure portal. That article will assist you in determining the detailed monitoring that you want to configure. This article focuses on implementing that monitoring logic using resource manager templates.


## Overview
The default configuration for each monitor can't be changed, and you can't currently create new monitors. You can create one or more overrides that change different properties of the monitor. The override can defined any details of the monitor including the health states that should be enabled and the criteria for each state.

Overrides are defined in a [Data Collection Rule (DCR)](../platform/data-collection-rule-overview.md). You can create multiple DCRs with different sets of overrides and apply them to multiple virtual machines. You apply a DCR to a virtual machine by creating an association as described in [Configure data collection for the Azure Monitor agent (preview)](../platform/data-collection-rule-azure-monitor-agent.md#dcr-associations).


## How overrides are applied
A single monitor on a single virtual machine might have multiple overrides. Overrides will be applied from the most general to the most specific. This means that subscription level overrides are applied first, then resource group, then virtual machine. This means that the most specific overrides will have the greatest chance of being applied. If multiple overrides are applied at the same level, then they are applied in alphabetical order of their resource ID.


## extensions structure

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



## extensionSettings element

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

## healthRulesOverride element

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
| `scopes` | Yes | Array of one or more scopes that specify the virtual machines to which this override is applicable. Even though the DCR is associated with a virtual machine, the virtual machine must fall within a scope for the override to be applied. |
| `monitors` | Yes | Array of one or more strings that define which monitors in health hierarchy will receive this override.  |
| `alertConfiguration` | No | Array of `healthRuleOverride` elements to be applied to default configuration. |
| `isEnabled` | Yes | Controls whether monitor is enabled or not. Disabled monitor switches to special *Disabled* health state and states disabled unless re-enabled. If omitted, monitor will inherit its status from parent monitor in the hierarchy. |


## scopes element
Each overrides has one or more scopes the define which VMs the override should be applied to. The scope can be a subscription, resource group, or a single VM. Even if the override is in a DCR associated to a particular VM, it's only applied to that VM if the VM is within one of the scopes of the override. This allows you to broadly associate a smaller number of DCRs to a set of VMs but provide granular control over the assignment of each override within the DCR itself. You may want to create small set of DCRs and association those to a set of virtual machines using policy while specifying health monitor overrides for different subsets of those virtual machines using scopes element.

The following table shows examples of different scopes.

| Scope | Example |
|:---|:---|
| Single virtual machine | `/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg-name/providers/Microsoft.Compute/virutalMachines/my-vm` |
| All virtual machines in a resource group | `/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg-name` |
| All virtual machines in a subscription | `/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups` |
| All virtual machines DCR is associated with | `*` |


### monitors element

```json
"monitors": [
    "<monitor name>"
 ],
```

Array of one or more strings that define which monitors in health hierarchy will receive this override. Each element can be the name of a monitor or a regular expression that matches the name of one or more monitors that will receive this override. 

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

```json
"alertConfiguration": {
    "isEnabled": true|false
}
```

| Element | Mandatory | Description | 
|:---|:---|:---|
| isEnabled | Yes | If set to true, monitor will generate alert when switching to unhealthy (critical or warning) state and resolve alert when returning to healthy state. |


## monitorConfiguration element
Optional. Applies only to unit monitors. Defines parameters affecting what health state monitor is in based on underlying performance metric samples.

Define algorithm to calculate metric value to compare against thresholds. Instead of acting on one sample of data from underlying metric, monitor evaluates several metric samples received within window from evaluation time and loockbackSec ago. All samples received within that timeframe are considered and if count of samples is greater than maxSamples, older samples above maxSamples are ignored. 

In case there are less samples in lookback interval than minSamples, monitor will switch in to *Unknown* health state indicating there isn’t enough data to make informed decision about health of underlying metrics. If greater number of samples then minSamples is available, an aggregation function specified by evaluationType parameter us run over the set to calculate a single value.


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
| evaluationFrequencySecs | No | Defines frequency for health state evaluation. Each monitor is evaluated at the time agent starts and on a regular interval defined by this parameter thereafter. |
| lookbackSecs   | No | Size of lookback window in seconds. |
| evaluationType | No | `min` – take minimum value from entire sample set<br>`max` - take maximum value from entire sample set<br>`avg` – take average of samples set values<br>`all` – compare every single value in the set to thresholds. Monitor switches state if and only if all samples in the set satisfy threshold condition. |
| minSamples     | No | Minimum number of values to use to calculate value. |
| maxSamples     | No | Maximum number of values to use to calculate value. |


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
| isEnabled | No | Specifies whether condition is enabled. If set to “false”, condition is disabled even though threshold and operator properties may be set. |
| threshold | No | Defines threshold to compare evaluated value. |
| operator  | No | Defines comparison operator to use in threshold expression. Possible values: >, <, >=, <=, ==.<br>`value >= 90` |


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
| isEnabled | No | Specifies whether condition is enabled. If set to “false”, condition is disabled even though threshold and operator properties may be set. |
| threshold | No | Defines threshold to compare evaluated value. |
| operator  | No | Defines comparison operator to use in threshold expression. Possible values: >, <, >=, <=, ==.<br>`value >= 90` |

## Sample DCR
The following sample data collection rule shows an example of an override to configure monitoring.


```json
{
    "content": {
        "properties": {
            "dataSources": {
                "extensions": [
                    {
                        "name": "Microsoft-VMInsights-Health",
                        "stream": "Microsoft-HealthStateChange",
                        "extensionName": "HealthExtension",
                        "extensionSettings": {
                            "schemaVersion": "1.0",
                            "contentVersion": "content-2.0",
                            "healthRuleOverrides": [
                                {
                                    "scopes": [
                                        "/subscriptions/1234744a-bc3f-301a-bacd-52447a4ef718"
                                    ],
                                    "monitors": [
                                        "cpu-utilization"
                                    ],
                                    "isEnabled": true,
                                    "alertConfiguration": {
                                        "isEnabled": true
                                    },
                                    "monitorConfiguration": {
                                        "lookbackSecs": 240,
                                        "evaluationFrequencySecs": 120,
                                        "evaluationType": "Min",
                                        "minSamples": 2,
                                        "maxSamples": 3,
                                        "warningCondition": {
                                        "isEnabled": true,
                                        "operator": ">",
                                        "threshold": 50
                                        },
                                        "criticalCondition": {
                                        "isEnabled": true,
                                        "operator": ">",
                                        "threshold": 90
                                        }
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
                        "workspaceResourceId": "/subscriptions/1234744a-bc3f-301a-bacd-52447a4ef718/resourceGroups/rg-name/providers/Microsoft.OperationalInsights/workspaces/la-wks",
                        "workspaceId": "21ab0017-1d0a-467e-85c6-05a749b1e9cc",
                        "name": "my-workspace"
                    }
                ]
            },
            "dataFlows": [
                {
                    "streams": [
                        "Microsoft-HealthStateChange"
                    ],
                    "destinations": [
                        " my-workspace"
                    ]
                }
            ]
        },
        "location": "eastus",
        "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/vitalyf-demo1/providers/Microsoft.Insights/dataCollectionRules/Microsoft-VMInsights-Health",
        "name": "Microsoft-VMInsights-Health",
        "type": "Microsoft.Insights/dataCollectionRules",
        "etag": "\"0000140a-0000-0100-0000-5f5fdbf80000\""
    }
}
```
