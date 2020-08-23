---
title: Create, view, and manage log alerts Using Azure Monitor | Microsoft Docs
description: Use Azure Monitor to create, view, and manage log alert rules
author: yanivlavi
ms.author: yalavi
ms.topic: conceptual
ms.date: 07/29/2019
ms.subservice: alerts
---
# Create, view, and manage log alerts using Azure Monitor

## Overview
This article shows you how to create and manage log alerts using Azure Monitor. Alert rules are defined by three components:
- Target: A specific Azure resource to monitor
- Criteria: Logic to evaluate. If met, the alert fires.  
- Action: Notifications or automation about the alert - email, SMS, webhook, and so on.

Log alerts allow users to use a [Log Analytics](../log-query/get-started-portal.md) query to evaluated resources logs every set frequency, and fire an alert based on the results. Rules can trigger run one or more actions using [Action Groups](./action-groups.md). [Learn more about functionality and terminology of log alerts](alerts-unified-log.md).

> [!NOTE]
> Log data from a [Log Analytics workspace](../log-query/get-started-portal.md) can sent to the Azure Monitor metrics store. Metrics alerts have [different behavior](alerts-metric-overview.md), which may be more desirable depending on the data you are working with. For information on what and how you can route logs to metrics, see [Metric Alert for Logs](alerts-metric-logs.md).

## Create a log alert rule with the Azure portal

Here the steps to get started writing queries for alerts:

1. Go to the resource you would like to alert on.
1. Under **Monitor**, select **Logs**.
1. Query the log data that can indicate the issue. You can use examples to understand what you can discover or [get started on writing queries](../log-query/get-started-portal.md). Also, [learn how to create optimized alert queries](alerts-log-query.md).
1. Press on '+ New Alert Rule' button to start the alert creation flow.

    ![Log Analytics - Set Alert](media/alerts-log/AlertsAnalyticsCreate.png)

> [!NOTE]
> It is recommended that you create alerts at scale, when using resource access mode for logs, which run on multiple resources using a resource group or subscription scope. Alerting at scale reduces rule management overhead. To be able to target the resources, please include the resource ID column in the results.

### Log alert for Log Analytics and Application Insights

1. If the query syntax is correct, then historical data for the query appears as a graph with the option to tweak the chart period from last six hours to last week.
 
    If your query results contain summarized data or project-specific columns without time column, the chart shows a single value.

    ![Configure alert rule](media/alerts-log/AlertsPreviewAlertLog.png)

