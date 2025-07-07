---
author: dlepow
ms.service: azure-api-management
ms.topic: include
ms.date: 02/24/2025
ms.author: danlep
ms.custom:
  - build-2025
---

If you enable collection of logs or metrics in a Log Analytics workspace, it can take a few minutes for data to appear in Azure Monitor. 

To view the data:

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.
1. In the left menu, under **Monitoring**, select **Logs**.
1. Run queries to view the data. Several [sample queries](/azure/azure-monitor/logs/queries) are provided, or run your own. For example, the following query retrieves the most recent 24 hours of data from the ApiManagementGatewayLogs table:

    ```kusto
    ApiManagementGatewayLogs
    | where TimeGenerated > ago(1d) 
    ```
    :::image type="content" source="media/api-management-log-analytics/query-resource-logs.png" alt-text="Screenshot of querying ApiManagementGatewayLogs table in the portal." lightbox="media/api-management-log-analytics/query-resource-logs.png":::
