---
title: Create Azure Monitor metric alert rules
description: This article shows you how to create a new metric alert rule.
author: AbbyMSFT
ms.author: abbyweisberg
ms.topic: how-to
ms.date: 11/27/2023
ms.reviewer: harelbr
---
# Create or edit an alert rule

This article shows you how to create a new alert rule or edit an existing alert rule. To learn more about alerts, see the [alerts overview](alerts-overview.md).

You create an alert rule by combining:
 - The resources to be monitored.
 - The signal or data from the resource.
 - Conditions.

You then define these elements for the alert actions:
 - [Action groups](./action-groups.md)
 - [Alert processing rules](alerts-action-rules.md)

Alerts triggered by these alert rules contain a payload that uses the [common alert schema](alerts-common-schema.md).

## Create or edit an alert rule in the Azure portal

You can create a new alert rule from the [Azure portal](https://portal.azure.com/) home page or from a specific resource. You can also edit an existing alert rule.
To create a new alert rule from the portal home page:

1. In the [portal](https://portal.azure.com/), select **Monitor** > **Alerts**.
1. Open the **+ Create** menu, and select **Alert rule**.

    :::image type="content" source="media/alerts-create-new-alert-rule/alerts-create-new-alert-rule.png" alt-text="Screenshot that shows steps to create a new alert rule.":::

To create a new alert rule from a specific resource:

1. In the [portal](https://portal.azure.com/), navigate to the resource.
1. Select **Alerts** from the left pane, and then select **+ Create** > **Alert rule**.

     :::image type="content" source="media/alerts-create-new-alert-rule/alerts-create-new-alert-rule-2.png" alt-text="Screenshot that shows steps to create a new alert rule from a selected resource.":::

To edit an existing alert rule:
1. In the [portal](https://portal.azure.com/), either from the home page or from a specific resource, select **Alerts** from the left pane.
1. Select **Alert rules**.
1. Select the alert rule you want to edit, and then select **Edit**.

    :::image type="content" source="media/alerts-create-new-alert-rule/alerts-edit-alert-rule.png" alt-text="Screenshot that shows steps to edit an existing alert rule.":::
1. Select any of the tabs for the alert rule to edit the settings.

### Set the alert rule scope

1. On the **Select a resource** pane, set the scope for your alert rule. You can filter by **subscription**, **resource type**, or **resource location**.
1. Select **Apply**.
1. Select **Next: Condition** at the bottom of the page.

    :::image type="content" source="media/alerts-create-new-alert-rule/alerts-select-resource.png" alt-text="Screenshot that shows the select resource pane for creating a new alert rule.":::
### Set the alert rule conditions 

1. On the **Condition** tab, when you select the **Signal name** field, the most commonly used signals are displayed in the drop-down list. Select one of these popular signals, or select **See all signals** if you want to choose a different signal for the condition.

    :::image type="content" source="media/alerts-create-new-alert-rule/alerts-popular-signals.png" alt-text="Screenshot that shows popular signals when creating an alert rule.":::

1. (Optional) If you chose to **See all signals** in the previous step, use the **Select a signal** pane to search for the signal name or filter the list of signals. Filter by:
    - **Signal type**: The [type of alert rule](alerts-overview.md#types-of-alerts) you're creating.
    - **Signal source**: The service sending the signal. The list is prepopulated based on the type of alert rule you selected.

    This table describes the services available for each type of alert rule:

    |Signal type  |Signal source  |Description  |
    |---------|---------|---------|
    |Metrics|Platform   |For metric signals, the monitor service is the metric namespace. "Platform" means the metrics are provided by the resource provider, namely, Azure.|
    |       |Azure.ApplicationInsights|Customer-reported metrics, sent by the Application Insights SDK. |
    |       |Azure.VM.Windows.GuestMetrics   |VM guest metrics, collected by an extension running on the VM. Can include built-in operating system perf counters and custom perf counters.        |
    |       |\<your custom namespace\>|A custom metric namespace, containing custom metrics sent with the Azure Monitor Metrics API.         |
    |Log    |Log Analytics|The service that provides the "Custom log search" and "Log (saved query)" signals.         |
    |Activity log|Activity log – Administrative|The service that provides the Administrative activity log events.         |
    |       |Activity log – Policy|The service that provides the Policy activity log events.         |
    |       |Activity log – Autoscale|The service that provides the Autoscale activity log events.         |
    |       |Activity log – Security|The service that provides the Security activity log events.         |
    |Resource health|Resource health|The service that provides the resource-level health status. |
    |Service health|Service health|The service that provides the subscription-level health status.         |

    Select the **Signal name** and **Apply**.
1.  Preview the results of the selected metric signal in the **Preview** section. Select values for the following fields.

        |Field|Description|
        |---------|---------|
        |Time range|The time range to include in the results. Can be from the last six hours to the last week.|
        |Time series|The time series to include in the results.|

    1. In the **Alert logic** section:

        |Field |Description |
        |---------|---------|
        |Threshold|Select if the threshold should be evaluated based on a static value or a dynamic value.<br>A **static threshold** evaluates the rule by using the threshold value that you configure.<br>**Dynamic thresholds** use machine learning algorithms to continuously learn the metric behavior patterns and calculate the appropriate thresholds for unexpected behavior. You can learn more about using [dynamic thresholds for metric alerts](alerts-types.md#dynamic-thresholds). |
        |Operator|Select the operator for comparing the metric value against the threshold. <br>If you're using dynamic thresholds, alert rules can use tailored thresholds based on metric behavior for both upper and lower bounds in the same alert rule. Select one of these operators: <br> - Greater than the upper threshold or lower than the lower threshold (default) <br> - Greater than the upper threshold <br> - Lower than the lower threshold|
        |Aggregation type|Select the aggregation function to apply on the data points: Sum, Count, Average, Min, or Max.|
        |Threshold value|If you selected a **static** threshold, enter the threshold value for the condition logic.|
        |Unit|If the selected metric signal supports different units, such as bytes, KB, MB, and GB, and if you selected a **static** threshold, enter the unit for the condition logic.|
        |Threshold sensitivity|If you selected a **dynamic** threshold, enter the sensitivity level. The sensitivity level affects the amount of deviation from the metric series pattern that's required to trigger an alert. <br> - **High**: Thresholds are tight and close to the metric series pattern. An alert rule is triggered on the smallest deviation, resulting in more alerts. <br> - **Medium**: Thresholds are less tight and more balanced. There are fewer alerts than with high sensitivity (default). <br> - **Low**: Thresholds are loose, allowing greater deviation from the metric series pattern. Alert rules are only triggered on large deviations, resulting in fewer alerts.|
        |Aggregation granularity| Select the interval that's used to group the data points by using the aggregation type function. Choose an **Aggregation granularity** (period) that's greater than the **Frequency of evaluation** to reduce the likelihood of missing the first evaluation period of an added time series.|
        |Frequency of evaluation|Select how often the alert rule is to be run. Select a frequency that's smaller than the aggregation granularity to generate a sliding window for the evaluation.|
 
    1. (Optional) Depending on the signal type, you might see the **Split by dimensions** section.

        Dimensions are name-value pairs that contain more data about the metric value. By using dimensions, you can filter the metrics and monitor specific time-series, instead of monitoring the aggregate of all the dimensional values.

        If you select more than one dimension value, each time series that results from the combination triggers its own alert and is charged separately. For example, the transactions metric of a storage account can have an API name dimension that contains the name of the API called by each transaction (for example, GetBlob, DeleteBlob, and PutPage). You can choose to have an alert fired when there's a high number of transactions in a specific API (the aggregated data). Or you can use dimensions to alert only when the number of transactions is high for specific APIs.

        |Field  |Description  |
        |---------|---------|
        |Dimension name|Dimensions can be either number or string columns. Dimensions are used to monitor specific time series and provide context to a fired alert.<br>Splitting on the **Azure Resource ID** column makes the specified resource into the alert target. If detected, the **ResourceID** column is selected automatically and changes the context of the fired alert to the record's resource.|
        |Operator|The operator used on the dimension name and value.|
        |Dimension values|The dimension values are based on data from the last 48 hours. Select **Add custom value** to add custom dimension values.|
        |Include all future values| Select this field to include any future values added to the selected dimension.|

    1. (Optional) In the **When to evaluate** section: 

        |Field |Description |
        |---------|---------|
        |Check every|Select how often the alert rule checks if the condition is met.    |
        |Lookback period|Select how far back to look each time the data is checked. For example, every 1 minute, look back 5 minutes.|

    1. (Optional) In the **Advanced options** section, you can specify how many failures within a specific time period trigger an alert. For example, you can specify that you only want to trigger an alert if there were three failures in the last hour. Your application business policy should determine this setting. 

        Select values for these fields:

        |Field  |Description  |
        |---------|---------|
        |Number of violations|The number of violations within the configured time frame that trigger the alert.|
        |Evaluation period|The time period within which the number of violations occur.|
        |Ignore data before|Use this setting to select the date from which to start using the metric historical data for calculating the dynamic thresholds. For example, if a resource was running in testing mode and is moved to production, you may want to disregard the metric behavior while the resource was in testing.|

    1. Select **Done**. From this point on, you can select the **Review + create** button at any time.

### Set the alert rule actions

1. On the **Actions** tab, select or create the required [action groups](./action-groups.md).

    :::image type="content" source="media/alerts-create-new-alert-rule/alerts-rule-actions-tab.png" alt-text="Screenshot that shows the Actions tab when creating a new alert rule.":::

### Set the alert rule details

1. On the **Details** tab, define the **Project details**.
    - Select the **Subscription**.
    - Select the **Resource group**.

1. Define the **Alert rule details**.

    #### [Metric alert](#tab/metric)

    :::image type="content" source="media/alerts-create-new-alert-rule/alerts-metric-rule-details-tab.png" alt-text="Screenshot that shows the Details tab when creating a new alert rule.":::

    1. Select the **Severity**.
    1. Enter values for the **Alert rule name** and the **Alert rule description**.
    1. (Optional) If you're creating a metric alert rule that monitors a custom metric with the scope defined as one of the following regions and you want to make sure that the data processing for the alert rule takes place within that region, you can select to process the alert rule in one of these regions:
        - North Europe
        - West Europe
        - Sweden Central
        - Germany West Central 
  
        We're continually adding more regions for regional data processing.

    1. (Optional) In the **Advanced options** section, you can set several options.

        |Field |Description |
        |---------|---------|
        |Enable upon creation| Select for the alert rule to start running as soon as you're done creating it.|
        |Automatically resolve alerts (preview) |Select to make the alert stateful. When an alert is stateful, the alert is resolved when the condition is no longer met.<br> If you don't select this checkbox, metric alerts are stateless. Stateless alerts fire each time the condition is met, even if alert already fired.<br> The frequency of notifications for stateless metric alerts differs based on the alert rule's configured frequency:<br>**Alert frequency of less than 5 minutes**: While the condition continues to be met, a notification is sent somewhere between one and six minutes.<br>**Alert frequency of more than 5 minutes**: While the condition continues to be met, a notification is sent between the configured frequency and doubles the value of the frequency. For example, for an alert rule with a frequency of 15 minutes, a notification is sent somewhere between 15 to 30 minutes.|

    #### [Log alert](#tab/log)

    :::image type="content" source="media/alerts-create-new-alert-rule/alerts-log-rule-details-tab.png" alt-text="Screenshot that shows the Details tab when creating a new log alert rule.":::

    1. Select the **Severity**.
    1. Enter values for the **Alert rule name** and the **Alert rule description**.
    1. Select the **Region**.
    1. <a name="managed-id"></a>In the **Identity** section, select which identity is used by the log alert rule to send the log query. This identity is used for authentication when the alert rule executes the log query.

        Keep these things in mind when selecting an identity:
        - A managed identity is required if you're sending a query to Azure Data Explorer.
        - Use a managed identity if you want to be able to see or edit the permissions associated with the alert rule.
        - If you don't use a managed identity, the alert rule permissions are based on the permissions of the last user to edit the rule, at the time the rule was last edited.
        - Use a managed identity to help you avoid a case where the rule doesn't work as expected because the user that last edited the rule didn't have permissions for all the resources added to the scope of the rule.

        The identity associated with the rule must have these roles:
        - If the query is accessing a Log Analytics workspace, the identity must be assigned a **Reader role** for all workspaces accessed by the query. If you're creating resource-centric log alerts, the alert rule may access multiple workspaces, and the identity must have a reader role on all of them.
        - If you are querying an ADX or ARG cluster you must add **Reader role** for all data sources accessed by the query. For example, if the query is resource centric, it needs a reader role on that resources. 
        - If the query is [accessing a remote Azure Data Explorer cluster](../logs/azure-monitor-data-explorer-proxy.md), the identity must be assigned:
            - **Reader role** for all data sources accessed by the query. For example, if the query is calling a remote Azure Data Explorer cluster using the adx() function, it needs a reader role on that ADX cluster.
            - **Database viewer** for all databases the query is accessing.

        For detailed information on managed identities, see [managed identities for Azure resources](../../active-directory/managed-identities-azure-resources/overview.md).

        Select one of the following options for the identity used by the alert rule:

        |Identity  |Description  |
        |---------|---------|
        |None|Alert rule permissions are based on the permissions of the last user who edited the rule, at the time the rule was edited.|
        |System assigned managed identity| Azure creates a new, dedicated identity for this alert rule. This identity has no permissions and is automatically deleted when the rule is deleted. After creating the rule, you must assign permissions to this identity to access the workspace and data sources needed for the query. For more information about assigning permissions, see [Assign Azure roles using the Azure portal](../../role-based-access-control/role-assignments-portal.md). |
        |User assigned managed identity|Before you create the alert rule, you [create an identity](../../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md#create-a-user-assigned-managed-identity) and assign it appropriate permissions for the log query. This is a regular Azure identity. You can use one identity in multiple alert rules. The identity isn't deleted when the rule is deleted. When you select this type of identity, a pane opens for you to select the associated identity for the rule. |

    1. (Optional) In the **Advanced options** section, you can set several options:

        |Field |Description |
        |---------|---------|
        |Enable upon creation| Select for the alert rule to start running as soon as you're done creating it.|
        |Automatically resolve alerts (preview) |Select to make the alert stateful. When an alert is stateful, the alert is resolved when the condition is no longer met for a specific time range. The time range differs based on the frequency of the alert:<br>**1 minute**: The alert condition isn't met for 10 minutes.<br>**5-15 minutes**: The alert condition isn't met for three frequency periods.<br>**15 minutes - 11 hours**: The alert condition isn't met for two frequency periods.<br>**11 to 12 hours**: The alert condition isn't met for one frequency period.|
        |Mute actions |Select to set a period of time to wait before alert actions are triggered again. If you select this checkbox, the **Mute actions for** field appears to select the amount of time to wait after an alert is fired before triggering actions again.|
        |Check workspace linked storage|Select if logs workspace linked storage for alerts is configured. If no linked storage is configured, the rule isn't created.|

    #### [Activity log alert](#tab/activity-log)

    :::image type="content" source="media/alerts-create-new-alert-rule/alerts-activity-log-rule-details-tab.png" alt-text="Screenshot that shows the Actions tab when creating a new activity log alert rule.":::

    1. Enter values for the **Alert rule name** and the **Alert rule description**.
    1. Select **Enable upon creation** for the alert rule to start running as soon as you're done creating it.

    #### [Resource Health alert](#tab/resource-health)

   :::image type="content" source="media/alerts-create-new-alert-rule/alerts-activity-log-rule-details-tab.png" alt-text="Screenshot that shows the Actions tab when creating a new activity log alert rule.":::

    1. Enter values for the **Alert rule name** and the **Alert rule description**.
    1. Select **Enable upon creation** for the alert rule to start running as soon as you're done creating it.
    #### [Service Health alert](#tab/service-health)

    :::image type="content" source="media/alerts-create-new-alert-rule/alerts-activity-log-rule-details-tab.png" alt-text="Screenshot that shows the Actions tab when creating a new activity log alert rule.":::
    
    1. Enter values for the **Alert rule name** and the **Alert rule description**.
    1. Select **Enable upon creation** for the alert rule to start running as soon as you're done creating it.
    ---

1. <a name="custom-props"></a>(Optional)  In the **Custom properties** section, if you've configured action groups for this alert rule, you can add your own properties to include in the alert notification payload. You can use these properties in the actions called by the action group, such as webhook, Azure function or logic app actions.

    The custom properties are specified as key:value pairs, using either static text, a dynamic value extracted from the alert payload, or a combination of both.

    The format for extracting a dynamic value from the alert payload is: `${<path to schema field>}`. For example: ${data.essentials.monitorCondition}.

    Use the [common alert schema](alerts-common-schema.md) format to specify the field in the payload, whether or not the action groups configured for the alert rule use the common schema.

    :::image type="content" source="media/alerts-create-new-alert-rule/alerts-rule-custom-props.png" alt-text="Screenshot that shows the custom properties section of creating a new alert rule.":::

    In the following examples, values in the **custom properties** are used to utilize data from a payload that uses the common alert schema:

    **Example 1**

    This example creates an "Additional Details" tag with data regarding the "window start time" and "window end time".

    - **Name:** "Additional Details"
    - **Value:** "Evaluation windowStartTime: \${data.alertContext.condition.windowStartTime}. windowEndTime: \${data.alertContext.condition.windowEndTime}"
    - **Result:** "AdditionalDetails:Evaluation windowStartTime: 2023-04-04T14:39:24.492Z. windowEndTime: 2023-04-04T14:44:24.492Z"


    **Example 2**
    This example adds the data regarding the reason of resolving or firing the alert. 

    - **Name:** "Alert \${data.essentials.monitorCondition} reason"
    - **Value:** "\${data.alertContext.condition.allOf[0].metricName} \${data.alertContext.condition.allOf[0].operator} \${data.alertContext.condition.allOf[0].threshold} \${data.essentials.monitorCondition}. The value is \${data.alertContext.condition.allOf[0].metricValue}"
    - **Result:**  Example results could be something like:
        - "Alert Resolved reason: Percentage CPU GreaterThan5 Resolved. The value is 3.585"
        - “Alert Fired reason": "Percentage CPU GreaterThan5 Fired. The value is 10.585"

    > [!NOTE]
    > The [common schema](alerts-common-schema.md) overwrites custom configurations. Therefore, you can't use both custom properties and the common schema for log alerts.
   

### Finish creating the alert rule

1. On the **Tags** tab, set any required tags on the alert rule resource.

    :::image type="content" source="media/alerts-create-new-alert-rule/alerts-rule-tags-tab.png" alt-text="Screenshot that shows the Tags tab when creating a new alert rule.":::

1. On the **Review + create** tab, the rule is validated, and lets you know about any issues.
1. When validation passes and you've reviewed the settings, select the **Create** button.

    :::image type="content" source="media/alerts-create-new-alert-rule/alerts-rule-review-create.png" alt-text="Screenshot that shows the Review and create tab when creating a new alert rule.":::

## Create a new alert rule using the CLI

You can create a new alert rule using the [Azure CLI](/cli/azure/get-started-with-azure-cli). The following code examples use [Azure Cloud Shell](../../cloud-shell/overview.md). You can see the full list of the [Azure CLI commands for Azure Monitor](/cli/azure/azure-cli-reference-for-monitor#azure-monitor-references).

1. In the [portal](https://portal.azure.com/), select **Cloud Shell**. At the prompt, use the commands that follow.

    #### [Metric alert](#tab/metric)

    To create a metric alert rule, use the `az monitor metrics alert create` command. You can see detailed documentation on the metric alert rule create command in the `az monitor metrics alert create` section of the [CLI reference documentation for metric alerts](/cli/azure/monitor/metrics/alert).

    To create a metric alert rule that monitors if average Percentage CPU on a VM is greater than 90:
    ```azurecli
     az monitor metrics alert create -n {nameofthealert} -g {ResourceGroup} --scopes {VirtualMachineResourceID} --condition "avg Percentage CPU > 90" --description {descriptionofthealert}
    ```
    #### [Log alert](#tab/log)

    Azure CLI support is only available for the `scheduledQueryRules` API version `2021-08-01` and later. Previous API versions can use the Azure Resource Manager CLI with templates. If you use the legacy [Log Analytics Alert API](./api-alerts.md), switch to use the CLI. [Learn more about switching](./alerts-log-api-switch.md).

    To create a log alert rule that monitors the count of system event errors:

    ```azurecli
    az monitor scheduled-query create -g {ResourceGroup} -n {nameofthealert} --scopes {vm_id} --condition "count \'union Event, Syslog | where TimeGenerated > a(1h) | where EventLevelName == \"Error\" or SeverityLevel== \"err\"\' > 2" --description {descriptionofthealert}
    ```

    #### [Activity log alert](#tab/activity-log)

    To create a new activity log alert rule, use the following commands:
     - [az monitor activity-log alert create](/cli/azure/monitor/activity-log/alert#az-monitor-activity-log-alert-create): Create a new activity log alert rule resource.
     - [az monitor activity-log alert scope](/cli/azure/monitor/activity-log/alert/scope): Add scope for the created activity log alert rule.
     - [az monitor activity-log alert action-group](/cli/azure/monitor/activity-log/alert/action-group): Add an action group to the activity log alert rule.

    You can find detailed documentation on the activity log alert rule create command in the `az monitor activity-log alert create` section of the [CLI reference documentation for activity log alerts](/cli/azure/monitor/activity-log/alert).

    #### [Resource Health alert](#tab/resource-health)
 
    To create a new activity log alert rule, use the following commands by using the `Resource Health` category:
     - [az monitor activity-log alert create](/cli/azure/monitor/activity-log/alert#az-monitor-activity-log-alert-create): Create a new activity log alert rule resource.
     - [az monitor activity-log alert scope](/cli/azure/monitor/activity-log/alert/scope): Add scope for the created activity log alert rule.
     - [az monitor activity-log alert action-group](/cli/azure/monitor/activity-log/alert/action-group): Add an action group to the activity log alert rule.
    
    You can find detailed documentation on the alert rule create command in the `az monitor activity-log alert create` section of the [CLI reference documentation for activity log alerts](/cli/azure/monitor/activity-log/alert).

   #### [Service Health alert](#tab/service-health)

    To create a new activity log alert rule, use the following commands by using the `Service Health` category:
     - [az monitor activity-log alert create](/cli/azure/monitor/activity-log/alert#az-monitor-activity-log-alert-create): Create a new activity log alert rule resource.
     - [az monitor activity-log alert scope](/cli/azure/monitor/activity-log/alert/scope): Add scope for the created activity log alert rule.
     - [az monitor activity-log alert action-group](/cli/azure/monitor/activity-log/alert/action-group): Add an action group to the activity log alert rule.

    You can find detailed documentation on the alert rule create command in the `az monitor activity-log alert create` section of the [CLI reference documentation for activity log alerts](/cli/azure/monitor/activity-log/alert).

   ---

## Create a new alert rule with PowerShell

- To create a metric alert rule using PowerShell, use the [Add-AzMetricAlertRuleV2](/powershell/module/az.monitor/add-azmetricalertrulev2) cmdlet.
- To create a log alert rule using PowerShell, use the [New-AzScheduledQueryRule](/powershell/module/az.monitor/new-azscheduledqueryrule) cmdlet.
- To create an activity log alert rule using PowerShell, use the [Set-AzActivityLogAlert](/powershell/module/az.monitor/set-azactivitylogalert) cmdlet.

## Create a new alert rule using an ARM template

You can use an [Azure Resource Manager template (ARM template)](../../azure-resource-manager/templates/syntax.md) to configure alert rules consistently in all of your environments.

1. Create a new resource, using the following resource types:
    - For metric alerts: `Microsoft.Insights/metricAlerts`
    - For log alerts: `Microsoft.Insights/scheduledQueryRules`
    - For activity log, service health, and resource health alerts: `microsoft.Insights/activityLogAlerts`
    > [!NOTE]
    > - Metric alerts for an Azure Log Analytics workspace resource type (`Microsoft.OperationalInsights/workspaces`) are configured differently than other metric alerts. For more information, see [Resource Template for Metric Alerts for Logs](alerts-metric-logs.md#resource-template-for-metric-alerts-for-logs).
    > - We recommend that you create the metric alert using the same resource group as your target resource.
1. Copy one of the templates from these sample ARM templates.
    - For metric alerts: [Resource Manager template samples for metric alert rules](resource-manager-alerts-metric.md)
    - For log alerts: [Resource Manager template samples for log alert rules](resource-manager-alerts-log.md)
    - For activity log alerts: [Resource Manager template samples for activity log alert rules](resource-manager-alerts-activity-log.md)
    - For resource health alerts: [Resource Manager template samples for resource health alert rules](resource-manager-alerts-resource-health.md)
1. Edit the template file to contain appropriate information for your alert, and save the file as \<your-alert-template-file\>.json.
1. Edit the corresponding parameters file to customize the alert, and save as \<your-alert-template-file\>.parameters.json.
1. Set the `metricName` parameter, using one of the values in [Azure Monitor supported metrics](../essentials/metrics-supported.md).
1. Deploy the template using [PowerShell](../../azure-resource-manager/templates/deploy-powershell.md#deploy-local-template) or the [CLI](../../azure-resource-manager/templates/deploy-cli.md#deploy-local-template).

### Additional properties for activity log alert ARM templates
> [!NOTE]
> - Activity log alerts are defined at the subscription level. You can't define a single alert rule on more than one subscription.
> - It may take up to five minutes for a new activity log alert rule to become active.

ARM templates for activity log alerts contain additional properties for the conditions fields. The **Resource Health**, **Advisor** and **Service Health** fields have extra properties fields.

|Field  |Description  |
|---------|---------|
|resourceId|The resource ID of the affected resource in the activity log event on which the alert is generated.|
|category|The category of the activity log event. Possible values are `Administrative`, `ServiceHealth`, `ResourceHealth`, `Autoscale`, `Security`, `Recommendation`, or `Policy`.        |
|caller|The email address or Microsoft Entra identifier of the user who performed the operation of the activity log event.        |
|level     |Level of the activity in the activity log event for the alert. Possible values are `Critical`, `Error`, `Warning`, `Informational`, or `Verbose`.|
|operationName     |The name of the operation in the activity log event. Possible values are `Microsoft.Resources/deployments/write`.        |
|resourceGroup     |Name of the resource group for the affected resource in the activity log event.        |
|resourceProvider     |For more information, see [Azure resource providers and types](../../azure-resource-manager/management/resource-providers-and-types.md). For a list that maps resource providers to Azure services, see [Resource providers for Azure services](../../azure-resource-manager/management/resource-providers-and-types.md).         |
|status     |String describing the status of the operation in the activity event. Possible values are `Started`, `In Progress`, `Succeeded`, `Failed`, `Active`, or `Resolved`.         |
|subStatus     |Usually, this field is the HTTP status code of the corresponding REST call. This field can also include other strings describing a substatus. Examples of HTTP status codes include `OK` (HTTP Status Code: 200), `No Content` (HTTP Status Code: 204), and `Service Unavailable` (HTTP Status Code: 503), among many others.         |
|resourceType     |The type of the resource affected by the event. An example is `Microsoft.Resources/deployments`.         |

For more information about the activity log fields, see [Azure activity log event schema](../essentials/activity-log-schema.md).

## Create an activity log alert rule from the Activity log pane

You can also create an activity log alert on future events similar to an activity log event that already occurred.

1. In the [portal](https://portal.azure.com/), [go to the Activity log pane](../essentials/activity-log.md#view-the-activity-log).
1. Filter or find the desired event. Then create an alert by selecting **Add activity log alert**.

    :::image type="content" source="media/alerts-create-new-alert-rule/create-alert-rule-from-activity-log-event-new.png" alt-text="Screenshot that shows creating an alert rule from an activity log event." lightbox="media/alerts-create-new-alert-rule/create-alert-rule-from-activity-log-event-new.png":::

1. The **Create alert rule** wizard opens, with the scope and condition already provided according to the previously selected activity log event. If necessary, you can edit and modify the scope and condition at this stage. By default, the exact scope and condition for the new rule are copied from the original event attributes. For example, the exact resource on which the event occurred, and the specific user or service name that initiated the event, are both included by default in the new alert rule.

   If you want to make the alert rule more general, modify the scope and condition accordingly. See steps 3-9 in the section "Create a new alert rule in the Azure portal."

1. Follow the rest of the steps from [Create a new alert rule in the Azure portal](#create-or-edit-an-alert-rule-in-the-azure-portal).

## Next steps
 [View and manage your alert instances](alerts-manage-alert-instances.md)
