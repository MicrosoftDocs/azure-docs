---
title: Azure Front Door Standard/Premium subscription offers and bandwidth throttling
description: Learn about Azure Front Door Standard/Premium availability for a specific subscription type.
services: front-door
author: duongau
manager: kumud
ms.service: frontdoor
ms.topic: troubleshooting
ms.date: 10/11/2023
ms.author: duau
---

# Azure Front Door Standard/Premium subscription offers and bandwidth throttling

Bandwidth throttling is applied to Azure Front Door Standard/Premium profiles, based on your subscription type.

## Free and Trial Subscription

Bandwidth throttling is applied for this type of subscription.

## Pay-as-you-go

Bandwidth will be throttled until the subscription is determined to be in good standing and has a sufficient payment history. The process for determining the subscription status and having throttling removed happens automatically after the first payment has been received.

If you have made a payment and throttling hasn't been removed, you can request to do so by [contacting support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).

## Enterprise agreements

Refer to the bandwidth limit in [Azure Front Door limits](../../azure-resource-manager/management/azure-subscription-service-limits.md#azure-front-door-standard-and-premium-service-limits)

## Other offer types

The same functionality as Pay-as-you-go applies to these types of agreements:

* Visual Studio
* MSDN
* Students
* CSP

## Next steps

Learn how to [create an Azure Front Door Standard/Premium profile](create-front-door-portal.md).
