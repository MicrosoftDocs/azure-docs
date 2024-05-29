---
title: Monitor and alert with LoadBalancerHealthEvent logs
titleSuffix: Azure Load Balancer
description: Learn how to monitor and alert with LoadBalancerHealthEvent logs for Azure Load Balancer.
author: mbender-ms
ms.service: load-balancer
ms.topic: how-to
ms.date: 05/21/2024
ms.author: mbender
ms.custom: references_regions
# customer intent: As a network admin, I want to use LoadBalancerHealthEvent logs for Azure Load Balancer for monitoring and alerting so that I can identify and troubleshoot ongoing issues affecting my load balancer resource’s health.
---

# Monitor and alert with LoadBalancerHealthEvent logs

In this article, you learn how to monitor and alert with Azure Load Balancer health event logs. These logs can help you identify and troubleshoot ongoing issues affecting your load balancer resource’s health. The health event logs are provided through the Azure Monitor resource log category *LoadBalancerHealthEvent*.

[!INCLUDE [load-balancer-health-event-logs-preview](../../includes/load-balancer-health-event-logs-preview.md)]

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/).
- An Azure Load Balancer resource. To learn how to create a Load Balancer resource, see [Quickstart: Create a public Standard Load Balancer](./quickstart-load-balancer-standard-public-portal.md).
- An Azure Monitor Log Analytics workspace. To learn how to create a Log Analytics workspace, see [Quickstart: Create a Log Analytics workspace](../azure-monitor/logs/quick-create-workspace.md).

## Configuring diagnostic settings to collect LoadBalancerHealthEvent logs

In this section, you learn configure diagnostic settings to collect LoadBalancerHealthEvent logs and store the logs in a log analytics workspace. 

> [!IMPORTANT]
> We recommend sending your logs to a Log Analytics workspace, which will enable you to control access, log data retention and archive settings, and more. To learn more about configuring Log Analytics workspaces, see [Log Analytics workspace overview - Azure Monitor](../azure-monitor/logs/log-analytics-workspace-overview.md).

1. In the Azure portal, navigate to your load balancer resource.
1. From your load balancer resource's **Overview** page, choose  **Monitoring** > **Diagnostic settings**.
   
   :::image type="content" source="media/monitor-alert-load-balancer-health-event-logs/add-diagnostic-settings.png" alt-text="Screenshot of diagnostic settings window in Azure portal.":::

1. Select **+ Add diagnostic setting**.
1. In the **Diagnostic setting** window, select or enter the following settings:
   
    | **Setting** | **Value** |
    | --- | --- |
    | **Diagnostic setting name** | Enter a name for the diagnostic setting. |
    | **Logs** | |
    | **Category Groups** | Select **LoadBalancerHealthEvent** or **Load Balancer Health Event**. |
    | **Metrics** | Leave unchecked. |
    | **Destination details** | Select **Send to Log Analytics workspace**.</br>Select your subscription and your Log Analytics workspace. |

    > [!NOTE]
    > Selecting **AllLogs** will result in all new log categories for load balancer resources to be automatically collected as they are supported. If you don't want this option, select only the log categories you want to collect. In this case, Load Balancer Health Event logs.

    :::image type="content" source="media/monitor-alert-load-balancer-health-event-logs/configure-diagnostic-settings.png" alt-text="Screenshot of diagnostic settings configuration page configure for allLogs and log analytics workspace.":::

2. Select **Save** and close the **Diagnostic setting** window.

> [!NOTE]
> Once your diagnostic setting has been configured, it can take up to 90 minutes for logs to begin appearing. If there are no health events affecting your load balancer, you may not see any logs.

## Configure a log query

In this section, you learn how to query LoadBalancerHealthEvent logs in a Log Analytics workspace. In this example, you query for the latest *SnatPortExhaustion* health events from the last day, and summarize the events by the load balancer’s *resource IDs* and *frontend IP configurations*. 

1. In the Azure portal, navigate to your load balancer resource.
1. From your load balancer resource’s **Overview** page, choose  **Monitoring** > **Logs**.
3. In the **Queries** window, enter **Latest SNAT Port** in the search bar.
4. From the results, select **Load to editor** under **Latest SNAT Port Exhaustion per LB Frontend**.
   
   :::image type="content" source="media/monitor-alert-load-balancer-health-event-logs/search-queries.png" alt-text="Screenshot of Queries window performing search for built-in query.":::

