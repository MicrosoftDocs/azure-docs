---
title: Monitoring and alerting - how to guide
description: Learn how to create alerts for quotas
ms.date: 10/11/2023
ms.topic: how-to
---

# Monitoring & Alerting: How-To Guide

## Create an alert rule 

#### Prerequisite 

| Requirement | Description |
|:--------|:-----------|
| Access to Create Alerts | Users who are creating Alert should have [Access to Create Alert](../azure-monitor/alerts/alerts-overview.md#azure-role-based-access-control-for-alerts) |
| [Managed Identity](../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md?pivots=identity-mi-methods-azp) | When utilizing an existing Managed Identity, ensure it has **Subscription Reader** access for accessing usage data. In cases where a new Managed Identity is generated, the Subscription **Owner** is responsible for **granting** Subscription **Reader** access to this newly created Managed Identity. |


### Create Alerts from Portal

Step-by-Step instructions to create an alert rule for your quota in the Azure portal. 

1.	Sign in to the [Azure portal](https://portal.azure.com) and enter **"quotas"** in the search box, then select **Quotas**. In Quotas page, Click **My quotas** and choose **Compute** Resource Provider. Upon page load, you can choose `Quota Name` for creating new alert rule.

    :::image type="content" source="media/monitoring-alerting/my-quotas-create-rule-navigation-inline.png" alt-text="Screenshot showing how to select Quotas to navigate to create Alert rule screen." lightbox="media/monitoring-alerting/my-quotas-create-rule-navigation-expanded.png":::

2.	When the Create usage alert rule page appears, **populate the fields** with data as shown in the table.  Make sure you have the **right access** to the subscriptions and Quotas to **create alerts**. 

    :::image type="content" source="media/monitoring-alerting/quota-details-create-rule-inline.png" alt-text="Screenshot showing create Alert rule screen with required fields." lightbox="media/monitoring-alerting/quota-details-create-rule-expanded.png":::

    | **Fields** | **Description** |
    |:--------|:-----------|
    | Alert Rule Name | Alert rule name must be **distinct** and can't be duplicated, even across different resource groups |
    | Alert me when the usage % reaches | **Adjust** the slider to select your desired usage percentage for **triggering** alerts. For example, at the default 80%, you receive an alert when your quota reaches 80% capacity.|
    | Severity | Select the **severity** of the alert when the **rule’s condition** is met.|
    | [Frequency of evaluation](../azure-monitor/alerts/alerts-overview.md#stateful-alerts) | Choose how **often** the alert rule should **run**, by selecting 5, 10, or 15 minutes.  If the frequency is smaller than the aggregation granularity, frequency of evaluation results in sliding window evaluation. |
    | [Resource Group](../azure-resource-manager/management/manage-resource-groups-portal.md) | Resource Group is a collection of resources that share the same lifecycles, permissions, and policies. Select a resource group similar to other quotas in your subscription, or create a new resource group. |
    | [Log Analytics workspace](../azure-monitor/logs/quick-create-workspace.md?tabs=azure-portal) | A workspace within the subscription that is being **monitored** and is used as the **scope for rule execution**. Select from the dropdown or create a new workspace. If you create a new workspace, use it for all alerts in your subscription. |
    | [Managed identity](../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md?pivots=identity-mi-methods-azp) | Select from the dropdown, or **Create New**. Managed Identity should have **read permissions** to the Subscription (to read Usage data from ARG) and Log Analytics workspace that is chosen(to read the log alerts). |
    | Notify me by | There are three notifications methods and you can check one or all three check boxes, depending on your notification preference. |
    | [Use an existing action group](../azure-monitor/alerts/action-groups.md) | Check the box to use an existing action group. An action group **invokes** a defined set of **notifications** and actions when an alert is triggered. You can create Action Group to automatically Increase the Quota whenever possible. |
    | [Dimensions](../azure-monitor/alerts/alerts-types.md#dimensions-in-log-alert-rules) | Here are the options for selecting **multiple Quotas** and **regions** within a single alert rule. Adding dimensions is a cost-effective approach compared to creating a new alert for each quota or region.|
    | [Estimated cost](https://azure.microsoft.com/pricing/details/monitor/) |Estimated cost is automatically calculated cost associated with running this **new alert rule** against your quota. Each alert creation costs $0.50 USD, and each additional dimension adds $0.05 USD to the cost. |
    
    > [!TIP]
    > We advise using the **same Resource Group, Log Analytics Workspace,** and **Managed Identity** data that were  initially employed when creating your first alert rule for quotas within the same subscription.

3. After completing entering the fields, click the **Create Alert** button 

   - If **Successful**, you receive the following notification: 'We successfully created 'alert rule name' and 'Action Group 'name' was successfully created.'

   - If the **Alert fails**, you receive an 'Alert rule failed to create' notification. Ensure that you verify the necessary access **permissions** given for the Log Analytics or Managed Identity. Refer to the prerequisites."


### Create Alerts using API

Alerts can be created programmatically using existing [**Monitoring API**]
(https://learn.microsoft.com/rest/api/monitor/scheduledqueryrule-2018-04-16/scheduled-query-rules/create-or-update?tabs=HTTP). 

Monitoring API helps to **create or update log search rule**. 

`PUT https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.Insights/scheduledQueryRules/{ruleName}?api-version=2018-04-16`

#### Sample Request body

```json
{
    "location": "westus2",
    "identity": {
        "type": "UserAssigned",
        "userAssignedIdentities": {
            "/subscriptions/<SubscriptionId>/resourcegroups/<ResourceGroupName>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<ManagedIdentityName>": {}
        }
    },
    "properties": {
        "severity": 4,
        "enabled": true,
        "evaluationFrequency": "PT15M",
        "scopes": ["/subscriptions/<SubscriptionID>/resourcegroups/<rg>/providers/microsoft.operationalinsights/workspaces/<LogAnalyticsWorkspace>"],
        "windowSize": "PT15M",
        "criteria": {
            "allOf": [{
                "query": "arg(\"\").QuotaResources \n| where subscriptionId =~ '<SubscriptionId'\n| where type =~ 'microsoft.compute/locations/usages'\n| where isnotempty(properties)\n| mv-expand propertyJson = properties.value limit 400\n| extend\n    usage = propertyJson.currentValue,\n    quota = propertyJson.['limit'],\n    quotaName = tostring(propertyJson.['name'].value)\n| extend usagePercent = toint(usage)*100 / toint(quota)| project-away properties| where location in~ ('westus2')| where quotaName in~ ('cores')",
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
            "actionGroups": ["/subscriptions/<SubscriptionId>/resourcegroups/argintrg/providers/microsoft.insights/actiongroups/<ActionGroupName>"]
        }
    }
}
```


### Create Alerts using ARG Query

Use existing **Azure Monitor Alerts** blade to [create alerts using query](../azure-monitor/alerts/alerts-create-new-alert-rule.md?tabs=log). **Resource Graph Explorer** allows you to run and test queries before using them to create an alert. To learn on how to create Alerts using Alerts page visit this [Tutorial](/training/modules/configure-azure-alerts/?source=recommendations).

For Quota alerts, make sure Scope is selected as the Log analytics workspace that is created and the signal type is Customer Query log. Add **Sample Query** for Quota usages. Follow the remaining steps as mentioned in the [create alerts](../azure-monitor/alerts/alerts-create-new-alert-rule.md?tabs=log). 

>[!Note]
>Our **recommendation** for creating alerts in the Portal is to use the **Quota Alerts page**, as it offers the simplest and most user-friendly approach. 

#### Sample Query to create Alerts
```kusto
arg("").QuotaResources 
| where subscriptionId =~ '<SubscriptionId>'
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

Select **Quotas** | **Alert Rules** to see all the rules create for a given subscription. Here, you have the option to edit, enable, or disable them as needed.

  :::image type="content" source="media/monitoring-alerting/view-alert-rules-inline.png" alt-text="Screenshot showing how to navigate to Alert rule screen." lightbox="media/monitoring-alerting/view-alert-rules-expanded.png":::

### View Fired Alerts

Select **Quotas** | **Fired Alert Rules** to see all the alerts that have been fired create for a given subscription. This page displays an overview of all the alert rules that have been triggered. You can click on each alert to view its details, including the history of how many times it was triggered and the status of each occurrence.

  :::image type="content" source="media/monitoring-alerting/view-fired-alerts-inline.png" alt-text="Screenshot showing how to navigate to Fired Alert screen." lightbox="media/monitoring-alerting/view-fired-alerts-expanded.png":::

### Edit, Update, Enable, Disable Alerts

Multiple ways we can manage the create alerts 
1. Expand the options below the dots and select appropriate action.

   :::image type="content" source="media/monitoring-alerting/edit-enable-disable-delete-inline.png" alt-text="Screenshot showing how to edit , enable, disable or delete alert rules." lightbox="media/monitoring-alerting/edit-enable-disable-delete-expanded.png":::

   By using the 'Edit' action, users can also add multiple quotas or locations for the same alert rule.

   :::image type="content" source="media/monitoring-alerting/edit-dimension-inline.png" alt-text="Screenshot showing how to add dimensions while editing a quota rule." lightbox="media/monitoring-alerting/edit-dimension-expanded.png":::

2. Go to **Alert Rules**, then click on the specific alert rule you want to change. 

   :::image type="content" source="media/monitoring-alerting/alert-rule-edit-inline.png" alt-text="Screenshot showing how to edit rules from Alert Rule screen." lightbox="media/monitoring-alerting/alert-rule-edit-expanded.png":::
  

## Respond to Alerts

For the created alerts, an action group can be established to automate quota increases. By utilizing existing action groups, users can invoke the Quota API to automatically increase quotas wherever possible, eliminating the need for manual intervention.

Refer the following link for detailed instructions on how to utilize functions to call the Quota API and request for more quota

GitHub link to call [Quota API](https://github.com/allison-inman/azure-sdk-for-net/blob/main/sdk/quota/Microsoft.Azure.Management.Quota/tests/ScenarioTests/QuotaTests.cs)

Use `Test_SetQuota()` code to write an Azure function to set the Quota. 

## Query using Resource Graph Explorer

Using [Azure Resource Graph](../governance/resource-graph/overview.md), Alerts can be [Managed programatically](../azure-monitor/alerts/alerts-manage-alert-instances.md#manage-your-alerts-programmatically) where you can query your alerts instances and analyze your alerts to identify patterns and trends. 
For Usages, the **QuotaResources** table in [Azure Resource Graph](../governance/resource-graph/overview.md) explorer provides **usage and limit/quota data** for a given resource x region x subscription. Customers can query usage and quota data across multiple subscriptions with Azure Resource Graph queries. 

As a **prerequisite**, users must have at least a **Subscription Reader** role for the subscription.

#### Sample Query

1. Query Compute resources current usages, quota/limit, and usage percentage for a subscription(s) x region x VM family

```kusto
QuotaResources
| where type =~ "microsoft.compute/locations/usages"
| where location =~ "northeurope" or location =~ "westeurope"
| where subscriptionId in~ ("<Subscription1>","<Subscription2>")   
| mv-expand json = properties.value limit 400 
| extend usagevCPUs = json.currentValue, QuotaLimit = json['limit'], quotaName = tostring(json['name'].localizedValue)
|where usagevCPUs > 0
|extend usagePercent = toint(usagevCPUs)*100 / toint(QuotaLimit)
|project subscriptionId,quotaName,usagevCPUs,QuotaLimit,usagePercent,location,json
| order by ['usagePercent'] desc
```

2. Query to Summarize total vCPUs (On-demand, Low Priority/Spot) per subscription per region

```kusto
QuotaResources
| where type =~ "microsoft.compute/locations/usages"
| where subscriptionId in~ ("<Subscription1>","<Subscription2>") 
| mv-expand json = properties.value limit 400 
| extend usagevCPUs = json.currentValue, QuotaLimit = json['limit'], quotaName = tostring(json['name'].localizedValue)
|extend usagePercent = toint(usagevCPUs)*100 / toint(QuotaLimit)
|where quotaName =~ "Total Regional vCPUs" or quotaName =~ "Total Regional Low-priority vCPUs"
|project subscriptionId,quotaName,usagevCPUs,QuotaLimit,usagePercent,location,['json']
| order by ['usagePercent'] desc
```

## Provide Feedback 

User can find **Feedback** button on every Quota page and can use to share thoughts, questions, or concerns with our team. Additionally, Users can submit a support ticket if they encounter any problem while creating alert rules for quotas.

:::image type="content" source="media/monitoring-alerting/alert-feedback-inline.png" alt-text="Screenshot showing user can provide feedback." lightbox="media/monitoring-alerting/alert-feedback-expanded.png":::


## Next steps  

- Learn about [Monitoring and Alerting](monitoring-alerting.md)
- Learn more about [Quota overview](quotas-overview.md) and [Azure subscription and service limits, quotas, and constraints](../azure-resource-manager/management/azure-subscription-service-limits.md).
- Learn how to request increases for [VM-family vCPU quotas](per-vm-quota-requests.md), [vCPU quotas by region](regional-quota-requests.md), [spot vCPU quotas](spot-quota.md), and [storage accounts](storage-account-quota-requests.md).
