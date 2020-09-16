---
title: Configure monitoring in Azure Monitor for VMs guest health using resource manager template (preview)
description: Describes how to modify default monitoring in Azure Monitor for VMs guest health at scale using resource manager templates.
ms.subservice: 
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 09/08/2020

---

# Configure monitoring in Azure Monitor for VMs guest health using resource manager template (preview)
Azure Monitor for VMs guest health allows you to view the health of a virtual machine as defined by a set of performance measurements that are sampled at regular intervals. This article describes how you can modify default monitoring across multiple virtual machines using resource manager templates.

See [Configure monitoring in Azure Monitor for VMs guest health (preview)](vminsights-health-configure.md) for an explanation of health states and criteria and configuring them in the Azure portal. That article will assist you in determining the detailed monitoring that you want to configure. This article focuses on implementing that monitoring logic using resource manager templates.


## Overview
The default configuration for each monitor can't be changed, and you can't currently create new monitors. You can create one or more overrides that change different properties of the monitor. The override can defined any details of the monitor including the health states that should be enabled and the criteria for each state.

Overrides are defined in a [Data Collection Rule (DCR)](../platform/data-collection-rule-overview.md). You can create multiple DCRs with different sets of overrides and apply them to multiple virtual machines. You apply a DCR to a virtual machine by creating an association as described in [Configure data collection for the Azure Monitor agent (preview)](../platform/data-collection-rule-azure-monitor-agent.md#dcr-associations).


## Scope
Each overrides has one or more scopes the define which VMs the override should be applied to. The scope can be a subscription, resource group, or a single VM. Even if the override is in a DCR associated to a particular VM, it's only applied to that VM if the VM is within one of the scopes of the override. This allows you to broadly associate a smaller number of DCRs to a set of VMs but provide granular control over the assignment over the assignment of each override within the DCR itself.

## How overrides are applied
A single monitor on a single virtual machine might have multiple overrides. Overrides will be applied from the most general to the most specific. This means that subscription level overrides are applied first, then resource group, then virtual machine. This means that the most specific overrides will have the greatest chance of being applied. If multiple overrides are applied at the same level, then they are applied in alphabetical order of their resource ID.


## Sample DCR
The following sample data collection rule shows an example of an override to configure monitoring.


```json
{
    "content": {
        "properties": {
            "description": "Data collection rule for VM Insights health.",
            "immutableId": "dcr-989fa9df0a1240d2bdbb138324432b38",
            "dataSources": {
                "extensions": [
                    {
                        "streams": [
                            "Microsoft-HealthStateChange"
                        ],
                        "extensionName": "HealthExtension",
                        "extensionSettings": {
                            "schemaVersion": "1.0",
                            "contentVersion": "2020-09-14T21:09:11.304Z",
                            "healthRuleOverrides": [
                                {
                                    "scopes": [
                                        "/subscriptions/a7f23fdb-e626-4f95-89aa-3a360a90861e/resourcegroups/vitalyf-demo1/providers/microsoft.compute/virtualmachines/vitalyf-win1-demo1"
                                    ],
                                    "monitorName": "logical-disks|D:|free-space",
                                    "monitorConfiguration": {
                                        "criticalCondition": {
                                            "isEnabled": true,
                                            "operator": "<",
                                            "threshold": 5
                                        },
                                        "warningCondition": {
                                            "isEnabled": false
                                        }
                                    }
                                },
                                {
                                    "scopes": [
                                        "/subscriptions/a7f23fdb-e626-4f95-89aa-3a360a90861e/resourcegroups/vitalyf-demo1/providers/microsoft.compute/virtualmachines/vitalyf-win1-demo1"
                                    ],
                                    "monitorName": "logical-disks|C:|free-space",
                                    "monitorConfiguration": {
                                        "criticalCondition": {
                                            "isEnabled": true,
                                            "operator": "<",
                                            "threshold": 5
                                        },
                                        "warningCondition": {
                                            "isEnabled": false
                                        }
                                    }
                                }
                            ]
                        },
                        "name": "Microsoft-VMInsights-Health"
                    }
                ]
            },
            "destinations": {
                "logAnalytics": [
                    {
                        "workspaceResourceId": "/subscriptions/a7f23fdb-e626-4f95-89aa-3a360a90861e/resourcegroups/vitalyf-demo1/providers/microsoft.operationalinsights/workspaces/vitalyf-demo1-wks-eus",
                        "workspaceId": "b65e9900-e3dc-4cd7-8a6e-eb08924f1060",
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
            ],
            "provisioningState": "Succeeded"
        },
        "location": "eastus",
        "id": "/subscriptions/a7f23fdb-e626-4f95-89aa-3a360a90861e/resourceGroups/vitalyf-demo1/providers/Microsoft.Insights/dataCollectionRules/Microsoft-VMInsights-Health",
        "name": "Microsoft-VMInsights-Health",
        "type": "Microsoft.Insights/dataCollectionRules",
        "etag": "\"0000140a-0000-0100-0000-5f5fdbf80000\""
    }
}
```
