---
title: How to add an existing Azure subscription to your Azure AD directory | Microsoft Docs
description: How to add an existing subscription to your Azure AD directory
services: active-directory
documentationcenter: ''
author: curtand
manager: femila
editor: ''

ms.assetid: bc4773c2-bc4a-4d21-9264-2267065f0aea
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 10/17/2017
ms.author: curtand

ms.reviewer: jeffsta
ms.custom: oldportal;it-pro;

---
# How to add an Azure subscription to Azure Active Directory
This article covers information about the relationship between an Azure subscription and Azure Active Directory (Azure AD), and how to add an existing subscription to your Azure AD directory. Your Azure subscription has a trust relationship with Azure AD, which means that it trusts the directory to authenticate users, services, and devices. Multiple subscriptions can trust the same directory, but each subscription trusts only one directory. 

The trust relationship that a subscription has with a directory is unlike the relationship that it has with other resources in Azure (websites, databases, and so on). If a subscription expires, access to the other resources associated with the subscription also stops. But an Azure AD directory remains in Azure, and you can associate a different subscription with that directory and manage the directory using the new subscription.

All users have a single home directory that authenticates them, but they can also be guests in other directories. In Azure AD, you can see the directories of which your user account is a member or guest.

## To add an existing subscription to your Azure AD directory
You must sign in with an account that exists in both the current directory with which the subscription is associated and in the directory you want to add it to. 

1. Sign in to the [Azure Account Center](https://account.azure.com/Subscriptions) with an account that is the Account Administrator of the subscription whose ownership you want to transfer.
2. Ensure that the user who you want to be the subscription owner is in the targeted directory.
3. Click **Transfer subscription**.
4. Specify the recipient. The recipient automatically gets an email with an acceptance link.
5. The recipient clicks the link and follows the instructions, including entering their payment information. When the recipient succeeds, the subscription is transferred. 
6. The default directory of the subscription is changed to the directory that the user is in.

For more information, see [Transfer Azure subscription ownership to another account](../billing/billing-subscription-transfer.md).

## Next steps
* To learn more about how to change administrators for an Azure subscription, see [Transfer ownership of an Azure subscription to another account](../billing/billing-subscription-transfer.md)
* To learn more about how resource access is controlled in Microsoft Azure, see [Understanding resource access in Azure](active-directory-understanding-resource-access.md)
* For more information on how to assign roles in Azure AD, see [Assigning administrator roles in Azure Active Directory](active-directory-assign-admin-roles-azure-portal.md)

<!--Image references-->
[1]: ./media/active-directory-how-subscriptions-associated-directory/WAAD_PassThruAuth.png
[2]: ./media/active-directory-how-subscriptions-associated-directory/WAAD_OrgAccountSubscription.png
[3]: ./media/active-directory-how-subscriptions-associated-directory/WAAD_SignInDisambiguation.PNG
