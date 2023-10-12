---
title: Configure API for server-sent events in Azure API Management 
description: How to configure an API for server-sent events (SSE) in Azure API Management
author: dlepow
ms.service: api-management
ms.topic: how-to
ms.author: danlep
ms.date: 02/24/2022
---

# Configure API for server-sent events

This article provides guidelines for configuring an API in API Management that implements server-sent events (SSE). SSE is based on the HTML5 `EventSource` standard for streaming (pushing) data automatically to a client over HTTP after a client has established a connection.

> [!TIP]
> API Management also provides native support for [WebSocket APIs](websocket-api.md), which keep a single, persistent, bidrectional connection open between a client and server.

## Prerequisites

- An existing API Management instance. [Create one if you haven't already](get-started-create-service-instance.md).
- An API that implements SSE. [Import and publish](import-and-publish.md) the API to your API Management instance using one of the supported import methods. 

[!INCLUDE [premium-dev-standard-basic.md](../../includes/api-management-availability-premium-dev-standard-basic.md)]

## Guidelines for SSE

Follow these guidelines when using API Management to reach a backend API that implements SSE. 

* **Choose service tier for long-running HTTP connections** - SSE relies on a long-running HTTP connection. Long-running connections are supported in the dedicated API Management tiers, but not in the Consumption tier.

* **Keep idle connections alive** - If a connection between client and backend could be idle for 4 minutes or longer, implement a mechanism to keep the connection alive. For example, enable a TCP keepalive signal at the backend of the connection, or send traffic from the client side at least once per 4 minutes. 

    This configuration is needed to override the idle session timeout of 4 minutes that is enforced by the Azure Load Balancer, which is used in the API Management infrastructure.

* **Relay events immediately to clients** - Turn off response buffering on the [`forward-request` policy](forward-request-policy.md) so that events are immediately relayed to the clients. For example:

    ```xml
    <forward-request timeout="120" fail-on-error-status-code="true" buffer-response="false"/>
    ```

* **Avoid other policies that buffer responses** - Certain policies such as [`validate-content`](validate-content-policy.md) can also buffer response content and shouldn't be used with APIs that implement SSE.

* **Avoid logging request/response body for Azure Monitor , Application Insights and Event Hubs** - You can configure API request logging for Azure Monitor or Application Insights using diagnostic settings. The diagnostic settings allow you to log the request/response body at various stages of the request execution. For APIs that implement SSE, this can cause unexpected buffering which can lead to problems. Diagnostic settings for Azure Monitor and Application Insights configured at the global/All APIs scope apply to all APIs in the service. You can override the settings for individual APIs as needed. For APIs that implement SSE, ensure you have disabled request/response body logging for Azure Monitor, Application Insights and Event Hubs. 

* **Disable response caching** - To ensure that notifications to the client are timely, verify that [response caching](api-management-howto-cache.md) isn't enabled. For more information, see [API Management caching policies](api-management-caching-policies.md).

* **Test API under load** - Follow general practices to test your API under load to detect performance or configuration issues before going into production.  

## Next steps

* Learn more about [configuring policies](./api-management-howto-policies.md) in API Management.
* Learn about API Management [capacity](api-management-capacity.md).
