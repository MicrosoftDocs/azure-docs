---
title: Username lookup during sign-in authentication - Azure Active Directory | Microsoft Docs
description: How on-screen messaging reflects username lookup during sign-in 
services: active-directory
author: curtand
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.subservice: users-groups-roles
ms.topic: article
ms.date: 04/15/2019
ms.author: curtand
ms.reviewer: kexia
ms.custom: it-pro

ms.collection: M365-identity-device-management
---

# Home realm discovery for Azure Active Directory sign-in pages

We are changing our Azure Active Directory (Azure AD) sign-in behavior to make room for new authentication methods and improve usability. During sign-in, Azure AD determines where a user needs to authenticate. Azure AD makes intelligent decisions by reading organization and user settings for the username entered on the sign-in page. This is a step towards a password-free future that enables additional credentials like FIDO 2.0.

## Home realm discovery behavior

Historically, home realm discovery was governed by the domain that is provided at sign-in or by a Home Realm Discovery policy for some legacy applications. For example, in our discovery behavior an Azure Active Directory user could mistype their username but would still arrive at their organization's credential collection screen. This occurs when the user correctly provides the organization's domain name “contoso.com”. This behavior does not allow the granularity to customize experiences for an individual user.

To support a wider range of credentials and increase usability, Azure Active Directory’s username lookup behavior during the sign-in process is now updated. The new behavior makes intelligent decisions by reading tenant and user level settings based on the username entered on the sign-in page. To make this possible, Azure Active Directory will check to see if the username that is entered on the sign-in page exists in their specified domain or redirects the user to provide their credentials.

An additional benefit of this work is improved error messaging. Here are some examples of the improved error messaging when signing in to an application that supports Azure Active Directory users only.

- The username is mistyped or the username has not yet been synced to Azure AD:
  
    ![the username is mistyped or not found](./media/signin-realm-discovery/typo-username.png)
  
- The domain name is mistyped:
  
    ![the domain name is mistyped or not found](./media/signin-realm-discovery/typo-domain.png)
  
- User tries to sign in with a known consumer domain:
  
    ![sign-in with a known consumer domain](./media/signin-realm-discovery/consumer-domain.png)
  
- The password is mistyped but the username is accurate:  
  
    ![password is mistyped with good username](./media/signin-realm-discovery/incorrect-password.png)
  
> [!IMPORTANT]
> This feature might have an impact on federated domains relying on the old domain level Home Realm Discovery to force federation. For updates on when federated domain support will be added, see [Home realm discovery during sign-in for Microsoft 365 services](https://azure.microsoft.com/updates/signin-hrd/). In the meantime, some organizations have trained their employees to sign in with a username that doesn’t exist in Azure Active Directory but contains the proper domain name, because the domain names routes users currently to their organization's domain endpoint. The new sign-in behavior doesn't allow this. The user is notified to correct the user name, and they aren't allowed to sign in with a username that does not exist in Azure Active Directory.
>
> If you or your organization have practices that depend on the old behavior, it is important for organization administrators to update employee sign-in and authentication documentation and to train employees to use their Azure Active Directory username to sign in.
  
If you have concerns with the new behavior, leave your remarks in the **Feedback** section of this article.  

## Next steps

[Customize your sign-in branding](../fundamentals/add-custom-domain.md)
