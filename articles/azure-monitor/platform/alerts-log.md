---
title: Create, view, and manage log alerts Using Azure Monitor | Microsoft Docs
description: Use the Azure Monitor to author, view, and manage log alert rules in Azure.
author: msvijayn
services: azure-monitor
ms.service: azure-monitor
ms.topic: conceptual
ms.date: 05/30/2019
ms.author: vinagara
ms.subservice: alerts
---
# Create, view, and manage log alerts using Azure Monitor

## Overview
This article shows you how to set up log alerts using the alerts interface inside Azure portal. Definition of an alert rule is in three parts:
- Target: Specific Azure resource, which is to be monitored
- Criteria: Specific condition or logic that when seen in Signal, should trigger action
- Action: Specific call sent to a receiver of a notification - email, SMS, webhook etc.

The term **Log Alerts** to describe alerts where signal is log query in a [Log Analytics workspace](../learn/tutorial-viewdata.md) or [Application Insights](../app/analytics.md). Learn more about functionality, terminology, and types from [Log alerts - Overview](alerts-unified-log.md).

> [!NOTE]
> Popular log data from [a Log Analytics workspace](../../azure-monitor/learn/tutorial-viewdata.md) is now also available on the metric platform in Azure Monitor. For details view, [Metric Alert for Logs](alerts-metric-logs.md)

## Managing log alerts from the Azure portal

Detailed next is step-by-step guide to using log alerts using the Azure portal interface.

### Create a log alert rule with the Azure portal

