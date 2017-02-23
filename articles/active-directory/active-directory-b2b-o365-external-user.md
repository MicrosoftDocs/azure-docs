---
title: Office 365 external sharing and Azure Active Directory B2B collaboration | Microsoft Docs
description: claims mapping reference for Azure Active Directory B2B collaboration
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
ms.date: 02/06/2017
ms.author: sasubram

---

# Office 365 external sharing and Azure Active Directory B2B collaboration

External sharing in Office365 (OneDrive, SharePoint Online, Unified Groups, etc.) and using Azure Active Directory (Azure AD) B2B collaboration are technically the same thing. All external sharing, (except OneDrive/ SharePoint Online), including **Guests in Unified Groups** is already using the Azure AD B2B collaboration invitation API for sharing.

OneDrive/SharePoint Online (ODSP) has a separate invitation manager because ODSP support for external sharing started before it was inherently supported as part of the Azure AD fabric. Over time, ODSP external sharing has accrued several features and many million users that use the product's in-built sharing pattern. We are working with ODSP to onboard to the Azure AD B2B invitation APIs (referred to in this documentation), to unify all end to end benefits and accrue to them all the innovations in experiences that Azure AD is making. In the meantime, there are some subtle differences between how ODSP external sharing works and how Azure AD B2B works:

1. ODSP adds the user to the directory after the user has redeemed their invitation. So, until the user has redeemed, you won't actually see the user in Azure AD portal. If a user is invited from another site in the meantime, a new invitation is generated. However, when using B2B collaboration, we add the user immediately on invitation so he shows up everywhere.

2. The redemption experience in ODSP looks different from that of B2B collaboration.

3. However, when the user has redeemed the invitation they look alike.

4. B2B collaboration invited users can be picked from ODSP sharing dialogs. ODSP invited users also show up in Azure AD after they have redeemed their invitation.

5. To use external sharing in ODSP together with B2B collaboration in a managed, admin controlled way, set the ODSP external sharing setting to **Only allow sharing with external users already in the directory**. Users can go to externally shared sites and pick from external collaborators the admin has added. The admin can add the external collaborators through the B2B collaboration invitation APIs.

![the ODSP external sharing setting](media/active-directory-b2b-o365-external-user/odsp-sharing-setting.png)

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
* [B2B collaboration current limitations](active-directory-b2b-current-limitations.md)
