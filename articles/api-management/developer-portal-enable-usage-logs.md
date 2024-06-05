---
title: Enable usage logs - Developer portal - Azure API Management
description: Enable logs to monitor usage of the developer portal in Azure API Management. Usage data includes views of API and product details.
services: api-management
author: dlepow

ms.service: api-management
ms.custom: 
ms.topic: how-to
ms.date: 05/23/2024
ms.author: danlep
---

# Enable logging of developer portal usage in Azure API Management

[!INCLUDE [api-management-availability-premium-dev-standard-basic](../../includes/api-management-availability-premium-dev-standard-basic.md)]

This article shows you how to enable Azure Monitor logs for auditing and troubleshooting usage of the API Management [developer portal](developer-portal-overview.md). When enabled through a diagnostic setting, the logs collect information about the requests that are received and processed by the developer portal.

Developer portal usage logs include data about activity in the developer portal, including:

* User authentication actions, such as sign-in and sign-out
* Views of API details, API operation details, and products
* API testing in the interactive test console 

## Enable diagnostic setting for developer portal logs

To configure a diagnostic setting for developer portal usage logs:

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.
1. In the left menu, under **Monitoring**, select **Diagnostic settings** > **+ Add diagnostic setting**.

    :::image type="content" source="media/developer-portal-enable-usage-logs/monitoring-menu.png" alt-text="Screenshot of adding a diagnostic setting in the portal.":::
1. On the **Diagnostic setting** blade, enter or select details for the setting:
    1. **Diagnostic setting name**: Enter a descriptive name.
    1. **Category groups**: Optionally make a selection for your scenario. 
    1. Under **Categories**: Select **Logs related to Developer Portal usage**. Optionally select other categories as needed.
    1. Under **Destination details**, select one or more options and specify details for the destination. For example, archive logs to a storage account or stream them to an event hub. [Learn more](../azure-monitor/essentials/diagnostic-settings.md)
        > [!NOTE]
        > Currently, the **Send to Log Analytics workspace** destination isn't supported for developer portal usage logs.

    1. Select **Save**. 
 
## View diagnostic log data

Depending on the log destination you choose, it can take a few minutes for data to appear. 

If you send logs to a storage account, you can access the data in the Azure portal and download it for analysis.

1. In the [Azure portal](https://portal.azure.com), navigate to the storage account destination.
1. In the left menu, select **Storage Browser**.
1. Under **Blob containers**, select **insights-logs-developerportalauditlogs**.
1. Navigate to the container for the logs in your API Management instance. The logs are partitioned in intervals of 1 hour.
1. To retrieve the data for further analysis, select **Download**.

       
## Related content

* [Overview of log queries in Azure Monitor](../azure-monitor/logs/log-query-overview.md).

* [Developer portal audit log schema reference](developer-portal-audit-log-schema-reference.md). 

