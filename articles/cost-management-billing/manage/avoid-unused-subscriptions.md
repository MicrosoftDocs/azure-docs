---
title: Avoid unused subscriptions
description: Learn how to prevent unused subscriptions from getting automatically blocked or deleted due to inactivity.
author: bandersmsft
ms.reviewer: mijeffer
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: concept-article
ms.date: 01/22/2025
ms.author: banders
# customer intent: As a billing administrator, I want to prevent my subscriptions from getting blocked or deleted.
---

# Avoid unused subscriptions

Unused and abandoned subscriptions can increase potential security risks to your Azure account. To reduce this risk, Microsoft takes measures to secure, protect, and ultimately delete unused Azure subscriptions.

>[!NOTE]
> This article only applies to the following subscription types:
> - Microsoft Online Service Program (MOSP)
> - Cloud Solution Provider (CSP)
> - Microsoft Customer Agreement (MCA) that you bought through the Azure website or Azure portal
> - Microsoft Customer Agreement (MCA) that your partner manages

## What is an unused subscription?

Unused subscriptions don’t have usage, activity, or open support requests in more than one year (12 months). When a subscription enters the unused state, you receive a notification from Microsoft stating that your unused subscriptions will get blocked in 30 days.

If you use your subscription within 30 days of the notification, your subscription returns to its normal state and is no longer subject to getting blocked. However, if your subscription remains unused for 30 days after the notification, Azure blocks the unused subscription for your protection.

## What happens if my subscription is blocked?

When your subscription is blocked, you can’t perform certain subscription actions. You need assistance to unblock your subscription to return to normal use.

- If you bought your subscription on your own, [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest) to contact Microsoft Support.
- If you acquired your subscription through a partner, contact your partner.

When your subscription gets blocked, you receive another notification. The notification warns you that your subscription will get deleted in 90 days if you don’t take action to unblock it.

>[!WARNING]
>Data loss will occur if you don’t act to unblock your subscription within the notification period. Your unused subscription gets deleted for your protection. Any resources in the subscription are also deleted.

## Related content

- [Create a support request in the Azure portal](/azure/azure-portal/supportability/how-to-create-azure-support-request)