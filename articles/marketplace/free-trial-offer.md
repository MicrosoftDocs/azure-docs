---
title: Free trial offers in the Microsoft commercial marketplace  
description: Overview of free trial offers in the Microsoft commercial marketplace. 
author: mingshen-ms 
ms.author: mingshen
ms.reviewer: dannyevers
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
ms.date: 08/30/2020
---

# Free trial offers in the Microsoft commercial marketplace

You can enable a free trial on one or more plans for the following offer types: 

| Offer type | Length of trial |
| ------------ | ------------- |
| Azure virtual machine  | 1, 3, or 6 months  |
| Dynamics 365 Business Central | Defined by the app  |
| Dynamics 365 for Customer Engagement & PowerApps | Defined by the app  |
| Dynamics 365 for Operations | Defined by the app  |
| Software as a service  | 1 month |
|||

When a customer selects a free trial, we collect their billing information, but we don’t start billing the customer until the trial is converted to a paid subscription. Free trials automatically convert to a paid subscription at the end of the trial, unless the customer cancels the subscription before the trial period ends.

During the trial period, customers can evaluate any of the supported plans within the same offer that has a free trial enabled. If they switch to a different trial within the same offer, the trial period doesn’t restart. For example, if a customer uses a free trial for 15 days and then switches to a different free trial for the same offer, the new trial period will account for 15 days used. The free trial that the customer was evaluating when the trial period ends is the one that’s automatically converted to a paid subscription.

After a customer selects a free trial for a plan, they can't convert to a paid subscription for that plan until the trial period has ended. If a customer chooses to convert to a different plan within the offer that doesn’t have a free trial, the conversion will happen, but the free trial will end immediately, and any data will be lost.

> [!NOTE]
> After a customer starts paying for a plan, they can’t get a free trial on the same plan again, even if they switch to a plan that supports free trials.

To obtain information on customer subscriptions currently participating in a free trial, use the new API property `isFreeTrial`, which will be marked as true or false. For more information, see the [SaaS Get Subscription API](./partner-center-portal/pc-saas-fulfillment-api-v2.md#get-subscription).