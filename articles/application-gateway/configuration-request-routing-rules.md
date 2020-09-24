---
title: Azure Application Gateway request routing rules configuration
description: This article describes how to configure the Azure Application Gateway request routing rules.
services: application-gateway
author: vhorne
ms.service: application-gateway
ms.topic: conceptual
ms.date: 09/09/2020
ms.author: surmb
---

# Application Gateway request routing rules

When you create an application gateway using the Azure portal, you create a default rule (*rule1*). This rule binds the default listener (*appGatewayHttpListener*) with the default back-end pool (*appGatewayBackendPool*) and the default back-end HTTP settings (*appGatewayBackendHttpSettings*). After you create the  gateway, you can edit the settings of the default rule or create new rules.

## Rule type

When you create a rule, you choose between [*basic* and *path-based*](https://docs.microsoft.com/azure/application-gateway/application-gateway-components#request-routing-rules).

- Choose basic if you want to forward all requests on the associated listener (for example, *blog<i></i>.contoso.com/\*)* to a single back-end pool.
- Choose path-based if you want to route requests from specific URL paths to specific back-end pools. The path pattern is applied only to the path of the URL, not to its query parameters.

### Order of processing rules

For the v1 and v2 SKU, pattern matching of incoming requests is processed in the order that the paths are listed in the URL path map of the path-based rule. If a request matches the pattern in two or more paths in the path map, the path that's listed first is matched. And the request is forwarded to the back end that's associated with that path.

## Associated listener

Associate a listener to the rule so that the *request-routing rule* that's associated with the listener is evaluated to determine the back-end pool to route the request to.

## Associated back-end pool

Associate to the rule the back-end pool that contains the back-end targets that serve requests that the listener receives.

 - For a basic rule, only one back-end pool is allowed. All requests on the associated listener are forwarded to that back-end pool.

 - For a path-based rule, add multiple back-end pools that correspond to each URL path. The requests that match the URL path that's entered are forwarded to the corresponding back-end pool. Also, add a default back-end pool. Requests that don't match any URL path in the rule are forwarded to that pool.

## Associated back-end HTTP setting

Add a back-end HTTP setting for each rule. Requests are routed from the application gateway to the back-end targets by using the port number, protocol, and other information that's specified in this setting.

For a basic rule, only one back-end HTTP setting is allowed. All requests on the associated listener are forwarded to the corresponding back-end targets by using this HTTP setting.

For a path-based rule, add multiple back-end HTTP settings that correspond to each URL path. Requests that match the URL path in this setting are forwarded to the corresponding back-end targets by using the HTTP settings that correspond to each URL path. Also, add a default HTTP setting. Requests that don't match any URL path in this rule are forwarded to the default back-end pool by using the default HTTP setting.

## Redirection setting

If redirection is configured for a basic rule, all requests on the associated listener are redirected to the target. This is *global* redirection. If redirection is configured for a path-based rule, only requests in a specific site area are redirected. An example is a shopping cart area that's denoted by */cart/\**. This is *path-based* redirection.

For more information about redirects, see [Application Gateway redirect overview](redirect-overview.md).

### Redirection type

Choose the type of redirection required: *Permanent(301)*, *Temporary(307)*, *Found(302)*, or *See other(303)*.

### Redirection target

Choose another listener or an external site as the redirection target.

#### Listener

Choose listener as the redirection target to redirect traffic from one listener to another on the gateway. This setting is required when you want to enable HTTP-to-HTTPS redirection. It redirects traffic from the source listener that checks for incoming HTTP requests to the destination listener that checks for incoming HTTPS requests. You can also choose to include the query string and path from the original request in the request that's forwarded to the redirection target.

![Application Gateway components dialog box](./media/configuration-overview/configure-redirection.png)

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