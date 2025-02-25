---
author: dlepow
ms.service: azure-api-management
ms.topic: include
ms.date: 02/24/2025
ms.author: danlep
---

When you create a diagnostic setting to enable collection of gateway or LLM resource logs, logging is enabled with default settings, which do not include details of request or responses such as response bodies. You can adjust the logging settings for all APIs, or override them for individual APIs. For example, adjust the sampling rate or the verbosity of the gateway log data, enable logging of LLM request or response messages, or disable logging for some APIs.

For details about the logging settings, see [Diagnostic logging settings reference](diagnostic-logs-reference.md).

To configure logging settings for all APIs:

1. In the left menu of your API Management instance, select **APIs** > **APIs** > **All APIs**.
1. Select the **Settings** tab from the top bar.
1. Scroll down to the **Diagnostic Logs** section, and select the **Azure Monitor** tab.
1. Review the settings and make changes if needed. Select **Save**. 

To configure logging settings for a specific API:

1. In the left menu of your API Management instance, select **APIs** > **APIs** and then the name of the API.
1. Select the **Settings** tab from the top bar.
1. Scroll down to the **Diagnostic Logs** section, and select the **Azure Monitor** tab.
1. Review the settings and make changes if needed. Select **Save**. 

[!INCLUDE [api-management-log-entry-size-limit](api-management-log-entry-size-limit.md)]
