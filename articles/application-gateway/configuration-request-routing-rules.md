---
title: Azure Application Gateway request routing rules configuration
description: This article describes how to configure the Azure Application Gateway request routing rules.
services: application-gateway
author: mbender-ms
ms.service: azure-application-gateway
ms.topic: concept-article
ms.date: 08/20/2026
ms.author: mbender
# Customer intent: As a cloud architect, I want to configure request routing rules for an application gateway, so that I can effectively manage and direct client traffic to appropriate backend pools based on URL patterns and optimize application performance.
---

# Application Gateway request routing rules

Azure Application Gateway routing rules define how incoming traffic is matched and sent to the right backend. For HTTP/HTTPS protocols, they can route all requests to one backend or use URL paths to direct traffic to different backend pools. A rule binds the frontend Listener, a Backend Setting and a Backend Pool.

## Rule type

When you create a rule, you choose between Basic, Advanced and Path-based.

- Choose Basic if you want to forward all requests on the associated listener (for example, *blog<i></i>.contoso.com/\*)* to a single backend pool.
- Choose Advanced if you want routing decisions based on the HTTP request attributes.
- Choose Path-based if you want to route requests from specific URL paths to specific backend pools. The path pattern is applied only to the path of the URL, not to its query parameters.

:::image type="complex" source="./media/advanced-rules/rules-workflow.png" lightbox="./media/advanced-rules/rules-workflow.png" alt-text="Diagram of Application Gateway listeners, routing rules, backend pools, backend settings, and traffic manipulation features.":::
The diagram shows how Application Gateway listeners connect to routing rules, which evaluate incoming requests and direct them to backend pools. Rules also use backend settings and can interact with optional traffic or content manipulation features. Basic, path-based, and advanced rules provide increasingly flexible ways to route requests. The colors distinguish new, existing, and existing optional functionality.
:::image-end:::

[!INCLUDE [preview-advanced-routing-rules](../networking/includes/azure-application-gateway/preview-advanced-routing-rules.md)]

### Order of processing rules

The ordering of rules can be established by providing a Priority value to the request routing rules. You can specify an integer value from 1 to 20000 with 1 being the highest priority and 20000 being the lowest priority. If incoming client traffic matches with multiple listeners, the request routing rule with highest priority is used to serve the request. Each request routing rule must have a unique priority value. For more information about rules evaluation order, see [Request Routing rules evaluation order](multiple-site-overview.md#request-routing-rules-evaluation-order).

## Associated listener

Associate a listener to the rule so that the *request-routing rule* that's associated with the listener is evaluated to determine the backend pool to route the request to.

## Associated backend pool

Associate to the rule the backend pool that contains the backend targets that serve requests that the listener receives.

 - For a basic rule, only one backend pool is allowed. All requests on the associated listener are forwarded to that backend pool.

 - For a path-based rule, add multiple backend pools that correspond to each URL path. The requests that match the URL path that's entered are forwarded to the corresponding backend pool. Also, add a default backend pool. Requests that don't match any URL path in the rule are forwarded to that pool.

## Associated backend HTTP setting

Add a backend HTTP setting for each rule. Requests are routed from the application gateway to the backend targets by using the port number, protocol, and other information that's specified in this setting.

For a basic rule, only one backend HTTP setting is allowed. All requests on the associated listener are forwarded to the corresponding backend targets by using this HTTP setting.

For a path-based rule, add multiple backend HTTP settings that correspond to each URL path. Requests that match the URL path in this setting are forwarded to the corresponding backend targets by using the HTTP settings that correspond to each URL path. Also, add a default HTTP setting. Requests that don't match any URL path in this rule are forwarded to the default backend pool by using the default HTTP setting.

## Redirection setting

If redirection is configured for a basic rule, all requests on the associated listener are redirected to the target. This is *global* redirection. If redirection is configured for a path-based rule, only requests in a specific site area are redirected. An example is a shopping cart area that's denoted by */cart/\**. This is *path-based* redirection.

For more information about redirects, see [Application Gateway redirect overview](redirect-overview.md).

### Redirection type

Choose the type of redirection required: *Permanent(301)*, *Temporary(307)*, *Found(302)*, or *See other(303)*.

### Redirection target

Choose another listener or an external site as the redirection target.

#### Listener

Choose listener as the redirection target to redirect traffic from one listener to another on the gateway. This setting is required when you want to enable HTTP-to-HTTPS redirection. It redirects traffic from the source listener that checks for incoming HTTP requests to the destination listener that checks for incoming HTTPS requests. You can also choose to include the query string and path from the original request in the request that's forwarded to the redirection target.

:::image type="content" source="./media/configuration-overview/configure-redirection.png" alt-text="Screenshot of the Application Gateway redirection configuration settings.":::

For more information about HTTP-to-HTTPS redirection, see:
- [HTTP-to-HTTPS redirection by using the Azure portal](redirect-http-to-https-portal.md)
- [HTTP-to-HTTPS redirection by using PowerShell](redirect-http-to-https-powershell.md)
- [HTTP-to-HTTPS redirection by using the Azure CLI](redirect-http-to-https-cli.md)

#### External site

Choose external site when you want to redirect the traffic on the listener that's associated with this rule to an external site. You can choose to include the query string from the original request in the request that's forwarded to the redirection target. You can't forward the path to the external site that was in the original request.

For more information about redirection, see:
- [Redirect traffic to an external site by using PowerShell](redirect-external-site-powershell.md)
- [Redirect traffic to an external site by using the CLI](redirect-external-site-cli.md)

## Rewrite HTTP headers and URL

By using rewrite rules, you can add, remove, or update HTTP(S) request and response headers as well as URL path and query string parameters as the request and response packets move between the client and backend pools via the application gateway.

The headers and URL parameters can be set to static values or to other headers and server variables. This helps with important use cases, such as extracting client IP addresses, removing sensitive information about the backend, adding more security, and so on.
For more information, see:

 - [Rewrite HTTP headers and URL overview](rewrite-http-headers-url.md)
 - [Configure HTTP header rewrite](rewrite-http-headers-portal.md)
 - [Configure URL rewrite](rewrite-url-portal.md)

## Next steps

- [Learn about HTTP settings](configuration-http-settings.md)
