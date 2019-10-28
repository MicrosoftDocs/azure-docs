---
title: Self-service sign-up portal for B2B collaboration - Azure Active Directory | Microsoft Docs
description: Azure Active Directory B2B collaboration supports your cross-company relationships by enabling business partners to selectively access your corporate applications

services: active-directory
ms.service: active-directory
ms.subservice: B2B
ms.topic: sample
ms.date: 05/08/2018

ms.author: mimart
author: msmimart
manager: celestedg
ms.reviewer: mal

ms.collection: M365-identity-device-management
---

# Self-service portal for Azure AD B2B collaboration sign-up

Customers can do a lot with the built-in features that are exposed through the [Azure portal](https://portal.azure.com) and the [Application Access Panel](https://myapps.microsoft.com) for end users. However, you might need to customize the onboarding workflow for B2B users to fit your organization’s needs. You can do that with [the invitation API](https://developer.microsoft.com/graph/docs/api-reference/v1.0/resources/invitation).

As an inviting organization, you may not know ahead of time who the individual external collaborators are who need access to your resources. You need a way for users from partner companies to sign themselves up with a set of policies that you as the inviting organization controls. This scenario is possible through the APIs. There's a [sample project on GitHub](https://github.com/Azure/active-directory-dotnet-graphapi-b2bportal-web) that does just that.

This GitHub project shows how organizations can use the APIs to provide a policy-based, self-service sign-up capability for your trusted partners, with rules that determine the apps they can access. Partner users can get access to resources when they need them. They can do this securely, without requiring the inviting organization to manually onboard them. You can easily deploy the project into an Azure subscription of your choice.

## As-is code

This code is made available as a sample to demonstrate usage of the Azure Active Directory B2B invitation API. It should be customized by your development team or a partner, and should be reviewed before you deploy it in a production scenario.

## Next steps

* [What is Azure AD B2B collaboration?](what-is-b2b.md)
* [Azure AD B2B collaboration licensing](licensing-guidance.md)
* [Azure Active Directory B2B collaboration frequently asked questions (FAQ)](faq.md)
