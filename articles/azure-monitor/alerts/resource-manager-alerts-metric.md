---
title: Resource Manager template samples for metric alerts
description: This article provides sample Resource Manager templates used to create metric alerts in Azure Monitor.
author: bwren
ms.author: bwren
services: azure-monitor
ms.topic: sample
ms.date: 10/31/2022
ms.custom: references_regions
ms.reviewer: harelbr
---

# Resource Manager template samples for metric alert rules in Azure Monitor

This article provides samples of using [Azure Resource Manager templates](../../azure-resource-manager/templates/syntax.md) to configure [metric alert rules](../alerts/alerts-metric-near-real-time.md) in Azure Monitor. Each sample includes a template file and a parameters file with sample values to provide to the template.

[!INCLUDE [azure-monitor-samples](../../../includes/azure-monitor-resource-manager-samples.md)]

See [Supported resources for metric alerts in Azure Monitor](../alerts/alerts-metric-near-real-time.md) for a list of resources that can be used with metric alert rules. An explanation of the schema and properties for an alert rule is available at [Metric Alerts - Create Or Update](/rest/api/monitor/metricalerts/createorupdate).

> [!NOTE]
> Resource template for creating metric alerts for resource type: Azure Log Analytics Workspace (i.e.) `Microsoft.OperationalInsights/workspaces`, requires additional steps. For details, see [Metric Alert for Logs - Resource Template](../alerts/alerts-metric-logs.md#resource-template-for-metric-alerts-for-logs).

## Template references

- [Microsoft.Insights metricAlerts](/azure/templates/microsoft.insights/2018-03-01/metricalerts)

## Single criteria, static threshold

The following sample creates a metric alert rule using a single criteria and a static threshold.

### Template file

# [Bicep](#tab/bicep)

```bicep
@description('Name of the alert')
@minLength(1)
param alertName string

@description('Description of alert')
param alertDescription string = 'This is a metric alert'

@description('Severity of alert {0,1,2,3,4}')
@allowed([
  0
  1
  2
  3
  4
])
param alertSeverity int = 3

@description('Specifies whether the alert is enabled')
param isEnabled bool = true

@description('Full Resource ID of the resource emitting the metric that will be used for the comparison. For example /subscriptions/00000000-0000-0000-0000-0000-00000000/resourceGroups/ResourceGroupName/providers/Microsoft.compute/virtualMachines/VM_xyz')
@minLength(1)
param resourceId string

@description('Name of the metric used in the comparison to activate the alert.')
@minLength(1)
param metricName string

@description('Operator comparing the current value with the threshold value.')
@allowed([
  'Equals'
  'GreaterThan'
  'GreaterThanOrEqual'
  'LessThan'
  'LessThanOrEqual'
])
param operator string = 'GreaterThan'

@description('The threshold value at which the alert is activated.')
param threshold int = 0

@description('How the data that is collected should be combined over time.')
@allowed([
  'Average'
  'Minimum'
  'Maximum'
  'Total'
  'Count'
])
param timeAggregation string = 'Average'

@description('Period of time used to monitor alert activity based on the threshold. Must be between one minute and one day. ISO 8601 duration format.')
@allowed([
  'PT1M'
  'PT5M'
  'PT15M'
  'PT30M'
  'PT1H'
  'PT6H'
  'PT12H'
  'PT24H'
])
param windowSize string = 'PT5M'

@description('how often the metric alert is evaluated represented in ISO 8601 duration format')
@allowed([
  'PT1M'
  'PT5M'
  'PT15M'
  'PT30M'
  'PT1H'
])
param evaluationFrequency string = 'PT1M'

@description('The ID of the action group that is triggered when the alert is activated or deactivated')
param actionGroupId string = ''

resource metricAlert 'Microsoft.Insights/metricAlerts@2018-03-01' = {
  name: alertName
  location: 'global'
  properties: {
    description: alertDescription
    severity: alertSeverity
    enabled: isEnabled
    scopes: [
      resourceId
    ]
    evaluationFrequency: evaluationFrequency
    windowSize: windowSize
    criteria: {
      'odata.type': 'Microsoft.Azure.Monitor.SingleResourceMultipleMetricCriteria'
      allOf: [
        {
          name: '1st criterion'
          metricName: metricName
          dimensions: []
          operator: operator
          threshold: threshold
          timeAggregation: timeAggregation
          criterionType: 'StaticThresholdCriterion'
        }
      ]
    }
    actions: [
      {
        actionGroupId: actionGroupId
      }
    ]
  }
}
```

# [JSON](#tab/json)

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
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
        "description": "Full Resource ID of the resource emitting the metric that will be used for the comparison. For example /subscriptions/00000000-0000-0000-0000-0000-00000000/resourceGroups/ResourceGroupName/providers/Microsoft.compute/virtualMachines/VM_xyz"
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
      "type": "int",
      "defaultValue": 0,
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
        "Total",
        "Count"
      ],
      "metadata": {
        "description": "How the data that is collected should be combined over time."
      }
    },
    "windowSize": {
      "type": "string",
      "defaultValue": "PT5M",
      "allowedValues": [
        "PT1M",
        "PT5M",
        "PT15M",
        "PT30M",
        "PT1H",
        "PT6H",
        "PT12H",
        "PT24H"
      ],
      "metadata": {
        "description": "Period of time used to monitor alert activity based on the threshold. Must be between one minute and one day. ISO 8601 duration format."
      }
    },
    "evaluationFrequency": {
      "type": "string",
      "defaultValue": "PT1M",
      "allowedValues": [
        "PT1M",
        "PT5M",
        "PT15M",
        "PT30M",
        "PT1H"
      ],
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
  "resources": [
    {
      "type": "Microsoft.Insights/metricAlerts",
      "apiVersion": "2018-03-01",
      "name": "[parameters('alertName')]",
      "location": "global",
      "properties": {
        "description": "[parameters('alertDescription')]",
        "severity": "[parameters('alertSeverity')]",
        "enabled": "[parameters('isEnabled')]",
        "scopes": [
          "[parameters('resourceId')]"
        ],
        "evaluationFrequency": "[parameters('evaluationFrequency')]",
        "windowSize": "[parameters('windowSize')]",
        "criteria": {
          "odata.type": "Microsoft.Azure.Monitor.SingleResourceMultipleMetricCriteria",
          "allOf": [
            {
              "name": "1st criterion",
              "metricName": "[parameters('metricName')]",
              "dimensions": [],
              "operator": "[parameters('operator')]",
              "threshold": "[parameters('threshold')]",
              "timeAggregation": "[parameters('timeAggregation')]",
              "criterionType": "StaticThresholdCriterion"
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

---

### Parameter file

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "alertName": {
      "value": "New Metric Alert"
    },
    "alertDescription": {
      "value": "New metric alert created via template"
    },
    "alertSeverity": {
      "value":3
    },
    "isEnabled": {
      "value": true
    },
    "resourceId": {
      "value": "/subscriptions/replace-with-subscription-id/resourceGroups/replace-with-resourceGroup-name/providers/Microsoft.Compute/virtualMachines/replace-with-resource-name"
    },
    "metricName": {
      "value": "Percentage CPU"
    },
    "operator": {
      "value": "GreaterThan"
    },
    "threshold": {
      "value": "80"
    },
    "timeAggregation": {
      "value": "Average"
    },
    "actionGroupId": {
      "value": "/subscriptions/replace-with-subscription-id/resourceGroups/resource-group-name/providers/Microsoft.Insights/actionGroups/replace-with-action-group"
    }
  }
}
```

## Single criteria, dynamic threshold

The following sample creates a metric alert rule using a single criteria and a dynamic threshold.

### Template file

# [Bicep](#tab/bicep)

```bicep
@description('Name of the alert')
@minLength(1)
param alertName string

@description('Description of alert')
param alertDescription string = 'This is a metric alert'

@description('Severity of alert {0,1,2,3,4}')
@allowed([
  0
  1
  2
  3
  4
])
param alertSeverity int = 3

@description('Specifies whether the alert is enabled')
param isEnabled bool = true

@description('Full Resource ID of the resource emitting the metric that will be used for the comparison. For example /subscriptions/00000000-0000-0000-0000-0000-00000000/resourceGroups/ResourceGroupName/providers/Microsoft.compute/virtualMachines/VM_xyz')
@minLength(1)
param resourceId string

@description('Name of the metric used in the comparison to activate the alert.')
@minLength(1)
param metricName string

@description('Operator comparing the current value with the threshold value.')
@allowed([
  'GreaterThan'
  'LessThan'
  'GreaterOrLessThan'
])
param operator string = 'GreaterOrLessThan'

@description('Tunes how \'noisy\' the Dynamic Thresholds alerts will be: \'High\' will result in more alerts while \'Low\' will result in fewer alerts.')
@allowed([
  'High'
  'Medium'
  'Low'
])
param alertSensitivity string = 'Medium'

@description('The number of periods to check in the alert evaluation.')
param numberOfEvaluationPeriods int = 4

@description('The number of unhealthy periods to alert on (must be lower or equal to numberOfEvaluationPeriods).')
param minFailingPeriodsToAlert int = 3

@description('Use this option to set the date from which to start learning the metric historical data and calculate the dynamic thresholds (in ISO8601 format, e.g. \'2019-12-31T22:00:00Z\').')
param ignoreDataBefore string = ''

@description('How the data that is collected should be combined over time.')
@allowed([
  'Average'
  'Minimum'
  'Maximum'
  'Total'
  'Count'
])
param timeAggregation string = 'Average'

@description('Period of time used to monitor alert activity based on the threshold. Must be between five minutes and one hour. ISO 8601 duration format.')
@allowed([
  'PT5M'
  'PT15M'
  'PT30M'
  'PT1H'
])
param windowSize string = 'PT5M'

@description('how often the metric alert is evaluated represented in ISO 8601 duration format')
@allowed([
  'PT5M'
  'PT15M'
  'PT30M'
  'PT1H'
])
param evaluationFrequency string = 'PT5M'

@description('The ID of the action group that is triggered when the alert is activated or deactivated')
param actionGroupId string = ''

resource metricAlert 'Microsoft.Insights/metricAlerts@2018-03-01' = {
  name: alertName
  location: 'global'
  properties: {
    description: alertDescription
    severity: alertSeverity
    enabled: isEnabled
    scopes: [
      resourceId
    ]
    evaluationFrequency: evaluationFrequency
    windowSize: windowSize
    criteria: {
      'odata.type': 'Microsoft.Azure.Monitor.MultipleResourceMultipleMetricCriteria'
      allOf: [
        {
          criterionType: 'DynamicThresholdCriterion'
          name: '1st criterion'
          metricName: metricName
          dimensions: []
          operator: operator
          alertSensitivity: alertSensitivity
          failingPeriods: {
            numberOfEvaluationPeriods: numberOfEvaluationPeriods
            minFailingPeriodsToAlert: minFailingPeriodsToAlert
          }
          ignoreDataBefore: ignoreDataBefore
          timeAggregation: timeAggregation
        }
      ]
    }
    actions: [
      {
        actionGroupId: actionGroupId
      }
    ]
  }
}

```

# [JSON](#tab/json)

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
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
        "description": "Full Resource ID of the resource emitting the metric that will be used for the comparison. For example /subscriptions/00000000-0000-0000-0000-0000-00000000/resourceGroups/ResourceGroupName/providers/Microsoft.compute/virtualMachines/VM_xyz"
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
      "type": "int",
      "defaultValue": 4,
      "metadata": {
        "description": "The number of periods to check in the alert evaluation."
      }
    },
    "minFailingPeriodsToAlert": {
      "type": "int",
      "defaultValue": 3,
      "metadata": {
        "description": "The number of unhealthy periods to alert on (must be lower or equal to numberOfEvaluationPeriods)."
      }
    },
    "ignoreDataBefore": {
      "type": "string",
      "defaultValue": "",
      "metadata": {
        "description": "Use this option to set the date from which to start learning the metric historical data and calculate the dynamic thresholds (in ISO8601 format, e.g. '2019-12-31T22:00:00Z')."
      }
    },
    "timeAggregation": {
      "type": "string",
      "defaultValue": "Average",
      "allowedValues": [
        "Average",
        "Minimum",
        "Maximum",
        "Total",
        "Count"
      ],
      "metadata": {
        "description": "How the data that is collected should be combined over time."
      }
    },
    "windowSize": {
      "type": "string",
      "defaultValue": "PT5M",
      "allowedValues": [
        "PT5M",
        "PT15M",
        "PT30M",
        "PT1H"
      ],
      "metadata": {
        "description": "Period of time used to monitor alert activity based on the threshold. Must be between five minutes and one hour. ISO 8601 duration format."
      }
    },
    "evaluationFrequency": {
      "type": "string",
      "defaultValue": "PT5M",
      "allowedValues": [
        "PT5M",
        "PT15M",
        "PT30M",
        "PT1H"
      ],
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
  "resources": [
    {
      "type": "Microsoft.Insights/metricAlerts",
      "apiVersion": "2018-03-01",
      "name": "[parameters('alertName')]",
      "location": "global",
      "properties": {
        "description": "[parameters('alertDescription')]",
        "severity": "[parameters('alertSeverity')]",
        "enabled": "[parameters('isEnabled')]",
        "scopes": [
          "[parameters('resourceId')]"
        ],
        "evaluationFrequency": "[parameters('evaluationFrequency')]",
        "windowSize": "[parameters('windowSize')]",
        "criteria": {
          "odata.type": "Microsoft.Azure.Monitor.MultipleResourceMultipleMetricCriteria",
          "allOf": [
            {
              "criterionType": "DynamicThresholdCriterion",
              "name": "1st criterion",
              "metricName": "[parameters('metricName')]",
              "dimensions": [],
              "operator": "[parameters('operator')]",
              "alertSensitivity": "[parameters('alertSensitivity')]",
              "failingPeriods": {
                "numberOfEvaluationPeriods": "[parameters('numberOfEvaluationPeriods')]",
                "minFailingPeriodsToAlert": "[parameters('minFailingPeriodsToAlert')]"
              },
              "ignoreDataBefore": "[parameters('ignoreDataBefore')]",
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

---

### Parameter file

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "alertName": {
      "value": "New Metric Alert with Dynamic Thresholds"
    },
    "alertDescription": {
      "value": "New metric alert with Dynamic Thresholds created via template"
    },
    "alertSeverity": {
      "value":3
    },
    "isEnabled": {
      "value": true
    },
    "resourceId": {
      "value": "/subscriptions/replace-with-subscription-id/resourceGroups/replace-with-resourceGroup-name/providers/Microsoft.Compute/virtualMachines/replace-with-resource-name"
    },
    "metricName": {
      "value": "Percentage CPU"
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
    "ignoreDataBefore": {
      "value": ""
    },
    "timeAggregation": {
      "value": "Average"
    },
    "actionGroupId": {
      "value": "/subscriptions/replace-with-subscription-id/resourceGroups/resource-group-name/providers/Microsoft.Insights/actionGroups/replace-with-action-group"
    }
  }
}
```

## Multiple criteria, static threshold

Metric alerts support alerting on multi-dimensional metrics and up to 5 criteria per alert rule. The following sample creates a metric alert rule on dimensional metrics and specifies multiple criteria.

The following constraints apply when using dimensions in an alert rule that contains multiple criteria:

- You can only select one value per dimension within each criterion.
- You cannot use "\*" as a dimension value.
- When metrics that are configured in different criteria support the same dimension, then a configured dimension value must be explicitly set in the same way for all of those metrics in the relevant criteria.

  - In the example below, because both the **Transactions** and **SuccessE2ELatency** metrics have an **ApiName** dimension, and *criterion1* specifies the *"GetBlob"* value for the **ApiName** dimension, then *criterion2* must also set a *"GetBlob"* value for the **ApiName** dimension.

### Template file

# [Bicep](#tab/bicep)

```bicep
@description('Name of the alert')
param alertName string

@description('Description of alert')
param alertDescription string = 'This is a metric alert'

@description('Severity of alert {0,1,2,3,4}')
@allowed([
  0
  1
  2
  3
  4
])
param alertSeverity int = 3

@description('Specifies whether the alert is enabled')
param isEnabled bool = true

@description('Resource ID of the resource emitting the metric that will be used for the comparison.')
param resourceId string = ''

@description('Criterion includes metric name, dimension values, threshold and an operator. The alert rule fires when ALL criteria are met')
param criterion1 object

@description('Criterion includes metric name, dimension values, threshold and an operator. The alert rule fires when ALL criteria are met')
param criterion2 object

@description('Period of time used to monitor alert activity based on the threshold. Must be between one minute and one day. ISO 8601 duration format.')
@allowed([
  'PT1M'
  'PT5M'
  'PT15M'
  'PT30M'
  'PT1H'
  'PT6H'
  'PT12H'
  'PT24H'
])
param windowSize string = 'PT5M'

@description('how often the metric alert is evaluated represented in ISO 8601 duration format')
@allowed([
  'PT1M'
  'PT5M'
  'PT15M'
  'PT30M'
  'PT1H'
])
param evaluationFrequency string = 'PT1M'

@description('The ID of the action group that is triggered when the alert is activated or deactivated')
param actionGroupId string = ''

var criterion1_var = array(criterion1)
var criterion2_var = array(criterion2)
var criteria = concat(criterion1_var, criterion2_var)

resource metricAlert 'Microsoft.Insights/metricAlerts@2018-03-01' = {
  name: alertName
  location: 'global'
  properties: {
    description: alertDescription
    severity: alertSeverity
    enabled: isEnabled
    scopes: [
      resourceId
    ]
    evaluationFrequency: evaluationFrequency
    windowSize: windowSize
    criteria: {
      'odata.type': 'Microsoft.Azure.Monitor.SingleResourceMultipleMetricCriteria'
      allOf: criteria
    }
    actions: [
      {
        actionGroupId: actionGroupId
      }
    ]
  }
}
```

# [JSON](#tab/json)

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "alertName": {
      "type": "string",
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
      "defaultValue": "",
      "metadata": {
        "description": "Resource ID of the resource emitting the metric that will be used for the comparison."
      }
    },
    "criterion1": {
      "type": "object",
      "metadata": {
        "description": "Criterion includes metric name, dimension values, threshold and an operator. The alert rule fires when ALL criteria are met"
      }
    },
    "criterion2": {
      "type": "object",
      "metadata": {
        "description": "Criterion includes metric name, dimension values, threshold and an operator. The alert rule fires when ALL criteria are met"
      }
    },
    "windowSize": {
      "type": "string",
      "defaultValue": "PT5M",
      "allowedValues": [
        "PT1M",
        "PT5M",
        "PT15M",
        "PT30M",
        "PT1H",
        "PT6H",
        "PT12H",
        "PT24H"
      ],
      "metadata": {
        "description": "Period of time used to monitor alert activity based on the threshold. Must be between one minute and one day. ISO 8601 duration format."
      }
    },
    "evaluationFrequency": {
      "type": "string",
      "defaultValue": "PT1M",
      "allowedValues": [
        "PT1M",
        "PT5M",
        "PT15M",
        "PT30M",
        "PT1H"
      ],
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
    "criterion1_var": "[array(parameters('criterion1'))]",
    "criterion2_var": "[array(parameters('criterion2'))]",
    "criteria": "[concat(variables('criterion1_var'), variables('criterion2_var'))]"
  },
  "resources": [
    {
      "type": "Microsoft.Insights/metricAlerts",
      "apiVersion": "2018-03-01",
      "name": "[parameters('alertName')]",
      "location": "global",
      "properties": {
        "description": "[parameters('alertDescription')]",
        "severity": "[parameters('alertSeverity')]",
        "enabled": "[parameters('isEnabled')]",
        "scopes": [
          "[parameters('resourceId')]"
        ],
        "evaluationFrequency": "[parameters('evaluationFrequency')]",
        "windowSize": "[parameters('windowSize')]",
        "criteria": {
          "odata.type": "Microsoft.Azure.Monitor.SingleResourceMultipleMetricCriteria",
          "allOf": "[variables('criteria')]"
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

---

### Parameter file

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "alertName": {
      "value": "New Multi-dimensional Metric Alert (Replace with your alert name)"
    },
    "alertDescription": {
      "value": "New multi-dimensional metric alert created via template (Replace with your alert description)"
    },
    "alertSeverity": {
      "value": 3
    },
    "isEnabled": {
      "value": true
    },
    "resourceId": {
      "value": "/subscriptions/replace-with-subscription-id/resourceGroups/replace-with-resourcegroup-name/providers/Microsoft.Storage/storageAccounts/replace-with-storage-account"
    },
    "criterion1": {
      "value": {
        "name": "1st criterion",
        "metricName": "Transactions",
        "dimensions": [
          {
            "name": "ResponseType",
            "operator": "Include",
            "values": [ "Success" ]
          },
          {
            "name": "ApiName",
            "operator": "Include",
            "values": [ "GetBlob" ]
          }
        ],
        "operator": "GreaterThan",
        "threshold": "5",
        "timeAggregation": "Total"
      }
    },
    "criterion2": {
      "value": {
        "name": "2nd criterion",
        "metricName": "SuccessE2ELatency",
        "dimensions": [
          {
            "name": "ApiName",
            "operator": "Include",
            "values": [ "GetBlob" ]
          }
        ],
        "operator": "GreaterThan",
        "threshold": "250",
        "timeAggregation": "Average"
      }
    },
    "actionGroupId": {
      "value": "/subscriptions/replace-with-subscription-id/resourceGroups/replace-with-resource-group-name/providers/Microsoft.Insights/actionGroups/replace-with-actiongroup-name"
    }
  }
}
```

## Multiple dimensions, static threshold

A single alert rule can monitor multiple metric time series at a time, which results in fewer alert rules to manage. The following sample creates a static metric alert rule on dimensional metrics.

In this sample, the alert rule monitors the dimensions value combinations of the **ResponseType** and **ApiName** dimensions for the **Transactions** metric:

1. **ResponsType** - The use of the "\*" wildcard means that for each value of the **ResponseType** dimension, including future values, a different time series is monitored individually.
2. **ApiName** - A different time series is monitored only for the **GetBlob** and **PutBlob** dimension values.

For example, a few of the potential time series that are monitored by this alert rule are:

- Metric = *Transactions*, ResponseType = *Success*, ApiName = *GetBlob*
- Metric = *Transactions*, ResponseType = *Success*, ApiName = *PutBlob*
- Metric = *Transactions*, ResponseType = *Server Timeout*, ApiName = *GetBlob*
- Metric = *Transactions*, ResponseType = *Server Timeout*, ApiName = *PutBlob*

### Template file

# [Bicep](#tab/bicep)

```bicep
@description('Name of the alert')
param alertName string

@description('Description of alert')
param alertDescription string = 'This is a metric alert'

@description('Severity of alert {0,1,2,3,4}')
@allowed([
  0
  1
  2
  3
  4
])
param alertSeverity int = 3

@description('Specifies whether the alert is enabled')
param isEnabled bool = true

@description('Resource ID of the resource emitting the metric that will be used for the comparison.')
param resourceId string = ''

@description('Criterion includes metric name, dimension values, threshold and an operator. The alert rule fires when ALL criteria are met')
param criterion object

@description('Period of time used to monitor alert activity based on the threshold. Must be between one minute and one day. ISO 8601 duration format.')
@allowed([
  'PT1M'
  'PT5M'
  'PT15M'
  'PT30M'
  'PT1H'
  'PT6H'
  'PT12H'
  'PT24H'
])
param windowSize string = 'PT5M'

@description('how often the metric alert is evaluated represented in ISO 8601 duration format')
@allowed([
  'PT1M'
  'PT5M'
  'PT15M'
  'PT30M'
  'PT1H'
])
param evaluationFrequency string = 'PT1M'

@description('The ID of the action group that is triggered when the alert is activated or deactivated')
param actionGroupId string = ''

var criteria = array(criterion)

resource metricAlert 'Microsoft.Insights/metricAlerts@2018-03-01' = {
  name: alertName
  location: 'global'
  properties: {
    description: alertDescription
    severity: alertSeverity
    enabled: isEnabled
    scopes: [
      resourceId
    ]
    evaluationFrequency: evaluationFrequency
    windowSize: windowSize
    criteria: {
      'odata.type': 'Microsoft.Azure.Monitor.SingleResourceMultipleMetricCriteria'
      allOf: criteria
    }
    actions: [
      {
        actionGroupId: actionGroupId
      }
    ]
  }
}
```

# [JSON](#tab/json)

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "alertName": {
      "type": "string",
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
      "defaultValue": "",
      "metadata": {
        "description": "Resource ID of the resource emitting the metric that will be used for the comparison."
      }
    },
    "criterion": {
      "type": "object",
      "metadata": {
        "description": "Criterion includes metric name, dimension values, threshold and an operator. The alert rule fires when ALL criteria are met"
      }
    },
    "windowSize": {
      "type": "string",
      "defaultValue": "PT5M",
      "allowedValues": [
        "PT1M",
        "PT5M",
        "PT15M",
        "PT30M",
        "PT1H",
        "PT6H",
        "PT12H",
        "PT24H"
      ],
      "metadata": {
        "description": "Period of time used to monitor alert activity based on the threshold. Must be between one minute and one day. ISO 8601 duration format."
      }
    },
    "evaluationFrequency": {
      "type": "string",
      "defaultValue": "PT1M",
      "allowedValues": [
        "PT1M",
        "PT5M",
        "PT15M",
        "PT30M",
        "PT1H"
      ],
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
    "criteria": "[array(parameters('criterion'))]"
  },
  "resources": [
    {
      "type": "Microsoft.Insights/metricAlerts",
      "apiVersion": "2018-03-01",
      "name": "[parameters('alertName')]",
      "location": "global",
      "properties": {
        "description": "[parameters('alertDescription')]",
        "severity": "[parameters('alertSeverity')]",
        "enabled": "[parameters('isEnabled')]",
        "scopes": [
          "[parameters('resourceId')]"
        ],
        "evaluationFrequency": "[parameters('evaluationFrequency')]",
        "windowSize": "[parameters('windowSize')]",
        "criteria": {
          "odata.type": "Microsoft.Azure.Monitor.SingleResourceMultipleMetricCriteria",
          "allOf": "[variables('criteria')]"
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

---

### Parameter file

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "alertName": {
      "value": "New multi-dimensional metric alert rule (replace with your alert name)"
    },
    "alertDescription": {
      "value": "New multi-dimensional metric alert rule created via template (replace with your alert description)"
    },
    "alertSeverity": {
      "value": 3
    },
    "isEnabled": {
      "value": true
    },
    "resourceId": {
      "value": "/subscriptions/replace-with-subscription-id/resourceGroups/replace-with-resourcegroup-name/providers/Microsoft.Storage/storageAccounts/replace-with-storage-account"
    },
    "criterion": {
      "value": {
        "name": "Criterion",
        "metricName": "Transactions",
        "dimensions": [
          {
            "name": "ResponseType",
            "operator": "Include",
            "values": [ "*" ]
          },
          {
            "name": "ApiName",
            "operator": "Include",
            "values": [ "GetBlob", "PutBlob" ]
          }
        ],
        "operator": "GreaterThan",
        "threshold": "5",
        "timeAggregation": "Total"
      }
    },
    "actionGroupId": {
      "value": "/subscriptions/replace-with-subscription-id/resourceGroups/replace-with-resource-group-name/providers/Microsoft.Insights/actionGroups/replace-with-actiongroup-name"
    }
  }
}
```

> [!NOTE]
>
> Using "All" as a dimension value is equivalent to selecting "\*" (all current and future values).


## Multiple dimensions, dynamic thresholds

A single dynamic thresholds alert rule can create tailored thresholds for hundreds of metric time series (even different types) at a time, which results in fewer alert rules to manage. The following sample creates a dynamic thresholds metric alert rule on dimensional metrics.

In this sample, the alert rule monitors the dimensions value combinations of the **ResponseType** and **ApiName** dimensions for the **Transactions** metric:

1. **ResponsType** - For each value of the **ResponseType** dimension, including future values, a different time series is monitored individually.
2. **ApiName** - A different time series is monitored only for the **GetBlob** and **PutBlob** dimension values.

For example, a few of the potential time series that are monitored by this alert rule are:

- Metric = *Transactions*, ResponseType = *Success*, ApiName = *GetBlob*
- Metric = *Transactions*, ResponseType = *Success*, ApiName = *PutBlob*
- Metric = *Transactions*, ResponseType = *Server Timeout*, ApiName = *GetBlob*
- Metric = *Transactions*, ResponseType = *Server Timeout*, ApiName = *PutBlob*

>[!NOTE]
> Multiple criteria are not currently supported for metric alert rules that use dynamic thresholds.

### Template file

# [Bicep](#tab/bicep)

```bicep
@description('Name of the alert')
param alertName string

@description('Description of alert')
param alertDescription string = 'This is a metric alert'

@description('Severity of alert {0,1,2,3,4}')
@allowed([
  0
  1
  2
  3
  4
])
param alertSeverity int = 3

@description('Specifies whether the alert is enabled')
param isEnabled bool = true

@description('Resource ID of the resource emitting the metric that will be used for the comparison.')
param resourceId string = ''

@description('Criterion includes metric name, dimension values, threshold and an operator.')
param criterion object

@description('Period of time used to monitor alert activity based on the threshold. Must be between five minutes and one hour. ISO 8601 duration format.')
@allowed([
  'PT5M'
  'PT15M'
  'PT30M'
  'PT1H'
])
param windowSize string = 'PT5M'

@description('how often the metric alert is evaluated represented in ISO 8601 duration format')
@allowed([
  'PT5M'
  'PT15M'
  'PT30M'
  'PT1H'
])
param evaluationFrequency string = 'PT5M'

@description('The ID of the action group that is triggered when the alert is activated or deactivated')
param actionGroupId string = ''

var criteria = array(criterion)

resource metricAlert 'Microsoft.Insights/metricAlerts@2018-03-01' = {
  name: alertName
  location: 'global'
  properties: {
    description: alertDescription
    severity: alertSeverity
    enabled: isEnabled
    scopes: [
      resourceId
    ]
    evaluationFrequency: evaluationFrequency
    windowSize: windowSize
    criteria: {
      'odata.type': 'Microsoft.Azure.Monitor.MultipleResourceMultipleMetricCriteria'
      allOf: criteria
    }
    actions: [
      {
        actionGroupId: actionGroupId
      }
    ]
  }
}
```

# [JSON](#tab/json)

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "alertName": {
      "type": "string",
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
      "defaultValue": "",
      "metadata": {
        "description": "Resource ID of the resource emitting the metric that will be used for the comparison."
      }
    },
    "criterion": {
      "type": "object",
      "metadata": {
        "description": "Criterion includes metric name, dimension values, threshold and an operator."
      }
    },
    "windowSize": {
      "type": "string",
      "defaultValue": "PT5M",
      "allowedValues": [
        "PT5M",
        "PT15M",
        "PT30M",
        "PT1H"
      ],
      "metadata": {
        "description": "Period of time used to monitor alert activity based on the threshold. Must be between five minutes and one hour. ISO 8601 duration format."
      }
    },
    "evaluationFrequency": {
      "type": "string",
      "defaultValue": "PT5M",
      "allowedValues": [
        "PT5M",
        "PT15M",
        "PT30M",
        "PT1H"
      ],
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
    "criteria": "[array(parameters('criterion'))]"
  },
  "resources": [
    {
      "type": "Microsoft.Insights/metricAlerts",
      "apiVersion": "2018-03-01",
      "name": "[parameters('alertName')]",
      "location": "global",
      "properties": {
        "description": "[parameters('alertDescription')]",
        "severity": "[parameters('alertSeverity')]",
        "enabled": "[parameters('isEnabled')]",
        "scopes": [
          "[parameters('resourceId')]"
        ],
        "evaluationFrequency": "[parameters('evaluationFrequency')]",
        "windowSize": "[parameters('windowSize')]",
        "criteria": {
          "odata.type": "Microsoft.Azure.Monitor.MultipleResourceMultipleMetricCriteria",
          "allOf": "[variables('criteria')]"
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

---

### Parameter file

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "alertName": {
      "value": "New Multi-dimensional Metric Alert with Dynamic Thresholds (Replace with your alert name)"
    },
    "alertDescription": {
      "value": "New multi-dimensional metric alert with Dynamic Thresholds created via template (Replace with your alert description)"
    },
    "alertSeverity": {
      "value": 3
    },
    "isEnabled": {
      "value": true
    },
    "resourceId": {
      "value": "/subscriptions/replace-with-subscription-id/resourceGroups/replace-with-resourcegroup-name/providers/Microsoft.Storage/storageAccounts/replace-with-storage-account"
    },
    "criterion": {
      "value": {
        "criterionType": "DynamicThresholdCriterion",
        "name": "1st criterion",
        "metricName": "Transactions",
        "dimensions": [
          {
            "name": "ResponseType",
            "operator": "Include",
            "values": [ "*" ]
          },
          {
            "name": "ApiName",
            "operator": "Include",
            "values": [ "GetBlob", "PutBlob" ]
          }
        ],
        "operator": "GreaterOrLessThan",
        "alertSensitivity": "Medium",
        "failingPeriods": {
          "numberOfEvaluationPeriods": "4",
          "minFailingPeriodsToAlert": "3"
        },
        "timeAggregation": "Total"
      }
    },
    "actionGroupId": {
      "value": "/subscriptions/replace-with-subscription-id/resourceGroups/replace-with-resource-group-name/providers/Microsoft.Insights/actionGroups/replace-with-actiongroup-name"
    }
  }
}
```

## Custom metric, static threshold

You can use the following template to create a more advanced static threshold metric alert rule on a custom metric.

To learn more about custom metrics in Azure Monitor, see [Custom metrics in Azure Monitor](../essentials/metrics-custom-overview.md).

When creating an alert rule on a custom metric, you need to specify both the metric name and the metric namespace. You should also make sure that the custom metric is already being reported, as you cannot create an alert rule on a custom metric that doesn't yet exist.

### Template file

# [Bicep](#tab/bicep)

```bicep
@description('Name of the alert')
@minLength(1)
param alertName string

@description('Description of alert')
param alertDescription string = 'This is a metric alert'

@description('Severity of alert {0,1,2,3,4}')
@allowed([
  0
  1
  2
  3
  4
])
param alertSeverity int = 3

@description('Specifies whether the alert is enabled')
param isEnabled bool = true

@description('Full Resource ID of the resource emitting the metric that will be used for the comparison. For example /subscriptions/00000000-0000-0000-0000-0000-00000000/resourceGroups/ResourceGroupName/providers/Microsoft.compute/virtualMachines/VM_xyz')
@minLength(1)
param resourceId string

@description('Name of the metric used in the comparison to activate the alert.')
@minLength(1)
param metricName string

@description('Namespace of the metric used in the comparison to activate the alert.')
@minLength(1)
param metricNamespace string

@description('Operator comparing the current value with the threshold value.')
@allowed([
  'Equals'
  'GreaterThan'
  'GreaterThanOrEqual'
  'LessThan'
  'LessThanOrEqual'
])
param operator string = 'GreaterThan'

@description('The threshold value at which the alert is activated.')
param threshold int = 0

@description('How the data that is collected should be combined over time.')
@allowed([
  'Average'
  'Minimum'
  'Maximum'
  'Total'
  'Count'
])
param timeAggregation string = 'Average'

@description('Period of time used to monitor alert activity based on the threshold. Must be between one minute and one day. ISO 8601 duration format.')
@allowed([
  'PT1M'
  'PT5M'
  'PT15M'
  'PT30M'
  'PT1H'
  'PT6H'
  'PT12H'
  'PT24H'
])
param windowSize string = 'PT5M'

@description('How often the metric alert is evaluated represented in ISO 8601 duration format')
@allowed([
  'PT1M'
  'PT5M'
  'PT15M'
  'PT30M'
  'PT1H'
])
param evaluationFrequency string = 'PT1M'

@description('The ID of the action group that is triggered when the alert is activated or deactivated')
param actionGroupId string = ''

resource metricAlert 'Microsoft.Insights/metricAlerts@2018-03-01' = {
  name: alertName
  location: 'global'
  properties: {
    description: alertDescription
    severity: alertSeverity
    enabled: isEnabled
    scopes: [
      resourceId
    ]
    evaluationFrequency: evaluationFrequency
    windowSize: windowSize
    criteria: {
      'odata.type': 'Microsoft.Azure.Monitor.SingleResourceMultipleMetricCriteria'
      allOf: [
        {
          name: '1st criterion'
          metricName: metricName
          metricNamespace: metricNamespace
          dimensions: []
          operator: operator
          threshold: threshold
          timeAggregation: timeAggregation
          criterionType: 'StaticThresholdCriterion'
        }
      ]
    }
    actions: [
      {
        actionGroupId: actionGroupId
      }
    ]
  }
}
```

# [JSON](#tab/json)

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
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
        "description": "Full Resource ID of the resource emitting the metric that will be used for the comparison. For example /subscriptions/00000000-0000-0000-0000-0000-00000000/resourceGroups/ResourceGroupName/providers/Microsoft.compute/virtualMachines/VM_xyz"
      }
    },
    "metricName": {
      "type": "string",
      "minLength": 1,
      "metadata": {
        "description": "Name of the metric used in the comparison to activate the alert."
      }
    },
    "metricNamespace": {
      "type": "string",
      "minLength": 1,
      "metadata": {
        "description": "Namespace of the metric used in the comparison to activate the alert."
      }
    },
    "operator": {
      "type": "string",
      "defaultValue": "GreaterThan",
      "allowedValues": [
        "Equals",
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
      "type": "int",
      "defaultValue": 0,
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
        "Total",
        "Count"
      ],
      "metadata": {
        "description": "How the data that is collected should be combined over time."
      }
    },
    "windowSize": {
      "type": "string",
      "defaultValue": "PT5M",
      "allowedValues": [
        "PT1M",
        "PT5M",
        "PT15M",
        "PT30M",
        "PT1H",
        "PT6H",
        "PT12H",
        "PT24H"
      ],
      "metadata": {
        "description": "Period of time used to monitor alert activity based on the threshold. Must be between one minute and one day. ISO 8601 duration format."
      }
    },
    "evaluationFrequency": {
      "type": "string",
      "defaultValue": "PT1M",
      "allowedValues": [
        "PT1M",
        "PT5M",
        "PT15M",
        "PT30M",
        "PT1H"
      ],
      "metadata": {
        "description": "How often the metric alert is evaluated represented in ISO 8601 duration format"
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
  "resources": [
    {
      "type": "Microsoft.Insights/metricAlerts",
      "apiVersion": "2018-03-01",
      "name": "[parameters('alertName')]",
      "location": "global",
      "properties": {
        "description": "[parameters('alertDescription')]",
        "severity": "[parameters('alertSeverity')]",
        "enabled": "[parameters('isEnabled')]",
        "scopes": [
          "[parameters('resourceId')]"
        ],
        "evaluationFrequency": "[parameters('evaluationFrequency')]",
        "windowSize": "[parameters('windowSize')]",
        "criteria": {
          "odata.type": "Microsoft.Azure.Monitor.SingleResourceMultipleMetricCriteria",
          "allOf": [
            {
              "name": "1st criterion",
              "metricName": "[parameters('metricName')]",
              "metricNamespace": "[parameters('metricNamespace')]",
              "dimensions": [],
              "operator": "[parameters('operator')]",
              "threshold": "[parameters('threshold')]",
              "timeAggregation": "[parameters('timeAggregation')]",
              "criterionType": "StaticThresholdCriterion"
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

---

### Parameter file

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "alertName": {
      "value": "New alert rule on a custom metric"
    },
    "alertDescription": {
      "value": "New alert rule on a custom metric created via template"
    },
    "alertSeverity": {
      "value": 3
    },
    "isEnabled": {
      "value": true
    },
    "resourceId": {
      "value": "/subscriptions/replace-with-subscription-id/resourceGroups/replace-with-resourceGroup-name/providers/microsoft.insights/components/replace-with-application-insights-resource-name"
    },
    "metricName": {
      "value": "The custom metric name"
    },
    "metricNamespace": {
      "value": "Azure.ApplicationInsights"
    },
    "operator": {
      "value": "GreaterThan"
    },
    "threshold": {
      "value": "80"
    },
    "timeAggregation": {
      "value": "Average"
    },
    "actionGroupId": {
      "value": "/subscriptions/replace-with-subscription-id/resourceGroups/resource-group-name/providers/Microsoft.Insights/actionGroups/replace-with-action-group"
    }
  }
}
```

> [!NOTE]
>
> You can find the metric namespace of a specific custom metric by [browsing your custom metrics via the Azure portal](../essentials/metrics-custom-overview.md#browse-your-custom-metrics-via-the-azure-portal)

## Multiple resources

Azure Monitor supports monitoring multiple resources of the same type with a single metric alert rule, for resources that exist in the same Azure region. This feature is currently only supported in Azure public cloud and only for Virtual machines, SQL server databases, SQL server elastic pools and Azure Stack Edge devices. Also, this feature is only available for platform metrics, and isn't supported for custom metrics.

Dynamic Thresholds alerts rule can also help create tailored thresholds for hundreds of metric series (even different types) at a time, which results in fewer alert rules to manage.

This section will describe Azure Resource Manager templates for three scenarios to monitor multiple resources with a single rule.

- Monitoring all virtual machines (in one Azure region) in one or more resource groups.
- Monitoring all virtual machines (in one Azure region) in a subscription.
- Monitoring a list of virtual machines (in one Azure region) in a subscription.

> [!NOTE]
>
> In a metric alert rule that monitors multiple resources, only one condition is allowed.

### Static threshold alert on all virtual machines in one or more resource groups

This template will create a static threshold metric alert rule that monitors Percentage CPU for all virtual machines (in one Azure region) in one or more resource groups.

Save the json below as all-vms-in-resource-group-static.json for the purpose of this walk-through.

### Template file

# [Bicep](#tab/bicep)

```bicep
@description('Name of the alert')
@minLength(1)
param alertName string

@description('Description of alert')
param alertDescription string = 'This is a metric alert'

@description('Severity of alert {0,1,2,3,4}')
@allowed([
  0
  1
  2
  3
  4
])
param alertSeverity int = 3

@description('Specifies whether the alert is enabled')
param isEnabled bool = true

@description('Full path of the resource group(s) where target resources to be monitored are in. For example - /subscriptions/00000000-0000-0000-0000-0000-00000000/resourceGroups/ResourceGroupName')
@minLength(1)
param targetResourceGroup array

@description('Azure region in which target resources to be monitored are in (without spaces). For example: EastUS')
@allowed([
  'EastUS'
  'EastUS2'
  'CentralUS'
  'NorthCentralUS'
  'SouthCentralUS'
  'WestCentralUS'
  'WestUS'
  'WestUS2'
  'CanadaEast'
  'CanadaCentral'
  'BrazilSouth'
  'NorthEurope'
  'WestEurope'
  'FranceCentral'
  'FranceSouth'
  'UKWest'
  'UKSouth'
  'GermanyCentral'
  'GermanyNortheast'
  'GermanyNorth'
  'GermanyWestCentral'
  'SwitzerlandNorth'
  'SwitzerlandWest'
  'NorwayEast'
  'NorwayWest'
  'SoutheastAsia'
  'EastAsia'
  'AustraliaEast'
  'AustraliaSoutheast'
  'AustraliaCentral'
  'AustraliaCentral2'
  'ChinaEast'
  'ChinaNorth'
  'ChinaEast2'
  'ChinaNorth2'
  'CentralIndia'
  'WestIndia'
  'SouthIndia'
  'JapanEast'
  'JapanWest'
  'KoreaCentral'
  'KoreaSouth'
  'SouthAfricaWest'
  'SouthAfricaNorth'
  'UAECentral'
  'UAENorth'
])
param targetResourceRegion string

@description('Resource type of target resources to be monitored.')
@minLength(1)
param targetResourceType string

@description('Name of the metric used in the comparison to activate the alert.')
@minLength(1)
param metricName string

@description('Operator comparing the current value with the threshold value.')
@allowed([
  'Equals'
  'GreaterThan'
  'GreaterThanOrEqual'
  'LessThan'
  'LessThanOrEqual'
])
param operator string = 'GreaterThan'

@description('The threshold value at which the alert is activated.')
param threshold string = '0'

@description('How the data that is collected should be combined over time.')
@allowed([
  'Average'
  'Minimum'
  'Maximum'
  'Total'
  'Count'
])
param timeAggregation string = 'Average'

@description('Period of time used to monitor alert activity based on the threshold. Must be between one minute and one day. ISO 8601 duration format.')
@allowed([
  'PT1M'
  'PT5M'
  'PT15M'
  'PT30M'
  'PT1H'
  'PT6H'
  'PT12H'
  'PT24H'
])
param windowSize string = 'PT5M'

@description('how often the metric alert is evaluated represented in ISO 8601 duration format')
@allowed([
  'PT1M'
  'PT5M'
  'PT15M'
  'PT30M'
])
param evaluationFrequency string = 'PT1M'

@description('The ID of the action group that is triggered when the alert is activated or deactivated')
param actionGroupId string = ''

resource metricAlert 'Microsoft.Insights/metricAlerts@2018-03-01' = {
  name: alertName
  location: 'global'
  properties: {
    description: alertDescription
    severity: alertSeverity
    enabled: isEnabled
    scopes: targetResourceGroup
    targetResourceType: targetResourceType
    targetResourceRegion: targetResourceRegion
    evaluationFrequency: evaluationFrequency
    windowSize: windowSize
    criteria: {
      'odata.type': 'Microsoft.Azure.Monitor.MultipleResourceMultipleMetricCriteria'
      allOf: [
        {
          name: '1st criterion'
          metricName: metricName
          dimensions: []
          operator: operator
          threshold: threshold
          timeAggregation: timeAggregation
          criterionType: 'StaticThresholdCriterion'
        }
      ]
    }
    actions: [
      {
        actionGroupId: actionGroupId
      }
    ]
  }
}
```

# [JSON](#tab/json)

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
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
    "targetResourceGroup": {
      "type": "array",
      "minLength": 1,
      "metadata": {
        "description": "Full path of the resource group(s) where target resources to be monitored are in. For example - /subscriptions/00000000-0000-0000-0000-0000-00000000/resourceGroups/ResourceGroupName"
      }
    },
    "targetResourceRegion": {
      "type": "string",
      "allowedValues": [
        "EastUS",
        "EastUS2",
        "CentralUS",
        "NorthCentralUS",
        "SouthCentralUS",
        "WestCentralUS",
        "WestUS",
        "WestUS2",
        "CanadaEast",
        "CanadaCentral",
        "BrazilSouth",
        "NorthEurope",
        "WestEurope",
        "FranceCentral",
        "FranceSouth",
        "UKWest",
        "UKSouth",
        "GermanyCentral",
        "GermanyNortheast",
        "GermanyNorth",
        "GermanyWestCentral",
        "SwitzerlandNorth",
        "SwitzerlandWest",
        "NorwayEast",
        "NorwayWest",
        "SoutheastAsia",
        "EastAsia",
        "AustraliaEast",
        "AustraliaSoutheast",
        "AustraliaCentral",
        "AustraliaCentral2",
        "ChinaEast",
        "ChinaNorth",
        "ChinaEast2",
        "ChinaNorth2",
        "CentralIndia",
        "WestIndia",
        "SouthIndia",
        "JapanEast",
        "JapanWest",
        "KoreaCentral",
        "KoreaSouth",
        "SouthAfricaWest",
        "SouthAfricaNorth",
        "UAECentral",
        "UAENorth"
      ],
      "metadata": {
        "description": "Azure region in which target resources to be monitored are in (without spaces). For example: EastUS"
      }
    },
    "targetResourceType": {
      "type": "string",
      "minLength": 1,
      "metadata": {
        "description": "Resource type of target resources to be monitored."
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
        "Total",
        "Count"
      ],
      "metadata": {
        "description": "How the data that is collected should be combined over time."
      }
    },
    "windowSize": {
      "type": "string",
      "defaultValue": "PT5M",
      "allowedValues": [
        "PT1M",
        "PT5M",
        "PT15M",
        "PT30M",
        "PT1H",
        "PT6H",
        "PT12H",
        "PT24H"
      ],
      "metadata": {
        "description": "Period of time used to monitor alert activity based on the threshold. Must be between one minute and one day. ISO 8601 duration format."
      }
    },
    "evaluationFrequency": {
      "type": "string",
      "defaultValue": "PT1M",
      "allowedValues": [
        "PT1M",
        "PT5M",
        "PT15M",
        "PT30M"
      ],
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
  "resources": [
    {
      "type": "Microsoft.Insights/metricAlerts",
      "apiVersion": "2018-03-01",
      "name": "[parameters('alertName')]",
      "location": "global",
      "properties": {
        "description": "[parameters('alertDescription')]",
        "severity": "[parameters('alertSeverity')]",
        "enabled": "[parameters('isEnabled')]",
        "scopes": "[parameters('targetResourceGroup')]",
        "targetResourceType": "[parameters('targetResourceType')]",
        "targetResourceRegion": "[parameters('targetResourceRegion')]",
        "evaluationFrequency": "[parameters('evaluationFrequency')]",
        "windowSize": "[parameters('windowSize')]",
        "criteria": {
          "odata.type": "Microsoft.Azure.Monitor.MultipleResourceMultipleMetricCriteria",
          "allOf": [
            {
              "name": "1st criterion",
              "metricName": "[parameters('metricName')]",
              "dimensions": [],
              "operator": "[parameters('operator')]",
              "threshold": "[parameters('threshold')]",
              "timeAggregation": "[parameters('timeAggregation')]",
              "criterionType": "StaticThresholdCriterion"
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

---

### Parameter file

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "alertName": {
      "value": "Multi-resource metric alert via Azure Resource Manager template"
    },
    "alertDescription": {
      "value": "New Multi-resource metric alert created via template"
    },
    "alertSeverity": {
      "value": 3
    },
    "isEnabled": {
      "value": true
    },
    "targetResourceGroup": {
      "value": [
        "/subscriptions/replace-with-subscription-id/resourceGroups/replace-with-resource-group-name1",
        "/subscriptions/replace-with-subscription-id/resourceGroups/replace-with-resource-group-name2"
      ]
    },
    "targetResourceRegion": {
      "value": "SouthCentralUS"
    },
    "targetResourceType": {
      "value": "Microsoft.Compute/virtualMachines"
    },
    "metricName": {
      "value": "Percentage CPU"
    },
    "operator": {
      "value": "GreaterThan"
    },
    "threshold": {
      "value": "0"
    },
    "timeAggregation": {
      "value": "Average"
    },
    "actionGroupId": {
      "value": "/subscriptions/replace-with-subscription-id/resourceGroups/replace-with-resource-group-name/providers/Microsoft.Insights/actionGroups/replace-with-action-group-name"
    }
  }
}
```

### Dynamic Thresholds alert on all virtual machines in one or more resource groups

This sample creates a dynamic thresholds metric alert rule that monitors Percentage CPU for all virtual machines in one Azure region in one or more resource groups.

### Template file

# [Bicep](#tab/bicep)

```bicep
@description('Name of the alert')
@minLength(1)
param alertName string

@description('Description of alert')
param alertDescription string = 'This is a metric alert'

@description('Severity of alert {0,1,2,3,4}')
@allowed([
  0
  1
  2
  3
  4
])
param alertSeverity int = 3

@description('Specifies whether the alert is enabled')
param isEnabled bool = true

@description('Full path of the resource group(s) where target resources to be monitored are in. For example - /subscriptions/00000000-0000-0000-0000-0000-00000000/resourceGroups/ResourceGroupName')
@minLength(1)
param targetResourceGroup array

@description('Azure region in which target resources to be monitored are in (without spaces). For example: EastUS')
@allowed([
  'EastUS'
  'EastUS2'
  'CentralUS'
  'NorthCentralUS'
  'SouthCentralUS'
  'WestCentralUS'
  'WestUS'
  'WestUS2'
  'CanadaEast'
  'CanadaCentral'
  'BrazilSouth'
  'NorthEurope'
  'WestEurope'
  'FranceCentral'
  'FranceSouth'
  'UKWest'
  'UKSouth'
  'GermanyCentral'
  'GermanyNortheast'
  'GermanyNorth'
  'GermanyWestCentral'
  'SwitzerlandNorth'
  'SwitzerlandWest'
  'NorwayEast'
  'NorwayWest'
  'SoutheastAsia'
  'EastAsia'
  'AustraliaEast'
  'AustraliaSoutheast'
  'AustraliaCentral'
  'AustraliaCentral2'
  'ChinaEast'
  'ChinaNorth'
  'ChinaEast2'
  'ChinaNorth2'
  'CentralIndia'
  'WestIndia'
  'SouthIndia'
  'JapanEast'
  'JapanWest'
  'KoreaCentral'
  'KoreaSouth'
  'SouthAfricaWest'
  'SouthAfricaNorth'
  'UAECentral'
  'UAENorth'
])
param targetResourceRegion string

@description('Resource type of target resources to be monitored.')
@minLength(1)
param targetResourceType string

@description('Name of the metric used in the comparison to activate the alert.')
@minLength(1)
param metricName string

@description('Operator comparing the current value with the threshold value.')
@allowed([
  'GreaterThan'
  'LessThan'
  'GreaterOrLessThan'
])
param operator string = 'GreaterOrLessThan'

@description('Tunes how \'noisy\' the Dynamic Thresholds alerts will be: \'High\' will result in more alerts while \'Low\' will result in fewer alerts.')
@allowed([
  'High'
  'Medium'
  'Low'
])
param alertSensitivity string = 'Medium'

@description('The number of periods to check in the alert evaluation.')
param numberOfEvaluationPeriods int = 4

@description('The number of unhealthy periods to alert on (must be lower or equal to numberOfEvaluationPeriods).')
param minFailingPeriodsToAlert int = 3

@description('How the data that is collected should be combined over time.')
@allowed([
  'Average'
  'Minimum'
  'Maximum'
  'Total'
  'Count'
])
param timeAggregation string = 'Average'

@description('Period of time used to monitor alert activity based on the threshold. Must be between five minutes and one hour. ISO 8601 duration format.')
@allowed([
  'PT5M'
  'PT15M'
  'PT30M'
  'PT1H'
])
param windowSize string = 'PT5M'

@description('how often the metric alert is evaluated represented in ISO 8601 duration format')
@allowed([
  'PT5M'
  'PT15M'
  'PT30M'
  'PT1H'
])
param evaluationFrequency string = 'PT5M'

@description('The ID of the action group that is triggered when the alert is activated or deactivated')
param actionGroupId string = ''

resource metricAlert 'Microsoft.Insights/metricAlerts@2018-03-01' = {
  name: alertName
  location: 'global'
  properties: {
    description: alertDescription
    severity: alertSeverity
    enabled: isEnabled
    scopes: targetResourceGroup
    targetResourceType: targetResourceType
    targetResourceRegion: targetResourceRegion
    evaluationFrequency: evaluationFrequency
    windowSize: windowSize
    criteria: {
      'odata.type': 'Microsoft.Azure.Monitor.MultipleResourceMultipleMetricCriteria'
      allOf: [
        {
          criterionType: 'DynamicThresholdCriterion'
          name: '1st criterion'
          metricName: metricName
          dimensions: []
          operator: operator
          alertSensitivity: alertSensitivity
          failingPeriods: {
            numberOfEvaluationPeriods: numberOfEvaluationPeriods
            minFailingPeriodsToAlert: minFailingPeriodsToAlert
          }
          timeAggregation: timeAggregation
        }
      ]
    }
    actions: [
      {
        actionGroupId: actionGroupId
      }
    ]
  }
}
```

# [JSON](#tab/json)

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
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
    "targetResourceGroup": {
      "type": "array",
      "minLength": 1,
      "metadata": {
        "description": "Full path of the resource group(s) where target resources to be monitored are in. For example - /subscriptions/00000000-0000-0000-0000-0000-00000000/resourceGroups/ResourceGroupName"
      }
    },
    "targetResourceRegion": {
      "type": "string",
      "allowedValues": [
        "EastUS",
        "EastUS2",
        "CentralUS",
        "NorthCentralUS",
        "SouthCentralUS",
        "WestCentralUS",
        "WestUS",
        "WestUS2",
        "CanadaEast",
        "CanadaCentral",
        "BrazilSouth",
        "NorthEurope",
        "WestEurope",
        "FranceCentral",
        "FranceSouth",
        "UKWest",
        "UKSouth",
        "GermanyCentral",
        "GermanyNortheast",
        "GermanyNorth",
        "GermanyWestCentral",
        "SwitzerlandNorth",
        "SwitzerlandWest",
        "NorwayEast",
        "NorwayWest",
        "SoutheastAsia",
        "EastAsia",
        "AustraliaEast",
        "AustraliaSoutheast",
        "AustraliaCentral",
        "AustraliaCentral2",
        "ChinaEast",
        "ChinaNorth",
        "ChinaEast2",
        "ChinaNorth2",
        "CentralIndia",
        "WestIndia",
        "SouthIndia",
        "JapanEast",
        "JapanWest",
        "KoreaCentral",
        "KoreaSouth",
        "SouthAfricaWest",
        "SouthAfricaNorth",
        "UAECentral",
        "UAENorth"
      ],
      "metadata": {
        "description": "Azure region in which target resources to be monitored are in (without spaces). For example: EastUS"
      }
    },
    "targetResourceType": {
      "type": "string",
      "minLength": 1,
      "metadata": {
        "description": "Resource type of target resources to be monitored."
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
      "type": "int",
      "defaultValue": 4,
      "metadata": {
        "description": "The number of periods to check in the alert evaluation."
      }
    },
    "minFailingPeriodsToAlert": {
      "type": "int",
      "defaultValue": 3,
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
        "Total",
        "Count"
      ],
      "metadata": {
        "description": "How the data that is collected should be combined over time."
      }
    },
    "windowSize": {
      "type": "string",
      "defaultValue": "PT5M",
      "allowedValues": [
        "PT5M",
        "PT15M",
        "PT30M",
        "PT1H"
      ],
      "metadata": {
        "description": "Period of time used to monitor alert activity based on the threshold. Must be between five minutes and one hour. ISO 8601 duration format."
      }
    },
    "evaluationFrequency": {
      "type": "string",
      "defaultValue": "PT5M",
      "allowedValues": [
        "PT5M",
        "PT15M",
        "PT30M",
        "PT1H"
      ],
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
  "resources": [
    {
      "type": "Microsoft.Insights/metricAlerts",
      "apiVersion": "2018-03-01",
      "name": "[parameters('alertName')]",
      "location": "global",
      "properties": {
        "description": "[parameters('alertDescription')]",
        "severity": "[parameters('alertSeverity')]",
        "enabled": "[parameters('isEnabled')]",
        "scopes": "[parameters('targetResourceGroup')]",
        "targetResourceType": "[parameters('targetResourceType')]",
        "targetResourceRegion": "[parameters('targetResourceRegion')]",
        "evaluationFrequency": "[parameters('evaluationFrequency')]",
        "windowSize": "[parameters('windowSize')]",
        "criteria": {
          "odata.type": "Microsoft.Azure.Monitor.MultipleResourceMultipleMetricCriteria",
          "allOf": [
            {
              "criterionType": "DynamicThresholdCriterion",
              "name": "1st criterion",
              "metricName": "[parameters('metricName')]",
              "dimensions": [],
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

---

### Parameter file

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "alertName": {
      "value": "Multi-resource metric alert with Dynamic Thresholds via Azure Resource Manager template"
    },
    "alertDescription": {
      "value": "New Multi-resource metric alert with Dynamic Thresholds created via template"
    },
    "alertSeverity": {
      "value": 3
    },
    "isEnabled": {
      "value": true
    },
    "targetResourceGroup": {
      "value": [
        "/subscriptions/replace-with-subscription-id/resourceGroups/replace-with-resource-group-name1",
        "/subscriptions/replace-with-subscription-id/resourceGroups/replace-with-resource-group-name2"
      ]
    },
    "targetResourceRegion": {
      "value": "SouthCentralUS"
    },
    "targetResourceType": {
      "value": "Microsoft.Compute/virtualMachines"
    },
    "metricName": {
      "value": "Percentage CPU"
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
    "timeAggregation": {
      "value": "Average"
    },
    "actionGroupId": {
      "value": "/subscriptions/replace-with-subscription-id/resourceGroups/replace-with-resource-group-name/providers/Microsoft.Insights/actionGroups/replace-with-action-group-name"
    }
  }
}
```

### Static threshold alert on all virtual machines in a subscription

This sample creates a static threshold metric alert rule that monitors Percentage CPU for all virtual machines in one Azure region in a subscription.

### Template file

# [Bicep](#tab/bicep)

```bicep
@description('Name of the alert')
@minLength(1)
param alertName string

@description('Description of alert')
param alertDescription string = 'This is a metric alert'

@description('Severity of alert {0,1,2,3,4}')
@allowed([
  0
  1
  2
  3
  4
])
param alertSeverity int = 3

@description('Specifies whether the alert is enabled')
param isEnabled bool = true

@description('Azure Resource Manager path up to subscription ID. For example - /subscriptions/00000000-0000-0000-0000-0000-00000000')
@minLength(1)
param targetSubscription string

@description('Azure region in which target resources to be monitored are in (without spaces). For example: EastUS')
@allowed([
  'EastUS'
  'EastUS2'
  'CentralUS'
  'NorthCentralUS'
  'SouthCentralUS'
  'WestCentralUS'
  'WestUS'
  'WestUS2'
  'CanadaEast'
  'CanadaCentral'
  'BrazilSouth'
  'NorthEurope'
  'WestEurope'
  'FranceCentral'
  'FranceSouth'
  'UKWest'
  'UKSouth'
  'GermanyCentral'
  'GermanyNortheast'
  'GermanyNorth'
  'GermanyWestCentral'
  'SwitzerlandNorth'
  'SwitzerlandWest'
  'NorwayEast'
  'NorwayWest'
  'SoutheastAsia'
  'EastAsia'
  'AustraliaEast'
  'AustraliaSoutheast'
  'AustraliaCentral'
  'AustraliaCentral2'
  'ChinaEast'
  'ChinaNorth'
  'ChinaEast2'
  'ChinaNorth2'
  'CentralIndia'
  'WestIndia'
  'SouthIndia'
  'JapanEast'
  'JapanWest'
  'KoreaCentral'
  'KoreaSouth'
  'SouthAfricaWest'
  'SouthAfricaNorth'
  'UAECentral'
  'UAENorth'
])
param targetResourceRegion string

@description('Resource type of target resources to be monitored.')
@minLength(1)
param targetResourceType string

@description('Name of the metric used in the comparison to activate the alert.')
@minLength(1)
param metricName string

@description('Operator comparing the current value with the threshold value.')
@allowed([
  'Equals'
  'GreaterThan'
  'GreaterThanOrEqual'
  'LessThan'
  'LessThanOrEqual'
])
param operator string = 'GreaterThan'

@description('The threshold value at which the alert is activated.')
param threshold string = '0'

@description('How the data that is collected should be combined over time.')
@allowed([
  'Average'
  'Minimum'
  'Maximum'
  'Total'
  'Count'
])
param timeAggregation string = 'Average'

@description('Period of time used to monitor alert activity based on the threshold. Must be between one minute and one day. ISO 8601 duration format.')
@allowed([
  'PT1M'
  'PT5M'
  'PT15M'
  'PT30M'
  'PT1H'
  'PT6H'
  'PT12H'
  'PT24H'
])
param windowSize string = 'PT5M'

@description('how often the metric alert is evaluated represented in ISO 8601 duration format')
@allowed([
  'PT1M'
  'PT5M'
  'PT15M'
  'PT30M'
  'PT1H'
])
param evaluationFrequency string = 'PT1M'

@description('The ID of the action group that is triggered when the alert is activated or deactivated')
param actionGroupId string = ''

resource metricAlert 'Microsoft.Insights/metricAlerts@2018-03-01' = {
  name: alertName
  location: 'global'
  properties: {
    description: alertDescription
    severity: alertSeverity
    enabled: isEnabled
    scopes: [
      targetSubscription
    ]
    targetResourceType: targetResourceType
    targetResourceRegion: targetResourceRegion
    evaluationFrequency: evaluationFrequency
    windowSize: windowSize
    criteria: {
      'odata.type': 'Microsoft.Azure.Monitor.MultipleResourceMultipleMetricCriteria'
      allOf: [
        {
          name: '1st criterion'
          metricName: metricName
          dimensions: []
          operator: operator
          threshold: threshold
          timeAggregation: timeAggregation
          criterionType: 'StaticThresholdCriterion'
        }
      ]
    }
    actions: [
      {
        actionGroupId: actionGroupId
      }
    ]
  }
}
```

# [JSON](#tab/json)

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
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
    "targetSubscription": {
      "type": "string",
      "minLength": 1,
      "metadata": {
        "description": "Azure Resource Manager path up to subscription ID. For example - /subscriptions/00000000-0000-0000-0000-0000-00000000"
      }
    },
    "targetResourceRegion": {
      "type": "string",
      "allowedValues": [
        "EastUS",
        "EastUS2",
        "CentralUS",
        "NorthCentralUS",
        "SouthCentralUS",
        "WestCentralUS",
        "WestUS",
        "WestUS2",
        "CanadaEast",
        "CanadaCentral",
        "BrazilSouth",
        "NorthEurope",
        "WestEurope",
        "FranceCentral",
        "FranceSouth",
        "UKWest",
        "UKSouth",
        "GermanyCentral",
        "GermanyNortheast",
        "GermanyNorth",
        "GermanyWestCentral",
        "SwitzerlandNorth",
        "SwitzerlandWest",
        "NorwayEast",
        "NorwayWest",
        "SoutheastAsia",
        "EastAsia",
        "AustraliaEast",
        "AustraliaSoutheast",
        "AustraliaCentral",
        "AustraliaCentral2",
        "ChinaEast",
        "ChinaNorth",
        "ChinaEast2",
        "ChinaNorth2",
        "CentralIndia",
        "WestIndia",
        "SouthIndia",
        "JapanEast",
        "JapanWest",
        "KoreaCentral",
        "KoreaSouth",
        "SouthAfricaWest",
        "SouthAfricaNorth",
        "UAECentral",
        "UAENorth"
      ],
      "metadata": {
        "description": "Azure region in which target resources to be monitored are in (without spaces). For example: EastUS"
      }
    },
    "targetResourceType": {
      "type": "string",
      "minLength": 1,
      "metadata": {
        "description": "Resource type of target resources to be monitored."
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
        "Total",
        "Count"
      ],
      "metadata": {
        "description": "How the data that is collected should be combined over time."
      }
    },
    "windowSize": {
      "type": "string",
      "defaultValue": "PT5M",
      "allowedValues": [
        "PT1M",
        "PT5M",
        "PT15M",
        "PT30M",
        "PT1H",
        "PT6H",
        "PT12H",
        "PT24H"
      ],
      "metadata": {
        "description": "Period of time used to monitor alert activity based on the threshold. Must be between one minute and one day. ISO 8601 duration format."
      }
    },
    "evaluationFrequency": {
      "type": "string",
      "defaultValue": "PT1M",
      "allowedValues": [
        "PT1M",
        "PT5M",
        "PT15M",
        "PT30M",
        "PT1H"
      ],
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
  "resources": [
    {
      "type": "Microsoft.Insights/metricAlerts",
      "apiVersion": "2018-03-01",
      "name": "[parameters('alertName')]",
      "location": "global",
      "properties": {
        "description": "[parameters('alertDescription')]",
        "severity": "[parameters('alertSeverity')]",
        "enabled": "[parameters('isEnabled')]",
        "scopes": [
          "[parameters('targetSubscription')]"
        ],
        "targetResourceType": "[parameters('targetResourceType')]",
        "targetResourceRegion": "[parameters('targetResourceRegion')]",
        "evaluationFrequency": "[parameters('evaluationFrequency')]",
        "windowSize": "[parameters('windowSize')]",
        "criteria": {
          "odata.type": "Microsoft.Azure.Monitor.MultipleResourceMultipleMetricCriteria",
          "allOf": [
            {
              "name": "1st criterion",
              "metricName": "[parameters('metricName')]",
              "dimensions": [],
              "operator": "[parameters('operator')]",
              "threshold": "[parameters('threshold')]",
              "timeAggregation": "[parameters('timeAggregation')]",
              "criterionType": "StaticThresholdCriterion"
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

---

### Parameter file

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "alertName": {
      "value": "Multi-resource sub level metric alert via Azure Resource Manager template"
    },
    "alertDescription": {
      "value": "New Multi-resource sub level metric alert created via template"
    },
    "alertSeverity": {
      "value": 3
    },
    "isEnabled": {
      "value": true
    },
    "targetSubscription": {
      "value": "/subscriptions/replace-with-subscription-id"
    },
    "targetResourceRegion": {
      "value": "SouthCentralUS"
    },
    "targetResourceType": {
      "value": "Microsoft.Compute/virtualMachines"
    },
    "metricName": {
      "value": "Percentage CPU"
    },
    "operator": {
      "value": "GreaterThan"
    },
    "threshold": {
      "value": "0"
    },
    "timeAggregation": {
      "value": "Average"
    },
    "actionGroupId": {
      "value": "/subscriptions/replace-with-subscription-id/resourceGroups/replace-with-resource-group-name/providers/Microsoft.Insights/actionGroups/replace-with-action-group-name"
    }
  }
}
```

### Dynamic Thresholds alert on all virtual machines in a subscription

This sample creates a Dynamic Thresholds metric alert rule that monitors Percentage CPU for all virtual machines (in one Azure region) in a subscription.

### Template file

# [Bicep](#tab/bicep)

```bicep
@description('Name of the alert')
@minLength(1)
param alertName string

@description('Description of alert')
param alertDescription string = 'This is a metric alert'

@description('Severity of alert {0,1,2,3,4}')
@allowed([
  0
  1
  2
  3
  4
])
param alertSeverity int = 3

@description('Specifies whether the alert is enabled')
param isEnabled bool = true

@description('Azure Resource Manager path up to subscription ID. For example - /subscriptions/00000000-0000-0000-0000-0000-00000000')
@minLength(1)
param targetSubscription string

@description('Azure region in which target resources to be monitored are in (without spaces). For example: EastUS')
@allowed([
  'EastUS'
  'EastUS2'
  'CentralUS'
  'NorthCentralUS'
  'SouthCentralUS'
  'WestCentralUS'
  'WestUS'
  'WestUS2'
  'CanadaEast'
  'CanadaCentral'
  'BrazilSouth'
  'NorthEurope'
  'WestEurope'
  'FranceCentral'
  'FranceSouth'
  'UKWest'
  'UKSouth'
  'GermanyCentral'
  'GermanyNortheast'
  'GermanyNorth'
  'GermanyWestCentral'
  'SwitzerlandNorth'
  'SwitzerlandWest'
  'NorwayEast'
  'NorwayWest'
  'SoutheastAsia'
  'EastAsia'
  'AustraliaEast'
  'AustraliaSoutheast'
  'AustraliaCentral'
  'AustraliaCentral2'
  'ChinaEast'
  'ChinaNorth'
  'ChinaEast2'
  'ChinaNorth2'
  'CentralIndia'
  'WestIndia'
  'SouthIndia'
  'JapanEast'
  'JapanWest'
  'KoreaCentral'
  'KoreaSouth'
  'SouthAfricaWest'
  'SouthAfricaNorth'
  'UAECentral'
  'UAENorth'
])
param targetResourceRegion string

@description('Resource type of target resources to be monitored.')
@minLength(1)
param targetResourceType string

@description('Name of the metric used in the comparison to activate the alert.')
@minLength(1)
param metricName string

@description('Operator comparing the current value with the threshold value.')
@allowed([
  'GreaterThan'
  'LessThan'
  'GreaterOrLessThan'
])
param operator string = 'GreaterOrLessThan'

@description('Tunes how \'noisy\' the Dynamic Thresholds alerts will be: \'High\' will result in more alerts while \'Low\' will result in fewer alerts.')
@allowed([
  'High'
  'Medium'
  'Low'
])
param alertSensitivity string = 'Medium'

@description('The number of periods to check in the alert evaluation.')
param numberOfEvaluationPeriods int = 4

@description('The number of unhealthy periods to alert on (must be lower or equal to numberOfEvaluationPeriods).')
param minFailingPeriodsToAlert int = 3

@description('How the data that is collected should be combined over time.')
@allowed([
  'Average'
  'Minimum'
  'Maximum'
  'Total'
  'Count'
])
param timeAggregation string = 'Average'

@description('Period of time used to monitor alert activity based on the threshold. Must be between five minutes and one hour. ISO 8601 duration format.')
@allowed([
  'PT5M'
  'PT15M'
  'PT30M'
  'PT1H'
])
param windowSize string = 'PT5M'

@description('how often the metric alert is evaluated represented in ISO 8601 duration format')
@allowed([
  'PT5M'
  'PT15M'
  'PT30M'
  'PT1H'
])
param evaluationFrequency string = 'PT5M'

@description('The ID of the action group that is triggered when the alert is activated or deactivated')
param actionGroupId string = ''

resource metricAlert 'Microsoft.Insights/metricAlerts@2018-03-01' = {
  name: alertName
  location: 'global'
  properties: {
    description: alertDescription
    severity: alertSeverity
    enabled: isEnabled
    scopes: [
      targetSubscription
    ]
    targetResourceType: targetResourceType
    targetResourceRegion: targetResourceRegion
    evaluationFrequency: evaluationFrequency
    windowSize: windowSize
    criteria: {
      'odata.type': 'Microsoft.Azure.Monitor.MultipleResourceMultipleMetricCriteria'
      allOf: [
        {
          criterionType: 'DynamicThresholdCriterion'
          name: '1st criterion'
          metricName: metricName
          dimensions: []
          operator: operator
          alertSensitivity: alertSensitivity
          failingPeriods: {
            numberOfEvaluationPeriods: numberOfEvaluationPeriods
            minFailingPeriodsToAlert: minFailingPeriodsToAlert
          }
          timeAggregation: timeAggregation
        }
      ]
    }
    actions: [
      {
        actionGroupId: actionGroupId
      }
    ]
  }
}
```

# [JSON](#tab/json)

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
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
    "targetSubscription": {
      "type": "string",
      "minLength": 1,
      "metadata": {
        "description": "Azure Resource Manager path up to subscription ID. For example - /subscriptions/00000000-0000-0000-0000-0000-00000000"
      }
    },
    "targetResourceRegion": {
      "type": "string",
      "allowedValues": [
        "EastUS",
        "EastUS2",
        "CentralUS",
        "NorthCentralUS",
        "SouthCentralUS",
        "WestCentralUS",
        "WestUS",
        "WestUS2",
        "CanadaEast",
        "CanadaCentral",
        "BrazilSouth",
        "NorthEurope",
        "WestEurope",
        "FranceCentral",
        "FranceSouth",
        "UKWest",
        "UKSouth",
        "GermanyCentral",
        "GermanyNortheast",
        "GermanyNorth",
        "GermanyWestCentral",
        "SwitzerlandNorth",
        "SwitzerlandWest",
        "NorwayEast",
        "NorwayWest",
        "SoutheastAsia",
        "EastAsia",
        "AustraliaEast",
        "AustraliaSoutheast",
        "AustraliaCentral",
        "AustraliaCentral2",
        "ChinaEast",
        "ChinaNorth",
        "ChinaEast2",
        "ChinaNorth2",
        "CentralIndia",
        "WestIndia",
        "SouthIndia",
        "JapanEast",
        "JapanWest",
        "KoreaCentral",
        "KoreaSouth",
        "SouthAfricaWest",
        "SouthAfricaNorth",
        "UAECentral",
        "UAENorth"
      ],
      "metadata": {
        "description": "Azure region in which target resources to be monitored are in (without spaces). For example: EastUS"
      }
    },
    "targetResourceType": {
      "type": "string",
      "minLength": 1,
      "metadata": {
        "description": "Resource type of target resources to be monitored."
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
      "type": "int",
      "defaultValue": 4,
      "metadata": {
        "description": "The number of periods to check in the alert evaluation."
      }
    },
    "minFailingPeriodsToAlert": {
      "type": "int",
      "defaultValue": 3,
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
        "Total",
        "Count"
      ],
      "metadata": {
        "description": "How the data that is collected should be combined over time."
      }
    },
    "windowSize": {
      "type": "string",
      "defaultValue": "PT5M",
      "allowedValues": [
        "PT5M",
        "PT15M",
        "PT30M",
        "PT1H"
      ],
      "metadata": {
        "description": "Period of time used to monitor alert activity based on the threshold. Must be between five minutes and one hour. ISO 8601 duration format."
      }
    },
    "evaluationFrequency": {
      "type": "string",
      "defaultValue": "PT5M",
      "allowedValues": [
        "PT5M",
        "PT15M",
        "PT30M",
        "PT1H"
      ],
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
  "resources": [
    {
      "type": "Microsoft.Insights/metricAlerts",
      "apiVersion": "2018-03-01",
      "name": "[parameters('alertName')]",
      "location": "global",
      "properties": {
        "description": "[parameters('alertDescription')]",
        "severity": "[parameters('alertSeverity')]",
        "enabled": "[parameters('isEnabled')]",
        "scopes": [
          "[parameters('targetSubscription')]"
        ],
        "targetResourceType": "[parameters('targetResourceType')]",
        "targetResourceRegion": "[parameters('targetResourceRegion')]",
        "evaluationFrequency": "[parameters('evaluationFrequency')]",
        "windowSize": "[parameters('windowSize')]",
        "criteria": {
          "odata.type": "Microsoft.Azure.Monitor.MultipleResourceMultipleMetricCriteria",
          "allOf": [
            {
              "criterionType": "DynamicThresholdCriterion",
              "name": "1st criterion",
              "metricName": "[parameters('metricName')]",
              "dimensions": [],
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

---

### Parameter file

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "alertName": {
      "value": "Multi-resource sub level metric alert with Dynamic Thresholds via Azure Resource Manager template"
    },
    "alertDescription": {
      "value": "New Multi-resource sub level metric alert with Dynamic Thresholds created via template"
    },
    "alertSeverity": {
      "value": 3
    },
    "isEnabled": {
      "value": true
    },
    "targetSubscription": {
      "value": "/subscriptions/replace-with-subscription-id"
    },
    "targetResourceRegion": {
      "value": "SouthCentralUS"
    },
    "targetResourceType": {
      "value": "Microsoft.Compute/virtualMachines"
    },
    "metricName": {
      "value": "Percentage CPU"
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
    "timeAggregation": {
      "value": "Average"
    },
    "actionGroupId": {
      "value": "/subscriptions/replace-with-subscription-id/resourceGroups/replace-with-resource-group-name/providers/Microsoft.Insights/actionGroups/replace-with-action-group-name"
    }
  }
}
```

### Static threshold alert on a list of virtual machines

This sample creates a static threshold metric alert rule that monitors Percentage CPU for a list of virtual machines in one Azure region in a subscription.

### Template file

# [Bicep](#tab/bicep)

```bicep
@description('Name of the alert')
@minLength(1)
param alertName string

@description('Description of alert')
param alertDescription string = 'This is a metric alert'

@description('Severity of alert {0,1,2,3,4}')
@allowed([
  0
  1
  2
  3
  4
])
param alertSeverity int = 3

@description('Specifies whether the alert is enabled')
param isEnabled bool = true

@description('array of Azure resource Ids. For example - /subscriptions/00000000-0000-0000-0000-0000-00000000/resourceGroup/resource-group-name/Microsoft.compute/virtualMachines/vm-name')
@minLength(1)
param targetResourceId array

@description('Azure region in which target resources to be monitored are in (without spaces). For example: EastUS')
@allowed([
  'EastUS'
  'EastUS2'
  'CentralUS'
  'NorthCentralUS'
  'SouthCentralUS'
  'WestCentralUS'
  'WestUS'
  'WestUS2'
  'CanadaEast'
  'CanadaCentral'
  'BrazilSouth'
  'NorthEurope'
  'WestEurope'
  'FranceCentral'
  'FranceSouth'
  'UKWest'
  'UKSouth'
  'GermanyCentral'
  'GermanyNortheast'
  'GermanyNorth'
  'GermanyWestCentral'
  'SwitzerlandNorth'
  'SwitzerlandWest'
  'NorwayEast'
  'NorwayWest'
  'SoutheastAsia'
  'EastAsia'
  'AustraliaEast'
  'AustraliaSoutheast'
  'AustraliaCentral'
  'AustraliaCentral2'
  'ChinaEast'
  'ChinaNorth'
  'ChinaEast2'
  'ChinaNorth2'
  'CentralIndia'
  'WestIndia'
  'SouthIndia'
  'JapanEast'
  'JapanWest'
  'KoreaCentral'
  'KoreaSouth'
  'SouthAfricaWest'
  'SouthAfricaNorth'
  'UAECentral'
  'UAENorth'
])
param targetResourceRegion string

@description('Resource type of target resources to be monitored.')
@minLength(1)
param targetResourceType string

@description('Name of the metric used in the comparison to activate the alert.')
@minLength(1)
param metricName string

@description('Operator comparing the current value with the threshold value.')
@allowed([
  'Equals'
  'GreaterThan'
  'GreaterThanOrEqual'
  'LessThan'
  'LessThanOrEqual'
])
param operator string = 'GreaterThan'

@description('The threshold value at which the alert is activated.')
param threshold string = '0'

@description('How the data that is collected should be combined over time.')
@allowed([
  'Average'
  'Minimum'
  'Maximum'
  'Total'
  'Count'
])
param timeAggregation string = 'Average'

@description('Period of time used to monitor alert activity based on the threshold. Must be between one minute and one day. ISO 8601 duration format.')
@allowed([
  'PT1M'
  'PT5M'
  'PT15M'
  'PT30M'
  'PT1H'
  'PT6H'
  'PT12H'
  'PT24H'
])
param windowSize string = 'PT5M'

@description('how often the metric alert is evaluated represented in ISO 8601 duration format')
@allowed([
  'PT1M'
  'PT5M'
  'PT15M'
  'PT30M'
  'PT1H'
])
param evaluationFrequency string = 'PT1M'

@description('The ID of the action group that is triggered when the alert is activated or deactivated')
param actionGroupId string = ''

resource metricAlert 'Microsoft.Insights/metricAlerts@2018-03-01' = {
  name: alertName
  location: 'global'
  properties: {
    description: alertDescription
    severity: alertSeverity
    enabled: isEnabled
    scopes: targetResourceId
    targetResourceType: targetResourceType
    targetResourceRegion: targetResourceRegion
    evaluationFrequency: evaluationFrequency
    windowSize: windowSize
    criteria: {
      'odata.type': 'Microsoft.Azure.Monitor.MultipleResourceMultipleMetricCriteria'
      allOf: [
        {
          name: '1st criterion'
          metricName: metricName
          dimensions: []
          operator: operator
          threshold: threshold
          timeAggregation: timeAggregation
          criterionType: 'StaticThresholdCriterion'
        }
      ]
    }
    actions: [
      {
        actionGroupId: actionGroupId
      }
    ]
  }
}
```

# [JSON](#tab/json)

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
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
    "targetResourceId": {
      "type": "array",
      "minLength": 1,
      "metadata": {
        "description": "array of Azure resource Ids. For example - /subscriptions/00000000-0000-0000-0000-0000-00000000/resourceGroup/resource-group-name/Microsoft.compute/virtualMachines/vm-name"
      }
    },
    "targetResourceRegion": {
      "type": "string",
      "allowedValues": [
        "EastUS",
        "EastUS2",
        "CentralUS",
        "NorthCentralUS",
        "SouthCentralUS",
        "WestCentralUS",
        "WestUS",
        "WestUS2",
        "CanadaEast",
        "CanadaCentral",
        "BrazilSouth",
        "NorthEurope",
        "WestEurope",
        "FranceCentral",
        "FranceSouth",
        "UKWest",
        "UKSouth",
        "GermanyCentral",
        "GermanyNortheast",
        "GermanyNorth",
        "GermanyWestCentral",
        "SwitzerlandNorth",
        "SwitzerlandWest",
        "NorwayEast",
        "NorwayWest",
        "SoutheastAsia",
        "EastAsia",
        "AustraliaEast",
        "AustraliaSoutheast",
        "AustraliaCentral",
        "AustraliaCentral2",
        "ChinaEast",
        "ChinaNorth",
        "ChinaEast2",
        "ChinaNorth2",
        "CentralIndia",
        "WestIndia",
        "SouthIndia",
        "JapanEast",
        "JapanWest",
        "KoreaCentral",
        "KoreaSouth",
        "SouthAfricaWest",
        "SouthAfricaNorth",
        "UAECentral",
        "UAENorth"
      ],
      "metadata": {
        "description": "Azure region in which target resources to be monitored are in (without spaces). For example: EastUS"
      }
    },
    "targetResourceType": {
      "type": "string",
      "minLength": 1,
      "metadata": {
        "description": "Resource type of target resources to be monitored."
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
        "Total",
        "Count"
      ],
      "metadata": {
        "description": "How the data that is collected should be combined over time."
      }
    },
    "windowSize": {
      "type": "string",
      "defaultValue": "PT5M",
      "allowedValues": [
        "PT1M",
        "PT5M",
        "PT15M",
        "PT30M",
        "PT1H",
        "PT6H",
        "PT12H",
        "PT24H"
      ],
      "metadata": {
        "description": "Period of time used to monitor alert activity based on the threshold. Must be between one minute and one day. ISO 8601 duration format."
      }
    },
    "evaluationFrequency": {
      "type": "string",
      "defaultValue": "PT1M",
      "allowedValues": [
        "PT1M",
        "PT5M",
        "PT15M",
        "PT30M",
        "PT1H"
      ],
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
  "resources": [
    {
      "type": "Microsoft.Insights/metricAlerts",
      "apiVersion": "2018-03-01",
      "name": "[parameters('alertName')]",
      "location": "global",
      "properties": {
        "description": "[parameters('alertDescription')]",
        "severity": "[parameters('alertSeverity')]",
        "enabled": "[parameters('isEnabled')]",
        "scopes": "[parameters('targetResourceId')]",
        "targetResourceType": "[parameters('targetResourceType')]",
        "targetResourceRegion": "[parameters('targetResourceRegion')]",
        "evaluationFrequency": "[parameters('evaluationFrequency')]",
        "windowSize": "[parameters('windowSize')]",
        "criteria": {
          "odata.type": "Microsoft.Azure.Monitor.MultipleResourceMultipleMetricCriteria",
          "allOf": [
            {
              "name": "1st criterion",
              "metricName": "[parameters('metricName')]",
              "dimensions": [],
              "operator": "[parameters('operator')]",
              "threshold": "[parameters('threshold')]",
              "timeAggregation": "[parameters('timeAggregation')]",
              "criterionType": "StaticThresholdCriterion"
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

---

### Parameter file

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "alertName": {
      "value": "Multi-resource metric alert by list via Azure Resource Manager template"
    },
    "alertDescription": {
      "value": "New Multi-resource metric alert by list created via template"
    },
    "alertSeverity": {
      "value": 3
    },
    "isEnabled": {
      "value": true
    },
    "targetResourceId": {
      "value": [
        "/subscriptions/replace-with-subscription-id/resourceGroups/replace-with-resource-group-name1/Microsoft.Compute/virtualMachines/replace-with-vm-name1",
        "/subscriptions/replace-with-subscription-id/resourceGroups/replace-with-resource-group-name2/Microsoft.Compute/virtualMachines/replace-with-vm-name2"
      ]
    },
    "targetResourceRegion": {
      "value": "SouthCentralUS"
    },
    "targetResourceType": {
      "value": "Microsoft.Compute/virtualMachines"
    },
    "metricName": {
      "value": "Percentage CPU"
    },
    "operator": {
      "value": "GreaterThan"
    },
    "threshold": {
      "value": "0"
    },
    "timeAggregation": {
      "value": "Average"
    },
    "actionGroupId": {
      "value": "/subscriptions/replace-with-subscription-id/resourceGroups/replace-with-resource-group-name/providers/Microsoft.Insights/actionGroups/replace-with-action-group-name"
    }
  }
}
```

### Dynamic Thresholds alert on a list of virtual machines

This sample creates a dynamic thresholds metric alert rule that monitors Percentage CPU for a list of virtual machines in one Azure region in a subscription.

### Template file

# [Bicep](#tab/bicep)

```bicep
@description('Name of the alert')
@minLength(1)
param alertName string

@description('Description of alert')
param alertDescription string = 'This is a metric alert'

@description('Severity of alert {0,1,2,3,4}')
@allowed([
  0
  1
  2
  3
  4
])
param alertSeverity int = 3

@description('Specifies whether the alert is enabled')
param isEnabled bool = true

@description('array of Azure resource Ids. For example - /subscriptions/00000000-0000-0000-0000-0000-00000000/resourceGroup/resource-group-name/Microsoft.compute/virtualMachines/vm-name')
@minLength(1)
param targetResourceId array

@description('Azure region in which target resources to be monitored are in (without spaces). For example: EastUS')
@allowed([
  'EastUS'
  'EastUS2'
  'CentralUS'
  'NorthCentralUS'
  'SouthCentralUS'
  'WestCentralUS'
  'WestUS'
  'WestUS2'
  'CanadaEast'
  'CanadaCentral'
  'BrazilSouth'
  'NorthEurope'
  'WestEurope'
  'FranceCentral'
  'FranceSouth'
  'UKWest'
  'UKSouth'
  'GermanyCentral'
  'GermanyNortheast'
  'GermanyNorth'
  'GermanyWestCentral'
  'SwitzerlandNorth'
  'SwitzerlandWest'
  'NorwayEast'
  'NorwayWest'
  'SoutheastAsia'
  'EastAsia'
  'AustraliaEast'
  'AustraliaSoutheast'
  'AustraliaCentral'
  'AustraliaCentral2'
  'ChinaEast'
  'ChinaNorth'
  'ChinaEast2'
  'ChinaNorth2'
  'CentralIndia'
  'WestIndia'
  'SouthIndia'
  'JapanEast'
  'JapanWest'
  'KoreaCentral'
  'KoreaSouth'
  'SouthAfricaWest'
  'SouthAfricaNorth'
  'UAECentral'
  'UAENorth'
])
param targetResourceRegion string

@description('Resource type of target resources to be monitored.')
@minLength(1)
param targetResourceType string

@description('Name of the metric used in the comparison to activate the alert.')
@minLength(1)
param metricName string

@description('Operator comparing the current value with the threshold value.')
@allowed([
  'GreaterThan'
  'LessThan'
  'GreaterOrLessThan'
])
param operator string = 'GreaterOrLessThan'

@description('Tunes how \'noisy\' the Dynamic Thresholds alerts will be: \'High\' will result in more alerts while \'Low\' will result in fewer alerts.')
@allowed([
  'High'
  'Medium'
  'Low'
])
param alertSensitivity string = 'Medium'

@description('The number of periods to check in the alert evaluation.')
param numberOfEvaluationPeriods int = 4

@description('The number of unhealthy periods to alert on (must be lower or equal to numberOfEvaluationPeriods).')
param minFailingPeriodsToAlert int = 3

@description('How the data that is collected should be combined over time.')
@allowed([
  'Average'
  'Minimum'
  'Maximum'
  'Total'
  'Count'
])
param timeAggregation string = 'Average'

@description('Period of time used to monitor alert activity based on the threshold. Must be between five minutes and one hour. ISO 8601 duration format.')
@allowed([
  'PT5M'
  'PT15M'
  'PT30M'
  'PT1H'
])
param windowSize string = 'PT5M'

@description('how often the metric alert is evaluated represented in ISO 8601 duration format')
@allowed([
  'PT5M'
  'PT15M'
  'PT30M'
  'PT1H'
])
param evaluationFrequency string = 'PT5M'

@description('The ID of the action group that is triggered when the alert is activated or deactivated')
param actionGroupId string = ''

resource metricAlert 'Microsoft.Insights/metricAlerts@2018-03-01' = {
  name: alertName
  location: 'global'
  properties: {
    description: alertDescription
    severity: alertSeverity
    enabled: isEnabled
    scopes: targetResourceId
    targetResourceType: targetResourceType
    targetResourceRegion: targetResourceRegion
    evaluationFrequency: evaluationFrequency
    windowSize: windowSize
    criteria: {
      'odata.type': 'Microsoft.Azure.Monitor.MultipleResourceMultipleMetricCriteria'
      allOf: [
        {
          criterionType: 'DynamicThresholdCriterion'
          name: '1st criterion'
          metricName: metricName
          dimensions: []
          operator: operator
          alertSensitivity: alertSensitivity
          failingPeriods: {
            numberOfEvaluationPeriods: numberOfEvaluationPeriods
            minFailingPeriodsToAlert: minFailingPeriodsToAlert
          }
          timeAggregation: timeAggregation
        }
      ]
    }
    actions: [
      {
        actionGroupId: actionGroupId
      }
    ]
  }
}
```

# [JSON](#tab/json)

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
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
    "targetResourceId": {
      "type": "array",
      "minLength": 1,
      "metadata": {
        "description": "array of Azure resource Ids. For example - /subscriptions/00000000-0000-0000-0000-0000-00000000/resourceGroup/resource-group-name/Microsoft.compute/virtualMachines/vm-name"
      }
    },
    "targetResourceRegion": {
      "type": "string",
      "allowedValues": [
        "EastUS",
        "EastUS2",
        "CentralUS",
        "NorthCentralUS",
        "SouthCentralUS",
        "WestCentralUS",
        "WestUS",
        "WestUS2",
        "CanadaEast",
        "CanadaCentral",
        "BrazilSouth",
        "NorthEurope",
        "WestEurope",
        "FranceCentral",
        "FranceSouth",
        "UKWest",
        "UKSouth",
        "GermanyCentral",
        "GermanyNortheast",
        "GermanyNorth",
        "GermanyWestCentral",
        "SwitzerlandNorth",
        "SwitzerlandWest",
        "NorwayEast",
        "NorwayWest",
        "SoutheastAsia",
        "EastAsia",
        "AustraliaEast",
        "AustraliaSoutheast",
        "AustraliaCentral",
        "AustraliaCentral2",
        "ChinaEast",
        "ChinaNorth",
        "ChinaEast2",
        "ChinaNorth2",
        "CentralIndia",
        "WestIndia",
        "SouthIndia",
        "JapanEast",
        "JapanWest",
        "KoreaCentral",
        "KoreaSouth",
        "SouthAfricaWest",
        "SouthAfricaNorth",
        "UAECentral",
        "UAENorth"
      ],
      "metadata": {
        "description": "Azure region in which target resources to be monitored are in (without spaces). For example: EastUS"
      }
    },
    "targetResourceType": {
      "type": "string",
      "minLength": 1,
      "metadata": {
        "description": "Resource type of target resources to be monitored."
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
      "type": "int",
      "defaultValue": 4,
      "metadata": {
        "description": "The number of periods to check in the alert evaluation."
      }
    },
    "minFailingPeriodsToAlert": {
      "type": "int",
      "defaultValue": 3,
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
        "Total",
        "Count"
      ],
      "metadata": {
        "description": "How the data that is collected should be combined over time."
      }
    },
    "windowSize": {
      "type": "string",
      "defaultValue": "PT5M",
      "allowedValues": [
        "PT5M",
        "PT15M",
        "PT30M",
        "PT1H"
      ],
      "metadata": {
        "description": "Period of time used to monitor alert activity based on the threshold. Must be between five minutes and one hour. ISO 8601 duration format."
      }
    },
    "evaluationFrequency": {
      "type": "string",
      "defaultValue": "PT5M",
      "allowedValues": [
        "PT5M",
        "PT15M",
        "PT30M",
        "PT1H"
      ],
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
  "resources": [
    {
      "type": "Microsoft.Insights/metricAlerts",
      "apiVersion": "2018-03-01",
      "name": "[parameters('alertName')]",
      "location": "global",
      "properties": {
        "description": "[parameters('alertDescription')]",
        "severity": "[parameters('alertSeverity')]",
        "enabled": "[parameters('isEnabled')]",
        "scopes": "[parameters('targetResourceId')]",
        "targetResourceType": "[parameters('targetResourceType')]",
        "targetResourceRegion": "[parameters('targetResourceRegion')]",
        "evaluationFrequency": "[parameters('evaluationFrequency')]",
        "windowSize": "[parameters('windowSize')]",
        "criteria": {
          "odata.type": "Microsoft.Azure.Monitor.MultipleResourceMultipleMetricCriteria",
          "allOf": [
            {
              "criterionType": "DynamicThresholdCriterion",
              "name": "1st criterion",
              "metricName": "[parameters('metricName')]",
              "dimensions": [],
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

---

### Parameter file

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "alertName": {
      "value": "Multi-resource metric alert with Dynamic Thresholds by list via Azure Resource Manager template"
    },
    "alertDescription": {
      "value": "New Multi-resource metric alert with Dynamic Thresholds by list created via template"
    },
    "alertSeverity": {
      "value": 3
    },
    "isEnabled": {
      "value": true
    },
    "targetResourceId": {
      "value": [
        "/subscriptions/replace-with-subscription-id/resourceGroups/replace-with-resource-group-name1/Microsoft.Compute/virtualMachines/replace-with-vm-name1",
        "/subscriptions/replace-with-subscription-id/resourceGroups/replace-with-resource-group-name2/Microsoft.Compute/virtualMachines/replace-with-vm-name2"
      ]
    },
    "targetResourceRegion": {
      "value": "SouthCentralUS"
    },
    "targetResourceType": {
      "value": "Microsoft.Compute/virtualMachines"
    },
    "metricName": {
      "value": "Percentage CPU"
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
    "timeAggregation": {
      "value": "Average"
    },
    "actionGroupId": {
      "value": "/subscriptions/replace-with-subscription-id/resourceGroups/replace-with-resource-group-name/providers/Microsoft.Insights/actionGroups/replace-with-action-group-name"
    }
  }
}
```

## Availability test with metric alert

[Application Insights availability tests](/previous-versions/azure/azure-monitor/app/monitor-web-app-availability) help you monitor the availability of your web site/application from various locations around the globe. Availability test alerts notify you when availability tests fail from a certain number of locations. Availability test alerts of the same resource type as metric alerts (Microsoft.Insights/metricAlerts). The following sample creates a simple availability test and associated alert.

> [!NOTE]
> `&amp`; is the HTML entity reference for &. URL parameters are still separated by a single &, but if you mention the URL in HTML, you need to encode it. So, if you have any "&" in your pingURL parameter value, you have to escape it with "`&amp`;"

### Template file

# [Bicep](#tab/bicep)

```bicep
param appName string
param pingURL string
param pingText string = ''
param actionGroupId string
param location string

var pingTestName = 'PingTest-${toLower(appName)}'
var pingAlertRuleName = 'PingAlert-${toLower(appName)}-${subscription().subscriptionId}'

resource pingTest 'Microsoft.Insights/webtests@2020-10-05-preview' = {
  name: pingTestName
  location: location
  tags: {
    'hidden-link:${resourceId('Microsoft.Insights/components', appName)}': 'Resource'
  }
  properties: {
    Name: pingTestName
    Description: 'Basic ping test'
    Enabled: true
    Frequency: 300
    Timeout: 120
    Kind: 'ping'
    RetryEnabled: true
    Locations: [
      {
        Id: 'us-va-ash-azr'
      }
      {
        Id: 'emea-nl-ams-azr'
      }
      {
        Id: 'apac-jp-kaw-edge'
      }
    ]
    Configuration: {
      WebTest: '<WebTest   Name="${pingTestName}"   Enabled="True"         CssProjectStructure=""    CssIteration=""  Timeout="120"  WorkItemIds=""         xmlns="http://microsoft.com/schemas/VisualStudio/TeamTest/2010"         Description=""  CredentialUserName=""  CredentialPassword=""         PreAuthenticate="True"  Proxy="default"  StopOnError="False"         RecordedResultFile=""  ResultsLocale="">  <Items>  <Request Method="GET"    Version="1.1"  Url="${pingURL}" ThinkTime="0"  Timeout="300" ParseDependentRequests="True"         FollowRedirects="True" RecordResult="True" Cache="False"         ResponseTimeGoal="0"  Encoding="utf-8"  ExpectedHttpStatusCode="200"         ExpectedResponseUrl="" ReportingName="" IgnoreHttpStatusCode="False" />        </Items>  <ValidationRules> <ValidationRule  Classname="Microsoft.VisualStudio.TestTools.WebTesting.Rules.ValidationRuleFindText, Microsoft.VisualStudio.QualityTools.WebTestFramework, Version=10.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a" DisplayName="Find Text"         Description="Verifies the existence of the specified text in the response."         Level="High"  ExecutionOrder="BeforeDependents">  <RuleParameters>        <RuleParameter Name="FindText" Value="${pingText}" />  <RuleParameter Name="IgnoreCase" Value="False" />  <RuleParameter Name="UseRegularExpression" Value="False" />  <RuleParameter Name="PassIfTextFound" Value="True" />  </RuleParameters> </ValidationRule>  </ValidationRules>  </WebTest>'
    }
    SyntheticMonitorId: pingTestName
  }
}

resource metricAlert 'Microsoft.Insights/metricAlerts@2018-03-01' = {
  name: pingAlertRuleName
  location: 'global'
  tags: {
    'hidden-link:${resourceId('Microsoft.Insights/components', appName)}': 'Resource'
    'hidden-link:${pingTest.id}': 'Resource'
  }
  properties: {
    description: 'Alert for web test'
    severity: 1
    enabled: true
    scopes: [
      pingTest.id
      resourceId('Microsoft.Insights/components', appName)
    ]
    evaluationFrequency: 'PT1M'
    windowSize: 'PT5M'
    criteria: {
      'odata.type': 'Microsoft.Azure.Monitor.WebtestLocationAvailabilityCriteria'
      webTestId: pingTest.id
      componentId: resourceId('Microsoft.Insights/components', appName)
      failedLocationCount: 2
    }
    actions: [
      {
        actionGroupId: actionGroupId
      }
    ]
  }
}
```

# [JSON](#tab/json)

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "metadata": {
  "parameters": {
    "appName": {
      "type": "string"
    },
    "pingURL": {
      "type": "string"
    },
    "pingText": {
      "type": "string",
      "defaultValue": ""
    },
    "actionGroupId": {
      "type": "string"
    },
    "location": {
      "type": "string"
    }
  },
  "variables": {
    "pingTestName": "[format('PingTest-{0}', toLower(parameters('appName')))]",
    "pingAlertRuleName": "[format('PingAlert-{0}-{1}', toLower(parameters('appName')), subscription().subscriptionId)]"
  },
  "resources": [
    {
      "type": "Microsoft.Insights/webtests",
      "apiVersion": "2020-10-05-preview",
      "name": "[variables('pingTestName')]",
      "location": "[parameters('location')]",
      "tags": {
        "[format('hidden-link:{0}', resourceId('Microsoft.Insights/components', parameters('appName')))]": "Resource"
      },
      "properties": {
        "Name": "[variables('pingTestName')]",
        "Description": "Basic ping test",
        "Enabled": true,
        "Frequency": 300,
        "Timeout": 120,
        "Kind": "ping",
        "RetryEnabled": true,
        "Locations": [
          {
            "Id": "us-va-ash-azr"
          },
          {
            "Id": "emea-nl-ams-azr"
          },
          {
            "Id": "apac-jp-kaw-edge"
          }
        ],
        "Configuration": {
          "WebTest": "[format('<WebTest   Name=\"{0}\"   Enabled=\"True\"         CssProjectStructure=\"\"    CssIteration=\"\"  Timeout=\"120\"  WorkItemIds=\"\"         xmlns=\"http://microsoft.com/schemas/VisualStudio/TeamTest/2010\"         Description=\"\"  CredentialUserName=\"\"  CredentialPassword=\"\"         PreAuthenticate=\"True\"  Proxy=\"default\"  StopOnError=\"False\"         RecordedResultFile=\"\"  ResultsLocale=\"\">  <Items>  <Request Method=\"GET\"    Version=\"1.1\"  Url=\"{1}\" ThinkTime=\"0\"  Timeout=\"300\" ParseDependentRequests=\"True\"         FollowRedirects=\"True\" RecordResult=\"True\" Cache=\"False\"         ResponseTimeGoal=\"0\"  Encoding=\"utf-8\"  ExpectedHttpStatusCode=\"200\"         ExpectedResponseUrl=\"\" ReportingName=\"\" IgnoreHttpStatusCode=\"False\" />        </Items>  <ValidationRules> <ValidationRule  Classname=\"Microsoft.VisualStudio.TestTools.WebTesting.Rules.ValidationRuleFindText, Microsoft.VisualStudio.QualityTools.WebTestFramework, Version=10.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a\" DisplayName=\"Find Text\"         Description=\"Verifies the existence of the specified text in the response.\"         Level=\"High\"  ExecutionOrder=\"BeforeDependents\">  <RuleParameters>        <RuleParameter Name=\"FindText\" Value=\"{2}\" />  <RuleParameter Name=\"IgnoreCase\" Value=\"False\" />  <RuleParameter Name=\"UseRegularExpression\" Value=\"False\" />  <RuleParameter Name=\"PassIfTextFound\" Value=\"True\" />  </RuleParameters> </ValidationRule>  </ValidationRules>  </WebTest>', variables('pingTestName'), parameters('pingURL'), parameters('pingText'))]"
        },
        "SyntheticMonitorId": "[variables('pingTestName')]"
      }
    },
    {
      "type": "Microsoft.Insights/metricAlerts",
      "apiVersion": "2018-03-01",
      "name": "[variables('pingAlertRuleName')]",
      "location": "global",
      "tags": {
        "[format('hidden-link:{0}', resourceId('Microsoft.Insights/components', parameters('appName')))]": "Resource",
        "[format('hidden-link:{0}', resourceId('Microsoft.Insights/webtests', variables('pingTestName')))]": "Resource"
      },
      "properties": {
        "description": "Alert for web test",
        "severity": 1,
        "enabled": true,
        "scopes": [
          "[resourceId('Microsoft.Insights/webtests', variables('pingTestName'))]",
          "[resourceId('Microsoft.Insights/components', parameters('appName'))]"
        ],
        "evaluationFrequency": "PT1M",
        "windowSize": "PT5M",
        "criteria": {
          "odata.type": "Microsoft.Azure.Monitor.WebtestLocationAvailabilityCriteria",
          "webTestId": "[resourceId('Microsoft.Insights/webtests', variables('pingTestName'))]",
          "componentId": "[resourceId('Microsoft.Insights/components', parameters('appName'))]",
          "failedLocationCount": 2
        },
        "actions": [
          {
            "actionGroupId": "[parameters('actionGroupId')]"
          }
        ]
      },
      "dependsOn": [
        "[resourceId('Microsoft.Insights/webtests', variables('pingTestName'))]"
      ]
    }
  ]
}
```

---

### Parameter file

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "appName": {
      "value": "Replace with your Application Insights resource name"
    },
    "pingURL": {
      "value": "https://www.yoursite.com"
    },
    "actionGroupId": {
      "value": "/subscriptions/replace-with-subscription-id/resourceGroups/replace-with-resourceGroup-name/providers/microsoft.insights/actiongroups/replace-with-action-group-name"
    },
    "location": {
      "value": "Replace with the location of your Application Insights resource"
    },
    "pingText": {
      "defaultValue": "Optional parameter that allows you to perform a content-match for the presence of a specific string within the content returned from a pingURL response",
      "type": "String"
    },
  }
}
```

Additional configuration of the content-match `pingText` parameter is controlled in the `Configuration/Webtest` portion of the template file. Specifically the section below:

```xml
<RuleParameter Name=\"FindText\" Value=\"',parameters('pingText'), '\" />
<RuleParameter Name=\"IgnoreCase\" Value=\"False\" />
<RuleParameter Name=\"UseRegularExpression\" Value=\"False\" />
<RuleParameter Name=\"PassIfTextFound\" Value=\"True\" />
```

### Test locations

|Id                  | Region           |
|:-------------------|:-----------------|
| `emea-nl-ams-azr`  | West Europe      |
| `us-ca-sjc-azr`    | West US          |
| `emea-ru-msa-edge` | UK South         |
| `emea-se-sto-edge` | UK West          |
| `apac-sg-sin-azr`  | Southeast Asia   |
| `us-tx-sn1-azr`    | South Central US |
| `us-il-ch1-azr`    | North Central US |
| `emea-gb-db3-azr`  | North Europe     |
| `apac-jp-kaw-edge` | Japan East       |
| `emea-fr-pra-edge` | France Central   |
| `emea-ch-zrh-edge` | France South     |
| `us-va-ash-azr`    | East US          |
| `apac-hk-hkn-azr`  | East Asia        |
| `us-fl-mia-edge`   | Central US       |
| `latam-br-gru-edge`| Brazil South      |
| `emea-au-syd-edge` | Australia East   |

### US Government test locations

|Id                    | Region           |
|----------------------|------------------|
| `usgov-va-azr`       | `USGov Virginia` |
| `usgov-phx-azr`      | `USGov Arizona`  |
| `usgov-tx-azr`       | `USGov Texas`    |
| `usgov-ddeast-azr`   | `USDoD East`     |
| `usgov-ddcentral-azr`| `USDoD Central`  |

## Next steps

- [Get other sample templates for Azure Monitor](../resource-manager-samples.md).
- [Learn more about alerts](./alerts-overview.md).
- [Get a sample to create an action group with Resource Manager template](resource-manager-action-groups.md)
