---
title: Enable usage logs - Developer portal - Azure API Management
description: Learn how to use metrics, alerts, activity logs, and resource logs to monitor your APIs in Azure API Management.
services: api-management
author: dlepow

ms.service: api-management
ms.custom: 
ms.topic: how-to
ms.date: 05/10/2024
ms.author: danlep
---

# Enable logging of developer portal usage in Azure API Management

[!INCLUDE [api-management-availability-premium-dev-standard-basic-standardv2-basicv2](../../includes/api-management-availability-premium-dev-standard-basic-standardv2-basicv2.md)]

This article shows you how to enable Azure Monitor logs for auditing and troubleshooting usage of the developer portal. When enabled through a diagnostic setting, the logs collect information about the requests that are received and processed by the developer portal.

To configure resource logs:

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.
2. Select **Diagnostic settings**.

    :::image type="content" source="media/api-management-howto-use-azure-monitor/api-management-diagnostic-logs-blade.png" alt-text="Screenshot of Diagnostic settings item in Monitoring menu in the portal.":::

1. Select **+ Add diagnostic setting**.
1. Select the logs or metrics that you want to collect.

   You have several options about where to send the logs and metrics. For example, archive resource logs along with metrics to a storage account, stream them to an event hub, or send them to a Log Analytics workspace.

  1. After configuring details for the log destination or destinations, select **Save**. 

For more information, see [Create diagnostic settings to send platform logs and metrics to different destinations](../azure-monitor/essentials/diagnostic-settings.md).
 
## View diagnostic data in Azure Monitor

If you enable collection of logs or metrics in a Log Analytics workspace, it can take a few minutes for data to appear in Azure Monitor. 

To view the data:

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.
1. Select **Logs** from the left menu.

    :::image type="content" source="media/api-management-howto-use-azure-monitor/logs-menu-item.png" alt-text="Screenshot of Logs item in Monitoring menu in the portal.":::

1. Run queries to view the data. Several [sample queries](../azure-monitor/logs/queries.md) are provided, or run your own. For example, the following query retrieves ...

    ```kusto
    ....
    | where TimeGenerated > ago(1d) 
    ```

    :::image type="content" source="media/api-management-howto-use-azure-monitor/query-resource-logs.png" alt-text="Screenshot of querying ApiManagementGatewayLogs table in the portal." lightbox="media/api-management-howto-use-azure-monitor/query-resource-logs.png":::

For more information about using resource logs for API Management, see:

* [Log Analytics tutorial](../azure-monitor/logs/log-analytics-tutorial.md), or try the [Log Analytics demo environment](https://ms.portal.azure.com/#view/Microsoft_OperationsManagementSuite_Workspace/LogsDemo.ReactView).

* [Overview of log queries in Azure Monitor](../azure-monitor/logs/log-query-overview.md).

* [API Management resource log schema reference](gateway-log-schema-reference.md). 

## Modify API logging settings

By default, when you create a diagnostic setting to enable collection of resource logs, logging is enabled for all APIs, with default settings. You can adjust the logging settings for all APIs, or override them for individual APIs. For example, adjust the sampling rate or the verbosity of the data, or disable logging for some APIs.

For details about the logging settings, see [Diagnostic logging settings reference](diagnostic-logs-reference.md).

To configure logging settings for all APIs:

1. In the left menu of your API Management instance, select **APIs** > **All APIs**.
1. Select the **Settings** tab from the top bar.
1. Scroll down to the **Diagnostic Logs** section, and select the **Azure Monitor** tab.
1. Review the settings and make changes if needed. Select **Save**.

To configure logging settings for a specific API:

1. In the left menu of your API Management instance, select **APIs** and then the name of the API.
1. Select the **Settings** tab from the top bar.
1. Scroll down to the **Diagnostic Logs** section, and select the **Azure Monitor** tab.
1. Review the settings and make changes if needed. Select **Save**.

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * View metrics of your API
> * Set up an alert rule
> * View activity logs
> * Enable and view resource logs


Advance to the next tutorial:

> [!div class="nextstepaction"]
> [Trace calls](api-management-howto-api-inspector.md)
