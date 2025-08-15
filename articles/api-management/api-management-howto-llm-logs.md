---
title: Logging LLM Requests in Azure API Management
titleSuffix: Azure API Management
description: Learn how to log LLM requests and responses from the AI gateway in Azure API Management.
author: dlepow
ms.service: azure-api-management
ms.topic: how-to
ms.date: 08/14/2025
ms.author: danlep
ai-usage: ai-assisted
ms.collection: cd-skilling-ai-copilot
ms.custom:
  - ai-gen-docs-bap
  - ai-gen-title
  - ai-seo-date:08/14/2025
#customer intent: As a system administrator, I want to enable logging of LLM request and response messages so that I can track API interactions for debugging purposes.  
---

# Enable logging of LLM requests and responses

[Intro]
In this guide, you'll learn how to enable Azure Monitor logging for LLM requests and responses in Azure API Management. This is essential for monitoring and troubleshooting your AI gateway.

Learn more about:

* [AI gateway capabilities in API Management](genai-gateway-capabilities.md)
* [Monitoring API Management](monitor-api-management.md)

## Prerequisites
- An Azure API Management instance.
- A managed LLM chat completions API integrated with Azure API Management. For example, [Import an Azure AI Foundry API](azure-ai-foundry-api.md).
- Access to an Azure Log Analytics workspace.
- Appropriate permissions to configure diagnostic settings and access logs.

## Enable diagnostic setting for AI gateway logs

Enable a diagnostic setting to collect AI gateway logs. We recommend sending the logs to a Log Analytics workspace. 

For detailed configuration steps, see [Enable diagnostic setting for Azure Monitor logs](monitor-api-management.md#enable-diagnostic-setting-for-azure-monitor-logs).

1. In the [Azure portal](https://portal.azure.com), navigate to your Azure API Management instance.
1. In the left menu, under **Monitoring**, select **Diagnostic settings** > **+ Add diagnostic setting**.
1. Configure the setting to send AI gateway logs to a Log Analytics workspace:
   - Under **Logs**, select **Logs related to generative AI gateway**.
   - Under **Destination details**, select **Send to Log Analytics workspace**.
1. Review or configure other settings and make changes if needed.
1. Select **Save**.

:::image type="content" source="media/api-management-howto-llm-logs/diagnostic-setting.png" alt-text="Screenshot of diagnostic setting for AI gateway logs in the portal.":::

## Enable logging of LLM requests or responses for LLM API

Enable Azure Monitor logging for your LLM API. For detailed steps, see [Modify API logging settings](monitor-api-management.md#modify-api-logging-settings). 

The following are brief steps to log all LLM requests and response messages (up to 32 KB in size) for an API:

1. In the left menu of your API Management instance, select **APIs > APIs**  and then the name of the API.
1. Select the **Settings** tab from the top bar.
1. Scroll down to the **Diagnostic Logs** section, and select the **Azure Monitor** tab.
1. In **Log LLM messages**, select **Enabled**.
1. Select **Log prompts** and enter *32768*.
1. Select **Log completions** and enter *32768*.
1. Review other settings and make changes if needed. Select **Save**.

:::image type="content" source="media/api-management-howto-llm-logs/enable-llm-api-logging.png" alt-text="Screenshot of enabling LLM logging for an API in the portal.":::

> [!NOTE]
> LLM request or response messages up to 32 KB in size, if collected, are sent in a single entry. Messages larger than 32 KB are split and logged in 32 KB chunks with sequence numbers for later reconstruction. Request messages and response messages can't exceed 2 MB each.


## Review analytics workbook for LLM APIs

The Azure Monitor-based **Analytics** dashboard provides insights into LLM API usage and token consumption  from data aggregated in a Log Analytics workspace. [Learn more](monitor-api-management.md#get-api-analytics-in-azure-api-management) about Analytics in API Management.

1. In the left menu of your API Management instance, select **Monitoring** > **Analytics**.
1. Select the **Language models** tab.
1. Review metrics and visualizations for LLM API token consumption and requests in a selected **Time range**. 

:::image type="content" source="media/api-management-howto-llm-logs/analytics-workbook-small.png" alt-text="Screenshot of analytics for language model APIs in the portal." lightbox="media/api-management-howto-llm-logs/analytics-workbook.png":::

## Review Azure Monitor logs for requests and responses

Review the [ApiManagementGatewayLlmLog](/azure/azure-monitor/reference/tables/apimanagementgatewayllmlog) log for details about LLM requests and responses, including token consumption, model deployment used, and other details over specific time ranges.

Requests and responses are logged in separate log entries that can be correlated using the `CorrelationId` field. For auditing or purposes you can use a Kusto query similar to the following to join each request and response in a single record.

```Kusto
ApiManagementGatewayLlmLog
| extend RequestArray = parse_json(RequestMessages)
| extend ResponseArray = parse_json(ResponseMessages)
| mv-expand RequestArray
| mv-expand ResponseArray
| project
    CorrelationId,
    RequestContent = tostring(RequestArray.content),
    ResponseContent = tostring(ResponseArray.content)
| summarize
    Input = strcat_aray(make_list(RequestContent), " . "),
    Output = strcat_array(make_list(ResponseContent), " . ")
    by CorrelationId
| where isnotempty(Input) and isnotempty(Output)
```

:::image type="content" source="media/api-management-howto-llm-logs/llm-log-query-small.png" alt-text="Screenshot of query results for LLM logs in the portal." lightbox="media/api-management-howto-llm-logs/llm-log-query.png":::

## Related content

* [Learn more about monitoring API Management](monitor-api-management.md)
* [Azure Monitor reference for API Management](monitor-api-management-reference.md)
* [Tutorial: Monitor published APIs](api-management-howto-use-azure-monitor.md)