---
title: Configure Signed URLs Using The Rules Engine (Preview)
titleSuffix: Azure Front Door
description: This article provides an overview of the Azure Front Door signed URL feature.
author: samheetamistry
ms.author: smistry
ms.service: azure-frontdoor
ms.topic: how-to
ms.date: 10/28/2025
---

# Configure signed URLs using the rules engine in Azure Front Door (preview)

**Applies to:** :heavy_check_mark: Front Door Standard :heavy_check_mark: Front Door Premium

Azure Front Door supports signed URL as a security feature that enables fine-grained access control to your content. This feature is useful for scenarios like premium content delivery, temporary access to assets, securing APIs, and geo-restricted access. Signed URL works by validating a cryptographic signature included in the request, which is generated using a shared secret and includes parameters such as expiration time and key ID.

## How signed URL works

Signed URL is implemented as a rules engine action called signed request. This action is evaluated as part of a rule set associated with a route in your Front Door profile:

1. The client authenticates with your origin server.
1. The origin generates a signature using a shared secret, expiration time, and key ID.
1. The client receives the signed URL and uses it to request content from Azure Front Door.
1. Azure Front Door validates the signature using the configured rules engine.
1. If valid, the content is served. If not, a 403 Forbidden response is returned.

What would cause a 403 Forbidden response?

- The signature is expired.
- The signature is invalid.
- The KeyID used in the request isn't configured for this route.

### Terminology

* **Signed request key**: A secret stored in Azure Key Vault used to generate and validate signatures.
* **Signed request key group**: A logical grouping of up to five keys for rotation purposes.
* **Rules engine**: A customizable engine that processes incoming requests based on match conditions and executes actions like URL signing validation.

## Configure signed request

# [**Portal**](#tab/portal)

Follow these steps to configure signed request using the Azure portal:

1. In the Azure portal, go to your Azure Front Door profile.

1. Under **Security**, select **Signed request key**.

1. Select **+ Add** to create a new signed request key.

1. In **Add a key** page, enter or select your Key vault, secret name and version, and key name and ID. Then select **Save**.

1. Under the **Signed request key groups** tab, select **+ Add** to use the rule engine to create a new signed URL rule set.

1. Under **Settings**, select **Rules sets**, and then select **+ Add** to create a new rules set.

1. Select **Save** to save the rules set.

1. In the **Rule sets** page, select **Refresh** to include the Signed URL rule set.

1. Select the rule set dropdown, and then select **Associate a route** to attach a route to the rule set to implement it.

# [**ARM template**](#tab/arm)

Use the following JSON snippet to configure signed request in your rules engine using an Azure Resource Manager (ARM) template:

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

---

## Signature format

The signature is typically passed via:

- Query string: `?expires=<epoch>&keyId=<keyId>&signature=<hash>`
- Headers: `expires`, `keyId`, `signature`
- Cookies: `expires`, `keyId`, `signature`

The hash is computed using HMAC-SHA256 over the request path and parameters.

## Rules engine match conditions

You can combine Signed URL validation with other match conditions such as:

- IP address or geo-location
- Device type (mobile/desktop)
- Request method (GET, POST)
- Query string or header values
This allows you to build complex access control logic.

## Best practices

- Rotate keys regularly using key groups.
- Use short expiration times for sensitive content.
- Combine with WAF policies for enhanced protection.
- Use server variables to dynamically capture and validate request metadata.

> [!IMPORTANT]
> - If the signed request rules aren't the first set of rules in the rules engine, they won't be evaluated. Ensure that the signed request rules are at the top of the rules engine configuration.
>
> - Currently, the edit key group capability isn't supported in the Azure portal. You can delete and recreate the key group to update it.

For information about quota limits, see [Front Door limits, quotas, and constraints](/azure/azure-resource-manager/management/azure-subscription-service-limits#azure-front-door-standard-and-premium-service-limits).

## Related content

- Learn how to configure [rules engine match conditions](/azure/frontdoor/rules-match-conditions).
- Learn about [rules engine actions](/azure/frontdoor/front-door-rules-engine-actions).
- Learn about [server variables](/azure/frontdoor/rule-set-server-variables) using rules engine.
