---
title: Diagnostic logs
titleSuffix: Azure Application Gateway
description: Explore how to use Azure Monitor to collect and analyze Application Gateway logs for better troubleshooting and data visualization.
#customer intent: As a network engineer, I want to analyze access logs for specific HTTP status codes so that I can identify and resolve problematic requests.
services: application-gateway
author: mbender-ms
ms.service: azure-application-gateway
ms.topic: concept-article
ms.date: 06/16/2025
ms.author: mbender
ms.custom:
  - ai-gen-docs-bap
  - ai-gen-description
  - ai-seo-date:06/16/2025 
# Customer intent: "As an IT administrator, I want to enable and configure diagnostic logging for Azure Application Gateway, so that I can monitor resource performance and troubleshoot issues effectively."
---

# Diagnostic logs for Application Gateway

Application Gateway logs provide detailed information for events related to a resource and its operations. These logs are available for events such as Access, Activity, Firewall, and Performance (only for V1). The granular information in logs is helpful when troubleshooting a problem or building an analytics dashboard by consuming this raw data.

Logs are available for all resources of Application Gateway; however, to consume them, you must enable their collection in a storage location of your choice. Logging in Azure Application Gateway is enabled by the Azure Monitor service. We recommend using the Log Analytics workspace as you can readily use its predefined queries and set alerts based on specific log conditions.

## <a name="firewall-log"></a><a name="diagnostic-logging"></a>Types of Resource logs

You can use different types of logs in Azure to manage and troubleshoot application gateways.

