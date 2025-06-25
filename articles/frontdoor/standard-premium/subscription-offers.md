---
title: Standard/Premium Subscription Offers and Bandwidth Throttling
titleSuffix: Azure Front Door
description: Learn about Azure Front Door Standard/Premium availability for a specific subscription type.
author: halkazwini
ms.author: halkazwini
manager: kumud
ms.service: azure-frontdoor
ms.topic: troubleshooting-general
ms.date: 11/18/2024
---

# Azure Front Door Standard/Premium subscription offers and bandwidth throttling

**Applies to:** :heavy_check_mark: Front Door Standard :heavy_check_mark: Front Door Premium

Azure Front Door Standard/Premium profiles are subject to bandwidth throttling based on your subscription type.

## Free and trial subscriptions

Bandwidth throttling is applied to these subscription types.

## Pay-as-you-go

Bandwidth is throttled until the subscription is verified to be in good standing with a sufficient payment history. This verification process occurs automatically after the first payment is received.

If throttling persists after payment, you can request removal by [contacting support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).

## Enterprise agreements

Refer to the bandwidth limits in [Azure Front Door limits](../../azure-resource-manager/management/azure-subscription-service-limits.md#azure-front-door-standard-and-premium-service-limits).

## Other offer types

The same rules as Pay-as-you-go apply to these subscription types:

- Visual Studio
- MSDN
- Students
- CSP

## Next step

Learn how to [create an Azure Front Door Standard/Premium profile](create-front-door-portal.md).
