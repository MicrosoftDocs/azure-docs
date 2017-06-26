---
title: Limitations of Azure Active Directory B2B collaboration | Microsoft Docs
description: Current limitations for Azure Active Directory B2B collaboration
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
ms.date: 05/04/2017
ms.author: sasubram

---

# Limitations of Azure AD B2B collaboration
Azure Active Directory (Azure AD) B2B collaboration is currently subject to the limitations described in this article.

## Possible double multi-factor authentication
With Azure AD B2B you can enforce multi-factor authentication at the resource organization (the inviting organization). The reasons for this approach are detailed in [Conditional access for B2B collaboration users](active-directory-b2b-mfa-instructions.md). This means that if a partner already has multi-factor authentication set up and enforces it, the partner's users might have to perform the authentication once in their home organization and then again in yours.

In a future release, we plan to introduce a policy where you can avoid the double authentication issue by choosing to trust the partner's multi-factor authentication.


## Instant-on
In the B2B collaboration flows, we add users to the directory and dynamically update them during invitation redemption, app assignment, and so on. The updates and writes ordinarily happen in one directory instance and must be replicated across all instances. It can take a non-zero amount of time it can take to complete replication. Sometimes when the object is written or updated in one instance of the directory and the call to retrieve this object is load balanced to another instance, this has causied authorization issues. We have done a lot of work to eliminate or reduce these replication latencies, but it is possible that in some rare cases, they may still occur. If that happens, refresh or retry to help. If you are writing an app using our API, then retries with some back-off is a good, defensive practice to alleviate this issue.

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
