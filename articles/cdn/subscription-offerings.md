---
title: Azure CDN subscription offers and bandwidth throttling
description: Learn about which Azure CDNs is available for a specific subscription type.
services: cdn
author: halkazwini
ms.author: halkazwini
manager: kumud
ms.service: azure-cdn
ms.topic: troubleshooting
ms.date: 03/31/2025
ROBOTS: NOINDEX
# Customer intent: As a cloud administrator, I want to understand the bandwidth throttling policies related to different Azure CDN subscription types, so that I can ensure optimal performance for my content delivery needs based on the subscription I choose.
---

# Azure CDN subscription offers and bandwidth throttling

[!INCLUDE [Azure CDN from Microsoft (classic) retirement notice](../../includes/cdn-classic-retirement.md)]

Some Azure CDNs offerings are only available to certain subscription types. Bandwidth throttling might also apply depending on your subscription type.

## Free and Trial Subscription

Azure CDN from Microsoft is the only CDN offering that is available to trial subscriptions. Bandwidth throttling is applied for this type of subscription.

## Pay-as-you-go

Bandwidth for Azure CDN from Microsoft gets throttled until the subscription is determined to be in good standing and has a sufficient payment history. The process for determining the subscription status and having throttling removed happens automatically after the first payment has been received.

If you have made a payment and throttling hasn't been removed, you can request to do so by [contacting support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).

## Enterprise agreements

Azure CDN is available to Enterprise Agreement subscriptions. Enterprise Agreements subscriptions don't have any bandwidth restrictions.

## Other offer types

The same functionality as Pay-as-you-go applies to these types of agreements:

- Visual Studio
- MSDN
- Students
- CSP

## Next steps

- Learn how to [create an Azure CDN profile](cdn-create-new-endpoint.md).
