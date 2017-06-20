---
title: Self-service sign-up portal for Azure Active Directory B2B collaboration | Microsoft Docs
description: Azure Active Directory B2B collaboration supports your cross-company relationships by enabling business partners to selectively access your corporate applications
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
ms.date: 04/11/2017
ms.author: sasubram

---


# Self-service sign-up portal for Azure AD B2B collaboration

Customers can do a lot with the built-in product capabilities that are exposed through our IT admin experiences in the [Azure portal](https://portal.azure.com)
and our [Application Access Panel](https://myapps.microsoft.com) for non-admins. But we are also aware that businesses need to customize the onboarding workflow for B2B users to fit their organization’s needs. They can do that with [our API](https://developer.microsoft.com/graph/docs/api-reference/v1.0/resources/invitation).

In discussing this with many of our customers, we saw one common need rise up above all others. This was the case where the inviting organization may not know (or want to know) ahead of time who the individual external collaborators are that needed access to their resources. They wanted a way where users from partner companies can self-sign-up with a set of policies that the inviting organization controlled. This is possible through our APIs – so we published a project on Github that did just that: [sample Github project](https://github.com/Azure/active-directory-dotnet-graphapi-b2bportal-web).

Our Github project demonstrates how organizations can use our APIs, and provide a policy based, self-service sign-up capability for their trusted partners, with rules that determine which apps they should get access to. This way, partner users can get access to the right resources when they need it, securely, but without anyone in the inviting organization having to manually onboard them. You can easily deploy the project with a click of a button into an Azure subscription of your choice. Give it a whirl!

## As-is code

Remember that this code is made available as a sample to demonstrate usage of the Azure Active Directory B2B Invitation API. It should be customized by your dev team or a partner, and should be reviewed before being deployed in a production scenario.

## Next steps

Browse our other articles on Azure AD B2B collaboration:
* [What is Azure AD B2B collaboration?](active-directory-b2b-what-is-azure-ad-b2b.md)
* [How do Azure Active Directory admins add B2B collaboration users?](active-directory-b2b-admin-add-users.md)
* [How do information workers add B2B collaboration users?](active-directory-b2b-iw-add-users.md)
* [The elements of the B2B collaboration invitation email](active-directory-b2b-invitation-email.md)
* [B2B collaboration invitation redemption](active-directory-b2b-redemption-experience.md)
* [Azure AD B2B collaboration licensing](active-directory-b2b-licensing.md)
* [Troubleshooting Azure Active Directory B2B collaboration](active-directory-b2b-troubleshooting.md)
* [Azure Active Directory B2B collaboration frequently asked questions (FAQ)](active-directory-b2b-faq.md)
* [Multi-factor authentication for B2B collaboration users](active-directory-b2b-mfa-instructions.md)
* [Add B2B collaboration users without an invitation](active-directory-b2b-add-user-without-invite.md)
* [Article Index for Application Management in Azure Active Directory](active-directory-apps-index.md)