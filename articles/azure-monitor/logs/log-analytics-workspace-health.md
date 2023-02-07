---
title: Monitor latency in a Log Analytics workspace
description: This article how to monitor the health of a Log Analytics workspace and set up alerts about latency issues specific to the Log Analytics workspace or related to known Azure service issues.
ms.topic: conceptual
author: guywi-ms
ms.author: guywild
ms.reviewer: MeirMen
ms.date: 02/07/2023

#Customer-intent: As a Log Analytics workspace administrator, I want to know when there are latency issues in a Log Analytics workspace, so I can act to resolve the issue, contact Microsoft for support, or track that is Azure is meeting its SLA.  
---

# Monitor latency in a Log Analytics workspace
Latency refers to the amount of time it takes for log data to become available in Azure Monitor Logs after it's collected from a monitored resource. The typical latency for log data in Azure Monitor Logs is between 20 seconds and three minutes. This article explains the factors that affect latency in Azure Monitor Logs and how to monitor latency in a Log Analytics workspace.


## View Log Analytics workspace health and set up alerts 

[Azure Service Health](../../service-health/overview.md) monitors the [resource health](../../service-health/resource-health-overview.md) and [service health](../../service-health/service-health-overview.md) of your Log Analytics workspace.
 
1. To view your Log Analytics workspace health, select **Resource health** from the Log Analytics workspace menu.

    The **Resource health** screen shows:

    - **Health history**: Indicates whether Azure Service Health has detected latency issues related to the specific Log Analytics workspace. To further investigate latency issues related to your workspace, see [Investigate latency](#investigate-latency).  
    - **Azure service issues**: Displayed when a know issue with an Azure service might impact latency in the Log Analytics workspace. Select the message to view details about the service issue in Azure Service Health.

    :::image type="content" source="media/data-ingestion-time/log-analytics-workspace-latency.png" lightbox="media/data-ingestion-time/log-analytics-workspace-latency.png" alt-text="Screenshot that shows the Resource health screen for a Log Analytics workspace.":::  
    
1. To get notification about Log Analytics workspace latency issues, create an alert:
    1. Select **Add resource health alert**.
    
        The **Create alert rule** wizard opens, with the **Scope** and **Condition** panes pre-populated. By default, the rule triggers alerts all status changes in all Log Analytics workspaces in the subscription. If necessary, you can edit and modify the scope and condition at this stage. 

        :::image type="content" source="media/data-ingestion-time/log-analytics-workspace-latency-alert-rule.png" lightbox="media/data-ingestion-time/log-analytics-workspace-latency-alert-rule.png" alt-text="Screenshot that shows the Create alert rule wizard for Log Analytics workspace latency issues.":::  

    1. Follow the rest of the steps in [Create a new alert rule in the Azure portal](../alerts/alerts-create-new-alert-rule.md). 


## Next steps

Read the [service-level agreement](https://azure.microsoft.com/support/legal/sla/monitor/v1_3/) for Azure Monitor.
