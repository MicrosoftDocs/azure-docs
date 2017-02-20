---
title: Azure Active Directory B2B collaboration current limitations | Microsoft Docs
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

# Azure Active Directory B2B collaboration current limitations

1. Azure Active Directory (Azure AD) B2B collaboration invitation APIs are in Beta testing
  That API surface is the direction forward however like all beta, it's subject to the beta namespace contract. We will move the API to a numbered version with our GA release.
2. Possibility of double multi-factor authentication (MFA) if your partner already has an MFA policy in place
  B2B collaboration MFA will be performed and managed at the inviting organization. This is desirable because it covers all identities and allows you to have control over the authentication strength of your B2B collaboration invitees. However, if you have a partner who already has MFA set up and enforces it, their users may have to perform MFA once in their home organization and then again in your organization. In future releases, we will be introducing a policy where you can choose to trust certain partners' MFA to avoid the double MFA issue.
3. Instant ON
  In the B2B collaboration flows, we add users to the directory and dynamically update them during invitation redemption, app assignment, and so on. The updates and writes generally happen in one directory instance and has to be replicated across all the instances. We have observed that in some cases, the finite amount of time it can take to complete replication can result in issues that manifest as authorization issues. We are working hard to minimize/eliminate this set of issues before General Availability. In the meantime, this shouldn't be an issue you hit, but if you do, refreshing or retrying will generally help.

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