5. The following code is displayed in the query editor:

    ```kusto
        // Latest Snat Port Exhaustion Per LB Frontend 
        // List the latest SNAT port exhaustion event per load balancer Frontend IP 
        ALBHealthEvent
        | where TimeGenerated > ago(1d)
        | where HealthEventType == "SnatPortExhaustion"
        | summarize arg_max(TimeGenerated, *) by LoadBalancerResourceId, FrontendIP
    ```
    :::image type="content" source="media/monitor-alert-load-balancer-health-event-logs/view-snat-query.png" alt-text="Screenshot of query editor with SNAT port exhaustion kusto query.":::

6. Select **Run** to execute the query.
1. If you want to modify and save the query, make your query changes and select **Save**>**Save as query**.
1. In the **Save a query** window, enter a name for the query, other optional information, and select **Save**.

    :::image type="content" source="media/monitor-alert-load-balancer-health-event-logs/save-snat-query.png" alt-text="Screenshot of Save a query window.":::

## Create alerts based on LoadBalancerHealthEvent logs

In this section, you learn how to create an alert that sends an email whenever a *SnatPortExhaustion* event is logged within the past 5 minutes. You can create alerts based on log queries to be notified immediately when health event logs are generated, indicating potential impact to your load balancer resource.

1.  In the Azure portal, navigate to your load balancer resource.
1.  From your load balancer resource’s **Overview** page, choose  **Monitoring** > **Alerts**.
3.  On the **Alerts** page, select **Create customer alert rule**.
4.  On the **Create an alert rule** page, choose **Custom log search** under **Signal name**.
5.  In the **Logs** window for Log Analytics, enter the following query and select **Run**:

    ```kusto
        ALBHealthEvent
        | where TimeGenerated > ago(5m)
        | where HealthEventType == "SnatPortExhaustion"
        | summarize arg_max(TimeGenerated, *) by LoadBalancerResourceId, FrontendIP
    ```
    :::image type="content" source="media/monitor-alert-load-balancer-health-event-logs/add-query-to-alert-rule.png" alt-text="Screenshot of Logs editor with query entered and run.":::

1. Select **Continue Editing Alert**
2. On the **Conditions** tab, set the **Threshold value** to 0 under **Alert logic**.
1. Select **Next: Actions>** or the **Actions** tab.
2. On the **Select an action group** page, select **+ Create action group**.
3. On the **Basics** tab, enter the following settings then select **Next: Notifications**:

    | **Setting** | **Value** |
    | --- | --- |
    | **Project details** | |
    | **Subscription** | Select your subscription. |
    | **Resource group** | Select the resource group that contains your Log Analytics workspace. |
    | **Region** | Select the region for the action group. |
    | **Instance details** | |
    | **Action group name** | Enter a name for the action group. |
    | **Display name** | Enter a display name for the action group. |

    :::image type="content" source="media/monitor-alert-load-balancer-health-event-logs/create-action-group.png" alt-text="Screenshot of Create action group window.":::

4. On the **Notifications** tab, enter the following settings:
   
    | **Setting** | **Value** |
    | --- | --- |
    | **Notification type** | Select **Email/SMS message/Push/Voice**.</br>Enter the email address to receive the alert.</br>Select **Ok**. |
    | **Name** | Enter a name for the notification. |
    
    :::image type="content" source="media/monitor-alert-load-balancer-health-event-logs/create-notification.png" alt-text="Screenshot of Notifications tab in Create action group window with email notification settings.":::

5. Select **Review + create** then **Create** to create the action group.
6. On the **Create an alert rule** page, select **Next: Details** or the **Details** tab.
7. On the **Details** tab, enter the following settings:
8. 
    | **Setting** | **Value** |
    | --- | --- |
    | **Severity** | Select the severity level for the alert. |
    | **Alert rule name** | Enter a name for the alert rule. |
    | **Alert rule description** | Enter a description for the alert rule. |
    | **Severity** | Select the severity level for the alert. |
    | **Region** | Select the region for the alert rule. |

    :::image type="content" source="media/monitor-alert-load-balancer-health-event-logs/create-alert-rule-details-tab.png" alt-text="Screenshot of Details tab in Create an alert rule window.":::

9.  Select **Review + create** then **Create** to create the alert rule.

## Next steps
In this article, you learned how to collect, analyze, and create alerts using these logs.

For more information about Azure Load Balancer health event logs and health event types, along with how to troubleshoot each health event type, see:

- [Azure Load Balancer health event logs](load-balancer-health-event-logs.md)
- [Troubleshoot load balancer health event logs](./load-balancer-troubleshoot-health-event-logs.md)
