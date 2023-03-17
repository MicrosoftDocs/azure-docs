---
title: Monitor Log Analytics workspace health
description: This article how to monitor the health of a Log Analytics workspace and set up alerts about latency issues specific to the Log Analytics workspace or related to known Azure service issues.
ms.topic: how-to
author: guywi-ms
ms.author: guywild
ms.reviewer: MeirMen
ms.date: 02/07/2023

#Customer-intent: As a Log Analytics workspace administrator, I want to know when there are latency issues in a Log Analytics workspace, so I can act to resolve the issue, contact Microsoft for support, or track that is Azure is meeting its SLA.  
---

# Monitor Log Analytics workspace health

[Azure Service Health](../../service-health/overview.md) monitors the health of your cloud resources, including Log Analytics workspaces. When a Log Analytics workspace is healthy, data you collect from resources in your IT environment is available for querying and analysis in a relatively short period of time, known as [latency](../logs/data-ingestion-time.md). This article explains how to view the health status of your Log Analytics workspace and set up alerts to track Log Analytics workspace health status changes.  

Azure Service Health monitors:

- [Resource health](../../service-health/resource-health-overview.md): information about the health of your individual cloud resources, such as a specific Log Analytics workspace. 
- [Service health](../../service-health/service-health-overview.md): information about the health of the Azure services and regions you're using, which might affect your Log Analytics workspace, including communications about outages, planned maintenance activities, and other health advisories.

## View Log Analytics workspace health and set up health status alerts 

When Azure Service Health detects [average latency](../logs/data-ingestion-time.md#average-latency) in your Log Analytics workspace, the workspace resource health status is **Available**.

To view your Log Analytics workspace health and set up health status alerts:
 
1. Select **Resource health** from the Log Analytics workspace menu.

    The **Resource health** screen shows:

    - **Health history**: Indicates whether Azure Service Health has detected latency issues related to the specific Log Analytics workspace. To further investigate latency issues related to your workspace, see [Investigate latency](#investigate-log-analytics-workspace-health-issues).  
    - **Azure service issues**: Displayed when a known issue with an Azure service might affect latency in the Log Analytics workspace. Select the message to view details about the service issue in Azure Service Health.
   
    > [!NOTE]
    > Service health notifications do not indicate that your Log Analytics workspace is necessarily affected by the know service issue. If your Log Analytics workspace resource health status is **Available**, Azure Service Health did not detect issues in your workspace.  
   
    :::image type="content" source="media/data-ingestion-time/log-analytics-workspace-latency.png" lightbox="media/data-ingestion-time/log-analytics-workspace-latency.png" alt-text="Screenshot that shows the Resource health screen for a Log Analytics workspace.":::  
    
1. To set up health status alerts:
    1. Select **Add resource health alert**.
    
        The **Create alert rule** wizard opens, with the **Scope** and **Condition** panes pre-populated. By default, the rule triggers alerts all status changes in all Log Analytics workspaces in the subscription. If necessary, you can edit and modify the scope and condition at this stage. 

        :::image type="content" source="media/data-ingestion-time/log-analytics-workspace-latency-alert-rule.png" lightbox="media/data-ingestion-time/log-analytics-workspace-latency-alert-rule.png" alt-text="Screenshot that shows the Create alert rule wizard for Log Analytics workspace latency issues.":::  

    1. Follow the rest of the steps in [Create a new alert rule in the Azure portal](../alerts/alerts-create-new-alert-rule.md#create-a-new-alert-rule-in-the-azure-portal). 

## Investigate Log Analytics workspace health issues

To investigate Log Analytics workspace health issues:

- Use [Log Analytics Workspace Insights](../logs/log-analytics-workspace-insights-overview.md), which provides a unified view of your workspace usage, performance, health, agent, queries, and change log.
- Query the data in your Log Analytics workspace to [understand which factors are contributing greater than expected latency in your workspace](../logs/data-ingestion-time.md).  
- [Use the `_LogOperation` function to view and set up alerts about operational issues](../logs/monitor-workspace.md) logged in your Log Analytics workspace.

## Next steps

Learn more about:

- [Log Analytics Workspace Insights](../logs/log-analytics-workspace-insights-overview.md).
- [Querying log data in Azure Monitor Logs](../logs/get-started-queries.md).

