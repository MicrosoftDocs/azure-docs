---
title: Monitoring & Alerting - How-To Guide
description: Learn how to Create Alerts for Quotas
ms.date: 30/09/2023
ms.topic: how-to
---

# Monitoring & Alerting: How-To Guide

## Create an alert rule 

#### Prerequisite 

| Requirement | Description |
|:--------|:-----------|
| Access to Create Alerts | Users who are creating Alert should have [Access to Create Alert](https://learn.microsoft.com/en-us/azure/azure-monitor/alerts/alerts-overview#azure-role-based-access-control-for-alerts) |
| Managed Identity | When utilizing an existing Managed Identity, ensure it has **Subscription Reader** access for accessing usage data. In cases where a new Managed Identity is generated, the Subscription **Owner** is responsible for **granting** Subscription **Reader** access to this newly created Managed Identity. |


### Create Alerts from Portal

Step-by-Step instructions to create an alert rule for your quota in the Azure portal. 

1.	Sign in to the [Azure portal](https://portal.azure.com) and enter **"quotas"** in the search box, then select **Quotas**. In Quotas page, Click **My quotas** and choose **Compute** Resource Provider. Upon pageload, you can choose `Quota Name` for creating new alert rule.

    :::image type="content" source="media/monitoring-alerting/myquotas-create-rule-navigation.png" alt-text="Screenshot showing how to select Quotas to navigate to create Alert rule screen":::

2.	When the Create usage alert rule page appears, **populate the fields** with data as shown in the table below.  Make sure you have the **right access** to the subscriptions and Quotas to **create alerts**. 

    :::image type="content" source="media/monitoring-alerting/quota-details-create-rule.png" alt-text="Screenshot showing how to select Quotas to navigate to create Alert rule screen":::

    | **Fields** | **Description** |
    |:--------|:-----------|
    | Alert Rule Name | Alert rule name must be distinct and cannot be duplicated, even across different resource groups |
    | Alert me when the usage % reaches | Drag the ruler to specify the usage percentage that triggers an alert. For instance, at the default setting of 80%, you'll receive an alert when your quota reaches 80% of its capacity.|
    | Severity | Select the severity of the alert when the rule’s condition is met.|
    | [Frequency of evaluation](https://learn.microsoft.com/en-us/azure/azure-monitor/alerts/alerts-overview#stateful-alerts) | Choose how often the alert rule should run, by selecting 5, 10, or 15 minutes.  If the frequency is smaller than the aggregation granularity, this will result in sliding window evaluation. |
    | [Resource Group](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/manage-resource-groups-portal) | Select a resource group similar to other quotas in your subscription, or create a new resource group.  This is a collection of resources that share the same lifecycles, permissions, and policies. |
    | [Log Analytics workspace](https://learn.microsoft.com/en-us/azure/azure-monitor/logs/quick-create-workspace?tabs=azure-portal) | Select from the dropdown or create a new workspace. If you create a new workspace, use it for all alerts in your subscription. This provides a log analytics workspace within the subscription that is being monitored and is used as the scope for rule execution.|
    | [Managed identity](https://learn.microsoft.com/en-us/azure/active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities?pivots=identity-mi-methods-azp) | Slect from the dropdown, or Create New. Managed Identity should have read permissions to the Subscription (to read Usage data from ARG) as well as Log Analytics workspace chosen above (to read the log alerts). |
    | Notify me by | There are 3 notifications methods and you can check 1 or all 3 check boxes, depending on your notification preference. |
    | [Use an existing action group](https://learn.microsoft.com/en-us/azure/azure-monitor/alerts/action-groups) | Check the box to use an existing action group. An action group invokes a defined set of notifications and actions when an alert is triggered. You can create Action Group to automatically Increase the Quota whenever possible. |
    | [Dimensions](https://learn.microsoft.com/en-us/azure/azure-monitor/alerts/alerts-types#dimensions-in-log-alert-rules) | Here are the options for selecting multiple Quotas and regions within a single alert rule. Adding dimensions is a cost-effective approach compared to creating a new alert for each quota or region.|
    | [Estimated cost](https://azure.microsoft.com/pricing/details/monitor/) |This is the automatically calculated cost associated with running this new alert rule against your quota. Each alert creation costs $0.50 USD, and each additional dimension adds $0.05 USD to the cost. |
    
    > [!TIP]
    > We advise using the **same Resource Group, Log Analytics Workspace,** and **Managed Identity** data that were  initially employed when creating your first alert rule for quotas within the same subscription.

3. After completing the fields above, click the **Create Alert** button 

   - If **Successful**, you will receive the following notification: 'We successfully created 'alert rule name' and 'Action Group 'name' was successfully created.'

   - If the **Alert fails**, you will receive an 'Alert rule failed to create' notification. Ensure that you verify the necessary access **permissions** given for the Log Analytics or Managed Identity. Refer Prerequisites."


### Create Alerts using API

Alerts can be created programmatically leveraging existing [**Monitoring API**](https://learn.microsoft.com/en-us/rest/api/monitor/scheduledqueryrule-2018-04-16/scheduled-query-rules/create-or-update?tabs=HTTP). 

This API helps to **create or update log search rule**. 

`PUT https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.Insights/scheduledQueryRules/{ruleName}?api-version=2018-04-16`

#### Sample Request body

```json
{
    "location": "westus2",
    "identity": {
        "type": "UserAssigned",
        "userAssignedIdentities": {
            "/subscriptions/ca8d68bb-8fd2-4a59-860d-765161f3db81/resourcegroups/argintrg/providers/Microsoft.ManagedIdentity/userAssignedIdentities/testmi": {}
        }
    },
    "properties": {
        "severity": 4,
        "enabled": true,
        "evaluationFrequency": "PT15M",
        "scopes": ["/subscriptions/<SubID>/resourcegroups/<rg>/providers/microsoft.operationalinsights/workspaces/mahshidmtestws"],
        "windowSize": "PT15M",
        "criteria": {
            "allOf": [{
                "query": "arg(\"\").QuotaResources \n| where subscriptionId =~ 'ca8d68bb-8fd2-4a59-860d-765161f3db81'\n| where type =~ 'microsoft.compute/locations/usages'\n| where isnotempty(properties)\n| mv-expand propertyJson = properties.value limit 400\n| extend\n    usage = propertyJson.currentValue,\n    quota = propertyJson.['limit'],\n    quotaName = tostring(propertyJson.['name'].value)\n| extend usagePercent = toint(usage)*100 / toint(quota)| project-away properties| where location in~ ('westus2')| where quotaName in~ ('cores')",
                "timeAggregation": "Maximum",
                "metricMeasureColumn": "usagePercent",
                "operator": "GreaterThanOrEqual",
                "threshold": 3,
                "dimensions": [{
                    "name": "type",
                    "operator": "Include",
                    "values": ["microsoft.compute/locations/usages"]
                }, {
                    "name": "location",
                    "operator": "Include",
                    "values": ["westus2"]
                }, {
                    "name": "quotaName",
                    "operator": "Include",
                    "values": ["cores"]
                }],
                "failingPeriods": {
                    "numberOfEvaluationPeriods": 1,
                    "minFailingPeriodsToAlert": 1
                }
            }]
        },
        "actions": {
            "actionGroups": ["/subscriptions/ca8d68bb-8fd2-4a59-860d-765161f3db81/resourcegroups/argintrg/providers/microsoft.insights/actiongroups/quotaalertrules-ag-22"]
        }
    }
}
```


### Create Alerts using ARG Query

Use existing **Alerts** blade to [create alerts by adding below query](https://learn.microsoft.com/en-us/azure/azure-monitor/alerts/alerts-create-new-alert-rule?tabs=log).  To Learn on how to create Alerts using Alerts page visit this [tutorial](https://learn.microsoft.com/en-us/training/modules/configure-azure-alerts/?source=recommendations).

For Quota alerts, make sure Scope is scelected as the Log analytics workspace that is created and the signal type is Customer Query log. Add below Query for Quota usages. Follow the remianing steps as mentioned in the [create alerts]((https://learn.microsoft.com/en-us/azure/azure-monitor/alerts/alerts-create-new-alert-rule?tabs=log)). 

#### Sample Query to create Alerts
```kusto
arg("").QuotaResources 
| where subscriptionId =~ 'ca8d68bb-8fd2-4a59-860d-7651656f3db8241'
| where type =~ 'microsoft.compute/locations/usages'
| where isnotempty(properties)
| mv-expand propertyJson = properties.value limit 400
| extend
    usage = propertyJson.currentValue,
    quota = propertyJson.['limit'],
    quotaName = tostring(propertyJson.['name'].value)
| extend usagePercent = toint(usage)*100 / toint(quota)| project-away properties| where location in~ ('westus2')| where quotaName in~ ('cores')
```

## Manage Quota Alerts

### View Alert Rules

Select **Quotas** | **Alert Rules** to see all the rules create for a given subscription. Here, you will have the option to edit, enable, or disable them as needed.

  :::image type="content" source="media/monitoring-alerting/view-alert-rules.png" alt-text="Screenshot showing how to select Quotas to navigate to create Alert rule screen":::

### View Fired Alerts

Select **Quotas** | **Fired Alert Rules** to see all the alerts that have been fired create for a given subscription. This page displays an overview of all the alert rules that have been triggered. You can click on each alert to view its details, including the history of how many times it was triggered and the status of each occurrence.

  :::image type="content" source="media/monitoring-alerting/view-fired-alerts.png" alt-text="Screenshot showing how to select Quotas to navigate to create Alert rule screen":::

### Edit, Update, Enable, Disable Alerts

Mutliple ways we can manage the create alerts 
1. Expand the options below the dots and select appropriate action.

   :::image type="content" source="media/monitoring-alerting/edit-enable-disable-delete.png" alt-text="Screenshot showing how to select Quotas to navigate to create Alert rule screen":::

   When using the 'Edit' action, users can also add multiple quotas or locations for the same alert rule.

   :::image type="content" source="media/monitoring-alerting/edit-dimension.png" alt-text="Screenshot showing how to select Quotas to navigate to create Alert rule screen":::

2. Go to **Alert Rules**, then click on the specific alert rule you want to change. 

   :::image type="content" source="media/monitoring-alerting/alert-rule-edit.png" alt-text="Screenshot showing how to select Quotas to navigate to create Alert rule screen":::
  

## Respond to Alerts

For the created alerts, an action group can be established to automate quota increases. By utilizing existing action groups, users can invoke the Quota API to automatically increase quotas wherever possible, eliminating the need for manual intervention.

Refer the following link for detailed instructions on how to utilize functions to call the Quota API and request additional quota

Github link to call [Quota API](https://github.com/allison-inman/azure-sdk-for-net/blob/main/sdk/quota/Microsoft.Azure.Management.Quota/tests/ScenarioTests/QuotaTests.cs)

Use `Test_SetQuota()` code to write a Azure functions to set the Quota. 

## Query using Resource Graph Explorer

Using [Azure Resource Graph](https://learn.microsoft.com/en-us/azure/governance/resource-graph/overview), Alerts can be [Managed programatically](https://learn.microsoft.com/en-us/azure/azure-monitor/alerts/alerts-manage-alert-instances#manage-your-alerts-programmatically) where you can query your alerts instances and analyze your alerts to identify patterns and trends. 
For Usages, the **QuotaResources** table in [Azure Resource Graph](https://learn.microsoft.com/en-us/azure/governance/resource-graph/overview) explorer provides **usage and limit/quota data** for a given resource x region x subscription. Customers will be able to query usage and quota data across multiple subscriptions with Azure Resource Graph queries. 

As a **prerequisite**, users must have at least a **Contributor** role for the subscription.

#### Sample Query

1. Query Compute resources current usages, quota/limit, and usage percentage for a subscription(s) x region x VM family

```kusto
QuotaResources
|where type == "microsoft.compute/locations/usages"
|where subscriptionId in~ ("c1a24fcd-16ab-441b-882c-f90560a72600","c1a24fcd-16ab-441b-882c-f90560a72600")
|where location == "eastus2"
| extend json = parse_json(properties)  
|mv-expand propertyJson = json.value limit 400  
| extend usagevCPUs = propertyJson.currentValue, QuotaLimit = propertyJson.['limit'],quotaName = tostring(propertyJson.['name'].localizedValue
| extend usagePercent = toint(usagevCPUs)*100 / toint(QuotaLimit)
| order by ['usagePercent'] desc
```

2. Query to Summarize total vCPUs (On-demand, Low Priority/Spot) per subscription per region

```kusto
QuotaResources
|where type == "microsoft.compute/locations/usages"
|where subscriptionId in~ ("c1a24fcd-16ab-441b-882c-f90560a72600","c1a24fcd-16ab-441b-882c-f90560a72600")
|where location == "eastus2"
| extend json = parse_json(properties)  
|mv-expand propertyJson = json.value limit 400  
| extend usagevCPUs = propertyJson.currentValue, QuotaLimit = propertyJson.['limit'],quotaName = tostring(propertyJson.['name'].localizedValue
| extend usagePercent = toint(usagevCPUs)*100 / toint(QuotaLimit)
| order by ['usagePercent'] desc
```

## Feedback 

User can find Feedback Button on every page. they can leverage this to share  thoughts, questions, or concerns with our team. Additionally, Users can submit a support ticket if they encounter any issues while creating alert rules for quotas.

:::image type="content" source="media/monitoring-alerting/quota-details-create-rule.png" alt-text="Screenshot showing how to select Quotas to navigate to create Alert rule screen":::

## Troubleshoot



## Next steps

- Learn more in [Quota overview](quotas-overview.md).
- about [Azure subscription and service limits, quotas, and constraints](../azure-resource-manager/management/azure-subscription-service-limits.md).
- Learn how to request increases for [VM-family vCPU quotas](per-vm-quota-requests.md), [vCPU quotas by region](regional-quota-requests.md), [spot vCPU quotas](spot-quota.md), and [storage accounts](storage-account-quota-requests.md).
