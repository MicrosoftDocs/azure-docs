---
title: Creating Metric Alerts for Logs in Azure Monitor
description: Tutorial on creating near-real time metric alerts on popular log analytics data.
ms.topic: conceptual
ms.date: 11/16/2023
ms.reviewer: harelbr
---

# Create Metric Alerts for Logs in Azure Monitor

## Overview

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

**Metric Alerts for Logs** allows you to leverage metric alerts capabilities on a predefined set of Log Analytics logs. The monitored logs, which can be collected from Azure or on-premises computers, are converted to metrics, and then monitored with metric alert rules just like any other metric.
The supported Log Analytics logs are the following:

- [Performance counters](./../agents/data-sources-performance-counters.md) for Windows & Linux machines (corresponding with the supported [Log Analytics workspace metrics](../essentials/metrics-supported.md#microsoftoperationalinsightsworkspaces))
- [Heartbeat records for Agent Health](../insights/solution-agenthealth.md)
- [Update management](../../automation/update-management/overview.md) records
- [Event data](./../agents/data-sources-windows-events.md) logs

There are many benefits for using **Metric Alerts for Logs** over query based [Log Alerts](./alerts-log.md) in Azure; some of them are listed below:

- Metric Alerts offer near-real time monitoring capability and Metric Alerts for Logs forks data from the log source to ensure the same.
- Metric Alerts are stateful - only notifying once when alert is fired and once when alert is resolved; as opposed to Log alerts, which are stateless and keep firing at every interval if the alert condition is met.
- Metric Alerts for Log provide multiple dimensions, allowing filtering to specific values like Computers, OS Type, etc. simpler; without the need for defining a complex query in Log Analytics.

> [!NOTE]
> Specific metric and/or dimension will only be shown if data for it exists in the chosen period. These metrics are available for customers with Azure Log Analytics workspaces.

## Metrics and dimensions supported for logs

Metric alerts support alerting for metrics that use dimensions. You can use dimensions to filter your metric to the right level. The full list of metrics supported for Logs is equivalent to the list of [Log Analytics workspace metric](../essentials/metrics-supported.md#microsoftoperationalinsightsworkspaces).

> [!NOTE]
> To view a supported metric extracted from a Log Analytics workspace via [Azure Monitor - Metrics](../essentials/metrics-charts.md), a metric alert for log must be created on that specific metric. The dimensions chosen in the metric alert for logs - will only appear for exploration via Azure Monitor - Metrics.

## Creating metric alert for Log Analytics

Metric data from popular logs is piped before it is processed in Log Analytics, into Azure Monitor - Metrics. This allows users to leverage the capabilities of the Metric platform as well as metric alert - including having alerts with frequency as low as 1 minute.
Listed below are the means of crafting a metric alert for logs.

## Prerequisites for Metric Alert for Logs

Before Metric for Logs gathered on Log Analytics data works, the following must be set up and available:

1. **Active Log Analytics Workspace**: A valid and active Log Analytics workspace must be present. For more information, see [Create a Log Analytics Workspace in Azure portal](../logs/quick-create-workspace.md).
2. **Agent is configured for Log Analytics Workspace**: Agent needs to be configured for Azure VMs (and/or) on-premises VMs to send data into the Log Analytics Workspace used in earlier step. For more information, see [Log Analytics - Agent Overview](./../agents/agents-overview.md).
3. **Supported Log Analytics solution is installed**: Log Analytics solution should be configured and sending data into Log Analytics workspace - supported solutions are [Performance counters for Windows & Linux](./../agents/data-sources-performance-counters.md), [Heartbeat records for Agent Health](../insights/solution-agenthealth.md), [Update management](../../automation/update-management/overview.md), and [Event data](./../agents/data-sources-windows-events.md).
4. **Log Analytics solutions configured to send logs**: Log Analytics solution should have the required logs/data corresponding to [metrics supported for Log Analytics workspaces](../essentials/metrics-supported.md#microsoftoperationalinsightsworkspaces) enabled. For example, for *% Available Memory* counter of it must be configured in [Performance counters](./../agents/data-sources-performance-counters.md) solution first.

## Configuring Metric Alert for Logs

 Metric alerts can be created and managed using the Azure portal, Resource Manager Templates, REST API, PowerShell, and Azure CLI. Since Metric Alerts for Logs, is a variant of metric alerts - once the prerequisites are done, metric alert for logs can be created for specified Log Analytics workspace. All characteristics and functionalities of [metric alerts](./alerts-metric-near-real-time.md) will be applicable to metric alerts for logs, as well; including payload schema, applicable quota limits, and billed price.

For step-by-step details and samples - see [creating and managing metric alerts](./alerts-metric.md). Specifically, for Metric Alerts for Logs - follow the instructions for managing metric alerts and ensure the following:

- Target for metric alert is a valid *Log Analytics workspace*
- Signal chosen for metric alert for selected *Log Analytics workspace* is of type **Metric**
- Filter for specific conditions or resource using dimension filters; metrics for logs are multi-dimensional
- When configuring *Signal Logic*, a single alert can be created to span multiple values of dimension (like Computer)
- If **not** using Azure portal for creating metric alert for selected *Log Analytics workspace*; then user must manually first create an explicit rule for converting log data into a metric using [Azure Monitor - Scheduled Query Rules](/rest/api/monitor/scheduledqueryrule-2018-04-16/scheduled-query-rules).

> [!NOTE]
> When creating a metric alert for log via Azure portal - a corresponding rule for converting log data into metric via [Azure Monitor - Scheduled Query Rules](/rest/api/monitor/scheduledqueryrule-2018-04-16/scheduled-query-rules) is automatically created in the background, *without the need for any user intervention or action*. For metric alert for logs created using means other than Azure portal, see [Resource Template for Metric Alerts for Logs](#resource-template-for-metric-alerts-for-logs) section on sample means of creating a ScheduledQueryRule based log to metric conversion rule before metric alert creation - else there will be no data for the metric alert on logs created.

## Resource Template for Metric Alerts for Logs

As stated earlier, the process for creating metric alerts for logs is two pronged:

1. Create a rule for extracting metrics from supported logs using scheduledQueryRule API
2. Create a metric alert for metric extracted from log (in step1) and Log Analytics workspace as a target resource

### Metric Alerts for Logs with static threshold

To achieve the same, one can use the sample Azure Resource Manager Template below - where creation of a static threshold metric alert depends on successful creation of the rule for extracting metrics from logs via scheduledQueryRule.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "convertRuleName": {
            "type": "string",
            "minLength": 1,
            "metadata": {
                "description": "Name of the rule to convert log to metric"
            }
        },
        "convertRuleDescription": {
            "type": "string",
            "minLength": 1,
            "metadata": {
                "description": "Description for log converted to metric"
            }
        },
        "convertRuleRegion": {
            "type": "string",
            "minLength": 1,
            "metadata": {
                "description": "Name of the region used by workspace"
            }
        },
        "convertRuleStatus": {
            "type": "string",
            "defaultValue": "true",
            "metadata": {
                "description": "Specifies whether the log conversion rule is enabled"
            }
        },
        "convertRuleMetric": {
            "type": "string",
            "minLength": 1,
            "metadata": {
                "description": "Name of the metric once extraction done from logs."
            }
        },
        "alertName": {
            "type": "string",
            "minLength": 1,
            "metadata": {
                "description": "Name of the alert"
            }
        },
        "alertDescription": {
            "type": "string",
            "defaultValue": "This is a metric alert",
            "metadata": {
                "description": "Description of alert"
            }
        },
        "alertSeverity": {
            "type": "int",
            "defaultValue": 3,
            "allowedValues": [
                0,
                1,
                2,
                3,
                4
            ],
            "metadata": {
                "description": "Severity of alert {0,1,2,3,4}"
            }
        },
        "isEnabled": {
            "type": "bool",
            "defaultValue": true,
            "metadata": {
                "description": "Specifies whether the alert is enabled"
            }
        },
        "resourceId": {
            "type": "string",
            "minLength": 1,
            "metadata": {
                "description": "Full Resource ID of the resource emitting the metric that will be used for the comparison. For example: /subscriptions/00000000-0000-0000-0000-0000-00000000/resourceGroups/ResourceGroupName/providers/Microsoft.OperationalInsights/workspaces/workspaceName"
            }
        },
        "metricName": {
            "type": "string",
            "minLength": 1,
            "metadata": {
                "description": "Name of the metric used in the comparison to activate the alert."
            }
        },
        "operator": {
            "type": "string",
            "defaultValue": "GreaterThan",
            "allowedValues": [
                "Equals",
                "NotEquals",
                "GreaterThan",
                "GreaterThanOrEqual",
                "LessThan",
                "LessThanOrEqual"
            ],
            "metadata": {
                "description": "Operator comparing the current value with the threshold value."
            }
        },
        "threshold": {
            "type": "string",
            "defaultValue": "0",
            "metadata": {
                "description": "The threshold value at which the alert is activated."
            }
        },
        "timeAggregation": {
            "type": "string",
            "defaultValue": "Average",
            "allowedValues": [
                "Average",
                "Minimum",
                "Maximum",
                "Total"
            ],
            "metadata": {
                "description": "How the data that is collected should be combined over time."
            }
        },
        "windowSize": {
            "type": "string",
            "defaultValue": "PT5M",
            "metadata": {
                "description": "Period of time used to monitor alert activity based on the threshold. Must be between five minutes and one day. ISO 8601 duration format."
            }
        },
        "evaluationFrequency": {
            "type": "string",
            "defaultValue": "PT1M",
            "metadata": {
                "description": "how often the metric alert is evaluated represented in ISO 8601 duration format"
            }
        },
        "actionGroupId": {
            "type": "string",
            "defaultValue": "",
            "metadata": {
                "description": "The ID of the action group that is triggered when the alert is activated or deactivated"
            }
        }
    },
    "variables": {
        "convertRuleSourceWorkspace": {
            "SourceId": "/subscriptions/1234-56789-1234-567a/resourceGroups/resourceGroupName/providers/Microsoft.OperationalInsights/workspaces/workspaceName"
        }
    },
    "resources": [
        {
            "name": "[parameters('convertRuleName')]",
            "type": "Microsoft.Insights/scheduledQueryRules",
            "apiVersion": "2018-04-16",
            "location": "[parameters('convertRuleRegion')]",
            "properties": {
                "description": "[parameters('convertRuleDescription')]",
                "enabled": "[parameters('convertRuleStatus')]",
                "source": {
                    "dataSourceId": "[variables('convertRuleSourceWorkspace').SourceId]"
                },
                "action": {
                    "odata.type": "Microsoft.WindowsAzure.Management.Monitoring.Alerts.Models.Microsoft.AppInsights.Nexus.DataContracts.Resources.ScheduledQueryRules.LogToMetricAction",
                    "criteria": [{
                            "metricName": "[parameters('convertRuleMetric')]",
                            "dimensions": []
                        }
                    ]
                }
            }
        },
        {
            "name": "[parameters('alertName')]",
            "type": "Microsoft.Insights/metricAlerts",
            "location": "global",
            "apiVersion": "2018-03-01",
            "tags": {},
            "dependsOn":["[resourceId('Microsoft.Insights/scheduledQueryRules',parameters('convertRuleName'))]"],
            "properties": {
                "description": "[parameters('alertDescription')]",
                "severity": "[parameters('alertSeverity')]",
                "enabled": "[parameters('isEnabled')]",
                "scopes": ["[parameters('resourceId')]"],
                "evaluationFrequency":"[parameters('evaluationFrequency')]",
                "windowSize": "[parameters('windowSize')]",
                "criteria": {
                    "odata.type": "Microsoft.Azure.Monitor.SingleResourceMultipleMetricCriteria",
                    "allOf": [
                        {
                            "name" : "1st criterion",
                            "metricName": "[parameters('metricName')]",
                            "dimensions":[],
                            "operator": "[parameters('operator')]",
                            "threshold" : "[parameters('threshold')]",
                            "timeAggregation": "[parameters('timeAggregation')]"
                        }
                    ]
                },
                "actions": [
                    {
                        "actionGroupId": "[parameters('actionGroupId')]"
                    }
                ]
            }
        }
    ]
}
```

Say the above JSON is saved as metricfromLogsAlertStatic.json - then it can be coupled with a parameter JSON file for Resource Template based creation. A sample parameter JSON file is listed below:

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "convertRuleName": {
            "value": "TestLogtoMetricRule" 
        },
        "convertRuleDescription": {
            "value": "Test rule to extract metrics from logs via template"
        },
        "convertRuleRegion": {
            "value": "West Central US"
        },
        "convertRuleStatus": {
            "value": "true"
        },
        "convertRuleMetric": {
            "value": "Average_% Idle Time"
        },
        "alertName": {
            "value": "TestMetricAlertonLog"
        },
        "alertDescription": {
            "value": "New multi-dimensional metric alert created via template"
        },
        "alertSeverity": {
            "value":3
        },
        "isEnabled": {
            "value": true
        },
        "resourceId": {
            "value": "/subscriptions/1234-56789-1234-567a/resourceGroups/myRG/providers/Microsoft.OperationalInsights/workspaces/workspaceName"
        },
        "metricName":{
            "value": "Average_% Idle Time"
        },
        "operator": {
            "value": "GreaterThan"
        },
        "threshold":{
            "value": "1"
        },
        "timeAggregation":{
            "value": "Average"
        },
        "actionGroupId": {
            "value": "/subscriptions/1234-56789-1234-567a/resourceGroups/myRG/providers/microsoft.insights/actionGroups/actionGroupName"
        }
    }
}
```

Assuming the above parameter file is saved as metricfromLogsAlertStatic.parameters.json; then one can create metric alert for logs using [Resource Template for creation in Azure portal](../../azure-resource-manager/templates/deploy-portal.md).

Alternatively, one can use the Azure PowerShell command below as well:

```powershell
New-AzResourceGroupDeployment -ResourceGroupName "myRG" -TemplateFile metricfromLogsAlertStatic.json TemplateParameterFile metricfromLogsAlertStatic.parameters.json
```

Or use deploy Resource Template using Azure CLI:

```azurecli
az deployment group create --resource-group myRG --template-file metricfromLogsAlertStatic.json --parameters @metricfromLogsAlertStatic.parameters.json
```

### Metric Alerts for Logs with Dynamic Thresholds

To achieve the same, one can use the sample Azure Resource Manager Template below - where creation of a Dynamic Thresholds metric alert depends on successful creation of the rule for extracting metrics from logs via scheduledQueryRule.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "convertRuleName": {
            "type": "string",
            "minLength": 1,
            "metadata": {
                "description": "Name of the rule to convert log to metric"
            }
        },
        "convertRuleDescription": {
            "type": "string",
            "minLength": 1,
            "metadata": {
                "description": "Description for log converted to metric"
            }
        },
        "convertRuleRegion": {
            "type": "string",
            "minLength": 1,
            "metadata": {
                "description": "Name of the region used by workspace"
            }
        },
        "convertRuleStatus": {
            "type": "string",
            "defaultValue": "true",
            "metadata": {
                "description": "Specifies whether the log conversion rule is enabled"
            }
        },
        "convertRuleMetric": {
            "type": "string",
            "minLength": 1,
            "metadata": {
                "description": "Name of the metric once extraction done from logs."
            }
        },
        "alertName": {
            "type": "string",
            "minLength": 1,
            "metadata": {
                "description": "Name of the alert"
            }
        },
        "alertDescription": {
            "type": "string",
            "defaultValue": "This is a metric alert",
            "metadata": {
                "description": "Description of alert"
            }
        },
        "alertSeverity": {
            "type": "int",
            "defaultValue": 3,
            "allowedValues": [
                0,
                1,
                2,
                3,
                4
            ],
            "metadata": {
                "description": "Severity of alert {0,1,2,3,4}"
            }
        },
        "isEnabled": {
            "type": "bool",
            "defaultValue": true,
            "metadata": {
                "description": "Specifies whether the alert is enabled"
            }
        },
        "resourceId": {
            "type": "string",
            "minLength": 1,
            "metadata": {
                "description": "Full Resource ID of the resource emitting the metric that will be used for the comparison. For example: /subscriptions/00000000-0000-0000-0000-0000-00000000/resourceGroups/ResourceGroupName/providers/Microsoft.OperationalInsights/workspaces/workspaceName"
            }
        },
        "metricName": {
            "type": "string",
            "minLength": 1,
            "metadata": {
                "description": "Name of the metric used in the comparison to activate the alert."
            }
        },
        "operator": {
            "type": "string",
            "defaultValue": "GreaterOrLessThan",
            "allowedValues": [
                "GreaterThan",
                "LessThan",
                "GreaterOrLessThan"
            ],
            "metadata": {
                "description": "Operator comparing the current value with the threshold value."
            }
        },
        "alertSensitivity": {
            "type": "string",
            "defaultValue": "Medium",
            "allowedValues": [
                "High",
                "Medium",
                "Low"
            ],
            "metadata": {
                "description": "Tunes how 'noisy' the Dynamic Thresholds alerts will be: 'High' will result in more alerts while 'Low' will result in fewer alerts."
            }
        },
        "numberOfEvaluationPeriods": {
            "type": "string",
            "defaultValue": "4",
            "metadata": {
                "description": "The number of periods to check in the alert evaluation."
            }
        },
        "minFailingPeriodsToAlert": {
            "type": "string",
            "defaultValue": "3",
            "metadata": {
                "description": "The number of unhealthy periods to alert on (must be lower or equal to numberOfEvaluationPeriods)."
            }
        },
        "timeAggregation": {
            "type": "string",
            "defaultValue": "Average",
            "allowedValues": [
                "Average",
                "Minimum",
                "Maximum",
                "Total"
            ],
            "metadata": {
                "description": "How the data that is collected should be combined over time."
            }
        },
        "windowSize": {
            "type": "string",
            "defaultValue": "PT5M",
            "metadata": {
                "description": "Period of time used to monitor alert activity based on the threshold. Must be between five minutes and one day. ISO 8601 duration format."
            }
        },
        "evaluationFrequency": {
            "type": "string",
            "defaultValue": "PT1M",
            "metadata": {
                "description": "how often the metric alert is evaluated represented in ISO 8601 duration format"
            }
        },
        "actionGroupId": {
            "type": "string",
            "defaultValue": "",
            "metadata": {
                "description": "The ID of the action group that is triggered when the alert is activated or deactivated"
            }
        }
    },
    "variables": {
        "convertRuleSourceWorkspace": {
            "SourceId": "/subscriptions/1234-56789-1234-567a/resourceGroups/resourceGroupName/providers/Microsoft.OperationalInsights/workspaces/workspaceName"
        }
    },
    "resources": [
        {
            "name": "[parameters('convertRuleName')]",
            "type": "Microsoft.Insights/scheduledQueryRules",
            "apiVersion": "2018-04-16",
            "location": "[parameters('convertRuleRegion')]",
            "properties": {
                "description": "[parameters('convertRuleDescription')]",
                "enabled": "[parameters('convertRuleStatus')]",
                "source": {
                    "dataSourceId": "[variables('convertRuleSourceWorkspace').SourceId]"
                },
                "action": {
                    "odata.type": "Microsoft.WindowsAzure.Management.Monitoring.Alerts.Models.Microsoft.AppInsights.Nexus.DataContracts.Resources.ScheduledQueryRules.LogToMetricAction",
                    "criteria": [{
                            "metricName": "[parameters('convertRuleMetric')]",
                            "dimensions": []
                        }
                    ]
                }
            }
        },
        {
            "name": "[parameters('alertName')]",
            "type": "Microsoft.Insights/metricAlerts",
            "location": "global",
            "apiVersion": "2018-03-01",
            "tags": {},
            "dependsOn":["[resourceId('Microsoft.Insights/scheduledQueryRules',parameters('convertRuleName'))]"],
            "properties": {
                "description": "[parameters('alertDescription')]",
                "severity": "[parameters('alertSeverity')]",
                "enabled": "[parameters('isEnabled')]",
                "scopes": ["[parameters('resourceId')]"],
                "evaluationFrequency":"[parameters('evaluationFrequency')]",
                "windowSize": "[parameters('windowSize')]",
                "criteria": {
                    "odata.type": "Microsoft.Azure.Monitor.MultipleResourceMultipleMetricCriteria",
                    "allOf": [
                        {
                            "criterionType": "DynamicThresholdCriterion",
                            "name" : "1st criterion",
                            "metricName": "[parameters('metricName')]",
                            "dimensions":[],
                            "operator": "[parameters('operator')]",
                            "alertSensitivity": "[parameters('alertSensitivity')]",
                            "failingPeriods": {
                                "numberOfEvaluationPeriods": "[parameters('numberOfEvaluationPeriods')]",
                                "minFailingPeriodsToAlert": "[parameters('minFailingPeriodsToAlert')]"
                            },
                            "timeAggregation": "[parameters('timeAggregation')]"
                        }
                    ]
                },
                "actions": [
                    {
                        "actionGroupId": "[parameters('actionGroupId')]"
                    }
                ]
            }
        }
    ]
}
```

Say the above JSON is saved as metricfromLogsAlertDynamic.json - then it can be coupled with a parameter JSON file for Resource Template based creation. A sample parameter JSON file is listed below:

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "convertRuleName": {
            "value": "TestLogtoMetricRule"
        },
        "convertRuleDescription": {
            "value": "Test rule to extract metrics from logs via template"
        },
        "convertRuleRegion": {
            "value": "West Central US"
        },
        "convertRuleStatus": {
            "value": "true"
        },
        "convertRuleMetric": {
            "value": "Average_% Idle Time"
        },
        "alertName": {
            "value": "TestMetricAlertonLog"
        },
        "alertDescription": {
            "value": "New multi-dimensional metric alert created via template"
        },
        "alertSeverity": {
            "value":3
        },
        "isEnabled": {
            "value": true
        },
        "resourceId": {
            "value": "/subscriptions/1234-56789-1234-567a/resourceGroups/myRG/providers/Microsoft.OperationalInsights/workspaces/workspaceName"
        },
        "metricName":{
            "value": "Average_% Idle Time"
        },
        "operator": {
            "value": "GreaterOrLessThan"
          },
          "alertSensitivity": {
              "value": "Medium"
          },
          "numberOfEvaluationPeriods": {
              "value": "4"
          },
          "minFailingPeriodsToAlert": {
              "value": "3"
          },
        "timeAggregation":{
            "value": "Average"
        },
        "actionGroupId": {
            "value": "/subscriptions/1234-56789-1234-567a/resourceGroups/myRG/providers/microsoft.insights/actionGroups/actionGroupName"
        }
    }
}
```

Assuming the above parameter file is saved as metricfromLogsAlertDynamic.parameters.json; then one can create metric alert for logs using [Resource Template for creation in Azure portal](../../azure-resource-manager/templates/deploy-portal.md).

Alternatively, one can use the Azure PowerShell command below as well:

```powershell
New-AzResourceGroupDeployment -ResourceGroupName "myRG" -TemplateFile metricfromLogsAlertDynamic.json TemplateParameterFile metricfromLogsAlertDynamic.parameters.json
```

Or use deploy Resource Template using Azure CLI:

```azurecli
az deployment group create --resource-group myRG --template-file metricfromLogsAlertDynamic.json --parameters @metricfromLogsAlertDynamic.parameters.json
```

## Next steps

- Learn more about the [metric alerts](../alerts/alerts-metric.md).
- Learn about [log alerts in Azure](./alerts-unified-log.md).
- Learn about [alerts in Azure](./alerts-overview.md).
