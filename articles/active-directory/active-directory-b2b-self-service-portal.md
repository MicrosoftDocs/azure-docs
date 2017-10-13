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
ms.date: 05/24/2017
ms.author: sasubram

---


# Self-service portal for Azure AD B2B collaboration sign-up

Customers can do a lot with the built-in features that are exposed through our IT admin [Azure portal](https://portal.azure.com) and our [Application Access Panel](https://myapps.microsoft.com) for end users. But we are also aware that businesses need to customize the onboarding workflow for B2B users to fit their organization’s needs. They can do that with [our API](https://developer.microsoft.com/graph/docs/api-reference/v1.0/resources/invitation).

In discussions with our customers, we see one common need rise up above all others. The inviting organization may not know ahead of time who the individual external collaborators are who need access to their resources. They wanted a way for users from partner companies to  sign themselves up with a set of policies that the inviting organization controls. This scenario is possible through our APIs,  so we published a project on Github that did just that: [sample Github project](https://github.com/Azure/active-directory-dotnet-graphapi-b2bportal-web).

Our Github project demonstrates how organizations can use our APIs, and provide a policy-based, self-service sign-up capability for their trusted partners, with rules that determine the apps they can access. Partner users can get access to resources when they need them, securely, without requiring the inviting organization to manually onboard them. You can easily deploy the project into an Azure subscription of your choice.

## As-is code

Remember that this code is made available as a sample to demonstrate usage of the Azure Active Directory B2B invitation API. It should be customized by your dev team or a partner, and should be reviewed before being deployed in a production scenario.

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