---
title: Monitor the health of log search alert rules
description: This article how to monitor the health of a log search alert rule.
ms.topic: how-to
author: AbbyMSFT
ms.author: abbyweisberg
ms.reviewer: nolavime
ms.date: 02/08/2024

#Customer-intent: As a alerts administrator, I want to know when there are  issues with an alert rule, so I can act to resolve the issue or know when to contact Microsoft for support.
---

# Monitor the health of log search alert rules

[Azure Service Health](../../service-health/overview.md) monitors the health of your cloud resources, including log search alert rules. When a log search alert rule is healthy, the rule runs and the query executes successfully. This article explains how to view the health status of your log search alert rule, and tells you what to do if there are issues affecting your log search alert rules.

Azure Service Health monitors:
- [Resource health](../../service-health/resource-health-overview.md): information about the health of your individual cloud resources, such as a specific log search alert rule. 
- [Service health](../../service-health/service-health-overview.md): information about the health of the Azure services and regions you're using, which might affect your log search alert rule, including communications about outages, planned maintenance activities, and other health advisories.

 > [!NOTE]
> Today, the report health status is supported only for rules with a frequency of 15 minutes or lower. For rules that run at a frequency greater than 15 minutes (such as 30 minutes, 1 hour, etc.), the status in the resource health blade will be ‘Unavailable’.

## Permissions required

- To view the health of a log search alert rule, you need `read` permissions to the log search alert rule. 
- To set up health status alerts, you need `write` permissions to the log search alert rule, as provided by the [Monitoring Contributor built-in role](../roles-permissions-security.md#monitoring-contributor), for example.

## View health and set up health status alerts for log search alert rules

To view the health of your log search alert rule and set up health status alerts:

1. In the [portal](https://portal.azure.com/), select **Monitor**, then **Alerts**.
1. From the top command bar, select **Alert rules**. The page shows all your alert rules on all subscriptions.
1. Select the log search alert rule that you want to monitor.
1. From the left pane, under **Help**, select **Resource health**.
 
    :::image type="content" source="media/log-search-alert-health/log-search-alert-resource-health.png" alt-text="Screenshot of the Resource health section in a log search alert rule.":::

1. The **Resource health** screen shows:

    - **Health history**: Indicates whether Azure Service Health detected query execution issues in the specific log search alert rule. Select the health event to view details about the event.
    - **Azure service issues**: Displayed when a known issue with an Azure service might affect execution of the log search alert query. Select the message to view details about the service issue in Azure Service Health.

        > [!NOTE]
        > - Service health notifications do not indicate that your log search alert rule is necessarily affected by the known service issue. If your log search alert rule health status is **Available**, Azure Service Health did not detect issues in your alert rule.
 
    :::image type="content" source="media/log-search-alert-health/log-search-alert-resource-health-page.png" alt-text="Screenshot of the Resource health page for a log search alert rule.":::

This table describes the possible resource health status values for a log search alert rule:

| Resource health status | Description |Recommended steps|
|---|---|
|Available|There are no known issues affecting this log search alert rule.|     |
|Unknown|This log search alert rule is currently disabled or in an unknown state.|Check if this log alert rule has been disabled - Reasons why [Log alert was disabled](alerts-troubleshoot-log.md). 
If your rule runs less frequently than every 15 minutes (30 minutes, 1 hour, etc.), it won’t provide health status updates. Therefore, be aware that an ‘unavailable’ status is to be expected and is not indicative of an issue.
If you would like to get health status the frequency should be 15 min or less.|
|Unknown reason|This log search alert rule is currently unavailable due to an unknown reason.|Check if the alert rule was recently created. Health status is updated after the rule completes its first evaluation.|
|Degraded due to unknown reason|This log search alert rule is currently degraded due to an unknown reason.|     |
|Setting up resource health|Setting up Resource health for this resource.|Check if the alert rule was recently created. Health status is updated after the rule completes its first evaluation.|
|Semantic error |The query is failing because of a semantic error. |Review the query and try again.|
|Syntax error |The query is failing because of a syntax error.| Review the query and try again.|
|The response size is too large|The query is failing because its response size is too large.|Review your query and the [log queries limits](../service-limits.md#log-queries-and-language).|
|Query consuming too many resources |The query is failing because it's consuming too many resources.|Review your query. View our [best practices for optimizing log queries](../logs/query-optimization.md).|
|Query validation error|The query is failing because of a validation error. |Check if the table referenced in your query is set to [Compare the Basic and Analytics log data plans](../logs/basic-logs-configure.md#compare-the-basic-and-analytics-log-data-plans), which doesn't support alerts. |
|Workspace not found |The target Log Analytics workspace for this alert rule couldn't be found. |The target specified in the scope of the alert rule was moved, renamed, or deleted. Recreate your alert rule with a valid Log Analytics workspace target.|
|Application Insights resource not found|The target Application Insights resource for this alert rule couldn't be found.     |The target specified in the scope of the alert rule was moved, renamed, or deleted. Recreate your alert rule with a valid Log Analytics workspace target.    |
|Query is throttled|The query is failing for the rule because of throttling (Error 429).     |Review your query and the [log queries limits](../service-limits.md#user-query-throttling).    |
|Unauthorized to run query |The query is failing because the query doesn't have the correct permissions. | Permissions are based on the permissions of the last user that edited the rule. If you suspect that the query doesn't have access, any user with the required permissions can edit or update the rule. Once the rule is saved, the new permissions take effect.</br>If you're using managed identities, check that the identity has permissions on the target resource. See [managed identities](alerts-create-log-alert-rule.md#managed-id).|
|NSP validation failed |The query is failing because of NSP validations issues.| Review your network security perimeter rules to ensure your alert rule is correctly configured.|
|Active alerts limit exceeded |Alert evaluation failed due to exceeding the limit of fired (non- resolved) alerts per day.     |See [Azure Monitor service limits](../service-limits.md).   |
|Dimension combinations limit exceeded | Alert evaluation failed due to exceeding the allowed limit of dimension combinations values meeting the threshold.|See [Azure Monitor service limits](../service-limits.md).     |
|Unavailable for unknown reason | Today, the report health status is supported only for rules with a frequency of 15 minutes or lower.| For using Resource Health the fequency should be 5 minutes or lower. |


## Add a new resource health alert

1. Select **Add resource health alert**.
        
1. The **Create alert rule** wizard opens, with the **Scope** and **Condition** panes prepopulated. If necessary, you can edit and modify the scope and condition of the alert rule at this stage.

1. Follow the rest of the steps in [Create or edit an activity log, service health, or resource health alert rule](../alerts/alerts-create-activity-log-alert-rule.md). 

## Next steps

Learn more about:
- [Querying log data in Azure Monitor Logs](../logs/get-started-queries.md).
- [Create or edit a log alert rule](alerts-create-log-alert-rule.md)

