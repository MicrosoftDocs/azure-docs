---
title: Self-service sign-up portal for B2B collaboration - Azure AD
description: Azure Active Directory B2B collaboration supports your cross-company relationships by enabling business partners to selectively access your corporate applications

services: active-directory
ms.service: active-directory
ms.subservice: B2B
ms.topic: sample
ms.date: 02/12/2020

ms.author: mimart
author: msmimart
manager: celestedg
ms.reviewer: mal

ms.collection: M365-identity-device-management
---

# Self-service for Azure AD B2B collaboration sign-up

Customers can do a lot with the built-in features that are exposed through the [Azure portal](https://portal.azure.com) and the [Application Access Panel](https://myapps.microsoft.com) for end users. However, you might need to customize the onboarding workflow for B2B users to fit your organization’s needs.

## Azure AD entitlement management for B2B guest user sign-up

As an inviting organization, you might not know ahead of time who the individual external collaborators are who need access to your resources. You need a way for users from partner companies to sign themselves up with policies that you control. If you want to enable users from other organizations to request access, and upon approval be provisioned with guest accounts and assigned to groups, apps and SharePoint Online sites, you can use [Azure AD entitlement management](https://docs.microsoft.com/azure/active-directory/governance/entitlement-management-overview) to configure policies that [manage access for external users](https://docs.microsoft.com/azure/active-directory/governance/entitlement-management-external-users#how-access-works-for-external-users).

## Azure Active Directory B2B invitation API

Organizations can use the [Microsoft Graph invitation manager API](https://docs.microsoft.com/graph/api/resources/invitation?view=graph-rest-1.0) to build their own onboarding experiences for B2B guest users. When you want to offer self-service B2B guest user sign-up, we recommend that you use [Azure AD entitlement management](https://docs.microsoft.com/azure/active-directory/governance/entitlement-management-overview). But if you want to build your own experience, you can use the [create invitation API](https://docs.microsoft.com/graph/api/invitation-post?view=graph-rest-1.0&tabs=http) to automatically send your customized invitation email directly to the B2B user, for example. Or your app can use the inviteRedeemUrl returned in the creation response to craft your own invitation (through your communication mechanism of choice) to the invited user.

## Next steps

* [What is Azure AD B2B collaboration?](what-is-b2b.md)
* [Azure AD B2B collaboration licensing](licensing-guidance.md)
* [Azure Active Directory B2B collaboration frequently asked questions (FAQ)](faq.md)
