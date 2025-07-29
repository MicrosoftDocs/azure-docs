---
author: dlepow
ms.service: azure-api-management
ms.topic: include
ms.date: 02/24/2025
ms.author: danlep
ms.custom:
  - build-2025
---

When you use the portal to create a diagnostic setting to enable collection of API Management gateway or generative AI gateway (LLM) logs, logging is enabled with default settings. Default settings do not include details of requests or responses such as request or response bodies. You can adjust the logging settings for all APIs, or override them for individual APIs. For example, adjust the sampling rate or the verbosity of the gateway log data, enable logging of LLM request or response messages, or disable logging for some APIs.

For details about the logging settings, see the [Diagnostic - Create or Update](/rest/api/apimanagement/diagnostic/create-or-update) and the [API diagnostic - Create or Update](/rest/api/apimanagement/api-diagnostic/create-or-update) REST API reference pages.

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
