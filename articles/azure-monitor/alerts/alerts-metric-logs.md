---
title: Create metric alerts in Azure Monitor Logs
description: Get information about creating near-real time metric alerts on popular Log Analytics data.
ms.author: abbyweisberg
ms.topic: conceptual
ms.date: 11/16/2023
ms.reviewer: harelbr
---

# Create a metric alert in Azure Monitor Logs

[!INCLUDE [updated-for-az](~/reusable-content/ce-skilling/azure/includes/updated-for-az.md)]

You can use metric alert capabilities on a predefined set of logs in Azure Monitor Logs. The monitored logs, which can be collected from Azure or on-premises computers, are converted to metrics and then monitored with metric alert rules, just like any other metric.

A Log Analytics workspace supports these log types:

- [Performance counters](./../agents/data-sources-performance-counters.md) for Windows and Linux machines (corresponding with the supported [Log Analytics workspace metrics](../essentials/metrics-supported.md#microsoftoperationalinsightsworkspaces))
- [Heartbeat records for Agent Health](../insights/solution-agenthealth.md)
- [Update management](../../automation/update-management/overview.md) records
- [Event data](./../agents/data-sources-windows-events.md) logs

Benefits of using metric alerts for logs over query-based [log search alerts](./alerts-log.md) in Azure include:

- Metric alerts offer a near real-time monitoring capability. They fork data from the log source to ensure this capability.
- Metric alerts are stateful. They notify you once when an alert is fired and once when the alert is resolved. Log search alerts are stateless and keep firing at every interval if the alert condition is met.
- Metric alerts provide multiple dimensions. They allow filtering to specific values like computers and OS types without the need for defining a complex query in Log Analytics.

> [!NOTE]
> A specific metric or dimension appears only if data for it exists in the chosen period. These metrics are available for customers who have Log Analytics workspaces.

## Supported metrics and dimensions for logs

With metric alerts, you can use dimensions to filter your metric to the right level. The full list of metrics supported for logs is equivalent to the [list of Log Analytics workspace metrics](../essentials/metrics-supported.md#supported-metrics-and-log-categories-by-resource-type).

> [!NOTE]
> To view a supported metric extracted from a Log Analytics workspace via [Azure Monitor metrics](../essentials/metrics-charts.md), you must create a metric alert for logs on that specific metric. The dimensions that you choose in the metric alert for logs will appear for exploration only via Azure Monitor metrics.

## Creating a metric alert for logs

Before metric data from popular logs is processed in Log Analytics, it's piped into Azure Monitor metrics. You can then take advantage of the capabilities of the metric platform in addition to metric alerts, including having alerts with a frequency as low as one minute.

The process for creating metric alerts for logs is two pronged:

1. Create a rule for extracting metrics from supported logs by using the [Scheduled Query Rules API](/rest/api/monitor/scheduledqueryrule-2018-04-16/scheduled-query-rules) (`scheduledQueryRules`).
2. Create a metric alert for the metric extracted from the log (in step 1) and the Log Analytics workspace as a target resource.

## Prerequisites

Before you create a metric alert for logs, make sure that the following items are set up and available:

- **Log Analytics workspace**: You must have a valid and active Log Analytics workspace. For more information, see [Create a Log Analytics workspace](../logs/quick-create-workspace.md).
- **Agent configured for the Log Analytics workspace**: You need to configure an agent for Azure virtual machines or on-premises machines to send data to the Log Analytics workspace. For more information, see [Azure Monitor Agent overview](./../agents/agents-overview.md).
- **Supported Log Analytics solution**: A Log Analytics solution should be configured and sending data to the Log Analytics workspace. Supported solutions are [performance counters for Windows and Linux](./../agents/data-sources-performance-counters.md), [heartbeat records for Agent Health](../insights/solution-agenthealth.md), [Azure Automation Update Management](../../automation/update-management/overview.md), and [event data](./../agents/data-sources-windows-events.md).
- **Logs configured for the Log Analytics solution**: The Log Analytics solution should have the required logs and data that correspond to [metrics supported for Log Analytics workspaces](../essentials/metrics-supported.md#microsoftoperationalinsightsworkspaces) enabled. For example, the *% Available Memory* counter must be configured in the [performance counters](./../agents/data-sources-performance-counters.md) solution first.

## Methods for creating a metric alert for logs

You can create and manage metric alerts by using the Azure portal, Azure Resource Manager templates, the REST API, Azure PowerShell, and the Azure CLI.

After you create metric alerts for logs for a specified Log Analytics workspace, they have all characteristics and functionalities of [metric alerts](./alerts-metric-near-real-time.md), including payload schema, applicable quota limits, and billed price.

For step-by-step details and samples, see [Create or edit a metric alert rule](./alerts-create-metric-alert-rule.yml). Follow the instructions for managing metric alerts and note the following considerations:

- The target for a metric alert must be a valid Log Analytics workspace.
- The signal chosen for a metric alert for a selected Log Analytics workspace must be of type **Metric**.
- You can filter for specific conditions or resources by using dimension filters, because metrics for logs are multidimensional.
- When you're configuring signal logic, you can create a single alert to span multiple values of dimension (like computer).
- When you're creating a metric alert for logs by using the Azure portal, a corresponding rule for converting log data into a metric via `scheduledQueryRules` is automatically created in the background, without the need for any user intervention or action.

  If you're *not* using the Azure portal to create a metric alert for a selected Log Analytics workspace, you must first manually create an explicit rule for converting log data into a metric by using `scheduledQueryRules`.

## Resource Manager templates

To create a metric alert for logs, you can use the following sample Resource Manager templates.

For metric alerts for logs created through means other than the Azure portal, you can use these sample templates to create a `scheduledQueryRules`-based log-to-metric conversion rule before you create a metric alert. If you don't, there will be no data for the metric alert in the logs.

### Metric alert for logs with a static threshold

In the following sample template, creation of a metric alert for a static threshold depends on successful creation of the rule for extracting metrics from logs via `scheduledQueryRules`.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "convertRuleName": {
            "type": "string",
            "minLength": 1,
            "metadata": {
                "description": "Name of the rule to convert a log to a metric"
            }
        },
        "convertRuleDescription": {
            "type": "string",
            "minLength": 1,
            "metadata": {
                "description": "Description for the log converted to a metric."
            }
        },
        "convertRuleRegion": {
            "type": "string",
            "minLength": 1,
            "metadata": {
                "description": "Name of the region used by the workspace."
            }
        },
        "convertRuleStatus": {
            "type": "string",
            "defaultValue": "true",
            "metadata": {
                "description": "Specifies whether the log conversion rule is enabled."
            }
        },
        "convertRuleMetric": {
            "type": "string",
            "minLength": 1,
            "metadata": {
                "description": "Name of the metric after extraction is done from logs."
            }
        },
        "alertName": {
            "type": "string",
            "minLength": 1,
            "metadata": {
                "description": "Name of the alert."
            }
        },
        "alertDescription": {
            "type": "string",
            "defaultValue": "This is a metric alert",
            "metadata": {
                "description": "Description of the alert."
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
                "description": "Severity of the alert {0,1,2,3,4}."
            }
        },
        "isEnabled": {
            "type": "bool",
            "defaultValue": true,
            "metadata": {
                "description": "Specifies whether the alert is enabled."
            }
        },
        "resourceId": {
            "type": "string",
            "minLength": 1,
            "metadata": {
                "description": "Full resource ID of the resource emitting the metric that will be used for the comparison. For example: /subscriptions/00000000-0000-0000-0000-0000-00000000/resourceGroups/ResourceGroupName/providers/Microsoft.OperationalInsights/workspaces/workspaceName"
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
                "description": "How the data that's collected should be combined over time."
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
                "description": "How often the metric alert is evaluated, represented in ISO 8601 duration format."
            }
        },
        "actionGroupId": {
            "type": "string",
            "defaultValue": "",
            "metadata": {
                "description": "The ID of the action group that's triggered when the alert is activated or deactivated."
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

If you save the preceding JSON as *metricfromLogsAlertStatic.json*, you can couple it with a parameter JSON file for creation based on a Resource Manager template. Here's a sample parameter JSON file:

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
            "value": "New multidimensional metric alert created via template"
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

Assuming that you saved the preceding parameter file as *metricfromLogsAlertStatic.parameters.json*, you can create metric alerts for logs by using the [Resource Manager template for creation in the Azure portal](../../azure-resource-manager/templates/deploy-portal.md).

Alternatively, you can use this Azure PowerShell command:

```powershell
New-AzResourceGroupDeployment -ResourceGroupName "myRG" -TemplateFile metricfromLogsAlertStatic.json TemplateParameterFile metricfromLogsAlertStatic.parameters.json
```

Or, you can deploy the Resource Manager template by using the Azure CLI:

```azurecli
az deployment group create --resource-group myRG --template-file metricfromLogsAlertStatic.json --parameters @metricfromLogsAlertStatic.parameters.json
```

### Metric alert for logs with dynamic thresholds

In the following sample template, creation of a metric alert for dynamic thresholds depends on successful creation of the rule for extracting metrics from logs via `scheduledQueryRules`.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "convertRuleName": {
            "type": "string",
            "minLength": 1,
            "metadata": {
                "description": "Name of the rule to convert a log to a metric."
            }
        },
        "convertRuleDescription": {
            "type": "string",
            "minLength": 1,
            "metadata": {
                "description": "Description for the log converted to a metric."
            }
        },
        "convertRuleRegion": {
            "type": "string",
            "minLength": 1,
            "metadata": {
                "description": "Name of the region used by the workspace."
            }
        },
        "convertRuleStatus": {
            "type": "string",
            "defaultValue": "true",
            "metadata": {
                "description": "Specifies whether the log conversion rule is enabled."
            }
        },
        "convertRuleMetric": {
            "type": "string",
            "minLength": 1,
            "metadata": {
                "description": "Name of the metric after extraction is done from logs."
            }
        },
        "alertName": {
            "type": "string",
            "minLength": 1,
            "metadata": {
                "description": "Name of the alert."
            }
        },
        "alertDescription": {
            "type": "string",
            "defaultValue": "This is a metric alert",
            "metadata": {
                "description": "Description of the alert."
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
                "description": "Severity of the alert {0,1,2,3,4}."
            }
        },
        "isEnabled": {
            "type": "bool",
            "defaultValue": true,
            "metadata": {
                "description": "Specifies whether the alert is enabled."
            }
        },
        "resourceId": {
            "type": "string",
            "minLength": 1,
            "metadata": {
                "description": "Full resource ID of the resource emitting the metric that will be used for the comparison. For example: /subscriptions/00000000-0000-0000-0000-0000-00000000/resourceGroups/ResourceGroupName/providers/Microsoft.OperationalInsights/workspaces/workspaceName"
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
                "description": "Tunes how 'noisy' the alerts for dynamic thresholds will be. 'High' will result in more alerts. 'Low' will result in fewer alerts."
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
                "description": "How the data that's collected should be combined over time."
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
                "description": "How often the metric alert is evaluated, represented in ISO 8601 duration format."
            }
        },
        "actionGroupId": {
            "type": "string",
            "defaultValue": "",
            "metadata": {
                "description": "The ID of the action group that's triggered when the alert is activated or deactivated."
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

If you save the preceding JSON as *metricfromLogsAlertDynamic.json*, you can couple it with a parameter JSON file for creation based on a Resource Manager template. Here's a sample parameter JSON file:

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
            "value": "New multidimensional metric alert created via template"
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

Assuming that you saved the preceding parameter file as *metricfromLogsAlertDynamic.parameters.json*, you can create metric alerts for logs by using the [Resource Manager template for creation in the Azure portal](../../azure-resource-manager/templates/deploy-portal.md).

Alternatively, you can use this Azure PowerShell command:

```powershell
New-AzResourceGroupDeployment -ResourceGroupName "myRG" -TemplateFile metricfromLogsAlertDynamic.json TemplateParameterFile metricfromLogsAlertDynamic.parameters.json
```

Or, you can deploy the Resource Manager template by using the Azure CLI:

```azurecli
az deployment group create --resource-group myRG --template-file metricfromLogsAlertDynamic.json --parameters @metricfromLogsAlertDynamic.parameters.json
```

## Related content

- Learn more about [metric alerts](../alerts/alerts-metric.md).
- Learn about [log search alerts in Azure](./alerts-types.md#log-alerts).
- Learn about [alerts in Azure](./alerts-overview.md).
