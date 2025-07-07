---
author: dlepow
ms.service: azure-api-management
ms.topic: include
ms.date: 11/04/2024
ms.author: danlep
---
> [!IMPORTANT]
> * API Management no longer supports subscriptions for tracing or the **Ocp-Apim-Trace** header.
> * To improve API security, tracing can now be enabled at the level of an individual API by obtaining a time-limited token using the API Management REST API, and passing the token in a request to the gateway. For details, see [Enable tracing of an API](../articles/api-management/api-management-howto-api-inspector.md#enable-tracing-for-an-api).
> * Take care when enabling tracing, as it can expose sensitive information in the trace data. Ensure that you have appropriate security measures in place to protect the trace data.
