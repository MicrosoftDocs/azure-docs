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
ms.date: 08/22/2017
ms.author: curtand

ms.reviewer: jeffsta
ms.custom: oldportal;it-pro;

---
# How Azure subscriptions are associated with Azure Active Directory
This article covers information about the relationship between an Azure subscription and Azure Active Directory (Azure AD).

## Your Azure subscription's relationship to Azure AD
Your Azure subscription has a trust relationship with Azure AD, which means that it trusts the directory to authenticate users, services, and devices. Multiple subscriptions can trust the same directory, but each subscription trusts only one directory. 

The trust relationship that a subscription has with a directory is unlike the relationship that it has with other resources in Azure (websites, databases, and so on). If a subscription expires, then access to the other resources associated with the subscription also stops. But the directory remains in Azure, and you can associate a different subscription with that directory and continue to manage the directory users.

![how subscriptions are associated diagram](./media/active-directory-how-subscriptions-associated-directory/WAAD_OrgAccountSubscription.png)

Azure AD doesn’t work like the other services in your Azure subscription. Other Azure services are subordinate to the Azure subscription. But what you see in Azure AD does not vary based on subscription. It allows access to directories based on the signed-in user.

All users have a single home directory that authenticates them, but they can also be guests in other directories. In Azure AD, you can see only the directories in which your user account is a member. A directory can also be synchronized with on-premises Active Directory.

> [!NOTE]
> If, for example, you signed up for Office 365 using a work or school account and then signed up for Azure using a Microsoft account, then you have two directories: one for your work or school and a default directory that was created when you signed up for Azure. You can add an Azure subscription to an existing directory only while you are signed in with a Microsoft account. If you are signed in with a work or school account, the option to use an existing directory is not available because a work or school account can be authenticated only by its home directory (that is, the directory where the work or school account is stored, and which is owned by the work or school). To learn more about how to change administrators for an Azure subscription, see [Transfer ownership of an Azure subscription to another account](../billing/billing-subscription-transfer.md)

## Suggestions to manage both a subscription and a directory
The administrative roles for an Azure subscription manage resources tied to the Azure subscription. This section explains the differences between Azure subscription admins and Azure AD directory admins. Administrative roles and other suggestions for using them to manage your subscription are covered at [Assigning administrator roles in Azure Active Directory](active-directory-assign-admin-roles.md).

By default, you are assigned the Service Administrator role when you sign up. If others need to sign in and access services using the same subscription, you can add them as co-administrators. 

Azure AD has a different set of administrative roles to manage the directory and identity-related features. For example, the global administrator of a directory can add users and groups to the directory, or require multifactor authentication for users. A user who creates a directory is assigned to the global administrator role and they can assign administrative roles to other users. Azure AD administrative roles are also used by other services such as Office 365 and Microsoft Intune. 

Azure subscription admins and Azure AD directory admins are two separate roles. 
* Azure subscription admins can manage resources in Azure and can use Azure AD in the Azure portal (because the Azure portal itself is an Azure resource). 
* Directory admins can manage properties only in the Azure AD directory.

A person can be in both roles but it isn’t required. A user can be assigned to the directory global administrator role but not be assigned as Service administrator or co-administrator of an Azure subscription. Without being an administrator of the subscription, the user can sign in to the Azure portal, but can't manage the directories for that subscription in the portal. This user can manage directories using other tools such as Azure AD PowerShell or the Office 365 Admin Center.

## Next Steps
* To learn more about how to change administrators for an Azure subscription, see [Transfer ownership of an Azure subscription to another account](../billing/billing-subscription-transfer.md)
* To learn more about how resource access is controlled in Microsoft Azure, see [Understanding resource access in Azure](active-directory-understanding-resource-access.md)
* For more information on how to assign roles in Azure AD, see [Assigning administrator roles in Azure Active Directory](active-directory-assign-admin-roles-azure-portal.md)

<!--Image references-->
[1]: ./media/active-directory-how-subscriptions-associated-directory/WAAD_PassThruAuth.png
[2]: ./media/active-directory-how-subscriptions-associated-directory/WAAD_OrgAccountSubscription.png
[3]: ./media/active-directory-how-subscriptions-associated-directory/WAAD_SignInDisambiguation.PNG