1. Choose the time range over which to assess the specified condition, using [**Period**](alerts-unified-log.md#time-range) option. 

1. Log Alerts can be based on two types of [**Measures**](alerts-unified-log.md#measure):
    1. **Number of Records** - Count of records returned by the query.
    1. **Metric Measurement** - *Aggregate value* calculated by group expression chosen and [bin()](/azure/kusto/query/binfunction) selection.

1. For metric measurements alert logic, you can optionally specify how to [split the alerts by dimensions](alerts-unified-log.md#split-by-alert-dimensions) using the **Aggregate on** option. Row grouping expression must be unique and sorted.

    > [!NOTE]
    > As [bin()](/azure/kusto/query/binfunction) can result in uneven time intervals, the alert service will automatically convert bin command to bin_at command with appropriate time at runtime, to ensure results with a fixed point.

    > [!NOTE]
    > Split by alert dimensions is only available for the current scheduledQueryRules API. If you use the legacy [Log Analytics Alert API](api-alerts.md), you will need to switch. [Learn more about switching](./alerts-log-api-switch.md). Resource centric alerting at scale at scale is only supported in the API version `2020-05-01-preview` and above.

    ![aggregate on option](media/alerts-log/aggregate-on.png)

1. Next, based on the preview data set the [**Operator**, **Threshold Value**](alerts-unified-log.md#threshold-and-operator), and [**Frequency**](alerts-unified-log.md#frequency).

1. You can also optionally set the [number of violations to trigger an alert](alerts-unified-log.md#number-of-violations-to-trigger-alert) by using **Total or Consecutive Breaches**.

1. Select **Done**. 

1. Define the **Alert rule name**, **Description**, and select the alert **Severity**. These details are used in all alert actions. Additionally, you can choose to not activate the alert rule on creation by clicking **Enable rule upon creation**.

1. Choose if you want to suppress rule actions for a time after an alert is fires, use the [**Suppress Alerts**](alerts-unified-log.md#state-and-resolving-alerts) option. The rule will still run and create alerts but actions won't be triggered to prevent noise.

    ![Suppress Alerts for Log Alerts](media/alerts-log/AlertsPreviewSuppress.png)

    > [!TIP]
    > Specify a mute actions value greater than the frequency of alert to ensure notifications are stopped without overlap

1. Specify if the alert rule should trigger one or more [**Action Groups**](action-groups.md#webhook) when alert condition is met.

    > [!NOTE]
    > Refer to the [Azure subscription service limits](../../azure-resource-manager/management/azure-subscription-service-limits.md) for limits on the actions that can be performed.  

1. You can optionally customize actions in log alert rules:

    - **Custom Email Subject**: Overrides the *e-mail subject* in the email sent via the Action Group. You can't modify the body of the mail and this field **isn't for email addresses**.
    - **Include custom Json payload**: Overrides the webhook JSON used by Action Groups assuming the action group contains a webhook type. Learn more about [webhook action for Log Alerts](./alerts-log-webhook.md).

    ![Action Overrides for Log Alerts](media/alerts-log/AlertsPreviewOverrideLog.png)

1. If all fields are correctly set, the **Create alert rule** button can be clicked and an alert is created.

    Within a few minutes, the alert is active and triggers as previously described.

    ![Rule Creation](media/alerts-log/AlertsPreviewCreate.png)

#### Creating log alert for Log Analytics and Application Insights from the alerts management

> [!NOTE]
> Creation for alerts management is currently not supported for resource centric logs

1. In the [portal](https://portal.azure.com/), select **Monitor**. In that section, choose **Alerts**.

    ![Monitoring](media/alerts-log/AlertsPreviewMenu.png)

1. Select **New Alert Rule**. 

    ![Add Alert](media/alerts-log/AlertsPreviewOption.png)

1. The **Create Alert** pane appears. It has four parts: 
    - The resource to which the alert applies
    - The condition to check
    - The action to take if the condition is true
    - The details to name and describe the alert. 

    ![Create rule](media/alerts-log/AlertsPreviewAdd.png)

1. Define the alert condition by using the **Select Resource** link and specifying the target by selecting a resource. Filter by choosing the *Subscription*, *Resource Type*, and required *Resource*. Ensure the resource has logs enabled.

   ![Select resource](media/alerts-log/Alert-SelectResourceLog.png)

1. Next, use the add **Condition** button to view list of signal options available for the resource. Select **Custom log search** option.

   ![Select a resource - custom log search](media/alerts-log/AlertsPreviewResourceSelectionLog.png)

   > [!NOTE]
   > The alerts portal lists saved queries from log analytics and Application Insights and they can be used as template alert query.

1. Once selected, paste the alerting query in the **Search Query** field.

1. Continue to the next described in the [last section](#log-alert-for-log-analytics-and-application-insights).

### Log alert for all other resource types

1. Start from the **Condition** tab:

    1. Check that the [**Measure**](alerts-unified-log.md#measure), [**Aggregation type**](alerts-unified-log.md#aggregation-type), and [**Aggregation granularity**](alerts-unified-log.md#aggregation-granularity) are correct. 
        1. By default, the rule counts the number of results in the last 5 minutes.
        1. If we detect summarized query results, the rule will be updated automatically within a few seconds to capture that.

    1. Choose [alert splitting by dimensions](alerts-unified-log.md#split-by-alert-dimensions), if needed: 
       - **Resource ID column** is selected automatically, if detected, and changes the context of the fired alert to the record's resource. 
       - **Resource ID column** can be de-selected to fire alerts on subscription or resource groups. De-selecting is useful when query results are based on cross-resources. For example, a query that check if 80% of the resource group's virtual machines are experiencing high CPU usage.
       - Up to six additional splittings can be also selected for any number or text columns using the dimensions table.
       - Alerts are fired separately according to splitting based on unique combinations and alert payload include this information.
    
        ![Select aggregation parameters and splitting](media/alerts-log/SelectAggregationParametersAndSplitting.png)

    1. The **Preview** chart shows query evaluations results over time. You can change the chart period or select different time series that resulted from unique alert splitting by dimensions.

        ![Preview chart](media/alerts-log/PreviewChart.png)

    1. Next, based on the preview data set the **Alert logic**; [**Operator**, **Threshold Value**](alerts-unified-log.md#threshold-and-operator), and [**Frequency**](alerts-unified-log.md#frequency).

        ![Preview chart with threshold and alert logic](media/alerts-log/ChartAndAlertLogic.png)

    1. You can optionally set [**Number of violations to trigger the alert**](alerts-unified-log.md#number-of-violations-to-trigger-alert) in the **Advanced options** section.
    
        ![Advanced options](media/alerts-log/AdvancedOptions.png)

1. In the **Actions** tab, select or create the required [action groups](action-groups.md).

    ![Actions tab](media/alerts-log/ActionsTab.png)

1. In the **Details** tab, define the **Alert rule details**, and **Project details**. You can optionally set whether to not **Start running now** or [**Mute Actions**](alerts-unified-log.md#state-and-resolving-alerts) for a period after the alert rule fires.

    > [!NOTE]
    > Log alert rules are currently stateless and fires action every time an alert is created unless muting is defined.

    ![Details tab](media/alerts-log/DetailsTab.png)

1. In the **Tags** tab, set any required tags on the alert rules resource.

    ![Tags tab](media/alerts-log/TagsTab.png)

1. In the **Review + create** tab, a validation will run and inform of any issues. Review and approve the rule definition.
1. If all fields are valid, **Create** button can be clicked and an alert is created in Azure Monitor. All alerts can be viewed from the alerts Dashboard.
 
    ![Review and create tab](media/alerts-log/ReviewAndCreateTab.png)

### View & manage log alerts in Azure portal

1. In the [portal](https://portal.azure.com/), select the relevant resource or the **Monitor** service. Then select **Alerts** in the Monitor section.

1. The alerts management displays all alerts that fired. [Learn more about the alert management](alerts-managing-alert-instances.md).

    > [!NOTE]
    > Log alert rules are currently [stateless and do not resolved](alerts-unified-log.md#state-and-resolving-alerts).

1. Select **Manage rules** button on the top bar to edit rules:

    ![ manage alert rules](media/alerts-log/manage-alert-rules.png)

## Managing log alerts using Azure Resource Template

Log alerts are created in the `Microsoft.Insights/scheduledQueryRules` resource provider. See API reference for [Scheduled Query Rules API](/rest/api/monitor/scheduledqueryrules/).

> [!NOTE]
> Log alerts for Log Analytics used to be managed using the legacy [Log Analytics Alert API](api-alerts.md) and legacy templates of [Log Analytics saved searches and alerts](../insights/solutions.md). [Learn more about switching to the current ScheduledQueryRules API](alerts-log-api-switch.md).


### Example of simple template (up to version 2018-04-16)

[Scheduled Query Rules creation](/rest/api/monitor/scheduledqueryrules/createorupdate) template based on [number of results log alert](alerts-unified-log.md#count-of-the-results-table-rows) (sample data set as variables):

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
    },
    "variables": {
        "alertLocation": "southcentralus",
        "alertName": "samplelogalert",
        "alertDescription": "Sample log search alert",
        "alertStatus": "true",
        "alertSource":{
            "Query":"requests",
            "SourceId": "/subscriptions/a123d7efg-123c-1234-5678-a12bc3defgh4/resourceGroups/myRG/providers/microsoft.insights/components/sampleAIapplication",
            "Type":"ResultCount"
        },
        "alertSchedule":{
            "Frequency": 15,
            "Time": 60
        },
        "alertActions":{
            "SeverityLevel": "4"
        },
        "alertTrigger":{
            "Operator":"GreaterThan",
            "Threshold":"1"
        },
        "actionGrp":{
            "ActionGroup": "/subscriptions/a123d7efg-123c-1234-5678-a12bc3defgh4/resourceGroups/myRG/providers/microsoft.insights/actiongroups/sampleAG",
            "Subject": "Customized Email Header",
            "Webhook": "{ \"alertname\":\"#alertrulename\", \"IncludeSearchResults\":true }"
        }
    },
    "resources":[ {
        "name":"[variables('alertName')]",
        "type":"Microsoft.Insights/scheduledQueryRules",
        "apiVersion": "2018-04-16",
        "location": "[variables('alertLocation')]",
        "properties":{
            "description": "[variables('alertDescription')]",
            "enabled": "[variables('alertStatus')]",
            "source": {
                "query": "[variables('alertSource').Query]",
                "dataSourceId": "[variables('alertSource').SourceId]",
                "queryType":"[variables('alertSource').Type]"
            },
            "schedule":{
                "frequencyInMinutes": "[variables('alertSchedule').Frequency]",
                "timeWindowInMinutes": "[variables('alertSchedule').Time]"
            },
            "action":{
                "odata.type": "Microsoft.WindowsAzure.Management.Monitoring.Alerts.Models.Microsoft.AppInsights.Nexus.DataContracts.Resources.ScheduledQueryRules.AlertingAction",
                "severity":"[variables('alertActions').SeverityLevel]",
                "aznsAction":{
                    "actionGroup":"[array(variables('actionGrp').ActionGroup)]",
                    "emailSubject":"[variables('actionGrp').Subject]",
                    "customWebhookPayload":"[variables('actionGrp').Webhook]"
                },
                "trigger":{
                    "thresholdOperator":"[variables('alertTrigger').Operator]",
                    "threshold":"[variables('alertTrigger').Threshold]"
                }
            }
        }
    } ]
}

```

This JSON can be saved and deployed using [Azure Resource Manager in Azure portal](../../azure-resource-manager/templates/deploy-portal.md#deploy-resources-from-custom-template).

### Example of template with cross-resource query (up to version 2018-04-16)

[Scheduled Query Rules creation](/rest/api/monitor/scheduledqueryrules/createorupdate) template based on [metric measurement](./alerts-unified-log.md#calculation-of-measure-based-on-a-number-column-such-as-cpu-counter-value) that queries [cross-resources](../log-query/cross-workspace-query.md) (sample data set as variables):

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
    },
    "variables": {
        "alertLocation": "Region Name for your Application Insights App or Log Analytics Workspace",
        "alertName": "sample log alert",
        "alertDescr": "Sample log search alert",
        "alertStatus": "true",
        "alertSource":{
            "Query":"union workspace(\"servicews\").Update, app('serviceapp').requests | summarize AggregatedValue = count() by bin(TimeGenerated,1h), Classification",
            "Resource1": "/subscriptions/a123d7efg-123c-1234-5678-a12bc3defgh4/resourceGroups/contosoRG/providers/microsoft.OperationalInsights/workspaces/servicews",
            "Resource2": "/subscriptions/a123d7efg-123c-1234-5678-a12bc3defgh4/resourceGroups/contosoRG/providers/microsoft.insights/components/serviceapp",
            "SourceId": "/subscriptions/a123d7efg-123c-1234-5678-a12bc3defgh4/resourceGroups/contosoRG/providers/microsoft.OperationalInsights/workspaces/servicews",
            "Type":"ResultCount"
        },
        "alertSchedule":{
            "Frequency": 15,
            "Time": 60
        },
        "alertActions":{
            "SeverityLevel": "4",
            "SuppressTimeinMin": 20
        },
        "alertTrigger":{
            "Operator":"GreaterThan",
            "Threshold":"1"
        },
        "metricMeasurement": {
            "thresholdOperator": "Equal",
            "threshold": "1",
            "metricTriggerType": "Consecutive",
            "metricColumn": "Classification"
        },
        "actionGrp":{
            "ActionGroup": "/subscriptions/a123d7efg-123c-1234-5678-a12bc3defgh4/resourceGroups/contosoRG/providers/microsoft.insights/actiongroups/sampleAG",
            "Subject": "Customized Email Header",
            "Webhook": "{ \"alertname\":\"#alertrulename\", \"IncludeSearchResults\":true }"
        }
    },
    "resources":[ {
        "name":"[variables('alertName')]",
        "type":"Microsoft.Insights/scheduledQueryRules",
        "apiVersion": "2018-04-16",
        "location": "[variables('alertLocation')]",
        "properties":{
            "description": "[variables('alertDescr')]",
            "enabled": "[variables('alertStatus')]",
            "source": {
                "query": "[variables('alertSource').Query]",
                "authorizedResources": "[concat(array(variables('alertSource').Resource1), array(variables('alertSource').Resource2))]",
                "dataSourceId": "[variables('alertSource').SourceId]",
                "queryType":"[variables('alertSource').Type]"
            },
            "schedule":{
                "frequencyInMinutes": "[variables('alertSchedule').Frequency]",
                "timeWindowInMinutes": "[variables('alertSchedule').Time]"
            },
            "action":{
                "odata.type": "Microsoft.WindowsAzure.Management.Monitoring.Alerts.Models.Microsoft.AppInsights.Nexus.DataContracts.Resources.ScheduledQueryRules.AlertingAction",
                "severity":"[variables('alertActions').SeverityLevel]",
                "throttlingInMin": "[variables('alertActions').SuppressTimeinMin]",
                "aznsAction":{
                    "actionGroup": "[array(variables('actionGrp').ActionGroup)]",
                    "emailSubject":"[variables('actionGrp').Subject]",
                    "customWebhookPayload":"[variables('actionGrp').Webhook]"
                },
                "trigger":{
                    "thresholdOperator":"[variables('alertTrigger').Operator]",
                    "threshold":"[variables('alertTrigger').Threshold]",
                    "metricTrigger":{
                        "thresholdOperator": "[variables('metricMeasurement').thresholdOperator]",
                        "threshold": "[variables('metricMeasurement').threshold]",
                        "metricColumn": "[variables('metricMeasurement').metricColumn]",
                        "metricTriggerType": "[variables('metricMeasurement').metricTriggerType]"
                    }
                }
            }
        }
    } ]
}
```

> [!IMPORTANT]
> When using cross-resource query in log alert, the usage of [authorizedResources](/rest/api/monitor/scheduledqueryrules/createorupdate#source) is mandatory and user must have access to the list of resources stated

This JSON can be saved and deployed using [Azure Resource Manager in Azure portal](../../azure-resource-manager/templates/deploy-portal.md#deploy-resources-from-custom-template).

### Sample log alert Template for all resource types (from version 2020-05-01-preview)

[Scheduled Query Rules creation](/rest/api/monitor/scheduledqueryrules/createorupdate) template for all resource types (sample data set as variables):

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "alertName": {
            "type": "string",
            "minLength": 1,
            "metadata": {
                "description": "Name of the alert"
            }
        },
        "location": {
            "type": "string",
            "minLength": 1,
            "metadata": {
                "description": "Location of the alert"
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
        "query": {
            "type": "string",
            "minLength": 1,
            "metadata": {
                "description": "Name of the metric used in the comparison to activate the alert."
            }
        },
        "metricMeasureColumn": {
            "type": "string",
            "minLength": 1,
            "metadata": {
                "description": "Name of the measure column used in the alert evaluation."
            }
        },
        "resourceIdColumn": {
            "type": "string",
            "minLength": 1,
            "metadata": {
                "description": "Name of the resource ID column used in the alert targeting the alerts."
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
        "muteActionsDuration": {
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
                "description": "Mute actions for the chosen period of time (in ISO 8601 duration format) after the alert is fired."
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
    "variables": {  },
    "resources": [
        {
            "name": "[parameters('alertName')]",
            "type": "Microsoft.Insights/scheduledQueryRules",
            "location": "[parameters('location')]",
            "apiVersion": "2020-05-01-preview",
            "tags": {},
            "properties": {
                "description": "[parameters('alertDescription')]",
                "severity": "[parameters('alertSeverity')]",
                "enabled": "[parameters('isEnabled')]",
                "scopes": ["[parameters('resourceId')]"],
                "evaluationFrequency":"[parameters('evaluationFrequency')]",
                "windowSize": "[parameters('windowSize')]",
                "criteria": {
                    "allOf": [
                        {
                            "query": : "[parameters('query')]",
                            "metricMeasureColumn": "[parameters('metricMeasureColumn')]",
                            "resourceIdColumn": "[parameters('resourceIdColumn')]",
                            "dimensions":[],
                            "operator": "[parameters('operator')]",
                            "threshold" : "[parameters('threshold')]",
                            "timeAggregation": "[parameters('timeAggregation')]",
                            "failingPeriods": {
                                "numberOfEvaluationPeriods": "[parameters('numberOfEvaluationPeriods')]",
                                "minFailingPeriodsToAlert": "[parameters('minFailingPeriodsToAlert')]"
                            }
                        }
                    ]
                },
                "muteActionsDuration": "[parameters('muteActionsDuration')]",
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

This JSON can be saved and deployed using [Azure Resource Manager in Azure portal](../../azure-resource-manager/templates/deploy-portal.md#deploy-resources-from-custom-template).

## Managing log alerts using PowerShell

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

> [!NOTE]
> Powershell is not currently supported in the API version `2020-05-01-preview`

PowerShell cmdlets listed below are available to manage rules with the [Scheduled Query Rules API](/rest/api/monitor/scheduledqueryrules/).

- [New-AzScheduledQueryRule](/powershell/module/az.monitor/new-azscheduledqueryrule) : PowerShell cmdlet to create a new log alert rule.
- [Set-AzScheduledQueryRule](/powershell/module/az.monitor/set-azscheduledqueryrule) : PowerShell cmdlet to update an existing log alert rule.
- [New-AzScheduledQueryRuleSource](/powershell/module/az.monitor/new-azscheduledqueryrulesource) : PowerShell cmdlet to create or update object specifying source parameters for a log alert. Used as input by [New-AzScheduledQueryRule](/powershell/module/az.monitor/new-azscheduledqueryrule) and [Set-AzScheduledQueryRule](/powershell/module/az.monitor/set-azscheduledqueryrule) cmdlet.
- [New-AzScheduledQueryRuleSchedule](/powershell/module/az.monitor/new-azscheduledqueryruleschedule): PowerShell cmdlet to create or update object specifying schedule parameters for a log alert. Used as input by [New-AzScheduledQueryRule](/powershell/module/az.monitor/new-azscheduledqueryrule) and [Set-AzScheduledQueryRule](/powershell/module/az.monitor/set-azscheduledqueryrule) cmdlet.
- [New-AzScheduledQueryRuleAlertingAction](/powershell/module/az.monitor/new-azscheduledqueryrulealertingaction) : PowerShell cmdlet to create or update object specifying action parameters for a log alert. Used as input by [New-AzScheduledQueryRule](/powershell/module/az.monitor/new-azscheduledqueryrule) and [Set-AzScheduledQueryRule](/powershell/module/az.monitor/set-azscheduledqueryrule) cmdlet.
- [New-AzScheduledQueryRuleAznsActionGroup](/powershell/module/az.monitor/new-azscheduledqueryruleaznsactiongroup) : PowerShell cmdlet to create or update object specifying action groups parameters for a log alert. Used as input by [New-AzScheduledQueryRuleAlertingAction](/powershell/module/az.monitor/new-azscheduledqueryrulealertingaction) cmdlet.
- [New-AzScheduledQueryRuleTriggerCondition](/powershell/module/az.monitor/new-azscheduledqueryruletriggercondition) : PowerShell cmdlet to create or update object specifying trigger condition parameters for log alert. Used as input by [New-AzScheduledQueryRuleAlertingAction](/powershell/module/az.monitor/new-azscheduledqueryrulealertingaction) cmdlet.
- [New-AzScheduledQueryRuleLogMetricTrigger](/powershell/module/az.monitor/new-azscheduledqueryrulelogmetrictrigger) : PowerShell cmdlet to create or update object specifying metric trigger condition parameters for [metric measurement type log alert](./alerts-unified-log.md#calculation-of-measure-based-on-a-number-column-such-as-cpu-counter-value). Used as input by [New-AzScheduledQueryRuleTriggerCondition](/powershell/module/az.monitor/new-azscheduledqueryruletriggercondition) cmdlet.
- [Get-AzScheduledQueryRule](/powershell/module/az.monitor/get-azscheduledqueryrule) : PowerShell cmdlet to list existing log alert rules or a specific log alert rule
- [Update-AzScheduledQueryRule](/powershell/module/az.monitor/update-azscheduledqueryrule) : PowerShell cmdlet to enable or disable log alert rule
- [Remove-AzScheduledQueryRule](/powershell/module/az.monitor/remove-azscheduledqueryrule): PowerShell cmdlet to delete an existing log alert rule

> [!NOTE]
> ScheduledQueryRules PowerShell cmdlets can only manage rules created cmdlet itself or using Azure Monitor - [Scheduled Query Rules API](/rest/api/monitor/scheduledqueryrules/). Log alert rules created using legacy [Log Analytics Alert API](api-alerts.md) and legacy templates of [Log Analytics saved searches and alerts](../insights/solutions.md) can be managed using ScheduledQueryRules PowerShell cmdlets only after user [switches API preference for Log Analytics Alerts](alerts-log-api-switch.md).

Illustrated next are the steps for creation of a sample log alert rule using the scheduledQueryRules PowerShell cmdlets.

```powershell
$source = New-AzScheduledQueryRuleSource -Query 'Heartbeat | summarize AggregatedValue = count() by bin(TimeGenerated, 5m), _ResourceId' -DataSourceId "/subscriptions/a123d7efg-123c-1234-5678-a12bc3defgh4/resourceGroups/contosoRG/providers/microsoft.OperationalInsights/workspaces/servicews"

$schedule = New-AzScheduledQueryRuleSchedule -FrequencyInMinutes 15 -TimeWindowInMinutes 30

$metricTrigger = New-AzScheduledQueryRuleLogMetricTrigger -ThresholdOperator "GreaterThan" -Threshold 2 -MetricTriggerType "Consecutive" -MetricColumn "_ResourceId"

$triggerCondition = New-AzScheduledQueryRuleTriggerCondition -ThresholdOperator "LessThan" -Threshold 5 -MetricTrigger $metricTrigger

$aznsActionGroup = New-AzScheduledQueryRuleAznsActionGroup -ActionGroup "/subscriptions/a123d7efg-123c-1234-5678-a12bc3defgh4/resourceGroups/contosoRG/providers/microsoft.insights/actiongroups/sampleAG" -EmailSubject "Custom email subject" -CustomWebhookPayload "{ `"alert`":`"#alertrulename`", `"IncludeSearchResults`":true }"

$alertingAction = New-AzScheduledQueryRuleAlertingAction -AznsAction $aznsActionGroup -Severity "3" -Trigger $triggerCondition

New-AzScheduledQueryRule -ResourceGroupName "contosoRG" -Location "Region Name for your Application Insights App or Log Analytics Workspace" -Action $alertingAction -Enabled $true -Description "Alert description" -Schedule $schedule -Source $source -Name "Alert Name"
```

## Managing log alerts using CLI or API

> [!NOTE]
> Log alerts for Log Analytics used to be managed using the legacy [Log Analytics Alert API](api-alerts.md) and legacy templates of [Log Analytics saved searches and alerts](../insights/solutions.md). [Learn more about switching to the current ScheduledQueryRules API](alerts-log-api-switch.md).

Log alerts currently don't have a dedicated CLI, but can be used with Azure Resource Manager CLI with templates files:

```azurecli
az group deployment create --resource-group contosoRG --template-file sampleScheduledQueryRule.json
```

On success for creation, 201 is returned. On success for update, 200 is returned.

## Next steps

* Learn about [log alerts](./alerts-unified-log.md)
* Understand [webhook actions for log alerts](./alerts-log-webhook.md)
* Learn more about [log queries](../log-query/log-query-overview.md).

