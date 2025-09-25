---
title: Policies in Azure API Management 
description: Learn about API Management policies, which change API behavior through configuration. Policy statements run sequentially on an API request or response.
services: api-management
author: dlepow

ms.service: azure-api-management
ms.topic: concept-article
ms.date: 05/13/2025
ms.author: danlep

#customer intent: As an API publisher, I want to learn about API Management policies so that I can use them to change API behavior. 

---

# Policies in Azure API Management

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

In Azure API Management, API publishers can change API behavior through configuration by using *policies*. This article describes how to use policies. 

Policies are a collection of statements that are run sequentially on the request or response of an API. API Management provides more than 75 policies out of the box that you can configure to address common API scenarios like authentication, rate limiting, caching, and transformation of requests or responses. For a complete list, see [API Management policy reference](api-management-policies.md).

Popular policies include:

* Format conversion from XML to JSON.
* Call rate limiting to restrict the number of incoming calls from a developer. 
* Filtering of requests that come from certain IP addresses.


Policies are applied inside the gateway between the API consumer and the managed API. Although the gateway receives requests and forwards them, unaltered, to the underlying API, a policy can apply changes to both the inbound request and the outbound response.

## Understanding policy configuration

Policy definitions are simple XML documents that describe a sequence of statements to apply to requests and responses. To help you configure policy definitions, the portal provides these options:

* A guided, form-based editor to simplify configuring popular policies without coding XML 
* A code editor where you can insert XML snippets or edit XML directly 

For more information about configuring policies, see [Set or edit policies](set-edit-policies.md).

The policy XML configuration is divided into `inbound`, `backend`, `outbound`, and `on-error` sections. This series of specified policy statements runs in order for a request and a response. Here's what it looks like: 

```xml
<policies>
  <inbound>
    <!-- statements to be applied to the request go here -->
  </inbound>
  <backend>
    <!-- statements to be applied before the request is forwarded to 
         the backend service go here -->
  </backend>
  <outbound>
    <!-- statements to be applied to the response go here -->
  </outbound>
  <on-error>
    <!-- statements to be applied if there's an error condition go here -->
  </on-error>
</policies> 
```

For policy XML examples, see [API Management policy snippets repo](https://github.com/Azure/api-management-policy-snippets). 

### Error handling

If an error occurs during the processing of a request:
* Any remaining steps in the `inbound`, `backend`, or `outbound` sections are skipped.
* Execution jumps to the statements in the `on-error` section.

By placing policy statements in the `on-error` section, you can:
* Review the error by using the `context.LastError` property.
* Inspect and customize the error response by using the `set-body` policy.
* Configure what happens if an error occurs. 

For more information, see [Error handling in API Management policies](./api-management-error-handling-policies.md). 

## Policy expressions

Unless the policy specifies otherwise, [policy expressions](api-management-policy-expressions.md) can be used as attribute values or text values in any of the API Management policies. A policy expression is one of the following:

* A single C# statement enclosed in `@(expression)`
* A multi-statement C# code block, enclosed in `@{expression}`, that returns a value

Each expression has access to the implicitly provided `context` variable and an allowed subset of .NET Framework types.

Policy expressions provide a sophisticated means to control traffic and modify API behavior without requiring you to write specialized code or modify backend services. Some policies are based on policy expressions, such as [Control flow][Control flow] and [Set variable][Set variable]. 

## Scopes

API Management enables you to define policies at the following scopes, presented here from broadest to narrowest:

* Global (all APIs)
* Workspace (all APIs associated with a selected workspace)
* Product (all APIs associated with a selected product)
* API (all operations in an API)
* Operation (a single operation in an API) 

When configuring a policy, you must first select the scope at which the policy applies. 

:::image type="content" source="media/api-management-howto-policies/policy-scopes.png" alt-text="Diagram that illustrates the five policy scopes." lightbox="media/api-management-howto-policies/policy-scopes.png":::

### Things to know

* For fine-grained control for different API consumers, you can configure policy definitions at more than one scope.
* Not all policies are supported at each scope and policy section.
* When configuring policy definitions at more than one scope, you control policy inheritance and the policy evaluation order in each policy section by placement of the `base` element.
    > [!IMPORTANT]
    > As a best practice, include a `base` element at the beginning of each policy section to inherit policies from the parent scope. This ensures that any policies defined at a higher level are not inadvertently overridden or ignored. A built-in [Azure Policy definition](policy-reference.md) (`API Management policies should inherit parent scope policies using <base/>`) is available to audit or enforce this best practice.

* Policies applied to API requests are also affected by the request context, including the presence or absence of a subscription key used in the request, the API or product scope of the subscription key, and whether the API or product requires a subscription. 

    [!INCLUDE [api-management-product-policy-alert](../../includes/api-management-product-policy-alert.md)]

For more information, see:

* [Set or edit policies](set-edit-policies.md#use-base-element-to-set-policy-evaluation-order)
* [Subscriptions in API Management](api-management-subscriptions.md)
* [Azure Policy definitions for API Management](policy-reference.md)

### GraphQL resolver policies

In API Management, a [GraphQL resolver](configure-graphql-resolver.md) is configured with policies scoped to a specific operation type and field in a [GraphQL schema](graphql-apis-overview.md#resolvers).

* Currently, API Management supports GraphQL resolvers that specify either HTTP API, Azure Cosmos DB, or Azure SQL data sources. For example, you can configure a single [`http-data-source`](http-data-source-policy.md) policy with elements to specify a request to (and optionally response from) an HTTP data source.
* You can't include a resolver policy in policy definitions at other scopes, such as API, product, or all APIs. The policy also doesn't inherit policies configured at other scopes.
* The gateway evaluates a resolver-scoped policy after any configured `inbound` and `backend` policies in the policy execution pipeline.

For more information, see [Configure a GraphQL resolver](configure-graphql-resolver.md).

[!INCLUDE [api-management-policies-azure-copilot](../../includes/api-management-policies-azure-copilot.md)]

## Examples

### Apply policies specified at different scopes

If you have a policy at the global level and a policy configured for an API, both policies can be applied whenever that particular API is used. API Management allows for deterministic ordering of combined policy statements via the `base` element. 

Example policy definition at API scope:

```xml
<policies>
    <inbound>
        <cross-domain />
        <base />
        <find-and-replace from="xyz" to="abc" />
    </inbound>
</policies>
```

In the preceding example policy definition:
* The `cross-domain` statement runs first.
* The [`find-and-replace` policy](find-and-replace-policy.md) runs after any policies at a broader scope. 

>[!NOTE]
> If you remove the `base` element at the API scope, only policies configured at the API scope will be applied. Policies configured at product and broader scopes won't be applied.

### Use policy expressions to modify requests

The following example uses [policy expressions][Policy expressions] and the [`set-header`](set-header-policy.md) policy to add user data to incoming requests. The added header includes the user ID that's associated with the subscription key in the request, and the region where the gateway processing the request is hosted.

```xml
<policies>
    <inbound>
        <base />
        <set-header name="x-request-context-data" exists-action="override">
            <value>@(context.User.Id)</value>
            <value>@(context.Deployment.Region)</value>
      </set-header>
    </inbound>
</policies> 

```

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]

[Policy Reference]: ./api-management-policies.md
[Product]: api-management-howto-add-products.md
[API]: api-management-howto-add-products.md
[Operation]: ./mock-api-responses.md

[Policy control and flow policies]: ./api-management-policies.md#policy-control-and-flow
[Control flow]: choose-policy.md
[Set variable]: set-variable-policy.md
[Policy expressions]: ./api-management-policy-expressions.md

