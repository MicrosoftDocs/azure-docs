---
title: Message appears when you try to create multiple subscriptions
titleSuffix: Microsoft Cost Management
description: Provides help for the message you might see when you try to create multiple subscriptions.
author: bandersmsft
ms.reviewer: sgautam
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: troubleshooting
ms.date: 03/21/2024
ms.author: banders
---

# Message appears when you try to create multiple subscriptions

When you try to create multiple Azure subscriptions in a short period of time, you might receive a message stating:

`Subscription not created. Please try again later.`

The message is normal and expected.

> [!IMPORTANT]
> All existing subscriptions should generate consumption history before you create another one

The message can appear for customers with the following Azure subscription agreement types:

- [Microsoft Customer Agreement purchased directly through Azure.com](../manage/create-subscription.md)
    - You can have a maximum of five subscriptions in a Microsoft Customer Agreement purchased directly through Azure.com.
    - You can create one subscription per 24 hour period.
    - The ability to create other subscriptions is determined on an individual basis according to your history with Azure.
- [Microsoft Online Services Program](https://signup.azure.com/signup?offer=ms-azr-0003p)
    - A new billing account for a Microsoft Online Services Program can have a maximum of five subscriptions. However, subscriptions transferred to the new billing account don't count against the limit.
    - The ability to create other Microsoft Online Services Program subscriptions is determined on an individual basis according to your history with Azure.

## Solution

Expect a delay before you can create another subscription.

If you're new to Azure and don't have any consumption usage, read the [Get started guide for Azure developers](../../guides/developer/azure-developer-guide.md) to help you get started with Azure services.

## Need help? Contact us.

If you have questions or need help, [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).

## Next steps

- Learn more about [Programmatically creating Azure subscriptions for a Microsoft Customer Agreement with the latest APIs](../manage/programmatically-create-subscription-microsoft-customer-agreement.md).