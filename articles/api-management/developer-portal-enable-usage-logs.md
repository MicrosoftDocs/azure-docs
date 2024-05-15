---
title: Enable usage logs - Developer portal - Azure API Management
description: Enable logs to monitor usage of the developer portal in Azure API Management. Usage data includes views of API and product details.
services: api-management
author: dlepow

ms.service: api-management
ms.custom: 
ms.topic: how-to
ms.date: 05/13/2024
ms.author: danlep
---

# Enable logging of developer portal usage in Azure API Management

[!INCLUDE [api-management-availability-premium-dev-standard-basic-standardv2-basicv2](../../includes/api-management-availability-premium-dev-standard-basic-standardv2-basicv2.md)]

This article shows you how to enable Azure Monitor logs for auditing and troubleshooting usage of the API Management [developer portal](developer-portal-overview.md). When enabled through a diagnostic setting, the logs collect information about the requests that are received and processed by the developer portal.

Developer portal usage logs include data about activity in the developer portal, including:

* User authentication actions, such as sign-in and sign-out
* Views of API details, API operation details, and products
* API testing in the interactive test console 

> [!NOTE]
> Developer portal usage logs in API Management are currently in preview.

## Enable diagnostic setting for developer portal logs

To configure a diagnostic setting for developer portal usage logs:

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.
1. In the left menu, under **Monitoring**, select **Diagnostic settings** > **+ Add diagnostic setting**.

    :::image type="content" source="media/developer-portal-enable-usage-logs/monitoring-menu.png" alt-text="Screenshot of adding a diagnostic setting in the portal":::
1. On the **Diagnostic setting** blade, enter or select details for the setting:
    1. **Diagnostic setting name**: Enter a descriptive name.
    1. **Category groups**: Optionally make a selection for your scenario. 
    1. Under **Categories**: Select **Logs related to Developer Portal usage**. Optionally select other categories as needed.
    1. Under **Destination details**, select one or more options and specify details for the destination. For example, archive logs to a storage account, stream them to an event hub, or send them to a Log Analytics workspace or partner solution. [Learn more](../azure-monitor/essentials/diagnostic-settings.md)
    1. Select **Save**. 
 
## View diagnostic log data

Depending on the log destination you choose, it can take a few minutes for data to appear. 

If you send logs to a storage account, you can access the data in the Azure portal and download it for analysis.

1. In the [Azure portal](https://portal.azure.com), navigate to the storage account destination.
1. In the left menu, select **Storage Browser**.
1. Under **Blob containers**, select **insights-logs-developerportalauditlogs**.
1. Navigate to the container for the logs in your API Management instance. The logs are partitioned in intervals of 1 hour.
1. To retrieve the data for further analysis, select **Download**.

If you selected a Log Analytics workspace as a destination, you can view the data in the Azure portal. To query the data:

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.
1. In the left menu, select **Logs**.
1. Run queries to view the data. Several [sample queries](../azure-monitor/logs/queries.md) are provided, or run your own. For example, the following query retrieves the most recent 24 hours of data from the DeveloperPortalAuditLogs table:

```kusto
DeveloperPortalAuditLogs
| where TimeGenerated > ago(1d)
```
        
## Related content

* [Log Analytics tutorial](../azure-monitor/logs/log-analytics-tutorial.md), or try the [Log Analytics demo environment](https://ms.portal.azure.com/#view/Microsoft_OperationsManagementSuite_Workspace/LogsDemo.ReactView).

* [Overview of log queries in Azure Monitor](../azure-monitor/logs/log-query-overview.md).

* [Developer portal audit log schema reference](developer-portal-audit-log-schema-reference.md). 

