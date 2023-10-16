---
title: Username lookup during sign-in
description: How on-screen messaging reflects username lookup during sign-in in Microsoft Entra ID
services: active-directory
author: barclayn
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.subservice: enterprise-users
ms.topic: overview
ms.date: 06/24/2022
ms.author: barclayn
ms.reviewer: kexia
ms.custom: it-pro
ms.collection: M365-identity-device-management
---

# Home realm discovery for Microsoft Entra sign-in pages

We are changing sign-in behavior in Microsoft Entra ID, part of Microsoft Entra, to make room for new authentication methods and improve usability. During sign-in, Microsoft Entra ID determines where a user needs to authenticate. Microsoft Entra ID makes intelligent decisions by reading organization and user settings for the username entered on the sign-in page. This is a step towards a password-free future that enables additional credentials like FIDO 2.0.

## Home realm discovery behavior

Historically, home realm discovery was governed by the domain that is provided at sign-in or by a Home Realm Discovery policy for some legacy applications. For example, in our discovery behavior a Microsoft Entra user could mistype their username but would still arrive at their organization's credential collection screen. This occurs when the user correctly provides the organization's domain name “contoso.com”. This behavior does not allow the granularity to customize experiences for an individual user.

To support a wider range of credentials and increase usability, Microsoft Entra ID’s username lookup behavior during the sign-in process is now updated. The new behavior makes intelligent decisions by reading organization-level and user-level settings based on the username entered on the sign-in page. To make this possible, Microsoft Entra ID will check to see if the username that is entered on the sign-in page exists in their specified domain or redirects the user to provide their credentials.

An additional benefit of this work is improved error messaging. Here are some examples of the improved error messaging when signing in to an application that supports Microsoft Entra users only.

- The username is mistyped or the username has not yet been synced to Microsoft Entra ID:
  
    ![the username is mistyped or not found](./media/signin-realm-discovery/typo-username.png)
  
- The domain name is mistyped:
  
    ![the domain name is mistyped or not found](./media/signin-realm-discovery/typo-domain.png)
  
- User tries to sign in with a known consumer domain:
  
    ![sign-in with a known consumer domain](./media/signin-realm-discovery/consumer-domain.png)
  
- The password is mistyped but the username is accurate:  
  
    ![password is mistyped with good username](./media/signin-realm-discovery/incorrect-password.png)
  
> [!IMPORTANT]
> This feature might have an impact on federated domains relying on the old domain-level Home Realm Discovery to force federation. For updates on when federated domain support will be added, see [Home realm discovery during sign-in for Microsoft 365 services](https://azure.microsoft.com/updates/signin-hrd/). In the meantime, some organizations have trained their employees to sign in with a username that doesn’t exist in Microsoft Entra ID but contains the proper domain name, because the domain names routes users currently to their organization's domain endpoint. The new sign-in behavior doesn't allow this. The user is notified to correct the user name, and they aren't allowed to sign in with a username that does not exist in Microsoft Entra ID.
>
> If you or your organization have practices that depend on the old behavior, it is important for organization administrators to update employee sign-in and authentication documentation and to train employees to use their Microsoft Entra username to sign in.
  
If you have concerns with the new behavior, leave your remarks in the **Feedback** section of this article.  

## Next steps

[Customize your sign-in branding](../fundamentals/add-custom-domain.md)
