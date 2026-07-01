---
title: Govern MCP Servers with Products - API Mnagement
description: Learn how to package one or more MCP servers into an API Management product so consumers go through the same subscription, approval, and quota workflows your organization already uses for REST APIs.

ms.date: 06/23/2026
ms.service: azure-api-management
ms.topic: how-to
---

# Govern MCP servers with API Management products 

In this article, you learn how to package one or more MCP servers into an API Management product so consumers go through the same subscription, approval, and policy assignment workflows your organization already uses for REST APIs. 
 
## Prerequisites 

- An API Management instance. To create one, see [Create an Azure API Management instance](get-started-create-service-instance.md). 

- At least one MCP server in your instance. See [Expose a REST API as an MCP server](export-rest-mcp-server.md) or [Expose an existing MCP server](expose-existing-mcp-server.md). 

- Permissions to manage products in API Management (the API Management Service Contributor role or equivalent). 

## Why use products for MCP servers 

Products are API Management's packaging unit. They control which consumers can subscribe, whether approval is required, what policies such as quotas apply, and how the offering appears in the developer portal. Because MCP servers are first-class API Management resources, they support the same product primitives. 

Typical scenarios: 

- A Sales tools product contains a CRM MCP server, a Pricing MCP server, and a Quote MCP server: one subscription grants access to all three. 

- Free and paid plans with different quotas. 

- Per-team subscriptions for chargeback reporting. 

## Add an MCP server to a product 

You can add an MCP server to an existing product directly from the MCP server's settings page, without navigating to the Products blade. 

1. In the [Azure portal](https://portal.azure.com/), go to your API Management instance. 
1. In the sidebar menu, select **APIs** > **MCP servers**, and then select the MCP server that you want to govern. 
1. Select **Settings**, and then select the **Products** tab. 
1. Select one or more existing products to add the MCP server to. Select **Save**. 

Alternatively, to create a new product first, go to **Products** > **+ Add**, and complete the form. Then return to the MCP server's **Settings** > **Products** tab to bind it. For information about creating a product, see [Tutorial: Create and manage a product](api-management-howto-add-products.md).

## Subscribe and get keys 

A consumer can subscribe to a product that includes an MCP server and receive the necessary keys to access it by following these steps:

1. In the developer portal, a consumer selects the product and chooses **Subscribe**. If approval is required, an administrator approves the request. 

1. The consumer receives a primary key and secondary key. The same key authorizes calls to every MCP server in the product. 

1. The consumer configures their MCP client (for example, Visual Studio Code or Claude Desktop) to send the key in the `Ocp-Apim-Subscription-Key` header. 

 
> [!TIP]
> To rotate a subscription key without disrupting consumers, regenerate the secondary key, update clients to use it, and then regenerate the primary key. 

## Apply quotas and rate limits 

Use product-scoped [policies](api-management-howto-policies.md) to cap usage per subscription or per consumer. For example:

- The [quota](quota-policy.md) policy enforces a long-window call ceiling (for example, per month). 

- The [rate-limit](rate-limit-policy.md) policy enforces a short-window throttle (for example, per minute). 

- The [quota-by-key](quota-by-key-policy.md) policy keys the counter off `context.Subscription.Id` or a JWT claim so each consumer gets its own bucket. 
 
> [!NOTE]
> These policies count tool-call requests. To cap LLM token consumption, use the [llm-token-limit](llm-token-limit-policy.md) policy on the MCP server's backing API. 

 
To throttle one noisy tool on an MCP server, key a counter on the tool name: 

```xml
<quota-by-key calls="50" renewal-period="60" 
    counter-key="@(context.Variables.GetValueOrDefault<string>("gen_ai.tool.name",,""))" />
```

> [!IMPORTANT]
> Don't access `context.Response.Body` from policies attached to product with bound MCP servers. MCP responses are streamed, and reading the body breaks the stream. 

## Related content

- [What are MCP servers in API Management?](mcp-server-overview.md)

- [Secure access to MCP servers](secure-mcp-servers.md)


