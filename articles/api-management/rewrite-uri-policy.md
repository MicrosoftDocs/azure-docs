---
title: Azure API Management policy reference - rewrite-uri | Microsoft Docs
description: Reference for the rewrite-uri policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: article
ms.date: 03/28/2023
ms.author: danlep
---

# Rewrite URL

The `rewrite-uri` policy converts a request URL from its public form to the form expected by the web service, as shown in the following example.

- Public URL - `http://api.example.com/storenumber/ordernumber`

- Request URL - `http://api.example.com/v2/US/hardware/storenumber&ordernumber?City&State`

This policy can be used when a human and/or browser-friendly URL should be transformed into the URL format expected by the web service. This policy only needs to be applied when exposing an alternative URL format, such as clean URLs, RESTful URLs, user-friendly URLs or SEO-friendly URLs that are purely structural URLs that don't contain a query string and instead contain only the path of the resource (after the scheme and the authority). This is often done for aesthetic, usability, or search engine optimization (SEO) purposes.

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]

## Policy statement

```xml
<rewrite-uri template="uri template" copy-unmatched-params="true | false" />
```


## Attributes

|Name|Description|Required|Default|
|----------|-----------------|--------------|-------------|
|template|The actual web service URL with any query string parameters. Policy expressions are allowed. When expressions are used, the whole value must be an expression. |Yes|N/A|
|copy-unmatched-params|Specifies whether query parameters in the incoming request not present in the original URL template are added to the URL defined by the rewrite template. Policy expressions are allowed.|No|`true`|

## Usage

- [**Policy sections:**](./api-management-howto-policies.md#sections) inbound
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) global, product, API, operation
-  [**Gateways:**](api-management-gateways-overview.md) dedicated, consumption, self-hosted

### Usage notes

You can only add query string parameters using the policy. You can't add extra template path parameters in the rewrite URL.

## Example

```xml
<policies>
    <inbound>
        <base />
        <rewrite-uri template="/v2/US/hardware/{storenumber}&{ordernumber}?City=city&State=state" />
    </inbound>
    <outbound>
        <base />
    </outbound>
</policies>
```
```xml
<!-- Assuming incoming request is /get?a=b&c=d and operation template is set to /get?a={b} -->
<policies>
    <inbound>
        <base />
        <rewrite-uri template="/put" />
    </inbound>
    <outbound>
        <base />
    </outbound>
</policies>
<!-- Resulting URL will be /put?c=d -->
```
```xml
<!-- Assuming incoming request is /get?a=b&c=d and operation template is set to /get?a={b} -->
<policies>
    <inbound>
        <base />
        <rewrite-uri template="/put" copy-unmatched-params="false" />
    </inbound>
    <outbound>
        <base />
    </outbound>
</policies>
<!-- Resulting URL will be /put -->
```

## Related policies

- [API Management transformation policies](api-management-transformation-policies.md)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]