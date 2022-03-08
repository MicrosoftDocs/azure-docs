---
title: Policies in Azure API Management | Microsoft Docs
description: Learn how to create, edit, and configure policies in API Management. See code examples and other available resources.
services: api-management
documentationcenter: ''
author: dlepow
manager: erikre
editor: ''

ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.topic: article
ms.date: 08/25/2021
ms.author: danlep

---
# Policies in Azure API Management

In Azure API Management, API publishers can change API behavior through configuration using policies. Policies are a collection of statements executed sequentially on the request or response of an API. Popular statements include:

* Format conversion from XML to JSON.
* Call rate limiting to restrict the number of incoming calls from a developer. 

Many more policies are available out of the box.

Policies are applied inside the gateway between the API consumer and the managed API. While the gateway receives requests and forwards them, unaltered, to the underlying API, a policy can apply changes to both the inbound request and outbound response.

Unless the policy specifies otherwise, policy expressions can be used as attribute values or text values in any of the API Management policies. Some policies are based on policy expressions, such as the [Control flow][Control flow] and [Set variable][Set variable]. For more information, see the [Advanced policies][Advanced policies] and [Policy expressions][Policy expressions] articles.

## <a name="sections"> </a>Understanding policy configuration

Policy definitions are simple XML documents that describe a sequence of inbound and outbound statements. You can edit the XML directly in the definition window, which also provides:
* A list of statements to the right.
* Statements applicable to the current scope enabled and highlighted.

Clicking an enabled statement will add the appropriate XML at the cursor in the definition view. 

> [!NOTE]
> If the policy that you want to add is not enabled, ensure that you are in the correct scope for that policy. Each policy statement is designed for use in certain scopes and policy sections. To review the policy sections and scopes for a policy, check the **Usage** section in the [Policy Reference][Policy Reference].

The configuration is divided into `inbound`, `backend`, `outbound`, and `on-error`. This series of specified policy statements is executed in order for a request and a response.

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

If an error occurs during the processing of a request:
* Any remaining steps in the `inbound`, `backend`, or `outbound` sections are skipped.
* Execution jumps to the statements in the `on-error` section.

By placing policy statements in the `on-error` section, you can:
* Review the error using the `context.LastError` property.
* Inspect and customize the error response using the `set-body` policy.
* Configure what happens if an error occurs. 

For more information, see [Error handling in API Management policies](./api-management-error-handling-policies.md) for error codes for:
* Built-in steps
* Errors that may occur during the processing of policy statements. 

## <a name="scopes"> </a>How to configure policies

For information on how to configure policies, see [Set or edit policies](set-edit-policies.md).

## Policy Reference

See the [Policy reference](./api-management-policies.md) for a full list of policy statements and their settings.

## Policy samples

See [Policy samples](./policy-reference.md) for more code examples.

## Examples

### Apply policies specified at different scopes

If you have a policy at the global level and a policy configured for an API, both policies will be applied whenever that particular API is used. API Management allows for deterministic ordering of combined policy statements via the `base` element. 

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
* The `cross-domain` statement would execute before any higher policies.
* The `find-and-replace` policy would execute after any higher policies. 

>[!NOTE]
> If you remove the `<base />` tag at the API scope, only policies configured at the API scope will be applied. Neither product nor global scope policies would be applied.

### Restrict incoming requests

To add a new statement to restrict incoming requests to specified IP addresses, place the cursor just inside the content of the `inbound` XML element and click the **Restrict caller IPs** statement.

![Restriction policies][policies-restrict]

This will add an XML snippet to the `inbound` element that provides guidance on how to configure the statement.

```xml
<ip-filter action="allow | forbid">
    <address>address</address>
    <address-range from="address" to="address"/>
</ip-filter>
```

To limit inbound requests and accept only those from an IP address of 1.2.3.4 modify the XML as follows:

```xml
<ip-filter action="allow">
    <address>1.2.3.4</address>
</ip-filter>
```

## Next steps

For more information working with policies, see:

+ [Transform APIs](transform-api.md)
+ [Policy Reference](./api-management-policies.md) for a full list of policy statements and their settings
+ [Policy samples](./policy-reference.md)	

[Policy Reference]: ./api-management-policies.md
[Product]: api-management-howto-add-products.md
[API]: api-management-howto-add-products.md
[Operation]: ./mock-api-responses.md

[Advanced policies]: ./api-management-advanced-policies.md
[Control flow]: ./api-management-advanced-policies.md#choose
[Set variable]: ./api-management-advanced-policies.md#set-variable
[Policy expressions]: ./api-management-policy-expressions.md

[policies-restrict]: ./media/api-management-howto-policies/api-management-policies-restrict.png
