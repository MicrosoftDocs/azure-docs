---
title: Monitor Log Analytics workspace health
description: This article how to monitor the health of a Log Analytics workspace and set up alerts about latency issues specific to the Log Analytics workspace or related to known Azure service issues.
ms.topic: how-to
author: guywi-ms
ms.author: guywild
ms.reviewer: MeirMen
ms.date: 11/23/2023

#Customer-intent: As a Log Analytics workspace administrator, I want to know when there are latency issues in a Log Analytics workspace, so I can act to resolve the issue, contact Microsoft for support, or track that is Azure is meeting its SLA.  
---

# Monitor Log Analytics workspace health

[Azure Service Health](../../service-health/overview.md) monitors the health of your cloud resources, including Log Analytics workspaces. When a Log Analytics workspace is healthy, data you collect from resources in your IT environment is available for querying and analysis in a relatively short period of time, known as [latency](../logs/data-ingestion-time.md). This article explains how to view the health status of your Log Analytics workspace, set up workspace health status alerts, and view workspace health metrics.  

Azure Service Health monitors:

- [Resource health](../../service-health/resource-health-overview.md): information about the health of your individual cloud resources, such as a specific Log Analytics workspace. 
- [Service health](../../service-health/service-health-overview.md): information about the health of the Azure services and regions you're using, which might affect your Log Analytics workspace, including communications about outages, planned maintenance activities, and other health advisories.

## Permissions required

- To view Log Analytics workspace health, you need `*/read` permissions to the Log Analytics workspace, as provided by the [Log Analytics Reader built-in role](./manage-access.md#log-analytics-reader), for example.
- To set up health status alerts, you need `Microsoft.Insights/ActivityLogAlerts/Write` permissions to the Log Analytics workspace, as provided by the [Monitoring Contributor built-in role](../roles-permissions-security.md#monitoring-contributor), for example.

## View Log Analytics workspace health and set up health status alerts 


To view your Log Analytics workspace health and set up health status alerts:
 
1. Select **Resource health** from the Log Analytics workspace menu.

    The **Resource health** screen shows:

    - **Health history**: Indicates whether Azure Service Health has detected latency or query execution issues in the specific Log Analytics workspace. To further investigate latency issues related to your workspace, see [Investigate latency](#investigate-log-analytics-workspace-health-issues).  
    - **Azure service issues**: Displayed when a known issue with an Azure service might affect latency in the Log Analytics workspace. Select the message to view details about the service issue in Azure Service Health.
   
    > [!NOTE]
    > - Service health notifications do not indicate that your Log Analytics workspace is necessarily affected by the know service issue. If your Log Analytics workspace resource health status is **Available**, Azure Service Health did not detect issues in your workspace.
    > - Resource Health excludes data types for which long ingestion latency is expected. For example, Application Insights data types that calculate the application map data and are known to add latency.

   
    :::image type="content" source="media/data-ingestion-time/log-analytics-workspace-latency.png" lightbox="media/data-ingestion-time/log-analytics-workspace-latency.png" alt-text="Screenshot that shows the Resource health screen for a Log Analytics workspace.":::  

    This table describes the possible resource health status values for a Log Analytics workspace:

    | Resource health status | Description |
    |-|-|
    |Available| [Average latency](../logs/data-ingestion-time.md#average-latency) and no query execution issues detected.|
    |Unavailable|Higher than average latency detected.|    
    |Degraded|Query failures detected.|
    |Unknown|Currently unable to determine Log Analytics workspace health because you haven't run queries or ingested data to this workspace recently.|
    
1. To set up health status alerts, you can either [enable recommended out-of-the-box alert](../alerts/alerts-overview.md#recommended-alert-rules) rules, or manually create new alert rules.
    - To enable the recommended alert rules:
        1. Select **Alerts** > **Enable recommended alert rules**. 
        
            The **Enable recommended alert rules** pane opens with a list of recommended alert rules for your Log Analytics workspace.  
        
            :::image type="content" source="media/data-ingestion-time/log-analytics-workspace-recommended-alerts.png" alt-text="Screenshot of recommended alert rules pane.":::

        1. In the **Alert me if** section, select all of the rules you want to enable. 
        1. In the **Notify me by** section, select the way you want to be notified if an alert is triggered.
        1. Select **Use an existing action group**, and enter the details of the existing action group if you want to use an action group that already exists.
        1. Select **Enable**.

    - To create a new alert rule:
       1. Select **Add resource health alert**.
        
            The **Create alert rule** wizard opens, with the **Scope** and **Condition** panes prepopulated. By default, the rule triggers alerts all status changes in all Log Analytics workspaces in the subscription. If necessary, you can edit and modify the scope and condition at this stage. 
    
            :::image type="content" source="media/data-ingestion-time/log-analytics-workspace-latency-alert-rule.png" lightbox="media/data-ingestion-time/log-analytics-workspace-latency-alert-rule.png" alt-text="Screenshot that shows the Create alert rule wizard for Log Analytics workspace latency issues.":::

       1. Follow the rest of the steps in [Create a new alert rule in the Azure portal](../alerts/alerts-create-new-alert-rule.md#create-or-edit-an-alert-rule-in-the-azure-portal). 

## View Log Analytics workspace health metrics

Azure Monitor exposes a set of metrics that provide insight into Log Analytics workspace health. 

To view Log Analytics workspace health metrics:

1. Select **Metrics** from the Log Analytics workspace menu. This opens [Metrics Explorer](../essentials/metrics-charts.md) in context of your Log Analytics workspace.
1. In the **Metric** field, select one of the Log Analytics workspace health metrics:

   | Metric name | Description |
   | - | - |
   | Query count | Total number of user queries in the Log Analytics workspace within the selected time range.<br>This number includes only user-initiated queries, and doesn't include queries initiated by Sentinel rules and alert-related queries. |
   | Query failure count | Total number of failed user queries in the Log Analytics workspace within the selected time range.<br>This number includes all queries that return 5XX response codes - except 504 *Gateway Timeout* - which indicate an error related to the application gateway or the backend server.|
   | AvailabilityRate_Query | Percentage of successful user queries in the Log Analytics workspace within the selected time range.<br>This number includes all queries that return 2XX, 4XX, and 504 response codes; in other words, all user queries that don't result in a service error. |

## Investigate Log Analytics workspace health issues

To investigate Log Analytics workspace health issues:

- Use [Log Analytics Workspace Insights](../logs/log-analytics-workspace-insights-overview.md), which provides a unified view of your workspace usage, performance, health, agent, queries, and change log.
- [Query](./queries.md) the data in your Log Analytics workspace to [understand which factors are contributing greater than expected latency in your workspace](../logs/data-ingestion-time.md).  
- [Use the `_LogOperation` function to view and set up alerts about operational issues](../logs/monitor-workspace.md) logged in your Log Analytics workspace.

  

## Next steps

Learn more about:

- [Log Analytics Workspace Insights](../logs/log-analytics-workspace-insights-overview.md).
- [Querying log data in Azure Monitor Logs](../logs/get-started-queries.md).

