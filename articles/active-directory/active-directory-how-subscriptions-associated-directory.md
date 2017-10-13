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
ms.date: 08/24/2017
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

All users have a single home directory that authenticates them, but they can also be guests in other directories. In Azure AD, you can see only the directories of which your user account is a member. A directory can also be synchronized with on-premises Active Directory.

## Azure AD and cloud service subscriptions
Azure AD provides the core directory and identity management capabilities behind most of Microsoft’s cloud services, including:

* Azure
* Microsoft Office 365
* Microsoft Dynamics CRM Online
* Microsoft Intune

You get the Azure AD service free when you sign up for any of these Microsoft cloud services. If you want to add an additional Azure subscription to an Azure AD directory, you can do this only if you are signed in with a Microsoft account. For example, if you sign up for Azure using a Microsoft account and also sign up for a different Microsoft cloud service using a work or school account, you have two instances of Azure AD:
1. The default directory for your Azure subscription. You can add another Azure subscription to this directory or others you create if you are signed in with a Microsoft account because you can be authenticated by Azure.
2. The home directory for your work or school account. If you are signed in to Azure with a work or school account, you can't add an Azure subscription to an existing directory because your work or school account can't be authenticated directly by Azure. 

## To add an existing subscription to your Azure AD directory
You need to sign in with an account that exists in both the current directory with which the subscription is associated as well as the directory you want to add it to. 

1. Sign in to the [Azure Account Center](https://account.windowsazure.com/Home/Index) with an account that is the Account Administrator of the subscription to transfer subscription ownership.
2. Ensure that the user who you want to be the subscription owner is in the targeted directory.
3. Click **Transfer subscription**.
4. Specify the recipient. The recipient automatically gets an email with an acceptance link.
5. The recipient clicks the link and follows the instructions, including entering their payment information. When the recipient succeeds, the subscription is transferred. 
6. The default directory of the subscription is changed to the directory that the user is in if the subscription ownership transfer is successful.


## Suggestions to manage both a subscription and a directory
The administrative roles for an Azure subscription manage resources tied to the Azure subscription. This section explains the differences between Azure subscription admins and Azure AD directory admins. Administrative roles and other suggestions for using them to manage your subscription are covered at [Assigning administrator roles in Azure Active Directory](active-directory-assign-admin-roles.md).

By default, you are assigned the Service Administrator role when you sign up. If others need to sign in and access services using the same subscription, you can add them as co-administrators. 

Azure AD has a different set of administrative roles to manage the directory and identity-related features. For example, the global administrator of a directory can add users and groups to the directory, or require multifactor authentication for users. A user who creates a directory is assigned to the global administrator role and they can assign administrative roles to other users. Azure AD administrative roles are also used by other services such as Office 365 and Microsoft Intune. 

Azure subscription admins and Azure AD directory admins are two separate roles. 
* Azure subscription admins can manage resources in Azure and can use Azure AD in the Azure portal (because the Azure portal itself is an Azure resource). 
* Directory admins can manage properties only in the Azure AD directory.

A person can be in both roles but it isn’t required. A user can be assigned to the directory global administrator role but not be assigned as Service administrator or co-administrator of an Azure subscription. Without being an administrator of the subscription, the user can sign in to the Azure portal, but can't manage the directories for that subscription in the portal. This user can manage directories using other tools such as Azure AD PowerShell or the Office 365 Admin Center.

## Next steps
* To learn more about how to change administrators for an Azure subscription, see [Transfer ownership of an Azure subscription to another account](../billing/billing-subscription-transfer.md)
* To learn more about how resource access is controlled in Microsoft Azure, see [Understanding resource access in Azure](active-directory-understanding-resource-access.md)
* For more information on how to assign roles in Azure AD, see [Assigning administrator roles in Azure Active Directory](active-directory-assign-admin-roles-azure-portal.md)

<!--Image references-->
[1]: ./media/active-directory-how-subscriptions-associated-directory/WAAD_PassThruAuth.png
[2]: ./media/active-directory-how-subscriptions-associated-directory/WAAD_OrgAccountSubscription.png
[3]: ./media/active-directory-how-subscriptions-associated-directory/WAAD_SignInDisambiguation.PNG
