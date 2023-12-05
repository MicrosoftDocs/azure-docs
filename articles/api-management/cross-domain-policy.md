---
title: Azure API Management policy reference - cross-domain | Microsoft Docs
description: Reference for the cross-domain policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: article
ms.date: 12/07/2022
ms.author: danlep
---

# Allow cross-domain calls

Use the `cross-domain` policy to make the API accessible from Adobe Flash and Microsoft Silverlight browser-based clients.

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]


## Policy statement

```xml
<cross-domain>
    <!-Policy configuration is in the Adobe cross-domain policy file format,
        see https://www.adobe.com/devnet-docs/acrobatetk/tools/AppSec/CrossDomain_PolicyFile_Specification.pdf-->
</cross-domain>
```

> [!CAUTION]
> Use the `*` wildcard with care in policy settings. This configuration may be overly permissive and may make an API more vulnerable to certain [API security threats](mitigate-owasp-api-threats.md#security-misconfiguration).

## Elements

Child elements must conform to the [Adobe cross-domain policy file specification](https://www.adobe.com/devnet-docs/acrobatetk/tools/AppSec/CrossDomain_PolicyFile_Specification.pdf).

## Usage

- [**Policy sections:**](./api-management-howto-policies.md#sections) inbound
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) global
-  [**Gateways:**](api-management-gateways-overview.md) dedicated, consumption, self-hosted

## Example

```xml
<cross-domain>
    <cross-domain-policy>
        <allow-http-request-headers-from domain='*' headers='*' />
    </cross-domain-policy>
</cross-domain>
```

## Related policies

* [API Management cross-domain policies](api-management-cross-domain-policies.md)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]