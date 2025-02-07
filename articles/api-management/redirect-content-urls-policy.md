---
title: Azure API Management policy reference - redirect-content-urls | Microsoft Docs
description: Reference for the redirect-content-urls policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: azure-api-management
ms.topic: article
ms.date: 07/23/2024
ms.author: danlep
---

# Mask URLs in content

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

The `redirect-content-urls` policy rewrites (masks) links in the response body. Use in the outbound section to rewrite response body links to the backend service to make them point to the gateway instead. For example, you might do this to hide URLs of the original backend service when they appear in the response. Use in the inbound section for an opposite effect.

> [!NOTE]
>  This policy does not change any header values such as `Location` headers. To change header values, use the [set-header](set-header-policy.md) policy.

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]

## Policy statement

```xml
<redirect-content-urls />
```

## Usage

- [**Policy sections:**](./api-management-howto-policies.md#sections) inbound, outbound
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) global, workspace, product, API, operation
-  [**Gateways:**](api-management-gateways-overview.md) classic, v2, consumption, self-hosted, workspace

### Usage notes

- This policy can only be used once in a policy section.


## Example

```xml
<redirect-content-urls />
```

For example, consider the following image, which shows an API response body that includes the original backend service URLs.

:::image type="content" source="media/redirect-content-urls-policy/original-response.png" alt-text="Screenshot showing original outbound response in test console in the portal.":::

After the `redirect-content-urls` policy is configured in the outbound section, the response body is rewritten to point to the gateway, in this case, `https://apim-hello-world.azure-api.net`.

:::image type="content" source="media/redirect-content-urls-policy/test-replaced-url.png" alt-text="Screenshot showing replaced URLs in test console in the portal.":::

## Related policies

* [Transformation](api-management-policies.md#transformation)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]
