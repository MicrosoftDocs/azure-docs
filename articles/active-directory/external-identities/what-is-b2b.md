---
title: What is B2B collaboration in Azure Active Directory?
description: Azure Active Directory B2B collaboration supports guest user access so you can securely share resources and collaborate with external partners.

services: active-directory
ms.service: active-directory
ms.subservice: B2B
ms.topic: overview
ms.date: 08/05/2020

ms.author: mimart
author: msmimart
manager: celestedg
ms.reviewer: mal
ms.custom: "it-pro, seo-update-azuread-jan"
ms.collection: M365-identity-device-management
---

# What is guest user access in Azure Active Directory B2B?

Azure Active Directory (Azure AD) business-to-business (B2B) collaboration is a feature within External Identities that lets you invite guest users to collaborate with your organization. With B2B collaboration, you can securely share your company's applications and services with guest users from any other organization, while maintaining control over your own corporate data. Work safely and securely with external partners, large or small, even if they don't have Azure AD or an IT department. A simple invitation and redemption process lets partners use their own credentials to access your company's resources. Developers can use Azure AD business-to-business APIs to customize the invitation process or write applications like self-service sign-up portals. For licensing and pricing information related to guest users, refer to [Azure Active Directory pricing](https://azure.microsoft.com/pricing/details/active-directory/).  

   > [!IMPORTANT]
   > **Starting March 31, 2021**, Microsoft will no longer support the redemption of invitations by creating unmanaged Azure AD accounts and tenants for B2B collaboration scenarios. In preparation, we encourage customers to opt into [email one-time passcode authentication](one-time-passcode.md). We welcome your feedback on this public preview feature and are excited to create even more ways to collaborate.

## Collaborate with any partner using their identities

With Azure AD B2B, the partner uses their own identity management solution, so there is no external administrative overhead for your organization. Guest users sign in to your apps and services with their own work, school, or social identities.

- The partner uses their own identities and credentials; Azure AD is not required.
- You don't need to manage external accounts or passwords.
- You don't need to sync accounts or manage account lifecycles.  

## Easily invite guest users from the Azure AD portal

As an administrator, you can easily add guest users to your organization in the Azure portal.

- [Create a new guest user](b2b-quickstart-add-guest-users-portal.md) in Azure AD, similar to how you'd add a new user.
- Assign guest users to apps or groups.
- Send an invitation email that contains a redemption link, or send a direct link to an app you want to share.

![Screenshot showing the New Guest User invitation entry page](media/what-is-b2b/add-a-b2b-user-to-azure-portal.png)

- Guest users follow a few simple [redemption steps](redemption-experience.md) to sign in.

![Screenshot showing the Review permissions page](media/what-is-b2b/consentscreen.png)


## Use policies to securely share your apps and services

You can use authorization policies to protect your corporate content. Conditional Access policies, such as multi-factor authentication, can be enforced:

- At the tenant level.
- At the application level.
- For specific guest users to protect corporate apps and data.

![Screenshot showing the Conditional Access option](media/what-is-b2b/tutorial-mfa-policy-2.png)



## Let application and group owners manage their own guest users

You can delegate guest user management to application owners so that they can add guest users directly to any application they want to share, whether it's a Microsoft application or not.

- Administrators set up self-service app and group management.
- Non-administrators use their [Access Panel](https://myapps.microsoft.com) to add guest users to applications or groups.

![Screenshot showing the Access panel for a guest user](media/what-is-b2b/access-panel-manage-app.png)

## Customize the onboarding experience for B2B guest users

Bring your external partners on board in ways customized to your organization's needs.

- Use [Azure AD entitlement management](https://docs.microsoft.com/azure/active-directory/governance/entitlement-management-overview) to configure policies that [manage access for external users](https://docs.microsoft.com/azure/active-directory/governance/entitlement-management-external-users#how-access-works-for-external-users).
- Use the [B2B collaboration invitation APIs](https://developer.microsoft.com/graph/docs/api-reference/v1.0/resources/invitation) to customize your onboarding experiences.

## Integrate with Identity providers

Azure AD supports external identity providers like Facebook, Microsoft accounts, Google, or enterprise identity providers. You can set up federation with identity providers so your external users can sign in with their existing social or enterprise accounts instead of creating a new account just for your application. Learn more about identity providers for External Identities.

![Screenshot showing the Identity providers page](media/what-is-b2b/identity-providers.png)


## Create a self-service sign-up user flow (Preview)

With a self-service sign-up user flow, you can create a sign-up experience for external users who want to access your apps. As part of the sign-up flow, you can provide options for different social or enterprise identity providers, and collect information about the user. Learn about [self-service sign-up and how to set it up](self-service-sign-up-overview.md).

You can also use [API connectors](api-connectors-overview.md) to integrate your self-service sign-up user flows with external cloud systems. You can connect with custom approval workflows, perform identity verification, validate user-provided information, and more.

![Screenshot showing the user flows page](media/what-is-b2b/self-service-sign-up-user-flow-overview.png)
<!--TODO: Add screenshot with API connectors -->

## Next steps

- [Licensing guidance for Azure AD B2B collaboration](licensing-guidance.md)
- [Add B2B collaboration guest users in the portal](add-users-administrator.md)
- [Understand the invitation redemption process](redemption-experience.md)
