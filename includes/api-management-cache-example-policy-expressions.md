---
author: dlepow
ms.service: azure-api-management
ms.topic: include
ms.date: 11/24/2025
ms.author: danlep
---


### Example using policy expressions

This example shows how to configure API Management response caching duration that matches the response caching of the backend service as specified by the backend service's `Cache-Control` directive. 

```xml
<!-- The following cache policy snippets demonstrate how to control API Management response cache duration with Cache-Control headers sent by the backend service. -->

<!-- Copy this snippet into the inbound section -->
<cache-lookup vary-by-developer="false" vary-by-developer-groups="false" downstream-caching-type="public" must-revalidate="true" >
  <vary-by-header>Accept</vary-by-header>
  <vary-by-header>Accept-Charset</vary-by-header>
</cache-lookup>
 <rate-limit calls="10" renewal-period="60" />

<!-- Copy this snippet into the outbound section. Note that cache duration is set to the max-age value provided in the Cache-Control header received from the backend service or to the default value of 5 min if none is found  -->
<cache-store duration="@{
    var header = context.Response.Headers.GetValueOrDefault("Cache-Control","");        
    var maxAge = Regex.Match(header, "@(max-age=(?<maxAge>\\d+))").Groups["maxAge"]?.Value;
    return (!string.IsNullOrEmpty(maxAge))?int.Parse(maxAge):300; }" />
```

For more information, see [Policy expressions](../articles/api-management/api-management-policy-expressions.md) and [Context variable](../articles/api-management/api-management-policy-expressions.md#ContextVariables).