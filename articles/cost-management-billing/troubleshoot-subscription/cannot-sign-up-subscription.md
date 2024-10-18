---
title: Can't sign up for an Azure subscription
description: Discusses that you receive an error message when signing up for an Azure subscription.
ms.topic: troubleshooting
ms.date: 04/15/2024
ms.author: banders
author: bandersmsft
ms.reviewer: jarrettr
ms.service: cost-management-billing
ms.subservice: billing
---

# Can't sign up for a Microsoft Azure subscription

This article provides a resolution to an issue in which you aren't able to sign up for a Microsoft Azure subscription with error: `Account belongs to a directory that cannot be associated with an Azure subscription. Please sign in with a different account.`

_Original product version:_ Subscription management
_Original KB number:_ 4052156

## Symptoms

When you try to sign up for a Microsoft Azure subscription, you receive the following error message:

`Account belongs to a directory that cannot be associated with an Azure subscription. Please sign in with a different account.`

## Cause

The email address that is used to sign up for the Azure subscription already exists in an unmanaged Microsoft Entra directory. Unmanaged Microsoft Entra directories can't be associated with an Azure subscription.

## Resolution

To fix the problem, perform an *IT Admin Takeover* process for Power BI and Office 365 on the unmanaged directory.

The process transforms the unmanaged directory into a managed directory by assigning the Global Administrator role to your account. When completed, you can sign up for an Azure subscription by using your email address.

## References

- [How to perform an IT Admin Takeover with Office 365](https://powerbi.microsoft.com/blog/how-to-perform-an-it-admin-takeover-with-o365/)
- [Take over an unmanaged directory in Microsoft Entra ID](/azure/active-directory/domains-admin-takeover)

## Need help? Contact us.

If you have questions or need help,  [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).
