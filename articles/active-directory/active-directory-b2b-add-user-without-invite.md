---

title: Add B2B collaboration users to Azure Active Directory without an invitation | Microsoft Docs
description: You can let a guest user add other guest users to your Azure AD without redeeming an invitation in Azure Active Directory B2B collaboration.
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
ms.date: 03/15/2017
ms.author: sasubram

---

# Add B2B collaboration guest users without an invitation

You can allow a user, such as a partner representative, to add users from the partner to your organization without needing invitations to be redeemed. All you must do is grant that user enumeration privileges in the directory you're using for the partner org. 

Grant these privileges when:

1. A user in the host organization (for example, WoodGrove) invites one user from the partner organization (for example, Sam@litware.com) as Guest.
2. The admin in the host organization sets up policies that allow Sam to identify and add other users from the partner organization (Litware).
3. Now Sam can add other users from Litware to the WoodGrove directory, groups, or applications without needing invitations to be redeemed. If Sam has the appropriate enumeration privileges in Litware, it happens automatically.

### Next steps

Browse our other articles on Azure AD B2B collaboration:

* [What is Azure AD B2B collaboration?](active-directory-b2b-what-is-azure-ad-b2b.md)
* [How do Azure Active Directory admins add B2B collaboration users?](active-directory-b2b-admin-add-users.md)
* [How do information workers add B2B collaboration users?](active-directory-b2b-iw-add-users.md)
* [The elements of the B2B collaboration invitation email](active-directory-b2b-invitation-email.md)
* [B2B collaboration invitation redemption](active-directory-b2b-redemption-experience.md)
* [Azure AD B2B collaboration licensing](active-directory-b2b-licensing.md)
* [Troubleshooting Azure Active Directory B2B collaboration](active-directory-b2b-troubleshooting.md)
* [Azure Active Directory B2B collaboration frequently asked questions (FAQ)](active-directory-b2b-faq.md)
* [Azure Active Directory B2B collaboration API and customization](active-directory-b2b-api.md)
* [Multi-factor authentication for B2B collaboration users](active-directory-b2b-mfa-instructions.md)
* [Article Index for Application Management in Azure Active Directory](active-directory-apps-index.md)