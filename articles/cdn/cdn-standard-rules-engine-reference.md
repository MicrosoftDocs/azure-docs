---
title: Standard rules engine reference for Azure Content Delivery Network
description: Reference documentation for match conditions and actions in the Standard rules engine for Azure Content Delivery Network.
services: cdn
author: duongau
ms.service: azure-cdn
ms.topic: concept-article
ms.date: 03/20/2024
ms.author: duau
---

# Standard rules engine reference for Azure Content Delivery Network

[!INCLUDE [Azure CDN from Microsoft (classic) retirement notice](../../includes/cdn-classic-retirement.md)]

In the [Standard rules engine](cdn-standard-rules-engine.md) for Azure Content Delivery Network, a rule consists of one or more match conditions and an action. This article provides detailed descriptions of the match conditions and features that are available in the Standard rules engine for Azure Content Delivery Network.

The rules engine is designed to be the final authority on how specific types of requests get processed by Standard Azure Content Delivery Network.

**Common uses for the rules**:

- Override or define a custom cache policy.
- Redirect requests.
- Modify HTTP request and response headers.

## Terminology

To define a rule in the rules engine, set [match conditions](cdn-standard-rules-engine-match-conditions.md) and [actions](cdn-standard-rules-engine-actions.md):

 ![Screenshot of Azure Content Delivery Network rules structure.](./media/cdn-standard-rules-engine-reference/cdn-rules-structure.png)

Each rule can have up to 10 match conditions and 5 actions. Each Azure Content Delivery Network endpoint can have up to 25 rules.

Included in this limit is a default *global rule*. The global rule doesn't have match conditions; actions that are defined in a global rule always triggered.

   > [!IMPORTANT]
   > The order in which multiple rules are listed affects how rules are handled. The actions that are specified in a rule might be overwritten by a subsequent rule.

## Limits and pricing

For more information, see [content delivery network Scale limits](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-content-delivery-network-limits) for rules limit. For rule engine pricing, see [Content Delivery Network pricing](https://azure.microsoft.com/pricing/details/cdn/).

## Syntax

How special characters are treated in a rule varies based on how different match conditions and actions handle text values. A match condition or action can interpret text in one of the following ways:

- [Literal values](#literal-values)
- [Wildcard values](#wildcard-values)

### Literal values

Text that's interpreted as a literal value treats all special characters *except the % symbol* as part of the value that must be matched in a rule. For example, a literal match condition set to `'*'` is satisfied only when the exact value `'*'` is found.

A percent sign is used to indicate URL encoding (for example, `%20`).

### Wildcard values

Currently we support the wildcard character in the **UrlPath Match Condition** in Standard Rules Engine. The \* character is a wildcard that represents one or more characters.

## Next steps

- [Match conditions in the Standard rules engine](cdn-standard-rules-engine-match-conditions.md)
- [Actions in the Standard rules engine](cdn-standard-rules-engine-actions.md)
- [Enforce HTTPS by using the Standard rules engine](cdn-standard-rules-engine.md)
- [Azure Content Delivery Network overview](cdn-overview.md)
