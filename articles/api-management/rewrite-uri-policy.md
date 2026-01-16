---
title: Azure API Management policy reference - rewrite-uri | Microsoft Docs
description: Reference for the rewrite-uri policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: azure-api-management
ms.topic: reference
ms.date: 07/23/2024
ms.author: danlep
---

# Rewrite URL

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

The `rewrite-uri` policy converts a request URL from its public form to the form expected by the web service.

Use this policy when you need to transform a human-friendly or browser-friendly URL into the URL format expected by the web service. Apply this policy only when exposing an alternative URL format, such as clean URLs, RESTful URLs, user-friendly URLs, or SEO-friendly URLs that are purely structural and don't contain a query string but instead contain only the path of the resource (after the scheme and the authority). You often make this change for aesthetic, usability, or search engine optimization (SEO) purposes.

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]

## Policy statement

```xml
<rewrite-uri template="uri template" copy-unmatched-params="true | false" />
```


## Attributes

|Name|Description|Required|Default|
|----------|-----------------|--------------|-------------|
|template|The actual web service URL with any query string parameters. Policy expressions are allowed. When expressions are used, the whole value must be an expression. |Yes|N/A|
|copy-unmatched-params|Specifies whether query parameters in the incoming request that aren't present in the original URL template are added to the URL defined by the rewrite template. Policy expressions are allowed.|No|`true`|

## Usage

- [**Policy sections:**](./api-management-howto-policies.md#understanding-policy-configuration) inbound
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) global, workspace, product, API, operation
-  [**Gateways:**](api-management-gateways-overview.md) classic, v2, consumption, self-hosted, workspace

### Usage notes

You can only add query string parameters by using the policy. You can't add extra template path parameters in the rewritten URL.

## Examples

### Example 1: Basic URL rewrite

In the following example, the public URL is rewritten to match the backend service URL format, and query parameters are included based on other logic.

- Public URL - `http://api.example.com/storenumber/ordernumber`

- Request URL - `http://api.example.com/v2/US/hardware/storenumber/ordernumber?City&State`

```xml
<policies>
    <inbound>
        <base />
        <rewrite-uri template="/v2/US/hardware/{storenumber}/{ordernumber}?City=city&State=state" />
    </inbound>
    <outbound>
        <base />
    </outbound>
</policies>
```

### Example 2: Copy unmatched parameters

In the following example, the public URL is rewritten to match the backend service URL format, and the policy copies any unmatched query parameters to the new URL.

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
### Example 3: Don't copy unmatched parameters

In the following example, the public URL is rewritten to match the backend service URL format, and the policy drops any unmatched query parameters.

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

### Example 4: Use policy expression in the template

In the following example, the policy uses expressions in the template to construct the request to the backend.

```xml
<policies>
    <inbound>
        <base />
        <set-variable name="apiVersion" value="/v3" />
        <rewrite-uri template="@("/api" + context.Variables["apiVersion"] + context.Request.Url.Path)" />
    </inbound>
</policies>

```
## Related policies

- [Transformation](api-management-policies.md#transformation)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]