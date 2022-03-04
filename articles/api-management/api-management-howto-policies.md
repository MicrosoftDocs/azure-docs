---
title: Policies in Azure API Management | Microsoft Docs
description: Learn how to create, edit, and configure policies in API Management. See code examples and other available resources.
services: api-management
documentationcenter: ''
author: dlepow

ms.service: api-management
ms.topic: article
ms.date: 03/01/2022
ms.author: danlep

---
# Policies in Azure API Management

In Azure API Management, API publishers can change API behavior through configuration using *policies*. Policies are a collection of statements that are run sequentially on the request or response of an API. Popular statements include:

* Format conversion from XML to JSON
* Call rate limiting to restrict the number of incoming calls from a developer 
* Filtering requests that come from certain IP addresses

Many more policies are available out of the box. For a complete list, see [API Management policy reference](api-management-policies.md).

Policies are applied inside the gateway between the API consumer and the managed API. While the gateway receives requests and forwards them, unaltered, to the underlying API, a policy can apply changes to both the inbound request and outbound response.

Unless the policy specifies otherwise, policy expressions can be used as attribute values or text values in any of the API Management policies. Some policies are based on policy expressions, such as the [Control flow][Control flow] and [Set variable][Set variable]. For more information, see the [Advanced policies][Advanced policies] and [Policy expressions][Policy expressions] articles.

## <a name="sections"> </a>Understanding policy configuration

Policy definitions are simple XML documents that describe a sequence of inbound and outbound statements. The policy editor in the Azure portal provides a guided experience to design and manage policy definitions, and you can also edit the XML directly. 
* For more information about configuring policies, see [Set or edit policies](set-edit-policies.md).
* For policy XML examples, see [API Management policy samples](./policies/index.md). 

The policy XML configuration is divided into `inbound`, `backend`, `outbound`, and `on-error` sections. This series of specified policy statements is executed in order for a request and a response.

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
    <!-- statements to be applied if there is an error condition go here -->
  </on-error>
</policies> 
```

### Error handling

If an error occurs during the processing of a request:
* Any remaining steps in the `inbound`, `backend`, or `outbound` sections are skipped.
* Execution jumps to the statements in the `on-error` section.

By placing policy statements in the `on-error` section, you can:
* Review the error using the `context.LastError` property.
* Inspect and customize the error response using the `set-body` policy.
* Configure what happens if an error occurs. 

For more information, see [Error handling in API Management policies](./api-management-error-handling-policies.md) 

## Scopes

API Management allows you to define policies at the following *scopes*, from most broad to most narrow:

* Global (all APIs)
* Product (APIs associated with a selected product)
* API (all operations in an API)
* Operation (single operation in an API) 

When configuring a policy, you must first select the scope at which the policy applies. 

:::image type="content" source="media/api-management-howto-policies/policy-scopes.png" alt-text="Policy scopes":::

### Things to know

* For fine-grained control for different API consumers, you can configure policy definitions at more than one scope
* Not all policies can be applied at each scope and policy section
* When configuring policy definitions at more than one scope, you control the policy evaluation order in each policy section by placement of the `base` element 

For more information, see [Set or edit policies](set-edit-policies.md#use-base-element-to-set-policy-evaluation-order).

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

In the example policy definition above:
* The `cross-domain` statement would execute first.
* The [`find-and-replace` policy](api-management-transformation-policies.md#Findandreplacestringinbody) would execute after any policies at a broader scope. 

>[!NOTE]
> If you remove the `base` element at the API scope, only policies configured at the API scope will be applied. Neither product nor global scope policies would be applied.

### Use policy expressions to modify requests

The following example uses [policy expressions][Policy expressions] and the [`set-header`](api-management-transformation-policies.md#SetHTTPheader) policy to add user data to the incoming request. The added header includes the user ID associated with the subscription key in the request, and the region where the gateway processing the request is hosted.

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



## Next steps

For more information about working with policies, see:

+ [Transform APIs](transform-api.md)
+ [Policy reference](./api-management-policies.md) for a full list of policy statements and their settings
+ [Policy samples](./policy-reference.md)	

[Policy Reference]: ./api-management-policies.md
[Product]: api-management-howto-add-products.md
[API]: api-management-howto-add-products.md
[Operation]: ./mock-api-responses.md

[Advanced policies]: ./api-management-advanced-policies.md
[Control flow]: ./api-management-advanced-policies.md#choose
[Set variable]: ./api-management-advanced-policies.md#set-variable
[Policy expressions]: ./api-management-policy-expressions.md