- [Activity log](monitor-application-gateway-reference.md#activity-log)
- [Application Gateway Access Log](monitor-application-gateway-reference.md#resource-logs)
- [Application Gateway Performance Log](monitor-application-gateway-reference.md#resource-logs) (available only for the v1 SKU)
- [Application Gateway Firewall Log](monitor-application-gateway-reference.md#resource-logs)

> [!NOTE]
> Logs are available only for resources deployed in the Azure Resource Manager deployment model. You can't use logs for resources in the classic deployment model. For a better understanding of the two models, see the [Understanding Resource Manager deployment and classic deployment](../azure-resource-manager/management/deployment-models.md) article.

## Examples of optimizing access logs using Workspace Transformations

**Example 1: Selective Projection of Columns**: Imagine you have application gateway access logs with 20 columns, but you're interested in analyzing data from only six specific columns. By using workspace transformation, you can project these six columns into your workspace, effectively excluding the other 14 columns. Even though the original data from those excluded columns won't be stored, empty placeholders for them still appear in the Logs blade. This approach optimizes storage and ensures that only relevant data is retained for analysis.

> [!NOTE]
> Within the Logs blade, selecting the **Try New Log Analytics** option gives greater control over the columns displayed in your user interface.

**Example 2: Focusing on Specific Status Codes**: When analyzing access logs, instead of processing all log entries, you can write a query to retrieve only rows with specific HTTP status codes (such as 4xx and 5xx). Since most requests ideally fall under the 2xx and 3xx categories (representing successful responses), focusing on the problematic status codes narrows down the data set. This targeted approach allows you to extract the most relevant and actionable information, making it both beneficial and cost-effective.

**Recommended transition strategy to move from Azure diagnostic to resource specific table:**

1. Assess current data retention: Determine the duration for which data is presently retained in the Azure diagnostics table (for example: assume the diagnostics table retains data for 15 days).
1. Establish resource-specific retention: Implement a new Diagnostic setting with resource specific table.
1. Parallel data collection: For a temporary period, collect data concurrently in both the Azure Diagnostics and the resource-specific settings.
1. Confirm data accuracy: Verify that data collection is accurate and consistent in both settings.
1. Remove Azure diagnostics setting: Remove the Azure Diagnostic setting to prevent duplicate data collection.

Other storage locations:

- **Azure Storage account**: Storage accounts are best used for logs when logs are stored for a longer duration and reviewed when needed.
- **Azure Event Hubs**: Event hubs are a great option for integrating with other security information and event management (SIEM) tools to get alerts on your resources.
- **Azure Monitor partner integrations**.

Learn more about the Azure Monitor's [diagnostic settings destinations](/azure/azure-monitor/essentials/diagnostic-settings?WT.mc_id=Portal-Microsoft_Azure_Monitoring&tabs=portal#destinations) .

## Enable logging through PowerShell

Activity logging is automatically enabled for every Resource Manager resource. You must enable access and performance logging to start collecting the data available through those logs. To enable logging, use the following steps:

1. Note your storage account's resource ID, where the log data is stored. This value is of the form: /subscriptions/\<subscriptionId\>/resourceGroups/\<resourceGroupName\>/providers/Microsoft.Storage/storageAccounts/\<storageAccountName\>. You can use any storage account in your subscription. You can use the Azure portal to find this information.

   :::image type="content" source="media/application-gateway-diagnostics/storage-endpoint-resource-id-thumb.png" alt-text="Screenshot of storage account endpoints." lightbox="media/application-gateway-diagnostics/storage-endpoint-resource-id.png":::

1. Note your application gateway's resource ID for which logging is enabled. This value is of the form: /subscriptions/\<subscriptionId\>/resourceGroups/\<resourceGroupName\>/providers/Microsoft.Network/applicationGateways/\<applicationGatewayName\>. You can use the portal to find this information.

   :::image type="content" source="media/application-gateway-diagnostics/application-gateway-endpoint-id-thumb.png" alt-text="Screenshot of app gateway properties." lightbox="media/application-gateway-diagnostics/application-gateway-endpoint-id.png":::

1. Enable diagnostic logging by using the following PowerShell cmdlet:

    ```powershell
    Set-AzDiagnosticSetting  -ResourceId /subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.Network/applicationGateways/<applicationGatewayName> -StorageAccountId /subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.Storage/storageAccounts/<storageAccountName> -Enabled $true
    ```

> [!TIP]
> Activity logs don't require a separate storage account. The use of storage for access and performance logging incurs service charges.

## Enable logging through the Azure portal

1. In the Azure portal, find your resource and select **Diagnostic settings**.

   For Application Gateway, three logs are available:

   - Access log
   - Performance log (available only for the v1 SKU)
   - Firewall log

1. To start collecting data, select **Turn on diagnostics**.

   :::image type="content" source="media/application-gateway-diagnostics/turning-on-diagnostics.png" alt-text="Screenshot of turning on diagnostics.":::

1. The **Diagnostics settings** page provides the settings for the diagnostic logs. In this example, Log Analytics stores the logs. You can also use event hubs and a storage account to save the diagnostic logs.

   :::image type="content" source="media/application-gateway-diagnostics/starting-configuration-process.png" alt-text="Screenshot of starting the configuration process.":::

1. Type a name for the settings, confirm the settings, and select **Save**.

To view and analyze activity log data, see [Analyze monitoring data](monitor-application-gateway.md#azure-monitor-tools).

## View and analyze the access, performance, and firewall logs

[Azure Monitor logs](/previous-versions/azure/azure-monitor/insights/azure-networking-analytics) can collect the counter and event log files from your Blob storage account. For more information, see [Analyze monitoring data](monitor-application-gateway.md#azure-monitor-tools).

You can also connect to your storage account and retrieve the JSON log entries for access and performance logs. After you download the JSON files, you can convert them to CSV and view them in Excel, Power BI, or any other data-visualization tool.

> [!TIP]
> If you're familiar with Visual Studio and basic concepts of changing values for constants and variables in C#, you can use the [log converter tools](https://github.com/Azure-Samples/networking-dotnet-log-converter) available from GitHub.

## Next steps

- Visualize counter and event logs by using [Azure Monitor logs](/previous-versions/azure/azure-monitor/insights/azure-networking-analytics).
- [Visualize your Azure activity log with Power BI](https://powerbi.microsoft.com/blog/monitor-azure-audit-logs-with-power-bi/) blog post.
- [View and analyze Azure activity logs in Power BI and more](https://azure.microsoft.com/blog/analyze-azure-audit-logs-in-powerbi-more/) blog post.
