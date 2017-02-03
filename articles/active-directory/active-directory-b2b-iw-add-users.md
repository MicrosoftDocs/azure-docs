---

title: How do information workers add B2B collaboration users to Azure Active Directory? | Microsoft Docs
description: Azure Active Directory B2B collaboration allows information workers to add users from their  organization to Azure AD for access to your corporate applications
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
ms.date: 02/02/2017
ms.author: sasubram

---

# How do information workers add B2B collaboration users to Azure Active Directory?

Information workers can use the [Application Access Panel](http://myapps.microsoft.com) to add B2B collaboration users to groups and applications that they are administer.

## Information workers adding B2B collaboration users to an application
Assign B2B collaboration users to a app as an information worker in a partner organization, as shown in the following video:

  >[!VIDEO https://channel9.msdn.com/Blogs/Azure/information-worker-assign-to-apps]

  If this video does not appear embedded, you can reach it [here](https://channel9.msdn.com/Blogs/Azure/information-worker-assign-to-apps).

## Information workers adding B2B collaboration users to a group

Information workers can similarly add B2B collaboration users to an assigned group that is enabled for self-service group management.
> [!NOTE]
You cannot add B2B collaboration users to a dynamic group or to a group that is synced with on-premises Active Directory.

## Add without invitation

If the inviter belongs to a role that has enumeration privileges in the directory of the partner organization, from which he or she is adding users, the invited users are added into the inviting organization without needing invitations.

This is the scenario in which this is most useful:
1. A user in the host organization (for example, WoodGrove) invites one user from the partner organization (for example, Sam@litware.com) as Guest.
2. The admin in the host organization sets up policies that allow Sam to identify and add other users from the partner organization (Litware).
4. Now Sam can add other users from Litware to the WoodGrove directory, groups or applications without needing invitations to be redeemed. If Sam has the appropriate enumeration privileges in Litware, this happens automatically.


* [What is Azure AD B2B collaboration?](active-directory-b2b-what-is-azure-ad-b2b.md)
* [How do Azure Active Directory admins add B2B collaboration users?](active-directory-b2b-admin-add-users.md)
* [The elements of the B2B collaboration invitation email](active-directory-b2b-invitation-email.md)
* [B2B collaboration invitation redemption](active-directory-b2b-redemption-experience.md)
* [Azure AD B2B collaboration licensing](active-directory-b2b-licensing.md)
* [Troubleshooting Azure Active Directory B2B collaboration](active-directory-b2b-troubleshooting.md)
* [Azure Active Directory B2B collaboration frequently-asked questions (FAQ)](active-directory-b2b-faq.md)
* [Azure Active Directory B2B collaboration API and customization](active-directory-b2b-api.md)
* [Multi-factor authentication for B2B collaboration users](active-directory-b2b-mfa-instructions.md)
* [Article Index for Application Management in Azure Active Directory](active-directory-apps-index.md)
