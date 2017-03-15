---
title: What is Azure Active Directory B2B collaboration preview? | Microsoft Docs
description: Azure Active Directory B2B collaboration supports your cross-company relationships by enabling business partners to selectively access your corporate applications
services: active-directory
documentationcenter: ''
author: sasubram
manager: femila
editor: ''
tags: ''

ms.assetid: 1464387b-ee8b-4c7c-94b3-2c5567224c27
ms.service: active-directory
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: identity
ms.date: 02/18/2017
ms.author: sasubram

---

# What is Azure AD B2B collaboration preview?

Azure AD B2B collaboration capabilities enable IT pros and information workers to work closely with their partners in any other organization on the planet. They can provide access to documents, resources and applications while maintaining complete control over their internal data. Developers can use the Azure AD business-to-business APIs to write applications that bring two organizations together in a secure way that appears seamless to information workers and is intuitive for them to navigate.

Azure AD B2B collaboration capabilities enable organizations of all sizes and in all industries, regardless of their compliance and governance requirements, to work easily and securely with collaborators around the world. That is the goal of this B2B collaboration Public Preview Refresh.

## How does it work?

In the current preview release, to establish a relationship with an organization, IT pros and information workers can add users from another org one or a few at a time through the portal or the Invitation Manager API. Admins can use the new portal experiences in the Azure portal (https://portal.azure.com) and PowerShell for this. And information workers can use the Access Panel experiences in http://myapps.microsoft.com. Developers can create applications using the Azure AD B2B invitation manager API to add B2B collaboration users and customize the invitation and onboarding workflows.

B2B collaboration users are typically brought on board through an invitation + redemption process. Here's how it works.

1. John Doe from WoodGrove wants to add Sam Oogle using his gmail address (gsamoogle@gmail.com)

2. John goes to the WoodGrove portal (portal.azure.com) or access panel (myapps.microsoft.com), signs in and adds the user to the WoodGrove directory, or group or application.

3. John specifies a custom invitation email to send to Sam.

4. As soon as he is done, the following user will be created in the WoodGrove AD (screenshot is from the admin UX in portal.azure.com):

  ![user is added](media/active-directory-b2b-what-is-azure-ad-b2b/user-is-added.png)

5. As soon as we're done adding this user, Azure AD will send out an invitation email to Sam:

  ![invitation mail sent to Sam](media/active-directory-b2b-what-is-azure-ad-b2b/invitation-mail-sent-to-sam.png)

6. Now Sam selects **Get Started** and signs in. At this point, Azure AD updates his user object in the directory with information from his token (screenshot is from the admin UX in [the Azure portal](https://portal.azure.com)):

  ![user profile is populated](media/active-directory-b2b-what-is-azure-ad-b2b/user-profile-is-populated.png)

7. Now that Sam's invitation has been redeemed, he can get access to WoodGrove resources and of course can be managed, like any other user in the directory, by the administrator (screenshot is from the admin UX in [the Azure portal](https://portal.azure.com)):

  ![Sam is now a user in Azure AD](media/active-directory-b2b-what-is-azure-ad-b2b/sam-now-user-in-azure-ad.png)

## Public Preview features
You have been using the B2B collaboration capabilities that we had in public preview and have been giving us a ton of excellent feedback. And we've been listening! We're packaging all the improvements we have made in this Public Preview Refresh. These are the key features in B2B collaboration Public Preview Refresh:

1. Admin UX enhancements to the B2B experience
  - coming to https://portal.azure.com
  - Ability for admins to invite B2B users to the directory, or any group or application

2. B2B collaboration self-service invitation capabilities for information workers in the Access Panel: https://myapps.microsoft.com. Information workers can invite B2B collaboration users to any self-service group or application that they manage.

3. You can now invite a user with any email address. Whether the user has an Office365 or on-premises Microsoft Exchange email address, an outlook.com email address, any social email address (Gmail, Yahoo, and so on), they can now seamlessly access the invited organization with inline, lightweight creation of an Azure AD account or a Microsoft account.

4. Benefit from a professional, tenant-branded invitation email.

5. Extensive ability to customize onboarding using the invitation APIs.

6. Multi-factor authentication for B2B collaboration users in the inviting organization.

7. Ability to delegate invitations to non-administrators.

8. PowerShell support for B2B collaboration.

9. Auditing and reporting capabilities.

## Next steps

Browse our other articles on Azure AD B2B collaboration:

* [How do Azure Active Directory admins add B2B collaboration users?](active-directory-b2b-admin-add-users.md)
* [How do information workers add B2B collaboration users?](active-directory-b2b-iw-add-users.md)
* [The elements of the B2B collaboration invitation email](active-directory-b2b-invitation-email.md)
* [B2B collaboration invitation redemption](active-directory-b2b-redemption-experience.md)
* [Azure AD B2B collaboration licensing](active-directory-b2b-licensing.md)
* [Troubleshooting Azure Active Directory B2B collaboration](active-directory-b2b-troubleshooting.md)
* [Azure Active Directory B2B collaboration frequently-asked questions (FAQ)](active-directory-b2b-faq.md)
* [Azure Active Directory B2B collaboration API and customization](active-directory-b2b-api.md)
* [Multi-factor authentication for B2B collaboration users](active-directory-b2b-mfa-instructions.md)
* [Add B2B collaboration users without an invitation](active-directory-b2b-add-user-without-invite.md)

* [B2B collaboration user auditing and reporting](active-directory-b2b-auditing-and-reporting.md)
* [Article Index for Application Management in Azure Active Directory](active-directory-apps-index.md)
