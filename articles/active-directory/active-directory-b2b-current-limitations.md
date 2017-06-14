---
title: Limitations of Azure Active Directory B2B collaboration | Microsoft Docs
description: Current limitations for Azure Active Directory B2B collaboration preview
services: active-directory
documentationcenter: ''
author: sasubram
manager: femila
editor: ''
tags: ''

ms.assetid:
ms.service: active-directory
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: identity
ms.date: 02/16/2017
ms.author: sasubram

---

# Limitations of Azure AD B2B collaboration
Azure Active Directory (Azure AD) B2B collaboration is currently subject to the limitations described in this article.

## Invitation APIs are in preview
The API surface is our anticipated direction forward. However, like all prerelease versions, the API is subject to the preview namespace contract. We will move the API to a numbered version with our general availability (GA) release.

## Possible double Multi-Factor Authentication
This redundancy can arise if your partner already has an Azure Multi-Factor Authentication policy in place. B2B collaboration Multi-Factor Authentication is performed and managed at the inviting organization. Such authentication is desirable because it covers all identities and gives you control over the authentication strength of your B2B collaboration invitees.

However, if a partner already has Multi-Factor Authentication set up and enforces it, the partner's users might have to perform the authentication once in their home organization and then again in yours.

In a future release, we plan to introduce a policy where you can avoid the double authentication issue by choosing to trust the partner's Multi-Factor Authentication.

## Instant-On
In the B2B collaboration flows, we add users to the directory and dynamically update them during invitation redemption, app assignment, and so on. The updates and writes ordinarily happen in one directory instance and must be replicated across all instances. We have observed that, because of the finite amount of time it can take to complete replication, authorization issues can sometimes arise. We are working hard to minimize or eliminate these issues before our GA release. You're unlikely to experience them in the meantime, but if you do, refreshing or retrying should help resolve them.

## Next steps

Browse our other articles on Azure AD B2B collaboration:

* [What is Azure AD B2B collaboration?](active-directory-b2b-what-is-azure-ad-b2b.md)
* [B2B collaboration user properties](active-directory-b2b-user-properties.md)
* [Adding a B2B collaboration user to a role](active-directory-b2b-add-guest-to-role.md)
* [Delegate B2bB collaboration invitations](active-directory-b2b-delegate-invitations.md)
* [Dynamic groups and B2B collaboration](active-directory-b2b-dynamic-groups.md)
* [B2B collaboration code and PowerShell samples](active-directory-b2b-code-samples.md)
* [Configure SaaS apps for B2B collaboration](active-directory-b2b-configure-saas-apps.md)
* [B2B collaboration user tokens](active-directory-b2b-user-token.md)
* [B2B collaboration user claims mapping](active-directory-b2b-claims-mapping.md)
* [Office 365 external sharing](active-directory-b2b-o365-external-user.md)
