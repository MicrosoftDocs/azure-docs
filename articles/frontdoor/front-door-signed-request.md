---
title: Configure signed URLs using the rules engine in Azure Front Door (preview)
titleSuffix: Azure Front Door
description: This article provides an overview of the Azure Front Door signed URL feature.
author: smistry
ms.author: smistry
ms.service: azure-frontdoor
ms.topic: concept-article
ms.date: 09/04/2025
ms.custom: devx-track-arm-template
zone_pivot_groups: front-door-tiers
---

## Overview

::: zone pivot="front-door-standard-premium"

Azure Front Door (AFD) supports Signed URL as a security feature that enables fine-grained access control to your content. This is especially useful for scenarios like premium content delivery, temporary access to assets, securing APIs, and geo-restricted access. Signed URL works by validating a cryptographic signature included in the request, which is generated using a shared secret and includes parameters such as expiration time and key ID.

## How Signed URL Works

1. The client authenticates with your origin server.
2. The origin generates a signature using a shared secret, expiration time, and key ID.
3. The client receives the signed URL and uses it to request content from Azure Front Door.
4. Azure Front Door validates the signature using the configured rules engine.
5. If valid, the content is served. If not, a 403 Forbidden response is returned.

What would cause a 403 Forbidden response?

* The signature is expired.
* The signature is invalid.
* The KeyID used in the request is not configured for this route.

## Integration with Rules Engine

 Signed URL is implemented as a Rules Engine action called Signed Request. This action is evaluated as part of a rule set associated with a route in your AFD profile.

### Terminology

* **Signed Request Key**: A secret stored in Azure Key Vault used to generate and validate signatures.
* **Signed Request Key Group**: A logical grouping of up to 5 keys for rotation purposes.
* **Rules Engine**: A customizable engine that processes incoming requests based on match conditions and executes actions like URL signing validation.

## Example Rule Configuration in Portal

To configure Signed request using the Azure portal:

1. Create a Signed Request Key in your Azure Front Door profile.
:::image type="content" source="./media/front-door-rules-engine/signed-request-config-portal-1.png" alt-text="Portal screenshot showing Signed Request Key creation.":::
2. Create a Signed Request Key Group and add the key to it.
:::image type="content" source="./media/front-door-rules-engine/signed-request-config-portal-2.png" alt-text="Portal screenshot showing Signed Request Key Group creation.":::
3. Navigate to the Rules Engine section of your Azure Front Door profile, create a new rule with the Signed Request action, and associate it with the Key Group you created.
:::image type="content" source="./media/front-door-rules-engine/signed-request-config-portal-3.png" alt-text="Portal screenshot showing Rules Engine configuration with Signed Request action.":::
4. Attach the rule set to the desired route.

## Example JSON configuration using ARM

# [JSON](#tab/json)

```json
{
  "matchConditions": [
    {
      "matchVariable": "RequestPath",
      "operator": "BeginsWith",
      "values": ["/protected/"]
    }
  ],
  "actions": [
    {
      "actionType": "UrlSigningAction",
      "keyGroup": "MyKeyGroup"
    }
  ]
}
```

## Signature Format

The signature is typically passed via:

* Query string: `?expires=<epoch>&keyId=<keyId>&signature=<hash>`
* Headers: `expires`, `keyId`, `signature`
* Cookies: `expires`, `keyId`, `signature`
The hash is computed using HMAC-SHA256 over the request path and parameters.

## Rules Engine Match Conditions

You can combine Signed URL validation with other match conditions such as:

* IP address or geo-location
* Device type (mobile/desktop)
* Request method (GET, POST)
* Query string or header values
This allows you to build complex access control logic.

## Best Practices

* Rotate keys regularly using key groups.
* Use short expiration times for sensitive content.
* Combine with WAF policies for enhanced protection.
* Use server variables to dynamically capture and validate request metadata.

## Limitations
**IMPORTANT:** If the signed requests rules are not the first set of rules in the rules engine, they will not be evaluated. Ensure that the signed requests rules are at the top of the rules engine configuration.
Presently, the edit key group capability is not supported in the Azure portal. You can delete and recreate the key group to update it.
For information about quota limits, refer to [Front Door limits, quotas, and constraints](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-front-door-standard-and-premium-service-limits).

## Next steps

* Learn how to configure [rules engine match conditions](rules-match-conditions.md).
* Learn about [rules engine actions](front-door-rules-engine-actions.md).
* Learn about [server variables](front-door-server-variables.md) using rules engine.

::: zone-end
