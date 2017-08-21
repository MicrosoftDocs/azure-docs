---
title: How Azure subscriptions are associated with Azure Active Directory | Microsoft Docs
description: Signing in to Microsoft Azure and related issues, such as the relationship between an Azure subscription and Azure Active Directory.
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
ms.date: 08/21/2017
ms.author: curtand

ms.reviewer: jeffsta
ms.custom: oldportal;it-pro;

---
# How Azure subscriptions are associated with Azure Active Directory
This article covers information about the relationship between an Azure subscription and Azure Active Directory (Azure AD).

## Your Azure subscription has a trust relationship with Azure AD
Having a trust relationship with an Azure AD means that it trusts the directory to authenticate users, services, and devices. Multiple subscriptions can trust the same directory, but each subscription trusts only one directory. 

This trust relationship that a subscription has with a directory is unlike the relationship that a subscription has with all other resources in Azure (websites, databases, and so on), which are more like child resources of a subscription. If a subscription expires, then access to those other resources associated with the subscription also stops. But the directory remains in Azure, and you can associate a different subscription with that directory and continue to manage the directory users.

Similarly, the Azure AD you see in your subscription doesn’t work like the other extensions in the Azure portal. Other Azure services are completely subordinate to the Azure subscription. What you see in Azure AD does not vary based on subscription. It allows acess to directories based on the signed-in user.

All users have a single home directory that authenticates them, but they can also be guests in other directories. In Azure AD, you can see only the directories in which your user account is a member. A directory can also be synchronized with on-premises Active Directory.

This diagram shows a subscription for Michael Smith after he signed up by using a work account for Contoso.

![how subscriptions are associated diagram](./media/active-directory-how-subscriptions-associated-directory/WAAD_OrgAccountSubscription.png)

## Tips if you manage both a subscription and a directory
The administrative roles for an Azure subscription manage resources tied to the Azure subscription. These roles and the best practices for managing your subscription are covered at [Assigning administrator roles in Azure Active Directory](active-directory-assign-admin-roles.md).

By default, you are assigned the Service Administrator role when you sign up. If others need to sign in and access services using the same subscription, you can add them as co-administrators. 

Azure AD has a different set of administrative roles to manage the directory and identity-related features. For example, the global administrator of a directory can add users and groups to the directory, or require multifactor authentication for users. A user who creates a directory is assigned to the global administrator role and they can assign administrative roles to other users. Azure AD administrative roles are also used by other services such as Office 365 and Microsoft Intune. For more information, see [Assigning administrator roles](active-directory-assign-admin-roles.md).

Azure subscription admins and Azure AD directory admins are two separate roles. 
* Azure subscription admins can manage resources in Azure and can use view Active Directory in the Azure portal (because the Azure portal itself is an Azure resource). 
* Directory admins can manage properties only in the Azure AD directory.

A person can be in both roles but this isn’t required. A user can be assigned to the directory global administrator role but not be assigned as Service administrator or co-administrator of an Azure subscription. Without being an administrator of the subscription, the user cannot sign in to the Azure portal, but can manage directories using other tools such as Azure AD PowerShell or the Office 365 Admin Center.

## Next Steps
* To learn more about how to change administrators for an Azure subscription, see [How to add or change Azure administrator roles](../billing/billing-add-change-azure-subscription-administrator.md)
* To learn more about how resource access is controlled in Microsoft Azure, see [Understanding resource access in Azure](active-directory-understanding-resource-access.md)
* For more information on how to assign roles in Azure AD, see [Assigning administrator roles in Azure Active Directory](active-directory-assign-admin-roles-azure-portal.md)

<!--Image references-->
[1]: ./media/active-directory-how-subscriptions-associated-directory/WAAD_PassThruAuth.png
[2]: ./media/active-directory-how-subscriptions-associated-directory/WAAD_OrgAccountSubscription.png
[3]: ./media/active-directory-how-subscriptions-associated-directory/WAAD_SignInDisambiguation.PNG