1. In the [portal](https://portal.azure.com/), select **Monitor** and under the MONITOR section - choose **Alerts**.

    ![Monitoring](media/alerts-log/AlertsPreviewMenu.png)

1. Select the **New Alert Rule** button to create a new alert in Azure.

    ![Add Alert](media/alerts-log/AlertsPreviewOption.png)

1. The Create Alert section is shown with the three parts consisting of: *Define alert condition*, *Define alert details*, and *Define action group*.

    ![Create rule](media/alerts-log/AlertsPreviewAdd.png)

1. Define the alert condition by using the **Select Resource** link and specifying the target by selecting a resource. Filter by choosing the _Subscription_, _Resource Type_, and required _Resource_.

   > [!NOTE]
   > For creating a log alert - verify the **log** signal is available for the selected resource before you proceed.
   >  ![Select resource](media/alerts-log/Alert-SelectResourceLog.png)

1. *Log Alerts*: Ensure **Resource Type** is an analytics source like *Log Analytics* or *Application Insights* and signal type as **Log**, then once appropriate **resource** is chosen, click *Done*. Next use the **Add criteria** button to view list of signal options available for the resource and from the signal list **Custom log search** option for chosen log monitor service like *Log Analytics* or *Application Insights*.

   ![Select a resource - custom log search](media/alerts-log/AlertsPreviewResourceSelectionLog.png)

   > [!NOTE]
   > 
   > Alerts lists can import analytics query as signal type - **Log (Saved Query)**, as seen in above illustration. So users can perfect your query in Analytics and then save them for future use in alerts - more details on using saving query available at [using log query in Azure Monitor](../log-query/log-query-overview.md) or [shared query in application insights analytics](../log-query/log-query-overview.md).

1. *Log Alerts*: Once selected, query for alerting can be stated in **Search Query** field; if the query syntax is incorrect the field displays error in RED. If the query syntax is correct - For reference historic data of the stated query is shown as a graph with option to tweak the time window from last six hours to last week.

    ![Configure alert rule](media/alerts-log/AlertsPreviewAlertLog.png)

   > [!NOTE]
   > 
   > Historical data visualization can only be shown if the query results have time details. If your query results in summarized data or specific column values - same is shown as a singular plot.
   > For Metric Measurement type of Log Alerts using Application Insights or [switched to new API](alerts-log-api-switch.md), you can specify which specific variable to group the data by using the **Aggregate on** option; as illustrated in below:
   > 
   > ![aggregate on option](media/alerts-log/aggregate-on.png)

1. *Log Alerts*: With the visualization in place, **Alert Logic** can be selected from shown options of Condition, Aggregation and finally Threshold. Finally specify in the logic, the time to assess for the specified condition, using **Period** option. Along with how often Alert should run by selecting **Frequency**. **Log Alerts** can be based on:
    - [Number of Records](../../azure-monitor/platform/alerts-unified-log.md#number-of-results-alert-rules): An alert is created if the count of records returned by the query is either greater than or less than the value provided.
    - [Metric Measurement](../../azure-monitor/platform/alerts-unified-log.md#metric-measurement-alert-rules): An alert is created if each *aggregate value* in the results exceeds the threshold value provided and it is *grouped by* chosen value. The number of breaches for an alert is the number of times the threshold is exceeded in the chosen time period. You can specify Total breaches for any combination of breaches across the results set or Consecutive breaches to require that the breaches must occur in consecutive samples.


1. As the second step, define a name for your alert in the **Alert rule name** field along with a **Description** detailing specifics for the alert and **Severity** value from the options provided. These details are reused in all alert emails, notifications, or push done by Azure Monitor. Additionally, user can choose to immediately activate the alert rule on creation by appropriately toggling **Enable rule upon creation** option.

    For **Log Alerts** only, some additional functionality is available in Alert details:

    - **Suppress Alerts**: When you turn on suppression for the alert rule, actions for the rule are disabled for a defined length of time after creating a new alert. The rule is still running and creates alert records provided the criteria is met. Allowing you time to correct the problem without running duplicate actions.

        ![Suppress Alerts for Log Alerts](media/alerts-log/AlertsPreviewSuppress.png)

        > [!TIP]
        > Specify an suppress alert value greater than frequency of alert to ensure notifications are stopped without overlap

1. As the third and final step, specify if any **Action Group** needs to be triggered for the alert rule when alert condition is met. You can choose any existing Action Group with alert or create a new Action Group. According to selected Action Group, when alert is trigger Azure will: send email(s), send SMS(s), call Webhook(s), remediate using Azure Runbooks, push to your ITSM tool, etc. Learn more about [Action Groups](action-groups.md).

    > [!NOTE]
    > Refer to the [Azure subscription service limits](../../azure-subscription-service-limits.md) for limits on Runbook payloads triggered for log alerts via Azure action groups

    For **Log Alerts** some additional functionality is available to override the default Actions:

    - **Email Notification**: Overrides *e-mail subject* in the email, sent via Action Group; if one or more email actions exist in the said Action Group. You cannot modify the body of the mail and this field is **not** for email address.
    - **Include custom Json payload**: Overrides the webhook JSON used by Action Groups; if one or more webhook actions exist in the said Action Group. User can specify format of JSON to be used for all webhooks configured in associated Action Group; for more information on webhook formats, see [webhook action for Log Alerts](../../azure-monitor/platform/alerts-log-webhook.md). View Webhook option is provided to check format using sample JSON data.

        ![Action Overrides for Log Alerts](media/alerts-log/AlertsPreviewOverrideLog.png)


1. If all fields are valid and with green tick the **create alert rule** button can be clicked and an alert is created in Azure Monitor - Alerts. All alerts can be viewed from the alerts Dashboard.

     ![Rule Creation](media/alerts-log/AlertsPreviewCreate.png)

     Within a few minutes, the alert is active and triggers as previously described.

Users can also finalized their analytics query in [log analytics](../log-query/portals.md) and then push it to create an alert via 'Set Alert' button - then following instructions from Step 6 onwards in the above tutorial.

 ![Log Analytics - Set Alert](media/alerts-log/AlertsAnalyticsCreate.png)

### View & manage log alerts in Azure portal

1. In the [portal](https://portal.azure.com/), select **Monitor** and under the MONITOR section - choose **Alerts**.

1. The **Alerts Dashboard** is displayed - wherein all Azure Alerts (including log alerts) are displayed in a singular board; including every instance of when your log alert rule has fired. To learn more, see [Alert Management](https://aka.ms/managealertinstances).
    > [!NOTE]
    > Log alert rules comprise of custom query-based logic provided by users and hence without a resolved state. Due to which every time the conditions specified in the log alert rule are met, it is fired.

1. Select the **Manage rules** button on the top bar, to navigate to the rule management section - where all  alert rules created are listed; including alerts that have been disabled.
    ![ manage alert rules](media/alerts-log/manage-alert-rules.png)

## Managing log alerts using Azure Resource Template

Log alerts in Azure Monitor are associated with resource type `Microsoft.Insights/scheduledQueryRules/`. For more information on this resource type, see [Azure Monitor - Scheduled Query Rules API reference](https://docs.microsoft.com/rest/api/monitor/scheduledqueryrules/). Log alerts for Application Insights or Log Analytics, can be created using [Scheduled Query Rules API](https://docs.microsoft.com/rest/api/monitor/scheduledqueryrules/).

> [!NOTE]
> Log alerts for Log Analytics can also be managed using legacy [Log Analytics Alert API](api-alerts.md) and legacy templates of [Log Analytics saved searches and alerts](../insights/solutions-resources-searches-alerts.md) as well. For more information on using the new ScheduledQueryRules API detailed here by default, see [Switch to new API for Log Analytics Alerts](alerts-log-api-switch.md).


### Sample Log alert creation using Azure Resource Template

The following is the structure for [Scheduled Query Rules creation](https://docs.microsoft.com/rest/api/monitor/scheduledqueryrules/createorupdate) based resource template using standard log search query of [number of results type log alert](alerts-unified-log.md#number-of-results-alert-rules), with sample data set as variables.

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

The sample json above can be saved as (say) sampleScheduledQueryRule.json for the purpose of this walk through and can be deployed using [Azure Resource Manager in Azure portal](../../azure-resource-manager/resource-group-template-deploy-portal.md#deploy-resources-from-custom-template).


### Log alert with cross-resource query using Azure Resource Template

The following is the structure for [Scheduled Query Rules creation](https://docs.microsoft.com/rest/api/monitor/scheduledqueryrules/createorupdate) based resource template using [cross-resource log search query](../../azure-monitor/log-query/cross-workspace-query.md) of [metric measurement type log alert](../../azure-monitor/platform/alerts-unified-log.md#metric-measurement-alert-rules), with sample data set as variables.

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
> When using cross-resource query in log alert, the usage of [authorizedResources](https://docs.microsoft.com/rest/api/monitor/scheduledqueryrules/createorupdate#source) is mandatory and user must have access to the list of resources stated

The sample json above can be saved as (say) sampleScheduledQueryRule.json for the purpose of this walk through and can be deployed using [Azure Resource Manager in Azure portal](../../azure-resource-manager/resource-group-template-deploy-portal.md#deploy-resources-from-custom-template).

## Managing log alerts using PowerShell

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

Azure Monitor - [Scheduled Query Rules API](https://docs.microsoft.com/rest/api/monitor/scheduledqueryrules/) is a REST API and fully compatible with Azure Resource Manager REST API. And PowerShell cmdlets listed below are available to leverage the [Scheduled Query Rules API](https://docs.microsoft.com/rest/api/monitor/scheduledqueryrules/).

1. [New-AzScheduledQueryRule](https://docs.microsoft.com/powershell/module/az.monitor/new-azscheduledqueryrule) : Powershell cmdlet to create a new log alert rule.
1. [Set-AzScheduledQueryRule](https://docs.microsoft.com/powershell/module/az.monitor/set-azscheduledqueryrule) : Powershell cmdlet to update an existing log alert rule.
1. [New-AzScheduledQueryRuleSource](https://docs.microsoft.com/powershell/module/az.monitor/new-azscheduledqueryrulesource) : Powershell cmdlet to create or update object specifying source parameters for a log alert. Used as input by [New-AzScheduledQueryRule](https://docs.microsoft.com/powershell/module/az.monitor/new-azscheduledqueryrule) and [Set-AzScheduledQueryRule](https://docs.microsoft.com/powershell/module/az.monitor/set-azscheduledqueryrule) cmdlet.
1. [New-AzScheduledQueryRuleSchedule](https://docs.microsoft.com/powershell/module/az.monitor/New-AzScheduledQueryRuleSchedule): Powershell cmdlet to create or update object specifying schedule parameters for a log alert. Used as input by [New-AzScheduledQueryRule](https://docs.microsoft.com/powershell/module/az.monitor/new-azscheduledqueryrule) and [Set-AzScheduledQueryRule](https://docs.microsoft.com/powershell/module/az.monitor/set-azscheduledqueryrule) cmdlet.
1. [New-AzScheduledQueryRuleAlertingAction](https://docs.microsoft.com/powershell/module/az.monitor/New-AzScheduledQueryRuleAlertingAction) : Powershell cmdlet to create or update object specifying action parameters for a log alert. Used as input by [New-AzScheduledQueryRule](https://docs.microsoft.com/powershell/module/az.monitor/new-azscheduledqueryrule) and [Set-AzScheduledQueryRule](https://docs.microsoft.com/powershell/module/az.monitor/set-azscheduledqueryrule) cmdlet.
1. [New-AzScheduledQueryRuleAznsActionGroup](https://docs.microsoft.com/powershell/module/az.monitor/new-azscheduledqueryruleaznsactiongroup) : Powershell cmdlet to create or update object specifying action groups parameters for a log alert. Used as input by [New-AzScheduledQueryRuleAlertingAction](https://docs.microsoft.com/powershell/module/az.monitor/New-AzScheduledQueryRuleAlertingAction) cmdlet.
1. [New-AzScheduledQueryRuleTriggerCondition](https://docs.microsoft.com/powershell/module/az.monitor/new-azscheduledqueryruletriggercondition) : Powershell cmdlet to create or update object specifying trigger condition parameters for log alert. Used as input by [New-AzScheduledQueryRuleAlertingAction](https://docs.microsoft.com/powershell/module/az.monitor/New-AzScheduledQueryRuleAlertingAction) cmdlet.
1. [New-AzScheduledQueryRuleLogMetricTrigger](https://docs.microsoft.com/powershell/module/az.monitor/new-azscheduledqueryrulelogmetrictrigger) : Powershell cmdlet to create or update object specifying metric trigger condition parameters for [metric measurement type log alert](../../azure-monitor/platform/alerts-unified-log.md#metric-measurement-alert-rules). Used as input by [New-AzScheduledQueryRuleTriggerCondition](https://docs.microsoft.com/powershell/module/az.monitor/new-azscheduledqueryruletriggercondition) cmdlet.
1. [Get-AzScheduledQueryRule](https://docs.microsoft.com/powershell/module/az.monitor/get-azscheduledqueryrule) : Powershell cmdlet to list existing log alert rules or a specific log alert rule
1. [Update-AzScheduledQueryRule](https://docs.microsoft.com/powershell/module/az.monitor/update-azscheduledqueryrule) : Powershell cmdlet to enable or disable log alert rule
1. [Remove-AzScheduledQueryRule](https://docs.microsoft.com/powershell/module/az.monitor/remove-azscheduledqueryrule): Powershell cmdlet to delete an existing log alert rule

> [!NOTE]
> ScheduledQueryRules PowerShell cmdlets can only manage rules created cmdlet itself or using Azure Monitor - [Scheduled Query Rules API](https://docs.microsoft.com/rest/api/monitor/scheduledqueryrules/). Log alert rules created using legacy [Log Analytics Alert API](api-alerts.md) and legacy templates of [Log Analytics saved searches and alerts](../insights/solutions-resources-searches-alerts.md) can be managed using ScheduledQueryRules PowerShell cmdlets only after user [switches API preference for Log Analytics Alerts](alerts-log-api-switch.md).

## Managing log alerts using CLI or API

Azure Monitor - [Scheduled Query Rules API](https://docs.microsoft.com/rest/api/monitor/scheduledqueryrules/) is a REST API and fully compatible with Azure Resource Manager REST API. Hence it can be used via Powershell using Resource Manager commands for Azure CLI.


> [!NOTE]
> Log alerts for Log Analytics can also be managed using legacy [Log Analytics Alert API](api-alerts.md) and legacy templates of [Log Analytics saved searches and alerts](../insights/solutions-resources-searches-alerts.md) as well. For more information on using the new ScheduledQueryRules API detailed here by default, see [Switch to new API for Log Analytics Alerts](alerts-log-api-switch.md).

Log alerts currently do not have dedicated CLI commands currently; but as illustrated below can be used via Azure Resource Manager CLI command for sample Resource Template shown earlier (sampleScheduledQueryRule.json) in the Resource Template section:

```azurecli
az group deployment create --resource-group contosoRG --template-file sampleScheduledQueryRule.json
```

On successful operation, 201 will be returned to state new alert rule creation or 200 will be returned if an existing alert rule was modified.

## Next steps

* Learn about [Log Alerts in Azure Alerts](../../azure-monitor/platform/alerts-unified-log.md)
* Understand [Webhook actions for log alerts](../../azure-monitor/platform/alerts-log-webhook.md)
* Learn more about [Application Insights](../../azure-monitor/app/analytics.md)
* Learn more about [log queries](../log-query/log-query-overview.md).
