---
title: Azure Front Door Standard/Premium subscription offers and bandwidth throttling
description: Learn about Azure Front Door Standard/Premium availability for a specific subscription type.
services: front-door
author: duongau
manager: kumud
ms.service: azure-frontdoor
ms.topic: troubleshooting
ms.date: 11/18/2024
ms.author: duau
---

# Azure Front Door Standard/Premium Subscription Offers and Bandwidth Throttling

Azure Front Door Standard/Premium profiles are subject to bandwidth throttling based on your subscription type.

## Free and Trial Subscriptions

Bandwidth throttling is applied to these subscription types.

## Pay-as-you-go

Bandwidth is throttled until the subscription is verified to be in good standing with a sufficient payment history. This verification process occurs automatically after the first payment is received.

If throttling persists after payment, you can request removal by [contacting support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).

## Enterprise Agreements

Refer to the bandwidth limits in [Azure Front Door limits](../../azure-resource-manager/management/azure-subscription-service-limits.md#azure-front-door-standard-and-premium-service-limits).

## Other Offer Types

The same rules as Pay-as-you-go apply to these subscription types:

- Visual Studio
- MSDN
- Students
- CSP

## Next Steps

Learn how to [create an Azure Front Door Standard/Premium profile](create-front-door-portal.md).
