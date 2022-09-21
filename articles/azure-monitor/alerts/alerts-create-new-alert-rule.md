---
title: Create Azure Monitor alert rules
description: Learn how to create a new alert rule.
author: AbbyMSFT
ms.author: abbyweisberg
ms.topic: conceptual
ms.date: 08/23/2022
ms.reviewer: harelbr
---
# Create a new alert rule

This article shows you how to create an alert rule. Learn more about alerts [here](alerts-overview.md).

You create an alert rule by combining:
 - The resource(s) to be monitored.
 - The signal or telemetry from the resource
 - Conditions

And then defining these elements for the resulting alert actions using:
 - [Alert processing rules](alerts-action-rules.md)
 - [Action groups](./action-groups.md)

## Create a new alert rule in the Azure portal

1. In the [portal](https://portal.azure.com/), select **Monitor**, then **Alerts**.
1. Expand the **+ Create** menu, and select **Alert rule**.

   :::image type="content" source="media/alerts-create-new-alert-rule/alerts-create-new-alert-rule.png" alt-text="Screenshot showing steps to create new alert rule.":::

1. In the **Select a resource** pane, set the scope for your alert rule. You can filter by **subscription**, **resource type**, **resource location**, or do a search.

    The **Available signal types** for your selected resource(s) are at the bottom right of the pane.

    :::image type="content" source="media/alerts-create-new-alert-rule/alerts-select-resource.png" alt-text="Screenshot showing the select resource pane for creating new alert rule.":::

1. Select **Include all future resources** to include any future resources added to the selected scope.
1. Select **Done**.
1. Select **Next: Condition>** at the bottom of the page.
1. In the **Select a signal** pane, filter the list of signals using the **Signal type** and **Monitor service**.
    - **Signal Type**: The [type of alert rule](alerts-overview.md#types-of-alerts) you're creating.
    - **Monitor service**: The service sending the signal. This list is pre-populated based on the type of alert rule you selected.

    This table describes the services available for each type of alert rule:

    |Signal type  |Monitor service  |Description  |
    |---------|---------|---------|
    |Metrics|Platform   |For metric signals, the monitor service is the metric namespace. ‘Platform’ means the metrics are provided by the resource provider, namely 'Azure'.|
    |       |Azure.ApplicationInsights|Customer-reported metrics, sent by the Application Insights SDK. |
    |       |Azure.VM.Windows.GuestMetrics   |VM guest metrics, collected by an extension running on the VM. Can include built-in operating system perf counters, and custom perf counters.        |
    |       |\<your custom namespace\>|A custom metric namespace, containing custom metrics sent with the Azure Monitor Metrics API.         |
    |Log    |Log Analytics|The service that provides the ‘Custom log search’ and ‘Log (saved query)’ signals.         |
    |Activity log|Activity Log – Administrative|The service that provides the ‘Administrative’ activity log events.         |
    |       |Activity Log – Policy|The service that provides the 'Policy' activity log events.         |
    |       |Activity Log – Autoscale|The service that provides the ‘Autoscale’ activity log events.         |
    |       |Activity Log – Security|The service that provides the ‘Security’ activity log events.         |
    |Resource health|Resource health|The service that provides the resource-level health status. |
    |Service health|Service health|The service that provides the subscription-level health status.         |

 
1. Select the **Signal name**, and follow the steps in the tab below that corresponds to the type of alert you're creating.
    ### [Metric alert](#tab/metric)

    1. In the **Configure signal logic** pane, you can preview the results of the selected metric signal. Select values for the following fields.

        |Field |Description |
        |---------|---------|
        |Select time series|Select the time series to include in the results. |
        |Chart period|Select the time span to include in the results. Can be from the last 6 hours to the last week.|

    1. (Optional) Depending on the signal type, you may see the **Split by dimensions** section.

        Dimensions are name-value pairs that contain more data about the metric value. Using dimensions allows you to filter the metrics and monitor specific time-series, instead of monitoring the aggregate of all the dimensional values. Dimensions can be either number or string columns.

        If you select more than one dimension value, each time series that results from the combination will trigger its own alert, and will be charged separately. For example, the transactions metric of a storage account can have an API name dimension that contains the name of the API called by each transaction (for example, GetBlob, DeleteBlob, PutPage). You can choose to have an alert fired when there's a high number of transactions in a specific API (the aggregated data), or you can use dimensions to alert only when the number of transactions is high for specific APIs.

        |Field  |Description  |
        |---------|---------|
        |Dimension name|Dimensions can be either number or string columns. Dimensions are used to monitor specific time series and provide context to a fired alert.<br>Splitting on the **Azure Resource ID** column makes the specified resource into the alert target. If detected, the **ResourceID** column is selected automatically and changes the context of the fired alert to the record's resource.  |
        |Operator|The operator used on the dimension name and value.  |
        |Dimension values|The dimension values are based on data from the last 48 hours. Select **Add custom value** to add custom dimension values.  |
        |Include all future values| Select this field to include any future values added to the selected dimension.  |

    1. In the **Alert logic** section:

        |Field |Description |
        |---------|---------|
        |Threshold|Select if threshold should be evaluated based on a static value or a dynamic value.<br>A static threshold evaluates the rule using the threshold value that you configure.<br>Dynamic Thresholds use machine learning algorithms to continuously learn the metric behavior patterns and calculate the appropriate thresholds for unexpected behavior. You can learn more about using [dynamic thresholds for metric alerts](alerts-types.md#dynamic-thresholds). |
        |Operator|Select the operator for comparing the metric value against the threshold. |
        |Aggregation type|Select the aggregation function to apply on the data points: Sum, Count, Average, Min, or Max. |
        |Threshold value|If you selected a **static** threshold, enter the threshold value for the condition logic. |
        |Unit|If the selected metric signal supports different units,such as bytes, KB, MB, and GB, and if you selected a **static** threshold, enter the unit for the condition logic.|
        |Threshold sensitivity| If you selected a **dynamic** threshold, enter the sensitivity level. The sensitivity level affects the amount of deviation from the metric series pattern is required to trigger an alert. |
        |Aggregation granularity| Select the interval over which data points are grouped using the aggregation type function.|
        |Frequency of evaluation|Select the frequency on how often the alert rule should be run. Selecting frequency smaller than granularity of data points grouping will result in sliding window evaluation.  |

    1. Select **Done**.
    ### [Log alert](#tab/log)

    > [!NOTE]
    > If you are creating a new log alert rule, note that current alert rule wizard is a little different from the earlier experience. For detailed information about the changes, see [changes to log alert rule creation experience](#changes-to-log-alert-rule-creation-experience). 
    
    1. In the **Logs** pane, write a query that will return the log events for which you want to create an alert. 
        To use one of the predefined alert rule queries, expand the **Schema and filter pane** on the left of the **Logs** pane, then select the **Queries** tab, and select one of the queries. 

        :::image type="content" source="media/alerts-create-new-alert-rule/alerts-log-rule-query-pane.png" alt-text="Screenshot of the query pane when creating a new log alert rule.":::    

    1. Select **Run** to run the alert.
    1. The **Preview** section shows you the query results. When you're finished editing your query, select **Continue Editing Alert**.
    1. The **Condition** tab opens populated with your log query. By default, the rule counts the number of results in the last 5 minutes. If the system detects summarized query results, the rule is automatically updated with that information.

        :::image type="content" source="media/alerts-create-new-alert-rule/alerts-logs-conditions-tab.png" alt-text="Screenshot of the conditions tab when creating a new log alert rule.":::

    1. In the **Measurement** section, select values for these fields:

        |Field  |Description  |
        |---------|---------|
        |Measure|Log alerts can measure two different things, which can be used for different monitoring scenarios:<br> **Table rows**: The number of rows returned can be used to work with events such as Windows event logs, syslog, application exceptions. <br>**Calculation of a numeric column**: Calculations based on any numeric column can be used to include any number of resources. For example, CPU percentage.      |
        |Aggregation type| The calculation performed on multiple records to aggregate them to one numeric value using the aggregation granularity. For example: Total, Average, Minimum, or Maximum.    |
        |Aggregation granularity| The interval for aggregating multiple records to one numeric value.|

        :::image type="content" source="media/alerts-create-new-alert-rule/alerts-log-measurements.png" alt-text="Screenshot of the measurements tab when creating a new log alert rule.":::

    1. (Optional) In the **Split by dimensions** section, you can use dimensions to monitor the values of multiple instances of a resource with one rule. Splitting by dimensions allows you to create resource-centric alerts at scale for a subscription or resource group. When you split by dimensions, alerts are split into separate alerts by grouping combinations of numerical or string columns to monitor for the same condition on multiple Azure resources. For example, you can monitor CPU usage on multiple instances running your website or app. Each instance is monitored individually notifications are sent for each instance.

        Splitting on **Azure Resource ID** column makes specified resource the target of the alert.

        If you select more than one dimension value, each time series that results from the combination triggers its own alert and is charged separately. The alert payload includes the combination that triggered the alert.

        You can select up to six more splittings for any columns that contain text or numbers.

        You can also decide **not** to split when you want a condition applied to multiple resources in the scope. For example, if you want to fire an alert if at least five machines in the resource group scope have CPU usage over 80%.

        Select values for these fields:

        |Field  |Description  |
        |---------|---------|
        |Resource ID column|Splitting on the **Azure Resource ID** column makes the specified resource the target of the alert. If detected, the **ResourceID** column is selected automatically and changes the context of the fired alert to the record's resource. |
        |Dimension name|Dimensions can be either number or string columns. Dimensions are used to monitor specific time series and provide context to a fired alert.|
        |Operator|The operator used on the dimension name and value.  |
        |Dimension values|The dimension values are based on data from the last 48 hours. Select **Add custom value** to add custom dimension values.  |
        |Include all future values| Select this field to include any future values added to the selected dimension.  |

        :::image type="content" source="media/alerts-create-new-alert-rule/alerts-create-log-rule-dimensions.png" alt-text="Screenshot of the splitting by dimensions section of a new log alert rule.":::

    1. In the **Alert logic** section, select values for these fields:

        |Field  |Description  |
        |---------|---------|
        |Operator| The query results are transformed into a number. In this field, select the operator to use to compare the number against the threshold.|
        |Threshold value| A number value for the threshold. |
        |Frequency of evaluation|The interval in which the query is run. Can be set from a minute to a day. |

        :::image type="content" source="media/alerts-create-new-alert-rule/alerts-create-log-rule-logic.png" alt-text="Screenshot of alert logic section of a new log alert rule.":::

    1. (Optional) In the **Advanced options** section, you can specify the number of failures and the alert evaluation period required to trigger an alert. For example, if you set the **Aggregation granularity** to 5 minutes, you can specify that you only want to trigger an alert if there were three failures (15 minutes) in the last hour. This setting is defined by your application business policy.

        Select values for these fields under **Number of violations to trigger the alert**:

        |Field  |Description  |
        |---------|---------|
        |Number of violations|The number of violations that trigger the alert.|
        |Evaluation period|The time period within which the number of violations occur. |
        |Override query time range| If you want the alert evaluation period to be different than the query time range, enter a time range here.<br> The alert time range is limited to a maximum of two days. Even if the query contains an **ago** command with a time range of longer than 2 days, the 2 day maximum time range is applied. For example, even if the query text contains **ago(7d)**, the query only scans up to 2 days of data.<br> If the query requires more data than the alert evaluation, and there's no **ago** command in the query, you can change the time range manually.|

        :::image type="content" source="media/alerts-create-new-alert-rule/alerts-rule-preview-advanced-options.png" alt-text="Screenshot of the advanced options section of a new log alert rule.":::

        > [!NOTE]
        > If you, or your administrator assigned the Azure Policy **Azure Log Search Alerts over Log Analytics workspaces should use customer-managed keys**, you must select **Check workspace linked storage**, or the rule creation will fail because it won't meet the policy requirements.

    1. The **Preview** chart shows query evaluations results over time. You can change the chart period or select different time series that resulted from unique alert splitting by dimensions.

        :::image type="content" source="media/alerts-create-new-alert-rule/alerts-create-alert-rule-preview.png" alt-text="Screenshot of a preview of a new alert rule.":::

    ### [Activity log alert](#tab/activity-log)

    1. In the **Conditions** pane, select the **Chart period**.
    1. The **Preview** chart shows you the results of your selection.
    1. In the **Alert logic** section:

        |Field |Description |
        |---------|---------|
        |Event level| Select the level of the events that this alert rule monitors. Values are: **Critical**, **Error**, **Warning**, **Informational**, **Verbose** and **All**.|
        |Status|Select the status levels for which the alert is evaluated.|
        |Event initiated by|Select the user or service principal that initiated the event.|

    ---

    From this point on, you can select the **Review + create** button at any time.

1. In the **Actions** tab, select or create the required [action groups](./action-groups.md).
1. (Optional) If you want to make sure that the data processing for the action group takes place within a specific region, you can select an action group in one of these regions in which to process the action group:
    - Sweden Central
    - Germany West Central

    > [!NOTE]
    > We are continually adding more regions for regional data processing.

    :::image type="content" source="media/alerts-create-new-alert-rule/alerts-rule-actions-tab.png" alt-text="Screenshot of the actions tab when creating a new alert rule.":::

1. In the **Details** tab, define the **Project details**.
    - Select the **Subscription**.
    - Select the **Resource group**.
    - (Optional) If you're creating a metric alert rule that monitors a custom metric with the scope defined as one of the regions below, and you want to make sure that the data processing for the alert rule takes place within that region, you can select to process the alert rule in one of these regions: 
        - North Europe
        - West Europe
        - Sweden Central
        - Germany West Central 
  
    > [!NOTE]
    > We are continually adding more regions for regional data processing.
1. Define the **Alert rule details**.

    ### [Metric alert](#tab/metric)

    1. Select the **Severity**.
    1. Enter values for the **Alert rule name** and the **Alert rule description**.
    1. Select the **Region**.
    1. (Optional) In the **Advanced options** section, you can set several options.

        |Field |Description |
        |---------|---------|
        |Enable upon creation| Select for the alert rule to start running as soon as you're done creating it.|
        |Automatically resolve alerts (preview) |Select to make the alert stateful. The alert is resolved when the condition isn't met anymore.|
    1. (Optional) If you have configured action groups for this alert rule, you can add custom properties to the alert payload to add additional information to the payload. In the **Custom properties** section, add the property **Name** and **Value** for the custom property you want included in the payload.
         

        :::image type="content" source="media/alerts-create-new-alert-rule/alerts-metric-rule-details-tab.png" alt-text="Screenshot of the details tab when creating a new alert rule.":::

    ### [Log alert](#tab/log)

    1. Select the **Severity**.
    1. Enter values for the **Alert rule name** and the **Alert rule description**.
    1. Select the **Region**.
    1. (Optional) In the **Advanced options** section, you can set several options.

        |Field |Description |
        |---------|---------|
        |Enable upon creation| Select for the alert rule to start running as soon as you're done creating it.|
        |Automatically resolve alerts (preview) |Select to make the alert stateful. The alert is resolved when the condition isn't met anymore.|
        |Mute actions |Select to set a period of time to wait before alert actions are triggered again. If you select this checkbox, the **Mute actions for** field appears to select the amount of time to wait after an alert is fired before triggering actions again.|
        |Check workspace linked storage|Select if logs workspace linked storage for alerts is configured. If no linked storage is configured, the rule isn't created.|

    1. (Optional) If you have configured action groups for this alert rule, you can add custom properties to the alert payload to add additional information to the payload. In the **Custom properties** section, add the property **Name** and **Value** for the custom property you want included in the payload.

        :::image type="content" source="media/alerts-create-new-alert-rule/alerts-log-rule-details-tab.png" alt-text="Screenshot of the details tab when creating a new log alert rule.":::

    ### [Activity log alert](#tab/activity-log)

    1. Enter values for the **Alert rule name** and the **Alert rule description**.
    1. Select the **Region**.
    1. (Optional) In the **Advanced options** section, select **Enable upon creation** for the alert rule to start running as soon as you're done creating it.
    1. (Optional) If you have configured action groups for this alert rule, you can add custom properties to the alert payload to add additional information to the payload. In the **Custom properties** section, add the property **Name** and **Value** for the custom property you want included in the payload.

        :::image type="content" source="media/alerts-create-new-alert-rule/alerts-activity-log-rule-details-tab.png" alt-text="Screenshot of the actions tab when creating a new activity log alert rule.":::

    ---

1. In the **Tags** tab, set any required tags on the alert rule resource.

    :::image type="content" source="media/alerts-create-new-alert-rule/alerts-rule-tags-tab.png" alt-text="Screenshot of the Tags tab when creating a new alert rule.":::

1. In the **Review + create** tab, a validation will run and inform you of any issues.
1. When validation passes and you've reviewed the settings, select the **Create** button.

    :::image type="content" source="media/alerts-create-new-alert-rule/alerts-rule-review-create.png" alt-text="Screenshot of the Review and create tab when creating a new alert rule.":::


## Create a new alert rule using CLI

You can create a new alert rule using the [Azure CLI](/cli/azure/get-started-with-azure-cli). The code examples below are using [Azure Cloud Shell](../../cloud-shell/overview.md). You can see the full list of the [Azure CLI commands for Azure Monitor](/cli/azure/azure-cli-reference-for-monitor#azure-monitor-references).

1. In the [portal](https://portal.azure.com/), select **Cloud Shell**, and at the prompt, use the following commands:
    ### [Metric alert](#tab/metric)

    To create a metric alert rule, use the **az monitor metrics alert create** command. You can see detailed documentation on the metric alert rule create command in the **az monitor metrics alert create** section of the [CLI reference documentation for metric alerts](/cli/azure/monitor/metrics/alert).

    To create a metric alert rule that monitors if average Percentage CPU on a VM is greater than 90:
    ```azurecli
     az monitor metrics alert create -n {nameofthealert} -g {ResourceGroup} --scopes {VirtualMachineResourceID} --condition "avg Percentage CPU > 90" --description {descriptionofthealert}
    ```
    ### [Log alert](#tab/log)

    To create a log alert rule that monitors count of system event errors:
    ```azurecli
    az monitor scheduled-query create -g {ResourceGroup} -n {nameofthealert} --scopes {vm_id} --condition "count \'union Event, Syslog | where TimeGenerated > a(1h) | where EventLevelName == \"Error\" or SeverityLevel== \"err\"\' > 2" --description {descriptionofthealert}
    ```

    > [!NOTE]
    > Azure CLI support is only available for the scheduledQueryRules API version `2021-08-01` and later. Previous API versions can use the Azure Resource Manager CLI with templates as described below. If you use the legacy [Log Analytics Alert API](./api-alerts.md), you will need to switch to use CLI. [Learn more about switching](./alerts-log-api-switch.md).

    ### [Activity log alert](#tab/activity-log)

    To create an activity log alert rule, use the **az monitor activity-log alert create** command. You can see detailed documentation on the metric alert rule create command in the **az monitor activity-log alert create** section of the [CLI reference documentation for activity log alerts](/cli/azure/monitor/activity-log/alert).

    To create a new activity log alert rule, use the following commands:
     - [az monitor activity-log alert create](/cli/azure/monitor/activity-log/alert#az-monitor-activity-log-alert-create): Create a new activity log alert rule resource.
     - [az monitor activity-log alert scope](/cli/azure/monitor/activity-log/alert/scope): Add scope for the created activity log alert rule.
     - [az monitor activity-log alert action-group](/cli/azure/monitor/activity-log/alert/action-group): Add an action group to the activity log alert rule.

    ---

## Create a new alert rule using PowerShell

- To create a metric alert rule using PowerShell, use this cmdlet: [Add-AzMetricAlertRuleV2](/powershell/module/az.monitor/add-azmetricalertrulev2)
- To create an  activity log alert rule using PowerShell, use this cmdlet: [Set-AzActivityLogAlert](/powershell/module/az.monitor/set-azactivitylogalert)

## Create an activity log alert rule from the Activity log pane

You can also create an activity log alert on future events similar to an activity log event that already occurred. 

1. In the [portal](https://portal.azure.com/), [go to the activity log pane](../essentials/activity-log.md#view-the-activity-log). 
1. Filter or find the desired event, and then create an alert  by selecting **Add activity log alert**. 

    :::image type="content" source="media/alerts-create-new-alert-rule/create-alert-rule-from-activity-log-event-new.png" alt-text="Screenshot of creating an alert rule from an activity log event." lightbox="media/alerts-create-new-alert-rule/create-alert-rule-from-activity-log-event-new.png":::

2. The **Create alert rule** wizard opens, with the scope and condition already provided according to the previously selected activity log event. If necessary, you can edit and modify the scope and condition at this stage. By default, the exact scope and condition for the new rule are copied from the original event attributes. For example, the exact resource on which the event occurred, and the specific user or service name who initiated the event, are both included by default in the new alert rule. If you want to make the alert rule more general, modify the scope, and condition accordingly (see steps 3-9 in the section "Create an alert rule from the Azure Monitor alerts pane"). 

3. Follow the rest of the steps from [Create a new alert rule in the Azure portal](#create-a-new-alert-rule-in-the-azure-portal).

## Create an activity log alert rule using an Azure Resource Manager template

To create an activity log alert rule using an Azure Resource Manager template, create a `microsoft.insights/activityLogAlerts` resource, and fill in all related properties. 

> [!NOTE]
>The highest level that activity log alerts can be defined is the subscription level. Define the alert to alert per subscription. You can't define an alert on two subscriptions. 

The following fields are the options in the Azure Resource Manager template for the conditions fields. (The **Resource Health**, **Advisor** and **Service Health** fields have extra properties fields.) 


|Field  |Description  |
|---------|---------|
|resourceId|The resource ID of the impacted resource in the activity log event on which the alert is generated.|
|category|The category of the activity log event. Possible values: `Administrative`, `ServiceHealth`, `ResourceHealth`, `Autoscale`, `Security`, `Recommendation`, or `Policy`         |
|caller|The email address or Azure Active Directory identifier of the user who performed the operation of the activity log event.        |
|level     |Level of the activity in the activity log event for the alert. Possible values: `Critical`, `Error`, `Warning`, `Informational`, or `Verbose`.|
|operationName     |The name of the operation in the activity log event. Possible values: `Microsoft.Resources/deployments/write`.        |
|resourceGroup     |Name of the resource group for the impacted resource in the activity log event.        |
|resourceProvider     |For more information, see [Azure resource providers and types](../../azure-resource-manager/management/resource-providers-and-types.md). For a list that maps resource providers to Azure services, see [Resource providers for Azure services](../../azure-resource-manager/management/resource-providers-and-types.md).         |
|status     |String describing the status of the operation in the activity event. Possible values: `Started`, `In Progress`, `Succeeded`, `Failed`, `Active`, or `Resolved`         |
|subStatus     |Usually, this field is the HTTP status code of the corresponding REST call. This field can also include other strings describing a substatus. Examples of HTTP status codes include `OK` (HTTP Status Code: 200), `No Content` (HTTP Status Code: 204), and `Service Unavailable` (HTTP Status Code: 503), among many others.         |
|resourceType     |The type of the resource that was affected by the event. For example: `Microsoft.Resources/deployments`.         |

This example sets the condition to the **Administrative** category:

```json
"condition": {
          "allOf": [
            {
              "field": "category",
              "equals": "Administrative"
            },
            {
              "field": "resourceType",
              "equals": "Microsoft.Resources/deployments"
            }
          ]
        }

```

This is an example template that creates an activity log alert rule using the **Administrative** condition: 

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "activityLogAlertName": {
      "type": "string",
      "metadata": {
        "description": "Unique name (within the Resource Group) for the Activity log alert."
      }
    },
    "activityLogAlertEnabled": {
      "type": "bool",
      "defaultValue": true,
      "metadata": {
        "description": "Indicates whether or not the alert is enabled."
      }
    },
    "actionGroupResourceId": {
      "type": "string",
      "metadata": {
        "description": "Resource Id for the Action group."
      }
    }
  },
  "resources": [   
    {
      "type": "Microsoft.Insights/activityLogAlerts",
      "apiVersion": "2017-04-01",
      "name": "[parameters('activityLogAlertName')]",      
      "location": "Global",
      "properties": {
        "enabled": "[parameters('activityLogAlertEnabled')]",
        "scopes": [
            "[subscription().id]"
        ],        
        "condition": {
          "allOf": [
            {
              "field": "category",
              "equals": "Administrative"
            },
            {
              "field": "operationName",
              "equals": "Microsoft.Resources/deployments/write"
            },
            {
              "field": "resourceType",
              "equals": "Microsoft.Resources/deployments"
            }
          ]
        },
        "actions": {
          "actionGroups":
          [
            {
              "actionGroupId": "[parameters('actionGroupResourceId')]"
            }
          ]
        }
      }
    }
  ]
}
```
This sample JSON can be saved as, for example, *sampleActivityLogAlert.json*. You can deploy the sample by using [Azure Resource Manager in the Azure portal](../../azure-resource-manager/templates/deploy-portal.md).

For more information about the activity log fields, see [Azure activity log event schema](../essentials/activity-log-schema.md).

> [!NOTE]
> It might take up to 5 minutes for the new activity log alert rule to become active.

## Create a new activity log alert rule using the REST API 

The Azure Monitor Activity Log Alerts API is a REST API. It's fully compatible with the Azure Resource Manager REST API. You can use it with PowerShell, by using the Resource Manager cmdlet or the Azure CLI.

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

### Deploy the Resource Manager template with PowerShell

To use PowerShell to deploy the sample Resource Manager template shown in the [previous section](#create-an-activity-log-alert-rule-using-an-azure-resource-manager-template) section, use the following command:

```powershell
New-AzResourceGroupDeployment -ResourceGroupName "myRG" -TemplateFile sampleActivityLogAlert.json -TemplateParameterFile sampleActivityLogAlert.parameters.json
```
The *sampleActivityLogAlert.parameters.json* file contains the values provided for the parameters needed for alert rule creation.

## Changes to log alert rule creation experience

If you're creating a new log alert rule, please note that current alert rule wizard is a little different from the earlier experience:

- Previously, search results were included in the payload of the triggered alert and its associated notifications. The email included only 10 rows from the unfiltered results while the webhook payload contained 1000 unfiltered results. To get detailed context information about the alert so that you can decide on the appropriate action:
    - We recommend using [Dimensions](alerts-types.md#narrow-the-target-using-dimensions). Dimensions provide the column value that fired the alert, giving you context for why the alert fired and how to fix the issue.
    - When you need to investigate in the logs, use the link in the alert to the search results in Logs.
    - If you need the raw search results or for any other advanced customizations, use Logic Apps.
- The new alert rule wizard doesn't support customization of the JSON payload.
    - Use custom properties in the [new API](/rest/api/monitor/scheduledqueryrule-2021-08-01/scheduled-query-rules/create-or-update#actions) to add static parameters and associated values to the webhook actions triggered by the alert.
    - For more advanced customizations, use Logic Apps.
- The new alert rule wizard doesn't support customization of the email subject.
    - Customers often use the custom email subject to indicate the resource on which the alert fired, instead of using the Log Analytics workspace. Use the [new API](alerts-unified-log.md#split-by-alert-dimensions) to trigger an alert of the desired resource using the resource ID column.
    - For more advanced customizations, use Logic Apps.

## Next steps
 - [View and manage your alert instances](alerts-manage-alert-instances.md)