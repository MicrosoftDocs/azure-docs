---
title: Error when you create multiple subscriptions
titleSuffix: Microsoft Cost Management
description: Provides the solution for a problem where you get an error message when you try to create multiple subscriptions.
author: bandersmsft
ms.reviewer: sgautam
tags: billing
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: troubleshooting
ms.date: 11/30/2022
ms.author: banders
---

# Error when you create multiple subscriptions

When you try to create multiple Azure subscriptions in a short period of time, you might receive an error stating:

`Subscription not created. Please try again later.`

The error is normal and expected.

The error can occur for customers with the following Azure subscription agreement type:

- Microsoft Customer Agreement purchased directly through Azure.com
    - You can have a maximum of five subscriptions in a Microsoft Customer Agreement purchased directly through Azure.com.
    - The ability to create other subscriptions is determined on an individual basis according to your history with Azure.
- Microsoft Online Services Program
    - A new billing account for a Microsoft Online Services Program can have a maximum of five subscriptions. However, subscriptions transferred to the new billing account don't count against the limit.
    - The ability to create other Microsoft Online Services Program subscriptions is determined on an individual basis according to your history with Azure.

## Solution

Expect a delay before you can create another subscription.

## Need help? Contact us.

If you have questions or need help,  [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).

## Next steps

- Learn more about [Programmatically creating Azure subscriptions for a Microsoft Customer Agreement with the latest APIs](programmatically-create-subscription-microsoft-customer-agreement.md).