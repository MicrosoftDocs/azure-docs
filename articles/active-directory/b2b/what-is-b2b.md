---
title: What is B2B collaboration in Azure Active Directory?
description: Azure Active Directory B2B collaboration supports guest user access so you can securely share resources and collaborate with external partners.

services: active-directory
ms.service: active-directory
ms.subservice: B2B
ms.topic: overview
ms.date: 05/19/2020

ms.author: mimart
author: msmimart
manager: celestedg
ms.reviewer: mal
ms.custom: "it-pro, seo-update-azuread-jan"
ms.collection: M365-identity-device-management
---

# What is guest user access in Azure Active Directory B2B?

Azure Active Directory (Azure AD) business-to-business (B2B) collaboration lets you securely share your company's applications and services with guest users from any other organization, while maintaining control over your own corporate data. Work safely and securely with external partners, large or small, even if they don't have Azure AD or an IT department. A simple invitation and redemption process lets partners use their own credentials to access your company's resources. Developers can use Azure AD business-to-business APIs to customize the invitation process or write applications like self-service sign-up portals.

Watch the video learn how you can securely collaborate with guest users by inviting them to sign in to your company's apps and services using their own identities.

The following video provides a useful overview.

>[!VIDEO https://www.youtube.com/embed/AhwrweCBdsc]

   > [!IMPORTANT]
   > **Starting March 31, 2021**, Microsoft will no longer support the redemption of invitations by creating unmanaged Azure AD accounts and tenants for B2B collaboration scenarios. In preparation, we encourage customers to opt into [email one-time passcode authentication](one-time-passcode.md). We welcome your feedback on this public preview feature and are excited to create even more ways to collaborate.

## Collaborate with any partner using their identities

With Azure AD B2B, the partner uses their own identity management solution, so there is no external administrative overhead for your organization.

- The partner uses their own identities and credentials; Azure AD is not required.
- You don't need to manage external accounts or passwords.
- You don't need to sync accounts or manage account lifecycles.  

![Screenshot showing the Add members page](media/what-is-b2b/add-member.png)

## Invite guest users with a simple invitation and redemption process

Guest users sign in to your apps and services with their own work, school, or social identities. If the guest user doesn't have a Microsoft account or an Azure AD account, one is created for them when they redeem their invitation. 

- Invite guest users using the email identity of their choice.
- Send a direct link to an app, or send an invitation to the guest user's own Access Panel.
- Guest users follow a few simple redemption steps to sign in.

![Screenshot showing the Review permissions page](media/what-is-b2b/consentscreen.png)

## Use policies to securely share your apps and services

You can use authorization policies to protect your corporate content. Conditional Access policies, such as multi-factor authentication, can be enforced:

- At the tenant level.
- At the application level.
- For specific guest users to protect corporate apps and data.

![Screenshot showing the Conditional Access option](media/what-is-b2b/tutorial-mfa-policy-2.png)


## Easily add guest users in the Azure AD portal

As an administrator, you can easily add guest users to your organization in the Azure portal.

- Create a new guest user in Azure AD, similar to how you'd add a new user.
- The guest user immediately receives a customizable invitation that lets them sign in to their Access Panel.
- Guest users in the directory can be assigned to apps or groups.  

![Screenshot showing the New Guest User invitation entry page](media/what-is-b2b/add-a-b2b-user-to-azure-portal.png)

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
<!-- You can also use [API connectors](api-connectors-overview.md) to integrate your user flows with external systems, for example user approval systems, user input validation systems, or custom business logic. -->

![Screenshot showing the user flows page](media/what-is-b2b/self-service-sign-up-user-flow-overview.png)

## Next steps

- [Licensing guidance for Azure AD B2B collaboration](licensing-guidance.md)
- [Add B2B collaboration guest users in the portal](add-users-administrator.md)
- [Understand the invitation redemption process](redemption-experience.md)
- And, as always, connect with the product team for any feedback, discussions, and suggestions through our [Microsoft Tech Community](https://techcommunity.microsoft.com/t5/Azure-Active-Directory-B2B/bd-p/AzureAD_B2b).
