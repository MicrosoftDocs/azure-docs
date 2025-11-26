---
title: Set Up Logging for LLM APIs in Azure API Management
titleSuffix: Azure API Management
description: Enable logging for LLM APIs in Azure API Management to track token usage, prompts, and completions for billing and auditing.
#customer intent: As a system administrator, I want to enable logging of LLM request and response messages so that I can track API interactions for billing or auditing purposes.
author: dlepow
ms.service: azure-api-management
ms.topic: how-to
ms.date: 08/22/2025
ms.author: danlep
ai-usage: ai-assisted
ms.update-cycle: 180-days
ms.collection: ce-skilling-ai-copilot
ms.custom:
---

# Log token usage, prompts, and completions for LLM APIs

In this article, you learn how to set up Azure Monitor logging for LLM API requests and responses in Azure API Management. 

The API Management administrator can use LLM API request and response logs along with API Management gateway logs for scenarios such as the following:

* **Calculate usage for billing** - Calculate usage metrics for billing based on the number of tokens consumed by each application or API consumer (for example, segmented by subscription ID or IP address).

* **Inspect messages** - Inspect and analyze prompts and completions to help with debugging, auditing, and model evaluation.

Learn more about:

* [AI gateway capabilities in API Management](genai-gateway-capabilities.md)
* [Monitoring API Management](monitor-api-management.md)

## Prerequisites
- An Azure API Management instance.
- A managed LLM chat completions API integrated with Azure API Management. For example, [Import a Microsoft Foundry API](azure-ai-foundry-api.md).
- Access to an Azure Log Analytics workspace.
- Appropriate permissions to configure diagnostic settings and access logs in API Management.

## Enable diagnostic setting for LLM API logs

Enable a diagnostic setting to log requests that the gateway processes for large language model REST APIs. For each request, Azure Monitor receives data about token usage (prompt tokens, completion tokens, and total tokens), the name of the model used, and optionally the request and response messages (prompt and completion). Large requests and responses are split into multiple log entries with sequence numbers for later reconstruction if needed.

The following are brief steps to enable a diagnostic setting that directs LLM API logs to a Log Analytics workspace. For more information, see [Enable diagnostic setting for Azure Monitor logs](monitor-api-management.md#enable-diagnostic-setting-for-azure-monitor-logs).

1. In the [Azure portal](https://portal.azure.com), navigate to your Azure API Management instance.
1. In the left menu, under **Monitoring**, select **Diagnostic settings** > **+ Add diagnostic setting**.
1. Configure the setting to send AI gateway logs to a Log Analytics workspace:
   - Under **Logs**, select **Logs related to generative AI gateway**.
   - Under **Destination details**, select **Send to Log Analytics workspace**.
1. Review or configure other settings and make changes if needed.
1. Select **Save**.

:::image type="content" source="media/api-management-howto-llm-logs/diagnostic-setting.png" alt-text="Screenshot of diagnostic setting for AI gateway logs in the portal.":::

## Enable logging of requests or responses for LLM API

You can enable diagnostic settings for all APIs or customize logging for specific APIs. The following are brief steps to log both LLM requests and response messages for an API. For more information, see [Modify API logging settings](monitor-api-management.md#modify-api-logging-settings).

1. In the left menu of your API Management instance, select **APIs > APIs** and then select the name of the API.
1. Select the **Settings** tab from the top bar.
1. Scroll down to the **Diagnostic Logs** section, and select the **Azure Monitor** tab.
1. In **Log LLM messages**, select **Enabled**.
1. Select **Log prompts** and enter a size in bytes, such as *32768*.
1. Select **Log completions** and enter a size in bytes, such as *32768*.
1. Review other settings and make changes if needed. Select **Save**.

:::image type="content" source="media/api-management-howto-llm-logs/enable-llm-api-logging.png" alt-text="Screenshot of enabling LLM logging for an API in the portal.":::

> [!NOTE]
> If you enable collection, LLM request or response messages up to 32 KB in size are sent in a single entry. Messages larger than 32 KB are split and logged in 32 KB chunks with sequence numbers for later reconstruction. Request messages and response messages can't exceed 2 MB each.


## Review analytics workbook for LLM APIs

The Azure Monitor-based **Analytics** dashboard provides insights into LLM API usage and token consumption using data aggregated in a Log Analytics workspace. [Learn more](monitor-api-management.md#get-api-analytics-in-azure-api-management) about Analytics in API Management.

1. In the left menu of your API Management instance, select **Monitoring** > **Analytics**.
1. Select the **Language models** tab.
1. Review metrics and visualizations for LLM API token consumption and requests in a selected **Time range**. 

:::image type="content" source="media/api-management-howto-llm-logs/analytics-workbook-small.png" alt-text="Screenshot of analytics for language model APIs in the portal." lightbox="media/api-management-howto-llm-logs/analytics-workbook.png":::

## Review Azure Monitor logs for requests and responses

Review the [ApiManagementGatewayLlmLog](/azure/azure-monitor/reference/tables/apimanagementgatewayllmlog) log for details about LLM requests and responses, including token consumption, model deployment used, and other details over specific time ranges.

Requests and responses (including chunked messages for large requests and responses) appear in separate log entries that you can correlate by using the `CorrelationId` field. 

For auditing purposes, use a Kusto query similar to the following query to join each request and response in a single record. Adjust the query to include the fields that you want to track.

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
    Input = strcat_array(make_list(RequestContent), " . "),
    Output = strcat_array(make_list(ResponseContent), " . ")
    by CorrelationId
| where isnotempty(Input) and isnotempty(Output)
```

:::image type="content" source="media/api-management-howto-llm-logs/llm-log-query-small.png" alt-text="Screenshot of query results for LLM logs in the portal." lightbox="media/api-management-howto-llm-logs/llm-log-query.png":::

## Upload data to Microsoft Foundry for model evaluation

You can export LLM logging data as a dataset for [model evaluation](/azure/ai-foundry/concepts/observability) in Microsoft Foundry. With model evaluation, you can assess the performance of your generative AI models and applications against a test model or dataset using built-in or custom evaluation metrics. 

To use LLM logs as a dataset for model evaluation:

1. Join LLM request and response messages into a single record for each interaction, as shown in the [previous section](#review-azure-monitor-logs-for-requests-and-responses). Include the fields you want to use for model evaluation.
1. Export the dataset to CSV format, which is compatible with Microsoft Foundry.
1. In the Microsoft Foundry portal, create a new evaluation to upload and evaluate the dataset.

For details to create and run a model evaluation in Microsoft Foundry, see [Evaluate generative AI models and applications by using Microsoft Foundry](/azure/ai-foundry/how-to/evaluate-generative-ai-app).

## Related content

* [Learn more about monitoring API Management](monitor-api-management.md)
* [Azure Monitor reference for API Management](monitor-api-management-reference.md)
* [Tutorial: Monitor published APIs](api-management-howto-use-azure-monitor.md)
